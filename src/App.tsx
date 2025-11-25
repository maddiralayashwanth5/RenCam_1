import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import LandingPage from './pages/LandingPage'
import DemoAuthPage from './pages/DemoAuthPage'
import BrowsePage from './pages/BrowsePage'
import CameraDetailPage from './pages/CameraDetailPage'
import AdminDashboard from './pages/AdminDashboard'
import LenderDashboard from './pages/LenderDashboard'
import RenterBookings from './pages/RenterBookings'
import RenterWallet from './pages/RenterWallet'
import AddCameraPage from './pages/AddCameraPage'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/demo-auth" element={<DemoAuthPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/camera/:id" element={<CameraDetailPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/lender/dashboard" element={<LenderDashboard />} />
          <Route path="/lender/add-camera" element={<AddCameraPage />} />
          <Route path="/renter/bookings" element={<RenterBookings />} />
          <Route path="/renter/wallet" element={<RenterWallet />} />
        </Routes>
        <Toaster />
      </div>
    </AuthProvider>
  )
}

export default App
