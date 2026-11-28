import type { CompleteOptions, FeedbackModel, GenerationStats, LoadProgress } from './types';
import type { WebLlmRequest, WebLlmResponse } from './webllm.protocol';
import { WorkerRpc } from '@/services/workerRpc';

/**
 * GPU memory WebLLM lists for each pinned model, in MB. Copied from WebLLM's
 * prebuiltAppConfig so the page doesn't bundle the library just to read it;
 * tests/modelPins.test.ts checks they still match.
 */
export const WEBLLM_VRAM_MB: Record<string, number> = {
  'Qwen2.5-3B-Instruct-q4f16_1-MLC': 2504.76,
  'Qwen2.5-3B-Instruct-q4f32_1-MLC': 2893.64,
  'Qwen2.5-1.5B-Instruct-q4f16_1-MLC': 1629.75,
  'Qwen2.5-1.5B-Instruct-q4f32_1-MLC': 1888.97,
  'Llama-3.2-1B-Instruct-q4f16_1-MLC': 879.04,
  'Llama-3.2-1B-Instruct-q4f32_1-MLC': 1128.82,
};

/** Approximate GPU memory WebLLM lists for a model, in MB. */
export function estimatedGpuMb(modelId: string): number | null {
  return WEBLLM_VRAM_MB[modelId] ?? null;
}

/** Main-thread wrapper for the WebLLM worker, which holds the whole library. */
export class WebLlmFeedbackModel implements FeedbackModel {
  private rpc = new WorkerRpc<WebLlmRequest, WebLlmResponse>(
    () => new Worker(new URL('./webllm.worker.ts', import.meta.url), { type: 'module' }),
    'The feedback model could not start in this browser.',
  );

  constructor(private readonly modelId: string) {}

  async load(onProgress?: (progress: LoadProgress) => void) {
    const started = performance.now();
    await this.rpc.send({ type: 'load', modelId: this.modelId }, onProgress);
    return { elapsedMs: performance.now() - started };
  }

  async complete(system: string, user: string, { schema, maxTokens, onText }: CompleteOptions) {
    const started = performance.now();
    let firstTokenAt: number | null = null;
    const reply = await this.rpc.send(
      { type: 'complete', system, user, maxTokens, schema: schema ? JSON.stringify(schema) : undefined },
      // While writing, the worker's progress text is the reply so far.
      ({ text }) => {
        firstTokenAt ??= performance.now();
        onText?.(text);
      },
    );
    if (reply.type !== 'completed') throw new Error('Unexpected reply from the feedback model.');
    const { text, truncated, promptTokens, completionTokens } = reply;

    const totalMs = performance.now() - started;
    const decodeMs = firstTokenAt ? performance.now() - firstTokenAt : totalMs;
    const stats: GenerationStats = {
      promptTokens,
      completionTokens,
      firstTokenMs: (firstTokenAt ?? performance.now()) - started,
      totalMs,
      tokensPerSecond: decodeMs > 0 ? completionTokens / (decodeMs / 1000) : 0,
    };
    return { text, stats, truncated };
  }

  // Both do nothing before load, so they never start a worker just to stop or clear it.
  interrupt() {
    if (this.rpc.running) this.rpc.send({ type: 'interrupt' }).catch(() => undefined);
  }

  async reset() {
    if (this.rpc.running) await this.rpc.send({ type: 'reset' });
  }

  unload() {
    return this.rpc.unload();
  }
}
