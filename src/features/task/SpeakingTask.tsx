import { useEffect, useRef, useState } from 'react';
import type { SpeakingTaskType } from '@/domain/tasks/types';
import { useSession } from '@/app/session';
import { Button, LinkButton } from '@/components/Button';
import { Emoji } from '@/components/Emoji';
import { LevelMeter } from '@/components/LevelMeter';
import { TimerRing } from '@/components/TimerRing';
import { getSpeechEngine, useSpeechStatus, type SpeechEngineStore } from '@/services/ai/speechEngine';
import { WHISPER_SAMPLE_RATE, toWhisperAudio } from '@/services/audio/recorder';
import { useMicLevel } from '@/services/audio/useMicLevel';
import { MIC_PROBLEM_TEXT, checkRecording, wordsPerMinute, type RecordingProblem } from '@/services/audio/analysis';
import { buildSpeakingPhases } from './phases';
import { useCountdown } from './useCountdown';
import { useAnswerRecorder } from './useAnswerRecorder';
import { MicCheck } from './MicCheck';
import { SpeechModelBadge } from './SpeechModelBadge';

type FlowState = 'ready' | 'mic-check' | 'running' | 'transcribing' | 'done' | 'problem';

interface AnswerResult {
  text: string;
  wordCount: number;
  recordedSeconds: number;
  wpm: number;
  transcribeMs: number;
}

const PROBLEM_TEXT: Record<Exclude<RecordingProblem, null>, { title: string; help: string }> = {
  'too-short': { title: 'That answer was very short', help: 'Try again and keep speaking until the timer ends.' },
  'too-quiet': { title: 'We couldn’t hear you', help: 'Move closer to the microphone or speak a little louder, then try again.' },
};

/**
 * Timed speaking flow: (choose) → prepare → speak → transcribe → done.
 * The speech model loads in the background as soon as this screen opens.
 */
export function SpeakingTask({ task }: { task: SpeakingTaskType }) {
  const { micReady, setMicReady } = useSession();
  const phases = buildSpeakingPhases(task.timing);
  const [state, setState] = useState<FlowState>('ready');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [problem, setProblem] = useState<{ title: string; help: string } | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const phase = phases[phaseIndex];

  const [engine, setEngine] = useState<SpeechEngineStore | null>(null);
  const speechStatus = useSpeechStatus(engine);
  const recorder = useAnswerRecorder();
  const level = useMicLevel(recorder.stream);
  const recordingStarted = useRef(false);

  // Start downloading or warming the speech model during instructions and prep.
  useEffect(() => {
    let cancelled = false;
    void getSpeechEngine().then((store) => {
      if (cancelled) return;
      setEngine(store);
      store.preload();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Turn the microphone on exactly when the speaking phase begins.
  useEffect(() => {
    if (state !== 'running' || phase.id !== 'answer' || recordingStarted.current) return;
    recordingStarted.current = true;
    void recorder.start(phase.seconds).then((ok) => {
      if (!ok) setState('problem');
    });
  }, [state, phase.id, phase.seconds, recorder.start]);

  const finishAnswer = async () => {
    setState('transcribing');
    try {
      const recording = await recorder.stop();
      if (!recording) throw new Error('No recording was made.');
      const audio = await toWhisperAudio(recording.blob);
      const issue = checkRecording(audio, WHISPER_SAMPLE_RATE);
      if (issue) {
        setProblem(PROBLEM_TEXT[issue]);
        setState('problem');
        return;
      }
      const store = engine ?? (await getSpeechEngine());
      const transcript = await store.transcribe(audio);
      const words = transcript.words.length || transcript.text.split(/\s+/).filter(Boolean).length;
      setResult({
        text: transcript.text,
        wordCount: words,
        recordedSeconds: recording.durationSeconds,
        wpm: wordsPerMinute(words, recording.durationSeconds),
        transcribeMs: transcript.elapsedMs,
      });
      setState('done');
    } catch (error) {
      setProblem({
        title: 'We couldn’t turn your answer into text',
        help: error instanceof Error ? error.message : 'Please try again.',
      });
      setState('problem');
    }
  };

  const advance = () => {
    if (phaseIndex < phases.length - 1) setPhaseIndex(phaseIndex + 1);
    else void finishAnswer();
  };

  const secondsLeft = useCountdown(phase.seconds, state === 'running', advance, phase.id);
  const speaking = state === 'running' && phase.id === 'answer';

  const begin = () => setState(micReady ? 'running' : 'mic-check');

  const restart = () => {
    void recorder.stop();
    recordingStarted.current = false;
    setPhaseIndex(0);
    setProblem(null);
    setResult(null);
    setState('ready');
  };

  const steps = (
    <ol className="phase-steps" aria-label="Task steps">
      {phases.map((item, index) => {
        const finished = index < phaseIndex || state === 'transcribing' || state === 'done';
        const current = index === phaseIndex && state === 'running';
        return (
          <li key={item.id} className={current ? 'is-current' : finished ? 'is-done' : ''}>
            {item.label} <small>{item.seconds}s</small>
          </li>
        );
      })}
    </ol>
  );

  if (state === 'mic-check') {
    return (
      <div className="flow-panel">
        <MicCheck
          onReady={() => {
            setMicReady(true);
            setState('running');
          }}
          onCancel={() => setState('ready')}
        />
      </div>
    );
  }

  if (state === 'problem') {
    const text = problem ?? MIC_PROBLEM_TEXT[recorder.problem ?? 'unknown'];
    return (
      <div className="flow-panel flow-done" role="alert">
        <Emoji symbol="🙉" size="xl" />
        <h2>{text.title}</h2>
        <p>{text.help}</p>
        <div className="row-actions">
          <Button onClick={restart}>Try again</Button>
        </div>
      </div>
    );
  }

  if (state === 'transcribing') {
    return (
      <div className="flow-panel">
        {steps}
        <div className="flow-done" aria-live="polite">
          <Emoji symbol="🤔" size="xl" motion="wiggle" />
          <h2>Listening back to your answer…</h2>
          <p>This happens on your device. It usually takes a few seconds.</p>
          <SpeechModelBadge status={speechStatus} />
        </div>
      </div>
    );
  }

  if (state === 'done' && result) {
    return (
      <div className="flow-panel">
        {steps}
        <div className="flow-done">
          <Emoji symbol="🎉" size="xl" motion="bounce" />
          <h2>Nice work! Here’s what we heard.</h2>
        </div>
        <blockquote className="transcript">{result.text || '(No words detected)'}</blockquote>
        <div className="answer-stats">
          <div><strong>{result.wordCount}</strong><span>words</span></div>
          <div><strong>{result.wpm}</strong><span>words per minute</span></div>
          <div><strong>{Math.round(result.recordedSeconds)}s</strong><span>of {phase.seconds}s used</span></div>
        </div>
        <p className="fine-print">
          Full feedback on your answer arrives in the next build step. Transcribed in {(result.transcribeMs / 1000).toFixed(1)}s on this device.
        </p>
        <div className="row-actions center">
          <LinkButton to="/results/sample">See sample results</LinkButton>
          <Button variant="secondary" onClick={restart}>Try again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flow-panel">
      {steps}
      <div className="flow-live">
        <TimerRing secondsLeft={secondsLeft} totalSeconds={phase.seconds} label={phase.label} />
        <div className="mic-area">
          <span className={`mic-dot ${speaking ? 'is-live' : ''}`}>
            <Emoji symbol="🎤" size="lg" motion={speaking ? 'pulse' : 'none'} label="Microphone" />
          </span>
          {speaking ? (
            <>
              <LevelMeter level={level} />
              <p className="mic-note">Recording. Speak until the timer ends.</p>
            </>
          ) : (
            <p className="mic-note">
              {state === 'ready'
                ? 'Read the task, then start. Recording begins when the speaking time starts.'
                : 'Plan your answer. Recording starts automatically.'}
            </p>
          )}
        </div>
        <div className="row-actions">
          {state === 'ready' ? (
            <Button onClick={begin}>Start the task</Button>
          ) : (
            <Button variant="secondary" onClick={advance}>
              {phase.id === 'answer' ? 'Finish answer' : 'Skip to next step'}
            </Button>
          )}
        </div>
        <SpeechModelBadge status={speechStatus} />
      </div>
    </div>
  );
}
