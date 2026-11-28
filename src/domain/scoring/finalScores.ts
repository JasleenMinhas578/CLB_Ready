import { DEFAULT_SPEAKING_WEIGHTS, DEFAULT_WRITING_WEIGHTS, blendScores, type Scores, type SpeakingCriterionId, type WritingCriterionId } from './estimate';
import { dropOutlierScores } from './outliers';
import { lengthCeiling } from './sufficiency';

/** The four scores the feedback model returns. `delivery` means listenability or readability. */
export interface ModelScores {
  content: number;
  vocabulary: number;
  delivery: number;
  task: number;
}

export interface FinalScores<K extends string> {
  scores: Scores<K>;
  /** Model scores left out because they disagreed too much with the rest. */
  ignored: { id: K; modelScore: number }[];
}

/**
 * Combines code and model scores for one answer: map the model's scores onto the
 * skill's criteria, drop outliers, cap short answers, then blend.
 * `expectedWords` is how many words a full answer has, for the length cap.
 */
export function finalScores(skill: 'speaking', code: Scores<SpeakingCriterionId>, model: ModelScores | null, wordCount: number, expectedWords: number): FinalScores<SpeakingCriterionId>;
export function finalScores(skill: 'writing', code: Scores<WritingCriterionId>, model: ModelScores | null, wordCount: number, expectedWords: number): FinalScores<WritingCriterionId>;
export function finalScores(
  skill: 'speaking' | 'writing',
  code: Scores<string>,
  model: ModelScores | null,
  wordCount: number,
  expectedWords: number,
): FinalScores<string> {
  const deliveryId = skill === 'speaking' ? 'listenability' : 'readability';
  const mapped = model ? { content: model.content, vocabulary: model.vocabulary, [deliveryId]: model.delivery, task: model.task } : null;
  const checked = mapped ? dropOutlierScores(mapped, code) : null;
  const weights = skill === 'speaking' ? DEFAULT_SPEAKING_WEIGHTS : DEFAULT_WRITING_WEIGHTS;
  const scores = blendScores(code, checked?.scores ?? null, weights as Record<string, number>, lengthCeiling(wordCount, expectedWords));
  return { scores, ignored: checked?.ignored ?? [] };
}
