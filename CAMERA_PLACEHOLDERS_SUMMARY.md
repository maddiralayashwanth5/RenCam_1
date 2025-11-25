# Camera Image Placeholders - Quick Summary

## 📸 8 Sample Cameras Added

I've created a seed script (`scripts/02-seed-cameras.sql`) with 8 professional cameras and high-quality placeholder images from Unsplash.

### Camera Details

#### 1. Canon EOS R5 - ₹3,500/day
- **Image**: Professional mirrorless camera
- **URL**: `https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&h=800&fit=crop&q=80`
- **Size**: 800x800 pixels
- **Specs**: 45MP, 8K video, 20fps
- **Category**: Mirrorless

#### 2. Sony A7 IV - ₹3,000/day
- **Image**: Versatile hybrid camera
- **URL**: `https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=800&h=800&fit=crop&q=80`
- **Size**: 800x800 pixels
- **Specs**: 33MP, 4K 60p, 10fps
- **Category**: Mirrorless

#### 3. Nikon Z9 - ₹4,500/day
- **Image**: Flagship professional camera
- **URL**: `https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&h=800&fit=crop&q=80`
- **Size**: 800x800 pixels
- **Specs**: 45.7MP, 8K 30p, 20fps
- **Category**: Mirrorless

#### 4. Fujifilm X-T5 - ₹2,500/day
- **Image**: Compact travel camera
- **URL**: `https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800&h=800&fit=crop&q=80`
- **Size**: 800x800 pixels
- **Specs**: 40MP, 6.2K 30p, 15fps
- **Category**: Mirrorless

#### 5. Canon EOS 5D Mark IV - ₹3,200/day
- **Image**: Professional DSLR camera
- **URL**: `https://images.unsplash.com/photo-1551194201-5b634bd23931?w=800&h=800&fit=crop&q=80`
- **Size**: 800x800 pixels
- **Specs**: 30.4MP, 4K 30p, 7fps
- **Category**: DSLR

#### 6. GoPro Hero 11 Black - ₹1,200/day
- **Image**: Action camera
- **URL**: `https://images.unsplash.com/photo-1525385444278-b7968e7e28dc?w=800&h=800&fit=crop&q=80`
- **Size**: 800x800 pixels
- **Specs**: 27MP, 5.3K 60p, 120fps
- **Category**: Action Camera

#### 7. DJI Pocket 2 - ₹1,000/day
- **Image**: Gimbal camera
- **URL**: `https://images.unsplash.com/photo-1595068655810-995b2f7c7de3?w=800&h=800&fit=crop&q=80`
- **Size**: 800x800 pixels
- **Specs**: 64MP, 4K 60p, 60fps
- **Category**: Gimbal Camera

#### 8. Leica Q2 - ₹5,000/day
- **Image**: Premium compact camera
- **URL**: `https://images.unsplash.com/photo-1606986628470-26a67fa4730c?w=800&h=800&fit=crop&q=80`
- **Size**: 800x800 pixels
- **Specs**: 47.3MP, 4K 30p, 10fps
- **Category**: Compact

---

## 📐 Image Size Specifications

### Recommended Sizes

| Location | Dimensions | Aspect Ratio | Max File Size |
|----------|-----------|--------------|---------------|
| **Camera Grid** | 800x800px | 1:1 (Square) | 500KB |
| **Detail Page** | 1200x1200px | 1:1 (Square) | 1MB |
| **Booking Card** | 400x400px | 1:1 (Square) | 200KB |
| **Thumbnail** | 200x200px | 1:1 (Square) | 100KB |

### Current Implementation
- **Format**: JPG/WebP
- **Aspect Ratio**: 1:1 (Square)
- **Primary Size**: 800x800 pixels
- **Source**: Unsplash (high-quality stock photos)

---

## 🚀 How to Use

### 1. Run the Seed Script
```bash
psql -U your_username -d rencam_db -f scripts/02-seed-cameras.sql
```

### 2. Verify Cameras
The script will:
- Find the lender user (lender@rencam.com)
- Insert 4 cameras with images
- Display the created cameras

### 3. View in Application
- Login as renter: `renter@rencam.com` / `Renter123`
- Browse cameras at `/browse`
- See placeholder images in the camera grid

---

## 📝 Files Created

1. **`scripts/02-seed-cameras.sql`**
   - SQL seed script for 4 cameras
   - Includes image URLs, specs, and pricing
   - Automatically assigns to lender user

2. **`IMAGE_SPECIFICATIONS.md`**
   - Detailed image size guidelines
   - Optimization recommendations
   - Alternative placeholder services
   - Upload requirements for future

3. **`CAMERA_PLACEHOLDERS_SUMMARY.md`** (this file)
   - Quick reference guide
   - Camera details at a glance
   - Usage instructions

---

## 🎨 Image Sources

All placeholder images are from **Unsplash** (free, high-quality):
- Professional camera photography
- Consistent 1:1 aspect ratio
- Optimized with URL parameters
- No attribution required for testing

### URL Parameters Used
- `w=800` - Width
- `h=800` - Height  
- `fit=crop` - Crop to exact size

---

## 💡 Next Steps

### For Development
- Images load from Unsplash CDN
- No local storage needed
- Fast and reliable

### For Production
Consider:
- Upload feature for lenders
- Cloud storage (AWS S3, Cloudinary)
- Multiple image sizes
- Image compression
- CDN delivery

---

## ✅ Summary

**4 cameras added with:**
- ✅ High-quality placeholder images (800x800px)
- ✅ Realistic camera specs and pricing
- ✅ Professional descriptions
- ✅ 1:1 aspect ratio (square)
- ✅ Optimized for web display
- ✅ Ready to use immediately

**Image sizes documented:**
- ✅ Camera Grid: 800x800px
- ✅ Detail Page: 1200x1200px
- ✅ Booking Card: 400x400px
- ✅ Thumbnail: 200x200px
