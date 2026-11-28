import { describe, expect, it } from 'vitest';
import { finalScores, OFF_TASK_CEILING } from '../src/domain/scoring/finalScores';
import { codeEstimates, overallLevel } from '../src/domain/scoring/estimate';
import { measureSpeaking, type MetricWord } from '../src/domain/measure/speakingMetrics';
import { expectedSpokenWords } from '../src/domain/scoring/sufficiency';

const code = { content: 8, vocabulary: 8, task: 8 };

describe('finalScores', () => {
  it('maps delivery to readability, drops an outlier and blends the rest', () => {
    const result = finalScores('writing', { ...code, readability: 8 }, { content: 11, vocabulary: 4, delivery: 11, task: 11 }, 200, 150);
    expect(result.ignored).toEqual([{ id: 'vocabulary', modelScore: 4 }]);
    expect(result.scores).toEqual({ content: 10, vocabulary: 8, readability: 9, task: 10 });
  });

  it('maps delivery to listenability and caps a short answer', () => {
    const result = finalScores('speaking', { ...code, listenability: 8 }, { content: 10, vocabulary: 10, delivery: 10, task: 10 }, 40, 120);
    expect(result.scores).toEqual({ content: 5, vocabulary: 5, listenability: 5, task: 5 });
    expect(result.ignored).toEqual([]);
  });

  it('leaves content and task unscored when there is no model reply', () => {
    expect(finalScores('speaking', { ...code, listenability: 7 }, null, 200, 120)).toEqual({ scores: { vocabulary: 8, listenability: 7 }, ignored: [] });
    expect(finalScores('writing', { ...code, readability: 9 }, null, 200, 150).scores).toEqual({ vocabulary: 8, readability: 9 });
  });
});

/** A fluent, fast answer about a football match, given to the "describe the market picture" task. */
const OFF_TOPIC =
  'The match last night was amazing. The home team scored twice in the first half and the crowd went wild. ' +
  'Their striker ran past three defenders and shot into the top corner. After the break the visitors pushed hard, ' +
  'but the goalkeeper saved a penalty in the final minute. My brother and I shouted until we lost our voices, ' +
  'then we walked home singing with hundreds of other fans. Honestly, it was the best game we have watched together ' +
  'this season, and we already bought tickets for the next one in two weeks.';

function timed(text: string, seconds: number): MetricWord[] {
  const words = text.split(' ');
  const step = seconds / words.length;
  return words.map((word, i) => ({ text: word, start: 0.5 + i * step, end: 0.5 + i * step + step * 0.8 }));
}

describe('an answer about something else', () => {
  // Fast and varied, using about half the time: code alone used to call this CLB 8.
  const metrics = measureSpeaking({ text: OFF_TOPIC, words: timed(OFF_TOPIC, 28), answerSeconds: 60, recordedSeconds: 60 });
  const run = (model: Parameters<typeof finalScores>[2], onTask?: boolean) =>
    finalScores('speaking', codeEstimates(metrics), model, metrics.wordCount, expectedSpokenWords(60), onTask);

  it('gets no content or task score from code alone', () => {
    const { scores } = run(null);
    expect(scores.content).toBeUndefined();
    expect(scores.task).toBeUndefined();
  });

  it('keeps the model\'s low content and task scores instead of dropping them as outliers', () => {
    const { scores, ignored } = run({ content: 4, vocabulary: 9, delivery: 8, task: 4 });
    expect(ignored.map((item) => item.id)).not.toContain('content');
    expect(ignored.map((item) => item.id)).not.toContain('task');
    expect(scores.content).toBeLessThanOrEqual(5);
  });

  it('scores low everywhere when the model says it is off task', () => {
    const { scores } = run({ content: 2, vocabulary: 9, delivery: 9, task: 2 }, false);
    expect(scores).toMatchObject({ content: 4, task: 4 });
    expect(Math.max(...Object.values(scores) as number[])).toBeLessThanOrEqual(OFF_TASK_CEILING);
    expect(overallLevel(scores)).toBeLessThanOrEqual(5);
  });

  it('is scored normally when the model says it is on task', () => {
    const { scores } = run({ content: 9, vocabulary: 9, delivery: 9, task: 9 }, true);
    expect(overallLevel(scores)).toBeGreaterThanOrEqual(8);
  });
});
