import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/header"
import { WeeklyReportDetail } from "@/components/client/weekly-report-detail"

export const dynamic = 'force-dynamic'

async function getClientBySlug(slug: string) {
  const result = await sql`SELECT * FROM clients WHERE slug = ${slug}`
  return result[0] || null
}

async function getWeeklyReport(reportId: string, clientId: string) {
  const result = await sql`
    SELECT * FROM weekly_reports 
    WHERE id = ${reportId} AND client_id = ${clientId}
  `
  return result[0] || null
}

async function markAsRead(reportId: string, userId: string) {
  // Check if already read
  const existing = await sql`
    SELECT id FROM weekly_report_reads 
    WHERE report_id = ${reportId} AND user_id = ${userId}
  `
  
  if (existing.length === 0) {
    await sql`
      INSERT INTO weekly_report_reads (report_id, user_id)
      VALUES (${reportId}, ${userId})
    `
  }
}

export default async function LeituraSemanalDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const client = await getClientBySlug(slug)

  if (!client) {
    notFound()
  }

  // Check access
  if (session.role === "CLIENTE" && session.client?.slug !== slug) {
    redirect(`/dashboards/${session.client?.slug}/leitura-semanal`)
  }

  const report = await getWeeklyReport(id, client.id)

  if (!report) {
    notFound()
  }

  // Mark as read
  await markAsRead(id, session.id)

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <DashboardHeader
        title={report.title}
        subtitle="Leitura Semanal da Operação"
      />
      <WeeklyReportDetail report={report} clientSlug={slug} />
    </div>
  )
}
