import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const minPrice = searchParams.get("minPrice") || "0"
    const maxPrice = searchParams.get("maxPrice") || "1000"

    let query_str = `
      SELECT id, name, description, category, price_per_day, image_url
      FROM cameras
      WHERE deleted_at IS NULL
    `

    const params: unknown[] = []

    if (search) {
      query_str += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    if (category && category !== "all") {
      query_str += ` AND category = $${params.length + 1}`
      params.push(category)
    }

    query_str += ` AND price_per_day BETWEEN $${params.length + 1} AND $${params.length + 2}`
    params.push(Number.parseFloat(minPrice), Number.parseFloat(maxPrice))

    query_str += ` ORDER BY created_at DESC LIMIT 50`

    const cameras = await query(query_str, params)

    return NextResponse.json({ cameras })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
