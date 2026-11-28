import { useEffect, useRef, useState } from 'react';
import { playBeep } from '@/services/audio/beep';
import { timerRunBeeps } from './timerBeeps';

/**
 * Counts down from `seconds` while `running` is true and calls `onDone`
 * once at zero. Uses timestamps, not tick counting, so it stays accurate
 * when the browser throttles timers in background tabs.
 * Changing `seconds` or `resetKey` (moving to the next phase) restarts it.
 * Beeps when it starts and when it ends, including when the learner moves on
 * early, but not when the screen closes (Exit, or a screen that navigates away
 * beeps itself first).
 */
export function useCountdown(
  seconds: number,
  running: boolean,
  onDone: () => void,
  /** Change this to restart, even when `seconds` is the same (task 6: 60s then 60s). */
  resetKey: string = '',
  /** False when the caller beeps itself, like the speaking answer, which must keep beeps out of the recording. */
  beeps = true,
): number {
  const [left, setLeft] = useState(seconds);
  const leftRef = useRef(seconds);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const closing = useRef(false);

  // Declared before the timer effect, so its cleanup runs first when the screen closes.
  useEffect(() => {
    closing.current = false;
    return () => {
      closing.current = true;
    };
  }, []);

  // Runs before the timer effect below, so a new phase starts full.
  useEffect(() => {
    leftRef.current = seconds;
    setLeft(seconds);
  }, [seconds, resetKey]);

  useEffect(() => {
    if (!running) return;
    const endsAt = performance.now() + leftRef.current * 1000;
    let finished = false;
    const sounds = beeps ? timerRunBeeps((kind) => void playBeep(kind)) : null;
    const id = window.setInterval(() => {
      // On the first tick rather than now, so React's development double mount doesn't beep twice.
      sounds?.start();
      const remaining = Math.max(0, (endsAt - performance.now()) / 1000);
      leftRef.current = remaining;
      setLeft(remaining);
      if (remaining <= 0 && !finished) {
        finished = true;
        window.clearInterval(id);
        sounds?.end();
        onDoneRef.current();
      }
    }, 200);
    return () => {
      window.clearInterval(id);
      // Stopped early (Next, Skip, Finish): that ends it too. Closing the screen doesn't.
      if (!closing.current) sounds?.end();
    };
    // `beeps` is read once per run; it only changes along with `resetKey`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, seconds, resetKey]);

  return left;
}
