import { describe, expect, it } from 'vitest';
import { nextTask, taskPath } from '../src/services/progress/progress';

const done = (...keys: string[]) => Object.fromEntries(keys.map((key) => [key, '2026-11-27T00:00:00.000Z']));

describe('nextTask', () => {
  it('starts a new learner on module 1, speaking task 1', () => {
    expect(taskPath(nextTask({}))).toBe('/task/module-1/speaking-1');
  });

  it('skips finished tasks, in test order', () => {
    expect(nextTask(done('module-1/speaking-1', 'module-1/speaking-2')).task.id).toBe('speaking-3');
  });

  it('stays inside one skill when asked', () => {
    expect(taskPath(nextTask(done('module-1/writing-1', 'module-1/writing-2'), 'writing'))).toBe('/task/module-2/writing-1');
  });

  it('starts again from the first task when everything is finished', () => {
    const all = done(...[1, 2, 3, 4, 5].flatMap((n) => [`module-${n}/writing-1`, `module-${n}/writing-2`]));
    expect(taskPath(nextTask(all, 'writing'))).toBe('/task/module-1/writing-1');
  });
});
