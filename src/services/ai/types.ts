/**
 * Interfaces the rest of the app depends on. Concrete engines (Whisper via
 * Transformers.js, WebLLM, later wllama) implement these, so they can be
 * swapped or mocked without touching screens (dependency inversion).
 */

export interface LoadProgress {
  /** 0 to 1, or null when the engine doesn't report a fraction. */
  fraction: number | null;
  text: string;
}

export interface TimedWord {
  text: string;
  start: number;
  end: number;
}

export interface Transcript {
  text: string;
  words: TimedWord[];
  /** Milliseconds spent transcribing. */
  elapsedMs: number;
}

export interface SpeechToText {
  load(onProgress?: (progress: LoadProgress) => void): Promise<{ elapsedMs: number }>;
  transcribe(audio: Float32Array): Promise<Transcript>;
  unload(): Promise<void>;
}

export interface GenerationStats {
  promptTokens: number;
  completionTokens: number;
  firstTokenMs: number;
  totalMs: number;
  tokensPerSecond: number;
}

export interface FeedbackModel {
  load(onProgress?: (progress: LoadProgress) => void): Promise<{ elapsedMs: number }>;
  /** Streams text; resolves with the full reply and timing stats. */
  generateJson(
    system: string,
    user: string,
    onText?: (soFar: string) => void,
    /** JSON schema the reply must follow. Defaults to the feedback schema. */
    schema?: object,
  ): Promise<{ text: string; stats: GenerationStats; truncated?: boolean }>;
  /** Clears chat history so nothing carries over between answers. */
  reset(): Promise<void>;
  unload(): Promise<void>;
}
