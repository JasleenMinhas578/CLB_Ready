/**
 * Pure tier logic, kept separate from browser APIs so it can be unit-tested.
 * Browsers don't expose exact GPU memory, so we combine rough hints.
 */
export type DeviceTier = 'high' | 'mid' | 'low' | 'no-webgpu';

export interface DeviceSignals {
  /** navigator.deviceMemory in GB (Chrome/Edge only, capped at 8). */
  ramGb: number | null;
  cpuCores: number | null;
  webgpu: boolean;
  /** GPU supports 16-bit floats, needed by q4f16 WebLLM models. */
  shaderF16: boolean;
  /** adapter.limits.maxBufferSize in bytes; a hint at GPU headroom. */
  maxBufferBytes: number | null;
  isMobile: boolean;
}

export interface ModelPlan {
  tier: DeviceTier;
  whisperModel: string;
  whisperDevice: 'webgpu' | 'wasm';
  /** null = light mode (code-only feedback). */
  feedbackModel: string | null;
  /** Keep Whisper loaded between answers? Low tier unloads to save memory. */
  keepWhisperLoaded: boolean;
  reason: string;
}

const GB = 1024 ** 3;

export function chooseTier(signals: DeviceSignals): DeviceTier {
  if (!signals.webgpu) return 'no-webgpu';
  // Safari and Firefox don't report memory: treat unknown as "mid", not "low".
  const ram = signals.ramGb;
  const bigBuffers = (signals.maxBufferBytes ?? 0) >= 2 * GB;

  if (signals.isMobile || (ram !== null && ram <= 4)) return 'low';
  if (ram !== null && ram >= 8 && bigBuffers && signals.shaderF16 && (signals.cpuCores ?? 4) >= 8) return 'high';
  return 'mid';
}

// MLC model ids from WebLLM's prebuilt list. `f16` models need shader-f16;
// the `f32` variants are the fallback for GPUs without it.
function feedbackModelFor(tier: DeviceTier, shaderF16: boolean): string | null {
  const precision = shaderF16 ? 'q4f16_1' : 'q4f32_1';
  switch (tier) {
    case 'high': return `Qwen2.5-3B-Instruct-${precision}-MLC`;
    case 'mid': return `Qwen2.5-1.5B-Instruct-${precision}-MLC`;
    case 'low': return `Llama-3.2-1B-Instruct-${precision}-MLC`;
    case 'no-webgpu': return null;
  }
}

export function planModels(signals: DeviceSignals): ModelPlan {
  const tier = chooseTier(signals);
  const whisper = { high: 'small.en', mid: 'base.en', low: 'tiny.en', 'no-webgpu': 'tiny.en' }[tier];
  const reasons: Record<DeviceTier, string> = {
    high: 'Strong GPU and plenty of memory: using the larger, smarter models.',
    mid: 'Good GPU: using balanced models for speed and quality.',
    low: 'Limited memory: using the smallest models to keep things smooth.',
    'no-webgpu': 'WebGPU is not available: speech runs on the CPU and feedback uses light mode.',
  };

  return {
    tier,
    whisperModel: `Xenova/whisper-${whisper}`,
    whisperDevice: signals.webgpu ? 'webgpu' : 'wasm',
    feedbackModel: feedbackModelFor(tier, signals.shaderF16),
    keepWhisperLoaded: tier === 'high' || tier === 'mid',
    reason: reasons[tier],
  };
}
