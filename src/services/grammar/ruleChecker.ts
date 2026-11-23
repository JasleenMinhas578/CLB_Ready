import type { GrammarChecker, GrammarIssue } from '@/domain/grammar';

/**
 * A small, fast, rule-based checker for the mistakes learners make most.
 * It runs instantly with no download. It catches fewer errors than a full
 * engine, but every rule here is precise, so it rarely flags correct text.
 * Every issue covers whole words, so corrections read naturally.
 */

const MISSPELLINGS: Record<string, string> = {
  recieve: 'receive', recieved: 'received', definately: 'definitely', seperate: 'separate', alot: 'a lot',
  untill: 'until', wich: 'which', becuase: 'because', beacuse: 'because', tommorow: 'tomorrow', tommorrow: 'tomorrow',
  occured: 'occurred', accomodation: 'accommodation', adress: 'address', beleive: 'believe', goverment: 'government',
  enviroment: 'environment', wether: 'whether', truely: 'truly', sincerly: 'sincerely', writting: 'writing',
  neccessary: 'necessary', necesary: 'necessary', begining: 'beginning', comming: 'coming', freind: 'friend',
  realy: 'really', finaly: 'finally', thier: 'their', wierd: 'weird', arguement: 'argument', apparantly: 'apparently',
  calender: 'calendar', collegue: 'colleague', commitee: 'committee', concious: 'conscious', embarass: 'embarrass',
  existance: 'existence', foriegn: 'foreign', grammer: 'grammar', occassion: 'occasion', persue: 'pursue',
  publically: 'publicly', recomend: 'recommend', reccomend: 'recommend', refered: 'referred', resturant: 'restaurant',
  succesful: 'successful', suprise: 'surprise', dissapointing: 'disappointing', dissapointed: 'disappointed',
  dissappointed: 'disappointed', dissappointing: 'disappointing', disapointed: 'disappointed', disapointing: 'disappointing',
  thankyou: 'thank you', unfortunatly: 'unfortunately', everytime: 'every time', alright: 'all right',
};

/** Regular -ed endings on irregular verbs, a very common learner mistake. */
const IRREGULAR_PAST: Record<string, string> = {
  buyed: 'bought', payed: 'paid', thinked: 'thought', teached: 'taught', catched: 'caught', bringed: 'brought',
  goed: 'went', comed: 'came', maked: 'made', writed: 'wrote', telled: 'told', runned: 'ran', speaked: 'spoke',
  breaked: 'broke', choosed: 'chose', drived: 'drove', eated: 'ate', feeled: 'felt', finded: 'found', gived: 'gave',
  knowed: 'knew', leaved: 'left', losed: 'lost', meeted: 'met', sayed: 'said', seed: 'saw', selled: 'sold',
  sended: 'sent', spended: 'spent', taked: 'took', understanded: 'understood', winned: 'won', getted: 'got',
};

/** Contractions typed without the apostrophe. */
const MISSING_APOSTROPHE: Record<string, string> = {
  dont: "don't", cant: "can't", didnt: "didn't", doesnt: "doesn't", isnt: "isn't", wasnt: "wasn't", arent: "aren't",
  werent: "weren't", havent: "haven't", hasnt: "hasn't", couldnt: "couldn't", wouldnt: "wouldn't", shouldnt: "shouldn't",
  im: "I'm", ive: "I've", youre: "you're", theyre: "they're", thats: "that's", theres: "there's", whats: "what's",
};

/** Words wrongly split in two. */
const SPLIT_WORDS: Record<string, string> = {
  'every where': 'everywhere', 'any where': 'anywhere', 'some where': 'somewhere', 'no where': 'nowhere',
  'every thing': 'everything', 'any thing': 'anything', 'some thing': 'something', 'every body': 'everybody',
  'some body': 'somebody', 'any body': 'anybody', 'every day': '', 'with out': 'without', 'my self': 'myself',
  'your self': 'yourself', 'him self': 'himself', 'her self': 'herself', 'to day': 'today', 'to morrow': 'tomorrow',
};

/** Words that start with a vowel letter but a consonant sound, and the reverse. */
const A_EXCEPTIONS = /^(uni|use|usu|usa|euro|eu|one|once|ufo|uk|us\b)/;
const AN_EXCEPTIONS = /^(hour|honest|honou?r|heir|herb)/;

type Rule = (text: string) => GrammarIssue[];

function eachMatch(text: string, pattern: RegExp, build: (match: RegExpExecArray) => GrammarIssue | null): GrammarIssue[] {
  const issues: GrammarIssue[] = [];
  const regex = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
  for (let match = regex.exec(text); match; match = regex.exec(text)) {
    const issue = build(match);
    if (issue) issues.push(issue);
    if (match[0].length === 0) regex.lastIndex += 1;
  }
  return issues;
}

/** Keeps the writer's capitalization: "Dont" → "Don't", "dont" → "don't". */
function matchCase(original: string, fix: string): string {
  return /^[A-Z]/.test(original) ? fix.charAt(0).toUpperCase() + fix.slice(1) : fix;
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const RULES: Rule[] = [
  // Spelling: common misspellings, irregular past tenses, missing apostrophes.
  (text) =>
    eachMatch(text, /\b[A-Za-z]+\b/, (m) => {
      const word = m[0];
      const lower = word.toLowerCase();
      const at = { start: m.index, end: m.index + word.length };
      if (MISSPELLINGS[lower]) return { ...at, kind: 'spelling', message: `Spelling: "${MISSPELLINGS[lower]}"`, suggestion: matchCase(word, MISSPELLINGS[lower]) };
      if (IRREGULAR_PAST[lower]) {
        return { ...at, kind: 'grammar', message: `"${lower}" is irregular: the past tense is "${IRREGULAR_PAST[lower]}".`, suggestion: matchCase(word, IRREGULAR_PAST[lower]) };
      }
      // "I'm" stays capital whatever case was typed.
      if (MISSING_APOSTROPHE[lower]) {
        const fix = lower === 'im' || lower === 'ive' ? MISSING_APOSTROPHE[lower] : matchCase(word, MISSING_APOSTROPHE[lower]);
        return { ...at, kind: 'punctuation', message: `Add the apostrophe: "${fix}".`, suggestion: fix };
      }
      return null;
    }),

  // Words wrongly split in two: "every where" → "everywhere".
  (text) =>
    eachMatch(text, new RegExp(`\\b(${Object.keys(SPLIT_WORDS).filter((k) => SPLIT_WORDS[k]).join('|')})\\b`, 'i'), (m) => {
      const fix = SPLIT_WORDS[m[0].toLowerCase()];
      return { start: m.index, end: m.index + m[0].length, kind: 'spelling', message: `Write "${fix}" as one word.`, suggestion: matchCase(m[0], fix) };
    }),

  // "i" on its own (or in "i'm", "i've") should be capital.
  (text) =>
    eachMatch(text, /(^|[^\w'’])(i(?:['’](?:m|ve|ll|d))?)(?=[\s,.!?;:)]|$)/, (m) => {
      const start = m.index + m[1].length;
      return { start, end: start + m[2].length, kind: 'capitals', message: 'Write "I" as a capital letter.', suggestion: capitalize(m[2]) };
    }),

  // First word of the text or of a paragraph starts with a lowercase letter.
  (text) =>
    eachMatch(text, /(^|\n\s*)([a-z][\w'’]*)/, (m) => {
      const start = m.index + m[1].length;
      return { start, end: start + m[2].length, kind: 'capitals', message: 'Start with a capital letter.', suggestion: capitalize(m[2]) };
    }),

  // Sentence starts with a lowercase letter.
  (text) =>
    eachMatch(text, /([.!?]\s+)([a-z][\w'’]*)/, (m) => {
      const start = m.index + m[1].length;
      return { start, end: start + m[2].length, kind: 'capitals', message: 'Start the sentence with a capital letter.', suggestion: capitalize(m[2]) };
    }),

  // Repeated word: "the the".
  (text) =>
    eachMatch(text, /\b(\w+)\s+\1\b/i, (m) =>
      m[1].toLowerCase() === 'that' || m[1].toLowerCase() === 'had'
        ? null
        : { start: m.index, end: m.index + m[0].length, kind: 'grammar', message: `"${m[1]}" is repeated.`, suggestion: m[1] },
    ),

  // a / an, marked together with the next word: "a apple" → "an apple".
  (text) =>
    eachMatch(text, /\b(a|an)\s+([A-Za-z]+)/i, (m) => {
      const article = m[1].toLowerCase();
      const next = m[2].toLowerCase();
      const vowelSound = /^[aeiou]/.test(next) ? !A_EXCEPTIONS.test(next) : AN_EXCEPTIONS.test(next);
      const at = { start: m.index, end: m.index + m[0].length, kind: 'grammar' as const };
      if (article === 'a' && vowelSound) return { ...at, message: `Use "an" before "${m[2]}".`, suggestion: `${m[1] === 'A' ? 'An' : 'an'} ${m[2]}` };
      if (article === 'an' && !vowelSound) return { ...at, message: `Use "a" before "${m[2]}".`, suggestion: `${m[1] === 'An' ? 'A' : 'a'} ${m[2]}` };
      return null;
    }),

  // "can not" → "cannot" (but "can not only" is fine).
  (text) =>
    eachMatch(text, /\b(can) not\b(?! only)/i, (m) => ({
      start: m.index, end: m.index + m[0].length, kind: 'spelling',
      message: 'Write "cannot" as one word.', suggestion: m[1] === 'Can' ? 'Cannot' : 'cannot',
    })),

  // "could of" → "could have".
  (text) =>
    eachMatch(text, /\b(could|would|should|must|might)\s+of\b/i, (m) => ({
      start: m.index, end: m.index + m[0].length, kind: 'grammar',
      message: `Write "${m[1]} have", not "${m[1]} of".`, suggestion: `${m[1]} have`,
    })),

  // Missing space after punctuation: "word,word" or "end.Start", marked as the joined words.
  (text) =>
    eachMatch(text, /\b([A-Za-z]+)([,;:]|[.!?](?=[A-Z]))([A-Za-z]+)\b/, (m) => ({
      start: m.index, end: m.index + m[0].length, kind: 'spacing',
      message: `Add a space after "${m[2]}".`, suggestion: `${m[1]}${m[2]} ${m[3]}`,
    })),

  // Space before punctuation: "word ,", marked with the word before it.
  (text) =>
    eachMatch(text, /\b(\w+)( +)([,.!?;:])/, (m) => ({
      start: m.index, end: m.index + m[0].length, kind: 'spacing',
      message: `Remove the space before "${m[3]}".`, suggestion: `${m[1]}${m[3]}`,
    })),

  // Last sentence has no end punctuation: insert a full stop.
  (text) => {
    const trimmed = text.replace(/\s+$/, '');
    const lastLine = trimmed.split('\n').pop() ?? '';
    // Sign-off lines like "Sincerely" or a name are fine without a full stop.
    if (!trimmed || /[.!?"”)]$/.test(trimmed) || lastLine.split(/\s+/).length <= 3) return [];
    return [{ start: trimmed.length, end: trimmed.length, kind: 'punctuation', message: 'End the sentence with a full stop.', suggestion: '.' }];
  },
];

export function checkGrammar(text: string): GrammarIssue[] {
  const all = RULES.flatMap((rule) => rule(text)).sort((a, b) => a.start - b.start || b.end - a.end);
  // Drop overlaps so each piece of text has at most one mark.
  const kept: GrammarIssue[] = [];
  for (const issue of all) {
    const last = kept[kept.length - 1];
    if (!last || issue.start >= last.end || (issue.start === issue.end && issue.start === last.end)) kept.push(issue);
  }
  return kept;
}

export const ruleChecker: GrammarChecker = {
  check: async (text) => checkGrammar(text),
};
