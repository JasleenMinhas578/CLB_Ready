import { describe, expect, it } from 'vitest';
import { FeedbackEngineStore } from '../src/services/ai/feedbackEngine';
import { FEEDBACK_JSON_SCHEMA, SCORING_MAX_TOKENS, answerTokenBudget, buildFeedbackPrompt, buildRewritePrompt, cleanTip, parseFeedback } from '../src/services/ai/feedbackPrompt';
import type { ModelPlan } from '../src/services/device/tier';
import type { FeedbackModel } from '../src/services/ai/types';

const GOOD_REPLY = JSON.stringify({
  checklist: [{ item: 'Gives advice', met: true }],
  scores: { content_and_coherence: 8, vocabulary: 7, listenability_or_readability: 7, task_fulfillment: 9 },
  tips: ['One', 'Two', 'Three', 'Four'],
});

const plan = (feedbackModel: string | null): ModelPlan => ({
  tier: feedbackModel ? 'mid' : 'no-webgpu',
  whisperModel: 'Xenova/whisper-base.en',
  whisperDevice: 'webgpu',
  feedbackModel,
  keepWhisperLoaded: true,
  reason: '',
});

function fakeModel(replies: string[], log: string[]): FeedbackModel {
  return {
    async load() { log.push('load'); return { elapsedMs: 1 }; },
    async complete() {
      log.push('generate');
      const text = replies.shift() ?? '';
      return { text, stats: { promptTokens: 1, completionTokens: 1, firstTokenMs: 1, totalMs: 1, tokensPerSecond: 1 } };
    },
    interrupt() { log.push('interrupt'); },
    async reset() { log.push('reset'); },
    async unload() { log.push('unload'); },
  };
}

describe('parseFeedback', () => {
  it('accepts a complete reply and keeps at most 3 tips', () => {
    expect(parseFeedback(GOOD_REPLY)?.tips).toEqual(['One.', 'Two.', 'Three.']);
  });

  it('rejects broken JSON and replies missing scores', () => {
    expect(parseFeedback('{"checklist": [')).toBeNull();
    expect(parseFeedback(JSON.stringify({ checklist: [], scores: { content_and_coherence: 8 }, tips: [] }))).toBeNull();
  });
});

describe('buildFeedbackPrompt', () => {
  it('puts the goal, checklist and measured facts in the prompt', () => {
    const { system, user } = buildFeedbackPrompt({
      taskTitle: 'Giving advice', promptText: 'Help a friend', checklist: ['Gives advice', 'Gives reasons'],
      criteria: [], goal: 9, goalLabel: 'effective', answer: 'Join a club.', spoken: true, measured: ['pace 120 words per minute'],
    });
    expect(system.includes('CLB 9 (effective)')).toBe(true);
    expect(system.includes('speech transcript')).toBe(true);
    expect(user.includes('Gives advice; Gives reasons')).toBe(true);
    expect(user.includes('pace 120 words per minute')).toBe(true);
  });
});

describe('FeedbackEngineStore', () => {
  it('returns a parsed reply and resets the chat afterwards', async () => {
    const log: string[] = [];
    const store = new FeedbackEngineStore(async () => plan('Qwen2.5-1.5B-Instruct-q4f16_1-MLC'), () => fakeModel([GOOD_REPLY], log));
    const run = await store.generate('s', 'u');
    expect(run.attempts).toBe(1);
    expect(run.reply.scores.task).toBe(9);
    expect(log.includes('reset')).toBe(true);
    expect(store.getStatus().model).toBe('Qwen2.5-1.5B-Instruct');
  });

  it('retries once when the first reply is unreadable', async () => {
    const log: string[] = [];
    const store = new FeedbackEngineStore(async () => plan('m'), () => fakeModel(['not json', GOOD_REPLY], log));
    const run = await store.generate('s', 'u');
    expect(run.attempts).toBe(2);
    expect(log.filter((entry) => entry === 'generate').length).toBe(2);
  });

  it('gives up after two unreadable replies', async () => {
    const store = new FeedbackEngineStore(async () => plan('m'), () => fakeModel(['bad', 'worse'], []));
    let message = '';
    try {
      await store.generate('s', 'u');
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toBe('The AI reply could not be read.');
  });

  it('reports light mode on devices without a feedback model', async () => {
    const store = new FeedbackEngineStore(async () => plan(null), () => null);
    let name = '';
    try {
      await store.generate('s', 'u');
    } catch (error) {
      name = (error as Error).name;
    }
    expect(name).toBe('ModelUnavailableError');
    expect(store.getStatus().state).toBe('unavailable');
  });
});

describe('two-step feedback', () => {
  it('scores with a short JSON reply that has no rewrite in it', () => {
    expect(JSON.stringify(FEEDBACK_JSON_SCHEMA).includes('improved')).toBe(false);
    expect(SCORING_MAX_TOKENS <= 500).toBe(true);
  });

  it('sizes the rewrite to the answer, within limits', () => {
    expect(answerTokenBudget(180)).toBe(368);
    expect(answerTokenBudget(10)).toBe(200);
    expect(answerTokenBudget(2000)).toBe(1000);
  });

  it('asks for a plain-text rewrite that applies the tips', () => {
    const { system, user } = buildRewritePrompt({
      taskTitle: 'Email', promptText: 'Complain', goal: 9, goalLabel: 'effective', answer: 'hi i want refund', spoken: false, tips: ['Add the date.'],
    });
    expect(system.includes('Write only the rewritten answer')).toBe(true);
    expect(system.includes('no subject')).toBe(true);
    expect(user.includes('Fixes to apply: Add the date.')).toBe(true);
    expect(user.includes('hi i want refund')).toBe(true);
  });

  it('asks a short spoken answer to be expanded to fill the speaking time, speaking to the listener', () => {
    const { system } = buildRewritePrompt({
      taskTitle: 'Giving advice', promptText: 'Help a friend', goal: 9, answer: 'join club', spoken: true, targetWords: 210,
    });
    expect(system.includes('about 210 words long')).toBe(true);
    expect(system.includes('add clear reasons, examples and details')).toBe(true);
    expect(system.includes('speak to them directly')).toBe(true);
  });

  it('runs requests one at a time', async () => {
    let running = 0;
    let overlapped = false;
    const model: FeedbackModel = {
      async load() { return { elapsedMs: 1 }; },
      async complete() {
        running += 1;
        if (running > 1) overlapped = true;
        await new Promise((resolve) => setTimeout(resolve, 5));
        running -= 1;
        return { text: 'A full answer with enough words.', stats: { promptTokens: 1, completionTokens: 1, firstTokenMs: 1, totalMs: 1, tokensPerSecond: 1 } };
      },
      interrupt() {},
      async reset() {},
      async unload() {},
    };
    const store = new FeedbackEngineStore(async () => plan('m'), () => model);
    await Promise.all([store.writeText('s', 'u', 300), store.writeText('s', 'u', 300)]);
    expect(overlapped).toBe(false);
  });

  it('stops a reply when interrupted and does not retry it', async () => {
    let calls = 0;
    let release: () => void = () => {};
    const model: FeedbackModel = {
      async load() { return { elapsedMs: 1 }; },
      async complete() {
        calls += 1;
        await new Promise<void>((resolve) => { release = resolve; });
        return { text: 'Partial', stats: { promptTokens: 1, completionTokens: 1, firstTokenMs: 1, totalMs: 1, tokensPerSecond: 1 } };
      },
      interrupt() { release(); },
      async reset() {},
      async unload() {},
    };
    const store = new FeedbackEngineStore(async () => plan('m'), () => model);
    const pending = store.writeText('s', 'u', 300);
    await new Promise((resolve) => setTimeout(resolve, 5));
    store.interrupt();
    let name = '';
    try {
      await pending;
    } catch (error) {
      name = (error as Error).name;
    }
    expect(name).toBe('GenerationInterruptedError');
    expect(calls).toBe(1);
  });
});

describe('cleanTip', () => {
  it('removes stray and wrapping quote marks', () => {
    expect(cleanTip('"Add the date you ordered.')).toBe('Add the date you ordered.');
    expect(cleanTip('"Say when it arrived."')).toBe('Say when it arrived.');
    expect(cleanTip('Replace "hi" with "Dear Sir or Madam".')).toBe('Replace "hi" with "Dear Sir or Madam".');
  });

  it('cuts a long tip to its first sentence and adds a full stop', () => {
    const long = 'Explain the damage in more detail so the reader understands. ' + 'Then add more words '.repeat(8);
    expect(cleanTip(long)).toBe('Explain the damage in more detail so the reader understands.');
    expect(cleanTip('Use linking words')).toBe('Use linking words.');
    expect(cleanTip("Use more like ' 'Hey, if you're lonely,, join a team.'")).toBe("Use more like 'Hey, if you're lonely, join a team.'");
  });
});
