import type { SpeakingMetrics } from '../measure/speakingMetrics';

/**
 * Turns measurements into rough CLB-style levels, then blends them with the
 * AI model's judgment. These rules are a starting point: the calibration
 * step (sample answers scored by hand) tunes the bands and weights.
 */

export type SpeakingCriterionId = 'content' | 'vocabulary' | 'listenability' | 'task';
export type Scores = Record<SpeakingCriterionId, number>;

export const MIN_LEVEL = 4;
export const MAX_LEVEL = 12;
/** Code can spot problems, but can't tell a 10 from a 12. Only the model can lift past this. */
const CODE_CEILING = 10;

/** Share of each final score that comes from the AI model (the rest from code). */
export type ScoringWeights = Record<SpeakingCriterionId, number>;
export const DEFAULT_SPEAKING_WEIGHTS: ScoringWeights = {
  content: 0.7,
  vocabulary: 0.5,
  listenability: 0.3,
  task: 0.6,
};

export function clampLevel(value: number, max = MAX_LEVEL): number {
  return Math.max(MIN_LEVEL, Math.min(max, Math.round(value)));
}

function perMinute(count: number, seconds: number): number {
  return seconds > 0 ? (count / seconds) * 60 : 0;
}

export function codeEstimates(metrics: SpeakingMetrics): Scores {
  const minutes = Math.max(metrics.speakingSeconds, 1);

  // Listenability: comfortable pace, few long pauses, few fillers.
  let listenability = 10;
  const pace = metrics.wordsPerMinute;
  if (pace < 80) listenability -= 3;
  else if (pace < 100) listenability -= 2;
  else if (pace < 115) listenability -= 1;
  else if (pace > 190) listenability -= 2;
  else if (pace > 170) listenability -= 1;
  const pausesPerMinute = perMinute(metrics.longPauses.length, minutes);
  if (pausesPerMinute > 3) listenability -= 2;
  else if (pausesPerMinute > 1.5) listenability -= 1;
  const fillersPerMinute = perMinute(metrics.fillerCount, minutes);
  if (fillersPerMinute > 6) listenability -= 2;
  else if (fillersPerMinute > 3) listenability -= 1;

  // Vocabulary: variety, minus vague words and heavy repetition.
  let vocabulary =
    metrics.variety >= 0.78 ? 10 : metrics.variety >= 0.7 ? 9 : metrics.variety >= 0.62 ? 8 : metrics.variety >= 0.54 ? 7 : 6;
  if (metrics.vagueWords.length >= 4) vocabulary -= 1;
  if (metrics.repeatedWords.some((word) => word.count >= 5)) vocabulary -= 1;

  // Content and coherence: organization signals and enough development.
  const linking = metrics.linkingWords.length;
  let content = linking >= 6 ? 10 : linking >= 4 ? 9 : linking >= 3 ? 8 : linking >= 2 ? 7 : linking >= 1 ? 6 : 5;
  const wordsPerAnswerMinute = perMinute(metrics.wordCount, metrics.answerSeconds);
  if (wordsPerAnswerMinute < 50) content -= 1;

  // Task fulfillment (code side): did they use the time?
  const task = metrics.timeUsed >= 0.85 ? 9 : metrics.timeUsed >= 0.65 ? 8 : metrics.timeUsed >= 0.45 ? 7 : 5;

  return {
    content: clampLevel(content, CODE_CEILING),
    vocabulary: clampLevel(vocabulary, CODE_CEILING),
    listenability: clampLevel(listenability, CODE_CEILING),
    task: clampLevel(task, CODE_CEILING),
  };
}

/** Weighted blend. With no model scores (light mode), code scores stand alone. */
export function blendScores(code: Scores, model: Partial<Scores> | null, weights = DEFAULT_SPEAKING_WEIGHTS): Scores {
  if (!model) return code;
  const blend = (id: SpeakingCriterionId) => {
    const fromModel = model[id];
    if (typeof fromModel !== 'number' || Number.isNaN(fromModel)) return code[id];
    return clampLevel(weights[id] * clampLevel(fromModel) + (1 - weights[id]) * code[id]);
  };
  return { content: blend('content'), vocabulary: blend('vocabulary'), listenability: blend('listenability'), task: blend('task') };
}

/** Overall estimate: CELPIP reports one level per skill, so use the rounded mean. */
export function overallLevel(scores: Scores): number {
  const values = Object.values(scores);
  return clampLevel(values.reduce((sum, value) => sum + value, 0) / values.length);
}
