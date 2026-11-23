import { useEffect, useState } from 'react';
import type { Attempt } from '@/domain/attempt';
import { getCriteria } from '@/domain/criteria';
import { GOAL_OPTIONS } from '@/domain/goals';
import { getTaskType } from '@/domain/tasks/catalog';
import { isWritingTask } from '@/domain/tasks/types';
import { isScorable } from '@/domain/scoring/sufficiency';
import { GenerationInterruptedError, getFeedbackEngine, type FeedbackEngineStore, type FeedbackRun } from '@/services/ai/feedbackEngine';
import { answerTokenBudget, buildFeedbackPrompt, buildModelAnswerPrompt, buildRewritePrompt } from '@/services/ai/feedbackPrompt';
import { ModelUnavailableError } from '@/services/ai/modelStore';
import type { GenerationStats } from '@/services/ai/types';

/** Timing for one AI step. */
export interface StepPerf {
  firstTokenMs: number;
  tokensPerSecond: number;
  generateMs: number;
  outputTokens: number;
  inputTokens: number;
  attempts: number;
}

/** How fast the AI coach was on this device, for the results screen. */
export interface AiPerf {
  model: string | null;
  /** Time to load the model, or null if it was already loaded. */
  loadMs: number | null;
  /** Step 1: checklist, tips and scores. Null for answers too short to score. */
  scoring: StepPerf | null;
  /** Step 2: the improved or model answer, once it's done. */
  answer: StepPerf | null;
  /** From opening results to scores on screen. */
  scoresWaitMs: number | null;
  /** From opening results to the full answer on screen. */
  answerWaitMs: number | null;
}

export type FeedbackOutcome =
  /** Checklist, tips and scores from the AI coach. The improved answer follows in `progress.answer`. */
  | { kind: 'ai'; run: FeedbackRun }
  /** Answer too short to score: a model answer is written from scratch in `progress.answer`. */
  | { kind: 'sample' }
  | { kind: 'code'; reason: 'light-mode' | 'error'; message?: string };

/** The improved (or model) answer, which streams in after the scores. */
export interface AnswerStream {
  state: 'off' | 'waiting' | 'writing' | 'done' | 'failed';
  text: string;
}

export interface FeedbackProgress {
  phase: 'starting' | 'loading-model' | 'scoring' | 'done';
  /** Model download progress, 0 to 1. */
  modelProgress: number | null;
  /** Characters of the scoring reply written so far. */
  written: number;
  answer: AnswerStream;
  perf: AiPerf | null;
}

interface Job {
  promise: Promise<FeedbackOutcome>;
  progress: FeedbackProgress;
  listeners: Set<(progress: FeedbackProgress) => void>;
  /** Stops any AI work still running for this answer. */
  cancel: () => void;
}

/**
 * One feedback run per answer, shared by every render of the results screen,
 * so revisiting the screen (or React's dev double-mount) never runs the model twice.
 * Jobs live in memory only.
 */
const jobs = new Map<string, Job>();

/** Facts already measured in code, passed to the model so tips don't repeat them. */
function measuredFacts(attempt: Attempt): string[] {
  if (attempt.skill === 'speaking') {
    const m = attempt.metrics;
    return [
      `pace ${m.wordsPerMinute} words per minute`,
      `${m.longPauses.length} pauses over 2 seconds`,
      `${m.fillerCount} filler words`,
      `used ${Math.round(m.timeUsed * 100)}% of the time`,
    ];
  }
  const m = attempt.metrics;
  const facts = [`${m.wordCount} words`, `${m.paragraphs} paragraphs`, `${m.grammarIssues} spelling or grammar marks`];
  if (m.email) facts.push(m.email.hasGreeting ? 'has a greeting' : 'no greeting', m.email.hasClosing ? 'has a closing' : 'no closing');
  return facts;
}

function goalLabel(goal: number): string | undefined {
  return GOAL_OPTIONS.find((option) => option.level === goal)?.label.toLowerCase();
}

function answerText(attempt: Attempt): string {
  return attempt.skill === 'speaking' ? attempt.transcript : attempt.text;
}

function stepPerf(stats: GenerationStats, attempts: number): StepPerf {
  return {
    firstTokenMs: stats.firstTokenMs,
    tokensPerSecond: stats.tokensPerSecond,
    generateMs: stats.totalMs,
    outputTokens: stats.completionTokens,
    inputTokens: stats.promptTokens,
    attempts,
  };
}

/** Prompt and length cap for step 2: a rewrite of a scorable answer, or a model answer from scratch. */
function answerPrompt(attempt: Attempt, tips: string[] | null): { system: string; user: string; maxTokens: number } {
  const spoken = attempt.skill === 'speaking';
  if (tips) {
    const prompt = buildRewritePrompt({
      taskTitle: attempt.taskTitle, promptText: attempt.promptText, goal: attempt.goal, goalLabel: goalLabel(attempt.goal),
      answer: answerText(attempt), spoken, tips,
    });
    return { ...prompt, maxTokens: answerTokenBudget(attempt.metrics.wordCount) };
  }
  const task = getTaskType(attempt.taskTypeId);
  const targetWords = task && isWritingTask(task)
    ? task.wordRange.max
    : attempt.skill === 'speaking' ? Math.round(attempt.metrics.answerSeconds * 2) : 180;
  const length = task && isWritingTask(task)
    ? `${task.wordRange.min} to ${task.wordRange.max} words`
    : `about ${targetWords} words, enough to fill the speaking time`;
  const prompt = buildModelAnswerPrompt({
    taskTitle: attempt.taskTitle, promptText: attempt.promptText, goal: attempt.goal, goalLabel: goalLabel(attempt.goal), spoken, length,
  });
  return { ...prompt, maxTokens: answerTokenBudget(targetWords) };
}

function startJob(attempt: Attempt): Job {
  let cancelled = false;
  let store: FeedbackEngineStore | null = null;
  const job: Job = {
    progress: { phase: 'starting', modelProgress: null, written: 0, answer: { state: 'off', text: '' }, perf: null },
    listeners: new Set(),
    promise: Promise.resolve(null as never),
    cancel: () => {
      cancelled = true;
      store?.interrupt();
    },
  };
  const update = (next: Partial<FeedbackProgress>) => {
    if (cancelled) return;
    job.progress = { ...job.progress, ...next };
    job.listeners.forEach((listener) => listener(job.progress));
  };
  const updatePerf = (next: Partial<AiPerf>) => job.progress.perf && update({ perf: { ...job.progress.perf, ...next } });
  const startedAt = performance.now();

  /** Step 2: streams the answer onto the screen. Runs after the scores are shown. */
  const writeAnswer = async (engine: FeedbackEngineStore, tips: string[] | null) => {
    if (cancelled) return;
    const { system, user, maxTokens } = answerPrompt(attempt, tips);
    try {
      const run = await engine.writeText(system, user, maxTokens, (soFar) => update({ answer: { state: 'writing', text: soFar } }));
      update({ answer: { state: 'done', text: run.text } });
      updatePerf({ answer: stepPerf(run.stats, run.attempts), answerWaitMs: performance.now() - startedAt });
    } catch (error) {
      if (!(error instanceof GenerationInterruptedError)) update({ answer: { state: 'failed', text: '' } });
    }
  };

  job.promise = (async (): Promise<FeedbackOutcome> => {
    try {
      store = await getFeedbackEngine();
      const engine = store;
      const unsubscribe = engine.subscribe(() => {
        const status = engine.getStatus();
        if (status.state === 'loading') update({ phase: 'loading-model', modelProgress: status.progress });
      });
      const alreadyLoaded = engine.getStatus().state === 'ready';
      const loadStartedAt = performance.now();
      try {
        await engine.ensureLoaded();
      } finally {
        unsubscribe();
      }
      update({
        perf: { model: engine.getStatus().model, loadMs: alreadyLoaded ? null : performance.now() - loadStartedAt, scoring: null, answer: null, scoresWaitMs: null, answerWaitMs: null },
      });

      if (!isScorable(attempt.skill, attempt.metrics.wordCount)) {
        update({ answer: { state: 'waiting', text: '' } });
        void writeAnswer(engine, null);
        return { kind: 'sample' };
      }

      update({ phase: 'scoring' });
      const { system, user } = buildFeedbackPrompt({
        taskTitle: attempt.taskTitle,
        promptText: attempt.promptText,
        checklist: attempt.checklist,
        criteria: getCriteria(attempt.skill),
        goal: attempt.goal,
        goalLabel: goalLabel(attempt.goal),
        answer: answerText(attempt),
        spoken: attempt.skill === 'speaking',
        measured: measuredFacts(attempt),
      });
      const run = await engine.generate(system, user, (soFar) => update({ written: soFar.length }));
      updatePerf({ scoring: stepPerf(run.stats, run.attempts), scoresWaitMs: performance.now() - startedAt });
      update({ answer: { state: 'waiting', text: '' } });
      void writeAnswer(engine, run.reply.tips);
      return { kind: 'ai', run };
    } catch (error) {
      if (error instanceof ModelUnavailableError) return { kind: 'code', reason: 'light-mode' };
      return { kind: 'code', reason: 'error', message: error instanceof Error ? error.message : String(error) };
    } finally {
      update({ phase: 'done' });
    }
  })();
  return job;
}

export function useFeedback(attempt: Attempt | null) {
  const [outcome, setOutcome] = useState<FeedbackOutcome | null>(null);
  const [progress, setProgress] = useState<FeedbackProgress | null>(null);

  useEffect(() => {
    if (!attempt) return;
    let active = true;
    let job = jobs.get(attempt.id);
    if (!job) {
      // Keep only the latest answer's feedback in memory, and stop work on older ones.
      jobs.forEach((old) => old.cancel());
      jobs.clear();
      job = startJob(attempt);
      jobs.set(attempt.id, job);
    }
    const listener = (next: FeedbackProgress) => active && setProgress(next);
    job.listeners.add(listener);
    setProgress(job.progress);
    setOutcome(null);
    void job.promise.then((result) => active && setOutcome(result));
    const current = job;
    return () => {
      active = false;
      current.listeners.delete(listener);
    };
  }, [attempt]);

  return { outcome, progress };
}
