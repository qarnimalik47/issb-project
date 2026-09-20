/**
 * ORIGINAL psychological-test banks written from scratch for this platform —
 * Word Association, Sentence Completion, Situation Reaction, Self Description
 * and Pointer Story.
 *
 * The formats are the standard ISSB/SSB psychometric ones, but every stimulus
 * word, sentence stem and situation here is our own wording. Nothing is copied
 * from ISSB materials, prep books or past papers, exactly as the verbal and
 * mechanical banks state. That matters more here than anywhere else: the
 * imported third-party WAT and SCT material sits in the same tables as drafts,
 * and this is the content that replaces it.
 *
 * Urdu conventions follow the rest of the seed data: SCT and SRT carry real
 * Urdu, since a candidate may sit either language. WAT stimulus words carry
 * their Urdu equivalent rather than a transliteration — the word is the test,
 * so it has to read naturally in both.
 */
export type SeedWrittenItem = {
  testTypeCode: string
  stemEn: string
  stemUr: string
  topic: string
}

/**
 * Word Association: a stimulus word is shown for ~10 seconds and the candidate
 * writes the first meaningful sentence that comes to mind. The set is balanced
 * on purpose — roughly a third positive, a third neutral, a third pressure
 * words — because a list of only virtues tells an assessor nothing.
 */
const WAT: [string, string][] = [
  // Leadership and responsibility
  ['Leader', 'قائد'],
  ['Command', 'کمان'],
  ['Responsibility', 'ذمہ داری'],
  ['Duty', 'فرض'],
  ['Decision', 'فیصلہ'],
  ['Initiative', 'پہل'],
  ['Authority', 'اختیار'],
  ['Order', 'حکم'],
  ['Team', 'ٹیم'],
  ['Trust', 'اعتماد'],
  ['Example', 'مثال'],
  ['Discipline', 'نظم و ضبط'],
  ['Planning', 'منصوبہ بندی'],
  ['Effort', 'کوشش'],
  ['Practice', 'مشق'],
  // Character
  ['Honesty', 'ایمانداری'],
  ['Courage', 'حوصلہ'],
  ['Patience', 'صبر'],
  ['Loyalty', 'وفاداری'],
  ['Sacrifice', 'قربانی'],
  ['Humility', 'عاجزی'],
  ['Integrity', 'دیانت'],
  ['Promise', 'وعدہ'],
  ['Truth', 'سچ'],
  ['Justice', 'انصاف'],
  ['Respect', 'احترام'],
  ['Gratitude', 'شکر'],
  ['Forgiveness', 'معافی'],
  ['Character', 'کردار'],
  ['Principle', 'اصول'],
  // Pressure and difficulty
  ['Failure', 'ناکامی'],
  ['Fear', 'خوف'],
  ['Doubt', 'شک'],
  ['Pressure', 'دباؤ'],
  ['Mistake', 'غلطی'],
  ['Criticism', 'تنقید'],
  ['Defeat', 'شکست'],
  ['Loss', 'نقصان'],
  ['Danger', 'خطرہ'],
  ['Risk', 'جوکھم'],
  ['Delay', 'تاخیر'],
  ['Obstacle', 'رکاوٹ'],
  ['Burden', 'بوجھ'],
  ['Conflict', 'تنازع'],
  ['Anger', 'غصہ'],
  ['Stress', 'ذہنی دباؤ'],
  ['Fatigue', 'تھکن'],
  ['Emergency', 'ہنگامی حالت'],
  ['Accident', 'حادثہ'],
  ['Injury', 'زخم'],
  // People and belonging
  ['Family', 'خاندان'],
  ['Mother', 'ماں'],
  ['Father', 'والد'],
  ['Friend', 'دوست'],
  ['Teacher', 'استاد'],
  ['Neighbour', 'پڑوسی'],
  ['Stranger', 'اجنبی'],
  ['Elder', 'بزرگ'],
  ['Child', 'بچہ'],
  ['Woman', 'خاتون'],
  ['Colleague', 'ساتھی'],
  ['Crowd', 'ہجوم'],
  ['Village', 'گاؤں'],
  ['City', 'شہر'],
  ['Society', 'معاشرہ'],
  // Service and nation
  ['Nation', 'قوم'],
  ['Country', 'ملک'],
  ['Flag', 'پرچم'],
  ['Soldier', 'سپاہی'],
  ['Officer', 'افسر'],
  ['Uniform', 'وردی'],
  ['Border', 'سرحد'],
  ['Service', 'خدمت'],
  ['Honour', 'عزت'],
  ['Martyr', 'شہید'],
  ['Peace', 'امن'],
  ['Unity', 'اتحاد'],
  ['Law', 'قانون'],
  ['Citizen', 'شہری'],
  ['Community', 'برادری'],
  // Work and growth
  ['Study', 'مطالعہ'],
  ['Knowledge', 'علم'],
  ['Skill', 'مہارت'],
  ['Training', 'تربیت'],
  ['Work', 'کام'],
  ['Time', 'وقت'],
  ['Goal', 'مقصد'],
  ['Success', 'کامیابی'],
  ['Opportunity', 'موقع'],
  ['Change', 'تبدیلی'],
  ['Health', 'صحت'],
  ['Money', 'پیسہ'],
  ['Future', 'مستقبل'],
  ['Hope', 'امید'],
  ['Dream', 'خواب'],
  // Neutral anchors
  ['Road', 'سڑک'],
  ['River', 'دریا'],
  ['Mountain', 'پہاڑ'],
  ['Night', 'رات'],
  ['Silence', 'خاموشی'],
]

/**
 * Sentence Completion: the candidate finishes each stem in one line. Stems are
 * kept deliberately open — a stem that implies its own answer measures nothing.
 */
const SCT: [string, string][] = [
  ['When I face a difficult problem, I…', 'جب مجھے کوئی مشکل مسئلہ درپیش ہو تو میں…'],
  ['My greatest strength is…', 'میری سب سے بڑی طاقت…'],
  ['My greatest weakness is…', 'میری سب سے بڑی کمزوری…'],
  ['People who work with me say I…', 'میرے ساتھ کام کرنے والے کہتے ہیں کہ میں…'],
  ['When things go wrong, I…', 'جب معاملات بگڑ جائیں تو میں…'],
  ['My ambition in life is…', 'زندگی میں میرا مقصد…'],
  ['I feel most confident when…', 'مجھے سب سے زیادہ اعتماد تب محسوس ہوتا ہے جب…'],
  ['I lose my temper when…', 'مجھے غصہ تب آتا ہے جب…'],
  ['A good leader always…', 'ایک اچھا قائد ہمیشہ…'],
  ['The hardest decision I ever made…', 'سب سے مشکل فیصلہ جو میں نے کیا…'],
  ['When someone criticises me, I…', 'جب کوئی مجھ پر تنقید کرے تو میں…'],
  ['My family expects me to…', 'میرا خاندان مجھ سے توقع رکھتا ہے کہ…'],
  ['I admire people who…', 'میں ان لوگوں کی قدر کرتا ہوں جو…'],
  ['Failure teaches me…', 'ناکامی مجھے سکھاتی ہے…'],
  ['If I am given a team, I…', 'اگر مجھے ٹیم دی جائے تو میں…'],
  ['Under pressure I usually…', 'دباؤ میں عموماً میں…'],
  ['The quality I most want to build is…', 'جو خوبی میں سب سے زیادہ پیدا کرنا چاہتا ہوں…'],
  ['When I am alone, I…', 'جب میں تنہا ہوتا ہوں تو میں…'],
  ['My friends rely on me for…', 'میرے دوست مجھ پر بھروسہ کرتے ہیں…'],
  ['I find it difficult to…', 'مجھے مشکل لگتا ہے…'],
  ['Discipline means…', 'نظم و ضبط کا مطلب…'],
  ['If I make a mistake, I…', 'اگر مجھ سے غلطی ہو جائے تو میں…'],
  ['The best advice I received was…', 'بہترین مشورہ جو مجھے ملا…'],
  ['I work hardest when…', 'میں سب سے زیادہ محنت تب کرتا ہوں جب…'],
  ['My country needs young people who…', 'میرے ملک کو ایسے نوجوان چاہئیں جو…'],
  ['When I disagree with my senior, I…', 'جب میں اپنے سینئر سے اختلاف کروں تو میں…'],
  ['Responsibility makes me…', 'ذمہ داری مجھے…'],
  ['I would never…', 'میں کبھی نہیں…'],
  ['Time spent well is…', 'اچھا گزارا ہوا وقت…'],
  ['What worries me most is…', 'مجھے سب سے زیادہ فکر…'],
  ['A promise once made…', 'ایک بار کیا گیا وعدہ…'],
  ['When my plan fails, I…', 'جب میرا منصوبہ ناکام ہو تو میں…'],
  ['I help others because…', 'میں دوسروں کی مدد اس لیے کرتا ہوں کہ…'],
  ['Physical fitness is…', 'جسمانی تندرستی…'],
  ['The habit I am proud of is…', 'جس عادت پر مجھے فخر ہے…'],
  ['If I had more time, I would…', 'اگر میرے پاس زیادہ وقت ہوتا تو میں…'],
  ['Leadership without honesty is…', 'ایمانداری کے بغیر قیادت…'],
  ['When a task seems impossible, I…', 'جب کوئی کام ناممکن لگے تو میں…'],
  ['My teachers would describe me as…', 'میرے اساتذہ مجھے بیان کریں گے کہ میں…'],
  ['I learn best by…', 'میں سب سے بہتر سیکھتا ہوں…'],
  ['Money is…', 'پیسہ…'],
  ['Real courage is…', 'اصل بہادری…'],
  ['When I am tired, I…', 'جب میں تھک جاؤں تو میں…'],
  ['A person I trust completely is…', 'جس شخص پر مجھے مکمل بھروسہ ہے…'],
  ['The rule I never break is…', 'جو اصول میں کبھی نہیں توڑتا…'],
  ['If I lead and the team fails, I…', 'اگر میں قیادت کروں اور ٹیم ناکام ہو تو میں…'],
  ['Success without effort is…', 'محنت کے بغیر کامیابی…'],
  ['I feel proud when…', 'مجھے فخر تب ہوتا ہے جب…'],
  ['Change is…', 'تبدیلی…'],
  ['My weakest subject taught me…', 'میرے کمزور ترین مضمون نے مجھے سکھایا…'],
  ['When others give up, I…', 'جب دوسرے ہار مان لیں تو میں…'],
  ['The duty of a citizen is…', 'ایک شہری کا فرض…'],
  ['I keep calm by…', 'میں پرسکون رہتا ہوں…'],
  ['An order I disagree with…', 'جس حکم سے میں متفق نہ ہوں…'],
  ['My idea of a good day is…', 'میرے نزدیک اچھا دن…'],
  ['People trust me because…', 'لوگ مجھ پر بھروسہ اس لیے کرتے ہیں کہ…'],
  ['The risk worth taking is…', 'وہ خطرہ جو مول لینے کے قابل ہے…'],
  ['I prepare for difficulty by…', 'میں مشکل کی تیاری یوں کرتا ہوں…'],
  ['What I owe my parents is…', 'میں اپنے والدین کا مقروض ہوں…'],
  ['Ten years from now I…', 'آج سے دس سال بعد میں…'],
]

/**
 * Situation Reaction: short, concrete scenarios with a time or resource squeeze
 * and no clean answer. Each one is written so that the safe choice and the
 * brave choice pull against each other — that tension is the measurement.
 */
const SRT: [string, string][] = [
  [
    'He was leading a hiking party when one member twisted an ankle two hours from the road. Light was fading. He…',
    'وہ ایک پیدل سفر کی ٹولی کی قیادت کر رہا تھا کہ ایک ساتھی کا ٹخنہ مڑ گیا اور سڑک دو گھنٹے دور تھی۔ روشنی کم ہو رہی تھی۔ اس نے…',
  ],
  [
    'She saw smoke rising from a stall at a crowded market and the stallholder had stepped away. She…',
    'اس نے بھرے بازار میں ایک ٹھیلے سے دھواں اٹھتے دیکھا اور ٹھیلے والا وہاں موجود نہ تھا۔ اس نے…',
  ],
  [
    'During an examination he noticed a close friend copying from his paper. He…',
    'امتحان کے دوران اس نے دیکھا کہ ایک قریبی دوست اس کے پرچے سے نقل کر رہا ہے۔ اس نے…',
  ],
  [
    'His team was losing badly at half time and two players had started blaming each other. He…',
    'وقفے تک اس کی ٹیم بری طرح ہار رہی تھی اور دو کھلاڑی ایک دوسرے کو الزام دینے لگے۔ اس نے…',
  ],
  [
    'He reached the bus stop and realised he had left his wallet at home, with an interview in forty minutes. He…',
    'وہ بس اسٹاپ پہنچا تو معلوم ہوا کہ بٹوہ گھر رہ گیا ہے اور انٹرویو چالیس منٹ بعد تھا۔ اس نے…',
  ],
  [
    'She was asked to submit a group report and found that one member had copied a section from the internet. She…',
    'اسے گروپ رپورٹ جمع کرانی تھی کہ معلوم ہوا ایک رکن نے ایک حصہ انٹرنیٹ سے نقل کیا ہے۔ اس نے…',
  ],
  [
    'While travelling at night he saw a car off the road with its lights still on and no one around. He…',
    'رات کے سفر میں اس نے ایک گاڑی سڑک سے اتری دیکھی جس کی بتیاں جل رہی تھیں اور آس پاس کوئی نہ تھا۔ اس نے…',
  ],
  [
    'He was the only one who noticed that the rope on the climbing frame was fraying, and the next group was already queuing. He…',
    'صرف اسی نے دیکھا کہ چڑھائی کے ڈھانچے کی رسی گھس رہی ہے، اور اگلا گروپ قطار میں لگ چکا تھا۔ اس نے…',
  ],
  [
    'His senior gave an instruction that he believed would put the team at risk. He…',
    'اس کے سینئر نے ایسی ہدایت دی جو اس کے خیال میں ٹیم کو خطرے میں ڈال سکتی تھی۔ اس نے…',
  ],
  [
    'She found a wallet with a large sum of money and an identity card on a quiet street. She…',
    'اسے ایک سنسان گلی میں بٹوہ ملا جس میں بڑی رقم اور شناختی کارڈ تھا۔ اس نے…',
  ],
  [
    'A younger student was being bullied by three seniors in the corridor and a teacher was approaching. He…',
    'راہداری میں تین سینئر ایک چھوٹے طالب علم کو تنگ کر رہے تھے اور ایک استاد قریب آ رہا تھا۔ اس نے…',
  ],
  [
    'The river had risen overnight and the only bridge to the village looked unsafe, but medicines had to be delivered. He…',
    'رات بھر میں دریا چڑھ گیا اور گاؤں کا واحد پل غیر محفوظ لگ رہا تھا، مگر دوائیں پہنچانی تھیں۔ اس نے…',
  ],
  [
    'He was put in charge of a group in which two members were older than him and openly unwilling. He…',
    'اسے ایسے گروپ کا سربراہ بنایا گیا جس کے دو ارکان اس سے بڑے اور کھلے عام ناخوش تھے۔ اس نے…',
  ],
  [
    'During a power failure in the examination hall, some candidates began talking and copying. He…',
    'امتحانی ہال میں بجلی جانے پر کچھ امیدوار باتیں اور نقل کرنے لگے۔ اس نے…',
  ],
  [
    'She had prepared for weeks for a competition, then learned her mother had been taken ill the same morning. She…',
    'اس نے ہفتوں مقابلے کی تیاری کی تھی کہ اسی صبح اس کی والدہ کی طبیعت خراب ہو گئی۔ اس نے…',
  ],
  [
    'His unit was short of water on a long march and he still had half a bottle. He…',
    'طویل مارچ میں اس کی ٹکڑی کے پاس پانی کم پڑ گیا جبکہ اس کے پاس آدھی بوتل باقی تھی۔ اس نے…',
  ],
  [
    'He realised on the morning of the deadline that he had misread the task and done the wrong work. He…',
    'آخری تاریخ کی صبح اسے احساس ہوا کہ وہ کام غلط سمجھا اور غلط کام کر بیٹھا۔ اس نے…',
  ],
  [
    'A stranger asked him for directions in a language he barely spoke, and he was already late. He…',
    'ایک اجنبی نے اس سے ایسی زبان میں راستہ پوچھا جو وہ مشکل سے بولتا تھا، اور وہ پہلے ہی دیر سے تھا۔ اس نے…',
  ],
  [
    'She was offered a place on a team by a relative on the selection panel. She…',
    'اسے ٹیم میں جگہ ایک رشتہ دار نے دلوائی جو انتخابی بورڈ میں تھا۔ اس نے…',
  ],
  [
    'The group could not agree on a plan and time was running out. He…',
    'گروپ کسی منصوبے پر متفق نہ ہو سکا اور وقت ختم ہو رہا تھا۔ اس نے…',
  ],
  [
    'He saw a child wander towards a busy road while the parents were distracted. He…',
    'اس نے ایک بچے کو مصروف سڑک کی طرف بڑھتے دیکھا جبکہ والدین کی توجہ کہیں اور تھی۔ اس نے…',
  ],
  [
    'His closest friend asked him to hide something that he suspected was stolen. He…',
    'اس کے قریبی دوست نے ایسی چیز چھپانے کو کہا جس کے بارے میں اسے چوری کا شبہ تھا۔ اس نے…',
  ],
  [
    'Halfway up a hill the weather turned and two of the party wanted to continue. He…',
    'پہاڑی کے نصف راستے پر موسم بگڑ گیا اور ٹولی کے دو افراد آگے بڑھنا چاہتے تھے۔ اس نے…',
  ],
  [
    'He was praised publicly for work that a quieter teammate had mostly done. He…',
    'اسے سرِعام اس کام پر سراہا گیا جو زیادہ تر ایک خاموش ساتھی نے کیا تھا۔ اس نے…',
  ],
  [
    'She noticed the accounts of a student society did not add up, and the treasurer was a friend. She…',
    'اس نے دیکھا کہ طلبہ انجمن کے حسابات درست نہیں، اور خزانچی اس کا دوست تھا۔ اس نے…',
  ],
  [
    'A crowd was gathering angrily around a minor traffic accident he had witnessed. He…',
    'ایک معمولی ٹریفک حادثے کے گرد ہجوم غصے میں جمع ہو رہا تھا جسے اس نے دیکھا تھا۔ اس نے…',
  ],
  [
    'He was given a task he had never done before and no one was available to ask. He…',
    'اسے ایسا کام ملا جو اس نے پہلے کبھی نہیں کیا تھا اور پوچھنے کے لیے کوئی موجود نہ تھا۔ اس نے…',
  ],
  [
    'On the night before an important test the electricity failed and his notes were on a laptop. He…',
    'اہم امتحان سے پہلے رات بجلی چلی گئی اور اس کے نوٹس لیپ ٹاپ میں تھے۔ اس نے…',
  ],
  [
    'Two of his juniors came to him separately with opposite accounts of the same quarrel. He…',
    'اس کے دو جونیئر الگ الگ آ کر ایک ہی جھگڑے کی مختلف کہانیاں سنانے لگے۔ اس نے…',
  ],
  [
    'She was leading a march and realised she had taken the group down the wrong path. She…',
    'وہ مارچ کی قیادت کر رہی تھی کہ اسے احساس ہوا وہ گروپ کو غلط راستے پر لے آئی ہے۔ اس نے…',
  ],
  [
    'He found that the equipment issued to him was faulty just before the exercise began. He…',
    'مشق شروع ہونے سے ذرا پہلے اسے معلوم ہوا کہ اسے دیا گیا سامان خراب ہے۔ اس نے…',
  ],
  [
    'A villager blamed his team for damage they had not caused, in front of others. He…',
    'ایک گاؤں والے نے دوسروں کے سامنے اس کی ٹیم پر ایسے نقصان کا الزام لگایا جو انہوں نے نہیں کیا تھا۔ اس نے…',
  ],
  [
    'He was offered an easier route to a qualification that others had earned the hard way. He…',
    'اسے ایک سند کے لیے آسان راستہ پیش کیا گیا جو دوسروں نے محنت سے حاصل کی تھی۔ اس نے…',
  ],
  [
    'During a flood relief effort supplies ran short and two families asked at once. He…',
    'سیلاب میں امدادی کام کے دوران سامان کم پڑ گیا اور دو خاندانوں نے ایک ساتھ درخواست کی۔ اس نے…',
  ],
  [
    'He realised mid-presentation that his data was wrong and the audience had not noticed. He…',
    'پیشکش کے درمیان اسے احساس ہوا کہ اس کے اعداد و شمار غلط ہیں اور سامعین نے نہیں دیکھا۔ اس نے…',
  ],
  [
    'A teammate kept arriving late and the group had begun to resent him. He…',
    'ایک ساتھی مسلسل دیر سے آ رہا تھا اور گروپ اس سے بیزار ہونے لگا تھا۔ اس نے…',
  ],
  [
    'She was the only woman in a survey party posted to a remote area. She…',
    'دور دراز علاقے میں بھیجی گئی سروے ٹولی میں وہ واحد خاتون تھی۔ اس نے…',
  ],
  [
    'He had to choose between a certain small success and an uncertain large one. He…',
    'اسے ایک یقینی چھوٹی کامیابی اور ایک غیر یقینی بڑی کامیابی میں سے چننا تھا۔ اس نے…',
  ],
  [
    'His younger brother asked for help with work he was expected to do himself. He…',
    'اس کے چھوٹے بھائی نے ایسے کام میں مدد مانگی جو اسے خود کرنا تھا۔ اس نے…',
  ],
  [
    'A rumour about him began spreading among his batch mates. He…',
    'اس کے بارے میں ایک افواہ اس کے ہم جماعتوں میں پھیلنے لگی۔ اس نے…',
  ],
  [
    'The last bus had gone and a classmate with no money was stranded with him. He…',
    'آخری بس جا چکی تھی اور ایک ہم جماعت بغیر پیسوں کے اس کے ساتھ پھنسا تھا۔ اس نے…',
  ],
  [
    'He was asked to report a friend for a rule he had broken unknowingly. He…',
    'اسے ایک دوست کی اطلاع دینے کو کہا گیا جس نے لاعلمی میں قاعدہ توڑا تھا۔ اس نے…',
  ],
  [
    'During a drill a junior froze and the exercise was being timed. He…',
    'مشق کے دوران ایک جونیئر ساکت ہو گیا اور مشق کا وقت لیا جا رہا تھا۔ اس نے…',
  ],
  [
    'He discovered that the shortest route to the objective crossed private land. He…',
    'اسے معلوم ہوا کہ منزل تک مختصر ترین راستہ نجی زمین سے گزرتا ہے۔ اس نے…',
  ],
  [
    'She was congratulated for a result that had not yet been confirmed. She…',
    'اسے ایسے نتیجے پر مبارکباد دی گئی جس کی ابھی تصدیق نہیں ہوئی تھی۔ اس نے…',
  ],
  [
    'A senior asked him to sign a record he had not checked himself. He…',
    'ایک سینئر نے اس سے ایسا ریکارڈ دستخط کرنے کو کہا جو اس نے خود نہیں دیکھا تھا۔ اس نے…',
  ],
  [
    'He had one place left on the team and two equally deserving candidates. He…',
    'ٹیم میں ایک جگہ باقی تھی اور دو یکساں مستحق امیدوار تھے۔ اس نے…',
  ],
  [
    'The group he was leading wanted to rest while the weather was still good. He…',
    'جس گروپ کی وہ قیادت کر رہا تھا وہ آرام کرنا چاہتا تھا جبکہ موسم ابھی ٹھیک تھا۔ اس نے…',
  ],
  [
    'He was blamed by his seniors for a delay actually caused by someone else. He…',
    'اس کے سینئرز نے اسے ایسی تاخیر کا ذمہ دار ٹھہرایا جو دراصل کسی اور کی وجہ سے ہوئی۔ اس نے…',
  ],
  [
    'On the morning of the interview he found his documents were incomplete. He…',
    'انٹرویو کی صبح اسے معلوم ہوا کہ اس کے کاغذات نامکمل ہیں۔ اس نے…',
  ],
]

const SELF_DESCRIPTION: [string, string][] = [
  [
    'Describe yourself as your best friend would, and then as someone who dislikes you would.',
    'اپنے آپ کو یوں بیان کریں جیسے آپ کا بہترین دوست کرے، اور پھر جیسے آپ کو ناپسند کرنے والا کرے۔',
  ],
  [
    'What would your parents say are your two best and two worst qualities?',
    'آپ کے والدین آپ کی کون سی دو بہترین اور دو بدترین خوبیاں بتائیں گے؟',
  ],
  [
    'Describe the kind of person you are trying to become, and how far you have got.',
    'بیان کریں کہ آپ کیسا انسان بننا چاہتے ہیں، اور اب تک کتنا سفر طے کیا ہے۔',
  ],
  [
    'What would your teachers say about your work and your conduct?',
    'آپ کے اساتذہ آپ کے کام اور رویے کے بارے میں کیا کہیں گے؟',
  ],
  [
    'Describe a belief you hold that most people around you do not share.',
    'کوئی ایسا عقیدہ بیان کریں جو آپ رکھتے ہیں مگر آپ کے گرد اکثر لوگ نہیں رکھتے۔',
  ],
  [
    'How would the people you have led describe working under you?',
    'جن لوگوں کی آپ نے قیادت کی ہے، وہ آپ کے ماتحت کام کرنے کو کیسے بیان کریں گے؟',
  ],
  [
    'What is the criticism you have received most often, and what have you done about it?',
    'آپ پر سب سے زیادہ کون سی تنقید ہوئی، اور آپ نے اس پر کیا کیا؟',
  ],
  [
    'Describe yourself on your best day and on your worst day.',
    'اپنے بہترین دن اور بدترین دن کے آپ کو بیان کریں۔',
  ],
]

const POINTER_STORY: [string, string][] = [
  [
    'Complete a story that begins: "The road ahead was blocked, so the young officer…"',
    'اس جملے سے کہانی مکمل کریں: "آگے کا راستہ بند تھا، تو نوجوان افسر…"',
  ],
  [
    'Complete a story that begins: "The message arrived an hour too late, and she…"',
    'اس جملے سے کہانی مکمل کریں: "پیغام ایک گھنٹہ دیر سے پہنچا، اور اس نے…"',
  ],
  [
    'Complete a story that begins: "Nobody else had noticed the crack in the wall, but he…"',
    'اس جملے سے کہانی مکمل کریں: "دیوار کی دراڑ کسی اور نے نہیں دیکھی تھی، مگر اس نے…"',
  ],
  [
    'Complete a story that begins: "The village had been cut off for three days when…"',
    'اس جملے سے کہانی مکمل کریں: "گاؤں تین دن سے کٹا ہوا تھا جب…"',
  ],
  [
    'Complete a story that begins: "He had been given command that morning, and by noon…"',
    'اس جملے سے کہانی مکمل کریں: "اسے اسی صبح کمان ملی تھی، اور دوپہر تک…"',
  ],
  [
    'Complete a story that begins: "The team had stopped listening to her, so she…"',
    'اس جملے سے کہانی مکمل کریں: "ٹیم نے اس کی بات سننا چھوڑ دی تھی، تو اس نے…"',
  ],
  [
    'Complete a story that begins: "Only one of the two could be saved, and the decision…"',
    'اس جملے سے کہانی مکمل کریں: "دونوں میں سے صرف ایک کو بچایا جا سکتا تھا، اور فیصلہ…"',
  ],
  [
    'Complete a story that begins: "The river was rising, and the last truck had left, so…"',
    'اس جملے سے کہانی مکمل کریں: "دریا چڑھ رہا تھا، اور آخری ٹرک جا چکا تھا، تو…"',
  ],
  [
    'Complete a story that begins: "Everyone expected him to fail, which is why…"',
    'اس جملے سے کہانی مکمل کریں: "سب اس کی ناکامی کے منتظر تھے، اسی لیے…"',
  ],
  [
    'Complete a story that begins: "She found the file open on the desk, and then…"',
    'اس جملے سے کہانی مکمل کریں: "اسے میز پر فائل کھلی ملی، اور پھر…"',
  ],
]

const pair = (code: string, topic: string) => (p: [string, string]) => ({
  testTypeCode: code,
  stemEn: p[0],
  stemUr: p[1],
  topic,
})

export const PSYCH_ITEMS: SeedWrittenItem[] = [
  ...WAT.map(pair('wat', 'word-association')),
  ...SCT.map(pair('sct', 'sentence-completion')),
  ...SRT.map(pair('srt', 'situation-reaction')),
  ...SELF_DESCRIPTION.map(pair('self_description', 'self-description')),
  ...POINTER_STORY.map(pair('pointer_story', 'pointer-story')),
]

export const PSYCH_COUNTS = {
  wat: WAT.length,
  sct: SCT.length,
  srt: SRT.length,
  self_description: SELF_DESCRIPTION.length,
  pointer_story: POINTER_STORY.length,
}
