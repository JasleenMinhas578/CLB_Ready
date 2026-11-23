import { useSyncExternalStore } from 'react';

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
