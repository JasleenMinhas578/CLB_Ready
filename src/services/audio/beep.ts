import { timerSoundsOn } from './timerSounds';

export type BeepKind = 'start' | 'end';

const SECONDS = 0.18;
/** Silence between queued beeps, so "end" then "start" sound like two notes. */
const GAP = 0.08;
const PEAK_GAIN = 0.12;
/** A5 to start, a softer-sounding E5 to end. */
const PITCH: Record<BeepKind, number> = { start: 880, end: 659 };

let context: AudioContext | null = null;
/** Audio-clock time when the last queued beep finishes. */
let busyUntil = 0;

function getContext(): AudioContext | null {
  try {
    context ??= new AudioContext();
  } catch {
    return null;
  }
  return context;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Call from a click (Start, Play): browsers only let audio start after one,
 * and beeps that come later from a timer have no click of their own.
 */
export function unlockBeeps() {
  if (timerSoundsOn()) void getContext()?.resume().catch(() => {});
}

/**
 * Plays a short, soft beep if timer sounds are on. Resolves once it has
 * finished playing, so the mic can open after it without recording it.
 */
export async function playBeep(kind: BeepKind): Promise<void> {
  if (!timerSoundsOn()) return;
  const ctx = getContext();
  if (!ctx) return;
  const isRunning = () => ctx.state === 'running';
  if (!isRunning()) await Promise.race([ctx.resume().catch(() => {}), wait(300)]);
  // Still blocked: skip it, or it would play late, maybe during a recording.
  if (!isRunning()) return;

  const at = Math.max(ctx.currentTime, busyUntil);
  busyUntil = at + SECONDS + GAP;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = PITCH[kind];
  // Fade in and out so it doesn't click.
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(PEAK_GAIN, at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + SECONDS);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(at);
  oscillator.stop(at + SECONDS + 0.02);
  oscillator.onended = () => gain.disconnect();

  const latency = ctx.outputLatency || ctx.baseLatency || 0;
  await wait((at + SECONDS - ctx.currentTime + latency) * 1000 + 50);
}
