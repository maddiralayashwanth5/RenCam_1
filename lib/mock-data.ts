// Mock data for database-free version
export const mockUsers = [
  {
    id: "admin-1",
    email: "admin@rencam.com",
    name: "Admin User",
    role: "admin" as const,
    wallet_balance: 10000,
  },
  {
    id: "lender-1", 
    email: "lender@rencam.com",
    name: "Camera Lender",
    role: "lender" as const,
    wallet_balance: 5000,
  },
  {
    id: "renter-1",
    email: "renter@rencam.com", 
    name: "Camera Renter",
    role: "renter" as const,
    wallet_balance: 2000,
  },
]

export const mockCameras = [
  {
    id: "cam-1",
    lender_id: "lender-1",
    name: "Canon EOS R5",
    description: "Professional full-frame mirrorless camera with 45MP sensor, 8K video recording, and advanced autofocus system. Perfect for professional photography and videography.",
    category: "Mirrorless",
    price_per_day: 2500,
    image_url: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&h=800&fit=crop&q=80",
    specs: {
      sensor: "45MP Full-Frame",
      video: "8K 30p", 
      iso: "100-51200",
      fps: "20fps",
      weight: "738g"
    },
    available_from: "2024-01-01",
    available_to: "2025-12-31",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "cam-2",
    lender_id: "lender-1",
    name: "Sony A7 IV",
    description: "Versatile full-frame camera perfect for both photography and videography with excellent low-light performance.",
    category: "Mirrorless", 
    price_per_day: 2200,
    image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop&q=80",
    specs: {
      sensor: "33MP Full-Frame",
      video: "4K 60p",
      iso: "100-51200", 
      fps: "10fps",
      weight: "658g"
    },
    available_from: "2024-01-01",
    available_to: "2025-12-31",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "cam-3",
    lender_id: "lender-1", 
    name: "Fujifilm X-T5",
    description: "High-resolution APS-C mirrorless camera with film simulation modes and excellent build quality.",
    category: "Mirrorless",
    price_per_day: 1800,
    image_url: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=800&fit=crop&q=80",
    specs: {
      sensor: "40MP APS-C",
      video: "4K 60p",
      iso: "125-51200",
      fps: "15fps", 
      weight: "557g"
    },
    available_from: "2024-01-01",
    available_to: "2025-12-31",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "cam-4",
    lender_id: "lender-1",
    name: "Nikon Z9",
    description: "Professional flagship mirrorless camera with incredible speed and video capabilities.",
    category: "Mirrorless",
    price_per_day: 3000,
    image_url: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&h=800&fit=crop&q=80", 
    specs: {
      sensor: "45.7MP Full-Frame",
      video: "8K 30p",
      iso: "64-25600",
      fps: "30fps",
      weight: "1340g"
    },
    available_from: "2024-01-01",
    available_to: "2025-12-31",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "cam-5",
    lender_id: "lender-1",
    name: "Canon EOS 5D Mark IV",
    description: "Professional DSLR with 30.4MP full-frame sensor, 4K video, and dual pixel autofocus.",
    category: "DSLR",
    price_per_day: 3200,
    image_url: "https://images.unsplash.com/photo-1551194201-5b634bd23931?w=800&h=800&fit=crop&q=80",
    specs: {
      sensor: "30.4MP Full-Frame",
      video: "4K 30p",
      iso: "100-32000", 
      fps: "7fps",
      weight: "890g"
    },
    available_from: "2024-01-01",
    available_to: "2025-12-31",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "cam-6",
    lender_id: "lender-1",
    name: "GoPro Hero 11 Black", 
    description: "Ultimate action camera with 5.3K video, waterproof design, and advanced stabilization.",
    category: "Action Camera",
    price_per_day: 1200,
    image_url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=800&fit=crop&q=80",
    specs: {
      sensor: "27MP",
      video: "5.3K 60p",
      iso: "100-6400",
      fps: "240fps",
      weight: "153g"
    },
    available_from: "2024-01-01", 
    available_to: "2025-12-31",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "cam-7",
    lender_id: "lender-1",
    name: "DJI Pocket 2",
    description: "Ultra-compact handheld camera with 3-axis gimbal stabilization for smooth footage.",
    category: "Gimbal Camera",
    price_per_day: 1000,
    image_url: "https://images.unsplash.com/photo-1473396413399-6717ef7c4093?w=800&h=800&fit=crop&q=80",
    specs: {
      sensor: "64MP",
      video: "4K 60p", 
      iso: "100-6400",
      fps: "240fps",
      weight: "117g"
    },
    available_from: "2024-01-01",
    available_to: "2025-12-31", 
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "cam-8",
    lender_id: "lender-1",
    name: "Leica Q2",
    description: "Premium compact camera with full-frame sensor and fixed 28mm Summilux lens.",
    category: "Compact",
    price_per_day: 5000,
    image_url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop&q=80",
    specs: {
      sensor: "47.3MP Full-Frame",
      video: "4K 30p",
      iso: "50-50000",
      fps: "10fps", 
      weight: "718g"
    },
    available_from: "2024-01-01",
    available_to: "2025-12-31",
    created_at: "2024-01-01T00:00:00Z"
  }
]

export const mockBookings = [
  {
    id: "booking-1",
    camera_id: "cam-1",
    renter_id: "renter-1",
    lender_id: "lender-1", 
    pickup_date: "2024-12-01",
    return_date: "2024-12-03",
    status: "request_pending" as const,
    total_price: 7500,
    platform_fee: 750,
    tax: 375,
    pickup_otp: "123456",
    return_otp: "654321",
    created_at: "2024-11-25T00:00:00Z"
  }
]

export const mockTransactions = [
  {
    id: "txn-1",
    user_id: "renter-1",
    booking_id: "booking-1",
    amount: 2000,
    type: "deposit",
    description: "Wallet deposit",
    status: "completed",
    created_at: "2024-11-20T00:00:00Z"
  }
]
