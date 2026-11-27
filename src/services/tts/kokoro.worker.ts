import { KokoroTTS } from 'kokoro-js';
import type { KokoroRequest, KokoroResponse } from './kokoro.protocol';
import { useLocalOnnxRuntime } from '@/services/ai/onnxRuntime';

useLocalOnnxRuntime();

/**
 * Runs Kokoro (82M parameters, Apache-2.0) off the main thread, so the
 * page stays smooth while voices are made. The model is downloaded once
 * from Hugging Face and then served from the browser cache.
 */
const MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';

// Typed loosely: the DOM and WebWorker type libraries can't be mixed in one project.
const worker = self as unknown as {
  postMessage(message: KokoroResponse, transfer?: Transferable[]): void;
  addEventListener(type: 'message', listener: (event: MessageEvent<KokoroRequest>) => void): void;
};

let tts: KokoroTTS | null = null;
const fileProgress = new Map<string, number>();

interface ProgressEvent {
  status: string;
  file?: string;
  progress?: number;
}

async function handle(request: KokoroRequest) {
  switch (request.type) {
    case 'load': {
      fileProgress.clear();
      tts = await KokoroTTS.from_pretrained(MODEL, {
        dtype: request.dtype,
        device: request.device,
        progress_callback: (event: ProgressEvent) => {
          if (event.status !== 'progress' || !event.file) return;
          fileProgress.set(event.file, (event.progress ?? 0) / 100);
          const values = [...fileProgress.values()];
          worker.postMessage({ id: request.id, type: 'progress', fraction: values.reduce((a, b) => a + b, 0) / values.length, text: `Downloading ${event.file}` });
        },
      });
      worker.postMessage({ id: request.id, type: 'loaded' });
      return;
    }
    case 'speak': {
      if (!tts) throw new Error('Voice model is not loaded yet.');
      const result = await tts.generate(request.text, { voice: request.voice });
      const audio = result.audio;
      worker.postMessage({ id: request.id, type: 'audio', audio, sampleRate: result.sampling_rate }, [audio.buffer]);
      return;
    }
    case 'unload':
      tts = null;
      worker.postMessage({ id: request.id, type: 'unloaded' });
  }
}

worker.addEventListener('message', (event) => {
  handle(event.data).catch((error: unknown) => {
    worker.postMessage({ id: event.data.id, type: 'error', message: error instanceof Error ? error.message : String(error) });
  });
});
