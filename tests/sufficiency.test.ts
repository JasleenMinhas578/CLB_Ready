import { describe, expect, it } from 'vitest';
import { isScorable, lengthCeiling, plural } from '../src/domain/scoring/sufficiency';
import { measureWriting } from '../src/domain/measure/writingMetrics';
import { codeEstimatesWriting, writingTips } from '../src/domain/scoring/writingEstimate';
import { blendScores } from '../src/domain/scoring/estimate';
import { extractJson, parseFeedback, parseModelAnswer, buildModelAnswerPrompt } from '../src/services/ai/feedbackPrompt';
import { FeedbackEngineStore } from '../src/services/ai/feedbackEngine';
import type { FeedbackModel } from '../src/services/ai/types';
import type { ModelPlan } from '../src/services/device/tier';

const RANGE = { min: 150, max: 200 };

describe('too short to score', () => {
  it('needs 50 written or 20 spoken words', () => {
    expect(isScorable('writing', 1)).toBe(false);
    expect(isScorable('writing', 49)).toBe(false);
    expect(isScorable('writing', 50)).toBe(true);
    expect(isScorable('speaking', 19)).toBe(false);
    expect(isScorable('speaking', 20)).toBe(true);
  });

  it('caps short answers: under half the minimum cannot pass CLB 5', () => {
    expect(lengthCeiling(60, 150)).toBe(5);
    expect(lengthCeiling(100, 150)).toBe(7);
    expect(lengthCeiling(150, 150)).toBe(12);
  });

  it('no longer gives a one-word answer high vocabulary', () => {
    const scores = codeEstimatesWriting(measureWriting({ text: 'fdjnd', wordRange: RANGE, grammarIssues: 0, emailTone: 'formal' }));
    expect(Math.max(...Object.values(scores)) <= 5).toBe(true);
  });

  it('keeps the AI from lifting a short answer above the cap', () => {
    const code = { content: 5, vocabulary: 5, listenability: 5, task: 5 };
    const blended = blendScores(code, { content: 12, vocabulary: 12, listenability: 12, task: 12 }, undefined, 5);
    expect(Math.max(...Object.values(blended))).toBe(5);
  });

  it('writes proper plurals', () => {
    expect(plural(1, 'word')).toBe('1 word');
    expect(plural(3, 'word')).toBe('3 words');
    const tips = writingTips(measureWriting({ text: 'fdjnd', wordRange: RANGE, grammarIssues: 0 }), 9);
    expect(tips[0].startsWith('You wrote 1 word.')).toBe(true);
  });
});

describe('reading AI replies', () => {
  const reply = '{"checklist":[{"item":"a","met":true}],"scores":{"content":8,"vocabulary":7,"delivery":7,"task":8},"tips":["t"],"improved":"x"}';

  it('copes with code fences and text around the JSON', () => {
    expect(parseFeedback('```json\n' + reply + '\n```')).not.toBeNull();
    expect(parseFeedback('Here is your feedback: ' + reply)).not.toBeNull();
    expect(extractJson('noise {"a": 1} noise')).toEqual({ a: 1 });
  });

  it('reads a model answer and rejects an empty one', () => {
    expect(parseModelAnswer('{"answer": "Dear team, ..."}')).toBe('Dear team, ...');
    expect(parseModelAnswer('{"answer": "  "}')).toBeNull();
    expect(parseModelAnswer('{"answer": "cut off')).toBeNull();
  });

  it('asks for the right length and level in a model answer prompt', () => {
    const { system } = buildModelAnswerPrompt({ taskTitle: 'Email', promptText: 'Write', goal: 9, goalLabel: 'effective', spoken: false, length: '150 to 200 words' });
    expect(system.includes('CLB 9 (effective)')).toBe(true);
    expect(system.includes('150 to 200 words')).toBe(true);
  });

  it('generates a model answer with its own schema, retrying a cut-off reply', async () => {
    const schemas: unknown[] = [];
    const replies = ['{"answer": "cut', '{"answer": "Dear Sir or Madam, I am writing..."}'];
    const model: FeedbackModel = {
      async load() { return { elapsedMs: 1 }; },
      async generateJson(_s, _u, _t, schema) {
        schemas.push(schema);
        return { text: replies.shift() ?? '', stats: { promptTokens: 1, completionTokens: 1, firstTokenMs: 1, totalMs: 1, tokensPerSecond: 1 }, truncated: true };
      },
      async reset() {},
      async unload() {},
    };
    const plan: ModelPlan = { tier: 'mid', whisperModel: 'w', whisperDevice: 'webgpu', feedbackModel: 'm', keepWhisperLoaded: true, reason: '' };
    const store = new FeedbackEngineStore(async () => plan, () => model);
    const originalWarn = console.warn;
    console.warn = () => {};
    const run = await store.generateModelAnswer('s', 'u');
    console.warn = originalWarn;
    expect(run.answer.startsWith('Dear Sir')).toBe(true);
    expect(run.attempts).toBe(2);
    expect(JSON.stringify(schemas[0]).includes('"answer"')).toBe(true);
  });
});
