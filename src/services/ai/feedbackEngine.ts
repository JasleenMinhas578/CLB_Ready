import type { ModelPlan } from '@/services/device/tier';
import { ModelStore } from './modelStore';
import { FEEDBACK_JSON_SCHEMA, SCORING_MAX_TOKENS, cleanAnswerText, parseFeedback, type FeedbackReply } from './feedbackPrompt';
import type { FeedbackModel, GenerationStats } from './types';

export interface FeedbackRun {
  reply: FeedbackReply;
  stats: GenerationStats;
  attempts: number;
}

export interface TextRun {
  text: string;
  stats: GenerationStats;
  attempts: number;
  /** The reply hit its length cap, so the text may end early. */
  truncated: boolean;
}

const MAX_ATTEMPTS = 2;

/** Thrown when a reply was stopped on purpose (the learner moved on). */
export class GenerationInterruptedError extends Error {
  constructor() {
    super('Generation was stopped.');
    this.name = 'GenerationInterruptedError';
  }
}

/**
 * One shared feedback model. Requests run one at a time, every request
 * retries once if the reply is unusable, and the chat resets after every
 * request so nothing carries over between answers (privacy and memory).
 */
export class FeedbackEngineStore extends ModelStore<FeedbackModel> {
  private queue: Promise<unknown> = Promise.resolve();
  private interrupted = false;

  constructor(
    getPlan: () => Promise<ModelPlan>,
    createEngine: (plan: ModelPlan) => FeedbackModel | null,
    fallBack?: () => Promise<boolean>,
  ) {
    super(getPlan, createEngine, (plan) => plan.feedbackModel?.replace(/-q4f(16|32)_1-MLC$/, '') ?? null, fallBack);
  }

  /** Step 1: checklist, tips and scores as a short JSON reply. */
  async generate(system: string, user: string, onText?: (soFar: string) => void): Promise<FeedbackRun> {
    const { value, stats, attempts } = await this.run(system, user, { schema: FEEDBACK_JSON_SCHEMA, maxTokens: SCORING_MAX_TOKENS, onText }, parseFeedback);
    return { reply: value, stats, attempts };
  }

  /** Step 2, or a model answer from scratch: plain text, streamed as it's written. */
  async writeText(system: string, user: string, maxTokens: number, onText?: (soFar: string) => void): Promise<TextRun> {
    const { value, stats, attempts, truncated } = await this.run(system, user, { maxTokens, onText }, cleanAnswerText);
    return { text: value, stats, attempts, truncated };
  }

  /** Stops the reply being written now. Its caller gets a GenerationInterruptedError. */
  interrupt(): void {
    if (!this.engine) return;
    this.interrupted = true;
    this.engine.interrupt();
  }

  private run<T>(
    system: string,
    user: string,
    options: { schema?: object; maxTokens: number; onText?: (soFar: string) => void },
    parse: (text: string) => T | null,
  ): Promise<{ value: T; stats: GenerationStats; attempts: number; truncated: boolean }> {
    // One request at a time: a second one waits instead of sharing the GPU.
    const task = async () => {
      const engine = await this.ensureLoaded();
      this.interrupted = false;
      try {
        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
          const { text, stats, truncated = false } = await engine.complete(system, user, options);
          await engine.reset();
          if (this.interrupted) throw new GenerationInterruptedError();
          const value = parse(text);
          if (value !== null) return { value, stats, attempts: attempt, truncated };
          // Local debugging only: shows why a reply failed. Nothing is sent anywhere.
          console.warn(`[CLB Ready] AI reply ${attempt} couldn't be read${truncated ? ' (cut off at the token limit)' : ''}:`, text.slice(0, 400));
        }
        throw new Error('The AI reply could not be read.');
      } finally {
        this.interrupted = false;
        await engine.reset();
      }
    };
    const result = this.queue.then(task, task);
    this.queue = result.catch(() => undefined);
    return result;
  }
}

let shared: FeedbackEngineStore | null = null;

/** The app-wide store, created on first use so WebLLM loads lazily. */
export async function getFeedbackEngine(): Promise<FeedbackEngineStore> {
  if (!shared) {
    const [{ getModelPlan, fallBackOneTier }, { WebLlmFeedbackModel }] = await Promise.all([
      import('@/services/device/plan'),
      import('./webllmClient'),
    ]);
    shared ??= new FeedbackEngineStore(
      getModelPlan,
      (plan) => (plan.feedbackModel ? new WebLlmFeedbackModel(plan.feedbackModel) : null),
      fallBackOneTier,
    );
  }
  return shared;
}
