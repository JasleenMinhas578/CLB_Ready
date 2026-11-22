/** Messages between the main thread and the Whisper worker. */
export type WhisperRequest =
  | { id: number; type: 'load'; model: string; device: 'webgpu' | 'wasm' }
  | { id: number; type: 'transcribe'; audio: Float32Array }
  | { id: number; type: 'unload' };

export type WhisperResponse =
  | { id: number; type: 'progress'; fraction: number | null; text: string }
  | { id: number; type: 'loaded' }
  | { id: number; type: 'transcript'; text: string; words: { text: string; start: number; end: number }[] }
  | { id: number; type: 'unloaded' }
  | { id: number; type: 'error'; message: string };
