import type { ClbGoal } from './goals';
import type { MetricWord, SpeakingMetrics } from './measure/speakingMetrics';

/**
 * One spoken answer, kept in memory only for the results screen.
 * Never saved or sent anywhere (privacy spec).
 */
export interface SpeakingAttempt {
  id: string;
  moduleId: string;
  taskTypeId: string;
  taskTitle: string;
  promptText: string;
  checklist: string[];
  goal: ClbGoal;
  /** False when the learner hadn't picked a goal and the default was used. */
  goalChosen: boolean;
  transcript: string;
  words: MetricWord[];
  recordedSeconds: number;
  transcribeMs: number;
  metrics: SpeakingMetrics;
}

export const DEFAULT_GOAL: ClbGoal = 9;

let counter = 0;
export function newAttemptId(): string {
  counter += 1;
  return `attempt-${Date.now()}-${counter}`;
}
