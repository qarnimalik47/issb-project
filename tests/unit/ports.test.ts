import { describe, it, expect, afterEach } from 'vitest'
import net from 'node:net'
import { isPortFree, findFreePort } from '../../scripts/lib/ports'

/**
 * Unit tests for the port-conflict detection utility (rule 2.3). We occupy a
 * real port and assert the finder walks past it.
 */
const servers: net.Server[] = []

function occupy(port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = net.createServer()
    s.once('error', reject)
    s.listen(port, '127.0.0.1', () => {
      servers.push(s)
      resolve()
    })
  })
}

afterEach(async () => {
  await Promise.all(servers.splice(0).map((s) => new Promise((r) => s.close(r))))
})

describe('port utility', () => {
  it('reports a free high port as free', async () => {
    expect(await isPortFree(54987, '127.0.0.1')).toBe(true)
  })

  it('reports an occupied port as not free', async () => {
    await occupy(54988)
    expect(await isPortFree(54988, '127.0.0.1')).toBe(false)
  })

  it('walks forward past an occupied preferred port', async () => {
    await occupy(54990)
    const result = await findFreePort(54990, { host: '127.0.0.1', attempts: 5 })
    expect(result.port).toBeGreaterThan(54990)
    expect(result.changed).toBe(true)
    expect(result.preferred).toBe(54990)
  })

  it('returns the preferred port unchanged when it is free', async () => {
    const result = await findFreePort(54995, { host: '127.0.0.1', attempts: 3 })
    expect(result.port).toBe(54995)
    expect(result.changed).toBe(false)
  })
})
