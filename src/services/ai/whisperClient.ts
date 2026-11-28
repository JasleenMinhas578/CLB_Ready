import type { LoadProgress, SpeechToText, Transcript } from './types';
import type { WhisperRequest, WhisperResponse } from './whisper.protocol';
import { WorkerRpc } from '@/services/workerRpc';

/** Main-thread wrapper that turns worker messages into promises. */
export class WhisperSpeechToText implements SpeechToText {
  onCrash?: (error: Error) => void;

  private rpc = new WorkerRpc<WhisperRequest, WhisperResponse>(
    () => new Worker(new URL('./whisper.worker.ts', import.meta.url), { type: 'module' }),
    'The speech model could not start in this browser.',
    (error) => this.onCrash?.(error),
  );

  constructor(
    private readonly model: string,
    private readonly device: 'webgpu' | 'wasm',
  ) {}

  async load(onProgress?: (progress: LoadProgress) => void) {
    const started = performance.now();
    await this.rpc.send({ type: 'load', model: this.model, device: this.device }, onProgress);
    return { elapsedMs: performance.now() - started };
  }

  async transcribe(audio: Float32Array): Promise<Transcript> {
    const started = performance.now();
    // Copy so the caller keeps its own buffer, then transfer the copy for free.
    const copy = audio.slice();
    const response = await this.rpc.send({ type: 'transcribe', audio: copy }, undefined, [copy.buffer]);
    if (response.type !== 'transcript') throw new Error('Unexpected reply from speech model.');
    return { text: response.text, words: response.words, elapsedMs: performance.now() - started };
  }

  unload() {
    return this.rpc.unload();
  }
}
