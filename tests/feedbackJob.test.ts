import { describe, expect, it, vi } from 'vitest';
import { loadModule } from '../src/content/modules';
import { STALL_MESSAGE, STALL_MS, STEP_LABELS, feedbackJobFor, stepStates, withStallTimeout, type Job } from '../src/features/results/useFeedback';
import { FeedbackEngineStore } from '../src/services/ai/feedbackEngine';
import { measureWriting } from '../src/domain/measure/writingMetrics';
import type { SpeakingAttempt, WritingAttempt } from '../src/domain/attempt';
import type { ModelPlan } from '../src/services/device/tier';
import type { FeedbackModel } from '../src/services/ai/types';

vi.mock('../src/content/modules', async (importOriginal) => {
  const real = await importOriginal<typeof import('../src/content/modules')>();
  return { ...real, loadModule: vi.fn(real.loadModule) };
});

const SCORES_REPLY = JSON.stringify({
  checklist: [{ item: 'Says why', met: true }],
  scores: { content_and_coherence: 8, vocabulary: 7, listenability_or_readability: 7, task_fulfillment: 9 },
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
function setup(options: { replies?: string[]; load?: Promise<void>; generating?: Promise<void>; light?: boolean; fail?: Error } = {}) {
  const replies = [...(options.replies ?? [SCORES_REPLY, ANSWER_REPLY])];
  const log: string[] = [];
  const prompts: string[] = [];
  const model: FeedbackModel = {
    async load() { log.push('load'); await options.load; return { elapsedMs: 1 }; },
    async complete(_system, user) {
      log.push('generate');
      prompts.push(user);
      await options.generating;
      if (options.fail) throw options.fail;
      return { text: replies.shift() ?? '', stats: STATS };
    },
    interrupt() { log.push('interrupt'); },
    async reset() {},
    async unload() {},
  };
  const store = new FeedbackEngineStore(async () => plan(options.light ? null : 'm'), () => (options.light ? null : model));
  const getEngine = vi.fn(async () => store);
  return { getEngine, log, prompts };
}

/** Lets queued promises and timers run until the check passes. */
async function until(check: () => boolean) {
  for (let i = 0; i < 50 && !check(); i += 1) await new Promise((resolve) => setTimeout(resolve, 0));
  expect(check()).toBe(true);
}

const answerDone = (job: Job) => () => job.progress.answer.state === 'done';

describe('feedback job cache', () => {
  it('shares one job per answer, and stops the old one when a new answer arrives', async () => {
    const { getEngine } = setup();
    const first = writing(LONG_TEXT);
    const job = feedbackJobFor(first, getEngine);
    expect(feedbackJobFor(first, getEngine)).toBe(job);
    expect(getEngine).toHaveBeenCalledTimes(1);

    const cancel = vi.spyOn(job, 'cancel');
    const next = feedbackJobFor(writing(LONG_TEXT), getEngine);
    expect(next).not.toBe(job);
    expect(cancel).toHaveBeenCalledTimes(1);
  });
});

describe('feedback job paths', () => {
  it('scores the answer, then writes the improved answer using the tips', async () => {
    const { getEngine, prompts } = setup();
    const job = feedbackJobFor(writing(LONG_TEXT), getEngine);
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
    const { getEngine, prompts } = setup({ replies: [ANSWER_REPLY] });
    const job = feedbackJobFor(writing('Dear Sir, refund please.'), getEngine);
    expect(await job.promise).toEqual({ kind: 'sample' });
    await until(answerDone(job));
    expect(prompts).toHaveLength(1);
    expect(prompts[0]).not.toContain('Fixes to apply');
    expect(job.progress.perf?.scoring).toBeNull();
  });

  it('shows the hand-written sample for a too-short answer without loading the model', async () => {
    const { getEngine } = setup();
    nextId += 1;
    const attempt = {
      skill: 'speaking', id: `job-test-${nextId}`, moduleId: 'module-1', taskTypeId: 'speaking-1',
      taskTitle: 'Speaking task 1', promptText: 'Give advice.', checklist: [], goal: 9, goalChosen: true,
      transcript: 'Join a club.', words: [], recordedSeconds: 5, transcribeMs: 1,
      metrics: { wordCount: 3, answerSeconds: 90 },
    } as unknown as SpeakingAttempt;
    const job = feedbackJobFor(attempt, getEngine);
    expect(await job.promise).toEqual({ kind: 'sample' });
    expect(getEngine).not.toHaveBeenCalled();
    expect(job.progress.phase).toBe('done');
    expect(job.progress.answer.state).toBe('off');
  });

  it('settles a job whose module content fails to download, and tries again next time', async () => {
    const { getEngine } = setup();
    nextId += 1;
    const attempt = {
      skill: 'speaking', id: `job-test-${nextId}`, moduleId: 'module-1', taskTypeId: 'speaking-1',
      taskTitle: 'Speaking task 1', promptText: 'Give advice.', checklist: [], goal: 9, goalChosen: true,
      transcript: 'Join a club.', words: [], recordedSeconds: 5, transcribeMs: 1,
      metrics: { wordCount: 3, answerSeconds: 90 },
    } as unknown as SpeakingAttempt;
    vi.mocked(loadModule).mockRejectedValueOnce(new Error('offline'));
    const job = feedbackJobFor(attempt, getEngine);
    expect(await job.promise).toEqual({ kind: 'code', reason: 'error', message: 'offline' });
    expect(job.progress.phase).toBe('done');
    const retry = feedbackJobFor(attempt, getEngine);
    expect(retry).not.toBe(job);
    expect(await retry.promise).toEqual({ kind: 'sample' });
  });

  it('falls back to code-only feedback in light mode', async () => {
    const { getEngine } = setup({ light: true });
    const job = feedbackJobFor(writing(LONG_TEXT), getEngine);
    expect(await job.promise).toEqual({ kind: 'code', reason: 'light-mode' });
    expect(job.progress.phase).toBe('done');
  });
});

describe('cancelling a feedback job', () => {
  it('drops a job cancelled while the model downloads, so the next answer goes first', async () => {
    const loading = gate();
    const { getEngine, prompts } = setup({ load: loading.opened, replies: [SCORES_REPLY, ANSWER_REPLY, SCORES_REPLY, ANSWER_REPLY] });
    const old = feedbackJobFor(writing(LONG_TEXT), getEngine);
    await until(() => getEngine.mock.calls.length === 1);
    const next = feedbackJobFor(writing(LONG_TEXT.replaceAll('kettle', 'toaster')), getEngine);
    loading.open();
    expect(await old.promise).toMatchObject({ kind: 'code', reason: 'error' });
    expect((await next.promise).kind).toBe('ai');
    await until(answerDone(next));
    expect(prompts.some((prompt) => prompt.includes('kettle'))).toBe(false);
  });

  it('stops scoring mid-reply and never starts step 2', async () => {
    const generating = gate();
    const { getEngine, log } = setup({ generating: generating.opened });
    const job = feedbackJobFor(writing(LONG_TEXT), getEngine);
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

describe('when scoring fails', () => {
  /** What the speed card says for each step once the job has settled. */
  async function settledLabels(job: Job) {
    const outcome = await job.promise;
    const steps = stepStates(job.progress, outcome);
    return { outcome, scores: STEP_LABELS[steps.scores], answer: STEP_LABELS[steps.answer] };
  }

  it('settles with the error state when the model throws, and never says it is still writing', async () => {
    const { getEngine } = setup({ fail: new Error('GPUDevice was lost') });
    const result = await settledLabels(feedbackJobFor(writing(LONG_TEXT), getEngine));
    expect(result.outcome).toEqual({ kind: 'code', reason: 'error', message: 'GPUDevice was lost' });
    expect(result).toMatchObject({ scores: 'Did not finish', answer: 'Not started' });
  });

  it('settles with the error state when both replies are unreadable', async () => {
    const { getEngine, log } = setup({ replies: ['{"checklist": [', 'not json'] });
    const result = await settledLabels(feedbackJobFor(writing(LONG_TEXT), getEngine));
    expect(result.outcome).toMatchObject({ kind: 'code', reason: 'error', message: 'The AI reply could not be read.' });
    expect(log.filter((entry) => entry === 'generate')).toHaveLength(2);
    expect(result.answer).not.toBe('Writing…');
  });
});

describe('speed card labels', () => {
  const progress = (phase: 'scoring' | 'done', answer: 'off' | 'waiting' | 'writing' | 'failed' | 'done') =>
    ({ phase, modelProgress: null, written: 0, answer: { state: answer, text: '' }, perf: null });

  it('says "Writing…" only for a step that is writing now', () => {
    expect(stepStates(progress('scoring', 'off'), null)).toEqual({ scores: 'running', answer: 'not-started' });
    expect(stepStates(progress('done', 'writing'), { kind: 'ai', run: {} as never }).answer).toBe('running');
    expect(stepStates(progress('done', 'waiting'), { kind: 'ai', run: {} as never }).answer).toBe('starting');
    expect(stepStates(progress('done', 'failed'), { kind: 'ai', run: {} as never }).answer).toBe('failed');
    expect(stepStates(progress('done', 'writing'), { kind: 'sample' }).scores).toBe('not-needed');
  });
});

describe('a model that goes quiet', () => {
  it('is stopped and fails after the stall time, but not while words keep coming', async () => {
    vi.useFakeTimers();
    try {
      const stop = vi.fn();
      let write = (_soFar: string) => {};
      const step = withStallTimeout((onText) => { write = onText; return new Promise<string>(() => {}); }, () => {}, stop);
      const failed = expect(step).rejects.toThrow(STALL_MESSAGE);
      vi.advanceTimersByTime(STALL_MS - 1);
      write('Some words');
      vi.advanceTimersByTime(STALL_MS - 1);
      expect(stop).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(stop).toHaveBeenCalledTimes(1);
      await failed;
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('an answer that is not about the task', () => {
  it('gets an example answer written from scratch, not a rewrite', async () => {
    const offTask = JSON.stringify({ ...JSON.parse(SCORES_REPLY), on_task: false, on_task_reason: 'The task asks for an email to the store' });
    const { getEngine, prompts } = setup({ replies: [offTask, ANSWER_REPLY] });
    const job = feedbackJobFor(writing(LONG_TEXT), getEngine);
    expect(await job.promise).toMatchObject({ kind: 'ai', run: { reply: { onTask: false } } });
    await until(answerDone(job));
    expect(prompts[1]).not.toContain('Fixes to apply');
    expect(prompts[1]).not.toContain('kettle');
  });
});
