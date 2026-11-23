import type { ReadingPart } from '../objective';

/** Module 4 reading: 4 parts, 38 questions. Original practice material in CELPIP style. */
export const module4Reading: ReadingPart[] = [
  {
    id: 'm4-reading-1', taskTypeId: 'reading-1', draft: true,
    instructions: 'Read the following message. Then answer questions 1 to 6. After that, complete the reply by choosing the best option for each blank (7 to 11).',
    blocks: [
      { kind: 'text', title: 'Message from Luis', body: 'Hey Megan,\n\nGuess what? I’ve been accepted as a volunteer for the Riverbank Film Festival in October! I applied after you told me how much fun you had last year, so this is really your fault.\n\nI’ll be working at the ticket desk for the first weekend, which I’m a bit nervous about. The coordinator said it gets very busy, especially before the evening shows. Since you did the same job, do you have any advice? I’m especially worried about the payment machine. I’ve heard it freezes when the line gets long.\n\nVolunteers get a free pass for four films, but I can only choose them after my training session on September 20. I remember you said the documentaries were the best part. Do you know if they’re usually shown in the afternoon? I work late on weekdays, so I can only watch films on weekends.\n\nOne more thing: they asked each volunteer to bring a friend to help put up posters around town on October 1. Would you like to come with me? It’s only two hours, and there’s free pizza afterwards.\n\nTalk soon,\nLuis' },
      { kind: 'cloze', title: 'Megan’s reply', body: 'Hi Luis,\n\nThat’s great news! You’ll love it. Don’t worry about the ticket desk. The busiest time is right before [[m4r1-7]], so take your break earlier if you can.\n\nAbout the payment machine: yes, it sometimes [[m4r1-8]]. If that happens, just restart it. It takes about a minute.\n\nThe documentaries are usually shown on weekend afternoons, so they should fit your schedule, since you [[m4r1-9]]. You can pick them after your [[m4r1-10]].\n\nAnd of course I’ll help with [[m4r1-11]]. I never say no to free pizza!\n\nMegan' },
    ],
    questions: [
      {
        id: 'm4r1-1', text: 'Why does Luis say it is Megan’s “fault”?',
        options: ['She signed him up for the festival without asking', 'She encouraged him by sharing her experience', 'She is the coordinator of this year’s festival', 'She gave him a ticket to last year’s festival'],
        answer: 1,
        why: 'He applied “after you told me how much fun you had last year.”',
      },
      {
        id: 'm4r1-2', text: 'What job will Luis do at the festival?',
        options: ['Work at the ticket desk', 'Show the films', 'Sell food', 'Put up posters all weekend'],
        answer: 0,
        why: '“I’ll be working at the ticket desk.”',
      },
      {
        id: 'm4r1-3', text: 'What is Luis worried about?',
        options: ['He might lose the tickets', 'He doesn’t know the films', 'The training is too long', 'The payment machine may freeze'],
        answer: 3,
        why: 'He has heard the machine “freezes when the line gets long.”',
      },
      {
        id: 'm4r1-4', text: 'When can Luis choose his free films?',
        options: ['Right away', 'On October 1', 'After his training session', 'After the festival ends'],
        answer: 2,
        why: 'He can choose “after my training session on September 20.”',
      },
      {
        id: 'm4r1-5', text: 'Why can Luis only watch films on weekends?',
        options: ['The festival is only on weekends', 'He works late on weekdays', 'He has classes during the week', 'The pass is only for weekends'],
        answer: 1,
        why: '“I work late on weekdays.”',
      },
      {
        id: 'm4r1-6', text: 'What does Luis invite Megan to do?',
        options: ['Help put up posters', 'Work at the ticket desk', 'Watch a documentary', 'Attend the training'],
        answer: 0,
        why: 'Volunteers bring a friend “to help put up posters.”',
      },
      {
        id: 'm4r1-7', text: '',
        options: ['the morning shows', 'the training', 'lunch', 'the evening shows'],
        answer: 3,
        why: 'The coordinator said it is busiest “before the evening shows.”',
      },
      {
        id: 'm4r1-8', text: '',
        options: ['prints double tickets', 'runs out of paper', 'freezes', 'charges twice'],
        answer: 2,
        why: 'Luis heard the machine freezes.',
      },
      {
        id: 'm4r1-9', text: '',
        options: ['work on weekends', 'are free on weekends', 'live near the cinema', 'love comedies'],
        answer: 1,
        why: 'Luis can only watch films on weekends.',
      },
      {
        id: 'm4r1-10', text: '',
        options: ['first evening shift', 'training session', 'poster day in town', 'first ticket sale'],
        answer: 1,
        why: 'He chooses films after his training session.',
      },
      {
        id: 'm4r1-11', text: '',
        options: ['the posters', 'the ticket desk', 'your training', 'the documentaries'],
        answer: 0,
        why: 'Luis asked her to help put up posters.',
      },
    ],
  },
  {
    id: 'm4-reading-2', taskTypeId: 'reading-2', draft: true,
    instructions: 'Read the chart and the email. Choose the best option for each blank (1 to 5). Then answer questions 6 to 8.',
    blocks: [
      {
        kind: 'table', title: 'Maple Mobile: Monthly phone plans',
        columns: ['Plan', 'Price per month', 'Data', 'Calls and texts', 'Extras'],
        rows: [
          ['Talk', '$20', 'None', 'Unlimited in Canada', 'None'],
          ['Basic', '$35', '5 GB', 'Unlimited in Canada', 'None'],
          ['Plus', '$50', '25 GB', 'Unlimited in Canada and the U.S.', 'Free calls to 10 countries'],
          ['Family', '$110 for 3 lines', '15 GB each line', 'Unlimited in Canada', 'Each extra line $30'],
        ],
        note: 'New customers get the first month free on any plan. Prices do not include tax.',
      },
      { kind: 'cloze', title: 'Email from Huda to her husband Omar', body: 'Hi Omar,\n\nI’ve compared the plans at Maple Mobile. My mother only makes calls and never uses the internet on her phone, so she should get [[m4r2-1]].\n\nYou travel to the U.S. for work every month, so [[m4r2-2]] is the only plan that covers calls there. It also includes [[m4r2-3]], which would help when you call your brother in Egypt.\n\nFor me and the two kids, the Family plan makes sense. It costs [[m4r2-4]] for the three of us, and each of us gets [[m4r2-5]].\n\nHuda' },
    ],
    questions: [
      {
        id: 'm4r2-1', text: '',
        options: ['Basic', 'Plus', 'Talk', 'Family'],
        answer: 2,
        why: 'Talk has calls but no data.',
      },
      {
        id: 'm4r2-2', text: '',
        options: ['Basic', 'Plus', 'Talk', 'Family'],
        answer: 1,
        why: 'Only Plus includes unlimited calls in the U.S.',
      },
      {
        id: 'm4r2-3', text: '',
        options: ['free calls to 10 countries', 'unlimited data in the U.S.', 'a free phone for new customers', 'a discount for family members'],
        answer: 0,
        why: 'Plus extras: “Free calls to 10 countries.”',
      },
      {
        id: 'm4r2-4', text: '',
        options: ['$30', '$50', '$150', '$110'],
        answer: 3,
        why: 'The Family plan is $110 for 3 lines.',
      },
      {
        id: 'm4r2-5', text: '',
        options: ['5 GB of data', '25 GB of data', '15 GB of data', 'no data'],
        answer: 2,
        why: 'The Family plan gives 15 GB on each line.',
      },
      {
        id: 'm4r2-6', text: 'How much would a fourth line on the Family plan cost?',
        options: ['$20 a month', '$30 a month', '$110 a month', 'Nothing'],
        answer: 1,
        why: '“Each extra line $30.”',
      },
      {
        id: 'm4r2-7', text: 'What do new customers receive?',
        options: ['One free month', 'A free phone', 'Extra data', 'No tax'],
        answer: 0,
        why: '“New customers get the first month free on any plan.”',
      },
      {
        id: 'm4r2-8', text: 'Which plan gives the most data to one person?',
        options: ['Basic', 'Family', 'Talk', 'Plus'],
        answer: 3,
        why: 'Plus has 25 GB.',
      },
    ],
  },
  {
    id: 'm4-reading-3', taskTypeId: 'reading-3', draft: true,
    instructions: 'Read the article. Decide which paragraph, A to D, has the information in each statement. If the information is not in the article, choose E.',
    blocks: [
      { kind: 'text', title: 'Saving food, one app at a time', body: 'A. Every evening, bakeries, cafés and grocery stores across Canada are left with food they can no longer sell the next day. Much of it ends up in the garbage, even though it is still perfectly good to eat. A new kind of phone app is trying to change that by connecting these businesses with shoppers looking for a deal.\n\nB. The idea is simple. Near closing time, a store lists a “surprise bag” of unsold food on the app, usually for about a third of the normal price. Customers reserve a bag, pay in the app and pick it up during a short window, often the last hour before the store closes. They don’t know exactly what will be inside, which many users say is part of the fun.\n\nC. For businesses, the benefits go beyond the money they recover. Several owners say the app brings in new customers who later return to buy at full price. A bakery owner in Winnipeg says about one in five app users has become a regular customer, and her staff no longer spend the end of the day throwing bread away.\n\nD. Critics point out that the apps only solve a small part of the problem. Most food waste happens in homes and on farms, not in shops. Others say people with food allergies or special diets can’t easily use a service where the contents are a surprise. Some apps have responded by letting stores label bags as vegetarian or nut-free.' },
    ],
    questions: [
      { id: 'm4r3-1', text: 'Customers pick up their food at a set time.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 1, why: 'Paragraph B: they pick it up “during a short window.”' },
      { id: 'm4r3-2', text: 'Some app users become regular customers.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 2, why: 'Paragraph C: “about one in five app users has become a regular customer.”' },
      { id: 'm4r3-3', text: 'Most food waste does not come from stores.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 3, why: 'Paragraph D: “Most food waste happens in homes and on farms.”' },
      { id: 'm4r3-4', text: 'Good food is often thrown away at the end of the day.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 0, why: 'Paragraph A: much of it “ends up in the garbage.”' },
      { id: 'm4r3-5', text: 'The food is sold at a big discount.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 1, why: 'Paragraph B: “about a third of the normal price.”' },
      { id: 'm4r3-6', text: 'Some apps now show if a bag suits certain diets.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 3, why: 'Paragraph D: stores can label bags “as vegetarian or nut-free.”' },
      { id: 'm4r3-7', text: 'Staff spend less time getting rid of unsold food.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 2, why: 'Paragraph C: staff “no longer spend the end of the day throwing bread away.”' },
      { id: 'm4r3-8', text: 'The apps were first created in Canada.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 4, why: 'The article does not say where the apps were created.' },
      { id: 'm4r3-9', text: 'Buyers do not know the exact contents in advance.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 1, why: 'Paragraph B: “They don’t know exactly what will be inside.”' },
    ],
  },
  {
    id: 'm4-reading-4', taskTypeId: 'reading-4', draft: true,
    instructions: 'Read the article and answer questions 1 to 5. Then read a reader’s comment and choose the best option for each blank (6 to 10).',
    blocks: [
      { kind: 'text', title: 'Should museums be free?', body: 'The Lakeshore Art Museum surprised visitors this spring by ending its $22 entry fee. For a two-year trial, anyone can now walk in for free, seven days a week. Director Elena Novak says the museum wants to reach people who have never felt welcome there.\n\n“Our surveys showed that most of our visitors were older, wealthier and lived in the same three neighbourhoods,” Novak explains. “A $22 ticket is a lot for a family of four. If we receive public money, the public should be able to come in.” In the first three months, visits nearly doubled, and the share of first-time visitors rose from 20 to 45 percent.\n\nNot everyone is celebrating. Ticket sales used to cover about 15 percent of the museum’s budget, and the gap is now being filled by a private donor for the two-year trial only. Board member Richard Hale worries about what happens next. “Generous donors don’t last forever,” he says. “If the money runs out, we may have to cut staff or open fewer days.”\n\nSome regular visitors have also noticed changes. Retired teacher Joan Clarke says the galleries are often crowded on weekends, making it harder to enjoy the art. “I’m glad more people are coming,” she says, “but I miss the quiet.”\n\nNovak says the museum is considering free entry on weekdays and a small fee on weekends, or a “pay what you can” option. A final decision will be made after the trial, based on visitor numbers and a study of the museum’s finances.' },
      { kind: 'cloze', title: 'Reader comment from Daniel K.', body: 'As a parent of three, I agree with Ms. Novak that a $22 ticket is [[m4r4-6]] for many families. The rise in [[m4r4-7]] shows the free entry is working.\n\nHowever, Mr. Hale is right to worry, because the donor will only pay for [[m4r4-8]]. I also understand Ms. Clarke’s complaint about [[m4r4-9]]. In my view, the best idea is [[m4r4-10]], since it keeps the museum open to everyone while still bringing in some money.' },
    ],
    questions: [
      {
        id: 'm4r4-1', text: 'Why did the museum end its entry fee?',
        options: ['To save money', 'To attract people who didn’t visit before', 'Because visitor numbers were rising', 'Because the government ordered it'],
        answer: 1,
        why: 'It wants to reach people “who have never felt welcome there.”',
      },
      {
        id: 'm4r4-2', text: 'What did the museum’s surveys show?',
        options: ['Most visitors came from similar backgrounds', 'Most visitors were students from the college', 'Visitors wanted the museum to stay open later', 'Families with children visited most often'],
        answer: 0,
        why: 'Visitors were mostly older, wealthier and from three neighbourhoods.',
      },
      {
        id: 'm4r4-3', text: 'What happened in the first three months?',
        options: ['Visits went down', 'Fewer first-time visitors came', 'The museum closed on weekends', 'Visits nearly doubled'],
        answer: 3,
        why: '“Visits nearly doubled.”',
      },
      {
        id: 'm4r4-4', text: 'What is Richard Hale’s main concern?',
        options: ['The art may be damaged', 'Families are too noisy', 'The museum may lose money after the trial', 'The donor wants control of the museum'],
        answer: 2,
        why: '“If the money runs out, we may have to cut staff or open fewer days.”',
      },
      {
        id: 'm4r4-5', text: 'What does Joan Clarke miss?',
        options: ['The old entry fee', 'A peaceful atmosphere', 'Free parking', 'Smaller exhibitions'],
        answer: 1,
        why: '“I miss the quiet.”',
      },
      {
        id: 'm4r4-6', text: '',
        options: ['too expensive', 'too cheap for a museum', 'fair for most people', 'free on weekdays only'],
        answer: 0,
        why: 'Novak says “A $22 ticket is a lot for a family of four.”',
      },
      {
        id: 'm4r4-7', text: '',
        options: ['ticket prices', 'staff numbers', 'private donations', 'first-time visitors'],
        answer: 3,
        why: 'First-time visitors rose from 20 to 45 percent.',
      },
      {
        id: 'm4r4-8', text: '',
        options: ['three months', 'one weekend', 'two years', 'five years'],
        answer: 2,
        why: 'The donor covers the gap “for the two-year trial only.”',
      },
      {
        id: 'm4r4-9', text: '',
        options: ['expensive tickets', 'crowded weekends', 'boring art', 'short hours'],
        answer: 1,
        why: 'Clarke says galleries are often crowded on weekends.',
      },
      {
        id: 'm4r4-10', text: '',
        options: ['a $22 fee every day', '“pay what you can”', 'closing on weekdays', 'ending the trial early'],
        answer: 1,
        why: '“Pay what you can” keeps it open to all while bringing in some money.',
      },
    ],
  },
];
