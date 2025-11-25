-- Seed cameras with placeholder images
-- Note: Get the lender user ID first

DO $$
DECLARE
  lender_user_id UUID;
BEGIN
  -- Get the lender user ID
  SELECT id INTO lender_user_id FROM users WHERE email = 'lender@rencam.com' LIMIT 1;

  -- Insert 4 sample cameras with placeholder images
  
  -- Camera 1: Canon EOS R5
  INSERT INTO cameras (
    lender_id, 
    name, 
    description, 
    category, 
    price_per_day, 
    image_url,
    specs,
    available_from,
    available_to
  ) VALUES (
    lender_user_id,
    'Canon EOS R5',
    'Professional full-frame mirrorless camera with 45MP sensor, 8K video recording, and advanced autofocus system. Perfect for professional photography and videography.',
    'Mirrorless',
    3500.00,
    'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&h=800&fit=crop&q=80',
    '{"sensor": "45MP Full-Frame", "video": "8K RAW", "iso": "100-51200", "fps": "20fps", "weight": "738g"}',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '365 days'
  );

  -- Camera 2: Sony A7 IV
  INSERT INTO cameras (
    lender_id, 
    name, 
    description, 
    category, 
    price_per_day, 
    image_url,
    specs,
    available_from,
    available_to
  ) VALUES (
    lender_user_id,
    'Sony A7 IV',
    'Versatile hybrid camera with 33MP sensor, exceptional autofocus, and 4K 60p video. Ideal for both stills and video content creation.',
    'Mirrorless',
    3000.00,
    'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=800&h=800&fit=crop&q=80',
    '{"sensor": "33MP Full-Frame", "video": "4K 60p", "iso": "100-51200", "fps": "10fps", "weight": "658g"}',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '365 days'
  );

  -- Camera 3: Nikon Z9
  INSERT INTO cameras (
    lender_id, 
    name, 
    description, 
    category, 
    price_per_day, 
    image_url,
    specs,
    available_from,
    available_to
  ) VALUES (
    lender_user_id,
    'Nikon Z9',
    'Flagship professional mirrorless camera with 45.7MP stacked sensor, 8K video, and blackout-free shooting. Built for demanding professionals.',
    'Mirrorless',
    4500.00,
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&h=800&fit=crop&q=80',
    '{"sensor": "45.7MP Stacked CMOS", "video": "8K 30p", "iso": "64-25600", "fps": "20fps", "weight": "1340g"}',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '365 days'
  );

  -- Camera 4: Fujifilm X-T5
  INSERT INTO cameras (
    lender_id, 
    name, 
    description, 
    category, 
    price_per_day, 
    image_url,
    specs,
    available_from,
    available_to
  ) VALUES (
    lender_user_id,
    'Fujifilm X-T5',
    'Compact APS-C mirrorless camera with 40MP sensor, classic design, and renowned Fujifilm color science. Perfect for travel and street photography.',
    'Mirrorless',
    2500.00,
    'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800&h=800&fit=crop&q=80',
    '{"sensor": "40MP APS-C", "video": "6.2K 30p", "iso": "125-12800", "fps": "15fps", "weight": "557g"}',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '365 days'
  );

  -- Camera 5: Canon EOS 5D Mark IV
  INSERT INTO cameras (
    lender_id, 
    name, 
    description, 
    category, 
    price_per_day, 
    image_url,
    specs,
    available_from,
    available_to
  ) VALUES (
    lender_user_id,
    'Canon EOS 5D Mark IV',
    'Professional DSLR with 30.4MP full-frame sensor, 4K video, and dual pixel autofocus. Excellent for portrait, wedding, and event photography.',
    'DSLR',
    3200.00,
    'https://images.unsplash.com/photo-1551194201-5b634bd23931?w=800&h=800&fit=crop&q=80',
    '{"sensor": "30.4MP Full-Frame", "video": "4K 30p", "iso": "100-32000", "fps": "7fps", "weight": "890g"}',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '365 days'
  );

  -- Camera 6: GoPro Hero 11 Black
  INSERT INTO cameras (
    lender_id, 
    name, 
    description, 
    category, 
    price_per_day, 
    image_url,
    specs,
    available_from,
    available_to
  ) VALUES (
    lender_user_id,
    'GoPro Hero 11 Black',
    'Compact action camera with 5.3K video, HyperSmooth stabilization, and waterproof design. Perfect for adventure sports and underwater photography.',
    'Action Camera',
    1200.00,
    'https://images.unsplash.com/photo-1525385444278-b7968e7e28dc?w=800&h=800&fit=crop&q=80',
    '{"sensor": "27MP", "video": "5.3K 60p", "iso": "100-6400", "fps": "120fps", "weight": "154g"}',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '365 days'
  );

  -- Camera 7: DJI Pocket 2
  INSERT INTO cameras (
    lender_id, 
    name, 
    description, 
    category, 
    price_per_day, 
    image_url,
    specs,
    available_from,
    available_to
  ) VALUES (
    lender_user_id,
    'DJI Pocket 2',
    'Compact gimbal camera with 4K video, 3-axis stabilization, and intelligent tracking features. Great for vlogging and travel videography.',
    'Gimbal Camera',
    1000.00,
    'https://images.unsplash.com/photo-1595068655810-995b2f7c7de3?w=800&h=800&fit=crop&q=80',
    '{"sensor": "64MP", "video": "4K 60p", "iso": "100-6400", "fps": "60fps", "weight": "117g"}',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '365 days'
  );

  -- Camera 8: Leica Q2
  INSERT INTO cameras (
    lender_id, 
    name, 
    description, 
    category, 
    price_per_day, 
    image_url,
    specs,
    available_from,
    available_to
  ) VALUES (
    lender_user_id,
    'Leica Q2',
    'Premium compact camera with 47.3MP full-frame sensor, fixed 28mm f/1.7 lens, and iconic Leica design. Exceptional for street and documentary photography.',
    'Compact',
    5000.00,
    'https://images.unsplash.com/photo-1606986628470-26a67fa4730c?w=800&h=800&fit=crop&q=80',
    '{"sensor": "47.3MP Full-Frame", "video": "4K 30p", "iso": "50-50000", "fps": "10fps", "weight": "734g"}',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '365 days'
  );

  RAISE NOTICE 'Successfully inserted 8 cameras for lender: %', lender_user_id;
END $$;

-- Display created cameras
SELECT 
  c.name,
  c.category,
  c.price_per_day,
  c.image_url,
  u.name as lender_name
FROM cameras c
JOIN users u ON c.lender_id = u.id
ORDER BY c.created_at DESC;
