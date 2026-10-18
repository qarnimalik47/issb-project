/**
 * The admin navigation model.
 *
 * Grouped rather than flat: an operator arrives with an intent ("a candidate
 * emailed about a charge", "the evaluator is failing") and the group names are
 * how they find the screen. Each item declares the roles that may see it, so a
 * content editor gets a panel with only the content group in it rather than a
 * sidebar full of links that will redirect them.
 */
export type AdminRole = 'admin' | 'content_editor'

export type AdminNavItem = {
  href: string
  label: string
  /** Short line shown in the command palette and on the mobile sheet. */
  hint: string
  icon: IconName
  roles: AdminRole[]
  /** Match child routes too (e.g. /admin/questions/new). */
  prefix?: boolean
}

export type AdminNavGroup = {
  title: string
  items: AdminNavItem[]
}

export type IconName =
  | 'gauge'
  | 'users'
  | 'card'
  | 'coins'
  | 'bank'
  | 'upload'
  | 'file'
  | 'globe'
  | 'news'
  | 'plug'
  | 'key'
  | 'pulse'
  | 'scroll'

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    title: 'Overview',
    items: [
      {
        href: '/admin',
        label: 'Dashboard',
        hint: 'Signups, revenue, AI spend and system health',
        icon: 'gauge',
        roles: ['admin', 'content_editor'],
      },
    ],
  },
  {
    title: 'Customers',
    items: [
      {
        href: '/admin/users',
        label: 'Users',
        hint: 'Search accounts, fix entitlements, suspend or restore',
        icon: 'users',
        roles: ['admin'],
        prefix: true,
      },
      {
        href: '/admin/billing',
        label: 'Billing',
        hint: 'Payments, refunds, invoices and the subscription book',
        icon: 'card',
        roles: ['admin'],
      },
      {
        href: '/admin/credits',
        label: 'Credits',
        hint: 'Grant, deduct and audit the credit ledger',
        icon: 'coins',
        roles: ['admin'],
      },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        href: '/admin/questions',
        label: 'Question bank',
        hint: 'Create, edit and publish questions',
        icon: 'bank',
        roles: ['admin', 'content_editor'],
        prefix: true,
      },
      {
        href: '/admin/questions/import',
        label: 'Bulk import',
        hint: 'Import questions from CSV or JSON',
        icon: 'upload',
        roles: ['admin', 'content_editor'],
      },
      {
        href: '/admin/import',
        label: 'PDF import',
        hint: 'Extract a question bank from a PDF into review',
        icon: 'file',
        roles: ['admin', 'content_editor'],
      },
      {
        href: '/admin/sources',
        label: 'Sources',
        hint: 'Sites the scraper may read from',
        icon: 'globe',
        roles: ['admin'],
      },
      {
        href: '/admin/gk',
        label: 'Current affairs',
        hint: 'Gather dossiers and approve headlines',
        icon: 'news',
        roles: ['admin', 'content_editor'],
      },
    ],
  },
  {
    title: 'Platform',
    items: [
      {
        href: '/admin/integrations',
        label: 'Integrations',
        hint: 'AI, payment and messaging provider credentials',
        icon: 'plug',
        roles: ['admin'],
      },
      {
        href: '/admin/api-keys',
        label: 'API keys',
        hint: 'Issue and revoke keys for the mobile app and partners',
        icon: 'key',
        roles: ['admin'],
      },
      {
        href: '/admin/system',
        label: 'System',
        hint: 'Health, queues, storage and backups',
        icon: 'pulse',
        roles: ['admin'],
      },
      {
        href: '/admin/audit',
        label: 'Audit log',
        hint: 'Every administrative action, with who and when',
        icon: 'scroll',
        roles: ['admin'],
      },
    ],
  },
]

/** The groups a given role may see, with empty groups dropped. */
export function navFor(role: AdminRole): AdminNavGroup[] {
  return ADMIN_NAV.map((g) => ({
    title: g.title,
    items: g.items.filter((i) => i.roles.includes(role)),
  })).filter((g) => g.items.length > 0)
}

/** The deepest item matching a pathname — `/admin` must not win over `/admin/users`. */
export function activeItem(pathname: string): AdminNavItem | undefined {
  const all = ADMIN_NAV.flatMap((g) => g.items)
  const exact = all.find((i) => i.href === pathname)
  if (exact) return exact
  return all
    .filter((i) => i.prefix && pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]
}
