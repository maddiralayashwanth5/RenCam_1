import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, Camera, User } from "lucide-react"
import { toast } from "sonner"

export default function DemoAuthPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const handleLogin = async (email: string, dashboard: string, roleId: string) => {
    setLoading(roleId)
    try {
      await login(email)
      toast.success(`Logged in as ${roleId}`)
      navigate(dashboard)
    } catch (error) {
      toast.error("Login failed")
      setLoading(null)
    }
  }

  const roles = [
    {
      id: "admin",
      name: "Admin",
      email: "admin@rencam.com",
      icon: Shield,
      color: "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-800",
      iconColor: "text-red-600",
      dashboard: "/admin/dashboard",
    },
    {
      id: "lender",
      name: "Lender",
      email: "lender@rencam.com",
      icon: Camera,
      color: "bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-800",
      iconColor: "text-green-600",
      dashboard: "/lender/dashboard",
    },
    {
      id: "renter",
      name: "Renter",
      email: "renter@rencam.com",
      icon: User,
      color: "bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-800",
      iconColor: "text-blue-600",
      dashboard: "/browse",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            RenCam
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Camera Rental Platform
          </p>
          <p className="text-sm text-muted-foreground">
            Select your role to continue
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon
            const isLoading = loading === role.id
            
            return (
              <Card
                key={role.id}
                className={`p-6 transition-all hover:shadow-lg ${role.color}`}
              >
                <div className="text-center space-y-4">
                  <div className={`w-20 h-20 mx-auto rounded-full ${role.color} flex items-center justify-center`}>
                    <Icon className={`w-10 h-10 ${role.iconColor}`} />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{role.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono">{role.email}</p>
                  </div>
                  
                  <Button
                    className="w-full"
                    disabled={loading !== null}
                    onClick={() => handleLogin(role.email, role.dashboard, role.id)}
                  >
                    {isLoading ? "Logging in..." : `Login as ${role.name}`}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        <Card className="mt-8 p-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <div className="text-center space-y-2">
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              🎬 Demo Mode
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              No password required • Pre-populated data • Ready for presentation
            </p>
          </div>
        </Card>
      </div>
    </main>
  )
}
