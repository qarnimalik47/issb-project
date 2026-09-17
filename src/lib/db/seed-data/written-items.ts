/**
 * Sample ORIGINAL written-test items to demonstrate the capture players.
 * Not ISSB materials. Real items are authored/imported by admins.
 */
export type SeedWrittenItem = {
  testTypeCode: string
  stemEn: string
  stemUr: string
  topic: string
}

const wat = [
  'Leader',
  'Fear',
  'Duty',
  'Team',
  'Failure',
  'Honour',
  'Risk',
  'Family',
  'Nation',
  'Discipline',
]
const sct = [
  'When I face a difficult problem, I…',
  'My greatest strength is…',
  'People who work with me say I…',
  'When things go wrong, I…',
  'My ambition in life is…',
]
const srt = [
  'He was leading his team on a hike when a member twisted his ankle far from help. He…',
  'She noticed a small fire starting near a crowded market stall. She…',
  'During an exam he saw a friend trying to cheat from him. He…',
]

export const WRITTEN_ITEMS: SeedWrittenItem[] = [
  ...wat.map((w) => ({ testTypeCode: 'wat', stemEn: w, stemUr: w, topic: 'wat' })),
  ...sct.map((s) => ({ testTypeCode: 'sct', stemEn: s, stemUr: s, topic: 'sct' })),
  ...srt.map((s) => ({ testTypeCode: 'srt', stemEn: s, stemUr: s, topic: 'srt' })),
  {
    testTypeCode: 'essay',
    stemEn: 'The role of discipline in national development.',
    stemUr: 'قومی ترقی میں نظم و ضبط کا کردار۔',
    topic: 'essay',
  },
  {
    testTypeCode: 'self_description',
    stemEn: 'Describe yourself as your best friend would, and as your opponent would.',
    stemUr: 'اپنے آپ کو ایسے بیان کریں جیسے آپ کا بہترین دوست اور آپ کا مخالف بیان کرے۔',
    topic: 'self',
  },
  {
    testTypeCode: 'pointer_story',
    stemEn: 'Complete a story that begins: "The road ahead was blocked, so the young officer…"',
    stemUr: 'اس جملے سے کہانی مکمل کریں: "آگے کا راستہ بند تھا، تو نوجوان افسر…"',
    topic: 'pointer',
  },
  // Lecturette topics
  {
    testTypeCode: 'lecturette',
    stemEn: 'The importance of discipline in life.',
    stemUr: 'زندگی میں نظم و ضبط کی اہمیت۔',
    topic: 'lecturette',
  },
  {
    testTypeCode: 'lecturette',
    stemEn: 'Role of youth in national development.',
    stemUr: 'قومی ترقی میں نوجوانوں کا کردار۔',
    topic: 'lecturette',
  },
  {
    testTypeCode: 'lecturette',
    stemEn: 'Technology: a blessing or a curse?',
    stemUr: 'ٹیکنالوجی: نعمت یا زحمت؟',
    topic: 'lecturette',
  },
  {
    testTypeCode: 'lecturette',
    stemEn: 'Teamwork versus individual effort.',
    stemUr: 'ٹیم ورک بمقابلہ انفرادی کوشش۔',
    topic: 'lecturette',
  },
  // Group discussion topics
  {
    testTypeCode: 'group_discussion',
    stemEn: 'Should social media be regulated?',
    stemUr: 'کیا سوشل میڈیا کو ریگولیٹ کیا جانا چاہیے؟',
    topic: 'gd',
  },
  {
    testTypeCode: 'group_discussion',
    stemEn: 'Merit versus quota in national institutions.',
    stemUr: 'قومی اداروں میں میرٹ بمقابلہ کوٹہ۔',
    topic: 'gd',
  },
  // GPE scenario
  {
    testTypeCode: 'gpe',
    stemEn:
      'A bus has broken down on a remote road at night. One passenger is injured, a child is missing, and a nearby village needs to be warned of a flood upstream. You have one motorbike, two torches and 45 minutes. Prioritise and plan.',
    stemUr:
      'رات کو ایک دور دراز سڑک پر بس خراب ہو گئی ہے۔ ایک مسافر زخمی ہے، ایک بچہ لاپتہ ہے، اور قریبی گاؤں کو اوپر کی طرف سیلاب سے خبردار کرنا ہے۔ آپ کے پاس ایک موٹر سائیکل، دو ٹارچ اور 45 منٹ ہیں۔ ترجیح دیں اور منصوبہ بنائیں۔',
    topic: 'gpe',
  },
]
