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
      modelAnswer: "Hey Dana, I totally understand. With work and the kids, it’s really hard to find time for yourself. But I think there are a few easy ways to fit exercise into your day.\n\nFirst, start small. You don’t need an hour at the gym. Even fifteen or twenty minutes of walking, stretching or an online workout at home is a great start. Once it becomes a habit, you can slowly do more.\n\nSecond, try to combine exercise with things you already do. For example, you could walk or cycle to work, take the stairs instead of the elevator, or go for a walk at lunch. On weekends, you could all go to the park and play soccer or ride bikes. That way, it’s family time and exercise at the same time.\n\nThird, put it in your calendar like a meeting. If you plan a specific time, like seven a.m. on Monday, Wednesday and Friday, you’re much more likely to actually do it.\n\nAnd finally, find a workout buddy. When someone is waiting for you, it’s much harder to skip.\n\nActually, why don’t we walk together on Saturday mornings? I could use the exercise too!",
      checklist: ['Gives at least two pieces of advice', 'Gives a reason for each', 'Uses a friendly, supportive tone'],
    },
    {
      id: 'm4-speaking-2', taskTypeId: 'speaking-2', draft: true,
      text: 'Talk about a time when you made a mistake and learned something important from it. What happened?',
      modelAnswer: "When I was in my first year of college, I had a big group project, and I was in charge of the final report. I was very busy, so I waited until the night before the deadline to start writing. Around midnight, my laptop suddenly crashed, and I hadn’t saved my work anywhere else. I lost almost everything. I had to tell my group the next morning, and I felt terrible, because their grades depended on me. Luckily, our professor gave us two extra days, and we finished it together, but it was very stressful for everyone. That experience taught me two important lessons. First, never leave important work until the last minute. Second, always back up your files. Now I start assignments early and save everything online, and I’ve never had that problem again.",
      checklist: ['Says when and where it happened', 'Describes what happened in order', 'Explains how they felt'],
    },
    {
      id: 'm4-speaking-3', taskTypeId: 'speaking-3', draft: true,
      text: 'Describe the scene in the picture to a friend who cannot see it. Include as many details as you can.',
      modelAnswer: "This picture shows a public library on a rainy weekday morning. On the left, a librarian is reading a picture book to a group of small children who are sitting in a circle on colourful cushions. They look very interested. In the middle of the room, a university student has fallen asleep on a pile of textbooks, and her laptop is still open next to her. By the window, where you can see the rain, an older man with glasses is reading a newspaper in a comfortable armchair. At the front desk, a woman is checking out a very tall stack of books, and the stack is starting to lean to one side. On the right, a teenager is watching a 3D printer make a small blue model. There’s also a sign on the wall that says “Quiet please.”",
      scene: LIBRARY,
      checklist: ['Describes the setting', 'Describes people and what they are doing', 'Mentions colours or positions'],
    },
    {
      id: 'm4-speaking-4', taskTypeId: 'speaking-4', draft: true,
      text: 'Look at the same picture. What do you think will probably happen next? Explain why.',
      modelAnswer: "I think a few things will probably happen next. First, the tall stack of books at the front desk is leaning, so it will most likely fall over. The books will probably crash onto the floor, and that loud noise might wake up the student who’s sleeping on her textbooks. She’ll probably be embarrassed and check that her laptop is okay. Second, the librarian will likely finish the story soon, and the children might start singing or doing an activity, which could make the room a bit noisy, even though the sign says “Quiet please.” Third, the teenager’s 3D printer will probably finish the blue model in a few minutes, and he’ll likely pick it up and show it to someone. Finally, since it’s still raining, the older man will probably stay in his armchair and keep reading for a long time.",
      scene: LIBRARY,
      checklist: ['Makes at least two predictions', 'Links predictions to details in the picture', 'Uses future forms'],
    },
    {
      id: 'm4-speaking-5', taskTypeId: 'speaking-5', draft: true,
      text: 'You and your partner are choosing a summer camp for your teenage son, and you each prefer a different one. Choose one option and persuade your partner that it is the better choice.',
      modelAnswer: "I know you like the coding camp, but I really think the soccer camp is the better choice for our son this summer. First, he already spends most of the school year in front of a screen, doing homework and playing games. A week of coding from home means even more screen time. At soccer camp, he’ll be outside, moving and getting fresh air all day. Second, it’s a great way for him to make new friends. Online, he’ll mostly be talking to a computer, but at the park he’ll be part of a team, which builds cooperation and confidence. Third, it’s actually cheaper: two hundred and twenty dollars instead of three hundred. With the eighty dollars we save, we could buy him new soccer boots. Yes, it’s twenty minutes away, but we can take turns driving. Honestly, I think this camp will be good for both his body and his mood.",
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
      modelAnswer: "Hi Mark, do you have a few minutes? There’s something I’d like to talk to you about, and I hope you’ll take it the right way. In the last few team meetings, I’ve noticed that some ideas I shared with you before the meeting were presented as yours. For example, the plan to reorganize the client files was something I suggested to you last Tuesday. I’m sure it wasn’t intentional, and I really enjoy working with you, but it’s important to me that my work is recognized, especially since my performance review is coming up. Going forward, could we make sure we mention who came up with each idea? Or, if we develop something together, we could present it as a team. I think that would be fair to both of us. What do you think?",
      checklist: ['Speaks to the chosen person directly', 'Explains the problem clearly', 'Offers a solution or alternative'],
    },
    {
      id: 'm4-speaking-7', taskTypeId: 'speaking-7', draft: true,
      text: 'Some people think elementary school students should not get any homework. What is your opinion? Explain your reasons.',
      modelAnswer: "In my opinion, elementary school students should get little or no homework, and I have two main reasons.\n\nFirst, young children need time to play, rest and be with their families. After six hours at school, a seven- or eight-year-old is usually tired. Free time to play outside, read for fun or help cook dinner is just as important for their development as worksheets. Play teaches creativity, problem-solving and social skills that are hard to learn at a desk.\n\nSecond, homework can create stress and unfairness. Some children have parents who can sit with them every evening and explain the work, while others have parents who work late or don’t speak the language well. As a result, homework often measures family support more than what the child has actually learned. I saw this with my own nephew, who used to cry over his math homework because nobody at home could help him.\n\nSome people argue that homework teaches responsibility. That’s true, but schools can build that in other ways, for example by encouraging children to read for twenty minutes a day, which is relaxing and still very useful.\n\nSo, for these reasons, I believe young children should spend their evenings learning through play, reading and family time, rather than homework.",
      checklist: ['States a clear opinion', 'Gives at least two reasons', 'Supports reasons with examples'],
    },
    {
      id: 'm4-speaking-8', taskTypeId: 'speaking-8', draft: true,
      text: 'You are at a summer festival and see an unusual food truck. Call your friend, who is planning a party, and describe it so they can decide whether to hire it.',
      modelAnswer: "Hi Nina, it’s me. You’re still planning your party next month, right? I’m at the summer festival, and I just saw the most unusual food truck. The whole truck is painted like a giant watermelon, green on the outside with red and black seeds, so you can’t miss it. But the funniest part is the ice cream. It’s shaped like vegetables! There’s a green mint ice cream that looks exactly like broccoli, and an orange mango one that looks like a carrot. Honestly, I thought they were real vegetables at first. The line is super long, so people obviously love it. There’s a sign that says you can book the truck for parties for four hundred dollars. I think the kids at your party would go crazy for it. Do you want me to grab their card?",
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
