import type { ModelPlan } from '@/services/device/tier';
import { ModelStore, useModelStatus, type ModelStatus } from './modelStore';
import { parseFeedback, type FeedbackReply } from './feedbackPrompt';
import type { FeedbackModel, GenerationStats } from './types';

export type FeedbackStatus = ModelStatus;

export interface FeedbackRun {
  reply: FeedbackReply;
  stats: GenerationStats;
  attempts: number;
}

/**
 * One shared feedback model. generate() asks for JSON, retries once if the
 * reply doesn't parse, and resets the chat after every answer so nothing
 * carries over between answers (privacy and memory).
 */
export class FeedbackEngineStore extends ModelStore<FeedbackModel> {
  constructor(
    getPlan: () => Promise<ModelPlan>,
    createEngine: (plan: ModelPlan) => FeedbackModel | null,
    fallBack?: () => Promise<boolean>,
  ) {
    super(getPlan, createEngine, (plan) => plan.feedbackModel?.replace(/-q4f(16|32)_1-MLC$/, '') ?? null, fallBack);
  }

  async generate(system: string, user: string, onText?: (soFar: string) => void): Promise<FeedbackRun> {
    const engine = await this.ensureLoaded();
    const MAX_ATTEMPTS = 2;
    try {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        const { text, stats } = await engine.generateJson(system, user, onText);
        await engine.reset();
        const reply = parseFeedback(text);
        if (reply) return { reply, stats, attempts: attempt };
      }
      throw new Error('The AI reply could not be read.');
    } finally {
      await engine.reset();
    }
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

export function useFeedbackStatus(store: FeedbackEngineStore | null): FeedbackStatus {
  return useModelStatus(store);
}
