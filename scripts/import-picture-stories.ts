/**
 * Load the Picture Story (TAT) pictures from the resource bank into the
 * platform: each image becomes a `story_picture` media asset plus a
 * `picture_story` question that shows it.
 *
 * The source is PIC_STORIES_OF_ISSB, a student-compiled PDF with no publisher
 * or ISBN (resource-bank/_meta/source-licences.json marks it "allowed"), but
 * its pictures were gathered from elsewhere: some are photographs of real
 * people, one carries a blog watermark. So, like every other bank import, rows
 * land as DRAFTS. Publishing is a human decision made per picture in the admin
 * question editor — never a flag on this script (see import-content-bank.ts).
 *
 * The stem is a plain description of the scene. The player never shows it
 * during the viewing phase (the picture is the test); it is the image's alt
 * text and the stimulus the evaluator reads when marking the story.
 *
 *   npx tsx scripts/import-picture-stories.ts            # dry run
 *   npx tsx scripts/import-picture-stories.ts --apply    # insert as drafts
 *   npx tsx scripts/import-picture-stories.ts --dir <folder>
 *
 * Re-running is safe: a picture already imported (same bytes) is skipped.
 * Afterwards, `npx tsx scripts/build-test-sets.ts --apply` groups the new
 * questions into numbered sets of four.
 */
import 'dotenv/config'
import { createHash, randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { eq } from 'drizzle-orm'
import { db, sql as rawSql } from '../src/lib/db/index'
import { mediaAssets, questions, testTypes } from '../src/lib/db/schema/content'
import { storage } from '../src/lib/storage/index'
import { sniffImage } from '../src/lib/media/image'
import { questionContentHash } from '../src/lib/import/parse'

const apply = process.argv.includes('--apply')
const SOURCE_DIR = (() => {
  const i = process.argv.indexOf('--dir')
  if (i >= 0 && process.argv[i + 1]) return path.resolve(process.argv[i + 1]!)
  return path.resolve(
    process.cwd(),
    '..',
    'resource-bank',
    'images-from-pdfs',
    'archive.org',
    'PIC_STORIES_OF_ISSB',
  )
})()
const SOURCE_LABEL = 'resource-bank/images-from-pdfs/archive.org/PIC_STORIES_OF_ISSB'

type Picture = { file: string; stemEn: string; reviewNote?: string }

/** Written after looking at each image; the order is the order in the PDF. */
const PICTURES: Picture[] = [
  {
    file: 'page-0001.jpg',
    stemEn:
      'A young man sits on a motor scooter at the roadside while a young woman stands beside him, gesturing as she talks.',
  },
  {
    file: 'page-0002-1.jpg',
    stemEn:
      'At a doorway, a smiling woman holding a small box speaks to a young man who holds out his hand; an older man watches from behind.',
  },
  {
    file: 'page-0002-2.jpg',
    stemEn:
      'A woman wrapped in a white shawl sits on the ground among bundles, holding a small child close.',
    reviewNote: 'Documentary photograph of real people; source and rights unknown.',
  },
  {
    file: 'page-0003-1.jpg',
    stemEn: 'A sketch of an army officer in dress uniform and beret, wearing medals.',
    reviewNote: 'Portrait sketch of an identifiable real officer; consider leaving unpublished.',
  },
  {
    file: 'page-0003-2.jpg',
    stemEn: 'A man leans out of the open door of a moving train as it crosses a bridge.',
  },
  {
    file: 'page-0004-1.jpg',
    stemEn: 'A man stands in a dim room beside a bed, covering his eyes with his arm.',
  },
  {
    file: 'page-0004-2.jpg',
    stemEn:
      'A worried woman rests her hand against her chin while two children lean on her shoulders.',
    reviewNote: 'Dorothea Lange, "Migrant Mother" (1936) - US public domain.',
  },
  {
    file: 'page-0005-1.jpg',
    stemEn:
      'A young man and a young woman sit close together under a tree; she looks upset and he leans towards her.',
  },
  {
    file: 'page-0005-2.jpg',
    stemEn:
      'A young woman stands in the foreground of a farm field while men work the land behind her.',
    reviewNote: 'Carries a becomingaofficer.blogspot.com watermark.',
  },
  {
    file: 'page-0006-1.jpg',
    stemEn:
      'A young man in a shawl gently lifts the chin of an older woman, who turns her face away.',
  },
  {
    file: 'page-0006-2.jpg',
    stemEn:
      'A young man plays a guitar while a young woman sits close beside him, musical notes drifting around them.',
  },
  {
    file: 'page-0007.jpg',
    stemEn:
      'Three young people sit around a table with a box and papers on it, deep in conversation.',
  },
]

async function main() {
  const [tt] = await db
    .select({ id: testTypes.id })
    .from(testTypes)
    .where(eq(testTypes.code, 'picture_story'))
    .limit(1)
  if (!tt) throw new Error('Test type picture_story not found - run the seed first.')

  console.log(`${apply ? 'Importing' : 'Dry run'} from ${SOURCE_DIR}`)
  let added = 0
  let skipped = 0
  for (const [i, pic] of PICTURES.entries()) {
    const data = await readFile(path.join(SOURCE_DIR, pic.file))
    const image = sniffImage(data)
    if (!image) throw new Error(`${pic.file} is not a PNG, JPEG or WebP image`)

    const sha256 = createHash('sha256').update(data).digest('hex')
    // Keyed on the image bytes, so re-running (or rewording a stem) never duplicates a picture.
    const contentHash = questionContentHash(`picture_story:${sha256}`)
    const [existing] = await db
      .select({ id: questions.id })
      .from(questions)
      .where(eq(questions.contentHash, contentHash))
      .limit(1)
    if (existing) {
      skipped++
      console.log(`  skip  ${pic.file} (already imported)`)
      continue
    }

    console.log(`  ${apply ? 'add ' : 'would add'}  ${pic.file}  ${image.width}x${image.height}`)
    if (!apply) continue

    const mediaId = randomUUID()
    const storageKey = `media/${mediaId}.${image.ext}`
    await storage.put(storageKey, data, { mime: image.mime })
    try {
      await db.transaction(async (tx) => {
        await tx.insert(mediaAssets).values({
          id: mediaId,
          kind: 'story_picture',
          storageKey,
          mime: image.mime,
          sizeBytes: data.length,
          meta: {
            width: image.width,
            height: image.height,
            originalName: pic.file,
            alt: pic.stemEn,
            source: `${SOURCE_LABEL}/${pic.file}`,
            sha256,
            ...(pic.reviewNote ? { reviewNote: pic.reviewNote } : {}),
          },
        })
        await tx.insert(questions).values({
          testTypeId: tt.id,
          stemEn: pic.stemEn,
          mediaId,
          topic: 'picture_story',
          difficulty: 'medium',
          contentHash,
          status: 'draft',
          explanationEn: pic.reviewNote
            ? `Picture ${i + 1} of PIC_STORIES_OF_ISSB. Review: ${pic.reviewNote}`
            : `Picture ${i + 1} of PIC_STORIES_OF_ISSB.`,
        })
      })
      added++
    } catch (err) {
      await storage.delete(storageKey)
      throw err
    }
  }
  console.log(
    apply
      ? `Done: ${added} added as drafts, ${skipped} already present.`
      : `Dry run: ${PICTURES.length - skipped} to add, ${skipped} already present. Re-run with --apply.`,
  )
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => rawSql.end())
