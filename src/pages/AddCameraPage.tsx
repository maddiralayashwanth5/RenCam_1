import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function AddCameraPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Add Camera</h1>
          <Button onClick={() => navigate("/lender/dashboard")}>Back to Dashboard</Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl mb-4">Add New Camera</h2>
        <p>Add a new camera to your rental inventory.</p>
      </main>
    </div>
  )
}
