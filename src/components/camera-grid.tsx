"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Camera {
  id: string
  name: string
  image_url?: string
  price_per_day: number
  category: string
  rating?: number
  reviews?: number
}

export default function CameraGrid({ cameras }: { cameras: Camera[] }) {
  if (cameras.length === 0) {
    return (
      <div className="col-span-3 flex items-center justify-center min-h-96 text-center">
        <div>
          <h3 className="text-xl font-bold mb-2">No cameras found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {cameras.map((camera) => (
        <Link key={camera.id} href={`/camera/${camera.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="relative aspect-square bg-muted">
              <Image
                src={camera.image_url || "/placeholder.svg?key=3h44l"}
                alt={camera.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{camera.name}</h3>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">{camera.category}</span>
                {camera.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{camera.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">₹{camera.price_per_day}</span>
                <span className="text-sm text-muted-foreground">/day</span>
              </div>

              <Button className="w-full mt-4">Book Now</Button>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
