import { query } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "demo-secret-key-change-in-production")

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)

    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all users
    const users = await query<{
      id: string
      name: string
      email: string
      role: string
      wallet_balance: number
      created_at: string
    }>(
      `SELECT id, name, email, role, wallet_balance, created_at 
       FROM users 
       WHERE deleted_at IS NULL 
       ORDER BY created_at DESC`
    )

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Admin users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
