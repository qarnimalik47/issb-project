/**
 * PID-file helpers. The start/dev scripts record the PID of the server process
 * THEY spawned under .run/<mode>.pid. stop.sh terminates only those recorded
 * PIDs — we never kill a process just because it holds a port (rule 2.3).
 */
import fs from 'node:fs'
import path from 'node:path'

const RUN_DIR = path.resolve(process.cwd(), '.run')

function pidPath(mode: string): string {
  return path.join(RUN_DIR, `${mode}.pid`)
}

export function writePid(mode: string, pid: number): void {
  fs.mkdirSync(RUN_DIR, { recursive: true })
  fs.writeFileSync(pidPath(mode), String(pid), 'utf8')
}

export function clearPid(mode: string): void {
  try {
    fs.rmSync(pidPath(mode))
  } catch {
    // already gone — fine
  }
}
