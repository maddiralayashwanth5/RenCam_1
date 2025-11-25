import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { mockCameras } from "@/lib/mock-data"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, Shield, Star } from "lucide-react"
import { toast } from "sonner"

export default function CameraDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const camera = mockCameras.find(c => c.id === id)
  
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [days, setDays] = useState(1)
  const [isBooking, setIsBooking] = useState(false)

  if (!camera) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Camera not found</h1>
          <Button onClick={() => navigate("/browse")}>Back to Browse</Button>
        </div>
      </div>
    )
  }

  const calculateDays = () => {
    if (pickupDate && returnDate) {
      const pickup = new Date(pickupDate)
      const returnD = new Date(returnDate)
      const diffTime = Math.abs(returnD.getTime() - pickup.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDays(diffDays || 1)
    }
  }

  const subtotal = camera.price_per_day * days
  const platformFee = subtotal * 0.1
  const tax = subtotal * 0.05
  const total = subtotal + platformFee + tax

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book a camera")
      navigate("/demo-auth")
      return
    }

    if (!pickupDate || !returnDate) {
      toast.error("Please select pickup and return dates")
      return
    }

    setIsBooking(true)
    
    // Simulate booking API call
    setTimeout(() => {
      toast.success("Booking request sent successfully!")
      setIsBooking(false)
      if (user.role === 'renter') {
        navigate("/renter/bookings")
      } else {
        navigate("/browse")
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button 
            onClick={() => navigate("/")}
            className="text-blue-600 font-bold text-2xl"
          >
            Rencam
          </button>
          <div className="flex items-center gap-2">
            {user ? (
              <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
            ) : (
              <Button variant="outline" onClick={() => navigate("/demo-auth")}>
                Login
              </Button>
            )}
            <Button onClick={() => navigate("/browse")}>
              Back to Browse
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Camera Images & Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img
                src={camera.image_url}
                alt={camera.name}
                className="w-full aspect-video object-cover rounded-lg"
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">{camera.name}</h1>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-sm text-muted-foreground">(24 reviews)</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-2">{camera.category}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Available in Mumbai</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Verified Lender</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">About this camera</h3>
              <p className="text-muted-foreground leading-relaxed">{camera.description}</p>
            </div>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Specifications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(camera.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-border/50">
                    <span className="capitalize font-medium">{key}:</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">₹{camera.price_per_day}</span>
                  <span className="text-muted-foreground">/day</span>
                </div>
                <p className="text-sm text-muted-foreground">Free cancellation up to 24 hours</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="pickup">Pickup Date</Label>
                    <Input
                      id="pickup"
                      type="date"
                      value={pickupDate}
                      onChange={(e) => {
                        setPickupDate(e.target.value)
                        calculateDays()
                      }}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="return">Return Date</Label>
                    <Input
                      id="return"
                      type="date"
                      value={returnDate}
                      onChange={(e) => {
                        setReturnDate(e.target.value)
                        calculateDays()
                      }}
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              {pickupDate && returnDate && (
                <div className="space-y-3 mb-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>₹{camera.price_per_day} × {days} days</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform fee</span>
                    <span>₹{platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleBooking}
                disabled={isBooking || !pickupDate || !returnDate}
              >
                {isBooking ? "Sending Request..." : "Send Rental Request"}
              </Button>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  You won't be charged yet. Review details before confirming.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
