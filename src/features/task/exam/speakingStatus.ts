import type { PhaseId } from '../phases';

export type SpeakingFlow = 'ready' | 'mic-check' | 'running' | 'transcribing' | 'problem';

/** The exam bar button's label. Before the timers it says Start, like the panel; while the answer is saved it says so, rather than a greyed-out "Next". */
export function speakingActionLabel(state: SpeakingFlow, phase: PhaseId): string {
  if (state === 'transcribing') return 'Saving…';
  if (state === 'ready') return 'Start';
  if (state !== 'running') return 'Next';
  return phase === 'answer' ? 'Finish answer' : 'Skip';
}

/** What Exit asks before leaving, or undefined when nothing would be lost. */
export function speakingExitWarning(state: SpeakingFlow, recording: boolean): string | undefined {
  if (state === 'transcribing') return 'Your answer is still being saved. If you leave now, it is lost.';
  if (recording) return 'You are recording an answer. If you leave now, the recording is lost.';
  return undefined;
}
