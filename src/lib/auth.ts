import bcrypt from "bcryptjs"
import { UserRepository } from "@/lib/repositories"
import { DatabaseError } from "@/lib/db"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: "admin" | "lender" | "renter"
  avatar_url?: string
  wallet_balance: number
  created_at: string
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: "renter" | "lender" = "renter",
): Promise<User> {
  try {
    // Check if email already exists
    const existingUser = await UserRepository.findByEmail(email)
    if (existingUser) {
      throw new DatabaseError("Email already registered", "23505", "users_email_key")
    }

    const passwordHash = await hashPassword(password)

    const user = await UserRepository.create({
      email,
      password_hash: passwordHash,
      name,
      role,
    })

    return user
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error
    }
    console.error("[v0] createUser error:", error)
    throw error
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    return await UserRepository.findByEmail(email)
  } catch (error) {
    console.error("[v0] getUserByEmail error:", error)
    throw error
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    return await UserRepository.findById(id)
  } catch (error) {
    console.error("[v0] getUserById error:", error)
    throw error
  }
}

export async function verifyUserCredentials(email: string, password: string): Promise<User | null> {
  try {
    const result = await UserRepository.findByEmailForAuth(email)
    if (!result) return null

    const isValid = await verifyPassword(password, result.password_hash)
    if (!isValid) return null

    const { password_hash, ...user } = result
    return user
  } catch (error) {
    console.error("[v0] verifyUserCredentials error:", error)
    throw error
  }
}
