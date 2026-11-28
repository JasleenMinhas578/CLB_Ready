/**
 * The four CELPIP skills. Adding a skill = adding one entry here
 * and its task types in tasks/catalog.ts. Each skill's colours are the
 * --<id>-tint / --<id>-ink tokens.
 */
export type SkillId = 'speaking' | 'writing' | 'reading' | 'listening';

export interface Skill {
  id: SkillId;
  name: string;
  /** One plain sentence: what the learner does in this skill. */
  blurb: string;
}

export const SKILLS: readonly Skill[] = [
  {
    id: 'speaking',
    name: 'Speaking',
    blurb: 'Answer 8 timed tasks out loud and get feedback on what you said.',
  },
  {
    id: 'writing',
    name: 'Writing',
    blurb: 'Write an email and a survey response, then see how to reach your goal.',
  },
  {
    id: 'reading',
    name: 'Reading',
    blurb: 'Read messages, charts and articles, then answer 38 questions in 4 parts.',
  },
  {
    id: 'listening',
    name: 'Listening',
    blurb: 'Listen to conversations, news and talks, each played once, then answer 38 questions.',
  },
];

export function getSkill(id: string): Skill | undefined {
  return SKILLS.find((skill) => skill.id === id);
}
