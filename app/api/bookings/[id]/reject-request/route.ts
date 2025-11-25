import { queryOne } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { use } from "react"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  try {
    const lender = JSON.parse(request.headers.get("user") || "{}")

    if (!lender.id) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    // Verify lender owns this booking
    const booking = await queryOne(
      `SELECT id FROM bookings WHERE id = $1 AND lender_id = $2 AND status = 'request_pending'`,
      [resolvedParams.id, lender.id],
    )

    if (!booking) {
      return NextResponse.json({ error: "Booking not found or already processed" }, { status: 404 })
    }

    // Update status to rejected
    await queryOne(`UPDATE bookings SET status = 'rejected' WHERE id = $1`, [resolvedParams.id])

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reject request"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
