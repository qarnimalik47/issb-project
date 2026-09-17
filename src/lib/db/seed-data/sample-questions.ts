/**
 * A small set of ORIGINAL sample MCQs used to demonstrate the objective test
 * engine. These are our own generic aptitude/GK items — not ISSB materials.
 * Real content is added by admins via the CRUD/import tools.
 */
export type SeedQuestion = {
  testTypeCode: string
  stemEn: string
  stemUr: string
  options: { key: string; textEn: string; textUr: string }[]
  correctOption: string
  explanationEn: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const SAMPLE_QUESTIONS: SeedQuestion[] = [
  {
    testTypeCode: 'mechanical',
    stemEn: 'Two gears mesh together. If the driver gear turns clockwise, the driven gear turns…',
    stemUr: 'دو گیئر آپس میں جُڑے ہیں۔ اگر ڈرائیور گیئر گھڑی کی سمت گھومے تو دوسرا گیئر…',
    options: [
      { key: 'A', textEn: 'Clockwise', textUr: 'گھڑی کی سمت' },
      { key: 'B', textEn: 'Anticlockwise', textUr: 'گھڑی کے مخالف' },
      { key: 'C', textEn: 'Stops', textUr: 'رک جاتا ہے' },
      { key: 'D', textEn: 'Faster only', textUr: 'صرف تیز' },
    ],
    correctOption: 'B',
    explanationEn: 'Meshed gears rotate in opposite directions.',
    topic: 'gears',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'A lever has the load close to the fulcrum and effort far away. This gives…',
    stemUr: 'ایک لیور میں بوجھ فلکرم کے قریب اور قوت دور ہے۔ اس سے…',
    options: [
      { key: 'A', textEn: 'Less mechanical advantage', textUr: 'کم میکانی فائدہ' },
      { key: 'B', textEn: 'More mechanical advantage', textUr: 'زیادہ میکانی فائدہ' },
      { key: 'C', textEn: 'No change', textUr: 'کوئی تبدیلی نہیں' },
      { key: 'D', textEn: 'Negative advantage', textUr: 'منفی فائدہ' },
    ],
    correctOption: 'B',
    explanationEn: 'Effort arm longer than load arm increases mechanical advantage.',
    topic: 'levers',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'Which simple machine is a doorknob an example of?',
    stemUr: 'دروازے کا ہینڈل کس سادہ مشین کی مثال ہے؟',
    options: [
      { key: 'A', textEn: 'Pulley', textUr: 'پلی' },
      { key: 'B', textEn: 'Wheel and axle', textUr: 'پہیہ اور دھری' },
      { key: 'C', textEn: 'Inclined plane', textUr: 'مائل سطح' },
      { key: 'D', textEn: 'Wedge', textUr: 'کیل' },
    ],
    correctOption: 'B',
    explanationEn: 'A doorknob turns an axle via a larger wheel — a wheel and axle.',
    topic: 'simple-machines',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'What is the capital of Pakistan?',
    stemUr: 'پاکستان کا دارالحکومت کیا ہے؟',
    options: [
      { key: 'A', textEn: 'Karachi', textUr: 'کراچی' },
      { key: 'B', textEn: 'Lahore', textUr: 'لاہور' },
      { key: 'C', textEn: 'Islamabad', textUr: 'اسلام آباد' },
      { key: 'D', textEn: 'Peshawar', textUr: 'پشاور' },
    ],
    correctOption: 'C',
    explanationEn: 'Islamabad has been the capital since 1967.',
    topic: 'pakistan',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Who is the founder of Pakistan?',
    stemUr: 'پاکستان کے بانی کون ہیں؟',
    options: [
      { key: 'A', textEn: 'Allama Iqbal', textUr: 'علامہ اقبال' },
      { key: 'B', textEn: 'Quaid-e-Azam M. A. Jinnah', textUr: 'قائدِاعظم محمد علی جناح' },
      { key: 'C', textEn: 'Liaquat Ali Khan', textUr: 'لیاقت علی خان' },
      { key: 'D', textEn: 'Sir Syed Ahmad Khan', textUr: 'سر سید احمد خان' },
    ],
    correctOption: 'B',
    explanationEn: 'Muhammad Ali Jinnah is the founder and first Governor-General.',
    topic: 'pakistan',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'The headquarters of the Pakistan Army is located in…',
    stemUr: 'پاک فوج کا صدر دفتر کہاں واقع ہے؟',
    options: [
      { key: 'A', textEn: 'Islamabad', textUr: 'اسلام آباد' },
      { key: 'B', textEn: 'Rawalpindi', textUr: 'راولپنڈی' },
      { key: 'C', textEn: 'Lahore', textUr: 'لاہور' },
      { key: 'D', textEn: 'Quetta', textUr: 'کوئٹہ' },
    ],
    correctOption: 'B',
    explanationEn: 'General Headquarters (GHQ) is in Rawalpindi.',
    topic: 'defence',
    difficulty: 'medium',
  },
]
