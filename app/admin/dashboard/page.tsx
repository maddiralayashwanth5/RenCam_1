"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Camera, CreditCard, TrendingUp, AlertCircle } from "lucide-react"

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalBookings: 0,
    platformRevenue: 0,
    activeBookings: 0,
  })
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && (!user || user.role !== "admin")) {
      router.push("/")
    }
  }, [mounted, loading, user, router])

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAdminStats()
    }
  }, [user])

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error)
    }
  }

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoadingUsers(false)
    }
  }

  if (!mounted || loading || !user) {
    return <div />
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Platform overview and management</p>

        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Listings</p>
                <p className="text-2xl font-bold">{stats.totalListings}</p>
              </div>
              <Camera className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.totalBookings}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Platform Revenue</p>
                <p className="text-2xl font-bold">₹{stats.platformRevenue.toLocaleString()}</p>
              </div>
              <CreditCard className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Bookings</p>
                <p className="text-2xl font-bold">{stats.activeBookings}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">All Users</h3>
                <button 
                  onClick={fetchUsers}
                  className="text-sm text-primary hover:underline"
                  disabled={loadingUsers}
                >
                  {loadingUsers ? "Loading..." : "Refresh"}
                </button>
              </div>
              
              {users.length === 0 && !loadingUsers ? (
                <p className="text-center text-muted-foreground py-8">
                  Click "Refresh" to load users
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Role</th>
                        <th className="text-right py-3 px-4">Wallet Balance</th>
                        <th className="text-left py-3 px-4">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{u.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              u.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              u.role === 'lender' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            ₹{u.wallet_balance?.toLocaleString() || '0'}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-sm">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">View and manage all camera listings</p>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Monitor all active bookings</p>
            </Card>
          </TabsContent>

          <TabsContent value="disputes">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Handle booking disputes</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
