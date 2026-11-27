import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WhisperSpeechToText } from '../src/services/ai/whisperClient';
import { KokoroTextToSpeech } from '../src/services/tts/kokoroClient';
import { SpeechEngineStore } from '../src/services/ai/speechEngine';
import { VoiceEngineStore } from '../src/services/tts/voiceEngine';
import { LIGHT_VOICE, planModels, type DeviceSignals } from '../src/services/device/tier';

const GB = 1024 ** 3;
const laptop: DeviceSignals = { ramGb: 8, cpuCores: 8, webgpu: true, shaderF16: true, maxBufferBytes: 4 * GB, isMobile: false };

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
    if (this.broken) return;
    const reply = { load: 'loaded', unload: 'unloaded' }[request.type] ?? 'error';
    setTimeout(() => this.dispatchEvent(new MessageEvent('message', { data: { id: request.id, type: reply, message: 'unexpected' } })), 0);
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

  it('lets the speech store step down a tier and retry', async () => {
    FakeWorker.brokenCount = 1;
    let steps = 0;
    const store = new SpeechEngineStore(
      async () => planModels(laptop, { stepsDown: steps }),
      (plan) => new WhisperSpeechToText(plan.whisperModel, plan.whisperDevice),
      async () => { steps += 1; return true; },
    );
    await store.ensureLoaded();
    expect(steps).toBe(1);
    expect(store.getStatus()).toMatchObject({ state: 'ready', model: 'base.en' });
  });

  it('lets the voice store fail, so listening can use the browser voice', async () => {
    FakeWorker.brokenCount = 1;
    const store = new VoiceEngineStore(async () => planModels(laptop), (plan) => new KokoroTextToSpeech(plan.voice ?? LIGHT_VOICE));
    await expect(store.ensureLoaded()).rejects.toThrow('could not start');
    expect(store.getStatus().state).toBe('error');
  });
});
