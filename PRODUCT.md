# Product

<!-- impeccable:product-schema 1 -->

<!-- Written by an agent from the repository and the owner's brief, without a live interview.
     Facts marked (inferred) came from the code and README, not from the owner directly. -->

## Platform

web

## Users
Adult English learners, roughly CLB 5 to 9, preparing for the CELPIP test for Canadian immigration or citizenship.
Many are stressed about the result, and some read English slowly. They practise alone, usually on a laptop in
Chrome or Edge, sometimes on a phone (inferred). Secondary: schools and settlement programs that share one link
with their students.

## Product Purpose
A free CELPIP-style practice coach. Learners take speaking, writing, reading and listening tasks under real test
timers, then see an estimated CLB level and what to change to reach their goal level. Success is a learner
who understands their level and their next fix, without feeling judged or overwhelmed.

## Positioning
Everything runs in the visitor's browser: speech-to-text, feedback and voices are open models downloaded once.
No account, no payment, and nothing the learner writes or says leaves the device.

## Operating Context
- Exam screens mirror test day: a timer bar, a prompt panel, a writing editor with a live word count, a recorder.
- Results show an estimated CLB level, criterion scores, measurements (pace, pauses, fillers), and an improved
  answer with changes marked.
- Progress ticks are stored only in localStorage.
- Model downloads can be large and slow; light mode exists for devices without WebGPU.

## Capabilities and Constraints
- 5 practice tests: 8 speaking, 2 writing, 4 reading and 6 listening parts each; 40 sample answers; 380 objective
  questions with explanations.
- Goal-based feedback for CLB 7 to 12.
- Scores are estimates for practice only. CLB Ready is independent: not affiliated with CELPIP or Paragon Testing
  Enterprises. One disclaimer component says this everywhere (footer, FAQ, exam footnote).
- No network calls apart from model downloads. Static hosting (GitHub Pages, Vercel).
- Fonts are self-hosted (Fredoka for display, Nunito for body) in `public/fonts`.

## Brand Commitments
- Name: CLB Ready. Coach: Pip, introduced as "Pip, your AI coach" the first time it appears on a screen.
- Direction, binding (owner, replaces the old candy-shop identity):
  - Home, practice lists and results: soft, cute and friendly. Rounded shapes, gentle pastels, soft shadows,
    simple friendly illustrations used sparingly.
  - Exam screens (timers, recording, questions): calm and focused, like test day. Neutral greys, no pastels,
    no illustrations, no motion.
  - Clarity beats charm whenever they conflict. Learners are adults, many reading English as an additional language.
- One icon set (`src/components/Icon.tsx`), drawn in one stroke style. No emoji anywhere in the UI.
- One legal disclaimer, worded once. Never call the product "AI-powered".
- Plain, kind English. Short sentences for slow readers.

## Evidence on Hand
- Screenshots in `docs/screenshots/`.
- No testimonials, user counts or accuracy benchmarks exist. Do not invent them.

## Product Principles
1. Lower stress: the learner should always know how much time is left and what their level is, in plain words.
2. Honest scores: numbers on one screen must agree with each other, every estimate is labelled as one, and nothing
   promises more than a practice estimate can give.
3. Test-day realism on exam screens; warmth only on home, practice and results.
4. Privacy is the product: never add a feature that sends learner data off the device.
5. Short workflows: every screen has one clear next step, and saving or checking is always visible as a state
   ("Checking your answer…", "Saved on this device").

## Accessibility & Inclusion
- WCAG 2.2 AA: text contrast at least 4.5:1, UI graphics and focus rings at least 3:1.
- Never signal state by colour alone; timer warnings must be visible as text or icon and announced politely.
- Respect `prefers-reduced-motion`; no looping animation near scores or timers.
- Readers of English as an additional language: plain words, no idioms in UI copy.
- Icons are decorative (`aria-hidden`) unless they carry meaning alone; then they get a label.
