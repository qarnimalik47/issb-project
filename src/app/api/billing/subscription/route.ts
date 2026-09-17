/** GET /api/billing/subscription — current plan, entitlements, invoices. Auth: required. */
import { route, requireUser, json } from '@/lib/api/handler'
import { getUserPlan, getEntitlements } from '@/lib/billing/quota'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema/billing'
import { eq, desc } from 'drizzle-orm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async () => {
  const user = await requireUser()
  const [plan, entitlements, userInvoices] = await Promise.all([
    getUserPlan(user.id),
    getEntitlements(user.id),
    db
      .select()
      .from(invoices)
      .where(eq(invoices.userId, user.id))
      .orderBy(desc(invoices.issuedAt))
      .limit(20),
  ])
  return json({ plan, entitlements, invoices: userInvoices })
})
