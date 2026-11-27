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
timers, then see an estimated CLB level and exactly what to change to reach their goal level. Success is a learner
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
- Scores are estimates for practice only. Not affiliated with CELPIP, Prometric, CCLB or the Government of Canada.
- No network calls apart from model downloads. Static hosting (GitHub Pages, Vercel).
- Fonts are self-hosted (Fredoka for display, Nunito for body) in `public/fonts`.

## Brand Commitments
- Name: CLB Ready. Existing candy-shop identity (bubblegum, lemon, mint, grape ink, sticker outlines) and a
  mascot (inferred from `tokens.css` and `src/components`).
- Owner's stated direction, binding: results are calm and score-first; playfulness belongs only on home and
  task lists; exam screens are neutral, like the real test.
- Plain, kind English. Short sentences for slow readers.

## Evidence on Hand
- Screenshots in `docs/screenshots/`.
- No testimonials, user counts or accuracy benchmarks exist. Do not invent them.

## Product Principles
1. Lower stress: the learner should always know how much time is left and what their level is, in plain words.
2. Honest scores: numbers on one screen must agree with each other, and every estimate is labelled as one.
3. Test-day realism on exam screens; warmth only where the learner is browsing.
4. Privacy is the product: never add a feature that sends learner data off the device.

## Accessibility & Inclusion
- WCAG 2.2 AA: text contrast at least 4.5:1, UI graphics and focus rings at least 3:1.
- Never signal state by colour alone; timer warnings must be visible as text or icon and announced politely.
- Respect `prefers-reduced-motion`; no looping animation near scores or timers.
- Readers of English as an additional language: plain words, no idioms in UI copy.
