# 📸 New Camera Images Added

## Summary
- **8 high-quality camera images** from Unsplash
- **Diverse camera categories**: Mirrorless, DSLR, Action, Gimbal, Compact
- **Price range**: ₹1,000 - ₹5,000 per day
- **All images**: 800x800 pixels, square format, optimized quality

## How to Apply Changes

1. **Run the updated seed script**:
```bash
psql -U your_username -d rencam_db -f scripts/02-seed-cameras.sql
```

2. **Restart the app** (if needed):
```bash
npm run dev
```

## New Camera Images

### 1. Canon EOS R5
![Canon EOS R5](https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&h=800&fit=crop&q=80)
- **Category**: Mirrorless
- **Price**: ₹3,500/day

### 2. Sony A7 IV
![Sony A7 IV](https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=800&h=800&fit=crop&q=80)
- **Category**: Mirrorless
- **Price**: ₹3,000/day

### 3. Nikon Z9
![Nikon Z9](https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&h=800&fit=crop&q=80)
- **Category**: Mirrorless
- **Price**: ₹4,500/day

### 4. Fujifilm X-T5
![Fujifilm X-T5](https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800&h=800&fit=crop&q=80)
- **Category**: Mirrorless
- **Price**: ₹2,500/day

### 5. Canon EOS 5D Mark IV
![Canon EOS 5D Mark IV](https://images.unsplash.com/photo-1551194201-5b634bd23931?w=800&h=800&fit=crop&q=80)
- **Category**: DSLR
- **Price**: ₹3,200/day

### 6. GoPro Hero 11 Black
![GoPro Hero 11 Black](https://images.unsplash.com/photo-1525385444278-b7968e7e28dc?w=800&h=800&fit=crop&q=80)
- **Category**: Action Camera
- **Price**: ₹1,200/day

### 7. DJI Pocket 2
![DJI Pocket 2](https://images.unsplash.com/photo-1595068655810-995b2f7c7de3?w=800&h=800&fit=crop&q=80)
- **Category**: Gimbal Camera
- **Price**: ₹1,000/day

### 8. Leica Q2
![Leica Q2](https://images.unsplash.com/photo-1606986628470-26a67fa4730c?w=800&h=800&fit=crop&q=80)
- **Category**: Compact
- **Price**: ₹5,000/day

## Image Specifications

- **Resolution**: 800x800 pixels
- **Aspect Ratio**: 1:1 (Square)
- **Format**: JPG (via Unsplash CDN)
- **Quality**: 80% (q=80 parameter)
- **Crop**: Center crop (fit=crop parameter)

## Benefits

1. **Diverse Selection**: Multiple camera types for different needs
2. **Professional Images**: High-quality, realistic product photos
3. **Consistent Format**: All images are square with identical dimensions
4. **Price Range**: Options from budget to premium
5. **Optimized Loading**: Images served from Unsplash CDN for fast loading

## Files Updated

1. `/scripts/02-seed-cameras.sql` - Added 4 new cameras, updated all image URLs
2. `/CAMERA_PLACEHOLDERS_SUMMARY.md` - Updated documentation with new cameras
3. `/NEW_CAMERA_IMAGES.md` - This visual reference guide

---

**Note**: All images are from Unsplash and are free to use for this demo project. For a production app, you would want to use your own product photography.
