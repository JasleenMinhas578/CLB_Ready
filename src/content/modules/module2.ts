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
      modelAnswer: "Hey Priya, I heard you’re presenting next week, and I can tell you’re nervous. Honestly, that’s completely normal, and I think you’ll do great. Here are a few things that helped me.\n\nFirst, practise out loud, not just in your head. Try presenting to a friend, or even to your phone camera, three or four times. When you hear yourself, you’ll notice which sentences are hard to say, and you can make them simpler. Simple English is clearer anyway.\n\nSecond, prepare your first minute really well. If you know exactly how you’ll start, you’ll feel calm, and the rest usually flows from there. You could even memorize your opening lines.\n\nThird, use your slides as a guide. Put a few key words on each slide, so if you forget something, you can just look up and continue. Don’t write full sentences, though, or you’ll end up reading.\n\nAnd finally, remember that people want you to succeed. If you make a small mistake, just smile and keep going. Nobody will mind.\n\nIf you like, we could do a practice run together on Thursday at lunch. I’d be happy to listen and give you some feedback.",
      checklist: ['Gives at least two pieces of advice', 'Gives a reason for each', 'Uses a friendly, supportive tone'],
    },
    {
      id: 'm2-speaking-2', taskTypeId: 'speaking-2', draft: true,
      text: 'Talk about a time when you helped a stranger. What happened, and how did you feel afterwards?',
      modelAnswer: "A couple of winters ago, I was walking home from the bus stop on a really icy evening when I saw an older man slip and fall on the sidewalk. He wasn’t badly hurt, but he couldn’t get up on his own, and his groceries were everywhere. I ran over, helped him sit up slowly, and asked if he needed an ambulance. He said he was fine, just shaken, so I picked up his bags and walked with him to his apartment, which was only two blocks away. On the way, he told me he’d lived in the neighbourhood for forty years. When we got to his door, he thanked me again and again. Afterwards, I felt really happy that I’d been there at the right moment. It reminded me that even a small act of kindness can make a big difference to someone’s day.",
      checklist: ['Says when and where it happened', 'Describes what happened in order', 'Explains how they felt'],
    },
    {
      id: 'm2-speaking-3', taskTypeId: 'speaking-3', draft: true,
      text: 'Describe the scene in the picture to a friend who cannot see it. Include as many details as you can.',
      modelAnswer: "This picture shows a city park on a hot summer afternoon. In the front, a family is having a picnic on a red-and-white checked blanket, and a dog is sneaking a sandwich out of their picnic basket while nobody is watching. On the left, several children are playing on a climbing frame, and a mother is gently pushing a baby in a swing. Near the middle, there’s a man trying to walk five dogs at the same time, and their leashes have become completely tangled around a park bench. On the right side, an ice cream truck is parked, with a long line of people waiting for a cold treat. In the background, behind the trees, grey clouds are starting to build up, and a few people are looking up at the sky, probably wondering if it’s going to rain.",
      scene: PARK,
      checklist: ['Describes the setting', 'Describes people and what they are doing', 'Mentions colours or positions'],
    },
    {
      id: 'm2-speaking-4', taskTypeId: 'speaking-4', draft: true,
      text: 'Look at the same picture. What do you think will probably happen next? Explain why.',
      modelAnswer: "I think a few things will probably happen next. First, the family will soon notice that the dog has taken their sandwich. The kids might laugh, but the parents will likely chase the dog or move the basket out of reach. Second, the man with the five dogs will probably have to stop and untangle the leashes, and he might even need someone to help him, because the dogs look excited. Third, since those grey clouds are building up, I expect it will start raining fairly soon. When that happens, the family will pack up their picnic, the mother will take the baby out of the swing, and some people in line at the ice cream truck may decide to leave. The ice cream seller will probably lose a few customers, but he might sell a few more cones before the rain starts.",
      scene: PARK,
      checklist: ['Makes at least two predictions', 'Links predictions to details in the picture', 'Uses future forms'],
    },
    {
      id: 'm2-speaking-5', taskTypeId: 'speaking-5', draft: true,
      text: 'You and your brother are buying a birthday present for your father, and you each prefer a different gift. Choose one option and persuade your brother that it is the better choice.',
      modelAnswer: "I know you like the speaker idea, but I really think the cooking class is the better gift for Dad. First, Dad already has a radio in the kitchen and music on his phone, so a speaker wouldn’t really change much for him. A cooking class, on the other hand, is something new and special. Second, it’s an experience, not just another object. He can bring a friend, maybe Mom, and they’ll spend a fun Saturday evening together downtown. Three hours of cooking, eating and laughing is something he’ll actually remember. And it’s only thirty dollars more than the speaker, so if we split it, that’s just fifteen dollars extra each. Finally, you know how much he loves trying new recipes. He’ll come home with new skills and probably cook for all of us. So honestly, this gift is a win for the whole family.",
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
      modelAnswer: "Hey Alex, thanks for asking me to be your reference. I’m really happy you’re applying for this job, and I’d like to help. Before I say yes, though, I want to be honest with you about one thing, because I think it matters. When we worked together, you were often late, sometimes by twenty or thirty minutes. If the manager asks me about your reliability, I can’t say that you’re always on time. I don’t want to hurt your chances, but I also don’t want to say something that isn’t true. So here’s my suggestion: I’ll happily be your reference and talk about how hard-working and friendly you are, because you really are. But please make being on time a priority in this new job. Maybe set two alarms, or plan to arrive fifteen minutes early. Does that sound fair to you?",
      checklist: ['Speaks to the chosen person directly', 'Explains the problem clearly', 'Offers a solution or alternative'],
    },
    {
      id: 'm2-speaking-7', taskTypeId: 'speaking-7', draft: true,
      text: 'Some people think downtown streets should be closed to cars on weekends so people can walk and shop safely. What is your opinion? Explain your reasons.',
      modelAnswer: "I believe closing downtown streets to cars on weekends is a great idea, for two main reasons.\n\nFirst, it would make downtown much safer and more pleasant. On weekends, families, tourists and older people walk around to shop and eat. Without cars, children could walk freely, people could cross the street anywhere, and the air would be cleaner and quieter. Many European cities already do this, and their downtown areas are full of life.\n\nSecond, it could actually help local businesses. Some shop owners worry they’ll lose customers who drive, but people on foot tend to stay longer and visit more shops. Restaurants could put tables on the street, and the city could organize markets or live music, which would attract even more visitors.\n\nOf course, some people, like those with disabilities or businesses that need deliveries, still need access. The city could solve this with special permits, more buses on weekends and parking lots just outside the downtown area.\n\nSo overall, I think the benefits are much bigger than the problems. Closing the streets to cars on weekends would turn downtown into a place people actually want to spend time in, rather than just drive through.",
      checklist: ['States a clear opinion', 'Gives at least two reasons', 'Supports reasons with examples'],
    },
    {
      id: 'm2-speaking-8', taskTypeId: 'speaking-8', draft: true,
      text: 'You are in a second-hand furniture store and call a friend who loves unusual furniture. Describe what you see so your friend can decide whether to buy it.',
      modelAnswer: "Hi Sam, it’s me. I’m at the second-hand furniture store on Main Street, and I just found something you’re going to love. It’s an armchair made completely out of old skateboards. The seat and the back are skateboard decks, and they’re covered in bright, colourful stickers, so it looks really fun and a bit wild. The best part is that there are four skateboard wheels attached under the legs, so the chair can actually roll around. There’s a thin blue cushion on the seat, so it’s a little more comfortable, although I don’t think you’d want to sit in it for hours. It’s a hundred and forty dollars, which isn’t cheap, but you won’t find anything like it anywhere else. I think it would be perfect for your studio. Do you want me to send you a photo before someone else buys it?",
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
