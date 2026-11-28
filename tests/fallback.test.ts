import { describe, expect, it } from 'vitest';
import { planModels, type DeviceSignals } from '../src/services/device/tier';
import { SpeechEngineStore } from '../src/services/ai/speechEngine';
import { friendlyModelError } from '../src/services/ai/errorText';
import type { ModelPlan } from '../src/services/device/tier';
import type { SpeechToText } from '../src/services/ai/types';

const GB = 1024 ** 3;
const laptop: DeviceSignals = { ramGb: 8, cpuCores: 8, webgpu: true, shaderF16: true, maxBufferBytes: 4 * GB, isMobile: false };

describe('planModels options', () => {
  it('uses the tier chosen in Settings', () => {
    expect(planModels(laptop, { tier: 'low' }).feedbackModel).toBe('Llama-3.2-1B-Instruct-q4f16_1-MLC');
  });

  it('steps down one tier per fallback, stopping at light mode', () => {
    expect(planModels(laptop, { stepsDown: 1 }).tier).toBe('mid');
    expect(planModels(laptop, { stepsDown: 2 }).tier).toBe('low');
    expect(planModels(laptop, { stepsDown: 9 }).tier).toBe('no-webgpu');
  });

  it('never picks a GPU tier on a device without WebGPU', () => {
    expect(planModels({ ...laptop, webgpu: false }, { tier: 'high' }).tier).toBe('no-webgpu');
  });
});

describe('automatic fallback', () => {
  it('retries once with a lighter plan after a failed load', async () => {
    let steps = 0;
    const loaded: string[] = [];
    const getPlan = async (): Promise<ModelPlan> => planModels(laptop, { stepsDown: steps });
    const engine = (plan: ModelPlan): SpeechToText => ({
      async load() {
        if (plan.tier === 'high') throw new Error('Out of memory');
        loaded.push(plan.whisperModel);
        return { elapsedMs: 1 };
      },
      async transcribe() { return { text: '', words: [], elapsedMs: 1 }; },
      async unload() {},
    });
    const store = new SpeechEngineStore(getPlan, engine, async () => { steps += 1; return true; });
    await store.ensureLoaded();
    expect(steps).toBe(1);
    expect(loaded).toEqual(['Xenova/whisper-base.en']);
    expect(store.getStatus().state).toBe('ready');
  });

  it('reports an error if the lighter plan fails too', async () => {
    const store = new SpeechEngineStore(
      async () => planModels(laptop),
      () => ({
        async load() { throw new Error('download failed'); },
        async transcribe() { return { text: '', words: [], elapsedMs: 1 }; },
        async unload() {},
      }),
      async () => true,
    );
    await store.preload();
    expect(store.getStatus().state).toBe('error');
  });
});

describe('friendlyModelError', () => {
  it('explains common failures in plain words', () => {
    const quota = new Error('Quota exceeded');
    quota.name = 'QuotaExceededError';
    expect(friendlyModelError(quota).includes('free space')).toBe(true);
    expect(friendlyModelError(new Error('GPUDevice was lost')).includes('graphics chip')).toBe(true);
    expect(friendlyModelError(new Error('Failed to fetch')).includes('internet')).toBe(true);
    expect(friendlyModelError(undefined)).toBe('Pip could not finish this time. Try again.');
  });
});
