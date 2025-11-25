import { queryOne, query, DatabaseError, handleDatabaseError } from "@/lib/db"

export interface Booking {
  id: string
  camera_id: string
  renter_id: string
  lender_id: string
  start_date: string
  end_date: string
  pickup_date: string
  return_date: string
  status: string
  pickup_otp: string
  return_otp: string
  total_price: number
  platform_fee: number
  tax: number
  created_at: string
}

export class BookingRepository {
  static async create(data: {
    camera_id: string
    renter_id: string
    lender_id: string
    start_date: string
    end_date: string
    pickup_date: string
    return_date: string
    total_price: number
    platform_fee: number
    tax: number
    pickup_otp: string
  }): Promise<Booking> {
    try {
      const result = await queryOne<Booking>(
        `INSERT INTO bookings 
         (camera_id, renter_id, lender_id, start_date, end_date, pickup_date, return_date, 
          status, pickup_otp, total_price, platform_fee, tax)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8, $9, $10, $11)
         RETURNING *`,
        [
          data.camera_id,
          data.renter_id,
          data.lender_id,
          data.start_date,
          data.end_date,
          data.pickup_date,
          data.return_date,
          data.pickup_otp,
          data.total_price,
          data.platform_fee,
          data.tax,
        ],
      )

      if (!result) {
        throw new DatabaseError("Failed to create booking")
      }

      return result
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      handleDatabaseError(error)
    }
  }

  static async findById(id: string): Promise<Booking | null> {
    try {
      const result = await queryOne<Booking>(`SELECT * FROM bookings WHERE id = $1`, [id])
      return result || null
    } catch (error) {
      handleDatabaseError(error)
    }
  }

  static async findByRenterId(renter_id: string): Promise<Booking[]> {
    try {
      const results = await query<Booking>(`SELECT * FROM bookings WHERE renter_id = $1 ORDER BY created_at DESC`, [
        renter_id,
      ])
      return results
    } catch (error) {
      handleDatabaseError(error)
    }
  }

  static async updateStatus(id: string, status: string, returnOtp?: string): Promise<void> {
    try {
      if (returnOtp) {
        await query(`UPDATE bookings SET status = $1, return_otp = $2 WHERE id = $3`, [status, returnOtp, id])
      } else {
        await query(`UPDATE bookings SET status = $1 WHERE id = $2`, [status, id])
      }
    } catch (error) {
      handleDatabaseError(error)
    }
  }
}
