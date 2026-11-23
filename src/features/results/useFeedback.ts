import { useEffect, useState } from 'react';
import type { Attempt } from '@/domain/attempt';
import { getCriteria } from '@/domain/criteria';
import { GOAL_OPTIONS } from '@/domain/goals';
import { getTaskType } from '@/domain/tasks/catalog';
import { isWritingTask } from '@/domain/tasks/types';
import { isScorable } from '@/domain/scoring/sufficiency';
import { getFeedbackEngine, type FeedbackEngineStore, type FeedbackRun } from '@/services/ai/feedbackEngine';
import { buildFeedbackPrompt, buildModelAnswerPrompt } from '@/services/ai/feedbackPrompt';
import { ModelUnavailableError } from '@/services/ai/modelStore';

export type FeedbackOutcome =
  /** Full feedback on the learner's answer. */
  | { kind: 'ai'; run: FeedbackRun }
  /** Answer too short to score: a model answer written from scratch instead. */
  | { kind: 'sample'; answer: string }
  | { kind: 'code'; reason: 'light-mode' | 'error'; message?: string };

export interface FeedbackProgress {
  phase: 'starting' | 'loading-model' | 'writing' | 'done';
  /** Model download progress, 0 to 1. */
  modelProgress: number | null;
  /** Characters of feedback written so far. */
  written: number;
}

interface Job {
  promise: Promise<FeedbackOutcome>;
  progress: FeedbackProgress;
  listeners: Set<(progress: FeedbackProgress) => void>;
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

function wordCount(attempt: Attempt): number {
  return attempt.metrics.wordCount;
}

/** Full feedback for a scorable answer, or a fresh model answer for one that's too short. */
async function runFor(attempt: Attempt, store: FeedbackEngineStore, onText: (soFar: string) => void): Promise<FeedbackOutcome> {
  if (!isScorable(attempt.skill, wordCount(attempt))) {
    const task = getTaskType(attempt.taskTypeId);
    const length = task && isWritingTask(task)
      ? `${task.wordRange.min} to ${task.wordRange.max} words`
      : `about ${attempt.skill === 'speaking' ? Math.round(attempt.metrics.answerSeconds * 2) : 180} words, enough to fill the speaking time`;
    const { system, user } = buildModelAnswerPrompt({
      taskTitle: attempt.taskTitle,
      promptText: attempt.promptText,
      goal: attempt.goal,
      goalLabel: goalLabel(attempt.goal),
      spoken: attempt.skill === 'speaking',
      length,
    });
    const run = await store.generateModelAnswer(system, user, onText);
    return { kind: 'sample', answer: run.answer };
  }

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
  const run = await store.generate(system, user, onText);
  return { kind: 'ai', run };
}

function startJob(attempt: Attempt): Job {
  const job: Job = {
    progress: { phase: 'starting', modelProgress: null, written: 0 },
    listeners: new Set(),
    promise: Promise.resolve(null as never),
  };
  const update = (next: Partial<FeedbackProgress>) => {
    job.progress = { ...job.progress, ...next };
    job.listeners.forEach((listener) => listener(job.progress));
  };

  job.promise = (async (): Promise<FeedbackOutcome> => {
    try {
      const store = await getFeedbackEngine();
      const unsubscribe = store.subscribe(() => {
        const status = store.getStatus();
        if (status.state === 'loading') update({ phase: 'loading-model', modelProgress: status.progress });
      });
      try {
        await store.ensureLoaded();
      } finally {
        unsubscribe();
      }
      update({ phase: 'writing' });
      return await runFor(attempt, store, (soFar) => update({ written: soFar.length }));
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
      // Keep only the latest answer's feedback in memory.
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
