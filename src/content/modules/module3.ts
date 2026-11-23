import type { PracticeModule } from '../types';

/**
 * Module 3. Writing prompts only for now (draft, original, CELPIP style).
 * Speaking prompts are added later; until then the speaking tab shows 'soon'.
 */
export const module3: PracticeModule = {
  id: 'module-3',
  number: 3,
  title: 'Module 3',
  status: 'coming-soon',
  prompts: [
    {
      id: 'm3-writing-1', taskTypeId: 'writing-1', draft: true, tone: 'formal',
      text: 'A streetlight on your street has not worked for three weeks, and the street is very dark at night. Write an email to your city council. In your email, do the following:',
      points: ['Describe the problem and where it is', 'Explain how it affects people who live there', 'Say what you would like the city to do'],
      checklist: ['Describes the problem and the location', 'Explains how it affects residents', 'Makes a clear request', 'Uses a polite, formal tone'],
    },
    {
      id: 'm3-writing-2', taskTypeId: 'writing-2', draft: true,
      text: 'Your local school board is deciding how to help high school students do better in class. Choose the option you prefer, then explain the reasons for your choice.',
      options: ['Start the school day one hour later', 'Keep the same start time and add a free after-school homework club'],
      points: ['Choose Option A or Option B', 'Explain the reasons for your choice', 'Write 150 to 200 words'],
      checklist: ['Clearly picks one option', 'Gives at least two reasons', 'Supports reasons with details or examples'],
    },
  ],
};
