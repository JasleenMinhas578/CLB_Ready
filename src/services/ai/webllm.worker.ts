import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

// WebLLM's own handler runs the model inside this worker.
const handler = new WebWorkerMLCEngineHandler();
self.onmessage = (message: MessageEvent) => handler.onmessage(message);
