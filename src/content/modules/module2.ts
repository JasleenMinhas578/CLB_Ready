import type { PracticeModule } from '../types';

/**
 * Module 2. Writing prompts only for now (draft, original, CELPIP style).
 * Speaking prompts are added later; until then the speaking tab shows 'soon'.
 */
export const module2: PracticeModule = {
  id: 'module-2',
  number: 2,
  title: 'Module 2',
  status: 'coming-soon',
  prompts: [
    {
      id: 'm2-writing-1', taskTypeId: 'writing-1', draft: true, tone: 'informal',
      text: 'Last month your friend Sam lent you a tent for a weekend camping trip. During a storm, the tent was damaged. Write an email to Sam. In your email, do the following:',
      points: ['Explain what happened to the tent', 'Say how you feel about it', 'Offer a way to make it right'],
      checklist: ['Explains what happened to the tent', 'Apologizes and says how they feel', 'Offers a clear way to make it right', 'Uses a friendly, informal tone'],
    },
    {
      id: 'm2-writing-2', taskTypeId: 'writing-2', draft: true,
      text: 'Your company wants to improve staff wellbeing and has asked employees to choose one new benefit. Choose the option you prefer, then explain the reasons for your choice.',
      options: ['A free gym membership for every employee', 'One extra paid day off each year'],
      points: ['Choose Option A or Option B', 'Explain the reasons for your choice', 'Write 150 to 200 words'],
      checklist: ['Clearly picks one option', 'Gives at least two reasons', 'Supports reasons with details or examples'],
    },
  ],
};
