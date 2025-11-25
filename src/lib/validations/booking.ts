import { z } from "zod"

export const createBookingSchema = z.object({
  cameraId: z.string().uuid("Invalid camera ID"),
  pickupDate: z.string().refine((date: string) => {
    const d = new Date(date)
    return d > new Date() && !isNaN(d.getTime())
  }, "Pickup date must be in the future"),
  returnDate: z.string().refine((date: string) => !isNaN(new Date(date).getTime()), "Invalid return date"),
  totalPrice: z.number().positive("Total price must be positive"),
  userId: z.string().uuid("Invalid user ID"),
})

export const verifyOTPSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>
