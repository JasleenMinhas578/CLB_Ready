import type { GrammarIssue } from '@/domain/grammar';
import { capitalize, eachMatch, matchCase, previousWord, type Rule } from './ruleUtils';

/**
 * Rules for mistakes English learners make often. Each one is narrow on
 * purpose: it should catch a clear error and leave correct writing alone.
 * Every rule has hit and no-hit examples in tests/grammar.test.ts.
 */

function issue(m: RegExpExecArray, kind: GrammarIssue['kind'], message: string, suggestion: string): GrammarIssue {
  return { start: m.index, end: m.index + m[0].length, kind, message, suggestion };
}

/** Contractions typed without an apostrophe, so a fix never keeps "dont". */
const APOSTROPHE: Record<string, string> = { dont: "don't", doesnt: "doesn't", didnt: "didn't", cant: "can't", wont: "won't" };
const withApostrophe = (word: string) => matchCase(word, APOSTROPHE[word.toLowerCase()] ?? word);

/** Base verbs that take -s after he/she/it. Verbs whose past looks the same ("cost", "put") are left out. */
const THIRD_PERSON: Record<string, string> = {
  want: 'wants', need: 'needs', like: 'likes', have: 'has', go: 'goes', do: 'does', make: 'makes', work: 'works',
  live: 'lives', know: 'knows', think: 'thinks', say: 'says', come: 'comes', take: 'takes', get: 'gets', feel: 'feels',
  seem: 'seems', look: 'looks', help: 'helps', break: 'breaks', leak: 'leaks', arrive: 'arrives', love: 'loves',
};
/** Words before "he/she/it + base verb" that make it correct: "does she want", "let it go", "I want it like this". */
const BEFORE_OBJECT = new Set([
  'do', 'does', 'did', "don't", "doesn't", "didn't", 'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must',
  "can't", "won't", "wouldn't", "couldn't", "shouldn't", 'let', 'make', 'made', 'makes', 'help', 'helped', 'saw', 'see', 'watch',
  'watched', 'hear', 'heard', 'felt', 'feel', 'noticed', 'have', 'had', 'has', 'get', 'got', 'want', 'wanted', 'need', 'needed',
  'like', 'liked', 'love', 'if', 'that', 'whether',
]);

/** Past forms that should go back to the base form after did/didn't. */
const PAST_TO_BASE: Record<string, string> = {
  went: 'go', bought: 'buy', came: 'come', saw: 'see', took: 'take', gave: 'give', made: 'make', said: 'say', told: 'tell',
  wrote: 'write', paid: 'pay', got: 'get', found: 'find', sent: 'send', spent: 'spend', left: 'leave', thought: 'think',
  knew: 'know', ate: 'eat', drove: 'drive', spoke: 'speak', broke: 'break', received: 'receive', arrived: 'arrive',
  worked: 'work', wanted: 'want', needed: 'need', liked: 'like', ordered: 'order', called: 'call', tried: 'try',
};

/** After is/was/are/were, these need the past participle: "is cracked", "was broken". */
const PARTICIPLES: Record<string, string> = {
  crack: 'cracked', damage: 'damaged', broke: 'broken', deliver: 'delivered', cancel: 'cancelled', charge: 'charged',
  disappoint: 'disappointed', stole: 'stolen', steal: 'stolen', ship: 'shipped', finish: 'finished', interest: 'interested',
  satisfy: 'satisfied', confuse: 'confused', worry: 'worried', surprise: 'surprised', bore: 'bored',
};

/** Nouns that have no plural in English. */
const UNCOUNTABLE: Record<string, string> = {
  informations: 'information', advices: 'advice', furnitures: 'furniture', equipments: 'equipment', luggages: 'luggage',
  baggages: 'baggage', homeworks: 'homework', knowledges: 'knowledge', researches: 'research', evidences: 'evidence',
  feedbacks: 'feedback', softwares: 'software', traffics: 'traffic', moneys: 'money', jewelries: 'jewelry',
};

const COMPARATIVES = new Set([
  'better', 'worse', 'best', 'worst', 'easier', 'bigger', 'smaller', 'cheaper', 'faster', 'harder', 'happier', 'larger',
  'longer', 'shorter', 'safer', 'nicer', 'higher', 'lower', 'busier', 'cleaner', 'quieter', 'stronger', 'easiest',
  'biggest', 'cheapest', 'fastest', 'happiest', 'safest',
]);

/** "the will to win", "a can to recycle": nouns, not modals. */
const DETERMINERS = new Set(['the', 'a', 'an', 'his', 'her', 'their', 'my', 'your', 'our', 'its', 'strong', 'free', 'own']);

const NUMBER_WORD = '(?:\\d+|a few|a|an|one|two|three|four|five|six|seven|eight|nine|ten|several|many|few)';
const ALWAYS_CAPITAL = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  'january', 'february', 'april', 'june', 'july', 'august', 'september', 'october', 'november', 'december',
  'english', 'french', 'canada', 'canadian', 'toronto', 'vancouver', 'montreal', 'ottawa', 'calgary', 'edmonton', 'christmas',
];

export const LEARNER_RULES: Rule[] = [
  // Subject–verb agreement: "he don't", "it have", "she want".
  (text) =>
    eachMatch(text, /\b(he|she|it)\s+(don't|dont|[a-z]+)\b/i, (m) => {
      if (BEFORE_OBJECT.has(previousWord(text, m.index))) return null;
      const verb = m[2].toLowerCase();
      if (verb === "don't" || verb === 'dont') return issue(m, 'grammar', `Use "doesn't" after "${m[1]}".`, `${m[1]} doesn't`);
      const fix = THIRD_PERSON[verb];
      return fix ? issue(m, 'grammar', `After "${m[1]}", use "${fix}" (or the past tense).`, `${m[1]} ${fix}`) : null;
    }),

  // "I has", "they has", "you was", "they is", "I is". ("I was" is correct, so it's skipped.)
  (text) =>
    eachMatch(text, /\b(I|you|we|they)\s+(has|is|was)\b/i, (m) => {
      if (previousWord(text, m.index) === 'thank') return null; // "Thank you is not enough"
      const subject = m[1].toLowerCase() === 'i' ? 'I' : m[1];
      const isI = subject === 'I';
      const verb = m[2].toLowerCase();
      const fix = verb === 'has' ? 'have' : verb === 'was' ? (isI ? null : 'were') : isI ? 'am' : 'are';
      return fix ? issue(m, 'grammar', `Use "${subject} ${fix}".`, `${subject} ${fix}`) : null;
    }),

  // Modal + "to": "can to go", "must to pay". ("ought to" and "have to" are fine.)
  (text) =>
    eachMatch(text, /\b(can|could|must|should|will|would|may|might)\s+to\s+([a-z]+)/i, (m) =>
      DETERMINERS.has(previousWord(text, m.index)) ? null : issue(m, 'grammar', `Leave out "to" after "${m[1]}".`, `${m[1]} ${m[2]}`),
    ),

  // did/didn't + past tense: "didn't went", "did you bought".
  (text) =>
    eachMatch(text, /\b(didn't|didnt|did not|did (?:you|he|she|it|we|they|i))\s+([a-z]+)\b/i, (m) => {
      const base = PAST_TO_BASE[m[2].toLowerCase()];
      return base ? issue(m, 'grammar', `After "did", use the base form "${base}".`, `${withApostrophe(m[1])} ${base}`) : null;
    }),

  // be + base verb that needs a participle: "is crack", "was broke", "I am interest in".
  (text) =>
    eachMatch(text, /\b(is|was|are|were|am|be|been)\s+(?:(very|really|so|also|completely|totally)\s+)?([a-z]+)\b/i, (m) => {
      const fix = PARTICIPLES[m[3].toLowerCase()];
      if (!fix) return null;
      const adverb = m[2] ? `${m[2]} ` : '';
      return issue(m, 'grammar', `Use "${fix}" here.`, `${m[1]} ${adverb}${fix}`);
    }),

  // Double comparatives: "more better", "more easier", "most best". ("more water" is fine.)
  (text) =>
    eachMatch(text, /\b(more|most)\s+([a-z]+)\b/i, (m) =>
      COMPARATIVES.has(m[2].toLowerCase()) ? issue(m, 'grammar', `Say "${m[2]}" on its own, without "${m[1]}".`, matchCase(m[1], m[2])) : null,
    ),

  // Uncountable nouns with -s: "informations", "advices".
  (text) =>
    eachMatch(text, /\b[A-Za-z]+\b/, (m) => {
      const fix = UNCOUNTABLE[m[0].toLowerCase()];
      return fix ? issue(m, 'grammar', `"${fix}" has no plural form.`, matchCase(m[0], fix)) : null;
    }),

  // "then" after a comparative should be "than". Needs a following word, so "I felt better then." is left alone.
  (text) =>
    eachMatch(text, /\b(better|worse|more|less|rather|other|bigger|smaller|cheaper|faster|easier|harder|larger|higher|lower)\s+then(?=\s+[A-Za-z0-9$])/i, (m) =>
      issue(m, 'spelling', 'Use "than" to compare.', `${m[1]} than`),
    ),

  // "their is" → "there is", "your welcome" → "you're welcome", "its a" → "it's a".
  (text) => [
    ...eachMatch(text, /\b(their)\s+(is|are|was|were)\b/i, (m) => issue(m, 'spelling', `Use "there ${m[2]}".`, `${matchCase(m[1], 'there')} ${m[2]}`)),
    ...eachMatch(text, /\byour\s+welcome\b/i, (m) => issue(m, 'spelling', 'Use "you\'re welcome" (you are).', matchCase(m[0], "you're welcome"))),
    ...eachMatch(text, /\b(its)\s+(a|an|the|very|not|been|going|so|too|really|important|possible|hard|easy)\b/i, (m) =>
      issue(m, 'punctuation', 'Use "it\'s" (it is / it has).', `${matchCase(m[1], "it's")} ${m[2]}`)),
  ],

  // "loose" as a verb → "lose".
  (text) =>
    eachMatch(text, /\b(to|will|would|could|might|don't|didn't|not|may|can)\s+loose\b/i, (m) =>
      issue(m, 'spelling', '"Loose" means not tight. The verb is "lose".', `${m[1]} lose`),
    ),

  // "since" + a length of time → "for".
  (text) =>
    eachMatch(text, new RegExp(`\\b(since)\\s+(${NUMBER_WORD}\\s+(?:years?|months?|weeks?|days?|hours?|minutes?))\\b`, 'i'), (m) =>
      issue(m, 'grammar', 'Use "for" with a length of time. "Since" goes with a starting point.', `${matchCase(m[1], 'for')} ${m[2]}`),
    ),

  // Fixed phrases learners often get wrong. Each replacement uses the pattern's groups.
  (text) => {
    const phrases: [RegExp, string, string][] = [
      [/\b(discuss)\s+about\b/i, '"Discuss" doesn\'t take "about".', '$1'],
      [/\b(listen(?:ed|ing)?)\s+(music|the radio|him|her|me|them|you|it)\b/i, 'Use "listen to".', '$1 to $2'],
      [/\b(explain(?:ed)?)\s+(me|him|her|us|them)\b/i, 'Use "explain to".', '$1 to $2'],
      [/\b(return(?:ed)?)\s+back\b/i, '"Back" isn\'t needed after "return".', '$1'],
      [/\b(depends?|depended)\s+of\b/i, 'Use "depend on".', '$1 on'],
      [/\b(interested)\s+(?:for|about)\b/i, 'Use "interested in".', '$1 in'],
      [/\b(I)\s+am\s+agree\b/i, 'Use "I agree" (no "am").', 'I agree'],
      [/\b(each)\s+others\b/i, 'Use "each other".', '$1 other'],
      [/\b(an)\s+other\b/i, 'Write "another" as one word.', '$1other'],
      [/\b(wait|for)\s+long\s+time\b/i, 'Add "a": "a long time".', '$1 a long time'],
      [/\b(send|give|get|buy|need|want)\s+new\s+one\b/i, 'Add "a": "a new one".', '$1 a new one'],
      [/\b(in)\s+hurry\b/i, 'Add "a": "in a hurry".', '$1 a hurry'],
    ];
    return phrases.flatMap(([pattern, message, replacement]) =>
      eachMatch(text, pattern, (m) => issue(m, 'grammar', message, m[0].replace(new RegExp(pattern.source, 'i'), replacement))),
    );
  },

  // Double negatives: "don't have no money", "didn't do nothing". ("can't say no" is fine.)
  (text) =>
    eachMatch(
      text,
      /\b(don't|doesn't|didn't|can't|won't|isn't|wasn't|dont|didnt|cant)\s+(?:(have|has|had|get|got|need|want|know|see|find|hear|do|tell|give|buy|eat)\s+)?(nothing|nobody|no)\b(?!\s+one\b)/i,
      (m) => {
        const swap: Record<string, string> = { nothing: 'anything', nobody: 'anybody', no: 'any' };
        const middle = m[2] ? `${m[2]} ` : '';
        return issue(m, 'grammar', `Two negatives cancel out. Use "${swap[m[3].toLowerCase()]}".`, `${withApostrophe(m[1])} ${middle}${swap[m[3].toLowerCase()]}`);
      },
    ),

  // Days, most months, languages and Canadian place names take capitals.
  (text) =>
    eachMatch(text, new RegExp(`\\b(${ALWAYS_CAPITAL.join('|')})\\b`), (m) =>
      issue(m, 'capitals', `"${capitalize(m[1])}" always starts with a capital letter.`, capitalize(m[1])),
    ),

  // "march 3", "may 12": these months are also ordinary words, so only flag them before a date.
  (text) =>
    eachMatch(text, /\b(march|may)\s+(\d{1,2}(?:st|nd|rd|th)?)\b/, (m) =>
      issue(m, 'capitals', 'Months start with a capital letter.', `${capitalize(m[1])} ${m[2]}`),
    ),
];
