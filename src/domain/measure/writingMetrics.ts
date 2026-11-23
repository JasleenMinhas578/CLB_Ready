import { LINKING_PHRASES, VAGUE_WORDS, countPhrases, longWordShare, repeatedContentWords, tokens, vocabularyVariety } from './text';

/** Everything countable about a written answer, measured in plain code. */
export interface WritingMetrics {
  wordCount: number;
  wordRange: { min: number; max: number };
  paragraphs: number;
  sentences: number;
  avgSentenceLength: number;
  /** Spread of sentence lengths in words; higher means more varied sentences. */
  sentenceVariety: number;
  variety: number;
  /** Share of words with 7+ letters. */
  longWords: number;
  vagueWords: string[];
  repeatedWords: { word: string; count: number }[];
  linkingWords: string[];
  grammarIssues: number;
  email: EmailChecks | null;
  survey: SurveyChecks | null;
}

export type Tone = 'formal' | 'semi-formal' | 'informal';

export interface EmailChecks {
  expectedTone: Tone;
  hasGreeting: boolean;
  hasClosing: boolean;
  contractions: string[];
  informalWords: string[];
  /** True when contractions or slang clash with a formal email. */
  toneMismatch: boolean;
}

export interface SurveyChecks {
  /** Index of the option the writer clearly chose, or null. */
  chosen: 0 | 1 | null;
  mentionsBoth: boolean;
}

const GREETING = /^\s*(dear|hello|hi|hey|good (morning|afternoon|evening)|to whom it may concern|greetings)\b/i;
/** Checked against the last few lines only, where a sign-off belongs. */
const CLOSING = /\b(sincerely|regards|best wishes|best|yours truly|yours faithfully|yours|thank you|thanks|cheers|warm wishes|take care|respectfully|cordially)\b/i;
const CONTRACTION = /\b\w+(?:'|’)(?:t|s|re|ve|ll|d|m)\b/gi;
const INFORMAL = new Set(['gonna', 'wanna', 'gotta', 'kinda', 'sorta', 'yeah', 'yep', 'nope', 'hey', 'lol', 'btw', 'stuff', 'guys', 'cool', 'awesome', 'ok', 'okay']);
/** Contractions typed without the apostrophe, common in quick, casual writing. */
const BARE_CONTRACTIONS = new Set(['dont', 'cant', 'wont', 'im', 'ive', 'didnt', 'doesnt', 'isnt', 'wasnt', 'couldnt', 'wouldnt', 'shouldnt', 'thats', 'theres', 'youre', 'theyre', 'havent', 'arent']);
/** A greeting that's fine for friends but too casual for a formal email. */
const CASUAL_GREETING = /^\s*(hi|hey|hello|yo)\b/i;
const CHOICE_PHRASES = /\b(i (would )?(prefer|choose|pick|support|vote for|recommend|favou?r|think .{0,30} better)|my (choice|preference|vote) (is|would be)|i am in favou?r of|the better option is)\b/i;

function sentencesOf(text: string): string[] {
  return text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => tokens(sentence).length > 0);
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length);
}

/** Content words from an option, e.g. "A new public swimming pool" → ["public", "swimming", "pool"]. */
function keyWords(option: string): string[] {
  return tokens(option).filter((word) => word.length > 3 && !['more', 'across', 'with', 'that', 'this', 'city'].includes(word));
}

function checkSurvey(text: string, options: [string, string]): SurveyChecks {
  const lower = text.toLowerCase();
  const hits = options.map((option) => keyWords(option).filter((word) => lower.includes(word)).length);
  const mentionsBoth = hits[0] > 0 && hits[1] > 0;
  // Look for the option named near a choice phrase, else the one mentioned clearly more.
  const choiceSentence = sentencesOf(text).find((sentence) => CHOICE_PHRASES.test(sentence));
  let chosen: 0 | 1 | null = null;
  if (choiceSentence) {
    const s = choiceSentence.toLowerCase();
    const inChoice = options.map((option) => keyWords(option).filter((word) => s.includes(word)).length);
    if (inChoice[0] > inChoice[1]) chosen = 0;
    else if (inChoice[1] > inChoice[0]) chosen = 1;
  }
  if (chosen === null && Math.max(...hits) >= 2 && hits[0] !== hits[1]) chosen = hits[0] > hits[1] ? 0 : 1;
  return { chosen, mentionsBoth };
}

function checkEmail(text: string, expectedTone: Tone, words: string[]): EmailChecks {
  const contractions = [
    ...new Set([...(text.match(CONTRACTION) ?? []).map((word) => word.toLowerCase()), ...words.filter((word) => BARE_CONTRACTIONS.has(word))]),
  ];
  const informalWords = [...new Set(words.filter((word) => INFORMAL.has(word)))];
  if (expectedTone === 'formal' && CASUAL_GREETING.test(text)) informalWords.unshift(text.trim().split(/[\s,]/)[0].toLowerCase());
  const toneMismatch = expectedTone === 'formal' && (contractions.length >= 3 || informalWords.length >= 1);
  return {
    expectedTone,
    hasGreeting: GREETING.test(text),
    hasClosing: CLOSING.test(text.trim().slice(-90)),
    contractions,
    informalWords,
    toneMismatch,
  };
}

export function measureWriting(input: {
  text: string;
  wordRange: { min: number; max: number };
  grammarIssues: number;
  /** Set for email tasks. */
  emailTone?: Tone;
  /** Set for survey tasks. */
  options?: [string, string];
}): WritingMetrics {
  const words = tokens(input.text);
  const sentenceLengths = sentencesOf(input.text).map((sentence) => tokens(sentence).length);
  const paragraphs = input.text.split(/\n\s*\n|\n(?=\s*\S)/).filter((block) => tokens(block).length >= 4).length;

  return {
    wordCount: words.length,
    wordRange: input.wordRange,
    paragraphs,
    sentences: sentenceLengths.length,
    avgSentenceLength: sentenceLengths.length ? words.length / sentenceLengths.length : 0,
    sentenceVariety: stdDev(sentenceLengths),
    variety: vocabularyVariety(words),
    longWords: longWordShare(words),
    vagueWords: [...new Set(words.filter((word) => VAGUE_WORDS.has(word)))],
    repeatedWords: repeatedContentWords(words),
    linkingWords: [...countPhrases(words.join(' '), LINKING_PHRASES).keys()],
    grammarIssues: input.grammarIssues,
    email: input.emailTone ? checkEmail(input.text, input.emailTone, words) : null,
    survey: input.options ? checkSurvey(input.text, input.options) : null,
  };
}
