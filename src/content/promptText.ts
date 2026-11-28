import type { PracticePrompt } from './types';

/**
 * The full task, as one plain string for the AI coach: instructions,
 * bullet points, options and the option the learner picked.
 */
export function promptForModel(prompt: PracticePrompt, selected: 0 | 1 | null = null): string {
  const parts = [prompt.text];
  // The model can't see the picture, so it needs the scene to judge whether an answer describes it.
  if (prompt.scene) parts.push(`The picture shows: ${prompt.scene.description}`);
  if (prompt.points?.length) parts.push(prompt.points.map((point) => `- ${point}`).join('\n'));
  if (prompt.options) parts.push(`Options: A) ${prompt.options[0]} B) ${prompt.options[1]}`);
  if (prompt.options && selected !== null) parts.push(`The learner selected option ${selected === 0 ? 'A' : 'B'}.`);
  return parts.join('\n');
}
