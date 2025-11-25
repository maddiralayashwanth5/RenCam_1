import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json()
    const user = JSON.parse(request.headers.get("user") || "{}")

    if (!user.id) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Update wallet balance
    await query(
      `
      UPDATE users
      SET wallet_balance = wallet_balance + $1
      WHERE id = $2
      `,
      [amount, user.id],
    )

    // Record transaction
    await query(
      `
      INSERT INTO transactions (user_id, amount, type, description)
      VALUES ($1, $2, 'deposit', 'Wallet deposit')
      `,
      [user.id, amount],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Deposit failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
