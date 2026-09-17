/**
 * Conservative distress / self-harm signal detection (build prompt §4.8).
 *
 * If a candidate's written response indicates serious distress or self-harm,
 * the system must NOT produce a scored personality critique. It shows a
 * supportive message pointing to help and flags the submission for human
 * review. This keyword/pattern detector is a safety net that runs BEFORE any
 * AI call; the model is also instructed to flag distress. It errs toward
 * catching (false positives are acceptable; a missed signal is not).
 */
const PATTERNS: RegExp[] = [
  /\bkill myself\b/i,
  /\bkilling myself\b/i,
  /\bsuicide\b/i,
  /\bsuicidal\b/i,
  /\bend my life\b/i,
  /\bend it all\b/i,
  /\bwant to die\b/i,
  /\bharm myself\b/i,
  /\bself[-\s]?harm\b/i,
  /\bcut myself\b/i,
  /\bno reason to live\b/i,
  /\bbetter off dead\b/i,
  /\bخودکشی\b/, // Urdu: suicide
]

export function detectDistress(text: string): boolean {
  return PATTERNS.some((re) => re.test(text))
}

export const SUPPORT_MESSAGE_EN =
  'It sounds like you may be going through something very difficult. This practice tool is not the right place for this, and your wellbeing matters more than any test. Please reach out to someone you trust or a professional. In Pakistan you can contact Umang (0311-7786264) or Rozan (0800-22444). If you are in immediate danger, please contact local emergency services.'

export const SUPPORT_MESSAGE_UR =
  'ایسا لگتا ہے کہ آپ کسی بہت مشکل صورتحال سے گزر رہے ہیں۔ یہ مشقی ٹول اس کے لیے مناسب جگہ نہیں، اور آپ کی فلاح کسی بھی ٹیسٹ سے زیادہ اہم ہے۔ براہِ کرم کسی قابلِ اعتماد فرد یا ماہر سے رابطہ کریں۔ پاکستان میں آپ اُمنگ (0311-7786264) یا روزن (0800-22444) سے رابطہ کر سکتے ہیں۔ فوری خطرے کی صورت میں مقامی ہنگامی خدمات سے رابطہ کریں۔'
