/**
 * POST /api/admin/gk/generate-quiz — generate draft GK quiz questions from
 * approved current-affairs items (admin reviews/publishes them afterwards).
 * Auth: editor/admin.
 */
import { route, requireRole, json } from '@/lib/api/handler'
import { generateGkQuizFromArticles } from '@/lib/gk/quiz'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async () => {
  const admin = await requireRole(['content_editor', 'admin'])
  const result = await generateGkQuizFromArticles(20)
  await audit({ userId: admin.id, action: 'gk.quiz.generate', metadata: result })
  return json(result, { status: 201 })
})
