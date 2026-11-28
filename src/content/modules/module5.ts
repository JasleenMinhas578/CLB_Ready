import type { PracticeModule, SceneBrief } from '../types';
import { module5Reading } from './module5Reading';
import { module5Listening } from './module5Listening';

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
  reading: module5Reading,
  listening: module5Listening,
  prompts: [
    {
      id: 'm5-speaking-1', taskTypeId: 'speaking-1', draft: true,
      text: 'Your younger brother just got his first credit card and wants to buy many expensive things. Give him some advice.',
      modelAnswer: "Hey Sam, congratulations on getting your first credit card! It’s a big step, but I want to give you some advice, because credit cards can get people into trouble really quickly.\n\nFirst, only spend money you already have. A credit card isn’t extra money; it’s a loan. A good rule is to only buy things you could pay for with cash today, and to pay the full balance every month. If you don’t, the bank charges interest, often around twenty percent, and your debt can grow very fast.\n\nSecond, make a simple budget. Write down how much you earn and what you need to pay for, like rent, food and your phone. Then decide how much is left for fun things. That way, you’ll know before you buy something whether you can actually afford it.\n\nThird, think about your credit score. If you pay on time every month, you’ll build a good credit history, which will help you later when you want to rent an apartment or get a car loan.\n\nAnd finally, before buying something expensive, wait twenty-four hours. Often, you’ll realize you don’t really need it.\n\nIf you want, I can show you the budgeting app I use. It really helped me.",
      checklist: ['Gives at least two pieces of advice', 'Gives a reason for each', 'Uses a friendly, supportive tone'],
    },
    {
      id: 'm5-speaking-2', taskTypeId: 'speaking-2', draft: true,
      text: 'Talk about a time when you volunteered or helped in your community. What did you do, and how did it go?',
      modelAnswer: "Last spring, I volunteered at a community cleanup in a park near my apartment. A local group had organized it, and about thirty people came on a Saturday morning. They gave us gloves, garbage bags and long tools for picking up trash. I worked with an older couple who had lived in the neighbourhood for years, and they told me all about the park’s history while we worked. In three hours, we filled more than fifty bags with plastic bottles, food wrappers and even an old bicycle tire. At first, I was surprised by how much garbage there was, but by lunchtime the park looked so much better. Afterwards, the organizers served sandwiches, and I chatted with neighbours I had never met before. I felt really proud and connected to my community, and I’ve joined two more cleanups since then.",
      checklist: ['Says when and where it happened', 'Describes what happened in order', 'Explains how they felt'],
    },
    {
      id: 'm5-speaking-3', taskTypeId: 'speaking-3', draft: true,
      text: 'Describe the scene in the picture to a friend who cannot see it. Include as many details as you can.',
      modelAnswer: "This picture shows a busy grocery store on a Saturday. In the front, a man is pushing a shopping cart that’s piled so high with boxes that he can’t see where he’s going. Right next to him, a shopping bag has ripped open, and oranges are rolling all over the floor. At the checkout, a small boy in a red cap is reaching for candy while his father is busy paying. On the left side, two people are waiting at self-checkout machines, and one of the screens says “Help is on the way.” At the back, above the bakery, there’s a big sign that says “50% off today.” And near the ceiling, a store worker is standing on a ladder, fixing one of the lights. Overall, it looks like a very crowded and slightly chaotic shopping day.",
      scene: GROCERY,
      checklist: ['Describes the setting', 'Describes people and what they are doing', 'Mentions colours or positions'],
    },
    {
      id: 'm5-speaking-4', taskTypeId: 'speaking-4', draft: true,
      text: 'Look at the same picture. What do you think will probably happen next? Explain why.',
      modelAnswer: "I think several things will probably happen in the next few minutes. First, the man with the overloaded cart can’t see where he’s going, so he’ll most likely roll right over some of the oranges on the floor. He might slip, or his cart might hit the ladder, which would be dangerous for the worker fixing the light. Second, the father at the checkout will probably notice his son grabbing candy. The boy might ask him to buy it, and since it’s the weekend, the father may say yes. Third, an employee will likely come over to help the customers at the self-checkout, since the screen says help is on the way. And finally, because of the fifty percent off sign, I expect many shoppers will head to the bakery, so it’ll probably get even busier back there.",
      scene: GROCERY,
      checklist: ['Makes at least two predictions', 'Links predictions to details in the picture', 'Uses future forms'],
    },
    {
      id: 'm5-speaking-5', taskTypeId: 'speaking-5', draft: true,
      text: 'You and your partner are moving and have found two apartments. Choose one option and persuade your partner that it is the better choice.',
      modelAnswer: "I know you like the bigger apartment, but I really think the downtown one is the better choice for us. First, think about time. From downtown, I can walk to work in five minutes. From the suburbs, it’s a forty-five-minute bus ride each way. That’s an hour and a half every day, or more than seven hours a week, that we could spend together instead. Second, yes, the downtown apartment costs three hundred dollars more each month, but we wouldn’t need a car anymore. Between insurance, gas and repairs, a car costs much more than three hundred dollars a month. Third, we’d be close to shops, restaurants and our friends, so it would be easy to go out. The apartment is smaller, but we can choose our furniture carefully. Honestly, I think this choice will make our everyday life easier and happier.",
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
      modelAnswer: "Maya, can we talk for a minute about the music festival? I know how excited you are, and I can see why. Your friends are going, and your favourite band is playing. I’m not saying no because I don’t trust you. I do. But it’s an overnight event with thousands of people, and at fifteen, I just don’t feel comfortable with you staying there all night without an adult. If something went wrong, I’d be far away. So here’s what I’m thinking: what if I drive you and your friends there in the afternoon, you enjoy the concerts, and I pick everyone up at eleven? Or, if one of the other parents is going to stay overnight with the group, I’d be open to talking about it. And next year, when you’re sixteen, we can discuss it again. Does that sound fair?",
      checklist: ['Speaks to the chosen person directly', 'Explains the problem clearly', 'Offers a solution or alternative'],
    },
    {
      id: 'm5-speaking-7', taskTypeId: 'speaking-7', draft: true,
      text: 'Some people think stores should stop giving out plastic bags completely. Do you agree or disagree? Explain your opinion.',
      modelAnswer: "I agree that stores should stop giving out plastic bags completely, and I have two main reasons.\n\nFirst, plastic bags cause serious harm to the environment. Most of them are used for only a few minutes, but they can take hundreds of years to break down. Many end up in rivers and oceans, where animals like turtles and birds mistake them for food. Even when we try to recycle them, many recycling centres can’t process them, so they still end up in landfills.\n\nSecond, there are easy and cheap alternatives. Reusable bags are strong, they last for years, and many stores sell them for just a dollar or two. In my own family, we keep a few in the car and by the front door, so we rarely forget them. After a couple of weeks, it becomes a habit, just like taking your keys.\n\nSome people say plastic bags are convenient, especially for unplanned shopping trips, and that people reuse them for garbage. That’s true, but stores could sell paper bags for those situations, and people can buy bin liners for garbage.\n\nSo overall, I think banning plastic bags is a small change for us, but a big benefit for the planet.",
      checklist: ['States a clear opinion', 'Gives at least two reasons', 'Supports reasons with examples'],
    },
    {
      id: 'm5-speaking-8', taskTypeId: 'speaking-8', draft: true,
      text: 'In a shop you see an unusual umbrella and call a co-worker who walks to work every day. Describe it so your co-worker can decide whether to buy it.',
      modelAnswer: "Hey Ravi, it’s me. You walk to work every day, right? I’m in a shop downtown, and I just found the coolest umbrella. It’s made of clear plastic, so you can still see where you’re going in the rain. But here’s the unusual part: there’s a small fan built into the handle, so it blows cool air on your face, which would be amazing on hot, rainy summer days. There’s also a ring of tiny lights around the edge that glow blue in the dark, so drivers can see you when you’re walking home at night. That’s actually a great safety feature. And it folds down to the size of a water bottle, so it fits easily in your backpack. It costs forty-five dollars. It’s a little bit of a gimmick, but it’s also really useful. Should I buy you one?",
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
