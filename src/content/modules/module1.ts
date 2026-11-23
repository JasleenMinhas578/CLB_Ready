import type { PracticeModule } from '../types';

/**
 * Module 1. Original draft prompts written in CELPIP style; not copied
 * from any test. Marked `draft` until the final prompt pass.
 * Images for tasks 3, 4, 5 and 8 are added in a later step.
 */
export const module1: PracticeModule = {
  id: 'module-1',
  number: 1,
  title: 'Module 1',
  status: 'available',
  prompts: [
    {
      id: 'm1-speaking-1', taskTypeId: 'speaking-1', draft: true,
      text: 'Your friend has just moved to a new city and feels lonely. They want to meet new people but are shy. Give your friend some advice.',
      checklist: ['Gives at least two pieces of advice', 'Gives a reason for each', 'Uses a friendly, supportive tone'],
    },
    {
      id: 'm1-speaking-2', taskTypeId: 'speaking-2', draft: true,
      text: 'Talk about a time when you had to learn something new very quickly. What happened, and how did you feel?',
      checklist: ['Says when and where it happened', 'Describes what happened in order', 'Explains how they felt'],
    },
    {
      id: 'm1-speaking-3', taskTypeId: 'speaking-3', draft: true,
      text: 'Describe the scene in the picture to a friend who cannot see it. Include as many details as you can.',
      checklist: ['Describes the setting', 'Describes people and what they are doing', 'Mentions colours or positions'],
    },
    {
      id: 'm1-speaking-4', taskTypeId: 'speaking-4', draft: true,
      text: 'Look at the same picture. What do you think will probably happen next? Explain why.',
      checklist: ['Makes at least two predictions', 'Links predictions to details in the picture', 'Uses future forms'],
    },
    {
      id: 'm1-speaking-5', taskTypeId: 'speaking-5', draft: true,
      text: 'Your family wants to spend a summer weekend together. Choose one option and persuade your family member that it is the better choice.',
      options: ['A camping trip at a lake', 'A weekend in a city hotel'],
      checklist: ['Clearly picks one option', 'Compares both options', 'Gives persuasive reasons'],
    },
    {
      id: 'm1-speaking-6', taskTypeId: 'speaking-6', draft: true,
      text: 'You promised to help your neighbour move on Saturday, but your manager has just asked you to work that day. Choose one: call your neighbour or talk to your manager. Explain the situation politely.',
      checklist: ['Speaks to the chosen person directly', 'Explains the problem clearly', 'Offers a solution or alternative'],
    },
    {
      id: 'm1-speaking-7', taskTypeId: 'speaking-7', draft: true,
      text: 'Some people think all children should learn to cook at school. What is your opinion? Explain your reasons.',
      checklist: ['States a clear opinion', 'Gives at least two reasons', 'Supports reasons with examples'],
    },
    {
      id: 'm1-speaking-8', taskTypeId: 'speaking-8', draft: true,
      text: 'You see something unusual for sale and call a friend who might want it. Describe it so your friend can decide whether to buy it.',
      checklist: ['Describes the object clearly', 'Explains what is unusual about it', 'Asks or suggests what the friend should do'],
    },
    {
      id: 'm1-writing-1', taskTypeId: 'writing-1', draft: true, tone: 'formal',
      text: 'You recently bought a coffee machine online, but it arrived damaged. Write an email to the company. In your email, do the following:',
      points: ['Describe what you bought and when', 'Explain the problem', 'Say what you would like the company to do'],
      checklist: ['Describes the purchase and date', 'Explains the damage', 'Makes a clear request', 'Uses a polite, formal tone'],
    },
    {
      id: 'm1-writing-2', taskTypeId: 'writing-2', draft: true,
      text: 'Your city has money for one new project and is asking residents which they prefer. Choose the option you prefer, then explain the reasons for your choice.',
      points: ['Choose Option A or Option B', 'Explain the reasons for your choice', 'Write 150 to 200 words'],
      options: ['A new public swimming pool', 'More bike lanes across the city'],
      checklist: ['Clearly picks one option', 'Gives at least two reasons', 'Supports reasons with details'],
    },
  ],
};
