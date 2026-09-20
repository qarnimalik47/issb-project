/**
 * POST /api/admin/gk/topics — gather a current-affairs dossier from the free
 * knowledge sources and publish it for every user. Auth: editor/admin.
 *
 * The work runs inline rather than on the worker queue: a gather is a handful
 * of HTTP calls and one model request, the admin is watching the result, and
 * an inline run means the feature works on an install that has not started the
 * worker process. Each source call carries its own timeout so the request
 * cannot hang.
 */
import { z } from 'zod'
import { route, requireRole, readBody, enforceRateLimit, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { gatherTopic, CURRENT_AFFAIRS_SECTIONS } from '@/lib/gk/topics'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
/** Wikipedia, Wikidata and one model call, sequentially. */
export const maxDuration = 120

const gatherSchema = z.object({
  query: z.string().trim().min(3).max(120),
  section: z.enum(CURRENT_AFFAIRS_SECTIONS),
})

export const POST = route(async (req) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const { query, section } = await readBody(req, gatherSchema)

  // Upstream sources are free and shared; a runaway loop here would get the
  // whole platform rate-limited by Wikimedia.
  await enforceRateLimit(`gk:gather:${admin.id}`, 20, 3600)

  try {
    const { topic, usedNarrative, cardsCreated } = await gatherTopic({ query, section })
    await audit({
      userId: admin.id,
      action: 'gk.topic.gather',
      metadata: { slug: topic.slug, usedNarrative, cardsCreated },
    })
    return json(
      {
        slug: topic.slug,
        title: topic.titleEn,
        facts: topic.facts.length,
        points: topic.points.length,
        timeline: topic.timeline.length,
        cardsCreated,
        usedNarrative,
        narrativeModel: topic.narrativeModel,
      },
      { status: 201 },
    )
  } catch (err) {
    if (err instanceof ApiError) throw err
    throw new ApiError('bad_request', err instanceof Error ? err.message : 'Gather failed')
  }
})
