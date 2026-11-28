import { describe, expect, it } from 'vitest';
import { SpeechEngineStore } from '../src/services/ai/speechEngine';
import type { ModelPlan } from '../src/services/device/tier';
import type { SpeechToText } from '../src/services/ai/types';
import type { LoadableModel } from '../src/services/ai/modelStore';

function planFor(keepWhisperLoaded: boolean): ModelPlan {
  return {
    tier: keepWhisperLoaded ? 'mid' : 'low',
    whisperModel: 'Xenova/whisper-base.en',
    whisperDevice: 'webgpu',
    feedbackModel: null,
    keepWhisperLoaded,
    reason: '',
  };
}

function fakeEngine(log: string[], failLoad = false): SpeechToText {
  return {
    async load(onProgress) {
      log.push('load');
      onProgress?.({ fraction: 0.5, text: 'half' });
      if (failLoad) throw new Error('download failed');
      return { elapsedMs: 1 };
    },
    async transcribe() {
      log.push('transcribe');
      return { text: 'hello there', words: [], elapsedMs: 1 };
    },
    async unload() {
      log.push('unload');
    },
  };
}

describe('SpeechEngineStore', () => {
  it('loads once even when preloaded many times', async () => {
    const log: string[] = [];
    const store = new SpeechEngineStore(async () => planFor(true), () => fakeEngine(log));
    store.preload();
    store.preload();
    await store.ensureLoaded();
    expect(log).toEqual(['load']);
    expect(store.getStatus().state).toBe('ready');
    expect(store.getStatus().model).toBe('base.en');
  });

  it('keeps the model loaded on mid and high tiers', async () => {
    const log: string[] = [];
    const store = new SpeechEngineStore(async () => planFor(true), () => fakeEngine(log));
    await store.transcribe(new Float32Array(10));
    await store.transcribe(new Float32Array(10));
    expect(log).toEqual(['load', 'transcribe', 'transcribe']);
  });

  it('unloads after each answer on low tier, then reloads for the next', async () => {
    const log: string[] = [];
    const store = new SpeechEngineStore(async () => planFor(false), () => fakeEngine(log));
    await store.transcribe(new Float32Array(10));
    expect(store.getStatus().state).toBe('idle');
    await store.transcribe(new Float32Array(10));
    expect(log).toEqual(['load', 'transcribe', 'unload', 'load', 'transcribe', 'unload']);
  });

  it('reports load errors and lets the learner retry', async () => {
    const log: string[] = [];
    let fail = true;
    const store = new SpeechEngineStore(async () => planFor(true), () => fakeEngine(log, fail));
    store.preload();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(store.getStatus().state).toBe('error');
    fail = false;
    await store.ensureLoaded();
    expect(store.getStatus().state).toBe('ready');
  });

  it('notifies subscribers as status changes', async () => {
    const store = new SpeechEngineStore(async () => planFor(true), () => fakeEngine([]));
    const seen: string[] = [];
    store.subscribe(() => seen.push(store.getStatus().state));
    await store.ensureLoaded();
    expect(seen[0]).toBe('loading');
    expect(seen[seen.length - 1]).toBe('ready');
  });

  it('drops a download that finishes after unload, without falling back', async () => {
    const log: string[] = [];
    let finishLoad = () => {};
    let fellBack = false;
    const slowEngine = (): SpeechToText => ({
      ...fakeEngine(log),
      load: () => new Promise((resolve) => { log.push('load'); finishLoad = () => resolve({ elapsedMs: 1 }); }),
    });
    const store = new SpeechEngineStore(async () => planFor(true), slowEngine, async () => (fellBack = true));
    const loading = store.ensureLoaded();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await store.unload();
    finishLoad();
    await expect(loading).rejects.toThrow('unloaded');
    expect(store.getStatus().state).toBe('idle');
    expect(fellBack).toBe(false);
    expect(log).toEqual(['load', 'unload', 'unload']);
    // The next use starts a fresh load instead of reusing the dropped one.
    const next = store.ensureLoaded();
    await new Promise((resolve) => setTimeout(resolve, 0));
    finishLoad();
    await next;
    expect(store.getStatus().state).toBe('ready');
  });

  it('forgets a crashed model and reloads it on next use', async () => {
    const log: string[] = [];
    const engines: LoadableModel[] = [];
    const store = new SpeechEngineStore(async () => planFor(true), () => {
      const engine = fakeEngine(log);
      engines.push(engine);
      return engine;
    });
    await store.ensureLoaded();
    engines[0].onCrash?.(new Error('The speech model could not start in this browser.'));
    expect(store.getStatus()).toMatchObject({ state: 'error', error: 'The speech model could not start in this browser.' });
    await store.transcribe(new Float32Array(10));
    expect(engines).toHaveLength(2);
    expect(store.getStatus().state).toBe('ready');
  });
});
