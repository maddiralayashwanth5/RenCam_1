import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware/auth"
import { getUserById } from "@/lib/auth"

async function meHandler(request: NextRequest) {
  const authRequest = request as any
  const user = authRequest.user

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Return user data from JWT token directly (no need to fetch from DB)
  return NextResponse.json({
    user: {
      id: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  })
}

export async function GET(request: NextRequest) {
  return withAuth(request, meHandler)
}
