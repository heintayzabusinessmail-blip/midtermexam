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
  storeKey: 'heinfinity_midterm_u1_5_empower_b2_v1',
  maxPlays: 2,
  requireCam: true,
};

export const PARTS: PartInfo[] = [
  { n: 1, code: 'R', title: 'Reading', pts: 10, instr: 'Read the text, then answer the questions based on the course materials.' },
  { n: 2, code: 'G', title: 'Grammar', pts: 25, instr: 'Choose the correct answer, put the words in order, or find the mistake.' },
  { n: 3, code: 'V', title: 'Vocabulary', pts: 20, instr: 'Choose, match or sort the vocabulary from Cambridge Empower B2 Units 1–5.' },
  { n: 4, code: 'W', title: 'Writing Knowledge', pts: 10, instr: 'Choose the best answer about writing profiles, narratives, rules, and arguments.' },
  { n: 5, code: 'P', title: 'Pronunciation', pts: 5, instr: 'Tap the stressed syllable or choose the natural connected speech pattern.' },
  { n: 6, code: 'EE', title: 'Communication Skills', pts: 10, instr: 'Choose the best phrase for everyday English and natural communication.' },
  { n: 7, code: 'L', title: 'Listening (Audio/Video)', pts: 10, instr: 'Tap PLAY to listen to the recording and review the dialogue. Then answer the questions.' },
  { n: 8, code: 'Essay', title: 'Essay Writing', pts: 10, instr: 'Write your answer in the box. Your teacher marks this part (180–220 words).' },
];

export const PASSAGES: Record<string, { title: string; text: string }> = {
  A: {
    title: 'Reading A — Training to Be the Best (Peking Opera School & Swiss Guard)',
    text: `BECOMING JACKIE CHAN
How do you get to be the next Jackie Chan? Most people think you should find a martial arts master and learn all their secrets. Jackie Chan's training was in a Peking Opera School in Hong Kong. These schools used to train people for traditional Chinese theatre and apart from the acrobatics and martial arts, students also learnt speech, song and dance.

The training was punishing. Students would rise at 5 am and train for at least ten hours. Discipline was very strict and teachers could be quite tough.

Jackie Chan, who did his training in the 1960s, described his time at school as 'arduous'. Students had to repeat exercises again and again until they got them right. At the same time, they would need to learn traditional character roles used in Chinese theatre.

Students were sent to Peking Opera Schools when they were children. They would stay at the school and were given food and accommodation as well as training. This meant that they built up a debt that they had to repay once they began performing in Chinese theatre. They were forced to sign a contract agreeing to this.

During the 1960s, interest in traditional Chinese theatre declined and the schools closed down. Today there are still academies in China that offer a mixture of the study of and training in Peking opera. However, it's not likely to be as gruelling as Jackie Chan's training.

THE VOICE IS A WEAPON
Imagine getting up each day and going to work back in the sixteenth century. That's probably what it feels like for guards around the Vatican City, the people who are dressed in the amazing uniforms from the Renaissance that you can see in the pictures.

These people are part of a 500-year-old tradition. All the guards are Swiss and they are there to protect the Vatican and the Pope. They're the oldest military unit that still exists today and is still active.

Getting into the Swiss Guards isn't easy. You need to be a Swiss male between the ages of 19 and 30 and you need to be at least 1.74 metres tall. You also have to have completed basic military training with the Swiss Army and have some kind of professional qualification like a degree or diploma. Those selected go through rigorous training. They start by learning about the history of the Swiss Guards and how to recognise key people around the Vatican. At the same time, there is weapons training. Vatican Swiss Guards have to learn to handle old-fashioned weapons such as swords.

However, Swiss Guards also learn that the very first weapon they should use is their voice. Guards often have to deal with difficult tourists who want to explore parts of the Vatican not open to the public, so their training involves lessons in both Italian and English. Of course, sometimes they might need to use force to resolve a tricky situation, so they are trained in self-defence, a mixture of karate and judo developed specially for the Guards.

In this day and age, it's difficult to think of a job where you learn languages, martial arts and how to use a sword. It's no easy task, but in order to wear one of the most striking uniforms in the world, that's what the Swiss Guards have to do.`,
  },
  B: {
    title: 'Reading B — Cooking in Antarctica',
    text: `When she saw an online advertisement for a Chef Manager at the British Antarctic Survey (BAS) base in Rothera, chef Fleur Wilson was certainly given food for thought. Fleur, in her mid-thirties, felt it was time for an adventure and a life experience that really was different.

Fleur is part of a group of key support staff at Rothera. The main focus of BAS is scientific research into the climate, the oceans and ecosystems of Antarctica. In order to carry out this research successfully, scientists need the help of people like Fleur to make their lives as comfortable as possible.

A key responsibility for Fleur is keeping everyone happy, and one of the best ways of doing this is by keeping them well fed. This doesn't mean preparing high-end restaurant food, but it does mean organising lots of social events to boost the mood. However, everyone has to play their part, and Fleur makes sure no one escapes doing the dishes.

One thing that all staff at BAS share is their love of the continent. 'I don't mind the rough weather,' Fleur says, 'and I've always found landscapes with ice and snow amazingly beautiful. Sure, I don't get to see much for six months of the year, but for the other six months there's plenty of light and the scenery is stunning.' But, quite apart from admiring the natural beauty of Antarctica, the staff all have a clear understanding of the fact that it's a fragile environment because, compared to the rest of the world, it is largely untouched. They're aware that the presence of human beings can have a significant ecological impact on the continent and, therefore, they treat it with care. BAS research stations use solar energy to heat air and hot water. 'We try to be as environmentally friendly as possible,' says Fleur; 'we don't want to leave a carbon footprint down here.'

As Fleur notes, 'Antarctica can tell us a lot about what's happening in the world. It can tell us a lot about global warming and climate change. In an extreme climate like this, you can really notice if things are changing.'

During the winter months, all Rothera staff try to keep themselves entertained either by making mid-winter gifts for each other or creating a murder mystery event. Fleur has also taught herself Spanish to intermediate level. However, during the summer months she does cross-country skiing and enjoys trips to do some penguin and whale watching.

Fleur realises that living and working in Antarctica isn't for everyone. 'If you're the kind of person that likes shopping, going out for dinner and clubbing, then forget it.' She's now in her fourth year here and still finds it a unique and rewarding experience.

'I was mad enough to apply for the job and I've been mad enough to stay. But it's a job that's given me so much — I've worked with some remarkable people and I'm living in a unique and fascinating part of the world.'`,
  },
};

// Video linked for Part 7 (Listening)
export const VIDEO: Record<string, VideoConfig> = {
  L1: { id: 'SZg0EOOzKQ0', start: 0, end: 0 },
};

export const AUDIO: Record<string, string | null> = {
  L1: null,
};

export const LISTENINGS: Record<string, ListeningItem> = {
  L1: {
    title: 'Unit 5B Track 2.27 & Unit 1B Podcast: Field Science & The 30-Day Challenge',
    speakers: ['Martha & Joe', 'Alison Podcast'],
    lines: [
      ['A', 'Martha & Joe — Adelie Penguin Expedition (Unit 5B, Track 2.27)'],
      [
        'B',
        "Joe: So Martha, this time next week you'll be settling into your accommodation in Antarctica! Are you ready to cuddle those cute little penguins?\nMartha: (Laughs) Joe, you obviously haven't done your homework. First of all, Adelie penguins aren't fluffy toy pets! They're full of attitude and can be quite aggressive if you get too close — they'll peck right through your trousers if you're not careful!\nJoe: Really? So what exactly will you be doing all day?\nMartha: I'll be monitoring the colony's breeding cycle. By the time I arrive in Antarctica, the penguins will already have got into pairs. By mid-November, they will have laid their eggs. Then by the end of December, the penguin chicks are born, and about three weeks after birth, we attach small metal identification tags to track their migration.\nJoe: And why does that matter so much to science?\nMartha: Because penguins are bio-indicators. Any subtle shifts in their breeding patterns or diet directly reflect wider global warming and ecological changes in the fragile Antarctic ecosystem.",
      ],
      ['A', "Alison's Seminar Podcast — The 30-Day Challenge (Unit 1B)"],
      [
        'B',
        "Alison: Welcome everyone. Today we're looking at the concept of the 30-day challenge. Neuroscientists have shown that 30 days is just enough time to add a new habit or subtract an old one from your life, because it takes the brain approximately 30 days to adapt to a new habit. Thirty days isn't a very long time, so it's fun and achievable. It's not just about giving up bad habits like smoking or coffee — it's about having a go at something new you've always wanted to try. There are two primary approaches: either choose something small that doesn't get in the way of your everyday life, or deliberately take time out for a major passion. If you make an effort and manage to stick with it for a full month, you are significantly more likely to keep it up afterwards!",
      ],
    ],
  },
};

export const RAW_QUESTIONS: Omit<Question, 'i'>[] = [
  /* ================= PART 1 · R — READING (10 QUESTIONS) ================= */
  {
    p: 1, u: 4, l: '4B', s: 'Reading: detail', d: 'easy', t: 'mcq', px: 'A',
    q: 'Why were children at the Peking Opera School required to sign a contract?',
    o: [
      'To repay the debt accumulated for their food, lodging, and training once they started performing.',
      'To guarantee that they would star in international martial arts feature films.',
      'To ensure their parents paid an expensive annual tuition fee to Hong Kong authorities.',
      'To promise they would remain in the school until the age of thirty.',
    ],
    a: 0,
    e: 'The text states: “they built up a debt that they had to repay once they began performing in Chinese theatre. They were forced to sign a contract agreeing to this.”',
  },
  {
    p: 1, u: 4, l: '4B', s: 'Reading: detail', d: 'medium', t: 'mcq', px: 'A',
    q: 'What was the daily routine like for students at Jackie Chan\'s Peking Opera School?',
    o: [
      'They would rise at 5 am and train for at least ten hours under strict discipline.',
      'They had a relaxed schedule where students chose between martial arts or singing.',
      'They trained exclusively in the late evenings after attending regular academic school.',
      'They practiced swordsmanship on weekends and spent weekdays on movie sets.',
    ],
    a: 0,
    e: 'The text states: “Students would rise at 5 am and train for at least ten hours. Discipline was very strict and teachers could be quite tough.”',
  },
  {
    p: 1, u: 4, l: '4B', s: 'Reading: detail', d: 'easy', t: 'mcq', px: 'A',
    q: 'Which of the following is an eligibility requirement to join the Vatican Swiss Guard?',
    o: [
      'Being a Swiss male between 19 and 30, at least 1.74m tall, with Swiss Army training and a qualification.',
      'Speaking fluent Latin and being born inside the walls of the Vatican City.',
      'Having at least ten years of combat experience in international conflicts.',
      'Holding a black belt in karate before submitting an application.',
    ],
    a: 0,
    e: 'The text lists: “Swiss male between the ages of 19 and 30 and you need to be at least 1.74 metres tall. You also have to have completed basic military training with the Swiss Army and have some kind of professional qualification like a degree or diploma.”',
  },
  {
    p: 1, u: 4, l: '4B', s: 'Reading: inference', d: 'hard', t: 'mcq', px: 'A',
    q: 'What does the text mean by stating that for the Swiss Guard, "the very first weapon they should use is their voice"?',
    o: [
      'They must use language skills to communicate politely and de-escalate problems with tourists before using force.',
      'They are trained to shout military commands at crowds to frighten potential intruders.',
      'They are required to perform Renaissance songs during official papal ceremonies.',
      'They cannot carry swords or physical weapons under Vatican law.',
    ],
    a: 0,
    e: 'The text explains: “Guards often have to deal with difficult tourists who want to explore parts of the Vatican not open to the public, so their training involves lessons in both Italian and English.”',
  },
  {
    p: 1, u: 4, l: '4B', s: 'Reading: True / False / Not given', d: 'hard', t: 'mcq', px: 'A',
    q: '<b>True, False or Not given?</b> — Peking opera academies operating in China today subject students to training that is just as gruelling as Jackie Chan\'s.',
    o: ['True', 'False', 'Not given'],
    a: 1,
    e: 'False. The text explicitly concludes: “However, it\'s not likely to be as gruelling as Jackie Chan\'s training.”',
  },
  {
    p: 1, u: 5, l: '5B', s: 'Reading: detail', d: 'easy', t: 'mcq', px: 'B',
    q: 'What motivated chef Fleur Wilson to apply for the Chef Manager role in Antarctica?',
    o: [
      'She was in her mid-thirties and felt ready for an exciting adventure and a completely different life experience.',
      'She wanted to lead scientific research into the climate and marine ecosystems of Antarctica.',
      'She was invited by the British government to film a television cooking series on the ice.',
      'She wished to escape working in restaurant kitchens and retire from cooking entirely.',
    ],
    a: 0,
    e: 'The text states: “Fleur, in her mid-thirties, felt it was time for an adventure and a life experience that really was different.”',
  },
  {
    p: 1, u: 5, l: '5B', s: 'Reading: detail', d: 'medium', t: 'mcq', px: 'B',
    q: 'How does the British Antarctic Survey base in Rothera minimize its environmental impact?',
    o: [
      'By using solar energy to heat air and hot water to avoid leaving a heavy carbon footprint.',
      'By shutting down the research station completely and evacuating all staff for the winter.',
      'By consuming only dried packaged rations and banning all cooked meals.',
      'By burning coal transported on cargo ships throughout the long polar winter.',
    ],
    a: 0,
    e: 'The text notes: “BAS research stations use solar energy to heat air and hot water. \'We try to be as environmentally friendly as possible,\' says Fleur; \'we don\'t want to leave a carbon footprint down here.\'”',
  },
  {
    p: 1, u: 5, l: '5B', s: 'Reading: detail', d: 'medium', t: 'mcq', px: 'B',
    q: 'How do the Rothera research station staff stay entertained during the dark winter months?',
    o: [
      'They make mid-winter gifts for each other, organize murder mystery games, and study hobbies.',
      'They fly out to South America every alternate weekend for entertainment.',
      'They host public dinner parties and open clubs for visiting tourists.',
      'They compete in Olympic ski tournaments against neighbouring research bases.',
    ],
    a: 0,
    e: 'The text explains: “During the winter months, all Rothera staff try to keep themselves entertained either by making mid-winter gifts for each other or creating a murder mystery event.”',
  },
  {
    p: 1, u: 5, l: '5B', s: 'Reading: inference', d: 'hard', t: 'mcq', px: 'B',
    q: 'According to Fleur, what type of person would NOT find living in Antarctica enjoyable?',
    o: [
      'Someone who loves shopping, going out for dinner, and city clubbing.',
      'Someone who enjoys cross-country skiing and observing penguins and whales.',
      'Someone who appreciates magnificent snowy landscapes and untouched nature.',
      'Someone who enjoys teamwork and participating in community events.',
    ],
    a: 0,
    e: 'The text states: “\'If you\'re the kind of person that likes shopping, going out for dinner and clubbing, then forget it.\'”',
  },
  {
    p: 1, u: 5, l: '5B', s: 'Reading: True / False / Not given', d: 'hard', t: 'mcq', px: 'B',
    q: '<b>True, False or Not given?</b> — Fleur Wilson is expected to do all the dishes and cleaning herself as part of her Chef Manager duties.',
    o: ['True', 'False', 'Not given'],
    a: 1,
    e: 'False. The text explicitly says: “everyone has to play their part, and Fleur makes sure no one escapes doing the dishes.”',
  },

  /* ================= PART 2 · G — GRAMMAR (25 QUESTIONS) ================= */
  {
    p: 2, u: 1, l: '1A', s: 'Review of tenses', d: 'medium', t: 'mcq',
    q: 'Apple <em>___</em> the iMac in 1998, transforming modern computer design.',
    o: ['introduced', 'has introduced', 'was introducing', 'is introducing'],
    a: 0,
    e: 'Past simple is used for finished past actions with a specific past time reference (1998). (Unit 1A Slide 10)',
  },
  {
    p: 2, u: 1, l: '1A', s: 'Review of tenses', d: 'medium', t: 'mcq',
    q: 'Jony Ive is widely recognized because he <em>___</em> currently <em>___</em> on iconic technology that people use every day.',
    o: ['is / working', 'has / worked', 'was / working', 'does / work'],
    a: 0,
    e: 'Present continuous is used for actions happening right now / around the present moment. (Unit 1A Slide 10)',
  },
  {
    p: 2, u: 1, l: '1A', s: 'Review of tenses', d: 'medium', t: 'mcq',
    q: 'I <em>___</em> always <em>___</em> great design, which is why I chose to study architecture.',
    o: ['have / loved', 'am / loving', 'was / loved', 'had / loved'],
    a: 0,
    e: 'Present perfect simple expresses an experience or past state connected to the present. (Unit 1A Slide 10, 11)',
  },
  {
    p: 2, u: 2, l: '2A', s: 'Narrative tenses', d: 'medium', t: 'mcq',
    q: 'Robert Hewitt was diving for crayfish when strong underwater currents <em>___</em> him half a kilometre out to sea.',
    o: ['swept', 'were sweeping', 'had been sweeping', 'have swept'],
    a: 0,
    e: 'Past simple is used for the main event that interrupts a background activity. (Unit 2A Slide 18, 19)',
  },
  {
    p: 2, u: 2, l: '2A', s: 'Narrative tenses', d: 'hard', t: 'mcq',
    q: 'By the fourth day of his ordeal, Robert <em>___</em> in the ocean for over seventy hours without fresh water.',
    o: ['had been floating', 'was floating', 'has floated', 'floated'],
    a: 0,
    e: 'Past perfect continuous expresses an ongoing action that was in progress up to a specific past moment. (Unit 2A Slide 18, 20)',
  },
  {
    p: 2, u: 2, l: '2A', s: 'Narrative tenses', d: 'hard', t: 'mistake',
    w: ['While', 'Robert', 'was', 'waiting', 'for', 'rescue,', 'he', 'had', 'thought', 'about', 'his', 'family.'],
    wi: 7,
    o: ['was', 'has', 'is'],
    a: 0,
    e: 'Use past continuous ("was thinking") for simultaneous background thoughts: "While he was waiting, he was thinking about his family." (Unit 2A Slide 21)',
  },
  {
    p: 2, u: 2, l: '2B', s: 'Future time clauses', d: 'easy', t: 'mcq',
    q: 'If a wolf <em>___</em> towards you, do not run away; stand your ground and face it.',
    o: ['runs', 'will run', 'is running', 'would run'],
    a: 0,
    e: 'In future time and conditional clauses with "if/when", use the present simple, not "will". (Unit 2B Slide 10, 11)',
  },
  {
    p: 2, u: 2, l: '2B', s: 'Conditional connectors', d: 'hard', t: 'mcq',
    q: '<em>___</em> you stay absolutely still on the ground, the bear will lose interest and wander away.',
    o: ['Provided', 'Unless', 'Although', 'Despite'],
    a: 0,
    e: '<b>Provided</b> (or <b>as long as</b>) means "if" for a positive condition that ensures a good outcome. (Unit 2B Slide 13)',
  },
  {
    p: 2, u: 2, l: '2B', s: 'Conditional connectors', d: 'hard', t: 'mcq',
    q: 'Sharks normally won\'t attack humans in open waters <em>___</em> they smell blood or mistake you for a seal.',
    o: ['unless', 'provided', 'as long as', 'as soon as'],
    a: 0,
    e: '<b>Unless</b> means "if not" / "except if": they won\'t attack except if they smell blood. (Unit 2B Slide 13)',
  },
  {
    p: 2, u: 2, l: '2B', s: 'Future time clauses', d: 'medium', t: 'order',
    tl: ['As', 'long', 'as', 'you', "don't", 'panic', 'the', 'shark', 'will', 'swim', 'away'],
    end: '.',
    e: '"As long as" takes the present simple in the condition, followed by "will + base verb" in the result. (Unit 2B Slide 13)',
  },
  {
    p: 2, u: 3, l: '3A', s: 'Multi-word verbs', d: 'hard', t: 'mcq',
    q: 'It took the scientists several months to <em>___</em> the mystery of why certain athletes have exceptional stamina.',
    o: ['work out', 'work it', 'work off', 'work away'],
    a: 0,
    e: '<b>work out</b> = to solve a problem or understand something. (Unit 3A Slide 14, 16)',
  },
  {
    p: 2, u: 3, l: '3A', s: 'Multi-word verbs', d: 'hard', t: 'mcq',
    q: 'Although learning the violin seemed arduous initially, she decided to <em>___</em> it until she improved.',
    o: ['stick with', 'stick it with', 'stick out', 'stick in'],
    a: 0,
    e: '<b>stick with</b> is an inseparable multi-word verb meaning to continue doing something even when difficult. (Unit 3A Slide 14, 17, 19)',
  },
  {
    p: 2, u: 3, l: '3A', s: 'Multi-word verbs', d: 'medium', t: 'order',
    tl: ['How', 'did', 'you', 'come', 'up', 'with', 'such', 'a', 'brilliant', 'idea'],
    end: '?',
    e: '<b>come up with</b> is a three-part phrasal verb that stays together. (Unit 3A Slide 15, 18)',
  },
  {
    p: 2, u: 3, l: '3B', s: 'Present perfect simple vs continuous', d: 'hard', t: 'mcq',
    q: 'I\'m exhausted right now because I <em>___</em> a stone wall in my garden all morning.',
    o: ['have been building', 'have built', 'had built', 'build'],
    a: 0,
    e: 'Present perfect continuous emphasizes the duration and exhausting nature of an ongoing activity. (Unit 3B Slide 12, 14)',
  },
  {
    p: 2, u: 3, l: '3B', s: 'Present perfect simple vs continuous', d: 'hard', t: 'mcq',
    q: 'I\'m really proud of myself because I <em>___</em> a stone wall in my garden, and it looks superb.',
    o: ['have built', 'have been building', 'had built', 'am building'],
    a: 0,
    e: 'Present perfect simple focuses on the completed achievement with a present result. (Unit 3B Slide 12, 14)',
  },
  {
    p: 2, u: 3, l: '3B', s: 'Present perfect continuous', d: 'medium', t: 'mistake',
    w: ['She', 'is', 'tired', 'because', 'she', 'has', 'been', 'run', 'every', 'day.'],
    wi: 7,
    o: ['running', 'ran', 'runs'],
    a: 0,
    e: 'Present perfect continuous requires "has been running" with the -ing participle. (Unit 3B Slide 12, 13)',
  },
  {
    p: 2, u: 3, l: '3B', s: 'Present perfect with for/since', d: 'medium', t: 'mistake',
    w: ['I', 'have', 'been', 'playing', 'football', 'since', 'five', 'years', 'now.'],
    wi: 5,
    o: ['for', 'from', 'during'],
    a: 0,
    e: 'Use <b>for</b> with a duration of time ("for five years") and <b>since</b> with a specific starting point. (Unit 3B Slide 13)',
  },
  {
    p: 2, u: 4, l: '4B', s: 'Obligation and permission (past)', d: 'hard', t: 'mcq',
    q: 'Students at the Peking Opera School <em>___</em> rise at 5 am every morning to begin their punishing training.',
    o: ['had to', 'must', 'have to', 'must have'],
    a: 0,
    e: 'Past obligation requires <b>had to</b>; "must" has no past form. (Unit 4B Slide 11, 13)',
  },
  {
    p: 2, u: 4, l: '4B', s: 'Prohibition (past)', d: 'hard', t: 'mcq',
    q: 'When we were at boarding school, we <em>___</em> to use mobile phones or talk in class.',
    o: ["weren't allowed", "didn't allow", "mustn't", "can't"],
    a: 0,
    e: 'Past prohibition uses <b>weren\'t allowed to</b> or <b>couldn\'t</b>. (Unit 4B Slide 11, 13, 23)',
  },
  {
    p: 2, u: 4, l: '4B', s: 'Obligation (past)', d: 'medium', t: 'mistake',
    w: ['When', 'we', 'were', 'children,', 'we', 'must', 'wear', 'heavy', 'school', 'uniforms.'],
    wi: 5,
    o: ['had to', 'must to', 'have to'],
    a: 0,
    e: 'In the past, use "had to wear", not "must wear". (Unit 4B Slide 11, 23)',
  },
  {
    p: 2, u: 4, l: '4B', s: 'No obligation (present)', d: 'easy', t: 'mcq',
    q: 'Swiss Guards <em>___</em> wear their heavy Renaissance uniforms when they are completely off-duty.',
    o: ["don't have to", "mustn't", "can't", "hadn't to"],
    a: 0,
    e: '<b>don\'t have to</b> / <b>don\'t need to</b> expresses absence of obligation (it is not necessary). (Unit 4B Slide 9, 10)',
  },
  {
    p: 2, u: 5, l: '5A', s: 'Future probability', d: 'hard', t: 'mcq',
    q: 'Which sentence demonstrates the correct word order for expressing future probability?',
    o: [
      'Humans will probably establish permanent colonies on Mars.',
      'Humans probably will establish permanent colonies on Mars.',
      'Humans will definitely not to establish colonies.',
      'Humans might establishing colonies soon.',
    ],
    a: 0,
    e: 'In affirmative sentences, adverbs of certainty come AFTER "will" ("will probably", "will definitely"). (Unit 5A Slide 17, 21)',
  },
  {
    p: 2, u: 5, l: '5A', s: 'Future probability', d: 'medium', t: 'order',
    tl: ['I', 'definitely', "won't", 'move', 'to', 'another', 'country', 'this', 'year'],
    end: '.',
    e: 'In negative sentences, the adverb comes BEFORE "won\'t": "definitely won\'t". (Unit 5A Slide 17, 21)',
  },
  {
    p: 2, u: 5, l: '5B', s: 'Future continuous', d: 'hard', t: 'mcq',
    q: 'Don\'t telephone me at 8 pm this evening because I <em>___</em> the live football championship.',
    o: ["'ll be watching", "'ll have watched", "watch", "'ll watch"],
    a: 0,
    e: 'Future continuous ("will be + -ing") describes an activity in progress at a specific future moment. (Unit 5B Slide 20, 22, 23)',
  },
  {
    p: 2, u: 5, l: '5B', s: 'Future perfect', d: 'hard', t: 'mcq',
    q: 'By the time Martha arrives at the Antarctic station, the Adelie penguins <em>___</em> already <em>___</em> into pairs.',
    o: ['will / have got', 'will / be getting', 'have / got', 'are / getting'],
    a: 0,
    e: 'Future perfect ("will have + past participle") describes an action completed before a future deadline. (Unit 5B Slide 21, 22, 23)',
  },

  /* ================= PART 3 · V — VOCABULARY (20 QUESTIONS) ================= */
  {
    p: 3, u: 1, l: '1A', s: 'Character adjectives', d: 'medium', t: 'match', g: 'g_char_adj',
    q: 'Determined',
    o: [
      'Persistent in reaching goals and refusing to give up even when facing hardship',
      'Having a powerful desire to succeed and reach the summit of one\'s career',
      'Recovering quickly and bouncing back after experiencing trouble or misfortune',
      'Having a substantial impact on other people\'s thinking and actions',
    ],
    a: 0,
    e: 'Determined: never gives up, persistent in reaching goals. (Unit 1A Slide 4, 17, 18)',
  },
  {
    p: 3, u: 1, l: '1A', s: 'Character adjectives', d: 'medium', t: 'match', g: 'g_char_adj',
    q: 'Ambitious',
    o: [
      'Persistent in reaching goals and refusing to give up even when facing hardship',
      'Having a powerful desire to succeed and reach the summit of one\'s career',
      'Recovering quickly and bouncing back after experiencing trouble or misfortune',
      'Having a substantial impact on other people\'s thinking and actions',
    ],
    a: 1,
    e: 'Ambitious: having a strong desire to succeed and achieve high status. (Unit 1A Slide 17, 18)',
  },
  {
    p: 3, u: 1, l: '1A', s: 'Character adjectives', d: 'medium', t: 'match', g: 'g_char_adj',
    q: 'Resilient',
    o: [
      'Persistent in reaching goals and refusing to give up even when facing hardship',
      'Having a powerful desire to succeed and reach the summit of one\'s career',
      'Recovering quickly and bouncing back after experiencing trouble or misfortune',
      'Having a substantial impact on other people\'s thinking and actions',
    ],
    a: 2,
    e: 'Resilient: recovering quickly from trouble; keeps going when things get tough. (Unit 1A Slide 17, 18)',
  },
  {
    p: 3, u: 1, l: '1A', s: 'Character adjectives', d: 'medium', t: 'match', g: 'g_char_adj',
    q: 'Influential',
    o: [
      'Persistent in reaching goals and refusing to give up even when facing hardship',
      'Having a powerful desire to succeed and reach the summit of one\'s career',
      'Recovering quickly and bouncing back after experiencing trouble or misfortune',
      'Having a substantial impact on other people\'s thinking and actions',
    ],
    a: 3,
    e: 'Influential: having great impact; many people adopt their ideas. (Unit 1A Slide 17, 18)',
  },
  {
    p: 3, u: 1, l: '1B', s: 'Trying and succeeding', d: 'medium', t: 'mcq',
    q: 'Often when people embark on a new habit, they <em>___</em> after a week or two because their brain hasn\'t adapted.',
    o: ['give up', 'keep to', 'work out', 'try out'],
    a: 0,
    e: '<b>give up</b> = to stop trying or quit before forming a habit. (Unit 1B Slide 15)',
  },
  {
    p: 3, u: 1, l: '1B', s: 'Trying and succeeding', d: 'medium', t: 'mcq',
    q: 'The whole concept of the 30-day challenge is that you <em>___</em> something new you\'ve always wanted to explore.',
    o: ['have a go at', 'give up on', 'manage to', 'keep up with'],
    a: 0,
    e: '<b>have a go at</b> = to attempt or try doing something unfamiliar. (Unit 1B Slide 15)',
  },
  {
    p: 3, u: 2, l: '2A', s: 'Expressions with GET', d: 'hard', t: 'match', g: 'g_get_expr',
    q: 'get away',
    o: [
      'go somewhere else or escape your everyday routine',
      'have the chance or opportunity to do something',
      'be extremely surprised or astonished by something',
      'make no progress despite putting in prolonged effort',
    ],
    a: 0,
    e: '<b>get away</b> = to go somewhere else or take a holiday. (Unit 2A Slide 9, 12)',
  },
  {
    p: 3, u: 2, l: '2A', s: 'Expressions with GET', d: 'hard', t: 'match', g: 'g_get_expr',
    q: 'get to do it',
    o: [
      'go somewhere else or escape your everyday routine',
      'have the chance or opportunity to do something',
      'be extremely surprised or astonished by something',
      'make no progress despite putting in prolonged effort',
    ],
    a: 1,
    e: '<b>get to do it</b> = to have the opportunity/privilege to do something. (Unit 2A Slide 9, 12)',
  },
  {
    p: 3, u: 2, l: '2A', s: 'Expressions with GET', d: 'hard', t: 'match', g: 'g_get_expr',
    q: "couldn't get over",
    o: [
      'go somewhere else or escape your everyday routine',
      'have the chance or opportunity to do something',
      'be extremely surprised or astonished by something',
      'make no progress despite putting in prolonged effort',
    ],
    a: 2,
    e: '<b>can\'t get over</b> = to be very surprised by something. (Unit 2A Slide 9, 12)',
  },
  {
    p: 3, u: 2, l: '2A', s: 'Expressions with GET', d: 'hard', t: 'match', g: 'g_get_expr',
    q: "wasn't getting anywhere",
    o: [
      'go somewhere else or escape your everyday routine',
      'have the chance or opportunity to do something',
      'be extremely surprised or astonished by something',
      'make no progress despite putting in prolonged effort',
    ],
    a: 3,
    e: '<b>not get anywhere</b> = to make no progress. (Unit 2A Slide 9, 12)',
  },
  {
    p: 3, u: 2, l: '2B', s: 'Environment vocabulary', d: 'medium', t: 'mcq',
    q: 'The Siberian tiger is an endangered <em>___</em>, with only approximately 500 animals remaining in the wild.',
    o: ['species', 'predator', 'habitat', 'atmosphere'],
    a: 0,
    e: 'A <b>species</b> is a biological group of similar animals or plants. (Unit 2B Slide 16, 38)',
  },
  {
    p: 3, u: 2, l: '2B', s: 'Environment vocabulary', d: 'medium', t: 'mcq',
    q: 'Deforestation and human encroachment severely threaten the natural <em>___</em> of wild animals.',
    o: ['habitat', 'creature', 'specimen', 'footprint'],
    a: 0,
    e: 'A <b>habitat</b> is the natural home or territory of an animal. (Unit 2B Slide 16, 38)',
  },
  {
    p: 3, u: 3, l: '3A', s: 'Ability and achievement', d: 'hard', t: 'sort',
    item: 'outstanding',
    bk: ['Good level of ability', 'Very high level of ability / achievement', 'Good level of achievement'],
    a: 1,
    e: '<b>outstanding</b>, <b>exceptional</b>, and <b>brilliant</b> describe a very high level of ability or achievement. (Unit 3A Slide 9, 12)',
  },
  {
    p: 3, u: 3, l: '3A', s: 'Ability and achievement', d: 'hard', t: 'sort',
    item: 'skilled',
    bk: ['Good level of ability', 'Very high level of ability / achievement', 'Good level of achievement'],
    a: 0,
    e: '<b>skilled</b> and <b>talented</b> describe a good level of ability. (Unit 3A Slide 9, 12)',
  },
  {
    p: 3, u: 3, l: '3A', s: 'Ability and achievement', d: 'hard', t: 'sort',
    item: 'successful',
    bk: ['Good level of ability', 'Very high level of ability / achievement', 'Good level of achievement'],
    a: 2,
    e: '<b>successful</b> describes a good level of achievement. (Unit 3A Slide 9, 12)',
  },
  {
    p: 3, u: 3, l: '3B', s: 'Sports vocabulary', d: 'easy', t: 'mcq',
    q: 'During a competitive sports match, the <em>___</em> controls the game and enforces fair play.',
    o: ['referee', 'pitch', 'spectator', 'representative'],
    a: 0,
    e: 'A <b>referee</b> is the person who makes decisions and controls the rules during a sports match. (Unit 3B Slide 8)',
  },
  {
    p: 3, u: 4, l: '4B', s: 'Talking about difficulty', d: 'hard', t: 'mcq',
    q: 'Jackie Chan described his Peking Opera School training as <em>___</em> because students had to repeat exercises relentlessly until perfected.',
    o: ['arduous', 'tricky', 'cautious', 'amusing'],
    a: 0,
    e: '<b>arduous</b> means involving immense effort, energy, and difficulty. (Unit 4B Slide 16, 20)',
  },
  {
    p: 3, u: 4, l: '4B', s: 'Talking about difficulty', d: 'hard', t: 'mcq',
    q: 'Pilots and military recruits must complete extremely <em>___</em> and thorough training before taking command.',
    o: ['rigorous', 'stubborn', 'endangered', 'informal'],
    a: 0,
    e: '<b>rigorous</b> means extremely thorough, careful, and demanding. (Unit 4B Slide 21)',
  },
  {
    p: 3, u: 5, l: '5A', s: 'Adjectives describing attitude', d: 'medium', t: 'mcq',
    q: 'Someone who evaluates circumstances as they genuinely exist, rather than relying on false hope, is described as <em>___</em>.',
    o: ['realistic', 'adventurous', 'pessimistic', 'optimistic'],
    a: 0,
    e: '<b>realistic</b> = seeing things as they are. (Unit 5A Slide 11)',
  },
  {
    p: 3, u: 5, l: '5B', s: 'Natural world collocations', d: 'medium', t: 'mcq',
    q: 'The Rothera research station utilizes clean solar power to avoid leaving a damaging <em>___</em> in Antarctica.',
    o: ['carbon footprint', 'rough weather', 'fragile environment', 'climate change'],
    a: 0,
    e: 'Collocation: <b>carbon footprint</b> = the measure of greenhouse gas emissions generated. (Unit 5B Slide 11, 12, 14)',
  },

  /* ================= PART 4 · W — WRITING KNOWLEDGE (10 QUESTIONS) ================= */
  {
    p: 4, u: 1, l: '1A', s: 'Biographical writing', d: 'medium', t: 'mcq',
    q: 'When writing a 150–200 word biographical profile about an inspiring person, what three components must be integrated according to Unit 1A?',
    o: [
      'Their concrete achievements, the challenges they overcame, and at least 4 precise character adjectives.',
      'Their private bank statements, a list of personal enemies, and childhood holiday photographs.',
      'A fictional interview with unrelated celebrities without factual corroboration.',
      'A chronological table listing every single calendar date of their life without descriptive prose.',
    ],
    a: 0,
    e: 'Unit 1A Slide 21 specifies: "Mention their achievements, describe the challenges they faced, use at least 4 character adjectives (150–200 words)."',
  },
  {
    p: 4, u: 2, l: '2A', s: 'Narrative structure', d: 'hard', t: 'mcq',
    q: 'What is the most effective chronological structure for writing an engaging survival narrative?',
    o: [
      'Establish scene and background setting, narrate main events chronologically, detail emotional reactions, and conclude with the rescue/outcome.',
      'Reveal the helicopter rescue in sentence one, followed by an alphabetical list of survival items.',
      'Write disconnected dialogues with no contextual indication of time, place, or characters involved.',
      'Conclude the narrative in the opening paragraph and dedicate the body to unrelated philosophical musings.',
    ],
    a: 0,
    e: 'Unit 2A Slide 25 outlines: Scene/background setting -> Main chronological events -> Personal feelings -> Resolution/outcome.',
  },
  {
    p: 4, u: 2, l: '2B', s: 'Writing safety guidelines', d: 'medium', t: 'mcq',
    q: 'Which grammatical formula is recommended in Unit 2B for drafting clear, authoritative visitor safety rules?',
    o: [
      'If / When + Present Simple, followed by an Imperative advice or command clause.',
      'Past Perfect combined with passive subjunctive conditional structures.',
      'Future Continuous joined with rhetorical interrogative clauses.',
      'Unreal conditionals utilizing "would have + past participle" throughout.',
    ],
    a: 0,
    e: 'Unit 2B Slide 11, 34 specifies: "Use: If / When + Present Simple + Imperative (e.g., \'If you see a snake, move away slowly\')."',
  },
  {
    p: 4, u: 3, l: '3A', s: 'Spelling and memory techniques', d: 'easy', t: 'mcq',
    q: 'How does the spelling mnemonic "Big Elephants Can\'t Always Use Small Exits" assist students in written composition?',
    o: [
      'It provides an acronym association using initial letters to reliably recall the spelling of "BECAUSE".',
      'It teaches writers how to eliminate subordinate conjunctions from academic arguments.',
      'It serves as a mandatory opening sentence for all Cambridge B2 formal letters.',
      'It illustrates how to construct compound comparative adjectives for large mammals.',
    ],
    a: 0,
    e: 'Unit 3A Slide 6, 21 highlights spelling mnemonics: "B-E-C-A-U-S-E = Big Elephants Can\'t Always Use Small Exits."',
  },
  {
    p: 4, u: 4, l: '4B', s: 'Writing formal regulations', d: 'hard', t: 'mcq',
    q: 'When writing about historical institutional regulations, which sentence models correct modal grammar?',
    o: [
      '"Cadets had to maintain pristine living quarters and were not allowed to leave campus on weekdays."',
      '"Cadets must to wear heavy uniforms and didn\'t allowed to communicate."',
      '"Cadets had study daily and don\'t must question their instructors."',
      '"Cadets were allowing to miss drill sessions whenever training was very hardly."',
    ],
    a: 0,
    e: 'Unit 4B Slide 11, 23 reinforces: past obligation ("had to maintain") and past prohibition ("were not allowed to leave").',
  },
  {
    p: 4, u: 5, l: '5A', s: 'Expressing future probability', d: 'medium', t: 'mcq',
    q: 'Which phrasing conveys the strongest degree of positive certainty in an analytical forecast?',
    o: [
      '"Technological developments will almost certainly accelerate green energy adoption."',
      '"Technological developments might possibly accelerate green energy adoption."',
      '"Technological developments probably won\'t accelerate green energy adoption."',
      '"Technological developments could perhaps accelerate green energy adoption."',
    ],
    a: 0,
    e: 'Unit 5A Slide 17, 18 shows that "will almost certainly" denotes nearly 100% confidence on the probability scale.',
  },
  {
    p: 4, u: 5, l: '5B', s: 'Environmental collocations in writing', d: 'medium', t: 'mcq',
    q: 'Which collocation correctly finishes: "The construction of industrial ports creates a severe <em>___</em> on local marine wildlife"?',
    o: ['ecological impact', 'rough weather', 'solar energy', 'atmosphere footprint'],
    a: 0,
    e: 'Unit 5B Slide 11, 12, 14 establishes: <b>ecological impact</b> = significant environmental effect.',
  },
  {
    p: 4, u: 5, l: '5D', s: 'Essay transitions', d: 'hard', t: 'mcq',
    q: 'Which transitional device is most suitable for introducing an opposing argument in a formal B2 essay?',
    o: ['Conversely, opponents argue that...', 'Furthermore, research demonstrates that...', 'In addition, it is obvious that...', 'Consequently, the result proves that...'],
    a: 0,
    e: '<b>Conversely</b> / <b>On the other hand</b> correctly signals a transition to a contrasting viewpoint in an argumentative essay.',
  },
  {
    p: 4, u: 5, l: '5D', s: 'Topic sentences', d: 'medium', t: 'mcq',
    q: 'What is the primary structural function of a "topic sentence" at the opening of an essay paragraph?',
    o: [
      'To introduce the central controlling idea and argument explored in that specific paragraph.',
      'To restate the author\'s signature and word count tally.',
      'To list dictionary definitions of every verb used in the subsequent lines.',
      'To present the final grade awarded by the examiner.',
    ],
    a: 0,
    e: 'A topic sentence clearly introduces the main argument developed in that body paragraph.',
  },
  {
    p: 4, u: 5, l: '5D', s: 'Essay conclusion stance', d: 'medium', t: 'mcq',
    q: 'Where should a candidate articulate their definitive personal stance in a "for-and-against" argumentative essay?',
    o: [
      'In the concluding paragraph, following an objective analysis of both perspectives.',
      'Strictly in the title without providing supporting arguments in the body.',
      'Hidden in parenthetical citations between clauses.',
      'Candidates must remain completely neutral and never disclose their opinion.',
    ],
    a: 0,
    e: 'Cambridge B2 essay conventions dictate examining both viewpoints before summarizing with your definitive stance in the conclusion.',
  },

  /* ================= PART 5 · P — PRONUNCIATION (5 QUESTIONS) ================= */
  {
    p: 5, u: 3, l: '3A', s: 'Word stress', d: 'easy', t: 'stress', mode: 'word',
    sy: ['out', 'STAND', 'ing'],
    a: 1,
    e: 'The primary syllable stress falls on the second syllable: out-STAND-ing. (Unit 3A Slide 10)',
  },
  {
    p: 5, u: 3, l: '3A', s: 'Word stress', d: 'medium', t: 'stress', mode: 'word',
    sy: ['ex', 'CEP', 'tion', 'al'],
    a: 1,
    e: 'The primary syllable stress falls on the second syllable: ex-CEP-tion-al. (Unit 3A Slide 10)',
  },
  {
    p: 5, u: 5, l: '5A', s: 'Word stress', d: 'medium', t: 'stress', mode: 'word',
    sy: ['op', 'ti', 'MIS', 'tic'],
    a: 2,
    e: 'The primary syllable stress falls on the third syllable: opti-MIS-tic. (Unit 5A Slide 13)',
  },
  {
    p: 5, u: 1, l: '1C', s: 'Rapid speech and connected speech', d: 'hard', t: 'mcq',
    q: 'In natural connected speech, how is the conversational phrase "Must go" typically pronounced?',
    o: [
      '/məs gəʊ/ — the final /t/ is dropped before the consonant /g/.',
      '/mʌstə gəʊ/ — an extra vowel is added between the two words.',
      '/mjuːst gəʊ/ — the vowel is lengthened into a full diphthong.',
      '/mʌst gaʊ/ — both words are stressed with an abrupt pause.',
    ],
    a: 0,
    e: 'Unit 1C Slide 23 explicitly teaches rapid speech reductions: "Must go /məs gəʊ/".',
  },
  {
    p: 5, u: 2, l: '2C', s: 'Question tag intonation', d: 'hard', t: 'mcq',
    q: 'When using a question tag to check for agreement (e.g., "That photo is beautiful, isn\'t it?"), what intonation pattern is used?',
    o: [
      'The voice goes DOWN ↘ on the tag to signal that you expect agreement.',
      'The voice rises sharply ↗ as if asking an uncertain open question.',
      'The voice stays flat in a robotic monotone without pitch movement.',
      'The voice starts high, drops, and rises again rapidly.',
    ],
    a: 0,
    e: 'Unit 2C Slide 29 states: "For agreement, the voice goes DOWN ↘ at the end: \'That photo is beautiful, ↘ isn\'t it?\'"',
  },

  /* ================= PART 6 · EE — COMMUNICATION SKILLS (10 QUESTIONS) ================= */
  {
    p: 6, u: 1, l: '1C', s: 'Everyday English: breaking off a conversation', d: 'easy', t: 'mcq',
    q: 'You are chatting with a classmate outside the library, but your bus is pulling up to the stop. Which phrase politely and naturally breaks off the talk?',
    o: [
      '"I really must run now or I\'ll miss my bus. Talk to you later!"',
      '"Stop speaking to me right this instant."',
      '"Why are you still standing here talking?"',
      '"I am formally cancelling this dialogue."',
    ],
    a: 0,
    e: 'Unit 1C Slide 21 presents natural ways to break off a conversation: "I really must go now.", "I must run.", "Talk to you later."',
  },
  {
    p: 6, u: 1, l: '1C', s: 'Everyday English: breaking off a conversation', d: 'medium', t: 'mcq',
    q: 'Which of the following expressions was NOT used to leave a conversation in Unit 1C?',
    o: [
      '"I order you to leave immediately."',
      '"Must be off now."',
      '"Can\'t talk just now."',
      '"Nice talking to you."',
    ],
    a: 0,
    e: 'Unit 1C Slide 21, 22 reviews natural phrases: "Must be off now", "Can\'t talk just now", "Nice talking to you".',
  },
  {
    p: 6, u: 1, l: '1C', s: 'Checking understanding', d: 'easy', t: 'mcq',
    q: 'When explaining a multi-step cooking recipe to an informal study partner, which phrase naturally checks if they are following?',
    o: [
      '"Do you get what I mean? / Have you got that?"',
      '"Do you possess basic intellect?"',
      '"Translate what I have just uttered verbatim."',
      '"I assume you are completely unable to comprehend."',
    ],
    a: 0,
    e: 'Unit 1C Slide 24 teaches informal checking phrases: "Have you got that?", "Do you get what I mean?".',
  },
  {
    p: 6, u: 2, l: '2B', s: 'Survival safety advice', d: 'medium', t: 'mcq',
    q: 'A tourist on a mountain hike asks: "What should I do if a bear suddenly approaches our campsite?" What is the correct advice based on Unit 2B?',
    o: [
      '"Lie on the ground, play dead, and stay absolutely still until it loses interest."',
      '"Sprint straight uphill as fast as you can while shouting."',
      '"Climb to the thinnest branches of the highest tree immediately."',
      '"Wave raw meat to distract the bear while you run away."',
    ],
    a: 0,
    e: 'Unit 2B Slide 9, 13 instructs: "If a bear comes towards you, lie on the ground and \'play dead\'. Provided you stay absolutely still, the bear will lose interest."',
  },
  {
    p: 6, u: 2, l: '2C', s: 'Question tags', d: 'easy', t: 'mcq',
    q: 'The scenery here in the Scottish Highlands is absolutely breathtaking, <em>___</em>?',
    o: ["isn't it", "is it", "wasn't it", "doesn't it"],
    a: 0,
    e: 'Positive sentence with "is" requires a negative tag: "isn\'t it?". (Unit 2C Slide 28, 31)',
  },
  {
    p: 6, u: 2, l: '2C', s: 'Question tags', d: 'medium', t: 'mcq',
    q: 'This professional DSLR telephoto lens isn\'t cheap, <em>___</em>?',
    o: ["is it", "isn't it", "does it", "was it"],
    a: 0,
    e: 'Negative sentence with "isn\'t" requires a positive tag: "is it?". (Unit 2C Slide 28, 31)',
  },
  {
    p: 6, u: 2, l: '2C', s: 'Question tags', d: 'medium', t: 'mcq',
    q: 'You can take a high-resolution photo for our university brochure, <em>___</em>?',
    o: ["can't you", "can you", "don't you", "couldn't it"],
    a: 0,
    e: 'Positive sentence with modal "can" requires negative tag "can\'t you?". (Unit 2C Slide 28, 31)',
  },
  {
    p: 6, u: 2, l: '2C', s: 'Giving and responding to compliments', d: 'easy', t: 'mcq',
    q: 'A fellow photographer admires your landscape portfolio and says: "What a great shot! That composition is magnificent." What is the most polite response?',
    o: [
      '"Thanks. I\'m really glad you like it. That\'s very kind of you."',
      '"Of course, I am clearly superior to all other photographers."',
      '"Why are you inspecting my work without my permission?"',
      '"No, it is a terrible photograph and your opinion is wrong."',
    ],
    a: 0,
    e: 'Unit 2C Slide 30 outlines polite responses: "Thanks. I\'m glad you like it.", "That\'s very kind of you."',
  },
  {
    p: 6, u: 1, l: '1B', s: 'Interview conversational skills', d: 'hard', t: 'mcq',
    q: 'In the Unit 1B interviews, what question did the interviewer ask Steve when discussing his Italian language 30-day challenge?',
    o: [
      '"And who do you practise with? Or are you just working alone?"',
      '"Why did you choose the most obscure dialect in Europe?"',
      '"How many thousands of dollars did you pay for your lessons?"',
      '"Did you fail your Italian exams before starting?"',
    ],
    a: 0,
    e: 'Unit 1B Slide 13 confirms missing question 1: "And who do you practise with? or are you just working alone?" (Steve\'s interview).',
  },
  {
    p: 6, u: 1, l: '1B', s: 'Interview conversational skills', d: 'hard', t: 'mcq',
    q: 'In the Unit 1B interviews, what question did the interviewer ask Mona regarding her daily drawing challenge?',
    o: [
      '"What have you drawn pictures of so far?"',
      '"Why did you give up on drawing objects around your house?"',
      '"When will your paintings be exhibited in a national museum?"',
      '"How many hours did you spend studying Renaissance masters?"',
    ],
    a: 0,
    e: 'Unit 1B Slide 13 confirms missing question 5: "What have you drawn pictures of so far?" (Mona\'s interview).',
  },

  /* ================= PART 7 · L — LISTENING (10 QUESTIONS) ================= */
  {
    p: 7, u: 5, l: '5B', s: 'Listening: detail', d: 'easy', t: 'mcq', lx: 'L1',
    q: 'How well does Joe understand Martha\'s upcoming scientific research into Adelie penguins?',
    o: [
      'Not very well — he makes light-hearted jokes and assumes penguins are cuddly pets.',
      'He is a specialist biologist who co-authored the research expedition proposal.',
      'He has conducted research in Antarctica for over twenty years.',
      'He completely refuses to discuss the Antarctic station or Martha\'s travel.',
    ],
    a: 0,
    e: 'Unit 5B Slide 16, 18 confirms: "1 Not very well – he jokes and misunderstands; 2 Light-hearted – he makes jokes throughout."',
  },
  {
    p: 7, u: 5, l: '5B', s: 'Listening: detail', d: 'medium', t: 'mcq', lx: 'L1',
    q: 'What does Martha explain about the actual temperament and personality of wild Adelie penguins?',
    o: [
      'They are full of attitude and can be quite aggressive if people approach too close.',
      'They are timid and flee in terror at the slightest sound of footsteps.',
      'They are completely docile and readily perform tricks for scientists.',
      'They stay asleep for twenty hours every day without moving.',
    ],
    a: 0,
    e: 'Unit 5B Slide 16, 18 confirms: "3 They\'re full of attitude; can be quite aggressive if you get too close."',
  },
  {
    p: 7, u: 5, l: '5B', s: 'Listening: detail', d: 'hard', t: 'mcq', lx: 'L1',
    q: 'Why is studying the Adelie penguin population scientifically important for global research?',
    o: [
      'Subtle changes in their breeding patterns and behavior directly signal broader climate and ecosystem changes.',
      'To breed penguin chicks in domestic captivity for European circuses.',
      'To discover if penguins can be trained to rescue lost divers in the Southern Ocean.',
      'To replace radar equipment with biological animal sensors.',
    ],
    a: 0,
    e: 'Unit 5B Slide 16, 18 confirms: "4 Changes in their behaviour signal climate changes in Antarctica and globally."',
  },
  {
    p: 7, u: 5, l: '5B', s: 'Listening: chronology', d: 'medium', t: 'mcq', lx: 'L1',
    q: 'According to Martha, what event happens FIRST in the annual breeding cycle of the penguins?',
    o: [
      'Penguins get into pairs.',
      'Martha arrives at the Rothera station.',
      'The eggs are laid by the females.',
      'Chicks are fitted with metal identification bands.',
    ],
    a: 0,
    e: 'Unit 5B Slide 17, 18 order of events: "1 Penguins get into pairs; 2 Martha arrives; 3 Eggs laid; 4 Chicks born; 5 Tags attached."',
  },
  {
    p: 7, u: 5, l: '5B', s: 'Listening: detail', d: 'medium', t: 'mcq', lx: 'L1',
    q: 'By what calendar date are the Adelie penguin eggs typically laid?',
    o: ['By mid-November.', 'By mid-August.', 'By the end of February.', 'By mid-June.'],
    a: 0,
    e: 'Unit 5B Slide 18 confirms: "Eggs are laid (by mid-November)."',
  },
  {
    p: 7, u: 5, l: '5B', s: 'Listening: detail', d: 'medium', t: 'mcq', lx: 'L1',
    q: 'When are the penguin chicks born in Antarctica?',
    o: ['At the end of December.', 'In late October.', 'In the middle of the winter darkness in June.', 'At the beginning of September.'],
    a: 0,
    e: 'Unit 5B Slide 18 confirms: "Penguin chicks are born (end of December)."',
  },
  {
    p: 7, u: 5, l: '5B', s: 'Listening: detail', d: 'hard', t: 'mcq', lx: 'L1',
    q: 'When are metal identification tags placed on the young penguin chicks?',
    o: [
      'Three weeks after birth.',
      'Within twelve hours of hatching from the egg.',
      'When they reach full adult maturity two years later.',
      'Only if they get separated from the colony.',
    ],
    a: 0,
    e: 'Unit 5B Slide 18 confirms: "Metal tags put on chicks (3 weeks after birth)."',
  },
  {
    p: 7, u: 1, l: '1B', s: 'Listening: main idea', d: 'easy', t: 'mcq', lx: 'L1',
    q: 'In Alison\'s seminar podcast on the 30-day challenge, what core conclusion does she highlight?',
    o: [
      'If you try something new for 30 days, you are significantly more likely to keep doing it afterwards.',
      'The adult human brain is completely unable to develop new habits after age twenty-five.',
      'Personal challenges are only beneficial if they require at least six hours of rigorous exercise daily.',
      'Quitting habits without medical supervision is impossible.',
    ],
    a: 0,
    e: 'Unit 1B Slide 6, 7 confirms: "Correct Answer: 3. If you try something new for 30 days, you\'re more likely to keep doing it afterwards."',
  },
  {
    p: 7, u: 1, l: '1B', s: 'Listening: detail', d: 'medium', t: 'mcq', lx: 'L1',
    q: 'According to Alison, how long does the brain need to adapt to a new habit?',
    o: ['Around 30 days.', 'Exactly six months.', 'Only 48 hours.', 'Three full years of training.'],
    a: 0,
    e: 'Unit 1B Slide 8 seminar notes: "It takes the brain 30 days to adapt to a new habit."',
  },
  {
    p: 7, u: 1, l: '1B', s: 'Listening: detail', d: 'medium', t: 'mcq', lx: 'L1',
    q: 'Why does Alison describe 30 days as an ideal period for lifestyle experimentation?',
    o: [
      '30 days isn\'t a very long time, which makes it fun and achievable to try something new without overwhelming pressure.',
      'Because all international calendars divide work quarters into 30 days.',
      'Because memory consolidation completely stops on day 31.',
      'Because fitness clubs only sell 30-day passes.',
    ],
    a: 0,
    e: 'Unit 1B Slide 8 seminar notes: "30 days isn\'t a very long time, so it\'s fun to do something new."',
  },

  /* ================= PART 8 · ESSAY WRITING (1 ESSAY) ================= */
  {
    p: 8, u: 1, l: '1A/3A', s: 'Essay Writing', d: 'medium', t: 'essay',
    q: '',
    min: 120,
    max: 180,
    e: 'Marked on Task achievement (3 pts), Organisation & Coherence (2 pts), Lexical resource / vocabulary (3 pts), and Grammar range & accuracy (2 pts).',
  },
];

// Helper seeded pseudorandom shuffle
function seeded(s: number) {
  return function () {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
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
