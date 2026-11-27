import { describe, expect, it, vi } from 'vitest';
import { feedbackJobFor, type FeedbackDeps, type Job } from '../src/features/results/useFeedback';
import { FeedbackEngineStore } from '../src/services/ai/feedbackEngine';
import { measureWriting } from '../src/domain/measure/writingMetrics';
import type { SpeakingAttempt, WritingAttempt } from '../src/domain/attempt';
import type { ModelPlan } from '../src/services/device/tier';
import type { FeedbackModel } from '../src/services/ai/types';

const SCORES_REPLY = JSON.stringify({
  checklist: [{ item: 'Says why', met: true }],
  scores: { content: 8, vocabulary: 7, delivery: 7, task: 9 },
  tips: ['Add the date', 'Say what you want'],
});
const ANSWER_REPLY = 'Dear Sir, I am writing to ask for a full refund.';
const STATS = { promptTokens: 1, completionTokens: 1, firstTokenMs: 1, totalMs: 1, tokensPerSecond: 1 };
const LONG_TEXT = Array.from({ length: 12 }, (_, i) => `I bought a kettle on day ${i} and it broke.`).join(' ');

const plan = (feedbackModel: string | null): ModelPlan => ({
  tier: feedbackModel ? 'mid' : 'no-webgpu',
  whisperModel: 'Xenova/whisper-base.en',
  whisperDevice: 'webgpu',
  feedbackModel,
  keepWhisperLoaded: true,
  reason: '',
});

let nextId = 0;

function writing(text: string): WritingAttempt {
  nextId += 1;
  return {
    skill: 'writing', id: `job-test-${nextId}`, moduleId: 'module-1', taskTypeId: 'writing-1',
    taskTitle: 'Writing task 1: Email', promptText: 'Write to the store.', checklist: ['Says why'], goal: 9, goalChosen: true,
    text, issues: [],
    metrics: measureWriting({ text, wordRange: { min: 150, max: 200 }, grammarIssues: 0, emailTone: 'formal' }),
  };
}

/** A gate a fake model waits on, so a test can act while the model is busy. */
function gate() {
  let open = () => {};
  const opened = new Promise<void>((resolve) => { open = resolve; });
  return { opened, open };
}

/** A store with a fake model. Replies come in order; `log` records what the model was asked to do. */
function setup(options: { replies?: string[]; load?: Promise<void>; generating?: Promise<void>; light?: boolean } = {}) {
  const replies = [...(options.replies ?? [SCORES_REPLY, ANSWER_REPLY])];
  const log: string[] = [];
  const prompts: string[] = [];
  const model: FeedbackModel = {
    async load() { log.push('load'); await options.load; return { elapsedMs: 1 }; },
    async complete(_system, user) {
      log.push('generate');
      prompts.push(user);
      await options.generating;
      return { text: replies.shift() ?? '', stats: STATS };
    },
    interrupt() { log.push('interrupt'); },
    async reset() {},
    async unload() {},
  };
  const store = new FeedbackEngineStore(async () => plan(options.light ? null : 'm'), () => (options.light ? null : model));
  const deps: FeedbackDeps = { getEngine: vi.fn(async () => store) };
  return { deps, log, prompts };
}

/** Lets queued promises and timers run until the check passes. */
async function until(check: () => boolean) {
  for (let i = 0; i < 50 && !check(); i += 1) await new Promise((resolve) => setTimeout(resolve, 0));
  expect(check()).toBe(true);
}

const answerDone = (job: Job) => () => job.progress.answer.state === 'done';

describe('feedback job cache', () => {
  it('shares one job per answer, and stops the old one when a new answer arrives', async () => {
    const { deps } = setup();
    const first = writing(LONG_TEXT);
    const job = feedbackJobFor(first, deps);
    expect(feedbackJobFor(first, deps)).toBe(job);
    expect(deps.getEngine).toHaveBeenCalledTimes(1);

    const cancel = vi.spyOn(job, 'cancel');
    const next = feedbackJobFor(writing(LONG_TEXT), deps);
    expect(next).not.toBe(job);
    expect(cancel).toHaveBeenCalledTimes(1);
  });
});

describe('feedback job paths', () => {
  it('scores the answer, then writes the improved answer using the tips', async () => {
    const { deps, prompts } = setup();
    const job = feedbackJobFor(writing(LONG_TEXT), deps);
    const outcome = await job.promise;
    expect(outcome.kind).toBe('ai');
    await until(answerDone(job));
    expect(prompts).toHaveLength(2);
    expect(prompts[1]).toContain('Fixes to apply: Add the date. Say what you want.');
    expect(job.progress.answer.text).toBe(ANSWER_REPLY);
    expect(job.progress.perf?.scoring).not.toBeNull();
    expect(job.progress.perf?.answer).not.toBeNull();
  });

  it('writes a model answer from scratch when a too-short answer has no hand-written sample', async () => {
    const { deps, prompts } = setup({ replies: [ANSWER_REPLY] });
    const job = feedbackJobFor(writing('Dear Sir, refund please.'), deps);
    expect(await job.promise).toEqual({ kind: 'sample' });
    await until(answerDone(job));
    expect(prompts).toHaveLength(1);
    expect(prompts[0]).not.toContain('Fixes to apply');
    expect(job.progress.perf?.scoring).toBeNull();
  });

  it('shows the hand-written sample for a too-short answer without loading the model', async () => {
    const { deps } = setup();
    nextId += 1;
    const attempt = {
      skill: 'speaking', id: `job-test-${nextId}`, moduleId: 'module-1', taskTypeId: 'speaking-1',
      taskTitle: 'Speaking task 1', promptText: 'Give advice.', checklist: [], goal: 9, goalChosen: true,
      transcript: 'Join a club.', words: [], recordedSeconds: 5, transcribeMs: 1,
      metrics: { wordCount: 3, answerSeconds: 90 },
    } as unknown as SpeakingAttempt;
    const job = feedbackJobFor(attempt, deps);
    expect(await job.promise).toEqual({ kind: 'sample' });
    expect(deps.getEngine).not.toHaveBeenCalled();
    expect(job.progress.phase).toBe('done');
    expect(job.progress.answer.state).toBe('off');
  });

  it('falls back to code-only feedback in light mode', async () => {
    const { deps } = setup({ light: true });
    const job = feedbackJobFor(writing(LONG_TEXT), deps);
    expect(await job.promise).toEqual({ kind: 'code', reason: 'light-mode' });
    expect(job.progress.phase).toBe('done');
  });
});

describe('cancelling a feedback job', () => {
  it('stops scoring mid-reply and never starts step 2', async () => {
    const generating = gate();
    const { deps, log } = setup({ generating: generating.opened });
    const job = feedbackJobFor(writing(LONG_TEXT), deps);
    await until(() => log.includes('generate'));
    job.cancel();
    expect(log).toContain('interrupt');
    generating.open();
    const outcome = await job.promise;
    expect(outcome).toMatchObject({ kind: 'code', reason: 'error' });
    expect(log.filter((entry) => entry === 'generate')).toHaveLength(1);
    // Nothing updates the screen after a cancel.
    expect(job.progress.phase).toBe('scoring');
  });
});
