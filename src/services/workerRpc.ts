import type { LoadProgress } from '@/services/ai/types';

/** Omit that works on each member of a union separately. */
type WithoutId<T> = T extends unknown ? Omit<T, 'id'> : never;

type Message = { id: number; type: string };
/**
 * Every reply, typed loosely enough to cover each protocol's 'progress'
 * ({ fraction, text }) and 'error' ({ message }) replies, so the fields this
 * class reads can't be given another type.
 */
type Reply = Message & { fraction?: number | null; text?: string; message?: string };

type Pending<Res> = {
  resolve: (response: Res) => void;
  reject: (error: Error) => void;
  onProgress?: (progress: LoadProgress) => void;
};

/** Turns a worker's id-tagged messages into promises. The worker starts on first use. */
export class WorkerRpc<Req extends Message, Res extends Reply> {
  private worker: Worker | null = null;
  private nextId = 1;
  private pending = new Map<number, Pending<Res>>();

  /** `create` must call `new Worker(new URL(...))` itself, so Vite can find and bundle the worker. */
  constructor(
    private readonly create: () => Worker,
    private readonly startError: string,
    /** Told when the worker fails to start or crashes, so whoever holds its model knows it is gone. */
    private readonly onCrash?: (error: Error) => void,
  ) {}

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = this.create();
      this.worker.addEventListener('message', (event: MessageEvent<Res>) => this.handle(event.data));
      // Fires if the worker script fails to load (e.g. a 404) or crashes. Without it the
      // pending promises would never settle, and the caller's fallback would never run.
      this.worker.addEventListener('error', () => {
        const error = new Error(this.startError);
        this.fail(error);
        this.onCrash?.(error);
      });
    }
    return this.worker;
  }

  /** Rejects every waiting request and drops the broken worker, so the next call starts a fresh one. */
  private fail(error: Error) {
    const entries = [...this.pending.values()];
    this.pending.clear();
    this.worker?.terminate();
    this.worker = null;
    entries.forEach((entry) => entry.reject(error));
  }

  private handle(response: Res) {
    const entry = this.pending.get(response.id);
    if (!entry) return;
    if (response.type === 'progress') {
      entry.onProgress?.({ fraction: response.fraction ?? null, text: response.text ?? '' });
      return;
    }
    this.pending.delete(response.id);
    if (response.type === 'error') entry.reject(new Error(response.message));
    else entry.resolve(response);
  }

  send(request: WithoutId<Req>, onProgress?: Pending<Res>['onProgress'], transfer: Transferable[] = []) {
    const id = this.nextId++;
    return new Promise<Res>((resolve, reject) => {
      this.pending.set(id, { resolve, reject, onProgress });
      this.getWorker().postMessage({ ...request, id } as Req, transfer);
    });
  }

  /** True once the worker has started, until it is unloaded or fails. */
  get running() {
    return this.worker !== null;
  }

  /**
   * Asks the worker to free its model, then stops it. Does nothing if it never started.
   * Requests still waiting (say, scoring when the learner changes tier) are rejected,
   * so their screens show an error instead of waiting forever.
   */
  async unload() {
    if (!this.worker) return;
    // Stop the worker even if it reports an error while unloading, so its GPU memory is freed.
    try {
      await this.send({ type: 'unload' } as WithoutId<Req>);
    } finally {
      this.fail(new Error('The model was unloaded before it finished.'));
    }
  }
}
