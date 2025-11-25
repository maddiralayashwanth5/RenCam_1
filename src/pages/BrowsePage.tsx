import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { mockCameras } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function BrowsePage() {
  const navigate = useNavigate()
  const [cameras, setCameras] = useState(mockCameras)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (searchTerm) {
      const filtered = mockCameras.filter(camera =>
        camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camera.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setCameras(filtered)
    } else {
      setCameras(mockCameras)
    }
  }, [searchTerm])

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
          <Button onClick={() => navigate("/demo-auth")}>
            Switch Role
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Browse Cameras</h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cameras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cameras.map((camera) => (
            <Card key={camera.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-100">
                <img
                  src={camera.image_url}
                  alt={camera.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{camera.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{camera.category}</p>
                <p className="text-lg font-bold mb-3">₹{camera.price_per_day}/day</p>
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/camera/${camera.id}`)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
