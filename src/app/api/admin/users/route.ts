/**
 * GET /api/admin/users — the user roster: search, filter, sort, paginate.
 * Auth: admin.
 */
import { route, requireRole, json } from '@/lib/api/handler'
import { listUsers, userSummary, type UserListFilters } from '@/lib/admin/users'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ROLES = ['student', 'content_editor', 'expert_reviewer', 'admin'] as const
const STATUSES = ['active', 'locked', 'deleted'] as const
const SORTS = ['recent', 'name', 'spend', 'activity'] as const

export const GET = route(async (req) => {
  await requireRole(['admin'])
  const p = new URL(req.url).searchParams

  const role = p.get('role')
  const status = p.get('status')
  const sort = p.get('sort')
  const filters: UserListFilters = {
    q: p.get('q')?.trim() || undefined,
    role: ROLES.includes(role as (typeof ROLES)[number])
      ? (role as UserListFilters['role'])
      : undefined,
    status: STATUSES.includes(status as (typeof STATUSES)[number])
      ? (status as UserListFilters['status'])
      : undefined,
    plan: p.get('plan') || undefined,
    activity: p.get('activity') || undefined,
    sort: SORTS.includes(sort as (typeof SORTS)[number])
      ? (sort as UserListFilters['sort'])
      : 'recent',
    page: Number(p.get('page') ?? 1) || 1,
    pageSize: Number(p.get('pageSize') ?? 25) || 25,
  }

  const [list, summary] = await Promise.all([listUsers(filters), userSummary()])
  return json({ ...list, summary })
})
