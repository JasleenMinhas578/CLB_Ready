import type { ListeningPart } from '../objective';

/** Module 3 listening: 6 parts, 38 questions. Original scripts in CELPIP style; each clip plays once. */
export const module3Listening: ListeningPart[] = [
  {
    id: 'm3-listening-1', taskTypeId: 'listening-1', draft: true,
    instructions: 'You will hear a conversation in three sections. Each section plays once. After each section, answer its questions.',
    clips: [
      {
        id: 'm3-l1-c1',
        intro: 'Sam and Alicia work together and are organizing their company’s year-end lunch.',
        speakers: [{ name: 'Alicia', voice: 'af_sarah' }, { name: 'Sam', voice: 'am_michael' }],
        lines: [
          { speaker: 'Alicia', text: 'Sam, bad news. The caterer just cancelled. Their kitchen failed a safety inspection, and they’re closed for at least two weeks.' },
          { speaker: 'Sam', text: 'Two weeks? The lunch is on Friday! That’s three days from now.' },
          { speaker: 'Alicia', text: 'I know. And we promised sixty people a hot meal, including the managers from the Ottawa office.' },
          { speaker: 'Sam', text: 'Did they at least give back the deposit?' },
          { speaker: 'Alicia', text: 'They said they would, but it could take up to ten business days. So for now, we have a smaller budget than before.' },
        ],
        questions: [
          {
            id: 'm3l1c1-1', text: 'Why did the caterer cancel?',
            options: ['They were fully booked', 'Their kitchen failed an inspection', 'Their chef was sick', 'The office changed the date'],
            answer: 1,
            why: '“Their kitchen failed a safety inspection.”',
          },
          {
            id: 'm3l1c1-2', text: 'How many people are expected at the lunch?',
            options: ['Sixty', 'Sixteen', 'Ten', 'Two hundred'],
            answer: 0,
            why: '“We promised sixty people a hot meal.”',
          },
          {
            id: 'm3l1c1-3', text: 'Why do they have less money right now?',
            options: ['The managers cut the budget', 'Prices went up', 'They paid a cancellation fee', 'The deposit hasn’t been returned yet'],
            answer: 3,
            why: 'The deposit refund “could take up to ten business days.”',
          },
        ],
      },
      {
        id: 'm3-l1-c2',
        intro: 'Sam and Alicia talk about other options.',
        speakers: [{ name: 'Alicia', voice: 'af_sarah' }, { name: 'Sam', voice: 'am_michael' }],
        lines: [
          { speaker: 'Sam', text: 'What about the Italian restaurant across the street? They have a private room.' },
          { speaker: 'Alicia', text: 'I checked. The room holds forty people at most. We’d have to split everyone into two groups.' },
          { speaker: 'Sam', text: 'That defeats the purpose of the lunch. Okay, what if we have the food delivered to our big meeting room?' },
          { speaker: 'Alicia', text: 'That could work. The Thai place on King Street does large orders. They need forty-eight hours’ notice, and it’s about twenty-two dollars a person.' },
          { speaker: 'Sam', text: 'That’s cheaper than the caterer was. But we’d need plates, cutlery and someone to set up.' },
          { speaker: 'Alicia', text: 'The building has tables we can borrow. I can ask the reception team about plates.' },
        ],
        questions: [
          {
            id: 'm3l1c2-4', text: 'What is the problem with the Italian restaurant?',
            options: ['It is much too expensive for them', 'It is closed for lunch on Fridays', 'Its room is too small for everyone', 'It is too far for the Ottawa managers'],
            answer: 2,
            why: '“The room holds forty people at most.”',
          },
          {
            id: 'm3l1c2-5', text: 'How much notice does the Thai restaurant need?',
            options: ['One week', 'Forty-eight hours', 'Twenty-four hours', 'Two weeks'],
            answer: 1,
            why: '“They need forty-eight hours’ notice.”',
          },
          {
            id: 'm3l1c2-6', text: 'What does Sam worry about with delivery?',
            options: ['They would need dishes and help setting up', 'The food would be cold by the time it arrived', 'The big meeting room is already booked Friday', 'Some of the staff don’t like eating Thai food'],
            answer: 0,
            why: '“We’d need plates, cutlery and someone to set up.”',
          },
        ],
      },
      {
        id: 'm3-l1-c3',
        intro: 'Sam and Alicia make a decision.',
        speakers: [{ name: 'Alicia', voice: 'af_sarah' }, { name: 'Sam', voice: 'am_michael' }],
        lines: [
          { speaker: 'Sam', text: 'Let’s go with the Thai food in the meeting room. If we order today, we’re within the forty-eight hours.' },
          { speaker: 'Alicia', text: 'Agreed. I’ll place the order right now and ask for a few vegetarian dishes.' },
          { speaker: 'Sam', text: 'And I’ll email everyone to say the lunch is moving to the meeting room. I’ll also ask two or three people to help set up on Friday morning.' },
          { speaker: 'Alicia', text: 'Perfect. Honestly, this might be better than the original plan.' },
        ],
        questions: [
          {
            id: 'm3l1c3-7', text: 'What will Alicia do right away?',
            options: ['Email the staff', 'Book a restaurant', 'Call the caterer', 'Order the food'],
            answer: 3,
            why: '“I’ll place the order right now.”',
          },
          {
            id: 'm3l1c3-8', text: 'What will Sam ask some co-workers to do?',
            options: ['Bring their own lunch', 'Pick up the food', 'Help set up on Friday', 'Pay for the meal'],
            answer: 2,
            why: 'He will ask “two or three people to help set up on Friday morning.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm3-listening-2', taskTypeId: 'listening-2', draft: true,
    instructions: 'You will hear a conversation. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm3-l2-c1',
        intro: 'Daniel calls a dental clinic and speaks to the receptionist, Linda.',
        speakers: [{ name: 'Linda', voice: 'af_heart' }, { name: 'Daniel', voice: 'am_adam' }],
        lines: [
          { speaker: 'Linda', text: 'Good morning, Bright Smile Dental, this is Linda.' },
          { speaker: 'Daniel', text: 'Hi Linda, this is Daniel Park. I have a cleaning booked for this Thursday at two, but I need to change it. My company is sending me to Vancouver for a training course.' },
          { speaker: 'Linda', text: 'No problem, Mr. Park. Just so you know, we ask for twenty-four hours’ notice, so you’re fine. When are you back?' },
          { speaker: 'Daniel', text: 'I’m back next Wednesday. Do you have anything the following week, ideally early in the morning?' },
          { speaker: 'Linda', text: 'Let me check. Dr. Shah has an opening on Monday the fourteenth at eight a.m., or Thursday the seventeenth at seven thirty.' },
          { speaker: 'Daniel', text: 'Seven thirty is perfect. I can come before work.' },
          { speaker: 'Linda', text: 'Great, you’re booked. Also, I see it’s been more than a year since your last X-rays, so we’ll take those too. Your insurance should cover them.' },
          { speaker: 'Daniel', text: 'Okay. Should I bring anything?' },
          { speaker: 'Linda', text: 'Just your new insurance card, since your company changed providers in January. We’ll need to update your file.' },
        ],
        questions: [
          {
            id: 'm3l2c1-1', text: 'Why does Daniel need to change his appointment?',
            options: ['He is sick', 'He has to travel for work', 'He forgot the time', 'His insurance changed'],
            answer: 1,
            why: 'His company is sending him to Vancouver for training.',
          },
          {
            id: 'm3l2c1-2', text: 'What does Linda say about the clinic’s notice rule?',
            options: ['Daniel has given enough notice', 'Daniel must pay a fee', 'Daniel should have called a week earlier', 'There is no rule'],
            answer: 0,
            why: '“We ask for twenty-four hours’ notice, so you’re fine.”',
          },
          {
            id: 'm3l2c1-3', text: 'When is Daniel’s new appointment?',
            options: ['Monday at 8 a.m.', 'Wednesday at 2 p.m.', 'Thursday at 2 p.m.', 'Thursday at 7:30 a.m.'],
            answer: 3,
            why: 'He chooses “Thursday the seventeenth at seven thirty.”',
          },
          {
            id: 'm3l2c1-4', text: 'What extra procedure will the clinic do?',
            options: ['Fill a cavity', 'Whiten his teeth', 'Take X-rays', 'Remove a tooth'],
            answer: 2,
            why: '“We’ll take those too,” referring to X-rays.',
          },
          {
            id: 'm3l2c1-5', text: 'What should Daniel bring?',
            options: ['His old X-rays', 'His new insurance card', 'A letter from his employer', 'Payment in cash'],
            answer: 1,
            why: '“Just your new insurance card.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm3-listening-3', taskTypeId: 'listening-3', draft: true,
    instructions: 'You will hear a conversation. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm3-l3-c1',
        intro: 'Priya, a college student, meets Mr. Fraser, an advisor, to ask about the co-op program.',
        speakers: [{ name: 'Priya', voice: 'af_bella' }, { name: 'Mr. Fraser', voice: 'bm_george' }],
        lines: [
          { speaker: 'Priya', text: 'Hi, Mr. Fraser. I’m in first year of business, and I’m interested in the co-op program. How does it work?' },
          { speaker: 'Mr. Fraser', text: 'Co-op lets you alternate between study terms and paid work terms. Most business students complete three work terms of four months each before they graduate.' },
          { speaker: 'Priya', text: 'Does that mean it takes longer to finish my degree?' },
          { speaker: 'Mr. Fraser', text: 'Usually about one extra year. But many students say the work experience is worth it, and some get job offers from their co-op employers before they finish.' },
          { speaker: 'Priya', text: 'How do I apply?' },
          { speaker: 'Mr. Fraser', text: 'You apply online by October thirty-first. You need at least a B average, and you must attend two job-search workshops in the fall. They cover resumes and interview skills.' },
          { speaker: 'Priya', text: 'And do you find the jobs for us?' },
          { speaker: 'Mr. Fraser', text: 'We post hundreds of jobs on our website, but you apply for them yourself, just like a real job search. Our staff will review your resume and help you practise for interviews.' },
          { speaker: 'Priya', text: 'Are the jobs only in this city?' },
          { speaker: 'Mr. Fraser', text: 'No, they’re all over Canada, and a few are overseas. If you’re willing to move, you’ll have many more choices.' },
        ],
        questions: [
          {
            id: 'm3l3c1-1', text: 'How many work terms do most business students complete?',
            options: ['Three', 'One', 'Four', 'Two'],
            answer: 0,
            why: '“Most business students complete three work terms.”',
          },
          {
            id: 'm3l3c1-2', text: 'How does co-op affect the length of the degree?',
            options: ['It makes the degree shorter', 'It has no effect', 'It adds four years', 'It usually adds about a year'],
            answer: 3,
            why: '“Usually about one extra year.”',
          },
          {
            id: 'm3l3c1-3', text: 'What is one benefit Mr. Fraser mentions?',
            options: ['Co-op students pay lower tuition fees', 'Co-op students can skip some final exams', 'Some students get job offers early', 'Co-op students can take all courses online'],
            answer: 2,
            why: 'Some “get job offers from their co-op employers before they finish.”',
          },
          {
            id: 'm3l3c1-4', text: 'What must Priya do to be accepted?',
            options: ['Find her own employer first', 'Keep a B average and attend workshops', 'Take an extra course', 'Pass an interview with the advisor'],
            answer: 1,
            why: 'She needs “at least a B average” and two workshops.',
          },
          {
            id: 'm3l3c1-5', text: 'How do students get co-op jobs?',
            options: ['They apply for posted jobs themselves', 'The college assigns them', 'Employers choose from a list', 'Advisors call companies for them'],
            answer: 0,
            why: '“You apply for them yourself.”',
          },
          {
            id: 'm3l3c1-6', text: 'What does Mr. Fraser say about moving?',
            options: ['Students are required to move for co-op', 'Students are not allowed to work far away', 'The college pays for students to move', 'It gives students more job choices'],
            answer: 3,
            why: '“If you’re willing to move, you’ll have many more choices.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm3-listening-4', taskTypeId: 'listening-4', draft: true,
    instructions: 'You will hear a news report. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm3-l4-c1',
        intro: 'A news report from the city of Port Ellis.',
        speakers: [{ name: 'Reporter', voice: 'am_adam' }],
        lines: [
          { speaker: 'Reporter', text: 'Starting in September, young people in Port Ellis will be able to ride city buses for free. City council voted eight to three on Monday to make transit free for everyone aged six to eighteen.' },
          { speaker: 'Reporter', text: 'Mayor Claire Dubois says the goal is to build good habits early. Young people who take the bus today, she said, are more likely to use transit as adults. The city also hopes the program will ease morning traffic around schools, where parents dropping off children often cause long delays.' },
          { speaker: 'Reporter', text: 'The program will cost about one point two million dollars a year. Most of that will be covered by a small increase in downtown parking fees. Councillors who voted against the plan say the money would be better spent on adding more buses, since some routes are already crowded at rush hour.' },
          { speaker: 'Reporter', text: 'To ride for free, young people will need a youth transit card, which will be available at libraries and community centres from August fifteenth. Riders aged six to twelve must still travel with an adult.' },
        ],
        questions: [
          {
            id: 'm3l4c1-1', text: 'Who will be able to ride buses for free?',
            options: ['All students', 'Seniors', 'People aged six to eighteen', 'Everyone in September'],
            answer: 2,
            why: 'Transit will be free “for everyone aged six to eighteen.”',
          },
          {
            id: 'm3l4c1-2', text: 'What is one goal of the program, according to the mayor?',
            options: ['To sell more parking passes in the downtown core', 'To help young people form the habit of using transit', 'To close some of the bus routes that few people use', 'To raise money for new equipment in local schools'],
            answer: 1,
            why: 'The goal is “to build good habits early.”',
          },
          {
            id: 'm3l4c1-3', text: 'How will the city pay for most of the program?',
            options: ['Higher downtown parking fees', 'A new tax on every home in the city', 'Cutting the number of buses at night', 'Money from the province’s school budget'],
            answer: 0,
            why: 'Most will be covered by “a small increase in downtown parking fees.”',
          },
          {
            id: 'm3l4c1-4', text: 'Why did some councillors vote against the plan?',
            options: ['They think buses are unsafe', 'They want free transit for seniors', 'They think the cost is too low', 'They want more buses instead'],
            answer: 3,
            why: 'They say the money “would be better spent on adding more buses.”',
          },
          {
            id: 'm3l4c1-5', text: 'What rule applies to riders aged six to twelve?',
            options: ['They can only ride after school', 'They need a parent’s signature each time', 'They must ride with an adult', 'They pay half price'],
            answer: 2,
            why: 'They “must still travel with an adult.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm3-listening-5', taskTypeId: 'listening-5', draft: true,
    instructions: 'You will hear a discussion between three neighbours. It plays once. Note their names before you listen: Helen, Marcus and Aiko. Then answer the questions.',
    clips: [
      {
        id: 'm3-l5-c1',
        intro: 'Helen, Marcus and Aiko are planning a street party for their neighbourhood.',
        speakers: [{ name: 'Helen', voice: 'af_heart' }, { name: 'Marcus', voice: 'am_michael' }, { name: 'Aiko', voice: 'bf_emma' }],
        lines: [
          { speaker: 'Helen', text: 'Thanks for coming over. I’d love to have a street party before the end of summer. The last one was three years ago, and so many new families have moved in since then.' },
          { speaker: 'Marcus', text: 'Great idea. But to close the street, we need a permit from the city. I looked it up, and it takes about four weeks to process.' },
          { speaker: 'Aiko', text: 'Then we should aim for the last Saturday in August. That gives us six weeks.' },
          { speaker: 'Helen', text: 'Good. What about food? Last time everyone brought something, but we ended up with twelve desserts and almost no main dishes.' },
          { speaker: 'Aiko', text: 'Let’s make a sign-up sheet online, with sections for mains, salads and desserts. Once a section is full, people have to choose another one.' },
          { speaker: 'Marcus', text: 'I can bring my barbecue and cook burgers. I just need someone to help with buying supplies.' },
          { speaker: 'Helen', text: 'I’ll help with that. We could ask each household for ten dollars to cover the meat and buns.' },
          { speaker: 'Aiko', text: 'Some families might find that hard. What if it’s just a suggested amount?' },
          { speaker: 'Helen', text: 'Fair enough. A suggested donation, then.' },
          { speaker: 'Marcus', text: 'I’ll apply for the permit tomorrow. Aiko, can you make the sign-up sheet?' },
          { speaker: 'Aiko', text: 'Sure, I’ll send it out by Friday.' },
        ],
        questions: [
          {
            id: 'm3l5c1-1', text: 'Why does Helen want to have a street party?',
            options: ['It is a yearly tradition', 'Many new families have moved in', 'The city asked her to', 'She is moving away'],
            answer: 1,
            why: '“So many new families have moved in since then.”',
          },
          {
            id: 'm3l5c1-2', text: 'What do they need to close the street?',
            options: ['A permit from the city', 'Permission from every neighbour', 'A police officer', 'A fee of ten dollars'],
            answer: 0,
            why: '“We need a permit from the city.”',
          },
          {
            id: 'm3l5c1-3', text: 'Why does Aiko choose the last Saturday in August?',
            options: ['It is a long weekend with a holiday', 'The weather is usually better that week', 'Many families are away earlier in August', 'It allows enough time for the permit'],
            answer: 3,
            why: 'The permit takes about four weeks, and that date gives six weeks.',
          },
          {
            id: 'm3l5c1-4', text: 'What went wrong with the food last time?',
            options: ['There wasn’t enough food', 'The barbecue broke', 'There were too many desserts', 'It rained'],
            answer: 2,
            why: '“We ended up with twelve desserts and almost no main dishes.”',
          },
          {
            id: 'm3l5c1-5', text: 'How will the sign-up sheet solve the problem?',
            options: ['Only adults can sign up', 'Each section has a limit', 'Everyone must bring dessert', 'Helen chooses the dishes'],
            answer: 1,
            why: 'Once a section is full, people have to choose another.',
          },
          {
            id: 'm3l5c1-6', text: 'What does Marcus offer to do?',
            options: ['Cook burgers on his barbecue', 'Collect money', 'Make the sign-up sheet', 'Clean the street'],
            answer: 0,
            why: '“I can bring my barbecue and cook burgers.”',
          },
          {
            id: 'm3l5c1-7', text: 'Why does Aiko object to the ten-dollar charge?',
            options: ['It is too little to pay for the barbecue', 'She thinks all the food should be free', 'The city does not allow neighbours to charge', 'Some families may not be able to afford it'],
            answer: 3,
            why: '“Some families might find that hard.”',
          },
          {
            id: 'm3l5c1-8', text: 'What will Marcus do tomorrow?',
            options: ['Buy the meat', 'Send the sign-up sheet', 'Apply for the permit', 'Talk to new neighbours'],
            answer: 2,
            why: '“I’ll apply for the permit tomorrow.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm3-listening-6', taskTypeId: 'listening-6', draft: true,
    instructions: 'You will hear a radio talk. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm3-l6-c1',
        intro: 'A radio host talks about learning online and in a classroom.',
        speakers: [{ name: 'Host', voice: 'af_sarah' }],
        lines: [
          { speaker: 'Host', text: 'Good afternoon. A few years ago, almost every student in Canada had to learn from home for a while. Now that classrooms are open again, many colleges are asking a new question: should online learning stay, and if so, how much?' },
          { speaker: 'Host', text: 'Supporters of online courses point to flexibility. Students who work, care for children or live far from campus can study when it suits them. Some colleges say online courses have helped them reach students in small communities who might never have been able to move to a city.' },
          { speaker: 'Host', text: 'But many teachers say something is lost. In a classroom, they can see when a student looks confused and explain again right away. Students also learn from each other in ways that are harder to arrange online. And some studies suggest that students in fully online courses are more likely to drop out.' },
          { speaker: 'Host', text: 'A popular compromise is the hybrid course, where lectures are online but labs, discussions and exams happen in person. Education researcher Dr. Samuel Okoro says the hybrid model works best when the in-person time is used for activities that really need people together, not for things students could just as easily watch at home.' },
          { speaker: 'Host', text: 'His advice to students is simple: be honest about how you learn. If you need structure and deadlines to stay motivated, a classroom may suit you better, even if it’s less convenient. Next week, we’ll look at how employers view online degrees.' },
        ],
        questions: [
          {
            id: 'm3l6c1-1', text: 'What is the main benefit of online courses, according to supporters?',
            options: ['Lower fees', 'Flexibility', 'Better grades', 'Smaller classes'],
            answer: 1,
            why: 'Supporters “point to flexibility.”',
          },
          {
            id: 'm3l6c1-2', text: 'Which group of students has online learning helped reach?',
            options: ['Students in small communities', 'International students living in other countries', 'High school students preparing for college', 'Retired people who want to learn new skills'],
            answer: 0,
            why: 'It has helped “reach students in small communities.”',
          },
          {
            id: 'm3l6c1-3', text: 'What can teachers do more easily in a classroom?',
            options: ['Give longer exams with more questions', 'Teach many more students in each class', 'Grade assignments and tests more quickly', 'Notice when students are confused'],
            answer: 3,
            why: 'They “can see when a student looks confused.”',
          },
          {
            id: 'm3l6c1-4', text: 'What do some studies suggest about fully online courses?',
            options: ['Students get higher marks', 'Students make more friends', 'More students drop out', 'Courses cost more'],
            answer: 2,
            why: 'Students in fully online courses “are more likely to drop out.”',
          },
          {
            id: 'm3l6c1-5', text: 'According to Dr. Okoro, when does the hybrid model work best?',
            options: ['When every lecture and every lab is given in person on campus', 'When in-person time is used for activities that need people together', 'When exams are written online at home instead of on campus', 'When classes are very large and the lectures are held in big halls'],
            answer: 1,
            why: 'It works best when in-person time is for activities “that really need people together.”',
          },
          {
            id: 'm3l6c1-6', text: 'What is Dr. Okoro’s advice to students?',
            options: ['Think honestly about how you learn', 'Always choose online courses', 'Always choose classroom courses', 'Take as many courses as possible'],
            answer: 0,
            why: '“Be honest about how you learn.”',
          },
        ],
      },
    ],
  },
];
