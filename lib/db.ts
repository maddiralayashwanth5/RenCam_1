import { neon } from "@neondatabase/serverless"
import { Pool } from "pg"

// Detect if using Neon or local PostgreSQL
const isNeon = process.env.DATABASE_URL?.includes('neon.tech')

let sql: any
let pool: Pool | null = null

if (isNeon) {
  // Use Neon serverless driver
  sql = neon(process.env.DATABASE_URL!)
} else {
  // Use standard pg for local PostgreSQL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  
  // Create a neon-like interface for compatibility
  sql = async (query: string, params?: any[]) => {
    const client = await pool!.connect()
    try {
      const result = await client.query(query, params)
      return result.rows
    } finally {
      client.release()
    }
  }
}

// Low-level query execution
export async function query<T = unknown>(text: string, values?: unknown[]): Promise<T[]> {
  try {
    console.log("[DB] Query:", text.substring(0, 80), "...", values ? `(${values.length} params)` : "(no params)")

    const result = await sql(text, values || [])

    console.log("[DB] Query result:", result.length, "rows")
    return result as T[]
  } catch (error) {
    const err = error as any
    console.error("[v0] Query error:", err?.message || error)
    throw error
  }
}

export async function queryOne<T = unknown>(text: string, values?: unknown[]): Promise<T | null> {
  const results = await query<T>(text, values)
  return results.length > 0 ? results[0] : null
}

// Database error helpers
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public constraint?: string,
  ) {
    super(message)
    this.name = "DatabaseError"
  }
}

export function handleDatabaseError(error: unknown): never {
  const err = error as any

  if (err?.code === "23505") {
    const constraint = err?.constraint || "unique"
    throw new DatabaseError(`Duplicate entry violates ${constraint} constraint`, "23505", constraint)
  }

  if (err?.code === "23503") {
    throw new DatabaseError("Foreign key constraint violation", "23503")
  }

  if (err?.code === "23502") {
    throw new DatabaseError("Not null constraint violation", "23502")
  }

  throw error
}
