import type { ReadingPart } from '../objective';

/** Module 3 reading: 4 parts, 38 questions. Original practice material in CELPIP style. */
export const module3Reading: ReadingPart[] = [
  {
    id: 'm3-reading-1', taskTypeId: 'reading-1', draft: true,
    instructions: 'Read the following message. Then answer questions 1 to 6. After that, complete the reply by choosing the best option for each blank (7 to 11).',
    blocks: [
      { kind: 'text', title: 'Message from Grace', body: 'Hi Lily,\n\nI visited Grandpa yesterday, and I wanted to tell you how it went before you call him this weekend.\n\nHe’s been at Maple Grove Residence for three weeks now, and he’s doing better than we expected. He has a sunny room on the second floor, and he’s already joined the Wednesday card group. The staff told me he beat everyone last week, which didn’t surprise me at all.\n\nThe one thing he complains about is the food. He says it’s healthy but has no taste, and he misses Grandma’s cooking. I asked the kitchen manager, and she said families are welcome to bring in home-cooked meals, as long as they’re labelled with the date. Maybe we could take turns cooking for him on Sundays?\n\nI also noticed that his hearing aid isn’t working properly. He kept asking me to repeat myself, even when I spoke loudly. I’ve booked an appointment with the hearing clinic next Tuesday at ten, but I have a work meeting I can’t move. Could you take him? The clinic is only five minutes from your office.\n\nFinally, he asked me twice when you’re visiting. He really misses you.\n\nLove,\nGrace' },
      { kind: 'cloze', title: 'Lily’s reply', body: 'Hi Grace,\n\nThanks for the news. I’m so relieved he’s settling in, and of course he’s winning at [[m3r1-7]]!\n\nTaking turns cooking on Sundays is a lovely idea. I’ll make his favourite stew this week and remember to [[m3r1-8]].\n\nYes, I can take him to [[m3r1-9]] on Tuesday. It’s close to [[m3r1-10]], so I’ll just take a long lunch.\n\nAnd please tell him I’ll [[m3r1-11]] this weekend. I miss him too.\n\nLily' },
    ],
    questions: [
      {
        id: 'm3r1-1', text: 'Why is Grace writing to Lily?',
        options: ['To ask Lily to move in with Grandpa', 'To give an update on their grandfather', 'To complain about the residence staff', 'To plan a party for Grandpa'],
        answer: 1,
        why: 'She wants to tell Lily how the visit went.',
      },
      {
        id: 'm3r1-2', text: 'How is their grandfather adjusting to the residence?',
        options: ['Better than expected', 'Very badly', 'He wants to leave', 'He has not made any friends'],
        answer: 0,
        why: 'He’s “doing better than we expected.”',
      },
      {
        id: 'm3r1-3', text: 'What does Grandpa dislike about the residence?',
        options: ['His room is too dark', 'The card group is boring', 'The staff are unfriendly', 'The food has no flavour'],
        answer: 3,
        why: 'He says the food “is healthy but has no taste.”',
      },
      {
        id: 'm3r1-4', text: 'What did the kitchen manager say?',
        options: ['Families must not bring food', 'Grandpa can cook in the kitchen', 'Families may bring meals if they are dated', 'Meals will taste better next month'],
        answer: 2,
        why: 'Home-cooked meals are welcome “as long as they’re labelled with the date.”',
      },
      {
        id: 'm3r1-5', text: 'What problem did Grace notice?',
        options: ['Grandpa can’t see clearly anymore', 'Grandpa’s hearing aid isn’t working well', 'Grandpa has lost a lot of weight', 'Grandpa forgot his granddaughter’s name'],
        answer: 1,
        why: '“His hearing aid isn’t working properly.”',
      },
      {
        id: 'm3r1-6', text: 'Why can’t Grace go to the appointment?',
        options: ['She has a work meeting', 'She will be out of town', 'The clinic is too far for her', 'She is sick'],
        answer: 0,
        why: '“I have a work meeting I can’t move.”',
      },
      {
        id: 'm3r1-7', text: '',
        options: ['chess', 'tennis', 'cooking', 'cards'],
        answer: 3,
        why: 'He joined the card group and beat everyone.',
      },
      {
        id: 'm3r1-8', text: '',
        options: ['ask the doctor first', 'bring enough for everyone', 'put the date on it', 'cook it there'],
        answer: 2,
        why: 'Meals must be “labelled with the date.”',
      },
      {
        id: 'm3r1-9', text: '',
        options: ['the kitchen manager', 'the hearing clinic', 'the card group', 'a family dinner'],
        answer: 1,
        why: 'Grace booked the hearing clinic for Tuesday.',
      },
      {
        id: 'm3r1-10', text: '',
        options: ['your house', 'my office', 'the residence', 'the hospital'],
        answer: 1,
        why: 'The clinic is “only five minutes from your office.”',
      },
      {
        id: 'm3r1-11', text: '',
        options: ['visit him', 'cook for him', 'call the clinic', 'fix his hearing aid'],
        answer: 0,
        why: 'Grandpa keeps asking when Lily is visiting.',
      },
    ],
  },
  {
    id: 'm3-reading-2', taskTypeId: 'reading-2', draft: true,
    instructions: 'Read the chart and the email. Choose the best option for each blank (1 to 5). Then answer questions 6 to 8.',
    blocks: [
      {
        kind: 'table', title: 'Quotes for moving a two-bedroom apartment',
        columns: ['Company', 'Price', 'Movers and truck', 'Packing', 'Insurance', 'Earliest date'],
        rows: [
          ['Swift Movers', '$950', '2 movers, small truck', 'Not included', 'Up to $1,000', 'May 28'],
          ['Northern Haul', '$1,300', '3 movers, large truck', 'Boxes included', 'Up to $5,000', 'June 1'],
          ['CareMove', '$1,850', '3 movers, large truck', 'Full packing service', 'Full value', 'May 30'],
          ['Budget Boxes', '$700', 'Truck only, no movers', 'Not included', 'None', 'Any day'],
        ],
        note: 'All prices include tax. Weekend moves cost 15% more.',
      },
      { kind: 'cloze', title: 'Email from Ana to her partner Ben', body: 'Hi Ben,\n\nI’ve compared the moving quotes. Since our lease ends on May 31, we can’t use [[m3r2-1]], because they can’t come until June. The cheapest choice is [[m3r2-2]], but we’d have to carry everything ourselves, and with your bad back that’s not a good idea.\n\nI think the best value is [[m3r2-3]]. It’s a bit cheaper than CareMove, it comes before our lease ends, and we don’t need help packing because [[m3r2-4]].\n\nThe only worry is the piano. It’s worth about $3,000, and their insurance only covers [[m3r2-5]]. Maybe we should ask about extra coverage.\n\nAna' },
    ],
    questions: [
      {
        id: 'm3r2-1', text: '',
        options: ['Swift Movers', 'CareMove', 'Northern Haul', 'Budget Boxes'],
        answer: 2,
        why: 'Northern Haul’s earliest date is June 1.',
      },
      {
        id: 'm3r2-2', text: '',
        options: ['Swift Movers', 'Budget Boxes', 'Northern Haul', 'CareMove'],
        answer: 1,
        why: 'Budget Boxes is $700 but has no movers.',
      },
      {
        id: 'm3r2-3', text: '',
        options: ['Swift Movers', 'Northern Haul', 'CareMove', 'Budget Boxes'],
        answer: 0,
        why: 'Swift Movers can come May 28 and costs less than CareMove.',
      },
      {
        id: 'm3r2-4', text: '',
        options: ['they pack for free', 'we have no furniture', 'CareMove packs too slowly', 'we’ve already started packing'],
        answer: 3,
        why: 'Ana says they don’t need packing help; Swift Movers doesn’t include packing.',
      },
      {
        id: 'm3r2-5', text: '',
        options: ['full value', 'up to $5,000', 'up to $1,000', 'nothing at all'],
        answer: 2,
        why: 'Swift Movers’ insurance is “Up to $1,000.”',
      },
      {
        id: 'm3r2-6', text: 'Which company offers a full packing service?',
        options: ['Swift Movers', 'CareMove', 'Northern Haul', 'Budget Boxes'],
        answer: 1,
        why: 'CareMove: “Full packing service.”',
      },
      {
        id: 'm3r2-7', text: 'What happens to the price if they move on a Saturday?',
        options: ['It goes up by 15%', 'It stays the same', 'It goes down by 15%', 'Tax is added'],
        answer: 0,
        why: '“Weekend moves cost 15% more.”',
      },
      {
        id: 'm3r2-8', text: 'Why does Ana not want to choose the cheapest option?',
        options: ['It can’t come before May 31', 'It doesn’t include a truck', 'It costs extra on weekends', 'Ben would have to lift heavy things'],
        answer: 3,
        why: 'They would carry everything themselves, which is bad for Ben’s back.',
      },
    ],
  },
  {
    id: 'm3-reading-3', taskTypeId: 'reading-3', draft: true,
    instructions: 'Read the article. Decide which paragraph, A to D, has the information in each statement. If the information is not in the article, choose E.',
    blocks: [
      { kind: 'text', title: 'The case for a short nap', body: 'A. In many countries, an afternoon rest is part of daily life. In Canada, napping at work is more likely to get you a warning than a raise. Yet a growing number of sleep researchers say a short nap in the early afternoon can make people more alert, more patient and less likely to make mistakes.\n\nB. The key, they say, is length. A nap of 10 to 20 minutes lets you rest without falling into deep sleep. Sleep longer, and you may wake up feeling groggy, a feeling that can last half an hour. Timing matters too: a nap after about 3 p.m. can make it harder to fall asleep at night.\n\nC. A few employers have started to take notice. Some tech companies and hospitals have set up quiet rooms with reclining chairs where staff can rest during breaks. Night-shift nurses in particular say a short rest helps them stay focused during the long hours before morning.\n\nD. Napping is not for everyone, however. People who have trouble sleeping at night are usually advised to avoid daytime naps, because they reduce the body’s need for sleep later. Doctors also warn that feeling the need to nap every day can be a sign of poor sleep at night, which should be checked.' },
    ],
    questions: [
      { id: 'm3r3-1', text: 'Naps that are too long can leave you feeling slow.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 1, why: 'Paragraph B: longer sleep can leave you “groggy.”' },
      { id: 'm3r3-2', text: 'Some workplaces provide a space for resting.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 2, why: 'Paragraph C: employers “have set up quiet rooms with reclining chairs.”' },
      { id: 'm3r3-3', text: 'Napping is common in some other cultures.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 0, why: 'Paragraph A: “In many countries, an afternoon rest is part of daily life.”' },
      { id: 'm3r3-4', text: 'Napping late in the day can affect night-time sleep.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 1, why: 'Paragraph B: a nap after about 3 p.m. can make it harder to fall asleep.' },
      { id: 'm3r3-5', text: 'A regular need to nap could point to a health issue.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 3, why: 'Paragraph D: it “can be a sign of poor sleep at night.”' },
      { id: 'm3r3-6', text: 'People who work at night find short rests helpful.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 2, why: 'Paragraph C: night-shift nurses say a short rest helps them stay focused.' },
      { id: 'm3r3-7', text: 'Napping can help people make fewer errors.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 0, why: 'Paragraph A: people are “less likely to make mistakes.”' },
      { id: 'm3r3-8', text: 'Children need more naps than adults.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 4, why: 'The article does not discuss children.' },
      { id: 'm3r3-9', text: 'People with insomnia are often told not to nap.', options: ["Paragraph A", "Paragraph B", "Paragraph C", "Paragraph D", "E: Not given in the article"], answer: 3, why: 'Paragraph D: people with trouble sleeping “are usually advised to avoid daytime naps.”' },
    ],
  },
  {
    id: 'm3-reading-4', taskTypeId: 'reading-4', draft: true,
    instructions: 'Read the article and answer questions 1 to 5. Then read a reader’s comment and choose the best option for each blank (6 to 10).',
    blocks: [
      { kind: 'text', title: 'Is it time to stop tipping?', body: 'When Sofia Russo opened her restaurant in Halifax last year, she made an unusual choice: no tipping. Instead, menu prices are about 18 percent higher, and every employee, from dishwashers to servers, earns at least $22 an hour.\n\n“Tipping makes pay unpredictable,” Russo explains. “A server could earn $300 on a Saturday and $40 on a quiet Tuesday. And the cooks, who work just as hard, usually get almost none of it.” Since the change, she says, staff turnover has dropped sharply, and she spends far less time hiring and training.\n\nNot all customers are happy. Some say the higher prices are a shock when they first see the menu, even if the total bill ends up about the same. Others like tipping because it lets them reward excellent service. “If my server is amazing, I want to show it,” says regular diner Mark Ellis.\n\nSome servers are also uncertain. Jordan Price, who works at a busy steakhouse, earns far more than $22 an hour on good nights. “For experienced servers in popular restaurants, a no-tipping model could mean a pay cut,” he says.\n\nEconomist Dr. Priya Nair believes the question will be decided slowly, restaurant by restaurant. She suggests a middle option: include a fixed service charge on every bill and share it among all staff. “It keeps pay fair and predictable, but it’s still clear to customers where the money goes.”' },
      { kind: 'cloze', title: 'Reader comment from Alex P.', body: 'I worked as a cook for five years, so I know exactly what Ms. Russo means when she says cooks [[m3r4-6]]. Her restaurant seems to have benefited too, since [[m3r4-7]] has gone down.\n\nI can see why Mr. Ellis wants to [[m3r4-8]], and Mr. Price is right that the best servers might [[m3r4-9]]. Personally, I think Dr. Nair’s idea of [[m3r4-10]] is the fairest solution for everyone.' },
    ],
    questions: [
      {
        id: 'm3r4-1', text: 'What did Sofia Russo do instead of allowing tips?',
        options: ['She lowered menu prices to bring in customers', 'She raised menu prices and paid higher wages', 'She paid only her servers a much higher wage', 'She added an 18 percent tip to every bill'],
        answer: 1,
        why: 'Prices are 18% higher, and every employee earns at least $22 an hour.',
      },
      {
        id: 'm3r4-2', text: 'According to Russo, what is one problem with tipping?',
        options: ['Earnings change a lot from day to day', 'Customers forget to tip', 'Servers keep all the money from the bill', 'It makes meals take longer'],
        answer: 0,
        why: 'A server could earn $300 one night and $40 another.',
      },
      {
        id: 'm3r4-3', text: 'What has happened since Russo’s change?',
        options: ['More customers have complained to the owner', 'Prices have dropped', 'She has hired more servers', 'Fewer staff have left'],
        answer: 3,
        why: '“Staff turnover has dropped sharply.”',
      },
      {
        id: 'm3r4-4', text: 'Why does Mark Ellis like tipping?',
        options: ['It saves him money', 'He works as a server', 'He can reward great service', 'It makes bills easier to read'],
        answer: 2,
        why: '“If my server is amazing, I want to show it.”',
      },
      {
        id: 'm3r4-5', text: 'What does Dr. Nair suggest?',
        options: ['Ending the practice of tipping by law', 'A fixed service charge shared by all staff', 'Higher tips for cooks than for servers', 'Letting each customer decide what to pay'],
        answer: 1,
        why: 'She suggests a fixed service charge shared among all staff.',
      },
      {
        id: 'm3r4-6', text: '',
        options: ['rarely share in tips', 'earn the most', 'prefer quiet Tuesdays', 'set the menu prices'],
        answer: 0,
        why: 'Russo says cooks “usually get almost none of it.”',
      },
      {
        id: 'm3r4-7', text: '',
        options: ['the menu price', 'the number of customers', 'the cooks’ pay', 'staff turnover'],
        answer: 3,
        why: 'Staff turnover “has dropped sharply.”',
      },
      {
        id: 'm3r4-8', text: '',
        options: ['pay lower prices', 'eat at home', 'reward great service', 'work as a server'],
        answer: 2,
        why: 'Ellis wants to show when his server is amazing.',
      },
      {
        id: 'm3r4-9', text: '',
        options: ['earn more', 'earn less', 'leave Halifax', 'become cooks'],
        answer: 1,
        why: 'Price says no tipping “could mean a pay cut” for experienced servers.',
      },
      {
        id: 'm3r4-10', text: '',
        options: ['no tipping at all', 'a shared service charge', 'tipping only cooks', 'higher menu prices'],
        answer: 1,
        why: 'Dr. Nair suggests a fixed service charge shared among staff.',
      },
    ],
  },
];
