/** 82 -> "1:22". Rounds up, so the clock never shows 0:00 while time is left. */
export function formatSeconds(total: number): string {
  const safe = Math.max(0, Math.ceil(total));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/** Spoken and shown warnings, in seconds left. */
const WARNINGS = [300, 60, 10];

/**
 * The most recent warning the clock has passed, or null.
 * A warning only counts when the phase is longer than it, so a 90-second
 * phase never warns "5 minutes left".
 */
export function passedWarning(secondsLeft: number, totalSeconds: number): number | null {
  const passed = WARNINGS.filter((mark) => mark < totalSeconds && secondsLeft <= mark);
  return passed.length > 0 ? Math.min(...passed) : null;
}

/** 300 -> "5 minutes left", 60 -> "1 minute left", 10 -> "10 seconds left". */
export function warningText(mark: number): string {
  if (mark < 60) return `${mark} seconds left`;
  const minutes = mark / 60;
  return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} left`;
}
