import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const renter = JSON.parse(request.headers.get("user") || "{}")

    if (!renter.id) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    // Get all bookings for this renter with camera and lender details
    const bookings = await query(
      `
      SELECT 
        b.id,
        b.status,
        b.pickup_date,
        b.return_date,
        b.total_price,
        b.pickup_verified_at,
        b.return_verified_at,
        b.created_at,
        c.name as camera_name,
        c.image_url as camera_image,
        c.price_per_day,
        u.name as lender_name,
        u.email as lender_email
      FROM bookings b
      JOIN cameras c ON b.camera_id = c.id
      JOIN users u ON b.lender_id = u.id
      WHERE b.renter_id = $1 AND b.deleted_at IS NULL
      ORDER BY b.created_at DESC
      `,
      [renter.id],
    )

    return NextResponse.json({ bookings })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch bookings"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
