import { z } from "zod"

export const createCameraSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(200, "Name too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description too long"),
  category: z.string().min(1, "Category is required"),
  price_per_day: z.number().positive("Price must be positive").max(10000, "Price too high"),
  specs: z.record(z.string()).optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  image_url: z.string().url("Invalid image URL").optional(),
})

export const cameraFiltersSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().positive().optional(),
  search: z.string().optional(),
})

export type CreateCameraInput = z.infer<typeof createCameraSchema>
export type CameraFiltersInput = z.infer<typeof cameraFiltersSchema>
