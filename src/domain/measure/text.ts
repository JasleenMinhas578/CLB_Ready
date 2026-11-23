/** Text helpers shared by the speaking and writing measurements. */

export function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^\p{L}\p{N}']/gu, '').replace(/^'+|'+$/g, '');
}

export function tokens(text: string): string[] {
  return text.split(/\s+/).map(normalizeWord).filter(Boolean);
}

const VARIETY_WINDOW = 40;

/** Moving-average type-token ratio: fair across short and long answers. */
export function vocabularyVariety(words: string[]): number {
  if (words.length === 0) return 0;
  if (words.length <= VARIETY_WINDOW) return new Set(words).size / words.length;
  let total = 0;
  const windows = words.length - VARIETY_WINDOW + 1;
  for (let i = 0; i < windows; i += 1) total += new Set(words.slice(i, i + VARIETY_WINDOW)).size / VARIETY_WINDOW;
  return total / windows;
}

/** General words that a higher-level answer would replace with precise ones. */
export const VAGUE_WORDS = new Set(['good', 'nice', 'bad', 'thing', 'things', 'stuff', 'okay', 'ok', 'very', 'really', 'great', 'lot']);

/** Words and phrases that organize an answer. Matched as whole words. */
export const LINKING_PHRASES = [
  'first', 'firstly', 'second', 'secondly', 'finally', 'also', 'however', 'because', 'so', 'although',
  'for example', 'for instance', 'in addition', 'moreover', 'besides', 'therefore', 'as a result',
  'on the other hand', 'in my opinion', 'overall', 'in conclusion', 'another', 'then', 'after that',
  'furthermore', 'consequently', 'in fact', 'while', 'whereas', 'since',
  'unfortunately', 'instead', 'rather than', 'alternatively', 'otherwise', 'in that case', 'meanwhile',
  'for this reason', 'as well as', 'not only', 'even though', 'as long as', 'on top of that', 'to sum up',
];

/** Very common words, ignored when looking for over-repeated words. */
export const STOP_WORDS = new Set(
  ('a an the and or but if so to of in on at for with by from up about into over after is are was were be been ' +
    'am i you he she it we they me him her us them my your his its our their this that these those there here ' +
    'do does did have has had can could will would should may might must not no yes as than then just also ' +
    'what which who when where why how all any some more most other such only own same too very really')
    .split(' '),
);

/** Counts whole-word occurrences of each phrase in space-joined, normalized words. */
export function countPhrases(joined: string, phrases: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const phrase of phrases) {
    const matches = joined.match(new RegExp(`(^| )${phrase}( |$)`, 'g'));
    if (matches) counts.set(phrase, matches.length);
  }
  return counts;
}

/** Content words used 3 or more times, most repeated first. */
export function repeatedContentWords(words: string[], ignore: Set<string> = new Set()): { word: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const word of words) {
    if (!STOP_WORDS.has(word) && !ignore.has(word) && word.length > 2) counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts]
    .filter(([, count]) => count >= 3)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

/** Share of words with 7 or more letters: a simple sign of precise, less basic vocabulary. */
export function longWordShare(words: string[]): number {
  if (words.length === 0) return 0;
  return words.filter((word) => word.replace(/[^\p{L}]/gu, '').length >= 7).length / words.length;
}
