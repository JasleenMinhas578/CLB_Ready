# CLB Ready

A free, private AI coach for CELPIP-style speaking, writing, reading and listening practice.

**Try it:** https://jasleenminhas578.github.io/CLB_Ready/ (Chrome or Edge on a laptop works best).

All AI runs inside your browser, so your voice and answers never leave your device.

> CLB Ready is an independent practice tool. It is not affiliated with, endorsed by or connected to
> CELPIP, Prometric, the Centre for Canadian Language Benchmarks or the Government of Canada.
> Scores are estimates for practice only.

## Run it

You need Node.js 20 or newer.

```bash
npm install
npm run dev      # open the local address it prints, in Chrome or Edge
npm test         # unit tests
npm run build    # production build in dist/
npm run audio    # optional: pre-record listening audio (see below)
```

### Listening recordings

Listening scripts live in the module files as text. `npm run audio` turns them into MP3 files in
`public/audio/` with [Kokoro](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX), an open
(Apache-2.0) text-to-speech model, so learners download only the clip they play. It needs internet
the first time (about 330 MB for the model) and ffmpeg (`brew install ffmpeg` on a Mac). Only clips
whose script changed are remade. Until a clip has a recording, the app reads it with the browser's
own voice.

Open `#/lab` (the "Model lab" link in the footer) to load the AI models and measure load time,
transcription time, tokens per second and memory on your device.

## How it works

| Part | Tool | Where it runs |
| --- | --- | --- |
| Speech to text | Whisper (`.en` models) via Transformers.js | Web Worker, WebGPU or CPU |
| Feedback | Qwen2.5 / Llama 3.2, 4-bit, via WebLLM | Web Worker, WebGPU |
| Measurements | Plain TypeScript (pace, pauses, fillers) | Main thread |
| Reading and listening marks | Answer key and CELPIP's approximate score chart | Main thread |
| Listening voices | Kokoro, recorded ahead of time with `npm run audio` | Plain MP3 files |
| Storage | None for answers; only model files are cached | Browser cache |

The app checks the device (memory, CPU cores, WebGPU support) without asking for permission and picks
a model size to match. Devices without WebGPU get light mode.

## Project structure

```
src/
  app/          router, session state, route table
  components/   shared UI (buttons, emoji, mascot, timer, layout)
  domain/       skills, CLB goals, CELPIP criteria, task types and rules
  content/      practice modules and prompts (data only)
  services/     device detection, audio recording, AI engines behind interfaces
  features/     one folder per screen: home, goal, skill, task, results, lab
  styles/       design tokens and CSS
tests/          unit tests for logic and content integrity
```

### Adding things

- **A module:** copy `src/content/modules/module1.ts` (and its `module1Reading.ts` and
  `module1Listening.ts`), write the new content, and list it in `src/content/modules/index.ts`.
  The content tests check every part is complete, every blank has a question and answers are spread out.
- **Listening audio for new scripts:** run `npm run audio` and commit `public/audio/`.
- **A different AI engine:** implement `SpeechToText` or `FeedbackModel` from `services/ai/types.ts`.

## Licence

MIT. See [LICENSE](LICENSE).
