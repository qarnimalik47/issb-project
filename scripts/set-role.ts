/**
 * Promote a user to a role. Usage:
 *   npm run set-role -- user@example.com admin
 */
import 'dotenv/config'
import { db, sql as rawSql } from '../src/lib/db/index'
import { users } from '../src/lib/db/schema/identity'
import { eq } from 'drizzle-orm'

const [email, role] = process.argv.slice(2)
const ROLES = ['student', 'content_editor', 'expert_reviewer', 'admin']

if (!email || !role || !ROLES.includes(role)) {
  console.error(`Usage: npm run set-role -- <email> <${ROLES.join('|')}>`)
  process.exit(1)
}

try {
  const [updated] = await db
    .update(users)
    .set({
      role: role as 'student' | 'content_editor' | 'expert_reviewer' | 'admin',
      updatedAt: new Date(),
    })
    .where(eq(users.email, email.toLowerCase()))
    .returning({ id: users.id, email: users.email, role: users.role })
  if (!updated) {
    console.error(`No user with email ${email}`)
    process.exitCode = 1
  } else {
    console.warn(`✓ ${updated.email} is now ${updated.role}`)
  }
} finally {
  await rawSql.end()
}
