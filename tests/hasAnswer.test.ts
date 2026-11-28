import { describe, expect, it } from 'vitest';
import { hasAnswer, type AnyAttempt } from '../src/domain/attempt';

const objective = (answers: Record<string, number | null>) =>
  ({ skill: 'reading', answers }) as unknown as AnyAttempt;

describe('hasAnswer', () => {
  it('counts reading or listening only when a question was answered', () => {
    expect(hasAnswer(objective({ q1: null, q2: null }))).toBe(false);
    expect(hasAnswer(objective({ q1: null, q2: 0 }))).toBe(true);
  });

  it('counts writing only when something was written', () => {
    expect(hasAnswer({ skill: 'writing', text: '  \n ' } as unknown as AnyAttempt)).toBe(false);
    expect(hasAnswer({ skill: 'writing', text: 'Dear Sam' } as unknown as AnyAttempt)).toBe(true);
  });

  it('counts speaking only when words were heard', () => {
    expect(hasAnswer({ skill: 'speaking', transcript: '' } as unknown as AnyAttempt)).toBe(false);
    expect(hasAnswer({ skill: 'speaking', transcript: 'I think you should' } as unknown as AnyAttempt)).toBe(true);
  });
});
