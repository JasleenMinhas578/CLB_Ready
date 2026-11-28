import { useCallback, useEffect, useRef, useState } from 'react';
import { startRecording, type Recording, type RecordingSession } from '@/services/audio/recorder';
import { micProblemFrom, type MicProblem } from '@/services/audio/analysis';

/** Asks the browser to confirm before closing or reloading mid-answer. */
function warnBeforeLeaving(event: BeforeUnloadEvent) {
  event.preventDefault();
}

/**
 * Opens the mic, but turns it straight off again if the screen closed while the
 * browser was asking for it; otherwise it would keep recording with no one to stop it.
 */
export async function startUnlessLeft(open: () => Promise<RecordingSession>, left: () => boolean): Promise<RecordingSession | null> {
  const session = await open();
  if (!left()) return session;
  session.stop();
  return null;
}

/**
 * Records one spoken answer. The recording is discarded if the learner
 * leaves the screen mid-answer, and the mic is always released.
 */
export function useAnswerRecorder() {
  const session = useRef<RecordingSession | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [problem, setProblem] = useState<MicProblem | null>(null);
  const unmounted = useRef(false);

  const start = useCallback(async (maxSeconds: number): Promise<boolean> => {
    setProblem(null);
    try {
      // A little extra time so the timer, not the recorder, ends the answer.
      const opened = await startUnlessLeft(() => startRecording(maxSeconds + 2), () => unmounted.current);
      if (!opened) return false;
      session.current = opened;
      setStream(session.current.stream);
      window.addEventListener('beforeunload', warnBeforeLeaving);
      return true;
    } catch (error) {
      setProblem(micProblemFrom(error));
      return false;
    }
  }, []);

  const stop = useCallback(async (): Promise<Recording | null> => {
    const current = session.current;
    session.current = null;
    setStream(null);
    window.removeEventListener('beforeunload', warnBeforeLeaving);
    if (!current) return null;
    current.stop();
    return current.finished;
  }, []);

  useEffect(() => {
    unmounted.current = false;
    return () => {
      unmounted.current = true;
      window.removeEventListener('beforeunload', warnBeforeLeaving);
      session.current?.stop();
      session.current = null;
    };
  }, []);

  return { start, stop, stream, problem };
}
