"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import CameraGrid from "@/components/camera-grid"
import SearchFilters from "@/components/search-filters"

interface Camera {
  id: string
  name: string
  category: string
  price_per_day: number
  rating?: number
  reviews?: number
  image_url?: string
}

export default function BrowsePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [cameras, setCameras] = useState<Camera[]>([])
  const [filteredCameras, setFilteredCameras] = useState<Camera[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/auth/login")
    }
  }, [mounted, loading, user, router])

  useEffect(() => {
    if (mounted) {
      const loadCameras = async () => {
        try {
          setIsLoading(true)
          const response = await fetch("/cameras.json")
          const data = await response.json()
          setCameras(data)
          setFilteredCameras(data)
        } catch (error) {
          console.error("Failed to load cameras:", error)
        } finally {
          setIsLoading(false)
        }
      }
      loadCameras()
    }
  }, [mounted])

  useEffect(() => {
    let filtered = cameras

    if (searchQuery) {
      filtered = filtered.filter(
        (cam) =>
          cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cam.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (category !== "all") {
      filtered = filtered.filter((cam) => cam.category === category)
    }

    filtered = filtered.filter((cam) => cam.price_per_day >= priceRange[0] && cam.price_per_day <= priceRange[1])

    setFilteredCameras(filtered)
  }, [searchQuery, category, priceRange, cameras])

  if (!mounted || loading || !user) {
    return <div />
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Browse Cameras</h1>
          <p className="text-muted-foreground">Find the perfect equipment for your next project</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            category={category}
            onCategoryChange={setCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
          />

          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="col-span-3 flex items-center justify-center min-h-96">
                <p className="text-muted-foreground">Loading cameras...</p>
              </div>
            ) : (
              <CameraGrid cameras={filteredCameras} />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
