# Design: CLB Ready

The locked system. Every Hallmark run reads this first and every screen shares it. Change it on purpose; this file is the rule.

## System
- Genre: playful
- Shape: app screens; the home page is two spreads on one two-column grid (both columns start at the top, every edge shared). Spread one, the two ways in: headline, sentence, the next task as a card-stock ticket (Pip inside its top row, never overlapping an edge) and the two facts on the left; "Pick a skill" as a column of skill tiles on the right. Spread two, after a hairline: the "What you see after each task" intro on the left, the example results card on the right. One column on phones, in source order: start, skills, facts, example.
- Theme: Hum (dealt 1/3), softened to lavender and violet: cut card stock on grained lavender-white paper, one violet family
- Axes: light/rounded-sans/chromatic-violet · posture: full-palette, each colour with one job
- Two registers: soft paper for home, practice, goal, settings and results; calm grey for exam screens (`--exam-*`)
- Home: no full-width bands and no second hero; the example is a normal results card in the right column, captioned as an example with made-up numbers. h2 at `--step-2`; the facts heading a step smaller because it sits under the ticket. The goal is set from the header only. At most two privacy mentions on the page (the facts and the footer chip).

## Tokens
`src/styles/tokens.css` is the source of truth (plain CSS custom properties, no Tailwind). The roles:
```css
:root {
  --bg: #F8F6FC (lavender white);  --surface: #FEFDFF (white, a breath of lavender);  --surface-sunk: #F0ECF8;  --edge: #CFC6E6;
  --ink: #1F1B2E;  --ink-soft: #4A4560;  --border: #7A7392;  --border-soft: #E2DCEF;
  --accent: #6345BC (violet);  --accent-hover: #5A3DB0;  --accent-edge: #3E2A85;  --accent-ink: #FEFDFF;  --link: var(--lilac-ink) #4B3A9A;  --focus: var(--link);
  --<rose|peach|butter|mint|sky|lilac>-tint / -ink;  rose #F6E3EE/#7A2456, peach #FFD3B5/#7A360F (Pip), butter #F8EDC9/#634700 (warn), mint #E2F3E9/#1A5436 (ok), sky #E2ECF8/#1F4A7A (info), lilac #EEE9FA/#4B3A9A (the lavender family: band, chips, selected);
  --<speaking|writing|reading|listening>-tint / -ink: rose, sand #F3EBD8/#5C4512, sky, lavender #ECE6FA/#4A2E94;  --ok (mint), --warn (butter), --bad #8C1C2A on #FBE5E7, --info (sky);
  --exam-bg, --exam-surface, --exam-sunk, --exam-line, --exam-line-strong, --exam-ink, --exam-soft, --exam-accent, --exam-rec, --exam-rec-ink (timer text in red, 7:1 or more);  (--exam-soft: oklch(39% 0.02 295);  --exam-line-strong: oklch(56% 0.016 295);  --exam-line: oklch(80% 0.012 295))
  --font-display: 'Fredoka';  --font-body: 'Nunito';  (self-hosted in public/fonts, no CDN)
  --radius-sm: 10px;  --radius-md: 16px (card stock);  --radius-lg: 24px (cards, sheets);  --radius-pill: small pills only;
  --stock-edge: 4px;  --stock-edge-up: 6px;  --stock-edge-down: 1px;  --shadow-card;  --grain;
}
```
Spacing is `--gap-1` to `--gap-6` (8, 16, 24, 40, 64, 96px). Type is `--step--1` to `--step-4`; heads are Fredoka 600 at `--tracking-display`, body Nunito 17px, labels Nunito 800 a step smaller in sentence case.

## Colour jobs
- Violet `--accent` with white text: the primary button (Start, Continue, Try again) only. Lavender `--lilac-tint` on the violet edge: the next task row. Deep violet `--link` (`--lilac-ink`): links, the focus ring, the selected state (goal, model choice, set goal chip; `--lilac-tint` fill with a `--lilac-ink` ring) and score-bar fills. `--lilac-tint`: the privacy chip and the progress pill. One lavender family across page, bands and chips; no second hue for structure. Mint: done ticks and a reached goal (`--ok`). Bad is its own red, apart from the rose. Each skill owns one pastel tint, its text in the matching `-ink`. Pip is peach so it never sits violet on violet.
- Text on a tint is `--ink` or that tint's `-ink`. Never colour alone for meaning.
- Contrast targets (measured, WCAG): all text, muted and coloured included, 7:1 or more on its actual ground (paper, cards, wells, every tint). White on the violet button is 6.8:1 (7.7:1 on hover), above the 4.5:1 floor, and the label is Fredoka 600 at 1.1rem. `--ink` stays darkest. Non-text that defines a control or a value (outlines, bar tracks and fills, the goal marker, focus ring) 3:1 or more against its neighbour. Bar tracks carry a hairline: `--border` on wells, the skill ink mixed 70% into the tint on skill tiles. Neutral surfaces that touch (paper and card, card and well) are told apart by a `--border-soft` hairline as well as the tint step. Exam text on `--exam-*` meets the same 7:1.

## Controls
- Card stock: `--radius-md`, no border, `box-shadow: 0 var(--stock-edge) 0 0 <edge>`; hover lifts 1px to `--stock-edge-up`, active presses 3px to `--stock-edge-down`. Primary: `--accent` fill, `--accent-edge`, spring easing. Secondary: `--surface`, inset `--border` hairline (3:1 against the page), `--edge`. Height 52px (44px for pills and tabs).
- Selected: ink fill with paper text (module tab), or `--lilac-tint` fill with a 2px `--lilac-ink` ring (goal, model choice).
- Containers: `.results-card`/`.lab-card` = `--surface`, 1px `--border-soft`, `--radius-lg`, no shadow. Never a card in a card; wells inside cards are `--surface-sunk` at `--radius-sm`.

## Footer
- One `--surface-sunk` sheet with grain and rounded top corners, shared by every non-exam page. Brand, one line and the privacy chip on the left; "Practise" and "About" link groups on the right (bold ink with a small `--icon-sm` icon in currentColor, underline on hover, 44px rows). No links that repeat the header. Disclaimer (the `DISCLAIMER` constant) and © in a quiet bottom row at `--ink-soft`.

## Exam screens
- `--exam-*` only: grey ground, near-white panels, `--exam-accent` bar and primary. No card stock, no grain, no tints, no Pip, no motion. Override `.btn` there to a flat fill with no edge or transform.
- One capped column (`--exam-width`, 75rem) for the bar's contents, panels and notes; the page does not stretch, so the notes and disclaimer sit right under the panels.
- Every panel starts with a small `.exam-panel-label` (Task, Your answer, Before you start, Timers, Passage, Questions, Recording). One primary action per state: speaking's Start sits in the Before you start panel with the timers previewed above it; the bar holds Skip, Finish answer or Next only once the task is running.

## Motion
- State only: `transform`, `box-shadow`, `background-color` at `--dur-fast`. No reveals, no loops near scores or timers. Reduced motion ends everything at once (base.css).

## Pip
- Pip (`src/components/Pip.tsx`) is the only illustration: a peach seed (`--peach-tint` on a `--peach-ink` edge) with a mint sprout, drawn from tokens. Home intro, results AI status, empty and error states. Never on exam screens.

## Exports
`src/styles/tokens.css` in this project.
