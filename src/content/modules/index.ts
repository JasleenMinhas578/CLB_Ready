import type { PracticeModule, PracticePrompt } from '../types';
import type { ListeningPart, ReadingPart } from '../objective';

/**
 * Module registry. Each module's content is its own chunk, downloaded only when a
 * task or result needs it. To add a module: create moduleN.ts next to module1.ts,
 * list it here and in catalog.ts.
 */
const LOADERS: Record<string, () => Promise<PracticeModule>> = {
  'module-1': () => import('./module1').then((file) => file.module1),
  'module-2': () => import('./module2').then((file) => file.module2),
  'module-3': () => import('./module3').then((file) => file.module3),
  'module-4': () => import('./module4').then((file) => file.module4),
  'module-5': () => import('./module5').then((file) => file.module5),
};

const loaded = new Map<string, Promise<PracticeModule | undefined>>();

/**
 * One promise per module, kept so React's `use()` gets the same promise on every
 * render. Resolves to undefined for an unknown id. A failed download is forgotten,
 * so the next visit tries again.
 */
export function loadModule(id: string): Promise<PracticeModule | undefined> {
  let promise = loaded.get(id);
  if (!promise) {
    const load = LOADERS[id];
    promise = load ? load() : Promise.resolve(undefined);
    promise.catch(() => loaded.delete(id));
    loaded.set(id, promise);
  }
  return promise;
}

/** Task type ids this module has content for. */
export function moduleTaskIds(practiceModule: PracticeModule): string[] {
  return [
    ...practiceModule.prompts.map((prompt) => prompt.taskTypeId),
    ...(practiceModule.reading ?? []).map((part) => part.taskTypeId),
    ...(practiceModule.listening ?? []).map((part) => part.taskTypeId),
  ];
}

export function getObjectivePart(practiceModule: PracticeModule | undefined, taskTypeId: string): ReadingPart | ListeningPart | undefined {
  return [...(practiceModule?.reading ?? []), ...(practiceModule?.listening ?? [])].find((part) => part.taskTypeId === taskTypeId);
}

export function getPrompt(practiceModule: PracticeModule | undefined, taskTypeId: string): PracticePrompt | undefined {
  return practiceModule?.prompts.find((prompt) => prompt.taskTypeId === taskTypeId);
}
