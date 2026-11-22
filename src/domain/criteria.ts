import type { SkillId } from './skills';

/** CELPIP's four official rating dimensions per skill. */
export interface Criterion {
  id: string;
  name: string;
  /** Official factors raters consider (CELPIP Performance Standards). */
  factors: string[];
}

const contentCoherence: Criterion = {
  id: 'content',
  name: 'Content and coherence',
  factors: ['Number of ideas', 'Quality of ideas', 'Organization of ideas', 'Examples and supporting details'],
};

const vocabulary: Criterion = {
  id: 'vocabulary',
  name: 'Vocabulary',
  factors: ['Word choice', 'Suitable use of words and phrases', 'Range of words and phrases', 'Precision and accuracy'],
};

const taskFulfillment: Criterion = {
  id: 'task',
  name: 'Task fulfillment',
  factors: ['Relevance', 'Completeness', 'Tone', 'Length'],
};

const CRITERIA: Partial<Record<SkillId, Criterion[]>> = {
  speaking: [
    contentCoherence,
    vocabulary,
    {
      id: 'listenability',
      name: 'Listenability',
      factors: ['Rhythm, pronunciation and intonation', 'Pauses, interjections and self-correction', 'Grammar and sentence structure', 'Variety of sentence structure'],
    },
    taskFulfillment,
  ],
  writing: [
    contentCoherence,
    vocabulary,
    {
      id: 'readability',
      name: 'Readability',
      factors: ['Format and paragraphing', 'Connectors and transitions', 'Grammar and sentence structure', 'Variety of sentence structure'],
    },
    taskFulfillment,
  ],
};

export function getCriteria(skill: SkillId): Criterion[] {
  return CRITERIA[skill] ?? [];
}
