import { describe, expect, it } from 'vitest';
import { matchPath } from '../src/app/router';
import { buildSpeakingPhases, countWords } from '../src/features/task/phases';

describe('matchPath', () => {
  it('matches static and dynamic segments', () => {
    expect(matchPath('/', '/')).toEqual({});
    expect(matchPath('/task/:moduleId/:taskTypeId', '/task/module-1/speaking-3')).toEqual({
      moduleId: 'module-1',
      taskTypeId: 'speaking-3',
    });
  });

  it('rejects different shapes', () => {
    expect(matchPath('/goal', '/lab')).toBeNull();
    expect(matchPath('/task/:a/:b', '/task/only-one')).toBeNull();
  });

  it('treats a malformed escape as no match instead of throwing', () => {
    expect(matchPath('/task/:moduleId', '/task/%E0')).toBeNull();
  });
});

describe('speaking phases', () => {
  it('adds a choose phase only when the task has one', () => {
    expect(buildSpeakingPhases({ prepSeconds: 30, answerSeconds: 60 }).map((p) => p.id)).toEqual(['prep', 'answer']);
    expect(buildSpeakingPhases({ selectSeconds: 60, prepSeconds: 60, answerSeconds: 60 }).map((p) => p.id)).toEqual([
      'select',
      'prep',
      'answer',
    ]);
  });
});

describe('countWords', () => {
  it('counts words, contractions and hyphenated words once', () => {
    expect(countWords('')).toBe(0);
    expect(countWords("  I'm writing a well-known email.  ")).toBe(5);
  });
});
