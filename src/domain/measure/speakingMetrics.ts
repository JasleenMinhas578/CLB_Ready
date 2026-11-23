/**
 * Everything about a spoken answer that can be counted, measured in plain
 * code. Counting is more reliable in code than in a small AI model, so the
 * model only does the judgment parts (see services/ai/feedbackPrompt.ts).
 */

export interface MetricWord {
  text: string;
  start: number;
  end: number;
}

export interface LongPause {
  /** Index of the word the pause comes after (-1 = before the first word). */
  afterWord: number;
  seconds: number;
}

export interface SpeakingMetrics {
  wordCount: number;
  /** First word to last word, so silence at the edges doesn't lower the pace. */
  speakingSeconds: number;
  answerSeconds: number;
  /** Share of the answer time the learner used, 0 to 1. */
  timeUsed: number;
  wordsPerMinute: number;
  longPauses: LongPause[];
  fillerCount: number;
  fillers: { word: string; count: number }[];
  /** Vocabulary variety, 0 to 1 (moving-average type-token ratio). */
  variety: number;
  repeatedWords: { word: string; count: number }[];
  vagueWords: string[];
  linkingWords: string[];
}

export const LONG_PAUSE_SECONDS = 2;
const VARIETY_WINDOW = 40;

/** Single-word fillers. Whisper often drops these, so counts are a minimum. */
const FILLER_WORDS = new Set(['um', 'uh', 'er', 'erm', 'ah', 'hmm', 'mm', 'uhm']);
const FILLER_PHRASES = ['you know', 'i mean'];

/** General words that a higher-level answer would replace with precise ones. */
const VAGUE_WORDS = new Set(['good', 'nice', 'bad', 'thing', 'things', 'stuff', 'okay', 'ok', 'very', 'really', 'great', 'lot']);

/** Words and phrases that organize an answer. Matched as whole words. */
export const LINKING_PHRASES = [
  'first', 'firstly', 'second', 'secondly', 'finally', 'also', 'however', 'because', 'so', 'although',
  'for example', 'for instance', 'in addition', 'moreover', 'besides', 'therefore', 'as a result',
  'on the other hand', 'in my opinion', 'overall', 'in conclusion', 'another', 'then', 'after that',
];

/** Very common words, ignored when looking for over-repeated words. */
const STOP_WORDS = new Set(
  ('a an the and or but if so to of in on at for with by from up about into over after is are was were be been ' +
    'am i you he she it we they me him her us them my your his its our their this that these those there here ' +
    'do does did have has had can could will would should may might must not no yes as than then just also ' +
    'what which who when where why how all any some more most other such only own same too very really')
    .split(' '),
);

export function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^\p{L}\p{N}']/gu, '').replace(/^'+|'+$/g, '');
}

function tokens(text: string): string[] {
  return text.split(/\s+/).map(normalizeWord).filter(Boolean);
}

/** Moving-average type-token ratio: fair across short and long answers. */
export function vocabularyVariety(words: string[]): number {
  if (words.length === 0) return 0;
  if (words.length <= VARIETY_WINDOW) return new Set(words).size / words.length;
  let total = 0;
  const windows = words.length - VARIETY_WINDOW + 1;
  for (let i = 0; i < windows; i += 1) total += new Set(words.slice(i, i + VARIETY_WINDOW)).size / VARIETY_WINDOW;
  return total / windows;
}

function countPhrases(joined: string, phrases: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const phrase of phrases) {
    const matches = joined.match(new RegExp(`(^| )${phrase}( |$)`, 'g'));
    if (matches) counts.set(phrase, matches.length);
  }
  return counts;
}

export function measureSpeaking(input: {
  text: string;
  words: MetricWord[];
  answerSeconds: number;
  recordedSeconds: number;
}): SpeakingMetrics {
  const timed = input.words.filter((word) => normalizeWord(word.text));
  const words = timed.length > 0 ? timed.map((word) => normalizeWord(word.text)) : tokens(input.text);
  const joined = words.join(' ');

  const speakingSeconds =
    timed.length > 1 ? Math.max(1, timed[timed.length - 1].end - timed[0].start) : Math.max(1, input.recordedSeconds);

  const longPauses: LongPause[] = [];
  if (timed.length > 0 && timed[0].start >= LONG_PAUSE_SECONDS) longPauses.push({ afterWord: -1, seconds: timed[0].start });
  for (let i = 1; i < timed.length; i += 1) {
    const gap = timed[i].start - timed[i - 1].end;
    if (gap >= LONG_PAUSE_SECONDS) longPauses.push({ afterWord: i - 1, seconds: gap });
  }

  const fillerCounts = new Map<string, number>();
  for (const word of words) if (FILLER_WORDS.has(word)) fillerCounts.set(word, (fillerCounts.get(word) ?? 0) + 1);
  for (const [phrase, count] of countPhrases(joined, FILLER_PHRASES)) fillerCounts.set(phrase, count);
  const fillers = [...fillerCounts].map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count);

  const contentCounts = new Map<string, number>();
  for (const word of words) {
    if (!STOP_WORDS.has(word) && !FILLER_WORDS.has(word) && word.length > 2) {
      contentCounts.set(word, (contentCounts.get(word) ?? 0) + 1);
    }
  }
  const repeatedWords = [...contentCounts]
    .filter(([, count]) => count >= 3)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const spokenWords = words.filter((word) => !FILLER_WORDS.has(word));

  return {
    wordCount: spokenWords.length,
    speakingSeconds,
    answerSeconds: input.answerSeconds,
    timeUsed: Math.min(1, input.recordedSeconds / input.answerSeconds),
    wordsPerMinute: Math.round((spokenWords.length / speakingSeconds) * 60),
    longPauses,
    fillerCount: fillers.reduce((sum, filler) => sum + filler.count, 0),
    fillers,
    variety: vocabularyVariety(spokenWords),
    repeatedWords,
    vagueWords: [...new Set(words.filter((word) => VAGUE_WORDS.has(word)))],
    linkingWords: [...countPhrases(joined, LINKING_PHRASES).keys()],
  };
}
