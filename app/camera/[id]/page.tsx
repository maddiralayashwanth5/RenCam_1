"use client"

import { useState, use } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Star, Shield } from "lucide-react"
import BookingCalendar from "@/components/booking-calendar"
import PriceSummary from "@/components/price-summary"

export default function CameraDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const resolvedParams = use(params)
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({ from: undefined, to: undefined })

  const camera = {
    id: resolvedParams.id,
    name: "Canon EOS R5",
    description: "Professional mirrorless camera perfect for photography and videography",
    category: "Mirrorless",
    price_per_day: 85,
    image_url: "/placeholder.svg?key=3h44l",
    rating: 4.8,
    reviews: 24,
    lender_name: "John Photographer",
    lender_rating: 4.9,
    specs: {
      sensor: "Full Frame",
      resolution: "45.0 MP",
      iso_range: "100-51200",
      autofocus: "Dual Pixel AF",
    },
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-6 bg-muted">
              <img
                src={camera.image_url || "/placeholder.svg"}
                alt={camera.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{camera.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{camera.description}</p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span className="font-semibold">{camera.rating}</span>
                    <span className="text-muted-foreground">({camera.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Verified Lender</span>
                  </div>
                </div>
              </div>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Camera Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(camera.specs).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-muted-foreground capitalize">{key.replace("_", " ")}</p>
                      <p className="font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">About the Lender</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">📷</span>
                  </div>
                  <div>
                    <p className="font-bold">{camera.lender_name}</p>
                    <p className="text-sm text-muted-foreground">Rating: {camera.lender_rating} ⭐</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Professional photographer with 5+ years experience
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-6 overflow-y-auto">
              <BookingCalendar
                cameraId={resolvedParams.id}
                pricePerDay={camera.price_per_day}
                selectedDates={selectedDates}
                onDatesChange={setSelectedDates}
              />

              <PriceSummary
                pricePerDay={camera.price_per_day}
                selectedDates={selectedDates}
                cameraId={resolvedParams.id}
                cameraName={camera.name}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
