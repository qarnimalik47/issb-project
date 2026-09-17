/**
 * API DTOs shared with the web platform's routes. Kept in sync with the
 * server's response shapes (src/lib/**). A future step can extract these into a
 * shared workspace package; for now they mirror the versioned API.
 */
export type PublicUser = {
  id: string
  name: string
  email: string
  role: string
  locale: 'en' | 'ur'
  emailVerified: boolean
}

export type TokenResponse = {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: PublicUser
}

export type PlayerQuestion = {
  id: string
  stemEn: string
  stemUr: string | null
  options: { key: string; textEn: string; textUr?: string }[] | null
  topic: string | null
}
export type PlayerAttempt = {
  id: string
  testTypeId: string
  status: string
  questions: PlayerQuestion[]
  answers: Record<string, string>
  remainingSeconds: number | null
}
export type AttemptResult = {
  score: number
  maxScore: number
  percentage: number
  weakTopics: string[]
}

export type DueCard = {
  id: string
  deck: string
  frontEn: string
  frontUr: string | null
  backEn: string
  backUr: string | null
  isNew: boolean
}

export type DigestItem = {
  id: string
  headline: string
  summaryEn: string
  summaryUr: string | null
  category: string
  issbAngle: string | null
  sourceName: string | null
  sourceUrl: string | null
}
