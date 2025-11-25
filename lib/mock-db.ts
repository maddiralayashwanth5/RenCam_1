// Mock database service - no real database needed
import { mockUsers, mockCameras, mockBookings, mockTransactions } from './mock-data'

// In-memory storage (resets on page refresh)
let users = [...mockUsers]
let cameras = [...mockCameras] 
let bookings = [...mockBookings]
let transactions = [...mockTransactions]

export async function queryOne<T>(query: string, params: any[] = []): Promise<T | null> {
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Simple query parsing for demo
  if (query.includes('SELECT') && query.includes('users')) {
    if (query.includes('email =')) {
      const email = params[0]
      const user = users.find(u => u.email === email)
      return user as T || null
    }
    if (query.includes('id =')) {
      const id = params[0]
      const user = users.find(u => u.id === id)
      return user as T || null
    }
  }
  
  if (query.includes('SELECT') && query.includes('cameras')) {
    if (query.includes('id =')) {
      const id = params[0]
      const camera = cameras.find(c => c.id === id)
      return camera as T || null
    }
  }
  
  if (query.includes('SELECT') && query.includes('bookings')) {
    if (query.includes('id =')) {
      const id = params[0]
      const booking = bookings.find(b => b.id === id)
      return booking as T || null
    }
  }
  
  if (query.includes('INSERT INTO bookings')) {
    // Create new booking
    const newBooking = {
      id: `booking-${Date.now()}`,
      camera_id: params[0],
      renter_id: params[1], 
      lender_id: params[2],
      pickup_date: params[3],
      return_date: params[4],
      status: 'request_pending' as const,
      total_price: params[5],
      platform_fee: params[6] || params[5] * 0.1,
      tax: params[7] || params[5] * 0.05,
      pickup_otp: '',
      return_otp: '',
      created_at: new Date().toISOString()
    }
    bookings.push(newBooking)
    return { id: newBooking.id } as T
  }
  
  return null
}

export async function query<T>(queryStr: string, params: any[] = []): Promise<T[]> {
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  if (queryStr.includes('SELECT') && queryStr.includes('cameras')) {
    return cameras as T[]
  }
  
  if (queryStr.includes('SELECT') && queryStr.includes('bookings')) {
    if (queryStr.includes('renter_id =')) {
      const renterId = params[0]
      const userBookings = bookings.filter(b => b.renter_id === renterId)
      return userBookings as T[]
    }
    if (queryStr.includes('lender_id =')) {
      const lenderId = params[0]
      const lenderBookings = bookings.filter(b => b.lender_id === lenderId)
      return lenderBookings as T[]
    }
    return bookings as T[]
  }
  
  if (queryStr.includes('SELECT') && queryStr.includes('transactions')) {
    if (queryStr.includes('user_id =')) {
      const userId = params[0]
      const userTransactions = transactions.filter(t => t.user_id === userId)
      return userTransactions as T[]
    }
    return transactions as T[]
  }
  
  if (queryStr.includes('SELECT') && queryStr.includes('users')) {
    return users as T[]
  }
  
  return []
}
