-- Comprehensive demo data for presentation
-- Run after 01-create-tables.sql and create-test-users.sql

DO $$
DECLARE
  admin_id UUID;
  lender_id UUID;
  renter_id UUID;
  camera1_id UUID;
  camera2_id UUID;
  camera3_id UUID;
  camera4_id UUID;
  booking1_id UUID;
  booking2_id UUID;
  booking3_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO admin_id FROM users WHERE email = 'admin@rencam.com';
  SELECT id INTO lender_id FROM users WHERE email = 'lender@rencam.com';
  SELECT id INTO renter_id FROM users WHERE email = 'renter@rencam.com';

  -- Insert 4 cameras for lender
  INSERT INTO cameras (
    lender_id, name, description, category, price_per_day, image_url, specs,
    available_from, available_to
  ) VALUES (
    lender_id,
    'Canon EOS R5',
    'Professional full-frame mirrorless camera with 45MP sensor, 8K video recording, and advanced autofocus system. Perfect for professional photography and videography.',
    'Mirrorless',
    3500.00,
    'https://images.unsplash.com/photo-1606980707986-e660f1e91e8f?w=800&h=800&fit=crop',
    '{"sensor": "45MP Full-Frame", "video": "8K RAW", "iso": "100-51200", "fps": "20fps", "weight": "738g"}',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '365 days'
  ) RETURNING id INTO camera1_id;

  INSERT INTO cameras (
    lender_id, name, description, category, price_per_day, image_url, specs,
    available_from, available_to
  ) VALUES (
    lender_id,
    'Sony A7 IV',
    'Versatile hybrid camera with 33MP sensor, exceptional autofocus, and 4K 60p video. Ideal for both stills and video content creation.',
    'Mirrorless',
    3000.00,
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop',
    '{"sensor": "33MP Full-Frame", "video": "4K 60p", "iso": "100-51200", "fps": "10fps", "weight": "658g"}',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '365 days'
  ) RETURNING id INTO camera2_id;

  INSERT INTO cameras (
    lender_id, name, description, category, price_per_day, image_url, specs,
    available_from, available_to
  ) VALUES (
    lender_id,
    'Nikon Z9',
    'Flagship professional mirrorless camera with 45.7MP stacked sensor, 8K video, and blackout-free shooting. Built for demanding professionals.',
    'Mirrorless',
    4500.00,
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop',
    '{"sensor": "45.7MP Stacked CMOS", "video": "8K 30p", "iso": "64-25600", "fps": "20fps", "weight": "1340g"}',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '365 days'
  ) RETURNING id INTO camera3_id;

  INSERT INTO cameras (
    lender_id, name, description, category, price_per_day, image_url, specs,
    available_from, available_to
  ) VALUES (
    lender_id,
    'Fujifilm X-T5',
    'Compact APS-C mirrorless camera with 40MP sensor, classic design, and renowned Fujifilm color science. Perfect for travel and street photography.',
    'Mirrorless',
    2500.00,
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop',
    '{"sensor": "40MP APS-C", "video": "6.2K 30p", "iso": "125-12800", "fps": "15fps", "weight": "557g"}',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '365 days'
  ) RETURNING id INTO camera4_id;

  -- Create sample bookings in different states

  -- Booking 1: Pending request (for lender to see)
  INSERT INTO bookings (
    camera_id, renter_id, lender_id,
    pickup_date, return_date,
    status, total_price, platform_fee, tax
  ) VALUES (
    camera1_id, renter_id, lender_id,
    CURRENT_DATE + INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '8 days',
    'request_pending',
    10500.00, 1050.00, 525.00
  ) RETURNING id INTO booking1_id;

  -- Booking 2: Confirmed with OTPs (ready for pickup)
  INSERT INTO bookings (
    camera_id, renter_id, lender_id,
    pickup_date, return_date,
    status, pickup_otp, return_otp,
    total_price, platform_fee, tax
  ) VALUES (
    camera2_id, renter_id, lender_id,
    CURRENT_DATE + INTERVAL '2 days',
    CURRENT_DATE + INTERVAL '5 days',
    'confirmed',
    '123456', '789012',
    9000.00, 900.00, 450.00
  ) RETURNING id INTO booking2_id;

  -- Booking 3: Active rental (pickup verified)
  INSERT INTO bookings (
    camera_id, renter_id, lender_id,
    pickup_date, return_date,
    status, pickup_otp, return_otp,
    pickup_verified_at,
    total_price, platform_fee, tax
  ) VALUES (
    camera3_id, renter_id, lender_id,
    CURRENT_DATE - INTERVAL '2 days',
    CURRENT_DATE + INTERVAL '3 days',
    'pickup_verified',
    '345678', '901234',
    CURRENT_DATE - INTERVAL '2 days',
    13500.00, 1350.00, 675.00
  ) RETURNING id INTO booking3_id;

  -- Booking 4: Completed rental
  INSERT INTO bookings (
    camera_id, renter_id, lender_id,
    pickup_date, return_date,
    status, pickup_otp, return_otp,
    pickup_verified_at, return_verified_at,
    total_price, platform_fee, tax
  ) VALUES (
    camera4_id, renter_id, lender_id,
    CURRENT_DATE - INTERVAL '10 days',
    CURRENT_DATE - INTERVAL '5 days',
    'completed',
    '567890', '123450',
    CURRENT_DATE - INTERVAL '10 days',
    CURRENT_DATE - INTERVAL '5 days',
    7500.00, 750.00, 375.00
  );

  -- Add wallet balance for users
  UPDATE users SET wallet_balance = 50000.00 WHERE id = renter_id;
  UPDATE users SET wallet_balance = 25000.00 WHERE id = lender_id;

  RAISE NOTICE 'Demo data seeded successfully!';
  RAISE NOTICE 'Cameras: 4 | Bookings: 4 (various states)';
  RAISE NOTICE 'Test OTPs - Booking 2: Pickup=123456, Return=789012';
  RAISE NOTICE 'Test OTPs - Booking 3: Pickup=345678, Return=901234';
END $$;

-- Display summary
SELECT 
  'Cameras' as type,
  COUNT(*)::text as count,
  string_agg(name, ', ') as items
FROM cameras
WHERE deleted_at IS NULL
UNION ALL
SELECT 
  'Bookings' as type,
  COUNT(*)::text as count,
  string_agg(status::text, ', ') as items
FROM bookings
WHERE deleted_at IS NULL
UNION ALL
SELECT 
  'Users' as type,
  COUNT(*)::text as count,
  string_agg(role::text || ': ' || name, ', ') as items
FROM users
WHERE deleted_at IS NULL;
