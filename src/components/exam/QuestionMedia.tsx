'use client'

import { useCallback, useState } from 'react'
import { interpolate } from '@/lib/i18n/format'
import { AlertIcon } from './icons'
import { btnSecondary } from './ui'
import type { ExamStrings } from './types'

type Media = { url: string; width: number | null; height: number | null }

/**
 * A question's figure.
 *
 * `dir="ltr"` is load-bearing: a figure must never mirror under RTL. A
 * non-verbal rotation or reflection item flipped by the page direction becomes
 * a different — and wrongly keyed — question.
 *
 * Space is reserved at the figure's aspect ratio so options don't jump down
 * when it loads. On error it retries once silently with a cache-buster, then
 * offers a manual reload: a student must never be stuck on an unanswerable
 * question because a signature expired or a request dropped.
 */
export function QuestionMedia({
  media,
  number,
  t,
}: {
  media: Media
  number: number
  t: ExamStrings
}) {
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')

  const src = attempt === 0 ? media.url : `${media.url}&r=${attempt}`
  const ratio = media.width && media.height ? `${media.width} / ${media.height}` : '4 / 3'

  // An image served from cache can finish loading before hydration attaches
  // onLoad, which would leave the skeleton up forever — so check on mount too.
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setStatus('loaded')
  }, [])

  function onError() {
    if (attempt === 0) {
      setAttempt(1)
      return
    }
    setStatus('failed')
  }

  function reload() {
    setStatus('loading')
    setAttempt((n) => n + 1)
  }

  return (
    <figure dir="ltr" className="m-0">
      <div
        className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-line bg-white"
        style={{ aspectRatio: ratio }}
      >
        {status === 'loading' && (
          <div className="absolute inset-0 animate-pulse bg-line/60" aria-hidden="true" />
        )}
        {status === 'failed' ? (
          <div
            dir="auto"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface p-6 text-center text-sm text-ink-muted"
          >
            <AlertIcon className="size-6 text-amber-600" />
            <p>{t.figureFailed}</p>
            <button type="button" onClick={reload} className={btnSecondary}>
              {t.figureReload}
            </button>
          </div>
        ) : (
          // Signed, short-lived API URLs — next/image's optimiser would cache
          // them under its own key and serve stale signatures.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            ref={imgRef}
            src={src}
            alt={interpolate(t.figureAlt, { n: number })}
            width={media.width ?? undefined}
            height={media.height ?? undefined}
            onLoad={() => setStatus('loaded')}
            onError={onError}
            className={`absolute inset-0 size-full object-contain transition-opacity duration-200 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>
      {status === 'loading' && <figcaption className="sr-only">{t.figureLoading}</figcaption>}
    </figure>
  )
}
