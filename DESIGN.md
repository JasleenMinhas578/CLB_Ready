---
name: CLB Ready
description: A soft, friendly CELPIP practice coach that turns calm and plain on test screens.
colors:
  bg: "#fff8f3"
  surface: "#ffffff"
  surface-sunk: "#fbf0ea"
  ink: "#2e2340"
  ink-soft: "#5e5270"
  border: "#8e8299"
  border-soft: "#eadfe6"
  accent: "#ff9fb2"
  accent-hover: "#ff8aa1"
  accent-ink: "#a3264d"
  rose-tint: "#ffe0e8"
  rose-ink: "#a3264d"
  peach-tint: "#ffe1d1"
  peach-ink: "#9a4317"
  butter-tint: "#fff1bf"
  butter-ink: "#7a5a00"
  mint-tint: "#d4f3e6"
  mint-ink: "#17694f"
  sky-tint: "#d9ecff"
  sky-ink: "#1f5d99"
  lilac-tint: "#e9e0ff"
  lilac-ink: "#5b3fa8"
  exam-bg: "#f1f0f4"
  exam-surface: "#ffffff"
  exam-sunk: "#f6f5f8"
  exam-line: "#cdc9d4"
  exam-line-strong: "#8f8a99"
  exam-ink: "#23202a"
  exam-soft: "#565262"
  exam-accent: "#3d3550"
  exam-rec: "#c8324f"
typography:
  display:
    fontFamily: "Fredoka, Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 6vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Fredoka, Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.15
  title:
    fontFamily: "Fredoka, Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.15
  subtitle:
    fontFamily: "Fredoka, Nunito, ui-rounded, system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 600
    lineHeight: 1.15
  body:
    fontFamily: "Nunito, ui-rounded, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Nunito, ui-rounded, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 800
    lineHeight: 1.4
  exam-heading:
    fontFamily: "Nunito, ui-rounded, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 800
    lineHeight: 1.2
rounded:
  sm: "10px"
  md: "16px"
  lg: "24px"
  pill: "999px"
  exam: "8px"
spacing:
  gap-1: "0.5rem"
  gap-2: "1rem"
  gap-3: "1.5rem"
  gap-4: "2.5rem"
  gap-5: "4rem"
  gutter: "clamp(16px, 4vw, 64px)"
  text-width: "64ch"
  page-width: "1440px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.6rem 1.35rem"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.6rem 1.35rem"
    height: "48px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "44px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.95rem"
    height: "44px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  status-note:
    backgroundColor: "{colors.butter-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.6rem 0.9rem"
  exam-bar:
    backgroundColor: "{colors.exam-accent}"
    textColor: "{colors.exam-surface}"
    typography: "{typography.exam-heading}"
    padding: "0.7rem 64px"
  exam-panel:
    backgroundColor: "{colors.exam-surface}"
    textColor: "{colors.exam-ink}"
    rounded: "10px"
    padding: "20px 22px"
  exam-button-primary:
    backgroundColor: "{colors.exam-accent}"
    textColor: "{colors.exam-surface}"
    rounded: "{rounded.exam}"
    height: "46px"
  exam-input:
    backgroundColor: "{colors.exam-surface}"
    textColor: "{colors.exam-ink}"
    rounded: "6px"
    padding: "12px 14px"
---

# Design System: CLB Ready

## Overview

**Creative North Star: "The Warm Classroom and the Quiet Test Room"**

CLB Ready has two rooms. The warm classroom is home, the practice lists and results: a cream page, pastel tints, rounded cards that float on soft shadows, friendly line icons and, now and then, Pip, your AI coach. It should feel like a kind tutor who is glad you came back. The quiet test room is every exam screen: neutral grey, white panels with thin edges, a dark top bar with the timer, no tints, no illustration, no motion. It should feel like test day, so the real test holds no surprises.

The learner is an adult preparing for an immigration test, often reading English as an additional language. Charm never costs clarity: every screen has one obvious next step, every state (checking, saving, ready, failed) is written in words, and every colour signal also has an icon or a label. Density is moderate. Type is large and rounded, lines stay short, and actions are big targets.

This system replaces an earlier candy-shop look (thick grape outlines, hard offset sticker shadows, bubblegum fills, emoji). Those are anti-references now.

**Key Characteristics:**
- Two modes: soft and warm for browsing and feedback; calm and neutral for timed tasks.
- Pastel tints as fills only; text on them always uses ink or the tint's matching -ink colour.
- One set of 2px round-stroke line icons; no emoji anywhere.
- Soft, ink-tinted shadows with a small offset and a wide blur.
- Pip appears sparingly: results AI status, empty and error states, and later the home intro.

## Colors

Gentle pastels on warm cream, anchored by a deep plum ink, with a separate cool-grey set for exam screens.

### Primary
- **Rose Sorbet** (accent): the fill of the one primary button on a screen. Ink text on it (6.8:1). Hover deepens to **Rose Sorbet Deep** (accent-hover).
- **Raspberry Ink** (accent-ink): rose text, link hover and the focus ring (6.8:1 on the page). Never a fill.

### Secondary
Six pastel tints, each with a matching text colour that passes 4.5:1 on its tint and on the page:
- **Rose** (rose-tint / rose-ink): problems, misses, "not yet".
- **Peach** (peach-tint / peach-ink): speaking.
- **Butter** (butter-tint / butter-ink): writing, gentle notices and nudges.
- **Mint** (mint-tint / mint-ink): reached, covered, correct.
- **Sky** (sky-tint / sky-ink): reading, information.
- **Lilac** (lilac-tint / lilac-ink): listening.

Semantic aliases in `tokens.css` point at these: `--ok`, `--warn`, `--bad`, `--info` (each with a `-bg`), and `--speaking-tint` / `--speaking-ink` for each skill.

### Neutral
- **Warm Cream** (bg): the page.
- **Paper White** (surface): cards and fields.
- **Oat** (surface-sunk): wells, bar tracks, inline code.
- **Plum Ink** (ink): all body text and headings (14:1).
- **Dusk Plum** (ink-soft): secondary text, at least 5.6:1 on every tint.
- **Heather** (border): outlines of controls, 3.4:1 on the page.
- **Blush Line** (border-soft): decorative card edges and dividers only.

### Exam
- **Test Room Grey** (exam-bg), **Exam White** (exam-surface), **Exam Wash** (exam-sunk): page, panels, quiet wells.
- **Exam Line** (exam-line) for panel edges; **Exam Line Strong** (exam-line-strong, 3.3:1) for fields.
- **Exam Ink** (exam-ink) and **Exam Grey Text** (exam-soft, 6.6:1) for text.
- **Night Plum** (exam-accent): top bar, selected tab and primary exam button, with white text (11.5:1).
- **Record Red** (exam-rec): the recording dot and the answer timer only.

### Named Rules
**The Tint Is Not Text Rule.** Pastel tints are fills. Text on a tint is ink, ink-soft or that tint's own -ink colour, never another tint.

**The Two Rooms Rule.** Exam screens use only the `--exam-*` colours. No pastel, no rose button, no Pip.

**The Never Colour Alone Rule.** Every met, missed, warning or timer state pairs its colour with an icon and words.

## Typography

**Display Font:** Fredoka (with Nunito, ui-rounded, system-ui)
**Body Font:** Nunito (with ui-rounded, system-ui, -apple-system, Segoe UI)

**Character:** Fredoka's soft round terminals carry the friendliness in headings; Nunito's open, even letterforms stay easy to read for slow and EAL readers. Both are self-hosted variable fonts in `public/fonts`, so no visitor data goes to a font service.

### Hierarchy
- **Display** (700, clamp(2.4rem, 6vw, 3.6rem), 1.15): the single home hero heading.
- **Headline** (700, clamp(2rem, 4vw, 2.5rem), 1.15): the h1 on every other warm screen.
- **Title** (600, 1.75rem, 1.15): section headings (h2).
- **Subtitle** (600, 1.3125rem, 1.15): card headings (h3, results card h2).
- **Body** (400, 1.0625rem, 1.6): all reading text, capped at 64ch.
- **Label** (800, 0.875rem): chips, tags, meta lines, footer column heads.
- **Exam heading** (Nunito 800, 1.15rem, 1.2): exam bar titles and exam messages. Exam screens never use Fredoka.

### Named Rules
**The Plain Words Rule.** Short sentences, no idioms, no jokes in labels. Friendliness comes from shape and colour, not wordplay.

## Layout

Pages sit in a centred column up to 1440px wide with side gutters that grow from 16px on phones to 64px on wide screens. Reading text is capped at 64ch. Spacing steps are 0.5, 1, 1.5, 2.5 and 4rem; sections are separated by 4rem, cards by 1.5rem, and items inside a card by 0.5 to 1rem. Grids collapse to one column at 560 to 860px depending on the screen. Exam screens are full width: a sticky top bar, then one or two panels that stack below 860px. Every interactive target is at least 44px tall.

## Elevation & Depth

Warm screens are lightly lifted: cards rest on a soft ink-tinted shadow and rise a little on hover. Depth is never a hard block shadow. Exam screens are flat; depth there is only a 1px line.

### Shadow Vocabulary
- **Rest** (`--shadow-1`: `0 1px 2px rgb(46 35 64 / 0.06), 0 2px 8px rgb(46 35 64 / 0.06)`): buttons, chips, small cards.
- **Raised** (`--shadow-2`: `0 2px 4px rgb(46 35 64 / 0.05), 0 8px 24px rgb(46 35 64 / 0.08)`): feature cards and panels that lead a screen.
- **Hover** (`--shadow-hover`: `0 4px 8px rgb(46 35 64 / 0.06), 0 14px 32px rgb(46 35 64 / 0.12)`): the lifted state of links shaped as cards and buttons, with a 1 to 2px upward move.

### Named Rules
**The Flat Test Rule.** Nothing on an exam screen has a shadow or moves on hover.

## Shapes

Everything warm is rounded: pills for buttons, chips and tabs; 24px corners on cards; 16px on fields and notices; 10px on small wells. Borders are 2px in Heather for controls and Blush Line for decoration. Icons share one form: 24px grid, 2px round strokes, round joins, drawn in `currentColor`. Exam shapes are tighter: 10px panels, 8px buttons, 6px fields, 1px lines.

## Components

### Buttons
- **Shape:** full pill (999px), at least 48px tall.
- **Primary:** Rose Sorbet fill, Plum Ink text, Fredoka 600. One per screen: the next step.
- **Hover / Focus:** lifts 1px onto the hover shadow; focus shows a 3px Raspberry Ink ring 3px out.
- **Secondary:** Paper White fill with a Heather outline. **Quiet:** transparent, no shadow, Oat on hover.
- **Exam:** Night Plum fill, white text, 8px corners, no shadow, no lift.

### Chips
- **Style:** Paper White pill, Heather outline, Label type; the goal chip in the header is the model.
- **State:** a selected tab or module fills with Plum Ink and cream text.

### Cards / Containers
- **Corner Style:** 24px.
- **Background:** Paper White, or a skill or status tint.
- **Shadow Strategy:** Rest; Raised for the lead card; Hover only when the whole card is a link.
- **Border:** 2px Heather today; new cards may use Blush Line when a shadow already separates them.
- **Internal Padding:** 1.5rem, 1rem on phones.

### Inputs / Fields
- **Style:** Exam fields are white with a 1px Exam Line Strong edge and 6px corners.
- **Focus:** a 2px Night Plum outline.
- **Disabled:** Exam Wash fill.

### Navigation
The header holds the wordmark, a round settings icon button and the goal chip. Exam screens drop the header and footer and use the Night Plum bar with the task title, time left and a Next button.

### Icon
`<Icon name size label />` from `src/components/Icon.tsx`. Sizes sm, md, lg, xl map to `--icon-*`. Decorative by default (`aria-hidden`); pass `label` only when the icon carries meaning with no words beside it.

### Pip, your AI coach
`<Pip size mood label />` from `src/components/Pip.tsx`: a round rose seed with a mint sprout, dot eyes and blush cheeks. Moods are happy, thinking and oops. It is never animated and never appears on exam screens. The first time a screen names Pip in words, it says "Pip, your AI coach".

### Disclaimer
`DISCLAIMER` and `<Disclaimer />` from `src/components/Disclaimer.tsx` are the only wording of the independence notice.

## Do's and Don'ts

### Do:
- **Do** use one Rose Sorbet primary button per screen, on the learner's next step.
- **Do** write every state in words: "Checking your answer…", "Saved on this device", "Not checked".
- **Do** pair every status colour with an icon from the one set: check, missed, dash, pending, warning, error, info.
- **Do** keep exam screens on the `--exam-*` palette with Nunito headings and no shadows.
- **Do** keep text on pastel tints in ink, ink-soft or the tint's own -ink colour.

### Don't:
- **Don't** use emoji or Unicode glyphs (✓ ▶ ▸) as icons.
- **Don't** use hard offset block shadows or thick 3px dark outlines; that was the old candy-shop look.
- **Don't** loop animations near scores or timers, and keep all motion off when reduced motion is set.
- **Don't** put pastel, Pip or illustration on an exam screen.
- **Don't** call the product "AI-powered" or write a second disclaimer.
