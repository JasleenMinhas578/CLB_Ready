import type { WritingMetrics } from '../measure/writingMetrics';
import { CODE_LEVEL_CEILING, clampLevel, type Scores, type WritingCriterionId } from './estimate';
import { MIN_SENTENCES_FOR_VARIETY, MIN_WORDS_FOR_VARIETY, lengthCeiling, plural } from './sufficiency';

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

  // Readability: paragraphs, grammar, sentence variety and length.
  let readability = m.paragraphs >= 3 ? 9 : m.paragraphs === 2 ? 8 : 6;
  const issuesPer100 = m.wordCount ? (m.grammarIssues / m.wordCount) * 100 : 0;
  if (issuesPer100 > 4) readability -= 2;
  else if (issuesPer100 > 2) readability -= 1;
  if (m.sentences >= MIN_SENTENCES_FOR_VARIETY && m.sentenceVariety < 3) readability -= 1;
  // Very short sentences read as choppy and basic; very long ones as run-on.
  if (m.avgSentenceLength > 30) readability -= 1;
  else if (m.sentences >= MIN_SENTENCES_FOR_VARIETY && m.avgSentenceLength < 12) readability -= 1;
  const polished = issuesPer100 === 0 && m.paragraphs >= 3 && m.sentenceVariety >= 5 && m.avgSentenceLength >= 14;
  if (polished) readability += 1;

  // Vocabulary: variety and precise (longer) words, minus general words and repetition.
  // Variety means little in a handful of words, so short answers get a neutral 6.
  let vocabulary =
    m.wordCount < MIN_WORDS_FOR_VARIETY ? 6 : m.variety >= 0.82 ? 10 : m.variety >= 0.76 ? 9 : m.variety >= 0.7 ? 8 : m.variety >= 0.62 ? 7 : 6;
  if (m.longWords < 0.12) vocabulary -= 1;
  if (m.vagueWords.length >= 2) vocabulary -= 1;
  if (m.repeatedWords.some((word) => word.count >= 5)) vocabulary -= 1;

  // Content and coherence: connectors and enough development.
  const linking = m.linkingWords.length;
  let content = linking >= 6 ? 10 : linking >= 4 ? 9 : linking >= 3 ? 8 : linking >= 2 ? 7 : linking >= 1 ? 6 : 5;
  if (m.wordCount < min * 0.75) content -= 1;

  const ceiling = Math.min(CODE_LEVEL_CEILING, lengthCeiling(m.wordCount, min));
  return {
    content: clampLevel(content, ceiling),
    vocabulary: clampLevel(vocabulary, ceiling),
    readability: clampLevel(readability, ceiling),
    task: clampLevel(task, ceiling),
  };
}

/** Measurement-based tips for writing, most important first. */
export function writingTips(m: WritingMetrics, goal: number, options?: [string, string]): string[] {
  const tips: string[] = [];
  const { min, max } = m.wordRange;

  if (m.wordCount < min) tips.push(`You wrote ${plural(m.wordCount, 'word')}. Aim for ${min}–${max}: add ${min - m.wordCount} or more, with one more detail or example per paragraph.`);
  else if (m.wordCount > max) tips.push(`You wrote ${plural(m.wordCount, 'word')}, over the ${max}-word limit. Cut repeated ideas so every sentence adds something.`);

  if (m.survey?.chosen === null && options) {
    tips.push(`Say clearly which option you choose, for example "I would choose ${options[0].toLowerCase()} because…", in your first sentence.`);
  }
  if (m.email) {
    if (m.email.headerLines.length) {
      tips.push('Leave out the subject line. CELPIP emails start with the greeting, and extra lines only use up your words.');
    }
    if (!m.email.hasGreeting) tips.push(`Start with a greeting such as "${m.email.expectedTone === 'formal' ? 'Dear Sir or Madam,' : 'Hi Sam,'}".`);
    if (!m.email.hasClosing) tips.push(`End with a closing line and sign-off, such as "${m.email.expectedTone === 'formal' ? 'Sincerely,' : 'Best wishes,'}" and your name.`);
    if (m.email.toneMismatch) {
      const examples = [...m.email.informalWords, ...m.email.contractions].slice(0, 3).map((word) => `"${word}"`).join(', ');
      tips.push(`This email should sound formal. Replace ${examples} with full, formal forms (for example "I am" instead of "I'm").`);
    }
  }
  if (m.paragraphs < 3) tips.push('Split your answer into 3 or more paragraphs: an opening, your main points, and a closing.');
  if (m.grammarIssues >= 3) tips.push(`We marked ${plural(m.grammarIssues, 'possible mistake')}. Save 2 minutes at the end to reread and fix them.`);
  if (m.vagueWords.length >= 2) {
    const examples = m.vagueWords.slice(0, 3).map((word) => `"${word}"`).join(', ');
    tips.push(`Replace general words like ${examples} with more exact words. CLB ${goal} writing says exactly what it means.`);
  }
  if (m.repeatedWords.length > 0) {
    const { word, count } = m.repeatedWords[0];
    tips.push(`You used "${word}" ${count} times. Try a different word with the same meaning, or say it another way.`);
  }
  if (m.linkingWords.length < 3) tips.push('Connect your ideas with words like "however", "in addition" and "as a result".');
  if (m.sentences >= MIN_SENTENCES_FOR_VARIETY && m.sentenceVariety < 3) tips.push('Your sentences are all a similar length. Mix short sentences with longer ones joined by "although" or "which".');

  return tips;
}
