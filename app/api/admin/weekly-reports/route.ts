import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { client_id, title, content, week_start, week_end } = await request.json()

    if (!client_id || !title || !content || !week_start || !week_end) {
      return NextResponse.json(
        { error: "Campos obrigatorios faltando" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO weekly_reports (client_id, title, content, week_start, week_end)
      VALUES (${client_id}, ${title}, ${content}, ${week_start}, ${week_end})
      RETURNING *
    `

    return NextResponse.json({ report: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating weekly report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
