"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface PriceSummaryProps {
  pricePerDay: number
  selectedDates: { from: Date | undefined; to: Date | undefined }
  cameraId: string
  cameraName: string
}

export default function PriceSummary({ pricePerDay, selectedDates, cameraId, cameraName }: PriceSummaryProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isBooking, setIsBooking] = useState(false)

  const calculatePrice = () => {
    if (!selectedDates.from || !selectedDates.to) return null

    const days = Math.ceil((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24))

    const subtotal = days * pricePerDay
    const platformFee = subtotal * 0.1
    const tax = (subtotal + platformFee) * 0.05

    return {
      days,
      subtotal,
      platformFee,
      tax,
      total: subtotal + platformFee + tax,
    }
  }

  const pricing = calculatePrice()

  const handleBooking = async () => {
    if (!selectedDates.from || !selectedDates.to) {
      toast({
        title: "Error",
        description: "Please select dates first",
        variant: "destructive",
      })
      return
    }

    let userId = null
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          userId = user.id
        } catch (e) {
          console.log("[v0] Failed to parse user from localStorage")
        }
      }
    }

    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to book",
        variant: "destructive",
      })
      return
    }

    setIsBooking(true)

    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cameraId,
          pickupDate: selectedDates.from.toISOString().split("T")[0],
          returnDate: selectedDates.to.toISOString().split("T")[0],
          totalPrice: pricing ? pricing.total : 0,
          platformFee: pricing ? pricing.platformFee : 0,
          tax: pricing ? pricing.tax : 0,
          userId, // Include userId in request body
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.log("[v0] Booking failed:", data.error)
        toast({
          title: "Error",
          description: data.error || "Booking failed",
          variant: "destructive",
        })
        return
      }

      console.log("[v0] Booking created successfully:", data.booking_id)
      toast({
        title: "Success!",
        description: "Rental request sent successfully",
        variant: "default",
      })
      router.push("/renter/bookings")
    } catch (error) {
      console.log("[v0] Booking error:", error)
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive",
      })
    } finally {
      setIsBooking(false)
    }
  }

  if (!selectedDates.from || !selectedDates.to) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-2">Select dates to see pricing</p>
          <p className="text-sm text-muted-foreground">₹{pricePerDay} per day</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-bold text-lg">Price Summary</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            ₹{pricePerDay} x {pricing ? pricing.days : 0} days
          </span>
          <span className="font-semibold">₹{pricing ? pricing.subtotal.toFixed(2) : '0.00'}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Platform fee (10%)</span>
          <span className="font-semibold">₹{pricing ? pricing.platformFee.toFixed(2) : '0.00'}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (5%)</span>
          <span className="font-semibold">₹{pricing ? pricing.tax.toFixed(2) : '0.00'}</span>
        </div>

        <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
          <span>Total</span>
          <span className="text-2xl font-bold text-primary">₹{pricing ? pricing.total.toFixed(2) : '0.00'}</span>
        </div>
      </div>

      <Button onClick={handleBooking} disabled={isBooking} className="w-full" size="lg">
        {isBooking ? "Sending Request..." : "Send Rental Request"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">The lender will review and approve your request</p>
    </Card>
  )
}
