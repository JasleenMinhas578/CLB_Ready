import type { PracticeModule, SceneBrief } from '../types';
import { module3Reading } from './module3Reading';
import { module3Listening } from './module3Listening';

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
  reading: module3Reading,
  listening: module3Listening,
  prompts: [
    {
      id: 'm3-speaking-1', taskTypeId: 'speaking-1', draft: true,
      text: 'Your cousin is moving to Canada in December and has never lived through a cold winter. Give your cousin some advice.',
      modelAnswer: "Hey Arun, I’m so excited you’re moving here in December! I just want to give you a few tips, because your first Canadian winter can be a bit of a shock.\n\nFirst, buy the right clothes, but buy them here, not back home. Stores here sell coats and boots made for very cold weather, and they’re often on sale in early December. Get a long, warm coat, waterproof boots with a good grip, a hat, gloves and a scarf. Wearing layers is also really important, because buildings are very warm inside.\n\nSecond, be careful on the ice. Sidewalks can be slippery, especially in the morning, so walk slowly and take small steps. Good boots really make a difference here.\n\nThird, try not to stay inside all winter. The days are short, and it’s easy to feel down. Go skating, try snowshoeing, or just take a walk when the sun is out. It honestly makes winter much more enjoyable.\n\nAnd finally, don’t worry too much. Lots of people say their first winter is the hardest, and after that, it just feels normal.\n\nWhen you arrive, I’ll take you shopping for your winter gear, and we’ll make it fun.",
      checklist: ['Gives at least two pieces of advice', 'Gives a reason for each', 'Uses a friendly, supportive tone'],
    },
    {
      id: 'm3-speaking-2', taskTypeId: 'speaking-2', draft: true,
      text: 'Talk about a time when your plans changed suddenly while you were travelling. What happened, and what did you do?',
      modelAnswer: "Two years ago, I was flying from Toronto to Vancouver to visit my sister, with a connection in Calgary. While I was waiting at the gate, a huge snowstorm hit, and all flights were cancelled for the night. At first, I felt really frustrated, because I had only four days off work. But instead of waiting in the long line at the service desk, I called the airline directly and got a seat on the first flight the next morning. Then I found a cheap hotel near the airport and asked a couple of other stranded travellers if they wanted to share a taxi. We ended up having dinner together, and one of them is still my friend today. I arrived in Vancouver a day late, but honestly, it became one of my favourite travel stories. It taught me to stay calm and flexible when plans change.",
      checklist: ['Says when and where it happened', 'Describes what happened in order', 'Explains how they felt'],
    },
    {
      id: 'm3-speaking-3', taskTypeId: 'speaking-3', draft: true,
      text: 'Describe the scene in the picture to a friend who cannot see it. Include as many details as you can.',
      modelAnswer: "This picture shows a busy airport waiting area in winter. At the top, there’s a big screen showing several flights, and many of them are marked “Delayed” in red. Through the large window behind the gates, I can see heavy snow falling, and a snowplow is clearing the runway. In the front, a family is asleep across three chairs, and a little girl is hugging a stuffed bear. Nearby, a businessman in a grey suit is standing at the service desk, and he looks angry as he talks on his phone. On the right side, there’s a long line at a coffee shop. In front of it, a cleaner is mopping the floor beside a yellow “Wet floor” sign, and a young man is running towards that wet spot, pulling a suitcase behind him.",
      scene: AIRPORT,
      checklist: ['Describes the setting', 'Describes people and what they are doing', 'Mentions colours or positions'],
    },
    {
      id: 'm3-speaking-4', taskTypeId: 'speaking-4', draft: true,
      text: 'Look at the same picture. What do you think will probably happen next? Explain why.',
      modelAnswer: "I think a few things will probably happen in the next few minutes. First, the young man running with his suitcase will most likely slip on the wet floor, because he’s moving fast and doesn’t seem to notice the sign. He might fall or knock the sign over, and the cleaner will probably rush to help him. Second, because the snow is so heavy, I expect more flights will be delayed or even cancelled. The businessman at the desk will probably get even more upset, and he may have to book a hotel for the night. Third, the sleeping family will likely wake up when an announcement is made, and the parents will have to decide what to do with their tired children. Finally, the line at the coffee shop will probably get even longer, since everyone is going to be waiting for a while.",
      scene: AIRPORT,
      checklist: ['Makes at least two predictions', 'Links predictions to details in the picture', 'Uses future forms'],
    },
    {
      id: 'm3-speaking-5', taskTypeId: 'speaking-5', draft: true,
      text: 'Your team wants to celebrate finishing a big project, and your manager has asked for your opinion. Choose one option and persuade your manager that it is the better choice.',
      modelAnswer: "I know the dinner cruise sounds more elegant, but I think the bowling night is the better choice for our team. First, it’s much more affordable. It’s twenty-five dollars per person, compared with seventy for the cruise. For a team of twenty, that saves about nine hundred dollars, which we could use for another event later in the year. Second, the bowling alley is only five minutes from the office, so people can walk there right after work. The cruise leaves from forty minutes away, which will be difficult for people with children or long commutes. Third, bowling is more social. Everyone plays together in teams, so people from different departments will actually talk and laugh together. On a cruise, people usually sit with the same few colleagues. And pizza and drinks are included, too. Honestly, I think bowling would bring the team closer together.",
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
      modelAnswer: "Hi Kevin, it’s Lina from next door. Do you have a minute? I hope you don’t mind me bringing this up, but I wanted to talk to you directly before anything else. While you’re at work in the evenings, your dog barks for quite a long time, sometimes for two or three hours. I don’t think you’d know, since you’re not home, but the walls are pretty thin, and I’ve been having trouble sleeping. I’m sure he just misses you. I was wondering if there’s anything we could try. Maybe a dog walker could take him out in the evening, or you could leave the radio on for him. I’ve also heard that some dog daycares are open late. I’m happy to help however I can, and I really don’t want this to become a big issue. What do you think?",
      checklist: ['Speaks to the chosen person directly', 'Explains the problem clearly', 'Offers a solution or alternative'],
    },
    {
      id: 'm3-speaking-7', taskTypeId: 'speaking-7', draft: true,
      text: 'Some companies let employees work from home every day. Do you think this is a good idea? Explain your opinion.',
      modelAnswer: "In my opinion, letting employees work from home every day is a good idea for many jobs, and I have two main reasons.\n\nFirst, it saves people a lot of time and money. In a big city, some workers spend two hours a day commuting. Without that commute, they have more time for their families, for exercise and for sleep, and they save on gas, parking and lunches. In my experience, people who are less tired and less stressed actually do better work.\n\nSecond, it gives companies access to more talent. When employees can work from anywhere, a company can hire the best person for the job, even if that person lives in another city or has a disability that makes travelling difficult. The company can also save money on office space.\n\nOf course, there are some disadvantages. Some people feel lonely at home, and it can be harder for new employees to learn from their colleagues. But companies can solve this with regular video meetings, team chats and occasional days together in person.\n\nSo overall, I believe working from home is the future for many jobs, as long as teams make an effort to stay connected.",
      checklist: ['States a clear opinion', 'Gives at least two reasons', 'Supports reasons with examples'],
    },
    {
      id: 'm3-speaking-8', taskTypeId: 'speaking-8', draft: true,
      text: 'At a garage sale you find a strange clock and call your brother, who collects unusual clocks. Describe it so he can decide whether you should buy it.',
      modelAnswer: "Hey Marco, it’s me. I’m at a garage sale on Oak Street, and I just found a clock you absolutely need for your collection. It’s built inside an old frying pan. The handle points straight down, and the clock face is right where you’d cook an egg. Here’s the strange part: the numbers go around backwards, from twelve down to one, so it would take a while to learn how to read it. And the hands are shaped like a tiny knife and fork, which is pretty funny. It’s black with silver numbers, and I checked: it actually still works. The seller only wants thirty dollars for it. I think it would look great in your kitchen, next to your other clocks. Should I buy it for you? I can bring it over this weekend.",
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
