"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, DollarSign, CheckCircle, Key, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Booking {
  id: string
  camera_name: string
  camera_image: string
  lender_name: string
  pickup_date: string
  return_date: string
  total_price: number
  status: string
  pickup_verified_at?: string
  return_verified_at?: string
}

export default function BookingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [activeBookings, setActiveBookings] = useState<Booking[]>([])
  const [pastBookings, setPastBookings] = useState<Booking[]>([])
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && (!user || user.role !== "renter")) {
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
      const response = await fetch("/api/renter/bookings")
      const data = await response.json()
      
      if (response.ok) {
        const allBookings = data.bookings || []
        setBookings(allBookings)
        
        // Categorize bookings
        setPendingBookings(allBookings.filter((b: Booking) => 
          b.status === "request_pending" || b.status === "request_approved" || b.status === "confirmed"
        ))
        setActiveBookings(allBookings.filter((b: Booking) => b.status === "pickup_verified"))
        setPastBookings(allBookings.filter((b: Booking) => b.status === "completed"))
        
        // Calculate total spent
        const spent = allBookings
          .filter((b: Booking) => b.status === "completed")
          .reduce((sum: number, b: Booking) => sum + parseFloat(b.total_price.toString()), 0)
        setTotalSpent(spent)
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      request_pending: { label: "Pending Approval", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      request_approved: { label: "Approved", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
      confirmed: { label: "Ready for Pickup", className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
      pickup_verified: { label: "Active Rental", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      completed: { label: "Completed", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
    }
    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-800" }
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  if (!mounted || loading || !user) {
    return <div />
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground mb-8">View and manage your camera rental bookings</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
                <p className="text-3xl font-bold">{bookings.length}</p>
              </div>
              <Calendar className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                <p className="text-3xl font-bold">₹{totalSpent.toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-3xl font-bold">{bookings.filter((b) => b.status === "completed").length}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="past">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingBookings.length > 0 ? (
              <div className="space-y-4">
                {pendingBookings.map((booking) => (
                  <Card key={booking.id} className="p-6">
                    <div className="flex gap-6">
                      {booking.camera_image && (
                        <img
                          src={booking.camera_image}
                          alt={booking.camera_name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg mb-1">{booking.camera_name}</h3>
                            <p className="text-sm text-muted-foreground">Lender: {booking.lender_name}</p>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-muted-foreground">Pickup Date</p>
                            <p className="font-medium">{new Date(booking.pickup_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Return Date</p>
                            <p className="font-medium">{new Date(booking.return_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold text-primary">₹{booking.total_price}</p>
                          <div className="flex gap-2">
                            {booking.status === "confirmed" && (
                              <Link href={`/booking/${booking.id}/pickup-otp`}>
                                <Button size="sm">
                                  <Key className="w-4 h-4 mr-2" />
                                  Enter Pickup OTP
                                </Button>
                              </Link>
                            )}
                            {booking.status === "pickup_verified" && (
                              <Link href={`/booking/${booking.id}/return-otp`}>
                                <Button size="sm" variant="outline">
                                  <Package className="w-4 h-4 mr-2" />
                                  Enter Return OTP
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No active bookings</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active">
            {activeBookings.length > 0 ? (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <Card key={booking.id} className="p-6">
                    <div className="flex gap-6">
                      {booking.camera_image && (
                        <img
                          src={booking.camera_image}
                          alt={booking.camera_name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg mb-1">{booking.camera_name}</h3>
                            <p className="text-sm text-muted-foreground">Lender: {booking.lender_name}</p>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-muted-foreground">Pickup Date</p>
                            <p className="font-medium">{new Date(booking.pickup_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Return Date</p>
                            <p className="font-medium">{new Date(booking.return_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold text-primary">₹{booking.total_price}</p>
                          <div className="flex gap-2">
                            {booking.status === "pickup_verified" && (
                              <Link href={`/booking/${booking.id}/return-otp`}>
                                <Button size="sm" variant="outline">
                                  <Package className="w-4 h-4 mr-2" />
                                  Enter Return OTP
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
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

          <TabsContent value="past">
            {pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <Card key={booking.id} className="p-6">
                    <div className="flex gap-6">
                      {booking.camera_image && (
                        <img
                          src={booking.camera_image}
                          alt={booking.camera_name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg mb-1">{booking.camera_name}</h3>
                            <p className="text-sm text-muted-foreground">Lender: {booking.lender_name}</p>
                          </div>
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-muted-foreground">Rental Period</p>
                            <p className="font-medium">
                              {new Date(booking.pickup_date).toLocaleDateString()} - {new Date(booking.return_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Completed</p>
                            <p className="font-medium">
                              {booking.return_verified_at && new Date(booking.return_verified_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-primary">₹{booking.total_price}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No past bookings</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rejected">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No cancelled bookings</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
