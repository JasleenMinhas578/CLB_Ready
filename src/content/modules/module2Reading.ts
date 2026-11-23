import type { ReadingPart } from '../objective';

/** Module 2 reading: 4 parts, 38 questions. Original practice material in CELPIP style. */
export const module2Reading: ReadingPart[] = [
  {
    id: 'm2-reading-1', taskTypeId: 'reading-1', draft: true,
    instructions: 'Read the following message. Then answer questions 1 to 6. After that, complete the reply by choosing the best option for each blank (7 to 11).',
    blocks: [
      { kind: 'text', title: 'Message from Jenna', body: 'Hi Omar,\n\nIt’s been almost three months since I left the office, so I thought I’d finally tell you how things are going in Saskatoon. In short: I love the new job, but I’m still getting used to the hours.\n\nAs you know, I took the manager position at my aunt’s bakery. I start at five in the morning, which was a shock at first. The good part is that I finish at one, so I have the whole afternoon free. I’ve been using that time to take a pastry course at the college two afternoons a week.\n\nThe hardest part has been the staff schedule. Two of our bakers are students, and their class times change every term, so I’m always rewriting the timetable. I remember you used an app for shift planning at the office. Could you send me the name of it? I’d be happy to pay for it if it saves me a few hours a week.\n\nAlso, my aunt is thinking about opening a second location next year, possibly near the university. She has asked me to put together a business plan, and I have no idea where to start. You helped write the proposal for the Calgary office, so any tips would be amazing.\n\nFinally, if you ever come to Saskatchewan, you have a free cinnamon bun waiting for you. Say hi to everyone on the team for me.\n\nJenna' },
      { kind: 'cloze', title: 'Omar’s reply', body: 'Hi Jenna,\n\nSo good to hear from you! I can’t imagine starting work at five, but having your afternoons free for [[m2r1-7]] sounds worth it.\n\nThe app we use is called ShiftWise. It’s perfect for staff whose [[m2r1-8]], because they can update their own availability. There’s a free version for small teams, so you may not need to [[m2r1-9]] at all.\n\nFor the business plan, start the same way I did for [[m2r1-10]]: describe the customers first, then the costs. I’ll email you my old outline.\n\nI’m holding you to that [[m2r1-11]], by the way. Everyone here says hi!\n\nOmar' },
    ],
    questions: [
      {
        id: 'm2r1-1', text: 'Why is Jenna writing to Omar?',
        options: ['To invite him to come and work at the bakery', 'To share news about her new life and ask for help', 'To complain about her aunt and the long hours', 'To ask him to take a pastry course at the college'],
        answer: 1,
        why: 'She tells him how things are going and then asks for the app name and business plan tips.',
      },
      {
        id: 'm2r1-2', text: 'What does Jenna like about her work hours?',
        options: ['She has free time in the afternoon', 'She can sleep late', 'She works only two days a week', 'She can choose her own schedule'],
        answer: 0,
        why: '“I finish at one, so I have the whole afternoon free.”',
      },
      {
        id: 'm2r1-3', text: 'Why is the staff schedule difficult?',
        options: ['The bakery is open all night', 'Her aunt changes it every week', 'There are not enough bakers', 'Some workers’ class times keep changing'],
        answer: 3,
        why: 'Two bakers are students, and “their class times change every term.”',
      },
      {
        id: 'm2r1-4', text: 'What does Jenna want to know from Omar?',
        options: ['How to bake cinnamon buns', 'When he is coming to Saskatoon', 'The name of a scheduling app', 'Who manages the Calgary office'],
        answer: 2,
        why: '“Could you send me the name of it?”',
      },
      {
        id: 'm2r1-5', text: 'Why does Jenna think Omar can help with the business plan?',
        options: ['He owns a bakery', 'He helped write a similar document before', 'He studied business at the university', 'He knows her aunt well'],
        answer: 1,
        why: '“You helped write the proposal for the Calgary office.”',
      },
      {
        id: 'm2r1-6', text: 'What is Jenna’s aunt considering?',
        options: ['Opening another bakery', 'Selling the bakery', 'Closing on weekends', 'Hiring Omar'],
        answer: 0,
        why: 'She is “thinking about opening a second location next year.”',
      },
      {
        id: 'm2r1-7', text: '',
        options: ['more sleep', 'your second job', 'visiting Calgary', 'your pastry course'],
        answer: 3,
        why: 'Jenna uses her afternoons for a pastry course.',
      },
      {
        id: 'm2r1-8', text: '',
        options: ['pay is very low', 'work is far away', 'schedules change often', 'bosses are strict'],
        answer: 2,
        why: 'Her student bakers’ class times change every term.',
      },
      {
        id: 'm2r1-9', text: '',
        options: ['learn a new language', 'pay for it', 'hire more staff', 'change your hours'],
        answer: 1,
        why: 'Jenna offered to pay for the app; Omar says the free version may be enough.',
      },
      {
        id: 'm2r1-10', text: '',
        options: ['my pastry course', 'the Calgary proposal', 'the university', 'the bakery menu'],
        answer: 1,
        why: 'Omar helped write the proposal for the Calgary office.',
      },
      {
        id: 'm2r1-11', text: '',
        options: ['free cinnamon bun', 'business plan', 'shift schedule', 'second location'],
        answer: 0,
        why: 'Jenna promised him a free cinnamon bun.',
      },
    ],
  },
  {
    id: 'm2-reading-2', taskTypeId: 'reading-2', draft: true,
    instructions: 'Read the chart and the email. Choose the best option for each blank (1 to 5). Then answer questions 6 to 8.',
    blocks: [
      {
        kind: 'table', title: 'Northside Fitness: Membership plans',
        columns: ['Plan', 'Monthly fee', 'Hours', 'Includes', 'Contract'],
        rows: [
          ['Basic', '$29', '6 a.m. to 10 p.m.', 'Gym floor only', '12 months'],
          ['Flex', '$45', '6 a.m. to 10 p.m.', 'Gym floor and group classes', 'None, cancel any time'],
          ['Plus', '$59', 'Open 24 hours', 'Gym floor, group classes and pool', '12 months'],
          ['Student', '$25', '6 a.m. to 10 p.m.', 'Gym floor and group classes', '4 months (one term)'],
        ],
        note: 'A one-time sign-up fee of $40 applies to all plans except Flex. Student ID required for the Student plan.',
      },
      { kind: 'cloze', title: 'Email from Kevin to his friend Tariq', body: 'Hi Tariq,\n\nYou asked which plan at Northside makes sense for us. Since you work night shifts, you’ll want to go after 10 p.m., so the only plan that works for you is [[m2r2-1]]. It’s also the only one with [[m2r2-2]], which you said you’d use.\n\nFor me, I’m only in town until the end of August, so I don’t want to sign a long contract. I’ll take [[m2r2-3]], because I can [[m2r2-4]].\n\nMy sister Lina is starting university in September. She can get the cheapest plan, as long as she shows [[m2r2-5]].\n\nKevin' },
    ],
    questions: [
      {
        id: 'm2r2-1', text: '',
        options: ['Basic', 'Flex', 'Plus', 'Student'],
        answer: 2,
        why: 'Only the Plus plan is open 24 hours.',
      },
      {
        id: 'm2r2-2', text: '',
        options: ['free parking', 'a pool', 'personal training', 'no sign-up fee'],
        answer: 1,
        why: 'Plus is the only plan that includes the pool.',
      },
      {
        id: 'm2r2-3', text: '',
        options: ['Flex', 'Basic', 'Plus', 'Student'],
        answer: 0,
        why: 'Flex has no contract.',
      },
      {
        id: 'm2r2-4', text: '',
        options: ['swim every day', 'go after midnight', 'pay only $25', 'cancel any time'],
        answer: 3,
        why: 'The Flex contract is “None, cancel any time.”',
      },
      {
        id: 'm2r2-5', text: '',
        options: ['a doctor’s note', 'her passport', 'her student ID', 'a letter from Kevin'],
        answer: 2,
        why: '“Student ID required for the Student plan.”',
      },
      {
        id: 'm2r2-6', text: 'How much will Kevin pay to sign up?',
        options: ['$40 for the sign-up fee', 'Nothing', '$29 for the first month', '$45 plus the sign-up fee'],
        answer: 1,
        why: 'The $40 sign-up fee applies to all plans except Flex.',
      },
      {
        id: 'm2r2-7', text: 'How long is the Student plan contract?',
        options: ['Four months', 'Twelve months', 'One month', 'There is no contract'],
        answer: 0,
        why: 'The Student plan contract is “4 months (one term).”',
      },
      {
        id: 'm2r2-8', text: 'Which two plans include group classes but no pool?',
        options: ['Basic and Flex', 'Plus and Student', 'Basic and Plus', 'Flex and Student'],
        answer: 3,
        why: 'Flex and Student both include the gym floor and group classes only.',
      },
    ],
  },
  {
    id: 'm2-reading-3', taskTypeId: 'reading-3', draft: true,
    instructions: 'Read the article. Decide which paragraph, A to D, has the information in each statement. If the information is not in the article, choose E.',
    blocks: [
      { kind: 'text', title: 'Fix it, don’t throw it away', body: 'A. On the first Saturday of every month, a church basement in a small Ontario town fills with broken toasters, torn jackets and wobbly chairs. It is a repair café: a free event where volunteers with practical skills help people fix their own belongings. The idea began in the Netherlands in 2009 and has since spread to many countries, including Canada.\n\nB. The volunteers are usually retired electricians, tailors, carpenters and computer technicians. They don’t simply fix items for visitors. Instead, they work side by side, explaining each step so the owner can do it alone next time. Many cafés also serve coffee and homemade snacks, which organizers say helps turn strangers into neighbours.\n\nC. Supporters say repair cafés save money and keep useful items out of landfills. One organizer estimates that her group fixes about two-thirds of the items people bring in. Lamps and small kitchen appliances are the most common, while phones and laptops are harder because spare parts are difficult to find.\n\nD. Some manufacturers make repairs difficult on purpose, critics argue, by gluing parts together or refusing to sell spare parts. Several provinces have discussed “right to repair” laws that would require companies to provide parts and instructions. Until then, repair café volunteers say, the most important tool is patience.' },
    ],
    questions: [
      { id: 'm2r3-1', text: 'The idea started in another country.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 0, why: 'Paragraph A: “The idea began in the Netherlands in 2009.”' },
      { id: 'm2r3-2', text: 'Visitors learn how to make repairs themselves.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 1, why: 'Paragraph B: volunteers explain each step “so the owner can do it alone next time.”' },
      { id: 'm2r3-3', text: 'Electronic devices are often hard to fix because of missing parts.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 2, why: 'Paragraph C: phones and laptops are harder “because spare parts are difficult to find.”' },
      { id: 'm2r3-4', text: 'Governments have talked about new rules for companies.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 3, why: 'Paragraph D: provinces “have discussed ‘right to repair’ laws.”' },
      { id: 'm2r3-5', text: 'Food is offered at many of the events.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 1, why: 'Paragraph B: many cafés “serve coffee and homemade snacks.”' },
      { id: 'm2r3-6', text: 'Most of the items brought in are successfully repaired.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 2, why: 'Paragraph C: about two-thirds of items are fixed.' },
      { id: 'm2r3-7', text: 'Repair cafés receive money from the government.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 4, why: 'The article does not say how repair cafés are funded.' },
      { id: 'm2r3-8', text: 'Some products are designed to be difficult to repair.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 3, why: 'Paragraph D: some manufacturers “make repairs difficult on purpose.”' },
      { id: 'm2r3-9', text: 'One event takes place in a church building each month.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 0, why: 'Paragraph A: a church basement fills up “on the first Saturday of every month.”' },
    ],
  },
  {
    id: 'm2-reading-4', taskTypeId: 'reading-4', draft: true,
    instructions: 'Read the article and answer questions 1 to 5. Then read a reader’s comment and choose the best option for each blank (6 to 10).',
    blocks: [
      { kind: 'text', title: 'Should drivers pay to enter downtown?', body: 'City council in Harbourview is debating a plan to charge drivers $8 a day to enter the downtown core on weekdays. Money from the charge would go to public transit, and the city expects traffic downtown to drop by about 15 percent.\n\nCouncillor Maria Santos, who proposed the plan, says the city has no room to build more roads. “Every morning, buses carrying fifty people sit in the same traffic as cars carrying one,” she says. “If we want faster buses, we need fewer cars, and this charge gives people a reason to leave the car at home.”\n\nBusiness owners are divided. Pierre Lavoie, who runs a hardware store downtown, fears customers will simply shop at the big stores in the suburbs instead. “Nobody is going to pay eight dollars to buy a box of nails,” he says. But café owner Hana Kim thinks the opposite may happen. “Most of my customers walk or take the bus. If the streets are quieter and cleaner, more people will want to spend time here.”\n\nOthers worry about fairness. Shift workers who start before the buses run, or people who live in areas with poor transit, would have no real choice but to pay. Councillor Santos says the plan would include discounts for people with low incomes and free entry for people with disabilities.\n\nA public survey last month found residents almost evenly split. Council has decided to test the charge for one year before making it permanent, and the results will be reviewed by an independent group of transport experts.' },
      { kind: 'cloze', title: 'Reader comment from Mei L.', body: 'I drive downtown every day, so I expected to hate this plan. But Councillor Santos makes a good point that buses are stuck in [[m2r4-6]]. I also agree with Hana Kim that quieter streets could [[m2r4-7]].\n\nStill, I understand Mr. Lavoie’s worry that shoppers will go to [[m2r4-8]] instead. And I’m glad the plan includes [[m2r4-9]] for people with low incomes. Since council will only [[m2r4-10]] at first, I’m willing to give it a chance.' },
    ],
    questions: [
      {
        id: 'm2r4-1', text: 'What would the money from the charge be used for?',
        options: ['New roads', 'Public transit', 'Downtown parking', 'Business discounts'],
        answer: 1,
        why: '“Money from the charge would go to public transit.”',
      },
      {
        id: 'm2r4-2', text: 'What is Councillor Santos’s main argument?',
        options: ['Fewer cars would let buses move faster', 'Drivers should pay for road repairs', 'The city needs more parking', 'Downtown businesses want the charge'],
        answer: 0,
        why: '“If we want faster buses, we need fewer cars.”',
      },
      {
        id: 'm2r4-3', text: 'Why does Hana Kim think the plan could help her business?',
        options: ['She will get a discount', 'Her café is in the suburbs', 'She plans to sell bus tickets', 'Most of her customers don’t drive'],
        answer: 3,
        why: '“Most of my customers walk or take the bus.”',
      },
      {
        id: 'm2r4-4', text: 'Which group might have no real choice but to pay?',
        options: ['People with disabilities who drive downtown', 'Café owners whose customers walk or bike', 'People who start work before buses run', 'Transport experts who study the results'],
        answer: 2,
        why: 'Shift workers who start before the buses run “would have no real choice but to pay.”',
      },
      {
        id: 'm2r4-5', text: 'What has council decided to do?',
        options: ['Make the charge permanent now', 'Try the charge for a year first', 'Cancel the plan', 'Hold another survey'],
        answer: 1,
        why: 'Council “has decided to test the charge for one year.”',
      },
      {
        id: 'm2r4-6', text: '',
        options: ['the same traffic as cars', 'bad weather in winter', 'the suburbs every evening', 'empty streets on weekends'],
        answer: 0,
        why: 'Santos: buses “sit in the same traffic as cars.”',
      },
      {
        id: 'm2r4-7', text: '',
        options: ['raise the daily charge', 'hurt local bus drivers', 'close more of the shops', 'attract more visitors'],
        answer: 3,
        why: 'Kim says more people will want to spend time downtown.',
      },
      {
        id: 'm2r4-8', text: '',
        options: ['other cafés downtown', 'online shops in the U.S.', 'big stores in the suburbs', 'the hardware store'],
        answer: 2,
        why: 'Lavoie fears customers will shop at the big suburban stores.',
      },
      {
        id: 'm2r4-9', text: '',
        options: ['free parking', 'discounts', 'bus passes', 'tax refunds'],
        answer: 1,
        why: 'The plan includes “discounts for people with low incomes.”',
      },
      {
        id: 'm2r4-10', text: '',
        options: ['charge it on weekends', 'test it for one year', 'ask businesses', 'use it for roads'],
        answer: 1,
        why: 'Council will test the charge for one year.',
      },
    ],
  },
];
