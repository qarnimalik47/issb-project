/**
 * GET /api/me/report — downloadable PDF profile report (professional layout,
 * disclaimers included). Generated server-side with pdfkit. Auth: required.
 */
import { route, requireUser } from '@/lib/api/handler'
import { NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'
import { computeProfile, buildStudyPlan } from '@/lib/profile/engine'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function renderPdf(
  name: string,
  profile: Awaited<ReturnType<typeof computeProfile>>,
  studyPlan: ReturnType<typeof buildStudyPlan>,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []
    doc.on('data', (c: Buffer) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    doc.fontSize(20).text('ISSB Practice — Personality Insights', { align: 'left' })
    doc.moveDown(0.3)
    doc.fontSize(10).fillColor('#666').text(`Prepared for: ${name}`)
    doc.moveDown(0.5)
    doc
      .fontSize(8)
      .fillColor('#999')
      .text(
        'Independent practice tool. Not affiliated with ISSB or the Pakistan Armed Forces. This is not a prediction of any selection outcome and not a clinical assessment.',
      )
    doc.moveDown(1)

    doc
      .fontSize(12)
      .fillColor('#000')
      .text(`Profile confidence: ${profile.confidence.level.toUpperCase()}`)
    if (profile.confidence.level === 'low') {
      doc
        .fontSize(9)
        .fillColor('#b45309')
        .text('Low confidence — complete more tests for a reliable profile.')
    }
    doc.moveDown(0.8)

    doc.fontSize(14).fillColor('#000').text('Qualities')
    doc.moveDown(0.3)
    for (const q of profile.qualities) {
      doc
        .fontSize(11)
        .fillColor('#000')
        .text(`${q.key.replace(/_/g, ' ')}: ${q.score} / 5`)
      if (q.evidence[0])
        doc.fontSize(9).fillColor('#555').text(`“${q.evidence[0]}”`, { indent: 12 })
      doc.moveDown(0.2)
    }

    if (profile.contradictions.length) {
      doc.moveDown(0.6).fontSize(14).fillColor('#000').text('Contradictions across tests')
      for (const c of profile.contradictions) {
        doc.moveDown(0.2).fontSize(10).fillColor('#b91c1c').text(c.note)
      }
    }

    doc.moveDown(0.6).fontSize(14).fillColor('#000').text('Study plan')
    if (studyPlan.daysToTarget != null) {
      doc
        .fontSize(10)
        .fillColor('#555')
        .text(`Days to your target ISSB date: ${studyPlan.daysToTarget}`)
    }
    for (const w of studyPlan.weakAreas) {
      doc.moveDown(0.2).fontSize(10).fillColor('#000').text(`• ${w.recommendation}`)
    }

    doc.end()
  })
}

export const GET = route(async () => {
  const user = await requireUser()
  const profile = await computeProfile(user.id)
  const studyPlan = buildStudyPlan(profile, user.targetIssbDate)
  const pdf = await renderPdf(user.name, profile, studyPlan)
  await audit({ userId: user.id, action: 'profile.report.download' })

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="issb-insights-${user.id}.pdf"`,
      'cache-control': 'no-store',
    },
  })
})
