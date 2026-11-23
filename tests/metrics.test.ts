import { describe, expect, it } from 'vitest';
import { measureSpeaking, vocabularyVariety, type MetricWord } from '../src/domain/measure/speakingMetrics';
import { blendScores, codeEstimates, overallLevel } from '../src/domain/scoring/estimate';
import { codeTips } from '../src/domain/scoring/codeTips';

/** Builds timed words: each word 0.3s long, 0.1s gap, plus extra gaps where asked. */
function timed(text: string, extraGapAfter: Record<number, number> = {}): MetricWord[] {
  let t = 0.5;
  return text.split(' ').map((word, i) => {
    const item = { text: word, start: t, end: t + 0.3 };
    t += 0.4 + (extraGapAfter[i] ?? 0);
    return item;
  });
}

const FLUENT =
  'First, I think you should join a local club because it is the easiest way to meet people. ' +
  'For example, a hiking group meets every weekend. In addition, volunteering at a food bank helps the community. ' +
  'As a result, you will feel connected and confident in your new city.';

describe('measureSpeaking', () => {
  it('measures pace from first to last word, not the whole recording', () => {
    const words = timed(FLUENT);
    const m = measureSpeaking({ text: FLUENT, words, answerSeconds: 90, recordedSeconds: 60 });
    expect(m.wordCount).toBe(words.length);
    expect(m.wordsPerMinute).toBe(Math.round((words.length / (words[words.length - 1].end - words[0].start)) * 60));
  });

  it('finds long pauses, including before the first word', () => {
    const words = timed('so um I think uh you should um go', { 2: 3 });
    words.forEach((w) => { w.start += 2; w.end += 2; });
    const m = measureSpeaking({ text: '', words, answerSeconds: 60, recordedSeconds: 20 });
    expect(m.longPauses.length).toBe(2);
    expect(m.longPauses[0].afterWord).toBe(-1);
    expect(m.longPauses[1].afterWord).toBe(2);
  });

  it('counts fillers and leaves them out of the word count', () => {
    const text = 'um I think uh you know it is um good';
    const m = measureSpeaking({ text, words: timed(text), answerSeconds: 60, recordedSeconds: 10 });
    expect(m.fillerCount).toBe(4);
    expect(m.fillers[0]).toEqual({ word: 'um', count: 2 });
    expect(m.wordCount).toBe(7); // i think you know it is good
  });

  it('spots vague words, repeats and linking words', () => {
    const text = 'It is good. The club is good and the club is nice. Also the club is fun, for example on Sundays.';
    const m = measureSpeaking({ text, words: [], answerSeconds: 60, recordedSeconds: 30 });
    expect(m.vagueWords).toEqual(['good', 'nice']);
    expect(m.repeatedWords[0]).toEqual({ word: 'club', count: 3 });
    expect(m.linkingWords).toEqual(['also', 'for example']);
  });

  it('caps time used at 100%', () => {
    const m = measureSpeaking({ text: 'hello there', words: [], answerSeconds: 60, recordedSeconds: 62 });
    expect(m.timeUsed).toBe(1);
  });
});

describe('vocabularyVariety', () => {
  it('is 1 for all-different words and low for repetition', () => {
    expect(vocabularyVariety(['a', 'b', 'c'])).toBe(1);
    expect(vocabularyVariety(Array(60).fill('same'))).toBeGreaterThan(0);
    expect(vocabularyVariety(Array(60).fill('same')) < 0.1).toBe(true);
  });
});

describe('scoring', () => {
  // A realistic full answer: about 100 words in 60 seconds.
  const FULL = `${FLUENT} Overall, ${FLUENT.charAt(0).toLowerCase()}${FLUENT.slice(1)}`;
  const fluent = measureSpeaking({ text: FULL, words: timed(FULL), answerSeconds: 60, recordedSeconds: 58 });
  const halting = measureSpeaking({
    text: '',
    words: timed('um it is good um it is good uh it is nice', { 2: 3, 5: 3, 8: 3 }),
    answerSeconds: 60,
    recordedSeconds: 25,
  });

  it('rates a fluent, organized answer above a halting one on every criterion', () => {
    const a = codeEstimates(fluent);
    const b = codeEstimates(halting);
    expect(a.content > b.content).toBe(true);
    expect(a.listenability > b.listenability).toBe(true);
    expect(a.task > b.task).toBe(true);
  });

  it('never lets code alone go above CLB 10', () => {
    const scores = codeEstimates(fluent);
    expect(Math.max(...Object.values(scores)) <= 10).toBe(true);
  });

  it('blends model and code by weight, and falls back to code without a model', () => {
    const code = { content: 8, vocabulary: 8, listenability: 8, task: 8 };
    expect(blendScores(code, null)).toEqual(code);
    const blended = blendScores(code, { content: 12, vocabulary: 12, listenability: 12, task: 12 });
    expect(blended.content).toBe(11); // 0.7 * 12 + 0.3 * 8 = 10.8
    expect(blended.listenability).toBe(9); // 0.3 * 12 + 0.7 * 8 = 9.2
  });

  it('ignores missing or broken model scores', () => {
    const code = { content: 7, vocabulary: 7, listenability: 7, task: 7 };
    expect(blendScores(code, { content: Number.NaN }).content).toBe(7);
  });

  it('reports the rounded mean as the overall level', () => {
    expect(overallLevel({ content: 8, vocabulary: 7, listenability: 7, task: 9 })).toBe(8);
  });
});

describe('codeTips', () => {
  it('gives specific tips for a halting answer and mentions the goal', () => {
    const tips = codeTips(
      measureSpeaking({ text: '', words: timed('um it is good um it is nice uh it is good', { 2: 3, 5: 3 }), answerSeconds: 60, recordedSeconds: 20 }),
      9,
    );
    expect(tips.some((tip) => tip.includes('% of the time'))).toBe(true);
    expect(tips.some((tip) => tip.includes('paused'))).toBe(true);
    expect(tips.some((tip) => tip.includes('CLB 9'))).toBe(true);
  });
});
