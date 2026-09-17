'use client'

/* Records audio in the browser, uploads it, and lets the user confirm the
   transcript (STT runs server-side). Falls back to file upload if recording is
   unavailable. */
import { useCallback, useRef, useState } from 'react'

type Props = {
  attemptId: string
  itemRef: string
  maxSeconds?: number
  onConfirmed?: (text: string) => void
}

export function VoiceRecorder({ attemptId, itemRef, maxSeconds = 120, onConfirmed }: Props) {
  const [status, setStatus] = useState<
    'idle' | 'recording' | 'uploading' | 'transcribing' | 'confirm' | 'done' | 'error'
  >('idle')
  const [seconds, setSeconds] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startedAtRef = useRef(0)

  const upload = useCallback(
    async (blob: Blob, durationSec: number) => {
      setStatus('uploading')
      const form = new FormData()
      form.set('ref', itemRef)
      form.set('durationSec', String(durationSec))
      form.set('file', new File([blob], 'answer.webm', { type: blob.type || 'audio/webm' }))
      const res = await fetch(`/api/written/${attemptId}/upload-audio`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) {
        setStatus('error')
        setError('Upload failed')
        return
      }
      setStatus('transcribing')
      for (let i = 0; i < 12; i++) {
        await new Promise((r) => setTimeout(r, 1500))
        const a = await (await fetch(`/api/written/${attemptId}`)).json()
        const r = a.attempt?.responses?.[itemRef]
        if (r && r.ocrText != null) {
          setTranscript(r.ocrText)
          setStatus('confirm')
          return
        }
      }
      setTranscript('')
      setStatus('confirm')
    },
    [attemptId, itemRef],
  )

  async function start() {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data)
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: mr.mimeType })
        const dur = Math.round((Date.now() - startedAtRef.current) / 1000)
        void upload(blob, dur)
      }
      mediaRef.current = mr
      startedAtRef.current = Date.now()
      mr.start()
      setStatus('recording')
      setSeconds(0)
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= maxSeconds) stop()
          return s + 1
        })
      }, 1000)
    } catch {
      setStatus('error')
      setError('Microphone permission denied. Use the file upload option below.')
    }
  }

  function stop() {
    if (timerRef.current) clearInterval(timerRef.current)
    mediaRef.current?.state === 'recording' && mediaRef.current.stop()
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) await upload(file, 0)
  }

  async function confirm() {
    await fetch(`/api/written/${attemptId}/confirm-ocr`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ref: itemRef, text: transcript }),
    })
    setStatus('done')
    onConfirmed?.(transcript)
  }

  return (
    <div className="flex flex-col gap-2">
      {status === 'idle' && (
        <div className="flex items-center gap-3">
          <button onClick={start} className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white">
            ● Record
          </button>
          <label className="text-xs text-neutral-500">
            or upload audio{' '}
            <input type="file" accept="audio/*" onChange={onFile} className="text-xs" />
          </label>
        </div>
      )}
      {status === 'recording' && (
        <button
          onClick={stop}
          className="w-fit rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-neutral-900"
        >
          ■ Stop ({seconds}s / {maxSeconds}s)
        </button>
      )}
      {(status === 'uploading' || status === 'transcribing') && (
        <p className="text-sm text-neutral-500">
          {status === 'uploading' ? 'Uploading…' : 'Transcribing…'}
        </p>
      )}
      {status === 'confirm' && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-neutral-400">
            {transcript
              ? 'Review your transcript:'
              : 'Transcription unavailable — type what you said:'}
          </p>
          <textarea
            rows={4}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button
            onClick={confirm}
            className="w-fit rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-neutral-900"
          >
            Confirm
          </button>
        </div>
      )}
      {status === 'done' && <p className="text-sm text-green-600">Saved ✓</p>}
      {error && <p className="text-sm text-amber-600">{error}</p>}
    </div>
  )
}
