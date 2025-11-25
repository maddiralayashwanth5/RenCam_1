"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, DollarSign, Users, Check, X, Key, Copy, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function LenderDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [confirmedBookings, setConfirmedBookings] = useState<any[]>([])
  const [activeBookings, setActiveBookings] = useState<any[]>([])
  const [completedBookings, setCompletedBookings] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeListings: 0,
    bookings: 0,
    rating: 0,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && (!user || user.role !== "lender")) {
      router.push("/auth/login")
    }
  }, [mounted, loading, user, router])

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/lender/bookings")
      const data = await response.json()
      
      if (response.ok) {
        const bookings = data.bookings || []
        setPendingRequests(bookings.filter((b: any) => b.status === "request_pending"))
        setConfirmedBookings(bookings.filter((b: any) => b.status === "confirmed" || b.status === "request_approved"))
        setActiveBookings(bookings.filter((b: any) => b.status === "pickup_verified"))
        setCompletedBookings(bookings.filter((b: any) => b.status === "completed"))
        
        // Update stats
        setStats({
          totalEarnings: bookings.filter((b: any) => b.status === "completed").reduce((sum: number, b: any) => sum + parseFloat(b.total_price), 0),
          activeListings: 0,
          bookings: bookings.length,
          rating: 4.8,
        })
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    }
  }

  const handleAcceptRequest = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/accept-request`, {
        method: "POST",
      })
      if (response.ok) {
        toast({
          title: "Request Accepted",
          description: "You can now generate OTPs for pickup and return.",
        })
        fetchBookings()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive",
      })
    }
  }

  const handleRejectRequest = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/reject-request`, {
        method: "POST",
      })
      if (response.ok) {
        toast({
          title: "Request Rejected",
          description: "The booking request has been rejected.",
        })
        fetchBookings()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      })
    }
  }

  const handleGenerateOTPs = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/confirm`, {
        method: "POST",
      })
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "OTPs Generated",
          description: "Pickup and return OTPs have been generated successfully.",
        })
        fetchBookings()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate OTPs",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate OTPs",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    })
  }

  if (!mounted || loading || !user) {
    return <div />
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Lender Dashboard</h1>
            <p className="text-muted-foreground">Manage your camera listings and rental requests</p>
          </div>
          <Link href="/lender/add-camera">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              List New Camera
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                <p className="text-3xl font-bold">₹{stats.totalEarnings}</p>
              </div>
              <DollarSign className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Listings</p>
                <p className="text-3xl font-bold">{stats.activeListings}</p>
              </div>
              <Calendar className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
                <p className="text-3xl font-bold">{stats.bookings}</p>
              </div>
              <Users className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rating</p>
                <p className="text-3xl font-bold">{stats.rating.toFixed(1)}</p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">Rental Requests ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed ({confirmedBookings.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeBookings.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            {pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <Card key={request.id} className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-bold text-lg mb-4">{request.camera_name}</h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="text-muted-foreground">Renter:</span> {request.renter_name}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Pickup:</span> {request.pickup_date}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Return:</span> {request.return_date}
                          </p>
                          <p className="text-lg font-bold text-primary mt-4">₹{request.total_price}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 items-end">
                        <Button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button onClick={() => handleRejectRequest(request.id)} variant="outline" className="flex-1">
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No pending rental requests</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="confirmed">
            {confirmedBookings.length > 0 ? (
              <div className="space-y-4">
                {confirmedBookings.map((booking) => (
                  <Card key={booking.id} className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg mb-2">{booking.camera_name}</h3>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Renter:</span> {booking.renter_name}</p>
                            <p><span className="text-muted-foreground">Pickup:</span> {new Date(booking.pickup_date).toLocaleDateString()}</p>
                            <p><span className="text-muted-foreground">Return:</span> {new Date(booking.return_date).toLocaleDateString()}</p>
                            <p className="text-lg font-bold text-primary mt-2">₹{booking.total_price}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {booking.status === "request_approved" ? "Approved" : "Confirmed"}
                          </span>
                        </div>
                      </div>
                      
                      {booking.status === "request_approved" ? (
                        <Button onClick={() => handleGenerateOTPs(booking.id)} className="w-full">
                          <Key className="w-4 h-4 mr-2" />
                          Generate OTPs
                        </Button>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Key className="w-4 h-4" />
                              Pickup OTP
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 px-3 py-2 bg-muted rounded text-lg font-mono font-bold">
                                {booking.pickup_otp}
                              </code>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(booking.pickup_otp, "Pickup OTP")}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Key className="w-4 h-4" />
                              Return OTP
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 px-3 py-2 bg-muted rounded text-lg font-mono font-bold">
                                {booking.return_otp}
                              </code>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(booking.return_otp, "Return OTP")}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No confirmed bookings</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active">
            {activeBookings.length > 0 ? (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <Card key={booking.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg mb-2">{booking.camera_name}</h3>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-muted-foreground">Renter:</span> {booking.renter_name}</p>
                          <p><span className="text-muted-foreground">Return Date:</span> {new Date(booking.return_date).toLocaleDateString()}</p>
                          <p className="text-lg font-bold text-primary mt-2">${booking.total_price}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Active Rental
                        </span>
                        {booking.pickup_verified_at && (
                          <p className="text-xs text-muted-foreground">
                            Picked up: {new Date(booking.pickup_verified_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No active rentals</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedBookings.length > 0 ? (
              <div className="space-y-4">
                {completedBookings.map((booking) => (
                  <Card key={booking.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg mb-2">{booking.camera_name}</h3>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-muted-foreground">Renter:</span> {booking.renter_name}</p>
                          <p><span className="text-muted-foreground">Completed:</span> {new Date(booking.return_verified_at).toLocaleDateString()}</p>
                          <p className="text-lg font-bold text-primary mt-2">${booking.total_price}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No completed bookings</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
