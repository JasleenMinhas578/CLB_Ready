import { useCallback, useEffect, useRef, useState } from 'react';
import { startRecording, type Recording, type RecordingSession } from '@/services/audio/recorder';
import { micProblemFrom, type MicProblem } from '@/services/audio/analysis';

/**
 * Records one spoken answer. The recording is discarded if the learner
 * leaves the screen mid-answer, and the mic is always released.
 */
export function useAnswerRecorder() {
  const session = useRef<RecordingSession | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [problem, setProblem] = useState<MicProblem | null>(null);

  const start = useCallback(async (maxSeconds: number): Promise<boolean> => {
    setProblem(null);
    try {
      // A little extra time so the timer, not the recorder, ends the answer.
      session.current = await startRecording(maxSeconds + 2);
      setStream(session.current.stream);
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
    if (!current) return null;
    current.stop();
    return current.finished;
  }, []);

  useEffect(
    () => () => {
      session.current?.stop();
      session.current = null;
    },
    [],
  );

  return { start, stop, stream, problem };
}
