# CLB Ready

Free, private CELPIP-style practice coach. Static site; all AI runs in the visitor's browser.

## Stack
- React 19 + TypeScript 5.9 + Vite 7, no router lib (`src/app/router.ts`), plain CSS (`src/styles/`, tokens in `tokens.css`)
- In-browser models: WebLLM (feedback LLM), transformers.js Whisper (speech-to-text), kokoro-js (TTS). Each runs in a Web Worker.
- Tests: Vitest (node env), `tests/**/*.test.ts`. No linter configured.
- Deploy: GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.

## Commands
- `npm run dev` / `npm run build` / `npm run preview`
- `npm test`, `npm run typecheck`
- `npm run audio`: regenerates `public/audio/` with Kokoro on Node (needs onnxruntime-node)

## Layout
- `src/app`: shell, routes, session
- `src/features/<screen>`: screens and their components
- `src/domain`: pure scoring/metrics logic (tested; keep it free of DOM and models)
- `src/services`: ai, audio, tts, device tiering, grammar, progress (localStorage)
- `src/content/modules`: task content per module

## Conventions
- `@/` alias points to `src/`.
- Worker protocols live in `*.protocol.ts` beside each worker.
- Model choice per device tier lives in `src/services/device/tier.ts`.
- Nothing the learner writes or says leaves the device. Don't add network calls apart from model downloads.
- Comments explain why, in plain English.
