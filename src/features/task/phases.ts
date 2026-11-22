import type { SpeakingTiming } from '@/domain/tasks/types';

export type PhaseId = 'select' | 'prep' | 'answer';

export interface Phase {
  id: PhaseId;
  label: string;
  seconds: number;
}

/** Turns a task's timing rules into the ordered phases shown on screen. */
export function buildSpeakingPhases(timing: SpeakingTiming): Phase[] {
  const phases: Phase[] = [];
  if (timing.selectSeconds) phases.push({ id: 'select', label: 'Choose', seconds: timing.selectSeconds });
  phases.push({ id: 'prep', label: 'Prepare', seconds: timing.prepSeconds });
  phases.push({ id: 'answer', label: 'Speak', seconds: timing.answerSeconds });
  return phases;
}

export function countWords(text: string): number {
  const words = text.trim().match(/[\p{L}\p{N}'’-]+/gu);
  return words ? words.length : 0;
}
