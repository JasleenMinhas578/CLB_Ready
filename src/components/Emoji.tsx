type Motion = 'none' | 'float';

interface EmojiProps {
  symbol: string;
  /** Accessible name. Leave empty for purely decorative emoji. */
  label?: string;
  motion?: Motion;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Animated emoji using CSS only (no image downloads), so it costs
 * almost nothing while the AI models run. Motion is switched off
 * automatically for people who prefer reduced motion.
 */
export function Emoji({ symbol, label, motion = 'none', size = 'md' }: EmojiProps) {
  const decorative = !label;
  return (
    <span
      className={`emoji emoji-${size} emoji-${motion}`}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
    >
      {symbol}
    </span>
  );
}
