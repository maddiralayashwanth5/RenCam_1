# RenCam Demo Presentation Guide

## 🎬 Quick Start

### 1. Setup Database
```bash
# Run all setup scripts in order
psql -U your_username -d rencam_db -f scripts/01-create-tables.sql
psql -U your_username -d rencam_db -f scripts/create-test-users.sql
psql -U your_username -d rencam_db -f scripts/03-seed-demo-data.sql
```

### 2. Start Application
```bash
npm run dev
```

### 3. Open Browser
Navigate to: `http://localhost:3001`

---

## 🎭 Demo Accounts

### 🔴 Admin Account
- **Email**: `admin@rencam.com`
- **Role**: Administrator
- **Access**: Full platform management
- **Dashboard**: `/admin/dashboard`

### 🟢 Lender Account  
- **Email**: `lender@rencam.com`
- **Role**: Camera Owner
- **Access**: List cameras, manage rentals
- **Dashboard**: `/lender/dashboard`
- **Wallet**: ₹25,000

### 🔵 Renter Account
- **Email**: `renter@rencam.com`
- **Role**: Customer
- **Access**: Browse cameras, make bookings
- **Dashboard**: `/browse`
- **Wallet**: ₹50,000

---

## 📊 Pre-loaded Demo Data

### Cameras (4 Total)
1. **Canon EOS R5** - ₹3,500/day
2. **Sony A7 IV** - ₹3,000/day
3. **Nikon Z9** - ₹4,500/day
4. **Fujifilm X-T5** - ₹2,500/day

### Bookings (4 Different States)
1. **Pending Request** - Waiting for lender approval
2. **Confirmed** - OTPs generated, ready for pickup
   - Pickup OTP: `123456`
   - Return OTP: `789012`
3. **Active Rental** - Currently rented out
   - Pickup OTP: `345678`
   - Return OTP: `901234`
4. **Completed** - Past rental

---

## 🎯 Presentation Flow

### Part 1: Introduction (2 min)
1. Open demo page (`/demo-auth`)
2. Show three role cards
3. Explain the platform concept

### Part 2: Renter Journey (5 min)
1. **Login as Renter**
   - Click "Renter" card
   - Auto-redirects to `/browse`

2. **Browse Cameras**
   - Show 4 cameras with images
   - Demonstrate price filter (₹0 - ₹10,000)
   - Show category filter

3. **View Camera Details**
   - Click on any camera
   - Show specifications
   - Show lender information
   - Select dates in calendar

4. **Make Booking**
   - Select pickup/return dates
   - Show price breakdown
   - Click "Proceed to Checkout"
   - Booking request created

5. **View Bookings**
   - Navigate to "My Bookings"
   - Show different booking states
   - Demonstrate OTP entry for confirmed booking

### Part 3: Lender Journey (5 min)
1. **Switch to Lender**
   - Click "Switch Role" button
   - Select "Lender" card

2. **Lender Dashboard**
   - Show stats (earnings, listings, bookings)
   - Navigate through tabs:
     - **Rental Requests**: Pending bookings
     - **Confirmed**: Bookings with OTPs
     - **Active**: Currently rented cameras
     - **Completed**: Past rentals

3. **Accept Booking Request**
   - Go to "Rental Requests" tab
   - Click "Accept" on pending request
   - Booking moves to "Confirmed" tab

4. **Generate OTPs**
   - Click "Generate OTPs" button
   - Show Pickup OTP and Return OTP
   - Demonstrate copy-to-clipboard

5. **View Active Rentals**
   - Show "Active" tab
   - Display currently rented cameras

### Part 4: OTP Verification Flow (3 min)
1. **Switch back to Renter**
   - Click "Switch Role"
   - Select "Renter"

2. **Pickup Verification**
   - Go to "My Bookings"
   - Find confirmed booking
   - Click "Enter Pickup OTP"
   - Enter: `123456`
   - Show success screen
   - Booking becomes "Active"

3. **Return Verification**
   - Find active rental
   - Click "Enter Return OTP"
   - Enter: `901234`
   - Show success screen
   - Booking becomes "Completed"

### Part 5: Admin View (2 min)
1. **Switch to Admin**
   - Click "Switch Role"
   - Select "Admin"

2. **Admin Dashboard** (if implemented)
   - Show platform overview
   - Display all users
   - Show all bookings
   - Platform statistics

---

## 🎨 Key Features to Highlight

### 1. Demo Authentication
- ✅ No passwords required
- ✅ Instant role switching
- ✅ Perfect for presentations
- ✅ Pre-populated data

### 2. OTP-Based Verification
- ✅ Secure pickup/return process
- ✅ 6-digit OTP codes
- ✅ Status-based validation
- ✅ Prevents fraud

### 3. Multi-Role System
- ✅ Admin, Lender, Renter roles
- ✅ Role-specific dashboards
- ✅ Different permissions
- ✅ Seamless switching

### 4. Real-time Updates
- ✅ Booking status changes
- ✅ OTP generation
- ✅ Dashboard statistics
- ✅ Wallet balances

### 5. Modern UI/UX
- ✅ Clean, professional design
- ✅ Responsive layout
- ✅ Dark mode support
- ✅ Smooth animations

---

## 📱 Demo Script

### Opening (30 seconds)
> "Welcome to RenCam - a camera rental platform that connects camera owners with renters. Let me show you how it works from different perspectives."

### Renter Demo (2 minutes)
> "As a renter, I can browse available cameras, filter by price and category, view detailed specifications, and make booking requests. The platform shows real-time availability and calculates pricing automatically including platform fees and taxes."

### Lender Demo (2 minutes)
> "As a lender, I receive booking requests which I can accept or reject. Once accepted, I generate secure OTP codes for pickup and return. The system tracks all my earnings and active rentals in one dashboard."

### OTP Flow (1 minute)
> "The unique OTP verification system ensures secure handovers. When the renter picks up the camera, both parties verify using the pickup OTP. The same process happens for returns, creating a complete audit trail."

### Closing (30 seconds)
> "The platform is built with Next.js, uses PostgreSQL for data, and implements JWT authentication. It's designed to be scalable, secure, and user-friendly for all stakeholders."

---

## 🔧 Technical Highlights

### Stack
- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Auth**: JWT with HTTP-only cookies

### Features
- Server-side rendering
- Type-safe API calls
- Responsive design
- Real-time data updates
- Secure authentication

---

## 🎯 Presentation Tips

### Do's ✅
- Start with demo auth page
- Show role switching capability
- Demonstrate OTP flow
- Highlight security features
- Show responsive design
- Mention scalability

### Don'ts ❌
- Don't show code during demo
- Don't get stuck on errors
- Don't skip role switching
- Don't forget to show OTPs
- Don't rush through features

---

## 🐛 Troubleshooting

### Issue: "User not found"
**Solution**: Run seed scripts again
```bash
psql -U your_username -d rencam_db -f scripts/create-test-users.sql
```

### Issue: "No cameras displayed"
**Solution**: Run camera seed script
```bash
psql -U your_username -d rencam_db -f scripts/03-seed-demo-data.sql
```

### Issue: "OTP verification failed"
**Solution**: Use test OTPs from demo data:
- Booking 2: Pickup=`123456`, Return=`789012`
- Booking 3: Pickup=`345678`, Return=`901234`

### Issue: "Cannot switch roles"
**Solution**: Click "Switch Role" button in navigation, then select new role

---

## 📊 Demo Data Summary

| Item | Count | Details |
|------|-------|---------|
| **Users** | 3 | Admin, Lender, Renter |
| **Cameras** | 4 | All mirrorless, ₹2,500-₹4,500/day |
| **Bookings** | 4 | Pending, Confirmed, Active, Completed |
| **OTP Codes** | 4 sets | Pre-generated for testing |

---

## 🚀 Quick Demo Checklist

- [ ] Database seeded with demo data
- [ ] Application running on localhost:3001
- [ ] Demo auth page loads correctly
- [ ] Can switch between all 3 roles
- [ ] Cameras display with images
- [ ] Bookings show in different states
- [ ] OTP verification works
- [ ] Navigation shows current role
- [ ] All dashboards accessible

---

## 📝 Notes for Presenter

- **Duration**: 15-20 minutes total
- **Audience**: Technical or non-technical
- **Focus**: User experience and workflow
- **Backup**: Have test OTPs written down
- **Practice**: Run through once before presenting

---

**Last Updated**: November 25, 2025
**Version**: Demo 1.0
**Status**: Ready for Presentation ✅
