/**
 * Islamic studies topics.
 *
 * Kept to the factual and widely agreed: the pillars, the sequence of the
 * Prophet's life, the major battles, and the Rightly Guided Caliphs. Points of
 * theological difference between schools are deliberately left out — a study
 * aid is not the place for them, and a selection board does not test them.
 */
import type { CuratedTopic } from '../../gk/topics'

export const ISLAMIC_TOPICS: CuratedTopic[] = [
  {
    slug: 'pillars-and-articles-of-faith',
    kind: 'gk',
    section: 'islamic',
    titleEn: 'Pillars of Islam and articles of faith',
    titleUr: 'ارکانِ اسلام اور ایمان',
    summaryEn:
      'The five pillars of practice and the six articles of belief — the framework every other Islamic studies question rests on.',
    issbAngle:
      'These are checks that you know your own faith, not invitations to debate. Answer plainly and completely. If a follow-up goes into matters of jurisprudence, it is entirely acceptable to say that is a question for a scholar.',
    facts: [
      { label: 'Number of pillars', value: 'Five' },
      { label: 'First pillar', value: 'Shahadah — the declaration of faith' },
      { label: 'Second pillar', value: 'Salah — the five daily prayers' },
      { label: 'Third pillar', value: 'Zakat — the obligatory alms' },
      { label: 'Fourth pillar', value: 'Sawm — fasting in Ramadan' },
      { label: 'Fifth pillar', value: 'Hajj — pilgrimage to Makkah, once if able' },
      { label: 'Articles of faith', value: 'Six' },
      { label: 'Zakat rate on savings', value: 'One fortieth, that is 2.5 per cent' },
      { label: 'Daily prayers', value: 'Fajr, Zuhr, Asr, Maghrib, Isha' },
    ],
    points: [
      {
        heading: 'The six articles of faith',
        bullets: [
          'Belief in the oneness of Allah.',
          'Belief in His angels.',
          'Belief in His revealed books.',
          'Belief in His prophets.',
          'Belief in the Day of Judgement.',
          'Belief in divine decree.',
        ],
      },
      {
        heading: 'Points often asked',
        bullets: [
          'Zakat is due on wealth held for a lunar year above the nisab threshold, at one fortieth.',
          'Fasting in Ramadan is obligatory on the adult and able; the exempt make it up or pay compensation.',
          'Hajj is obligatory once in a lifetime on those who can afford and are physically able to perform it.',
        ],
      },
    ],
  },

  {
    slug: 'life-of-the-prophet',
    kind: 'gk',
    section: 'islamic',
    titleEn: 'Life of the Prophet Muhammad ﷺ',
    titleUr: 'سیرتِ نبوی ﷺ',
    summaryEn:
      "The sequence of the Prophet's life from his birth in Makkah to his passing in Madinah, and the events within it that every candidate is expected to be able to place in order.",
    issbAngle:
      'The useful preparation is one episode you can speak about as an example of leadership — the Treaty of Hudaybiyyah for patience under a bad-looking bargain, or the conquest of Makkah for restraint in victory.',
    facts: [
      { label: 'Born', value: 'About 570 CE in Makkah, the Year of the Elephant' },
      { label: 'Father', value: 'Abdullah, who died before his birth' },
      { label: 'Mother', value: 'Aminah' },
      { label: 'Grandfather', value: 'Abdul Muttalib' },
      { label: 'Uncle and guardian', value: 'Abu Talib' },
      { label: 'First revelation', value: 'About 610 CE, in the cave of Hira' },
      {
        label: 'Title before prophethood',
        value: 'Al-Sadiq al-Amin — the truthful, the trustworthy',
      },
      { label: 'Hijrah to Madinah', value: '622 CE — the start of the Islamic calendar' },
      { label: 'Companion on the Hijrah', value: 'Hazrat Abu Bakr (RA)' },
      { label: 'Conquest of Makkah', value: '8 AH, about 630 CE' },
      { label: 'Farewell pilgrimage', value: '10 AH' },
      { label: 'Passed away', value: '632 CE in Madinah' },
    ],
    points: [
      {
        heading: 'Makkah',
        bullets: [
          'Orphaned early and raised by his grandfather and then his uncle; worked as a trader and was known for honesty before any claim to prophethood.',
          'The first revelation came in the cave of Hira; the early years of preaching in Makkah brought boycott and persecution of the small Muslim community.',
          'Some companions migrated to Abyssinia for protection before the migration to Madinah.',
        ],
      },
      {
        heading: 'Madinah',
        bullets: [
          'The Hijrah of 622 CE marks the start of the Islamic calendar and the founding of a community with its own order.',
          "The Charter of Madinah set out the rights and obligations of the city's groups, including its Jewish tribes — often cited as an early written constitution.",
          "The Prophet's mosque was built at Madinah; the first mosque built was at Quba.",
        ],
      },
      {
        heading: 'Later years',
        bullets: [
          'The Treaty of Hudaybiyyah in 6 AH looked like a concession and opened the way to the peaceful conquest of Makkah two years later.',
          'On entering Makkah he granted a general amnesty, which is the episode most often cited as an example of magnanimity in victory.',
          'The farewell sermon set out obligations on human equality, the sanctity of life and property, and the rights of women.',
        ],
      },
    ],
    timeline: [
      { date: 'about 570 CE', event: 'Born in Makkah.' },
      { date: 'about 610 CE', event: 'The first revelation in the cave of Hira.' },
      { date: '622 CE', event: 'The Hijrah to Madinah; the Islamic calendar begins.' },
      { date: '624 CE', event: 'The Battle of Badr.' },
      { date: '628 CE', event: 'The Treaty of Hudaybiyyah.' },
      { date: '630 CE', event: 'The conquest of Makkah.' },
      { date: '632 CE', event: 'The farewell pilgrimage and his passing at Madinah.' },
    ],
  },

  {
    slug: 'battles-of-early-islam',
    kind: 'gk',
    section: 'islamic',
    titleEn: 'The battles of early Islam',
    titleUr: 'غزوات',
    summaryEn:
      "The engagements fought in the Prophet's lifetime, in order, with what each is remembered for. A ghazwa is one at which the Prophet ﷺ was present; a sariyyah is an expedition he sent without being present.",
    issbAngle:
      "These come up as history questions, but the reason a board asks is usually leadership. Badr for resolve against odds, Uhud for the cost of leaving a position, Khandaq for accepting an outsider's idea — each has a lesson you can state in one sentence.",
    facts: [
      { label: 'Badr', value: '2 AH, about 624 CE' },
      { label: 'Uhud', value: '3 AH, about 625 CE' },
      { label: 'Khandaq (the Trench)', value: '5 AH, about 627 CE' },
      { label: 'Treaty of Hudaybiyyah', value: '6 AH, about 628 CE' },
      { label: 'Khaybar', value: '7 AH' },
      { label: 'Mutah', value: '8 AH' },
      { label: 'Conquest of Makkah', value: '8 AH' },
      { label: 'Hunayn', value: '8 AH' },
      { label: 'Tabuk', value: '9 AH' },
      { label: 'Trench suggested by', value: 'Hazrat Salman Farsi (RA)' },
    ],
    points: [
      {
        heading: 'Badr and Uhud',
        bullets: [
          "Badr was the first major engagement, won by a much smaller Muslim force, and is remembered as the decisive early test of the community's survival.",
          'At Uhud an initial advantage was lost when archers left the hill they had been ordered to hold — the standard example of the cost of abandoning a position.',
        ],
      },
      {
        heading: 'Khandaq and after',
        bullets: [
          'At Khandaq the defence of Madinah rested on a trench dug on the suggestion of Hazrat Salman Farsi (RA) — an idea adopted from outside the Arab military tradition.',
          'The siege failed and the initiative passed permanently to the Muslims of Madinah.',
          'Hudaybiyyah, Khaybar, the conquest of Makkah, Hunayn and Tabuk follow in that order.',
        ],
      },
    ],
  },

  {
    slug: 'khulafa-e-rashideen',
    kind: 'gk',
    section: 'islamic',
    titleEn: 'The Rightly Guided Caliphs',
    titleUr: 'خلفائے راشدین',
    summaryEn:
      'The four caliphs who led the Muslim community after the Prophet ﷺ, in order, with what each period is remembered for.',
    issbAngle:
      'A board may ask which of them you find most instructive and why. Any of the four is a good answer if you can name a specific decision and say what it shows — administration under Hazrat Umar (RA), for instance, or the compilation of the Quran under Hazrat Uthman (RA).',
    facts: [
      { label: 'First caliph', value: 'Hazrat Abu Bakr Siddiq (RA), 632–634 CE' },
      { label: 'Second caliph', value: 'Hazrat Umar Farooq (RA), 634–644 CE' },
      { label: 'Third caliph', value: 'Hazrat Uthman Ghani (RA), 644–656 CE' },
      { label: 'Fourth caliph', value: 'Hazrat Ali (RA), 656–661 CE' },
      { label: 'Islamic calendar introduced by', value: 'Hazrat Umar (RA)' },
      { label: 'Quran compiled into one copy under', value: 'Hazrat Uthman (RA)' },
      { label: 'Capital moved to Kufa by', value: 'Hazrat Ali (RA)' },
    ],
    points: [
      {
        heading: 'What each period is known for',
        bullets: [
          'Hazrat Abu Bakr (RA) held the community together through the apostasy wars and began the collection of the Quran.',
          'Hazrat Umar (RA) built the administrative structure of the state — provinces, a treasury, a judiciary and the Hijri calendar — during a period of rapid expansion.',
          'Hazrat Uthman (RA) had the Quran compiled into a single authoritative copy and distributed, which is why one text exists today.',
          'Hazrat Ali (RA) led during a period of internal conflict and is remembered for his knowledge, his judgements and his letters on governance.',
        ],
      },
    ],
    timeline: [
      { date: '632 CE', event: 'Hazrat Abu Bakr (RA) becomes the first caliph.' },
      { date: '634 CE', event: 'Hazrat Umar (RA) succeeds him.' },
      { date: '644 CE', event: 'Hazrat Uthman (RA) succeeds him.' },
      { date: '656 CE', event: 'Hazrat Ali (RA) succeeds him.' },
    ],
  },

  {
    slug: 'the-holy-quran',
    kind: 'gk',
    section: 'islamic',
    titleEn: 'The Holy Quran — basic facts',
    titleUr: 'قرآنِ کریم — بنیادی معلومات',
    summaryEn:
      'The structure of the Quran and the facts about its revelation and compilation that are most often asked.',
    issbAngle:
      'Straightforward recall. Know the structure and the compilation history; do not be drawn into interpretation you are not qualified to offer.',
    facts: [
      { label: 'Number of surahs', value: '114' },
      { label: 'Number of paras (juz)', value: '30' },
      { label: 'First revelation', value: 'The opening verses of Surah Al-Alaq' },
      { label: 'Longest surah', value: 'Al-Baqarah' },
      { label: 'Shortest surah', value: 'Al-Kawthar' },
      { label: 'Opening surah', value: 'Al-Fatiha' },
      { label: 'Period of revelation', value: 'About 23 years' },
      { label: 'Revealed in', value: 'Makkah and Madinah' },
      { label: 'Compiled into one copy under', value: 'Hazrat Uthman (RA)' },
      { label: 'Night of revelation', value: 'Laylat al-Qadr, in Ramadan' },
    ],
    points: [
      {
        heading: 'Structure',
        bullets: [
          'Surahs are classified as Makki or Madani according to where they were revealed, which affects their themes.',
          'The division into thirty paras is for recitation, particularly across the nights of Ramadan, and is not part of the revelation itself.',
          'Every surah but one opens with Bismillah.',
        ],
      },
    ],
  },
]
