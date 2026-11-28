import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { LevelMeter } from '@/components/LevelMeter';
import { openMicrophone } from '@/services/audio/recorder';
import { useMicLevel } from '@/services/audio/useMicLevel';
import { MIC_PROBLEM_TEXT, micProblemFrom, type MicProblem } from '@/services/audio/analysis';

/** Heard speech above this level at least once = the mic works. */
const HEARD_LEVEL = 0.25;
/** Long enough to read "We can hear you" before the timers start. */
const CONTINUE_AFTER_MS = 1200;

interface MicCheckProps {
  onReady: () => void;
  onCancel: () => void;
}

/**
 * Turns the microphone on straight away and shows a live meter. As soon as it
 * hears the learner it carries on by itself, so a working mic costs no extra
 * click. Audio here is never recorded.
 */
export function MicCheck({ onReady, onCancel }: MicCheckProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [problem, setProblem] = useState<MicProblem | null>(null);
  const [heard, setHeard] = useState(false);
  const level = useMicLevel(stream);
  const streamRef = useRef<MediaStream | null>(null);
  // Each request gets a number; a reply to an older request (or after leaving) is thrown away.
  const attempt = useRef(0);

  useEffect(() => {
    if (level >= HEARD_LEVEL) setHeard(true);
  }, [level]);

  const release = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const turnOn = useCallback(async () => {
    const id = ++attempt.current;
    setProblem(null);
    try {
      const opened = await openMicrophone();
      // The learner may have left while the browser was asking for permission.
      if (id !== attempt.current) {
        opened.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = opened;
      setStream(opened);
    } catch (error) {
      if (id === attempt.current) setProblem(micProblemFrom(error));
    }
  }, []);

  // Start pressed is the request, so ask for the mic now. Always release it when leaving the check.
  useEffect(() => {
    void turnOn();
    return () => {
      attempt.current += 1;
      release();
    };
  }, [turnOn]);

  // Read through a ref so a parent re-render (model download progress) doesn't restart the timer below.
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const finish = useCallback(() => {
    release();
    setStream(null);
    onReadyRef.current();
  }, []);

  useEffect(() => {
    if (!heard) return;
    const timer = setTimeout(finish, CONTINUE_AFTER_MS);
    return () => clearTimeout(timer);
  }, [heard, finish]);

  if (problem) {
    const text = MIC_PROBLEM_TEXT[problem];
    return (
      <div className="mic-check" role="alert">
        <h2><Icon name="mic-off" /> {text.title}</h2>
        <p>{text.help}</p>
        <div className="exam-actions">
          <Button onClick={turnOn}>Try again</Button>
          <Button variant="secondary" onClick={onCancel}>Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mic-check">
      <h2><Icon name="mic" /> Microphone check</h2>
      {!stream ? (
        <p className="busy-status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          Turning on the microphone. If your browser asks, choose Allow.
        </p>
      ) : (
        <>
          <p>Say “Hello, I’m ready.” The task starts when we hear you. Nothing is recorded during this check.</p>
          <LevelMeter level={level} />
          <p className={`mic-verdict ${heard ? 'is-good' : ''}`} aria-live="polite">
            {heard ? 'We can hear you. Starting the task…' : 'Listening…'}
          </p>
          {!heard && (
            <div className="exam-actions">
              <Button variant="quiet" onClick={finish}>Start without the check</Button>
              <Button variant="quiet" onClick={onCancel}>Back</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
