import type { PracticeModule, SceneBrief } from '../types';
import { module4Reading } from './module4Reading';
import { module4Listening } from './module4Listening';

/** Tasks 3 and 4 share one picture. */
const LIBRARY: SceneBrief = {
  description:
    'A public library on a rainy weekday morning. On the left, a librarian is reading a picture book to a circle of small children sitting on colourful cushions. In the middle, a university student is asleep on a pile of textbooks with her laptop still open. An older man in glasses is reading a newspaper in an armchair by a rainy window. At the front desk, a woman is checking out a tall stack of books that is starting to lean. On the right, a teenager is watching a 3D printer make a small blue model, and a sign on the wall says “Quiet please.”',
  keyElements: ['library', 'storytime for children', 'student asleep on books', 'older man with a newspaper', 'rain on the window', 'leaning stack of books', 'teenager at the 3D printer'],
};

/**
 * Module 4. Original draft prompts written in CELPIP style; not copied
 * from any test. Picture tasks carry a scene brief until the picture is drawn.
 */
export const module4: PracticeModule = {
  id: 'module-4',
  number: 4,
  title: 'Module 4',
  status: 'available',
  reading: module4Reading,
  listening: module4Listening,
  prompts: [
    {
      id: 'm4-speaking-1', taskTypeId: 'speaking-1', draft: true,
      text: 'Your friend wants to start exercising but says they have no time because of work and family. Give your friend some advice.',
      checklist: ['Gives at least two pieces of advice', 'Gives a reason for each', 'Uses a friendly, supportive tone'],
    },
    {
      id: 'm4-speaking-2', taskTypeId: 'speaking-2', draft: true,
      text: 'Talk about a time when you made a mistake and learned something important from it. What happened?',
      checklist: ['Says when and where it happened', 'Describes what happened in order', 'Explains how they felt'],
    },
    {
      id: 'm4-speaking-3', taskTypeId: 'speaking-3', draft: true,
      text: 'Describe the scene in the picture to a friend who cannot see it. Include as many details as you can.',
      scene: LIBRARY,
      checklist: ['Describes the setting', 'Describes people and what they are doing', 'Mentions colours or positions'],
    },
    {
      id: 'm4-speaking-4', taskTypeId: 'speaking-4', draft: true,
      text: 'Look at the same picture. What do you think will probably happen next? Explain why.',
      scene: LIBRARY,
      checklist: ['Makes at least two predictions', 'Links predictions to details in the picture', 'Uses future forms'],
    },
    {
      id: 'm4-speaking-5', taskTypeId: 'speaking-5', draft: true,
      text: 'You and your partner are choosing a summer camp for your teenage son, and you each prefer a different one. Choose one option and persuade your partner that it is the better choice.',
      options: ['An online coding camp', 'An outdoor soccer camp'],
      scene: {
        description: 'Option A: a one-week online coding camp from home, Monday to Friday, 9 a.m. to 3 p.m. It costs $300, and he builds his own game. Option B: a one-week soccer camp at a park 20 minutes away by car, with professional coaches. It costs $220 and runs outdoors in all weather.',
        keyElements: ['cost', 'time or distance', 'what you get'],
      },
      checklist: ['Clearly picks one option', 'Compares both options', 'Gives persuasive reasons'],
    },
    {
      id: 'm4-speaking-6', taskTypeId: 'speaking-6', draft: true,
      text: 'A colleague often presents your ideas in meetings as their own. Choose one: talk to your colleague, or talk to your manager. Speak to the person you chose.',
      checklist: ['Speaks to the chosen person directly', 'Explains the problem clearly', 'Offers a solution or alternative'],
    },
    {
      id: 'm4-speaking-7', taskTypeId: 'speaking-7', draft: true,
      text: 'Some people think elementary school students should not get any homework. What is your opinion? Explain your reasons.',
      checklist: ['States a clear opinion', 'Gives at least two reasons', 'Supports reasons with examples'],
    },
    {
      id: 'm4-speaking-8', taskTypeId: 'speaking-8', draft: true,
      text: 'You are at a summer festival and see an unusual food truck. Call your friend, who is planning a party, and describe it so they can decide whether to hire it.',
      scene: {
        description: 'A food truck painted like a giant watermelon that sells ice cream shaped like vegetables. A green mint ice cream looks exactly like broccoli, and an orange mango one looks like a carrot. The line is very long, and a sign says the truck can be booked for parties for $400.',
        keyElements: ['watermelon-painted truck', 'ice cream shaped like vegetables', 'broccoli mint and carrot mango', 'long line', '$400 for parties'],
      },
      checklist: ['Describes the object clearly', 'Explains what is unusual about it', 'Asks or suggests what the friend should do'],
    },
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
