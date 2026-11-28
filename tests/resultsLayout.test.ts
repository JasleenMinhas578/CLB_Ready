import { describe, expect, it } from 'vitest';
import { resultsLayout, resultsState, type ResultsCard } from '../src/features/results/resultsLayout';
import { STALL_MESSAGE, type AnswerStream, type FeedbackOutcome, type FeedbackProgress } from '../src/features/results/useFeedback';
import type { FeedbackRun } from '../src/services/ai/feedbackEngine';

const progress = (phase: FeedbackProgress['phase'], answer: AnswerStream['state'] = 'off'): FeedbackProgress => ({
  phase, modelProgress: null, written: 0, answer: { state: answer, text: '' }, perf: null,
});
const ai: FeedbackOutcome = { kind: 'ai', run: {} as FeedbackRun };
const PIP_CARDS: ResultsCard[] = ['level', 'tips', 'checklist', 'answer'];
const all = (state: Parameters<typeof resultsLayout>[0]) => {
  const { left, right, below } = resultsLayout(state);
  return [...left, ...right, ...below];
};

describe('resultsState', () => {
  it('is loading-model before Pip starts scoring', () => {
    expect(resultsState(null, null)).toBe('loading-model');
    expect(resultsState(null, progress('starting'))).toBe('loading-model');
    expect(resultsState(null, progress('loading-model'))).toBe('loading-model');
  });

  it('is scoring while Pip checks the answer', () => {
    expect(resultsState(null, progress('scoring'))).toBe('scoring');
  });

  it('is writing-answer once scores are in and the answer is still coming', () => {
    expect(resultsState(ai, progress('done', 'waiting'))).toBe('writing-answer');
    expect(resultsState(ai, progress('done', 'writing'))).toBe('writing-answer');
  });

  it('is done when the answer is written, or could not be', () => {
    expect(resultsState(ai, progress('done', 'done'))).toBe('done');
    expect(resultsState(ai, progress('done', 'failed'))).toBe('done');
  });

  it('tells light mode, errors and stalls apart', () => {
    expect(resultsState({ kind: 'code', reason: 'light-mode' }, progress('done'))).toBe('light-mode');
    expect(resultsState({ kind: 'code', reason: 'error', message: 'device lost' }, progress('done'))).toBe('error');
    expect(resultsState({ kind: 'code', reason: 'error', message: STALL_MESSAGE }, progress('done'))).toBe('stalled');
  });
});

describe('resultsLayout', () => {
  it.each(['loading-model', 'scoring'] as const)('%s: one processing panel, plus what needs no Pip', (state) => {
    const layout = resultsLayout(state);
    expect(layout.stack).toEqual(['processing', 'transcript', 'measured', 'sample']);
    expect(layout.left).toEqual(['transcript']);
    expect(layout.right).toEqual(['processing', 'measured']);
    for (const card of PIP_CARDS) expect(all(state)).not.toContain(card);
  });

  it.each(['writing-answer', 'done'] as const)('%s: scores and tips on screen, transcript left, tips right', (state) => {
    const layout = resultsLayout(state);
    expect(layout.stack).toEqual(['level', 'tips', 'checklist', 'answer', 'sample', 'transcript', 'measured']);
    expect(layout.left).toEqual(['level', 'transcript']);
    expect(layout.right).toEqual(['tips', 'checklist', 'answer']);
    expect(all(state)).not.toContain('processing');
  });

  it.each(['light-mode', 'error', 'stalled'] as const)('%s: no processing panel and no answer, measured tips still shown', (state) => {
    const layout = resultsLayout(state);
    expect(layout.stack).toEqual(['level', 'tips', 'checklist', 'sample', 'transcript', 'measured']);
    expect(layout.left).toEqual(['level', 'transcript']);
    expect(layout.right).toEqual(['tips', 'checklist', 'measured']);
    expect(all(state)).not.toContain('processing');
    expect(all(state)).not.toContain('answer');
  });

  it.each(['loading-model', 'scoring', 'writing-answer', 'done', 'light-mode', 'error', 'stalled'] as const)(
    '%s: desktop and phone show the same cards, each once',
    (state) => {
      const layout = resultsLayout(state);
      expect([...all(state)].sort()).toEqual([...layout.stack].sort());
      expect(new Set(layout.stack).size).toBe(layout.stack.length);
    },
  );
});
