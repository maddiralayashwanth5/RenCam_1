import { query, queryOne } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { use } from "react"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  try {
    const { otp } = await request.json()
    const user = JSON.parse(request.headers.get("user") || "{}")

    // Get booking
    const booking = await queryOne<{ return_otp: string; status: string }>(
      `SELECT return_otp, status FROM bookings WHERE id = $1`,
      [resolvedParams.id]
    )

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.status !== "pickup_verified") {
      return NextResponse.json({ error: "Booking must be picked up before return verification" }, { status: 400 })
    }

    if (booking.return_otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // Update booking status
    await query(
      `
      UPDATE bookings
      SET status = 'completed', return_verified_at = NOW()
      WHERE id = $1
      `,
      [resolvedParams.id],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
