/** 82 -> "1:22". Rounds up, so the clock never shows 0:00 while time is left. */
export function formatSeconds(total: number): string {
  const safe = Math.max(0, Math.ceil(total));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
