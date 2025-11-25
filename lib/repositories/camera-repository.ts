import { queryOne, query, DatabaseError, handleDatabaseError } from "@/lib/db"

export interface Camera {
  id: string
  lender_id: string
  name: string
  brand: string
  model: string
  category: string
  description: string
  price_per_day: number
  image_url: string
  specifications: Record<string, string>
  status: "active" | "inactive"
  created_at: string
}

export class CameraRepository {
  static async create(data: {
    lender_id: string
    name: string
    brand: string
    model: string
    category: string
    description: string
    price_per_day: number
    image_url: string
    specifications: Record<string, string>
  }): Promise<Camera> {
    try {
      const result = await queryOne<Camera>(
        `INSERT INTO cameras 
         (lender_id, name, brand, model, category, description, price_per_day, image_url, specifications, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active')
         RETURNING *`,
        [
          data.lender_id,
          data.name,
          data.brand,
          data.model,
          data.category,
          data.description,
          data.price_per_day,
          data.image_url,
          JSON.stringify(data.specifications),
        ],
      )

      if (!result) {
        throw new DatabaseError("Failed to create camera")
      }

      return result
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      handleDatabaseError(error)
    }
  }

  static async findById(id: string): Promise<Camera | null> {
    try {
      const result = await queryOne<Camera>(`SELECT * FROM cameras WHERE id = $1 AND status = 'active'`, [id])
      return result || null
    } catch (error) {
      handleDatabaseError(error)
    }
  }

  static async findAll(filters?: {
    category?: string
    minPrice?: number
    maxPrice?: number
    search?: string
  }): Promise<Camera[]> {
    try {
      let queryString = `SELECT * FROM cameras WHERE status = 'active'`
      const params: unknown[] = []

      if (filters?.category) {
        queryString += ` AND category = $${params.length + 1}`
        params.push(filters.category)
      }

      if (filters?.minPrice !== undefined) {
        queryString += ` AND price_per_day >= $${params.length + 1}`
        params.push(filters.minPrice)
      }

      if (filters?.maxPrice !== undefined) {
        queryString += ` AND price_per_day <= $${params.length + 1}`
        params.push(filters.maxPrice)
      }

      if (filters?.search) {
        queryString += ` AND (name ILIKE $${params.length + 1} OR brand ILIKE $${params.length + 1} OR model ILIKE $${params.length + 1})`
        params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`)
      }

      queryString += ` ORDER BY created_at DESC`

      const results = await query(queryString, params)
      return results as Camera[]
    } catch (error) {
      handleDatabaseError(error)
    }
  }

  static async findByLenderId(lender_id: string): Promise<Camera[]> {
    try {
      const results = await query<Camera>(`SELECT * FROM cameras WHERE lender_id = $1 ORDER BY created_at DESC`, [
        lender_id,
      ])
      return results
    } catch (error) {
      handleDatabaseError(error)
    }
  }
}
