/**
 * Port-conflict detection utility (rule 2.3).
 *
 * Multiple unrelated projects run on this Mac Mini, so we NEVER hardcode a
 * bound port and NEVER kill whatever is holding one. Every service this
 * project starts routes through here: it takes a *preferred* port, checks
 * whether it can actually be bound, and if not, walks forward to the next free
 * port — reporting clearly which port was chosen.
 *
 * The check is authoritative: it attempts a real bind (what a server does)
 * rather than trusting a parsed `lsof` table, which can race.
 */
import net from 'node:net'

type NodeError = Error & { code?: string }

/** Resolve whether `port` on `host` can be bound right now (true = free). */
export function isPortFree(port: number, host = '127.0.0.1'): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.once('error', (err: NodeError) => {
      // EADDRINUSE / EACCES → not usable by us; any error → treat as unavailable.
      server.close(() => resolve(false))
      void err
    })
    server.once('listening', () => {
      server.close(() => resolve(true))
    })
    // Do NOT set SO_REUSEADDR — we want a truthful "is anyone here" answer.
    server.listen(port, host)
  })
}

export type FreePortResult = {
  port: number
  changed: boolean
  preferred: number
}

export type FindFreePortOptions = {
  host?: string
  attempts?: number
}

/**
 * Find a bindable port starting from `preferred`, scanning upward.
 * @throws if no free port is found within the scan window.
 */
export async function findFreePort(
  preferred: number,
  opts: FindFreePortOptions = {},
): Promise<FreePortResult> {
  const host = opts.host ?? '127.0.0.1'
  const attempts = opts.attempts ?? 20
  for (let i = 0; i < attempts; i++) {
    const port = preferred + i
    if (port > 65535) break
    if (await isPortFree(port, host)) {
      return { port, changed: port !== preferred, preferred }
    }
  }
  throw new Error(
    `No free port found in range ${preferred}-${preferred + attempts - 1} on ${host}. ` +
      `Set APP_PORT in .env to a known-free port (check with: lsof -iTCP -sTCP:LISTEN -nP).`,
  )
}
