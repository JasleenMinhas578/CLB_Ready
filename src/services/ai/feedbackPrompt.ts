import type { Criterion } from '@/domain/criteria';

/**
 * Feedback comes in two steps so learners see results sooner:
 * 1. A short JSON reply with the checklist, tips and scores (a few seconds).
 * 2. The improved answer as plain text, streamed onto the screen while they read.
 */

/** Room for the checklist, three short tips and four scores. */
export const SCORING_MAX_TOKENS = 450;

/** Room for a rewrite of about `words` words, with some slack. A token is about 0.75 words. */
export function answerTokenBudget(words: number): number {
  return Math.min(1000, Math.max(200, Math.round(words * 1.6) + 80));
}

/**
 * The fixed JSON shape of the scoring reply.
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
  },
  required: ['checklist', 'tips', 'scores'],
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

/** Step 1 prompt. Short prompts keep the KV cache, and memory, small. */
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
    request.spoken
      ? 'The answer is a speech transcript: ignore spelling and punctuation.'
      : 'CELPIP emails have no subject, To or From line. Never add one or suggest adding one.',
    'Mark each checklist item true only if the answer clearly covers it. Keep the items in the same order.',
    `Give at most 3 tips that would move this answer toward ${goal}. Each tip is one sentence of under 20 words about what the learner wrote, not a repeat of the task. Quote their words when useful.`,
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
    const value = extractJson(text) as { checklist?: unknown; scores?: RawScores; tips?: unknown };
    const raw = value.scores ?? {};
    const scores = {
      content: raw.content_and_coherence ?? raw.content,
      vocabulary: raw.vocabulary,
      delivery: raw.listenability_or_readability ?? raw.delivery,
      task: raw.task_fulfillment ?? raw.task,
    };
    const scoresOk = Object.values(scores).every((score) => typeof score === 'number' && Number.isFinite(score));
    if (!Array.isArray(value.checklist) || !scoresOk || !Array.isArray(value.tips)) return null;
    return {
      checklist: value.checklist as FeedbackReply['checklist'],
      scores: scores as FeedbackReply['scores'],
      tips: (value.tips as unknown[])
        .filter((tip): tip is string => typeof tip === 'string')
        .map(cleanTip)
        .filter((tip) => tip !== '')
        .slice(0, 3),
    };
  } catch {
    return null;
  }
}

const MAX_TIP_WORDS = 30;

/** Tidies a tip: drops wrapping or unmatched quote marks and cuts a long tip to its first sentence. */
export function cleanTip(raw: string): string {
  let tip = raw
    .trim()
    .replace(/(['"“”‘’])\s*\1/g, '$1') // ' 'Hey → 'Hey
    .replace(/,\s*,/g, ',')
    .replace(/^["'“”]+(?=[A-Z])/, '').replace(/^[-•*\d.)\s]+(?=[A-Za-z"“])/, '');
  if (/^["“].*["”]$/.test(tip) && (tip.match(/["“”]/g) ?? []).length === 2) tip = tip.slice(1, -1);
  // An odd number of straight quotes means one is stray: remove the last one.
  if ((tip.match(/"/g) ?? []).length % 2 === 1) {
    const at = tip.lastIndexOf('"');
    tip = (tip.slice(0, at) + tip.slice(at + 1)).replace(/\s{2,}/g, ' ');
  }
  if (tip.split(/\s+/).length > MAX_TIP_WORDS) {
    const first = tip.match(/^.+?[.!?](?=\s|$)/)?.[0];
    if (first && first.split(/\s+/).length >= 5) tip = first;
  }
  tip = tip.trim();
  return tip && !/[.!?"”’')]$/.test(tip) ? `${tip}.` : tip;
}

export interface RewriteRequest {
  taskTitle: string;
  promptText: string;
  goal: number;
  goalLabel?: string;
  answer: string;
  spoken: boolean;
  /** The tips from step 1, so the rewrite shows them in action. */
  tips?: string[];
  /** How long the rewrite should be. Short answers are expanded to this. */
  targetWords?: number;
}

/** Step 2 prompt: the learner's answer rewritten at the goal level, as plain text. */
export function buildRewritePrompt(request: RewriteRequest): { system: string; user: string } {
  const goal = request.goalLabel ? `CLB ${request.goal} (${request.goalLabel})` : `CLB ${request.goal}`;
  const system = [
    'You are a kind, precise CELPIP-style English coach.',
    `Rewrite the learner's ${request.spoken ? 'spoken answer' : 'answer'} at ${goal} level${request.targetWords ? `, about ${request.targetWords} words long` : ', in about the same length'}.`,
    "Keep every idea, detail, reason and example the learner gave. Improve wording, linking and structure instead of removing content.",
    request.targetWords
      ? 'If the answer is short or repeats itself, keep its ideas and add clear reasons, examples and details until it reaches that length.'
      : '',
    request.spoken
      ? 'Write it the way a confident speaker would say it to the person in the task: speak to them directly (use "you"), do not repeat the task instructions, and use linking words like first, also and finally. No headings or lists.'
      : 'Keep the paragraphs. CELPIP emails have no subject, To or From line, so never add one.',
    'Write only the rewritten answer: no introduction, notes or quotation marks around it.',
  ]
    .filter(Boolean)
    .join('\n');
  const user = [
    `Task: ${request.taskTitle}`,
    `Prompt: ${request.promptText}`,
    request.tips?.length ? `Fixes to apply: ${request.tips.join(' ')}` : '',
    `Answer: """${request.answer}"""`,
  ]
    .filter(Boolean)
    .join('\n');
  return { system, user };
}

export interface ModelAnswerRequest {
  taskTitle: string;
  promptText: string;
  goal: number;
  goalLabel?: string;
  spoken: boolean;
  /** Writing: word range. Speaking: roughly how long to talk. */
  length: string;
}

/** For answers too short to rewrite: a model answer written from scratch, as plain text. */
export function buildModelAnswerPrompt(request: ModelAnswerRequest): { system: string; user: string } {
  const goal = request.goalLabel ? `CLB ${request.goal} (${request.goalLabel})` : `CLB ${request.goal}`;
  const system = [
    'You are a kind, precise CELPIP-style English coach.',
    `Write one model ${request.spoken ? 'spoken answer' : 'written answer'} at ${goal} level for the task below.`,
    `Length: ${request.length}. Cover every point the task asks for, in a natural order.`,
    request.spoken
      ? 'Write it the way a confident speaker would say it, with clear linking words. No headings.'
      : 'Use paragraphs. For an email, start with a greeting and end with a sign-off that fit the tone. Do not write a subject, To or From line.',
    'Write only the answer itself: no introduction, notes or quotation marks around it.',
  ].join('\n');
  const user = [`Task: ${request.taskTitle}`, `Prompt: ${request.promptText}`].join('\n');
  return { system, user };
}

/**
 * Tidies a plain-text answer from the model: drops code fences, a lead-in
 * like "Here is the rewritten answer:", and quote marks around the whole
 * thing. Returns null when nothing usable is left.
 */
export function cleanAnswerText(raw: string): string | null {
  let text = raw.trim().replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '').trim();
  // A model that answers in JSON anyway.
  if (text.startsWith('{')) {
    try {
      const value = extractJson(text) as { answer?: unknown; improved?: unknown };
      const inner = value.answer ?? value.improved;
      if (typeof inner === 'string') text = inner.trim();
    } catch {
      // Not JSON after all: keep the text.
    }
  }
  text = text.replace(/^(?:sure[,!.]?\s*)?(?:here(?:'s| is)[^\n]{0,60}?:)\s*/i, '');
  if (/^["“][\s\S]*["”]$/.test(text)) text = text.slice(1, -1).trim();
  return text.split(/\s+/).filter(Boolean).length >= 5 ? text : null;
}
