type Mood = 'happy' | 'thinking' | 'oops';

interface PipProps {
  /** Width and height in pixels. */
  size?: number;
  mood?: Mood;
  /** Accessible name. Leave out when nearby text already names Pip. */
  label?: string;
  className?: string;
}

const MOUTHS: Record<Mood, string> = {
  happy: 'M52 71q8 7 16 0',
  thinking: 'M55 73q5-2 10 0',
  oops: 'M53 75q7-6 14 0',
};

/**
 * Pip, your AI coach: a round little pear-coloured seed with a sprout, because practice
 * helps a level grow. Drawn from the palette tokens, never animated, and used
 * sparingly (home intro, AI status on results, empty and error states).
 */
export function Pip({ size = 96, mood = 'happy', label, className }: PipProps) {
  const lookUp = mood === 'thinking';
  return (
    <svg
      className={`pip${className ? ` ${className}` : ''}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      focusable="false"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* Cut from card stock like the buttons: a deeper pear edge shows below the body. */}
      <path d="M60 29c24 0 40 18 40 42s-16 40-40 40-40-16-40-40 16-42 40-42z" fill="var(--accent-edge)" />
      <path d="M60 25c24 0 40 18 40 42s-16 40-40 40-40-16-40-40 16-42 40-42z" fill="var(--accent)" />
      <ellipse cx="60" cy="84" rx="24" ry="18" fill="var(--surface)" opacity="0.55" />
      <path d="M60 26c0-6 1-10 3-13" fill="none" stroke="var(--mint-ink)" strokeWidth="3" strokeLinecap="round" />
      <path d="M63 14c4-6 12-7 16-3-3 6-10 8-16 3z" fill="var(--mint-tint)" stroke="var(--mint-ink)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M61 19c-3-5-9-6-13-3 3 5 9 6 13 3z" fill="var(--mint-tint)" stroke="var(--mint-ink)" strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="46" cy="60" rx="4.5" ry="5.5" fill="var(--ink)" />
      <ellipse cx="74" cy="60" rx="4.5" ry="5.5" fill="var(--ink)" />
      <circle cx={lookUp ? 48 : 47.5} cy={lookUp ? 57 : 58} r="1.6" fill="var(--surface)" />
      <circle cx={lookUp ? 76 : 75.5} cy={lookUp ? 57 : 58} r="1.6" fill="var(--surface)" />
      {mood === 'oops' && <path d="M40 52l9-3M80 52l-9-3" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />}
      <ellipse cx="37" cy="70" rx="6" ry="3.5" fill="var(--rose-ink)" opacity="0.22" />
      <ellipse cx="83" cy="70" rx="6" ry="3.5" fill="var(--rose-ink)" opacity="0.22" />
      <path d={MOUTHS[mood]} fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
