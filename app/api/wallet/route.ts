import { query, queryOne } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const user = JSON.parse(request.headers.get("user") || "{}")

    if (!user.id) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const transactions = await query(
      `
      SELECT id, type, amount, description, created_at
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20
      `,
      [user.id],
    )

    const walletBalance = await queryOne<{ wallet_balance: number }>(`SELECT wallet_balance FROM users WHERE id = $1`, [user.id])

    return NextResponse.json({
      balance: walletBalance?.wallet_balance || 0,
      transactions,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch wallet"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
