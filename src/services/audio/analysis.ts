/** Small, pure audio and speech helpers. No browser APIs, so all are unit-tested. */

/** Root-mean-square loudness of a mono signal, 0 (silent) to about 1. */
export function rms(samples: Float32Array): number {
  if (samples.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i += 1) sum += samples[i] * samples[i];
  return Math.sqrt(sum / samples.length);
}

export const MIN_ANSWER_SECONDS = 3;
const SILENCE_RMS = 0.005;

export type RecordingProblem = 'too-short' | 'too-quiet' | null;

/** Flags recordings we shouldn't send to the speech model. */
export function checkRecording(samples: Float32Array, sampleRate: number): RecordingProblem {
  if (samples.length / sampleRate < MIN_ANSWER_SECONDS) return 'too-short';
  if (rms(samples) < SILENCE_RMS) return 'too-quiet';
  return null;
}

export type MicProblem = 'denied' | 'no-mic' | 'busy' | 'unsupported' | 'unknown';

/** Turns getUserMedia errors into something we can explain to the learner. */
export function micProblemFrom(error: unknown): MicProblem {
  const name = error instanceof Error || error instanceof DOMException ? error.name : '';
  switch (name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'denied';
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'no-mic';
    case 'NotReadableError':
    case 'AbortError':
      return 'busy';
    case 'TypeError':
      return 'unsupported';
    default:
      return 'unknown';
  }
}

export const MIC_PROBLEM_TEXT: Record<MicProblem, { title: string; help: string }> = {
  denied: {
    title: 'Microphone access is blocked',
    help: 'Click the lock or microphone icon in the address bar, allow the microphone for this site, then try again.',
  },
  'no-mic': {
    title: 'No microphone found',
    help: 'Plug in a headset or turn on your computer’s microphone, then try again.',
  },
  busy: {
    title: 'Your microphone is busy',
    help: 'Close other apps that may be using it, such as video calls. Then try again.',
  },
  unsupported: {
    title: 'This browser cannot record here',
    help: 'Open CLB Ready in Chrome or Edge, using a secure (https) address.',
  },
  unknown: {
    title: 'The microphone did not start',
    help: 'Check your microphone settings, then try again.',
  },
};
