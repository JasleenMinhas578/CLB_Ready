import { LevelMeter } from '@/components/LevelMeter';
import { formatSeconds } from '@/domain/timer';
import { WarnIcon } from './ExamBar';

interface PhaseTimerProps {
  kind: 'select' | 'prep' | 'answer';
  secondsLeft: number;
  totalSeconds: number;
  active: boolean;
  /** This phase has already finished. */
  done?: boolean;
  /** Mic level while recording. */
  level?: number;
}

const LABELS = { select: 'Choosing time', prep: 'Preparation time', answer: 'Recording time' } as const;

/** One test-style timer row: label, time left, and a bar that drains as the time runs out. */
export function PhaseTimer({ kind, secondsLeft, totalSeconds, active, done = false, level = 0 }: PhaseTimerProps) {
  // Every bar shows time left, so the number and the bar always move the same way.
  const fraction = done ? 0 : active ? secondsLeft / totalSeconds : 1;
  const recording = kind === 'answer' && active;
  const low = active && totalSeconds > 10 && secondsLeft <= 10;

  return (
    <div className={`phase-timer kind-${kind} ${active ? 'is-active' : ''} ${done ? 'is-done' : ''} ${low ? 'is-low' : ''}`}>
      <div className="phase-timer-head">
        <span className="phase-timer-label">
          {recording && <span className="rec-dot" aria-hidden="true" />}
          {recording ? 'Recording…' : LABELS[kind]}
        </span>
        <strong>
          {low && <WarnIcon />}
          {done ? 'Done' : active ? `${formatSeconds(secondsLeft)} left` : formatSeconds(totalSeconds)}
        </strong>
      </div>
      <div className="phase-bar" aria-hidden="true">
        <span style={{ transform: `scaleX(${Math.min(1, Math.max(0, fraction))})` }} />
      </div>
      {recording && <LevelMeter level={level} />}
    </div>
  );
}
