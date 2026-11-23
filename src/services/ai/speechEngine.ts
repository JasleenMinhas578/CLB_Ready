import { useSyncExternalStore } from 'react';
import type { ModelPlan } from '@/services/device/tier';
import type { SpeechToText, Transcript } from './types';

export interface SpeechStatus {
  state: 'idle' | 'loading' | 'ready' | 'error';
  /** 0 to 1 while downloading, null when unknown. */
  progress: number | null;
  /** Short model name for display, e.g. "base.en". */
  model: string | null;
  error: string | null;
}

type EngineFactory = (plan: ModelPlan) => SpeechToText;

const IDLE: SpeechStatus = { state: 'idle', progress: null, model: null, error: null };

/**
 * One shared speech model for the whole app.
 * - Screens call preload() when a speaking task opens, so the model
 *   downloads during the instructions and prep time.
 * - transcribe() waits for loading if it isn't finished yet.
 * - On low-tier devices the model is unloaded after each answer to free
 *   memory; the next task's preload() brings it back from the cache.
 * The engine and plan are injected, so tests can use fakes.
 */
export class SpeechEngineStore {
  private status: SpeechStatus = IDLE;
  private listeners = new Set<() => void>();
  private engine: SpeechToText | null = null;
  private loading: Promise<SpeechToText> | null = null;

  constructor(
    private readonly getPlan: () => Promise<ModelPlan>,
    private readonly createEngine: EngineFactory,
  ) {}

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getStatus = () => this.status;

  private setStatus(next: Partial<SpeechStatus>) {
    this.status = { ...this.status, ...next };
    this.listeners.forEach((listener) => listener());
  }

  /** Starts loading in the background. Safe to call many times. */
  preload(): void {
    this.ensureLoaded().catch(() => {
      // Error is already recorded in status for the UI.
    });
  }

  ensureLoaded(): Promise<SpeechToText> {
    if (this.engine) return Promise.resolve(this.engine);
    this.loading ??= this.load();
    return this.loading;
  }

  private async load(): Promise<SpeechToText> {
    try {
      const plan = await this.getPlan();
      const model = plan.whisperModel.replace(/^.*whisper-/, '');
      this.setStatus({ state: 'loading', progress: 0, model, error: null });
      const engine = this.createEngine(plan);
      await engine.load((progress) => this.setStatus({ progress: progress.fraction }));
      this.engine = engine;
      this.setStatus({ state: 'ready', progress: 1 });
      return engine;
    } catch (error) {
      this.setStatus({ state: 'error', error: error instanceof Error ? error.message : String(error) });
      throw error;
    } finally {
      this.loading = null;
    }
  }

  async transcribe(audio: Float32Array): Promise<Transcript> {
    const engine = await this.ensureLoaded();
    const transcript = await engine.transcribe(audio);
    const plan = await this.getPlan();
    if (!plan.keepWhisperLoaded) await this.unload();
    return transcript;
  }

  async unload(): Promise<void> {
    const engine = this.engine;
    this.engine = null;
    this.setStatus(IDLE);
    await engine?.unload();
  }
}

let shared: SpeechEngineStore | null = null;

/** The app-wide store, created on first use so the AI code loads lazily. */
export async function getSpeechEngine(): Promise<SpeechEngineStore> {
  if (!shared) {
    const [{ getModelPlan }, { WhisperSpeechToText }] = await Promise.all([
      import('@/services/device/plan'),
      import('./whisperClient'),
    ]);
    shared ??= new SpeechEngineStore(getModelPlan, (plan) => new WhisperSpeechToText(plan.whisperModel, plan.whisperDevice));
  }
  return shared;
}

const noopSubscribe = () => () => {};
const idleStatus = () => IDLE;

/** Live loading status for a store, or idle while the store is being created. */
export function useSpeechStatus(store: SpeechEngineStore | null): SpeechStatus {
  return useSyncExternalStore(store?.subscribe ?? noopSubscribe, store?.getStatus ?? idleStatus);
}
