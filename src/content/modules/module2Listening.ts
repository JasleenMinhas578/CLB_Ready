import type { ListeningPart } from '../objective';

/** Module 2 listening: 6 parts, 38 questions. Original scripts in CELPIP style; each clip plays once. */
export const module2Listening: ListeningPart[] = [
  {
    id: 'm2-listening-1', taskTypeId: 'listening-1', draft: true,
    instructions: 'You will hear a conversation in three sections. Each section plays once. After each section, answer its questions.',
    clips: [
      {
        id: 'm2-l1-c1',
        intro: 'Nadia and Carlos are planning a surprise party for their friend Tom’s 40th birthday.',
        speakers: [{ name: 'Nadia', voice: 'af_bella' }, { name: 'Carlos', voice: 'am_adam' }],
        lines: [
          { speaker: 'Nadia', text: 'Carlos, we have a problem. The restaurant just called. They double-booked their party room for Saturday night.' },
          { speaker: 'Carlos', text: 'You’re kidding. We already sent the invitations to thirty people.' },
          { speaker: 'Nadia', text: 'I know. They offered us Sunday afternoon instead, but Tom’s sister flies back to Winnipeg on Sunday morning.' },
          { speaker: 'Carlos', text: 'And she’s the one who planned the slideshow. We can’t do it without her.' },
          { speaker: 'Nadia', text: 'Exactly. So we either find a new place for Saturday, or we change the date for everyone.' },
          { speaker: 'Carlos', text: 'Changing the date means calling thirty people without Tom finding out. That sounds impossible.' },
        ],
        questions: [
          {
            id: 'm2l1c1-1', text: 'What is the problem?',
            options: ['Tom found out about the surprise party', 'The party room is no longer available on Saturday', 'The invitations were sent to the wrong people', 'The restaurant has closed for renovations'],
            answer: 1,
            why: 'The restaurant “double-booked their party room for Saturday night.”',
          },
          {
            id: 'm2l1c1-2', text: 'Why can’t they use the room on Sunday?',
            options: ['Tom’s sister will have left', 'Tom works on Sundays', 'The restaurant is closed then', 'It is too expensive'],
            answer: 0,
            why: 'Tom’s sister “flies back to Winnipeg on Sunday morning.”',
          },
          {
            id: 'm2l1c1-3', text: 'Why does Carlos not want to change the date?',
            options: ['He is busy every evening next weekend', 'Tom’s actual birthday is on Saturday', 'Many of the guests live far from the city', 'It would be hard to tell everyone secretly'],
            answer: 3,
            why: 'Calling thirty people “without Tom finding out” sounds impossible.',
          },
        ],
      },
      {
        id: 'm2-l1-c2',
        intro: 'Nadia and Carlos look at other places for the party.',
        speakers: [{ name: 'Nadia', voice: 'af_bella' }, { name: 'Carlos', voice: 'am_adam' }],
        lines: [
          { speaker: 'Carlos', text: 'What about my brother’s backyard? It’s big enough, and he already said we could use it.' },
          { speaker: 'Nadia', text: 'The weather forecast says rain all Saturday evening. Thirty people in the rain isn’t much of a party.' },
          { speaker: 'Carlos', text: 'Fair point. What about the community hall on Elm Street?' },
          { speaker: 'Nadia', text: 'I called them. It’s free on Saturday, and it costs two hundred and fifty dollars. But we’d have to bring our own food and clean up by eleven.' },
          { speaker: 'Carlos', text: 'The restaurant was charging us four hundred with food, so that might actually work out. We could order pizza and make a few salads.' },
          { speaker: 'Nadia', text: 'True. The hall also has a projector, so the slideshow would be easy.' },
        ],
        questions: [
          {
            id: 'm2l1c2-4', text: 'Why does Nadia reject the backyard?',
            options: ['It is too small', 'Carlos’s brother said no', 'Rain is expected', 'It is too far away'],
            answer: 2,
            why: 'The forecast “says rain all Saturday evening.”',
          },
          {
            id: 'm2l1c2-5', text: 'What is one condition of renting the hall?',
            options: ['They must order food from the hall', 'They must clean up by eleven', 'They must leave by nine', 'They must pay four hundred dollars'],
            answer: 1,
            why: 'They would have to “clean up by eleven.”',
          },
          {
            id: 'm2l1c2-6', text: 'What useful equipment does the hall have?',
            options: ['A projector', 'A kitchen', 'A sound system', 'Tables and chairs'],
            answer: 0,
            why: '“The hall also has a projector.”',
          },
        ],
      },
      {
        id: 'm2-l1-c3',
        intro: 'Nadia and Carlos decide what to do.',
        speakers: [{ name: 'Nadia', voice: 'af_bella' }, { name: 'Carlos', voice: 'am_adam' }],
        lines: [
          { speaker: 'Nadia', text: 'Okay, let’s book the hall. I’ll pay the deposit online tonight.' },
          { speaker: 'Carlos', text: 'Great. Then I’ll send everyone a short message with the new address. I’ll say the restaurant had a problem, so nobody is confused.' },
          { speaker: 'Nadia', text: 'Just make sure you don’t add Tom to the group chat by mistake.' },
          { speaker: 'Carlos', text: 'Ha! I’ll triple-check. And I’ll ask my brother to help with the food, since he can’t host it anymore.' },
        ],
        questions: [
          {
            id: 'm2l1c3-7', text: 'What will Nadia do tonight?',
            options: ['Call the restaurant', 'Send a message to the guests', 'Buy the food', 'Pay the deposit for the hall'],
            answer: 3,
            why: '“I’ll pay the deposit online tonight.”',
          },
          {
            id: 'm2l1c3-8', text: 'What will Carlos ask his brother to do?',
            options: ['Host the party', 'Make the slideshow', 'Help with the food', 'Tell Tom about the party'],
            answer: 2,
            why: '“I’ll ask my brother to help with the food.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm2-listening-2', taskTypeId: 'listening-2', draft: true,
    instructions: 'You will hear a conversation. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm2-l2-c1',
        intro: 'Lucas brings his bicycle to a repair shop and talks to Diane, a mechanic.',
        speakers: [{ name: 'Lucas', voice: 'am_puck' }, { name: 'Diane', voice: 'af_sarah' }],
        lines: [
          { speaker: 'Diane', text: 'Hi there. What can I do for you?' },
          { speaker: 'Lucas', text: 'My bike makes a loud clicking sound when I change gears, and yesterday the chain came off twice on my way to work.' },
          { speaker: 'Diane', text: 'Let me take a look. Okay, your chain is very worn. See how it stretches when I pull it? That’s why it slips.' },
          { speaker: 'Lucas', text: 'Is that expensive to fix?' },
          { speaker: 'Diane', text: 'A new chain is thirty-five dollars, plus twenty for labour. But I’d also check the back gears, because a worn chain often damages them too. If they need replacing, it’s another sixty.' },
          { speaker: 'Lucas', text: 'Hmm. I ride to work every day, so I really need it by Thursday.' },
          { speaker: 'Diane', text: 'We’re quite busy, but if you leave it today, I can have it ready Wednesday afternoon. I’ll call you before I replace the gears, so there are no surprises.' },
          { speaker: 'Lucas', text: 'Perfect. Do you have a bike I could borrow in the meantime?' },
          { speaker: 'Diane', text: 'We don’t lend bikes, but the city bike-share station is right outside. A day pass is five dollars.' },
        ],
        questions: [
          {
            id: 'm2l2c1-1', text: 'What happened to Lucas’s bike yesterday?',
            options: ['A tire went flat', 'The chain came off', 'The brakes stopped working', 'The seat broke'],
            answer: 1,
            why: '“Yesterday the chain came off twice.”',
          },
          {
            id: 'm2l2c1-2', text: 'What does Diane say is the main cause?',
            options: ['The chain is worn out', 'The bike is too old', 'The gears are loose', 'Lucas changes gears too fast'],
            answer: 0,
            why: '“Your chain is very worn… That’s why it slips.”',
          },
          {
            id: 'm2l2c1-3', text: 'How much will the repair cost if only the chain is replaced?',
            options: ['$35', '$60', '$115', '$55'],
            answer: 3,
            why: '$35 for the chain plus $20 for labour.',
          },
          {
            id: 'm2l2c1-4', text: 'What does Diane promise to do?',
            options: ['Finish the whole repair later today', 'Lend Lucas a shop bike for the week', 'Call before replacing the gears', 'Give Lucas a discount on the new gears'],
            answer: 2,
            why: '“I’ll call you before I replace the gears.”',
          },
          {
            id: 'm2l2c1-5', text: 'How does Diane suggest Lucas get around?',
            options: ['Take the bus', 'Use the city bike-share', 'Borrow a shop bike', 'Walk to work'],
            answer: 1,
            why: 'She points to the city bike-share station outside.',
          },
        ],
      },
    ],
  },
  {
    id: 'm2-listening-3', taskTypeId: 'listening-3', draft: true,
    instructions: 'You will hear a conversation. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm2-l3-c1',
        intro: 'Yuki, a newcomer to the city, is asking Paul at a community centre about an English conversation group.',
        speakers: [{ name: 'Yuki', voice: 'af_heart' }, { name: 'Paul', voice: 'am_michael' }],
        lines: [
          { speaker: 'Yuki', text: 'Hello. A friend told me you have a free English conversation group here?' },
          { speaker: 'Paul', text: 'We do. It’s called the Conversation Circle, and it meets every Tuesday and Thursday evening from six thirty to eight.' },
          { speaker: 'Yuki', text: 'Do I need to take a test first?' },
          { speaker: 'Paul', text: 'No test. We just ask you to fill out a short form so we can put you in a small group with people at a similar level. Each group has about six learners and one volunteer leader.' },
          { speaker: 'Yuki', text: 'That sounds good. What do you talk about?' },
          { speaker: 'Paul', text: 'Everyday topics, like shopping, health care or job interviews. Each month has a theme. This month it’s finding work, so we’re practising how to talk about your experience.' },
          { speaker: 'Yuki', text: 'Perfect, that’s exactly what I need. Is there anything for children? I have a six-year-old daughter.' },
          { speaker: 'Paul', text: 'Yes, there’s free childcare in the room next door during the sessions. You just need to register her a day in advance, because space is limited.' },
          { speaker: 'Yuki', text: 'Wonderful. Can I start this Thursday?' },
          { speaker: 'Paul', text: 'You can. Come fifteen minutes early so we can go over your form. And bring a notebook. Most people like to write down new expressions.' },
        ],
        questions: [
          {
            id: 'm2l3c1-1', text: 'When does the Conversation Circle meet?',
            options: ['Tuesday and Thursday evenings', 'Every weekday morning before work', 'Saturday and Sunday afternoons', 'On the first Monday of each month'],
            answer: 0,
            why: '“Every Tuesday and Thursday evening from six thirty to eight.”',
          },
          {
            id: 'm2l3c1-2', text: 'Why do new learners fill out a form?',
            options: ['To pay for the program before it starts', 'To take a short English test on paper', 'To choose a volunteer leader they like', 'To be placed with learners at a similar level'],
            answer: 3,
            why: '“So we can put you in a small group with people at a similar level.”',
          },
          {
            id: 'm2l3c1-3', text: 'What is this month’s theme?',
            options: ['Shopping', 'Health care', 'Finding a job', 'Travel'],
            answer: 2,
            why: '“This month it’s finding work.”',
          },
          {
            id: 'm2l3c1-4', text: 'What must Yuki do to use the childcare?',
            options: ['Pay a small fee for each evening', 'Register her daughter a day ahead', 'Bring her daughter’s own snacks', 'Volunteer in the childcare room once'],
            answer: 1,
            why: '“You just need to register her a day in advance.”',
          },
          {
            id: 'm2l3c1-5', text: 'Why should Yuki arrive early on Thursday?',
            options: ['To go over her form', 'To meet the childcare staff', 'To get a good seat', 'To take a short test'],
            answer: 0,
            why: '“Come fifteen minutes early so we can go over your form.”',
          },
          {
            id: 'm2l3c1-6', text: 'What does Paul suggest Yuki bring?',
            options: ['A dictionary', 'Her resume', 'Photo ID', 'A notebook'],
            answer: 3,
            why: '“And bring a notebook.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm2-listening-4', taskTypeId: 'listening-4', draft: true,
    instructions: 'You will hear a news report. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm2-l4-c1',
        intro: 'A news report about a high school student in the town of Brookfield.',
        speakers: [{ name: 'Reporter', voice: 'af_sarah' }],
        lines: [
          { speaker: 'Reporter', text: 'A grade 12 student from Brookfield has won first place at a national science fair for an app that helps farmers spot sick plants early. Seventeen-year-old Arjun Mehta came up with the idea after a disease damaged half the potato crop on his grandparents’ farm two summers ago.' },
          { speaker: 'Reporter', text: 'His app uses a phone camera to check the colour and shape of leaves. If it finds signs of disease, it warns the farmer and suggests what to do next. In tests on three local farms, the app correctly identified problems about nine times out of ten.' },
          { speaker: 'Reporter', text: 'Arjun says the hardest part was collecting enough photos. He spent most of last summer walking through fields and taking more than twenty thousand pictures. His science teacher, Ms. Laura Chen, says she has never seen a student work so hard on a project.' },
          { speaker: 'Reporter', text: 'Along with the prize, Arjun received a five-thousand-dollar scholarship. He plans to study computer science next fall and says he wants to make the app free for every farmer in Canada.' },
        ],
        questions: [
          {
            id: 'm2l4c1-1', text: 'What does Arjun’s app do?',
            options: ['It predicts the weather for farmers', 'It counts farm animals', 'It helps find disease in plants', 'It sells vegetables online'],
            answer: 2,
            why: 'It helps farmers “spot sick plants early.”',
          },
          {
            id: 'm2l4c1-2', text: 'What gave Arjun the idea?',
            options: ['His science teacher gave him the topic', 'A disease damaged his grandparents’ crop', 'He read about the problem in the news', 'He worked on a large farm last summer'],
            answer: 1,
            why: 'A disease “damaged half the potato crop on his grandparents’ farm.”',
          },
          {
            id: 'm2l4c1-3', text: 'How accurate was the app in tests?',
            options: ['Right about nine times out of ten', 'Right about half the time', 'Always right', 'Right about three times out of four'],
            answer: 0,
            why: 'It “correctly identified problems about nine times out of ten.”',
          },
          {
            id: 'm2l4c1-4', text: 'What was the most difficult part of the project?',
            options: ['Writing the code', 'Finding farms to test it', 'Paying for the phone', 'Collecting enough photos'],
            answer: 3,
            why: '“The hardest part was collecting enough photos.”',
          },
          {
            id: 'm2l4c1-5', text: 'What does Arjun hope to do with the app?',
            options: ['Sell it to a big company', 'Use it only on his family’s farm', 'Offer it free to all Canadian farmers', 'Turn it into a game'],
            answer: 2,
            why: 'He wants “to make the app free for every farmer in Canada.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm2-listening-5', taskTypeId: 'listening-5', draft: true,
    instructions: 'You will hear a discussion between three family members. It plays once. Note their names before you listen: Grace, Sam and Rosa. Then answer the questions.',
    clips: [
      {
        id: 'm2-l5-c1',
        intro: 'Grace, her brother Sam and their cousin Rosa are planning their grandmother’s 80th birthday.',
        speakers: [{ name: 'Grace', voice: 'af_heart' }, { name: 'Sam', voice: 'bm_george' }, { name: 'Rosa', voice: 'bf_emma' }],
        lines: [
          { speaker: 'Grace', text: 'So, Grandma turns eighty in June. I think we should do something big. Maybe rent a hall and invite all the relatives.' },
          { speaker: 'Sam', text: 'I’m not sure she’d enjoy that. Remember at Christmas? She left early because it was too loud.' },
          { speaker: 'Rosa', text: 'Sam’s right. She gets tired in big crowds. What she really loves is being outside, in her garden or by the lake.' },
          { speaker: 'Grace', text: 'Okay, so what about a picnic at the lake? Just close family, maybe fifteen people.' },
          { speaker: 'Sam', text: 'I like that. But we need a backup plan if it rains.' },
          { speaker: 'Rosa', text: 'My place is only ten minutes from the lake. If the weather is bad, we can move everything there.' },
          { speaker: 'Grace', text: 'Perfect. And for a gift, I was thinking we could all put money together for a new garden bench. Hers is falling apart.' },
          { speaker: 'Sam', text: 'Good idea, but let’s also make a photo album. She’s always saying she wants her old pictures organized.' },
          { speaker: 'Rosa', text: 'I have a lot of her old photos already. I can scan them this month.' },
          { speaker: 'Grace', text: 'Great. Then I’ll order the bench, and Sam, can you send the invitations?' },
          { speaker: 'Sam', text: 'Sure. I’ll do it this weekend.' },
        ],
        questions: [
          {
            id: 'm2l5c1-1', text: 'What does Grace first suggest?',
            options: ['A picnic at the lake', 'A large party in a rented hall', 'A dinner at a restaurant', 'A trip to see relatives'],
            answer: 1,
            why: 'Grace suggests renting a hall and inviting all the relatives.',
          },
          {
            id: 'm2l5c1-2', text: 'Why does Sam doubt Grace’s first idea?',
            options: ['Their grandmother found a loud party tiring before', 'It would cost too much', 'The relatives live too far away', 'Their grandmother doesn’t like surprises'],
            answer: 0,
            why: 'At Christmas “she left early because it was too loud.”',
          },
          {
            id: 'm2l5c1-3', text: 'What does Rosa say their grandmother enjoys?',
            options: ['Big family dinners', 'Travelling', 'Looking at photos', 'Being outdoors'],
            answer: 3,
            why: '“What she really loves is being outside.”',
          },
          {
            id: 'm2l5c1-4', text: 'How many people do they plan to invite?',
            options: ['About eighty', 'About thirty', 'About fifteen', 'Only the three of them'],
            answer: 2,
            why: '“Just close family, maybe fifteen people.”',
          },
          {
            id: 'm2l5c1-5', text: 'What is the plan if it rains?',
            options: ['Rent a community hall near the lake', 'Move the party to Rosa’s home', 'Change the date to the next weekend', 'Put up a large tent beside the lake'],
            answer: 1,
            why: 'Rosa: “If the weather is bad, we can move everything there.”',
          },
          {
            id: 'm2l5c1-6', text: 'Why do they choose a garden bench as a gift?',
            options: ['Their grandmother’s bench is in bad condition', 'Their grandmother asked for one at Christmas', 'The bench they liked was on sale this month', 'Rosa has an extra one that she doesn’t need'],
            answer: 0,
            why: 'Grace: “Hers is falling apart.”',
          },
          {
            id: 'm2l5c1-7', text: 'What will Rosa do this month?',
            options: ['Order the bench', 'Send the invitations', 'Book the lake', 'Scan old photos'],
            answer: 3,
            why: '“I can scan them this month.”',
          },
          {
            id: 'm2l5c1-8', text: 'What will Sam do this weekend?',
            options: ['Buy the bench', 'Visit their grandmother', 'Send the invitations', 'Make the photo album'],
            answer: 2,
            why: 'Grace asks Sam to send the invitations, and he says he’ll do it this weekend.',
          },
        ],
      },
    ],
  },
  {
    id: 'm2-listening-6', taskTypeId: 'listening-6', draft: true,
    instructions: 'You will hear a radio talk. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm2-l6-c1',
        intro: 'A radio host discusses when children should get their first smartphone.',
        speakers: [{ name: 'Host', voice: 'bm_george' }],
        lines: [
          { speaker: 'Host', text: 'Welcome back. Today’s question comes up in almost every family: at what age should a child get a smartphone? Surveys suggest many Canadian children now get one by the age of eleven or twelve, often when they start walking to school alone.' },
          { speaker: 'Host', text: 'For many parents, the main reason is safety. A phone means a child can call home if a bus is late or plans change. Some parents also say that, without a phone, children can feel left out, because so much of their social life now happens in group chats.' },
          { speaker: 'Host', text: 'On the other side, a growing number of teachers and doctors are raising concerns. They point to research linking heavy phone use with poorer sleep and difficulty concentrating. Some schools have now banned phones during class, and teachers report that students talk to each other more at lunch.' },
          { speaker: 'Host', text: 'Some families are choosing a middle path. They give younger children a basic phone that can only call and text, and wait until high school for a smartphone. Others sign a family agreement that sets rules, such as no phones at dinner and all devices charging outside the bedroom at night.' },
          { speaker: 'Host', text: 'Child psychologist Dr. Lena Moreau says the age matters less than the conversation. In her view, parents should explain the rules, model good habits themselves, and loosen the rules slowly as children show they can handle more freedom. After the break, we’ll take your calls.' },
        ],
        questions: [
          {
            id: 'm2l6c1-1', text: 'According to surveys, when do many Canadian children get a smartphone?',
            options: ['Before they start school', 'Around age eleven or twelve', 'At sixteen', 'When they finish high school'],
            answer: 1,
            why: 'Many children “get one by the age of eleven or twelve.”',
          },
          {
            id: 'm2l6c1-2', text: 'What is the main reason many parents give their children phones?',
            options: ['Safety', 'Homework', 'Games', 'Saving money'],
            answer: 0,
            why: '“For many parents, the main reason is safety.”',
          },
          {
            id: 'm2l6c1-3', text: 'What have teachers noticed in schools that ban phones in class?',
            options: ['Students get higher marks on their tests', 'Students arrive at school earlier each day', 'Parents complain to the school more often', 'Students talk to each other more at lunch'],
            answer: 3,
            why: 'Teachers report students “talk to each other more at lunch.”',
          },
          {
            id: 'm2l6c1-4', text: 'What is one example of a “middle path”?',
            options: ['No phone at all until starting university', 'A smartphone right away, but with no rules', 'A basic phone first, a smartphone later', 'One phone that the whole family shares'],
            answer: 2,
            why: 'Some give younger children “a basic phone that can only call and text.”',
          },
          {
            id: 'm2l6c1-5', text: 'Which rule is mentioned as part of a family agreement?',
            options: ['Phones are used only on weekends', 'Phones charge outside the bedroom at night', 'Children pay their own phone bill', 'No phones at school'],
            answer: 1,
            why: '“All devices charging outside the bedroom at night.”',
          },
          {
            id: 'm2l6c1-6', text: 'What does Dr. Moreau believe?',
            options: ['How parents talk about rules matters more than the age', 'Children should wait until they are sixteen', 'Phones should be banned in the home at night', 'Parents should check every message their child sends'],
            answer: 0,
            why: 'She says “the age matters less than the conversation.”',
          },
        ],
      },
    ],
  },
];
