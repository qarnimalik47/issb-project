/**
 * Offline cache and a durable submission queue. Flashcards and the digest are
 * cached so they work offline; test submissions are queued and synced when the
 * connection returns (build prompt §10: offline support + queued sync).
 */
import AsyncStorage from '@react-native-async-storage/async-storage'

export async function cacheSet(key: string, data: unknown): Promise<void> {
  await AsyncStorage.setItem(`cache:${key}`, JSON.stringify(data))
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(`cache:${key}`)
  return raw ? (JSON.parse(raw) as T) : null
}

export type QueuedSubmission = {
  id: string
  path: string
  method: string
  body: unknown
  createdAt: number
}

const QUEUE_KEY = 'submission_queue'

export async function queueSubmission(item: Omit<QueuedSubmission, 'id' | 'createdAt'>): Promise<void> {
  const queue = (await cacheGet<QueuedSubmission[]>(QUEUE_KEY)) ?? []
  queue.push({ ...item, id: `${Date.now()}_${queue.length}`, createdAt: Date.now() })
  await cacheSet(QUEUE_KEY, queue)
}

export async function getQueue(): Promise<QueuedSubmission[]> {
  return (await cacheGet<QueuedSubmission[]>(QUEUE_KEY)) ?? []
}

/** Try to send each queued submission; drop the ones that succeed. */
export async function flushQueue(send: (s: QueuedSubmission) => Promise<boolean>): Promise<number> {
  const queue = await getQueue()
  const remaining: QueuedSubmission[] = []
  let sent = 0
  for (const item of queue) {
    try {
      const ok = await send(item)
      if (ok) sent++
      else remaining.push(item)
    } catch {
      remaining.push(item)
    }
  }
  await cacheSet(QUEUE_KEY, remaining)
  return sent
}
