/**
 * Translation dictionaries. Keep keys stable; both languages must cover the
 * same keys. Urdu strings are authored alongside English (rule: Urdu from
 * Phase 1). Domain question content is translated in the question banks, not
 * here.
 */
import type { Locale } from './config'

export type Dictionary = typeof en

const en = {
  common: {
    appName: 'ISSB Prep Platform',
    disclaimer:
      'Independent practice tool. Not affiliated with ISSB or the Pakistan Armed Forces. No outcome is predicted or guaranteed.',
    signIn: 'Sign in',
    signOut: 'Sign out',
    register: 'Create account',
    email: 'Email',
    phone: 'Phone (optional)',
    password: 'Password',
    name: 'Full name',
    submit: 'Continue',
    loading: 'Please wait…',
    language: 'Language',
    english: 'English',
    urdu: 'اردو',
    dashboard: 'Dashboard',
    profile: 'Profile',
    save: 'Save',
    saved: 'Saved',
    delete: 'Delete',
  },
  auth: {
    loginTitle: 'Sign in to your account',
    registerTitle: 'Create your account',
    verifyTitle: 'Verify your email',
    verifyPrompt: 'Enter the 6-digit code we sent you.',
    code: 'Verification code',
    verify: 'Verify',
    resend: 'Resend code',
    forgot: 'Forgot password?',
    forgotTitle: 'Reset your password',
    courseTrack: 'Course track',
    targetDate: 'Target ISSB date',
    acceptTerms: 'I accept the Terms and Privacy Policy',
    consentWritten: 'Store my written responses for evaluation',
    consentVoice: 'Store my voice recordings',
    consentAssessment: 'Store my personality assessments',
    haveAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    invalid: 'Invalid email or password.',
    verified: 'Email verified.',
  },
  profile: {
    title: 'Your profile',
    exportData: 'Export my data',
    deleteAccount: 'Delete my account',
    deleteConfirm: 'This permanently deletes your account and all data. Continue?',
    emailVerified: 'Email verified',
    emailUnverified: 'Email not verified',
  },
  tracks: {
    pma: 'PMA Long Course',
    gdp: 'GD Pilot',
    navy: 'Navy',
    lcc: 'Lady Cadet Course',
    technical: 'Technical',
    other: 'Other',
  },
}

const ur: Dictionary = {
  common: {
    appName: 'آئی ایس ایس بی تیاری پلیٹ فارم',
    disclaimer:
      'یہ ایک آزاد مشقی ٹول ہے۔ اس کا آئی ایس ایس بی یا پاک مسلح افواج سے کوئی تعلق نہیں۔ کسی نتیجے کی پیش گوئی یا ضمانت نہیں دی جاتی۔',
    signIn: 'سائن اِن',
    signOut: 'سائن آؤٹ',
    register: 'اکاؤنٹ بنائیں',
    email: 'ای میل',
    phone: 'فون (اختیاری)',
    password: 'پاس ورڈ',
    name: 'پورا نام',
    submit: 'جاری رکھیں',
    loading: 'براہِ کرم انتظار کریں…',
    language: 'زبان',
    english: 'English',
    urdu: 'اردو',
    dashboard: 'ڈیش بورڈ',
    profile: 'پروفائل',
    save: 'محفوظ کریں',
    saved: 'محفوظ ہو گیا',
    delete: 'حذف کریں',
  },
  auth: {
    loginTitle: 'اپنے اکاؤنٹ میں سائن اِن کریں',
    registerTitle: 'اپنا اکاؤنٹ بنائیں',
    verifyTitle: 'اپنی ای میل کی تصدیق کریں',
    verifyPrompt: 'ہم نے جو 6 ہندسوں کا کوڈ بھیجا ہے وہ درج کریں۔',
    code: 'تصدیقی کوڈ',
    verify: 'تصدیق کریں',
    resend: 'کوڈ دوبارہ بھیجیں',
    forgot: 'پاس ورڈ بھول گئے؟',
    forgotTitle: 'اپنا پاس ورڈ ری سیٹ کریں',
    courseTrack: 'کورس ٹریک',
    targetDate: 'ہدف آئی ایس ایس بی تاریخ',
    acceptTerms: 'میں شرائط و ضوابط اور پرائیویسی پالیسی قبول کرتا ہوں',
    consentWritten: 'میرے تحریری جوابات جانچ کے لیے محفوظ کریں',
    consentVoice: 'میری آواز کی ریکارڈنگ محفوظ کریں',
    consentAssessment: 'میری شخصیت کی جانچ محفوظ کریں',
    haveAccount: 'پہلے سے اکاؤنٹ ہے؟',
    noAccount: 'اکاؤنٹ نہیں ہے؟',
    invalid: 'غلط ای میل یا پاس ورڈ۔',
    verified: 'ای میل کی تصدیق ہو گئی۔',
  },
  profile: {
    title: 'آپ کی پروفائل',
    exportData: 'میرا ڈیٹا ایکسپورٹ کریں',
    deleteAccount: 'میرا اکاؤنٹ حذف کریں',
    deleteConfirm: 'یہ آپ کا اکاؤنٹ اور تمام ڈیٹا مستقل طور پر حذف کر دے گا۔ جاری رکھیں؟',
    emailVerified: 'ای میل کی تصدیق شدہ',
    emailUnverified: 'ای میل کی تصدیق نہیں ہوئی',
  },
  tracks: {
    pma: 'پی ایم اے لانگ کورس',
    gdp: 'جی ڈی پائلٹ',
    navy: 'نیوی',
    lcc: 'لیڈی کیڈٹ کورس',
    technical: 'ٹیکنیکل',
    other: 'دیگر',
  },
}

const DICTIONARIES: Record<Locale, Dictionary> = { en, ur }

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale]
}
