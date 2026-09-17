/**
 * Public serialisation of a user — strips secrets and internal fields before
 * anything is sent to a client.
 */
import type { User } from '../db/schema/identity'

export type PublicUser = {
  id: string
  name: string
  email: string
  phone: string | null
  role: User['role']
  locale: User['locale']
  courseTrack: User['courseTrack']
  targetIssbDate: string | null
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: string
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    locale: user.locale,
    courseTrack: user.courseTrack,
    targetIssbDate: user.targetIssbDate,
    emailVerified: user.emailVerifiedAt != null,
    phoneVerified: user.phoneVerifiedAt != null,
    createdAt: user.createdAt.toISOString(),
  }
}
