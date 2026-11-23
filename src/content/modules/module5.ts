import type { PracticeModule } from '../types';

/**
 * Module 5. Writing prompts only for now (draft, original, CELPIP style).
 * Speaking prompts are added later; until then the speaking tab shows 'soon'.
 */
export const module5: PracticeModule = {
  id: 'module-5',
  number: 5,
  title: 'Module 5',
  status: 'coming-soon',
  prompts: [
    {
      id: 'm5-writing-1', taskTypeId: 'writing-1', draft: true, tone: 'informal',
      text: 'Your cousin is visiting your city for the first time next month and has asked for your help planning the trip. Write an email to your cousin. In your email, do the following:',
      points: ['Suggest two places to visit and say why', 'Recommend where to stay', 'Suggest a time when you can meet'],
      checklist: ['Suggests two places with reasons', 'Recommends where to stay', 'Suggests a time to meet', 'Uses a warm, informal tone'],
    },
    {
      id: 'm5-writing-2', taskTypeId: 'writing-2', draft: true,
      text: 'Your public library can spend its extra budget on only one improvement this year. Choose the option you prefer, then explain the reasons for your choice.',
      options: ['Longer opening hours on weekends', 'More e-books and free online courses'],
      points: ['Choose Option A or Option B', 'Explain the reasons for your choice', 'Write 150 to 200 words'],
      checklist: ['Clearly picks one option', 'Gives at least two reasons', 'Supports reasons with details or examples'],
    },
  ],
};
