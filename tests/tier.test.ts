import { describe, expect, it } from 'vitest';
import { chooseTier, planModels, type DeviceSignals, type ModelPlan } from '../src/services/device/tier';
import { SpeechEngineStore } from '../src/services/ai/speechEngine';
import type { SpeechToText } from '../src/services/ai/types';

const GB = 1024 ** 3;
const laptop: DeviceSignals = { ramGb: 8, cpuCores: 8, webgpu: true, shaderF16: true, maxBufferBytes: 4 * GB, isMobile: false };

describe('chooseTier', () => {
  it('uses light mode without WebGPU', () => {
    expect(chooseTier({ ...laptop, webgpu: false })).toBe('no-webgpu');
  });

  it('treats phones and 4 GB devices as low tier', () => {
    expect(chooseTier({ ...laptop, isMobile: true })).toBe('low');
    expect(chooseTier({ ...laptop, ramGb: 4 })).toBe('low');
  });

  it('gives strong laptops the high tier', () => {
    expect(chooseTier(laptop)).toBe('high');
  });

  it('falls back to mid when any high-tier hint is missing', () => {
    expect(chooseTier({ ...laptop, shaderF16: false })).toBe('mid');
    expect(chooseTier({ ...laptop, cpuCores: 4 })).toBe('mid');
    expect(chooseTier({ ...laptop, ramGb: null })).toBe('mid');
  });
});

describe('planModels', () => {
  it('picks f32 models when the GPU lacks 16-bit maths', () => {
    expect(planModels({ ...laptop, cpuCores: 4, shaderF16: false }).feedbackModel).toBe('Qwen2.5-1.5B-Instruct-q4f32_1-MLC');
  });

  it('runs Whisper on the CPU with no feedback model when WebGPU is missing', () => {
    const plan = planModels({ ...laptop, webgpu: false });
    expect(plan.whisperDevice).toBe('wasm');
    expect(plan.whisperModel).toBe('Xenova/whisper-tiny.en');
    expect(plan.feedbackModel).toBeNull();
  });

  it('unloads Whisper between answers only on low tiers', () => {
    expect(planModels(laptop).keepWhisperLoaded).toBe(true);
    expect(planModels({ ...laptop, isMobile: true }).keepWhisperLoaded).toBe(false);
  });

  it('moves Whisper to the CPU after stepping down to the no-WebGPU tier', () => {
    expect(planModels(laptop, { stepsDown: 3 })).toMatchObject({ tier: 'no-webgpu', whisperDevice: 'wasm' });
    expect(planModels(laptop, { stepsDown: 2 }).whisperDevice).toBe('webgpu');
  });

  it('reaches the CPU after one failed WebGPU load on a low-tier device', async () => {
    let steps = 0;
    const devices: string[] = [];
    const store = new SpeechEngineStore(
      async () => planModels({ ...laptop, isMobile: true }, { stepsDown: steps }),
      (plan: ModelPlan): SpeechToText => ({
        async load() {
          devices.push(plan.whisperDevice);
          if (plan.whisperDevice === 'webgpu') throw new Error('GPUDevice was lost');
          return { elapsedMs: 1 };
        },
        async transcribe() { return { text: '', words: [], elapsedMs: 1 }; },
        async unload() {},
      }),
      async () => { steps += 1; return true; },
    );
    await store.ensureLoaded();
    expect(devices).toEqual(['webgpu', 'wasm']);
    expect(store.getStatus().state).toBe('ready');
  });
});
