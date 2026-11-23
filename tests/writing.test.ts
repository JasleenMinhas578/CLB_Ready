import { describe, expect, it } from 'vitest';
import { checkGrammar } from '../src/services/grammar/ruleChecker';
import { measureWriting } from '../src/domain/measure/writingMetrics';
import { codeEstimatesWriting, writingTips } from '../src/domain/scoring/writingEstimate';

const RANGE = { min: 150, max: 200 };

const GOOD_EMAIL = `Dear Customer Service Team,

I am writing about a coffee machine that I ordered from your website on March 3. Unfortunately, when the package arrived last Friday, the glass carafe was cracked and the water tank was leaking. As a result, I have not been able to use the machine at all, which is disappointing because I bought it as a gift.

I have attached two photographs that show the damage clearly. In addition, the box itself was badly crushed, so I believe the problem happened during delivery rather than in your warehouse. However, I understand that mistakes like this can occur, and I would appreciate a quick solution.

Therefore, I would like you to send a replacement machine as soon as possible. Alternatively, a full refund to my original payment method would also be acceptable. Please let me know which option you can offer and whether I need to return the damaged item first.

Thank you for your help with this matter.

Sincerely,
Jasleen Kaur`;

const CASUAL_EMAIL = `hey,

i got the coffee machine and it's broken. it's gonna need fixing and i don't have time for this stuff. can you send a new one`;

describe('checkGrammar', () => {
  it('finds common mistakes with fixes', () => {
    const issues = checkGrammar('i recieve a email every day.They are good , but could of been shorter');
    const messages = issues.map((issue) => issue.suggestion);
    expect(messages.includes('I')).toBe(true);
    expect(messages.includes('receive')).toBe(true);
    expect(messages.includes('an')).toBe(true);
    expect(messages.includes('. ')).toBe(true);
    expect(messages.includes(',')).toBe(true);
    expect(messages.includes('could have')).toBe(true);
  });

  it('flags a repeated word and a lowercase sentence start', () => {
    const issues = checkGrammar('I went to the the store. then I left.');
    expect(issues.some((issue) => issue.message.includes('repeated'))).toBe(true);
    expect(issues.some((issue) => issue.suggestion === 'T')).toBe(true);
  });

  it('accepts a correct, well-written email', () => {
    expect(checkGrammar(GOOD_EMAIL)).toEqual([]);
  });

  it('does not flag "a university" or "an hour"', () => {
    expect(checkGrammar('It took an hour to reach a university.')).toEqual([]);
  });
});

describe('measureWriting', () => {
  it('reads a complete formal email', () => {
    const m = measureWriting({ text: GOOD_EMAIL, wordRange: RANGE, grammarIssues: 0, emailTone: 'formal' });
    expect(m.wordCount >= 150 && m.wordCount <= 200).toBe(true);
    expect(m.paragraphs >= 3).toBe(true);
    expect(m.email?.hasGreeting).toBe(true);
    expect(m.email?.hasClosing).toBe(true);
    expect(m.email?.toneMismatch).toBe(false);
    expect(m.linkingWords.length >= 4).toBe(true);
  });

  it('spots a casual tone in a formal email', () => {
    const m = measureWriting({ text: CASUAL_EMAIL, wordRange: RANGE, grammarIssues: 5, emailTone: 'formal' });
    expect(m.email?.toneMismatch).toBe(true);
    expect(m.email?.hasClosing).toBe(false);
    expect(m.email?.informalWords.includes('gonna')).toBe(true);
  });

  it('finds the option a survey answer chose', () => {
    const options: [string, string] = ['A new public swimming pool', 'More bike lanes across the city'];
    const chosePool = measureWriting({ text: 'I would choose the swimming pool because families need it.', wordRange: RANGE, grammarIssues: 0, options });
    const choseBikes = measureWriting({ text: 'In my view, bike lanes are the better option. I support more bike lanes for safety.', wordRange: RANGE, grammarIssues: 0, options });
    const unclear = measureWriting({ text: 'Both ideas have good points for the city.', wordRange: RANGE, grammarIssues: 0, options });
    expect(chosePool.survey?.chosen).toBe(0);
    expect(choseBikes.survey?.chosen).toBe(1);
    expect(unclear.survey?.chosen).toBeNull();
  });
});

describe('writing estimates and tips', () => {
  const good = measureWriting({ text: GOOD_EMAIL, wordRange: RANGE, grammarIssues: 0, emailTone: 'formal' });
  const casual = measureWriting({ text: CASUAL_EMAIL, wordRange: RANGE, grammarIssues: 5, emailTone: 'formal' });

  it('rates the complete email above the casual one on every criterion', () => {
    const a = codeEstimatesWriting(good);
    const b = codeEstimatesWriting(casual);
    expect(a.task > b.task).toBe(true);
    expect(a.readability > b.readability).toBe(true);
    expect(a.content > b.content).toBe(true);
  });

  it('gives format and tone tips to the casual email', () => {
    const tips = writingTips(casual, 9);
    expect(tips.some((tip) => tip.includes('Aim for 150–200'))).toBe(true);
    expect(tips.some((tip) => tip.includes('Sincerely'))).toBe(true);
    expect(tips.some((tip) => tip.includes('formal'))).toBe(true);
  });
});
