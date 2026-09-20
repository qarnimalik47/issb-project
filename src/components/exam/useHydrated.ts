'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * False during server rendering and hydration, true once React owns the page.
 *
 * Server-rendered buttons are visible before their handlers attach; a click in
 * that window does nothing and looks like a broken button — most noticeable on
 * slow phones. Gate primary actions on this so they only enable when they work.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
