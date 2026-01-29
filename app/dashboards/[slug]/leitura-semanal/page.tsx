import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/header"
import { WeeklyReportsList } from "@/components/client/weekly-reports-list"

export const dynamic = 'force-dynamic'

async function getClientBySlug(slug: string) {
  const result = await sql`SELECT * FROM clients WHERE slug = ${slug}`
  return result[0] || null
}

async function getWeeklyReports(clientId: string, userId: string) {
  return sql`
    SELECT 
      wr.id, 
      wr.title, 
      wr.content, 
      wr.week_start, 
      wr.week_end, 
      wr.created_at,
      CASE WHEN wrr.id IS NOT NULL THEN true ELSE false END as is_read
    FROM weekly_reports wr
    LEFT JOIN weekly_report_reads wrr ON wr.id = wrr.report_id AND wrr.user_id = ${userId}
    WHERE wr.client_id = ${clientId}
    ORDER BY wr.week_start DESC
  `
}

export default async function LeituraSemanalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
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

  const reports = await getWeeklyReports(client.id, session.id)

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <DashboardHeader
        title="Leitura Semanal da Operação"
        subtitle="Relatórios semanais com análises e insights da sua operação"
      />
      <WeeklyReportsList reports={reports} clientSlug={slug} />
    </div>
  )
}
