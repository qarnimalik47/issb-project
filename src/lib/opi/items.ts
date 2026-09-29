/**
 * The OPI practice inventory: 58 statements, answered on a 7-point scale.
 *
 * Personality items (50): the IPIP Big-Five Factor Markers (Goldberg, 1992),
 * published by the International Personality Item Pool at ipip.ori.org and
 * placed in the public domain — free to use, adapt and translate without
 * permission. Wording is lightly adapted for a Pakistani candidate ("at
 * gatherings" rather than "at parties") and written as full first-person
 * sentences; the keying is unchanged. Emotional stability is scored in its
 * positive direction (IPIP's "Emotional Stability"), so a high score is calm.
 *
 * Candour items (8): written for this platform. Six describe a perfection no
 * honest adult claims ("I have never been angry with anyone"); two admit an
 * ordinary fault. Strong agreement with the first kind, or strong denial of
 * the second, is what the board's psychologist reads as "faking good".
 *
 * Nothing here is taken from ISSB's own OPI, which is not published.
 */

export type Trait = 'E' | 'A' | 'C' | 'S' | 'O'

export type OpiItem = {
  id: string
  textEn: string
  textUr: string
  /** Personality trait scored, or 'K' for a candour item. */
  trait: Trait | 'K'
  /** +1 when agreeing means more of the trait (or, for K, more idealised). */
  key: 1 | -1
}

export const OPI_VERSION = 'opi-ipip50-k8-v1'

export const OPI_SCALE = [
  { value: 1, en: 'Strongly disagree', ur: 'بالکل متفق نہیں' },
  { value: 2, en: 'Disagree', ur: 'متفق نہیں' },
  { value: 3, en: 'Slightly disagree', ur: 'کچھ حد تک متفق نہیں' },
  { value: 4, en: 'Neutral', ur: 'غیر جانبدار' },
  { value: 5, en: 'Slightly agree', ur: 'کچھ حد تک متفق' },
  { value: 6, en: 'Agree', ur: 'متفق' },
  { value: 7, en: 'Strongly agree', ur: 'مکمل متفق' },
] as const

/** In presentation order: traits interleaved so no run of items gives the game away. */
const BY_TRAIT: Record<Trait | 'K', OpiItem[]> = {
  E: [
    {
      id: 'e1',
      trait: 'E',
      key: 1,
      textEn: 'I am the life of any gathering.',
      textUr: 'میں کسی بھی محفل کی جان ہوتا ہوں۔',
    },
    {
      id: 'e2',
      trait: 'E',
      key: -1,
      textEn: "I don't talk a lot.",
      textUr: 'میں زیادہ باتیں نہیں کرتا۔',
    },
    {
      id: 'e3',
      trait: 'E',
      key: 1,
      textEn: 'I feel comfortable around people.',
      textUr: 'میں لوگوں کے درمیان خود کو آرام دہ محسوس کرتا ہوں۔',
    },
    {
      id: 'e4',
      trait: 'E',
      key: -1,
      textEn: 'I keep in the background.',
      textUr: 'میں پس منظر میں رہنا پسند کرتا ہوں۔',
    },
    {
      id: 'e5',
      trait: 'E',
      key: 1,
      textEn: 'I start conversations.',
      textUr: 'میں گفتگو کا آغاز کرتا ہوں۔',
    },
    {
      id: 'e6',
      trait: 'E',
      key: -1,
      textEn: 'I have little to say.',
      textUr: 'میرے پاس کہنے کو کم ہی ہوتا ہے۔',
    },
    {
      id: 'e7',
      trait: 'E',
      key: 1,
      textEn: 'I talk to a lot of different people at gatherings.',
      textUr: 'محفلوں میں میں بہت سے مختلف لوگوں سے بات کرتا ہوں۔',
    },
    {
      id: 'e8',
      trait: 'E',
      key: -1,
      textEn: "I don't like to draw attention to myself.",
      textUr: 'میں اپنی طرف توجہ مبذول کروانا پسند نہیں کرتا۔',
    },
    {
      id: 'e9',
      trait: 'E',
      key: 1,
      textEn: "I don't mind being the centre of attention.",
      textUr: 'مرکزِ نگاہ بننے میں مجھے کوئی اعتراض نہیں۔',
    },
    {
      id: 'e10',
      trait: 'E',
      key: -1,
      textEn: 'I am quiet around strangers.',
      textUr: 'اجنبیوں کے درمیان میں خاموش رہتا ہوں۔',
    },
  ],
  A: [
    {
      id: 'a1',
      trait: 'A',
      key: -1,
      textEn: 'I feel little concern for others.',
      textUr: 'مجھے دوسروں کی کم ہی فکر ہوتی ہے۔',
    },
    {
      id: 'a2',
      trait: 'A',
      key: 1,
      textEn: 'I am interested in people.',
      textUr: 'مجھے لوگوں میں دلچسپی ہے۔',
    },
    {
      id: 'a3',
      trait: 'A',
      key: -1,
      textEn: 'I insult people.',
      textUr: 'میں لوگوں کی توہین کر دیتا ہوں۔',
    },
    {
      id: 'a4',
      trait: 'A',
      key: 1,
      textEn: "I sympathise with others' feelings.",
      textUr: 'میں دوسروں کے جذبات سے ہمدردی رکھتا ہوں۔',
    },
    {
      id: 'a5',
      trait: 'A',
      key: -1,
      textEn: "I am not interested in other people's problems.",
      textUr: 'مجھے دوسروں کے مسائل سے دلچسپی نہیں۔',
    },
    { id: 'a6', trait: 'A', key: 1, textEn: 'I have a soft heart.', textUr: 'میرا دل نرم ہے۔' },
    {
      id: 'a7',
      trait: 'A',
      key: -1,
      textEn: 'I am not really interested in others.',
      textUr: 'مجھے دوسروں میں کچھ خاص دلچسپی نہیں۔',
    },
    {
      id: 'a8',
      trait: 'A',
      key: 1,
      textEn: 'I take time out for others.',
      textUr: 'میں دوسروں کے لیے وقت نکالتا ہوں۔',
    },
    {
      id: 'a9',
      trait: 'A',
      key: 1,
      textEn: "I feel others' emotions.",
      textUr: 'میں دوسروں کے جذبات محسوس کرتا ہوں۔',
    },
    {
      id: 'a10',
      trait: 'A',
      key: 1,
      textEn: 'I make people feel at ease.',
      textUr: 'میں لوگوں کو پُرسکون محسوس کرواتا ہوں۔',
    },
  ],
  C: [
    {
      id: 'c1',
      trait: 'C',
      key: 1,
      textEn: 'I am always prepared.',
      textUr: 'میں ہمیشہ تیار رہتا ہوں۔',
    },
    {
      id: 'c2',
      trait: 'C',
      key: -1,
      textEn: 'I leave my belongings around.',
      textUr: 'میں اپنی چیزیں اِدھر اُدھر چھوڑ دیتا ہوں۔',
    },
    {
      id: 'c3',
      trait: 'C',
      key: 1,
      textEn: 'I pay attention to details.',
      textUr: 'میں تفصیلات پر توجہ دیتا ہوں۔',
    },
    {
      id: 'c4',
      trait: 'C',
      key: -1,
      textEn: 'I make a mess of things.',
      textUr: 'میں کاموں کو بگاڑ دیتا ہوں۔',
    },
    {
      id: 'c5',
      trait: 'C',
      key: 1,
      textEn: 'I get tasks done right away.',
      textUr: 'میں کام فوراً نمٹا دیتا ہوں۔',
    },
    {
      id: 'c6',
      trait: 'C',
      key: -1,
      textEn: 'I often forget to put things back in their proper place.',
      textUr: 'میں اکثر چیزیں اُن کی جگہ پر واپس رکھنا بھول جاتا ہوں۔',
    },
    { id: 'c7', trait: 'C', key: 1, textEn: 'I like order.', textUr: 'مجھے ترتیب پسند ہے۔' },
    {
      id: 'c8',
      trait: 'C',
      key: -1,
      textEn: 'I shirk my duties.',
      textUr: 'میں اپنے فرائض سے جی چراتا ہوں۔',
    },
    {
      id: 'c9',
      trait: 'C',
      key: 1,
      textEn: 'I follow a schedule.',
      textUr: 'میں ایک نظام الاوقات کی پابندی کرتا ہوں۔',
    },
    {
      id: 'c10',
      trait: 'C',
      key: 1,
      textEn: 'I am exacting in my work.',
      textUr: 'میں اپنے کام میں باریک بین اور سخت معیار رکھتا ہوں۔',
    },
  ],
  S: [
    {
      id: 's1',
      trait: 'S',
      key: -1,
      textEn: 'I get stressed out easily.',
      textUr: 'میں جلد دباؤ کا شکار ہو جاتا ہوں۔',
    },
    {
      id: 's2',
      trait: 'S',
      key: 1,
      textEn: 'I am relaxed most of the time.',
      textUr: 'میں زیادہ تر پُرسکون رہتا ہوں۔',
    },
    {
      id: 's3',
      trait: 'S',
      key: -1,
      textEn: 'I worry about things.',
      textUr: 'میں باتوں کی فکر کرتا رہتا ہوں۔',
    },
    {
      id: 's4',
      trait: 'S',
      key: 1,
      textEn: 'I seldom feel low.',
      textUr: 'میں شاذ و نادر ہی اداس ہوتا ہوں۔',
    },
    {
      id: 's5',
      trait: 'S',
      key: -1,
      textEn: 'I am easily disturbed.',
      textUr: 'میں آسانی سے پریشان ہو جاتا ہوں۔',
    },
    {
      id: 's6',
      trait: 'S',
      key: -1,
      textEn: 'I get upset easily.',
      textUr: 'میں جلد رنجیدہ ہو جاتا ہوں۔',
    },
    {
      id: 's7',
      trait: 'S',
      key: -1,
      textEn: 'I change my mood a lot.',
      textUr: 'میرا مزاج بہت بدلتا رہتا ہے۔',
    },
    {
      id: 's8',
      trait: 'S',
      key: -1,
      textEn: 'I have frequent mood swings.',
      textUr: 'میرے مزاج میں اکثر اتار چڑھاؤ آتا ہے۔',
    },
    {
      id: 's9',
      trait: 'S',
      key: -1,
      textEn: 'I get irritated easily.',
      textUr: 'میں جلد چڑ جاتا ہوں۔',
    },
    {
      id: 's10',
      trait: 'S',
      key: -1,
      textEn: 'I often feel low.',
      textUr: 'میں اکثر اداس رہتا ہوں۔',
    },
  ],
  O: [
    {
      id: 'o1',
      trait: 'O',
      key: 1,
      textEn: 'I have a rich vocabulary.',
      textUr: 'میرا ذخیرۂ الفاظ وسیع ہے۔',
    },
    {
      id: 'o2',
      trait: 'O',
      key: -1,
      textEn: 'I have difficulty understanding abstract ideas.',
      textUr: 'مجھے مجرد (تجریدی) خیالات سمجھنے میں دشواری ہوتی ہے۔',
    },
    {
      id: 'o3',
      trait: 'O',
      key: 1,
      textEn: 'I have a vivid imagination.',
      textUr: 'میرا تخیل بہت واضح اور زرخیز ہے۔',
    },
    {
      id: 'o4',
      trait: 'O',
      key: -1,
      textEn: 'I am not interested in abstract ideas.',
      textUr: 'مجھے تجریدی خیالات میں دلچسپی نہیں۔',
    },
    {
      id: 'o5',
      trait: 'O',
      key: 1,
      textEn: 'I have excellent ideas.',
      textUr: 'میرے خیالات بہترین ہوتے ہیں۔',
    },
    {
      id: 'o6',
      trait: 'O',
      key: -1,
      textEn: 'I do not have a good imagination.',
      textUr: 'میرا تخیل اچھا نہیں۔',
    },
    {
      id: 'o7',
      trait: 'O',
      key: 1,
      textEn: 'I am quick to understand things.',
      textUr: 'میں چیزوں کو جلد سمجھ لیتا ہوں۔',
    },
    {
      id: 'o8',
      trait: 'O',
      key: 1,
      textEn: 'I use difficult words.',
      textUr: 'میں مشکل الفاظ استعمال کرتا ہوں۔',
    },
    {
      id: 'o9',
      trait: 'O',
      key: 1,
      textEn: 'I spend time reflecting on things.',
      textUr: 'میں چیزوں پر غور و فکر میں وقت صرف کرتا ہوں۔',
    },
    {
      id: 'o10',
      trait: 'O',
      key: 1,
      textEn: 'I am full of ideas.',
      textUr: 'میں خیالات سے بھرا ہوا ہوں۔',
    },
  ],
  K: [
    {
      id: 'k1',
      trait: 'K',
      key: 1,
      textEn: 'I have never been angry with anyone.',
      textUr: 'میں کبھی کسی سے ناراض نہیں ہوا۔',
    },
    {
      id: 'k2',
      trait: 'K',
      key: 1,
      textEn: 'I have never put off a task I should have done.',
      textUr: 'میں نے کبھی کوئی ضروری کام ٹالا نہیں۔',
    },
    {
      id: 'k3',
      trait: 'K',
      key: 1,
      textEn: 'I keep every promise I make, without a single exception.',
      textUr: 'میں اپنا ہر وعدہ بغیر کسی استثنا کے پورا کرتا ہوں۔',
    },
    {
      id: 'k4',
      trait: 'K',
      key: 1,
      textEn: 'I have never said anything unkind about another person.',
      textUr: 'میں نے کبھی کسی کے بارے میں کوئی نامناسب بات نہیں کہی۔',
    },
    {
      id: 'k5',
      trait: 'K',
      key: 1,
      textEn: "I have never felt jealous of anyone's success.",
      textUr: 'مجھے کبھی کسی کی کامیابی پر حسد محسوس نہیں ہوا۔',
    },
    {
      id: 'k6',
      trait: 'K',
      key: 1,
      textEn: 'Every important decision I have made has turned out to be right.',
      textUr: 'میرا ہر اہم فیصلہ درست ثابت ہوا ہے۔',
    },
    {
      id: 'k7',
      trait: 'K',
      key: -1,
      textEn: 'Sometimes I lose my temper.',
      textUr: 'کبھی کبھی مجھے غصہ آ جاتا ہے۔',
    },
    {
      id: 'k8',
      trait: 'K',
      key: -1,
      textEn: 'There have been times I did not do my best.',
      textUr: 'ایسے مواقع بھی آئے جب میں نے اپنی پوری کوشش نہیں کی۔',
    },
  ],
}

/**
 * Paired statements that ask the same thing from opposite ends. A candidate who
 * agrees with both halves of a pair is contradicting themselves; the board
 * notices, and so does the consistency score.
 */
export const OPI_PAIRS: [string, string][] = [
  ['e2', 'e5'],
  ['e10', 'e3'],
  ['a1', 'a4'],
  ['a7', 'a2'],
  ['c1', 'c4'],
  ['c7', 'c6'],
  ['s1', 's2'],
  ['s4', 's10'],
  ['o3', 'o6'],
  ['o2', 'o7'],
]

/** Round-robin across the traits, with a candour item dropped in every seventh slot. */
function interleave(): OpiItem[] {
  const order: (Trait | 'K')[] = ['E', 'A', 'C', 'S', 'O']
  const queues = Object.fromEntries(
    Object.entries(BY_TRAIT).map(([k, v]) => [k, [...v]]),
  ) as Record<Trait | 'K', OpiItem[]>
  const out: OpiItem[] = []
  let t = 0
  while (order.some((k) => queues[k].length)) {
    if (out.length % 7 === 6 && queues.K.length) {
      out.push(queues.K.shift()!)
      continue
    }
    const k = order[t++ % order.length]!
    const next = queues[k].shift()
    if (next) out.push(next)
  }
  out.push(...queues.K)
  return out
}

export const OPI_ITEMS: OpiItem[] = interleave()

export const OPI_ITEM_BY_ID = new Map(OPI_ITEMS.map((i) => [i.id, i]))
