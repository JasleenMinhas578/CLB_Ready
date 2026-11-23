import type { ClbGoal } from './goals';
import type { GrammarIssue } from './grammar';
import type { MetricWord, SpeakingMetrics } from './measure/speakingMetrics';
import type { WritingMetrics } from './measure/writingMetrics';

/**
 * One answer, kept in memory only for the results screen.
 * Never saved or sent anywhere (privacy spec).
 */
interface BaseAttempt {
  id: string;
  moduleId: string;
  taskTypeId: string;
  taskTitle: string;
  promptText: string;
  checklist: string[];
  goal: ClbGoal;
  /** False when the learner hadn't picked a goal and the default was used. */
  goalChosen: boolean;
}

export interface SpeakingAttempt extends BaseAttempt {
  skill: 'speaking';
  transcript: string;
  words: MetricWord[];
  recordedSeconds: number;
  transcribeMs: number;
  metrics: SpeakingMetrics;
}

export interface WritingAttempt extends BaseAttempt {
  skill: 'writing';
  text: string;
  issues: GrammarIssue[];
  options?: [string, string];
  metrics: WritingMetrics;
}

/** Speaking and writing: answers the AI coach gives feedback on. */
export type Attempt = SpeakingAttempt | WritingAttempt;

/** Reading and listening: multiple-choice answers marked against the key. */
export interface ObjectiveAttempt {
  id: string;
  skill: 'reading' | 'listening';
  moduleId: string;
  taskTypeId: string;
  taskTitle: string;
  /** Content part id, to look the questions up again on the results screen. */
  partId: string;
  /** Chosen option per question id; null when left blank. */
  answers: Record<string, number | null>;
  goal: ClbGoal;
  goalChosen: boolean;
}

export type AnyAttempt = Attempt | ObjectiveAttempt;

export const DEFAULT_GOAL: ClbGoal = 9;

let counter = 0;
export function newAttemptId(): string {
  counter += 1;
  return `attempt-${Date.now()}-${counter}`;
}
