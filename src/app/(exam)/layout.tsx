/**
 * Distraction-free shell for timed tests: no app navigation, no footer, full
 * width. The exam supplies its own top bar and re-homes the compliance
 * disclaimer onto its instructions and result screens.
 *
 * This group sits outside (app), so it does NOT inherit that layout's auth
 * guard — the check below is what keeps the exam from rendering for anonymous
 * visitors. Pages here check again themselves, because Next renders layouts and
 * pages in parallel and a layout redirect alone does not stop a page's data
 * fetching.
 */
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'

export default async function ExamLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return <div className="min-h-screen bg-surface text-ink">{children}</div>
}
