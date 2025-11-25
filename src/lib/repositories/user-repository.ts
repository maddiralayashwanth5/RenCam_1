import { queryOne, query, DatabaseError, handleDatabaseError } from "@/lib/db"
import type { User } from "@/lib/auth"

export class UserRepository {
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await queryOne<User>(
        `SELECT id, email, name, role, wallet_balance, created_at 
         FROM users 
         WHERE email = $1 AND deleted_at IS NULL`,
        [email],
      )
      return result || null
    } catch (error) {
      handleDatabaseError(error)
    }
  }

  static async findById(id: string): Promise<User | null> {
    try {
      const result = await queryOne<User>(
        `SELECT id, email, name, role, wallet_balance, created_at 
         FROM users 
         WHERE id = $1 AND deleted_at IS NULL`,
        [id],
      )
      return result || null
    } catch (error) {
      handleDatabaseError(error)
    }
  }

  static async findByEmailForAuth(email: string): Promise<(User & { password_hash: string }) | null> {
    try {
      const result = await queryOne<User & { password_hash: string }>(
        `SELECT id, email, password_hash, name, role, wallet_balance, created_at 
         FROM users 
         WHERE email = $1 AND deleted_at IS NULL`,
        [email],
      )
      return result || null
    } catch (error) {
      handleDatabaseError(error)
    }
  }

  static async create(data: {
    email: string
    password_hash: string
    name: string
    role: "admin" | "lender" | "renter"
  }): Promise<User> {
    try {
      const result = await queryOne<User>(
        `INSERT INTO users (email, password_hash, name, role, wallet_balance)
         VALUES ($1, $2, $3, $4, 0)
         RETURNING id, email, name, phone, role, avatar_url, wallet_balance, created_at`,
        [data.email, data.password_hash, data.name, data.role],
      )

      if (!result) {
        throw new DatabaseError("Failed to create user")
      }

      return result
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      handleDatabaseError(error)
    }
  }

  static async updateWallet(userId: string, amount: number): Promise<void> {
    try {
      await query(`UPDATE users SET wallet_balance = wallet_balance + $1 WHERE id = $2`, [amount, userId])
    } catch (error) {
      handleDatabaseError(error)
    }
  }

  static async getWallet(userId: string): Promise<number> {
    try {
      const result = await queryOne<{ wallet_balance: number }>(
        `SELECT wallet_balance FROM users WHERE id = $1 AND deleted_at IS NULL`,
        [userId],
      )
      return result?.wallet_balance || 0
    } catch (error) {
      handleDatabaseError(error)
    }
  }
}
