import { type NextRequest, NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  console.log("[Security] User logout")

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  })

  // Clear the auth cookie
  response.headers.set("Set-Cookie", clearAuthCookie())

  return response
}
