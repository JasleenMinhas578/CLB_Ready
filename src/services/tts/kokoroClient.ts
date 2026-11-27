import type { LoadProgress } from '@/services/ai/types';
import type { VoicePlan } from '@/services/device/tier';
import type { KokoroRequest, KokoroResponse } from './kokoro.protocol';
import type { SpokenLine, TextToSpeech } from './types';

type WithoutId<T> = T extends unknown ? Omit<T, 'id'> : never;

type Pending = {
  resolve: (response: KokoroResponse) => void;
  reject: (error: Error) => void;
  onProgress?: (progress: LoadProgress) => void;
};

/** Main-thread wrapper that turns Kokoro worker messages into promises. */
export class KokoroTextToSpeech implements TextToSpeech {
  private worker: Worker | null = null;
  private nextId = 1;
  private pending = new Map<number, Pending>();

  constructor(private readonly plan: VoicePlan) {}

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL('./kokoro.worker.ts', import.meta.url), { type: 'module' });
      this.worker.addEventListener('message', (event: MessageEvent<KokoroResponse>) => this.handle(event.data));
      // Fires if the worker script fails to load (e.g. a 404) or crashes. Without it the
      // pending promises would never settle, and the caller's fallback would never run.
      this.worker.addEventListener('error', () => this.fail(new Error('The voice model could not start in this browser.')));
    }
    return this.worker;
  }

  /** Rejects every waiting request and drops the broken worker, so the next call starts a fresh one. */
  private fail(error: Error) {
    const entries = [...this.pending.values()];
    this.pending.clear();
    this.worker?.terminate();
    this.worker = null;
    entries.forEach((entry) => entry.reject(error));
  }

  private handle(response: KokoroResponse) {
    const entry = this.pending.get(response.id);
    if (!entry) return;
    if (response.type === 'progress') {
      entry.onProgress?.({ fraction: response.fraction, text: response.text });
      return;
    }
    this.pending.delete(response.id);
    if (response.type === 'error') entry.reject(new Error(response.message));
    else entry.resolve(response);
  }

  private send(request: WithoutId<KokoroRequest>, onProgress?: Pending['onProgress']) {
    const id = this.nextId++;
    return new Promise<KokoroResponse>((resolve, reject) => {
      this.pending.set(id, { resolve, reject, onProgress });
      this.getWorker().postMessage({ ...request, id } as KokoroRequest);
    });
  }

  async load(onProgress?: (progress: LoadProgress) => void) {
    const started = performance.now();
    // The worker can't tell where the site lives (its own file sits in assets/), so the page resolves it.
    const voicesUrl = new URL('voices/', document.baseURI).href;
    await this.send({ type: 'load', device: this.plan.device, dtype: this.plan.dtype, voicesUrl }, onProgress);
    return { elapsedMs: performance.now() - started };
  }

  async speak(text: string, voice: string): Promise<SpokenLine> {
    const response = await this.send({ type: 'speak', text, voice });
    if (response.type !== 'audio') throw new Error('Unexpected reply from the voice model.');
    return { audio: response.audio, sampleRate: response.sampleRate };
  }

  async unload() {
    if (!this.worker) return;
    await this.send({ type: 'unload' });
    this.worker.terminate();
    this.worker = null;
  }
}
