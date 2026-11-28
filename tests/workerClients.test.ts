import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WhisperSpeechToText } from '../src/services/ai/whisperClient';
import { WebLlmFeedbackModel } from '../src/services/ai/webllmClient';
import { KokoroTextToSpeech } from '../src/services/tts/kokoroClient';
import { SpeechEngineStore } from '../src/services/ai/speechEngine';
import { VoiceEngineStore } from '../src/services/tts/voiceEngine';
import { LIGHT_VOICE, planModels, type DeviceSignals } from '../src/services/device/tier';
import { WorkerRpc } from '../src/services/workerRpc';
import { fallBackSpeechToCpu, getModelPlan, setTierChoice } from '../src/services/device/plan';
import { getVoiceEngine } from '../src/services/tts/voiceEngine';
import { unloadAllModels } from '../src/services/unloadModels';

const GB = 1024 ** 3;
const laptop: DeviceSignals = { ramGb: 8, cpuCores: 8, webgpu: true, shaderF16: true, maxBufferBytes: 4 * GB, isMobile: false };

vi.mock('../src/services/device/detectDevice', () => ({ detectDevice: async () => ({ ...laptop, gpuVendor: null, gpuArchitecture: null }) }));

/** Stands in for a browser Worker: either its script fails to load, or it answers every request. */
class FakeWorker extends EventTarget {
  static created: FakeWorker[] = [];
  /** How many of the next workers fail to load, like a 404 on the worker script. */
  static brokenCount = 0;
  readonly broken: boolean;
  terminated = false;

  constructor() {
    super();
    FakeWorker.created.push(this);
    this.broken = FakeWorker.brokenCount > 0;
    if (this.broken) {
      FakeWorker.brokenCount -= 1;
      setTimeout(() => this.dispatchEvent(new Event('error')), 0);
    }
  }

  postMessage(request: { id: number; type: string }) {
    // 'hang' stands in for long work, like scoring, that never replies during the test.
    if (this.broken || request.type === 'hang') return;
    const send = (data: object) => setTimeout(() => this.dispatchEvent(new MessageEvent('message', { data: { id: request.id, ...data } })), 0);
    if (request.type === 'complete') {
      // Like the WebLLM worker: each new part of the reply, then the whole reply.
      send({ type: 'progress', fraction: null, text: 'Hel' });
      send({ type: 'progress', fraction: null, text: 'lo' });
      send({ type: 'completed', text: 'Hello', truncated: false, promptTokens: 1, completionTokens: 2 });
      return;
    }
    const reply = { load: 'loaded', unload: 'unloaded' }[request.type] ?? 'error';
    send({ type: reply, message: 'unexpected' });
  }

  terminate() {
    this.terminated = true;
  }
}

beforeEach(() => {
  FakeWorker.created = [];
  FakeWorker.brokenCount = 0;
  vi.stubGlobal('Worker', FakeWorker);
  vi.stubGlobal('document', { baseURI: 'http://localhost/' });
});

afterEach(() => {
  vi.unstubAllGlobals();
  setTierChoice('auto'); // Clears the CPU fallback for the next test.
});

describe('worker clients when the worker fails to load', () => {
  it('Whisper rejects the waiting load, then starts a fresh worker next time', async () => {
    FakeWorker.brokenCount = 1;
    const client = new WhisperSpeechToText('Xenova/whisper-base.en', 'webgpu');
    await expect(client.load()).rejects.toThrow('The speech model could not start in this browser.');
    expect(FakeWorker.created[0].terminated).toBe(true);
    await expect(client.load()).resolves.toHaveProperty('elapsedMs');
    expect(FakeWorker.created).toHaveLength(2);
  });

  it('Kokoro rejects the waiting load, then starts a fresh worker next time', async () => {
    FakeWorker.brokenCount = 1;
    const client = new KokoroTextToSpeech(LIGHT_VOICE);
    await expect(client.load()).rejects.toThrow('The voice model could not start in this browser.');
    expect(FakeWorker.created[0].terminated).toBe(true);
    await expect(client.load()).resolves.toHaveProperty('elapsedMs');
    expect(FakeWorker.created).toHaveLength(2);
  });

  it('moves speech to the CPU and retries when Whisper fails on the GPU', async () => {
    FakeWorker.brokenCount = 1;
    const store = new SpeechEngineStore(
      getModelPlan,
      (plan) => new WhisperSpeechToText(plan.whisperModel, plan.whisperDevice),
      fallBackSpeechToCpu,
    );
    expect((await getModelPlan()).whisperDevice).toBe('webgpu');
    await store.ensureLoaded();
    expect((await getModelPlan()).whisperDevice).toBe('wasm');
    expect(FakeWorker.created).toHaveLength(2);
    expect(store.getStatus()).toMatchObject({ state: 'ready', model: 'tiny.en' });
  });

  it('lets the voice store fail, so listening can use the browser voice', async () => {
    FakeWorker.brokenCount = 1;
    const store = new VoiceEngineStore(async () => planModels(laptop), (plan) => new KokoroTextToSpeech(plan.voice ?? LIGHT_VOICE));
    await expect(store.ensureLoaded()).rejects.toThrow('could not start');
    expect(store.getStatus().state).toBe('error');
  });
});

describe('a worker that crashes after loading', () => {
  it('leaves the speech store in error, then starts a fresh worker on next use', async () => {
    const store = new SpeechEngineStore(async () => planModels(laptop), (plan) => new WhisperSpeechToText(plan.whisperModel, plan.whisperDevice));
    await store.ensureLoaded();
    FakeWorker.created[0].dispatchEvent(new Event('error'));
    expect(store.getStatus()).toMatchObject({ state: 'error', error: 'The speech model could not start in this browser.' });
    await store.ensureLoaded();
    expect(FakeWorker.created).toHaveLength(2);
    expect(store.getStatus().state).toBe('ready');
  });
});

describe('the WebLLM client', () => {
  it('joins the streamed parts into the reply so far', async () => {
    const seen: string[] = [];
    const reply = await new WebLlmFeedbackModel('m').complete('s', 'u', { maxTokens: 10, onText: (text) => seen.push(text) });
    expect(seen).toEqual(['Hel', 'Hello']);
    expect(reply.text).toBe('Hello');
  });
});

describe('unloading a worker', () => {
  it('rejects requests still waiting, then stops the worker', async () => {
    const rpc = new WorkerRpc<{ id: number; type: string }, { id: number; type: string }>(() => new FakeWorker() as unknown as Worker, 'could not start');
    const waiting = rpc.send({ type: 'hang' });
    await rpc.unload();
    await expect(waiting).rejects.toThrow('unloaded');
    expect(FakeWorker.created[0].terminated).toBe(true);
    expect(rpc.running).toBe(false);
  });
});

describe('freeing every model', () => {
  it('also unloads the listening voice', async () => {
    const voice = await getVoiceEngine();
    await voice.ensureLoaded();
    expect(voice.getStatus().state).toBe('ready');
    await unloadAllModels();
    expect(voice.getStatus().state).toBe('idle');
    expect(FakeWorker.created[0].terminated).toBe(true);
  });
});
