import type { WritingMetrics } from '../measure/writingMetrics';
import { CODE_LEVEL_CEILING, clampLevel, type Scores, type WritingCriterionId } from './estimate';

/**
 * Rough CLB-style levels for a written answer from code measurements.
 * Starting rules, tuned later by calibration against hand-scored samples.
 */
export function codeEstimatesWriting(m: WritingMetrics): Scores<WritingCriterionId> {
  const { min, max } = m.wordRange;

  // Task fulfillment: length, plus the format the task asks for.
  let task = m.wordCount >= min && m.wordCount <= max ? 9 : m.wordCount >= min * 0.85 && m.wordCount <= max * 1.15 ? 8 : m.wordCount >= min * 0.65 ? 6 : 5;
  if (m.email) {
    if (!m.email.hasGreeting) task -= 1;
    if (!m.email.hasClosing) task -= 1;
    if (m.email.toneMismatch) task -= 1;
  }
  if (m.survey && m.survey.chosen === null) task -= 2;

  // Readability: paragraphs, grammar, sentence variety.
  let readability = m.paragraphs >= 3 ? 9 : m.paragraphs === 2 ? 8 : 6;
  const issuesPer100 = m.wordCount ? (m.grammarIssues / m.wordCount) * 100 : 0;
  if (issuesPer100 > 4) readability -= 2;
  else if (issuesPer100 > 2) readability -= 1;
  if (m.sentences >= 4 && m.sentenceVariety < 3) readability -= 1;
  if (m.avgSentenceLength > 30) readability -= 1;
  if (issuesPer100 === 0 && m.paragraphs >= 3 && m.sentenceVariety >= 5) readability += 1;

  // Vocabulary: variety, minus general words and repetition.
  let vocabulary = m.variety >= 0.78 ? 10 : m.variety >= 0.7 ? 9 : m.variety >= 0.62 ? 8 : m.variety >= 0.54 ? 7 : 6;
  if (m.vagueWords.length >= 4) vocabulary -= 1;
  if (m.repeatedWords.some((word) => word.count >= 5)) vocabulary -= 1;

  // Content and coherence: connectors and enough development.
  const linking = m.linkingWords.length;
  let content = linking >= 6 ? 10 : linking >= 4 ? 9 : linking >= 3 ? 8 : linking >= 2 ? 7 : linking >= 1 ? 6 : 5;
  if (m.wordCount < min * 0.75) content -= 1;

  return {
    content: clampLevel(content, CODE_LEVEL_CEILING),
    vocabulary: clampLevel(vocabulary, CODE_LEVEL_CEILING),
    readability: clampLevel(readability, CODE_LEVEL_CEILING),
    task: clampLevel(task, CODE_LEVEL_CEILING),
  };
}

/** Measurement-based tips for writing, most important first. */
export function writingTips(m: WritingMetrics, goal: number, options?: [string, string]): string[] {
  const tips: string[] = [];
  const { min, max } = m.wordRange;

  if (m.wordCount < min) tips.push(`You wrote ${m.wordCount} words. Add ${min - m.wordCount} or more to reach ${min}: one more detail or example per paragraph.`);
  else if (m.wordCount > max) tips.push(`You wrote ${m.wordCount} words, over the ${max} limit. Cut repeated ideas so every sentence adds something.`);

  if (m.survey?.chosen === null && options) {
    tips.push(`Say clearly which option you choose, e.g. "I would choose ${options[0].toLowerCase()} because…", in your first sentence.`);
  }
  if (m.email) {
    if (!m.email.hasGreeting) tips.push(`Start with a greeting such as "${m.email.expectedTone === 'formal' ? 'Dear Sir or Madam,' : 'Hi Sam,'}".`);
    if (!m.email.hasClosing) tips.push(`End with a closing line and sign-off, such as "${m.email.expectedTone === 'formal' ? 'Sincerely,' : 'Best wishes,'}" and your name.`);
    if (m.email.toneMismatch) {
      const examples = [...m.email.informalWords, ...m.email.contractions].slice(0, 3).map((word) => `"${word}"`).join(', ');
      tips.push(`This email should sound formal. Replace ${examples} with full, formal forms (for example "I am" instead of "I'm").`);
    }
  }
  if (m.paragraphs < 3) tips.push('Split your answer into 3 or more paragraphs: an opening, your main points, and a closing.');
  if (m.grammarIssues >= 3) tips.push(`We marked ${m.grammarIssues} possible mistakes. Save 2 minutes at the end to reread and fix them.`);
  if (m.vagueWords.length >= 2) {
    const examples = m.vagueWords.slice(0, 3).map((word) => `"${word}"`).join(', ');
    tips.push(`Swap general words like ${examples} for precise ones. CLB ${goal} writing names exactly what it means.`);
  }
  if (m.repeatedWords.length > 0) {
    const { word, count } = m.repeatedWords[0];
    tips.push(`You used "${word}" ${count} times. Use a synonym or rephrase.`);
  }
  if (m.linkingWords.length < 3) tips.push('Connect your ideas with words like "however", "in addition" and "as a result".');
  if (m.sentences >= 4 && m.sentenceVariety < 3) tips.push('Your sentences are all a similar length. Mix short sentences with longer ones joined by "although" or "which".');

  return tips;
}
