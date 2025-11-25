import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => navigate("/demo-auth")}>Switch Role</Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl mb-4">Admin Dashboard - Coming Soon</h2>
        <p>Manage users, bookings, and platform settings.</p>
      </main>
    </div>
  )
}
