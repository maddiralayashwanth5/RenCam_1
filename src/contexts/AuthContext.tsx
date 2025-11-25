import React, { createContext, useContext, useState, useEffect } from 'react'
import { mockUsers } from '@/lib/mock-data'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'lender' | 'renter'
  wallet_balance: number
}

interface AuthContextType {
  user: User | null
  login: (email: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('rencam-user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string) => {
    const foundUser = mockUsers.find(u => u.email === email)
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem('rencam-user', JSON.stringify(foundUser))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('rencam-user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
