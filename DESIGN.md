# Design: CLB Ready

The locked system. Every Hallmark run reads this first and every screen shares it. Change it on purpose; this file is the rule.

## System
- Genre: playful
- Shape: app screens; the home page has a Settled hero (headline left, the next task as a card-stock ticket right)
- Theme: Hum (dealt 1/3), softened to gentle pastels: cut card stock on grained cream paper
- Axes: light/rounded-sans/chromatic-yellow · posture: full-palette, each colour with one job
- Two registers: soft paper for home, practice, goal, settings and results; calm grey for exam screens (`--exam-*`)

## Tokens
`src/styles/tokens.css` is the source of truth (plain CSS custom properties, no Tailwind). The roles:
```css
:root {
  --bg: oklch(97% 0.014 95);  --surface: oklch(99% 0.006 95);  --surface-sunk: oklch(94% 0.02 95);  --edge: oklch(84% 0.035 90);
  --ink: oklch(25% 0.035 265);  --ink-soft: oklch(46% 0.03 265);  --border: oklch(60% 0.025 265);  --border-soft: oklch(88% 0.02 95);
  --accent: oklch(89% 0.11 98);  --accent-edge: oklch(76% 0.12 90);  --accent-ink: var(--ink);  --link: oklch(47% 0.15 255);  --focus: var(--link);
  --<rose|peach|butter|mint|sky|lilac>-tint / -ink;  --<speaking|writing|reading|listening>-tint / -ink;  --ok, --warn, --bad, --info (+ -bg);
  --exam-bg, --exam-surface, --exam-sunk, --exam-line, --exam-line-strong, --exam-ink, --exam-soft, --exam-accent, --exam-rec;
  --font-display: 'Fredoka';  --font-body: 'Nunito';  (self-hosted in public/fonts, no CDN)
  --radius-sm: 10px;  --radius-md: 16px (card stock);  --radius-lg: 24px (cards, sheets);  --radius-pill: small pills only;
  --stock-edge: 4px;  --stock-edge-up: 6px;  --stock-edge-down: 1px;  --shadow-card;  --grain;
}
```
Spacing is `--gap-1` to `--gap-6` (8, 16, 24, 40, 64, 96px). Type is `--step--1` to `--step-4`; heads are Fredoka 600 at `--tracking-display`, body Nunito 17px, labels Nunito 800 a step smaller in sentence case.

## Colour jobs
- Pear `--accent`: the primary button and the next task only. Blue `--link`: links and the focus ring. Mint: growth (a set goal, done ticks, privacy). Each skill owns one pastel tint, its text in the matching `-ink`.
- Text on a tint is `--ink` or that tint's `-ink` (all pairs 5.5:1 or more). Never colour alone for meaning.

## Controls
- Card stock: `--radius-md`, no border, `box-shadow: 0 var(--stock-edge) 0 0 <edge>`; hover lifts 1px to `--stock-edge-up`, active presses 3px to `--stock-edge-down`. Primary: `--accent` fill, `--accent-edge`, spring easing. Secondary: `--surface`, inset `--border` hairline (3:1 against the page), `--edge`. Height 52px (44px for pills and tabs).
- Selected: ink fill with paper text (module tab), or mint fill with a 2px mint-ink ring (goal, model choice).
- Containers: `.results-card`/`.lab-card` = `--surface`, 1px `--border-soft`, `--radius-lg`, no shadow. Never a card in a card; wells inside cards are `--surface-sunk` at `--radius-sm`.

## Exam screens
- `--exam-*` only: grey ground, near-white panels, `--exam-accent` bar and primary. No card stock, no grain, no tints, no Pip, no motion. Override `.btn` there to a flat fill with no edge or transform.

## Motion
- State only: `transform`, `box-shadow`, `background-color` at `--dur-fast`. No reveals, no loops near scores or timers. Reduced motion ends everything at once (base.css).

## Pip
- Pip (`src/components/Pip.tsx`) is the only illustration: a pear seed cut from card stock with a mint sprout, drawn from tokens. Home intro, results AI status, empty and error states. Never on exam screens.

## Exports
`src/styles/tokens.css` in this project.
