import { describe, expect, it } from 'vitest';
import { FeedbackEngineStore } from '../src/services/ai/feedbackEngine';
import { buildFeedbackPrompt, parseFeedback } from '../src/services/ai/feedbackPrompt';
import type { ModelPlan } from '../src/services/device/tier';
import type { FeedbackModel } from '../src/services/ai/types';

const GOOD_REPLY = JSON.stringify({
  checklist: [{ item: 'Gives advice', met: true }],
  scores: { content: 8, vocabulary: 7, delivery: 7, task: 9 },
  tips: ['One', 'Two', 'Three', 'Four'],
  improved: 'A better answer.',
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
    async generateJson() {
      log.push('generate');
      const text = replies.shift() ?? '';
      return { text, stats: { promptTokens: 1, completionTokens: 1, firstTokenMs: 1, totalMs: 1, tokensPerSecond: 1 } };
    },
    async reset() { log.push('reset'); },
    async unload() { log.push('unload'); },
  };
}

describe('parseFeedback', () => {
  it('accepts a complete reply and keeps at most 3 tips', () => {
    expect(parseFeedback(GOOD_REPLY)?.tips).toEqual(['One', 'Two', 'Three']);
  });

  it('rejects broken JSON and replies missing scores', () => {
    expect(parseFeedback('{"checklist": [')).toBeNull();
    expect(parseFeedback(JSON.stringify({ checklist: [], scores: { content: 8 }, tips: [], improved: '' }))).toBeNull();
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
