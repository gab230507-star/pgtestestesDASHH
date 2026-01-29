import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { title, content, week_start, week_end } = body

  try {
    const result = await sql`
      UPDATE weekly_reports 
      SET title = ${title}, content = ${content}, week_start = ${week_start}, week_end = ${week_end}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json({ report: result[0] })
  } catch (error) {
    console.error("Error updating weekly report:", error)
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    // Delete associated reads first
    await sql`DELETE FROM weekly_report_reads WHERE report_id = ${id}`
    
    const result = await sql`
      DELETE FROM weekly_reports WHERE id = ${id} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting weekly report:", error)
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 })
  }
}
