import { WrittenPlayer } from '@/components/tests/WrittenPlayer'
import { getLocale } from '@/lib/i18n'

export default async function WrittenPlayPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ mode?: string }>
}) {
  const { id } = await params
  const { mode } = await searchParams
  const locale = await getLocale()
  return (
    <WrittenPlayer testTypeId={id} mode={mode === 'paper' ? 'paper' : 'typed'} locale={locale} />
  )
}
