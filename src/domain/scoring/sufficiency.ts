/**
 * Below these sizes there isn't enough language to estimate a level, and
 * any score would mislead. Results then show "too short to score" instead.
 */
export const MIN_SCORABLE_WRITING_WORDS = 50;
export const MIN_SCORABLE_SPEAKING_WORDS = 20;

/** Below these, a measurement is noise rather than signal. */
export const MIN_WORDS_FOR_VARIETY = 40;
export const MIN_SENTENCES_FOR_VARIETY = 3;

export function isScorable(skill: 'speaking' | 'writing', wordCount: number): boolean {
  return wordCount >= (skill === 'speaking' ? MIN_SCORABLE_SPEAKING_WORDS : MIN_SCORABLE_WRITING_WORDS);
}

/** "1 word", "2 words". */
export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`;
}

/**
 * Words a full spoken answer has: about 2 a second, a clear and natural pace.
 * Used to cap short answers and to size AI rewrites and model answers.
 */
export function expectedSpokenWords(answerSeconds: number): number {
  return Math.round(answerSeconds * 2);
}

/**
 * Highest level a short answer can reach, however good its words are.
 * Length is part of task fulfillment and development on the real test.
 */
export function lengthCeiling(wordCount: number, expectedWords: number): number {
  const share = expectedWords > 0 ? wordCount / expectedWords : 1;
  if (share < 0.5) return 5;
  if (share < 0.75) return 7;
  return 12;
}
