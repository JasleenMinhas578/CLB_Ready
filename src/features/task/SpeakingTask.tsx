import { useEffect, useRef, useState } from 'react';
import type { SpeakingTaskType } from '@/domain/tasks/types';
import { useSession } from '@/app/session';
import { navigate } from '@/app/router';
import { DEFAULT_GOAL, newAttemptId } from '@/domain/attempt';
import { measureSpeaking } from '@/domain/measure/speakingMetrics';
import type { PracticePrompt } from '@/content/types';
import { Button } from '@/components/Button';
import { Emoji } from '@/components/Emoji';
import { LevelMeter } from '@/components/LevelMeter';
import { TimerRing } from '@/components/TimerRing';
import { getSpeechEngine, useSpeechStatus, type SpeechEngineStore } from '@/services/ai/speechEngine';
import { getFeedbackEngine } from '@/services/ai/feedbackEngine';
import { WHISPER_SAMPLE_RATE, toWhisperAudio } from '@/services/audio/recorder';
import { useMicLevel } from '@/services/audio/useMicLevel';
import { MIC_PROBLEM_TEXT, checkRecording, type RecordingProblem } from '@/services/audio/analysis';
import { buildSpeakingPhases } from './phases';
import { useCountdown } from './useCountdown';
import { useAnswerRecorder } from './useAnswerRecorder';
import { MicCheck } from './MicCheck';
import { SpeechModelBadge } from './SpeechModelBadge';

type FlowState = 'ready' | 'mic-check' | 'running' | 'transcribing' | 'problem';

const PROBLEM_TEXT: Record<Exclude<RecordingProblem, null>, { title: string; help: string }> = {
  'too-short': { title: 'That answer was very short', help: 'Try again and keep speaking until the timer ends.' },
  'too-quiet': { title: 'We couldn’t hear you', help: 'Move closer to the microphone or speak a little louder, then try again.' },
};

/**
 * Timed speaking flow: (choose) → prepare → speak → transcribe → results.
 * Both AI models load in the background while the learner reads and prepares:
 * speech first (needed first), then the feedback model.
 */
export function SpeakingTask({ task, prompt, moduleId }: { task: SpeakingTaskType; prompt: PracticePrompt; moduleId: string }) {
  const { goal, micReady, setMicReady, setLastAttempt } = useSession();
  const phases = buildSpeakingPhases(task.timing);
  const [state, setState] = useState<FlowState>('ready');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [problem, setProblem] = useState<{ title: string; help: string } | null>(null);
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
      // Feedback model second, so it never slows down the speech model.
      void store.preload().then(async () => {
        if (!cancelled) await (await getFeedbackEngine()).preload();
      });
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
      const metrics = measureSpeaking({
        text: transcript.text,
        words: transcript.words,
        answerSeconds: phase.seconds,
        recordedSeconds: recording.durationSeconds,
      });
      setLastAttempt({
        id: newAttemptId(),
        moduleId,
        taskTypeId: task.id,
        taskTitle: `Speaking task ${task.order}: ${task.title}`,
        promptText: prompt.options ? `${prompt.text} Options: ${prompt.options.join(' / ')}` : prompt.text,
        checklist: prompt.checklist,
        goal: goal ?? DEFAULT_GOAL,
        goalChosen: goal !== null,
        transcript: transcript.text,
        words: transcript.words,
        recordedSeconds: recording.durationSeconds,
        transcribeMs: transcript.elapsedMs,
        metrics,
      });
      navigate('/results');
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
    setState('ready');
  };

  const steps = (
    <ol className="phase-steps" aria-label="Task steps">
      {phases.map((item, index) => {
        const finished = index < phaseIndex || state === 'transcribing';
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
