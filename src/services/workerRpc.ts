import type { LoadProgress } from '@/services/ai/types';

/** Omit that works on each member of a union separately. */
type WithoutId<T> = T extends unknown ? Omit<T, 'id'> : never;

type Message = { id: number; type: string };
/** The reply shapes every worker protocol shares. */
type Shared = Message & { fraction: number | null; text: string; message: string };

type Pending<Res> = {
  resolve: (response: Res) => void;
  reject: (error: Error) => void;
  onProgress?: (progress: LoadProgress) => void;
};

/** Turns a worker's id-tagged messages into promises. The worker starts on first use. */
export class WorkerRpc<Req extends Message, Res extends Message> {
  private worker: Worker | null = null;
  private nextId = 1;
  private pending = new Map<number, Pending<Res>>();

  /** `create` must call `new Worker(new URL(...))` itself, so Vite can find and bundle the worker. */
  constructor(
    private readonly create: () => Worker,
    private readonly startError: string,
  ) {}

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = this.create();
      this.worker.addEventListener('message', (event: MessageEvent<Res>) => this.handle(event.data));
      // Fires if the worker script fails to load (e.g. a 404) or crashes. Without it the
      // pending promises would never settle, and the caller's fallback would never run.
      this.worker.addEventListener('error', () => this.fail(new Error(this.startError)));
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
    const shared = response as unknown as Shared;
    if (shared.type === 'progress') {
      entry.onProgress?.({ fraction: shared.fraction, text: shared.text });
      return;
    }
    this.pending.delete(response.id);
    if (shared.type === 'error') entry.reject(new Error(shared.message));
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

  /** Asks the worker to free its model, then stops it. Does nothing if it never started. */
  async unload() {
    if (!this.worker) return;
    await this.send({ type: 'unload' } as WithoutId<Req>);
    this.worker?.terminate();
    this.worker = null;
  }
}
