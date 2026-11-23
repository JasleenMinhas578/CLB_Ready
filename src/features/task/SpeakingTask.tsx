import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { SpeakingTaskType } from '@/domain/tasks/types';
import { useSession } from '@/app/session';
import { navigate } from '@/app/router';
import { DEFAULT_GOAL, newAttemptId } from '@/domain/attempt';
import { measureSpeaking } from '@/domain/measure/speakingMetrics';
import { getTaskTypesForSkill } from '@/domain/tasks/catalog';
import type { PracticePrompt } from '@/content/types';
import { promptForModel } from '@/content/promptText';
import { Button } from '@/components/Button';
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
import { ModelPlanBadge } from './ModelPlanBadge';
import { ExamBar } from './exam/ExamBar';
import { PromptPanel } from './exam/PromptPanel';
import { PhaseTimer } from './exam/PhaseTimer';

type FlowState = 'ready' | 'mic-check' | 'running' | 'transcribing' | 'problem';

const PROBLEM_TEXT: Record<Exclude<RecordingProblem, null>, { title: string; help: string }> = {
  'too-short': { title: 'That answer was very short', help: 'Try again and keep speaking until the timer ends.' },
  'too-quiet': { title: 'We couldn’t hear you', help: 'Move closer to the microphone or speak a little louder, then try again.' },
};

interface SpeakingTaskProps {
  task: SpeakingTaskType;
  prompt: PracticePrompt;
  moduleId: string;
}

/**
 * Test-style speaking task: (choose) → preparation → recording, each
 * starting automatically, then transcription and results.
 * Both AI models load in the background while the learner reads and prepares:
 * speech first (needed first), then the feedback model.
 */
export function SpeakingTask({ task, prompt, moduleId }: SpeakingTaskProps) {
  const { goal, micReady, setMicReady, setLastAttempt } = useSession();
  const phases = buildSpeakingPhases(task.timing);
  const [state, setState] = useState<FlowState>('ready');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [problem, setProblem] = useState<{ title: string; help: string } | null>(null);
  const [selected, setSelected] = useState<0 | 1 | null>(null);
  const phase = phases[phaseIndex];
  const total = getTaskTypesForSkill('speaking').length;

  const [engine, setEngine] = useState<SpeechEngineStore | null>(null);
  const speechStatus = useSpeechStatus(engine);
  const recorder = useAnswerRecorder();
  const level = useMicLevel(recorder.stream);
  const recordingStarted = useRef(false);

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

  // Turn the microphone on exactly when the recording phase begins.
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
        skill: 'speaking',
        id: newAttemptId(),
        moduleId,
        taskTypeId: task.id,
        taskTitle: `Speaking task ${task.order}: ${task.title}`,
        promptText: promptForModel(prompt, selected),
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

  const running = state === 'running';
  const secondsLeft = useCountdown(phase.seconds, running, advance, phase.id);

  const restart = () => {
    void recorder.stop();
    recordingStarted.current = false;
    setPhaseIndex(0);
    setProblem(null);
    setSelected(null);
    setState('ready');
  };

  const nextLabel = !running ? 'Next' : phase.id === 'answer' ? 'Finish answer' : 'Skip';

  let panel: ReactNode;
  if (state === 'mic-check') {
    panel = (
      <MicCheck
        onReady={() => {
          setMicReady(true);
          setState('running');
        }}
        onCancel={() => setState('ready')}
      />
    );
  } else if (state === 'problem') {
    const text = problem ?? MIC_PROBLEM_TEXT[recorder.problem ?? 'unknown'];
    panel = (
      <div className="exam-message" role="alert">
        <h2>{text.title}</h2>
        <p>{text.help}</p>
        <Button onClick={restart}>Try again</Button>
      </div>
    );
  } else if (state === 'transcribing') {
    panel = (
      <div className="exam-message" aria-live="polite">
        <h2>Saving your response…</h2>
        <p>Your answer is being turned into text on this device. This usually takes a few seconds.</p>
        <SpeechModelBadge status={speechStatus} />
      </div>
    );
  } else if (state === 'ready') {
    panel = (
      <div className="exam-message">
        <h2>Ready when you are</h2>
        <p>
          Read the task. When you press Start, {phases[0].id === 'select' ? 'the choosing time' : 'the preparation time'} begins,
          then recording starts automatically. Speak until the recording time ends.
        </p>
        <Button onClick={() => setState(micReady ? 'running' : 'mic-check')}>Start</Button>
        <SpeechModelBadge status={speechStatus} />
      </div>
    );
  } else {
    panel = (
      <div className="phase-timers">
        {phases.map((item, index) => (
          <PhaseTimer
            key={item.id}
            kind={item.id}
            totalSeconds={item.seconds}
            secondsLeft={index === phaseIndex ? secondsLeft : index < phaseIndex ? 0 : item.seconds}
            active={index === phaseIndex}
            done={index < phaseIndex}
            level={level}
          />
        ))}
        {phase.id === 'select' && (
          <p className="exam-note">Choose Option A or Option B in the task panel.</p>
        )}
      </div>
    );
  }

  return (
    <div className="exam-screen">
      <ExamBar
        position={`Speaking Task ${task.order} of ${total}`}
        title={task.title}
        exitTo={`/practice/speaking/${moduleId}`}
        action={
          <button
            type="button"
            className="exam-next"
            onClick={running ? advance : () => setState(micReady ? 'running' : 'mic-check')}
            disabled={state === 'transcribing' || state === 'mic-check' || state === 'problem'}
          >
            {nextLabel}
          </button>
        }
      />

      <div className={`exam-body ${task.needsImage ? 'exam-columns' : 'exam-stack'}`}>
        <PromptPanel
          task={task}
          prompt={prompt}
          selected={selected}
          onSelect={setSelected}
          optionsLocked={running && phase.id !== 'select'}
        />
        <section className="exam-panel status-panel" aria-label="Timers">
          {panel}
        </section>
      </div>

      <div className="exam-meta">
        <span>Find a quiet room. Your recording stays on this device.</span>
        <ModelPlanBadge needsSpeech />
      </div>
    </div>
  );
}
