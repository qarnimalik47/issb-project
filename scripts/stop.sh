#!/usr/bin/env bash
#
# stop.sh — stop server processes THIS project started (recorded in .run/*.pid).
# We never kill a process merely because it holds a port (rule 2.3); we only
# terminate PIDs we ourselves recorded.
#
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
RUN_DIR="$ROOT_DIR/.run"

if [[ ! -d "$RUN_DIR" ]] || ! compgen -G "$RUN_DIR/*.pid" >/dev/null; then
  echo "No recorded server PIDs. Nothing to stop."
  echo "(A foreground 'npm run dev' is stopped with Ctrl+C.)"
  exit 0
fi

for pidfile in "$RUN_DIR"/*.pid; do
  pid="$(cat "$pidfile")"
  name="$(basename "$pidfile" .pid)"
  if kill -0 "$pid" 2>/dev/null; then
    echo "Stopping $name server (pid $pid)..."
    kill "$pid" 2>/dev/null || true
    # Give it a moment, then force if still alive.
    for _ in 1 2 3 4 5; do
      kill -0 "$pid" 2>/dev/null || break
      sleep 1
    done
    kill -0 "$pid" 2>/dev/null && kill -9 "$pid" 2>/dev/null || true
  else
    echo "$name server (pid $pid) is not running."
  fi
  rm -f "$pidfile"
done
echo "Done."
