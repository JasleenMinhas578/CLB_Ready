import type { Criterion } from '@/domain/criteria';

/**
 * The fixed JSON shape every feedback reply must follow.
 * WebLLM enforces it, so parsing never depends on the model behaving.
 */
export const FEEDBACK_JSON_SCHEMA = {
  type: 'object',
  // Order matters: the model writes the checklist and tips before it scores,
  // so the scores follow from what it has already noticed.
  properties: {
    checklist: {
      type: 'array',
      items: {
        type: 'object',
        properties: { item: { type: 'string' }, met: { type: 'boolean' } },
        required: ['item', 'met'],
      },
    },
    tips: { type: 'array', items: { type: 'string' } },
    scores: {
      type: 'object',
      // Full names, so a small model doesn't confuse "content" with length.
      properties: {
        content_and_coherence: { type: 'integer' },
        vocabulary: { type: 'integer' },
        listenability_or_readability: { type: 'integer' },
        task_fulfillment: { type: 'integer' },
      },
      required: ['content_and_coherence', 'vocabulary', 'listenability_or_readability', 'task_fulfillment'],
    },
    improved: { type: 'string' },
  },
  required: ['checklist', 'tips', 'scores', 'improved'],
} as const;

/** Fixed reference points so the model's numbers mean the same thing each time. */
export const LEVEL_ANCHORS = [
  '12: near-native, precise and natural throughout',
  '10: highly effective, rich and well organized, very few errors',
  '9: effective, clear and well developed, minor errors only',
  '8: good, organized with some range, some errors',
  '7: adequate, covers the task simply, noticeable errors',
  '6: developing, basic ideas, frequent errors',
  '5 or lower: limited, hard to follow or far too short',
];

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
    `Level guide: ${LEVEL_ANCHORS.join('; ')}.`,
    'Rate each dimension on its own. Content and coherence is about ideas, details and organization, not length.',
    `Here "listenability_or_readability" means ${request.spoken ? 'listenability' : 'readability'}.`,
    request.spoken ? 'The answer is a speech transcript: ignore spelling and punctuation.' : '',
    'Mark each checklist item true only if the answer clearly covers it. Keep the items in the same order.',
    `Give at most 3 short, specific tips that would move this answer toward ${goal}. Quote the learner's words when useful.`,
    `"improved": rewrite the answer at ${goal} level in about the same length. Keep every idea, detail, reason and example the learner gave; improve wording, linking and structure instead of removing content.`,
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

/**
 * Pulls the JSON object out of a reply, ignoring code fences or stray text
 * a small model sometimes adds around it.
 */
export function extractJson(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('No JSON object in reply');
  return JSON.parse(text.slice(start, end + 1));
}

interface RawScores {
  content_and_coherence?: unknown;
  vocabulary?: unknown;
  listenability_or_readability?: unknown;
  task_fulfillment?: unknown;
  // Older key names, still accepted.
  content?: unknown;
  delivery?: unknown;
  task?: unknown;
}

/** Parses and sanity-checks a reply. Returns null if anything required is missing. */
export function parseFeedback(text: string): FeedbackReply | null {
  try {
    const value = extractJson(text) as { checklist?: unknown; scores?: RawScores; tips?: unknown; improved?: unknown };
    const raw = value.scores ?? {};
    const scores = {
      content: raw.content_and_coherence ?? raw.content,
      vocabulary: raw.vocabulary,
      delivery: raw.listenability_or_readability ?? raw.delivery,
      task: raw.task_fulfillment ?? raw.task,
    };
    const scoresOk = Object.values(scores).every((score) => typeof score === 'number' && Number.isFinite(score));
    if (!Array.isArray(value.checklist) || !scoresOk || !Array.isArray(value.tips) || typeof value.improved !== 'string') return null;
    return {
      checklist: value.checklist as FeedbackReply['checklist'],
      scores: scores as FeedbackReply['scores'],
      tips: (value.tips as unknown[]).filter((tip): tip is string => typeof tip === 'string' && tip.trim() !== '').slice(0, 3),
      improved: value.improved,
    };
  } catch {
    return null;
  }
}

/** Schema for a model answer written from scratch (used when an answer is too short to rewrite). */
export const MODEL_ANSWER_SCHEMA = {
  type: 'object',
  properties: { answer: { type: 'string' } },
  required: ['answer'],
} as const;

export interface ModelAnswerRequest {
  taskTitle: string;
  promptText: string;
  goal: number;
  goalLabel?: string;
  spoken: boolean;
  /** Writing: word range. Speaking: roughly how long to talk. */
  length: string;
}

export function buildModelAnswerPrompt(request: ModelAnswerRequest): { system: string; user: string } {
  const goal = request.goalLabel ? `CLB ${request.goal} (${request.goalLabel})` : `CLB ${request.goal}`;
  const system = [
    'You are a kind, precise CELPIP-style English coach.',
    `Write one model ${request.spoken ? 'spoken answer' : 'written answer'} at ${goal} level for the task below.`,
    `Length: ${request.length}. Cover every point the task asks for, in a natural order.`,
    request.spoken
      ? 'Write it the way a confident speaker would say it, with clear linking words. No headings.'
      : 'Use paragraphs. For an email, include a greeting and a sign-off that fit the tone.',
    'Reply with JSON only: {"answer": "..."}.',
  ].join('\n');
  const user = [`Task: ${request.taskTitle}`, `Prompt: ${request.promptText}`].join('\n');
  return { system, user };
}

export function parseModelAnswer(text: string): string | null {
  try {
    const value = extractJson(text) as { answer?: unknown };
    return typeof value.answer === 'string' && value.answer.trim() ? value.answer.trim() : null;
  } catch {
    return null;
  }
}
