import { NextRequest, NextResponse } from "next/server"
import { env } from "@/lib/env"

// Simple in-memory rate limiter (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getClientId(request: NextRequest): string {
  // Use IP address or user ID for rate limiting
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : "unknown"
  return ip
}

function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key)
    }
  }
}

export async function withRateLimit(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: {
    maxRequests?: number
    windowMs?: number
  },
): Promise<NextResponse> {
  const clientId = getClientId(request)
  const now = Date.now()
  const maxRequests = options?.maxRequests || env.RATE_LIMIT_MAX_REQUESTS
  const windowMs = options?.windowMs || env.RATE_LIMIT_WINDOW_MS

  // Cleanup old entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries()
  }

  const clientData = rateLimitMap.get(clientId)

  if (!clientData || clientData.resetTime < now) {
    // First request or window expired
    rateLimitMap.set(clientId, {
      count: 1,
      resetTime: now + windowMs,
    })
    return handler(request)
  }

  if (clientData.count >= maxRequests) {
    const retryAfter = Math.ceil((clientData.resetTime - now) / 1000)
    return NextResponse.json(
      {
        error: "Too many requests",
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(clientData.resetTime).toISOString(),
        },
      },
    )
  }

  // Increment count
  clientData.count++
  rateLimitMap.set(clientId, clientData)

  const response = await handler(request)

  // Add rate limit headers
  response.headers.set("X-RateLimit-Limit", maxRequests.toString())
  response.headers.set("X-RateLimit-Remaining", (maxRequests - clientData.count).toString())
  response.headers.set("X-RateLimit-Reset", new Date(clientData.resetTime).toISOString())

  return response
}
