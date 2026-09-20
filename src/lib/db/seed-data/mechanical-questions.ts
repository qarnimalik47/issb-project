/**
 * ORIGINAL text-only Mechanical Aptitude MCQ bank (our own content, not ISSB
 * or prep-book material). Every item is answerable from the words alone — no
 * figures — until the image pipeline exists. Arithmetic uses SI units and
 * g = 10 m/s² where stated.
 */
import type { SeedQuestion } from './sample-questions'

export const MECHANICAL_QUESTIONS: SeedQuestion[] = [
  // ─── Gears ────────────────────────────────────────────────────────────────
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Gear A (20 teeth) drives gear B (40 teeth). If gear A makes 10 complete turns, how many turns does gear B make?',
    stemUr:
      'گیئر A (20 دندانے) گیئر B (40 دندانے) کو گھماتا ہے۔ اگر گیئر A پورے 10 چکر لگائے تو گیئر B کتنے چکر لگائے گا؟',
    options: [
      { key: 'A', textEn: '20', textUr: '20' },
      { key: 'B', textEn: '5', textUr: '5' },
      { key: 'C', textEn: '10', textUr: '10' },
      { key: 'D', textEn: '40', textUr: '40' },
    ],
    correctOption: 'B',
    explanationEn:
      'The same number of teeth pass the contact point on both gears: 10 × 20 = 200 teeth, so gear B turns 200 ÷ 40 = 5 times.',
    topic: 'gears',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Three gears are meshed in a row: gear A drives gear B, and gear B drives gear C. If gear A turns clockwise, which way does gear C turn?',
    stemUr:
      'تین گیئر ایک قطار میں جُڑے ہیں: گیئر A گیئر B کو اور گیئر B گیئر C کو گھماتا ہے۔ اگر گیئر A گھڑی کی سمت گھومے تو گیئر C کس سمت گھومے گا؟',
    options: [
      { key: 'A', textEn: 'Anticlockwise', textUr: 'گھڑی کی مخالف سمت' },
      { key: 'B', textEn: 'It cannot turn', textUr: 'یہ گھوم ہی نہیں سکتا' },
      {
        key: 'C',
        textEn: 'It depends on the number of teeth',
        textUr: 'یہ دندانوں کی تعداد پر منحصر ہے',
      },
      { key: 'D', textEn: 'Clockwise', textUr: 'گھڑی کی سمت' },
    ],
    correctOption: 'D',
    explanationEn:
      'Each meshing reverses the direction: A clockwise turns B anticlockwise, which turns C clockwise again.',
    topic: 'gears',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Gear P has 12 teeth and turns at 60 rpm. It drives gear Q, which has 36 teeth. At what speed does gear Q turn?',
    stemUr:
      'گیئر P کے 12 دندانے ہیں اور یہ 60 rpm کی رفتار سے گھومتا ہے۔ یہ گیئر Q کو گھماتا ہے جس کے 36 دندانے ہیں۔ گیئر Q کی رفتار کیا ہوگی؟',
    options: [
      { key: 'A', textEn: '20 rpm', textUr: '20 rpm' },
      { key: 'B', textEn: '180 rpm', textUr: '180 rpm' },
      { key: 'C', textEn: '60 rpm', textUr: '60 rpm' },
      { key: 'D', textEn: '30 rpm', textUr: '30 rpm' },
    ],
    correctOption: 'A',
    explanationEn:
      'Speed × teeth is the same for meshed gears: 60 × 12 = Q × 36, so Q = 720 ÷ 36 = 20 rpm.',
    topic: 'gears',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A small gear drives a much larger gear. Compared with the small gear, the larger gear turns…',
    stemUr: 'ایک چھوٹا گیئر ایک بہت بڑے گیئر کو گھماتا ہے۔ چھوٹے گیئر کے مقابلے میں بڑا گیئر…',
    options: [
      {
        key: 'A',
        textEn: 'faster and with more turning force',
        textUr: 'زیادہ تیز اور زیادہ گھمانے والی قوت کے ساتھ گھومتا ہے',
      },
      {
        key: 'B',
        textEn: 'faster and with less turning force',
        textUr: 'زیادہ تیز اور کم گھمانے والی قوت کے ساتھ گھومتا ہے',
      },
      {
        key: 'C',
        textEn: 'slower and with more turning force',
        textUr: 'آہستہ مگر زیادہ گھمانے والی قوت کے ساتھ گھومتا ہے',
      },
      {
        key: 'D',
        textEn: 'at the same speed but with more turning force',
        textUr: 'اسی رفتار سے مگر زیادہ گھمانے والی قوت کے ساتھ گھومتا ہے',
      },
    ],
    correctOption: 'C',
    explanationEn:
      'Gearing down trades speed for torque: the larger driven gear turns more slowly but with a greater turning force.',
    topic: 'gears',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Four gears are meshed in a single chain: A drives B, B drives C and C drives D. Gear A has 10 teeth, B has 30, C has 15 and D has 20. If gear A turns at 120 rpm, how fast does gear D turn?',
    stemUr:
      'چار گیئر ایک ہی سلسلے میں جُڑے ہیں: A گیئر B کو، B گیئر C کو اور C گیئر D کو گھماتا ہے۔ گیئر A کے 10، B کے 30، C کے 15 اور D کے 20 دندانے ہیں۔ اگر گیئر A کی رفتار 120 rpm ہو تو گیئر D کتنی رفتار سے گھومے گا؟',
    options: [
      { key: 'A', textEn: '40 rpm', textUr: '40 rpm' },
      { key: 'B', textEn: '240 rpm', textUr: '240 rpm' },
      { key: 'C', textEn: '60 rpm', textUr: '60 rpm' },
      { key: 'D', textEn: '20 rpm', textUr: '20 rpm' },
    ],
    correctOption: 'C',
    explanationEn:
      'In a simple chain the middle (idler) gears do not change the overall ratio, so D = 120 × 10 ÷ 20 = 60 rpm (check: B = 40, C = 80, D = 80 × 15 ÷ 20 = 60).',
    topic: 'gears',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Gear X (10 teeth) and gear Y (30 teeth) are fixed on the same shaft and turn together. If gear X turns at 90 rpm, at what speed does gear Y turn?',
    stemUr:
      'گیئر X (10 دندانے) اور گیئر Y (30 دندانے) ایک ہی شافٹ پر جڑے ہوئے ہیں اور اکٹھے گھومتے ہیں۔ اگر گیئر X کی رفتار 90 rpm ہو تو گیئر Y کی رفتار کیا ہوگی؟',
    options: [
      { key: 'A', textEn: '90 rpm', textUr: '90 rpm' },
      { key: 'B', textEn: '30 rpm', textUr: '30 rpm' },
      { key: 'C', textEn: '270 rpm', textUr: '270 rpm' },
      { key: 'D', textEn: '45 rpm', textUr: '45 rpm' },
    ],
    correctOption: 'A',
    explanationEn:
      'Gears fixed on the same shaft always turn at the same speed, whatever their number of teeth.',
    topic: 'gears',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Gear A (15 teeth) drives gear B (45 teeth). Gear C (10 teeth) is fixed on the same shaft as gear B and drives gear D (40 teeth). If gear A turns at 240 rpm, what is the speed of gear D?',
    stemUr:
      'گیئر A (15 دندانے) گیئر B (45 دندانے) کو گھماتا ہے۔ گیئر C (10 دندانے) گیئر B والی شافٹ پر ہی جڑا ہے اور گیئر D (40 دندانے) کو گھماتا ہے۔ اگر گیئر A کی رفتار 240 rpm ہو تو گیئر D کی رفتار کیا ہوگی؟',
    options: [
      { key: 'A', textEn: '80 rpm', textUr: '80 rpm' },
      { key: 'B', textEn: '60 rpm', textUr: '60 rpm' },
      { key: 'C', textEn: '320 rpm', textUr: '320 rpm' },
      { key: 'D', textEn: '20 rpm', textUr: '20 rpm' },
    ],
    correctOption: 'D',
    explanationEn:
      "B = 240 × 15 ÷ 45 = 80 rpm; C shares B's shaft so it also turns at 80 rpm; D = 80 × 10 ÷ 40 = 20 rpm.",
    topic: 'gears',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Which type of gears is used to transmit rotation between two shafts that meet at a right angle, as in a hand drill?',
    stemUr:
      'دو ایسی شافٹوں کے درمیان گردش منتقل کرنے کے لیے، جو آپس میں قائمہ زاویے پر ملتی ہوں (جیسے ہاتھ والی ڈرل میں)، کون سے گیئر استعمال ہوتے ہیں؟',
    options: [
      { key: 'A', textEn: 'Spur gears', textUr: 'اسپر گیئر' },
      { key: 'B', textEn: 'Bevel gears', textUr: 'بیول گیئر' },
      { key: 'C', textEn: 'Rack and pinion', textUr: 'ریک اور پنین' },
      { key: 'D', textEn: 'Ratchet and pawl', textUr: 'ریچٹ اور پال' },
    ],
    correctOption: 'B',
    explanationEn:
      'Bevel gears have cone-shaped faces that turn the drive through 90°; spur gears link parallel shafts and a rack and pinion gives straight-line motion.',
    topic: 'gears',
    difficulty: 'medium',
  },

  // ─── Pulleys ──────────────────────────────────────────────────────────────
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A single fixed pulley is used to lift a load of 200 N. Ignoring friction, what effort is needed?',
    stemUr:
      'ایک اکیلی فکسڈ پلی سے 200 N کا بوجھ اٹھایا جاتا ہے۔ رگڑ کو نظرانداز کرتے ہوئے کتنی قوت درکار ہوگی؟',
    options: [
      { key: 'A', textEn: '100 N', textUr: '100 N' },
      { key: 'B', textEn: '200 N', textUr: '200 N' },
      { key: 'C', textEn: '400 N', textUr: '400 N' },
      { key: 'D', textEn: '50 N', textUr: '50 N' },
    ],
    correctOption: 'B',
    explanationEn:
      'A single fixed pulley has a mechanical advantage of 1, so the effort equals the load (200 N); it only changes the direction of the force.',
    topic: 'pulleys',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'What is the main benefit of using a single fixed pulley to raise a bucket from a well?',
    stemUr: 'کنویں سے بالٹی نکالنے کے لیے اکیلی فکسڈ پلی استعمال کرنے کا بنیادی فائدہ کیا ہے؟',
    options: [
      {
        key: 'A',
        textEn: 'It halves the effort needed',
        textUr: 'یہ درکار قوت کو آدھا کر دیتی ہے',
      },
      {
        key: 'B',
        textEn: 'It reduces the weight of the bucket',
        textUr: 'یہ بالٹی کا وزن کم کر دیتی ہے',
      },
      {
        key: 'C',
        textEn: 'It makes the bucket rise twice as fast',
        textUr: 'یہ بالٹی کو دوگنی تیزی سے اوپر لاتی ہے',
      },
      {
        key: 'D',
        textEn: 'It lets you pull downwards to lift the load upwards',
        textUr: 'اس سے آپ نیچے کی طرف کھینچ کر بوجھ اوپر اٹھا سکتے ہیں',
      },
    ],
    correctOption: 'D',
    explanationEn:
      'A single fixed pulley gives no force advantage; its benefit is changing the direction of the effort, so you can pull down using your body weight.',
    topic: 'pulleys',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A load of 600 N hangs from a pulley block and is supported by 4 rope segments. Ignoring friction and the weight of the pulleys, what effort is needed to lift it?',
    stemUr:
      '600 N کا بوجھ ایک پلی بلاک سے لٹکا ہے اور رسی کے 4 حصے اسے سہارا دیتے ہیں۔ رگڑ اور پلیوں کے وزن کو نظرانداز کرتے ہوئے اسے اٹھانے کے لیے کتنی قوت درکار ہوگی؟',
    options: [
      { key: 'A', textEn: '150 N', textUr: '150 N' },
      { key: 'B', textEn: '600 N', textUr: '600 N' },
      { key: 'C', textEn: '2400 N', textUr: '2400 N' },
      { key: 'D', textEn: '300 N', textUr: '300 N' },
    ],
    correctOption: 'A',
    explanationEn:
      'The load is shared equally by the 4 supporting segments, so the effort is 600 ÷ 4 = 150 N.',
    topic: 'pulleys',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'In an ideal pulley system the load is supported by 3 rope segments. If the effort end of the rope is pulled through 6 m, how far does the load rise?',
    stemUr:
      'ایک مثالی پلی نظام میں بوجھ کو رسی کے 3 حصے سہارا دیتے ہیں۔ اگر رسی کا قوت والا سرا 6 m کھینچا جائے تو بوجھ کتنا اوپر اٹھے گا؟',
    options: [
      { key: 'A', textEn: '18 m', textUr: '18 m' },
      { key: 'B', textEn: '6 m', textUr: '6 m' },
      { key: 'C', textEn: '2 m', textUr: '2 m' },
      { key: 'D', textEn: '3 m', textUr: '3 m' },
    ],
    correctOption: 'C',
    explanationEn:
      'All 3 supporting segments must shorten equally, so the load rises 6 ÷ 3 = 2 m: force is gained but distance is lost.',
    topic: 'pulleys',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A pulley system has a velocity ratio of 5. An effort of 250 N raises a load of 1000 N. What is the efficiency of the system?',
    stemUr:
      'ایک پلی نظام کا ولاسٹی ریشو (رفتار کی نسبت) 5 ہے۔ 250 N کی قوت 1000 N کا بوجھ اٹھاتی ہے۔ اس نظام کی کارکردگی کتنی ہے؟',
    options: [
      { key: 'A', textEn: '100%', textUr: '100%' },
      { key: 'B', textEn: '25%', textUr: '25%' },
      { key: 'C', textEn: '80%', textUr: '80%' },
      { key: 'D', textEn: '125%', textUr: '125%' },
    ],
    correctOption: 'C',
    explanationEn: 'Mechanical advantage = 1000 ÷ 250 = 4; efficiency = MA ÷ VR = 4 ÷ 5 = 80%.',
    topic: 'pulleys',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Two pulleys are joined by an open (uncrossed) belt. The driving pulley has a diameter of 10 cm and turns at 300 rpm; the driven pulley has a diameter of 30 cm. At what speed does the driven pulley turn?',
    stemUr:
      'دو پلیاں ایک سیدھی (غیر کراس) بیلٹ سے جڑی ہیں۔ چلانے والی پلی کا قطر 10 cm ہے اور یہ 300 rpm پر گھومتی ہے؛ چلنے والی پلی کا قطر 30 cm ہے۔ چلنے والی پلی کی رفتار کیا ہوگی؟',
    options: [
      { key: 'A', textEn: '100 rpm', textUr: '100 rpm' },
      { key: 'B', textEn: '900 rpm', textUr: '900 rpm' },
      { key: 'C', textEn: '300 rpm', textUr: '300 rpm' },
      { key: 'D', textEn: '150 rpm', textUr: '150 rpm' },
    ],
    correctOption: 'A',
    explanationEn:
      'The belt moves both rims at the same speed, so speed × diameter is equal: 300 × 10 = N × 30, giving N = 100 rpm.',
    topic: 'pulleys',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Two pulleys are connected by a crossed belt that forms a figure of eight. If the driving pulley turns clockwise, the driven pulley turns…',
    stemUr:
      'دو پلیاں ایک کراس بیلٹ سے جڑی ہیں جو انگریزی ہندسے 8 جیسی شکل بناتی ہے۔ اگر چلانے والی پلی گھڑی کی سمت گھومے تو چلنے والی پلی…',
    options: [
      { key: 'A', textEn: 'clockwise', textUr: 'گھڑی کی سمت گھومتی ہے' },
      {
        key: 'B',
        textEn: 'in whichever direction the larger pulley turns',
        textUr: 'اسی سمت گھومتی ہے جس سمت بڑی پلی گھومے',
      },
      {
        key: 'C',
        textEn: 'alternately clockwise and anticlockwise',
        textUr: 'باری باری دونوں سمتوں میں گھومتی ہے',
      },
      { key: 'D', textEn: 'anticlockwise', textUr: 'گھڑی کی مخالف سمت گھومتی ہے' },
    ],
    correctOption: 'D',
    explanationEn:
      'A crossed belt reverses the direction of rotation; an open belt keeps both pulleys turning the same way.',
    topic: 'pulleys',
    difficulty: 'medium',
  },

  // ─── Levers ───────────────────────────────────────────────────────────────
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A 40 kg child sits 1 m from the pivot of a seesaw. How far from the pivot, on the other side, must a 20 kg child sit to balance it?',
    stemUr:
      '40 kg کا ایک بچہ سی-سا کے محور سے 1 m کے فاصلے پر بیٹھا ہے۔ توازن کے لیے 20 kg کا بچہ دوسری طرف محور سے کتنے فاصلے پر بیٹھے؟',
    options: [
      { key: 'A', textEn: '0.5 m', textUr: '0.5 m' },
      { key: 'B', textEn: '2 m', textUr: '2 m' },
      { key: 'C', textEn: '1 m', textUr: '1 m' },
      { key: 'D', textEn: '4 m', textUr: '4 m' },
    ],
    correctOption: 'B',
    explanationEn: 'For balance the moments must be equal: 40 × 1 = 20 × d, so d = 2 m.',
    topic: 'levers',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'In which class of lever is the fulcrum located between the effort and the load?',
    stemUr: 'لیور کی کس قسم میں فلکرم قوت اور بوجھ کے درمیان ہوتا ہے؟',
    options: [
      { key: 'A', textEn: 'Second class', textUr: 'دوسرے درجے کا لیور' },
      { key: 'B', textEn: 'First class', textUr: 'پہلے درجے کا لیور' },
      { key: 'C', textEn: 'Third class', textUr: 'تیسرے درجے کا لیور' },
      { key: 'D', textEn: 'In all three classes', textUr: 'تینوں درجوں میں' },
    ],
    correctOption: 'B',
    explanationEn:
      'A first-class lever, such as a seesaw or a crowbar, has the fulcrum between the effort and the load.',
    topic: 'levers',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A wheelbarrow, with its wheel at the front, the load in the tray and the handles lifted at the back, is an example of which class of lever?',
    stemUr:
      'ہتھ گاڑی (وہیل بیرو)، جس کا پہیہ آگے، بوجھ درمیان میں ٹرے میں اور ہینڈل پیچھے سے اٹھائے جاتے ہیں، کس درجے کے لیور کی مثال ہے؟',
    options: [
      { key: 'A', textEn: 'First class', textUr: 'پہلے درجے کا لیور' },
      { key: 'B', textEn: 'Third class', textUr: 'تیسرے درجے کا لیور' },
      { key: 'C', textEn: 'It is not a lever', textUr: 'یہ لیور نہیں ہے' },
      { key: 'D', textEn: 'Second class', textUr: 'دوسرے درجے کا لیور' },
    ],
    correctOption: 'D',
    explanationEn:
      'The wheel is the fulcrum and the load lies between it and the effort at the handles, which makes it a second-class lever.',
    topic: 'levers',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A pair of tweezers, hinged at one end and squeezed in the middle to grip an object at the tips, is an example of which class of lever?',
    stemUr:
      'چمٹی، جو ایک سرے پر جڑی ہوتی ہے اور درمیان سے دبا کر سروں سے کوئی چیز پکڑی جاتی ہے، کس درجے کے لیور کی مثال ہے؟',
    options: [
      { key: 'A', textEn: 'Third class', textUr: 'تیسرے درجے کا لیور' },
      { key: 'B', textEn: 'First class', textUr: 'پہلے درجے کا لیور' },
      { key: 'C', textEn: 'Second class', textUr: 'دوسرے درجے کا لیور' },
      { key: 'D', textEn: 'It is a wedge, not a lever', textUr: 'یہ پچر ہے، لیور نہیں' },
    ],
    correctOption: 'A',
    explanationEn:
      'The effort (your fingers) acts between the fulcrum (the hinge) and the load (at the tips), which is a third-class lever.',
    topic: 'levers',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A crowbar 1.5 m long is used to lift a 900 N rock. The pivot is 0.3 m from the end under the rock. What minimum effort is needed at the other end of the bar?',
    stemUr:
      '1.5 m لمبی سبل (کرو بار) سے 900 N وزنی پتھر اٹھایا جاتا ہے۔ محور پتھر والے سرے سے 0.3 m دور ہے۔ سلاخ کے دوسرے سرے پر کم از کم کتنی قوت درکار ہوگی؟',
    options: [
      { key: 'A', textEn: '180 N', textUr: '180 N' },
      { key: 'B', textEn: '300 N', textUr: '300 N' },
      { key: 'C', textEn: '225 N', textUr: '225 N' },
      { key: 'D', textEn: '3600 N', textUr: '3600 N' },
    ],
    correctOption: 'C',
    explanationEn:
      'Effort arm = 1.5 − 0.3 = 1.2 m; taking moments, E × 1.2 = 900 × 0.3 = 270, so E = 225 N.',
    topic: 'levers',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'The mechanical advantage of a third-class lever is always…',
    stemUr: 'تیسرے درجے کے لیور کا میکانی فائدہ ہمیشہ…',
    options: [
      { key: 'A', textEn: 'greater than 1', textUr: '1 سے زیادہ ہوتا ہے' },
      { key: 'B', textEn: 'exactly 1', textUr: 'بالکل 1 ہوتا ہے' },
      { key: 'C', textEn: 'less than 1', textUr: '1 سے کم ہوتا ہے' },
      { key: 'D', textEn: 'zero', textUr: 'صفر ہوتا ہے' },
    ],
    correctOption: 'C',
    explanationEn:
      'In a third-class lever the effort is nearer the fulcrum than the load, so the effort arm is shorter and MA is below 1; it gains speed and distance instead of force.',
    topic: 'levers',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A uniform plank 4 m long is pivoted at its centre. A 300 N weight is placed 1 m to the left of the pivot. What weight placed at the right-hand end of the plank will balance it?',
    stemUr:
      '4 m لمبا ایک یکساں تختہ اپنے درمیان سے محور پر ٹکا ہے۔ محور سے 1 m بائیں طرف 300 N کا وزن رکھا گیا ہے۔ تختے کے دائیں سرے پر کتنا وزن رکھنے سے توازن ہوگا؟',
    options: [
      { key: 'A', textEn: '150 N', textUr: '150 N' },
      { key: 'B', textEn: '300 N', textUr: '300 N' },
      { key: 'C', textEn: '600 N', textUr: '600 N' },
      { key: 'D', textEn: '75 N', textUr: '75 N' },
    ],
    correctOption: 'A',
    explanationEn:
      "The right-hand end is 2 m from the pivot; balancing moments, 300 × 1 = W × 2, so W = 150 N (the plank's own weight acts at the pivot).",
    topic: 'levers',
    difficulty: 'medium',
  },

  // ─── Inclined planes, wedges and screws ───────────────────────────────────
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Compared with lifting a box straight up onto a platform, pushing it up a long, gentle, frictionless ramp to the same height needs…',
    stemUr:
      'کسی ڈبے کو سیدھا اوپر اٹھا کر چبوترے پر رکھنے کے مقابلے میں، اسے اسی اونچائی تک ایک لمبی، ہلکی اور بغیر رگڑ والی ڈھلوان پر دھکیلنے میں…',
    options: [
      {
        key: 'A',
        textEn: 'more force over a shorter distance',
        textUr: 'کم فاصلے پر زیادہ قوت لگتی ہے',
      },
      { key: 'B', textEn: 'less force and less work', textUr: 'کم قوت اور کم کام لگتا ہے' },
      {
        key: 'C',
        textEn: 'the same force over a longer distance',
        textUr: 'زیادہ فاصلے پر اتنی ہی قوت لگتی ہے',
      },
      {
        key: 'D',
        textEn: 'less force over a longer distance',
        textUr: 'زیادہ فاصلے پر کم قوت لگتی ہے',
      },
    ],
    correctOption: 'D',
    explanationEn:
      'A ramp reduces the force needed but increases the distance moved; with no friction the work done (force × distance) is the same.',
    topic: 'inclined-planes',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A frictionless ramp is 5 m long and rises through a height of 1 m. What force, parallel to the ramp, is needed to push a 500 N load up it at a steady speed?',
    stemUr:
      'ایک بغیر رگڑ والی ڈھلوان 5 m لمبی ہے اور 1 m اونچائی تک جاتی ہے۔ 500 N کے بوجھ کو یکساں رفتار سے اوپر دھکیلنے کے لیے ڈھلوان کے متوازی کتنی قوت درکار ہوگی؟',
    options: [
      { key: 'A', textEn: '500 N', textUr: '500 N' },
      { key: 'B', textEn: '100 N', textUr: '100 N' },
      { key: 'C', textEn: '2500 N', textUr: '2500 N' },
      { key: 'D', textEn: '250 N', textUr: '250 N' },
    ],
    correctOption: 'B',
    explanationEn: 'Work in = work out: F × 5 = 500 × 1, so F = 100 N.',
    topic: 'inclined-planes',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Two frictionless ramps both rise to a height of 2 m. Ramp X is 4 m long and ramp Y is 8 m long. Which statement about pushing the same load to the top is correct?',
    stemUr:
      'دو بغیر رگڑ والی ڈھلوانیں دونوں 2 m اونچائی تک جاتی ہیں۔ ڈھلوان X کی لمبائی 4 m اور ڈھلوان Y کی لمبائی 8 m ہے۔ ایک ہی بوجھ کو اوپر تک دھکیلنے کے بارے میں کون سا بیان درست ہے؟',
    options: [
      {
        key: 'A',
        textEn: 'X needs half the force that Y needs',
        textUr: 'X پر Y کے مقابلے میں آدھی قوت لگتی ہے',
      },
      {
        key: 'B',
        textEn: 'Y needs half the force that X needs, and the work done is the same',
        textUr: 'Y پر X کے مقابلے میں آدھی قوت لگتی ہے اور کیا گیا کام برابر رہتا ہے',
      },
      {
        key: 'C',
        textEn: 'Y needs half the force and half the work',
        textUr: 'Y پر آدھی قوت اور آدھا کام لگتا ہے',
      },
      { key: 'D', textEn: 'Both need the same force', textUr: 'دونوں پر برابر قوت لگتی ہے' },
    ],
    correctOption: 'B',
    explanationEn:
      'Force = load × height ÷ length, so doubling the length halves the force; the work (load × 2 m) is the same on both ramps.',
    topic: 'inclined-planes',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'An axe blade splitting a log works as which simple machine?',
    stemUr: 'لکڑی کے کندے کو چیرنے والا کلہاڑی کا پھل کس سادہ مشین کے طور پر کام کرتا ہے؟',
    options: [
      { key: 'A', textEn: 'Lever', textUr: 'لیور' },
      { key: 'B', textEn: 'Pulley', textUr: 'پلی' },
      { key: 'C', textEn: 'Wheel and axle', textUr: 'پہیہ اور دھری' },
      { key: 'D', textEn: 'Wedge', textUr: 'پچر' },
    ],
    correctOption: 'D',
    explanationEn:
      'A wedge is a moving inclined plane that turns a downward blow into large sideways forces that push the wood apart.',
    topic: 'inclined-planes',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'The thread of a screw is best described as…',
    stemUr: 'پیچ کی چوڑی (تھریڈ) دراصل…',
    options: [
      {
        key: 'A',
        textEn: 'an inclined plane wrapped around a cylinder',
        textUr: 'ایک مائل سطح ہے جو سلنڈر کے گرد لپٹی ہو',
      },
      { key: 'B', textEn: 'a lever with a fixed pivot', textUr: 'ایک لیور ہے جس کا محور مقرر ہو' },
      {
        key: 'C',
        textEn: 'two wedges joined back to back',
        textUr: 'دو پچر ہیں جو پشت سے پشت جڑے ہوں',
      },
      { key: 'D', textEn: 'a wheel fixed to a pulley', textUr: 'ایک پہیہ ہے جو پلی سے جڑا ہو' },
    ],
    correctOption: 'A',
    explanationEn:
      'A screw thread is a long inclined plane wound in a spiral around a cylinder, so a small turning force produces a large force along the screw.',
    topic: 'inclined-planes',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A screw jack has a thread pitch of 5 mm. Its handle moves the effort around a circle of circumference 50 cm per turn. Ignoring friction, what effort is needed to lift a 2000 N load?',
    stemUr:
      'ایک اسکرو جیک کی چوڑی کا پچ (فاصلہ) 5 mm ہے۔ ہر چکر میں اس کا ہینڈل قوت کو 50 cm محیط والے دائرے میں گھماتا ہے۔ رگڑ کو نظرانداز کرتے ہوئے 2000 N کا بوجھ اٹھانے کے لیے کتنی قوت درکار ہوگی؟',
    options: [
      { key: 'A', textEn: '200 N', textUr: '200 N' },
      { key: 'B', textEn: '10 N', textUr: '10 N' },
      { key: 'C', textEn: '20 N', textUr: '20 N' },
      { key: 'D', textEn: '100 N', textUr: '100 N' },
    ],
    correctOption: 'C',
    explanationEn:
      'In one turn the effort moves 500 mm while the load rises 5 mm, so VR = 500 ÷ 5 = 100 and effort = 2000 ÷ 100 = 20 N.',
    topic: 'inclined-planes',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Two steel wedges are the same length. One is thin and gradually tapered; the other is thick and blunt. Which needs less force to drive into a log?',
    stemUr:
      'دو فولادی پچر برابر لمبائی کے ہیں۔ ایک پتلا ہے اور آہستہ آہستہ نوکیلا ہوتا ہے؛ دوسرا موٹا اور کُند ہے۔ لکڑی کے کندے میں ٹھونکنے کے لیے کس پر کم قوت لگے گی؟',
    options: [
      { key: 'A', textEn: 'The thick, blunt wedge', textUr: 'موٹا اور کُند پچر' },
      { key: 'B', textEn: 'Both need the same force', textUr: 'دونوں پر برابر قوت لگے گی' },
      {
        key: 'C',
        textEn: 'The thin, gradually tapered wedge',
        textUr: 'پتلا اور آہستہ آہستہ نوکیلا ہونے والا پچر',
      },
      {
        key: 'D',
        textEn: 'It depends only on the weight of the hammer',
        textUr: 'یہ صرف ہتھوڑے کے وزن پر منحصر ہے',
      },
    ],
    correctOption: 'C',
    explanationEn:
      "A wedge's mechanical advantage is roughly its length divided by its thickness, so a long thin wedge needs less force.",
    topic: 'inclined-planes',
    difficulty: 'medium',
  },

  // ─── Wheel and axle ───────────────────────────────────────────────────────
  {
    testTypeCode: 'mechanical',
    stemEn:
      "A car's steering wheel is much larger than the steering column it turns. This allows the driver to…",
    stemUr:
      'گاڑی کا اسٹیئرنگ وہیل اُس اسٹیئرنگ راڈ سے بہت بڑا ہوتا ہے جسے وہ گھماتا ہے۔ اس سے ڈرائیور…',
    options: [
      {
        key: 'A',
        textEn: 'turn the column with a smaller force',
        textUr: 'کم قوت سے راڈ کو گھما سکتا ہے',
      },
      {
        key: 'B',
        textEn: 'turn the column faster than the wheel',
        textUr: 'راڈ کو وہیل سے زیادہ تیز گھما سکتا ہے',
      },
      { key: 'C', textEn: 'reduce the weight of the car', textUr: 'گاڑی کا وزن کم کر سکتا ہے' },
      {
        key: 'D',
        textEn: 'steer without using any energy',
        textUr: 'بغیر کوئی توانائی خرچ کیے گاڑی موڑ سکتا ہے',
      },
    ],
    correctOption: 'A',
    explanationEn:
      'Effort applied at the large radius of the wheel produces a large turning effect on the narrow column, so less force is needed.',
    topic: 'wheel-and-axle',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A wheel of radius 40 cm is fixed to an axle of radius 5 cm. What is the ideal mechanical advantage when the effort is applied to the wheel?',
    stemUr:
      '40 cm رداس والا ایک پہیہ 5 cm رداس والی دھری پر جڑا ہے۔ اگر قوت پہیے پر لگائی جائے تو مثالی میکانی فائدہ کتنا ہوگا؟',
    options: [
      { key: 'A', textEn: '0.125', textUr: '0.125' },
      { key: 'B', textEn: '35', textUr: '35' },
      { key: 'C', textEn: '45', textUr: '45' },
      { key: 'D', textEn: '8', textUr: '8' },
    ],
    correctOption: 'D',
    explanationEn: 'Ideal MA of a wheel and axle = wheel radius ÷ axle radius = 40 ÷ 5 = 8.',
    topic: 'wheel-and-axle',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A well windlass has a handle of radius 30 cm and a drum (axle) of radius 10 cm. Ignoring friction, what effort on the handle will raise a 240 N bucket of water?',
    stemUr:
      'کنویں کی چرخی (ونڈلاس) کے ہینڈل کا رداس 30 cm اور ڈرم (دھری) کا رداس 10 cm ہے۔ رگڑ کو نظرانداز کرتے ہوئے 240 N پانی کی بالٹی اٹھانے کے لیے ہینڈل پر کتنی قوت درکار ہوگی؟',
    options: [
      { key: 'A', textEn: '720 N', textUr: '720 N' },
      { key: 'B', textEn: '80 N', textUr: '80 N' },
      { key: 'C', textEn: '24 N', textUr: '24 N' },
      { key: 'D', textEn: '240 N', textUr: '240 N' },
    ],
    correctOption: 'B',
    explanationEn: 'Moments balance: E × 30 = 240 × 10, so E = 2400 ÷ 30 = 80 N.',
    topic: 'wheel-and-axle',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'Which of the following is NOT an example of a wheel and axle?',
    stemUr: 'درج ذیل میں سے کون سی چیز پہیہ اور دھری کی مثال نہیں ہے؟',
    options: [
      { key: 'A', textEn: 'Screwdriver', textUr: 'پیچ کس' },
      { key: 'B', textEn: 'Seesaw', textUr: 'سی-سا' },
      { key: 'C', textEn: 'Water-tap handle', textUr: 'پانی کی ٹونٹی کا ہینڈل' },
      { key: 'D', textEn: 'Steering wheel', textUr: 'اسٹیئرنگ وہیل' },
    ],
    correctOption: 'B',
    explanationEn:
      'A seesaw is a first-class lever; the others all use a larger turning part (the wheel) fixed to a narrower shaft (the axle).',
    topic: 'wheel-and-axle',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'On a bicycle, the front (pedal) sprocket has 48 teeth, the rear sprocket has 16 teeth and the rear wheel has a radius of 30 cm. How far does the bicycle travel for one full turn of the pedals? (Take π = 3.)',
    stemUr:
      'ایک سائیکل کے اگلے (پیڈل والے) اسپروکٹ کے 48 دندانے اور پچھلے اسپروکٹ کے 16 دندانے ہیں، اور پچھلے پہیے کا رداس 30 cm ہے۔ پیڈل کے ایک پورے چکر میں سائیکل کتنا فاصلہ طے کرے گی؟ (π = 3 لیں۔)',
    options: [
      { key: 'A', textEn: '1.8 m', textUr: '1.8 m' },
      { key: 'B', textEn: '1.2 m', textUr: '1.2 m' },
      { key: 'C', textEn: '3.6 m', textUr: '3.6 m' },
      { key: 'D', textEn: '5.4 m', textUr: '5.4 m' },
    ],
    correctOption: 'D',
    explanationEn:
      'The rear wheel turns 48 ÷ 16 = 3 times; each turn covers 2πr = 2 × 3 × 0.3 = 1.8 m, so the bicycle travels 3 × 1.8 = 5.4 m.',
    topic: 'wheel-and-axle',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'In a wheel and axle, if the effort is applied to the axle and the load is at the rim of the wheel, the machine…',
    stemUr: 'پہیہ اور دھری میں اگر قوت دھری پر لگائی جائے اور بوجھ پہیے کے کنارے پر ہو تو یہ مشین…',
    options: [
      {
        key: 'A',
        textEn: 'gains speed and distance at the rim but needs an effort larger than the load',
        textUr: 'کنارے پر رفتار اور فاصلہ بڑھاتی ہے مگر بوجھ سے زیادہ قوت مانگتی ہے',
      },
      {
        key: 'B',
        textEn: 'multiplies the force applied',
        textUr: 'لگائی گئی قوت کو کئی گنا کر دیتی ہے',
      },
      {
        key: 'C',
        textEn: 'has a mechanical advantage greater than 1',
        textUr: 'اس کا میکانی فائدہ 1 سے زیادہ ہوتا ہے',
      },
      { key: 'D', textEn: 'cannot turn at all', textUr: 'بالکل نہیں گھوم سکتی' },
    ],
    correctOption: 'A',
    explanationEn:
      "Driving the axle gives a mechanical advantage below 1: the rim moves farther and faster (as with a car's driven wheels), but a larger force is needed.",
    topic: 'wheel-and-axle',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A screwdriver with a thick handle turns a tight screw more easily than one with a thin handle because…',
    stemUr:
      'موٹے ہینڈل والا پیچ کس، پتلے ہینڈل والے پیچ کس کے مقابلے میں، سخت پیچ کو زیادہ آسانی سے گھماتا ہے کیونکہ…',
    options: [
      { key: 'A', textEn: 'the blade becomes sharper', textUr: 'اس کا پھل زیادہ تیز ہو جاتا ہے' },
      {
        key: 'B',
        textEn: "the screw's thread becomes shallower",
        textUr: 'پیچ کی چوڑی کم گہری ہو جاتی ہے',
      },
      {
        key: 'C',
        textEn: 'a larger handle radius gives more turning effect for the same force',
        textUr: 'ہینڈل کا بڑا رداس اسی قوت سے زیادہ گھمانے والا اثر پیدا کرتا ہے',
      },
      {
        key: 'D',
        textEn: 'a thick handle reduces friction in the thread',
        textUr: 'موٹا ہینڈل چوڑی میں رگڑ کم کر دیتا ہے',
      },
    ],
    correctOption: 'C',
    explanationEn:
      'The handle acts as the wheel and the shaft as the axle; a larger wheel radius gives a bigger moment (force × radius) for the same grip force.',
    topic: 'wheel-and-axle',
    difficulty: 'medium',
  },

  // ─── Springs ──────────────────────────────────────────────────────────────
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A spring stretches by 2 cm when a 10 N weight hangs from it. Assuming it stays within its elastic limit, how much will it stretch under a 30 N weight?',
    stemUr:
      'ایک اسپرنگ پر 10 N کا وزن لٹکانے سے وہ 2 cm کھنچ جاتا ہے۔ یہ فرض کرتے ہوئے کہ وہ اپنی لچک کی حد کے اندر رہتا ہے، 30 N وزن لٹکانے پر وہ کتنا کھنچے گا؟',
    options: [
      { key: 'A', textEn: '2 cm', textUr: '2 cm' },
      { key: 'B', textEn: '3 cm', textUr: '3 cm' },
      { key: 'C', textEn: '6 cm', textUr: '6 cm' },
      { key: 'D', textEn: '15 cm', textUr: '15 cm' },
    ],
    correctOption: 'C',
    explanationEn:
      "Extension is proportional to force (Hooke's law): three times the force gives three times the stretch, 3 × 2 = 6 cm.",
    topic: 'springs',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A spring has a spring constant of 200 N/m. What force is needed to stretch it by 5 cm?',
    stemUr: 'ایک اسپرنگ کا اسپرنگ مستقل 200 N/m ہے۔ اسے 5 cm کھینچنے کے لیے کتنی قوت درکار ہوگی؟',
    options: [
      { key: 'A', textEn: '10 N', textUr: '10 N' },
      { key: 'B', textEn: '1000 N', textUr: '1000 N' },
      { key: 'C', textEn: '40 N', textUr: '40 N' },
      { key: 'D', textEn: '100 N', textUr: '100 N' },
    ],
    correctOption: 'A',
    explanationEn: 'F = kx = 200 N/m × 0.05 m = 10 N (convert 5 cm to 0.05 m first).',
    topic: 'springs',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Two identical springs each stretch 4 cm under a 20 N load. They are hooked one below the other (in series) and a 20 N load hangs from the bottom. What is the total stretch?',
    stemUr:
      'دو یکساں اسپرنگ ہر ایک 20 N بوجھ سے 4 cm کھنچتے ہیں۔ انہیں ایک کے نیچے دوسرا (سلسلہ وار) جوڑ کر سب سے نیچے 20 N کا بوجھ لٹکایا جاتا ہے۔ کل کھنچاؤ کتنا ہوگا؟',
    options: [
      { key: 'A', textEn: '2 cm', textUr: '2 cm' },
      { key: 'B', textEn: '4 cm', textUr: '4 cm' },
      { key: 'C', textEn: '16 cm', textUr: '16 cm' },
      { key: 'D', textEn: '8 cm', textUr: '8 cm' },
    ],
    correctOption: 'D',
    explanationEn:
      'In series each spring carries the full 20 N and stretches 4 cm, so the total stretch is 4 + 4 = 8 cm.',
    topic: 'springs',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Two identical springs each stretch 4 cm under a 20 N load. They are placed side by side (in parallel) and together support a 20 N load shared equally. How far does the pair stretch?',
    stemUr:
      'دو یکساں اسپرنگ ہر ایک 20 N بوجھ سے 4 cm کھنچتے ہیں۔ انہیں ساتھ ساتھ (متوازی) لگا کر 20 N کا بوجھ لٹکایا جاتا ہے جو دونوں میں برابر تقسیم ہوتا ہے۔ یہ جوڑا کتنا کھنچے گا؟',
    options: [
      { key: 'A', textEn: '8 cm', textUr: '8 cm' },
      { key: 'B', textEn: '2 cm', textUr: '2 cm' },
      { key: 'C', textEn: '4 cm', textUr: '4 cm' },
      { key: 'D', textEn: '1 cm', textUr: '1 cm' },
    ],
    correctOption: 'B',
    explanationEn:
      'In parallel each spring carries only 10 N, half its test load, so each stretches 4 ÷ 2 = 2 cm.',
    topic: 'springs',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'What happens when a spring is stretched well beyond its elastic limit?',
    stemUr: 'جب کسی اسپرنگ کو اس کی لچک کی حد سے بہت زیادہ کھینچا جائے تو کیا ہوتا ہے؟',
    options: [
      {
        key: 'A',
        textEn: 'It becomes stiffer and returns to its original length',
        textUr: 'یہ زیادہ سخت ہو جاتا ہے اور اپنی اصل لمبائی پر واپس آ جاتا ہے',
      },
      {
        key: 'B',
        textEn: 'It is permanently stretched and does not return to its original length',
        textUr: 'یہ مستقل طور پر کھنچ جاتا ہے اور اپنی اصل لمبائی پر واپس نہیں آتا',
      },
      {
        key: 'C',
        textEn: 'Its spring constant doubles',
        textUr: 'اس کا اسپرنگ مستقل دوگنا ہو جاتا ہے',
      },
      {
        key: 'D',
        textEn: 'It shrinks to less than its original length',
        textUr: 'یہ سکڑ کر اپنی اصل لمبائی سے بھی چھوٹا ہو جاتا ہے',
      },
    ],
    correctOption: 'B',
    explanationEn:
      'Beyond the elastic limit the deformation is permanent (plastic), so the spring stays longer when the load is removed.',
    topic: 'springs',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Which law states that the extension of a spring is directly proportional to the force applied, provided the elastic limit is not exceeded?',
    stemUr:
      'کون سا قانون کہتا ہے کہ اسپرنگ کا کھنچاؤ لگائی گئی قوت کے براہِ راست متناسب ہوتا ہے، بشرطیکہ لچک کی حد سے تجاوز نہ ہو؟',
    options: [
      { key: 'A', textEn: "Newton's first law", textUr: 'نیوٹن کا پہلا قانون' },
      { key: 'B', textEn: "Pascal's law", textUr: 'پاسکل کا قانون' },
      { key: 'C', textEn: "Boyle's law", textUr: 'بوائل کا قانون' },
      { key: 'D', textEn: "Hooke's law", textUr: 'ہُک کا قانون' },
    ],
    correctOption: 'D',
    explanationEn: "Hooke's law: F = kx, where k is the spring constant and x is the extension.",
    topic: 'springs',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A spring with a spring constant of 400 N/m is compressed by 0.1 m. How much elastic potential energy does it store?',
    stemUr:
      '400 N/m اسپرنگ مستقل والے ایک اسپرنگ کو 0.1 m دبایا جاتا ہے۔ اس میں کتنی لچکدار مخفی توانائی ذخیرہ ہوگی؟',
    options: [
      { key: 'A', textEn: '2 J', textUr: '2 J' },
      { key: 'B', textEn: '40 J', textUr: '40 J' },
      { key: 'C', textEn: '4 J', textUr: '4 J' },
      { key: 'D', textEn: '20 J', textUr: '20 J' },
    ],
    correctOption: 'A',
    explanationEn: 'Elastic energy = ½kx² = ½ × 400 × 0.1² = ½ × 400 × 0.01 = 2 J.',
    topic: 'springs',
    difficulty: 'hard',
  },

  // ─── Fluids: pressure, hydraulics, buoyancy ───────────────────────────────
  {
    testTypeCode: 'mechanical',
    stemEn: 'Why is the wall of a water dam built much thicker at the bottom than at the top?',
    stemUr: 'پانی کے ڈیم کی دیوار نیچے سے اوپر کے مقابلے میں بہت زیادہ موٹی کیوں بنائی جاتی ہے؟',
    options: [
      { key: 'A', textEn: 'To save concrete at the top', textUr: 'اوپر سیمنٹ بچانے کے لیے' },
      {
        key: 'B',
        textEn: 'Because water is lighter near the bottom',
        textUr: 'کیونکہ نیچے پانی ہلکا ہوتا ہے',
      },
      {
        key: 'C',
        textEn: 'Because water pressure increases with depth',
        textUr: 'کیونکہ گہرائی کے ساتھ پانی کا دباؤ بڑھتا ہے',
      },
      {
        key: 'D',
        textEn: 'To reduce evaporation from the reservoir',
        textUr: 'ذخیرے سے بخارات بننے کا عمل کم کرنے کے لیے',
      },
    ],
    correctOption: 'C',
    explanationEn:
      'Liquid pressure = ρgh, so it is greatest at the bottom of the dam, where the wall must be strongest.',
    topic: 'fluids',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'What is the pressure due to the water alone at a depth of 5 m in a lake? (Density of water = 1000 kg/m³, g = 10 m/s².)',
    stemUr:
      'ایک جھیل میں 5 m گہرائی پر صرف پانی کی وجہ سے کتنا دباؤ ہوگا؟ (پانی کی کثافت = 1000 kg/m³، g = 10 m/s²)',
    options: [
      { key: 'A', textEn: '5 kPa', textUr: '5 kPa' },
      { key: 'B', textEn: '500 kPa', textUr: '500 kPa' },
      { key: 'C', textEn: '50 kPa', textUr: '50 kPa' },
      { key: 'D', textEn: '5000 kPa', textUr: '5000 kPa' },
    ],
    correctOption: 'C',
    explanationEn: 'P = ρgh = 1000 × 10 × 5 = 50000 Pa = 50 kPa.',
    topic: 'fluids',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'In a hydraulic press the small piston has an area of 10 cm² and the large piston an area of 500 cm². What force on the small piston will support a 10000 N load on the large piston?',
    stemUr:
      'ایک ہائیڈرالک پریس میں چھوٹے پسٹن کا رقبہ 10 cm² اور بڑے پسٹن کا رقبہ 500 cm² ہے۔ بڑے پسٹن پر رکھے 10000 N کے بوجھ کو سہارنے کے لیے چھوٹے پسٹن پر کتنی قوت لگانی ہوگی؟',
    options: [
      { key: 'A', textEn: '200 N', textUr: '200 N' },
      { key: 'B', textEn: '500 N', textUr: '500 N' },
      { key: 'C', textEn: '50 N', textUr: '50 N' },
      { key: 'D', textEn: '2000 N', textUr: '2000 N' },
    ],
    correctOption: 'A',
    explanationEn:
      'The pressure is the same on both pistons: F ÷ 10 = 10000 ÷ 500, so F = 10000 × 10 ÷ 500 = 200 N.',
    topic: 'fluids',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Hydraulic brakes and car jacks work because pressure applied to an enclosed liquid is transmitted equally throughout it. This is known as…',
    stemUr:
      'ہائیڈرالک بریک اور گاڑی کے جیک اس لیے کام کرتے ہیں کہ بند مائع پر لگایا گیا دباؤ پورے مائع میں یکساں منتقل ہوتا ہے۔ اسے کہتے ہیں…',
    options: [
      { key: 'A', textEn: "Archimedes' principle", textUr: 'ارشمیدس کا اصول' },
      { key: 'B', textEn: "Bernoulli's principle", textUr: 'برنولی کا اصول' },
      { key: 'C', textEn: "Hooke's law", textUr: 'ہُک کا قانون' },
      { key: 'D', textEn: "Pascal's principle", textUr: 'پاسکل کا اصول' },
    ],
    correctOption: 'D',
    explanationEn:
      "Pascal's principle: a pressure applied to an enclosed fluid is transmitted undiminished to every part of it.",
    topic: 'fluids',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A block of wood floats at rest in water with part of it above the surface. The upward buoyant force on the block is…',
    stemUr:
      'لکڑی کا ایک ٹکڑا پانی میں ساکن تیر رہا ہے اور اس کا کچھ حصہ سطح سے اوپر ہے۔ اس پر پانی کی اوپر کی طرف اچھال کی قوت…',
    options: [
      { key: 'A', textEn: 'greater than its weight', textUr: 'اس کے وزن سے زیادہ ہے' },
      { key: 'B', textEn: 'equal to its weight', textUr: 'اس کے وزن کے برابر ہے' },
      { key: 'C', textEn: 'less than its weight', textUr: 'اس کے وزن سے کم ہے' },
      {
        key: 'D',
        textEn: 'zero, because it is floating',
        textUr: 'صفر ہے کیونکہ یہ تیر رہا ہے',
      },
    ],
    correctOption: 'B',
    explanationEn:
      'A floating object is in equilibrium, so the buoyant force exactly balances its weight (the law of flotation).',
    topic: 'fluids',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A stone weighs 50 N in air and 30 N when fully submerged in water. What is the buoyant force on it, and what volume of water does it displace? (g = 10 m/s², density of water = 1000 kg/m³.)',
    stemUr:
      'ایک پتھر کا وزن ہوا میں 50 N اور پانی میں مکمل ڈوبنے پر 30 N ہے۔ اس پر اچھال کی قوت کتنی ہے اور یہ کتنا پانی ہٹاتا ہے؟ (g = 10 m/s²، پانی کی کثافت = 1000 kg/m³)',
    options: [
      { key: 'A', textEn: '30 N; 3 litres', textUr: '30 N؛ 3 لیٹر' },
      { key: 'B', textEn: '20 N; 2 litres', textUr: '20 N؛ 2 لیٹر' },
      { key: 'C', textEn: '20 N; 20 litres', textUr: '20 N؛ 20 لیٹر' },
      { key: 'D', textEn: '80 N; 8 litres', textUr: '80 N؛ 8 لیٹر' },
    ],
    correctOption: 'B',
    explanationEn:
      "Buoyant force = 50 − 30 = 20 N, which equals the weight of water displaced: 2 kg of water, i.e. 0.002 m³ = 2 litres (Archimedes' principle).",
    topic: 'fluids',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A loaded ship sails from a freshwater river into salty sea water. What happens to the level at which it floats?',
    stemUr:
      'ایک لدا ہوا بحری جہاز میٹھے پانی کے دریا سے نکل کر نمکین سمندری پانی میں داخل ہوتا ہے۔ اس کے تیرنے کی سطح پر کیا اثر پڑے گا؟',
    options: [
      {
        key: 'A',
        textEn: 'It sinks lower in the water',
        textUr: 'یہ پانی میں مزید نیچے دھنس جاتا ہے',
      },
      {
        key: 'B',
        textEn: 'It floats at exactly the same level',
        textUr: 'یہ بالکل اسی سطح پر تیرتا ہے',
      },
      { key: 'C', textEn: 'It sinks completely', textUr: 'یہ مکمل طور پر ڈوب جاتا ہے' },
      {
        key: 'D',
        textEn: 'It rises slightly higher in the water',
        textUr: 'یہ پانی میں تھوڑا اوپر اٹھ جاتا ہے',
      },
    ],
    correctOption: 'D',
    explanationEn:
      'Sea water is denser, so a smaller volume of it needs to be displaced to support the same weight, and the ship floats slightly higher.',
    topic: 'fluids',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Three tanks have bases of equal area and are filled with water to the same depth. Tank X widens towards the top, tank Y has straight vertical sides, and tank Z narrows towards the top. How does the water pressure on their bases compare?',
    stemUr:
      'تین ٹینکوں کی تہہ کا رقبہ برابر ہے اور سب میں ایک ہی گہرائی تک پانی بھرا ہے۔ ٹینک X اوپر کی طرف چوڑا ہوتا جاتا ہے، ٹینک Y کے اطراف سیدھے عمودی ہیں، اور ٹینک Z اوپر کی طرف تنگ ہوتا جاتا ہے۔ ان کی تہہ پر پانی کے دباؤ کا موازنہ کیا ہے؟',
    options: [
      {
        key: 'A',
        textEn: 'The pressure is the same on all three bases',
        textUr: 'تینوں کی تہہ پر دباؤ برابر ہے',
      },
      {
        key: 'B',
        textEn: 'X has the greatest pressure',
        textUr: 'X کی تہہ پر سب سے زیادہ دباؤ ہے',
      },
      {
        key: 'C',
        textEn: 'Z has the greatest pressure',
        textUr: 'Z کی تہہ پر سب سے زیادہ دباؤ ہے',
      },
      {
        key: 'D',
        textEn: 'Y has the greatest pressure',
        textUr: 'Y کی تہہ پر سب سے زیادہ دباؤ ہے',
      },
    ],
    correctOption: 'A',
    explanationEn:
      'Liquid pressure depends only on depth and density (P = ρgh), not on the shape of the container or the total volume of liquid.',
    topic: 'fluids',
    difficulty: 'hard',
  },

  // ─── Heat ─────────────────────────────────────────────────────────────────
  {
    testTypeCode: 'mechanical',
    stemEn: 'Why are small gaps left between the sections of a railway track?',
    stemUr: 'ریلوے لائن کے ٹکڑوں کے درمیان چھوٹے خلا کیوں چھوڑے جاتے ہیں؟',
    options: [
      { key: 'A', textEn: 'To save steel', textUr: 'فولاد بچانے کے لیے' },
      { key: 'B', textEn: 'To let rainwater drain away', textUr: 'بارش کا پانی نکالنے کے لیے' },
      {
        key: 'C',
        textEn: 'To allow the rails to expand in hot weather',
        textUr: 'تاکہ گرم موسم میں پٹڑیاں پھیل سکیں',
      },
      {
        key: 'D',
        textEn: 'To make the train run more quietly',
        textUr: 'تاکہ ٹرین کم شور کے ساتھ چلے',
      },
    ],
    correctOption: 'C',
    explanationEn:
      'Steel expands when heated; without gaps the rails would push against each other and buckle on hot days.',
    topic: 'heat',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'Heat reaches the Earth from the Sun through the vacuum of space mainly by…',
    stemUr: 'سورج سے حرارت خلا کے راستے زمین تک بنیادی طور پر کس طریقے سے پہنچتی ہے؟',
    options: [
      { key: 'A', textEn: 'conduction', textUr: 'ایصال (کنڈکشن)' },
      { key: 'B', textEn: 'convection', textUr: 'حمل (کنویکشن)' },
      { key: 'C', textEn: 'radiation', textUr: 'اشعاع (ریڈی ایشن)' },
      { key: 'D', textEn: 'evaporation', textUr: 'تبخیر' },
    ],
    correctOption: 'C',
    explanationEn:
      'Conduction and convection need a material medium; only radiation (electromagnetic waves) can cross the vacuum of space.',
    topic: 'heat',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A straight bimetallic strip is made of brass bonded to iron. When heated, brass expands more than iron. How does the strip bend?',
    stemUr:
      'ایک سیدھی بائی میٹالک پٹی پیتل اور لوہے کو جوڑ کر بنائی گئی ہے۔ گرم کرنے پر پیتل لوہے سے زیادہ پھیلتا ہے۔ یہ پٹی کس طرح مڑے گی؟',
    options: [
      {
        key: 'A',
        textEn: 'With the brass on the outer (curved-out) side',
        textUr: 'پیتل بیرونی (ابھری ہوئی) طرف ہوگا',
      },
      {
        key: 'B',
        textEn: 'With the iron on the outer (curved-out) side',
        textUr: 'لوہا بیرونی (ابھری ہوئی) طرف ہوگا',
      },
      {
        key: 'C',
        textEn: 'It stays straight but becomes longer',
        textUr: 'یہ سیدھی رہے گی مگر لمبی ہو جائے گی',
      },
      {
        key: 'D',
        textEn: 'It bends either way at random',
        textUr: 'یہ اتفاقاً کسی بھی طرف مڑ سکتی ہے',
      },
    ],
    correctOption: 'A',
    explanationEn:
      'The brass becomes longer than the iron, and the longer layer must lie on the outside of the curve; thermostats use this effect.',
    topic: 'heat',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'At room temperature, a metal spoon feels colder to the touch than a wooden spoon. Why?',
    stemUr:
      'کمرے کے درجۂ حرارت پر دھات کا چمچ چھونے میں لکڑی کے چمچ سے زیادہ ٹھنڈا محسوس ہوتا ہے۔ کیوں؟',
    options: [
      {
        key: 'A',
        textEn: 'The metal is actually at a lower temperature',
        textUr: 'دھات کا درجۂ حرارت واقعی کم ہوتا ہے',
      },
      { key: 'B', textEn: 'Wood produces its own heat', textUr: 'لکڑی خود حرارت پیدا کرتی ہے' },
      {
        key: 'C',
        textEn: 'Metal reflects body heat back into the hand',
        textUr: 'دھات جسم کی حرارت واپس ہاتھ کی طرف منعکس کرتی ہے',
      },
      {
        key: 'D',
        textEn: 'Metal conducts heat away from the hand much faster',
        textUr: 'دھات ہاتھ سے حرارت بہت تیزی سے دور لے جاتی ہے',
      },
    ],
    correctOption: 'D',
    explanationEn:
      'Both spoons are at the same temperature, but metal is a good conductor and draws heat from your skin quickly, so it feels colder.',
    topic: 'heat',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A heater near the floor warms the air next to it; the warm air rises and cooler air sinks to take its place. This method of heat transfer is called…',
    stemUr:
      'فرش کے قریب رکھا ہیٹر اپنے پاس کی ہوا کو گرم کرتا ہے؛ گرم ہوا اوپر اٹھتی ہے اور ٹھنڈی ہوا اس کی جگہ لینے نیچے آتی ہے۔ حرارت کی منتقلی کا یہ طریقہ کہلاتا ہے…',
    options: [
      { key: 'A', textEn: 'conduction', textUr: 'ایصال (کنڈکشن)' },
      { key: 'B', textEn: 'convection', textUr: 'حمل (کنویکشن)' },
      { key: 'C', textEn: 'radiation', textUr: 'اشعاع (ریڈی ایشن)' },
      { key: 'D', textEn: 'insulation', textUr: 'حاجز کاری (انسولیشن)' },
    ],
    correctOption: 'B',
    explanationEn:
      'In convection heat is carried by the movement of the fluid itself: warm, less dense air rises and cooler, denser air sinks.',
    topic: 'heat',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'How much heat is needed to raise the temperature of 2 kg of water from 20 °C to 70 °C? (Specific heat capacity of water = 4200 J/kg°C.)',
    stemUr:
      '2 kg پانی کا درجۂ حرارت 20 °C سے 70 °C تک بڑھانے کے لیے کتنی حرارت درکار ہوگی؟ (پانی کی مخصوص حرارتی گنجائش = 4200 J/kg°C)',
    options: [
      { key: 'A', textEn: '210 kJ', textUr: '210 kJ' },
      { key: 'B', textEn: '420 kJ', textUr: '420 kJ' },
      { key: 'C', textEn: '588 kJ', textUr: '588 kJ' },
      { key: 'D', textEn: '8.4 kJ', textUr: '8.4 kJ' },
    ],
    correctOption: 'B',
    explanationEn: 'Q = mcΔT = 2 × 4200 × (70 − 20) = 2 × 4200 × 50 = 420000 J = 420 kJ.',
    topic: 'heat',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A tight metal lid on a glass jar can often be loosened by running hot water over the lid. This works because…',
    stemUr:
      'شیشے کے مرتبان پر کسا ہوا دھاتی ڈھکن اکثر اس پر گرم پانی ڈالنے سے ڈھیلا ہو جاتا ہے۔ اس کی وجہ یہ ہے کہ…',
    options: [
      {
        key: 'A',
        textEn: 'the glass expands more than the metal',
        textUr: 'شیشہ دھات سے زیادہ پھیلتا ہے',
      },
      {
        key: 'B',
        textEn: 'the hot water acts as a lubricant',
        textUr: 'گرم پانی چکنائی کا کام کرتا ہے',
      },
      {
        key: 'C',
        textEn: 'heat makes the metal lid contract',
        textUr: 'حرارت سے دھاتی ڈھکن سکڑ جاتا ہے',
      },
      {
        key: 'D',
        textEn: 'the metal lid expands more than the glass',
        textUr: 'دھاتی ڈھکن شیشے سے زیادہ پھیلتا ہے',
      },
    ],
    correctOption: 'D',
    explanationEn:
      'Metals expand much more than glass for the same temperature rise, so the lid grows slightly larger than the neck of the jar and loosens.',
    topic: 'heat',
    difficulty: 'medium',
  },

  // ─── Electricity ──────────────────────────────────────────────────────────
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A 12 V battery is connected across a 4 Ω resistor. What current flows through the resistor?',
    stemUr: '12 V کی بیٹری 4 Ω کے رزسٹر سے جوڑی گئی ہے۔ رزسٹر میں کتنا کرنٹ بہے گا؟',
    options: [
      { key: 'A', textEn: '3 A', textUr: '3 A' },
      { key: 'B', textEn: '48 A', textUr: '48 A' },
      { key: 'C', textEn: '0.33 A', textUr: '0.33 A' },
      { key: 'D', textEn: '16 A', textUr: '16 A' },
    ],
    correctOption: 'A',
    explanationEn: "Ohm's law: I = V ÷ R = 12 ÷ 4 = 3 A.",
    topic: 'electricity',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Resistors of 2 Ω, 3 Ω and 5 Ω are connected in series. What is their total resistance?',
    stemUr:
      '2 Ω، 3 Ω اور 5 Ω کے رزسٹر سلسلہ وار (سیریز میں) جوڑے گئے ہیں۔ ان کی کل مزاحمت کتنی ہے؟',
    options: [
      { key: 'A', textEn: '1 Ω', textUr: '1 Ω' },
      { key: 'B', textEn: '0.97 Ω', textUr: '0.97 Ω' },
      { key: 'C', textEn: '10 Ω', textUr: '10 Ω' },
      { key: 'D', textEn: '30 Ω', textUr: '30 Ω' },
    ],
    correctOption: 'C',
    explanationEn: 'In series, resistances simply add: 2 + 3 + 5 = 10 Ω.',
    topic: 'electricity',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'Two 6 Ω resistors are connected in parallel. What is their combined resistance?',
    stemUr: 'دو 6 Ω کے رزسٹر متوازی (پیرالل) جوڑے گئے ہیں۔ ان کی مجموعی مزاحمت کتنی ہے؟',
    options: [
      { key: 'A', textEn: '12 Ω', textUr: '12 Ω' },
      { key: 'B', textEn: '6 Ω', textUr: '6 Ω' },
      { key: 'C', textEn: '3 Ω', textUr: '3 Ω' },
      { key: 'D', textEn: '36 Ω', textUr: '36 Ω' },
    ],
    correctOption: 'C',
    explanationEn:
      '1/R = 1/6 + 1/6 = 2/6, so R = 3 Ω; two equal resistors in parallel give half the value of one.',
    topic: 'electricity',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Three identical bulbs are connected in series to a battery and all are lit. If the filament of one bulb breaks, what happens to the other two?',
    stemUr:
      'تین یکساں بلب سلسلہ وار ایک بیٹری سے جڑے ہیں اور تینوں روشن ہیں۔ اگر ایک بلب کا فلامنٹ ٹوٹ جائے تو باقی دو کا کیا ہوگا؟',
    options: [
      { key: 'A', textEn: 'Both go out', textUr: 'دونوں بجھ جائیں گے' },
      { key: 'B', textEn: 'Both become brighter', textUr: 'دونوں زیادہ روشن ہو جائیں گے' },
      {
        key: 'C',
        textEn: 'Both stay lit at the same brightness',
        textUr: 'دونوں اسی روشنی سے جلتے رہیں گے',
      },
      {
        key: 'D',
        textEn: 'One stays lit and the other goes out',
        textUr: 'ایک جلتا رہے گا اور دوسرا بجھ جائے گا',
      },
    ],
    correctOption: 'A',
    explanationEn:
      'A series circuit has only one path for the current; a broken filament opens the circuit, so no current flows through any bulb.',
    topic: 'electricity',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A 6 Ω resistor and a 3 Ω resistor are connected in parallel across a 12 V supply. What total current is drawn from the supply?',
    stemUr:
      '6 Ω اور 3 Ω کے رزسٹر 12 V سپلائی کے ساتھ متوازی جوڑے گئے ہیں۔ سپلائی سے کل کتنا کرنٹ لیا جائے گا؟',
    options: [
      { key: 'A', textEn: '1.33 A', textUr: '1.33 A' },
      { key: 'B', textEn: '2 A', textUr: '2 A' },
      { key: 'C', textEn: '4 A', textUr: '4 A' },
      { key: 'D', textEn: '6 A', textUr: '6 A' },
    ],
    correctOption: 'D',
    explanationEn:
      'Each resistor has the full 12 V across it: 12 ÷ 6 = 2 A and 12 ÷ 3 = 4 A, so the total is 6 A (equivalently 12 V ÷ 2 Ω).',
    topic: 'electricity',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'What is the purpose of a fuse in an electrical circuit?',
    stemUr: 'برقی سرکٹ میں فیوز کا مقصد کیا ہے؟',
    options: [
      {
        key: 'A',
        textEn: 'To store electric charge for later use',
        textUr: 'بعد میں استعمال کے لیے برقی چارج ذخیرہ کرنا',
      },
      {
        key: 'B',
        textEn: 'To melt and break the circuit if the current becomes too large',
        textUr: 'کرنٹ حد سے بڑھنے پر پگھل کر سرکٹ توڑ دینا',
      },
      { key: 'C', textEn: 'To increase the supply voltage', textUr: 'سپلائی وولٹیج بڑھانا' },
      {
        key: 'D',
        textEn: 'To reduce the resistance of the wiring',
        textUr: 'تاروں کی مزاحمت کم کرنا',
      },
    ],
    correctOption: 'B',
    explanationEn:
      'A fuse is a thin wire that heats up and melts when the current exceeds its rating, cutting off the supply and protecting the wiring and appliance.',
    topic: 'electricity',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'An electric kettle is rated 2000 W for a 220 V supply. Which of these fuses is the most suitable for it?',
    stemUr:
      'ایک برقی کیتلی کی درجہ بندی 220 V سپلائی پر 2000 W ہے۔ اس کے لیے درج ذیل میں سے کون سا فیوز سب سے موزوں ہے؟',
    options: [
      { key: 'A', textEn: '3 A', textUr: '3 A' },
      { key: 'B', textEn: '13 A', textUr: '13 A' },
      { key: 'C', textEn: '5 A', textUr: '5 A' },
      { key: 'D', textEn: '30 A', textUr: '30 A' },
    ],
    correctOption: 'B',
    explanationEn:
      'Normal current I = P ÷ V = 2000 ÷ 220 ≈ 9 A; the fuse should be the smallest rating above this, i.e. 13 A (3 A and 5 A would blow, 30 A would not protect).',
    topic: 'electricity',
    difficulty: 'hard',
  },

  // ─── Magnetism ────────────────────────────────────────────────────────────
  {
    testTypeCode: 'mechanical',
    stemEn:
      'The north pole of one bar magnet is brought close to the north pole of another bar magnet. What happens?',
    stemUr:
      'ایک سلاخی مقناطیس (بار میگنیٹ) کا شمالی قطب دوسرے سلاخی مقناطیس کے شمالی قطب کے قریب لایا جاتا ہے۔ کیا ہوگا؟',
    options: [
      { key: 'A', textEn: 'They attract each other', textUr: 'وہ ایک دوسرے کو کھینچیں گے' },
      {
        key: 'B',
        textEn: 'Nothing; they have no effect on each other',
        textUr: 'کچھ نہیں؛ ان کا ایک دوسرے پر کوئی اثر نہیں',
      },
      {
        key: 'C',
        textEn: 'Both magnets instantly lose their magnetism',
        textUr: 'دونوں مقناطیس فوراً اپنی مقناطیسیت کھو دیں گے',
      },
      { key: 'D', textEn: 'They repel each other', textUr: 'وہ ایک دوسرے کو دھکیلیں گے' },
    ],
    correctOption: 'D',
    explanationEn: 'Like poles repel and unlike poles attract.',
    topic: 'magnetism',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'Which of these metals is strongly attracted by a magnet?',
    stemUr: 'درج ذیل میں سے کون سی دھات مقناطیس کی طرف زور سے کھنچتی ہے؟',
    options: [
      { key: 'A', textEn: 'Iron', textUr: 'لوہا' },
      { key: 'B', textEn: 'Copper', textUr: 'تانبا' },
      { key: 'C', textEn: 'Aluminium', textUr: 'ایلومینیم' },
      { key: 'D', textEn: 'Brass', textUr: 'پیتل' },
    ],
    correctOption: 'A',
    explanationEn:
      'Iron is ferromagnetic (like nickel and cobalt); copper, aluminium and brass are not noticeably attracted.',
    topic: 'magnetism',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'A bar magnet is cut in half across its middle. What do you get?',
    stemUr: 'ایک سلاخی مقناطیس کو درمیان سے آڑا دو حصوں میں کاٹ دیا جاتا ہے۔ نتیجہ کیا ہوگا؟',
    options: [
      {
        key: 'A',
        textEn: 'One piece with only a north pole and one with only a south pole',
        textUr: 'ایک ٹکڑا صرف شمالی قطب والا اور دوسرا صرف جنوبی قطب والا',
      },
      {
        key: 'B',
        textEn: 'Two pieces with no magnetism',
        textUr: 'دو ٹکڑے جن میں کوئی مقناطیسیت نہیں',
      },
      {
        key: 'C',
        textEn: 'Two smaller magnets, each with a north and a south pole',
        textUr: 'دو چھوٹے مقناطیس، جن میں سے ہر ایک کا شمالی اور جنوبی قطب ہے',
      },
      {
        key: 'D',
        textEn: 'Two pieces that each have two north poles',
        textUr: 'دو ٹکڑے جن میں سے ہر ایک کے دو شمالی قطب ہیں',
      },
    ],
    correctOption: 'C',
    explanationEn:
      'Magnetic poles always come in pairs; each piece becomes a complete magnet with its own north and south pole.',
    topic: 'magnetism',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'Which change will make an electromagnet stronger?',
    stemUr: 'کون سی تبدیلی برقی مقناطیس کو زیادہ طاقتور بنائے گی؟',
    options: [
      {
        key: 'A',
        textEn: 'Replacing its soft-iron core with a copper core',
        textUr: 'نرم لوہے کے کور کی جگہ تانبے کا کور لگانا',
      },
      { key: 'B', textEn: 'Reducing the current in the coil', textUr: 'کوائل میں کرنٹ کم کرنا' },
      {
        key: 'C',
        textEn: 'Increasing the number of turns in the coil',
        textUr: 'کوائل کے چکروں (ٹرنز) کی تعداد بڑھانا',
      },
      {
        key: 'D',
        textEn: 'Removing the iron core altogether',
        textUr: 'لوہے کا کور بالکل نکال دینا',
      },
    ],
    correctOption: 'C',
    explanationEn:
      'An electromagnet gets stronger with more turns, a larger current and a soft-iron core.',
    topic: 'magnetism',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A bar magnet hung freely from a thread comes to rest pointing roughly north–south. Why?',
    stemUr:
      'دھاگے سے آزادانہ لٹکایا گیا سلاخی مقناطیس تقریباً شمال-جنوب کی سمت میں رک جاتا ہے۔ کیوں؟',
    options: [
      {
        key: 'A',
        textEn: 'The Earth behaves like a huge magnet',
        textUr: 'زمین ایک بہت بڑے مقناطیس کی طرح برتاؤ کرتی ہے',
      },
      {
        key: 'B',
        textEn: 'The Sun attracts its north pole',
        textUr: 'سورج اس کے شمالی قطب کو کھینچتا ہے',
      },
      {
        key: 'C',
        textEn: 'Air currents flow from north to south',
        textUr: 'ہوا کے دھارے شمال سے جنوب کی طرف بہتے ہیں',
      },
      {
        key: 'D',
        textEn: 'The thread twists until it points north',
        textUr: 'دھاگا مڑتا رہتا ہے یہاں تک کہ مقناطیس شمال کی طرف ہو جائے',
      },
    ],
    correctOption: 'A',
    explanationEn:
      "The Earth's magnetic field acts on the magnet's poles and lines it up along the magnetic north–south direction, which is how a compass works.",
    topic: 'magnetism',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Which device converts mechanical (rotational) energy into electrical energy by turning a coil in a magnetic field?',
    stemUr:
      'کون سا آلہ مقناطیسی میدان میں کوائل کو گھما کر میکانی (گردشی) توانائی کو برقی توانائی میں بدلتا ہے؟',
    options: [
      { key: 'A', textEn: 'Electric motor', textUr: 'برقی موٹر' },
      { key: 'B', textEn: 'Transformer', textUr: 'ٹرانسفارمر' },
      { key: 'C', textEn: 'Electromagnet', textUr: 'برقی مقناطیس' },
      { key: 'D', textEn: 'Generator (dynamo)', textUr: 'جنریٹر (ڈائنمو)' },
    ],
    correctOption: 'D',
    explanationEn:
      'A generator uses electromagnetic induction to turn motion into electricity; a motor does the reverse.',
    topic: 'magnetism',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A transformer has 1000 turns on its primary coil and 50 turns on its secondary coil. If 220 V AC is applied to the primary, what is the secondary voltage?',
    stemUr:
      'ایک ٹرانسفارمر کے پرائمری کوائل میں 1000 چکر اور سیکنڈری کوائل میں 50 چکر ہیں۔ اگر پرائمری پر 220 V AC لگائے جائیں تو سیکنڈری وولٹیج کتنا ہوگا؟',
    options: [
      { key: 'A', textEn: '4400 V', textUr: '4400 V' },
      { key: 'B', textEn: '11 V', textUr: '11 V' },
      { key: 'C', textEn: '22 V', textUr: '22 V' },
      { key: 'D', textEn: '110 V', textUr: '110 V' },
    ],
    correctOption: 'B',
    explanationEn: 'Vs ÷ Vp = Ns ÷ Np, so Vs = 220 × 50 ÷ 1000 = 11 V (a step-down transformer).',
    topic: 'magnetism',
    difficulty: 'hard',
  },

  // ─── Motion and forces ────────────────────────────────────────────────────
  {
    testTypeCode: 'mechanical',
    stemEn: 'Why do car tyres have grooves (tread) cut into them?',
    stemUr: 'گاڑی کے ٹائروں پر نالیاں (ٹریڈ) کیوں بنائی جاتی ہیں؟',
    options: [
      { key: 'A', textEn: 'To make the tyres lighter', textUr: 'ٹائروں کو ہلکا کرنے کے لیے' },
      {
        key: 'B',
        textEn: 'To push water away and keep a good grip on wet roads',
        textUr: 'پانی کو باہر دھکیل کر گیلی سڑک پر اچھی گرفت برقرار رکھنے کے لیے',
      },
      {
        key: 'C',
        textEn: 'To reduce friction so the car can go faster',
        textUr: 'رگڑ کم کرنے کے لیے تاکہ گاڑی تیز چلے',
      },
      { key: 'D', textEn: 'Only for decoration', textUr: 'صرف خوبصورتی کے لیے' },
    ],
    correctOption: 'B',
    explanationEn:
      'The grooves channel water out from under the tyre so the rubber stays in contact with the road, maintaining friction (grip).',
    topic: 'motion-and-forces',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A truck is more likely to tip over on a sharp bend when its load is stacked high rather than kept low. Why?',
    stemUr:
      'تیز موڑ پر ٹرک کے الٹنے کا امکان تب زیادہ ہوتا ہے جب اس کا سامان نیچے رکھنے کے بجائے اونچا لدا ہو۔ کیوں؟',
    options: [
      {
        key: 'A',
        textEn: 'The truck becomes heavier at the front',
        textUr: 'ٹرک آگے سے بھاری ہو جاتا ہے',
      },
      {
        key: 'B',
        textEn: 'Friction with the road increases',
        textUr: 'سڑک کے ساتھ رگڑ بڑھ جاتی ہے',
      },
      { key: 'C', textEn: 'The centre of gravity moves lower', textUr: 'مرکزِ ثقل نیچے آ جاتا ہے' },
      {
        key: 'D',
        textEn: 'The centre of gravity is raised, making it less stable',
        textUr: 'مرکزِ ثقل اونچا ہو جاتا ہے جس سے استحکام کم ہو جاتا ہے',
      },
    ],
    correctOption: 'D',
    explanationEn:
      'With a higher centre of gravity only a small tilt moves it outside the base formed by the wheels, so the truck topples more easily.',
    topic: 'motion-and-forces',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A resultant force of 20 N acts on a 4 kg trolley on a smooth floor. What is its acceleration?',
    stemUr:
      'ایک ہموار فرش پر 4 kg کی ٹرالی پر 20 N کی نتیجی قوت عمل کرتی ہے۔ اس کا اسراع کتنا ہوگا؟',
    options: [
      { key: 'A', textEn: '5 m/s²', textUr: '5 m/s²' },
      { key: 'B', textEn: '80 m/s²', textUr: '80 m/s²' },
      { key: 'C', textEn: '0.2 m/s²', textUr: '0.2 m/s²' },
      { key: 'D', textEn: '24 m/s²', textUr: '24 m/s²' },
    ],
    correctOption: 'A',
    explanationEn: "Newton's second law: a = F ÷ m = 20 ÷ 4 = 5 m/s².",
    topic: 'motion-and-forces',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A 2 kg ball moving at 6 m/s hits a stationary 4 kg ball, and the two stick together. What is their common speed just after the collision?',
    stemUr:
      '6 m/s سے حرکت کرتی ہوئی 2 kg کی گیند ساکن 4 kg کی گیند سے ٹکراتی ہے اور دونوں آپس میں چپک جاتی ہیں۔ ٹکر کے فوراً بعد ان کی مشترکہ رفتار کیا ہوگی؟',
    options: [
      { key: 'A', textEn: '3 m/s', textUr: '3 m/s' },
      { key: 'B', textEn: '6 m/s', textUr: '6 m/s' },
      { key: 'C', textEn: '2 m/s', textUr: '2 m/s' },
      { key: 'D', textEn: '4 m/s', textUr: '4 m/s' },
    ],
    correctOption: 'C',
    explanationEn:
      'Momentum is conserved: 2 × 6 = 12 kg m/s before, so (2 + 4) × v = 12 and v = 2 m/s.',
    topic: 'motion-and-forces',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Standing passengers in a bus lurch forward when the driver brakes suddenly. This is because of…',
    stemUr:
      'جب ڈرائیور اچانک بریک لگاتا ہے تو بس میں کھڑے مسافر آگے کی طرف جھک جاتے ہیں۔ اس کی وجہ ہے…',
    options: [
      { key: 'A', textEn: 'friction', textUr: 'رگڑ' },
      { key: 'B', textEn: 'gravity', textUr: 'کششِ ثقل' },
      { key: 'C', textEn: 'inertia', textUr: 'جمود (اِنرشیا)' },
      { key: 'D', textEn: 'buoyancy', textUr: 'اچھال' },
    ],
    correctOption: 'C',
    explanationEn:
      "The passengers' bodies tend to keep moving forward at the bus's earlier speed (inertia, Newton's first law) while the bus slows down.",
    topic: 'motion-and-forces',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'Ball bearings are fitted in the wheel hubs of bicycles mainly to…',
    stemUr: 'سائیکل کے پہیوں کے حب میں بال بیئرنگ بنیادی طور پر کس لیے لگائے جاتے ہیں؟',
    options: [
      {
        key: 'A',
        textEn: 'reduce friction by replacing sliding with rolling',
        textUr: 'پھسلنے کی جگہ لڑھکنے کا عمل لا کر رگڑ کم کرنے کے لیے',
      },
      {
        key: 'B',
        textEn: 'increase friction for better braking',
        textUr: 'بہتر بریک کے لیے رگڑ بڑھانے کے لیے',
      },
      {
        key: 'C',
        textEn: 'make the wheel heavier and more stable',
        textUr: 'پہیے کو بھاری اور زیادہ مستحکم بنانے کے لیے',
      },
      {
        key: 'D',
        textEn: 'store energy for climbing hills',
        textUr: 'چڑھائی کے لیے توانائی ذخیرہ کرنے کے لیے',
      },
    ],
    correctOption: 'A',
    explanationEn:
      'Rolling friction is much smaller than sliding friction, so the balls let the wheel turn freely with less wear and heating.',
    topic: 'motion-and-forces',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'When a rifle is fired, it recoils (kicks back) against the shoulder. Which law best explains this?',
    stemUr:
      'رائفل چلانے پر وہ کندھے کی طرف پیچھے کو جھٹکا (ری کوئل) دیتی ہے۔ اس کی بہترین وضاحت کون سا قانون کرتا ہے؟',
    options: [
      { key: 'A', textEn: "Newton's first law", textUr: 'نیوٹن کا پہلا قانون' },
      { key: 'B', textEn: "Hooke's law", textUr: 'ہُک کا قانون' },
      { key: 'C', textEn: "Pascal's principle", textUr: 'پاسکل کا اصول' },
      {
        key: 'D',
        textEn: "Newton's third law (action and reaction)",
        textUr: 'نیوٹن کا تیسرا قانون (عمل اور ردِعمل)',
      },
    ],
    correctOption: 'D',
    explanationEn:
      'The rifle pushes the bullet forward and the bullet pushes the rifle backward with an equal and opposite force; equivalently, total momentum stays zero.',
    topic: 'motion-and-forces',
    difficulty: 'medium',
  },

  // ─── Energy and work ──────────────────────────────────────────────────────
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A force of 50 N pushes a box 4 m across the floor in the direction of the force. How much work is done?',
    stemUr: '50 N کی قوت ایک ڈبے کو قوت کی سمت میں فرش پر 4 m دھکیلتی ہے۔ کتنا کام ہوا؟',
    options: [
      { key: 'A', textEn: '12.5 J', textUr: '12.5 J' },
      { key: 'B', textEn: '200 J', textUr: '200 J' },
      { key: 'C', textEn: '54 J', textUr: '54 J' },
      { key: 'D', textEn: '46 J', textUr: '46 J' },
    ],
    correctOption: 'B',
    explanationEn: 'Work = force × distance moved in the direction of the force = 50 × 4 = 200 J.',
    topic: 'energy-and-work',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A 5 kg bag is lifted 2 m onto a shelf. How much gravitational potential energy does it gain? (g = 10 m/s².)',
    stemUr:
      '5 kg کا ایک تھیلا 2 m اوپر شیلف پر رکھا جاتا ہے۔ اسے کتنی ثقلی مخفی توانائی حاصل ہوگی؟ (g = 10 m/s²)',
    options: [
      { key: 'A', textEn: '10 J', textUr: '10 J' },
      { key: 'B', textEn: '100 J', textUr: '100 J' },
      { key: 'C', textEn: '50 J', textUr: '50 J' },
      { key: 'D', textEn: '25 J', textUr: '25 J' },
    ],
    correctOption: 'B',
    explanationEn: 'PE = mgh = 5 × 10 × 2 = 100 J.',
    topic: 'energy-and-work',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'What is the kinetic energy of a 2 kg object moving at 3 m/s?',
    stemUr: '3 m/s سے حرکت کرتی ہوئی 2 kg کی چیز کی حرکی توانائی کتنی ہے؟',
    options: [
      { key: 'A', textEn: '6 J', textUr: '6 J' },
      { key: 'B', textEn: '18 J', textUr: '18 J' },
      { key: 'C', textEn: '3 J', textUr: '3 J' },
      { key: 'D', textEn: '9 J', textUr: '9 J' },
    ],
    correctOption: 'D',
    explanationEn: 'KE = ½mv² = ½ × 2 × 3² = ½ × 2 × 9 = 9 J.',
    topic: 'energy-and-work',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A porter carries a heavy box across a level floor at a steady speed, keeping it at the same height. How much work does his upward supporting force do on the box?',
    stemUr:
      'ایک قلی ایک بھاری ڈبہ اٹھائے ہموار فرش پر یکساں رفتار سے چلتا ہے اور ڈبے کو ایک ہی اونچائی پر رکھتا ہے۔ اس کی اوپر کی طرف سہارا دینے والی قوت ڈبے پر کتنا کام کرتی ہے؟',
    options: [
      { key: 'A', textEn: 'Zero', textUr: 'صفر' },
      {
        key: 'B',
        textEn: "The box's weight multiplied by the distance walked",
        textUr: 'ڈبے کا وزن ضرب طے شدہ فاصلہ',
      },
      {
        key: 'C',
        textEn: "The box's weight multiplied by its height above the floor",
        textUr: 'ڈبے کا وزن ضرب فرش سے اس کی اونچائی',
      },
      { key: 'D', textEn: 'A negative amount', textUr: 'منفی مقدار' },
    ],
    correctOption: 'A',
    explanationEn:
      'Work = force × displacement in the direction of the force; the supporting force is vertical but the box moves horizontally, so this force does no work.',
    topic: 'energy-and-work',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A motor lifts a 60 kg load through a height of 10 m in 20 s at a steady speed. What is its useful power output? (g = 10 m/s².)',
    stemUr:
      'ایک موٹر 60 kg کے بوجھ کو یکساں رفتار سے 20 s میں 10 m اونچا اٹھاتی ہے۔ اس کی مفید طاقت (پاور) کتنی ہے؟ (g = 10 m/s²)',
    options: [
      { key: 'A', textEn: '30 W', textUr: '30 W' },
      { key: 'B', textEn: '120 W', textUr: '120 W' },
      { key: 'C', textEn: '300 W', textUr: '300 W' },
      { key: 'D', textEn: '6000 W', textUr: '6000 W' },
    ],
    correctOption: 'C',
    explanationEn: 'Work = mgh = 60 × 10 × 10 = 6000 J; power = work ÷ time = 6000 ÷ 20 = 300 W.',
    topic: 'energy-and-work',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A ball is dropped from rest from a height of 5 m. Ignoring air resistance, at what speed does it hit the ground? (g = 10 m/s².)',
    stemUr:
      'ایک گیند کو 5 m کی اونچائی سے سکون کی حالت سے گرایا جاتا ہے۔ ہوا کی مزاحمت کو نظرانداز کرتے ہوئے یہ زمین سے کس رفتار سے ٹکرائے گی؟ (g = 10 m/s²)',
    options: [
      { key: 'A', textEn: '5 m/s', textUr: '5 m/s' },
      { key: 'B', textEn: '50 m/s', textUr: '50 m/s' },
      { key: 'C', textEn: '10 m/s', textUr: '10 m/s' },
      { key: 'D', textEn: '25 m/s', textUr: '25 m/s' },
    ],
    correctOption: 'C',
    explanationEn:
      'All the potential energy becomes kinetic: mgh = ½mv², so v² = 2gh = 2 × 10 × 5 = 100 and v = 10 m/s.',
    topic: 'energy-and-work',
    difficulty: 'hard',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A machine does 400 J of useful work when 500 J of energy is supplied to it. What is its efficiency?',
    stemUr:
      'ایک مشین کو 500 J توانائی دی جاتی ہے اور وہ 400 J مفید کام کرتی ہے۔ اس کی کارکردگی کتنی ہے؟',
    options: [
      { key: 'A', textEn: '80%', textUr: '80%' },
      { key: 'B', textEn: '125%', textUr: '125%' },
      { key: 'C', textEn: '20%', textUr: '20%' },
      { key: 'D', textEn: '100%', textUr: '100%' },
    ],
    correctOption: 'A',
    explanationEn:
      'Efficiency = useful output ÷ input × 100% = 400 ÷ 500 × 100% = 80%; the other 100 J is wasted, mostly as heat.',
    topic: 'energy-and-work',
    difficulty: 'easy',
  },

  // ─── Tools ────────────────────────────────────────────────────────────────
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Which hand tool is the correct choice for cutting through a steel rod or a metal pipe?',
    stemUr: 'فولادی سلاخ یا دھاتی پائپ کاٹنے کے لیے کون سا دستی اوزار درست انتخاب ہے؟',
    options: [
      { key: 'A', textEn: 'Wood handsaw', textUr: 'لکڑی کاٹنے والی آری' },
      { key: 'B', textEn: 'Wood chisel', textUr: 'لکڑی کی چھینی' },
      { key: 'C', textEn: "Carpenter's plane", textUr: 'رندہ' },
      { key: 'D', textEn: 'Hacksaw', textUr: 'ہیکسا (لوہا کاٹنے والی آری)' },
    ],
    correctOption: 'D',
    explanationEn:
      'A hacksaw has a fine-toothed, hardened blade held in tension in a frame, designed for cutting metal.',
    topic: 'tools',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'Which is the proper tool for tightening or loosening a hexagonal nut?',
    stemUr: 'چھ پہلو والے نٹ کو کسنے یا ڈھیلا کرنے کے لیے مناسب اوزار کون سا ہے؟',
    options: [
      { key: 'A', textEn: 'Screwdriver', textUr: 'پیچ کس' },
      { key: 'B', textEn: 'Spanner (wrench)', textUr: 'پانا (اسپینر)' },
      { key: 'C', textEn: 'Hammer', textUr: 'ہتھوڑا' },
      { key: 'D', textEn: 'File', textUr: 'ریتی' },
    ],
    correctOption: 'B',
    explanationEn:
      'A spanner grips the flat sides of the nut and acts as a lever to turn it without damaging the corners.',
    topic: 'tools',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: "A carpenter's plane is used to…",
    stemUr: 'بڑھئی کا رندہ کس کام کے لیے استعمال ہوتا ہے؟',
    options: [
      { key: 'A', textEn: 'drill round holes in wood', textUr: 'لکڑی میں گول سوراخ کرنے کے لیے' },
      {
        key: 'B',
        textEn: 'smooth and level wood by shaving off thin layers',
        textUr: 'لکڑی کی پتلی تہیں اتار کر اسے ہموار کرنے کے لیے',
      },
      {
        key: 'C',
        textEn: 'check that corners are at right angles',
        textUr: 'یہ جانچنے کے لیے کہ کونے قائمہ زاویے پر ہیں',
      },
      { key: 'D', textEn: 'drive nails into wood', textUr: 'لکڑی میں کیلیں ٹھونکنے کے لیے' },
    ],
    correctOption: 'B',
    explanationEn:
      'A plane has an angled blade that shaves thin strips from the surface, making the wood smooth, flat and to size.',
    topic: 'tools',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'Which tool is used to check whether a shelf is perfectly horizontal?',
    stemUr: 'یہ جانچنے کے لیے کہ شیلف بالکل افقی ہے، کون سا اوزار استعمال ہوتا ہے؟',
    options: [
      { key: 'A', textEn: 'Try square', textUr: 'ٹرائی اسکوائر' },
      { key: 'B', textEn: 'Plumb line', textUr: 'ساہل (پلمب لائن)' },
      { key: 'C', textEn: 'Vernier calipers', textUr: 'ورنیئر کیلیپرز' },
      { key: 'D', textEn: 'Spirit level', textUr: 'اسپرٹ لیول' },
    ],
    correctOption: 'D',
    explanationEn:
      'A spirit level shows a centred air bubble when the surface is horizontal; a plumb line checks vertical and a try square checks right angles.',
    topic: 'tools',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'When loosening a very tight nut with a spanner, why is it better to hold the spanner near the end of its handle rather than close to the nut?',
    stemUr:
      'بہت سخت نٹ کو اسپینر سے کھولتے وقت اسپینر کو نٹ کے قریب پکڑنے کے بجائے ہینڈل کے آخری سرے سے پکڑنا کیوں بہتر ہے؟',
    options: [
      {
        key: 'A',
        textEn: 'It gives a larger turning effect for the same force',
        textUr: 'اسی قوت سے زیادہ گھمانے والا اثر ملتا ہے',
      },
      {
        key: 'B',
        textEn: 'It reduces the turning effect so the nut is not damaged',
        textUr: 'گھمانے والا اثر کم ہو جاتا ہے تاکہ نٹ خراب نہ ہو',
      },
      {
        key: 'C',
        textEn: 'It makes no difference to the turning effect',
        textUr: 'گھمانے والے اثر پر کوئی فرق نہیں پڑتا',
      },
      {
        key: 'D',
        textEn: 'It changes the direction in which the nut turns',
        textUr: 'نٹ کے گھومنے کی سمت بدل جاتی ہے',
      },
    ],
    correctOption: 'A',
    explanationEn:
      'Moment = force × perpendicular distance from the pivot, so a longer distance gives a bigger turning effect for the same effort.',
    topic: 'tools',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'Which instrument would you use to measure the diameter of a thin wire most accurately?',
    stemUr: 'پتلی تار کا قطر سب سے زیادہ درستی سے ناپنے کے لیے آپ کون سا آلہ استعمال کریں گے؟',
    options: [
      { key: 'A', textEn: 'Metre rule', textUr: 'میٹر راڈ' },
      { key: 'B', textEn: 'Measuring tape', textUr: 'ناپنے والا فیتہ' },
      { key: 'C', textEn: 'Micrometer screw gauge', textUr: 'مائیکرومیٹر اسکرو گیج' },
      { key: 'D', textEn: 'Spirit level', textUr: 'اسپرٹ لیول' },
    ],
    correctOption: 'C',
    explanationEn:
      'A micrometer screw gauge reads to about 0.01 mm, far finer than a metre rule or tape (1 mm); a spirit level does not measure length at all.',
    topic: 'tools',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'When using a hand file on a piece of metal clamped in a vice, on which stroke does the file do its cutting?',
    stemUr:
      'شکنجے (وائس) میں کسے ہوئے دھات کے ٹکڑے پر دستی ریتی چلاتے وقت ریتی کس حرکت پر کٹائی کرتی ہے؟',
    options: [
      {
        key: 'A',
        textEn: 'On the backward (pulling) stroke',
        textUr: 'پیچھے کھینچنے والی حرکت پر',
      },
      { key: 'B', textEn: 'Equally on both strokes', textUr: 'دونوں حرکتوں پر برابر' },
      { key: 'C', textEn: 'On the forward (pushing) stroke', textUr: 'آگے دھکیلنے والی حرکت پر' },
      {
        key: 'D',
        textEn: 'Only when the file is twisted',
        textUr: 'صرف اس وقت جب ریتی کو مروڑا جائے',
      },
    ],
    correctOption: 'C',
    explanationEn:
      'File teeth point away from the handle, so they cut on the forward stroke; pressure is eased on the return stroke to avoid blunting the teeth.',
    topic: 'tools',
    difficulty: 'hard',
  },

  // ─── Sound and light ──────────────────────────────────────────────────────
  {
    testTypeCode: 'mechanical',
    stemEn: 'Sound cannot travel through…',
    stemUr: 'آواز کس میں سے نہیں گزر سکتی؟',
    options: [
      { key: 'A', textEn: 'a vacuum', textUr: 'خلا (ویکیوم)' },
      { key: 'B', textEn: 'water', textUr: 'پانی' },
      { key: 'C', textEn: 'steel', textUr: 'فولاد' },
      { key: 'D', textEn: 'air', textUr: 'ہوا' },
    ],
    correctOption: 'A',
    explanationEn:
      'Sound is a mechanical wave that needs the particles of a medium to vibrate, so it cannot pass through empty space.',
    topic: 'sound-and-light',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'During a storm you see the lightning before you hear the thunder, although both happen at the same moment. Why?',
    stemUr:
      'طوفان کے دوران بجلی کی چمک پہلے نظر آتی ہے اور گرج بعد میں سنائی دیتی ہے، حالانکہ دونوں ایک ہی لمحے میں پیدا ہوتی ہیں۔ کیوں؟',
    options: [
      {
        key: 'A',
        textEn: 'Thunder is produced some time after the lightning',
        textUr: 'گرج بجلی کے کچھ دیر بعد پیدا ہوتی ہے',
      },
      {
        key: 'B',
        textEn: 'Your eyes are more sensitive than your ears',
        textUr: 'آنکھیں کانوں سے زیادہ حساس ہوتی ہیں',
      },
      {
        key: 'C',
        textEn: 'Sound travels faster than light',
        textUr: 'آواز روشنی سے زیادہ تیز چلتی ہے',
      },
      {
        key: 'D',
        textEn: 'Light travels much faster than sound',
        textUr: 'روشنی آواز سے بہت زیادہ تیز چلتی ہے',
      },
    ],
    correctOption: 'D',
    explanationEn:
      'Light travels at about 3 × 10⁸ m/s while sound in air travels at only about 340 m/s, so the sound arrives later.',
    topic: 'sound-and-light',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A person shouts towards a cliff and hears the echo 2 s later. If sound travels at 340 m/s, how far away is the cliff?',
    stemUr:
      'ایک شخص چٹان کی طرف آواز دیتا ہے اور 2 s بعد بازگشت سنتا ہے۔ اگر آواز کی رفتار 340 m/s ہو تو چٹان کتنی دور ہے؟',
    options: [
      { key: 'A', textEn: '680 m', textUr: '680 m' },
      { key: 'B', textEn: '340 m', textUr: '340 m' },
      { key: 'C', textEn: '170 m', textUr: '170 m' },
      { key: 'D', textEn: '1360 m', textUr: '1360 m' },
    ],
    correctOption: 'B',
    explanationEn:
      'In 2 s the sound travels 340 × 2 = 680 m, but that is there and back, so the cliff is 680 ÷ 2 = 340 m away.',
    topic: 'sound-and-light',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn: 'The image formed by a flat (plane) mirror is located…',
    stemUr: 'ہموار (مستوی) آئینے میں بننے والا عکس کہاں ہوتا ہے؟',
    options: [
      {
        key: 'A',
        textEn: 'twice as far behind the mirror as the object is in front of it',
        textUr: 'آئینے کے پیچھے، جسم کے فاصلے سے دوگنا دور',
      },
      {
        key: 'B',
        textEn: 'as far behind the mirror as the object is in front of it',
        textUr: 'آئینے کے پیچھے، اتنا ہی دور جتنا جسم آئینے کے سامنے ہے',
      },
      { key: 'C', textEn: 'on the surface of the mirror', textUr: 'آئینے کی سطح پر' },
      {
        key: 'D',
        textEn: 'half as far behind the mirror as the object is in front of it',
        textUr: 'آئینے کے پیچھے، جسم کے فاصلے سے آدھا دور',
      },
    ],
    correctOption: 'B',
    explanationEn:
      'A plane mirror forms a virtual image the same distance behind the mirror as the object is in front of it.',
    topic: 'sound-and-light',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A straight pencil placed at an angle in a glass of water appears bent at the water surface. This is caused by…',
    stemUr:
      'پانی کے گلاس میں ترچھی رکھی ہوئی سیدھی پنسل پانی کی سطح پر مڑی ہوئی نظر آتی ہے۔ اس کی وجہ ہے…',
    options: [
      { key: 'A', textEn: 'reflection', textUr: 'انعکاس (ریفلیکشن)' },
      { key: 'B', textEn: 'diffraction', textUr: 'ڈفریکشن' },
      { key: 'C', textEn: 'dispersion', textUr: 'انتشار (ڈسپرشن)' },
      { key: 'D', textEn: 'refraction', textUr: 'انعطاف (ریفریکشن)' },
    ],
    correctOption: 'D',
    explanationEn:
      'Light changes speed and direction as it passes from water into air (refraction), so the submerged part appears displaced.',
    topic: 'sound-and-light',
    difficulty: 'easy',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A guitar string is tightened (its tension is increased) while its length stays the same. How does the note it produces change?',
    stemUr:
      'گٹار کے تار کو کس دیا جاتا ہے (اس کا تناؤ بڑھا دیا جاتا ہے) جبکہ اس کی لمبائی وہی رہتی ہے۔ اس سے پیدا ہونے والی آواز میں کیا تبدیلی آئے گی؟',
    options: [
      { key: 'A', textEn: 'Its pitch becomes higher', textUr: 'اس کا سُر (پچ) اونچا ہو جائے گا' },
      { key: 'B', textEn: 'Its pitch becomes lower', textUr: 'اس کا سُر (پچ) نیچا ہو جائے گا' },
      {
        key: 'C',
        textEn: 'It becomes louder but the pitch stays the same',
        textUr: 'آواز بلند ہو جائے گی مگر سُر وہی رہے گا',
      },
      { key: 'D', textEn: 'It does not change at all', textUr: 'اس میں کوئی تبدیلی نہیں آئے گی' },
    ],
    correctOption: 'A',
    explanationEn:
      'Greater tension makes the string vibrate at a higher frequency, and a higher frequency is heard as a higher pitch.',
    topic: 'sound-and-light',
    difficulty: 'medium',
  },
  {
    testTypeCode: 'mechanical',
    stemEn:
      'A sound wave of frequency 170 Hz travels through air at 340 m/s. What is its wavelength?',
    stemUr:
      '170 Hz تعدد والی آواز کی لہر ہوا میں 340 m/s کی رفتار سے چلتی ہے۔ اس کا طولِ موج کتنا ہے؟',
    options: [
      { key: 'A', textEn: '0.5 m', textUr: '0.5 m' },
      { key: 'B', textEn: '57800 m', textUr: '57800 m' },
      { key: 'C', textEn: '2 m', textUr: '2 m' },
      { key: 'D', textEn: '510 m', textUr: '510 m' },
    ],
    correctOption: 'C',
    explanationEn: 'v = fλ, so λ = v ÷ f = 340 ÷ 170 = 2 m.',
    topic: 'sound-and-light',
    difficulty: 'hard',
  },
]
