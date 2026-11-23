/**
 * Calibration set: sample answers with the level band a trained rater
 * would expect. Scoring rules must keep these in band and in order.
 * Add hand-scored real answers here as they come in.
 */
export interface CalibrationSample {
  id: string;
  text: string;
  /** Expected overall CLB band from code-only scoring. */
  band: [number, number];
}

export const EMAIL_SAMPLES: CalibrationSample[] = [
  {
    id: 'strong',
    text: "Dear Customer Service Team,\n\nI am writing about a stainless-steel coffee machine (order #48213) that I purchased from your website on March 3. Unfortunately, when the package was delivered last Friday, the glass carafe was cracked and the water tank leaked as soon as I filled it.\n\nThis has been quite frustrating. I chose your store because of its reputation for careful packaging, and I had planned to give the machine to my mother for her birthday this weekend. Since the box itself was badly dented, I believe the damage happened during shipping rather than in your warehouse.\n\nI would therefore appreciate it if you could send a replacement by express delivery before Saturday. If that is not possible, I would accept a full refund to my original credit card instead. I have attached photographs of the damaged parts and the packaging for your records.\n\nPlease let me know which option you can offer and whether I need to return the damaged item. Thank you for your prompt attention to this matter.\n\nSincerely,\nJasleen Kaur",
    band: [8, 10],
  },
  {
    id: 'middle',
    text: "Dear Sir or Madam,\n\nI am writing to you about a coffee machine. I bought it from your website on March 3. When I opened the box, the machine was damaged. The glass part was broken and there was water coming from the bottom when I used it.\n\nI am very unhappy about this problem because I paid a lot of money for this machine. It was a gift for my mother and now I can not give it to her. I think the problem happened when the delivery company was carrying the box, because the box was also damaged.\n\nI would like you to send me a new machine as soon as possible. If you can not do this, please give me my money back. I have pictures of the machine and the box if you need them.\n\nPlease reply to me soon. Thank you for your help.\n\nRegards,\nJasleen",
    band: [6, 8],
  },
  {
    id: 'weak',
    text: "hi,\n\ni buyed a coffee machine from your website last week and it come broken. the glass is crack and water is going every where. this is very bad and i am very angry because i pay alot of money. i want it for my mother but now i can not give her. you need to fix this problem fast.\n\ni think your company is not good with delivery. the box was also broke. i dont want to wait long time. please send new one or give money back. i will not buy again if you dont fix it.\n\nthanks\njasleen",
    band: [4, 6],
  },
];

export const SURVEY_STRONG = "I would choose more bike lanes across the city, because they would help far more residents every day than a new swimming pool.\n\nFirst, bike lanes make cycling much safer. At the moment, many people in my neighbourhood would like to ride to work or school, but they are afraid of sharing busy roads with cars and trucks. Protected lanes would give them a safe route, and more people would leave their cars at home as a result.\n\nIn addition, bike lanes are good for both the environment and our health. Fewer cars mean less traffic and cleaner air, while regular cycling is an easy way to stay active without paying for a gym membership.\n\nAlthough a public pool would be enjoyable, it would mostly be used in the summer and only by people who live nearby. Bike lanes, on the other hand, can be used all year by students, workers and families in every part of the city.\n\nFor these reasons, I strongly believe bike lanes are the better investment.";
