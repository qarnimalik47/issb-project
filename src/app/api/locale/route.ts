/**
 * POST /api/locale — set the UI language cookie. Auth: public.
 * Also updates the logged-in user's stored preference, if any.
 */
import { route, readBody, json } from '@/lib/api/handler'
import { z } from 'zod'
import { LOCALE_COOKIE } from '@/lib/i18n/config'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema/identity'
import { eq } from 'drizzle-orm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const bodySchema = z.object({ locale: z.enum(['en', 'ur']) })

export const POST = route(async (req) => {
  const { locale } = await readBody(req, bodySchema)
  const store = await cookies()
  store.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  const user = await getCurrentUser()
  if (user) {
    await db.update(users).set({ locale, updatedAt: new Date() }).where(eq(users.id, user.id))
  }
  return json({ ok: true, locale })
})
