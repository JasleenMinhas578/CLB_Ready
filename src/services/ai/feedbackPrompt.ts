import type { Criterion } from '@/domain/criteria';

/**
 * The fixed JSON shape every feedback reply must follow.
 * WebLLM enforces it, so parsing never depends on the model behaving.
 */
export const FEEDBACK_JSON_SCHEMA = {
  type: 'object',
  properties: {
    checklist: {
      type: 'array',
      items: {
        type: 'object',
        properties: { item: { type: 'string' }, met: { type: 'boolean' } },
        required: ['item', 'met'],
      },
    },
    scores: {
      type: 'object',
      properties: {
        content: { type: 'integer' },
        vocabulary: { type: 'integer' },
        delivery: { type: 'integer' },
        task: { type: 'integer' },
      },
      required: ['content', 'vocabulary', 'delivery', 'task'],
    },
    tips: { type: 'array', items: { type: 'string' } },
    improved: { type: 'string' },
  },
  required: ['checklist', 'scores', 'tips', 'improved'],
} as const;

export interface FeedbackReply {
  checklist: { item: string; met: boolean }[];
  scores: { content: number; vocabulary: number; delivery: number; task: number };
  tips: string[];
  improved: string;
}

export interface FeedbackRequest {
  taskTitle: string;
  promptText: string;
  checklist: string[];
  criteria: Criterion[];
  goal: number;
  answer: string;
}

/** Builds a short prompt: short prompts keep the KV cache, and memory, small. */
export function buildFeedbackPrompt(request: FeedbackRequest): { system: string; user: string } {
  const criteria = request.criteria.map((c) => `- ${c.name}: ${c.factors.join(', ')}`).join('\n');
  const system = [
    'You are a kind, precise CELPIP-style English coach.',
    `The learner's goal is CLB ${request.goal}.`,
    'Rate each dimension from 4 to 12 using these official factors:',
    criteria,
    'Mark each checklist item true only if the answer clearly covers it.',
    'Give at most 3 short, specific tips.',
    `Rewrite the answer at CLB ${request.goal} level, keeping the learner's own ideas.`,
    'Reply with JSON only.',
  ].join('\n');

  const user = [
    `Task: ${request.taskTitle}`,
    `Prompt: ${request.promptText}`,
    `Checklist: ${request.checklist.join('; ')}`,
    `Answer: """${request.answer}"""`,
  ].join('\n');

  return { system, user };
}

export function parseFeedback(text: string): FeedbackReply | null {
  try {
    const value = JSON.parse(text) as FeedbackReply;
    return Array.isArray(value.checklist) && value.scores && Array.isArray(value.tips) ? value : null;
  } catch {
    return null;
  }
}
