import type { PracticeModule } from '../types';
import type { SkillId } from '@/domain/skills';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';

/**
 * What the home and skill lists need about each module, kept apart from the
 * content itself so those lists don't download every module's passages.
 * tests/content.test.ts checks this matches the real content.
 */
export interface ModuleSummary extends Pick<PracticeModule, 'id' | 'number' | 'title' | 'status'> {
  /** Skills with content. A skill's tasks open once a module has every task for it. */
  skills: readonly SkillId[];
}

const ALL_SKILLS: readonly SkillId[] = ['speaking', 'writing', 'reading', 'listening'];

export const MODULE_CATALOG: readonly ModuleSummary[] = [1, 2, 3, 4, 5].map((number): ModuleSummary => ({
  id: `module-${number}`,
  number,
  title: `Module ${number}`,
  status: 'available',
  skills: ALL_SKILLS,
}));

/** Totals shown on the home page. */
export const CONTENT_COUNTS = {
  /** Modules with both reading and listening. Reading and listening count questions. */
  modules: 5,
  speaking: 40,
  /** Speaking tasks with a sample answer. */
  samples: 40,
  writing: 10,
  reading: 190,
  listening: 190,
};

export function getModuleSummary(id: string): ModuleSummary | undefined {
  return MODULE_CATALOG.find((item) => item.id === id);
}

/** True when the module has prompts for this skill, so its tab can open. */
export function moduleHasSkill(summary: ModuleSummary, skill: SkillId): boolean {
  return summary.skills.includes(skill);
}

/** Task type ids of one skill that a module has content for. */
export function skillTaskIds(summary: ModuleSummary, skill: SkillId): string[] {
  return moduleHasSkill(summary, skill) ? getTaskTypesForSkill(skill).map((task) => task.id) : [];
}
