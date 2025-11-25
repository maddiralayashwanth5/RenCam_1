"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "lender" | "renter"
  wallet_balance?: number
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include", // Important: send cookies
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          // Not authenticated or session expired
          setUser(null)
        }
      } catch (error) {
        console.error("[Auth] Failed to fetch user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setUser(null)
      router.push("/auth/login")
    } catch (error) {
      console.error("[Auth] Logout failed:", error)
      setUser(null)
    }
  }

  return { user, loading, logout }
}
