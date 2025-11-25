import { useParams, useNavigate } from "react-router-dom"
import { mockCameras } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function CameraDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const camera = mockCameras.find(c => c.id === id)

  if (!camera) {
    return <div>Camera not found</div>
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
          <Button onClick={() => navigate("/browse")}>
            Back to Browse
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={camera.image_url}
              alt={camera.name}
              className="w-full aspect-square object-cover rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{camera.name}</h1>
            <p className="text-muted-foreground mb-4">{camera.category}</p>
            <p className="text-2xl font-bold mb-6">₹{camera.price_per_day}/day</p>
            <p className="mb-6">{camera.description}</p>
            
            <Card className="p-4 mb-6">
              <h3 className="font-semibold mb-2">Specifications</h3>
              <div className="space-y-1 text-sm">
                {Object.entries(camera.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Button className="w-full" size="lg">
              Book Now
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
