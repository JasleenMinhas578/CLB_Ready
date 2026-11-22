import { useState } from 'react';
import type { SpeakingTaskType } from '@/domain/tasks/types';
import { Button, LinkButton } from '@/components/Button';
import { Emoji } from '@/components/Emoji';
import { TimerRing } from '@/components/TimerRing';
import { buildSpeakingPhases } from './phases';
import { useCountdown } from './useCountdown';

type FlowState = 'ready' | 'running' | 'done';

/**
 * Timed speaking flow: (choose) → prepare → speak → done.
 * Recording and transcription plug in at the "Speak" phase in week 2.
 */
export function SpeakingTask({ task }: { task: SpeakingTaskType }) {
  const phases = buildSpeakingPhases(task.timing);
  const [state, setState] = useState<FlowState>('ready');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phase = phases[phaseIndex];

  const advance = () => {
    if (phaseIndex < phases.length - 1) setPhaseIndex(phaseIndex + 1);
    else setState('done');
  };

  const secondsLeft = useCountdown(phase.seconds, state === 'running', advance, phase.id);
  const speaking = state === 'running' && phase.id === 'answer';

  const restart = () => {
    setPhaseIndex(0);
    setState('ready');
  };

  return (
    <div className="flow-panel">
      <ol className="phase-steps" aria-label="Task steps">
        {phases.map((item, index) => (
          <li
            key={item.id}
            className={index === phaseIndex && state !== 'done' ? 'is-current' : index < phaseIndex || state === 'done' ? 'is-done' : ''}
          >
            {item.label} <small>{item.seconds}s</small>
          </li>
        ))}
      </ol>

      {state === 'done' ? (
        <div className="flow-done">
          <Emoji symbol="🎉" size="xl" motion="bounce" />
          <h2>Time's up. Nice work!</h2>
          <p>Recording and real feedback arrive in the next build step. For now, see how results will look.</p>
          <div className="row-actions">
            <LinkButton to="/results/sample">See sample results</LinkButton>
            <Button variant="secondary" onClick={restart}>Try again</Button>
          </div>
        </div>
      ) : (
        <div className="flow-live">
          <TimerRing secondsLeft={secondsLeft} totalSeconds={phase.seconds} label={phase.label} />
          <div className="mic-area">
            <span className={`mic-dot ${speaking ? 'is-live' : ''}`}>
              <Emoji symbol="🎤" size="lg" motion={speaking ? 'pulse' : 'none'} label="Microphone" />
            </span>
            <p className="mic-note">
              {speaking ? 'Speak now. Recording is switched on in the next step.' : 'The microphone turns on when the speaking time starts.'}
            </p>
          </div>
          <div className="row-actions">
            {state === 'ready' ? (
              <Button onClick={() => setState('running')}>Start the timer</Button>
            ) : (
              <Button variant="secondary" onClick={advance}>
                {phase.id === 'answer' ? 'Finish answer' : 'Skip to next step'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
