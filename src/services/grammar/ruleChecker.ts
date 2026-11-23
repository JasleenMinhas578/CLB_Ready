import type { GrammarChecker, GrammarIssue } from '@/domain/grammar';

/**
 * A small, fast, rule-based checker for the mistakes learners make most.
 * It runs instantly with no download. It catches fewer errors than a full
 * engine, but every rule here is precise, so it rarely flags correct text.
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
  dissappointed: 'disappointed', dissappointing: 'disappointing', disapointed: 'disappointed', disapointing: 'disappointing', thankyou: 'thank you', unfortunatly: 'unfortunately',
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

const RULES: Rule[] = [
  // Spelling: common misspellings.
  (text) =>
    eachMatch(text, /\b[A-Za-z]+\b/, (m) => {
      const fix = MISSPELLINGS[m[0].toLowerCase()];
      return fix ? { start: m.index, end: m.index + m[0].length, kind: 'spelling', message: `Spelling: "${fix}"`, suggestion: fix } : null;
    }),

  // "i" on its own should be "I".
  (text) =>
    eachMatch(text, /(^|[^\w'’])(i)(?=[\s'’,.!?;:]|$)/, (m) => {
      const start = m.index + m[1].length;
      return { start, end: start + 1, kind: 'grammar', message: 'Write "I" as a capital letter.', suggestion: 'I' };
    }),

  // Repeated word: "the the".
  (text) =>
    eachMatch(text, /\b(\w+)\s+\1\b/i, (m) =>
      m[1].toLowerCase() === 'that' || m[1].toLowerCase() === 'had'
        ? null
        : { start: m.index, end: m.index + m[0].length, kind: 'grammar', message: `"${m[1]}" is repeated.`, suggestion: m[1] },
    ),

  // a / an.
  (text) =>
    eachMatch(text, /\b(a|an)\s+([A-Za-z]+)/i, (m) => {
      const article = m[1].toLowerCase();
      const next = m[2].toLowerCase();
      const vowelSound = /^[aeiou]/.test(next) ? !A_EXCEPTIONS.test(next) : AN_EXCEPTIONS.test(next);
      if (article === 'a' && vowelSound) return { start: m.index, end: m.index + 1, kind: 'grammar', message: `Use "an" before "${m[2]}".`, suggestion: m[1] === 'A' ? 'An' : 'an' };
      if (article === 'an' && !vowelSound) return { start: m.index, end: m.index + 2, kind: 'grammar', message: `Use "a" before "${m[2]}".`, suggestion: m[1] === 'An' ? 'A' : 'a' };
      return null;
    }),

  // "could of" → "could have".
  (text) =>
    eachMatch(text, /\b(could|would|should|must|might)\s+of\b/i, (m) => ({
      start: m.index, end: m.index + m[0].length, kind: 'grammar',
      message: `Write "${m[1]} have", not "${m[1]} of".`, suggestion: `${m[1]} have`,
    })),

  // Sentence starts with a lowercase letter.
  (text) =>
    eachMatch(text, /([.!?]\s+)([a-z])/, (m) => {
      const start = m.index + m[1].length;
      return { start, end: start + 1, kind: 'punctuation', message: 'Start the sentence with a capital letter.', suggestion: m[2].toUpperCase() };
    }),

  // Missing space after punctuation: "word,word" or "end.Start".
  (text) =>
    eachMatch(text, /([a-z])([,;:]|[.!?](?=[A-Z]))([A-Za-z])/, (m) => {
      const start = m.index + 1;
      return { start, end: start + 1, kind: 'punctuation', message: `Add a space after "${m[2]}".`, suggestion: `${m[2]} ` };
    }),

  // Space before punctuation: "word ,".
  (text) =>
    eachMatch(text, /(\w)( +)([,.!?;:])/, (m) => {
      const start = m.index + 1;
      return { start, end: start + m[2].length + 1, kind: 'punctuation', message: `Remove the space before "${m[3]}".`, suggestion: m[3] };
    }),

  // Last sentence has no end punctuation.
  (text) => {
    const trimmed = text.replace(/\s+$/, '');
    const lastLine = trimmed.split('\n').pop() ?? '';
    // Sign-off lines like "Sincerely" or a name are fine without a full stop.
    if (!trimmed || /[.!?"”)]$/.test(trimmed) || lastLine.split(/\s+/).length <= 3) return [];
    return [{ start: trimmed.length - 1, end: trimmed.length, kind: 'punctuation', message: 'End the sentence with a full stop.', suggestion: '.' }];
  },
];

export function checkGrammar(text: string): GrammarIssue[] {
  const all = RULES.flatMap((rule) => rule(text)).sort((a, b) => a.start - b.start || b.end - a.end);
  // Drop overlaps so each piece of text has at most one mark.
  const kept: GrammarIssue[] = [];
  for (const issue of all) {
    if (kept.length === 0 || issue.start >= kept[kept.length - 1].end) kept.push(issue);
  }
  return kept;
}

export const ruleChecker: GrammarChecker = {
  check: async (text) => checkGrammar(text),
};
