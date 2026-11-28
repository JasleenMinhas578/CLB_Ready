/** Messages between the main thread and the WebLLM worker. */
export type WebLlmRequest =
  | { id: number; type: 'load'; modelId: string }
  /** schema is a JSON string; with it WebLLM only writes JSON that matches. */
  | { id: number; type: 'complete'; system: string; user: string; maxTokens: number; schema?: string }
  | { id: number; type: 'interrupt' }
  | { id: number; type: 'reset' }
  | { id: number; type: 'unload' };

export type WebLlmResponse =
  /** While loading, text says what is downloading. While writing a reply, text is the reply so far. */
  | { id: number; type: 'progress'; fraction: number | null; text: string }
  | { id: number; type: 'loaded' }
  | { id: number; type: 'completed'; text: string; truncated: boolean; promptTokens: number; completionTokens: number }
  | { id: number; type: 'done' }
  | { id: number; type: 'unloaded' }
  | { id: number; type: 'error'; message: string };
