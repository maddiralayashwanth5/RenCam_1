import { verifyUserCredentials } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { loginSchema } from "@/lib/validations/auth"
import { signToken, createAuthCookie } from "@/lib/jwt"
import { withRateLimit } from "@/lib/middleware/rate-limit"
import { z } from "zod"

async function loginHandler(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = loginSchema.parse(body)

    console.log("[Security] Login attempt for:", validatedData.email)

    const user = await verifyUserCredentials(validatedData.email, validatedData.password)

    if (!user) {
      console.log("[Security] Invalid credentials for:", validatedData.email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    console.log("[Security] Login successful for user:", user.id)

    // Create response with HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        wallet_balance: user.wallet_balance,
      },
    })

    response.headers.set("Set-Cookie", createAuthCookie(token))

    return response
  } catch (error: unknown) {
    // Validation error
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`).join(", ")
      return NextResponse.json({ error: `Validation failed: ${errors}` }, { status: 400 })
    }

    console.error("[Security] Login route error:", error)
    const message = error instanceof Error ? error.message : "Login failed"
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, loginHandler, { maxRequests: 10, windowMs: 900000 })
}
