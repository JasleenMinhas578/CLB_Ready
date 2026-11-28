import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { Emoji } from '@/components/Emoji';
import { LevelMeter } from '@/components/LevelMeter';
import { openMicrophone } from '@/services/audio/recorder';
import { useMicLevel } from '@/services/audio/useMicLevel';
import { MIC_PROBLEM_TEXT, micProblemFrom, type MicProblem } from '@/services/audio/analysis';

/** Heard speech above this level at least once = the mic works. */
const HEARD_LEVEL = 0.25;

interface MicCheckProps {
  onReady: () => void;
  onCancel: () => void;
}

/**
 * Asks for the microphone and shows a live meter, so learners know they're
 * heard before the timer starts. Audio here is never recorded.
 */
export function MicCheck({ onReady, onCancel }: MicCheckProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [problem, setProblem] = useState<MicProblem | null>(null);
  const [heard, setHeard] = useState(false);
  const level = useMicLevel(stream);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (level >= HEARD_LEVEL) setHeard(true);
  }, [level]);

  // Always release the microphone when leaving the check.
  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  const turnOn = async () => {
    setProblem(null);
    try {
      const opened = await openMicrophone();
      streamRef.current = opened;
      setStream(opened);
    } catch (error) {
      setProblem(micProblemFrom(error));
    }
  };

  const finish = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
    onReady();
  };

  if (problem) {
    const text = MIC_PROBLEM_TEXT[problem];
    return (
      <div className="mic-check" role="alert">
        <Emoji symbol="🙉" size="xl" />
        <h2>{text.title}</h2>
        <p>{text.help}</p>
        <div className="row-actions center">
          <Button onClick={turnOn}>Try again</Button>
          <Button variant="secondary" onClick={onCancel}>Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mic-check">
      <Emoji symbol="🎙️" size="xl" />
      <h2>Quick microphone check</h2>
      {!stream ? (
        <>
          <p>Find a quiet room. Your browser will ask to use the microphone. Nothing is recorded during this check.</p>
          <div className="row-actions center">
            <Button onClick={turnOn}>Turn on microphone</Button>
            <Button variant="secondary" onClick={onCancel}>Back</Button>
          </div>
        </>
      ) : (
        <>
          <p>Say “Hello, I’m ready to practise.” The bars below should light up.</p>
          <LevelMeter level={level} />
          <p className={`mic-verdict ${heard ? 'is-good' : ''}`} aria-live="polite">
            {heard ? 'We can hear you clearly.' : 'Listening…'}
          </p>
          <div className="row-actions center">
            <Button onClick={finish} disabled={!heard}>Sounds good, start</Button>
            {!heard && <Button variant="quiet" onClick={finish}>Skip check</Button>}
          </div>
        </>
      )}
    </div>
  );
}
