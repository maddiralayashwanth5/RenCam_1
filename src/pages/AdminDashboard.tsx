import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { mockUsers, mockCameras, mockBookings, mockTransactions } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Camera, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Shield,
  Settings,
  BarChart3,
  Activity
} from "lucide-react"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate stats
  const totalUsers = mockUsers.length
  const totalCameras = mockCameras.length
  const totalBookings = mockBookings.length
  const totalRevenue = mockTransactions.reduce((sum, txn) => sum + txn.amount, 0)
  const activeBookings = mockBookings.filter(b => ['confirmed', 'pickup_verified'].includes(b.status)).length
  const completedBookings = mockBookings.filter(b => b.status === 'completed').length
  
  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%"
    },
    {
      title: "Total Cameras",
      value: totalCameras,
      icon: Camera,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+8%"
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+24%"
    },
    {
      title: "Platform Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "+18%"
    }
  ]

  const handleLogout = () => {
    logout()
    navigate("/demo-auth")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Platform Management & Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
            <Button onClick={() => navigate("/demo-auth")}>Switch Role</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600">{stat.change}</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">Recent Bookings</h3>
                </div>
                <div className="space-y-3">
                  {mockBookings.slice(0, 5).map((booking, index) => {
                    const camera = mockCameras.find(c => c.id === booking.camera_id)
                    const renter = mockUsers.find(u => u.id === booking.renter_id)
                    return (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border/50">
                        <div>
                          <p className="font-medium">{camera?.name}</p>
                          <p className="text-sm text-muted-foreground">by {renter?.name}</p>
                        </div>
                        <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                          {booking.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold">Platform Metrics</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Bookings</span>
                    <span className="font-semibold">{activeBookings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed Bookings</span>
                    <span className="font-semibold">{completedBookings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-semibold text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Booking Value</span>
                    <span className="font-semibold">₹{(totalRevenue / totalBookings).toFixed(0)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">User Management</h3>
              <div className="space-y-4">
                {mockUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="font-semibold">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'lender' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      <span className="text-sm font-medium">₹{user.wallet_balance}</span>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Booking Management</h3>
              <div className="space-y-4">
                {mockBookings.map((booking, index) => {
                  const camera = mockCameras.find(c => c.id === booking.camera_id)
                  const renter = mockUsers.find(u => u.id === booking.renter_id)
                  const lender = mockUsers.find(u => u.id === booking.lender_id)
                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{camera?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {renter?.name} → {lender?.name}
                          </p>
                        </div>
                        <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                          {booking.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Pickup:</span>
                          <p>{booking.pickup_date}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Return:</span>
                          <p>{booking.return_date}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total:</span>
                          <p className="font-semibold">₹{booking.total_price}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Revenue Analytics</h3>
                <div className="space-y-4">
                  <div className="text-center p-8 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Platform Revenue</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-xl font-bold text-blue-600">₹{(totalRevenue * 0.1).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Platform Fees</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-xl font-bold text-purple-600">₹{(totalRevenue * 0.05).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Tax Collected</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Server Status</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Database</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Payment Gateway</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Uptime</span>
                    <span className="font-semibold">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Response Time</span>
                    <span className="font-semibold">120ms</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
