import type { PhaseId } from '../phases';

export type SpeakingFlow = 'ready' | 'mic-check' | 'running' | 'transcribing' | 'problem';

/** The exam bar button's label. Before the timers it says Start; while the answer is checked it says so, rather than a greyed-out "Next". */
export function speakingActionLabel(state: SpeakingFlow, phase: PhaseId): string {
  if (state === 'transcribing') return 'Checking…';
  if (state === 'ready') return 'Start';
  if (state !== 'running') return 'Next';
  return phase === 'answer' ? 'Finish answer' : 'Skip';
}

/**
 * Whether the exam bar button is off. In the answer phase it stays off until the
 * mic is actually recording: Finish during the start beep would end with no recording.
 */
export function speakingActionDisabled(state: SpeakingFlow, phase: PhaseId, recording: boolean): boolean {
  if (state === 'transcribing' || state === 'mic-check' || state === 'problem') return true;
  return state === 'running' && phase === 'answer' && !recording;
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
