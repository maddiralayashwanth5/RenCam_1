import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { mockBookings, mockCameras, mockUsers } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  MapPin,
  Camera,
  User,
  Wallet,
  Key,
  ArrowRight
} from "lucide-react"
import { toast } from "sonner"

export default function RenterBookings() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("pending")
  const [otpDialogOpen, setOtpDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [otpType, setOtpType] = useState<'pickup' | 'return'>('pickup')
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  // Filter bookings for current renter
  const renterBookings = mockBookings.filter(b => b.renter_id === user?.id)
  const pendingBookings = renterBookings.filter(b => ['request_pending', 'request_approved'].includes(b.status))
  const activeBookings = renterBookings.filter(b => ['confirmed', 'pickup_verified'].includes(b.status))
  const completedBookings = renterBookings.filter(b => b.status === 'completed')
  
  const handleOtpVerification = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setIsVerifying(true)
    
    // Simulate OTP verification
    setTimeout(() => {
      if (otp === '123456') { // Mock OTP
        toast.success(`${otpType === 'pickup' ? 'Pickup' : 'Return'} verified successfully!`)
        setOtpDialogOpen(false)
        setOtp('')
        setIsVerifying(false)
      } else {
        toast.error('Invalid OTP. Try 123456 for demo.')
        setIsVerifying(false)
      }
    }, 1500)
  }

  const openOtpDialog = (booking: any, type: 'pickup' | 'return') => {
    setSelectedBooking(booking)
    setOtpType(type)
    setOtpDialogOpen(true)
    setOtp('')
  }

  const handleLogout = () => {
    logout()
    navigate("/demo-auth")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'request_pending': return 'bg-yellow-100 text-yellow-800'
      case 'request_approved': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pickup_verified': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const BookingCard = ({ booking, showActions = true }: { booking: any, showActions?: boolean }) => {
    const camera = mockCameras.find(c => c.id === booking.camera_id)
    const lender = mockUsers.find(u => u.id === booking.lender_id)
    
    return (
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <img 
            src={camera?.image_url} 
            alt={camera?.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-lg">{camera?.name}</h4>
                <p className="text-sm text-muted-foreground">by {lender?.name}</p>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.replace('_', ' ')}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Pickup</p>
                  <p className="font-medium">{booking.pickup_date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Return</p>
                  <p className="font-medium">{booking.return_date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-semibold text-green-600">₹{booking.total_price}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">Mumbai</p>
                </div>
              </div>
            </div>

            {showActions && (
              <div className="flex gap-2">
                {booking.status === 'confirmed' && (
                  <Button 
                    onClick={() => openOtpDialog(booking, 'pickup')}
                    className="flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Enter Pickup OTP
                  </Button>
                )}
                {booking.status === 'pickup_verified' && (
                  <Button 
                    onClick={() => openOtpDialog(booking, 'return')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Enter Return OTP
                  </Button>
                )}
                {booking.status === 'request_pending' && (
                  <Button variant="outline" disabled>
                    <Clock className="w-4 h-4 mr-2" />
                    Waiting for Approval
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/camera/${camera?.id}`)}
                >
                  View Camera
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Bookings</h1>
              <p className="text-sm text-muted-foreground">Track your camera rentals</p>
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
        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingBookings.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Camera className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{activeBookings.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedBookings.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeBookings.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingBookings.length === 0 ? (
              <Card className="p-8 text-center">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h4 className="font-semibold mb-2">No pending bookings</h4>
                <p className="text-muted-foreground mb-4">Your booking requests will appear here</p>
                <Button onClick={() => navigate('/browse')}>Browse Cameras</Button>
              </Card>
            ) : (
              pendingBookings.map((booking, index) => (
                <BookingCard key={index} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeBookings.length === 0 ? (
              <Card className="p-8 text-center">
                <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h4 className="font-semibold mb-2">No active bookings</h4>
                <p className="text-muted-foreground mb-4">Your confirmed rentals will appear here</p>
                <Button onClick={() => navigate('/browse')}>Browse Cameras</Button>
              </Card>
            ) : (
              activeBookings.map((booking, index) => (
                <BookingCard key={index} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedBookings.length === 0 ? (
              <Card className="p-8 text-center">
                <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h4 className="font-semibold mb-2">No completed bookings</h4>
                <p className="text-muted-foreground">Your rental history will appear here</p>
              </Card>
            ) : (
              completedBookings.map((booking, index) => (
                <BookingCard key={index} booking={booking} showActions={false} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* OTP Verification Dialog */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              {otpType === 'pickup' ? 'Pickup' : 'Return'} Verification
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold">{mockCameras.find(c => c.id === selectedBooking?.camera_id)?.name}</h4>
              <p className="text-sm text-muted-foreground">
                {otpType === 'pickup' ? 'Meet the lender and verify pickup' : 'Return the camera and verify'}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otp">Enter 6-digit OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground text-center">
                For demo, use: <code className="bg-muted px-1 rounded">123456</code>
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setOtpDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleOtpVerification}
                disabled={isVerifying || otp.length !== 6}
                className="flex-1"
              >
                {isVerifying ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
