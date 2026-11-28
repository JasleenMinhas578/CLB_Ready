import type { CompleteOptions, FeedbackModel, GenerationStats, LoadProgress } from './types';
import type { WebLlmRequest, WebLlmResponse } from './webllm.protocol';
import { WorkerRpc } from '@/services/workerRpc';
import { WEBLLM_MODELS } from '@/services/modelPins';

/** Approximate GPU memory WebLLM lists for a model, in MB. */
export function estimatedGpuMb(modelId: string): number | null {
  return WEBLLM_MODELS[modelId]?.vramMb ?? null;
}

/** Main-thread wrapper for the WebLLM worker, which holds the whole library. */
export class WebLlmFeedbackModel implements FeedbackModel {
  onCrash?: (error: Error) => void;

  private rpc = new WorkerRpc<WebLlmRequest, WebLlmResponse>(
    () => new Worker(new URL('./webllm.worker.ts', import.meta.url), { type: 'module' }),
    'The feedback model could not start in this browser.',
    (error) => this.onCrash?.(error),
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
    let soFar = '';
    const reply = await this.rpc.send(
      { type: 'complete', system, user, maxTokens, schema: schema ? JSON.stringify(schema) : undefined },
      // While writing, the worker's progress text is the newly written part.
      ({ text }) => {
        firstTokenAt ??= performance.now();
        soFar += text;
        onText?.(soFar);
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
