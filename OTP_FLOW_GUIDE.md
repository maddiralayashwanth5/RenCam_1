# OTP-Based Pickup and Drop Flow Guide

## Overview

The RenCam platform uses a secure OTP (One-Time Password) verification system for camera pickup and return. This ensures both lenders and renters verify the physical handover of equipment.

## Booking Status Flow

```
1. request_pending    → Renter creates booking, waiting for lender approval
2. request_approved   → Lender accepts the booking request
3. confirmed          → Lender generates OTPs (pickup & return)
4. pickup_verified    → Renter verifies pickup with OTP
5. completed          → Renter verifies return with OTP
```

Alternative flows:
- `rejected` → Lender rejects the booking request
- `cancelled` → Booking cancelled by either party

## Complete Flow

### Step 1: Renter Creates Booking
- Renter browses cameras and creates a booking
- Status: `request_pending`
- Renter sees "Pending Approval" in their bookings

### Step 2: Lender Reviews Request
- Lender sees pending request in their dashboard
- Lender can **Accept** or **Reject** the request
- If accepted, status changes to `request_approved`
- If rejected, status changes to `rejected`

### Step 3: Lender Generates OTPs
- After accepting, lender clicks "Generate OTPs" button
- System creates two 6-digit OTPs:
  - **Pickup OTP**: For camera handover to renter
  - **Return OTP**: For camera return from renter
- Status changes to `confirmed`
- Both OTPs are displayed to the lender and can be copied

### Step 4: Pickup Verification
**When it's time for pickup:**

1. **Lender shares Pickup OTP** with renter (in person or via message)
2. **Renter goes to their bookings** and clicks "Enter Pickup OTP"
3. **Renter enters the 6-digit OTP** provided by lender
4. **System verifies OTP** and updates status to `pickup_verified`
5. **Rental period begins** - camera is now with the renter

**API Endpoint:** `POST /api/bookings/[id]/verify-pickup`
- Validates OTP matches `pickup_otp` in database
- Ensures booking status is `confirmed`
- Updates status to `pickup_verified`
- Records `pickup_verified_at` timestamp

### Step 5: Return Verification
**When rental period ends:**

1. **Renter returns camera** to lender
2. **Lender inspects camera** and accessories
3. **Lender shares Return OTP** with renter
4. **Renter clicks "Enter Return OTP"** in their bookings
5. **Renter enters the 6-digit OTP** provided by lender
6. **System verifies OTP** and updates status to `completed`
7. **Transaction finalized** - rental is complete

**API Endpoint:** `POST /api/bookings/[id]/verify-return`
- Validates OTP matches `return_otp` in database
- Ensures booking status is `pickup_verified`
- Updates status to `completed`
- Records `return_verified_at` timestamp

## User Interfaces

### Lender Dashboard (`/lender/dashboard`)

**Tabs:**
1. **Rental Requests** - Shows `request_pending` bookings
   - Accept/Reject buttons
   
2. **Confirmed** - Shows `request_approved` and `confirmed` bookings
   - "Generate OTPs" button for approved bookings
   - Displays Pickup OTP and Return OTP with copy buttons
   
3. **Active** - Shows `pickup_verified` bookings
   - Camera is currently rented out
   - Shows pickup date
   
4. **Completed** - Shows `completed` bookings
   - Historical rentals
   - Shows completion date

### Renter Bookings (`/renter/bookings`)

**Tabs:**
1. **Active** - Shows pending and active bookings
   - `request_pending`: "Pending Approval" badge
   - `request_approved`: "Approved" badge
   - `confirmed`: "Ready for Pickup" badge + "Enter Pickup OTP" button
   - `pickup_verified`: "Active Rental" badge + "Enter Return OTP" button
   
2. **Past** - Shows `completed` bookings
   - Historical rentals with completion dates
   
3. **Cancelled** - Shows rejected/cancelled bookings

## OTP Entry Pages

### Pickup OTP Page (`/booking/[id]/pickup-otp`)
- 6-digit OTP input with auto-focus
- Validates OTP is exactly 6 digits
- Shows success screen on verification
- Redirects to bookings after 2 seconds

### Return OTP Page (`/booking/[id]/return-otp`)
- 6-digit OTP input with auto-focus
- Validates OTP is exactly 6 digits
- Shows success screen on verification
- Redirects to bookings after 2 seconds

## API Endpoints

### Booking Management
- `POST /api/bookings/[id]/accept-request` - Lender accepts booking
- `POST /api/bookings/[id]/reject-request` - Lender rejects booking
- `POST /api/bookings/[id]/confirm` - Lender generates OTPs

### OTP Verification
- `POST /api/bookings/[id]/verify-pickup` - Verify pickup OTP
- `POST /api/bookings/[id]/verify-return` - Verify return OTP

### Data Fetching
- `GET /api/lender/bookings` - Get all bookings for lender
- `GET /api/renter/bookings` - Get all bookings for renter

## Security Features

1. **OTP Generation**: Random 6-digit codes (100000-999999)
2. **Status Validation**: Each verification checks booking is in correct state
3. **Authentication**: All endpoints verify user authentication
4. **Authorization**: Lenders can only manage their own bookings
5. **One-time Use**: OTPs are tied to specific booking states

## Database Schema

```sql
CREATE TYPE booking_status AS ENUM (
  'request_pending',
  'request_approved', 
  'confirmed',
  'pickup_verified',
  'in_transit',
  'completed',
  'cancelled',
  'rejected'
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  camera_id UUID REFERENCES cameras(id),
  renter_id UUID REFERENCES users(id),
  lender_id UUID REFERENCES users(id),
  pickup_date DATE,
  return_date DATE,
  status booking_status DEFAULT 'request_pending',
  pickup_otp TEXT,
  return_otp TEXT,
  pickup_verified_at TIMESTAMP,
  return_verified_at TIMESTAMP,
  total_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Testing the Flow

1. **Login as Lender** (`lender@rencam.com` / `Lender123`)
2. **Create a camera listing** if not already done
3. **Login as Renter** (`renter@rencam.com` / `Renter123`)
4. **Create a booking** for the camera
5. **Switch to Lender** account
6. **Accept the request** in Rental Requests tab
7. **Generate OTPs** in Confirmed tab
8. **Copy the Pickup OTP**
9. **Switch to Renter** account
10. **Click "Enter Pickup OTP"** in Active bookings
11. **Enter the OTP** and verify
12. **Booking status** changes to "Active Rental"
13. **Switch to Lender** and copy Return OTP
14. **Switch to Renter** and click "Enter Return OTP"
15. **Enter the Return OTP** and verify
16. **Booking completes** and moves to Past bookings

## Troubleshooting

**Issue: "Invalid OTP" error**
- Ensure you're using the correct OTP (Pickup vs Return)
- Check that OTP was copied correctly (6 digits)
- Verify booking is in correct status

**Issue: "Booking not ready for verification"**
- Pickup OTP requires status: `confirmed`
- Return OTP requires status: `pickup_verified`
- Check current booking status in dashboard

**Issue: OTPs not displaying**
- Ensure lender clicked "Generate OTPs" button
- Refresh the page to see updated OTPs
- Check booking status is `confirmed`

## Future Enhancements

- SMS/Email OTP delivery
- OTP expiration (time-limited codes)
- Photo verification at pickup/return
- Condition report integration
- Automated reminders for return dates
