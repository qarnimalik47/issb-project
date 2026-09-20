import { GkDigest } from '@/components/gk/GkDigest'
import { PageHeader } from '@/components/ui/PageHeader'

export default function GkDigestPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Daily digest"
        lede="Approved headlines from the feeds, newest first. Each carries an ISSB angle and a one-line take."
      />
      <GkDigest />
    </div>
  )
}
