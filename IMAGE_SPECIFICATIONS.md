# Camera Image Specifications

## Recommended Image Sizes

### Camera Listing Images

#### Primary Display (Camera Grid)
- **Aspect Ratio**: 1:1 (Square)
- **Recommended Size**: 800x800 pixels
- **Minimum Size**: 600x600 pixels
- **Maximum Size**: 1200x1200 pixels
- **Format**: JPG, PNG, or WebP
- **File Size**: < 500KB (optimized)

#### Camera Detail Page
- **Aspect Ratio**: 1:1 (Square) or 4:3
- **Recommended Size**: 1200x1200 pixels
- **Minimum Size**: 800x800 pixels
- **Maximum Size**: 2000x2000 pixels
- **Format**: JPG, PNG, or WebP
- **File Size**: < 1MB (optimized)

#### Thumbnail (Booking Cards)
- **Aspect Ratio**: 1:1 (Square)
- **Recommended Size**: 400x400 pixels
- **Minimum Size**: 200x200 pixels
- **Format**: JPG, PNG, or WebP
- **File Size**: < 200KB

## Current Placeholder Images

### 4 Sample Cameras with Unsplash Images

1. **Canon EOS R5**
   - URL: `https://images.unsplash.com/photo-1606980707986-e660f1e91e8f?w=800&h=800&fit=crop`
   - Size: 800x800 (cropped)
   - Category: Mirrorless
   - Price: $125/day

2. **Sony A7 IV**
   - URL: `https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop`
   - Size: 800x800 (cropped)
   - Category: Mirrorless
   - Price: $110/day

3. **Nikon Z9**
   - URL: `https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop`
   - Size: 800x800 (cropped)
   - Category: Mirrorless
   - Price: $150/day

4. **Fujifilm X-T5**
   - URL: `https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop`
   - Size: 800x800 (cropped)
   - Category: Mirrorless
   - Price: $85/day

## Image Optimization Guidelines

### For Production Use

1. **Compression**
   - Use tools like TinyPNG, ImageOptim, or Squoosh
   - Target 70-85% quality for JPG
   - Use WebP format when possible (better compression)

2. **Responsive Images**
   - Provide multiple sizes for different screen resolutions
   - Use Next.js Image component for automatic optimization
   - Implement lazy loading for better performance

3. **CDN Delivery**
   - Host images on CDN (Cloudinary, Imgix, or Vercel)
   - Enable automatic format conversion
   - Use responsive image URLs with parameters

### Image URL Parameters (Unsplash)

The current placeholder URLs use Unsplash's image API with parameters:
- `w=800` - Width in pixels
- `h=800` - Height in pixels
- `fit=crop` - Crop to exact dimensions
- `q=80` - Quality (optional, default is good)

Example: `https://images.unsplash.com/photo-ID?w=800&h=800&fit=crop&q=80`

## Alternative Placeholder Services

### 1. Unsplash (Current)
- **Pros**: High-quality, free, real photos
- **Cons**: Requires internet, external dependency
- **URL Pattern**: `https://images.unsplash.com/photo-{id}?w={width}&h={height}&fit=crop`

### 2. Placeholder.com
- **Pros**: Simple, customizable, fast
- **Cons**: Generic, not real photos
- **URL Pattern**: `https://via.placeholder.com/800x800/CCCCCC/666666?text=Camera`

### 3. Lorem Picsum
- **Pros**: Random photos, simple API
- **Cons**: Less control over content
- **URL Pattern**: `https://picsum.photos/800/800`

### 4. Local Placeholders
- **Pros**: No external dependency, faster load
- **Cons**: Need to create/store images
- **Path**: `/public/cameras/camera-{id}.jpg`

## Database Storage

### Current Schema
```sql
CREATE TABLE cameras (
  ...
  image_url TEXT,  -- Stores full URL or path
  ...
);
```

### Recommended for Multiple Images
```sql
-- Add to cameras table
ALTER TABLE cameras ADD COLUMN images JSONB;

-- Example data
{
  "primary": "https://...",
  "gallery": [
    "https://image1.jpg",
    "https://image2.jpg",
    "https://image3.jpg"
  ],
  "thumbnail": "https://thumb.jpg"
}
```

## Upload Requirements (Future)

When implementing camera image uploads:

1. **File Size Limits**
   - Maximum: 5MB per image
   - Recommended: 2MB or less

2. **Allowed Formats**
   - JPG/JPEG
   - PNG
   - WebP
   - HEIC (convert to JPG)

3. **Validation**
   - Check file type
   - Verify image dimensions
   - Scan for malware
   - Compress automatically

4. **Storage**
   - Use cloud storage (AWS S3, Cloudinary, Vercel Blob)
   - Generate multiple sizes on upload
   - Create thumbnails automatically
   - Store CDN URLs in database

## CSS/Component Specifications

### Camera Grid Component
```tsx
<div className="relative aspect-square bg-muted">
  <Image
    src={camera.image_url || "/placeholder.svg"}
    alt={camera.name}
    fill
    className="object-cover"
  />
</div>
```
- Uses `aspect-square` for 1:1 ratio
- `object-cover` ensures image fills container
- `fill` prop makes image responsive

### Booking Card Component
```tsx
<img
  src={booking.camera_image}
  alt={booking.camera_name}
  className="w-24 h-24 object-cover rounded-lg"
/>
```
- Fixed size: 96x96 pixels (w-24 h-24)
- Rounded corners for visual appeal

## Performance Optimization

### Next.js Image Component
```tsx
import Image from 'next/image'

<Image
  src={camera.image_url}
  alt={camera.name}
  width={800}
  height={800}
  quality={85}
  priority={false} // Set true for above-fold images
  placeholder="blur"
  blurDataURL="data:image/..." // Optional blur placeholder
/>
```

### Benefits
- Automatic lazy loading
- Image optimization
- WebP conversion
- Responsive sizing
- Blur placeholder support

## Quick Reference

| Use Case | Size | Aspect Ratio | Format |
|----------|------|--------------|--------|
| Camera Grid | 800x800 | 1:1 | JPG/WebP |
| Detail Page | 1200x1200 | 1:1 | JPG/WebP |
| Booking Card | 400x400 | 1:1 | JPG/WebP |
| Thumbnail | 200x200 | 1:1 | JPG/WebP |
| Hero/Banner | 1920x1080 | 16:9 | JPG/WebP |
