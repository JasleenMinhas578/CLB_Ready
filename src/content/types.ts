import type { Availability } from '@/domain/skills';
import type { Tone } from '@/domain/measure/writingMetrics';

export interface PromptImage {
  src: string;
  alt: string;
  /**
   * What is in the picture. The AI cannot see images, so Task Fulfillment
   * checks how many of these the learner mentioned.
   */
  keyElements: string[];
}

/** One concrete practice question for a task type. */
export interface PracticePrompt {
  id: string;
  taskTypeId: string;
  /** The instructions shown to the learner. */
  text: string;
  /** Bullet points under the instructions, e.g. what an email must cover. */
  points?: string[];
  /** Two options for speaking task 5 and writing task 2. */
  options?: [string, string];
  /** Expected tone for email tasks (writing task 1). */
  tone?: Tone;
  image?: PromptImage;
  /** Points a good answer covers. The feedback model ticks these off. */
  checklist: string[];
  /** Draft prompts are placeholders until final content is written. */
  draft?: boolean;
}

/** A module = one full practice set (8 speaking + 2 writing prompts). */
export interface PracticeModule {
  id: string;
  number: number;
  title: string;
  status: Availability;
  prompts: PracticePrompt[];
}
