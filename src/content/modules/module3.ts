import type { PracticeModule, SceneBrief } from '../types';

/** Tasks 3 and 4 share one picture. */
const AIRPORT: SceneBrief = {
  description:
    'A busy airport waiting area in winter. A large screen at the top shows several flights marked “Delayed” in red. Through the big window behind the gates, heavy snow is falling and a snowplow is clearing the runway. In the front, a family is asleep across three chairs, with a little girl hugging a stuffed bear. A businessman in a grey suit is talking angrily on his phone at the service desk. On the right, a long line has formed at a coffee shop, and a cleaner is mopping the floor next to a yellow “Wet floor” sign while a young man runs towards it pulling a suitcase.',
  keyElements: ['airport gate area', 'delayed flights on the screen', 'snow and snowplow', 'sleeping family', 'businessman at the desk', 'coffee shop line', 'cleaner with wet floor sign', 'man running with a suitcase'],
};

/**
 * Module 3. Original draft prompts written in CELPIP style; not copied
 * from any test. Picture tasks carry a scene brief until the picture is drawn.
 */
export const module3: PracticeModule = {
  id: 'module-3',
  number: 3,
  title: 'Module 3',
  status: 'available',
  prompts: [
    {
      id: 'm3-speaking-1', taskTypeId: 'speaking-1', draft: true,
      text: 'Your cousin is moving to Canada in December and has never lived through a cold winter. Give your cousin some advice.',
      checklist: ['Gives at least two pieces of advice', 'Gives a reason for each', 'Uses a friendly, supportive tone'],
    },
    {
      id: 'm3-speaking-2', taskTypeId: 'speaking-2', draft: true,
      text: 'Talk about a time when your plans changed suddenly while you were travelling. What happened, and what did you do?',
      checklist: ['Says when and where it happened', 'Describes what happened in order', 'Explains how they felt'],
    },
    {
      id: 'm3-speaking-3', taskTypeId: 'speaking-3', draft: true,
      text: 'Describe the scene in the picture to a friend who cannot see it. Include as many details as you can.',
      scene: AIRPORT,
      checklist: ['Describes the setting', 'Describes people and what they are doing', 'Mentions colours or positions'],
    },
    {
      id: 'm3-speaking-4', taskTypeId: 'speaking-4', draft: true,
      text: 'Look at the same picture. What do you think will probably happen next? Explain why.',
      scene: AIRPORT,
      checklist: ['Makes at least two predictions', 'Links predictions to details in the picture', 'Uses future forms'],
    },
    {
      id: 'm3-speaking-5', taskTypeId: 'speaking-5', draft: true,
      text: 'Your team wants to celebrate finishing a big project, and your manager has asked for your opinion. Choose one option and persuade your manager that it is the better choice.',
      options: ['A bowling night', 'A dinner cruise'],
      scene: {
        description: 'Option A: an evening at a bowling alley five minutes from the office, with pizza and drinks included. It costs $25 per person and lasts two hours. Option B: a two-hour dinner cruise around the harbour with a three-course meal and live music. It costs $70 per person, and the boat leaves 40 minutes away.',
        keyElements: ['cost', 'time or distance', 'what you get'],
      },
      checklist: ['Clearly picks one option', 'Compares both options', 'Gives persuasive reasons'],
    },
    {
      id: 'm3-speaking-6', taskTypeId: 'speaking-6', draft: true,
      text: 'Your neighbour’s dog barks for hours every evening while the neighbour is at work, and you cannot sleep. Choose one: talk to your neighbour, or speak to the building manager. Speak to the person you chose.',
      checklist: ['Speaks to the chosen person directly', 'Explains the problem clearly', 'Offers a solution or alternative'],
    },
    {
      id: 'm3-speaking-7', taskTypeId: 'speaking-7', draft: true,
      text: 'Some companies let employees work from home every day. Do you think this is a good idea? Explain your opinion.',
      checklist: ['States a clear opinion', 'Gives at least two reasons', 'Supports reasons with examples'],
    },
    {
      id: 'm3-speaking-8', taskTypeId: 'speaking-8', draft: true,
      text: 'At a garage sale you find a strange clock and call your brother, who collects unusual clocks. Describe it so he can decide whether you should buy it.',
      scene: {
        description: 'A clock built inside an old frying pan. The handle points down, the numbers go around the face backwards, from 12 down to 1, and the hands are shaped like a knife and fork. It is black with silver numbers, still works, and the seller wants $30.',
        keyElements: ['frying pan', 'numbers go backwards', 'knife and fork hands', 'black with silver numbers', 'still works', '$30'],
      },
      checklist: ['Describes the object clearly', 'Explains what is unusual about it', 'Asks or suggests what the friend should do'],
    },
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
