import { CreateMLCEngine, type MLCEngine } from '@mlc-ai/web-llm';
import type { WebLlmRequest, WebLlmResponse } from './webllm.protocol';
import { pinnedAppConfig } from './webllmConfig';

// Runs WebLLM off the main thread. The page talks to it with our own small protocol
// instead of WebLLM's WebWorkerMLCEngine, so the page never has to bundle WebLLM itself.
// Typed loosely: the DOM and WebWorker type libraries can't be mixed in one project.
const worker = self as unknown as {
  postMessage(message: WebLlmResponse): void;
  addEventListener(type: 'message', listener: (event: MessageEvent<WebLlmRequest>) => void): void;
};

let engine: MLCEngine | null = null;

async function complete(request: Extract<WebLlmRequest, { type: 'complete' }>) {
  if (!engine) throw new Error('Feedback model is not loaded yet.');
  let text = '';
  let truncated = false;
  let promptTokens = 0;
  let completionTokens = 0;
  const stream = await engine.chat.completions.create({
    messages: [
      { role: 'system', content: request.system },
      { role: 'user', content: request.user },
    ],
    stream: true,
    stream_options: { include_usage: true },
    temperature: 0.3,
    max_tokens: request.maxTokens,
    ...(request.schema ? { response_format: { type: 'json_object' as const, schema: request.schema } } : {}),
  });
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? '';
    if (delta) {
      text += delta;
      worker.postMessage({ id: request.id, type: 'progress', fraction: null, text });
    }
    if (chunk.choices[0]?.finish_reason === 'length') truncated = true;
    if (chunk.usage) {
      promptTokens = chunk.usage.prompt_tokens;
      completionTokens = chunk.usage.completion_tokens;
    }
  }
  worker.postMessage({ id: request.id, type: 'completed', text, truncated, promptTokens, completionTokens });
}

async function handle(request: WebLlmRequest) {
  switch (request.type) {
    case 'load':
      engine = await CreateMLCEngine(request.modelId, {
        appConfig: pinnedAppConfig,
        initProgressCallback: (report) => worker.postMessage({ id: request.id, type: 'progress', fraction: report.progress, text: report.text }),
      });
      worker.postMessage({ id: request.id, type: 'loaded' });
      return;
    case 'complete':
      return complete(request);
    case 'interrupt':
      await engine?.interruptGenerate();
      worker.postMessage({ id: request.id, type: 'done' });
      return;
    case 'reset':
      await engine?.resetChat();
      worker.postMessage({ id: request.id, type: 'done' });
      return;
    case 'unload':
      await engine?.unload();
      engine = null;
      worker.postMessage({ id: request.id, type: 'unloaded' });
  }
}

worker.addEventListener('message', (event) => {
  // String(error) keeps the error's name in the text, as WebLLM's own worker did,
  // so friendlyModelError can still recognise GPU and memory errors.
  handle(event.data).catch((error: unknown) => worker.postMessage({ id: event.data.id, type: 'error', message: String(error) }));
});
