# CLB Ready

A free, private AI coach for CELPIP-style speaking and writing practice.
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
```

Open `#/lab` (the "Model lab" link in the footer) to load the AI models and measure load time,
transcription time, tokens per second and memory on your device.

## How it works

| Part | Tool | Where it runs |
| --- | --- | --- |
| Speech to text | Whisper (`.en` models) via Transformers.js | Web Worker, WebGPU or CPU |
| Feedback | Qwen2.5 / Llama 3.2, 4-bit, via WebLLM | Web Worker, WebGPU |
| Measurements | Plain TypeScript (pace, pauses, fillers) | Main thread |
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

- **A module:** copy `src/content/modules/module1.ts` to `module2.ts`, write its 10 prompts, and replace
  `comingSoon(2)` in `src/content/modules/index.ts`. The content tests check it is complete.
- **Reading or listening:** add their task types to `domain/tasks/types.ts` and `catalog.ts`, a flow
  component in `features/task/`, and set the skill's `status` to `available` in `domain/skills.ts`.
- **A different AI engine:** implement `SpeechToText` or `FeedbackModel` from `services/ai/types.ts`.

## Licence

MIT. See [LICENSE](LICENSE).
