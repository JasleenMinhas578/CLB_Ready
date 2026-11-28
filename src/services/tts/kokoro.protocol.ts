import type { VoiceId } from '@/content/objective';

/** Messages between the main thread and the Kokoro worker. */
export type KokoroRequest =
  /** voicesUrl: where the site serves its voice files (public/voices/), resolved by the page. */
  | { id: number; type: 'load'; device: 'webgpu' | 'wasm'; dtype: 'fp32' | 'q8'; voicesUrl: string }
  | { id: number; type: 'speak'; text: string; voice: VoiceId }
  | { id: number; type: 'unload' };

export type KokoroResponse =
  | { id: number; type: 'progress'; fraction: number | null; text: string }
  | { id: number; type: 'loaded' }
  | { id: number; type: 'audio'; audio: Float32Array; sampleRate: number }
  | { id: number; type: 'unloaded' }
  | { id: number; type: 'error'; message: string };
