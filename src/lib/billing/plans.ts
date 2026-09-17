/**
 * Plan definitions and entitlements (source of truth in code; also seeded into
 * the `plans` table for reference/admin). Prices are placeholders — the product
 * owner sets final pricing (backlog Q4). Quota enforcement reads entitlements
 * from here.
 */
export type Entitlements = {
  aiEvaluationsPerDay: number
  mockInterviewsPerMonth: number
  expertReviewsPerMonth: number
  unlimitedMcq: boolean
}

export type PlanCode = 'free' | 'paid' | 'premium'

export const PLANS: Record<
  PlanCode,
  {
    nameEn: string
    nameUr: string
    priceCents: number
    currency: string
    entitlements: Entitlements
  }
> = {
  free: {
    nameEn: 'Free',
    nameUr: 'مفت',
    priceCents: 0,
    currency: 'PKR',
    // Small trial allowance so the feature is usable before subscribing.
    entitlements: {
      aiEvaluationsPerDay: 3,
      mockInterviewsPerMonth: 0,
      expertReviewsPerMonth: 0,
      unlimitedMcq: false,
    },
  },
  paid: {
    nameEn: 'Paid',
    nameUr: 'ادائیگی شدہ',
    priceCents: 0, // set by product owner
    currency: 'PKR',
    entitlements: {
      aiEvaluationsPerDay: 50,
      mockInterviewsPerMonth: 10,
      expertReviewsPerMonth: 0,
      unlimitedMcq: true,
    },
  },
  premium: {
    nameEn: 'Premium',
    nameUr: 'پریمیم',
    priceCents: 0, // set by product owner
    currency: 'PKR',
    entitlements: {
      aiEvaluationsPerDay: 200,
      mockInterviewsPerMonth: 30,
      expertReviewsPerMonth: 4,
      unlimitedMcq: true,
    },
  },
}

export function entitlementsFor(code: PlanCode): Entitlements {
  return PLANS[code].entitlements
}
