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
  /** How Kokoro makes listening voices. Defaults to the light CPU version when missing. */
  voice?: VoicePlan;
  reason: string;
}

/**
 * Kokoro on WebGPU needs full precision (about 330 MB); the 8-bit CPU
 * version is about 90 MB and runs anywhere, so most devices use that.
 */
export interface VoicePlan {
  device: 'webgpu' | 'wasm';
  dtype: 'fp32' | 'q8';
}

export const LIGHT_VOICE: VoicePlan = { device: 'wasm', dtype: 'q8' };

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

/** From strongest to lightest. Falling back moves one step right. */
export const TIER_ORDER: readonly DeviceTier[] = ['high', 'mid', 'low', 'no-webgpu'];

export interface PlanOptions {
  /** A tier the learner picked in Settings, instead of the detected one. */
  tier?: DeviceTier;
  /** How many tiers to step down after models failed to load. */
  stepsDown?: number;
  /** Whisper failed on the GPU: run it like the no-webgpu tier (tiny.en on the CPU). */
  speechOnCpu?: boolean;
}

export function planModels(signals: DeviceSignals, options: PlanOptions = {}): ModelPlan {
  // A chosen tier can't need a GPU the device doesn't have.
  const start = signals.webgpu ? (options.tier ?? chooseTier(signals)) : 'no-webgpu';
  const index = Math.min(TIER_ORDER.indexOf(start) + (options.stepsDown ?? 0), TIER_ORDER.length - 1);
  const tier = TIER_ORDER[index];
  // Bigger models are too slow on the CPU for long answers, so the CPU always gets tiny.en.
  const onCpu = tier === 'no-webgpu' || Boolean(options.speechOnCpu);
  const whisper = onCpu ? 'tiny.en' : { high: 'small.en', mid: 'base.en', low: 'tiny.en' }[tier];
  const reasons: Record<DeviceTier, string> = {
    high: 'Strong graphics chip and plenty of memory, so this uses the largest models.',
    mid: 'Good graphics chip, so this uses balanced models for speed and quality.',
    low: 'Limited memory, so this uses the smallest models to keep things fast.',
    'no-webgpu': 'Light mode: speech-to-text runs on the processor, and feedback uses your measurements only.',
  };

  return {
    tier,
    whisperModel: `Xenova/whisper-${whisper}`,
    // Follow the tier, not the device: stepping down to no-webgpu after a GPU failure must move Whisper to the CPU.
    whisperDevice: onCpu ? 'wasm' : 'webgpu',
    feedbackModel: feedbackModelFor(tier, signals.shaderF16),
    keepWhisperLoaded: tier === 'high' || tier === 'mid',
    voice: tier === 'high' ? { device: 'webgpu', dtype: 'fp32' } : LIGHT_VOICE,
    reason: options.stepsDown ? `${reasons[tier]} (Switched down after a model didn’t load.)` : reasons[tier],
  };
}
