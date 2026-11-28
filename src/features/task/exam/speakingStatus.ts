import type { PhaseId } from '../phases';

export type SpeakingFlow = 'ready' | 'mic-check' | 'running' | 'transcribing' | 'problem';

/**
 * The exam bar button's label, or null when the bar has no button. Before the timers
 * the one Start sits in the panel beside the instructions, so the bar stays empty;
 * while the answer is checked it says so, rather than a greyed-out "Next".
 */
export function speakingActionLabel(state: SpeakingFlow, phase: PhaseId): string | null {
  if (state === 'transcribing') return 'Checking…';
  if (state !== 'running') return null;
  return phase === 'answer' ? 'Finish answer' : 'Skip';
}

/**
 * Whether the exam bar button is off. In the answer phase it stays off until the
 * mic is actually recording: Finish during the start beep would end with no recording.
 */
export function speakingActionDisabled(state: SpeakingFlow, phase: PhaseId, recording: boolean): boolean {
  if (state !== 'running') return true;
  return phase === 'answer' && !recording;
}

/** What happens once the mic has opened: keep recording, or turn it off because the answer ended while it was opening. */
export function afterMicOpened(opened: boolean, state: SpeakingFlow): 'record' | 'stop' | 'problem' {
  if (!opened) return 'problem';
  return state === 'running' ? 'record' : 'stop';
}

/** What Exit asks before leaving, or undefined when nothing would be lost. */
export function speakingExitWarning(state: SpeakingFlow, recording: boolean): string | undefined {
  if (state === 'transcribing') return 'Your answer is still being checked. If you leave now, it is lost.';
  if (recording) return 'You are recording an answer. If you leave now, the recording is lost.';
  return undefined;
}
