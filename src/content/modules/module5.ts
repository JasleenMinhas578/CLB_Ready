import type { PracticeModule, SceneBrief } from '../types';

/** Tasks 3 and 4 share one picture. */
const GROCERY: SceneBrief = {
  description:
    'A busy grocery store on a Saturday. At the front, a man is pushing a shopping cart that is piled so high with boxes that he cannot see where he is going. Next to him, a bag has ripped and oranges are rolling across the floor. A small boy in a red cap is reaching for candy at the checkout while his father is paying. On the left, two people are waiting at self-checkout machines, and one screen shows “Help is on the way.” A big sign above the bakery says “50% off today,” and a store worker on a ladder is fixing a light.',
  keyElements: ['grocery store', 'man with an overloaded cart', 'oranges rolling on the floor', 'boy reaching for candy', 'self-checkout machines', '50% off sign', 'worker on a ladder'],
};

/**
 * Module 5. Original draft prompts written in CELPIP style; not copied
 * from any test. Picture tasks carry a scene brief until the picture is drawn.
 */
export const module5: PracticeModule = {
  id: 'module-5',
  number: 5,
  title: 'Module 5',
  status: 'available',
  prompts: [
    {
      id: 'm5-speaking-1', taskTypeId: 'speaking-1', draft: true,
      text: 'Your younger brother just got his first credit card and wants to buy many expensive things. Give him some advice.',
      checklist: ['Gives at least two pieces of advice', 'Gives a reason for each', 'Uses a friendly, supportive tone'],
    },
    {
      id: 'm5-speaking-2', taskTypeId: 'speaking-2', draft: true,
      text: 'Talk about a time when you volunteered or helped in your community. What did you do, and how did it go?',
      checklist: ['Says when and where it happened', 'Describes what happened in order', 'Explains how they felt'],
    },
    {
      id: 'm5-speaking-3', taskTypeId: 'speaking-3', draft: true,
      text: 'Describe the scene in the picture to a friend who cannot see it. Include as many details as you can.',
      scene: GROCERY,
      checklist: ['Describes the setting', 'Describes people and what they are doing', 'Mentions colours or positions'],
    },
    {
      id: 'm5-speaking-4', taskTypeId: 'speaking-4', draft: true,
      text: 'Look at the same picture. What do you think will probably happen next? Explain why.',
      scene: GROCERY,
      checklist: ['Makes at least two predictions', 'Links predictions to details in the picture', 'Uses future forms'],
    },
    {
      id: 'm5-speaking-5', taskTypeId: 'speaking-5', draft: true,
      text: 'You and your partner are moving and have found two apartments. Choose one option and persuade your partner that it is the better choice.',
      options: ['A small downtown apartment', 'A larger apartment in the suburbs'],
      scene: {
        description: 'Option A: a one-bedroom apartment downtown, five minutes’ walk from work, near shops and restaurants. It costs $1,900 a month and has no parking. Option B: a two-bedroom apartment in the suburbs with a balcony and free parking. It costs $1,600 a month and is a 45-minute bus ride from work.',
        keyElements: ['cost', 'time or distance', 'what you get'],
      },
      checklist: ['Clearly picks one option', 'Compares both options', 'Gives persuasive reasons'],
    },
    {
      id: 'm5-speaking-6', taskTypeId: 'speaking-6', draft: true,
      text: 'Your 15-year-old daughter wants to go to an overnight music festival with friends, but you feel she is too young. Choose one: talk to your daughter, or talk to the parent who is organizing the trip. Speak to the person you chose.',
      checklist: ['Speaks to the chosen person directly', 'Explains the problem clearly', 'Offers a solution or alternative'],
    },
    {
      id: 'm5-speaking-7', taskTypeId: 'speaking-7', draft: true,
      text: 'Some people think stores should stop giving out plastic bags completely. Do you agree or disagree? Explain your opinion.',
      checklist: ['States a clear opinion', 'Gives at least two reasons', 'Supports reasons with examples'],
    },
    {
      id: 'm5-speaking-8', taskTypeId: 'speaking-8', draft: true,
      text: 'In a shop you see an unusual umbrella and call a co-worker who walks to work every day. Describe it so your co-worker can decide whether to buy it.',
      scene: {
        description: 'A clear plastic umbrella with a small fan built into the handle and a ring of tiny lights around the edge. The lights glow blue in the dark, the fan blows air on your face, and it folds down to the size of a water bottle. It costs $45.',
        keyElements: ['clear umbrella', 'fan in the handle', 'blue lights around the edge', 'folds small', '$45'],
      },
      checklist: ['Describes the object clearly', 'Explains what is unusual about it', 'Asks or suggests what the friend should do'],
    },
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
