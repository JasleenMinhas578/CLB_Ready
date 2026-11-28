import { beforeAll, describe, expect, it, vi } from 'vitest';
import type { WebLlmRequest, WebLlmResponse } from '../src/services/ai/webllm.protocol';

/** A fake engine that streams two chunks, then reports usage. */
const engine = {
  chat: {
    completions: {
      create: vi.fn(async () => (async function* () {
        yield { choices: [{ delta: { content: '{"a"' } }] };
        yield { choices: [{ delta: { content: ':1}' }, finish_reason: 'stop' }] };
        yield { choices: [], usage: { prompt_tokens: 12, completion_tokens: 4 } };
      })()),
    },
  },
  interruptGenerate: vi.fn(async () => {}),
  resetChat: vi.fn(async () => {}),
  unload: vi.fn(async () => {}),
};

vi.mock('@mlc-ai/web-llm', () => ({
  prebuiltAppConfig: { model_list: [] },
  CreateMLCEngine: vi.fn(async () => engine),
}));

const posted: WebLlmResponse[] = [];
let listener: (event: { data: WebLlmRequest }) => void = () => {};

beforeAll(async () => {
  vi.stubGlobal('self', {
    postMessage: (message: WebLlmResponse) => posted.push(message),
    addEventListener: (_type: string, handler: typeof listener) => { listener = handler; },
  });
  await import('../src/services/ai/webllm.worker');
});

/** Sends one request and waits for its final reply. */
async function send(request: WebLlmRequest): Promise<WebLlmResponse[]> {
  listener({ data: request });
  for (let i = 0; i < 50 && !posted.some((m) => m.id === request.id && m.type !== 'progress'); i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  return posted.filter((m) => m.id === request.id);
}

describe('WebLLM worker protocol', () => {
  it('replies with an error when asked to complete before loading', async () => {
    const replies = await send({ id: 1, type: 'complete', system: 's', user: 'u', maxTokens: 10 });
    expect(replies).toEqual([{ id: 1, type: 'error', message: 'Error: Feedback model is not loaded yet.' }]);
  });

  it('streams a completion as progress, then sends the full text and token counts', async () => {
    expect(await send({ id: 2, type: 'load', modelId: 'm' })).toEqual([{ id: 2, type: 'loaded' }]);
    const replies = await send({ id: 3, type: 'complete', system: 's', user: 'u', maxTokens: 10, schema: '{}' });
    expect(replies).toEqual([
      { id: 3, type: 'progress', fraction: null, text: '{"a"' },
      { id: 3, type: 'progress', fraction: null, text: '{"a":1}' },
      { id: 3, type: 'completed', text: '{"a":1}', truncated: false, promptTokens: 12, completionTokens: 4 },
    ]);
    expect(engine.chat.completions.create).toHaveBeenCalledWith(expect.objectContaining({
      max_tokens: 10, response_format: { type: 'json_object', schema: '{}' },
    }));
  });
});
