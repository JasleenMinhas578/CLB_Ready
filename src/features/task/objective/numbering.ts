import type { ChoiceQuestion, ReadingBlock } from '@/content/objective';
import { clozeIds } from '@/content/objective';

/**
 * Questions are numbered in the order the part lists them, which is the
 * order on test day (blanks first in some parts, last in others).
 * Returns the numbers and the questions that are not blanks in a passage.
 */
export function numberQuestions(blocks: ReadingBlock[], questions: ChoiceQuestion[]) {
  const blankIds = new Set(blocks.flatMap((block) => (block.kind === 'cloze' ? clozeIds(block.body) : [])));
  const numbers = new Map(questions.map((question, index) => [question.id, index + 1]));
  return { numbers, listed: questions.filter((question) => !blankIds.has(question.id)) };
}
