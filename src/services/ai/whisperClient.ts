import type { LoadProgress, SpeechToText, Transcript } from './types';
import type { WhisperRequest, WhisperResponse } from './whisper.protocol';

/** Omit that works on each member of a union separately. */
type WithoutId<T> = T extends unknown ? Omit<T, 'id'> : never;

type Pending = {
  resolve: (response: WhisperResponse) => void;
  reject: (error: Error) => void;
  onProgress?: (progress: LoadProgress) => void;
};

/** Main-thread wrapper that turns worker messages into promises. */
export class WhisperSpeechToText implements SpeechToText {
  private worker: Worker | null = null;
  private nextId = 1;
  private pending = new Map<number, Pending>();

  constructor(
    private readonly model: string,
    private readonly device: 'webgpu' | 'wasm',
  ) {}

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL('./whisper.worker.ts', import.meta.url), { type: 'module' });
      this.worker.addEventListener('message', (event: MessageEvent<WhisperResponse>) => this.handle(event.data));
    }
    return this.worker;
  }

  private handle(response: WhisperResponse) {
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

  private send(request: WithoutId<WhisperRequest>, onProgress?: Pending['onProgress'], transfer: Transferable[] = []) {
    const id = this.nextId++;
    return new Promise<WhisperResponse>((resolve, reject) => {
      this.pending.set(id, { resolve, reject, onProgress });
      this.getWorker().postMessage({ ...request, id } as WhisperRequest, transfer);
    });
  }

  async load(onProgress?: (progress: LoadProgress) => void) {
    const started = performance.now();
    await this.send({ type: 'load', model: this.model, device: this.device }, onProgress);
    return { elapsedMs: performance.now() - started };
  }

  async transcribe(audio: Float32Array): Promise<Transcript> {
    const started = performance.now();
    // Copy so the caller keeps its own buffer, then transfer the copy for free.
    const copy = audio.slice();
    const response = await this.send({ type: 'transcribe', audio: copy }, undefined, [copy.buffer]);
    if (response.type !== 'transcript') throw new Error('Unexpected reply from speech model.');
    return { text: response.text, words: response.words, elapsedMs: performance.now() - started };
  }

  async unload() {
    if (!this.worker) return;
    await this.send({ type: 'unload' });
    this.worker.terminate();
    this.worker = null;
  }
}
