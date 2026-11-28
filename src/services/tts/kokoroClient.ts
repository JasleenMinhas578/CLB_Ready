import type { LoadProgress } from '@/services/ai/types';
import type { VoicePlan } from '@/services/device/tier';
import type { KokoroRequest, KokoroResponse } from './kokoro.protocol';
import type { SpokenLine, TextToSpeech } from './types';
import { WorkerRpc } from '@/services/workerRpc';

/** Main-thread wrapper that turns Kokoro worker messages into promises. */
export class KokoroTextToSpeech implements TextToSpeech {
  private rpc = new WorkerRpc<KokoroRequest, KokoroResponse>(
    () => new Worker(new URL('./kokoro.worker.ts', import.meta.url), { type: 'module' }),
    'The voice model could not start in this browser.',
  );

  constructor(private readonly plan: VoicePlan) {}

  async load(onProgress?: (progress: LoadProgress) => void) {
    const started = performance.now();
    // The worker can't tell where the site lives (its own file sits in assets/), so the page resolves it.
    const voicesUrl = new URL('voices/', document.baseURI).href;
    await this.rpc.send({ type: 'load', device: this.plan.device, dtype: this.plan.dtype, voicesUrl }, onProgress);
    return { elapsedMs: performance.now() - started };
  }

  async speak(text: string, voice: string): Promise<SpokenLine> {
    const response = await this.rpc.send({ type: 'speak', text, voice });
    if (response.type !== 'audio') throw new Error('Unexpected reply from the voice model.');
    return { audio: response.audio, sampleRate: response.sampleRate };
  }

  unload() {
    return this.rpc.unload();
  }
}
