#!/usr/bin/env bash
#
# restore.sh — restore a pg_dump (-Fc) backup into a database.
#
# By default it restores into the DB from DATABASE_URL and PROMPTS first,
# because this is destructive (--clean drops existing objects). Pass a target
# DB name to restore into a different database (e.g. a scratch verify DB), and
# --force to skip the prompt.
#
# Usage:
#   scripts/restore.sh backups/issb_dev_20260101_120000.dump
#   scripts/restore.sh <file> issb_restore_test --force
#
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

BACKUP_FILE="${1:-}"
TARGET_DB="${2:-}"
FORCE="no"
for arg in "$@"; do [[ "$arg" == "--force" ]] && FORCE="yes"; done

if [[ -z "$BACKUP_FILE" || ! -f "$BACKUP_FILE" ]]; then
  echo "ERROR: pass a valid backup file. Usage: scripts/restore.sh <file> [target_db] [--force]" >&2
  exit 1
fi

load_env() {
  local key="$1"; local val="${!key:-}"
  if [[ -z "$val" && -f "$ROOT_DIR/.env" ]]; then
    val="$(grep -E "^${key}=" "$ROOT_DIR/.env" | head -1 | cut -d= -f2-)"
  fi
  echo "$val"
}

DATABASE_URL="$(load_env DATABASE_URL)"
if [[ -z "$DATABASE_URL" ]]; then
  echo "ERROR: DATABASE_URL not found (env or .env)." >&2
  exit 1
fi

# Build the target connection URL. If a target DB name was given (and it isn't
# the --force flag), swap the database path segment.
TARGET_URL="$DATABASE_URL"
if [[ -n "$TARGET_DB" && "$TARGET_DB" != "--force" ]]; then
  TARGET_URL="$(echo "$DATABASE_URL" | sed -E "s|/[^/?]+(\?.*)?$|/${TARGET_DB}\1|")"
else
  TARGET_DB="$(basename "${DATABASE_URL%%\?*}")"
fi

if [[ "$FORCE" != "yes" ]]; then
  echo "About to restore '$BACKUP_FILE' into database '$TARGET_DB'."
  echo "This DROPS and recreates existing objects in that database."
  read -r -p "Type the database name to confirm: " CONFIRM
  if [[ "$CONFIRM" != "$TARGET_DB" ]]; then
    echo "Confirmation did not match. Aborted."
    exit 1
  fi
fi

echo "==> Restoring into '$TARGET_DB'..."
# --clean --if-exists: idempotent restore. --no-owner: works under app role.
pg_restore --clean --if-exists --no-owner --dbname "$TARGET_URL" "$BACKUP_FILE"
echo "==> Restore complete into '$TARGET_DB'."
