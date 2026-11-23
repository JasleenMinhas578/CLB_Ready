import { CreateWebWorkerMLCEngine, prebuiltAppConfig, type WebWorkerMLCEngine } from '@mlc-ai/web-llm';
import type { CompleteOptions, FeedbackModel, GenerationStats, LoadProgress } from './types';

/** Approximate GPU memory WebLLM lists for a model, in MB. */
export function estimatedGpuMb(modelId: string): number | null {
  const record = prebuiltAppConfig.model_list.find((model) => model.model_id === modelId);
  return record?.vram_required_MB ?? null;
}

export class WebLlmFeedbackModel implements FeedbackModel {
  private engine: WebWorkerMLCEngine | null = null;

  constructor(private readonly modelId: string) {}

  async load(onProgress?: (progress: LoadProgress) => void) {
    const started = performance.now();
    const worker = new Worker(new URL('./webllm.worker.ts', import.meta.url), { type: 'module' });
    this.engine = await CreateWebWorkerMLCEngine(worker, this.modelId, {
      initProgressCallback: (report) => onProgress?.({ fraction: report.progress, text: report.text }),
    });
    return { elapsedMs: performance.now() - started };
  }

  async complete(system: string, user: string, { schema, maxTokens, onText }: CompleteOptions) {
    if (!this.engine) throw new Error('Feedback model is not loaded yet.');
    const started = performance.now();
    let firstTokenAt: number | null = null;
    let text = '';
    let promptTokens = 0;
    let completionTokens = 0;
    let truncated = false;

    const stream = await this.engine.chat.completions.create({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      stream: true,
      stream_options: { include_usage: true },
      temperature: 0.3,
      max_tokens: maxTokens,
      // With a schema, WebLLM forces valid JSON that matches it, so the UI never gets mush.
      ...(schema ? { response_format: { type: 'json_object' as const, schema: JSON.stringify(schema) } } : {}),
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? '';
      if (delta) {
        firstTokenAt ??= performance.now();
        text += delta;
        onText?.(text);
      }
      if (chunk.choices[0]?.finish_reason === 'length') truncated = true;
      if (chunk.usage) {
        promptTokens = chunk.usage.prompt_tokens;
        completionTokens = chunk.usage.completion_tokens;
      }
    }

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

  interrupt() {
    void this.engine?.interruptGenerate();
  }

  async reset() {
    await this.engine?.resetChat();
  }

  async unload() {
    await this.engine?.unload();
    this.engine = null;
  }
}
