const BARS = 12;

/** Candy-bar microphone meter. Shows learners they're being heard. */
export function LevelMeter({ level, label = 'Microphone level' }: { level: number; label?: string }) {
  const lit = Math.round(level * BARS);
  return (
    <div className="level-meter" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(level * 100)}>
      {Array.from({ length: BARS }, (_, index) => (
        <span key={index} className={index < lit ? 'is-lit' : ''} style={{ height: `${30 + index * 6}%` }} />
      ))}
    </div>
  );
}
