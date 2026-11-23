import { describe, expect, it } from 'vitest';
import { EMAIL_SAMPLES, SURVEY_STRONG } from './fixtures/calibration';
import { checkGrammar } from '../src/services/grammar/ruleChecker';
import { measureWriting } from '../src/domain/measure/writingMetrics';
import { codeEstimatesWriting } from '../src/domain/scoring/writingEstimate';
import { blendScores, overallLevel, DEFAULT_WRITING_WEIGHTS } from '../src/domain/scoring/estimate';
import { dropOutlierScores } from '../src/domain/scoring/outliers';
import { mentionsDate, mergeChecklist } from '../src/domain/scoring/autoChecks';
import { parseFeedback } from '../src/services/ai/feedbackPrompt';
import { lengthCeiling } from '../src/domain/scoring/sufficiency';

const RANGE = { min: 150, max: 200 };
const measureEmail = (text: string) =>
  measureWriting({ text, wordRange: RANGE, grammarIssues: checkGrammar(text).length, emailTone: 'formal' });

describe('calibration set (code-only scoring)', () => {
  const levels = EMAIL_SAMPLES.map((sample) => ({ ...sample, level: overallLevel(codeEstimatesWriting(measureEmail(sample.text))) }));

  for (const sample of levels) {
    it(`puts the ${sample.id} email in CLB ${sample.band[0]}–${sample.band[1]} (got ${sample.level})`, () => {
      expect(sample.level >= sample.band[0] && sample.level <= sample.band[1]).toBe(true);
    });
  }

  it('keeps strong above middle above weak', () => {
    const [strong, middle, weak] = levels.map((sample) => sample.level);
    expect(strong > middle && middle > weak).toBe(true);
  });
});

describe('ignoring an AI score that does not fit', () => {
  // The real result: a strong email got Content 4 beside three 11-12s.
  const code = codeEstimatesWriting(measureEmail(EMAIL_SAMPLES[0].text));

  it('drops the outlier and keeps the rest', () => {
    const { scores, ignored } = dropOutlierScores({ content: 4, vocabulary: 12, readability: 11, task: 12 }, code);
    expect(ignored).toEqual([{ id: 'content', modelScore: 4 }]);
    expect(scores.content).toBeUndefined();
    expect(scores.vocabulary).toBe(12);
  });

  it('then scores content from measurements, not 5', () => {
    const { scores } = dropOutlierScores({ content: 4, vocabulary: 12, readability: 11, task: 12 }, code);
    const blended = blendScores(code, scores, DEFAULT_WRITING_WEIGHTS, lengthCeiling(175, 150));
    expect(blended.content).toBe(code.content);
    expect(blended.content >= 7).toBe(true);
  });

  it('keeps a low score when code agrees with it', () => {
    const lowCode = { content: 5, vocabulary: 9, readability: 9, task: 9 };
    expect(dropOutlierScores({ content: 4, vocabulary: 10, readability: 10, task: 10 }, lowCode).ignored).toEqual([]);
  });

  it('keeps everything when scores are consistent', () => {
    expect(dropOutlierScores({ content: 8, vocabulary: 9, readability: 8, task: 9 }, code).ignored).toEqual([]);
  });
});

describe('checklist items checked by code', () => {
  const items = ['Describes the purchase and date', 'Explains the damage', 'Makes a clear request', 'Uses a polite, formal tone'];

  it('finds dates in many forms', () => {
    for (const text of ['on March 3', 'on 3rd of March', 'on 03/14/2026', 'last Friday', 'two weeks ago', 'yesterday']) {
      expect(mentionsDate(`I bought it ${text}.`), text).toBe(true);
    }
    expect(mentionsDate('I bought it recently.')).toBe(false);
  });

  it('overrides the AI where code is sure, and keeps the AI elsewhere', () => {
    const text = EMAIL_SAMPLES[0].text;
    const ai = [{ met: false }, { met: true }, { met: true }, { met: true }];
    const rows = mergeChecklist(items, ai, text, measureEmail(text));
    expect(rows[0]).toEqual({ met: true, byCode: true });
    expect(rows[1]).toEqual({ met: true, byCode: false });
    expect(rows[3]).toEqual({ met: true, byCode: true });
  });

  it('fails the formal-tone item for a casual email even if the AI passes it', () => {
    const text = EMAIL_SAMPLES[2].text;
    const rows = mergeChecklist(items, [{ met: true }, { met: true }, { met: true }, { met: true }], text, measureEmail(text));
    expect(rows[3]).toEqual({ met: false, byCode: true });
  });

  it('checks the survey choice', () => {
    const options: [string, string] = ['A new public swimming pool', 'More bike lanes across the city'];
    const metrics = measureWriting({ text: SURVEY_STRONG, wordRange: RANGE, grammarIssues: 0, options });
    expect(mergeChecklist(['Clearly picks one option'], null, SURVEY_STRONG, metrics)[0]).toEqual({ met: true, byCode: true });
  });
});

describe('clearer score names in AI replies', () => {
  it('reads the full criterion names', () => {
    const reply = parseFeedback(JSON.stringify({
      checklist: [], tips: ['a'], improved: 'b',
      scores: { content_and_coherence: 9, vocabulary: 8, listenability_or_readability: 9, task_fulfillment: 10 },
    }));
    expect(reply?.scores).toEqual({ content: 9, vocabulary: 8, delivery: 9, task: 10 });
  });
});
