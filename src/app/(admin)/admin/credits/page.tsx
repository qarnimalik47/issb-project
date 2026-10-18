import type { Metadata } from 'next'
import { CreditsManager } from '@/components/admin/CreditsManager'

export const metadata: Metadata = { title: 'Credits · Admin' }
export const dynamic = 'force-dynamic'

export default function Page() {
  return <CreditsManager />
}
