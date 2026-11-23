import type { ReadingPart } from '../objective';

/** Module 1 reading: 4 parts, 38 questions. Original practice material in CELPIP style. */
export const module1Reading: ReadingPart[] = [
  {
    id: 'm1-reading-1', taskTypeId: 'reading-1', draft: true,
    instructions: 'Read the following message. Then answer questions 1 to 6. After that, complete the reply by choosing the best option for each blank (7 to 11).',
    blocks: [
      { kind: 'text', title: 'Message from Priya', body: 'Hi Daniel,\n\nI hope you and the kids had a good trip to Halifax. While you were away, a lot happened with the community garden behind our building, and I wanted to fill you in before the residents’ meeting next Thursday.\n\nFirst, the good news: the city approved our request for four more garden beds, so the waiting list should finally get shorter. The bad news is that the new beds will go where the picnic table is now, so we’ll need to find it a new home. Mrs. Lee suggested the corner by the bike racks, but I’m worried that spot gets too much shade in the afternoon.\n\nSecond, someone has been taking vegetables from the beds at night. It started with a few tomatoes, but last week all of Mr. Okafor’s peppers disappeared. Some people want to put a lock on the gate, but that would make things hard for the seniors on the ground floor, who use the garden most mornings. I think a sign and a motion-sensor light might be enough, at least to start.\n\nFinally, I’ve agreed to organize the harvest potluck in September, and I could really use your help. You’re so good with numbers. Would you be willing to handle the budget? We have $300 from the building association, and that has to cover table rentals, plates and a few prizes for the kids’ games.\n\nLet me know what you think. If you can’t make the meeting, I’m happy to share your ideas for you.\n\nPriya' },
      { kind: 'cloze', title: 'Daniel’s reply', body: 'Hi Priya,\n\nThanks for the update. We got back on Sunday, and the kids are still talking about the ocean. Great news about the extra beds!\n\nAbout the vegetables: I agree with you that a lock [[m1r1-7]]. Let’s try [[m1r1-8]] first and see if the problem stops.\n\nAs for the potluck, I’d be happy to [[m1r1-9]]. With [[m1r1-10]] to spend, we’ll need to compare rental prices carefully.\n\nUnfortunately, I work late next Thursday, so could you [[m1r1-11]] at the meeting? I’ll send you my notes by Wednesday.\n\nDaniel' },
    ],
    questions: [
      {
        id: 'm1r1-1', text: 'Why is Priya writing to Daniel?',
        options: ['To invite him on a trip to Halifax', 'To update him on garden issues before a meeting', 'To complain about Mrs. Lee', 'To ask him to join the garden waiting list'],
        answer: 1,
        why: 'Priya says she wanted to “fill you in before the residents’ meeting next Thursday.”',
      },
      {
        id: 'm1r1-2', text: 'What will happen to the picnic table?',
        options: ['It must be moved to make room for new beds', 'It will be repaired by the city', 'It will be given to the seniors', 'It will be sold to pay for the potluck'],
        answer: 0,
        why: '“The new beds will go where the picnic table is now, so we’ll need to find it a new home.”',
      },
      {
        id: 'm1r1-3', text: 'What worries Priya about the corner by the bike racks?',
        options: ['It is too close to where people lock their bikes', 'It is too small to fit the large picnic table', 'It is too far from the doors of the building', 'It may not get enough sun later in the day'],
        answer: 3,
        why: 'She is “worried that spot gets too much shade in the afternoon.”',
      },
      {
        id: 'm1r1-4', text: 'What happened to Mr. Okafor?',
        options: ['His tomatoes died in the heat', 'He lost the key to the gate', 'His peppers were taken', 'He gave up his garden bed'],
        answer: 2,
        why: '“Last week all of Mr. Okafor’s peppers disappeared.”',
      },
      {
        id: 'm1r1-5', text: 'Why doesn’t Priya want a lock on the gate?',
        options: ['It would cost the residents too much money', 'It could make the garden hard to use for older residents', 'The city does not allow locks on garden gates', 'Thieves would simply break it open at night'],
        answer: 1,
        why: 'A lock “would make things hard for the seniors on the ground floor.”',
      },
      {
        id: 'm1r1-6', text: 'What does Priya ask Daniel to do?',
        options: ['Manage the money for the potluck', 'Cook food for the potluck', 'Buy prizes for the children', 'Lead the residents’ meeting'],
        answer: 0,
        why: '“Would you be willing to handle the budget?”',
      },
      {
        id: 'm1r1-7', text: '',
        options: ['is the cheapest choice for the whole building', 'should go on the bike racks instead of the gate', 'was Mrs. Lee’s idea and she should pay for it', 'would cause problems for our neighbours on the ground floor'],
        answer: 3,
        why: 'Priya said a lock would make things hard for the seniors on the ground floor.',
      },
      {
        id: 'm1r1-8', text: '',
        options: ['a taller fence around the beds', 'a lock on the gate for night time', 'a sign and a motion-sensor light', 'moving the beds to the front lawn'],
        answer: 2,
        why: 'Priya suggested “a sign and a motion-sensor light” to start.',
      },
      {
        id: 'm1r1-9', text: '',
        options: ['organize the whole event myself', 'take care of the budget', 'cook all the food', 'bring prizes from Halifax'],
        answer: 1,
        why: 'Priya asked Daniel to handle the budget.',
      },
      {
        id: 'm1r1-10', text: '',
        options: ['$3,000', '$300', '$30', 'no money'],
        answer: 1,
        why: 'The building association gave “$300.”',
      },
      {
        id: 'm1r1-11', text: '',
        options: ['share my ideas for me', 'cancel the meeting', 'move the picnic table', 'pick up my kids'],
        answer: 0,
        why: 'Priya offered: “I’m happy to share your ideas for you.”',
      },
    ],
  },
  {
    id: 'm1-reading-2', taskTypeId: 'reading-2', draft: true,
    instructions: 'Read the schedule and the email. Choose the best option for each blank (1 to 5). Then answer questions 6 to 8.',
    blocks: [
      {
        kind: 'table', title: 'Riverside Community Centre: Summer swimming lessons',
        columns: ['Class', 'Ages', 'Days', 'Time', 'Price (8 lessons)'],
        rows: [
          ['Splash Starters', '3 to 5, with a parent in the water', 'Saturday', '9:00 to 9:30 a.m.', '$64'],
          ['Little Swimmers', '6 to 8', 'Tuesday and Thursday', '4:30 to 5:15 p.m.', '$96'],
          ['Stroke Builders', '9 to 12', 'Monday and Wednesday', '6:00 to 7:00 p.m.', '$120'],
          ['Teen Lifesaving', '13 to 16', 'Sunday', '1:00 to 3:00 p.m.', '$180, includes a lifesaving certificate'],
        ],
        note: 'Riverside residents get 10% off. Register online or at the front desk by June 15.',
      },
      { kind: 'cloze', title: 'Email from Marco to his sister Ana', body: 'Hi Ana,\n\nI’ve looked at the summer swimming lessons at Riverside for the kids. Since Leo is only four, he would have to take [[m1r2-1]], and one of us needs to be in the pool with him. Mia is ten, so she fits [[m1r2-2]].\n\nThe problem is that Mia’s class is [[m1r2-3]], and I don’t finish work until 6:30 on Mondays. Could you take her on those days? In return, I can take Leo on [[m1r2-4]].\n\nBefore any discount, the two classes together will cost [[m1r2-5]]. Since we both live in Riverside, it will be a little less.\n\nLet me know soon so I can sign them up.\n\nMarco' },
    ],
    questions: [
      {
        id: 'm1r2-1', text: '',
        options: ['Little Swimmers', 'Stroke Builders', 'Splash Starters', 'Teen Lifesaving'],
        answer: 2,
        why: 'Splash Starters is for ages 3 to 5, with a parent in the water.',
      },
      {
        id: 'm1r2-2', text: '',
        options: ['Little Swimmers', 'Stroke Builders', 'Splash Starters', 'Teen Lifesaving'],
        answer: 1,
        why: 'Stroke Builders is for ages 9 to 12.',
      },
      {
        id: 'm1r2-3', text: '',
        options: ['on weekday evenings', 'on Saturday mornings', 'on Sunday afternoons', 'right after school'],
        answer: 0,
        why: 'Stroke Builders runs Monday and Wednesday, 6:00 to 7:00 p.m.',
      },
      {
        id: 'm1r2-4', text: '',
        options: ['Tuesday afternoons', 'Sunday afternoons', 'Wednesday evenings', 'Saturday mornings'],
        answer: 3,
        why: 'Splash Starters is on Saturday, 9:00 to 9:30 a.m.',
      },
      {
        id: 'm1r2-5', text: '',
        options: ['$160', '$216', '$184', '$244'],
        answer: 2,
        why: '$64 for Splash Starters plus $120 for Stroke Builders is $184.',
      },
      {
        id: 'm1r2-6', text: 'Why does Marco ask Ana to take Mia to her class?',
        options: ['He does not know how to swim very well', 'He cannot get there in time on Mondays', 'Mia would rather go to class with Ana', 'He has to work late on Saturday mornings'],
        answer: 1,
        why: 'Marco does not finish work until 6:30 on Mondays, and the class starts at 6:00.',
      },
      {
        id: 'm1r2-7', text: 'By what date must the children be registered?',
        options: ['June 15', 'June 1', 'The first lesson', 'September 15'],
        answer: 0,
        why: 'The note says to register by June 15.',
      },
      {
        id: 'm1r2-8', text: 'What does the most expensive class include that the others do not?',
        options: ['A parent in the water', 'Weekend lessons', 'Two lessons a week', 'A certificate'],
        answer: 3,
        why: 'Teen Lifesaving costs $180 and “includes a lifesaving certificate.”',
      },
    ],
  },
  {
    id: 'm1-reading-3', taskTypeId: 'reading-3', draft: true,
    instructions: 'Read the article. Decide which paragraph, A to D, has the information in each statement. If the information is not in the article, choose E.',
    blocks: [
      { kind: 'text', title: 'Tiny forests, big ideas', body: 'A. In the 1970s, the Japanese botanist Akira Miyawaki developed a way to grow small, dense forests quickly. His method, now known by his name, uses only trees and shrubs that grow naturally in the area. They are planted very close together, often three or more young plants per square metre, much closer than in a natural forest. Because the plants compete for light, supporters say they grow upward faster than trees planted in the usual way.\n\nB. Over the last few years, the idea has spread to Canadian cities. Community groups have planted tiny forests on school grounds, beside parking lots and in empty corners of parks. A typical site is about the size of a tennis court. The planting is usually done in a single day by volunteers, with an expert guiding them on where each species should go.\n\nC. Supporters point to several benefits. In summer, the shade from a tiny forest can make the ground nearby noticeably cooler, and the thick leaves help block traffic noise. Birds and insects quickly move in. At some schools, students visit their forest regularly to measure the trees and record the animals they see, turning it into an outdoor classroom.\n\nD. Not everyone is convinced. A tiny forest can cost more per tree than ordinary planting, because the soil must be carefully prepared and the young plants need watering for their first two or three years. Some scientists also say the claims about very fast growth have not been properly tested, and that small forests cannot replace the benefits of large natural ones.' },
    ],
    questions: [
      { id: 'm1r3-1', text: 'The method is named after the person who created it.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 0, why: 'Paragraph A: “His method, now known by his name…”' },
      { id: 'm1r3-2', text: 'Young plants need regular watering for some time.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 3, why: 'Paragraph D: the young plants “need watering for their first two or three years.”' },
      { id: 'm1r3-3', text: 'Some students collect information about the forests.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 2, why: 'Paragraph C: students “measure the trees and record the animals they see.”' },
      { id: 'm1r3-4', text: 'A tiny forest can fit in a space similar to a sports court.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 1, why: 'Paragraph B: “A typical site is about the size of a tennis court.”' },
      { id: 'm1r3-5', text: 'Ordinary people usually do the planting.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 1, why: 'Paragraph B: “The planting is usually done in a single day by volunteers.”' },
      { id: 'm1r3-6', text: 'Some experts question how fast the forests really grow.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 3, why: 'Paragraph D: the claims about very fast growth “have not been properly tested.”' },
      { id: 'm1r3-7', text: 'Tiny forests can make nearby areas quieter.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 2, why: 'Paragraph C: the leaves “help block traffic noise.”' },
      { id: 'm1r3-8', text: 'The first tiny forest in Canada was planted in Vancouver.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 4, why: 'The article does not say where Canada’s first tiny forest was planted.' },
      { id: 'm1r3-9', text: 'The plants are placed much closer together than in nature.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 0, why: 'Paragraph A: “much closer than in a natural forest.”' },
    ],
  },
  {
    id: 'm1-reading-4', taskTypeId: 'reading-4', draft: true,
    instructions: 'Read the article and answer questions 1 to 5. Then read a reader’s comment and choose the best option for each blank (6 to 10).',
    blocks: [
      { kind: 'text', title: 'Should high school start later?', body: 'The Westbrook School Board is considering moving the start of the high school day from 8:00 to 9:15 a.m. The board will vote in March, after a year-long trial at two schools.\n\nSupporters point to sleep science. “During the teenage years, the body clock shifts later,” says Dr. Amira Haddad, a sleep researcher. “Asking a sixteen-year-old to be alert at eight is like asking an adult to write a math test at five in the morning.” She notes that most teenagers need eight to ten hours of sleep, but few get that much on school nights.\n\nAt Lakeview Secondary, one of the trial schools, principal Gordon Fry says the change has been noticeable. Attendance in first period rose by about 12 percent, and fewer students fell asleep in class. “I was doubtful at first,” he admits. “I assumed students would just stay up later. Some do, but most are getting more sleep overall.”\n\nNot everyone is convinced. Transportation manager Linda Brooks explains that the board’s buses are shared with elementary schools, which would have to start earlier, at around 7:45, if high schools start later. “We’d be solving one sleep problem by creating another for younger children,” she warns. Running separate bus routes would cost about $2 million a year, money the board does not have.\n\nSome families also worry about the end of the day. With classes finishing at 4:15, sports teams would play games after dark in winter, and students with part-time jobs might lose shifts. Grade 11 student Nadia Petrov, who works at a grocery store, is torn. “I’d love to sleep in,” she says, “but I need those hours to save for university.”\n\nDr. Haddad believes these problems can be solved. She suggests a compromise start time of 8:45 and flexible schedules for students who work. The board will hold two public meetings in February before it decides.' },
      { kind: 'cloze', title: 'Reader comment from Tom R.', body: 'I’m the parent of two teenagers, and this article shows the issue is more complicated than it seems. The trial results are encouraging: more students showed up for [[m1r4-6]]. However, Ms. Brooks makes a fair point that the plan could [[m1r4-7]]. The board can’t simply add buses either, since that would cost [[m1r4-8]].\n\nPersonally, I like Dr. Haddad’s idea of [[m1r4-9]], because it is a middle ground. I plan to attend one of the [[m1r4-10]] to share my view.' },
    ],
    questions: [
      {
        id: 'm1r4-1', text: 'What will the school board decide in March?',
        options: ['Which of the two trial schools will close', 'Whether high school classes should start later', 'How to pay for new buses for elementary schools', 'Whether to end after-school sports programs'],
        answer: 1,
        why: 'The board is considering a later start and “will vote in March.”',
      },
      {
        id: 'm1r4-2', text: 'What does Dr. Haddad compare early classes for teenagers to?',
        options: ['An adult taking a test very early in the morning', 'A child staying up long past bedtime', 'A nurse working a night shift at a hospital', 'A student writing an exam without breakfast'],
        answer: 0,
        why: '“Like asking an adult to write a math test at five in the morning.”',
      },
      {
        id: 'm1r4-3', text: 'What surprised Gordon Fry?',
        options: ['Attendance went down', 'Students stayed up later and slept less', 'Teachers preferred the early start', 'Most students got more sleep overall'],
        answer: 3,
        why: 'He expected students to stay up later, but “most are getting more sleep overall.”',
      },
      {
        id: 'm1r4-4', text: 'Why does Linda Brooks have concerns about the change?',
        options: ['Bus drivers would lose their jobs and their pay', 'The buses are too old to run on longer routes', 'Younger children would have to start school earlier', 'Parents could no longer drive their children'],
        answer: 2,
        why: 'Elementary schools “would have to start earlier, at around 7:45.”',
      },
      {
        id: 'm1r4-5', text: 'What is Nadia Petrov worried about?',
        options: ['Missing sports games', 'Losing hours at her job', 'Falling asleep in class', 'Getting into university'],
        answer: 1,
        why: 'She needs her work hours “to save for university.”',
      },
      {
        id: 'm1r4-6', text: '',
        options: ['first-period classes', 'sports practices', 'part-time jobs', 'public meetings'],
        answer: 0,
        why: 'Attendance in first period rose by about 12 percent.',
      },
      {
        id: 'm1r4-7', text: '',
        options: ['save the board a lot of money', 'shorten the bus routes in winter', 'help elementary schools start later', 'affect younger students’ sleep'],
        answer: 3,
        why: 'Ms. Brooks said it would create a sleep problem for younger children.',
      },
      {
        id: 'm1r4-8', text: '',
        options: ['about $2 million in total', 'about $200,000 a year', 'about $2 million a year', 'nothing at all'],
        answer: 2,
        why: 'Separate routes would cost “about $2 million a year.”',
      },
      {
        id: 'm1r4-9', text: '',
        options: ['starting at 9:15', 'starting at 8:45', 'keeping the 8:00 start', 'starting at 7:45'],
        answer: 1,
        why: 'Dr. Haddad suggests “a compromise start time of 8:45.”',
      },
      {
        id: 'm1r4-10', text: '',
        options: ['votes in March', 'meetings in February', 'classes at Lakeview', 'games after dark'],
        answer: 1,
        why: 'The board “will hold two public meetings in February.”',
      },
    ],
  },
];
