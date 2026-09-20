'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/components/ui/cn'

export type NavItem = { href: string; label: string }

/**
 * The shell's navigation. Ten destinations do not fit on one line on a phone,
 * and a flat list of ten gives no sense of which few matter — so the five a
 * candidate uses daily sit in the bar, and everything about their account sits
 * behind their name. On small screens the whole thing collapses to one sheet.
 */
export function AppNav({
  wordmark,
  items,
  accountItems,
  userName,
  accountLabel,
  menuLabel,
  closeMenuLabel,
  languageSwitcher,
  signOut,
}: {
  wordmark: React.ReactNode
  items: NavItem[]
  accountItems: NavItem[]
  userName: string
  accountLabel: string
  menuLabel: string
  closeMenuLabel: string
  languageSwitcher: React.ReactNode
  signOut: React.ReactNode
}) {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<'none' | 'account' | 'mobile'>('none')
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (openMenu === 'none') return
    function onPointerDown(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu('none')
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenMenu('none')
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openMenu])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <nav
      ref={navRef}
      className="sticky top-3 z-40 mx-auto w-full max-w-6xl px-4"
      aria-label={accountLabel}
    >
      <div className="rounded-panel border border-line bg-surface/85 px-3 py-2 shadow-nav backdrop-blur-md">
        <div className="flex items-center gap-3">
          {wordmark}

          <ul className="mx-auto hidden items-center gap-0.5 md:flex">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-pill px-3.5 py-2 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-brand-600 text-white'
                      : 'text-ink-muted hover:bg-sunk hover:text-ink',
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="ms-auto flex items-center gap-2 md:ms-0">
            <div className="hidden sm:block">{languageSwitcher}</div>

            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setOpenMenu((v) => (v === 'account' ? 'none' : 'account'))}
                aria-expanded={openMenu === 'account'}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-pill border border-line py-1 ps-1 pe-3 text-sm font-medium text-ink hover:bg-sunk"
              >
                <Avatar name={userName} />
                <span className="max-w-28 truncate">{userName}</span>
              </button>
              {openMenu === 'account' && (
                <div
                  role="menu"
                  className="absolute end-0 mt-2 w-56 rounded-card border border-line bg-surface p-1.5 shadow-raised"
                >
                  {accountItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className="block rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-sunk hover:text-ink"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="my-1.5 h-px bg-line" />
                  <div className="px-3 py-1.5">{signOut}</div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOpenMenu((v) => (v === 'mobile' ? 'none' : 'mobile'))}
              aria-expanded={openMenu === 'mobile'}
              className="rounded-pill border border-line p-2 text-ink md:hidden"
            >
              <span className="sr-only">{openMenu === 'mobile' ? closeMenuLabel : menuLabel}</span>
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor">
                {openMenu === 'mobile' ? (
                  <path d="M5 5l10 10M15 5L5 15" strokeWidth="1.8" strokeLinecap="round" />
                ) : (
                  <path d="M3 6h14M3 10h14M3 14h14" strokeWidth="1.8" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {openMenu === 'mobile' && (
          <div className="mt-2 border-t border-line pt-2 md:hidden">
            <ul className="grid gap-0.5">
              {[...items, ...accountItems].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'block rounded-lg px-3 py-2.5 text-sm font-medium',
                      isActive(item.href)
                        ? 'bg-brand-600 text-white'
                        : 'text-ink-muted hover:bg-sunk hover:text-ink',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex items-center justify-between border-t border-line px-3 pt-3">
              {languageSwitcher}
              {signOut}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function Avatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <span
      aria-hidden="true"
      className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 font-display text-xs font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-200"
    >
      {initial}
    </span>
  )
}
