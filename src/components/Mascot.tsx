interface MascotProps {
  size?: number;
  /** Spin the swirl once on load. Used only on the home hero. */
  spin?: boolean;
}

/** Pip, the lollipop coach. Original artwork, drawn in SVG. */
export function Mascot({ size = 180, spin = false }: MascotProps) {
  return (
    <svg
      className={`mascot ${spin ? 'mascot-spin' : ''}`}
      width={size}
      height={size * 1.35}
      viewBox="0 0 200 270"
      role="img"
      aria-label="Pip, a smiling lollipop"
    >
      <rect x="92" y="150" width="16" height="112" rx="8" fill="var(--grape)" />
      <g className="mascot-candy">
        <circle cx="100" cy="92" r="80" fill="var(--bubblegum)" stroke="var(--grape)" strokeWidth="8" />
        <path
          className="mascot-swirl"
          d="M100 92 m-64 0 a64 64 0 1 1 128 0 a56 56 0 1 1 -112 0"
          fill="none"
          stroke="var(--milk)"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
      <g className="mascot-face">
        <ellipse cx="76" cy="100" rx="9" ry="11" fill="var(--grape)" />
        <ellipse cx="124" cy="100" rx="9" ry="11" fill="var(--grape)" />
        <circle cx="79" cy="96" r="3" fill="var(--milk)" />
        <circle cx="127" cy="96" r="3" fill="var(--milk)" />
        <ellipse cx="62" cy="122" rx="11" ry="6" fill="var(--blush)" />
        <ellipse cx="138" cy="122" rx="11" ry="6" fill="var(--blush)" />
        <path d="M86 124 q14 14 28 0" fill="none" stroke="var(--grape)" strokeWidth="6" strokeLinecap="round" />
      </g>
      <path d="M150 34 l6 -14 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 z" fill="var(--lemon)" stroke="var(--grape)" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}
