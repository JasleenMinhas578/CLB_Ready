import type { SpeakingMetrics } from '../measure/speakingMetrics';

/**
 * Tips that come straight from the measurements. Shown in light mode, and
 * alongside AI tips so every learner gets specific, reliable advice.
 * Ordered by impact; the results screen shows the first few.
 */
export function codeTips(metrics: SpeakingMetrics, goal: number): string[] {
  const tips: string[] = [];

  if (metrics.timeUsed < 0.65) {
    tips.push(
      `You used ${Math.round(metrics.timeUsed * 100)}% of the time. Add another reason or example so you keep speaking until the timer ends.`,
    );
  }
  if (metrics.wordsPerMinute < 100) {
    tips.push(`Your pace was ${metrics.wordsPerMinute} words a minute. Aim for about 120 to 150 by planning your points during the prep time.`);
  } else if (metrics.wordsPerMinute > 180) {
    tips.push(`Your pace was ${metrics.wordsPerMinute} words a minute. Slow down a little so every word is clear.`);
  }
  if (metrics.longPauses.length >= 2) {
    tips.push(
      `You paused for more than 2 seconds ${metrics.longPauses.length} times. Use short linking phrases like "another reason is" to keep going while you think.`,
    );
  }
  if (metrics.fillerCount >= 3) {
    const top = metrics.fillers[0]?.word ?? 'um';
    tips.push(`You said "${top}" and similar fillers ${metrics.fillerCount} times. A short silent pause sounds more confident.`);
  }
  if (metrics.vagueWords.length >= 2) {
    const examples = metrics.vagueWords.slice(0, 3).map((word) => `"${word}"`).join(', ');
    tips.push(`Swap general words like ${examples} for precise ones. CLB ${goal} answers name exactly what they mean.`);
  }
  if (metrics.repeatedWords.length > 0) {
    const { word, count } = metrics.repeatedWords[0];
    tips.push(`You used "${word}" ${count} times. Try a synonym or rephrase the second and third time.`);
  }
  if (metrics.linkingWords.length < 3) {
    tips.push('Organize your answer with linking words such as "first", "for example" and "as a result".');
  }

  return tips;
}
