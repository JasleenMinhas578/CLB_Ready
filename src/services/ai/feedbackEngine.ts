import type { ModelPlan } from '@/services/device/tier';
import { ModelStore, useModelStatus, type ModelStatus } from './modelStore';
import { FEEDBACK_JSON_SCHEMA, MODEL_ANSWER_SCHEMA, parseFeedback, parseModelAnswer, type FeedbackReply } from './feedbackPrompt';
import type { FeedbackModel, GenerationStats } from './types';

export type FeedbackStatus = ModelStatus;

export interface FeedbackRun {
  reply: FeedbackReply;
  stats: GenerationStats;
  attempts: number;
}

export interface ModelAnswerRun {
  answer: string;
  stats: GenerationStats;
  attempts: number;
}

const MAX_ATTEMPTS = 2;

/**
 * One shared feedback model. Every request asks for JSON, retries once if the
 * reply can't be read, and resets the chat after every answer so nothing
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

  /** Feedback on the learner's answer: checklist, scores, tips and a rewrite. */
  async generate(system: string, user: string, onText?: (soFar: string) => void): Promise<FeedbackRun> {
    const { value, stats, attempts } = await this.run(system, user, FEEDBACK_JSON_SCHEMA, parseFeedback, onText);
    return { reply: value, stats, attempts };
  }

  /** A model answer written from scratch, for answers too short to rewrite. */
  async generateModelAnswer(system: string, user: string, onText?: (soFar: string) => void): Promise<ModelAnswerRun> {
    const { value, stats, attempts } = await this.run(system, user, MODEL_ANSWER_SCHEMA, parseModelAnswer, onText);
    return { answer: value, stats, attempts };
  }

  private async run<T>(
    system: string,
    user: string,
    schema: object,
    parse: (text: string) => T | null,
    onText?: (soFar: string) => void,
  ): Promise<{ value: T; stats: GenerationStats; attempts: number }> {
    const engine = await this.ensureLoaded();
    try {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        const { text, stats, truncated } = await engine.generateJson(system, user, onText, schema);
        await engine.reset();
        const value = parse(text);
        if (value !== null) return { value, stats, attempts: attempt };
        // Local debugging only: shows why a reply failed. Nothing is sent anywhere.
        console.warn(`[CLB Ready] AI reply ${attempt} couldn't be read${truncated ? ' (cut off at the token limit)' : ''}:`, text.slice(0, 400));
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
