import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { WeeklyReportsTable } from "@/components/admin/weekly-reports-table"
import { Card } from "@/components/ui/card"

export const dynamic = 'force-dynamic'

async function getWeeklyReports() {
  return sql`
    SELECT 
      wr.*,
      c.name as client_name,
      c.slug as client_slug,
      (SELECT COUNT(*) FROM weekly_report_reads WHERE report_id = wr.id) as read_count
    FROM weekly_reports wr
    JOIN clients c ON wr.client_id = c.id
    ORDER BY wr.created_at DESC
  `
}

async function getClients() {
  return sql`SELECT id, name, slug FROM clients ORDER BY name ASC`
}

export default async function AdminWeeklyReportsPage() {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    redirect("/login")
  }

  const [reports, clients] = await Promise.all([
    getWeeklyReports(),
    getClients(),
  ])

  return (
    <div className="min-h-screen">
      <div className="p-4 sm:p-6">
        <DashboardHeader
          title="Leitura Semanal da Operação"
          subtitle="Gerencie os relatórios semanais dos clientes"
        />
      </div>

      <div className="px-4 sm:px-6 pb-6">
        <Card className="bg-[#0D0D12] border-purple-500/20 overflow-hidden">
          <WeeklyReportsTable reports={reports} clients={clients} />
        </Card>
      </div>
    </div>
  )
}
