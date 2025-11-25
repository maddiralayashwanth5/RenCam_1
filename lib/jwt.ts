import { SignJWT, jwtVerify } from "jose"
import { env } from "@/lib/env"

export interface JWTPayload {
  userId: string
  email: string
  role: "admin" | "lender" | "renter"
  iat?: number
  exp?: number
}

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET)

export async function signToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(JWT_SECRET)

  return token
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    // Ensure the payload has the required fields
    if (typeof payload.userId === 'string' && 
        typeof payload.email === 'string' && 
        (payload.role === 'admin' || payload.role === 'lender' || payload.role === 'renter')) {
      return payload as unknown as JWTPayload
    }
    return null
  } catch (error) {
    console.error("[Security] JWT verification failed:", error)
    return null
  }
}

export function createAuthCookie(token: string): string {
  const isProduction = env.NODE_ENV === "production"
  const maxAge = 7 * 24 * 60 * 60 // 7 days in seconds

  return [
    `auth-token=${token}`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Path=/`,
    `Max-Age=${maxAge}`,
    isProduction ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ")
}

export function clearAuthCookie(): string {
  return [
    `auth-token=`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Path=/`,
    `Max-Age=0`,
    env.NODE_ENV === "production" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ")
}
