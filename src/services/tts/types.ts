import type { LoadProgress } from '@/services/ai/types';
import type { VoiceId } from '@/content/objective';

export interface SpokenLine {
  audio: Float32Array;
  sampleRate: number;
}

/** Turns text into speech on the device. Kokoro implements it; tests use fakes. */
export interface TextToSpeech {
  load(onProgress?: (progress: LoadProgress) => void): Promise<{ elapsedMs: number }>;
  speak(text: string, voice: VoiceId): Promise<SpokenLine>;
  unload(): Promise<void>;
}
