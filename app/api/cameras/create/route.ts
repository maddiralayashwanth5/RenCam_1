import { queryOne } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, description, category, price_per_day, specs } = await request.json()
    const user = JSON.parse(request.headers.get("user") || "{}")

    if (!user.id || user.role !== "lender") {
      return NextResponse.json({ error: "Only lenders can list cameras" }, { status: 403 })
    }

    const camera = await queryOne<{ id: string; name: string }>(
      `
      INSERT INTO cameras (lender_id, name, description, category, price_per_day, specs)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name
      `,
      [user.id, name, description, category, price_per_day, specs],
    )

    return NextResponse.json({
      success: true,
      camera_id: camera?.id,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Creation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
