import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { use } from "react"

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  try {
    const lender = JSON.parse(request.headers.get("user") || "{}")

    if (!lender.id) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const pickupOTP = generateOTP()
    const returnOTP = generateOTP()

    // Update booking with OTPs and set status to confirmed
    await query(
      `
      UPDATE bookings
      SET status = 'confirmed', pickup_otp = $1, return_otp = $2, updated_at = NOW()
      WHERE id = $3 AND lender_id = $4 AND status = 'request_approved'
      `,
      [pickupOTP, returnOTP, resolvedParams.id, lender.id],
    )

    return NextResponse.json({
      success: true,
      pickup_otp: pickupOTP,
      return_otp: returnOTP,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Confirmation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
