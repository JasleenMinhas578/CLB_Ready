# Design: CLB Ready

The locked system. Every Hallmark run reads this first and every screen shares it. Change it on purpose; this file is the rule.

## System
- Genre: playful
- Shape: app screens; the home page has a Settled hero (headline left, the next task as a card-stock ticket right, Pip inside its top row, never overlapping an edge)
- Theme: Hum (dealt 1/3), softened to gentle pastels: cut card stock on grained blush paper, a pink and blue palette
- Axes: light/rounded-sans/chromatic-pink · posture: full-palette, each colour with one job
- Two registers: soft paper for home, practice, goal, settings and results; calm grey for exam screens (`--exam-*`)
- Home sections after the hero: heading on top (h2 at `--step-2`, clearly under the h1, with an optional one-line intro), then the content full width in the same page column as the hero, so left and right edges line up. No side-by-side headings, no zig-zag. `--gap-5` above and below each (`--gap-4` on phones). The example sits on a full-width `--surface-sunk` band; Good to know starts at a `--border-soft` hairline. Order: hero, example, skills, good to know, footer. The goal is set from the header only.

## Tokens
`src/styles/tokens.css` is the source of truth (plain CSS custom properties, no Tailwind). The roles:
```css
:root {
  --bg: oklch(96.5% 0.014 350);  --surface: oklch(99.6% 0.004 350);  --surface-sunk: oklch(93.5% 0.02 350);  --edge: oklch(80% 0.04 350);
  --ink: oklch(25% 0.035 265);  --ink-soft: oklch(38% 0.03 265);  --border: oklch(52% 0.025 265);  --border-soft: oklch(85% 0.025 350);
  --accent: oklch(89% 0.06 355);  --accent-hover: oklch(85.5% 0.08 355);  --accent-edge: oklch(69% 0.12 355);  --accent-ink: var(--ink);  --link: oklch(42% 0.17 258);  --focus: var(--link);
  --<rose|peach|butter|mint|sky|lilac>-tint / -ink;  (tints at L 92.5-94%, inks at L 39-40%: rose 355, lilac 315, sky 235/250, mint 165/160 for ok, butter 90/80 for warn; peach unused)  --<speaking|writing|reading|listening>-tint / -ink (rose, lilac, sky, periwinkle oklch(91.5% 0.05 278) / oklch(39% 0.16 275));  --ok (mint), --warn (butter), --bad oklch(41% 0.15 25) on oklch(94% 0.035 25), --info (sky);
  --exam-bg, --exam-surface, --exam-sunk, --exam-line, --exam-line-strong, --exam-ink, --exam-soft, --exam-accent, --exam-rec;  (--exam-soft: oklch(39% 0.02 295);  --exam-line-strong: oklch(56% 0.016 295);  --exam-line: oklch(80% 0.012 295))
  --font-display: 'Fredoka';  --font-body: 'Nunito';  (self-hosted in public/fonts, no CDN)
  --radius-sm: 10px;  --radius-md: 16px (card stock);  --radius-lg: 24px (cards, sheets);  --radius-pill: small pills only;
  --stock-edge: 4px;  --stock-edge-up: 6px;  --stock-edge-down: 1px;  --shadow-card;  --grain;
}
```
Spacing is `--gap-1` to `--gap-6` (8, 16, 24, 40, 64, 96px). Type is `--step--1` to `--step-4`; heads are Fredoka 600 at `--tracking-display`, body Nunito 17px, labels Nunito 800 a step smaller in sentence case.

## Colour jobs
- Pink `--accent`: the primary button (Start, Continue, Try again) and the next task only. Blue: links, the focus ring, the selected state (goal, model choice, set goal chip), score-bar fills, the privacy chip, the progress pill and the home example band (`--sky-tint`). Mint: done ticks and a reached goal (`--ok`). Bad is its own red, apart from the pink. Each skill owns one pastel tint, its text in the matching `-ink`.
- Text on a tint is `--ink` or that tint's `-ink`. Never colour alone for meaning.
- Contrast targets (measured, WCAG): all text, muted and coloured included, 7:1 or more on its actual ground (paper, cards, wells, every tint, the pink). `--ink` stays darkest. Non-text that defines a control or a value (outlines, bar tracks and fills, the goal marker, focus ring) 3:1 or more against its neighbour. Bar tracks carry a hairline: `--border` on wells, the skill ink mixed 70% into the tint on skill tiles. Neutral surfaces that touch (paper and card, card and well) are told apart by a `--border-soft` hairline as well as the tint step. Exam text on `--exam-*` meets the same 7:1.

## Controls
- Card stock: `--radius-md`, no border, `box-shadow: 0 var(--stock-edge) 0 0 <edge>`; hover lifts 1px to `--stock-edge-up`, active presses 3px to `--stock-edge-down`. Primary: `--accent` fill, `--accent-edge`, spring easing. Secondary: `--surface`, inset `--border` hairline (3:1 against the page), `--edge`. Height 52px (44px for pills and tabs).
- Selected: ink fill with paper text (module tab), or sky fill with a 2px sky-ink ring (goal, model choice).
- Containers: `.results-card`/`.lab-card` = `--surface`, 1px `--border-soft`, `--radius-lg`, no shadow. Never a card in a card; wells inside cards are `--surface-sunk` at `--radius-sm`.

## Footer
- One `--surface-sunk` sheet with grain and rounded top corners, shared by every non-exam page. Brand, one line and the privacy chip on the left; "Practise" and "About" link groups on the right (bold ink with a small `--icon-sm` icon in currentColor, underline on hover, 44px rows). No links that repeat the header. Disclaimer (the `DISCLAIMER` constant) and © in a quiet bottom row at `--ink-soft`.

## Exam screens
- `--exam-*` only: grey ground, near-white panels, `--exam-accent` bar and primary. No card stock, no grain, no tints, no Pip, no motion. Override `.btn` there to a flat fill with no edge or transform.

## Motion
- State only: `transform`, `box-shadow`, `background-color` at `--dur-fast`. No reveals, no loops near scores or timers. Reduced motion ends everything at once (base.css).

## Pip
- Pip (`src/components/Pip.tsx`) is the only illustration: a seed cut from the pink card stock with a mint sprout, drawn from tokens. Home intro, results AI status, empty and error states. Never on exam screens.

## Exports
`src/styles/tokens.css` in this project.
