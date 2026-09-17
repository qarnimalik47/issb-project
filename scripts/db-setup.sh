#!/usr/bin/env bash
#
# db-setup.sh — create the dedicated PostgreSQL role and databases for this
# project, idempotently. Safe to re-run. Requires a local superuser connection
# (the default homebrew Postgres install makes your macOS user a superuser).
#
# It NEVER touches any database other than issb_dev / issb_prod, and never
# drops anything. See docs/adr/0003-auth-approach.md and README.md.
#
# Usage:
#   scripts/db-setup.sh                # reads the app password from .env
#   ISSB_DB_PASSWORD=... scripts/db-setup.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

APP_USER="issb_app"
DEV_DB="issb_dev"
PROD_DB="issb_prod"
# Admin connection used to create things. Overridable for non-default setups.
ADMIN_DB="${ISSB_ADMIN_DB:-postgres}"

# --- Resolve the app-user password ------------------------------------------
if [[ -z "${ISSB_DB_PASSWORD:-}" ]]; then
  if [[ -f "$ROOT_DIR/.env" ]]; then
    # Extract the password from the DATABASE_URL in .env
    ISSB_DB_PASSWORD="$(grep -E '^DATABASE_URL=' "$ROOT_DIR/.env" \
      | sed -E 's|^DATABASE_URL=postgres(ql)?://[^:]+:([^@]+)@.*$|\2|')"
  fi
fi
if [[ -z "${ISSB_DB_PASSWORD:-}" || "$ISSB_DB_PASSWORD" == "CHANGE_ME" ]]; then
  echo "ERROR: could not determine the app DB password. Set ISSB_DB_PASSWORD or fix .env." >&2
  exit 1
fi

psql_admin() { psql -v ON_ERROR_STOP=1 -d "$ADMIN_DB" -tA "$@"; }

echo "==> Ensuring role '$APP_USER' exists"
if [[ "$(psql_admin -c "SELECT 1 FROM pg_roles WHERE rolname='$APP_USER'")" == "1" ]]; then
  echo "    role already exists — updating password"
  psql_admin -c "ALTER ROLE $APP_USER WITH LOGIN PASSWORD '$ISSB_DB_PASSWORD'"
else
  psql_admin -c "CREATE ROLE $APP_USER WITH LOGIN PASSWORD '$ISSB_DB_PASSWORD'"
  echo "    created"
fi
# Least privilege: the app role may create its own DBs' objects but has no
# superuser, no role creation, and no access to other projects' databases.
psql_admin -c "ALTER ROLE $APP_USER WITH NOSUPERUSER NOCREATEROLE NOCREATEDB" >/dev/null

create_db_if_missing() {
  local db="$1"
  if [[ "$(psql_admin -c "SELECT 1 FROM pg_database WHERE datname='$db'")" == "1" ]]; then
    echo "==> Database '$db' already exists — leaving as-is"
  else
    echo "==> Creating database '$db' (UTF8, owner=$APP_USER)"
    # UTF8 encoding is required to store Urdu content (rule: bilingual from day 1).
    createdb --encoding=UTF8 --template=template0 --owner="$APP_USER" "$db"
  fi
  # Make sure the app role can actually use it even if it was pre-existing.
  psql_admin -c "GRANT ALL PRIVILEGES ON DATABASE $db TO $APP_USER" >/dev/null
  # Lock down the public schema to the owner only (defence in depth).
  psql -v ON_ERROR_STOP=1 -d "$db" -tA \
    -c "ALTER SCHEMA public OWNER TO $APP_USER" >/dev/null 2>&1 || true
}

create_db_if_missing "$DEV_DB"
create_db_if_missing "$PROD_DB"

echo "==> Done. Verifying app-user connectivity to $DEV_DB..."
PGPASSWORD="$ISSB_DB_PASSWORD" psql -v ON_ERROR_STOP=1 -h 127.0.0.1 -U "$APP_USER" -d "$DEV_DB" -tA \
  -c "SELECT 'connected as ' || current_user || ' to ' || current_database();"
echo "==> Database setup complete."
