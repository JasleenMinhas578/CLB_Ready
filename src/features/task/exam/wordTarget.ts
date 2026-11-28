/** Shows the whole allowed range, plus how far off the answer is. */
export function targetText(words: number, { min, max }: { min: number; max: number }): string {
  const target = `Target: ${min}–${max} words`;
  if (words === 0) return target;
  if (words < min) return `${target}, ${min - words} more needed`;
  if (words > max) return `${target}, ${words - max} over`;
  return `${target}, on target`;
}
