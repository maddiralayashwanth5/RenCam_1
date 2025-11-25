// Mock database - no real database needed!
import { query as mockQuery, queryOne as mockQueryOne } from './mock-db'

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  console.log("[Mock DB] Query:", text.substring(0, 80), "...", params ? `(${params.length} params)` : "(no params)")
  const result = await mockQuery<T>(text, params)
  console.log("[Mock DB] Query result:", result.length, "rows")
  return result
}

export async function queryOne<T = any>(text: string, params: any[] = []): Promise<T | null> {
  return mockQueryOne<T>(text, params)
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
