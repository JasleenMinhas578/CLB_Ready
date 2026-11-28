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
import { getSpeechEngine, type SpeechEngineStore } from '@/services/ai/speechEngine';
import { useModelStatus } from '@/services/ai/modelStore';
import { getFeedbackEngine } from '@/services/ai/feedbackEngine';
import { friendlyModelError } from '@/services/ai/errorText';
import { WHISPER_SAMPLE_RATE, toWhisperAudio } from '@/services/audio/recorder';
import { useMicLevel } from '@/services/audio/useMicLevel';
import { playBeep, unlockBeeps } from '@/services/audio/beep';
import { MIC_PROBLEM_TEXT, checkRecording, type RecordingProblem } from '@/services/audio/analysis';
import { buildSpeakingPhases } from './phases';
import { useCountdown } from './useCountdown';
import { useAnswerRecorder } from './useAnswerRecorder';
import { MicCheck } from './MicCheck';
import { SpeechModelBadge } from './SpeechModelBadge';
import { ModelPlanBadge } from './ModelPlanBadge';
import { ExamBar, TimeWarning, WarnIcon } from './exam/ExamBar';
import { speakingActionLabel, speakingExitWarning, type SpeakingFlow } from './exam/speakingStatus';
import { PromptPanel } from './exam/PromptPanel';
import { PhaseTimer } from './exam/PhaseTimer';

const PROBLEM_TEXT: Record<Exclude<RecordingProblem, null>, { title: string; help: string }> = {
  'too-short': { title: 'That answer was very short', help: 'Try again and keep speaking until the timer ends.' },
  'too-quiet': { title: 'We could not hear you', help: 'Move closer to the microphone or speak a little louder, then try again.' },
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
  const [state, setState] = useState<SpeakingFlow>('ready');
  const stateRef = useRef(state);
  stateRef.current = state;
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [problem, setProblem] = useState<{ title: string; help: string } | null>(null);
  const [selected, setSelected] = useState<0 | 1 | null>(null);
  const phase = phases[phaseIndex];
  const total = getTaskTypesForSkill('speaking').length;

  const [engine, setEngine] = useState<SpeechEngineStore | null>(null);
  const speechStatus = useModelStatus(engine);
  const recorder = useAnswerRecorder();
  const level = useMicLevel(recorder.stream);
  const recordingStarted = useRef(false);
  const statusPanel = useRef<HTMLElement>(null);
  // Saving outlives the screen if the learner exits, so it checks this before showing results.
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // On narrow screens the status panel sits below the task text, so bring "Saving…" into view.
  // 'nearest' leaves the page alone when the panel is already visible.
  useEffect(() => {
    if (state === 'transcribing') statusPanel.current?.scrollIntoView({ block: 'nearest' });
  }, [state]);

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

  // Turn the microphone on exactly when the recording phase begins,
  // after its start beep has finished so the beep isn't in the recording.
  useEffect(() => {
    if (state !== 'running' || phase.id !== 'answer' || recordingStarted.current) return;
    recordingStarted.current = true;
    void playBeep('start').then(async () => {
      // The learner may have left or pressed Finish during the beep.
      if (!mounted.current || stateRef.current !== 'running') return;
      if (!(await recorder.start(phase.seconds))) setState('problem');
    });
  }, [state, phase.id, phase.seconds, recorder.start]);

  const finishAnswer = async () => {
    setState('transcribing');
    try {
      const recording = await recorder.stop();
      if (!recording) throw new Error('No recording was made.');
      // Only now, with the recorder stopped, so the end beep isn't recorded.
      if (mounted.current) void playBeep('end');
      const audio = await toWhisperAudio(recording.blob);
      const issue = checkRecording(audio, WHISPER_SAMPLE_RATE);
      if (issue) {
        setProblem(PROBLEM_TEXT[issue]);
        setState('problem');
        return;
      }
      const store = engine ?? (await getSpeechEngine());
      const transcript = await store.transcribe(audio);
      if (!mounted.current) return;
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
      if (!mounted.current) return;
      setProblem({
        title: 'We could not turn your answer into text',
        help: friendlyModelError(error, 'Try again. If it happens again, reload the page.'),
      });
      setState('problem');
    }
  };

  const advance = () => {
    if (phaseIndex < phases.length - 1) setPhaseIndex(phaseIndex + 1);
    else void finishAnswer();
  };

  const running = state === 'running';
  // The answer's beeps are played above, around the recording.
  const secondsLeft = useCountdown(phase.seconds, running, advance, phase.id, phase.id !== 'answer');

  const begin = () => {
    unlockBeeps();
    setState(micReady ? 'running' : 'mic-check');
  };

  const restart = () => {
    void recorder.stop();
    recordingStarted.current = false;
    setPhaseIndex(0);
    setProblem(null);
    setSelected(null);
    setState('ready');
  };

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
        <h2><WarnIcon /> {text.title}</h2>
        <p>{text.help}</p>
        <Button onClick={restart}>Try again</Button>
      </div>
    );
  } else if (state === 'transcribing') {
    panel = (
      <div className="exam-message" aria-live="polite">
        <h2>
          <span className="spinner" aria-hidden="true" />
          Saving your answer…
        </h2>
        <p>This device is turning your answer into text. This usually takes a few seconds. Your results then open by themselves.</p>
        {/* "Ready" would read as nothing happening; loading progress and errors still help. */}
        {speechStatus.state !== 'ready' && <SpeechModelBadge status={speechStatus} />}
      </div>
    );
  } else if (state === 'ready') {
    panel = (
      <div className="exam-message">
        <h2>Press Start when you’re ready</h2>
        <p>
          Read the task first. When you press Start, {micReady ? '' : 'we check your microphone, then '}
          {phases[0].id === 'select' ? 'the choosing time' : 'the preparation time'} begins.
          Recording starts by itself after that. Keep speaking until the recording time ends.
        </p>
        <Button onClick={begin}>Start</Button>
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
        exitWarning={speakingExitWarning(state, recorder.stream !== null)}
        action={
          <button
            type="button"
            className="exam-next exam-next-fixed exam-next-wide"
            onClick={running ? advance : begin}
            disabled={state === 'transcribing' || state === 'mic-check' || state === 'problem'}
            aria-busy={state === 'transcribing'}
          >
            {state === 'transcribing' && <span className="spinner" aria-hidden="true" />}
            {speakingActionLabel(state, phase.id)}
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
        <section ref={statusPanel} className="exam-panel status-panel" aria-label="Timers">
          {panel}
          <TimeWarning secondsLeft={secondsLeft} totalSeconds={phase.seconds} muted={phase.id === 'answer'} />
        </section>
      </div>

      <div className="exam-meta">
        <span>Find a quiet room. Your recording stays on this device.</span>
        <ModelPlanBadge />
      </div>
    </div>
  );
}
