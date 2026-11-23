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

export interface CompleteOptions {
  /** JSON schema the reply must follow. Leave out for plain text. */
  schema?: object;
  /** Hard cap on reply length. Short caps keep the wait short. */
  maxTokens: number;
  /** Called with the reply so far, as it streams. */
  onText?: (soFar: string) => void;
}

export interface FeedbackModel {
  load(onProgress?: (progress: LoadProgress) => void): Promise<{ elapsedMs: number }>;
  /** Streams a reply; resolves with the full text and timing stats. */
  complete(system: string, user: string, options: CompleteOptions): Promise<{ text: string; stats: GenerationStats; truncated?: boolean }>;
  /** Stops the reply being written now, if any. */
  interrupt(): void;
  /** Clears chat history so nothing carries over between answers. */
  reset(): Promise<void>;
  unload(): Promise<void>;
}
