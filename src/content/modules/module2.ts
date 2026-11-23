import type { PracticeModule, SceneBrief } from '../types';
import { module2Reading } from './module2Reading';
import { module2Listening } from './module2Listening';

/** Tasks 3 and 4 share one picture. */
const PARK: SceneBrief = {
  description:
    'A city park on a hot summer afternoon. In the front, a family is having a picnic on a red-and-white blanket, and a dog is sneaking a sandwich from their basket. On the left, children are playing on a climbing frame while a mother pushes a baby in a swing. A man is trying to walk five dogs at once, and their leashes are tangled around a bench. On the right, an ice cream truck has a long line of people. In the sky, grey clouds are building up behind the trees, and a few people are looking up.',
  keyElements: ['park', 'family picnic', 'dog taking a sandwich', 'children on the climbing frame', 'man with five tangled dogs', 'ice cream truck and line', 'grey clouds'],
};

/**
 * Module 2. Original draft prompts written in CELPIP style; not copied
 * from any test. Picture tasks carry a scene brief until the picture is drawn.
 */
export const module2: PracticeModule = {
  id: 'module-2',
  number: 2,
  title: 'Module 2',
  status: 'available',
  reading: module2Reading,
  listening: module2Listening,
  prompts: [
    {
      id: 'm2-speaking-1', taskTypeId: 'speaking-1', draft: true,
      text: 'Your co-worker has to give her first presentation in English next week, and she is very nervous about it. Give her some advice.',
      checklist: ['Gives at least two pieces of advice', 'Gives a reason for each', 'Uses a friendly, supportive tone'],
    },
    {
      id: 'm2-speaking-2', taskTypeId: 'speaking-2', draft: true,
      text: 'Talk about a time when you helped a stranger. What happened, and how did you feel afterwards?',
      checklist: ['Says when and where it happened', 'Describes what happened in order', 'Explains how they felt'],
    },
    {
      id: 'm2-speaking-3', taskTypeId: 'speaking-3', draft: true,
      text: 'Describe the scene in the picture to a friend who cannot see it. Include as many details as you can.',
      scene: PARK,
      checklist: ['Describes the setting', 'Describes people and what they are doing', 'Mentions colours or positions'],
    },
    {
      id: 'm2-speaking-4', taskTypeId: 'speaking-4', draft: true,
      text: 'Look at the same picture. What do you think will probably happen next? Explain why.',
      scene: PARK,
      checklist: ['Makes at least two predictions', 'Links predictions to details in the picture', 'Uses future forms'],
    },
    {
      id: 'm2-speaking-5', taskTypeId: 'speaking-5', draft: true,
      text: 'You and your brother are buying a birthday present for your father, and you each prefer a different gift. Choose one option and persuade your brother that it is the better choice.',
      options: ['A cooking class for two', 'A portable speaker'],
      scene: {
        description: 'Option A: a cooking class for two people on a Saturday evening, downtown. It costs $120 and lasts three hours, and your father can bring a friend. Option B: a small waterproof speaker that plays music from a phone. It costs $90, comes in three colours, and arrives in three days.',
        keyElements: ['cost', 'time or distance', 'what you get'],
      },
      checklist: ['Clearly picks one option', 'Compares both options', 'Gives persuasive reasons'],
    },
    {
      id: 'm2-speaking-6', taskTypeId: 'speaking-6', draft: true,
      text: 'A friend has asked you to be a reference for a job, but you know they are often late. Choose one: agree and tell your friend your concerns, or explain why you cannot be their reference. Speak to your friend.',
      checklist: ['Speaks to the chosen person directly', 'Explains the problem clearly', 'Offers a solution or alternative'],
    },
    {
      id: 'm2-speaking-7', taskTypeId: 'speaking-7', draft: true,
      text: 'Some people think downtown streets should be closed to cars on weekends so people can walk and shop safely. What is your opinion? Explain your reasons.',
      checklist: ['States a clear opinion', 'Gives at least two reasons', 'Supports reasons with examples'],
    },
    {
      id: 'm2-speaking-8', taskTypeId: 'speaking-8', draft: true,
      text: 'You are in a second-hand furniture store and call a friend who loves unusual furniture. Describe what you see so your friend can decide whether to buy it.',
      scene: {
        description: 'An armchair made entirely of old skateboards. The seat and back are skateboard decks painted in bright stickers, and four skateboard wheels are fixed under the legs, so the chair can roll. It has a thin blue cushion and costs $140.',
        keyElements: ['made of skateboards', 'colourful stickers', 'wheels under the legs', 'thin blue cushion', '$140'],
      },
      checklist: ['Describes the object clearly', 'Explains what is unusual about it', 'Asks or suggests what the friend should do'],
    },
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
