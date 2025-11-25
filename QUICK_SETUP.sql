-- Quick setup for RenCam - Run this in Supabase SQL Editor

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
  status booking_status DEFAULT 'request_pending',
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

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert demo users
INSERT INTO users (email, password_hash, name, role, wallet_balance) VALUES
('admin@rencam.com', '$2b$10$dummy.hash.for.demo', 'Admin User', 'admin', 10000.00),
('lender@rencam.com', '$2b$10$dummy.hash.for.demo', 'Camera Lender', 'lender', 5000.00),
('renter@rencam.com', '$2b$10$dummy.hash.for.demo', 'Camera Renter', 'renter', 2000.00);

-- Insert demo cameras
INSERT INTO cameras (lender_id, name, description, category, price_per_day, image_url, specs, available_from, available_to)
SELECT 
  (SELECT id FROM users WHERE email = 'lender@rencam.com'),
  'Canon EOS R5',
  'Professional full-frame mirrorless camera with 45MP sensor and 8K video recording.',
  'Mirrorless',
  2500.00,
  'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&h=800&fit=crop&q=80',
  '{"sensor": "45MP Full-Frame", "video": "8K 30p", "iso": "100-51200", "fps": "20fps", "weight": "738g"}',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '365 days';

INSERT INTO cameras (lender_id, name, description, category, price_per_day, image_url, specs, available_from, available_to)
SELECT 
  (SELECT id FROM users WHERE email = 'lender@rencam.com'),
  'Sony A7 IV',
  'Versatile full-frame camera perfect for both photography and videography.',
  'Mirrorless',
  2200.00,
  'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop&q=80',
  '{"sensor": "33MP Full-Frame", "video": "4K 60p", "iso": "100-51200", "fps": "10fps", "weight": "658g"}',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '365 days';

-- Create indexes
CREATE INDEX idx_cameras_lender_id ON cameras(lender_id);
CREATE INDEX idx_cameras_category ON cameras(category);
CREATE INDEX idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX idx_bookings_lender_id ON bookings(lender_id);
