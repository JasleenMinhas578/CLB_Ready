import type { SkillId } from '../skills';

/**
 * A task TYPE is the fixed shape of a test task (its rules and timing).
 * A PROMPT (content/types.ts) is one concrete question for a task type.
 * Keeping them apart lets new modules add prompts without touching rules.
 */
interface BaseTaskType {
  /** Stable id, e.g. "speaking-1". Prompts reference this. */
  id: string;
  skill: SkillId;
  /** Position within its skill (1-based), as on test day. */
  order: number;
  title: string;
  /** What the learner has to do, in one sentence. */
  summary: string;
  /** Whether prompts of this type show an image. */
  needsImage: boolean;
}

export interface SpeakingTiming {
  /** Extra silent time to pick an option (task 5 only). */
  selectSeconds?: number;
  prepSeconds: number;
  answerSeconds: number;
}

export interface SpeakingTaskType extends BaseTaskType {
  skill: 'speaking';
  timing: SpeakingTiming;
  /** Task 4 reuses task 3's scene. */
  sharesImageWith?: string;
}

export interface WritingTaskType extends BaseTaskType {
  skill: 'writing';
  timing: { minutes: number };
  wordRange: { min: number; max: number };
}

/**
 * Discriminated union on `skill`. Reading and listening task types
 * get their own interfaces here when those skills are built.
 */
export type TaskType = SpeakingTaskType | WritingTaskType;

export function isSpeakingTask(task: TaskType): task is SpeakingTaskType {
  return task.skill === 'speaking';
}

export function isWritingTask(task: TaskType): task is WritingTaskType {
  return task.skill === 'writing';
}
