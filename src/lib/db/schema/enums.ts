/**
 * Shared PostgreSQL enum types for the domain model.
 */
import { pgEnum } from 'drizzle-orm/pg-core'

export const userRole = pgEnum('user_role', [
  'student',
  'content_editor',
  'expert_reviewer',
  'admin',
])

export const locale = pgEnum('locale', ['en', 'ur'])

export const courseTrack = pgEnum('course_track', [
  'pma',
  'gdp',
  'navy',
  'lcc',
  'technical',
  'other',
])

export const accountStatus = pgEnum('account_status', ['active', 'locked', 'deleted'])

export const otpChannel = pgEnum('otp_channel', ['email', 'phone'])

export const otpPurpose = pgEnum('otp_purpose', [
  'verify_email',
  'verify_phone',
  'login',
  'password_reset',
])

export const testDimension = pgEnum('test_dimension', [
  'psychologist',
  'gto',
  'interview',
  'cross_cutting',
])

export const scoringType = pgEnum('scoring_type', ['objective', 'rubric', 'consistency'])

export const contentStatus = pgEnum('content_status', ['draft', 'published', 'archived'])

/** GK is curated, evergreen knowledge; current affairs is gathered and refreshed. */
export const gkTopicKind = pgEnum('gk_topic_kind', ['gk', 'current_affairs'])

export const attemptMode = pgEnum('attempt_mode', ['typed', 'paper'])

export const attemptStatus = pgEnum('attempt_status', [
  'in_progress',
  'submitted',
  'abandoned',
  'evaluated',
])

export const evaluationStatus = pgEnum('evaluation_status', [
  'pending',
  'completed',
  'needs_review',
  'failed',
  'blocked_distress',
])

export const stagingStatus = pgEnum('staging_status', ['pending', 'approved', 'rejected'])

/** How an imported document was obtained. Drives the rewrite gate with licenceBasis. */
export const acquisitionKind = pgEnum('acquisition_kind', ['public_source', 'owned_pdf', 'scrape'])

/**
 * The legal basis for reusing a document's content. Only
 * `third_party_unlicensed` forces the rewrite gate; `cc_by` requires attribution.
 */
export const licenceBasis = pgEnum('licence_basis', [
  'public_domain',
  'cc_by',
  'official_sample',
  'owned_licence',
  'third_party_unlicensed',
])

/**
 * Orthogonal to stagingStatus: whether an item may be approved as extracted
 * (`clear`), must be reworded first (`needs_rewrite`), or has been (`rewritten`).
 */
export const stagingReviewState = pgEnum('staging_review_state', [
  'clear',
  'needs_rewrite',
  'rewritten',
])
