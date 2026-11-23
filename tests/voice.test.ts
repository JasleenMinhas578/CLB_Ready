import { describe, expect, it } from 'vitest';
import { VoiceEngineStore } from '../src/services/tts/voiceEngine';
import { planModels } from '../src/services/device/tier';
import type { ModelPlan } from '../src/services/device/tier';
import type { TextToSpeech } from '../src/services/tts/types';

const plan: ModelPlan = { tier: 'mid', whisperModel: 'w', whisperDevice: 'webgpu', feedbackModel: 'm', keepWhisperLoaded: true, reason: '' };

describe('in-browser voices', () => {
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
