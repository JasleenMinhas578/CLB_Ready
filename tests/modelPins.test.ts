import { describe, expect, it } from 'vitest';
import { planModels, TIER_ORDER, type DeviceSignals } from '../src/services/device/tier';
import { pinnedAppConfig } from '../src/services/ai/webllmClient';
import { WEBLLM_MODEL_SHAS, WHISPER_SHAS } from '../src/services/modelPins';

const GB = 1024 ** 3;
const base: DeviceSignals = { ramGb: 8, cpuCores: 8, webgpu: true, shaderF16: true, maxBufferBytes: 4 * GB, isMobile: false };
const plans = [true, false].flatMap((shaderF16) => TIER_ORDER.map((tier) => planModels({ ...base, shaderF16 }, { tier })));

describe('model pins', () => {
  it('pins every WebLLM model a tier can pick to a commit', () => {
    // A typo in a pinned id would drop that model from the list.
    expect(pinnedAppConfig.model_list).toHaveLength(Object.keys(WEBLLM_MODEL_SHAS).length);
    for (const id of new Set(plans.map((plan) => plan.feedbackModel).filter((id) => id !== null))) {
      const record = pinnedAppConfig.model_list.find((model) => model.model_id === id);
      expect(record, id).toBeDefined();
      expect(record!.model).toMatch(new RegExp(`^https://huggingface\\.co/mlc-ai/${id}/resolve/[0-9a-f]{40}/$`));
      expect(record!.model_lib).toMatch(/^https:\/\/raw\.githubusercontent\.com\/mlc-ai\/binary-mlc-llm-libs\/[0-9a-f]{40}\//);
    }
  });

  it('pins every Whisper model a tier can pick', () => {
    for (const plan of plans) expect(WHISPER_SHAS[plan.whisperModel], plan.whisperModel).toMatch(/^[0-9a-f]{40}$/);
  });
});
