import { describe, expect, it } from 'vitest';
import { checkGrammar } from '../src/services/grammar/ruleChecker';
import { EMAIL_SAMPLES, SURVEY_STRONG } from './fixtures/calibration';

/** Applies every suggestion, so a test can compare whole corrected sentences. */
function corrected(text: string): string {
  let out = text;
  for (const found of [...checkGrammar(text)].sort((a, b) => b.start - a.start)) {
    out = out.slice(0, found.start) + found.suggestion + out.slice(found.end);
  }
  return out;
}

const CATCHES: [string, string][] = [
  // Agreement
  ['My neighbour he don\'t answer the door.', 'My neighbour he doesn\'t answer the door.'],
  ['The machine works but it leak every day.', 'The machine works but it leaks every day.'],
  ['Every morning she want coffee.', 'Every morning she wants coffee.'],
  ['They has two children.', 'They have two children.'],
  ['You was right about the price.', 'You were right about the price.'],
  ['I is very happy here.', 'I am very happy here.'],
  // Verb forms
  ['You must to pay the fee.', 'You must pay the fee.'],
  ['I didn\'t went to the store.', 'I didn\'t go to the store.'],
  ['Why did you bought it?', 'Why did you buy it?'],
  ['The glass is crack and the box was broke.', 'The glass is cracked and the box was broken.'],
  ['I am very interest in this job.', 'I am very interested in this job.'],
  // Words and phrases
  ['This one is more better.', 'This one is better.'],
  ['Thank you for the informations.', 'Thank you for the information.'],
  ['It is cheaper then the old one.', 'It is cheaper than the old one.'],
  ['Their is a problem with my order.', 'There is a problem with my order.'],
  ['I think its a good idea.', 'I think it\'s a good idea.'],
  ['I do not want to loose my job.', 'I do not want to lose my job.'],
  ['I have lived here since five years.', 'I have lived here for five years.'],
  ['We should discuss about the plan.', 'We should discuss the plan.'],
  ['I like to listen music.', 'I like to listen to music.'],
  ['Please explain me the rules.', 'Please explain to me the rules.'],
  ['It depends of the weather.', 'It depends on the weather.'],
  ['I am agree with this idea.', 'I agree with this idea.'],
  ['We help each others.', 'We help each other.'],
  ['I need an other day.', 'I need another day.'],
  ['I had to wait long time.', 'I had to wait a long time.'],
  ['Please send new one.', 'Please send a new one.'],
  ['I was in hurry.', 'I was in a hurry.'],
  ['I don\'t have no money.', 'I don\'t have any money.'],
  ['I didnt do nothing.', 'I didn\'t do anything.'],
  // Capitals
  ['I moved to toronto on monday.', 'I moved to Toronto on Monday.'],
  ['It arrived on march 3.', 'It arrived on March 3.'],
  ['she want a refund.', 'She wants a refund.'],
];

const LEAVES_ALONE = [
  'Does she want a refund?',
  'Can it go in the dishwasher?',
  'Please let it dry overnight.',
  'I want it fixed soon.',
  'I would like it like this.',
  'If I was you, I would ask.',
  'It cost me fifty dollars.',
  'We ought to leave early.',
  'He had the will to win.',
  'We need more water and more customers.',
  'I felt better then.',
  'The company changed its own rules.',
  'You may march in the parade.',
  'I can\'t say no to my friends.',
  'There is no one at the desk.',
  'I have lived here since 2019.',
  'Thank you is not enough.',
  'I returned the item yesterday.',
  'I will listen to music.',
];

describe('learner grammar rules', () => {
  for (const [wrong, right] of CATCHES) {
    it(`fixes: ${wrong}`, () => expect(corrected(wrong)).toBe(right));
  }
  for (const sentence of LEAVES_ALONE) {
    it(`leaves alone: ${sentence}`, () => expect(checkGrammar(sentence)).toEqual([]));
  }
  it('finds nothing in the strong calibration emails', () => {
    for (const sample of EMAIL_SAMPLES.filter((s) => s.id === 'strong')) {
      expect(checkGrammar(sample.text), sample.id).toEqual([]);
    }
    expect(checkGrammar(SURVEY_STRONG), 'survey').toEqual([]);
  });
});
