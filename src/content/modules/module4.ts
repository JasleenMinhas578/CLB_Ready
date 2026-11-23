import type { PracticeModule } from '../types';

/**
 * Module 4. Writing prompts only for now (draft, original, CELPIP style).
 * Speaking prompts are added later; until then the speaking tab shows 'soon'.
 */
export const module4: PracticeModule = {
  id: 'module-4',
  number: 4,
  title: 'Module 4',
  status: 'coming-soon',
  prompts: [
    {
      id: 'm4-writing-1', taskTypeId: 'writing-1', draft: true, tone: 'semi-formal',
      text: 'You have signed up for an evening course that starts next month, but it begins before your work shift ends. Write an email to your manager. In your email, do the following:',
      points: ['Explain what the course is and why you are taking it', 'Describe the change to your schedule that you need', 'Suggest how your work will still get done'],
      checklist: ['Explains the course and the reason for it', 'Describes the schedule change clearly', 'Suggests how the work will be covered', 'Uses a polite, professional tone'],
    },
    {
      id: 'm4-writing-2', taskTypeId: 'writing-2', draft: true,
      text: 'Your community centre has money for one new weekly program. Choose the option you prefer, then explain the reasons for your choice.',
      options: ['A weekly farmers’ market in the parking lot', 'Free English conversation classes for newcomers'],
      points: ['Choose Option A or Option B', 'Explain the reasons for your choice', 'Write 150 to 200 words'],
      checklist: ['Clearly picks one option', 'Gives at least two reasons', 'Supports reasons with details or examples'],
    },
  ],
};
