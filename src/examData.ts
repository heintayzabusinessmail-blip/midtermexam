export interface PartInfo {
  n: number;
  code: string;
  title: string;
  pts: number;
  instr: string;
}

export interface VideoConfig {
  id: string;
  start?: number;
  end?: number;
}

export interface ListeningItem {
  title: string;
  speakers: string[];
  lines: [string, string][];
}

export type QuestionType = 'mcq' | 'match' | 'order' | 'sort' | 'mistake' | 'stress' | 'essay';

export interface Question {
  i: number;
  p: number; // Part 1..8
  u: number; // Unit 1..5
  l: string; // Lesson 1A, 2B, etc.
  s: string; // Skill / focus
  d: 'easy' | 'medium' | 'hard';
  t: QuestionType;
  pts?: number;
  px?: string; // Passage key (A or B)
  lx?: string; // Listening key (L1)
  q?: string;
  o?: string[];
  a?: any;
  e?: string;
  g?: string; // Group for match questions
  tl?: string[]; // Tile list for word order
  sh?: number[]; // Shuffled order indices
  end?: string; // Sentence end punctuation
  item?: string; // Item for bucket sorting
  bk?: string[]; // Buckets
  w?: string[]; // Words for find mistake
  wi?: number; // Word index with mistake
  sy?: string[]; // Syllables or sentence words for stress
  mode?: 'sentence' | 'word';
  min?: number;
  max?: number;
}

export const CONFIG = {
  examId: 'MT15',
  teacher: 'Tr. Hein Tay Za',
  telegram: '@HeinTayZa',
  minutes: 120,
  passPct: 60,
  teacherPin: 'HEINFINITY25',
  storeKey: 'heinfinity_midterm_u1_5_yt_v1',
  maxPlays: 2,
  requireCam: true,
};

export const PARTS: PartInfo[] = [
  { n: 1, code: 'R', title: 'Reading', pts: 10, instr: 'Read the text, then answer the question.' },
  { n: 2, code: 'G', title: 'Grammar', pts: 25, instr: 'Choose the correct answer, put the words in order, or find the mistake.' },
  { n: 3, code: 'V', title: 'Vocabulary', pts: 20, instr: 'Choose, match or sort the vocabulary from Units 1–5.' },
  { n: 4, code: 'W', title: 'Writing Knowledge', pts: 10, instr: 'Choose the best answer about writing an article, a leaflet, data, an email and an argument.' },
  { n: 5, code: 'P', title: 'Pronunciation', pts: 5, instr: 'Tap the stressed syllable or word, or choose the correct sound.' },
  { n: 6, code: 'EE', title: 'Communication Skills', pts: 10, instr: 'Choose the best phrase for each situation.' },
  { n: 7, code: 'L', title: 'Listening (Video)', pts: 10, instr: 'Tap PLAY to watch and listen. You may play the video twice. Then answer the questions.' },
  { n: 8, code: 'Essay', title: 'Essay Writing', pts: 10, instr: 'Write your answer in the box. Your teacher marks this part.' },
];

export const PASSAGES: Record<string, { title: string; text: string }> = {
  A: {
    title: 'Reading A — The girl who came back from the sea',
    text: `When Mira Sandoval was nineteen, she went sailing with two friends off the coast of Chile. The forecast had promised a calm afternoon, but by four o'clock the wind was rising and the little boat was being pulled steadily away from the shore. Within an hour they had lost sight of land completely.\n\nMira later admitted that the first mistake was hers. She had checked the fuel but not the radio, and when she finally tried to get someone's attention, nothing happened. For two days the three of them drifted, rationing half a bottle of water and a bag of dried fruit. Mira kept a log on the back of a chart, writing down everything she could see — the colour of the water, the birds, the direction of the swell. She says now that the log was not really about navigation. "It was about refusing to give up," she told an interviewer in 2019. "As long as I was writing, I was still making decisions."\n\nA fishing boat found them on the third morning, eighty kilometres from where they had started. All three were badly dehydrated but alive.\n\nMira did not sail again for six years. She studied instead, and she is now a marine biologist working on ocean currents — the very thing that nearly killed her. She is careful never to describe herself as brave. "I was lucky," she says, "and I was stubborn. Those are not the same as brave."`,
  },
  B: {
    title: 'Reading B — The wrong train',
    text: `In 1996 a nineteen-year-old called Daniel Reyes got on the wrong train. He had meant to travel to an interview for an accountancy course; instead he ended up two hours away, in a town he had never heard of, with no money for a return ticket. While he waited for someone to come and collect him, he wandered into a sports hall where a coach was running trials for a junior athletics squad. Somebody handed him a pair of spikes.\n\nReyes had never trained for anything in his life. He came third. The coach, who was short of runners, told him to come back on Thursday, and he kept coming back for eleven years.\n\nHe is honest about what this proves. "People love this story because they think it means talent will always find you," he says. "It doesn't. It means I was lucky. There were probably four hundred boys that year who would have been faster than me, and none of them got on the wrong train."\n\nWhat he does credit is what happened afterwards. The training was gruelling and the rules were strict — he was not allowed to miss a session, and he had to be at the track by six. He believes those years changed him far more than the accident that started them. "Chance opened the door," he says. "It didn't carry me through it."`,
  },
};

// YouTube video linked directly for Part 7 (Listening)
export const VIDEO: Record<string, VideoConfig> = {
  L1: { id: 'SZg0EOOzKQ0', start: 0, end: 0 },
};

export const AUDIO: Record<string, string | null> = {
  L1: null,
};

export const LISTENINGS: Record<string, ListeningItem> = {
  L1: {
    title: 'Relationship dilemmas – B2 English Listening Test',
    speakers: ['Narrator', 'Speaker'],
    lines: [
      ['A', 'Speaker 1 — Emma'],
      ['B', "I met Josh at a friend's birthday party a couple of weeks ago, and we really hit it off right from the start. I definitely fancied him, but what I really liked was that he was confident without being arrogant. We've been on a few dates since then, and I can feel myself starting to fall for him. The dilemma is that I have a tendency to fall head over heels quite quickly in relationships, so I'm really trying to slow myself down and not get too excited too early."],
      ['A', 'Speaker 2 — Sofia'],
      ['B', "Ashley and I have been close friends for years. I really looked up to her and probably idolised her when we first met. But lately, things have changed. Ever since her boyfriend dumped her, she's been really bitter and critical towards me, almost as if she has it in for me. I've been keeping my distance because it hurts, but the friendship means a lot to me and I really want to make up with her rather than let it fall apart."],
      ['A', 'Speaker 3 — Daniel'],
      ['B', "Laura and I have been together for nearly four years. We work in similar fields, we still care about each other, and on paper, everything is fine — there's no drama or fighting. But lately, the relationship feels much less intense than it used to be. I find myself longing for the passion we used to have, and I worry that we've started to take each other for granted and are slowly drifting apart. I'm just not sure what to do next."],
    ],
  },
};

export const RAW_QUESTIONS: Omit<Question, 'i'>[] = [
  /* ================= PART 1 · R — READING (10) ================= */
  {
    p: 1, u: 1, l: '1A', s: 'Reading: detail', d: 'easy', t: 'mcq', px: 'A',
    q: 'Why did the boat get into trouble?',
    o: ['The forecast was wrong and the wind rose.', 'The engine broke down completely.', 'The friends ignored a storm warning.', 'They set off after dark.'],
    a: 0, e: '“The forecast had promised a calm afternoon, but by four o’clock the wind was rising.”',
  },
  {
    p: 1, u: 1, l: '1A', s: 'Reading: inference', d: 'hard', t: 'mcq', px: 'A',
    q: 'Why did Mira keep a log?',
    o: ['To stay in control of the situation mentally.', 'To navigate back to the shore.', 'Because the coastguard told her to.', 'To record the trip for a magazine.'],
    a: 0, e: '“It was about refusing to give up… As long as I was writing, I was still making decisions.”',
  },
  {
    p: 1, u: 2, l: '2A', s: 'Reading: True / False / Not given', d: 'hard', t: 'mcq', px: 'A',
    q: '<b>True, False or Not given?</b> — Mira describes herself as brave.',
    o: ['True', 'False', 'Not given'],
    a: 1, e: '“She is careful never to describe herself as brave.”',
  },
  {
    p: 1, u: 2, l: '2B', s: 'Reading: True / False / Not given', d: 'hard', t: 'mcq', px: 'A',
    q: '<b>True, False or Not given?</b> — Mira now works for the Chilean government.',
    o: ['True', 'False', 'Not given'],
    a: 2, e: 'The text says she is a marine biologist but never says who employs her.',
  },
  {
    p: 1, u: 3, l: '3A', s: 'Reading: detail', d: 'easy', t: 'mcq', px: 'B',
    q: 'How did Daniel Reyes end up at the athletics trials?',
    o: ['He got on the wrong train.', 'A coach invited him.', 'He was training to be an athlete.', 'His interview was cancelled.'],
    a: 0, e: '“a nineteen-year-old called Daniel Reyes got on the wrong train.”',
  },
  {
    p: 1, u: 3, l: '3B', s: 'Reading: inference', d: 'hard', t: 'mcq', px: 'B',
    q: 'What does Reyes think his story does <em>not</em> prove?',
    o: ['That talent will always be discovered.', 'That training matters.', 'That rules are important.', 'That luck exists.'],
    a: 0, e: '“they think it means talent will always find you… It doesn’t.”',
  },
  {
    p: 1, u: 4, l: '4B', s: 'Reading: detail', d: 'medium', t: 'mcq', px: 'B',
    q: 'What rules did Reyes have to follow?',
    o: ['He could not miss a session and had to arrive by six.', 'He had to pay for his own spikes.', 'He was not allowed to compete for two years.', 'He had to train for three hours a day.'],
    a: 0, e: '“he was not allowed to miss a session, and he had to be at the track by six.”',
  },
  {
    p: 1, u: 4, l: '4A', s: 'Reading: True / False / Not given', d: 'hard', t: 'mcq', px: 'B',
    q: '<b>True, False or Not given?</b> — Reyes believes the eleven years of training changed him more than the accident did.',
    o: ['True', 'False', 'Not given'],
    a: 0, e: '“those years changed him far more than the accident that started them.”',
  },
  {
    p: 1, u: 5, l: '5A', s: 'Reading: inference', d: 'medium', t: 'mcq', px: 'B',
    q: 'Which sentence best sums up Reyes’s attitude?',
    o: ['Chance created the opportunity, but effort used it.', 'Only luck decides who succeeds.', 'Hard work always beats luck.', 'Nothing can be planned in life.'],
    a: 0, e: '“Chance opened the door. It didn’t carry me through it.”',
  },
  {
    p: 1, u: 5, l: '5A', s: 'Reading: True / False / Not given', d: 'hard', t: 'mcq', px: 'B',
    q: '<b>True, False or Not given?</b> — Reyes says four hundred boys that year were definitely faster than him.',
    o: ['True', 'False', 'Not given'],
    a: 1, e: 'He says there were probably four hundred who would have been faster — not a fact, so this is False.',
  },

  /* ================= PART 2 · G — GRAMMAR (25) ================= */
  {
    p: 2, u: 1, l: '1A', s: 'Review of tenses', d: 'medium', t: 'mcq',
    q: 'I <em>___</em> to three of her lectures now, and each one has changed the way I think.',
    o: ['have been', 'went', 'had been', 'am going'], a: 0, e: 'Present perfect simple: experience up to <b>now</b>.',
  },
  {
    p: 2, u: 1, l: '1A', s: 'Review of tenses', d: 'hard', t: 'mcq',
    q: 'When we arrived, the interview <em>___</em>, so we only heard the last question.',
    o: ['had already started', 'already started', 'has already started', 'was already starting'], a: 0,
    e: 'Past perfect simple for an action completed before another past action.',
  },
  {
    p: 2, u: 1, l: '1A', s: 'Review of tenses', d: 'hard', t: 'mistake',
    w: ['While', 'I', 'studied', 'for', 'my', 'exams,', 'my', 'brother', 'was', 'watching', 'TV.'], wi: 2,
    o: ['was studying', 'had studied', 'have studied'], a: 0, e: 'The long background action needs the past continuous.',
  },
  {
    p: 2, u: 1, l: '1B', s: 'Questions', d: 'hard', t: 'mcq',
    q: '<em>___</em> this design so revolutionary?',
    o: ['What makes', 'What does make', 'What is make', 'What does it make'], a: 0,
    e: 'Subject question: the question word is the subject, so no auxiliary <b>do</b>.',
  },
  {
    p: 2, u: 1, l: '1B', s: 'Questions', d: 'hard', t: 'order',
    tl: ['Could', 'you', 'tell', 'me', 'where', 'the', 'lecture', 'is'], end: '?',
    e: 'Indirect question — statement word order after <i>Could you tell me…</i>',
  },
  {
    p: 2, u: 2, l: '2A', s: 'Narrative tenses', d: 'easy', t: 'mcq',
    q: 'The sea was rough and the current <em>___</em> us further from the shore every minute.',
    o: ['was pulling', 'pulled', 'had pulled', 'has pulled'], a: 0, e: 'Past continuous for an action in progress over a period.',
  },
  {
    p: 2, u: 2, l: '2A', s: 'Narrative tenses', d: 'hard', t: 'mcq',
    q: 'By the time the lifeguard reached him, he <em>___</em> to stay afloat for almost twenty minutes.',
    o: ['had been trying', 'tried', 'was trying', 'had tried'], a: 0,
    e: 'Past perfect continuous: a continuing action lasting up to a point in the past.',
  },
  {
    p: 2, u: 2, l: '2A', s: 'Narrative tenses', d: 'medium', t: 'mistake',
    w: ['By', 'the', 'time', 'we', 'arrived,', 'the', 'tide', 'has', 'already', 'covered', 'the', 'path.'], wi: 7,
    o: ['had', 'was', 'have'], a: 0, e: 'Past perfect <b>had covered</b> — before <i>we arrived</i>.',
  },
  {
    p: 2, u: 2, l: '2B', s: 'Future time clauses', d: 'hard', t: 'mcq',
    q: "Don't move until the animal <em>___</em> completely out of sight.",
    o: ['is', 'will be', 'will have been', 'would be'], a: 0,
    e: 'After <b>until</b> we use a present tense, not <i>will</i>.',
  },
  {
    p: 2, u: 2, l: '2B', s: 'Future time clauses', d: 'hard', t: 'mistake',
    w: ["I'll", 'call', 'you', 'as', 'soon', 'as', 'I', 'will', 'arrive.'], wi: 7,
    o: ['— (remove this word)', 'would', 'am'], a: 0, e: 'No <i>will</i> after <b>as soon as</b>.',
  },
  {
    p: 2, u: 3, l: '3A', s: 'Multi-word verbs', d: 'hard', t: 'mcq',
    q: "I couldn't <em>___</em> with the leaders after the third lap.",
    o: ['keep up', 'keep it up', 'keep up it', 'keep'], a: 0,
    e: '<b>keep up with</b> is a three-part verb; nothing goes in the middle.',
  },
  {
    p: 2, u: 3, l: '3A', s: 'Multi-word verbs', d: 'hard', t: 'mcq',
    q: "That's a difficult word — you should <em>___</em> in a dictionary.",
    o: ['look it up', 'look up it', 'up look it', 'look up'], a: 0,
    e: '<b>look up</b> is separable, and a pronoun object goes in the middle.',
  },
  {
    p: 2, u: 3, l: '3A', s: 'Multi-word verbs', d: 'medium', t: 'order',
    tl: ['I', "can't", 'put', 'up', 'with', 'the', 'noise', 'any', 'longer'], end: '.',
    e: '<b>put up with</b> — the three parts stay together.',
  },
  {
    p: 2, u: 3, l: '3B', s: 'Present perfect simple / continuous', d: 'hard', t: 'mcq',
    q: "She <em>___</em> for this championship since January, and she's finally ready.",
    o: ['has been training', 'has trained', 'trains', 'is training'], a: 0, e: 'Present perfect continuous stresses the ongoing activity.',
  },
  {
    p: 2, u: 3, l: '3B', s: 'Present perfect simple / continuous', d: 'hard', t: 'mistake',
    w: ['She', 'has', 'been', 'winning', 'three', 'medals', 'so', 'far', 'this', 'season.'], wi: 3,
    o: ['won', 'win', 'wins'], a: 0, e: 'A finished number of results takes the present perfect <i>simple</i>.',
  },
  {
    p: 2, u: 4, l: '4A', s: 'used to / would', d: 'hard', t: 'mcq',
    q: 'When I was a child, we <em>___</em> live near the sea.',
    o: ['used to', 'would', 'are used to', 'use to'], a: 0,
    e: '<b>used to</b> works with states; <i>would</i> is only for repeated actions.',
  },
  {
    p: 2, u: 4, l: '4A', s: 'used to / would', d: 'easy', t: 'order',
    tl: ['We', 'would', 'spend', 'every', 'summer', 'at', 'my', "grandmother's", 'house'], end: '.',
    e: '<b>would</b> + infinitive for a repeated past habit.',
  },
  {
    p: 2, u: 4, l: '4B', s: 'Obligation', d: 'medium', t: 'mcq',
    q: 'Applicants <em>___</em> submit their documents before Friday; late forms are not accepted.',
    o: ['must', "don't have to", "mustn't", "needn't"], a: 0, e: '<b>must</b> = strong obligation.',
  },
  {
    p: 2, u: 4, l: '4B', s: 'Permission', d: 'hard', t: 'mcq',
    q: "You <em>___</em> take photographs here — there's no rule against it.",
    o: ['are allowed to', "mustn't", 'have to', 'had to'], a: 0,
    e: '<b>be allowed to</b> = permission.',
  },
  {
    p: 2, u: 4, l: '4B', s: 'Obligation', d: 'hard', t: 'mistake',
    w: ['You', "haven't", 'to', 'wear', 'a', 'tie', 'in', 'this', 'office.'], wi: 1,
    o: ["don't have", "mustn't have", 'not have'], a: 0, e: '<b>don\'t have to</b> = no obligation.',
  },
  {
    p: 2, u: 5, l: '5A', s: 'Future probability', d: 'hard', t: 'mcq',
    q: 'The team <em>___</em> to win, but nobody can be completely certain.',
    o: ['is likely', 'is bound', 'will definitely', 'may be'], a: 0,
    e: '<b>is likely to</b> = probable; <i>is bound to</i> means certain.',
  },
  {
    p: 2, u: 5, l: '5A', s: 'Future probability', d: 'hard', t: 'mcq',
    q: 'Solar energy <em>___</em> well be cheaper than coal within a decade.',
    o: ['may', 'might not', 'could not', 'will'], a: 0,
    e: '<b>may well</b> = it is quite probable.',
  },
  {
    p: 2, u: 5, l: '5A', s: 'Future probability', d: 'medium', t: 'mistake',
    w: ["There's", 'a', 'strong', 'possibility', 'of', 'prices', 'will', 'rise', 'next', 'year.'], wi: 4,
    o: ['that', 'which', 'for'], a: 0, e: '<b>possibility that</b> + clause.',
  },
  {
    p: 2, u: 5, l: '5B', s: 'Future perfect', d: 'hard', t: 'mcq',
    q: "By 2050 the earth's atmosphere <em>___</em> by another degree.",
    o: ['will have warmed', 'will warm', 'will be warming', 'warms'], a: 0,
    e: 'Future perfect for something finished before a future point.',
  },
  {
    p: 2, u: 5, l: '5B', s: 'Future continuous', d: 'medium', t: 'order',
    tl: ['This', 'time', 'next', 'year', 'I', 'will', 'be', 'working', 'abroad'], end: '.',
    e: 'Future continuous for an action in progress at a future time.',
  },

  /* ================= PART 3 · V — VOCABULARY (20) ================= */
  {
    p: 3, u: 1, l: '1A', s: 'Character adjectives', d: 'easy', t: 'match', g: 'A', q: 'determined',
    o: [
      'not willing to give up, even when something is very difficult',
      'willing to believe things too easily because of a lack of experience',
      'refusing to change your mind, even when you are clearly wrong',
      'so excited that you lose control of what you are doing',
      'manage to contact someone, or manage to obtain something',
    ],
    a: 0, e: '<b>determined</b> — Unit 1A character adjectives.',
  },
  { p: 3, u: 1, l: '1A', s: 'Character adjectives', d: 'medium', t: 'match', g: 'A', q: 'naive', o: [], a: 1, e: '<b>naive</b> — Unit 1A.' },
  { p: 3, u: 1, l: '1A', s: 'Character adjectives', d: 'medium', t: 'match', g: 'A', q: 'stubborn', o: [], a: 2, e: '<b>stubborn</b> — Unit 1A.' },
  { p: 3, u: 2, l: '2A', s: 'Expressions with get', d: 'easy', t: 'match', g: 'A', q: 'get carried away', o: [], a: 3, e: '<b>get carried away</b> — Unit 2A.' },
  { p: 3, u: 2, l: '2A', s: 'Expressions with get', d: 'medium', t: 'match', g: 'A', q: 'get hold of', o: [], a: 4, e: '<b>get hold of</b> — Unit 2A.' },

  {
    p: 3, u: 3, l: '3A', s: 'Ability and achievement', d: 'medium', t: 'match', g: 'B', q: 'outstanding',
    o: [
      'extremely good, far better than the usual standard',
      'the people who watch a sports event',
      'extremely tiring and demanding over a long period',
      'easy to do or understand; not complicated',
      'the total amount of greenhouse gas an activity produces',
    ],
    a: 0, e: '<b>outstanding</b> — Unit 3A ability and achievement.',
  },
  { p: 3, u: 3, l: '3B', s: 'Words connected with sport', d: 'easy', t: 'match', g: 'B', q: 'spectators', o: [], a: 1, e: '<b>spectators</b> — Unit 3B.' },
  { p: 3, u: 4, l: '4B', s: 'Talking about difficulty', d: 'hard', t: 'match', g: 'B', q: 'gruelling', o: [], a: 2, e: '<b>gruelling</b> — Unit 4B.' },
  { p: 3, u: 4, l: '4B', s: 'Talking about difficulty', d: 'medium', t: 'match', g: 'B', q: 'straightforward', o: [], a: 3, e: '<b>straightforward</b> — Unit 4B.' },
  { p: 3, u: 5, l: '5B', s: 'The natural world', d: 'hard', t: 'match', g: 'B', q: 'carbon footprint', o: [], a: 4, e: '<b>carbon footprint</b> — Unit 5B.' },

  {
    p: 3, u: 1, l: '1 make', s: 'Wordpower: make', d: 'easy', t: 'mcq',
    q: "I've thought about it all week and I still can't <em>___</em> my mind.",
    o: ['make up', 'make out', 'make up for', 'make sense of'], a: 0, e: '<b>make up my mind</b> = decide — Unit 1 Wordpower <i>make</i>.',
  },
  {
    p: 3, u: 2, l: '2 face', s: 'Wordpower: face', d: 'medium', t: 'mcq',
    q: "I've been putting it off for weeks, but tomorrow I have to <em>___</em> and tell her.",
    o: ['face the music', 'face a choice', 'make a face', 'fall flat on my face'], a: 0,
    e: '<b>face the music</b> = accept criticism or punishment — Unit 2 Wordpower <i>face</i>.',
  },
  {
    p: 3, u: 3, l: '3A', s: 'Ability and achievement', d: 'hard', t: 'mcq',
    q: 'She is extremely <em>___</em> at negotiation, and she has a real <em>___</em> for languages.',
    o: ['skilled … talent', 'talented … skill', 'skill … talented', 'skilled … skilled'], a: 0,
    e: '<b>skilled at</b> something, but a <b>talent for</b> something — Unit 3A.',
  },
  {
    p: 3, u: 4, l: '4 as', s: 'Wordpower: as', d: 'hard', t: 'mcq',
    q: '<em>___</em> far as I am concerned, the decision was completely fair.',
    o: ['As', 'So', 'How', 'That'], a: 0, e: '<b>As far as I\'m concerned</b> — Unit 4 Wordpower <i>as</i>.',
  },
  {
    p: 3, u: 5, l: '5 side', s: 'Wordpower: side', d: 'medium', t: 'mcq',
    q: "It rained all week, but <em>___</em> — we saved a lot of money.",
    o: ['look on the bright side', 'put it to one side', 'from side to side', 'side by side'], a: 0,
    e: '<b>look on the bright side</b> — Unit 5 Wordpower <i>side</i>.',
  },
  {
    p: 3, u: 5, l: '5A', s: 'Adjectives describing attitude', d: 'hard', t: 'mcq',
    q: 'He never checks anything and he never arrives on time — he is completely <em>___</em>.',
    o: ['unreliable', 'uncompetitive', 'uncritical', 'unsympathetic'], a: 0,
    e: '<b>unreliable</b> — Unit 5A adjectives describing attitude.',
  },
  {
    p: 3, u: 2, l: '2B', s: 'Animals and the environment', d: 'medium', t: 'sort',
    item: 'hunt', bk: ['Threatens a species', 'Protects a species'], a: 0,
    e: '<b>hunt</b> puts a species at risk; <i>protected</i> is the opposite — Unit 2B.',
  },
  {
    p: 3, u: 3, l: '3 up', s: 'Wordpower: up', d: 'hard', t: 'sort',
    item: 'put up with (the noise)', bk: ['Separable', 'Inseparable'], a: 1,
    e: 'Three-part verbs like <b>put up with</b> never separate — Unit 3 Wordpower <i>up</i>.',
  },
  {
    p: 3, u: 4, l: '4B', s: 'Talking about difficulty', d: 'medium', t: 'sort',
    item: 'tricky', bk: ['Difficult', 'Not difficult'], a: 0,
    e: '<b>tricky</b> = difficult because it is fiddly — Unit 4B.',
  },
  {
    p: 3, u: 5, l: '5A', s: 'Adjectives describing attitude', d: 'easy', t: 'sort',
    item: 'thoughtless', bk: ['Positive attitude', 'Negative attitude'], a: 1,
    e: 'The suffix <i>-less</i> makes <b>thoughtless</b> negative — Unit 5A.',
  },

  /* ================= PART 4 · W — WRITING KNOWLEDGE (10) ================= */
  {
    p: 4, u: 1, l: '1D', s: 'Organising an article', d: 'easy', t: 'mcq',
    q: 'You are writing an article. Which phrase best opens a paragraph that gives an example?',
    o: ['To give just one example,', 'In conclusion,', 'On the other hand,', 'Firstly, I will define'], a: 0,
    e: 'Unit 1D — signal to the reader what each paragraph is doing.',
  },
  {
    p: 4, u: 1, l: '1D', s: 'Organising an article', d: 'easy', t: 'mcq',
    q: 'Which is the best <em>opening</em> for an article about living without a smartphone?',
    o: ['Could you last a week without your phone? I decided to find out.', 'This article is about living without a smartphone.', 'In this essay I will discuss smartphones and their uses.', 'Smartphones. Advantages and disadvantages.'], a: 0,
    e: 'Unit 1D — an article opens by engaging the reader, often with a question.',
  },
  {
    p: 4, u: 2, l: '2D', s: 'Guidelines in a leaflet', d: 'medium', t: 'mcq',
    q: 'Which sentence is written in the correct style for a safety leaflet?',
    o: ['Never approach an injured animal.', 'It could perhaps be considered unwise to approach an injured animal.', 'I think you shouldn’t really go near an injured animal.', 'One might possibly avoid approaching an injured animal.'], a: 0,
    e: 'Unit 2D — guidelines use short, direct imperatives.',
  },
  {
    p: 4, u: 2, l: '2D', s: 'Guidelines in a leaflet', d: 'hard', t: 'mcq',
    q: 'What is the best way to organise a set of survival guidelines?',
    o: ['Short headings with a few bullet points under each one.', 'One long paragraph containing every instruction.', 'A list of questions with no answers.', 'A story about something that happened to you.'], a: 0,
    e: 'Unit 2D — headings plus bullets make guidelines easy to scan in an emergency.',
  },
  {
    p: 4, u: 3, l: '3D', s: 'Describing data', d: 'hard', t: 'mcq',
    q: 'There was a <em>___</em> in the number of spectators after 2015.',
    o: ['sharp decline', 'sharply decline', 'sharp declining', 'decline sharp'], a: 0,
    e: 'Unit 3D — adjective + noun (<b>a sharp decline</b>) is standard for describing data.',
  },
  {
    p: 4, u: 3, l: '3D', s: 'Describing data', d: 'medium', t: 'mcq',
    q: 'Football <em>___</em> almost half of all tickets sold.',
    o: ['accounted for', 'counted on', 'added to', 'made up of'], a: 0,
    e: 'Unit 3D — <b>account for</b> is the standard verb for a proportion of a total.',
  },
  {
    p: 4, u: 4, l: '4D', s: 'An email to apply for work', d: 'easy', t: 'mcq',
    q: 'You are emailing about a job but you do not know the reader’s name. How do you open?',
    o: ['Dear Sir or Madam,', 'Hi there,', 'Dear Friend,', 'To who it may concern:'], a: 0,
    e: 'Unit 4D — the standard formal opening when the name is unknown.',
  },
  {
    p: 4, u: 4, l: '4D', s: 'An email to apply for work', d: 'easy', t: 'mcq',
    q: 'Which sentence is the most appropriate way to end a formal application email?',
    o: ['I look forward to hearing from you.', 'Write back soon, thanks!', 'Please answer me quickly.', 'That is all I wanted to say.'], a: 0,
    e: 'Unit 4D — a fixed, polite formal closing.',
  },
  {
    p: 4, u: 5, l: '5D', s: 'An argument for and against', d: 'medium', t: 'mcq',
    q: 'You have given the arguments in favour. How do you introduce the arguments against?',
    o: ['On the other hand, there are serious disadvantages.', 'Also, there are serious disadvantages.', 'Because there are serious disadvantages.', 'For example, there are serious disadvantages.'], a: 0,
    e: 'Unit 5D — <b>On the other hand</b> signals the opposite side of an argument.',
  },
  {
    p: 4, u: 5, l: '5D', s: 'An argument for and against', d: 'hard', t: 'mcq',
    q: 'Which phrase best introduces your own opinion in the final paragraph?',
    o: ['All in all, I believe that…', 'Firstly, I believe that…', 'As a result, I believe that…', 'In addition, I believe that…'], a: 0,
    e: 'Unit 5D — <b>All in all</b> introduces a conclusion after both sides.',
  },

  /* ================= PART 5 · P — PRONUNCIATION (5) ================= */
  {
    p: 5, u: 1, l: '1A', s: 'Word stress', d: 'easy', t: 'stress',
    q: 'Tap the <b>stressed syllable</b>.', sy: ['de', 'TER', 'mined'], a: 1, e: 'de<b>TER</b>mined — second syllable.',
  },
  {
    p: 5, u: 2, l: '2A', s: 'Sounds and spelling: g', d: 'medium', t: 'mcq',
    q: 'In which word does the letter <em>g</em> have the /dʒ/ sound?',
    o: ['danger', 'get', 'grow', 'guide'], a: 0,
    e: '<b>danger</b> = /ˈdeɪndʒə/. Before <i>e, i, y</i> the letter <i>g</i> is often /dʒ/.',
  },
  {
    p: 5, u: 3, l: '3C', s: 'Consonant sounds', d: 'hard', t: 'mcq',
    q: 'Which word has a <em>different</em> first consonant sound from the other three?',
    o: ['chemist', 'champion', 'cheer', 'chart'], a: 0,
    e: '<b>chemist</b> begins /k/; the others begin /tʃ/.',
  },
  {
    p: 5, u: 4, l: '4C', s: 'Contrastive stress', d: 'hard', t: 'stress',
    q: 'Tap the word the speaker stresses to correct the listener.',
    sy: ['I', 'said', 'the', 'BLUE', 'folder,', 'not', 'the', 'green', 'one.'], a: 3, mode: 'sentence',
    e: 'Contrastive stress falls on the word being corrected.',
  },
  {
    p: 5, u: 5, l: '5B', s: 'Sounds and spelling: th', d: 'hard', t: 'mcq',
    q: 'In which word is <em>th</em> the voiced sound /ð/?',
    o: ['weather', 'think', 'thoughtful', 'thick'], a: 0,
    e: '<b>weather</b> = /ˈweðə/ — voiced. The others are voiceless /θ/.',
  },

  /* ================= PART 6 · EE — COMMUNICATION SKILLS (10) ================= */
  {
    p: 6, u: 1, l: '1C', s: 'Breaking off a conversation', d: 'medium', t: 'mcq',
    q: "“Look, I'm really sorry, but I <em>___</em> — I've got a meeting at four.”",
    o: ["'d better get going", 'better to go', 'am going to break', 'must break off'], a: 0,
    e: '<b>I\'d better get going</b> — the natural way to end a conversation politely.',
  },
  {
    p: 6, u: 1, l: '1C', s: 'Checking understanding', d: 'hard', t: 'mcq',
    q: 'You want to check you have understood. What do you say?',
    o: ['So what you mean is that the machine cleans itself?', 'So what do you mean the machine cleans itself?', 'What you are meaning is the machine cleans itself?', 'That you mean the machine cleans itself?'], a: 0,
    e: '<b>So what you mean is…</b> + statement word order.',
  },
  {
    p: 6, u: 2, l: '2C', s: 'Agreeing using question tags', d: 'easy', t: 'mcq',
    q: "“It's absolutely freezing today, <em>___</em>?”",
    o: ["isn't it", 'is it', "doesn't it", "won't it"], a: 0,
    e: 'Positive statement with <i>is</i> → negative tag <b>isn\'t it</b>.',
  },
  {
    p: 6, u: 2, l: '2C', s: 'Responding to compliments', d: 'easy', t: 'mcq',
    q: 'Someone says: “That presentation was excellent.” What is the best modest reply?',
    o: ['Oh, it was nothing really — but thank you.', 'Yes, I know it was.', 'Of course it was excellent.', 'I completely agree with you.'], a: 0,
    e: 'English speakers usually downplay a compliment before accepting it.',
  },
  {
    p: 6, u: 3, l: '3C', s: 'Making careful suggestions', d: 'hard', t: 'mcq',
    q: '<em>___</em> we asked the referee to explain the decision?',
    o: ['What if', 'How about we', "Why we don't", 'Shall'], a: 0,
    e: '<b>What if we + past</b> makes a suggestion tentative and polite.',
  },
  {
    p: 6, u: 3, l: '3C', s: 'Keeping to the topic', d: 'easy', t: 'mcq',
    q: 'You want to return to an earlier subject. What do you say?',
    o: ['Going back to what you were saying about training…', 'Returning back on what you said training…', 'Coming again to you said about training…', 'Turning round what you were saying training…'], a: 0,
    e: '<b>Going back to what you were saying about…</b> — Unit 3C.',
  },
  {
    p: 6, u: 4, l: '4C', s: 'Describing photos', d: 'medium', t: 'mcq',
    q: '“In the <em>___</em> of the picture there’s a woman holding a trophy.”',
    o: ['foreground', 'front side', 'head', 'above'], a: 0, e: '<b>foreground</b> = the part nearest the viewer.',
  },
  {
    p: 6, u: 4, l: '4C', s: 'Expressing careful disagreement', d: 'hard', t: 'mcq',
    q: 'Which reply disagrees most carefully?',
    o: ["I see what you mean, but I'm not sure that's the whole story.", "You're completely wrong about that.", 'That is simply nonsense.', 'I totally agree with every word.'], a: 0,
    e: 'Acknowledge first, then soften — Unit 4C.',
  },
  {
    p: 6, u: 5, l: '5C', s: 'Responding to an idea', d: 'hard', t: 'mcq',
    q: 'Which reply shows interest but also a concern?',
    o: ['I can see the advantages — it could work, but it would be expensive.', "I couldn't agree less with you.", 'That is completely out of the question.', "I'm not with you at all."], a: 0,
    e: 'Unit 5C: respond positively, then raise the disadvantage.',
  },
  {
    p: 6, u: 5, l: '5C', s: 'Discussing advantages and disadvantages', d: 'medium', t: 'mcq',
    q: '“The main <em>___</em> of solar energy is that it produces no emissions.”',
    o: ['benefit', 'lack', 'fault', 'weakness'], a: 0, e: '<b>benefit</b> = advantage.',
  },

  /* ================= PART 7 · L — LISTENING (10 QUESTIONS FROM YOUTUBE LINK: SZg0EOOzKQ0) ================= */
  {
    p: 7, u: 1, l: '1B', s: 'Listening: gist & attitude', d: 'medium', t: 'mcq', lx: 'L1',
    q: 'At the party, Emma…',
    o: [
      'thought she and Josh had good chemistry.',
      'liked Josh but didn\'t feel attracted to him at first.',
      'liked Josh although she thought he was a bit too forward.',
      'wished Josh had talked to her friends instead.',
    ],
    a: 0,
    e: 'Emma says she "really hit it off" with Josh right from the start, which means they had good chemistry. She also says she definitely fancied him and that he was "confident without being arrogant".',
  },
  {
    p: 7, u: 1, l: '1B', s: 'Listening: detail', d: 'hard', t: 'mcq', lx: 'L1',
    q: 'After a few dates with Josh, Emma…',
    o: [
      'is trying not to get too excited.',
      'is completely in love with Josh.',
      'thinks they are moving too fast as a couple.',
      'has decided to stop dating him.',
    ],
    a: 0,
    e: 'Emma says she can feel herself "starting to fall for him" and tends to "fall head over heels quite quickly", so she is consciously trying to slow herself down and not get overly excited too early.',
  },
  {
    p: 7, u: 1, l: '1A', s: 'Listening: character description', d: 'easy', t: 'mcq', lx: 'L1',
    q: 'What character trait did Emma particularly appreciate in Josh?',
    o: [
      'He was confident without being arrogant.',
      'He was very shy and soft-spoken.',
      'He made fun of other people at the party.',
      'He talked endlessly about his career.',
    ],
    a: 0,
    e: 'Emma specifically notes: "what I really liked was that he was confident without being arrogant."',
  },
  {
    p: 7, u: 1, l: '1B', s: 'Listening: idiomatic language', d: 'medium', t: 'mcq', lx: 'L1',
    q: 'Why does Emma consider her feelings to be a dilemma?',
    o: [
      'She tends to fall head over heels very fast and wants to stay grounded.',
      'Her best friend also likes Josh.',
      'Josh is planning to move to another country soon.',
      'She does not know if she wants a relationship right now.',
    ],
    a: 0,
    e: 'Emma explains that her tendency is to fall head over heels too quickly, so she is deliberately trying to control her pace.',
  },
  {
    p: 7, u: 2, l: '2A', s: 'Listening: relationships & attitude', d: 'medium', t: 'mcq', lx: 'L1',
    q: 'Sofia explains that in the past, she…',
    o: [
      'used to admire Ashley a great deal.',
      'thinks Ashley has always hated her.',
      'had a major falling out with Ashley years ago.',
      'never really trusted Ashley as a friend.',
    ],
    a: 0,
    e: 'Sofia says she "really looked up to her and probably idolised her" when they first met, indicating deep admiration.',
  },
  {
    p: 7, u: 2, l: '2A', s: 'Listening: cause & effect', d: 'hard', t: 'mcq', lx: 'L1',
    q: 'Regarding Ashley’s recent behaviour, Sofia feels that…',
    o: [
      'Ashley may be bitter because of her bad breakup.',
      'she is spending far too much time with Ashley.',
      'it is not worth fighting for their friendship anymore.',
      'Ashley is trying to compete with her at work.',
    ],
    a: 0,
    e: 'Sofia mentions that Ashley changed ever since her boyfriend dumped her, becoming bitter and critical, which may explain why she behaves that way.',
  },
  {
    p: 7, u: 2, l: '2C', s: 'Listening: interpersonal conflict', d: 'hard', t: 'mcq', lx: 'L1',
    q: 'How is Sofia currently responding to the situation with Ashley?',
    o: [
      'She has been keeping her distance, though she still wants to make up.',
      'She blocked Ashley on social media and refused to speak to her.',
      'She confronted Ashley angrily in front of their mutual friends.',
      'She asked other friends to take sides in the dispute.',
    ],
    a: 0,
    e: 'Sofia says: "I\'ve been keeping my distance because it hurts, but the friendship means a lot to me and I really want to make up with her".',
  },
  {
    p: 7, u: 3, l: '3B', s: 'Listening: feelings & relationships', d: 'medium', t: 'mcq', lx: 'L1',
    q: 'Daniel explains that in his relationship with Laura, he…',
    o: [
      'longs for a more passionate relationship like they used to have.',
      'no longer has any feelings for his girlfriend at all.',
      'works directly with her and feels they are together too much.',
      'wants to break up immediately and start dating someone new.',
    ],
    a: 0,
    e: 'Daniel says they still care about each other and work in similar fields (not together), but he finds himself longing for the passion they once shared.',
  },
  {
    p: 7, u: 3, l: '3B', s: 'Listening: relationship evaluation', d: 'hard', t: 'mcq', lx: 'L1',
    q: 'When thinking about his everyday life with Laura, Daniel thinks…',
    o: [
      'he and Laura don\'t put much effort into the relationship anymore.',
      'having constant arguments and drama would make things exciting.',
      'there is absolutely no future for them as a couple.',
      'they should quit their jobs to spend more time together.',
    ],
    a: 0,
    e: 'Daniel states that on paper everything is fine with no drama, but worries they take each other for granted and do not invest enough effort into maintaining their bond.',
  },
  {
    p: 7, u: 4, l: '4A', s: 'Listening: main concern / conclusion', d: 'hard', t: 'mcq', lx: 'L1',
    q: 'What is Daniel\'s main concern about the direction of his relationship?',
    o: [
      'They are taking each other for granted and slowly drifting apart.',
      'Laura wants to get married but he is not ready.',
      'They cannot agree on financial matters and career choices.',
      'Their close friends no longer enjoy spending time with them.',
    ],
    a: 0,
    e: 'Daniel explicitly worries that they "have started to take each other for granted and are slowly drifting apart".',
  },

  /* ================= PART 8 · ESSAY WRITING (1) ================= */
  {
    p: 8, u: 5, l: '5D', s: 'Writing: an argument for and against an idea', d: 'hard', t: 'essay',
    q: 'Some people believe that adventurers who take extreme risks — climbers, sailors, extreme skiers — should pay the full cost of their own rescue.<br><br>Write an <b>argument for and against</b> this idea. Give at least one argument on each side and end with your own opinion.',
    min: 180, max: 220,
    e: 'Unit 5D. Marked on Task achievement (3), Organisation (2), Grammar (3), Vocabulary (2).',
  },
];

// Helper to seed and shuffle
function seeded(n: number) {
  let x = (n * 9301 + 49297) % 233280;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

function shuf(len: number, seed: number) {
  const r = seeded(seed);
  const a = Array.from({ length: len }, (_, k) => k);
  for (let k = len - 1; k > 0; k--) {
    const j = Math.floor(r() * (k + 1));
    [a[k], a[j]] = [a[j], a[k]];
  }
  if (a.every((v, k) => v === k)) a.reverse();
  return a;
}

export function prepareQuestions(): Question[] {
  const questions: Question[] = RAW_QUESTIONS.map((q, idx) => ({ ...q, i: idx }));

  // Pool matching options
  const matchPool: Record<string, string[]> = {};
  questions.forEach((q) => {
    if (q.t === 'match' && q.g && Array.isArray(q.o) && q.o.length > 0) {
      matchPool[q.g] = q.o;
    }
  });

  questions.forEach((q) => {
    if (q.t === 'match' && q.g && matchPool[q.g]) {
      q.o = matchPool[q.g];
    }
  });

  // Shuffle multiple choice & mistake options (except True/False/Not given)
  questions.forEach((q, i) => {
    const isTF = Array.isArray(q.o) && q.o.length === 3 && q.o[0] === 'True';
    if ((q.t === 'mcq' || q.t === 'mistake') && Array.isArray(q.o) && !isTF) {
      const order = shuf(q.o.length, i * 3 + 21);
      q.o = order.map((k) => q.o![k]);
      q.a = order.indexOf(q.a);
    }
  });

  // Shuffle matching pools
  const gGroups: Record<string, Question[]> = {};
  questions.forEach((q) => {
    if (q.t === 'match' && q.g) {
      (gGroups[q.g] = gGroups[q.g] || []).push(q);
    }
  });

  Object.keys(gGroups).sort().forEach((k, gi) => {
    const arr = gGroups[k];
    const pool = arr[0].o!.slice();
    const x = shuf(pool.length, gi * 31 + 11);
    const np = x.map((idx) => pool[idx]);
    arr.forEach((q) => {
      q.a = x.indexOf(q.a);
      q.o = np;
    });
  });

  // Tile ordering random initial shuffle
  questions.forEach((q, i) => {
    if (q.t === 'order' && q.tl) {
      q.sh = shuf(q.tl.length, i * 17 + 3);
    }
  });

  // Calculate points per question
  const pCount: Record<number, number> = {};
  const pPts: Record<number, number> = {};
  PARTS.forEach((p) => {
    pCount[p.n] = questions.filter((q) => q.p === p.n && q.t !== 'essay').length;
    pPts[p.n] = p.pts;
  });

  questions.forEach((q) => {
    q.pts = q.t === 'essay' ? pPts[q.p] : pPts[q.p] / (pCount[q.p] || 1);
  });

  return questions;
}
