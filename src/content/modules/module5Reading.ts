import type { ReadingPart } from '../objective';

/** Module 5 reading: 4 parts, 38 questions. Original practice material in CELPIP style. */
export const module5Reading: ReadingPart[] = [
  {
    id: 'm5-reading-1', taskTypeId: 'reading-1', draft: true,
    instructions: 'Read the following message. Then answer questions 1 to 6. After that, complete the reply by choosing the best option for each blank (7 to 11).',
    blocks: [
      { kind: 'text', title: 'Message from Mrs. Chen', body: 'Dear Mr. Patel,\n\nI’m writing on behalf of the tenants’ committee at Willow Court. As you may have heard, the building owner plans to replace all the windows this spring. The work will start on April 7 and should take about three weeks, one floor at a time.\n\nThe contractor needs to enter each apartment for about four hours. You live on the third floor, which is scheduled for the week of April 14. Someone must be home, or you can leave a key with the building manager. Please also move furniture at least one metre away from the windows the night before.\n\nThe committee has two concerns. First, the work will be noisy from 8 a.m. to 5 p.m., which is difficult for residents who work night shifts. We have asked the owner to start at 10 a.m. instead, but we haven’t heard back yet. Second, several tenants have asked whether rent will go up after the new windows are installed. The owner has promised there will be no increase this year.\n\nWe are holding a meeting in the lobby on March 25 at 7 p.m. to answer questions. I know you have experience as a carpenter. Would you be willing to speak briefly about what to expect?\n\nBest regards,\nLin Chen' },
      { kind: 'cloze', title: 'Mr. Patel’s reply', body: 'Dear Mrs. Chen,\n\nThank you for the information. Since I work during the day, I’ll [[m5r1-7]] with the building manager for my visit during the week of [[m5r1-8]].\n\nI’m glad the committee asked for a later start time. As someone who knows several [[m5r1-9]], I can see why the noise would be a problem.\n\nIt’s also good to hear the owner promised [[m5r1-10]] this year. And yes, I’d be happy to [[m5r1-11]] at the meeting. I’ll keep it short.\n\nRegards,\nRaj Patel' },
    ],
    questions: [
      {
        id: 'm5r1-1', text: 'What is the main purpose of Mrs. Chen’s message?',
        options: ['To complain about noise coming from Mr. Patel’s apartment', 'To inform a tenant about upcoming work and ask for his help', 'To announce that rent will go up after the work', 'To invite him to join the tenants’ committee'],
        answer: 1,
        why: 'She explains the window work and asks him to speak at the meeting.',
      },
      {
        id: 'm5r1-2', text: 'How long will the whole project take?',
        options: ['About three weeks', 'About four hours', 'About one week', 'About three months'],
        answer: 0,
        why: 'It “should take about three weeks.”',
      },
      {
        id: 'm5r1-3', text: 'What must Mr. Patel do if he can’t be home?',
        options: ['Call the contractor to choose a new date', 'Move to another floor for that week', 'Cancel the work in his apartment', 'Leave a key with the building manager'],
        answer: 3,
        why: '“You can leave a key with the building manager.”',
      },
      {
        id: 'm5r1-4', text: 'What should tenants do the night before the work?',
        options: ['Take down all their curtains and blinds', 'Open all the windows to let air in', 'Move furniture away from the windows', 'Sign a form and leave it at the door'],
        answer: 2,
        why: 'Move furniture “at least one metre away from the windows.”',
      },
      {
        id: 'm5r1-5', text: 'Why did the committee ask for a later start time?',
        options: ['To avoid traffic', 'To help residents who work at night', 'Because the contractor is busy', 'Because it is cheaper'],
        answer: 1,
        why: 'The noise is difficult “for residents who work night shifts.”',
      },
      {
        id: 'm5r1-6', text: 'Why does Mrs. Chen ask Mr. Patel to speak at the meeting?',
        options: ['He has experience as a carpenter', 'He is the building owner', 'He lives on the first floor', 'He works for the contractor'],
        answer: 0,
        why: '“I know you have experience as a carpenter.”',
      },
      {
        id: 'm5r1-7', text: '',
        options: ['take a day off', 'stay home', 'call the owner', 'leave a key'],
        answer: 3,
        why: 'He works during the day, so he will leave a key.',
      },
      {
        id: 'm5r1-8', text: '',
        options: ['April 7', 'March 25', 'April 14', 'April 21'],
        answer: 2,
        why: 'The third floor is scheduled for the week of April 14.',
      },
      {
        id: 'm5r1-9', text: '',
        options: ['carpenters', 'night-shift workers', 'building owners', 'committee members'],
        answer: 1,
        why: 'The concern is about residents who work night shifts.',
      },
      {
        id: 'm5r1-10', text: '',
        options: ['new furniture', 'no rent increase', 'a later start time', 'free parking'],
        answer: 1,
        why: 'The owner promised no increase this year.',
      },
      {
        id: 'm5r1-11', text: '',
        options: ['speak briefly', 'chair the meeting', 'replace the windows', 'bring snacks'],
        answer: 0,
        why: 'She asked him to “speak briefly about what to expect.”',
      },
    ],
  },
  {
    id: 'm5-reading-2', taskTypeId: 'reading-2', draft: true,
    instructions: 'Read the chart and the email. Choose the best option for each blank (1 to 5). Then answer questions 6 to 8.',
    blocks: [
      {
        kind: 'table', title: 'Hotels near the Toronto Convention Centre',
        columns: ['Hotel', 'Price per night', 'Walk to the centre', 'Breakfast', 'Other features'],
        rows: [
          ['Harbour Grand', '$289', '2 minutes', 'Included', 'Pool, gym'],
          ['City Lodge', '$179', '15 minutes', '$18 extra', 'Free Wi-Fi'],
          ['Union Suites', '$215', '8 minutes', 'Included', 'Kitchen in every room'],
          ['Budget Inn', '$129', '35 minutes (or 10 by subway)', 'Not available', 'Free parking'],
        ],
        note: 'Conference guests get 10% off at Harbour Grand and Union Suites with the code CONF26.',
      },
      { kind: 'cloze', title: 'Email from Alicia to her manager, David', body: 'Hi David,\n\nI’ve looked at hotels for the conference. Since you have a bad knee and want to walk as little as possible, I suggest [[m5r2-1]]. It’s the closest, and it has [[m5r2-2]] if you want to exercise in the evening.\n\nFor me, I’d prefer [[m5r2-3]], because I have food allergies and like to cook my own meals. It also includes breakfast and is only [[m5r2-4]] away.\n\nDon’t forget to use the code CONF26 when booking, which gives us [[m5r2-5]].\n\nAlicia' },
    ],
    questions: [
      {
        id: 'm5r2-1', text: '',
        options: ['City Lodge', 'Union Suites', 'Harbour Grand', 'Budget Inn'],
        answer: 2,
        why: 'Harbour Grand is a 2-minute walk.',
      },
      {
        id: 'm5r2-2', text: '',
        options: ['free parking', 'a pool and gym', 'a kitchen', 'free Wi-Fi'],
        answer: 1,
        why: 'Harbour Grand features: “Pool, gym.”',
      },
      {
        id: 'm5r2-3', text: '',
        options: ['Union Suites', 'Harbour Grand', 'City Lodge', 'Budget Inn'],
        answer: 0,
        why: 'Union Suites has a kitchen in every room.',
      },
      {
        id: 'm5r2-4', text: '',
        options: ['2 minutes', '15 minutes', '35 minutes', '8 minutes'],
        answer: 3,
        why: 'Union Suites is an 8-minute walk.',
      },
      {
        id: 'm5r2-5', text: '',
        options: ['free breakfast', 'free parking', '10% off', 'a late checkout'],
        answer: 2,
        why: 'The code gives 10% off at those two hotels.',
      },
      {
        id: 'm5r2-6', text: 'Which hotel would be best for someone driving to the conference?',
        options: ['Harbour Grand', 'Budget Inn', 'City Lodge', 'Union Suites'],
        answer: 1,
        why: 'Only Budget Inn has free parking.',
      },
      {
        id: 'm5r2-7', text: 'How much would breakfast cost at City Lodge?',
        options: ['$18', 'Nothing', '$10', 'It is not available'],
        answer: 0,
        why: 'Breakfast is “$18 extra.”',
      },
      {
        id: 'm5r2-8', text: 'How can guests at Budget Inn reach the centre faster than walking?',
        options: ['By free shuttle', 'By taxi from the hotel', 'By hotel bicycle', 'By subway'],
        answer: 3,
        why: '“35 minutes (or 10 by subway).”',
      },
    ],
  },
  {
    id: 'm5-reading-3', taskTypeId: 'reading-3', draft: true,
    instructions: 'Read the article. Decide which paragraph, A to D, has the information in each statement. If the information is not in the article, choose E.',
    blocks: [
      { kind: 'text', title: 'Why everyone is talking about pickleball', body: 'A. Walk past a community centre in almost any Canadian town and you may hear a hollow “pop, pop, pop.” That’s the sound of pickleball, a paddle sport that mixes parts of tennis, badminton and table tennis. It is played on a court about a third the size of a tennis court, with a plastic ball full of holes.\n\nB. The game was invented in the United States in the 1960s by three fathers looking for a way to keep their children busy in the summer. For decades it stayed fairly unknown. Over the last few years, however, the number of players has grown quickly, and many cities have added new courts or painted pickleball lines on old tennis courts.\n\nC. Part of the appeal is that beginners can enjoy a real game on their first day. The paddles are light, the ball moves slowly, and the serve is made underhand. Players of very different ages often play together, and many clubs hold drop-in sessions where newcomers are paired with experienced players.\n\nD. Its popularity has also caused some tension. Neighbours living near outdoor courts have complained about the constant noise, and some cities have limited playing hours or built sound barriers. Tennis players, meanwhile, say they are losing court time as more courts are shared or converted.' },
    ],
    questions: [
      { id: 'm5r3-1', text: 'The sport was created to entertain children.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 1, why: 'Paragraph B: three fathers wanted “to keep their children busy.”' },
      { id: 'm5r3-2', text: 'People living near courts are bothered by the sound.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 3, why: 'Paragraph D: neighbours “have complained about the constant noise.”' },
      { id: 'm5r3-3', text: 'New players are matched with skilled players at some clubs.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 2, why: 'Paragraph C: newcomers “are paired with experienced players.”' },
      { id: 'm5r3-4', text: 'The court is smaller than a tennis court.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 0, why: 'Paragraph A: “about a third the size of a tennis court.”' },
      { id: 'm5r3-5', text: 'Some tennis courts have been changed for pickleball.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 1, why: 'Paragraph B: cities have “painted pickleball lines on old tennis courts.”' },
      { id: 'm5r3-6', text: 'The game is easy to learn quickly.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 2, why: 'Paragraph C: “beginners can enjoy a real game on their first day.”' },
      { id: 'm5r3-7', text: 'Professional players can earn large prizes.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 4, why: 'The article does not mention professional players or prizes.' },
      { id: 'm5r3-8', text: 'Some places have reduced the hours when people can play.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 3, why: 'Paragraph D: some cities “have limited playing hours.”' },
      { id: 'm5r3-9', text: 'The game combines features of other sports.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 0, why: 'Paragraph A: it “mixes parts of tennis, badminton and table tennis.”' },
    ],
  },
  {
    id: 'm5-reading-4', taskTypeId: 'reading-4', draft: true,
    instructions: 'Read the article and answer questions 1 to 5. Then read a reader’s comment and choose the best option for each blank (6 to 10).',
    blocks: [
      { kind: 'text', title: 'Should dogs come to the office?', body: 'When software company Brightpath moved into a new office in Kelowna last year, it introduced a policy that surprised some staff: employees can now bring their dogs to work. On a typical day, around a dozen dogs nap under desks or wander the hallways.\n\nChief executive Marc Dubois says the change was partly about hiring. “Young workers told us flexibility matters more than almost anything,” he says. “For many of them, that includes not leaving their dog alone for ten hours.” He also believes dogs reduce stress. “It’s hard to stay angry about a bug in the code when a golden retriever puts its head on your knee.”\n\nNot every employee agrees. Designer Leah Morgan has a dog allergy and now takes medication every working day. “The company offered to move my desk to a dog-free area,” she says, “but it’s next to the kitchen and very noisy. I feel like I’m the one being punished.” Others say barking during video calls can look unprofessional to clients.\n\nWorkplace psychologist Dr. Owen Grant says pet-friendly offices can work, but only with clear rules. He recommends a short trial, a limit on the number of dogs per day, proof of vaccinations, and true dog-free zones that are as comfortable as the rest of the office. “The aim,” he says, “is a policy that welcomes dogs without pushing people out.”\n\nBrightpath says it will survey staff in June and adjust the policy based on the results.' },
      { kind: 'cloze', title: 'Reader comment from Sara T.', body: 'I own a dog and would love to bring her to work, so I understand why Mr. Dubois thinks dogs [[m5r4-6]]. But I felt bad reading about Ms. Morgan, who has to [[m5r4-7]] every day and was offered a desk [[m5r4-8]].\n\nDr. Grant’s advice makes sense, especially the idea of a [[m5r4-9]] before making the policy permanent. I’m glad Brightpath plans to [[m5r4-10]] in June.' },
    ],
    questions: [
      {
        id: 'm5r4-1', text: 'What is Brightpath’s new policy?',
        options: ['Employees must work from home', 'Employees may bring dogs to work', 'Dogs are banned from the office', 'Staff get a pet allowance'],
        answer: 1,
        why: '“Employees can now bring their dogs to work.”',
      },
      {
        id: 'm5r4-2', text: 'According to Marc Dubois, why did the company make this change?',
        options: ['To attract young workers', 'To save money', 'Because clients asked for it', 'To sell dog products'],
        answer: 0,
        why: 'It “was partly about hiring.”',
      },
      {
        id: 'm5r4-3', text: 'What does Dubois believe dogs do?',
        options: ['Improve code quality', 'Attract clients', 'Keep the office safe', 'Reduce stress'],
        answer: 3,
        why: '“He also believes dogs reduce stress.”',
      },
      {
        id: 'm5r4-4', text: 'Why is Leah Morgan unhappy with the solution offered?',
        options: ['She has to work from home', 'She must pay for medication', 'The dog-free area is noisy', 'She was asked to leave'],
        answer: 2,
        why: 'The dog-free desk “is next to the kitchen and very noisy.”',
      },
      {
        id: 'm5r4-5', text: 'Which of these does Dr. Grant recommend?',
        options: ['Allowing every employee’s dog every day', 'Proof that dogs are vaccinated', 'Ending the policy immediately', 'Letting clients decide'],
        answer: 1,
        why: 'He recommends “proof of vaccinations.”',
      },
      {
        id: 'm5r4-6', text: '',
        options: ['reduce stress', 'cause allergies', 'bother clients', 'cost money'],
        answer: 0,
        why: 'Dubois believes dogs reduce stress.',
      },
      {
        id: 'm5r4-7', text: '',
        options: ['work from home', 'walk the dogs', 'move offices', 'take medication'],
        answer: 3,
        why: 'She takes medication every working day.',
      },
      {
        id: 'm5r4-8', text: '',
        options: ['beside a sunny window', 'in a quiet private room', 'next to the noisy kitchen', 'in another building nearby'],
        answer: 2,
        why: 'The dog-free area is next to the kitchen and very noisy.',
      },
      {
        id: 'm5r4-9', text: '',
        options: ['longer workday', 'short trial', 'larger office', 'dog training class'],
        answer: 1,
        why: 'Dr. Grant recommends “a short trial.”',
      },
      {
        id: 'm5r4-10', text: '',
        options: ['hire more designers', 'survey its staff', 'move to a new office', 'ban all dogs'],
        answer: 1,
        why: 'Brightpath “will survey staff in June.”',
      },
    ],
  },
];
