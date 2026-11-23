import type { ListeningPart } from '../objective';

/** Module 4 listening: 6 parts, 38 questions. Original scripts in CELPIP style; each clip plays once. */
export const module4Listening: ListeningPart[] = [
  {
    id: 'm4-listening-1', taskTypeId: 'listening-1', draft: true,
    instructions: 'You will hear a conversation in three sections. Each section plays once. After each section, answer its questions.',
    clips: [
      {
        id: 'm4-l1-c1',
        intro: 'Mia and her father, Tom, are talking two days before Mia’s school trip to Montreal.',
        speakers: [{ name: 'Mia', voice: 'af_bella' }, { name: 'Tom', voice: 'bm_george' }],
        lines: [
          { speaker: 'Mia', text: 'Dad, I can’t find my health card anywhere. The school says every student needs it for the Montreal trip.' },
          { speaker: 'Tom', text: 'When did you last see it?' },
          { speaker: 'Mia', text: 'At the walk-in clinic last month, when I hurt my ankle. I’m sure I put it back in my wallet, but it’s not there now.' },
          { speaker: 'Tom', text: 'Okay, don’t panic. The bus leaves Thursday at six a.m., so we have two days. Did you check your hockey bag? You had your wallet at practice last week.' },
          { speaker: 'Mia', text: 'I checked it twice. Nothing.' },
          { speaker: 'Tom', text: 'Then we may need a replacement. But those can take a few weeks to arrive by mail.' },
        ],
        questions: [
          {
            id: 'm4l1c1-1', text: 'Why does Mia need her health card?',
            options: ['She has a doctor’s appointment', 'The school requires it for the trip', 'She needs it for hockey', 'She wants to open a bank account'],
            answer: 1,
            why: '“Every student needs it for the Montreal trip.”',
          },
          {
            id: 'm4l1c1-2', text: 'Where does Mia remember last using the card?',
            options: ['At a walk-in clinic', 'At hockey practice', 'At school', 'On the bus'],
            answer: 0,
            why: '“At the walk-in clinic last month.”',
          },
          {
            id: 'm4l1c1-3', text: 'What is the problem with getting a replacement?',
            options: ['It costs too much', 'Only Mia’s mother can apply', 'The office is closed', 'It may take weeks to arrive'],
            answer: 3,
            why: 'Replacements “can take a few weeks to arrive by mail.”',
          },
        ],
      },
      {
        id: 'm4-l1-c2',
        intro: 'Tom has made some phone calls.',
        speakers: [{ name: 'Mia', voice: 'af_bella' }, { name: 'Tom', voice: 'bm_george' }],
        lines: [
          { speaker: 'Tom', text: 'Good news and bad news. I called the clinic, and they have a lost-and-found box. They found a wallet-sized card with your name on it.' },
          { speaker: 'Mia', text: 'That’s amazing! What’s the bad news?' },
          { speaker: 'Tom', text: 'They close at five today, and I don’t finish work until five thirty. Tomorrow they’re only open in the morning, while you’re in your exam.' },
          { speaker: 'Mia', text: 'Can someone else pick it up?' },
          { speaker: 'Tom', text: 'Only a parent with photo ID, because it’s a medical document. Your mom is in Halifax until Friday.' },
          { speaker: 'Mia', text: 'So it has to be you.' },
        ],
        questions: [
          {
            id: 'm4l1c2-4', text: 'What did the clinic find?',
            options: ['Mia’s whole wallet', 'Mia’s phone', 'A card with Mia’s name', 'Nothing'],
            answer: 2,
            why: 'They found “a wallet-sized card with your name on it.”',
          },
          {
            id: 'm4l1c2-5', text: 'Why can’t Tom go to the clinic today?',
            options: ['His car is broken and in the garage', 'He works until after it closes', 'He is visiting family in Halifax', 'He has to write an exam this afternoon'],
            answer: 1,
            why: 'The clinic closes at five, and he finishes at five thirty.',
          },
          {
            id: 'm4l1c2-6', text: 'Who is allowed to pick up the card?',
            options: ['A parent with photo ID', 'Any family member', 'Mia herself', 'A teacher'],
            answer: 0,
            why: '“Only a parent with photo ID.”',
          },
        ],
      },
      {
        id: 'm4-l1-c3',
        intro: 'Tom and Mia make a plan.',
        speakers: [{ name: 'Mia', voice: 'af_bella' }, { name: 'Tom', voice: 'bm_george' }],
        lines: [
          { speaker: 'Tom', text: 'Here’s the plan. I’ll ask my manager if I can leave at four thirty today. I’ll make up the time tomorrow by starting early.' },
          { speaker: 'Mia', text: 'Do you think she’ll say yes?' },
          { speaker: 'Tom', text: 'She’s usually understanding about family things. And if she says no, I’ll take a long lunch tomorrow and drive over before noon.' },
          { speaker: 'Mia', text: 'Thanks, Dad. I’ll take a photo of the card as soon as we get it, just in case it disappears again.' },
          { speaker: 'Tom', text: 'Good idea. And maybe keep it somewhere other than your wallet this time.' },
        ],
        questions: [
          {
            id: 'm4l1c3-7', text: 'What will Tom do first?',
            options: ['Drive to the clinic at lunch', 'Call Mia’s mother', 'Apply for a new card', 'Ask to leave work early today'],
            answer: 3,
            why: '“I’ll ask my manager if I can leave at four thirty today.”',
          },
          {
            id: 'm4l1c3-8', text: 'What does Mia plan to do with the card?',
            options: ['Give it to her teacher', 'Leave it at home', 'Take a photo of it', 'Put it in her hockey bag'],
            answer: 2,
            why: '“I’ll take a photo of the card as soon as we get it.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm4-listening-2', taskTypeId: 'listening-2', draft: true,
    instructions: 'You will hear a conversation. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm4-l2-c1',
        intro: 'Rachel is returning a jacket at a clothing store. She speaks to Kevin, a sales associate.',
        speakers: [{ name: 'Kevin', voice: 'am_puck' }, { name: 'Rachel', voice: 'af_heart' }],
        lines: [
          { speaker: 'Kevin', text: 'Hi, how can I help you today?' },
          { speaker: 'Rachel', text: 'I bought this winter jacket here two weeks ago, and the zipper already broke. I’ve only worn it three or four times.' },
          { speaker: 'Kevin', text: 'I’m sorry about that. Do you have your receipt?' },
          { speaker: 'Rachel', text: 'Not the paper one, but I paid with my credit card, and I have the email receipt on my phone.' },
          { speaker: 'Kevin', text: 'That works. Since it’s within thirty days, you can get a full refund or exchange it. We do have the same jacket in your size, if you liked it.' },
          { speaker: 'Rachel', text: 'I did like it, but I’m worried the same thing will happen. Do you have something similar with a stronger zipper?' },
          { speaker: 'Kevin', text: 'This one here is a bit heavier, and it has a lifetime warranty on the zipper. It’s thirty dollars more, though.' },
          { speaker: 'Rachel', text: 'Hmm. The warranty is nice. If I exchange, do I just pay the difference?' },
          { speaker: 'Kevin', text: 'Exactly. And since you had a problem with the first one, I can give you ten percent off the new one.' },
          { speaker: 'Rachel', text: 'That’s very kind. Let’s do that.' },
        ],
        questions: [
          {
            id: 'm4l2c1-1', text: 'What is wrong with Rachel’s jacket?',
            options: ['It is the wrong size', 'The zipper broke', 'The colour faded', 'A button fell off'],
            answer: 1,
            why: '“The zipper already broke.”',
          },
          {
            id: 'm4l2c1-2', text: 'How does Rachel prove she bought the jacket?',
            options: ['With an email receipt on her phone', 'With the paper receipt from her bag', 'With the price tag still on the jacket', 'She can’t prove it, but the store believes her'],
            answer: 0,
            why: 'She has “the email receipt on my phone.”',
          },
          {
            id: 'm4l2c1-3', text: 'Why doesn’t Rachel want the same jacket again?',
            options: ['She didn’t like the style', 'It is too expensive', 'It isn’t available in her size', 'She is afraid it will break again'],
            answer: 3,
            why: '“I’m worried the same thing will happen.”',
          },
          {
            id: 'm4l2c1-4', text: 'What is special about the other jacket?',
            options: ['It is cheaper than the first jacket', 'It is fully waterproof for heavy rain', 'Its zipper has a lifetime warranty', 'It is on sale this week for members'],
            answer: 2,
            why: 'It has “a lifetime warranty on the zipper.”',
          },
          {
            id: 'm4l2c1-5', text: 'What does Kevin offer Rachel?',
            options: ['A free scarf', 'Ten percent off the new jacket', 'A full refund and a gift card', 'Free shipping'],
            answer: 1,
            why: '“I can give you ten percent off the new one.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm4-listening-3', taskTypeId: 'listening-3', draft: true,
    instructions: 'You will hear a conversation. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm4-l3-c1',
        intro: 'Mr. Ali calls his local pharmacy and speaks with Joanne, the pharmacist, about a new service.',
        speakers: [{ name: 'Joanne', voice: 'af_sarah' }, { name: 'Mr. Ali', voice: 'am_adam' }],
        lines: [
          { speaker: 'Joanne', text: 'Good afternoon, Greenway Pharmacy, Joanne speaking.' },
          { speaker: 'Mr. Ali', text: 'Hi, this is Farid Ali. I saw a poster about home delivery. Could you tell me how it works?' },
          { speaker: 'Joanne', text: 'Of course. We deliver prescriptions to homes within ten kilometres of the store, Monday to Saturday. Orders placed before noon arrive the same day, usually between three and seven.' },
          { speaker: 'Mr. Ali', text: 'Is there a charge?' },
          { speaker: 'Joanne', text: 'It’s free for seniors and for orders over thirty-five dollars. Otherwise it’s four dollars per delivery.' },
          { speaker: 'Mr. Ali', text: 'I’m sixty-eight, so that works. Does someone need to be home to sign for it?' },
          { speaker: 'Joanne', text: 'Yes. For prescriptions, the driver must hand the package to you or to an adult in your home, and they’ll ask for a signature. We can’t leave medication at the door.' },
          { speaker: 'Mr. Ali', text: 'That makes sense. Can I also get refill reminders?' },
          { speaker: 'Joanne', text: 'Yes, by text or phone call, about five days before you run out. You can sign up on our website or I can do it for you now.' },
          { speaker: 'Mr. Ali', text: 'Please do it now. Text messages are best.' },
        ],
        questions: [
          {
            id: 'm4l3c1-1', text: 'Which area does the pharmacy deliver to?',
            options: ['Homes within ten kilometres', 'Anywhere in the province', 'Only the downtown area', 'Homes within five kilometres'],
            answer: 0,
            why: '“Homes within ten kilometres of the store.”',
          },
          {
            id: 'm4l3c1-2', text: 'When must an order be placed to arrive the same day?',
            options: ['Before three', 'Before seven', 'The day before', 'Before noon'],
            answer: 3,
            why: '“Orders placed before noon arrive the same day.”',
          },
          {
            id: 'm4l3c1-3', text: 'Why will Mr. Ali not pay for delivery?',
            options: ['His order is over $35', 'He lives nearby', 'He is a senior', 'It is his first order'],
            answer: 2,
            why: 'Delivery is free for seniors, and he is sixty-eight.',
          },
          {
            id: 'm4l3c1-4', text: 'Why can’t the driver leave medication at the door?',
            options: ['It may get too cold', 'An adult must sign for it', 'Doors are often locked', 'The driver needs payment'],
            answer: 1,
            why: 'The driver must hand it to an adult and ask for a signature.',
          },
          {
            id: 'm4l3c1-5', text: 'When are refill reminders sent?',
            options: ['About five days before running out', 'On the day the medicine runs out', 'Once a month on the first day', 'Every Monday morning by email'],
            answer: 0,
            why: '“About five days before you run out.”',
          },
          {
            id: 'm4l3c1-6', text: 'What does Mr. Ali ask Joanne to do?',
            options: ['Deliver his medicine today', 'Mail him a poster', 'Call his doctor', 'Sign him up for text reminders'],
            answer: 3,
            why: '“Please do it now. Text messages are best.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm4-listening-4', taskTypeId: 'listening-4', draft: true,
    instructions: 'You will hear a news report. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm4-l4-c1',
        intro: 'A news report about a dog in the province of Nova Scotia.',
        speakers: [{ name: 'Reporter', voice: 'af_heart' }],
        lines: [
          { speaker: 'Reporter', text: 'A family in the Annapolis Valley is celebrating after their dog walked nearly two hundred kilometres to find his way home. Biscuit, a five-year-old border collie, went missing three weeks ago when he jumped out of the family’s car at a gas station near Truro.' },
          { speaker: 'Reporter', text: 'The family searched for days and posted his photo on social media, where it was shared thousands of times. Several people reported seeing a black-and-white dog walking along country roads, always heading west.' },
          { speaker: 'Reporter', text: 'On Sunday morning, eleven-year-old Owen Walsh opened the front door and found Biscuit sitting on the porch, thin and tired but otherwise healthy. A veterinarian says the dog lost about four kilos but should make a full recovery.' },
          { speaker: 'Reporter', text: 'Experts are not sure exactly how dogs find their way over such long distances. Some believe they use their strong sense of smell, while others think they may sense the earth’s magnetic field. The Walsh family says they don’t mind how Biscuit did it. They have already bought him a GPS collar.' },
        ],
        questions: [
          {
            id: 'm4l4c1-1', text: 'How did Biscuit get lost?',
            options: ['He ran away from home during a storm', 'He was stolen from the family’s yard', 'He jumped out of the car at a gas station', 'He got lost while hiking near Truro'],
            answer: 2,
            why: 'He “jumped out of the family’s car at a gas station near Truro.”',
          },
          {
            id: 'm4l4c1-2', text: 'How did people help the family?',
            options: ['They drove him home from Truro', 'They shared his photo and reported sightings', 'They searched the forest with other dogs', 'They called the police to look for him'],
            answer: 1,
            why: 'His photo was shared, and people reported seeing him.',
          },
          {
            id: 'm4l4c1-3', text: 'Who found Biscuit when he returned?',
            options: ['Owen, an eleven-year-old boy', 'The family’s veterinarian', 'A neighbour walking past the house', 'A worker from the gas station'],
            answer: 0,
            why: 'Owen Walsh “found Biscuit sitting on the porch.”',
          },
          {
            id: 'm4l4c1-4', text: 'What was Biscuit’s condition?',
            options: ['Badly injured', 'Very sick', 'Perfectly normal', 'Thin but healthy'],
            answer: 3,
            why: 'He was “thin and tired but otherwise healthy.”',
          },
          {
            id: 'm4l4c1-5', text: 'What have the family done since Biscuit came home?',
            options: ['Moved closer to Truro', 'Built a fence', 'Bought him a GPS collar', 'Given him to a farm'],
            answer: 2,
            why: '“They have already bought him a GPS collar.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm4-listening-5', taskTypeId: 'listening-5', draft: true,
    instructions: 'You will hear a discussion between three students. It plays once. Note their names before you listen: Nora, Ethan and Ravi. Then answer the questions.',
    clips: [
      {
        id: 'm4-l5-c1',
        intro: 'Nora, Ethan and Ravi are choosing a topic for a group project in their college environmental studies class.',
        speakers: [{ name: 'Nora', voice: 'bf_emma' }, { name: 'Ethan', voice: 'am_michael' }, { name: 'Ravi', voice: 'am_puck' }],
        lines: [
          { speaker: 'Nora', text: 'Okay, we need to choose a topic by Monday. The project is a fifteen-minute presentation on an environmental issue in our city.' },
          { speaker: 'Ethan', text: 'What about plastic in the river? There was that news story last month about it.' },
          { speaker: 'Ravi', text: 'I like it, but I think the group before us did plastic last term. The professor said she wants something new.' },
          { speaker: 'Nora', text: 'Good point. How about the trees being cut down for the new highway? We could interview people who live nearby.' },
          { speaker: 'Ethan', text: 'That’s interesting, but it might be too political. People get very emotional about that highway.' },
          { speaker: 'Ravi', text: 'Isn’t that what makes it a good topic, though? We’d show both sides.' },
          { speaker: 'Nora', text: 'I agree with Ravi. And there’s a public meeting about it next Thursday. We could go and take notes.' },
          { speaker: 'Ethan', text: 'Okay, I’m convinced. But we should split the work fairly. Last time, one person did almost everything.' },
          { speaker: 'Ravi', text: 'I’ll research the city’s plans and the environmental report.' },
          { speaker: 'Nora', text: 'I’ll do the interviews with residents. Ethan, could you make the slides? You’re the best at design.' },
          { speaker: 'Ethan', text: 'Sure. And I’ll book a room in the library so we can practise the week before.' },
        ],
        questions: [
          {
            id: 'm4l5c1-1', text: 'What do they need to decide by Monday?',
            options: ['Who will give the presentation', 'A topic for their presentation', 'Where to hold their group meetings', 'Which class they should take next'],
            answer: 1,
            why: '“We need to choose a topic by Monday.”',
          },
          {
            id: 'm4l5c1-2', text: 'Why does Ravi object to the plastic topic?',
            options: ['Another group used it recently', 'It is too difficult', 'There is no information about it', 'The professor dislikes rivers'],
            answer: 0,
            why: 'The group before them did plastic last term.',
          },
          {
            id: 'm4l5c1-3', text: 'What topic does Nora suggest?',
            options: ['Air pollution downtown', 'Recycling at the college', 'Plastic in the river', 'Trees cut down for a highway'],
            answer: 3,
            why: '“The trees being cut down for the new highway.”',
          },
          {
            id: 'm4l5c1-4', text: 'What is Ethan’s concern about Nora’s topic?',
            options: ['It is too boring', 'It needs too much travel', 'It may be too political', 'Nobody will want to be interviewed'],
            answer: 2,
            why: '“It might be too political.”',
          },
          {
            id: 'm4l5c1-5', text: 'Why does Ravi think the topic is good?',
            options: ['It is easy to research', 'They can present both sides', 'The professor suggested it', 'Ethan knows a lot about it'],
            answer: 1,
            why: '“We’d show both sides.”',
          },
          {
            id: 'm4l5c1-6', text: 'What will happen next Thursday?',
            options: ['A public meeting about the highway', 'They will give their presentation', 'They have an exam in another class', 'There is a workshop at the library'],
            answer: 0,
            why: '“There’s a public meeting about it next Thursday.”',
          },
          {
            id: 'm4l5c1-7', text: 'What will Nora do for the project?',
            options: ['Make the slides', 'Research the city’s plans', 'Book a room', 'Interview residents'],
            answer: 3,
            why: '“I’ll do the interviews with residents.”',
          },
          {
            id: 'm4l5c1-8', text: 'Why does Ethan want to book a library room?',
            options: ['To study for their final exams together', 'To interview people who live near the highway', 'To practise before presenting', 'To meet the professor about their topic'],
            answer: 2,
            why: 'So they can practise the week before.',
          },
        ],
      },
    ],
  },
  {
    id: 'm4-listening-6', taskTypeId: 'listening-6', draft: true,
    instructions: 'You will hear a radio talk. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm4-l6-c1',
        intro: 'A radio host talks about tiny homes as a solution to high housing costs.',
        speakers: [{ name: 'Host', voice: 'am_michael' }],
        lines: [
          { speaker: 'Host', text: 'Good morning. With rents and house prices rising in many Canadian cities, some people are thinking small, very small. Today we’re talking about tiny homes: houses of usually less than four hundred square feet, sometimes built on wheels.' },
          { speaker: 'Host', text: 'Supporters say tiny homes offer an affordable path to owning a home. A well-built tiny house can cost a fraction of a regular house, and owners often have much lower energy bills. Many owners also say living with fewer things has made their lives simpler and less stressful.' },
          { speaker: 'Host', text: 'But there are real obstacles. In many towns, building rules don’t allow people to live full-time in a home that small, or they require homes to be connected to city water and sewer systems. Finding land is another problem. Some owners end up parking their homes in a friend’s backyard without clear permission.' },
          { speaker: 'Host', text: 'Then there’s daily life. Cooking for a family, working from home or having guests can be difficult in a single small room. Some people who moved into tiny homes have moved out again after a year or two, especially after having children.' },
          { speaker: 'Host', text: 'Urban planner Dr. Amina Yusuf believes tiny homes can help, but only as part of a bigger plan. She suggests that cities set aside land for small-home communities, with shared gardens and laundry rooms, and update their rules so these homes can be legal and safe. Tiny homes alone, she says, won’t fix the housing crisis, but they can give some people a door into home ownership.' },
        ],
        questions: [
          {
            id: 'm4l6c1-1', text: 'What size are tiny homes usually?',
            options: ['About one thousand square feet', 'Less than four hundred square feet', 'The size of an apartment', 'More than four hundred square feet'],
            answer: 1,
            why: 'They are “usually less than four hundred square feet.”',
          },
          {
            id: 'm4l6c1-2', text: 'What advantage do supporters mention?',
            options: ['Lower costs and energy bills', 'More space for families', 'Better locations', 'Free land from the city'],
            answer: 0,
            why: 'They cost a fraction of a regular house and have lower energy bills.',
          },
          {
            id: 'm4l6c1-3', text: 'What problem do building rules create?',
            options: ['They require every tiny home to have wheels', 'They make tiny homes very expensive to build', 'They ban shared gardens in small-home areas', 'They may not allow living full-time in a tiny home'],
            answer: 3,
            why: 'Rules may not allow people to live full-time in a home that small.',
          },
          {
            id: 'm4l6c1-4', text: 'Why do some people move out of tiny homes?',
            options: ['The homes become too expensive to heat in winter', 'The homes are usually too far from work and schools', 'Family life becomes difficult, especially with children', 'The homes start to fall apart after a year or two'],
            answer: 2,
            why: 'Some moved out “especially after having children.”',
          },
          {
            id: 'm4l6c1-5', text: 'What does Dr. Yusuf suggest?',
            options: ['Banning tiny homes until the rules change', 'Communities of small homes with shared spaces', 'Building only large houses for families', 'Putting tiny homes in friends’ backyards'],
            answer: 1,
            why: 'Cities should set aside land for small-home communities with shared gardens and laundry.',
          },
          {
            id: 'm4l6c1-6', text: 'What is Dr. Yusuf’s overall view?',
            options: ['Tiny homes can help some people but won’t solve the crisis', 'Tiny homes will end the housing crisis on their own', 'Tiny homes are a bad idea for almost everyone', 'Only young people without children should live in them'],
            answer: 0,
            why: '“Tiny homes alone… won’t fix the housing crisis, but they can give some people a door into home ownership.”',
          },
        ],
      },
    ],
  },
];
