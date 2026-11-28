import type { PracticeModule } from '../types';

/**
 * What the home and skill lists need about each module, kept apart from the
 * content itself so those lists don't download every module's passages.
 * tests/content.test.ts checks this matches the real content.
 */
export type ModuleSummary = Pick<PracticeModule, 'id' | 'number' | 'title'>;

export const MODULE_CATALOG: readonly ModuleSummary[] = [1, 2, 3, 4, 5].map((number): ModuleSummary => ({
  id: `module-${number}`,
  number,
  title: `Module ${number}`,
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
