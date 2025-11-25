import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { mockCameras, mockBookings, mockUsers } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Camera, 
  Calendar, 
  DollarSign, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from "lucide-react"
import { toast } from "sonner"

export default function LenderDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Filter data for current lender
  const lenderCameras = mockCameras.filter(c => c.lender_id === user?.id)
  const lenderBookings = mockBookings.filter(b => b.lender_id === user?.id)
  const pendingRequests = lenderBookings.filter(b => b.status === 'request_pending')
  const activeBookings = lenderBookings.filter(b => ['confirmed', 'pickup_verified'].includes(b.status))
  const completedBookings = lenderBookings.filter(b => b.status === 'completed')
  
  // Calculate earnings
  const totalEarnings = lenderBookings.reduce((sum, booking) => sum + booking.total_price, 0)
  const monthlyEarnings = totalEarnings * 0.7 // Simulate monthly earnings

  const handleBookingAction = (bookingId: string, action: 'accept' | 'reject') => {
    toast.success(`Booking ${action}ed successfully!`)
    // In real app, this would update the booking status
  }

  const handleLogout = () => {
    logout()
    navigate("/demo-auth")
  }

  const stats = [
    {
      title: "My Cameras",
      value: lenderCameras.length,
      icon: Camera,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Pending Requests",
      value: pendingRequests.length,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Active Bookings",
      value: activeBookings.length,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Earnings",
      value: `₹${totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Camera className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Lender Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your cameras and bookings</p>
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
            <TabsTrigger value="cameras">My Cameras</TabsTrigger>
            <TabsTrigger value="requests">Booking Requests</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
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
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => navigate("/lender/add-camera")}
                  className="flex items-center gap-2 h-auto p-4"
                >
                  <Plus className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Add New Camera</p>
                    <p className="text-xs opacity-80">List a new camera for rent</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-auto p-4"
                  onClick={() => setActiveTab("requests")}
                >
                  <Clock className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Review Requests</p>
                    <p className="text-xs opacity-60">{pendingRequests.length} pending</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-auto p-4"
                  onClick={() => setActiveTab("earnings")}
                >
                  <TrendingUp className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">View Earnings</p>
                    <p className="text-xs opacity-60">₹{monthlyEarnings.toFixed(0)} this month</p>
                  </div>
                </Button>
              </div>
            </Card>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Recent Bookings</h3>
                <div className="space-y-3">
                  {lenderBookings.slice(0, 5).map((booking, index) => {
                    const camera = lenderCameras.find(c => c.id === booking.camera_id)
                    const renter = mockUsers.find(u => u.id === booking.renter_id)
                    return (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-border/50">
                        <div>
                          <p className="font-medium">{camera?.name}</p>
                          <p className="text-sm text-muted-foreground">by {renter?.name}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                            {booking.status.replace('_', ' ')}
                          </Badge>
                          <p className="text-sm font-medium mt-1">₹{booking.total_price}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Camera Performance</h3>
                <div className="space-y-3">
                  {lenderCameras.slice(0, 4).map((camera, index) => {
                    const bookingCount = lenderBookings.filter(b => b.camera_id === camera.id).length
                    return (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <img 
                            src={camera.image_url} 
                            alt={camera.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{camera.name}</p>
                            <p className="text-sm text-muted-foreground">{bookingCount} bookings</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{camera.price_per_day}/day</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cameras" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">My Cameras ({lenderCameras.length})</h3>
              <Button onClick={() => navigate("/lender/add-camera")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Camera
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lenderCameras.map((camera, index) => {
                const bookingCount = lenderBookings.filter(b => b.camera_id === camera.id).length
                return (
                  <Card key={index} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100">
                      <img
                        src={camera.image_url}
                        alt={camera.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-1">{camera.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{camera.category}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold">₹{camera.price_per_day}/day</span>
                        <span className="text-sm text-muted-foreground">{bookingCount} bookings</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Booking Requests ({pendingRequests.length})</h3>
            </div>
            
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <Card className="p-8 text-center">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="font-semibold mb-2">No pending requests</h4>
                  <p className="text-muted-foreground">New booking requests will appear here</p>
                </Card>
              ) : (
                pendingRequests.map((booking, index) => {
                  const camera = lenderCameras.find(c => c.id === booking.camera_id)
                  const renter = mockUsers.find(u => u.id === booking.renter_id)
                  return (
                    <Card key={index} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-4">
                          <img 
                            src={camera?.image_url} 
                            alt={camera?.name}
                            className="w-16 h-16 rounded object-cover"
                          />
                          <div>
                            <h4 className="font-semibold">{camera?.name}</h4>
                            <p className="text-sm text-muted-foreground">Requested by {renter?.name}</p>
                            <p className="text-sm text-muted-foreground">{renter?.email}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Pickup Date:</span>
                          <p className="font-medium">{booking.pickup_date}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Return Date:</span>
                          <p className="font-medium">{booking.return_date}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Amount:</span>
                          <p className="font-semibold text-green-600">₹{booking.total_price}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => handleBookingAction(booking.id, 'accept')}
                          className="flex-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept Request
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleBookingAction(booking.id, 'reject')}
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <h4 className="font-semibold mb-2">Total Earnings</h4>
                <p className="text-3xl font-bold text-green-600">₹{totalEarnings.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">All time</p>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold mb-2">This Month</h4>
                <p className="text-3xl font-bold text-blue-600">₹{monthlyEarnings.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+24% from last month</p>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold mb-2">Average per Booking</h4>
                <p className="text-3xl font-bold text-purple-600">₹{(totalEarnings / lenderBookings.length || 0).toFixed(0)}</p>
                <p className="text-sm text-muted-foreground mt-1">Per rental</p>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Earnings Breakdown</h3>
              <div className="space-y-4">
                {completedBookings.map((booking, index) => {
                  const camera = lenderCameras.find(c => c.id === booking.camera_id)
                  const renter = mockUsers.find(u => u.id === booking.renter_id)
                  const lenderEarning = booking.total_price * 0.85 // 85% to lender, 15% platform fee
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <img 
                          src={camera?.image_url} 
                          alt={camera?.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{camera?.name}</p>
                          <p className="text-sm text-muted-foreground">Rented by {renter?.name}</p>
                          <p className="text-xs text-muted-foreground">{booking.pickup_date} to {booking.return_date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">₹{lenderEarning.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Your share</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
