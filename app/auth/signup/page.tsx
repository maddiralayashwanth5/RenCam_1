"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const isBrowser = typeof window !== "undefined"

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [role, setRole] = useState<"renter" | "lender">("renter")

  useEffect(() => {
    setMounted(true)
    if (searchParams) {
      const roleParam = searchParams.get("role") as "renter" | "lender"
      if (roleParam) setRole(roleParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Signup Failed",
          description: data.error,
          variant: "destructive",
        })
        return
      }

      // No need to store user in localStorage - using HTTP-only cookies
      toast({
        title: "Success",
        description: "Account created successfully!",
      })

      // Redirect based on role
      router.push(role === "lender" ? "/lender/dashboard" : "/browse")
      router.refresh() // Refresh to load user from cookie
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2">Create Account</h1>
        <p className="text-muted-foreground mb-6">Join Rencam as a {role === "lender" ? "lender" : "renter"}</p>

        <div className="flex gap-2 mb-6">
          <Button
            variant={role === "renter" ? "default" : "outline"}
            onClick={() => setRole("renter")}
            className="flex-1"
          >
            Renter
          </Button>
          <Button
            variant={role === "lender" ? "default" : "outline"}
            onClick={() => setRole("lender")}
            className="flex-1"
          >
            Lender
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" type="text" placeholder="John Doe" required />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}
