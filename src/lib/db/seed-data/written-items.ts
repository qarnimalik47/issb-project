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
]
