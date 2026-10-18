/**
 * The board itself, stage by stage — the material academies spend most of
 * their time on.
 *
 * Written as preparation rather than as tricks. Every ISSB technique that
 * amounts to "say this and you will be recommended" fails, because the whole
 * design of the programme is to compare what you say across four independent
 * stages. The guidance here is about understanding what each stage is
 * measuring so you can show what you actually have.
 */
import type { CuratedTopic } from '../../gk/topics'

export const ISSB_TOPICS: CuratedTopic[] = [
  {
    slug: 'screening-and-intelligence-tests',
    kind: 'gk',
    section: 'defence',
    titleEn: 'Screening and intelligence tests',
    titleUr: 'اسکریننگ اور ذہانت کے ٹیسٹ',
    summaryEn:
      'The first day decides who stays. Verbal and non-verbal intelligence tests, taken under heavy time pressure, followed by a short picture story and word test in most centres.',
    issbAngle:
      'This is the one stage that rewards pure practice. Accuracy under time is a trainable skill, and candidates who are sent home on day one are almost always those who met the format for the first time that morning.',
    facts: [
      { label: 'When', value: 'The first day' },
      { label: 'Verbal tests', value: 'Analogies, series, coding, relations, odd one out' },
      {
        label: 'Non-verbal tests',
        value: 'Figure matrices, series, mirror and water images, embedded figures',
      },
      { label: 'Time pressure', value: 'High — most candidates do not finish' },
      { label: 'Result', value: 'Announced the same day' },
      { label: 'Outcome for those not cleared', value: 'Returned home immediately' },
    ],
    points: [
      {
        heading: 'What is tested',
        bullets: [
          'Verbal reasoning: analogies, number and letter series, coding and decoding, blood relations, directions, odd one out.',
          'Non-verbal reasoning: matrices, figure series, mirror and water images, embedded and hidden figures, paper folding.',
          'The questions are not difficult individually. The difficulty is the number of them against the clock.',
        ],
      },
      {
        heading: 'How to prepare',
        bullets: [
          'Practise with a timer from the start. Untimed practice builds the wrong habit and hides the real problem.',
          'Learn to skip. A question you cannot see within fifteen seconds is costing you two you could have answered.',
          'Work on your weakest single category rather than repeating the one you enjoy.',
          'Sleep before the day. Speed collapses faster than knowledge does.',
        ],
      },
    ],
  },

  {
    slug: 'thematic-apperception-test',
    kind: 'gk',
    section: 'defence',
    titleEn: 'Thematic Apperception Test (picture story)',
    titleUr: 'تصویری کہانی کا ٹیسٹ',
    summaryEn:
      'A hazy picture is shown for a few seconds and you write a story about it: what led to the scene, what is happening, and what follows. What you write about the central character is taken as a sample of how you think.',
    issbAngle:
      'The hero of your story should do something practical with ordinary resources. Rescues by coincidence, sudden wealth and improbable heroics all read as fantasy, and fantasy is the single commonest reason stories go against a candidate.',
    facts: [
      { label: 'Also called', value: 'Picture story writing' },
      { label: 'Pictures shown', value: 'Typically around a dozen, including one blank' },
      { label: 'Viewing time', value: 'A few seconds each' },
      { label: 'Writing time', value: 'About four minutes per story' },
      { label: 'Story structure', value: 'What led up to it, what is happening, what follows' },
      { label: 'Blank slide', value: 'Write any story of your own' },
    ],
    points: [
      {
        heading: 'How to write one',
        bullets: [
          'Fix the character first: age, sex, and what they do. Then give them one clear problem.',
          'Have them act — plan, gather help, use what is realistically at hand, and finish the job.',
          'End with the outcome achieved, stated plainly. No moral, no speech.',
          'Write in simple past tense and keep it to a short, complete story rather than an unfinished long one.',
        ],
      },
      {
        heading: 'What goes wrong',
        bullets: [
          'A hero who waits for someone else to solve the problem.',
          'Solutions that depend on coincidence, wealth or authority the character would not have.',
          'Violence or revenge as the resolution.',
          'Describing the picture instead of telling a story — the picture is a prompt, not the subject.',
        ],
      },
    ],
  },

  {
    slug: 'word-association-test',
    kind: 'gk',
    section: 'defence',
    titleEn: 'Word Association Test',
    titleUr: 'الفاظ کا ٹیسٹ',
    summaryEn:
      'A long series of words is shown one at a time for a few seconds each, and you write the first sentence each brings to mind. The point is speed: there is no time to compose an answer, which is why it shows habits of thought.',
    issbAngle:
      'Do not prepare sentences in advance. Rehearsed lines are visible because they do not match the pace or the person in the other three tests, and a board that spots them discounts everything else you wrote.',
    facts: [
      { label: 'Words shown', value: 'Usually around sixty to eighty' },
      { label: 'Time per word', value: 'About fifteen seconds' },
      { label: 'What to write', value: 'One short sentence, not a definition' },
      { label: 'Blank answers', value: 'Count against you; write something' },
    ],
    points: [
      {
        heading: 'How to approach it',
        bullets: [
          'Write a sentence using the word, in the present tense, about something real and ordinary.',
          'Keep it short — six to ten words is enough, and long sentences cost you the next word.',
          'Where a word is negative, respond with what is done about it rather than by denying it. "Failure teaches what to change" is a response; "I never fail" is not.',
          'Leave nothing blank. A weak sentence is better than a gap.',
        ],
      },
      {
        heading: 'Practising',
        bullets: [
          'Practise with a timer and a long list, in one sitting, so you build stamina as well as speed.',
          'Read back your own sheet afterwards and ask whether a stranger would recognise you from it.',
        ],
      },
    ],
  },

  {
    slug: 'situation-reaction-test',
    kind: 'gk',
    section: 'defence',
    titleEn: 'Situation Reaction Test',
    titleUr: 'حالات پر ردِعمل کا ٹیسٹ',
    summaryEn:
      'A booklet of everyday and emergency situations, each needing a one- or two-line answer saying what you would do. The volume is the test: sixty situations in about half an hour leaves no room to construct an ideal self.',
    issbAngle:
      'Answer as the person you are, with the resources you actually have. The board is comparing these answers against your interview and your stories, and inconsistency between them is what gets noticed.',
    facts: [
      { label: 'Situations', value: 'Usually around sixty' },
      { label: 'Time', value: 'About thirty minutes in total' },
      { label: 'Answer length', value: 'One or two lines' },
      { label: 'Range', value: 'From minor social awkwardness to accidents and emergencies' },
    ],
    points: [
      {
        heading: 'What a good answer looks like',
        bullets: [
          'It is practical and immediate — what you would actually do first, then next.',
          'It uses help that is realistically available: a neighbour, a teacher, the police, the hospital.',
          'It accepts responsibility rather than avoiding the situation or passing it to someone else.',
          'It is decided. Answers that say you would think about it read as indecision.',
        ],
      },
      {
        heading: 'Common traps',
        bullets: [
          'Heroics beyond your capacity — diving into a flooded river you cannot swim in is not courage on paper.',
          'Breaking the law or taking revenge, even where the provocation is severe.',
          'Leaving the situation entirely, which answers nothing.',
        ],
      },
    ],
  },

  {
    slug: 'self-description-test',
    kind: 'gk',
    section: 'defence',
    titleEn: 'Self description and sentence completion',
    titleUr: 'خود نوشت اور جملہ مکمل کریں',
    summaryEn:
      'You write how your parents, your teachers, your friends and you yourself would describe you, and what you want to become. It is the one psychological test where you speak in your own voice.',
    issbAngle:
      'Include a real shortcoming and what you are doing about it. A description with no weaknesses reads as either dishonest or unaware, and both are worse than the weakness would have been.',
    facts: [
      {
        label: 'Usual parts',
        value: 'Parents, teachers, friends, yourself, and what you want to become',
      },
      { label: 'Time', value: 'About fifteen minutes' },
      { label: 'Length', value: 'A short paragraph for each' },
    ],
    points: [
      {
        heading: 'How to write it',
        bullets: [
          'Write what each group would actually say, including the criticism they actually make.',
          'Keep the four paragraphs distinct — if all four say the same thing, none of them is real.',
          'Name one weakness plainly and say what you have changed because of it.',
          'End with what you want to become and why, in terms of what you would do rather than what you would be called.',
        ],
      },
    ],
  },

  {
    slug: 'gto-tasks',
    kind: 'gk',
    section: 'defence',
    titleEn: 'The GTO tasks',
    titleUr: 'جی ٹی او ٹاسکس',
    summaryEn:
      'The outdoor and group programme run by the Group Testing Officer over two or three days — discussion, planning, obstacle tasks, a command task and a lecturette. Everything is observed in a group, which is the point.',
    issbAngle:
      'The commonest mistake is treating the GTO ground as a competition against the other candidates. It is not. A group that finishes with your help reflects better on you than a group that fails while you dominate it.',
    facts: [
      { label: 'Run by', value: 'The Group Testing Officer' },
      { label: 'Group discussion', value: 'Two topics, no chairman, open discussion' },
      {
        label: 'Group planning',
        value: 'A map problem solved as a group, then one plan presented',
      },
      {
        label: 'Progressive group task',
        value: 'Obstacles crossed as a group with limited helping material',
      },
      { label: 'Half group task', value: 'The same, with the group split in two' },
      { label: 'Command task', value: 'You command two or three others over an obstacle' },
      {
        label: 'Individual obstacles',
        value: 'A set of obstacles attempted alone against the clock',
      },
      { label: 'Group obstacle race', value: 'Also called the snake race' },
      { label: 'Final group task', value: 'A last obstacle attempted by the whole group' },
      { label: 'Lecturette', value: 'A short individual talk on a chosen topic' },
    ],
    points: [
      {
        heading: 'Discussion and planning',
        bullets: [
          'In group discussion there is no chairman. Enter early, make a point with a reason, and let others in — a candidate who never stops talking is marked down, and one who never speaks cannot be assessed at all.',
          'In group planning, read the map problem carefully, note the resources and the time, and produce one plan with priorities. Accepting a better plan than your own is a positive, not a defeat.',
        ],
      },
      {
        heading: 'The obstacle tasks',
        bullets: [
          'Progressive and half group tasks are about getting the whole group and the load across within the rules — the helping material, the out-of-bounds areas and the load all matter.',
          'The command task is the one where you are formally in charge: brief your two helpers clearly, give them jobs, and adjust when the first attempt fails.',
          'Individual obstacles reward attempting many rather than perfecting one; incomplete attempts still count for the ones you clear.',
        ],
      },
      {
        heading: 'How to be useful',
        bullets: [
          'Physical courage matters, but so does helping a weaker member across — that is observed and it counts.',
          'Obeying the rules when nobody could see you break them is one of the things the ground is designed to reveal.',
          'Keep your temper and your humour. Groups fail on these tasks routinely; how you are when it goes wrong is the assessment.',
        ],
      },
    ],
  },

  {
    slug: 'lecturette',
    kind: 'gk',
    section: 'defence',
    titleEn: 'The lecturette',
    titleUr: 'لیکچرٹ',
    summaryEn:
      'A short individual talk, usually three minutes, on a topic you pick from a card after a few minutes of preparation. It tests whether you can organise a thought quickly and deliver it to a group.',
    issbAngle:
      'Structure beats content. Three clear points delivered calmly beat a stream of facts, and the candidates who do badly are almost always those who tried to say everything they knew.',
    facts: [
      { label: 'Preparation time', value: 'About three minutes' },
      { label: 'Speaking time', value: 'About three minutes' },
      { label: 'Choice', value: 'Usually one card with several topics; pick one' },
      { label: 'Audience', value: 'The rest of your group' },
      { label: 'Notes', value: 'Usually not permitted while speaking' },
    ],
    points: [
      {
        heading: 'A structure that always works',
        bullets: [
          'Open with what the topic is and why it matters, in two sentences.',
          'Make three points, each with one example or fact.',
          'Close by returning to the opening and stating your own view in one line.',
          'Stop when you have finished rather than filling the remaining time.',
        ],
      },
      {
        heading: 'Topics that come up',
        bullets: [
          'National: the economy, education, water, terrorism, CPEC, provincial harmony, youth and unemployment.',
          'International: the United Nations, climate change, Kashmir, the role of a regional power, globalisation.',
          'General: discipline, leadership, the role of media, technology and society, sports in national life.',
          'Prepare four or five of these properly rather than skimming twenty — most cards contain at least one you will recognise.',
        ],
      },
      {
        heading: 'Delivery',
        bullets: [
          'Stand still, look at the group rather than the officer, and slow down — nervousness shows as speed.',
          'Practise aloud against a clock. Rehearsing in your head hides the fact that three minutes is short.',
        ],
      },
    ],
  },

  {
    slug: 'the-interview-and-piq',
    kind: 'gk',
    section: 'defence',
    titleEn: 'The interview and the PIQ',
    titleUr: 'انٹرویو اور پی آئی کیو',
    summaryEn:
      'The Personal Information Questionnaire records your background, education, family, activities and preferences, and the interview is built from it. Everything you write there can be asked about, so everything must be true and defensible.',
    issbAngle:
      'The single best preparation is to fill the PIQ honestly and then spend an evening asking yourself "and what would I say if they asked about that?" for every line of it.',
    facts: [
      { label: 'PIQ stands for', value: 'Personal Information Questionnaire' },
      { label: 'Filled in', value: 'Before the interview' },
      { label: 'Covers', value: 'Family, education, activities, health, preferences' },
      { label: 'Interview length', value: 'Commonly thirty minutes to an hour' },
      { label: 'Conducted by', value: 'The Deputy President or an interviewing officer' },
    ],
    points: [
      {
        heading: 'Questions that nearly always come',
        bullets: [
          'Tell me about yourself, your family and what your parents do.',
          'Why do you want to join, and why this service rather than the other two?',
          'What are your strengths, and what is your weakness?',
          'What do you do with your day, and what have you read recently?',
          'What will you do if you are not recommended?',
          'Questions on your town, your school or college, and your subjects.',
          'One or two current affairs questions, usually about something in the last month.',
        ],
      },
      {
        heading: 'How to answer',
        bullets: [
          'Give the answer, then one concrete example. "I am responsible" is worth nothing; the thing you actually ran or organised is worth everything.',
          'If you do not know something, say so and move on. Guessing is penalised far more heavily than not knowing.',
          'Never criticise your family, your institution or any country. What you say about others is read as a statement about you.',
          'Expect questions designed to unsettle you. The content of the answer matters less than staying steady while you give it.',
        ],
      },
    ],
  },

  {
    slug: 'conference-and-results',
    kind: 'gk',
    section: 'defence',
    titleEn: 'The conference and the result',
    titleUr: 'کانفرنس اور نتیجہ',
    summaryEn:
      'The whole board meets on the final day, compares what each assessor observed and decides. Candidates appear briefly before it. The result is a recommendation or otherwise, and it is not a verdict on your worth.',
    issbAngle:
      'If you are not recommended, the honest answer to "what will you do now" is that you will find out what was weak, work on it and appear again if eligible. Boards think well of candidates who have returned; they think poorly of bitterness.',
    facts: [
      { label: 'When', value: 'The final day' },
      {
        label: 'Who attends',
        value: 'The full board — president, deputy presidents, psychologist, GTO',
      },
      { label: 'Your appearance', value: 'Usually brief, a few questions' },
      { label: 'Decision basis', value: 'The consistency of all stages taken together' },
      { label: 'Outcome', value: 'Recommended or not recommended' },
    ],
    points: [
      {
        heading: 'What the conference does',
        bullets: [
          'Each assessor brings an independent assessment, made without seeing the others.',
          'Where those assessments agree, the decision is straightforward; where they conflict, the conference questions the candidate to resolve it.',
          'This is why a manufactured personality fails — it is very difficult to keep consistent across four stages and several days.',
        ],
      },
      {
        heading: 'If you are not recommended',
        bullets: [
          'It is a judgement about fit against a set of qualities on those days, not a measure of your ability or your character.',
          'Many officers were recommended on a second or third attempt.',
          'Work out which factor was weak — usually expression, confidence or planning — and address it concretely before appearing again.',
        ],
      },
    ],
  },
]
