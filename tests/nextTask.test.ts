import { describe, expect, it } from 'vitest';
import { nextTask, skillProgress, taskPath, withoutTasks } from '../src/services/progress/progress';

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

describe('skillProgress', () => {
  it('counts finished tasks per skill across every module', () => {
    const progress = done('module-1/writing-1', 'module-3/writing-2', 'module-1/speaking-1', 'module-9/writing-1', 'module-1/old-task');
    expect(skillProgress(progress, 'writing')).toEqual({ done: 2, total: 10 });
    expect(skillProgress(progress, 'speaking')).toEqual({ done: 1, total: 40 });
    expect(skillProgress({}, 'listening')).toEqual({ done: 0, total: 30 });
  });

  it('counts every skill when none is given', () => {
    expect(skillProgress(done('module-1/writing-1', 'module-2/reading-4'))).toEqual({ done: 2, total: 100 });
  });
});

describe('withoutTasks', () => {
  it('clears only the chosen tasks in one module', () => {
    const progress = done('module-1/speaking-1', 'module-1/speaking-2', 'module-2/speaking-1', 'module-1/writing-1');
    expect(Object.keys(withoutTasks(progress, 'module-1', ['speaking-1', 'speaking-2']))).toEqual(['module-2/speaking-1', 'module-1/writing-1']);
  });
});
