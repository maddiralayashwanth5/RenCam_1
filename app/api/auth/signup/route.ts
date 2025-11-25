import { createUser } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { signupSchema } from "@/lib/validations/auth"
import { signToken, createAuthCookie } from "@/lib/jwt"
import { withRateLimit } from "@/lib/middleware/rate-limit"
import { z } from "zod"

async function signupHandler(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = signupSchema.parse(body)

    console.log("[Security] Signup attempt for email:", validatedData.email)
    const user = await createUser(
      validatedData.email,
      validatedData.password,
      validatedData.name,
      validatedData.role,
    )
    console.log("[Security] User created successfully:", user.id)

    // Generate JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

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

    const message = error instanceof Error ? error.message : "Signup failed"
    console.error("[Security] Signup error:", message)

    if (
      message.includes("duplicate key") ||
      message.includes("users_email_key") ||
      message.includes("Email already registered")
    ) {
      return NextResponse.json(
        { error: "Email already registered. Please login or use a different email." },
        { status: 409 },
      )
    }

    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, signupHandler, { maxRequests: 5, windowMs: 900000 })
}
