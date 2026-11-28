import { describe, expect, it } from 'vitest';
import { VoiceEngineStore } from '../src/services/tts/voiceEngine';
import { planModels } from '../src/services/device/tier';
import type { ModelPlan } from '../src/services/device/tier';
import type { TextToSpeech } from '../src/services/tts/types';
import { aiVoiceFailed } from '../src/features/task/objective/useClipPlayer';

const plan: ModelPlan = { tier: 'mid', whisperModel: 'w', whisperDevice: 'webgpu', feedbackModel: 'm', keepWhisperLoaded: true, reason: '' };

describe('in-browser voices', () => {
  it('goes straight to the browser voice once Kokoro has failed to load', async () => {
    let loads = 0;
    const broken: TextToSpeech = {
      async load() { loads += 1; throw new Error('out of memory'); },
      async speak() { throw new Error('not loaded'); },
      async unload() {},
    };
    const store = new VoiceEngineStore(async () => plan, () => broken);
    expect(aiVoiceFailed(store.getStatus())).toBe(false); // First clip: try Kokoro.
    await expect(store.ensureLoaded()).rejects.toThrow('out of memory');
    expect(aiVoiceFailed(store.getStatus())).toBe(true); // Next clips: skip it.
    await store.unload(); // A tier change in Settings allows another try.
    expect(aiVoiceFailed(store.getStatus())).toBe(false);
    expect(loads).toBe(1);
  });

  it('makes lines one at a time, in the order they were asked for', async () => {
    const log: string[] = [];
    let running = 0;
    let overlapped = false;
    const engine: TextToSpeech = {
      async load() { log.push('load'); return { elapsedMs: 1 }; },
      async speak(text) {
        running += 1;
        if (running > 1) overlapped = true;
        await new Promise((resolve) => setTimeout(resolve, text === 'first' ? 15 : 1));
        running -= 1;
        log.push(text);
        return { audio: new Float32Array(10), sampleRate: 24000 };
      },
      async unload() {},
    };
    const store = new VoiceEngineStore(async () => plan, () => engine);
    await Promise.all([store.speak('first', 'af_heart'), store.speak('second', 'am_adam'), store.speak('third', 'bf_emma')]);
    expect(log).toEqual(['load', 'first', 'second', 'third']);
    expect(overlapped).toBe(false);
    expect(store.getStatus().model).toBe('Kokoro 82M (8-bit, CPU)');
  });

  it('uses the GPU voice only on strong devices', () => {
    const laptop = { ramGb: 8, cpuCores: 8, webgpu: true, shaderF16: true, maxBufferBytes: 4 * 1024 ** 3, isMobile: false };
    expect(planModels(laptop).voice).toEqual({ device: 'webgpu', dtype: 'fp32' });
    expect(planModels({ ...laptop, ramGb: 4 }).voice).toEqual({ device: 'wasm', dtype: 'q8' });
    expect(planModels({ ...laptop, webgpu: false }).voice).toEqual({ device: 'wasm', dtype: 'q8' });
  });
});
