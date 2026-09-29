/**
 * Reference data: the ISSB test battery (build prompt §4.3). Timing values are
 * re-confirmed against sources before content authoring (see docs/issb-reference.md).
 * These describe the *practice* treatment; ISSB's own materials are never used.
 */
export type SeedTestType = {
  code: string
  nameEn: string
  nameUr: string
  dimension: 'psychologist' | 'gto' | 'interview' | 'cross_cutting'
  scoringType: 'objective' | 'rubric' | 'consistency'
  timing: Record<string, number>
  sortOrder: number
}

export const TEST_TYPES: SeedTestType[] = [
  {
    code: 'verbal',
    nameEn: 'Verbal Intelligence',
    nameUr: 'زبانی ذہانت',
    dimension: 'psychologist',
    scoringType: 'objective',
    // Without itemCount an attempt draws the entire published bank.
    timing: { totalSeconds: 1800, itemCount: 50 },
    sortOrder: 10,
  },
  {
    code: 'nonverbal',
    nameEn: 'Non-Verbal Intelligence',
    nameUr: 'غیر زبانی ذہانت',
    dimension: 'psychologist',
    scoringType: 'objective',
    timing: { totalSeconds: 1800, itemCount: 50 },
    sortOrder: 20,
  },
  {
    code: 'mechanical',
    nameEn: 'Mechanical Aptitude',
    nameUr: 'مکینیکل اہلیت',
    dimension: 'psychologist',
    scoringType: 'objective',
    timing: { totalSeconds: 900, itemCount: 50 },
    sortOrder: 30,
  },
  {
    code: 'sct',
    nameEn: 'Sentence Completion (SCT)',
    nameUr: 'جملہ تکمیل',
    dimension: 'psychologist',
    scoringType: 'rubric',
    timing: { totalSeconds: 360, itemCount: 26 },
    sortOrder: 40,
  },
  {
    code: 'wat',
    nameEn: 'Word Association (WAT)',
    nameUr: 'لفظی تلازمہ',
    dimension: 'psychologist',
    scoringType: 'rubric',
    timing: { perItemSeconds: 10 },
    sortOrder: 50,
  },
  {
    code: 'picture_story',
    nameEn: 'Picture Story (TAT)',
    nameUr: 'تصویری کہانی',
    dimension: 'psychologist',
    scoringType: 'rubric',
    timing: { viewSeconds: 30, writeSeconds: 210, itemCount: 4 },
    sortOrder: 60,
  },
  {
    code: 'pointer_story',
    nameEn: 'Pointer Story',
    nameUr: 'پوائنٹر کہانی',
    dimension: 'psychologist',
    scoringType: 'rubric',
    timing: { perItemSeconds: 240 },
    sortOrder: 70,
  },
  {
    code: 'self_description',
    nameEn: 'Self Description',
    nameUr: 'خود بیانی',
    dimension: 'psychologist',
    scoringType: 'rubric',
    timing: { perItemSeconds: 240 },
    sortOrder: 80,
  },
  {
    code: 'srt',
    nameEn: 'Situation Reaction Test (SRT)',
    nameUr: 'صورتحال ردعمل ٹیسٹ',
    dimension: 'psychologist',
    scoringType: 'rubric',
    timing: { totalSeconds: 1200, itemCount: 10 },
    sortOrder: 90,
  },
  {
    code: 'opi',
    nameEn: 'OPI',
    nameUr: 'او پی آئی',
    dimension: 'psychologist',
    scoringType: 'consistency',
    timing: { itemCount: 150 },
    sortOrder: 100,
  },
  {
    code: 'essay',
    nameEn: 'Essay',
    nameUr: 'مضمون',
    dimension: 'psychologist',
    scoringType: 'rubric',
    timing: { totalSeconds: 1800 },
    sortOrder: 110,
  },
  {
    code: 'piq',
    nameEn: 'PIQ / Biodata',
    nameUr: 'ذاتی معلومات فارم',
    dimension: 'cross_cutting',
    scoringType: 'consistency',
    timing: {},
    sortOrder: 120,
  },
  {
    code: 'gk',
    nameEn: 'General Knowledge',
    nameUr: 'عمومی معلومات',
    dimension: 'cross_cutting',
    scoringType: 'objective',
    timing: { itemCount: 25 },
    sortOrder: 130,
  },
  {
    code: 'lecturette',
    nameEn: 'Lecturette',
    nameUr: 'لیکچرٹ',
    dimension: 'gto',
    scoringType: 'rubric',
    timing: { prepareSeconds: 120, speakSeconds: 120 },
    sortOrder: 140,
  },
  {
    code: 'group_discussion',
    nameEn: 'Group Discussion',
    nameUr: 'گروپ بحث',
    dimension: 'gto',
    scoringType: 'rubric',
    timing: {},
    sortOrder: 150,
  },
  {
    code: 'gpe',
    nameEn: 'Group Planning Exercise',
    nameUr: 'گروپ پلاننگ',
    dimension: 'gto',
    scoringType: 'rubric',
    // One scenario at a time: read the briefing and map, then 10 minutes to write a plan.
    timing: { planSeconds: 600 },
    sortOrder: 160,
  },
  {
    code: 'interview',
    nameEn: 'Personal Interview',
    nameUr: 'انٹرویو',
    dimension: 'interview',
    scoringType: 'rubric',
    timing: {},
    sortOrder: 170,
  },
]
