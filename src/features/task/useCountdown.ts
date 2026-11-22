import { useEffect, useRef, useState } from 'react';

/**
 * Counts down from `seconds` while `running` is true and calls `onDone`
 * once at zero. Uses timestamps, not tick counting, so it stays accurate
 * when the browser throttles timers in background tabs.
 * Changing `seconds` or `resetKey` (moving to the next phase) restarts it.
 */
export function useCountdown(
  seconds: number,
  running: boolean,
  onDone: () => void,
  /** Change this to restart, even when `seconds` is the same (task 6: 60s then 60s). */
  resetKey: string = '',
): number {
  const [left, setLeft] = useState(seconds);
  const leftRef = useRef(seconds);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Runs before the timer effect below, so a new phase starts full.
  useEffect(() => {
    leftRef.current = seconds;
    setLeft(seconds);
  }, [seconds, resetKey]);

  useEffect(() => {
    if (!running) return;
    const endsAt = performance.now() + leftRef.current * 1000;
    let finished = false;
    const id = window.setInterval(() => {
      const remaining = Math.max(0, (endsAt - performance.now()) / 1000);
      leftRef.current = remaining;
      setLeft(remaining);
      if (remaining <= 0 && !finished) {
        finished = true;
        window.clearInterval(id);
        onDoneRef.current();
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [running, seconds, resetKey]);

  return left;
}
