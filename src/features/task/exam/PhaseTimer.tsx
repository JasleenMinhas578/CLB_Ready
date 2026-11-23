import { LevelMeter } from '@/components/LevelMeter';

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

/** One test-style timer row: label, seconds, and a bar that drains (prep) or fills (recording). */
export function PhaseTimer({ kind, secondsLeft, totalSeconds, active, done = false, level = 0 }: PhaseTimerProps) {
  const remaining = Math.max(0, Math.ceil(secondsLeft));
  const elapsed = totalSeconds - Math.max(0, secondsLeft);
  // Preparation bars drain; the recording bar fills.
  const fraction = done ? (kind === 'answer' ? 1 : 0) : active ? (kind === 'answer' ? elapsed / totalSeconds : secondsLeft / totalSeconds) : kind === 'answer' ? 0 : 1;
  const recording = kind === 'answer' && active;

  return (
    <div className={`phase-timer kind-${kind} ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}>
      <div className="phase-timer-head">
        <span className="phase-timer-label">
          {recording && <span className="rec-dot" aria-hidden="true" />}
          {recording ? 'Recording…' : LABELS[kind]}
        </span>
        <strong>{done ? 'Done' : active ? `${remaining} seconds` : `${totalSeconds} seconds`}</strong>
      </div>
      <div className="phase-bar" aria-hidden="true">
        <span style={{ width: `${Math.min(1, Math.max(0, fraction)) * 100}%` }} />
      </div>
      {recording && <LevelMeter level={level} />}
    </div>
  );
}
