import type { ModelPlan } from '@/services/device/tier';
import { ModelStore, useModelStatus, type ModelStatus } from './modelStore';
import type { SpeechToText, Transcript } from './types';

export type SpeechStatus = ModelStatus;

/**
 * One shared speech model for the whole app.
 * - Speaking screens call preload() so it downloads during instructions and prep.
 * - transcribe() waits for loading if it isn't finished yet.
 * - On low-tier devices it's unloaded after each answer to free memory;
 *   the next task's preload() brings it back from the browser cache.
 */
export class SpeechEngineStore extends ModelStore<SpeechToText> {
  constructor(
    getPlan: () => Promise<ModelPlan>,
    createEngine: (plan: ModelPlan) => SpeechToText,
    fallBack?: () => Promise<boolean>,
  ) {
    super(getPlan, createEngine, (plan) => plan.whisperModel.replace(/^.*whisper-/, ''), fallBack);
  }

  async transcribe(audio: Float32Array): Promise<Transcript> {
    const engine = await this.ensureLoaded();
    const transcript = await engine.transcribe(audio);
    const plan = await this.getPlan();
    if (!plan.keepWhisperLoaded) await this.unload();
    return transcript;
  }
}

let shared: SpeechEngineStore | null = null;

/** The app-wide store, created on first use so the AI code loads lazily. */
export async function getSpeechEngine(): Promise<SpeechEngineStore> {
  if (!shared) {
    const [{ getModelPlan, fallBackSpeechToCpu }, { WhisperSpeechToText }] = await Promise.all([
      import('@/services/device/plan'),
      import('./whisperClient'),
    ]);
    shared ??= new SpeechEngineStore(
      getModelPlan,
      (plan) => new WhisperSpeechToText(plan.whisperModel, plan.whisperDevice),
      fallBackSpeechToCpu,
    );
  }
  return shared;
}

export function useSpeechStatus(store: SpeechEngineStore | null): SpeechStatus {
  return useModelStatus(store);
}
