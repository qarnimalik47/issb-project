#!/usr/bin/env bash
#
# backup.sh — dump this project's database to a timestamped file in BACKUP_DIR.
# Uses pg_dump custom format (-Fc) for reliable, selective restore.
#
# Usage:
#   scripts/backup.sh                 # backs up the DB in DATABASE_URL (.env)
#   DATABASE_URL=... scripts/backup.sh
#
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load config from .env if not already in the environment.
load_env() {
  local key="$1"
  local val="${!key:-}"
  if [[ -z "$val" && -f "$ROOT_DIR/.env" ]]; then
    val="$(grep -E "^${key}=" "$ROOT_DIR/.env" | head -1 | cut -d= -f2-)"
  fi
  echo "$val"
}

DATABASE_URL="$(load_env DATABASE_URL)"
BACKUP_DIR="$(load_env BACKUP_DIR)"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
# Resolve relative BACKUP_DIR against project root.
[[ "$BACKUP_DIR" = /* ]] || BACKUP_DIR="$ROOT_DIR/${BACKUP_DIR#./}"

if [[ -z "$DATABASE_URL" ]]; then
  echo "ERROR: DATABASE_URL not found (env or .env)." >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
DB_NAME="$(basename "${DATABASE_URL%%\?*}")"
TS="$(date +%Y%m%d_%H%M%S)"
OUT="$BACKUP_DIR/${DB_NAME}_${TS}.dump"

echo "==> Backing up '$DB_NAME' → $OUT"
pg_dump "$DATABASE_URL" --format=custom --no-owner --file "$OUT"
SIZE="$(du -h "$OUT" | cut -f1)"
echo "==> Backup complete ($SIZE): $OUT"
