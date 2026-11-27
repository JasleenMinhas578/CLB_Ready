import { pipeline, type AutomaticSpeechRecognitionPipeline } from '@huggingface/transformers';
import type { WhisperRequest, WhisperResponse } from './whisper.protocol';
import { useLocalOnnxRuntime } from './onnxRuntime';

useLocalOnnxRuntime();

// Runs off the main thread so the page never freezes while transcribing.
// Typed loosely: the DOM and WebWorker type libraries can't be mixed in one project.
const worker = self as unknown as {
  postMessage(message: WhisperResponse): void;
  addEventListener(type: 'message', listener: (event: MessageEvent<WhisperRequest>) => void): void;
};

// pipeline()'s full typing is too complex for TypeScript; narrow it to what we use.
const createAsr = pipeline as unknown as (
  task: 'automatic-speech-recognition',
  model: string,
  options: Record<string, unknown>,
) => Promise<AutomaticSpeechRecognitionPipeline>;

let asr: AutomaticSpeechRecognitionPipeline | null = null;
const fileProgress = new Map<string, number>();

function post(message: WhisperResponse) {
  worker.postMessage(message);
}

interface ProgressEvent {
  status: string;
  file?: string;
  progress?: number;
}

async function load(id: number, model: string, device: 'webgpu' | 'wasm') {
  fileProgress.clear();
  asr = await createAsr('automatic-speech-recognition', model, {
    device,
    // fp32 is safest on WebGPU; 8-bit keeps the CPU fallback small and quick.
    dtype: device === 'webgpu' ? 'fp32' : 'q8',
    progress_callback: (event: ProgressEvent) => {
      if (event.status === 'progress' && event.file) {
        fileProgress.set(event.file, (event.progress ?? 0) / 100);
        const values = [...fileProgress.values()];
        const fraction = values.reduce((sum, value) => sum + value, 0) / values.length;
        post({ id, type: 'progress', fraction, text: `Downloading ${event.file}` });
      }
    },
  });
  post({ id, type: 'loaded' });
}

interface AsrChunk {
  text: string;
  timestamp: [number, number | null];
}

async function transcribe(id: number, audio: Float32Array) {
  if (!asr) throw new Error('Speech model is not loaded yet.');
  const output = (await asr(audio, { return_timestamps: 'word', chunk_length_s: 30 })) as {
    text: string;
    chunks?: AsrChunk[];
  };
  const words = (output.chunks ?? []).map((chunk) => ({
    text: chunk.text.trim(),
    start: chunk.timestamp[0],
    end: chunk.timestamp[1] ?? chunk.timestamp[0],
  }));
  post({ id, type: 'transcript', text: output.text.trim(), words });
}

worker.addEventListener('message', async (event) => {
  const request = event.data;
  try {
    if (request.type === 'load') await load(request.id, request.model, request.device);
    else if (request.type === 'transcribe') await transcribe(request.id, request.audio);
    else if (request.type === 'unload') {
      await asr?.dispose();
      asr = null;
      post({ id: request.id, type: 'unloaded' });
    }
  } catch (error) {
    post({ id: request.id, type: 'error', message: error instanceof Error ? error.message : String(error) });
  }
});
