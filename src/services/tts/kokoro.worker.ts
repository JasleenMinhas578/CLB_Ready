import { env } from '@huggingface/transformers';
import { KokoroTTS } from 'kokoro-js';
import type { KokoroRequest, KokoroResponse } from './kokoro.protocol';
import { useLocalOnnxRuntime } from '@/services/ai/onnxRuntime';
import { averageProgress, type ProgressEvent } from '@/services/ai/downloadProgress';
import { KOKORO_MODEL, KOKORO_SHA } from '@/services/modelPins';

/**
 * Runs Kokoro (82M parameters, Apache-2.0) off the main thread, so the
 * page stays smooth while voices are made. The model is downloaded once
 * from Hugging Face and then served from the browser cache.
 */
useLocalOnnxRuntime();

// kokoro-js drops the `revision` option, so pin the commit in the download path instead.
// This worker only loads Kokoro, so changing it for the whole worker is safe.
env.remotePathTemplate = `{model}/resolve/${KOKORO_SHA}/`;

// kokoro-js fetches voices from a fixed `resolve/main` URL with no option to change it.
// Send those requests to our own copies in public/voices/ (taken from the pinned commit).
const HF_VOICES = `https://huggingface.co/${KOKORO_MODEL}/resolve/main/voices/`;
let voicesUrl = '';
const realFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = (input, init) =>
  realFetch(typeof input === 'string' && input.startsWith(HF_VOICES) ? voicesUrl + input.slice(HF_VOICES.length) : input, init);

// Typed loosely: the DOM and WebWorker type libraries can't be mixed in one project.
const worker = self as unknown as {
  postMessage(message: KokoroResponse, transfer?: Transferable[]): void;
  addEventListener(type: 'message', listener: (event: MessageEvent<KokoroRequest>) => void): void;
};

let tts: KokoroTTS | null = null;
const fileProgress = new Map<string, number>();

async function handle(request: KokoroRequest) {
  switch (request.type) {
    case 'load': {
      fileProgress.clear();
      voicesUrl = request.voicesUrl;
      tts = await KokoroTTS.from_pretrained(KOKORO_MODEL, {
        dtype: request.dtype,
        device: request.device,
        progress_callback: (event: ProgressEvent) => {
          const fraction = averageProgress(fileProgress, event);
          if (fraction !== null) worker.postMessage({ id: request.id, type: 'progress', fraction, text: `Downloading ${event.file}` });
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
