import { queryOne } from "@/lib/db"
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
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    // Get total users count
    const usersResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*)::text as count FROM users WHERE deleted_at IS NULL`
    )

    // Get total listings count
    const listingsResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*)::text as count FROM cameras WHERE deleted_at IS NULL`
    )

    // Get total bookings count
    const bookingsResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*)::text as count FROM bookings WHERE deleted_at IS NULL`
    )

    // Get active bookings count (confirmed or pickup_verified)
    const activeBookingsResult = await queryOne<{ count: string }>(
      `SELECT COUNT(*)::text as count FROM bookings 
       WHERE deleted_at IS NULL 
       AND status IN ('confirmed', 'pickup_verified')`
    )

    // Calculate platform revenue (sum of all platform fees)
    const revenueResult = await queryOne<{ revenue: string }>(
      `SELECT COALESCE(SUM(platform_fee), 0)::text as revenue 
       FROM bookings 
       WHERE deleted_at IS NULL 
       AND status IN ('completed', 'pickup_verified', 'confirmed')`
    )

    return NextResponse.json({
      totalUsers: usersResult ? parseInt(usersResult.count) : 0,
      totalListings: listingsResult ? parseInt(listingsResult.count) : 0,
      totalBookings: bookingsResult ? parseInt(bookingsResult.count) : 0,
      activeBookings: activeBookingsResult ? parseInt(activeBookingsResult.count) : 0,
      platformRevenue: revenueResult ? parseFloat(revenueResult.revenue) : 0,
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
