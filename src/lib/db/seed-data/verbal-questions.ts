/**
 * ORIGINAL Verbal Intelligence practice bank (100 MCQs) written from scratch
 * for this platform. The formats (analogies, series, coding, relations, etc.)
 * are standard psychometric formats; every stem, option and explanation here
 * is our own wording — nothing is copied from ISSB materials, prep books or
 * past papers.
 *
 * Urdu conventions: items that test English itself (synonyms, antonyms,
 * sentence completion, word analogies) keep the English target words in the
 * Urdu stem and identical English option text; letter series and coding keep
 * Latin letters; digits are always ASCII 0–9.
 */
import type { SeedQuestion } from './sample-questions'

export const VERBAL_QUESTIONS: SeedQuestion[] = [
  // ───────────────────────────── Analogies ─────────────────────────────
  {
    testTypeCode: 'verbal',
    stemEn: 'Complete the analogy. Compass : Direction :: Thermometer : ?',
    stemUr: 'جو تعلق Compass کا Direction سے ہے، وہی تعلق Thermometer کا کس سے ہے؟',
    options: [
      { key: 'A', textEn: 'Mercury', textUr: 'Mercury' },
      { key: 'B', textEn: 'Fever', textUr: 'Fever' },
      { key: 'C', textEn: 'Temperature', textUr: 'Temperature' },
      { key: 'D', textEn: 'Glass', textUr: 'Glass' },
    ],
    correctOption: 'C',
    explanationEn:
      'A compass indicates direction and a thermometer measures temperature — each instrument is paired with what it measures.',
    topic: 'analogies',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Complete the analogy. Lion : Den :: Bee : ?',
    stemUr: 'جو تعلق Lion کا Den سے ہے، وہی تعلق Bee کا کس سے ہے؟',
    options: [
      { key: 'A', textEn: 'Hive', textUr: 'Hive' },
      { key: 'B', textEn: 'Honey', textUr: 'Honey' },
      { key: 'C', textEn: 'Nectar', textUr: 'Nectar' },
      { key: 'D', textEn: 'Swarm', textUr: 'Swarm' },
    ],
    correctOption: 'A',
    explanationEn:
      'A den is the home of a lion and a hive is the home of bees. Honey and nectar are things bees make or collect, not where they live.',
    topic: 'analogies',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Complete the analogy. Author : Novel :: Architect : ?',
    stemUr: 'جو تعلق Author کا Novel سے ہے، وہی تعلق Architect کا کس سے ہے؟',
    options: [
      { key: 'A', textEn: 'Brick', textUr: 'Brick' },
      { key: 'B', textEn: 'Mason', textUr: 'Mason' },
      { key: 'C', textEn: 'Cement', textUr: 'Cement' },
      { key: 'D', textEn: 'Building', textUr: 'Building' },
    ],
    correctOption: 'D',
    explanationEn:
      'An author creates a novel and an architect designs a building (creator : creation). Brick and cement are materials, and a mason is another worker.',
    topic: 'analogies',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Complete the analogy. Drought : Water :: Famine : ?',
    stemUr: 'جو تعلق Drought کا Water سے ہے، وہی تعلق Famine کا کس سے ہے؟',
    options: [
      { key: 'A', textEn: 'Hunger', textUr: 'Hunger' },
      { key: 'B', textEn: 'Food', textUr: 'Food' },
      { key: 'C', textEn: 'Rain', textUr: 'Rain' },
      { key: 'D', textEn: 'Crop', textUr: 'Crop' },
    ],
    correctOption: 'B',
    explanationEn:
      'A drought is a severe shortage of water and a famine is a severe shortage of food. Hunger is a result of famine, not the thing that is scarce.',
    topic: 'analogies',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Complete the analogy. Sculptor : Chisel :: Surgeon : ?',
    stemUr: 'جو تعلق Sculptor کا Chisel سے ہے، وہی تعلق Surgeon کا کس سے ہے؟',
    options: [
      { key: 'A', textEn: 'Hospital', textUr: 'Hospital' },
      { key: 'B', textEn: 'Patient', textUr: 'Patient' },
      { key: 'C', textEn: 'Scalpel', textUr: 'Scalpel' },
      { key: 'D', textEn: 'Operation', textUr: 'Operation' },
    ],
    correctOption: 'C',
    explanationEn:
      'A chisel is the cutting tool a sculptor works with; a scalpel is the cutting tool a surgeon works with (worker : tool).',
    topic: 'analogies',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Complete the analogy. Millimetre : Metre :: Milligram : ?',
    stemUr: 'جو تعلق Millimetre کا Metre سے ہے، وہی تعلق Milligram کا کس سے ہے؟',
    options: [
      { key: 'A', textEn: 'Gram', textUr: 'Gram' },
      { key: 'B', textEn: 'Kilogram', textUr: 'Kilogram' },
      { key: 'C', textEn: 'Litre', textUr: 'Litre' },
      { key: 'D', textEn: 'Centigram', textUr: 'Centigram' },
    ],
    correctOption: 'A',
    explanationEn:
      'A millimetre is one-thousandth of a metre, and a milligram is one-thousandth of a gram.',
    topic: 'analogies',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Complete the analogy. Timid : Courage :: Ignorant : ?',
    stemUr: 'جو تعلق Timid کا Courage سے ہے، وہی تعلق Ignorant کا کس سے ہے؟',
    options: [
      { key: 'A', textEn: 'Foolish', textUr: 'Foolish' },
      { key: 'B', textEn: 'Teacher', textUr: 'Teacher' },
      { key: 'C', textEn: 'Question', textUr: 'Question' },
      { key: 'D', textEn: 'Knowledge', textUr: 'Knowledge' },
    ],
    correctOption: 'D',
    explanationEn:
      'A timid person lacks courage and an ignorant person lacks knowledge — each word is paired with the quality it is missing.',
    topic: 'analogies',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Complete the analogy. Ephemeral : Permanent :: Candid : ?',
    stemUr: 'جو تعلق Ephemeral کا Permanent سے ہے، وہی تعلق Candid کا کس سے ہے؟',
    options: [
      { key: 'A', textEn: 'Frank', textUr: 'Frank' },
      { key: 'B', textEn: 'Evasive', textUr: 'Evasive' },
      { key: 'C', textEn: 'Honest', textUr: 'Honest' },
      { key: 'D', textEn: 'Sincere', textUr: 'Sincere' },
    ],
    correctOption: 'B',
    explanationEn:
      'Ephemeral (short-lived) is the opposite of permanent. Candid means open and frank, so its opposite is evasive; the other options are synonyms of candid.',
    topic: 'analogies',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Complete the analogy. Numismatist : Coins :: Philatelist : ?',
    stemUr: 'جو تعلق Numismatist کا Coins سے ہے، وہی تعلق Philatelist کا کس سے ہے؟',
    options: [
      { key: 'A', textEn: 'Letters', textUr: 'Letters' },
      { key: 'B', textEn: 'Maps', textUr: 'Maps' },
      { key: 'C', textEn: 'Stamps', textUr: 'Stamps' },
      { key: 'D', textEn: 'Books', textUr: 'Books' },
    ],
    correctOption: 'C',
    explanationEn:
      'A numismatist collects and studies coins; a philatelist collects and studies postage stamps.',
    topic: 'analogies',
    difficulty: 'hard',
  },

  // ──────────────────────────── Odd one out ────────────────────────────
  {
    testTypeCode: 'verbal',
    stemEn: 'Which of the following is the odd one out?',
    stemUr: 'درج ذیل میں سے کون سا باقیوں سے مختلف ہے؟',
    options: [
      { key: 'A', textEn: 'Mango', textUr: 'آم' },
      { key: 'B', textEn: 'Guava', textUr: 'امرود' },
      { key: 'C', textEn: 'Banana', textUr: 'کیلا' },
      { key: 'D', textEn: 'Potato', textUr: 'آلو' },
    ],
    correctOption: 'D',
    explanationEn:
      'Mango, guava and banana are fruits; a potato is a vegetable (a tuber that grows underground).',
    topic: 'odd-one-out',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Which of the following is the odd one out?',
    stemUr: 'درج ذیل میں سے کون سا باقیوں سے مختلف ہے؟',
    options: [
      { key: 'A', textEn: 'Punjab', textUr: 'پنجاب' },
      { key: 'B', textEn: 'Lahore', textUr: 'لاہور' },
      { key: 'C', textEn: 'Karachi', textUr: 'کراچی' },
      { key: 'D', textEn: 'Quetta', textUr: 'کوئٹہ' },
    ],
    correctOption: 'A',
    explanationEn: 'Lahore, Karachi and Quetta are cities; Punjab is a province.',
    topic: 'odd-one-out',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Which number is the odd one out?',
    stemUr: 'کون سا عدد باقیوں سے مختلف ہے؟',
    options: [
      { key: 'A', textEn: '25', textUr: '25' },
      { key: 'B', textEn: '63', textUr: '63' },
      { key: 'C', textEn: '49', textUr: '49' },
      { key: 'D', textEn: '81', textUr: '81' },
    ],
    correctOption: 'B',
    explanationEn:
      '25, 49 and 81 are perfect squares (5 × 5, 7 × 7, 9 × 9); 63 is not a perfect square.',
    topic: 'odd-one-out',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Which of the following is the odd one out?',
    stemUr: 'درج ذیل میں سے کون سا باقیوں سے مختلف ہے؟',
    options: [
      { key: 'A', textEn: 'Hammer', textUr: 'ہتھوڑا' },
      { key: 'B', textEn: 'Knife', textUr: 'چاقو' },
      { key: 'C', textEn: 'Scissors', textUr: 'قینچی' },
      { key: 'D', textEn: 'Axe', textUr: 'کلہاڑی' },
    ],
    correctOption: 'A',
    explanationEn:
      'A knife, scissors and an axe are cutting tools; a hammer is used for striking, not cutting.',
    topic: 'odd-one-out',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Which word is the odd one out?',
    stemUr: 'کون سا لفظ باقیوں سے مختلف ہے؟',
    options: [
      { key: 'A', textEn: 'Brave', textUr: 'Brave' },
      { key: 'B', textEn: 'Valiant', textUr: 'Valiant' },
      { key: 'C', textEn: 'Timid', textUr: 'Timid' },
      { key: 'D', textEn: 'Fearless', textUr: 'Fearless' },
    ],
    correctOption: 'C',
    explanationEn: 'Brave, valiant and fearless all mean courageous; timid means lacking courage.',
    topic: 'odd-one-out',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Which number is the odd one out?',
    stemUr: 'کون سا عدد باقیوں سے مختلف ہے؟',
    options: [
      { key: 'A', textEn: '17', textUr: '17' },
      { key: 'B', textEn: '23', textUr: '23' },
      { key: 'C', textEn: '29', textUr: '29' },
      { key: 'D', textEn: '33', textUr: '33' },
    ],
    correctOption: 'D',
    explanationEn: '17, 23 and 29 are prime numbers; 33 is not prime because 33 = 3 × 11.',
    topic: 'odd-one-out',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Which letter group is the odd one out?',
    stemUr: 'کون سا حرفی گروپ باقیوں سے مختلف ہے؟',
    options: [
      { key: 'A', textEn: 'HJM', textUr: 'HJM' },
      { key: 'B', textEn: 'BDG', textUr: 'BDG' },
      { key: 'C', textEn: 'NPR', textUr: 'NPR' },
      { key: 'D', textEn: 'LNQ', textUr: 'LNQ' },
    ],
    correctOption: 'C',
    explanationEn:
      'In BDG, HJM and LNQ the letters move forward 2 places and then 3 places (e.g. B→D→G). In NPR they move 2 and then 2, so it breaks the pattern.',
    topic: 'odd-one-out',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Which number is the odd one out?',
    stemUr: 'کون سا عدد باقیوں سے مختلف ہے؟',
    options: [
      { key: 'A', textEn: '27', textUr: '27' },
      { key: 'B', textEn: '144', textUr: '144' },
      { key: 'C', textEn: '64', textUr: '64' },
      { key: 'D', textEn: '125', textUr: '125' },
    ],
    correctOption: 'B',
    explanationEn:
      '27, 64 and 125 are perfect cubes (3 × 3 × 3, 4 × 4 × 4, 5 × 5 × 5); 144 is a square (12 × 12) but not a cube.',
    topic: 'odd-one-out',
    difficulty: 'medium',
  },

  // ───────────────────────────── Synonyms ──────────────────────────────
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word closest in meaning to ABUNDANT.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی ABUNDANT کے سب سے قریب ہوں۔',
    options: [
      { key: 'A', textEn: 'Plentiful', textUr: 'Plentiful' },
      { key: 'B', textEn: 'Scarce', textUr: 'Scarce' },
      { key: 'C', textEn: 'Absent', textUr: 'Absent' },
      { key: 'D', textEn: 'Abandoned', textUr: 'Abandoned' },
    ],
    correctOption: 'A',
    explanationEn:
      'Abundant means existing in large quantities — plentiful. Scarce is its opposite, and abandoned only looks similar.',
    topic: 'synonyms',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word closest in meaning to RAPID.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی RAPID کے سب سے قریب ہوں۔',
    options: [
      { key: 'A', textEn: 'Slow', textUr: 'Slow' },
      { key: 'B', textEn: 'Quick', textUr: 'Quick' },
      { key: 'C', textEn: 'Steady', textUr: 'Steady' },
      { key: 'D', textEn: 'Rough', textUr: 'Rough' },
    ],
    correctOption: 'B',
    explanationEn:
      'Rapid means happening at great speed, so quick is the synonym; slow is the opposite.',
    topic: 'synonyms',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word closest in meaning to DILIGENT.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی DILIGENT کے سب سے قریب ہوں۔',
    options: [
      { key: 'A', textEn: 'Intelligent', textUr: 'Intelligent' },
      { key: 'B', textEn: 'Lazy', textUr: 'Lazy' },
      { key: 'C', textEn: 'Hard-working', textUr: 'Hard-working' },
      { key: 'D', textEn: 'Careless', textUr: 'Careless' },
    ],
    correctOption: 'C',
    explanationEn:
      'Diligent describes someone who works carefully and steadily — hard-working. It sounds like intelligent but does not mean clever.',
    topic: 'synonyms',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word closest in meaning to VIGILANT.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی VIGILANT کے سب سے قریب ہوں۔',
    options: [
      { key: 'A', textEn: 'Watchful', textUr: 'Watchful' },
      { key: 'B', textEn: 'Violent', textUr: 'Violent' },
      { key: 'C', textEn: 'Vigorous', textUr: 'Vigorous' },
      { key: 'D', textEn: 'Sleepy', textUr: 'Sleepy' },
    ],
    correctOption: 'A',
    explanationEn:
      'Vigilant means keeping careful watch for danger — watchful. Violent and vigorous only share a few letters with it.',
    topic: 'synonyms',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word closest in meaning to OBSOLETE.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی OBSOLETE کے سب سے قریب ہوں۔',
    options: [
      { key: 'A', textEn: 'Absolute', textUr: 'Absolute' },
      { key: 'B', textEn: 'Outdated', textUr: 'Outdated' },
      { key: 'C', textEn: 'Obvious', textUr: 'Obvious' },
      { key: 'D', textEn: 'Modern', textUr: 'Modern' },
    ],
    correctOption: 'B',
    explanationEn:
      'Obsolete means no longer in use because something newer has replaced it — outdated. Modern is the opposite.',
    topic: 'synonyms',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word closest in meaning to CONCISE.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی CONCISE کے سب سے قریب ہوں۔',
    options: [
      { key: 'A', textEn: 'Lengthy', textUr: 'Lengthy' },
      { key: 'B', textEn: 'Confused', textUr: 'Confused' },
      { key: 'C', textEn: 'Decisive', textUr: 'Decisive' },
      { key: 'D', textEn: 'Brief', textUr: 'Brief' },
    ],
    correctOption: 'D',
    explanationEn:
      'Concise means expressing something clearly in few words — brief. Lengthy is the opposite.',
    topic: 'synonyms',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word closest in meaning to METICULOUS.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی METICULOUS کے سب سے قریب ہوں۔',
    options: [
      { key: 'A', textEn: 'Careless', textUr: 'Careless' },
      { key: 'B', textEn: 'Hasty', textUr: 'Hasty' },
      { key: 'C', textEn: 'Painstaking', textUr: 'Painstaking' },
      { key: 'D', textEn: 'Generous', textUr: 'Generous' },
    ],
    correctOption: 'C',
    explanationEn:
      'Meticulous means showing great attention to detail — painstaking. Careless and hasty are close to its opposite.',
    topic: 'synonyms',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word closest in meaning to LAUDABLE.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی LAUDABLE کے سب سے قریب ہوں۔',
    options: [
      { key: 'A', textEn: 'Laughable', textUr: 'Laughable' },
      { key: 'B', textEn: 'Praiseworthy', textUr: 'Praiseworthy' },
      { key: 'C', textEn: 'Blameworthy', textUr: 'Blameworthy' },
      { key: 'D', textEn: 'Loud', textUr: 'Loud' },
    ],
    correctOption: 'B',
    explanationEn:
      'Laudable means deserving praise — praiseworthy. Laughable and loud are sound-alike traps, and blameworthy is the opposite.',
    topic: 'synonyms',
    difficulty: 'hard',
  },

  // ───────────────────────────── Antonyms ──────────────────────────────
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word most nearly OPPOSITE in meaning to ANCIENT.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی ANCIENT کے سب سے زیادہ برعکس ہوں۔',
    options: [
      { key: 'A', textEn: 'Old', textUr: 'Old' },
      { key: 'B', textEn: 'Antique', textUr: 'Antique' },
      { key: 'C', textEn: 'Modern', textUr: 'Modern' },
      { key: 'D', textEn: 'Historic', textUr: 'Historic' },
    ],
    correctOption: 'C',
    explanationEn:
      'Ancient means belonging to the very distant past; modern means belonging to the present. The other options are close in meaning to ancient.',
    topic: 'antonyms',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word most nearly OPPOSITE in meaning to GENEROUS.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی GENEROUS کے سب سے زیادہ برعکس ہوں۔',
    options: [
      { key: 'A', textEn: 'Kind', textUr: 'Kind' },
      { key: 'B', textEn: 'Wealthy', textUr: 'Wealthy' },
      { key: 'C', textEn: 'Generic', textUr: 'Generic' },
      { key: 'D', textEn: 'Miserly', textUr: 'Miserly' },
    ],
    correctOption: 'D',
    explanationEn:
      'Generous means willing to give freely; miserly means unwilling to spend or share.',
    topic: 'antonyms',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word most nearly OPPOSITE in meaning to EXPAND.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی EXPAND کے سب سے زیادہ برعکس ہوں۔',
    options: [
      { key: 'A', textEn: 'Contract', textUr: 'Contract' },
      { key: 'B', textEn: 'Enlarge', textUr: 'Enlarge' },
      { key: 'C', textEn: 'Extend', textUr: 'Extend' },
      { key: 'D', textEn: 'Explain', textUr: 'Explain' },
    ],
    correctOption: 'A',
    explanationEn:
      'To expand is to become larger; to contract is to become smaller. Enlarge and extend are synonyms of expand.',
    topic: 'antonyms',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word most nearly OPPOSITE in meaning to HUMBLE.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی HUMBLE کے سب سے زیادہ برعکس ہوں۔',
    options: [
      { key: 'A', textEn: 'Modest', textUr: 'Modest' },
      { key: 'B', textEn: 'Arrogant', textUr: 'Arrogant' },
      { key: 'C', textEn: 'Polite', textUr: 'Polite' },
      { key: 'D', textEn: 'Humid', textUr: 'Humid' },
    ],
    correctOption: 'B',
    explanationEn:
      "Humble means having a modest view of one's own importance; arrogant means having an exaggerated view of it.",
    topic: 'antonyms',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word most nearly OPPOSITE in meaning to TRANSPARENT.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی TRANSPARENT کے سب سے زیادہ برعکس ہوں۔',
    options: [
      { key: 'A', textEn: 'Clear', textUr: 'Clear' },
      { key: 'B', textEn: 'Translucent', textUr: 'Translucent' },
      { key: 'C', textEn: 'Obvious', textUr: 'Obvious' },
      { key: 'D', textEn: 'Opaque', textUr: 'Opaque' },
    ],
    correctOption: 'D',
    explanationEn:
      'Transparent means light passes through completely; opaque means no light passes through. Translucent lets some light through, so it is not the opposite.',
    topic: 'antonyms',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word most nearly OPPOSITE in meaning to ACQUIT.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی ACQUIT کے سب سے زیادہ برعکس ہوں۔',
    options: [
      { key: 'A', textEn: 'Release', textUr: 'Release' },
      { key: 'B', textEn: 'Accuse', textUr: 'Accuse' },
      { key: 'C', textEn: 'Convict', textUr: 'Convict' },
      { key: 'D', textEn: 'Acquire', textUr: 'Acquire' },
    ],
    correctOption: 'C',
    explanationEn:
      'To acquit is to declare someone not guilty; to convict is to declare someone guilty. To accuse is only to bring a charge, before any verdict.',
    topic: 'antonyms',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word most nearly OPPOSITE in meaning to SCARCE.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی SCARCE کے سب سے زیادہ برعکس ہوں۔',
    options: [
      { key: 'A', textEn: 'Ample', textUr: 'Ample' },
      { key: 'B', textEn: 'Rare', textUr: 'Rare' },
      { key: 'C', textEn: 'Meagre', textUr: 'Meagre' },
      { key: 'D', textEn: 'Scared', textUr: 'Scared' },
    ],
    correctOption: 'A',
    explanationEn:
      'Scarce means in short supply; ample means more than enough. Rare and meagre are close in meaning to scarce.',
    topic: 'antonyms',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word most nearly OPPOSITE in meaning to GREGARIOUS.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی GREGARIOUS کے سب سے زیادہ برعکس ہوں۔',
    options: [
      { key: 'A', textEn: 'Sociable', textUr: 'Sociable' },
      { key: 'B', textEn: 'Reclusive', textUr: 'Reclusive' },
      { key: 'C', textEn: 'Aggressive', textUr: 'Aggressive' },
      { key: 'D', textEn: 'Gracious', textUr: 'Gracious' },
    ],
    correctOption: 'B',
    explanationEn:
      'Gregarious means fond of the company of others; reclusive means avoiding company. Sociable is a synonym.',
    topic: 'antonyms',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Choose the word most nearly OPPOSITE in meaning to FRUGAL.',
    stemUr: 'وہ لفظ منتخب کریں جس کے معنی FRUGAL کے سب سے زیادہ برعکس ہوں۔',
    options: [
      { key: 'A', textEn: 'Thrifty', textUr: 'Thrifty' },
      { key: 'B', textEn: 'Fragile', textUr: 'Fragile' },
      { key: 'C', textEn: 'Fruitful', textUr: 'Fruitful' },
      { key: 'D', textEn: 'Extravagant', textUr: 'Extravagant' },
    ],
    correctOption: 'D',
    explanationEn:
      'Frugal means careful and sparing with money; extravagant means spending too much. Thrifty is a synonym of frugal.',
    topic: 'antonyms',
    difficulty: 'hard',
  },

  // ─────────────────────────── Number series ───────────────────────────
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? 3, 7, 11, 15, ?',
    stemUr: 'سلسلے کا اگلا عدد کون سا ہے؟ 3, 7, 11, 15, ?',
    options: [
      { key: 'A', textEn: '18', textUr: '18' },
      { key: 'B', textEn: '19', textUr: '19' },
      { key: 'C', textEn: '20', textUr: '20' },
      { key: 'D', textEn: '21', textUr: '21' },
    ],
    correctOption: 'B',
    explanationEn: 'Each term is 4 more than the one before it, so 15 + 4 = 19.',
    topic: 'number-series',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? 3, 6, 12, 24, ?',
    stemUr: 'سلسلے کا اگلا عدد کون سا ہے؟ 3, 6, 12, 24, ?',
    options: [
      { key: 'A', textEn: '36', textUr: '36' },
      { key: 'B', textEn: '30', textUr: '30' },
      { key: 'C', textEn: '48', textUr: '48' },
      { key: 'D', textEn: '42', textUr: '42' },
    ],
    correctOption: 'C',
    explanationEn: 'Each term is double the one before it, so 24 × 2 = 48.',
    topic: 'number-series',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? 1, 4, 9, 16, 25, ?',
    stemUr: 'سلسلے کا اگلا عدد کون سا ہے؟ 1, 4, 9, 16, 25, ?',
    options: [
      { key: 'A', textEn: '30', textUr: '30' },
      { key: 'B', textEn: '35', textUr: '35' },
      { key: 'C', textEn: '49', textUr: '49' },
      { key: 'D', textEn: '36', textUr: '36' },
    ],
    correctOption: 'D',
    explanationEn: 'The terms are the squares of 1, 2, 3, 4 and 5, so the next term is 6 × 6 = 36.',
    topic: 'number-series',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? 5, 6, 9, 14, 21, ?',
    stemUr: 'سلسلے کا اگلا عدد کون سا ہے؟ 5, 6, 9, 14, 21, ?',
    options: [
      { key: 'A', textEn: '30', textUr: '30' },
      { key: 'B', textEn: '28', textUr: '28' },
      { key: 'C', textEn: '31', textUr: '31' },
      { key: 'D', textEn: '32', textUr: '32' },
    ],
    correctOption: 'A',
    explanationEn:
      'The differences are 1, 3, 5, 7 (consecutive odd numbers), so the next difference is 9: 21 + 9 = 30.',
    topic: 'number-series',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? 2, 3, 5, 7, 11, 13, ?',
    stemUr: 'سلسلے کا اگلا عدد کون سا ہے؟ 2, 3, 5, 7, 11, 13, ?',
    options: [
      { key: 'A', textEn: '15', textUr: '15' },
      { key: 'B', textEn: '17', textUr: '17' },
      { key: 'C', textEn: '19', textUr: '19' },
      { key: 'D', textEn: '16', textUr: '16' },
    ],
    correctOption: 'B',
    explanationEn:
      'These are consecutive prime numbers. The next prime after 13 is 17 (15 = 3 × 5 is not prime).',
    topic: 'number-series',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? 2, 3, 5, 8, 13, 21, ?',
    stemUr: 'سلسلے کا اگلا عدد کون سا ہے؟ 2, 3, 5, 8, 13, 21, ?',
    options: [
      { key: 'A', textEn: '29', textUr: '29' },
      { key: 'B', textEn: '33', textUr: '33' },
      { key: 'C', textEn: '34', textUr: '34' },
      { key: 'D', textEn: '35', textUr: '35' },
    ],
    correctOption: 'C',
    explanationEn: 'Each term is the sum of the two terms before it, so 13 + 21 = 34.',
    topic: 'number-series',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? 1, 2, 6, 24, 120, ?',
    stemUr: 'سلسلے کا اگلا عدد کون سا ہے؟ 1, 2, 6, 24, 120, ?',
    options: [
      { key: 'A', textEn: '240', textUr: '240' },
      { key: 'B', textEn: '600', textUr: '600' },
      { key: 'C', textEn: '840', textUr: '840' },
      { key: 'D', textEn: '720', textUr: '720' },
    ],
    correctOption: 'D',
    explanationEn:
      'The multipliers increase by one each time: ×2, ×3, ×4, ×5, so the next step is ×6: 120 × 6 = 720.',
    topic: 'number-series',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? 3, 10, 6, 20, 12, 40, ?',
    stemUr: 'سلسلے کا اگلا عدد کون سا ہے؟ 3, 10, 6, 20, 12, 40, ?',
    options: [
      { key: 'A', textEn: '24', textUr: '24' },
      { key: 'B', textEn: '80', textUr: '80' },
      { key: 'C', textEn: '18', textUr: '18' },
      { key: 'D', textEn: '48', textUr: '48' },
    ],
    correctOption: 'A',
    explanationEn:
      'Two doubling series alternate: 3, 6, 12, … and 10, 20, 40, …. The 7th term belongs to the first series, so it is 12 × 2 = 24.',
    topic: 'number-series',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? 7, 12, 22, 42, 82, ?',
    stemUr: 'سلسلے کا اگلا عدد کون سا ہے؟ 7, 12, 22, 42, 82, ?',
    options: [
      { key: 'A', textEn: '160', textUr: '160' },
      { key: 'B', textEn: '162', textUr: '162' },
      { key: 'C', textEn: '122', textUr: '122' },
      { key: 'D', textEn: '164', textUr: '164' },
    ],
    correctOption: 'B',
    explanationEn:
      'The differences 5, 10, 20, 40 double each time, so the next difference is 80: 82 + 80 = 162 (equivalently, each term is double the previous one minus 2).',
    topic: 'number-series',
    difficulty: 'hard',
  },

  // ─────────────────────────── Letter series ───────────────────────────
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? A, C, E, G, ?',
    stemUr: 'سلسلے کا اگلا حرف کون سا ہے؟ A, C, E, G, ?',
    options: [
      { key: 'A', textEn: 'H', textUr: 'H' },
      { key: 'B', textEn: 'J', textUr: 'J' },
      { key: 'C', textEn: 'I', textUr: 'I' },
      { key: 'D', textEn: 'K', textUr: 'K' },
    ],
    correctOption: 'C',
    explanationEn:
      'Each step skips one letter (A, C, E, G move 2 places at a time), so after G comes I.',
    topic: 'letter-series',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? Z, Y, X, W, ?',
    stemUr: 'سلسلے کا اگلا حرف کون سا ہے؟ Z, Y, X, W, ?',
    options: [
      { key: 'A', textEn: 'V', textUr: 'V' },
      { key: 'B', textEn: 'U', textUr: 'U' },
      { key: 'C', textEn: 'T', textUr: 'T' },
      { key: 'D', textEn: 'S', textUr: 'S' },
    ],
    correctOption: 'A',
    explanationEn:
      'The letters run backwards through the alphabet one at a time, so after W comes V.',
    topic: 'letter-series',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? C, F, I, L, ?',
    stemUr: 'سلسلے کا اگلا حرف کون سا ہے؟ C, F, I, L, ?',
    options: [
      { key: 'A', textEn: 'N', textUr: 'N' },
      { key: 'B', textEn: 'M', textUr: 'M' },
      { key: 'C', textEn: 'P', textUr: 'P' },
      { key: 'D', textEn: 'O', textUr: 'O' },
    ],
    correctOption: 'D',
    explanationEn:
      'Each letter is 3 places after the previous one: C(3), F(6), I(9), L(12), so next is O(15).',
    topic: 'letter-series',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? A, B, D, G, K, ?',
    stemUr: 'سلسلے کا اگلا حرف کون سا ہے؟ A, B, D, G, K, ?',
    options: [
      { key: 'A', textEn: 'O', textUr: 'O' },
      { key: 'B', textEn: 'P', textUr: 'P' },
      { key: 'C', textEn: 'Q', textUr: 'Q' },
      { key: 'D', textEn: 'N', textUr: 'N' },
    ],
    correctOption: 'B',
    explanationEn:
      'The gaps grow by one each time (+1, +2, +3, +4), so the next gap is +5: K(11) + 5 = P(16).',
    topic: 'letter-series',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? AZ, BY, CX, DW, ?',
    stemUr: 'سلسلے کا اگلا جزو کون سا ہے؟ AZ, BY, CX, DW, ?',
    options: [
      { key: 'A', textEn: 'EU', textUr: 'EU' },
      { key: 'B', textEn: 'FV', textUr: 'FV' },
      { key: 'C', textEn: 'EV', textUr: 'EV' },
      { key: 'D', textEn: 'DV', textUr: 'DV' },
    ],
    correctOption: 'C',
    explanationEn:
      'The first letter moves forward (A, B, C, D, E) while the second moves backward (Z, Y, X, W, V), giving EV.',
    topic: 'letter-series',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? Z, W, T, Q, ?',
    stemUr: 'سلسلے کا اگلا حرف کون سا ہے؟ Z, W, T, Q, ?',
    options: [
      { key: 'A', textEn: 'N', textUr: 'N' },
      { key: 'B', textEn: 'M', textUr: 'M' },
      { key: 'C', textEn: 'O', textUr: 'O' },
      { key: 'D', textEn: 'P', textUr: 'P' },
    ],
    correctOption: 'A',
    explanationEn:
      'Each letter is 3 places before the previous one: Z(26), W(23), T(20), Q(17), so next is N(14).',
    topic: 'letter-series',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? A1Z, C3X, E5V, G7T, ?',
    stemUr: 'سلسلے کا اگلا جزو کون سا ہے؟ A1Z, C3X, E5V, G7T, ?',
    options: [
      { key: 'A', textEn: 'H9R', textUr: 'H9R' },
      { key: 'B', textEn: 'I8S', textUr: 'I8S' },
      { key: 'C', textEn: 'I9S', textUr: 'I9S' },
      { key: 'D', textEn: 'I9R', textUr: 'I9R' },
    ],
    correctOption: 'D',
    explanationEn:
      'First letters go A, C, E, G, I (+2); numbers go 1, 3, 5, 7, 9 (+2); last letters go Z, X, V, T, R (−2). So the next term is I9R.',
    topic: 'letter-series',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'What comes next in the series? Z, A, Y, B, X, C, ?',
    stemUr: 'سلسلے کا اگلا حرف کون سا ہے؟ Z, A, Y, B, X, C, ?',
    options: [
      { key: 'A', textEn: 'D', textUr: 'D' },
      { key: 'B', textEn: 'W', textUr: 'W' },
      { key: 'C', textEn: 'V', textUr: 'V' },
      { key: 'D', textEn: 'U', textUr: 'U' },
    ],
    correctOption: 'B',
    explanationEn:
      'Two series are interleaved: Z, Y, X, … (backwards) and A, B, C, … (forwards). The 7th term continues the first series, so it is W.',
    topic: 'letter-series',
    difficulty: 'medium',
  },

  // ────────────────────────── Coding-decoding ──────────────────────────
  {
    testTypeCode: 'verbal',
    stemEn:
      'If every letter of a word is replaced by the letter that comes right after it in the alphabet, how is CAT written?',
    stemUr:
      'اگر کسی لفظ کے ہر حرف کو حروفِ تہجی میں اس کے فوراً بعد آنے والے حرف سے بدل دیا جائے تو CAT کیسے لکھا جائے گا؟',
    options: [
      { key: 'A', textEn: 'DBU', textUr: 'DBU' },
      { key: 'B', textEn: 'BZS', textUr: 'BZS' },
      { key: 'C', textEn: 'DAU', textUr: 'DAU' },
      { key: 'D', textEn: 'DCU', textUr: 'DCU' },
    ],
    correctOption: 'A',
    explanationEn: 'Shift each letter one place forward: C→D, A→B, T→U, giving DBU.',
    topic: 'coding-decoding',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'If A = 1, B = 2, C = 3 and so on up to Z = 26, which word is written as 8-1-20?',
    stemUr: 'اگر A = 1، B = 2، C = 3 ہو اور اسی طرح Z = 26 تک، تو 8-1-20 کون سا لفظ ہے؟',
    options: [
      { key: 'A', textEn: 'HIT', textUr: 'HIT' },
      { key: 'B', textEn: 'GAT', textUr: 'GAT' },
      { key: 'C', textEn: 'HAT', textUr: 'HAT' },
      { key: 'D', textEn: 'HAS', textUr: 'HAS' },
    ],
    correctOption: 'C',
    explanationEn: '8 = H, 1 = A and 20 = T, so the word is HAT.',
    topic: 'coding-decoding',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'In a certain code, ROAD is written as URDG. How is SHIP written in that code?',
    stemUr: 'ایک خاص کوڈ میں ROAD کو URDG لکھا جاتا ہے۔ اسی کوڈ میں SHIP کیسے لکھا جائے گا؟',
    options: [
      { key: 'A', textEn: 'VJLS', textUr: 'VJLS' },
      { key: 'B', textEn: 'VKLS', textUr: 'VKLS' },
      { key: 'C', textEn: 'UKLS', textUr: 'UKLS' },
      { key: 'D', textEn: 'VKMS', textUr: 'VKMS' },
    ],
    correctOption: 'B',
    explanationEn:
      'Each letter moves 3 places forward (R→U, O→R, A→D, D→G). Applying the same rule: S→V, H→K, I→L, P→S, giving VKLS.',
    topic: 'coding-decoding',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'If LAMP is written as PMAL, how is GATE written?',
    stemUr: 'اگر LAMP کو PMAL لکھا جائے تو GATE کو کیسے لکھا جائے گا؟',
    options: [
      { key: 'A', textEn: 'EATG', textUr: 'EATG' },
      { key: 'B', textEn: 'GTAE', textUr: 'GTAE' },
      { key: 'C', textEn: 'TEGA', textUr: 'TEGA' },
      { key: 'D', textEn: 'ETAG', textUr: 'ETAG' },
    ],
    correctOption: 'D',
    explanationEn: 'PMAL is LAMP written in reverse order, so GATE reversed is ETAG.',
    topic: 'coding-decoding',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'If CAB = 6 and BAG = 10, what is BED in the same code?',
    stemUr: 'اگر CAB = 6 اور BAG = 10 ہو تو اسی کوڈ میں BED کیا ہوگا؟',
    options: [
      { key: 'A', textEn: '11', textUr: '11' },
      { key: 'B', textEn: '10', textUr: '10' },
      { key: 'C', textEn: '12', textUr: '12' },
      { key: 'D', textEn: '9', textUr: '9' },
    ],
    correctOption: 'A',
    explanationEn:
      "The code is the sum of the letters' alphabet positions: C3 + A1 + B2 = 6 and B2 + A1 + G7 = 10. So BED = 2 + 5 + 4 = 11.",
    topic: 'coding-decoding',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'If FIRE is coded as 6-9-18-5, how is WATER coded?',
    stemUr: 'اگر FIRE کو 6-9-18-5 لکھا جائے تو WATER کو کیسے لکھا جائے گا؟',
    options: [
      { key: 'A', textEn: '22-1-20-5-18', textUr: '22-1-20-5-18' },
      { key: 'B', textEn: '23-1-19-5-18', textUr: '23-1-19-5-18' },
      { key: 'C', textEn: '23-1-20-5-18', textUr: '23-1-20-5-18' },
      { key: 'D', textEn: '23-2-20-5-18', textUr: '23-2-20-5-18' },
    ],
    correctOption: 'C',
    explanationEn:
      'Each letter is replaced by its position in the alphabet (F = 6, I = 9, R = 18, E = 5). So W = 23, A = 1, T = 20, E = 5, R = 18.',
    topic: 'coding-decoding',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'In a certain code, MOUNTAIN is written as NUOMNIAT. How is TRIANGLE written in that code?',
    stemUr:
      'ایک خاص کوڈ میں MOUNTAIN کو NUOMNIAT لکھا جاتا ہے۔ اسی کوڈ میں TRIANGLE کیسے لکھا جائے گا؟',
    options: [
      { key: 'A', textEn: 'AIRTELGN', textUr: 'AIRTELGN' },
      { key: 'B', textEn: 'AIRTLGNE', textUr: 'AIRTLGNE' },
      { key: 'C', textEn: 'TRIAELGN', textUr: 'TRIAELGN' },
      { key: 'D', textEn: 'AIRTELNG', textUr: 'AIRTELNG' },
    ],
    correctOption: 'A',
    explanationEn:
      'The word is split into two halves of four letters and each half is reversed: MOUN→NUOM, TAIN→NIAT. So TRIA→AIRT and NGLE→ELGN, giving AIRTELGN.',
    topic: 'coding-decoding',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'In a certain code, GOLD is written as TLOW. How is IRON written in that code?',
    stemUr: 'ایک خاص کوڈ میں GOLD کو TLOW لکھا جاتا ہے۔ اسی کوڈ میں IRON کیسے لکھا جائے گا؟',
    options: [
      { key: 'A', textEn: 'RIML', textUr: 'RIML' },
      { key: 'B', textEn: 'JSPO', textUr: 'JSPO' },
      { key: 'C', textEn: 'RHLM', textUr: 'RHLM' },
      { key: 'D', textEn: 'RILM', textUr: 'RILM' },
    ],
    correctOption: 'D',
    explanationEn:
      'Each letter is swapped with its mirror letter (A↔Z, B↔Y, …; positions add up to 27): G(7)↔T(20), O(15)↔L(12). So I→R, R→I, O→L, N→M, giving RILM.',
    topic: 'coding-decoding',
    difficulty: 'hard',
  },

  // ────────────────────────── Blood relations ──────────────────────────
  {
    testTypeCode: 'verbal',
    stemEn:
      "Ali is the son of Kamran, and Kamran's father is Rashid. How is Ali related to Rashid?",
    stemUr: 'علی، کامران کا بیٹا ہے اور کامران کے والد راشد ہیں۔ علی کا راشد سے کیا رشتہ ہے؟',
    options: [
      { key: 'A', textEn: 'Son', textUr: 'بیٹا' },
      { key: 'B', textEn: 'Grandson', textUr: 'پوتا' },
      { key: 'C', textEn: 'Nephew', textUr: 'بھتیجا' },
      { key: 'D', textEn: 'Brother', textUr: 'بھائی' },
    ],
    correctOption: 'B',
    explanationEn:
      "Rashid is Kamran's father and Kamran is Ali's father, so Ali is Rashid's son's son — his grandson.",
    topic: 'blood-relations',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: "Imran is the brother of Sana's mother. How is Imran related to Sana?",
    stemUr: 'عمران، ثنا کی والدہ کا بھائی ہے۔ عمران کا ثنا سے کیا رشتہ ہے؟',
    options: [
      { key: 'A', textEn: 'Father', textUr: 'والد' },
      { key: 'B', textEn: 'Cousin', textUr: 'کزن' },
      { key: 'C', textEn: 'Grandfather', textUr: 'نانا' },
      { key: 'D', textEn: 'Maternal uncle', textUr: 'ماموں' },
    ],
    correctOption: 'D',
    explanationEn: "A mother's brother is a maternal uncle (mamoon).",
    topic: 'blood-relations',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      "Pointing to a man in a photograph, Bilal says, “He is the only son of my father's father.” Who is the man in the photograph?",
    stemUr:
      'تصویر میں موجود ایک آدمی کی طرف اشارہ کرتے ہوئے بلال کہتا ہے: “یہ میرے والد کے والد کا اکلوتا بیٹا ہے۔” تصویر میں موجود آدمی کون ہے؟',
    options: [
      { key: 'A', textEn: "Bilal's father", textUr: 'بلال کے والد' },
      { key: 'B', textEn: "Bilal's uncle", textUr: 'بلال کے چچا' },
      { key: 'C', textEn: "Bilal's brother", textUr: 'بلال کا بھائی' },
      { key: 'D', textEn: "Bilal's grandfather", textUr: 'بلال کے دادا' },
    ],
    correctOption: 'A',
    explanationEn:
      "Bilal's father's father is Bilal's grandfather. Bilal's father is a son of that grandfather, and since the grandfather has only one son, the man must be Bilal's father.",
    topic: 'blood-relations',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      "Hina is Omar's sister. Omar is the son of Farah, and Farah is the daughter of Zubair. How is Hina related to Zubair?",
    stemUr:
      'حنا، عمر کی بہن ہے۔ عمر، فرح کا بیٹا ہے اور فرح، زبیر کی بیٹی ہے۔ حنا کا زبیر سے کیا رشتہ ہے؟',
    options: [
      { key: 'A', textEn: 'Daughter', textUr: 'بیٹی' },
      { key: 'B', textEn: 'Niece', textUr: 'بھانجی' },
      { key: 'C', textEn: 'Granddaughter', textUr: 'نواسی' },
      { key: 'D', textEn: 'Sister', textUr: 'بہن' },
    ],
    correctOption: 'C',
    explanationEn:
      "Hina is Omar's sister, so she is also Farah's daughter. Farah is Zubair's daughter, which makes Hina Zubair's granddaughter.",
    topic: 'blood-relations',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      "Asad is Maryam's brother. Maryam is Tariq's sister, and Tariq is Zain's father. How is Asad related to Zain?",
    stemUr:
      'اسد، مریم کا بھائی ہے۔ مریم، طارق کی بہن ہے اور طارق، زین کا والد ہے۔ اسد کا زین سے کیا رشتہ ہے؟',
    options: [
      { key: 'A', textEn: 'Father', textUr: 'والد' },
      { key: 'B', textEn: 'Uncle', textUr: 'چچا' },
      { key: 'C', textEn: 'Cousin', textUr: 'کزن' },
      { key: 'D', textEn: 'Grandfather', textUr: 'دادا' },
    ],
    correctOption: 'B',
    explanationEn:
      "Asad, Maryam and Tariq are siblings. Tariq is Zain's father, so Asad is the brother of Zain's father — his paternal uncle (chacha).",
    topic: 'blood-relations',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Introducing a young man, Ayesha says, “His mother is the only daughter of my mother.” How is Ayesha related to the young man?',
    stemUr:
      'ایک نوجوان کا تعارف کراتے ہوئے عائشہ کہتی ہے: “اس کی والدہ میری والدہ کی اکلوتی بیٹی ہیں۔” عائشہ کا اس نوجوان سے کیا رشتہ ہے؟',
    options: [
      { key: 'A', textEn: 'Sister', textUr: 'بہن' },
      { key: 'B', textEn: 'Aunt', textUr: 'خالہ' },
      { key: 'C', textEn: 'Grandmother', textUr: 'نانی' },
      { key: 'D', textEn: 'Mother', textUr: 'والدہ' },
    ],
    correctOption: 'D',
    explanationEn:
      "The only daughter of Ayesha's mother is Ayesha herself. So the young man's mother is Ayesha.",
    topic: 'blood-relations',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Pointing to a girl, Hamza says, “She is the daughter of the only child of my grandmother.” How is the girl related to Hamza?',
    stemUr:
      'ایک لڑکی کی طرف اشارہ کرتے ہوئے حمزہ کہتا ہے: “یہ میری دادی کی اکلوتی اولاد کی بیٹی ہے۔” اس لڑکی کا حمزہ سے کیا رشتہ ہے؟',
    options: [
      { key: 'A', textEn: 'Sister', textUr: 'بہن' },
      { key: 'B', textEn: 'Cousin', textUr: 'کزن' },
      { key: 'C', textEn: 'Aunt', textUr: 'پھوپھی' },
      { key: 'D', textEn: 'Niece', textUr: 'بھتیجی' },
    ],
    correctOption: 'A',
    explanationEn:
      "If Hamza's grandmother has only one child, that child must be Hamza's own parent. The daughter of Hamza's parent is Hamza's sister.",
    topic: 'blood-relations',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'verbal',
    stemEn: "Faisal is the son of Nadia's father's sister. How is Faisal related to Nadia?",
    stemUr: 'فیصل، نادیہ کے والد کی بہن کا بیٹا ہے۔ فیصل کا نادیہ سے کیا رشتہ ہے؟',
    options: [
      { key: 'A', textEn: 'Brother', textUr: 'بھائی' },
      { key: 'B', textEn: 'Nephew', textUr: 'بھتیجا' },
      { key: 'C', textEn: 'Cousin', textUr: 'کزن (پھوپھی زاد بھائی)' },
      { key: 'D', textEn: 'Uncle', textUr: 'چچا' },
    ],
    correctOption: 'C',
    explanationEn:
      "Nadia's father's sister is her paternal aunt (phuphi), and an aunt's son is a cousin.",
    topic: 'blood-relations',
    difficulty: 'medium',
  },

  // ───────────────────────── Direction sense ───────────────────────────
  {
    testTypeCode: 'verbal',
    stemEn:
      'Usman walks 5 km north, then turns right and walks 3 km. Which direction is he facing now?',
    stemUr:
      'عثمان 5 کلومیٹر شمال کی طرف چلتا ہے، پھر دائیں مڑ کر 3 کلومیٹر چلتا ہے۔ اب اس کا رخ کس سمت ہے؟',
    options: [
      { key: 'A', textEn: 'North', textUr: 'شمال' },
      { key: 'B', textEn: 'South', textUr: 'جنوب' },
      { key: 'C', textEn: 'East', textUr: 'مشرق' },
      { key: 'D', textEn: 'West', textUr: 'مغرب' },
    ],
    correctOption: 'C',
    explanationEn: 'When you face north, a right turn points you east.',
    topic: 'directions',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'A man is facing south. He turns 90° clockwise. Which direction is he facing now?',
    stemUr:
      'ایک آدمی کا رخ جنوب کی طرف ہے۔ وہ گھڑی کی سمت میں 90 درجے مڑتا ہے۔ اب اس کا رخ کس سمت ہے؟',
    options: [
      { key: 'A', textEn: 'East', textUr: 'مشرق' },
      { key: 'B', textEn: 'West', textUr: 'مغرب' },
      { key: 'C', textEn: 'North', textUr: 'شمال' },
      { key: 'D', textEn: 'South', textUr: 'جنوب' },
    ],
    correctOption: 'B',
    explanationEn:
      'Clockwise turns go North → East → South → West, so a quarter-turn clockwise from south faces west.',
    topic: 'directions',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Zara walks 4 km east and then 3 km north. How far is she from her starting point in a straight line?',
    stemUr:
      'زارا 4 کلومیٹر مشرق اور پھر 3 کلومیٹر شمال کی طرف چلتی ہے۔ وہ اپنے نقطۂ آغاز سے سیدھی لکیر میں کتنی دور ہے؟',
    options: [
      { key: 'A', textEn: '7 km', textUr: '7 کلومیٹر' },
      { key: 'B', textEn: '1 km', textUr: '1 کلومیٹر' },
      { key: 'C', textEn: '6 km', textUr: '6 کلومیٹر' },
      { key: 'D', textEn: '5 km', textUr: '5 کلومیٹر' },
    ],
    correctOption: 'D',
    explanationEn:
      'The two legs form a right angle, so the straight-line distance is √(4² + 3²) = √25 = 5 km, not the 7 km walked.',
    topic: 'directions',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Ahmed walks 10 m south, turns left and walks 6 m, then turns left again and walks 10 m. Where is he now relative to his starting point?',
    stemUr:
      'احمد 10 میٹر جنوب کی طرف چلتا ہے، بائیں مڑ کر 6 میٹر چلتا ہے، پھر دوبارہ بائیں مڑ کر 10 میٹر چلتا ہے۔ اب وہ اپنے نقطۂ آغاز کے لحاظ سے کہاں ہے؟',
    options: [
      { key: 'A', textEn: '6 m East', textUr: '6 میٹر مشرق' },
      { key: 'B', textEn: '6 m West', textUr: '6 میٹر مغرب' },
      { key: 'C', textEn: '26 m North', textUr: '26 میٹر شمال' },
      { key: 'D', textEn: '16 m East', textUr: '16 میٹر مشرق' },
    ],
    correctOption: 'A',
    explanationEn:
      'Facing south, a left turn faces east (6 m), and a second left turn faces north. The 10 m north cancels the 10 m south, leaving him 6 m east of the start.',
    topic: 'directions',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Rabia walks 6 km north, turns right and walks 8 km, then turns right again and walks 12 km. How far is she from her starting point?',
    stemUr:
      'رابعہ 6 کلومیٹر شمال کی طرف چلتی ہے، دائیں مڑ کر 8 کلومیٹر چلتی ہے، پھر دوبارہ دائیں مڑ کر 12 کلومیٹر چلتی ہے۔ وہ اپنے نقطۂ آغاز سے کتنی دور ہے؟',
    options: [
      { key: 'A', textEn: '14 km', textUr: '14 کلومیٹر' },
      { key: 'B', textEn: '10 km', textUr: '10 کلومیٹر' },
      { key: 'C', textEn: '26 km', textUr: '26 کلومیٹر' },
      { key: 'D', textEn: '8 km', textUr: '8 کلومیٹر' },
    ],
    correctOption: 'B',
    explanationEn:
      'She goes north 6, east 8, then south 12, ending 8 km east and 6 km south of the start. The straight-line distance is √(8² + 6²) = √100 = 10 km.',
    topic: 'directions',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'One morning, Kamal notices that his shadow falls exactly to his right. Which direction is he facing?',
    stemUr:
      'ایک صبح کمال دیکھتا ہے کہ اس کا سایہ بالکل اس کے دائیں جانب پڑ رہا ہے۔ اس کا رخ کس سمت ہے؟',
    options: [
      { key: 'A', textEn: 'North', textUr: 'شمال' },
      { key: 'B', textEn: 'East', textUr: 'مشرق' },
      { key: 'C', textEn: 'South', textUr: 'جنوب' },
      { key: 'D', textEn: 'West', textUr: 'مغرب' },
    ],
    correctOption: 'C',
    explanationEn:
      'In the morning the sun is in the east, so shadows fall towards the west. If west is on his right, he must be facing south.',
    topic: 'directions',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'A school is 5 km north of the post office, and a hospital is 5 km east of the post office. In which direction is the school from the hospital?',
    stemUr:
      'ایک اسکول ڈاک خانے سے 5 کلومیٹر شمال میں ہے اور ایک ہسپتال ڈاک خانے سے 5 کلومیٹر مشرق میں ہے۔ اسکول، ہسپتال سے کس سمت میں ہے؟',
    options: [
      { key: 'A', textEn: 'North-East', textUr: 'شمال مشرق' },
      { key: 'B', textEn: 'South-West', textUr: 'جنوب مغرب' },
      { key: 'C', textEn: 'South-East', textUr: 'جنوب مشرق' },
      { key: 'D', textEn: 'North-West', textUr: 'شمال مغرب' },
    ],
    correctOption: 'D',
    explanationEn:
      'From the hospital, the school is 5 km to the west and 5 km to the north, so it lies to the north-west.',
    topic: 'directions',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Hamid walks 3 km east, turns left and walks 4 km, turns left and walks 7 km, then turns left and walks 4 km. Where is he now relative to his starting point?',
    stemUr:
      'حامد 3 کلومیٹر مشرق کی طرف چلتا ہے، بائیں مڑ کر 4 کلومیٹر، پھر بائیں مڑ کر 7 کلومیٹر اور پھر بائیں مڑ کر 4 کلومیٹر چلتا ہے۔ اب وہ اپنے نقطۂ آغاز کے لحاظ سے کہاں ہے؟',
    options: [
      { key: 'A', textEn: '4 km East', textUr: '4 کلومیٹر مشرق' },
      { key: 'B', textEn: '10 km West', textUr: '10 کلومیٹر مغرب' },
      { key: 'C', textEn: '3 km North', textUr: '3 کلومیٹر شمال' },
      { key: 'D', textEn: '4 km West', textUr: '4 کلومیٹر مغرب' },
    ],
    correctOption: 'D',
    explanationEn:
      'The turns take him east 3, north 4, west 7 and south 4. North and south cancel, and 7 west minus 3 east leaves him 4 km west of the start.',
    topic: 'directions',
    difficulty: 'medium',
  },

  // ──────────────────────────── Syllogisms ─────────────────────────────
  {
    testTypeCode: 'verbal',
    stemEn:
      'Statements: All roses are flowers. All flowers need water. Which conclusion definitely follows?',
    stemUr:
      'بیانات: تمام گلاب پھول ہیں۔ تمام پھولوں کو پانی کی ضرورت ہوتی ہے۔ کون سا نتیجہ لازماً نکلتا ہے؟',
    options: [
      { key: 'A', textEn: 'Only roses need water', textUr: 'صرف گلابوں کو پانی کی ضرورت ہوتی ہے' },
      { key: 'B', textEn: 'All flowers are roses', textUr: 'تمام پھول گلاب ہیں' },
      {
        key: 'C',
        textEn: 'All roses need water',
        textUr: 'تمام گلابوں کو پانی کی ضرورت ہوتی ہے',
      },
      {
        key: 'D',
        textEn: 'Some flowers do not need water',
        textUr: 'کچھ پھولوں کو پانی کی ضرورت نہیں ہوتی',
      },
    ],
    correctOption: 'C',
    explanationEn:
      'Every rose is a flower and every flower needs water, so every rose needs water. Nothing in the statements makes the other options certain.',
    topic: 'syllogisms',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Statements: All cadets at the academy wear a uniform. Hassan is a cadet at the academy. Which conclusion follows?',
    stemUr:
      'بیانات: اکیڈمی کے تمام کیڈٹ وردی پہنتے ہیں۔ حسن اکیڈمی کا کیڈٹ ہے۔ کون سا نتیجہ نکلتا ہے؟',
    options: [
      { key: 'A', textEn: 'Hassan does not wear a uniform', textUr: 'حسن وردی نہیں پہنتا' },
      {
        key: 'B',
        textEn: 'Everyone who wears a uniform is a cadet',
        textUr: 'وردی پہننے والا ہر شخص کیڈٹ ہے',
      },
      {
        key: 'C',
        textEn: 'Hassan may or may not wear a uniform',
        textUr: 'حسن وردی پہن بھی سکتا ہے اور نہیں بھی',
      },
      { key: 'D', textEn: 'Hassan wears a uniform', textUr: 'حسن وردی پہنتا ہے' },
    ],
    correctOption: 'D',
    explanationEn:
      'Every cadet wears a uniform and Hassan is a cadet, so Hassan wears a uniform. The reverse (every uniform-wearer is a cadet) is not implied.',
    topic: 'syllogisms',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Statements: Some books are novels. All novels are stories. Conclusions: I. Some books are stories. II. All stories are books. Which conclusion(s) follow?',
    stemUr:
      'بیانات: کچھ کتابیں ناول ہیں۔ تمام ناول کہانیاں ہیں۔ نتائج: I. کچھ کتابیں کہانیاں ہیں۔ II. تمام کہانیاں کتابیں ہیں۔ کون سا نتیجہ منطقی طور پر نکلتا ہے؟',
    options: [
      { key: 'A', textEn: 'Only conclusion I follows', textUr: 'صرف نتیجہ I نکلتا ہے' },
      { key: 'B', textEn: 'Only conclusion II follows', textUr: 'صرف نتیجہ II نکلتا ہے' },
      { key: 'C', textEn: 'Both I and II follow', textUr: 'نتیجہ I اور II دونوں نکلتے ہیں' },
      { key: 'D', textEn: 'Neither I nor II follows', textUr: 'نہ نتیجہ I نکلتا ہے نہ II' },
    ],
    correctOption: 'A',
    explanationEn:
      'The books that are novels must also be stories, so I follows. Nothing says every story is a book, so II does not follow.',
    topic: 'syllogisms',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Statements: No cats are dogs. All dogs are animals. Conclusions: I. No cats are animals. II. Some animals are not cats. Which conclusion(s) follow?',
    stemUr:
      'بیانات: کوئی بلی کتا نہیں ہے۔ تمام کتے جانور ہیں۔ نتائج: I. کوئی بلی جانور نہیں ہے۔ II. کچھ جانور بلیاں نہیں ہیں۔ کون سا نتیجہ منطقی طور پر نکلتا ہے؟',
    options: [
      { key: 'A', textEn: 'Only conclusion I follows', textUr: 'صرف نتیجہ I نکلتا ہے' },
      { key: 'B', textEn: 'Only conclusion II follows', textUr: 'صرف نتیجہ II نکلتا ہے' },
      { key: 'C', textEn: 'Both I and II follow', textUr: 'نتیجہ I اور II دونوں نکلتے ہیں' },
      { key: 'D', textEn: 'Neither I nor II follows', textUr: 'نہ نتیجہ I نکلتا ہے نہ II' },
    ],
    correctOption: 'B',
    explanationEn:
      'Dogs are animals and no dog is a cat, so some animals (the dogs) are not cats — II follows. Cats may still be animals, so I does not follow.',
    topic: 'syllogisms',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Statements: Some chairs are tables. Some tables are desks. Conclusions: I. Some chairs are desks. II. All desks are tables. Which conclusion(s) follow?',
    stemUr:
      'بیانات: کچھ کرسیاں میزیں ہیں۔ کچھ میزیں ڈیسک ہیں۔ نتائج: I. کچھ کرسیاں ڈیسک ہیں۔ II. تمام ڈیسک میزیں ہیں۔ کون سا نتیجہ منطقی طور پر نکلتا ہے؟',
    options: [
      { key: 'A', textEn: 'Only conclusion I follows', textUr: 'صرف نتیجہ I نکلتا ہے' },
      { key: 'B', textEn: 'Only conclusion II follows', textUr: 'صرف نتیجہ II نکلتا ہے' },
      { key: 'C', textEn: 'Both I and II follow', textUr: 'نتیجہ I اور II دونوں نکلتے ہیں' },
      { key: 'D', textEn: 'Neither I nor II follows', textUr: 'نہ نتیجہ I نکلتا ہے نہ II' },
    ],
    correctOption: 'D',
    explanationEn:
      'The tables that are chairs need not be the tables that are desks, so I does not follow. "Some tables are desks" says nothing about all desks, so II does not follow either.',
    topic: 'syllogisms',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Statements: Some teachers are poets. Some poets are singers. Conclusions: I. Some teachers are singers. II. Some singers are poets. Which conclusion(s) follow?',
    stemUr:
      'بیانات: کچھ اساتذہ شاعر ہیں۔ کچھ شاعر گلوکار ہیں۔ نتائج: I. کچھ اساتذہ گلوکار ہیں۔ II. کچھ گلوکار شاعر ہیں۔ کون سا نتیجہ منطقی طور پر نکلتا ہے؟',
    options: [
      { key: 'A', textEn: 'Only conclusion I follows', textUr: 'صرف نتیجہ I نکلتا ہے' },
      { key: 'B', textEn: 'Only conclusion II follows', textUr: 'صرف نتیجہ II نکلتا ہے' },
      { key: 'C', textEn: 'Both I and II follow', textUr: 'نتیجہ I اور II دونوں نکلتے ہیں' },
      { key: 'D', textEn: 'Neither I nor II follows', textUr: 'نہ نتیجہ I نکلتا ہے نہ II' },
    ],
    correctOption: 'B',
    explanationEn:
      '"Some poets are singers" can be reversed to "some singers are poets", so II follows. Two "some" statements cannot link teachers to singers, so I does not follow.',
    topic: 'syllogisms',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Statements: Some officers are pilots. No pilot is a sailor. Conclusions: I. Some officers are not sailors. II. Some sailors are officers. Which conclusion(s) follow?',
    stemUr:
      'بیانات: کچھ افسر پائلٹ ہیں۔ کوئی پائلٹ ملاح نہیں ہے۔ نتائج: I. کچھ افسر ملاح نہیں ہیں۔ II. کچھ ملاح افسر ہیں۔ کون سا نتیجہ منطقی طور پر نکلتا ہے؟',
    options: [
      { key: 'A', textEn: 'Only conclusion I follows', textUr: 'صرف نتیجہ I نکلتا ہے' },
      { key: 'B', textEn: 'Only conclusion II follows', textUr: 'صرف نتیجہ II نکلتا ہے' },
      { key: 'C', textEn: 'Both I and II follow', textUr: 'نتیجہ I اور II دونوں نکلتے ہیں' },
      { key: 'D', textEn: 'Neither I nor II follows', textUr: 'نہ نتیجہ I نکلتا ہے نہ II' },
    ],
    correctOption: 'A',
    explanationEn:
      'The officers who are pilots cannot be sailors, so some officers are not sailors — I follows. Whether any sailor is an officer is not settled, so II does not follow.',
    topic: 'syllogisms',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Statements: All bottles are jars. All jars are cups. Conclusions: I. All bottles are cups. II. Some cups are jars. Which conclusion(s) follow?',
    stemUr:
      'بیانات: تمام بوتلیں مرتبان ہیں۔ تمام مرتبان پیالے ہیں۔ نتائج: I. تمام بوتلیں پیالے ہیں۔ II. کچھ پیالے مرتبان ہیں۔ کون سا نتیجہ منطقی طور پر نکلتا ہے؟',
    options: [
      { key: 'A', textEn: 'Only conclusion I follows', textUr: 'صرف نتیجہ I نکلتا ہے' },
      { key: 'B', textEn: 'Only conclusion II follows', textUr: 'صرف نتیجہ II نکلتا ہے' },
      { key: 'C', textEn: 'Both I and II follow', textUr: 'نتیجہ I اور II دونوں نکلتے ہیں' },
      { key: 'D', textEn: 'Neither I nor II follows', textUr: 'نہ نتیجہ I نکلتا ہے نہ II' },
    ],
    correctOption: 'C',
    explanationEn:
      'Bottles sit inside jars and jars inside cups, so all bottles are cups (I). Since every jar is a cup, some cups are certainly jars (II). Both follow.',
    topic: 'syllogisms',
    difficulty: 'medium',
  },

  // ───────────────────────── Ranking / ordering ────────────────────────
  {
    testTypeCode: 'verbal',
    stemEn:
      'In a class of 40 students, Saad is 12th from the top. What is his position from the bottom?',
    stemUr: '40 طلبہ کی ایک جماعت میں سعد اوپر سے 12ویں نمبر پر ہے۔ نیچے سے اس کا نمبر کیا ہے؟',
    options: [
      { key: 'A', textEn: '28th', textUr: '28واں' },
      { key: 'B', textEn: '29th', textUr: '29واں' },
      { key: 'C', textEn: '30th', textUr: '30واں' },
      { key: 'D', textEn: '27th', textUr: '27واں' },
    ],
    correctOption: 'B',
    explanationEn:
      'Position from the bottom = total − position from the top + 1 = 40 − 12 + 1 = 29th.',
    topic: 'ranking',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn: 'Ali is taller than Bilal, and Bilal is taller than Omar. Who is the shortest?',
    stemUr: 'علی، بلال سے لمبا ہے اور بلال، عمر سے لمبا ہے۔ سب سے چھوٹے قد کا کون ہے؟',
    options: [
      { key: 'A', textEn: 'Ali', textUr: 'علی' },
      { key: 'B', textEn: 'Bilal', textUr: 'بلال' },
      { key: 'C', textEn: 'Cannot be determined', textUr: 'معلوم نہیں کیا جا سکتا' },
      { key: 'D', textEn: 'Omar', textUr: 'عمر' },
    ],
    correctOption: 'D',
    explanationEn:
      'From tallest to shortest the order is Ali, Bilal, Omar, so Omar is the shortest.',
    topic: 'ranking',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'In a row of girls, Sadaf is 7th from the left and 10th from the right. How many girls are in the row?',
    stemUr:
      'لڑکیوں کی ایک قطار میں صدف بائیں سے 7ویں اور دائیں سے 10ویں نمبر پر ہے۔ قطار میں کل کتنی لڑکیاں ہیں؟',
    options: [
      { key: 'A', textEn: '17', textUr: '17' },
      { key: 'B', textEn: '15', textUr: '15' },
      { key: 'C', textEn: '16', textUr: '16' },
      { key: 'D', textEn: '18', textUr: '18' },
    ],
    correctOption: 'C',
    explanationEn:
      'Total = 7 + 10 − 1 = 16. We subtract 1 because Sadaf is counted from both ends.',
    topic: 'ranking',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Kashif is heavier than Nabeel but lighter than Tahir. Adnan is heavier than Tahir. Who is the heaviest?',
    stemUr:
      'کاشف، نبیل سے بھاری ہے لیکن طاہر سے ہلکا ہے۔ عدنان، طاہر سے بھاری ہے۔ سب سے بھاری کون ہے؟',
    options: [
      { key: 'A', textEn: 'Adnan', textUr: 'عدنان' },
      { key: 'B', textEn: 'Tahir', textUr: 'طاہر' },
      { key: 'C', textEn: 'Kashif', textUr: 'کاشف' },
      { key: 'D', textEn: 'Nabeel', textUr: 'نبیل' },
    ],
    correctOption: 'A',
    explanationEn:
      'From lightest to heaviest the order is Nabeel, Kashif, Tahir, Adnan, so Adnan is the heaviest.',
    topic: 'ranking',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'In a race, Faraz finished ahead of Junaid but behind Salman. Waqas finished behind Junaid, and Danish finished ahead of Salman. Who finished third?',
    stemUr:
      'ایک دوڑ میں فراز، جنید سے آگے مگر سلمان سے پیچھے رہا۔ وقاص، جنید سے پیچھے رہا اور دانش، سلمان سے آگے رہا۔ تیسرے نمبر پر کون آیا؟',
    options: [
      { key: 'A', textEn: 'Salman', textUr: 'سلمان' },
      { key: 'B', textEn: 'Faraz', textUr: 'فراز' },
      { key: 'C', textEn: 'Junaid', textUr: 'جنید' },
      { key: 'D', textEn: 'Danish', textUr: 'دانش' },
    ],
    correctOption: 'B',
    explanationEn:
      'The finishing order is Danish, Salman, Faraz, Junaid, Waqas, so Faraz came third.',
    topic: 'ranking',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'In a queue, there are 5 people ahead of Adeel and 8 people behind him. How many people are in the queue?',
    stemUr: 'ایک قطار میں عدیل سے آگے 5 اور اس کے پیچھے 8 افراد ہیں۔ قطار میں کل کتنے افراد ہیں؟',
    options: [
      { key: 'A', textEn: '13', textUr: '13' },
      { key: 'B', textEn: '15', textUr: '15' },
      { key: 'C', textEn: '12', textUr: '12' },
      { key: 'D', textEn: '14', textUr: '14' },
    ],
    correctOption: 'D',
    explanationEn: '5 people ahead + 8 people behind + Adeel himself = 14.',
    topic: 'ranking',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'In a row of 30 cadets, Arslan is 11th from the left and Fahad is 14th from the right. How many cadets stand between them?',
    stemUr:
      '30 کیڈٹس کی ایک قطار میں ارسلان بائیں سے 11ویں اور فہد دائیں سے 14ویں نمبر پر ہے۔ ان دونوں کے درمیان کتنے کیڈٹ کھڑے ہیں؟',
    options: [
      { key: 'A', textEn: '5', textUr: '5' },
      { key: 'B', textEn: '6', textUr: '6' },
      { key: 'C', textEn: '4', textUr: '4' },
      { key: 'D', textEn: '7', textUr: '7' },
    ],
    correctOption: 'A',
    explanationEn:
      'Fahad is 14th from the right, i.e. 30 − 14 + 1 = 17th from the left. Between positions 11 and 17 there are 17 − 11 − 1 = 5 cadets.',
    topic: 'ranking',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'In a row of girls, Nida is 8th from the left and Mehwish is 12th from the right. When they swap places, Nida becomes 15th from the left. How many girls are in the row?',
    stemUr:
      'لڑکیوں کی ایک قطار میں ندا بائیں سے 8ویں اور مہوش دائیں سے 12ویں نمبر پر ہے۔ جب دونوں اپنی جگہیں بدلتی ہیں تو ندا بائیں سے 15ویں نمبر پر آ جاتی ہے۔ قطار میں کل کتنی لڑکیاں ہیں؟',
    options: [
      { key: 'A', textEn: '26', textUr: '26' },
      { key: 'B', textEn: '27', textUr: '27' },
      { key: 'C', textEn: '25', textUr: '25' },
      { key: 'D', textEn: '35', textUr: '35' },
    ],
    correctOption: 'A',
    explanationEn:
      "After the swap Nida stands in Mehwish's old place, which is 15th from the left and 12th from the right. So the row has 15 + 12 − 1 = 26 girls.",
    topic: 'ranking',
    difficulty: 'hard',
  },

  // ──────────────────────── Sentence completion ────────────────────────
  {
    testTypeCode: 'verbal',
    stemEn:
      'Choose the word that best completes the sentence: The soldier showed great ______ by rescuing his comrades under enemy fire.',
    stemUr:
      'خالی جگہ کے لیے سب سے موزوں لفظ منتخب کریں: The soldier showed great ______ by rescuing his comrades under enemy fire.',
    options: [
      { key: 'A', textEn: 'cowardice', textUr: 'cowardice' },
      { key: 'B', textEn: 'courage', textUr: 'courage' },
      { key: 'C', textEn: 'laziness', textUr: 'laziness' },
      { key: 'D', textEn: 'confusion', textUr: 'confusion' },
    ],
    correctOption: 'B',
    explanationEn:
      'Rescuing comrades under fire is a brave act, so "courage" fits; the other words describe negative qualities.',
    topic: 'sentence-completion',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Choose the word that best completes the sentence: She was so ______ that she finished the whole project two days before the deadline.',
    stemUr:
      'خالی جگہ کے لیے سب سے موزوں لفظ منتخب کریں: She was so ______ that she finished the whole project two days before the deadline.',
    options: [
      { key: 'A', textEn: 'careless', textUr: 'careless' },
      { key: 'B', textEn: 'reluctant', textUr: 'reluctant' },
      { key: 'C', textEn: 'efficient', textUr: 'efficient' },
      { key: 'D', textEn: 'sleepy', textUr: 'sleepy' },
    ],
    correctOption: 'C',
    explanationEn:
      'Finishing early shows she worked well and quickly, so "efficient" fits; the other words would explain a delay, not an early finish.',
    topic: 'sentence-completion',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Choose the word that best completes the sentence: Please switch off the lights ______ you leave the room.',
    stemUr:
      'خالی جگہ کے لیے سب سے موزوں لفظ منتخب کریں: Please switch off the lights ______ you leave the room.',
    options: [
      { key: 'A', textEn: 'until', textUr: 'until' },
      { key: 'B', textEn: 'unless', textUr: 'unless' },
      { key: 'C', textEn: 'although', textUr: 'although' },
      { key: 'D', textEn: 'before', textUr: 'before' },
    ],
    correctOption: 'D',
    explanationEn:
      'The lights should go off at the moment prior to leaving, so "before" is the only connector that makes sense.',
    topic: 'sentence-completion',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Choose the phrase that best completes the sentence: Despite the heavy rain, the match ______ as scheduled.',
    stemUr:
      'خالی جگہ کے لیے سب سے موزوں فقرہ منتخب کریں: Despite the heavy rain, the match ______ as scheduled.',
    options: [
      { key: 'A', textEn: 'went ahead', textUr: 'went ahead' },
      { key: 'B', textEn: 'was cancelled', textUr: 'was cancelled' },
      { key: 'C', textEn: 'was postponed', textUr: 'was postponed' },
      { key: 'D', textEn: 'was abandoned', textUr: 'was abandoned' },
    ],
    correctOption: 'A',
    explanationEn:
      '"Despite" signals a contrast with the rain, so the match must have gone ahead as planned.',
    topic: 'sentence-completion',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      "Choose the word that best completes the sentence: The committee's decision was ______; every single member voted in favour.",
    stemUr:
      "خالی جگہ کے لیے سب سے موزوں لفظ منتخب کریں: The committee's decision was ______; every single member voted in favour.",
    options: [
      { key: 'A', textEn: 'controversial', textUr: 'controversial' },
      { key: 'B', textEn: 'unanimous', textUr: 'unanimous' },
      { key: 'C', textEn: 'divided', textUr: 'divided' },
      { key: 'D', textEn: 'anonymous', textUr: 'anonymous' },
    ],
    correctOption: 'B',
    explanationEn:
      'When every member agrees, the decision is "unanimous". "Anonymous" sounds similar but means "without a name".',
    topic: 'sentence-completion',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Choose the word that best completes the sentence: He is known for his ______ temperament; he never loses his temper, even under pressure.',
    stemUr:
      'خالی جگہ کے لیے سب سے موزوں لفظ منتخب کریں: He is known for his ______ temperament; he never loses his temper, even under pressure.',
    options: [
      { key: 'A', textEn: 'irritable', textUr: 'irritable' },
      { key: 'B', textEn: 'volatile', textUr: 'volatile' },
      { key: 'C', textEn: 'composed', textUr: 'composed' },
      { key: 'D', textEn: 'anxious', textUr: 'anxious' },
    ],
    correctOption: 'C',
    explanationEn:
      'Staying calm under pressure describes a "composed" temperament; the other options describe people who are easily upset.',
    topic: 'sentence-completion',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Choose the word that best completes the sentence: The evidence was so ______ that even the most sceptical members of the committee were convinced.',
    stemUr:
      'خالی جگہ کے لیے سب سے موزوں لفظ منتخب کریں: The evidence was so ______ that even the most sceptical members of the committee were convinced.',
    options: [
      { key: 'A', textEn: 'flimsy', textUr: 'flimsy' },
      { key: 'B', textEn: 'ambiguous', textUr: 'ambiguous' },
      { key: 'C', textEn: 'irrelevant', textUr: 'irrelevant' },
      { key: 'D', textEn: 'compelling', textUr: 'compelling' },
    ],
    correctOption: 'D',
    explanationEn:
      'Evidence that convinces even sceptics must be strong and persuasive — "compelling". The other options would fail to convince anyone.',
    topic: 'sentence-completion',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Choose the word that best completes the sentence: Far from being ______, the new recruit asked thoughtful questions and volunteered for every task.',
    stemUr:
      'خالی جگہ کے لیے سب سے موزوں لفظ منتخب کریں: Far from being ______, the new recruit asked thoughtful questions and volunteered for every task.',
    options: [
      { key: 'A', textEn: 'apathetic', textUr: 'apathetic' },
      { key: 'B', textEn: 'enthusiastic', textUr: 'enthusiastic' },
      { key: 'C', textEn: 'curious', textUr: 'curious' },
      { key: 'D', textEn: 'diligent', textUr: 'diligent' },
    ],
    correctOption: 'A',
    explanationEn:
      '"Far from being" introduces the opposite of what follows. An eager, active recruit is the opposite of "apathetic" (uninterested).',
    topic: 'sentence-completion',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'verbal',
    stemEn:
      'Choose the pair of words that best completes the sentence: Although the plan looked ______ on paper, it proved ______ in practice.',
    stemUr:
      'خالی جگہوں کے لیے الفاظ کا سب سے موزوں جوڑا منتخب کریں: Although the plan looked ______ on paper, it proved ______ in practice.',
    options: [
      { key: 'A', textEn: 'promising … successful', textUr: 'promising … successful' },
      { key: 'B', textEn: 'useless … worthless', textUr: 'useless … worthless' },
      { key: 'C', textEn: 'flawless … impractical', textUr: 'flawless … impractical' },
      { key: 'D', textEn: 'weak … disastrous', textUr: 'weak … disastrous' },
    ],
    correctOption: 'C',
    explanationEn:
      '"Although" requires a contrast between how the plan looked and how it worked. Only "flawless … impractical" gives that contrast; the other pairs agree with each other.',
    topic: 'sentence-completion',
    difficulty: 'hard',
  },
]
