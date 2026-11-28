/**
 * The four CELPIP skills. Adding a skill = adding one entry here
 * (and, when it becomes available, its task types in tasks/catalog.ts).
 */
export type SkillId = 'speaking' | 'writing' | 'reading' | 'listening';

export type Availability = 'available' | 'coming-soon';

/** Candy "flavours" map to colour tokens in styles/tokens.css. */
export type Flavour = 'bubblegum' | 'lemon' | 'blueberry' | 'grape';

export interface Skill {
  id: SkillId;
  name: string;
  flavour: Flavour;
  status: Availability;
  /** One plain sentence shown on the skill card. */
  blurb: string;
}

export const SKILLS: readonly Skill[] = [
  {
    id: 'speaking',
    name: 'Speaking',
    flavour: 'bubblegum',
    status: 'available',
    blurb: 'Answer 8 timed tasks out loud and get feedback on what you said.',
  },
  {
    id: 'writing',
    name: 'Writing',
    flavour: 'lemon',
    status: 'available',
    blurb: 'Write an email and a survey response, then see how to reach your goal.',
  },
  {
    id: 'reading',
    name: 'Reading',
    flavour: 'blueberry',
    status: 'available',
    blurb: 'Read messages, charts and articles, then answer 38 questions in 4 parts.',
  },
  {
    id: 'listening',
    name: 'Listening',
    flavour: 'grape',
    status: 'available',
    blurb: 'Listen to conversations, news and talks, each played once, then answer 38 questions.',
  },
];

export function getSkill(id: string): Skill | undefined {
  return SKILLS.find((skill) => skill.id === id);
}
