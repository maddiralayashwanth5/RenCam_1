"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { LogOut, RefreshCw } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleSwitchRole = () => {
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-2xl text-primary">
          RenCam
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 capitalize">
                  {user.role}
                </span>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleSwitchRole}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Switch Role
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Link href="/">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
