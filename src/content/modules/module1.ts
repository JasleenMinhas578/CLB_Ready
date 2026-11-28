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
  reading: module1Reading,
  listening: module1Listening,
  prompts: [
    {
      id: 'm1-speaking-1', taskTypeId: 'speaking-1', draft: true,
      text: 'Your friend has just moved to a new city and feels lonely. They want to meet new people but are shy. Give your friend some advice.',
      modelAnswer: "Hey, I know moving to a new city is tough, especially when you don’t know anyone yet, so I’m really glad you told me how you’re feeling. I have a few ideas that might help.\n\nFirst, why not join a club based on something you already enjoy, like a hiking group or a book club? Because everyone is there for the same activity, you won’t have to think of things to talk about. The conversation starts naturally, which makes it much easier when you’re shy.\n\nSecond, I’d suggest volunteering, maybe at a food bank or an animal shelter. You’d see the same people every week, and working side by side is a relaxed way to get to know someone. Plus, helping others usually makes a new place feel like home.\n\nFinally, try to say yes to small invitations, even when you’d rather stay in. If a co-worker suggests coffee, go, even for twenty minutes. Small moments like that often turn into real friendships.\n\nMost importantly, be patient with yourself. It takes time to build a new circle, but I’m sure people will love getting to know you. And call me anytime you need to talk, okay?",
      checklist: ['Gives at least two pieces of advice', 'Gives a reason for each', 'Uses a friendly, supportive tone'],
    },
    {
      id: 'm1-speaking-2', taskTypeId: 'speaking-2', draft: true,
      text: 'Talk about a time when you had to learn something new very quickly. What happened, and how did you feel?',
      modelAnswer: "Last year, I started a new job at a busy restaurant, and on my second day the manager told me I’d be running the cash register alone that evening. I had never used one before, so I was really nervous. During the afternoon, I asked a co-worker to show me the main steps, and I wrote them down on a small card. Then I practised with pretend orders until I could do it without looking. That evening, I was a little slow with the first few customers, but after about an hour I felt much more confident. By the end of my shift, I hadn’t made a single mistake. I felt incredibly proud, and I learned that breaking a big task into small steps makes almost anything manageable. Now, whenever I have to learn something new, I use the same approach.",
      checklist: ['Says when and where it happened', 'Describes what happened in order', 'Explains how they felt'],
    },
    {
      id: 'm1-speaking-3', taskTypeId: 'speaking-3', draft: true,
      text: 'Describe the scene in the picture to a friend who cannot see it. Include as many details as you can.',
      modelAnswer: "In this picture, I can see a busy farmers’ market in a town square on what looks like a sunny Saturday morning. In the front, there’s a woman in a bright yellow raincoat choosing apples at a fruit stand. Right beside her, a little boy has just dropped a bag of oranges, and they’re rolling across the ground. In the middle of the square, a man is playing the guitar next to a stone fountain, and his open guitar case has a few coins in it. On the right side, a long line of people is waiting at a bakery stall with a sign that says “Fresh bread.” In the background, I can see a church tower, and dark clouds are moving in over it. One of the vendors is already starting to put up a large umbrella.",
      scene: MARKET,
      checklist: ['Describes the setting', 'Describes people and what they are doing', 'Mentions colours or positions'],
    },
    {
      id: 'm1-speaking-4', taskTypeId: 'speaking-4', draft: true,
      text: 'Look at the same picture. What do you think will probably happen next? Explain why.',
      modelAnswer: "I think a few things will probably happen next. First, the woman in the yellow raincoat will likely help the little boy pick up his oranges before they roll too far, and people nearby will probably step around them so they don’t slip. Second, because those dark clouds are moving in, I expect it’s going to rain very soon. That’s probably why one vendor is already putting up an umbrella. The other vendors will likely cover their fruit and bread, and many shoppers will hurry home or squeeze under the stalls. The guitar player will probably close his case and move under a roof to protect his guitar. Finally, the people in line at the bakery might decide to stay, since fresh bread is worth getting a little wet for, but the market will probably get much quieter in the next few minutes.",
      scene: MARKET,
      checklist: ['Makes at least two predictions', 'Links predictions to details in the picture', 'Uses future forms'],
    },
    {
      id: 'm1-speaking-5', taskTypeId: 'speaking-5', draft: true,
      text: 'Your family wants to spend a summer weekend together. Choose one option and persuade your family member that it is the better choice.',
      modelAnswer: "I know you’d prefer the hotel, but I really think the camping trip at the lake is the better choice for our family. First, it’s much cheaper. Two nights of camping cost only sixty dollars, while the hotel costs four hundred and fifty. With the money we save, we could rent a canoe and still have plenty left for food. Second, the hotel is close to museums and restaurants, but we can do those things any weekend. Swimming in a lake, paddling a canoe and sitting around a campfire are experiences we rarely get. And yes, there’s no Wi-Fi, but honestly, I think that’s a good thing. The kids will actually put their phones down, and we’ll spend real time together. The drive is three hours, but we can play games in the car. Trust me, this will be a weekend we remember.",
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
      modelAnswer: "Hi Mrs. Wong, it’s Sam from next door. I’m so sorry to call with bad news, but I wanted to tell you as early as possible. My manager just asked me to work this Saturday, because two people on my team are sick and we have an important deadline. I really can’t say no this time. I know I promised to help you move, and I feel terrible about it. Here’s what I can do instead: I’m free on Friday evening, so I could come over after work and help you pack boxes and take apart the furniture. That way, there’ll be much less to do on Saturday. My brother also has a truck, and I’ve already asked him if he can help you on the day, and he said yes. Again, I’m really sorry, and I hope this still makes things a little easier for you.",
      checklist: ['Speaks to the chosen person directly', 'Explains the problem clearly', 'Offers a solution or alternative'],
    },
    {
      id: 'm1-speaking-7', taskTypeId: 'speaking-7', draft: true,
      text: 'Some people think all children should learn to cook at school. What is your opinion? Explain your reasons.',
      modelAnswer: "In my opinion, all children should learn to cook at school, and I have two main reasons.\n\nFirst, cooking is a basic life skill that keeps people healthy. Many young people leave home without knowing how to make even a simple meal, so they rely on fast food and expensive delivery. If children learn to prepare a few healthy dishes at school, they’ll understand what goes into their food and make better choices for the rest of their lives. For example, my cousin took a cooking class in grade eight, and now, at university, she cooks most of her meals and spends far less money than her friends.\n\nSecond, cooking supports other subjects. Measuring ingredients involves math, following a recipe builds reading skills, and working in a kitchen as a team teaches cooperation and responsibility. It’s practical learning that many students enjoy more than sitting at a desk.\n\nSome people argue that schools are already too busy and that parents should teach cooking at home. That’s a fair point, but not every family has the time or the knowledge to do it. School makes sure every child gets the same chance.\n\nSo, for these reasons, I strongly believe cooking should be part of every child’s education.",
      checklist: ['States a clear opinion', 'Gives at least two reasons', 'Supports reasons with examples'],
    },
    {
      id: 'm1-speaking-8', taskTypeId: 'speaking-8', draft: true,
      text: 'You see something unusual for sale and call a friend who might want it. Describe it so your friend can decide whether to buy it.',
      modelAnswer: "Hi Jordan, it’s me. You know how you love unusual things for your apartment? Well, I’m standing in front of a second-hand shop, and I’ve found something you have to hear about. It’s a floor lamp shaped like a giraffe. It’s really tall, about as tall as an adult. The giraffe’s long neck is the stand, and the light actually shines out of its open mouth, which is hilarious. It’s painted bright orange with brown spots, so it definitely stands out. It looks like it’s in good condition, and the price is only eighty-five dollars. I think it would look amazing in the corner of your living room, next to your green sofa. If you want it, I can ask the owner to hold it for you until tomorrow. What do you think? Should I ask?",
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
