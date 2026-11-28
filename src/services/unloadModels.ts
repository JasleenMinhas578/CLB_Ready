import { getSpeechEngine } from '@/services/ai/speechEngine';
import { getFeedbackEngine } from '@/services/ai/feedbackEngine';
import { getVoiceEngine } from '@/services/tts/voiceEngine';

/** Frees every shared model, including the listening voice. Each loads again the next time a task needs it. */
export async function unloadAllModels(): Promise<void> {
  const stores = await Promise.all([getSpeechEngine(), getFeedbackEngine(), getVoiceEngine()]);
  await Promise.all(stores.map((store) => store.unload()));
}
