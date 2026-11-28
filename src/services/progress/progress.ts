import { useSyncExternalStore } from 'react';
import { SKILLS, type SkillId } from '@/domain/skills';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';
import type { TaskType } from '@/domain/tasks/types';
import { MODULE_CATALOG } from '@/content/modules/catalog';

/**
 * Which tasks the learner has finished, saved in this browser only
 * (localStorage). Only a task's id and the date are kept: never answers,
 * recordings or scores. It can be cleared from Settings.
 * Storage can be blocked (private windows, strict settings), so every
 * read and write is wrapped and the app works without it.
 */
const KEY = 'clb-ready:progress:v1';

/** "module-1/speaking-3" → ISO date it was last finished. */
export type Progress = Record<string, string>;

const listeners = new Set<() => void>();
let cache: Progress | null = null;

function read(): Progress {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? '{}');
    cache = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Progress) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function write(next: Progress) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: ticks still show until the tab closes.
  }
  listeners.forEach((listener) => listener());
}

export function taskKey(moduleId: string, taskTypeId: string): string {
  return `${moduleId}/${taskTypeId}`;
}

export function markDone(moduleId: string, taskTypeId: string, when = new Date()) {
  write({ ...read(), [taskKey(moduleId, taskTypeId)]: when.toISOString() });
}

export function clearProgress() {
  write({});
}

/** Progress without the given tasks of one module, so a learner can redo just that module. */
export function withoutTasks(progress: Progress, moduleId: string, taskIds: string[]): Progress {
  const drop = new Set(taskIds.map((id) => taskKey(moduleId, id)));
  return Object.fromEntries(Object.entries(progress).filter(([key]) => !drop.has(key)));
}

export function clearTasks(moduleId: string, taskIds: string[]) {
  write(withoutTasks(read(), moduleId, taskIds));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep ticks in step when another tab finishes a task.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

const empty: Progress = {};

/** Live progress for screens; re-renders when a task is finished or progress is cleared. */
export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => empty);
}

/** How many of these task ids are finished in a module. */
export function countDone(progress: Progress, moduleId: string, taskTypeIds: string[]): number {
  return taskTypeIds.filter((id) => progress[taskKey(moduleId, id)]).length;
}

/** How many tasks are finished in one skill (or in all of them) across every module, out of how many there are. */
export function skillProgress(progress: Progress, skill?: SkillId): { done: number; total: number } {
  const skills = skill ? [skill] : SKILLS.map((item) => item.id);
  const ids = skills.flatMap((id) => getTaskTypesForSkill(id).map((task) => task.id));
  const done = MODULE_CATALOG.reduce((sum, { id }) => sum + countDone(progress, id, ids), 0);
  return { done, total: ids.length * MODULE_CATALOG.length };
}

export interface NextTask {
  moduleId: string;
  task: TaskType;
}

/**
 * The first unfinished task, going module by module and, inside a module,
 * skill by skill in test order. Pass a skill to stay inside it. When every
 * task is finished it starts again from the first one.
 */
export function nextTask(progress: Progress, skill?: SkillId): NextTask {
  const skills = skill ? [skill] : SKILLS.map((item) => item.id);
  const tasks = skills.flatMap((id) => getTaskTypesForSkill(id));
  for (const { id: moduleId } of MODULE_CATALOG) {
    const task = tasks.find((item) => !progress[taskKey(moduleId, item.id)]);
    if (task) return { moduleId, task };
  }
  return { moduleId: MODULE_CATALOG[0].id, task: tasks[0] };
}

export function taskPath({ moduleId, task }: NextTask): string {
  return `/task/${moduleId}/${task.id}`;
}
