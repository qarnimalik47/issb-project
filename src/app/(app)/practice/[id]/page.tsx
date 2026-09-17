import { TestPlayer } from '@/components/tests/TestPlayer'
import { getLocale } from '@/lib/i18n'

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const locale = await getLocale()
  return <TestPlayer testTypeId={id} locale={locale} />
}
