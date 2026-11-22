interface TimerRingProps {
  secondsLeft: number;
  totalSeconds: number;
  label: string;
}

export function formatSeconds(total: number): string {
  const safe = Math.max(0, Math.ceil(total));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/** Circular countdown. Turns lemon in the last 10 seconds. */
export function TimerRing({ secondsLeft, totalSeconds, label }: TimerRingProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const fraction = totalSeconds > 0 ? Math.max(0, secondsLeft) / totalSeconds : 0;
  const urgent = secondsLeft <= 10 && secondsLeft > 0;

  return (
    <div className={`timer-ring ${urgent ? 'timer-urgent' : ''}`} role="timer" aria-live="off">
      <svg viewBox="0 0 128 128" width="128" height="128" aria-hidden="true">
        <circle cx="64" cy="64" r={radius} className="timer-track" />
        <circle
          cx="64" cy="64" r={radius}
          className="timer-fill"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
          transform="rotate(-90 64 64)"
        />
      </svg>
      <div className="timer-text">
        <strong>{formatSeconds(secondsLeft)}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
