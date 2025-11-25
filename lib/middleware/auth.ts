import { NextRequest, NextResponse } from "next/server"
import { verifyToken, type JWTPayload } from "@/lib/jwt"

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options?: {
    requiredRole?: "admin" | "lender" | "renter"
  },
): Promise<NextResponse> {
  try {
    // Extract token from cookies
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify token
    const payload = await verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Check role if required
    if (options?.requiredRole && payload.role !== options.requiredRole && payload.role !== "admin") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Attach user to request
    const authRequest = request as AuthenticatedRequest
    authRequest.user = payload

    return handler(authRequest)
  } catch (error) {
    console.error("[Auth Middleware] Error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

export function getUser(request: NextRequest): JWTPayload | null {
  return (request as AuthenticatedRequest).user || null
}
