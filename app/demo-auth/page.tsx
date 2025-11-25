"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Camera, Shield } from "lucide-react"

export default function DemoAuthPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const roles = [
    {
      id: "admin",
      name: "Admin",
      email: "admin@rencam.com",
      icon: Shield,
      color: "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-800",
      iconColor: "text-red-600",
      description: "Full platform access, manage all users and bookings",
      dashboard: "/admin/dashboard",
    },
    {
      id: "lender",
      name: "Lender",
      email: "lender@rencam.com",
      icon: Camera,
      color: "bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-800",
      iconColor: "text-green-600",
      description: "List cameras, manage rentals, track earnings",
      dashboard: "/lender/dashboard",
    },
    {
      id: "renter",
      name: "Renter",
      email: "renter@rencam.com",
      icon: User,
      color: "bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-800",
      iconColor: "text-blue-600",
      description: "Browse cameras, make bookings, manage rentals",
      dashboard: "/browse",
    },
  ]

  const handleLogin = async (role: typeof roles[0]) => {
    setSelectedRole(role.id)
    
    try {
      // Call demo login API
      const response = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: role.email }),
      })

      if (response.ok) {
        // Redirect to appropriate dashboard
        router.push(role.dashboard)
      } else {
        alert("Demo login failed")
        setSelectedRole(null)
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Demo login failed")
      setSelectedRole(null)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            RenCam Demo
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Camera Rental Platform Prototype
          </p>
          <p className="text-sm text-muted-foreground">
            Select a role to explore the platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id
            
            return (
              <Card
                key={role.id}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? role.color + " border-2" : "hover:scale-105"
                }`}
                onClick={() => !selectedRole && handleLogin(role)}
              >
                <div className="text-center space-y-4">
                  <div className={`w-20 h-20 mx-auto rounded-full ${role.color} flex items-center justify-center`}>
                    <Icon className={`w-10 h-10 ${role.iconColor}`} />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{role.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono">{role.email}</p>
                  </div>
                  
                  <p className="text-sm text-muted-foreground min-h-[40px]">
                    {role.description}
                  </p>
                  
                  <Button
                    className="w-full"
                    disabled={selectedRole !== null}
                    variant={isSelected ? "default" : "outline"}
                  >
                    {isSelected ? "Logging in..." : `Login as ${role.name}`}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        <Card className="p-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <div className="text-center space-y-2">
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              🎬 Presentation Mode
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              This is a demo prototype with pre-populated data. All features are functional for demonstration purposes.
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
              No password required • Switch between roles anytime • Sample data included
            </p>
          </div>
        </Card>
      </div>
    </main>
  )
}
