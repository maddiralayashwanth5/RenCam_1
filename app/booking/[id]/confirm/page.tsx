"use client"

import { useState, use } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, AlertCircle } from "lucide-react"

export default function BookingConfirmPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const booking = {
    id: resolvedParams.id,
    camera_name: "Canon EOS R5",
    price_per_day: 85,
    pickup_date: "2025-01-20",
    return_date: "2025-01-25",
    total_price: 527.5,
    lender_name: "John Photographer",
  }

  const handleSubmitRequest = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/bookings/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cameraId: resolvedParams.id,
          pickupDate: booking.pickup_date,
          returnDate: booking.return_date,
          totalPrice: booking.total_price,
        }),
      })

      if (!response.ok) throw new Error("Request submission failed")

      router.push("/renter/bookings")
    } catch (error) {
      alert("Failed to submit rental request")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Review Rental Request</h1>
          <p className="text-muted-foreground">Submit your request and wait for lender approval</p>
        </div>

        <div className="space-y-6">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-amber-500" />
              <h2 className="text-2xl font-bold">Rental Details</h2>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Camera</p>
                  <p className="font-bold">{booking.camera_name}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Lender</p>
                  <p className="font-bold">{booking.lender_name}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Pickup Date</p>
                  <p className="font-bold">{booking.pickup_date}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Return Date</p>
                  <p className="font-bold">{booking.return_date}</p>
                </div>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Price</p>
                <p className="text-3xl font-bold text-primary">₹{booking.total_price}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-amber-900 dark:text-amber-200 mb-2">Awaiting Lender Approval</p>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Your rental request has been sent to the lender. They will review and accept or decline your request.
                  You'll be notified once they respond.
                </p>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button onClick={() => router.push("/renter/bookings")} variant="outline" className="flex-1">
              View My Requests
            </Button>
            <Button onClick={handleSubmitRequest} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Rental Request"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
