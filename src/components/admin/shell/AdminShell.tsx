'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { activeItem, navFor, type AdminRole } from './nav'
import { Icon } from './Icon'
import { cn } from '@/components/ui/cn'

/**
 * The admin chrome: a dark regiment-green rail on the left, a quiet header
 * across the top, sand canvas beneath.
 *
 * The rail is the one dark element in the product, which is what separates the
 * operator's tools from the candidate's app at a glance — you always know which
 * side of the product you are looking at. It is fixed on desktop and becomes a
 * slide-over sheet under `lg`.
 */
export function AdminShell({
  role,
  userName,
  userEmail,
  appEnv,
  signOut,
  children,
}: {
  role: AdminRole
  userName: string
  userEmail: string
  appEnv: string
  signOut: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const groups = navFor(role)
  const current = activeItem(pathname)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const rail = (
    <div className="flex h-full flex-col gap-6 overflow-y-auto bg-brand-900 px-4 py-6 text-brand-100">
      <Link href="/admin" className="flex items-center gap-3 px-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brass-500 font-display text-sm font-extrabold text-brand-950">
          IS
        </span>
        <span className="min-w-0">
          <span className="block font-display text-sm font-bold tracking-tight text-white">
            ISSB Prep
          </span>
          <span className="block text-[0.7rem] tracking-[0.18em] text-brand-300 uppercase">
            Control room
          </span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-6" aria-label="Admin sections">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-2 pb-2 text-[0.68rem] font-semibold tracking-[0.16em] text-brand-400 uppercase">
              {group.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = current?.href === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-brand-800 font-semibold text-white'
                          : 'text-brand-200 hover:bg-brand-800/60 hover:text-white',
                      )}
                    >
                      {/* Brass marks the current location — the one accent in the rail. */}
                      <span
                        className={cn(
                          'absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-pill bg-brass-400 transition-opacity',
                          isActive ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <Icon
                        name={item.icon}
                        className={cn(
                          'size-[18px] shrink-0',
                          isActive ? 'text-brass-300' : 'text-brand-400 group-hover:text-brand-200',
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="rounded-xl border border-brand-800 bg-brand-950/60 p-3">
        <p className="truncate text-sm font-medium text-white">{userName}</p>
        <p className="truncate text-xs text-brand-300">{userEmail}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-brand-200 underline-offset-4 hover:text-white hover:underline"
          >
            Candidate view
          </Link>
          {signOut}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen lg:block">{rail}</aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-brand-950/60 backdrop-blur-[2px]"
          />
          {/* Closing on the click that navigates, rather than on the pathname
              change, keeps the state update in an event handler. */}
          <div
            className="absolute inset-y-0 left-0 w-72 shadow-raised"
            onClick={() => setMenuOpen(false)}
          >
            {rail}
          </div>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-col">
        <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid size-9 place-items-center rounded-lg border border-line-strong text-ink-muted hover:bg-sunk lg:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-ink-muted uppercase">
                Admin
              </p>
              <h1 className="truncate font-display text-lg font-bold tracking-tight text-ink">
                {current?.label ?? 'Admin'}
              </h1>
            </div>

            <span
              className={cn(
                'hidden shrink-0 items-center gap-1.5 rounded-pill border px-2.5 py-1 text-xs font-medium sm:inline-flex',
                appEnv === 'production'
                  ? 'border-flare-100 bg-flare-50 text-flare-600 dark:border-flare-700 dark:bg-flare-700/25 dark:text-flare-100'
                  : 'border-line bg-sunk text-ink-muted',
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  appEnv === 'production' ? 'bg-flare-500' : 'bg-brand-500',
                )}
              />
              {appEnv}
            </span>
          </div>
        </header>

        <main className="field-paper flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-[86rem]">{children}</div>
        </main>
      </div>
    </div>
  )
}
