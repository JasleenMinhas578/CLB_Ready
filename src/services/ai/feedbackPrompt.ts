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
  /** One-word label for the goal level, e.g. "effective". */
  goalLabel?: string;
  answer: string;
  /** Spoken answers are transcripts: judge content, not spelling or punctuation. */
  spoken?: boolean;
  /** Facts already measured in code, so tips don't repeat or contradict them. */
  measured?: string[];
}

/** Builds a short prompt: short prompts keep the KV cache, and memory, small. */
export function buildFeedbackPrompt(request: FeedbackRequest): { system: string; user: string } {
  const criteria = request.criteria.map((c) => `- ${c.name}: ${c.factors.join(', ')}`).join('\n');
  const goal = request.goalLabel ? `CLB ${request.goal} (${request.goalLabel})` : `CLB ${request.goal}`;
  const system = [
    'You are a kind, precise CELPIP-style English coach.',
    `The learner's goal is ${goal}.`,
    'Rate each dimension from 4 to 12 using these official factors. Be honest; most learners score 6 to 9.',
    criteria,
    'In "scores", "delivery" means listenability (speaking) or readability (writing).',
    request.spoken ? 'The answer is a speech transcript: ignore spelling and punctuation.' : '',
    'Mark each checklist item true only if the answer clearly covers it. Keep the items in the same order.',
    `Give at most 3 short, specific tips that would move this answer toward ${goal}. Quote the learner's words when useful.`,
    `"improved": rewrite the answer at ${goal} level in the same length, keeping the learner's own ideas.`,
    'Reply with JSON only.',
  ]
    .filter(Boolean)
    .join('\n');

  const user = [
    `Task: ${request.taskTitle}`,
    `Prompt: ${request.promptText}`,
    `Checklist: ${request.checklist.join('; ')}`,
    request.measured?.length ? `Already measured (do not repeat as tips): ${request.measured.join('; ')}` : '',
    `Answer: """${request.answer}"""`,
  ]
    .filter(Boolean)
    .join('\n');

  return { system, user };
}

/** Parses and sanity-checks a reply. Returns null if anything required is missing. */
export function parseFeedback(text: string): FeedbackReply | null {
  try {
    const value = JSON.parse(text) as FeedbackReply;
    const scoresOk =
      value.scores != null &&
      ['content', 'vocabulary', 'delivery', 'task'].every((key) => typeof value.scores[key as keyof FeedbackReply['scores']] === 'number');
    if (!Array.isArray(value.checklist) || !scoresOk || !Array.isArray(value.tips) || typeof value.improved !== 'string') return null;
    return { ...value, tips: value.tips.filter((tip) => typeof tip === 'string' && tip.trim()).slice(0, 3) };
  } catch {
    return null;
  }
}
