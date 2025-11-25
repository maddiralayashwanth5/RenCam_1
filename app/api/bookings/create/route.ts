import { queryOne } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { cameraId, pickupDate, returnDate, totalPrice, platformFee, tax, userId } = await request.json()

    if (!userId) {
      console.log("[v0] No userId provided in request")
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const camera = await queryOne<{id: string; lender_id: string}>(`SELECT id, lender_id FROM cameras WHERE id = $1`, [cameraId])

    if (!camera) {
      console.log("[v0] Camera not found:", cameraId)
      return NextResponse.json({ error: "Camera not found" }, { status: 404 })
    }

    const booking = await queryOne<{id: string}>(
      `
      INSERT INTO bookings (camera_id, renter_id, lender_id, pickup_date, return_date, status, total_price, platform_fee, tax)
      VALUES ($1, $2, $3, $4, $5, 'request_pending', $6, $7, $8)
      RETURNING id
      `,
      [cameraId, userId, camera.lender_id, pickupDate, returnDate, totalPrice, platformFee || (totalPrice * 0.1), tax || (totalPrice * 0.05)],
    )

    console.log("[v0] Booking created:", booking?.id)

    return NextResponse.json({
      booking_id: booking?.id,
      success: true,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Booking creation failed"
    console.log("[v0] Booking error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
