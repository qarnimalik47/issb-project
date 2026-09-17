import { GkDigest } from '@/components/gk/GkDigest'

export default function GkPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Daily digest &amp; GK</h1>
      <GkDigest />
    </div>
  )
}
