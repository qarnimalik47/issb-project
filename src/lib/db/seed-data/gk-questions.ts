/**
 * ORIGINAL General Knowledge MCQ bank for the ISSB practice platform. Every
 * stem, option and explanation here is our own wording — not copied from prep
 * books, websites or past papers. Items deliberately avoid time-sensitive facts
 * (current office holders, rankings, "latest" records) so they stay accurate.
 */
import type { SeedQuestion } from './sample-questions'

export const GK_QUESTIONS: SeedQuestion[] = [
  // ── Pakistan history ──────────────────────────────────────────────────────
  {
    testTypeCode: 'gk',
    stemEn:
      'In which year did the All-India Muslim League adopt the Lahore Resolution at Minto Park, Lahore?',
    stemUr: 'آل انڈیا مسلم لیگ نے منٹو پارک لاہور میں قراردادِ لاہور کس سال منظور کی؟',
    options: [
      { key: 'A', textEn: '1929', textUr: '1929' },
      { key: 'B', textEn: '1935', textUr: '1935' },
      { key: 'C', textEn: '1940', textUr: '1940' },
      { key: 'D', textEn: '1946', textUr: '1946' },
    ],
    correctOption: 'C',
    explanationEn:
      'The resolution was adopted on 23 March 1940 at Minto Park (now Iqbal Park), Lahore. Minar-e-Pakistan stands at the site today.',
    topic: 'pakistan-history',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'In which city was the All-India Muslim League founded in 1906?',
    stemUr: 'آل انڈیا مسلم لیگ 1906 میں کس شہر میں قائم ہوئی؟',
    options: [
      { key: 'A', textEn: 'Dhaka', textUr: 'ڈھاکہ' },
      { key: 'B', textEn: 'Lahore', textUr: 'لاہور' },
      { key: 'C', textEn: 'Aligarh', textUr: 'علی گڑھ' },
      { key: 'D', textEn: 'Lucknow', textUr: 'لکھنؤ' },
    ],
    correctOption: 'A',
    explanationEn:
      'It was founded on 30 December 1906 in Dhaka, during the session of the All-India Muhammadan Educational Conference.',
    topic: 'pakistan-history',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'Where did Allama Iqbal deliver his 1930 presidential address to the Muslim League, in which he proposed a Muslim state in north-west India?',
    stemUr:
      'علامہ اقبال نے 1930 میں مسلم لیگ کے اجلاس سے اپنا صدارتی خطبہ، جس میں شمال مغربی ہندوستان میں ایک مسلم ریاست کی تجویز پیش کی گئی، کہاں دیا؟',
    options: [
      { key: 'A', textEn: 'Lahore', textUr: 'لاہور' },
      { key: 'B', textEn: 'Delhi', textUr: 'دہلی' },
      { key: 'C', textEn: 'Karachi', textUr: 'کراچی' },
      { key: 'D', textEn: 'Allahabad', textUr: 'الہ آباد' },
    ],
    correctOption: 'D',
    explanationEn:
      'The Allahabad Address of December 1930 proposed a consolidated Muslim state in north-west India and is regarded as a milestone of the Pakistan Movement.',
    topic: 'pakistan-history',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'In which year did Quaid-e-Azam Muhammad Ali Jinnah present his Fourteen Points?',
    stemUr: 'قائدِاعظم محمد علی جناح نے اپنے چودہ نکات کس سال پیش کیے؟',
    options: [
      { key: 'A', textEn: '1916', textUr: '1916' },
      { key: 'B', textEn: '1929', textUr: '1929' },
      { key: 'C', textEn: '1935', textUr: '1935' },
      { key: 'D', textEn: '1940', textUr: '1940' },
    ],
    correctOption: 'B',
    explanationEn:
      'The Fourteen Points (March 1929) were Jinnah’s response to the Nehru Report of 1928 and set out constitutional safeguards for Muslims.',
    topic: 'pakistan-history',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'The Lucknow Pact between the Indian National Congress and the Muslim League was concluded in…',
    stemUr: 'انڈین نیشنل کانگریس اور مسلم لیگ کے درمیان میثاقِ لکھنؤ کس سال طے پایا؟',
    options: [
      { key: 'A', textEn: '1906', textUr: '1906' },
      { key: 'B', textEn: '1911', textUr: '1911' },
      { key: 'C', textEn: '1916', textUr: '1916' },
      { key: 'D', textEn: '1919', textUr: '1919' },
    ],
    correctOption: 'C',
    explanationEn:
      'In the pact of December 1916 the Congress accepted separate electorates for Muslims; Jinnah played a leading role in bringing the two parties together.',
    topic: 'pakistan-history',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Who was the first Prime Minister of Pakistan?',
    stemUr: 'پاکستان کے پہلے وزیرِاعظم کون تھے؟',
    options: [
      { key: 'A', textEn: 'Khawaja Nazimuddin', textUr: 'خواجہ ناظم الدین' },
      { key: 'B', textEn: 'Muhammad Ali Bogra', textUr: 'محمد علی بوگرا' },
      { key: 'C', textEn: 'Huseyn Shaheed Suhrawardy', textUr: 'حسین شہید سہروردی' },
      { key: 'D', textEn: 'Liaquat Ali Khan', textUr: 'لیاقت علی خان' },
    ],
    correctOption: 'D',
    explanationEn:
      'Liaquat Ali Khan served as Prime Minister from August 1947 until his assassination in October 1951.',
    topic: 'pakistan-history',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'In which city was Prime Minister Liaquat Ali Khan assassinated in October 1951?',
    stemUr: 'وزیرِاعظم لیاقت علی خان کو اکتوبر 1951 میں کس شہر میں قتل کیا گیا؟',
    options: [
      { key: 'A', textEn: 'Karachi', textUr: 'کراچی' },
      { key: 'B', textEn: 'Rawalpindi', textUr: 'راولپنڈی' },
      { key: 'C', textEn: 'Lahore', textUr: 'لاہور' },
      { key: 'D', textEn: 'Peshawar', textUr: 'پشاور' },
    ],
    correctOption: 'B',
    explanationEn:
      'He was shot while addressing a public meeting at Company Bagh, Rawalpindi, on 16 October 1951; the park was later renamed Liaquat Bagh.',
    topic: 'pakistan-history',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'In which year did the Constituent Assembly of Pakistan pass the Objectives Resolution?',
    stemUr: 'پاکستان کی دستور ساز اسمبلی نے قراردادِ مقاصد کس سال منظور کی؟',
    options: [
      { key: 'A', textEn: '1949', textUr: '1949' },
      { key: 'B', textEn: '1951', textUr: '1951' },
      { key: 'C', textEn: '1954', textUr: '1954' },
      { key: 'D', textEn: '1956', textUr: '1956' },
    ],
    correctOption: 'A',
    explanationEn:
      'Moved by Liaquat Ali Khan and passed on 12 March 1949, it laid down the guiding principles that later formed the preamble of Pakistan’s constitutions.',
    topic: 'pakistan-history',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'In which year did Quaid-e-Azam Muhammad Ali Jinnah pass away?',
    stemUr: 'قائدِاعظم محمد علی جناح کا انتقال کس سال ہوا؟',
    options: [
      { key: 'A', textEn: '1946', textUr: '1946' },
      { key: 'B', textEn: '1947', textUr: '1947' },
      { key: 'C', textEn: '1948', textUr: '1948' },
      { key: 'D', textEn: '1951', textUr: '1951' },
    ],
    correctOption: 'C',
    explanationEn:
      'He died in Karachi on 11 September 1948, about a year after independence, and is buried at the Mazar-e-Quaid in Karachi.',
    topic: 'pakistan-history',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Who led the Simla Deputation that met the Viceroy, Lord Minto, in 1906?',
    stemUr: '1906 میں وائسرائے لارڈ منٹو سے ملاقات کرنے والے شملہ وفد کی قیادت کس نے کی؟',
    options: [
      { key: 'A', textEn: 'Sir Aga Khan III', textUr: 'سر آغا خان سوم' },
      { key: 'B', textEn: 'Nawab Salimullah Khan', textUr: 'نواب سلیم اللہ خان' },
      { key: 'C', textEn: 'Sir Syed Ahmad Khan', textUr: 'سر سید احمد خان' },
      { key: 'D', textEn: 'Maulana Muhammad Ali Jauhar', textUr: 'مولانا محمد علی جوہر' },
    ],
    correctOption: 'A',
    explanationEn:
      'The deputation of October 1906, led by Sir Aga Khan III, asked for separate electorates for Muslims, which were granted in the reforms of 1909.',
    topic: 'pakistan-history',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Who moved the Lahore Resolution at the Muslim League session of March 1940?',
    stemUr: 'مارچ 1940 کے مسلم لیگ کے اجلاس میں قراردادِ لاہور کس نے پیش کی؟',
    options: [
      { key: 'A', textEn: 'Liaquat Ali Khan', textUr: 'لیاقت علی خان' },
      { key: 'B', textEn: 'Chaudhry Rahmat Ali', textUr: 'چوہدری رحمت علی' },
      { key: 'C', textEn: 'Sir Sikandar Hayat Khan', textUr: 'سر سکندر حیات خان' },
      { key: 'D', textEn: 'A. K. Fazlul Huq', textUr: 'اے کے فضل الحق' },
    ],
    correctOption: 'D',
    explanationEn:
      'The resolution was moved by A. K. Fazlul Huq, then Premier (head of government) of Bengal, who was popularly known as Sher-e-Bangla.',
    topic: 'pakistan-history',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Who coined the name "Pakistan" in his 1933 pamphlet "Now or Never"?',
    stemUr: '1933 میں اپنے کتابچے "ناؤ آر نیور" میں لفظ "پاکستان" کس نے وضع کیا؟',
    options: [
      { key: 'A', textEn: 'Allama Iqbal', textUr: 'علامہ اقبال' },
      { key: 'B', textEn: 'Chaudhry Rahmat Ali', textUr: 'چوہدری رحمت علی' },
      { key: 'C', textEn: 'Muhammad Ali Jinnah', textUr: 'محمد علی جناح' },
      { key: 'D', textEn: 'Maulana Shaukat Ali', textUr: 'مولانا شوکت علی' },
    ],
    correctOption: 'B',
    explanationEn: 'Chaudhry Rahmat Ali, then a student at Cambridge, proposed the name in 1933.',
    topic: 'pakistan-history',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Sir Syed Ahmad Khan founded the Muhammadan Anglo-Oriental College in 1875 at…',
    stemUr: 'سر سید احمد خان نے 1875 میں محمڈن اینگلو اورینٹل کالج کہاں قائم کیا؟',
    options: [
      { key: 'A', textEn: 'Delhi', textUr: 'دہلی' },
      { key: 'B', textEn: 'Lucknow', textUr: 'لکھنؤ' },
      { key: 'C', textEn: 'Aligarh', textUr: 'علی گڑھ' },
      { key: 'D', textEn: 'Deoband', textUr: 'دیوبند' },
    ],
    correctOption: 'C',
    explanationEn:
      'The college at Aligarh became Aligarh Muslim University in 1920 and was the heart of the Aligarh Movement for Muslim education.',
    topic: 'pakistan-history',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'Who chaired the Boundary Commissions that drew the 1947 border between Pakistan and India in Punjab and Bengal?',
    stemUr:
      '1947 میں پنجاب اور بنگال میں پاکستان اور بھارت کی سرحد کھینچنے والے باؤنڈری کمیشنوں کے سربراہ کون تھے؟',
    options: [
      { key: 'A', textEn: 'Lord Mountbatten', textUr: 'لارڈ ماؤنٹ بیٹن' },
      { key: 'B', textEn: 'Sir Cyril Radcliffe', textUr: 'سر سیرل ریڈکلف' },
      { key: 'C', textEn: 'Sir Stafford Cripps', textUr: 'سر اسٹیفورڈ کرپس' },
      { key: 'D', textEn: 'Lord Wavell', textUr: 'لارڈ ویول' },
    ],
    correctOption: 'B',
    explanationEn:
      'Sir Cyril Radcliffe chaired both the Punjab and Bengal commissions; his award, the Radcliffe Line, was made public on 17 August 1947.',
    topic: 'pakistan-history',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'The Partition of Bengal carried out in 1905 was annulled in which year?',
    stemUr: '1905 میں کی گئی تقسیمِ بنگال کس سال منسوخ کی گئی؟',
    options: [
      { key: 'A', textEn: '1906', textUr: '1906' },
      { key: 'B', textEn: '1909', textUr: '1909' },
      { key: 'C', textEn: '1910', textUr: '1910' },
      { key: 'D', textEn: '1911', textUr: '1911' },
    ],
    correctOption: 'D',
    explanationEn:
      'The partition made under Lord Curzon was reversed in 1911, a decision announced at the Delhi Durbar, which deeply disappointed the Muslims of East Bengal.',
    topic: 'pakistan-history',
    difficulty: 'hard',
  },
  // ── Pakistan geography ────────────────────────────────────────────────────
  {
    testTypeCode: 'gk',
    stemEn: 'Which is the highest mountain peak in Pakistan?',
    stemUr: 'پاکستان کی بلند ترین پہاڑی چوٹی کون سی ہے؟',
    options: [
      { key: 'A', textEn: 'K2', textUr: 'کے ٹو' },
      { key: 'B', textEn: 'Nanga Parbat', textUr: 'نانگا پربت' },
      { key: 'C', textEn: 'Tirich Mir', textUr: 'ترچ میر' },
      { key: 'D', textEn: 'Rakaposhi', textUr: 'راکاپوشی' },
    ],
    correctOption: 'A',
    explanationEn:
      'K2 (8,611 m), in the Karakoram range of Gilgit-Baltistan, is Pakistan’s highest peak and the second-highest mountain in the world.',
    topic: 'pakistan-geography',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'The Khyber Pass links Pakistan with which country?',
    stemUr: 'درۂ خیبر پاکستان کو کس ملک سے ملاتا ہے؟',
    options: [
      { key: 'A', textEn: 'Iran', textUr: 'ایران' },
      { key: 'B', textEn: 'China', textUr: 'چین' },
      { key: 'C', textEn: 'Afghanistan', textUr: 'افغانستان' },
      { key: 'D', textEn: 'Tajikistan', textUr: 'تاجکستان' },
    ],
    correctOption: 'C',
    explanationEn:
      'The Khyber Pass, west of Peshawar, has for centuries been a key route between the subcontinent and Afghanistan.',
    topic: 'pakistan-geography',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Mangla Dam is built on which river?',
    stemUr: 'منگلا ڈیم کس دریا پر بنایا گیا ہے؟',
    options: [
      { key: 'A', textEn: 'Indus', textUr: 'سندھ' },
      { key: 'B', textEn: 'Chenab', textUr: 'چناب' },
      { key: 'C', textEn: 'Ravi', textUr: 'راوی' },
      { key: 'D', textEn: 'Jhelum', textUr: 'جہلم' },
    ],
    correctOption: 'D',
    explanationEn:
      'Mangla Dam on the Jhelum was built in the 1960s as part of the Indus Basin works; Tarbela Dam is on the Indus.',
    topic: 'pakistan-geography',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Which is the largest province of Pakistan by area?',
    stemUr: 'رقبے کے لحاظ سے پاکستان کا سب سے بڑا صوبہ کون سا ہے؟',
    options: [
      { key: 'A', textEn: 'Punjab', textUr: 'پنجاب' },
      { key: 'B', textEn: 'Balochistan', textUr: 'بلوچستان' },
      { key: 'C', textEn: 'Sindh', textUr: 'سندھ' },
      { key: 'D', textEn: 'Khyber Pakhtunkhwa', textUr: 'خیبر پختونخوا' },
    ],
    correctOption: 'B',
    explanationEn:
      'Balochistan is the largest province by area but the least populous of the four provinces.',
    topic: 'pakistan-geography',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Tirich Mir is the highest peak of which mountain range?',
    stemUr: 'ترچ میر کس پہاڑی سلسلے کی بلند ترین چوٹی ہے؟',
    options: [
      { key: 'A', textEn: 'Karakoram', textUr: 'قراقرم' },
      { key: 'B', textEn: 'Himalaya', textUr: 'ہمالیہ' },
      { key: 'C', textEn: 'Hindu Kush', textUr: 'ہندوکش' },
      { key: 'D', textEn: 'Sulaiman Range', textUr: 'کوہِ سلیمان' },
    ],
    correctOption: 'C',
    explanationEn:
      'Tirich Mir (about 7,700 m), in Chitral district of Khyber Pakhtunkhwa, is the highest peak of the Hindu Kush.',
    topic: 'pakistan-geography',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'The large Thar coalfield is located in which province of Pakistan?',
    stemUr: 'تھر کا وسیع کوئلے کا ذخیرہ پاکستان کے کس صوبے میں واقع ہے؟',
    options: [
      { key: 'A', textEn: 'Sindh', textUr: 'سندھ' },
      { key: 'B', textEn: 'Punjab', textUr: 'پنجاب' },
      { key: 'C', textEn: 'Balochistan', textUr: 'بلوچستان' },
      { key: 'D', textEn: 'Khyber Pakhtunkhwa', textUr: 'خیبر پختونخوا' },
    ],
    correctOption: 'A',
    explanationEn:
      'The Thar coalfield in Tharparkar district, Sindh, holds one of the largest lignite coal deposits in the world.',
    topic: 'pakistan-geography',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'The Khunjerab Pass on the Karakoram Highway connects Pakistan with…',
    stemUr: 'شاہراہِ قراقرم پر واقع درۂ خنجراب پاکستان کو کس ملک سے ملاتا ہے؟',
    options: [
      { key: 'A', textEn: 'Afghanistan', textUr: 'افغانستان' },
      { key: 'B', textEn: 'China', textUr: 'چین' },
      { key: 'C', textEn: 'India', textUr: 'بھارت' },
      { key: 'D', textEn: 'Tajikistan', textUr: 'تاجکستان' },
    ],
    correctOption: 'B',
    explanationEn:
      'At about 4,700 m, the Khunjerab Pass is the highest point of the Karakoram Highway and the border crossing between Pakistan and China.',
    topic: 'pakistan-geography',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Which peak in Pakistan is widely known as the "Killer Mountain"?',
    stemUr: 'پاکستان کی کون سی چوٹی "قاتل پہاڑ" کے نام سے مشہور ہے؟',
    options: [
      { key: 'A', textEn: 'K2', textUr: 'کے ٹو' },
      { key: 'B', textEn: 'Broad Peak', textUr: 'براڈ پیک' },
      { key: 'C', textEn: 'Rakaposhi', textUr: 'راکاپوشی' },
      { key: 'D', textEn: 'Nanga Parbat', textUr: 'نانگا پربت' },
    ],
    correctOption: 'D',
    explanationEn:
      'Nanga Parbat (8,126 m), the ninth-highest mountain in the world, earned the name because so many climbers lost their lives on it.',
    topic: 'pakistan-geography',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Which narrow strip of Afghan territory separates Pakistan from Tajikistan?',
    stemUr: 'افغانستان کی کون سی تنگ پٹی پاکستان کو تاجکستان سے جدا کرتی ہے؟',
    options: [
      { key: 'A', textEn: 'Wakhan Corridor', textUr: 'واخان راہداری' },
      { key: 'B', textEn: 'Siliguri Corridor', textUr: 'سلی گڑی راہداری' },
      { key: 'C', textEn: 'Ferghana Valley', textUr: 'وادیٔ فرغانہ' },
      { key: 'D', textEn: 'Panjshir Valley', textUr: 'وادیٔ پنجشیر' },
    ],
    correctOption: 'A',
    explanationEn:
      'The Wakhan Corridor is a narrow strip in north-eastern Afghanistan that separates Pakistan from Tajikistan and gives Afghanistan a short border with China.',
    topic: 'pakistan-geography',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Punjab takes its name from five rivers. Which of these is NOT one of them?',
    stemUr: 'پنجاب کا نام پانچ دریاؤں سے منسوب ہے۔ ان میں سے کون سا دریا ان پانچ میں شامل نہیں؟',
    options: [
      { key: 'A', textEn: 'Ravi', textUr: 'راوی' },
      { key: 'B', textEn: 'Chenab', textUr: 'چناب' },
      { key: 'C', textEn: 'Kabul', textUr: 'کابل' },
      { key: 'D', textEn: 'Sutlej', textUr: 'ستلج' },
    ],
    correctOption: 'C',
    explanationEn:
      'The five rivers are the Jhelum, Chenab, Ravi, Beas and Sutlej; the Kabul River flows from Afghanistan and joins the Indus near Attock.',
    topic: 'pakistan-geography',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'In which year was the Durand Line agreement, defining the frontier between British India and Afghanistan, signed?',
    stemUr:
      'برطانوی ہند اور افغانستان کے درمیان سرحد متعین کرنے والا ڈیورنڈ لائن معاہدہ کس سال ہوا؟',
    options: [
      { key: 'A', textEn: '1839', textUr: '1839' },
      { key: 'B', textEn: '1879', textUr: '1879' },
      { key: 'C', textEn: '1893', textUr: '1893' },
      { key: 'D', textEn: '1901', textUr: '1901' },
    ],
    correctOption: 'C',
    explanationEn:
      'Sir Mortimer Durand and Amir Abdur Rahman Khan signed the agreement in November 1893; the line marks the Pakistan–Afghanistan border.',
    topic: 'pakistan-geography',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Into which body of water does the Indus River finally drain?',
    stemUr: 'دریائے سندھ آخرکار کس سمندر میں جا گرتا ہے؟',
    options: [
      { key: 'A', textEn: 'Bay of Bengal', textUr: 'خلیجِ بنگال' },
      { key: 'B', textEn: 'Arabian Sea', textUr: 'بحیرۂ عرب' },
      { key: 'C', textEn: 'Persian Gulf', textUr: 'خلیجِ فارس' },
      { key: 'D', textEn: 'Caspian Sea', textUr: 'بحیرۂ کیسپین' },
    ],
    correctOption: 'B',
    explanationEn:
      'The Indus rises in Tibet, flows the length of Pakistan and enters the Arabian Sea through a delta south-east of Karachi.',
    topic: 'pakistan-geography',
    difficulty: 'easy',
  },
  // ── Constitution and government ───────────────────────────────────────────
  {
    testTypeCode: 'gk',
    stemEn: 'In which year did Pakistan’s first constitution come into force?',
    stemUr: 'پاکستان کا پہلا آئین کس سال نافذ ہوا؟',
    options: [
      { key: 'A', textEn: '1956', textUr: '1956' },
      { key: 'B', textEn: '1958', textUr: '1958' },
      { key: 'C', textEn: '1962', textUr: '1962' },
      { key: 'D', textEn: '1973', textUr: '1973' },
    ],
    correctOption: 'A',
    explanationEn:
      'The first constitution took effect on 23 March 1956 and declared Pakistan an Islamic Republic; it was abrogated in October 1958.',
    topic: 'constitution-and-government',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'On which date did the present Constitution of Pakistan come into force?',
    stemUr: 'پاکستان کا موجودہ آئین کس تاریخ کو نافذ ہوا؟',
    options: [
      { key: 'A', textEn: '23 March 1956', textUr: '23 مارچ 1956' },
      { key: 'B', textEn: '8 June 1962', textUr: '8 جون 1962' },
      { key: 'C', textEn: '21 April 1972', textUr: '21 اپریل 1972' },
      { key: 'D', textEn: '14 August 1973', textUr: '14 اگست 1973' },
    ],
    correctOption: 'D',
    explanationEn:
      'The 1973 Constitution was passed by the National Assembly on 10 April 1973 and came into force on 14 August 1973.',
    topic: 'constitution-and-government',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'What is the upper house of Pakistan’s Parliament called?',
    stemUr: 'پاکستان کی پارلیمنٹ کے ایوانِ بالا کو کیا کہتے ہیں؟',
    options: [
      { key: 'A', textEn: 'National Assembly', textUr: 'قومی اسمبلی' },
      { key: 'B', textEn: 'Senate', textUr: 'سینیٹ' },
      { key: 'C', textEn: 'Provincial Assembly', textUr: 'صوبائی اسمبلی' },
      { key: 'D', textEn: 'Council of Common Interests', textUr: 'مشترکہ مفادات کونسل' },
    ],
    correctOption: 'B',
    explanationEn:
      'Parliament (Majlis-e-Shoora) consists of the President and two houses: the National Assembly and the Senate, in which each province has equal representation.',
    topic: 'constitution-and-government',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'Which constitutional amendment renamed the North-West Frontier Province as Khyber Pakhtunkhwa?',
    stemUr: 'کس آئینی ترمیم کے ذریعے صوبہ سرحد کا نام خیبر پختونخوا رکھا گیا؟',
    options: [
      { key: 'A', textEn: '8th Amendment', textUr: 'آٹھویں ترمیم' },
      { key: 'B', textEn: '13th Amendment', textUr: 'تیرہویں ترمیم' },
      { key: 'C', textEn: '18th Amendment', textUr: 'اٹھارہویں ترمیم' },
      { key: 'D', textEn: '21st Amendment', textUr: 'اکیسویں ترمیم' },
    ],
    correctOption: 'C',
    explanationEn:
      'The 18th Amendment (April 2010) renamed the province, abolished the Concurrent Legislative List and devolved many subjects to the provinces.',
    topic: 'constitution-and-government',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Which Article of the 1973 Constitution deals with high treason?',
    stemUr: '1973 کے آئین کا کون سا آرٹیکل سنگین غداری سے متعلق ہے؟',
    options: [
      { key: 'A', textEn: 'Article 6', textUr: 'آرٹیکل 6' },
      { key: 'B', textEn: 'Article 19', textUr: 'آرٹیکل 19' },
      { key: 'C', textEn: 'Article 62', textUr: 'آرٹیکل 62' },
      { key: 'D', textEn: 'Article 245', textUr: 'آرٹیکل 245' },
    ],
    correctOption: 'A',
    explanationEn:
      'Article 6 declares that abrogating, subverting or suspending the Constitution by the use of force or other unconstitutional means is high treason.',
    topic: 'constitution-and-government',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'Which Article, inserted by the 18th Amendment, makes free and compulsory education for children aged 5 to 16 a fundamental right?',
    stemUr:
      'اٹھارہویں ترمیم کے ذریعے شامل کیا گیا کون سا آرٹیکل 5 سے 16 سال کی عمر کے بچوں کے لیے مفت اور لازمی تعلیم کو بنیادی حق قرار دیتا ہے؟',
    options: [
      { key: 'A', textEn: 'Article 10-A', textUr: 'آرٹیکل 10-اے' },
      { key: 'B', textEn: 'Article 25-A', textUr: 'آرٹیکل 25-اے' },
      { key: 'C', textEn: 'Article 19-A', textUr: 'آرٹیکل 19-اے' },
      { key: 'D', textEn: 'Article 38', textUr: 'آرٹیکل 38' },
    ],
    correctOption: 'B',
    explanationEn:
      'Article 25-A obliges the State to provide free and compulsory education to all children aged five to sixteen. Articles 10-A (fair trial) and 19-A (right to information) were added by the same amendment.',
    topic: 'constitution-and-government',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'Under the Constitution, who acts as President if the office of President falls vacant?',
    stemUr: 'آئین کے مطابق صدر کا عہدہ خالی ہونے کی صورت میں قائم مقام صدر کون ہوتا ہے؟',
    options: [
      { key: 'A', textEn: 'The Prime Minister', textUr: 'وزیرِاعظم' },
      { key: 'B', textEn: 'The Chief Justice of Pakistan', textUr: 'چیف جسٹس آف پاکستان' },
      { key: 'C', textEn: 'The Chairman of the Senate', textUr: 'چیئرمین سینیٹ' },
      { key: 'D', textEn: 'The Chief Election Commissioner', textUr: 'چیف الیکشن کمشنر' },
    ],
    correctOption: 'C',
    explanationEn:
      'Under Article 49 the Chairman of the Senate acts as President; if the Chairman is unable to do so, the Speaker of the National Assembly takes on the role.',
    topic: 'constitution-and-government',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'What is the minimum age for a person to be elected President of Pakistan?',
    stemUr: 'پاکستان کا صدر منتخب ہونے کے لیے کم از کم عمر کتنی ہونی چاہیے؟',
    options: [
      { key: 'A', textEn: '30 years', textUr: '30 سال' },
      { key: 'B', textEn: '35 years', textUr: '35 سال' },
      { key: 'C', textEn: '40 years', textUr: '40 سال' },
      { key: 'D', textEn: '45 years', textUr: '45 سال' },
    ],
    correctOption: 'D',
    explanationEn:
      'Article 41 requires the President to be a Muslim of at least 45 years of age who is qualified to be elected as a member of the National Assembly.',
    topic: 'constitution-and-government',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'Which Article of the Constitution declares Urdu to be the national language of Pakistan?',
    stemUr: 'آئین کا کون سا آرٹیکل اردو کو پاکستان کی قومی زبان قرار دیتا ہے؟',
    options: [
      { key: 'A', textEn: 'Article 2', textUr: 'آرٹیکل 2' },
      { key: 'B', textEn: 'Article 251', textUr: 'آرٹیکل 251' },
      { key: 'C', textEn: 'Article 227', textUr: 'آرٹیکل 227' },
      { key: 'D', textEn: 'Article 260', textUr: 'آرٹیکل 260' },
    ],
    correctOption: 'B',
    explanationEn:
      'Article 251 names Urdu as the national language and allows provincial assemblies to promote provincial languages alongside it.',
    topic: 'constitution-and-government',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Which of these introduced a presidential form of government in Pakistan?',
    stemUr: 'ان میں سے کس نے پاکستان میں صدارتی طرزِ حکومت متعارف کرایا؟',
    options: [
      { key: 'A', textEn: 'The 1956 Constitution', textUr: '1956 کا آئین' },
      { key: 'B', textEn: 'The 1962 Constitution', textUr: '1962 کا آئین' },
      { key: 'C', textEn: 'The 1973 Constitution', textUr: '1973 کا آئین' },
      {
        key: 'D',
        textEn: 'The Government of India Act 1935',
        textUr: 'گورنمنٹ آف انڈیا ایکٹ 1935',
      },
    ],
    correctOption: 'B',
    explanationEn:
      'The 1962 Constitution, introduced under President Ayub Khan, created a presidential system with indirect elections through Basic Democracies; the 1956 and 1973 constitutions are parliamentary.',
    topic: 'constitution-and-government',
    difficulty: 'medium',
  },
  // ── Defence ───────────────────────────────────────────────────────────────
  {
    testTypeCode: 'gk',
    stemEn: 'The Pakistan Military Academy is located at Kakul, near which city?',
    stemUr: 'پاکستان ملٹری اکیڈمی کاکول کس شہر کے قریب واقع ہے؟',
    options: [
      { key: 'A', textEn: 'Abbottabad', textUr: 'ایبٹ آباد' },
      { key: 'B', textEn: 'Mansehra', textUr: 'مانسہرہ' },
      { key: 'C', textEn: 'Murree', textUr: 'مری' },
      { key: 'D', textEn: 'Rawalpindi', textUr: 'راولپنڈی' },
    ],
    correctOption: 'A',
    explanationEn:
      'PMA Kakul, near Abbottabad in Khyber Pakhtunkhwa, is where officer cadets of the Pakistan Army receive their initial training.',
    topic: 'defence',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'The PAF Academy Asghar Khan, where Air Force officer cadets are trained, is located at…',
    stemUr: 'پی اے ایف اکیڈمی اصغر خان، جہاں فضائیہ کے افسر کیڈٹس تربیت پاتے ہیں، کہاں واقع ہے؟',
    options: [
      { key: 'A', textEn: 'Kamra', textUr: 'کامرہ' },
      { key: 'B', textEn: 'Risalpur', textUr: 'رسالپور' },
      { key: 'C', textEn: 'Sargodha', textUr: 'سرگودھا' },
      { key: 'D', textEn: 'Kohat', textUr: 'کوہاٹ' },
    ],
    correctOption: 'B',
    explanationEn:
      'The PAF’s main academy for officer cadets is at Risalpur, near Nowshera in Khyber Pakhtunkhwa.',
    topic: 'defence',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'The Pakistan Naval Academy is located in which city?',
    stemUr: 'پاکستان نیول اکیڈمی کس شہر میں واقع ہے؟',
    options: [
      { key: 'A', textEn: 'Gwadar', textUr: 'گوادر' },
      { key: 'B', textEn: 'Ormara', textUr: 'اورماڑہ' },
      { key: 'C', textEn: 'Lahore', textUr: 'لاہور' },
      { key: 'D', textEn: 'Karachi', textUr: 'کراچی' },
    ],
    correctOption: 'D',
    explanationEn:
      'The Pakistan Naval Academy (PNS Rahbar) at Manora, Karachi, trains the officer cadets of the Pakistan Navy.',
    topic: 'defence',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Who was the first recipient of the Nishan-e-Haider?',
    stemUr: 'نشانِ حیدر پانے والے پہلے فرد کون تھے؟',
    options: [
      { key: 'A', textEn: 'Major Raja Aziz Bhatti', textUr: 'میجر راجہ عزیز بھٹی' },
      { key: 'B', textEn: 'Captain Raja Muhammad Sarwar', textUr: 'کیپٹن راجہ محمد سرور' },
      { key: 'C', textEn: 'Major Tufail Muhammad', textUr: 'میجر طفیل محمد' },
      { key: 'D', textEn: 'Pilot Officer Rashid Minhas', textUr: 'پائلٹ آفیسر راشد منہاس' },
    ],
    correctOption: 'B',
    explanationEn:
      'Captain Raja Muhammad Sarwar was awarded it posthumously for his action in the Uri sector of Kashmir in July 1948.',
    topic: 'defence',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'Major Raja Aziz Bhatti was awarded the Nishan-e-Haider for his gallantry in which war?',
    stemUr: 'میجر راجہ عزیز بھٹی کو کس جنگ میں بہادری پر نشانِ حیدر عطا کیا گیا؟',
    options: [
      { key: 'A', textEn: '1948', textUr: '1948' },
      { key: 'B', textEn: '1965', textUr: '1965' },
      { key: 'C', textEn: '1971', textUr: '1971' },
      { key: 'D', textEn: '1999', textUr: '1999' },
    ],
    correctOption: 'B',
    explanationEn:
      'He held his position on the BRB Canal in the Lahore sector for several days in September 1965 before being martyred.',
    topic: 'defence',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Who is the only Pakistan Air Force officer to have been awarded the Nishan-e-Haider?',
    stemUr: 'پاک فضائیہ کے وہ واحد افسر کون ہیں جنہیں نشانِ حیدر عطا کیا گیا؟',
    options: [
      { key: 'A', textEn: 'Squadron Leader M. M. Alam', textUr: 'اسکواڈرن لیڈر ایم ایم عالم' },
      {
        key: 'B',
        textEn: 'Squadron Leader Sarfaraz Rafiqui',
        textUr: 'اسکواڈرن لیڈر سرفراز رفیقی',
      },
      { key: 'C', textEn: 'Pilot Officer Rashid Minhas', textUr: 'پائلٹ آفیسر راشد منہاس' },
      {
        key: 'D',
        textEn: 'Flight Lieutenant Cecil Chaudhry',
        textUr: 'فلائٹ لیفٹیننٹ سیسل چوہدری',
      },
    ],
    correctOption: 'C',
    explanationEn:
      'Rashid Minhas, aged 20, was martyred on 20 August 1971 while struggling to stop his trainer aircraft from being flown across the border; he is the youngest recipient.',
    topic: 'defence',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'Captain Karnal Sher Khan and Havildar Lalak Jan received the Nishan-e-Haider for their actions in which conflict?',
    stemUr: 'کیپٹن کرنل شیر خان اور حوالدار لالک جان کو کس معرکے میں کارکردگی پر نشانِ حیدر ملا؟',
    options: [
      { key: 'A', textEn: 'The 1948 Kashmir war', textUr: '1948 کی جنگِ کشمیر' },
      { key: 'B', textEn: 'The 1965 war', textUr: '1965 کی جنگ' },
      { key: 'C', textEn: 'The 1971 war', textUr: '1971 کی جنگ' },
      { key: 'D', textEn: 'The 1999 Kargil conflict', textUr: '1999 کا کارگل معرکہ' },
    ],
    correctOption: 'D',
    explanationEn:
      'Both were awarded the Nishan-e-Haider posthumously for their actions in the Kargil sector in 1999.',
    topic: 'defence',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'Squadron Leader M. M. Alam, remembered for his air combat near Sargodha in 1965, was flying which aircraft?',
    stemUr:
      '1965 میں سرگودھا کے قریب فضائی معرکے کے لیے مشہور اسکواڈرن لیڈر ایم ایم عالم کون سا طیارہ اڑا رہے تھے؟',
    options: [
      { key: 'A', textEn: 'F-104 Starfighter', textUr: 'ایف-104 اسٹار فائٹر' },
      { key: 'B', textEn: 'F-86 Sabre', textUr: 'ایف-86 سیبر' },
      { key: 'C', textEn: 'Mirage III', textUr: 'میراج III' },
      { key: 'D', textEn: 'B-57 Canberra', textUr: 'بی-57 کینبرا' },
    ],
    correctOption: 'B',
    explanationEn:
      'Flying an F-86 Sabre on 7 September 1965, he was credited by the PAF with shooting down several Indian aircraft in a single engagement.',
    topic: 'defence',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Pakistan observes Defence Day every year on…',
    stemUr: 'پاکستان ہر سال یومِ دفاع کس تاریخ کو مناتا ہے؟',
    options: [
      { key: 'A', textEn: '23 March', textUr: '23 مارچ' },
      { key: 'B', textEn: '14 August', textUr: '14 اگست' },
      { key: 'C', textEn: '6 September', textUr: '6 ستمبر' },
      { key: 'D', textEn: '25 December', textUr: '25 دسمبر' },
    ],
    correctOption: 'C',
    explanationEn:
      'It marks 6 September 1965, when Indian forces attacked across the international border towards Lahore, and honours the defence of the country in that war.',
    topic: 'defence',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'An Army Brigadier is equivalent in rank to which Pakistan Air Force rank?',
    stemUr: 'پاک فوج کے بریگیڈیئر کے مساوی پاک فضائیہ کا عہدہ کون سا ہے؟',
    options: [
      { key: 'A', textEn: 'Air Commodore', textUr: 'ایئر کموڈور' },
      { key: 'B', textEn: 'Group Captain', textUr: 'گروپ کیپٹن' },
      { key: 'C', textEn: 'Air Vice Marshal', textUr: 'ایئر وائس مارشل' },
      { key: 'D', textEn: 'Wing Commander', textUr: 'ونگ کمانڈر' },
    ],
    correctOption: 'A',
    explanationEn:
      'Brigadier (Army), Commodore (Navy) and Air Commodore (PAF) are equivalent one-star ranks; a Group Captain equals an Army Colonel.',
    topic: 'defence',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Which Pakistan Navy rank is equivalent to an Army Lieutenant Colonel?',
    stemUr: 'پاک بحریہ کا کون سا عہدہ پاک فوج کے لیفٹیننٹ کرنل کے مساوی ہے؟',
    options: [
      { key: 'A', textEn: 'Lieutenant Commander', textUr: 'لیفٹیننٹ کمانڈر' },
      { key: 'B', textEn: 'Captain', textUr: 'کیپٹن' },
      { key: 'C', textEn: 'Commander', textUr: 'کمانڈر' },
      { key: 'D', textEn: 'Commodore', textUr: 'کموڈور' },
    ],
    correctOption: 'C',
    explanationEn:
      'A Navy Commander and a PAF Wing Commander both equal an Army Lieutenant Colonel; a Navy Captain equals an Army Colonel.',
    topic: 'defence',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'Pakistan’s nuclear tests of 28 May 1998 were conducted in the Ras Koh Hills of which district?',
    stemUr: '28 مئی 1998 کو پاکستان کے ایٹمی دھماکے کس ضلع کے راس کوہ پہاڑوں میں کیے گئے؟',
    options: [
      { key: 'A', textEn: 'Tharparkar', textUr: 'تھرپارکر' },
      { key: 'B', textEn: 'Gwadar', textUr: 'گوادر' },
      { key: 'C', textEn: 'Zhob', textUr: 'ژوب' },
      { key: 'D', textEn: 'Chagai', textUr: 'چاغی' },
    ],
    correctOption: 'D',
    explanationEn:
      'The tests in Chagai district, Balochistan, made Pakistan a declared nuclear power; 28 May is observed as Youm-e-Takbeer.',
    topic: 'defence',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'The JF-17 Thunder fighter aircraft was jointly developed by Pakistan and…',
    stemUr: 'جے ایف-17 تھنڈر لڑاکا طیارہ پاکستان نے کس ملک کے ساتھ مل کر تیار کیا؟',
    options: [
      { key: 'A', textEn: 'China', textUr: 'چین' },
      { key: 'B', textEn: 'Turkey', textUr: 'ترکی' },
      { key: 'C', textEn: 'France', textUr: 'فرانس' },
      { key: 'D', textEn: 'Russia', textUr: 'روس' },
    ],
    correctOption: 'A',
    explanationEn:
      'The JF-17 was co-developed by the Pakistan Aeronautical Complex, Kamra, and China’s Chengdu Aircraft Corporation.',
    topic: 'defence',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'The Al-Khalid main battle tank is manufactured at…',
    stemUr: 'الخالد مین بیٹل ٹینک کہاں تیار کیا جاتا ہے؟',
    options: [
      {
        key: 'A',
        textEn: 'Pakistan Ordnance Factories, Wah',
        textUr: 'پاکستان آرڈیننس فیکٹریز واہ',
      },
      {
        key: 'B',
        textEn: 'Pakistan Aeronautical Complex, Kamra',
        textUr: 'پاکستان ایروناٹیکل کمپلیکس کامرہ',
      },
      { key: 'C', textEn: 'Heavy Industries Taxila', textUr: 'ہیوی انڈسٹریز ٹیکسلا' },
      {
        key: 'D',
        textEn: 'Karachi Shipyard & Engineering Works',
        textUr: 'کراچی شپ یارڈ اینڈ انجینئرنگ ورکس',
      },
    ],
    correctOption: 'C',
    explanationEn:
      'Al-Khalid was developed with Chinese cooperation and is produced at Heavy Industries Taxila; POF Wah mainly makes arms and ammunition.',
    topic: 'defence',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'The Command and Staff College of the Pakistan Army is located in…',
    stemUr: 'پاک فوج کا کمانڈ اینڈ اسٹاف کالج کہاں واقع ہے؟',
    options: [
      { key: 'A', textEn: 'Abbottabad', textUr: 'ایبٹ آباد' },
      { key: 'B', textEn: 'Lahore', textUr: 'لاہور' },
      { key: 'C', textEn: 'Islamabad', textUr: 'اسلام آباد' },
      { key: 'D', textEn: 'Quetta', textUr: 'کوئٹہ' },
    ],
    correctOption: 'D',
    explanationEn:
      'Established in 1905 and based at Quetta since 1907, the college prepares mid-career officers for staff and command appointments.',
    topic: 'defence',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'Major Muhammad Akram, remembered as the "Hero of Hilli", was awarded the Nishan-e-Haider for his actions in which war?',
    stemUr:
      '"ہیرو آف ہلی" کے نام سے یاد کیے جانے والے میجر محمد اکرم کو کس جنگ میں کارکردگی پر نشانِ حیدر عطا کیا گیا؟',
    options: [
      { key: 'A', textEn: '1948', textUr: '1948' },
      { key: 'B', textEn: '1965', textUr: '1965' },
      { key: 'C', textEn: '1971', textUr: '1971' },
      { key: 'D', textEn: '1999', textUr: '1999' },
    ],
    correctOption: 'C',
    explanationEn:
      'He was martyred in 1971 while defending the Hilli sector in what was then East Pakistan.',
    topic: 'defence',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'The Tashkent Declaration of January 1966, which formally ended the 1965 war, was brokered by which country?',
    stemUr:
      'جنوری 1966 کا اعلانِ تاشقند، جس سے 1965 کی جنگ باضابطہ طور پر ختم ہوئی، کس ملک کی ثالثی میں طے پایا؟',
    options: [
      { key: 'A', textEn: 'Soviet Union', textUr: 'سوویت یونین' },
      { key: 'B', textEn: 'United States', textUr: 'امریکہ' },
      { key: 'C', textEn: 'United Kingdom', textUr: 'برطانیہ' },
      { key: 'D', textEn: 'China', textUr: 'چین' },
    ],
    correctOption: 'A',
    explanationEn:
      'Soviet Premier Alexei Kosygin hosted President Ayub Khan and Prime Minister Lal Bahadur Shastri at Tashkent, where the declaration was signed on 10 January 1966.',
    topic: 'defence',
    difficulty: 'medium',
  },
  // ── Islamic history ───────────────────────────────────────────────────────
  {
    testTypeCode: 'gk',
    stemEn: 'The Battle of Badr took place in which year of the Hijrah?',
    stemUr: 'غزوۂ بدر ہجرت کے کس سال پیش آیا؟',
    options: [
      { key: 'A', textEn: '2 AH', textUr: '2 ہجری' },
      { key: 'B', textEn: '3 AH', textUr: '3 ہجری' },
      { key: 'C', textEn: '5 AH', textUr: '5 ہجری' },
      { key: 'D', textEn: '8 AH', textUr: '8 ہجری' },
    ],
    correctOption: 'A',
    explanationEn:
      'Fought in Ramadan 2 AH (624 CE), Badr was the first major battle in Islamic history, won by a small Muslim force against a much larger army of the Quraysh.',
    topic: 'islamic-history',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'In which year CE did the Holy Prophet (PBUH) migrate from Makkah to Madinah?',
    stemUr: 'حضور نبی اکرم ﷺ نے مکہ سے مدینہ کی طرف ہجرت کس عیسوی سال میں فرمائی؟',
    options: [
      { key: 'A', textEn: '610', textUr: '610' },
      { key: 'B', textEn: '615', textUr: '615' },
      { key: 'C', textEn: '619', textUr: '619' },
      { key: 'D', textEn: '622', textUr: '622' },
    ],
    correctOption: 'D',
    explanationEn: 'The Hijrah of 622 CE marks the starting point of the Islamic (Hijri) calendar.',
    topic: 'islamic-history',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Muhammad bin Qasim conquered Sindh in which year CE?',
    stemUr: 'محمد بن قاسم نے سندھ کس عیسوی سال میں فتح کیا؟',
    options: [
      { key: 'A', textEn: '712', textUr: '712' },
      { key: 'B', textEn: '750', textUr: '750' },
      { key: 'C', textEn: '1001', textUr: '1001' },
      { key: 'D', textEn: '1192', textUr: '1192' },
    ],
    correctOption: 'A',
    explanationEn:
      'Sent by the Umayyad governor Hajjaj bin Yusuf, he captured Debal and defeated Raja Dahir, bringing Sindh under Muslim rule in 712 CE.',
    topic: 'islamic-history',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'Which ruler is known for leading seventeen military expeditions into the Indian subcontinent?',
    stemUr: 'برصغیر پر سترہ فوجی مہمات کے لیے کون سا حکمران مشہور ہے؟',
    options: [
      { key: 'A', textEn: 'Muhammad Ghori', textUr: 'شہاب الدین محمد غوری' },
      { key: 'B', textEn: 'Timur', textUr: 'امیر تیمور' },
      { key: 'C', textEn: 'Nadir Shah', textUr: 'نادر شاہ' },
      { key: 'D', textEn: 'Mahmud of Ghazni', textUr: 'محمود غزنوی' },
    ],
    correctOption: 'D',
    explanationEn:
      'Mahmud of Ghazni (ruled 998–1030) is traditionally credited with seventeen campaigns into India from his capital at Ghazni.',
    topic: 'islamic-history',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'The Mughal Empire was founded after the First Battle of Panipat in which year?',
    stemUr: 'مغلیہ سلطنت پانی پت کی پہلی جنگ کے بعد کس سال قائم ہوئی؟',
    options: [
      { key: 'A', textEn: '1206', textUr: '1206' },
      { key: 'B', textEn: '1398', textUr: '1398' },
      { key: 'C', textEn: '1451', textUr: '1451' },
      { key: 'D', textEn: '1526', textUr: '1526' },
    ],
    correctOption: 'D',
    explanationEn:
      'In 1526 Zahir-ud-Din Babur defeated Ibrahim Lodi at Panipat and founded the Mughal Empire.',
    topic: 'islamic-history',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Who founded the Delhi Sultanate in 1206?',
    stemUr: '1206 میں سلطنتِ دہلی کی بنیاد کس نے رکھی؟',
    options: [
      { key: 'A', textEn: 'Qutb-ud-din Aibak', textUr: 'قطب الدین ایبک' },
      { key: 'B', textEn: 'Iltutmish', textUr: 'التتمش' },
      { key: 'C', textEn: 'Alauddin Khilji', textUr: 'علاؤالدین خلجی' },
      { key: 'D', textEn: 'Ghiyas-ud-din Balban', textUr: 'غیاث الدین بلبن' },
    ],
    correctOption: 'A',
    explanationEn:
      'Qutb-ud-din Aibak, a general of Muhammad Ghori, became the first Sultan of Delhi and founded the Mamluk (Slave) dynasty; he also began building the Qutb Minar.',
    topic: 'islamic-history',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'In which year did Sultan Salahuddin Ayyubi recapture Jerusalem?',
    stemUr: 'سلطان صلاح الدین ایوبی نے بیت المقدس کس سال دوبارہ فتح کیا؟',
    options: [
      { key: 'A', textEn: '1099', textUr: '1099' },
      { key: 'B', textEn: '1187', textUr: '1187' },
      { key: 'C', textEn: '1258', textUr: '1258' },
      { key: 'D', textEn: '1453', textUr: '1453' },
    ],
    correctOption: 'B',
    explanationEn:
      'After his victory at the Battle of Hattin, Salahuddin took Jerusalem in October 1187, 88 years after it fell to the First Crusade in 1099.',
    topic: 'islamic-history',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Which Ottoman Sultan conquered Constantinople in 1453?',
    stemUr: 'کس عثمانی سلطان نے 1453 میں قسطنطنیہ فتح کیا؟',
    options: [
      { key: 'A', textEn: 'Osman I', textUr: 'عثمان اول' },
      { key: 'B', textEn: 'Selim I', textUr: 'سلیم اول' },
      { key: 'C', textEn: 'Mehmed II', textUr: 'سلطان محمد ثانی (محمد فاتح)' },
      { key: 'D', textEn: 'Suleiman the Magnificent', textUr: 'سلیمان عالیشان' },
    ],
    correctOption: 'C',
    explanationEn:
      'Mehmed II, known as "al-Fatih" (the Conqueror), took the city in May 1453, ending the Byzantine Empire; as Istanbul it became the Ottoman capital.',
    topic: 'islamic-history',
    difficulty: 'easy',
  },
  // ── World geography ───────────────────────────────────────────────────────
  {
    testTypeCode: 'gk',
    stemEn: 'Which is the largest ocean on Earth?',
    stemUr: 'زمین کا سب سے بڑا سمندر کون سا ہے؟',
    options: [
      { key: 'A', textEn: 'Atlantic Ocean', textUr: 'بحرِ اوقیانوس' },
      { key: 'B', textEn: 'Indian Ocean', textUr: 'بحرِ ہند' },
      { key: 'C', textEn: 'Arctic Ocean', textUr: 'بحرِ منجمد شمالی' },
      { key: 'D', textEn: 'Pacific Ocean', textUr: 'بحرالکاہل' },
    ],
    correctOption: 'D',
    explanationEn:
      'The Pacific covers roughly a third of Earth’s surface, more than all the land areas combined.',
    topic: 'world-geography',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Mount Everest lies on the border between Nepal and…',
    stemUr: 'ماؤنٹ ایورسٹ نیپال اور کس ملک کی سرحد پر واقع ہے؟',
    options: [
      { key: 'A', textEn: 'India', textUr: 'بھارت' },
      { key: 'B', textEn: 'China', textUr: 'چین' },
      { key: 'C', textEn: 'Bhutan', textUr: 'بھوٹان' },
      { key: 'D', textEn: 'Pakistan', textUr: 'پاکستان' },
    ],
    correctOption: 'B',
    explanationEn:
      'Everest, the world’s highest peak (about 8,849 m), stands on the Nepal–China (Tibet) border in the Himalaya.',
    topic: 'world-geography',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Which is the largest hot desert in the world?',
    stemUr: 'دنیا کا سب سے بڑا گرم صحرا کون سا ہے؟',
    options: [
      { key: 'A', textEn: 'Sahara', textUr: 'صحرائے اعظم (صحارا)' },
      { key: 'B', textEn: 'Arabian Desert', textUr: 'صحرائے عرب' },
      { key: 'C', textEn: 'Gobi', textUr: 'صحرائے گوبی' },
      { key: 'D', textEn: 'Thar', textUr: 'صحرائے تھر' },
    ],
    correctOption: 'A',
    explanationEn:
      'The Sahara in North Africa is the largest hot desert; if cold polar deserts are counted, Antarctica is larger.',
    topic: 'world-geography',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Which strait separates Spain in Europe from Morocco in Africa?',
    stemUr: 'کون سی آبنائے یورپ میں اسپین کو افریقہ میں مراکش سے جدا کرتی ہے؟',
    options: [
      { key: 'A', textEn: 'Strait of Hormuz', textUr: 'آبنائے ہرمز' },
      { key: 'B', textEn: 'Bosporus', textUr: 'آبنائے باسفورس' },
      { key: 'C', textEn: 'Strait of Gibraltar', textUr: 'آبنائے جبل الطارق' },
      { key: 'D', textEn: 'Strait of Malacca', textUr: 'آبنائے ملاکا' },
    ],
    correctOption: 'C',
    explanationEn:
      'The Strait of Gibraltar links the Atlantic Ocean with the Mediterranean Sea; its name comes from Jabal al-Tariq, after the commander Tariq bin Ziyad.',
    topic: 'world-geography',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'The Strait of Hormuz connects the Persian Gulf with…',
    stemUr: 'آبنائے ہرمز خلیجِ فارس کو کس سے ملاتی ہے؟',
    options: [
      { key: 'A', textEn: 'The Red Sea', textUr: 'بحیرۂ احمر' },
      { key: 'B', textEn: 'The Gulf of Aden', textUr: 'خلیجِ عدن' },
      { key: 'C', textEn: 'The Caspian Sea', textUr: 'بحیرۂ کیسپین' },
      { key: 'D', textEn: 'The Gulf of Oman', textUr: 'خلیجِ عمان' },
    ],
    correctOption: 'D',
    explanationEn:
      'Lying between Iran and Oman, the strait links the Persian Gulf to the Gulf of Oman and the Arabian Sea, making it a vital oil shipping route.',
    topic: 'world-geography',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'The lowest point on dry land on Earth is found on the shore of the…',
    stemUr: 'زمین پر خشکی کا سب سے نشیبی مقام کس کے کنارے پر واقع ہے؟',
    options: [
      { key: 'A', textEn: 'Dead Sea', textUr: 'بحیرۂ مردار' },
      { key: 'B', textEn: 'Caspian Sea', textUr: 'بحیرۂ کیسپین' },
      { key: 'C', textEn: 'Death Valley', textUr: 'ڈیتھ ویلی' },
      { key: 'D', textEn: 'Lake Assal', textUr: 'جھیل عسل' },
    ],
    correctOption: 'A',
    explanationEn:
      'The shore of the Dead Sea lies more than 400 metres below sea level, the lowest exposed land on Earth.',
    topic: 'world-geography',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'What is the largest inland body of water in the world by surface area?',
    stemUr: 'سطحی رقبے کے لحاظ سے دنیا کا سب سے بڑا اندرونی آبی ذخیرہ کون سا ہے؟',
    options: [
      { key: 'A', textEn: 'Lake Superior', textUr: 'جھیل سپیریئر' },
      { key: 'B', textEn: 'Caspian Sea', textUr: 'بحیرۂ کیسپین' },
      { key: 'C', textEn: 'Lake Victoria', textUr: 'جھیل وکٹوریہ' },
      { key: 'D', textEn: 'Lake Baikal', textUr: 'جھیل بیکال' },
    ],
    correctOption: 'B',
    explanationEn:
      'Despite its name, the Caspian Sea is an enclosed body of water and the largest by area; Lake Superior is the largest freshwater lake by area.',
    topic: 'world-geography',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Which is the deepest lake in the world?',
    stemUr: 'دنیا کی سب سے گہری جھیل کون سی ہے؟',
    options: [
      { key: 'A', textEn: 'Lake Tanganyika', textUr: 'جھیل ٹانگانیکا' },
      { key: 'B', textEn: 'Lake Superior', textUr: 'جھیل سپیریئر' },
      { key: 'C', textEn: 'Lake Baikal', textUr: 'جھیل بیکال' },
      { key: 'D', textEn: 'Lake Titicaca', textUr: 'جھیل ٹیٹیکاکا' },
    ],
    correctOption: 'C',
    explanationEn:
      'Lake Baikal in Siberia, Russia, is more than 1,600 m deep and holds about a fifth of the world’s unfrozen surface fresh water.',
    topic: 'world-geography',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Challenger Deep, the deepest known point in the oceans, lies in which trench?',
    stemUr: 'سمندروں کا سب سے گہرا معلوم مقام "چیلنجر ڈیپ" کس سمندری کھائی میں واقع ہے؟',
    options: [
      { key: 'A', textEn: 'Tonga Trench', textUr: 'ٹونگا کھائی' },
      { key: 'B', textEn: 'Mariana Trench', textUr: 'ماریانا کھائی' },
      { key: 'C', textEn: 'Java Trench', textUr: 'جاوا کھائی' },
      { key: 'D', textEn: 'Puerto Rico Trench', textUr: 'پورٹو ریکو کھائی' },
    ],
    correctOption: 'B',
    explanationEn:
      'The Mariana Trench in the western Pacific reaches nearly 11,000 m at Challenger Deep.',
    topic: 'world-geography',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'The Tropic of Cancer lies at approximately which latitude?',
    stemUr: 'خطِ سرطان تقریباً کس عرض بلد پر واقع ہے؟',
    options: [
      { key: 'A', textEn: '23.5° N', textUr: '23.5° شمالی' },
      { key: 'B', textEn: '23.5° S', textUr: '23.5° جنوبی' },
      { key: 'C', textEn: '66.5° N', textUr: '66.5° شمالی' },
      { key: 'D', textEn: '66.5° S', textUr: '66.5° جنوبی' },
    ],
    correctOption: 'A',
    explanationEn:
      'The Tropic of Cancer (about 23.5° N) is the northernmost latitude at which the Sun can be directly overhead at noon, which happens at the June solstice.',
    topic: 'world-geography',
    difficulty: 'hard',
  },
  // ── International organisations ───────────────────────────────────────────
  {
    testTypeCode: 'gk',
    stemEn: 'In which year did the United Nations come into existence?',
    stemUr: 'اقوامِ متحدہ کس سال وجود میں آئی؟',
    options: [
      { key: 'A', textEn: '1919', textUr: '1919' },
      { key: 'B', textEn: '1935', textUr: '1935' },
      { key: 'C', textEn: '1942', textUr: '1942' },
      { key: 'D', textEn: '1945', textUr: '1945' },
    ],
    correctOption: 'D',
    explanationEn:
      'The UN Charter came into force on 24 October 1945, a date now observed as United Nations Day.',
    topic: 'international-organisations',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Where is the permanent secretariat of the Organisation of Islamic Cooperation (OIC)?',
    stemUr: 'اسلامی تعاون تنظیم (او آئی سی) کا مستقل سیکرٹریٹ کہاں ہے؟',
    options: [
      { key: 'A', textEn: 'Riyadh', textUr: 'ریاض' },
      { key: 'B', textEn: 'Cairo', textUr: 'قاہرہ' },
      { key: 'C', textEn: 'Jeddah', textUr: 'جدہ' },
      { key: 'D', textEn: 'Istanbul', textUr: 'استنبول' },
    ],
    correctOption: 'C',
    explanationEn:
      'Founded at the Rabat summit in 1969, the OIC is based in Jeddah, Saudi Arabia; Pakistan hosted its second summit at Lahore in 1974.',
    topic: 'international-organisations',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'Where is the secretariat of the South Asian Association for Regional Cooperation (SAARC)?',
    stemUr: 'جنوبی ایشیائی علاقائی تعاون تنظیم (سارک) کا سیکرٹریٹ کہاں واقع ہے؟',
    options: [
      { key: 'A', textEn: 'Kathmandu', textUr: 'کھٹمنڈو' },
      { key: 'B', textEn: 'Dhaka', textUr: 'ڈھاکہ' },
      { key: 'C', textEn: 'Colombo', textUr: 'کولمبو' },
      { key: 'D', textEn: 'New Delhi', textUr: 'نئی دہلی' },
    ],
    correctOption: 'A',
    explanationEn:
      'SAARC was founded at Dhaka in December 1985, and its secretariat was set up in Kathmandu, Nepal, in 1987.',
    topic: 'international-organisations',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'In which year did Pakistan become a full member of the Shanghai Cooperation Organisation (SCO)?',
    stemUr: 'پاکستان شنگھائی تعاون تنظیم (ایس سی او) کا مکمل رکن کس سال بنا؟',
    options: [
      { key: 'A', textEn: '2001', textUr: '2001' },
      { key: 'B', textEn: '2017', textUr: '2017' },
      { key: 'C', textEn: '2019', textUr: '2019' },
      { key: 'D', textEn: '2023', textUr: '2023' },
    ],
    correctOption: 'B',
    explanationEn:
      'Pakistan, an observer since 2005, was admitted as a full member at the Astana summit in June 2017, together with India.',
    topic: 'international-organisations',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'The Economic Cooperation Organization (ECO) was established in 1985 by Pakistan, Iran and…',
    stemUr: 'اقتصادی تعاون تنظیم (ای سی او) 1985 میں پاکستان، ایران اور کس ملک نے قائم کی؟',
    options: [
      { key: 'A', textEn: 'Afghanistan', textUr: 'افغانستان' },
      { key: 'B', textEn: 'Saudi Arabia', textUr: 'سعودی عرب' },
      { key: 'C', textEn: 'Egypt', textUr: 'مصر' },
      { key: 'D', textEn: 'Turkey', textUr: 'ترکی' },
    ],
    correctOption: 'D',
    explanationEn:
      'The three founders expanded ECO to ten members in 1992 by admitting Afghanistan and six Central Asian and Caucasus states; its secretariat is in Tehran.',
    topic: 'international-organisations',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'The ECO succeeded which earlier regional organisation of Pakistan, Iran and Turkey?',
    stemUr: 'ای سی او پاکستان، ایران اور ترکی کی کس سابقہ علاقائی تنظیم کی جانشین ہے؟',
    options: [
      { key: 'A', textEn: 'CENTO', textUr: 'سینٹو' },
      { key: 'B', textEn: 'SEATO', textUr: 'سیٹو' },
      {
        key: 'C',
        textEn: 'Regional Cooperation for Development (RCD)',
        textUr: 'علاقائی تعاون برائے ترقی (آر سی ڈی)',
      },
      { key: 'D', textEn: 'The Arab League', textUr: 'عرب لیگ' },
    ],
    correctOption: 'C',
    explanationEn:
      'The RCD was set up in 1964 to promote economic cooperation among the three countries and was reorganised as ECO in 1985.',
    topic: 'international-organisations',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'In which year did Pakistan become a member of the United Nations?',
    stemUr: 'پاکستان اقوامِ متحدہ کا رکن کس سال بنا؟',
    options: [
      { key: 'A', textEn: '1947', textUr: '1947' },
      { key: 'B', textEn: '1948', textUr: '1948' },
      { key: 'C', textEn: '1950', textUr: '1950' },
      { key: 'D', textEn: '1956', textUr: '1956' },
    ],
    correctOption: 'A',
    explanationEn:
      'Pakistan was admitted to the UN on 30 September 1947, about six weeks after independence.',
    topic: 'international-organisations',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'How many permanent members does the UN Security Council have?',
    stemUr: 'اقوامِ متحدہ کی سلامتی کونسل کے مستقل ارکان کتنے ہیں؟',
    options: [
      { key: 'A', textEn: '3', textUr: '3' },
      { key: 'B', textEn: '5', textUr: '5' },
      { key: 'C', textEn: '10', textUr: '10' },
      { key: 'D', textEn: '15', textUr: '15' },
    ],
    correctOption: 'B',
    explanationEn:
      'The five permanent members (China, France, Russia, the UK and the US) hold a veto; ten further members are elected for two-year terms.',
    topic: 'international-organisations',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'In which city does the International Court of Justice sit?',
    stemUr: 'عالمی عدالتِ انصاف کس شہر میں قائم ہے؟',
    options: [
      { key: 'A', textEn: 'Geneva', textUr: 'جنیوا' },
      { key: 'B', textEn: 'New York', textUr: 'نیویارک' },
      { key: 'C', textEn: 'Vienna', textUr: 'ویانا' },
      { key: 'D', textEn: 'The Hague', textUr: 'دی ہیگ' },
    ],
    correctOption: 'D',
    explanationEn:
      'The ICJ, the principal judicial organ of the UN, sits in the Peace Palace at The Hague, Netherlands.',
    topic: 'international-organisations',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Where is the headquarters of the World Health Organization (WHO)?',
    stemUr: 'عالمی ادارۂ صحت کا صدر دفتر کہاں ہے؟',
    options: [
      { key: 'A', textEn: 'Paris', textUr: 'پیرس' },
      { key: 'B', textEn: 'Geneva', textUr: 'جنیوا' },
      { key: 'C', textEn: 'Rome', textUr: 'روم' },
      { key: 'D', textEn: 'Vienna', textUr: 'ویانا' },
    ],
    correctOption: 'B',
    explanationEn:
      'WHO, the UN’s specialised health agency, was founded in 1948 and is based in Geneva; its founding date, 7 April, is marked as World Health Day.',
    topic: 'international-organisations',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'How many official languages does the United Nations have?',
    stemUr: 'اقوامِ متحدہ کی سرکاری زبانیں کتنی ہیں؟',
    options: [
      { key: 'A', textEn: '4', textUr: '4' },
      { key: 'B', textEn: '5', textUr: '5' },
      { key: 'C', textEn: '6', textUr: '6' },
      { key: 'D', textEn: '8', textUr: '8' },
    ],
    correctOption: 'C',
    explanationEn:
      'The six official languages are Arabic, Chinese, English, French, Russian and Spanish; Arabic was the last to be added, in 1973.',
    topic: 'international-organisations',
    difficulty: 'medium',
  },
  // ── General science ───────────────────────────────────────────────────────
  {
    testTypeCode: 'gk',
    stemEn: 'What is the chemical symbol of sodium?',
    stemUr: 'سوڈیم کی کیمیائی علامت کیا ہے؟',
    options: [
      { key: 'A', textEn: 'So', textUr: 'So' },
      { key: 'B', textEn: 'S', textUr: 'S' },
      { key: 'C', textEn: 'Sn', textUr: 'Sn' },
      { key: 'D', textEn: 'Na', textUr: 'Na' },
    ],
    correctOption: 'D',
    explanationEn:
      'Na comes from "natrium", the Latin name for sodium; S is the symbol for sulphur and Sn for tin.',
    topic: 'general-science',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Which is the largest planet in the Solar System?',
    stemUr: 'نظامِ شمسی کا سب سے بڑا سیارہ کون سا ہے؟',
    options: [
      { key: 'A', textEn: 'Jupiter', textUr: 'مشتری' },
      { key: 'B', textEn: 'Saturn', textUr: 'زحل' },
      { key: 'C', textEn: 'Neptune', textUr: 'نیپچون' },
      { key: 'D', textEn: 'Earth', textUr: 'زمین' },
    ],
    correctOption: 'A',
    explanationEn:
      'Jupiter, a gas giant, is more massive than all the other planets of the Solar System combined.',
    topic: 'general-science',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Which gas makes up the largest share of Earth’s atmosphere?',
    stemUr: 'زمین کے کرۂ ہوائی میں سب سے زیادہ مقدار کس گیس کی ہے؟',
    options: [
      { key: 'A', textEn: 'Oxygen', textUr: 'آکسیجن' },
      { key: 'B', textEn: 'Nitrogen', textUr: 'نائٹروجن' },
      { key: 'C', textEn: 'Carbon dioxide', textUr: 'کاربن ڈائی آکسائیڈ' },
      { key: 'D', textEn: 'Argon', textUr: 'آرگن' },
    ],
    correctOption: 'B',
    explanationEn:
      'Dry air is about 78% nitrogen and 21% oxygen, with argon (just under 1%) in third place.',
    topic: 'general-science',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Scurvy is caused by a deficiency of which vitamin?',
    stemUr: 'اسکروی کی بیماری کس وٹامن کی کمی سے ہوتی ہے؟',
    options: [
      { key: 'A', textEn: 'Vitamin A', textUr: 'وٹامن اے' },
      { key: 'B', textEn: 'Vitamin B12', textUr: 'وٹامن بی 12' },
      { key: 'C', textEn: 'Vitamin C', textUr: 'وٹامن سی' },
      { key: 'D', textEn: 'Vitamin D', textUr: 'وٹامن ڈی' },
    ],
    correctOption: 'C',
    explanationEn:
      'Vitamin C, found in citrus fruits and fresh vegetables, is needed to make collagen; its lack causes bleeding gums and poor wound healing.',
    topic: 'general-science',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Haemoglobin, which carries oxygen in red blood cells, contains which metal?',
    stemUr: 'خون کے سرخ خلیوں میں آکسیجن لے جانے والے ہیموگلوبن میں کون سی دھات پائی جاتی ہے؟',
    options: [
      { key: 'A', textEn: 'Copper', textUr: 'تانبا' },
      { key: 'B', textEn: 'Zinc', textUr: 'جست' },
      { key: 'C', textEn: 'Magnesium', textUr: 'میگنیشیم' },
      { key: 'D', textEn: 'Iron', textUr: 'لوہا' },
    ],
    correctOption: 'D',
    explanationEn:
      'Iron in the haem groups of haemoglobin binds oxygen; a shortage of iron is a common cause of anaemia.',
    topic: 'general-science',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Who discovered penicillin in 1928?',
    stemUr: '1928 میں پینسلین کس نے دریافت کی؟',
    options: [
      { key: 'A', textEn: 'Louis Pasteur', textUr: 'لوئی پاسچر' },
      { key: 'B', textEn: 'Alexander Fleming', textUr: 'الیگزینڈر فلیمنگ' },
      { key: 'C', textEn: 'Edward Jenner', textUr: 'ایڈورڈ جینر' },
      { key: 'D', textEn: 'Robert Koch', textUr: 'رابرٹ کوخ' },
    ],
    correctOption: 'B',
    explanationEn:
      'Alexander Fleming noticed that a Penicillium mould killed bacteria, a discovery that led to the first widely used antibiotic.',
    topic: 'general-science',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Which organ of the human body produces insulin?',
    stemUr: 'انسانی جسم کا کون سا عضو انسولین پیدا کرتا ہے؟',
    options: [
      { key: 'A', textEn: 'Liver', textUr: 'جگر' },
      { key: 'B', textEn: 'Kidney', textUr: 'گردہ' },
      { key: 'C', textEn: 'Pancreas', textUr: 'لبلبہ' },
      { key: 'D', textEn: 'Spleen', textUr: 'تلی' },
    ],
    correctOption: 'C',
    explanationEn:
      'Beta cells in the pancreas produce insulin, which lowers blood sugar; when it is lacking or ineffective, diabetes results.',
    topic: 'general-science',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Absolute zero, the lowest possible temperature, is approximately…',
    stemUr: 'مطلق صفر، یعنی ممکنہ کم ترین درجۂ حرارت، تقریباً کتنا ہے؟',
    options: [
      { key: 'A', textEn: '-273.15 °C', textUr: 'منفی 273.15 °C' },
      { key: 'B', textEn: '-173.15 °C', textUr: 'منفی 173.15 °C' },
      { key: 'C', textEn: '-100 °C', textUr: 'منفی 100 °C' },
      { key: 'D', textEn: '-373.15 °C', textUr: 'منفی 373.15 °C' },
    ],
    correctOption: 'A',
    explanationEn:
      'Absolute zero is 0 kelvin, or -273.15 °C, the temperature at which particles have the minimum possible energy.',
    topic: 'general-science',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'How many bones are there in the skeleton of a typical adult human?',
    stemUr: 'ایک عام بالغ انسان کے ڈھانچے میں کتنی ہڈیاں ہوتی ہیں؟',
    options: [
      { key: 'A', textEn: '206', textUr: '206' },
      { key: 'B', textEn: '212', textUr: '212' },
      { key: 'C', textEn: '226', textUr: '226' },
      { key: 'D', textEn: '300', textUr: '300' },
    ],
    correctOption: 'A',
    explanationEn:
      'An adult typically has 206 bones; a newborn has around 300, many of which fuse together during growth.',
    topic: 'general-science',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Which is the most abundant element in the Earth’s crust by mass?',
    stemUr: 'کمیت کے لحاظ سے زمین کی بالائی پرت میں سب سے زیادہ پایا جانے والا عنصر کون سا ہے؟',
    options: [
      { key: 'A', textEn: 'Silicon', textUr: 'سلیکان' },
      { key: 'B', textEn: 'Aluminium', textUr: 'ایلومینیم' },
      { key: 'C', textEn: 'Iron', textUr: 'لوہا' },
      { key: 'D', textEn: 'Oxygen', textUr: 'آکسیجن' },
    ],
    correctOption: 'D',
    explanationEn:
      'Oxygen makes up about 46% of the crust by mass, mostly bound in silicate minerals; silicon comes second.',
    topic: 'general-science',
    difficulty: 'hard',
  },
  // ── Sports ────────────────────────────────────────────────────────────────
  {
    testTypeCode: 'gk',
    stemEn: 'Pakistan won the 1992 Cricket World Cup by defeating which team in the final?',
    stemUr: 'پاکستان نے 1992 کا کرکٹ ورلڈ کپ فائنل میں کس ٹیم کو ہرا کر جیتا؟',
    options: [
      { key: 'A', textEn: 'India', textUr: 'بھارت' },
      { key: 'B', textEn: 'Australia', textUr: 'آسٹریلیا' },
      { key: 'C', textEn: 'England', textUr: 'انگلینڈ' },
      { key: 'D', textEn: 'New Zealand', textUr: 'نیوزی لینڈ' },
    ],
    correctOption: 'C',
    explanationEn:
      'Pakistan beat England by 22 runs in the final at the Melbourne Cricket Ground on 25 March 1992.',
    topic: 'sports',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'In which year did Pakistan win the ICC World Twenty20?',
    stemUr: 'پاکستان نے آئی سی سی ورلڈ ٹوئنٹی20 کس سال جیتا؟',
    options: [
      { key: 'A', textEn: '2007', textUr: '2007' },
      { key: 'B', textEn: '2009', textUr: '2009' },
      { key: 'C', textEn: '2012', textUr: '2012' },
      { key: 'D', textEn: '2016', textUr: '2016' },
    ],
    correctOption: 'B',
    explanationEn:
      'Pakistan beat Sri Lanka by eight wickets in the 2009 final at Lord’s, two years after finishing runners-up in the first edition in 2007.',
    topic: 'sports',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Pakistan won the first men’s Hockey World Cup in 1971. In which city was it held?',
    stemUr:
      'پاکستان نے 1971 میں مردوں کا پہلا ہاکی ورلڈ کپ جیتا۔ یہ ٹورنامنٹ کس شہر میں منعقد ہوا؟',
    options: [
      { key: 'A', textEn: 'Lahore', textUr: 'لاہور' },
      { key: 'B', textEn: 'Amsterdam', textUr: 'ایمسٹرڈیم' },
      { key: 'C', textEn: 'Kuala Lumpur', textUr: 'کوالالمپور' },
      { key: 'D', textEn: 'Barcelona', textUr: 'بارسلونا' },
    ],
    correctOption: 'D',
    explanationEn:
      'The inaugural Hockey World Cup was held in Barcelona, Spain, where Pakistan beat the hosts 1-0 in the final.',
    topic: 'sports',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'Which Pakistani squash player is famous for going unbeaten in more than 500 consecutive matches during the 1980s?',
    stemUr:
      'کون سا پاکستانی اسکواش کھلاڑی 1980 کی دہائی میں مسلسل 500 سے زیادہ میچوں میں ناقابلِ شکست رہنے کے لیے مشہور ہے؟',
    options: [
      { key: 'A', textEn: 'Jahangir Khan', textUr: 'جہانگیر خان' },
      { key: 'B', textEn: 'Jansher Khan', textUr: 'جان شیر خان' },
      { key: 'C', textEn: 'Hashim Khan', textUr: 'ہاشم خان' },
      { key: 'D', textEn: 'Qamar Zaman', textUr: 'قمر زمان' },
    ],
    correctOption: 'A',
    explanationEn:
      'Jahangir Khan went unbeaten from 1981 to 1986, a run usually counted at 555 matches, and won the British Open ten years in a row.',
    topic: 'sports',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'At which Olympic Games did Pakistan win its first gold medal, in men’s field hockey?',
    stemUr: 'پاکستان نے مردوں کی ہاکی میں اپنا پہلا اولمپک طلائی تمغا کن اولمپک کھیلوں میں جیتا؟',
    options: [
      { key: 'A', textEn: 'London 1948', textUr: 'لندن 1948' },
      { key: 'B', textEn: 'Melbourne 1956', textUr: 'میلبورن 1956' },
      { key: 'C', textEn: 'Rome 1960', textUr: 'روم 1960' },
      { key: 'D', textEn: 'Tokyo 1964', textUr: 'ٹوکیو 1964' },
    ],
    correctOption: 'C',
    explanationEn:
      'Pakistan beat India 1-0 in the 1960 final in Rome, having taken the silver medal at Melbourne in 1956.',
    topic: 'sports',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn:
      'At the Paris 2024 Olympics, Arshad Nadeem won a gold medal for Pakistan in which event?',
    stemUr: 'پیرس اولمپکس 2024 میں ارشد ندیم نے پاکستان کے لیے کس مقابلے میں طلائی تمغا جیتا؟',
    options: [
      { key: 'A', textEn: 'Discus throw', textUr: 'ڈسکس تھرو' },
      { key: 'B', textEn: 'Shot put', textUr: 'شاٹ پٹ' },
      { key: 'C', textEn: 'Hammer throw', textUr: 'ہیمر تھرو' },
      { key: 'D', textEn: 'Javelin throw', textUr: 'جیولن تھرو (نیزہ بازی)' },
    ],
    correctOption: 'D',
    explanationEn:
      'His throw of 92.97 m set an Olympic record and gave Pakistan its first individual Olympic gold medal.',
    topic: 'sports',
    difficulty: 'easy',
  },
  // ── Literature and culture ────────────────────────────────────────────────
  {
    testTypeCode: 'gk',
    stemEn: 'Which was Allama Iqbal’s first collection of Urdu poetry, published in 1924?',
    stemUr: '1924 میں شائع ہونے والا علامہ اقبال کا پہلا اردو شعری مجموعہ کون سا ہے؟',
    options: [
      { key: 'A', textEn: 'Bang-e-Dra', textUr: 'بانگِ درا' },
      { key: 'B', textEn: 'Bal-e-Jibril', textUr: 'بالِ جبریل' },
      { key: 'C', textEn: 'Zarb-e-Kalim', textUr: 'ضربِ کلیم' },
      { key: 'D', textEn: 'Armaghan-e-Hijaz', textUr: 'ارمغانِ حجاز' },
    ],
    correctOption: 'A',
    explanationEn:
      'Bang-e-Dra (1924) was followed by Bal-e-Jibril (1935) and Zarb-e-Kalim (1936); Armaghan-e-Hijaz appeared after his death, in 1938.',
    topic: 'literature-and-culture',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'Who wrote the lyrics of Pakistan’s national anthem?',
    stemUr: 'پاکستان کے قومی ترانے کے بول کس نے لکھے؟',
    options: [
      { key: 'A', textEn: 'Faiz Ahmad Faiz', textUr: 'فیض احمد فیض' },
      { key: 'B', textEn: 'Hafeez Jalandhari', textUr: 'حفیظ جالندھری' },
      { key: 'C', textEn: 'Allama Iqbal', textUr: 'علامہ اقبال' },
      { key: 'D', textEn: 'Ahmed Ghulamali Chagla', textUr: 'احمد غلام علی چھاگلہ' },
    ],
    correctOption: 'B',
    explanationEn:
      'Hafeez Jalandhari wrote the words, which were approved in 1954; the music was composed by Ahmed Ghulamali Chagla.',
    topic: 'literature-and-culture',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'What is the national animal of Pakistan?',
    stemUr: 'پاکستان کا قومی جانور کون سا ہے؟',
    options: [
      { key: 'A', textEn: 'Snow leopard', textUr: 'برفانی چیتا' },
      { key: 'B', textEn: 'Himalayan ibex', textUr: 'ہمالیائی آئبیکس' },
      { key: 'C', textEn: 'Markhor', textUr: 'مارخور' },
      { key: 'D', textEn: 'Asiatic black bear', textUr: 'ایشیائی کالا ریچھ' },
    ],
    correctOption: 'C',
    explanationEn:
      'The markhor, a wild goat with spiralling horns, lives in the mountains of northern and western Pakistan.',
    topic: 'literature-and-culture',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'What is the national bird of Pakistan?',
    stemUr: 'پاکستان کا قومی پرندہ کون سا ہے؟',
    options: [
      { key: 'A', textEn: 'Shaheen falcon', textUr: 'شاہین' },
      { key: 'B', textEn: 'Peacock', textUr: 'مور' },
      { key: 'C', textEn: 'Houbara bustard', textUr: 'تلور' },
      { key: 'D', textEn: 'Chukar partridge', textUr: 'چکور' },
    ],
    correctOption: 'D',
    explanationEn:
      'The chukar partridge is the national bird; the Shaheen falcon, often mistaken for it, is a popular symbol linked with Iqbal’s poetry.',
    topic: 'literature-and-culture',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'What is the national tree of Pakistan?',
    stemUr: 'پاکستان کا قومی درخت کون سا ہے؟',
    options: [
      { key: 'A', textEn: 'Deodar', textUr: 'دیودار' },
      { key: 'B', textEn: 'Chinar', textUr: 'چنار' },
      { key: 'C', textEn: 'Neem', textUr: 'نیم' },
      { key: 'D', textEn: 'Banyan', textUr: 'برگد' },
    ],
    correctOption: 'A',
    explanationEn:
      'The deodar (Himalayan cedar) grows in the northern mountains and is prized for its strong, fragrant timber.',
    topic: 'literature-and-culture',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'gk',
    stemEn: 'What does the white portion of Pakistan’s national flag represent?',
    stemUr: 'پاکستان کے قومی پرچم کا سفید حصہ کس کی نمائندگی کرتا ہے؟',
    options: [
      { key: 'A', textEn: 'The Muslim majority', textUr: 'مسلم اکثریت' },
      { key: 'B', textEn: 'Religious minorities', textUr: 'مذہبی اقلیتیں' },
      { key: 'C', textEn: 'The armed forces', textUr: 'مسلح افواج' },
      { key: 'D', textEn: 'The four provinces', textUr: 'چاروں صوبے' },
    ],
    correctOption: 'B',
    explanationEn:
      'The dark green field stands for the Muslim majority and the white vertical stripe for religious minorities; the crescent represents progress and the star light and knowledge.',
    topic: 'literature-and-culture',
    difficulty: 'medium',
  },
]
