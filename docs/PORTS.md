# Ports

This project shares the Mac Mini with several other projects. **No port is ever
hardcoded or assumed free.** Every service routes its bind port through the
port-conflict detection utility (`scripts/lib/ports.ts`), which attempts a real
bind and, if the preferred port is busy, walks forward to the next free port and
reports the change. We **never** kill a process that holds a port (rule 2.3).

## Ports this project uses

| Service           | Env var    | Preferred | Notes                                                                                           |
| ----------------- | ---------- | --------: | ----------------------------------------------------------------------------------------------- |
| Next.js web + API | `APP_PORT` |    `4310` | Dev and prod. Auto-falls-forward if busy; the chosen port is printed at startup.                |
| PostgreSQL        | (existing) |    `5432` | Pre-existing local install. We do **not** manage this port.                                     |
| Redis             | (existing) |    `6379` | Pre-existing local install, logical DB index `14` (`REDIS_DB`). We do **not** manage this port. |

## How to change the app port

Set `APP_PORT` (and keep `APP_BASE_URL` consistent) in `.env`. The start scripts
still verify the port is free before binding.

## How to check what is listening

```bash
lsof -iTCP -sTCP:LISTEN -nP        # everything currently listening
lsof -iTCP:4310 -sTCP:LISTEN -nP   # just our preferred app port
```

## Redis DB index

Redis is shared. This project uses logical database index **14** (`REDIS_DB`).
At the time of setup, other projects were using indices 0, 3, 5 and 6; 14 was
empty. If you change `REDIS_DB`, pick an unused index (`redis-cli -n N dbsize`).
