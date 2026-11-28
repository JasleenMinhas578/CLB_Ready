import { DEFAULT_SPEAKING_WEIGHTS, DEFAULT_WRITING_WEIGHTS, MEANING_CRITERIA, MIN_LEVEL, blendScores, overallLevel, type Scores, type SpeakingCriterionId, type WritingCriterionId } from './estimate';
import { dropOutlierScores } from './outliers';
import { lengthCeiling } from './sufficiency';

/** The four scores the feedback model returns. `delivery` means listenability or readability. */
export interface ModelScores {
  content: number;
  vocabulary: number;
  delivery: number;
  task: number;
}

/** Highest level for any criterion of an answer that isn't about the task: "limited" on the level guide. */
export const OFF_TASK_CEILING = 5;

export interface FinalScores<K extends string> {
  /** Content and task fulfillment are missing until the model has judged the answer. */
  scores: Partial<Scores<K>>;
  /** Overall level, or null until the model has judged: code alone can't give an honest level. */
  level: number | null;
  /** Model scores left out because they disagreed too much with the rest. */
  ignored: { id: K; modelScore: number }[];
}

/**
 * Combines code and model scores for one answer: map the model's scores onto the
 * skill's criteria, drop outliers, cap short answers, then blend.
 * `expectedWords` is how many words a full answer has, for the length cap.
 * `onTask` is the model's verdict; code can't judge it, so it only obeys.
 */
export function finalScores(skill: 'speaking', code: Scores<SpeakingCriterionId>, model: ModelScores | null, wordCount: number, expectedWords: number, onTask?: boolean): FinalScores<SpeakingCriterionId>;
export function finalScores(skill: 'writing', code: Scores<WritingCriterionId>, model: ModelScores | null, wordCount: number, expectedWords: number, onTask?: boolean): FinalScores<WritingCriterionId>;
export function finalScores(
  skill: 'speaking' | 'writing',
  code: Scores<string>,
  model: ModelScores | null,
  wordCount: number,
  expectedWords: number,
  onTask = true,
): FinalScores<string> {
  if (!model) {
    // Without the model, show only what code really measures. Code scores already carry the length cap.
    return { scores: Object.fromEntries(Object.entries(code).filter(([id]) => !MEANING_CRITERIA.includes(id))), level: null, ignored: [] };
  }
  const deliveryId = skill === 'speaking' ? 'listenability' : 'readability';
  const mapped = { content: model.content, vocabulary: model.vocabulary, [deliveryId]: model.delivery, task: model.task };
  const checked = dropOutlierScores(mapped, code);
  const weights = skill === 'speaking' ? DEFAULT_SPEAKING_WEIGHTS : DEFAULT_WRITING_WEIGHTS;
  const scores = blendScores(code, checked.scores, weights as Record<string, number>, lengthCeiling(wordCount, expectedWords));
  if (!onTask) {
    // Good pace or rich words in an answer to some other question can't earn a good level.
    for (const id of Object.keys(scores)) scores[id] = MEANING_CRITERIA.includes(id) ? MIN_LEVEL : Math.min(scores[id], OFF_TASK_CEILING);
  }
  return { scores, level: overallLevel(scores), ignored: checked.ignored };
}
