/**
 * Static GK flashcards (our own content) and a few sample current-affairs items
 * to demonstrate the digest + editorial workflow.
 */
export const STATIC_FLASHCARDS = [
  {
    deck: 'Pakistan',
    frontEn: 'Capital of Pakistan?',
    frontUr: 'پاکستان کا دارالحکومت؟',
    backEn: 'Islamabad',
    backUr: 'اسلام آباد',
    topic: 'geography',
  },
  {
    deck: 'Pakistan',
    frontEn: 'When did Pakistan gain independence?',
    frontUr: 'پاکستان کب آزاد ہوا؟',
    backEn: '14 August 1947',
    backUr: '14 اگست 1947',
    topic: 'history',
  },
  {
    deck: 'Armed Forces',
    frontEn: 'Highest gallantry award of Pakistan?',
    frontUr: 'پاکستان کا سب سے بڑا بہادری کا اعزاز؟',
    backEn: 'Nishan-e-Haider',
    backUr: 'نشانِ حیدر',
    topic: 'defence',
  },
  {
    deck: 'Armed Forces',
    frontEn: 'Rank equivalent to Army General in the Navy?',
    frontUr: 'بحریہ میں جنرل کے مساوی عہدہ؟',
    backEn: 'Admiral',
    backUr: 'ایڈمرل',
    topic: 'ranks',
  },
  {
    deck: 'Constitution',
    frontEn: 'Year of the current Constitution of Pakistan?',
    frontUr: 'پاکستان کے موجودہ آئین کا سال؟',
    backEn: '1973',
    backUr: '1973',
    topic: 'constitution',
  },
  {
    deck: 'World',
    frontEn: 'Headquarters of the United Nations?',
    frontUr: 'اقوامِ متحدہ کا صدر دفتر؟',
    backEn: 'New York, USA',
    backUr: 'نیویارک، امریکہ',
    topic: 'world-orgs',
  },
  {
    deck: 'World',
    frontEn: 'Currency of Japan?',
    frontUr: 'جاپان کی کرنسی؟',
    backEn: 'Yen',
    backUr: 'ین',
    topic: 'currencies',
  },
  {
    deck: 'Islamiat',
    frontEn: 'How many pillars of Islam are there?',
    frontUr: 'اسلام کے کتنے ارکان ہیں؟',
    backEn: 'Five',
    backUr: 'پانچ',
    topic: 'islamiat',
  },
]

export const SAMPLE_ARTICLES = [
  {
    headline: 'Pakistan and neighbour hold talks on regional trade corridor',
    summaryEn:
      'Officials met to discuss a regional trade corridor aimed at boosting commerce and connectivity.',
    summaryUr: 'حکام نے تجارت اور روابط بڑھانے کے لیے علاقائی تجارتی راہداری پر بات چیت کی۔',
    category: 'economy',
    issbAngle: 'Understand how trade corridors affect Pakistan’s economy and regional standing.',
    oneLiner: 'Regional trade corridor talks — know the economic significance.',
    sourceName: 'Sample Wire',
    sourceUrl: 'https://example.com/trade-corridor',
    status: 'published' as const,
  },
  {
    headline: 'National science team wins international robotics prize',
    summaryEn:
      'A student team won an international robotics competition, highlighting STEM progress.',
    summaryUr: 'ایک طلبہ ٹیم نے بین الاقوامی روبوٹکس مقابلہ جیت لیا، جو سائنسی ترقی کی عکاسی ہے۔',
    category: 'scitech',
    issbAngle: 'Be ready to discuss youth achievement and the importance of STEM.',
    oneLiner: 'Robotics win — a talking point on youth & STEM.',
    sourceName: 'Sample Wire',
    sourceUrl: 'https://example.com/robotics',
    status: 'published' as const,
  },
]
