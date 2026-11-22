import type { PracticeModule, PracticePrompt } from '../types';
import { module1 } from './module1';

/** Placeholder for modules whose prompts aren't written yet. */
function comingSoon(number: number): PracticeModule {
  return { id: `module-${number}`, number, title: `Module ${number}`, status: 'coming-soon', prompts: [] };
}

/**
 * Module registry. To add a module: create moduleN.ts next to module1.ts
 * and swap its comingSoon(N) entry for the import.
 */
export const MODULES: readonly PracticeModule[] = [
  module1,
  comingSoon(2),
  comingSoon(3),
  comingSoon(4),
  comingSoon(5),
];

export function getModule(id: string): PracticeModule | undefined {
  return MODULES.find((module) => module.id === id);
}

export function getPrompt(moduleId: string, taskTypeId: string): PracticePrompt | undefined {
  return getModule(moduleId)?.prompts.find((prompt) => prompt.taskTypeId === taskTypeId);
}
