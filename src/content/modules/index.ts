import type { PracticeModule, PracticePrompt } from '../types';
import type { SkillId } from '@/domain/skills';
import { getTaskType } from '@/domain/tasks/catalog';
import { module1 } from './module1';
import { module2 } from './module2';
import { module3 } from './module3';
import { module4 } from './module4';
import { module5 } from './module5';

/**
 * Module registry. To add a module: create moduleN.ts next to module1.ts
 * and list it here. A module can be filled one skill at a time: a skill's
 * tasks open as soon as the module has prompts for that skill.
 */
export const MODULES: readonly PracticeModule[] = [module1, module2, module3, module4, module5];

/** True when the module has prompts for this skill, so its tab can open. */
export function moduleHasSkill(practiceModule: PracticeModule, skill: SkillId): boolean {
  return practiceModule.prompts.some((prompt) => getTaskType(prompt.taskTypeId)?.skill === skill);
}

export function getModule(id: string): PracticeModule | undefined {
  return MODULES.find((module) => module.id === id);
}

export function getPrompt(moduleId: string, taskTypeId: string): PracticePrompt | undefined {
  return getModule(moduleId)?.prompts.find((prompt) => prompt.taskTypeId === taskTypeId);
}
