-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'lender', 'renter');
CREATE TYPE booking_status AS ENUM ('request_pending', 'request_approved', 'confirmed', 'pickup_verified', 'in_transit', 'completed', 'cancelled', 'rejected');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'renter',
  avatar_url TEXT,
  wallet_balance DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Cameras table
CREATE TABLE cameras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  specs JSONB,
  available_from DATE,
  available_to DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camera_id UUID NOT NULL REFERENCES cameras(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  status booking_status DEFAULT 'pending',
  total_price DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  pickup_otp TEXT,
  return_otp TEXT,
  pickup_verified_at TIMESTAMP,
  return_verified_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- OTP Verifications table
CREATE TABLE otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  otp_code TEXT NOT NULL,
  type TEXT NOT NULL, -- 'pickup' or 'return'
  verified_by UUID NOT NULL REFERENCES users(id),
  verified_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL, -- 'deposit', 'withdrawal', 'booking_charge', 'refund'
  description TEXT,
  status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'failed'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Search index on cameras
CREATE INDEX idx_cameras_lender_id ON cameras(lender_id);
CREATE INDEX idx_cameras_category ON cameras(category);
CREATE INDEX idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX idx_bookings_lender_id ON bookings(lender_id);
CREATE INDEX idx_bookings_camera_id ON bookings(camera_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
