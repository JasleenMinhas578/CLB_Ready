import type { ListeningPart } from '../objective';

/** Module 5 listening: 6 parts, 38 questions. Original scripts in CELPIP style; each clip plays once. */
export const module5Listening: ListeningPart[] = [
  {
    id: 'm5-listening-1', taskTypeId: 'listening-1', draft: true,
    instructions: 'You will hear a conversation in three sections. Each section plays once. After each section, answer its questions.',
    clips: [
      {
        id: 'm5-l1-c1',
        intro: 'Jess and her husband, Kofi, are talking at breakfast on a weekday morning.',
        speakers: [{ name: 'Jess', voice: 'af_heart' }, { name: 'Kofi', voice: 'am_adam' }],
        lines: [
          { speaker: 'Jess', text: 'Kofi, did you see the text from the daycare? They’re closing at three today instead of six. A water pipe burst in the kitchen.' },
          { speaker: 'Kofi', text: 'Three? I have a client presentation until four, and I can’t move it. The client is flying in from Calgary.' },
          { speaker: 'Jess', text: 'And I’m working at the hospital until five. There’s no way I can leave early. We’re already short of nurses this week.' },
          { speaker: 'Kofi', text: 'So neither of us can pick up Ama at three. What about your mom?' },
          { speaker: 'Jess', text: 'She’s at her doctor’s appointment across town. I’ll call her, but I don’t think she’ll make it back in time.' },
        ],
        questions: [
          {
            id: 'm5l1c1-1', text: 'Why is the daycare closing early?',
            options: ['A staff member is sick', 'A pipe burst', 'There is a holiday', 'There is a power failure'],
            answer: 1,
            why: '“A water pipe burst in the kitchen.”',
          },
          {
            id: 'm5l1c1-2', text: 'Why can’t Kofi leave work early?',
            options: ['He has an important client presentation', 'He is flying to Calgary this afternoon', 'His office is short of staff this week', 'His car is at the garage being repaired'],
            answer: 0,
            why: 'He has a client presentation until four that he can’t move.',
          },
          {
            id: 'm5l1c1-3', text: 'Where is Jess’s mother today?',
            options: ['At work across town', 'Visiting family in Calgary', 'Helping out at the daycare', 'At a doctor’s appointment'],
            answer: 3,
            why: '“She’s at her doctor’s appointment across town.”',
          },
        ],
      },
      {
        id: 'm5-l1-c2',
        intro: 'Jess and Kofi think of other options.',
        speakers: [{ name: 'Jess', voice: 'af_heart' }, { name: 'Kofi', voice: 'am_adam' }],
        lines: [
          { speaker: 'Kofi', text: 'What about our neighbour, Mrs. Fraser? Ama loves her.' },
          { speaker: 'Jess', text: 'She does, but the daycare only releases children to people on our pickup list. Mrs. Fraser isn’t on it.' },
          { speaker: 'Kofi', text: 'Can we add her?' },
          { speaker: 'Jess', text: 'The director said we can add someone by email, but they need to show photo ID at pickup, and the change takes effect the same day if we send it before noon.' },
          { speaker: 'Kofi', text: 'That’s doable. Is Mrs. Fraser home today?' },
          { speaker: 'Jess', text: 'I think so. She’s retired and usually gardens in the afternoon. But she doesn’t drive anymore, and the daycare is a twenty-minute walk.' },
          { speaker: 'Kofi', text: 'She walks to the library every day, so twenty minutes shouldn’t be a problem.' },
        ],
        questions: [
          {
            id: 'm5l1c2-4', text: 'Why can’t Mrs. Fraser pick up Ama right now?',
            options: ['She is working at the library today', 'Ama doesn’t know her very well', 'She is not on the pickup list', 'She is sick and staying in bed'],
            answer: 2,
            why: 'The daycare only releases children to people on the list.',
          },
          {
            id: 'm5l1c2-5', text: 'When must they send the email for the change to work today?',
            options: ['Before three', 'Before noon', 'Before nine', 'Any time today'],
            answer: 1,
            why: 'It takes effect the same day “if we send it before noon.”',
          },
          {
            id: 'm5l1c2-6', text: 'How will Mrs. Fraser get to the daycare?',
            options: ['She will walk', 'She will drive', 'She will take a taxi', 'Kofi will drive her'],
            answer: 0,
            why: 'She doesn’t drive, but she walks to the library every day.',
          },
        ],
      },
      {
        id: 'm5-l1-c3',
        intro: 'Jess and Kofi decide what to do.',
        speakers: [{ name: 'Jess', voice: 'af_heart' }, { name: 'Kofi', voice: 'am_adam' }],
        lines: [
          { speaker: 'Jess', text: 'Okay. I’ll call Mrs. Fraser now and ask if she can do it. If she says yes, can you email the daycare? You have the director’s address.' },
          { speaker: 'Kofi', text: 'Sure. I’ll send it from the bus. And I’ll pick Ama up from Mrs. Fraser’s place as soon as my presentation ends, around four thirty.' },
          { speaker: 'Jess', text: 'Perfect. I’ll pack some snacks and Ama’s favourite book in her bag, so she isn’t bored.' },
          { speaker: 'Kofi', text: 'And let’s buy Mrs. Fraser some flowers to say thank you.' },
        ],
        questions: [
          {
            id: 'm5l1c3-7', text: 'What will Kofi do on the bus?',
            options: ['Call Mrs. Fraser', 'Prepare his presentation', 'Buy flowers', 'Email the daycare'],
            answer: 3,
            why: '“I’ll send it from the bus.”',
          },
          {
            id: 'm5l1c3-8', text: 'When will Kofi pick up Ama from Mrs. Fraser’s home?',
            options: ['Right at 3:00', 'At about 5:30', 'Around 4:30', 'Just after noon'],
            answer: 2,
            why: 'He will pick her up “around four thirty.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm5-listening-2', taskTypeId: 'listening-2', draft: true,
    instructions: 'You will hear a conversation. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm5-l2-c1',
        intro: 'Martin calls a restaurant to book a table and talks to Sophie, the host.',
        speakers: [{ name: 'Sophie', voice: 'af_bella' }, { name: 'Martin', voice: 'bm_george' }],
        lines: [
          { speaker: 'Sophie', text: 'Good afternoon, Olive Tree Bistro. This is Sophie.' },
          { speaker: 'Martin', text: 'Hi Sophie. I’d like to book a table for six people this Saturday at seven, please. It’s for my parents’ anniversary.' },
          { speaker: 'Sophie', text: 'Congratulations! Let me check. Seven is fully booked, but I can offer you six fifteen or eight thirty.' },
          { speaker: 'Martin', text: 'Six fifteen is fine. One more thing: my daughter has a severe peanut allergy. Is that a problem?' },
          { speaker: 'Sophie', text: 'Thanks for telling me. Our kitchen doesn’t use peanuts, but some desserts contain other nuts, and they’re made in the same area. I’ll add a note so the chef can prepare her meal separately, and the server will go over the menu with you.' },
          { speaker: 'Martin', text: 'That’s reassuring. Could we have a table somewhere quiet? My father uses hearing aids.' },
          { speaker: 'Sophie', text: 'I’ll put you at our corner table by the window. It’s away from the kitchen and the bar.' },
          { speaker: 'Martin', text: 'Wonderful. And could you bring out a small cake at the end? I’ll bring candles.' },
          { speaker: 'Sophie', text: 'We can do a chocolate cake for twenty-five dollars, nut-free of course. Please call by Thursday so the chef has time to make it.' },
        ],
        questions: [
          {
            id: 'm5l2c1-1', text: 'What time is Martin’s booking?',
            options: ['7:00', '6:15', '8:30', '6:00'],
            answer: 1,
            why: 'Seven is full, and he accepts “six fifteen.”',
          },
          {
            id: 'm5l2c1-2', text: 'What does Sophie say about nuts?',
            options: ['Some desserts contain other nuts', 'The kitchen uses peanuts in sauces', 'All of the food is completely nut-free', 'The chef cannot make special meals'],
            answer: 0,
            why: '“Some desserts contain other nuts.”',
          },
          {
            id: 'm5l2c1-3', text: 'Why does Martin ask for a quiet table?',
            options: ['His daughter is shy', 'They want to make a speech', 'They are having a business meeting', 'His father uses hearing aids'],
            answer: 3,
            why: '“My father uses hearing aids.”',
          },
          {
            id: 'm5l2c1-4', text: 'Where will the family sit?',
            options: ['At a table next to the bar', 'At a table near the kitchen', 'At a corner table by the window', 'In a private room upstairs'],
            answer: 2,
            why: '“Our corner table by the window.”',
          },
          {
            id: 'm5l2c1-5', text: 'What must Martin do to order the cake?',
            options: ['Bring the cake himself', 'Call by Thursday', 'Pay on Saturday morning', 'Choose a flavour online'],
            answer: 1,
            why: '“Please call by Thursday.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm5-listening-3', taskTypeId: 'listening-3', draft: true,
    instructions: 'You will hear a conversation. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm5-l3-c1',
        intro: 'A family has just arrived at a provincial park campground. Ranger Dave explains the rules to Hiro.',
        speakers: [{ name: 'Ranger Dave', voice: 'am_michael' }, { name: 'Hiro', voice: 'am_puck' }],
        lines: [
          { speaker: 'Ranger Dave', text: 'Welcome to Pine Lake. You’re at site forty-two, a short walk from the beach. Is this your first time here?' },
          { speaker: 'Hiro', text: 'Yes. Is there anything we should know?' },
          { speaker: 'Ranger Dave', text: 'A few things. First, quiet hours are from eleven at night to seven in the morning. Sound carries a long way over the lake.' },
          { speaker: 'Hiro', text: 'Understood. What about campfires?' },
          { speaker: 'Ranger Dave', text: 'Fires are allowed only in the metal fire pit at your site. Right now there’s no fire ban, but check the sign at the entrance each day, because it can change quickly in dry weather. And please don’t bring firewood from home. You can buy local wood at the gatehouse for eight dollars a bundle.' },
          { speaker: 'Hiro', text: 'Why can’t we bring our own wood?' },
          { speaker: 'Ranger Dave', text: 'Wood from other areas can carry insects that kill trees. It’s one of the biggest threats to the forest here.' },
          { speaker: 'Hiro', text: 'I didn’t know that. Anything about wildlife?' },
          { speaker: 'Ranger Dave', text: 'Yes, this is bear country. Never leave food, garbage or even toothpaste in your tent. Lock everything in your car or in the metal food box at your site.' },
          { speaker: 'Hiro', text: 'We’ll be careful. Thanks for the information.' },
        ],
        questions: [
          {
            id: 'm5l3c1-1', text: 'Why are quiet hours important at this campground?',
            options: ['Sound travels far over the lake', 'Bears come out at night', 'The rangers sleep nearby', 'It is the law in all parks'],
            answer: 0,
            why: '“Sound carries a long way over the lake.”',
          },
          {
            id: 'm5l3c1-2', text: 'Where can campers make a fire?',
            options: ['Anywhere on the sand at the beach', 'Only in the area near the gatehouse', 'Nowhere, because fires are not allowed', 'Only in the fire pit at their site'],
            answer: 3,
            why: '“Fires are allowed only in the metal fire pit at your site.”',
          },
          {
            id: 'm5l3c1-3', text: 'Why should campers check the sign at the entrance?',
            options: ['Site numbers change daily', 'The beach may close', 'A fire ban can start quickly', 'Firewood prices change'],
            answer: 2,
            why: 'A fire ban “can change quickly in dry weather.”',
          },
          {
            id: 'm5l3c1-4', text: 'Why can’t campers bring firewood from home?',
            options: ['It burns too fast in the metal fire pits', 'It may carry insects that harm trees', 'It is too heavy for most people to carry', 'It costs the park money in lost sales'],
            answer: 1,
            why: '“Wood from other areas can carry insects that kill trees.”',
          },
          {
            id: 'm5l3c1-5', text: 'How much does a bundle of local firewood cost?',
            options: ['$8', '$4', '$12', 'It is free'],
            answer: 0,
            why: '“Eight dollars a bundle.”',
          },
          {
            id: 'm5l3c1-6', text: 'What should campers never keep in their tent?',
            options: ['Flashlights or lanterns', 'Wet clothes or towels', 'Maps or phones', 'Food or toothpaste'],
            answer: 3,
            why: '“Never leave food, garbage or even toothpaste in your tent.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm5-listening-4', taskTypeId: 'listening-4', draft: true,
    instructions: 'You will hear a news report. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm5-l4-c1',
        intro: 'A news report from a community fair in Manitoba.',
        speakers: [{ name: 'Reporter', voice: 'bf_emma' }],
        lines: [
          { speaker: 'Reporter', text: 'A retired school teacher from the town of Riverview has set a new provincial record with a pumpkin weighing almost nine hundred kilograms. That’s about as heavy as a small car. Ruth Anderson’s giant pumpkin took first prize at the Riverview Fall Fair on Saturday.' },
          { speaker: 'Reporter', text: 'Mrs. Anderson started growing giant pumpkins six years ago, after her grandson brought home seeds from a school project. She says the secret is patience and a lot of water: during the hottest weeks of summer, the pumpkin drank more than two hundred litres a day and grew as much as fifteen kilograms in a single day.' },
          { speaker: 'Reporter', text: 'Moving the pumpkin to the fair was a challenge of its own. Neighbours helped lift it onto a trailer with a borrowed tractor and a special lifting net. The fair’s organizers say it took almost an hour to unload.' },
          { speaker: 'Reporter', text: 'Mrs. Anderson plans to donate the seeds to the local school so students can try growing their own. The pumpkin itself will be carved and displayed at the town hall for Halloween.' },
        ],
        questions: [
          {
            id: 'm5l4c1-1', text: 'What does the reporter compare the pumpkin’s weight to?',
            options: ['A school bus', 'A tractor', 'A small car', 'A horse'],
            answer: 2,
            why: '“About as heavy as a small car.”',
          },
          {
            id: 'm5l4c1-2', text: 'How did Mrs. Anderson become interested in giant pumpkins?',
            options: ['She saw a pumpkin contest on TV', 'Her grandson brought home seeds from school', 'She read about them while teaching', 'Her neighbour grew one in his yard'],
            answer: 1,
            why: 'Her grandson “brought home seeds from a school project.”',
          },
          {
            id: 'm5l4c1-3', text: 'What does she say is important for growing a giant pumpkin?',
            options: ['Patience and a lot of water', 'Special fertilizer and sunlight', 'Expensive seeds from overseas', 'A heated greenhouse in spring'],
            answer: 0,
            why: '“The secret is patience and a lot of water.”',
          },
          {
            id: 'm5l4c1-4', text: 'How did the pumpkin get to the fair?',
            options: ['By truck from a company', 'It was grown at the fair', 'It was rolled down the road', 'On a trailer, with neighbours’ help'],
            answer: 3,
            why: 'Neighbours lifted it onto a trailer with a borrowed tractor.',
          },
          {
            id: 'm5l4c1-5', text: 'What will happen to the seeds?',
            options: ['They will be sold at the next fair', 'She will plant them herself next year', 'They will be donated to the local school', 'They will be shown in a town museum'],
            answer: 2,
            why: 'She “plans to donate the seeds to the local school.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm5-listening-5', taskTypeId: 'listening-5', draft: true,
    instructions: 'You will hear a discussion between three co-workers. It plays once. Note their names before you listen: Brenda, Jamal and Chloe. Then answer the questions.',
    clips: [
      {
        id: 'm5-l5-c1',
        intro: 'Brenda, a team leader, is meeting with Jamal and Chloe about covering the customer help line over the holidays.',
        speakers: [{ name: 'Brenda', voice: 'af_sarah' }, { name: 'Jamal', voice: 'am_michael' }, { name: 'Chloe', voice: 'af_bella' }],
        lines: [
          { speaker: 'Brenda', text: 'Thanks for coming. We need to plan who covers the help line between December twenty-second and January second. We need at least two people each day.' },
          { speaker: 'Jamal', text: 'I can work most of those days. I’m not travelling this year. But I’d really like Christmas Day itself off. My kids are still small.' },
          { speaker: 'Chloe', text: 'I’m flying to Vancouver on the twenty-third and coming back on the twenty-eighth, so I can’t work that week. But I can do the twenty-second and everything from the twenty-ninth on.' },
          { speaker: 'Brenda', text: 'Okay. So between the twenty-third and the twenty-eighth, we’re short. Jamal, you plus who?' },
          { speaker: 'Jamal', text: 'What about Priya from the sales team? She mentioned she wanted extra hours.' },
          { speaker: 'Brenda', text: 'Good idea. I’ll ask her today. If she agrees, she could cover Christmas Day with me, so Jamal can stay home.' },
          { speaker: 'Chloe', text: 'Could we also turn on the chatbot for simple questions over the holidays? Last year most calls were just about store hours.' },
          { speaker: 'Jamal', text: 'I like that, but some older customers really prefer to talk to a person. Let’s keep the phone line open too.' },
          { speaker: 'Brenda', text: 'Agreed. We’ll use both. Chloe, could you update the chatbot answers with the holiday hours?' },
          { speaker: 'Chloe', text: 'Sure, I’ll do it before I leave on the twenty-third.' },
          { speaker: 'Brenda', text: 'Great. I’ll share the final schedule by Friday.' },
        ],
        questions: [
          {
            id: 'm5l5c1-1', text: 'What is the purpose of the meeting?',
            options: ['To plan the team’s holiday party in December', 'To plan holiday staffing for the help line', 'To train new staff to answer the help line', 'To choose a new chatbot for the website'],
            answer: 1,
            why: 'They need to plan who covers the help line over the holidays.',
          },
          {
            id: 'm5l5c1-2', text: 'What does Jamal ask for?',
            options: ['To have Christmas Day off', 'To work only from home', 'To travel to Vancouver', 'To take the whole week off'],
            answer: 0,
            why: '“I’d really like Christmas Day itself off.”',
          },
          {
            id: 'm5l5c1-3', text: 'Why can’t Chloe work from the 23rd to the 28th?',
            options: ['She will be sick after surgery', 'She is moving to a new apartment', 'She has exams at the college', 'She will be travelling'],
            answer: 3,
            why: 'She is flying to Vancouver on the 23rd and back on the 28th.',
          },
          {
            id: 'm5l5c1-4', text: 'Who does Jamal suggest could help?',
            options: ['Brenda’s manager', 'A new employee', 'Priya from sales', 'A temporary agency worker'],
            answer: 2,
            why: '“What about Priya from the sales team?”',
          },
          {
            id: 'm5l5c1-5', text: 'Who will work on Christmas Day if Priya agrees?',
            options: ['Jamal and Priya', 'Brenda and Priya', 'Chloe and Brenda', 'Jamal and Brenda'],
            answer: 1,
            why: 'Priya “could cover Christmas Day with me, so Jamal can stay home.”',
          },
          {
            id: 'm5l5c1-6', text: 'Why does Chloe suggest using the chatbot?',
            options: ['Most calls last year were simple questions', 'There are no staff available at all that week', 'Several customers asked for a chatbot last year', 'It costs less to run than the phone system'],
            answer: 0,
            why: '“Most calls were just about store hours.”',
          },
          {
            id: 'm5l5c1-7', text: 'Why does Jamal want to keep the phone line open?',
            options: ['The chatbot has been broken since last year', 'Phone calls cost the company less money', 'Brenda asked him to keep it open', 'Some older customers prefer talking to a person'],
            answer: 3,
            why: '“Some older customers really prefer to talk to a person.”',
          },
          {
            id: 'm5l5c1-8', text: 'What will Chloe do before she leaves?',
            options: ['Share the final holiday schedule', 'Call Priya about extra hours', 'Update the chatbot with holiday hours', 'Train Jamal on the new chatbot'],
            answer: 2,
            why: '“I’ll do it before I leave on the twenty-third.”',
          },
        ],
      },
    ],
  },
  {
    id: 'm5-listening-6', taskTypeId: 'listening-6', draft: true,
    instructions: 'You will hear a radio talk. It plays once. Then answer the questions.',
    clips: [
      {
        id: 'm5-l6-c1',
        intro: 'A radio host talks about whether Canada is becoming a cashless society.',
        speakers: [{ name: 'Host', voice: 'af_heart' }],
        lines: [
          { speaker: 'Host', text: 'Hello, and thanks for joining us. When was the last time you paid for something with cash? For many Canadians, it’s hard to remember. Cards and phones have become the normal way to pay, and some shops and cafés no longer accept cash at all. Today we ask: is a cashless society a good thing?' },
          { speaker: 'Host', text: 'Supporters say digital payments are faster and more convenient. You don’t need to carry coins, and every purchase is recorded, which helps people track their spending. Businesses save time counting money and making trips to the bank, and some say they are less likely to be robbed.' },
          { speaker: 'Host', text: 'But not everyone can easily go cashless. Some older people are uncomfortable with technology, and people without a bank account, often those with low incomes, depend on cash. There are also concerns about privacy, since digital payments create a record of where we go and what we buy. And when the internet or payment systems go down, as they sometimes do, card-only stores simply can’t sell anything.' },
          { speaker: 'Host', text: 'Economist Dr. Teresa Lam argues that the choice shouldn’t be all or nothing. She says businesses should be free to encourage digital payments, but that essential services, like grocery stores and pharmacies, should still be required to accept cash. That way, she says, no one is shut out of buying what they need.' },
          { speaker: 'Host', text: 'So, cash may be fading, but it isn’t finished yet. Tomorrow, we’ll look at digital currencies and whether they are here to stay.' },
        ],
        questions: [
          {
            id: 'm5l6c1-1', text: 'What has happened in some shops and cafés?',
            options: ['They only take cash', 'They no longer take cash', 'They have closed', 'They charge extra for cards'],
            answer: 1,
            why: 'Some “no longer accept cash at all.”',
          },
          {
            id: 'm5l6c1-2', text: 'What benefit for businesses does the host mention?',
            options: ['Less time spent handling money', 'Higher prices', 'More customers from other countries', 'Lower taxes'],
            answer: 0,
            why: 'Businesses save time counting money and going to the bank.',
          },
          {
            id: 'm5l6c1-3', text: 'Who might find a cashless society difficult?',
            options: ['Young students at university', 'Owners of small businesses', 'People who work in banks', 'People without a bank account'],
            answer: 3,
            why: 'People without a bank account “depend on cash.”',
          },
          {
            id: 'm5l6c1-4', text: 'What privacy concern is mentioned?',
            options: ['Cards can be stolen more easily than cash', 'Stores share their prices with each other', 'Digital payments record where people shop', 'Phones can listen to private conversations'],
            answer: 2,
            why: 'They “create a record of where we go and what we buy.”',
          },
          {
            id: 'm5l6c1-5', text: 'What does Dr. Lam recommend?',
            options: ['All stores should stop accepting cash soon', 'Essential services should still accept cash', 'Cash should be banned in large cities', 'Banks should close most of their branches'],
            answer: 1,
            why: 'Grocery stores and pharmacies “should still be required to accept cash.”',
          },
          {
            id: 'm5l6c1-6', text: 'What will tomorrow’s program be about?',
            options: ['Digital currencies', 'Online banking', 'Saving money', 'Credit card fees'],
            answer: 0,
            why: '“Tomorrow, we’ll look at digital currencies.”',
          },
        ],
      },
    ],
  },
];
