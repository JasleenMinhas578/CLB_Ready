import {
  LINKING_PHRASES,
  VAGUE_WORDS,
  countPhrases,
  normalizeWord,
  repeatedContentWords,
  tokens,
  vocabularyVariety,
} from './text';

// Re-exported so existing imports keep working.
export { normalizeWord, vocabularyVariety };

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
  /** Share of the answer time the learner spent speaking, up to their last word, 0 to 1. */
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

/** Single-word fillers. Whisper often drops these, so counts are a minimum. */
const FILLER_WORDS = new Set(['um', 'uh', 'er', 'erm', 'ah', 'hmm', 'mm', 'uhm']);
const FILLER_PHRASES = ['you know', 'i mean'];

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

  const repeatedWords = repeatedContentWords(words, FILLER_WORDS);

  const spokenWords = words.filter((word) => !FILLER_WORDS.has(word));

  return {
    wordCount: spokenWords.length,
    speakingSeconds,
    answerSeconds: input.answerSeconds,
    // Up to the last word, so sitting silent until the timer ends doesn't count as using the time.
    // Without word timings, the recording length is the best guess.
    timeUsed: Math.min(1, (timed.length > 0 ? timed[timed.length - 1].end : input.recordedSeconds) / input.answerSeconds),
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
