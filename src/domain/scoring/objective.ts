import type { SkillId } from '../skills';

/**
 * Reading and listening are marked against an answer key. CELPIP publishes an
 * approximate chart from correct answers (out of 38) to a level; the ranges
 * overlap because test forms differ in difficulty. We use the lowest raw score
 * of each level's range.
 * Source: CELPIP free online sample test, "Raw Scores and CELPIP Levels".
 */
const MIN_RAW_FOR_LEVEL: Record<'reading' | 'listening', [level: number, minRaw: number][]> = {
  listening: [[10, 35], [9, 33], [8, 30], [7, 27], [6, 22], [5, 17], [4, 11], [3, 7]],
  reading: [[10, 33], [9, 31], [8, 28], [7, 24], [6, 19], [5, 15], [4, 10], [3, 8]],
};

export const FULL_SECTION_QUESTIONS = 38;

export interface ObjectiveEstimate {
  correct: number;
  total: number;
  /** Correct answers scaled to a full 38-question section. */
  scaledRaw: number;
  /** Estimated level, or null when below level 3. 10 means "10 or higher". */
  level: number | null;
  /** True when this is one part, so the estimate rests on few questions. */
  partial: boolean;
}

export function estimateObjective(skill: 'reading' | 'listening', correct: number, total: number): ObjectiveEstimate {
  const scaledRaw = total > 0 ? Math.round((correct / total) * FULL_SECTION_QUESTIONS) : 0;
  const level = MIN_RAW_FOR_LEVEL[skill].find(([, minRaw]) => scaledRaw >= minRaw)?.[0] ?? null;
  return { correct, total, scaledRaw, level, partial: total < FULL_SECTION_QUESTIONS };
}

/** Correct answers needed in a part of `total` questions to reach the goal level. */
export function correctForGoal(skill: 'reading' | 'listening', goal: number, total: number): number {
  const target = MIN_RAW_FOR_LEVEL[skill].find(([level]) => level === Math.min(goal, 10))?.[1] ?? FULL_SECTION_QUESTIONS;
  return Math.ceil((target / FULL_SECTION_QUESTIONS) * total);
}

export function isObjectiveSkill(skill: SkillId): skill is 'reading' | 'listening' {
  return skill === 'reading' || skill === 'listening';
}
