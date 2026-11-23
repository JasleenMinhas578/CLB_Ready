import type { PracticeModule, SceneBrief } from '../types';
import { module1Reading } from './module1Reading';
import { module1Listening } from './module1Listening';

/** Tasks 3 and 4 share one picture. */
const MARKET: SceneBrief = {
  description:
    'A farmers’ market in a town square on a sunny Saturday morning. In the front, a woman in a yellow raincoat is choosing apples at a fruit stand while a small boy beside her drops a bag of oranges. A man with a guitar is playing music next to a fountain, and an open guitar case holds a few coins. On the right, a long line of people waits at a bakery stall with a “Fresh bread” sign. In the background, dark clouds are moving in over the church tower, and one vendor is starting to put up a large umbrella.',
  keyElements: ['market or town square', 'woman choosing apples', 'boy dropping oranges', 'man playing guitar', 'fountain', 'line at the bakery stall', 'dark clouds', 'vendor with umbrella'],
};

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
  reading: module1Reading,
  listening: module1Listening,
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
      scene: MARKET,
      checklist: ['Describes the setting', 'Describes people and what they are doing', 'Mentions colours or positions'],
    },
    {
      id: 'm1-speaking-4', taskTypeId: 'speaking-4', draft: true,
      text: 'Look at the same picture. What do you think will probably happen next? Explain why.',
      scene: MARKET,
      checklist: ['Makes at least two predictions', 'Links predictions to details in the picture', 'Uses future forms'],
    },
    {
      id: 'm1-speaking-5', taskTypeId: 'speaking-5', draft: true,
      text: 'Your family wants to spend a summer weekend together. Choose one option and persuade your family member that it is the better choice.',
      options: ['A camping trip at a lake', 'A weekend in a city hotel'],
      scene: {
        description:
          'Option A: a tent beside a calm lake with a canoe on the shore and a campfire. Two nights cost $60, the drive is 3 hours, and there is no Wi-Fi. Option B: a downtown hotel with an indoor pool, close to museums and restaurants. Two nights cost $450, the drive is 30 minutes, and breakfast is included.',
        keyElements: ['cost', 'travel time', 'activities', 'comfort'],
      },
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
      scene: {
        description:
          'In a second-hand shop window: a tall floor lamp shaped like a giraffe. Its long neck is the lamp stand, and the light comes out of its open mouth. It is painted bright orange with brown spots, it is about as tall as an adult, and the price tag says $85.',
        keyElements: ['giraffe shape', 'light comes from the mouth', 'orange with brown spots', 'about as tall as an adult', '$85'],
      },
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
