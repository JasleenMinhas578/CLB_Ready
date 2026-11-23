import { useSyncExternalStore } from 'react';
import type { ModelPlan } from '@/services/device/tier';
import type { LoadProgress } from './types';

export interface ModelStatus {
  /** `unavailable` = this device can't run the model (e.g. light mode). */
  state: 'idle' | 'loading' | 'ready' | 'error' | 'unavailable';
  /** 0 to 1 while downloading, null when unknown. */
  progress: number | null;
  /** Short model name for display. */
  model: string | null;
  error: string | null;
}

export interface LoadableModel {
  load(onProgress?: (progress: LoadProgress) => void): Promise<{ elapsedMs: number }>;
  unload(): Promise<void>;
}

export class ModelUnavailableError extends Error {
  constructor() {
    super('This device can’t run the AI model, so light mode is used.');
    this.name = 'ModelUnavailableError';
  }
}

export const IDLE_STATUS: ModelStatus = { state: 'idle', progress: null, model: null, error: null };

/**
 * Shared lifecycle for one in-browser model: load once, report progress,
 * let many screens wait on the same load, and unload to free memory.
 * Subclasses add the model's actual job (transcribe, generate).
 * The plan and engine factory are injected so tests can use fakes.
 */
export abstract class ModelStore<E extends LoadableModel> {
  private status: ModelStatus = IDLE_STATUS;
  private listeners = new Set<() => void>();
  protected engine: E | null = null;
  private loading: Promise<E> | null = null;

  constructor(
    protected readonly getPlan: () => Promise<ModelPlan>,
    private readonly createEngine: (plan: ModelPlan) => E | null,
    private readonly displayName: (plan: ModelPlan) => string | null,
    /** Called once if loading fails; return true to retry with a lighter plan. */
    private readonly fallBack?: () => Promise<boolean>,
  ) {}

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getStatus = () => this.status;

  protected setStatus(next: Partial<ModelStatus>) {
    this.status = { ...this.status, ...next };
    this.listeners.forEach((listener) => listener());
  }

  /** Starts loading in the background. Safe to call many times. */
  preload(): Promise<void> {
    return this.ensureLoaded().then(
      () => undefined,
      () => undefined, // The error is already in status for the UI.
    );
  }

  ensureLoaded(): Promise<E> {
    if (this.engine) return Promise.resolve(this.engine);
    this.loading ??= this.load();
    return this.loading;
  }

  private async load(retried = false): Promise<E> {
    try {
      const plan = await this.getPlan();
      const engine = this.createEngine(plan);
      if (!engine) {
        this.setStatus({ state: 'unavailable', progress: null, model: null, error: null });
        throw new ModelUnavailableError();
      }
      this.setStatus({ state: 'loading', progress: 0, model: this.displayName(plan), error: null });
      try {
        await engine.load((progress) => this.setStatus({ progress: progress.fraction }));
      } catch (error) {
        // Free whatever was partly loaded before any retry.
        await engine.unload().catch(() => undefined);
        throw error;
      }
      this.engine = engine;
      this.setStatus({ state: 'ready', progress: 1 });
      return engine;
    } catch (error) {
      if (error instanceof ModelUnavailableError) throw error;
      // Often out of memory: try once more with the next lighter tier.
      if (!retried && this.fallBack && (await this.fallBack())) return await this.load(true);
      this.setStatus({ state: 'error', error: error instanceof Error ? error.message : String(error) });
      throw error;
    } finally {
      this.loading = null;
    }
  }

  async unload(): Promise<void> {
    const engine = this.engine;
    this.engine = null;
    this.setStatus(IDLE_STATUS);
    await engine?.unload();
  }
}

const noopSubscribe = () => () => {};
const idleStatus = () => IDLE_STATUS;

/** Live status for a store, or idle while the store is still being created. */
export function useModelStatus(store: ModelStore<LoadableModel> | null): ModelStatus {
  return useSyncExternalStore(store?.subscribe ?? noopSubscribe, store?.getStatus ?? idleStatus);
}
