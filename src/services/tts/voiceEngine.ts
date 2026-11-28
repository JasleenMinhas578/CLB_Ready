import type { ModelPlan } from '@/services/device/tier';
import { LIGHT_VOICE } from '@/services/device/tier';
import { ModelStore } from '@/services/ai/modelStore';
import type { SpokenLine, TextToSpeech } from './types';
import type { VoiceId } from '@/content/objective';

/**
 * One shared Kokoro voice model. Listening screens call speak() line by
 * line; requests run one at a time, in order, so the next line is being
 * made while the current one plays.
 */
export class VoiceEngineStore extends ModelStore<TextToSpeech> {
  private queue: Promise<unknown> = Promise.resolve();

  constructor(getPlan: () => Promise<ModelPlan>, createEngine: (plan: ModelPlan) => TextToSpeech) {
    super(getPlan, createEngine, (plan) => {
      const voice = plan.voice ?? LIGHT_VOICE;
      return `Kokoro 82M (${voice.device === 'webgpu' ? 'GPU' : '8-bit, CPU'})`;
    });
  }

  speak(text: string, voice: VoiceId): Promise<SpokenLine> {
    const task = async () => (await this.ensureLoaded()).speak(text, voice);
    const result = this.queue.then(task, task);
    this.queue = result.catch(() => undefined);
    return result;
  }
}

let shared: VoiceEngineStore | null = null;

/** The app-wide store, created on first use so Kokoro loads only for listening. */
export async function getVoiceEngine(): Promise<VoiceEngineStore> {
  if (!shared) {
    const [{ getModelPlan }, { KokoroTextToSpeech }] = await Promise.all([import('@/services/device/plan'), import('./kokoroClient')]);
    shared ??= new VoiceEngineStore(getModelPlan, (plan) => new KokoroTextToSpeech(plan.voice ?? LIGHT_VOICE));
  }
  return shared;
}
