# Test User Credentials

## All Test Accounts

Use these credentials to test different user roles in the application.

### 🔴 Admin Account
- **Email:** `admin@rencam.com`
- **Password:** `Admin123`
- **Role:** Admin (full access to all features)
- **Dashboard:** `/admin/dashboard`

### 🟢 Lender Account
- **Email:** `lender@rencam.com`
- **Password:** `Lender123`
- **Role:** Lender (can list cameras, manage rentals)
- **Dashboard:** `/lender/dashboard`

### 🔵 Renter Account
- **Email:** `renter@rencam.com`
- **Password:** `Renter123`
- **Role:** Renter (can browse and rent cameras)
- **Dashboard:** `/browse` or `/renter/bookings`

---

## How to Test

1. **Go to login page:** http://localhost:3001/auth/login

2. **Choose an account** from above and enter credentials

3. **Click "Sign In"** button

4. **You'll be redirected** based on role:
   - Admin → `/admin/dashboard`
   - Lender → `/lender/dashboard`
   - Renter → `/browse`

5. **Check authentication:**
   - Open DevTools (F12)
   - Go to Application > Cookies
   - Look for `auth-token` cookie (should be HttpOnly)

---

## Password Requirements

All passwords meet the security requirements:
- ✅ Minimum 8 characters
- ✅ At least one uppercase letter
- ✅ At least one lowercase letter
- ✅ At least one number

---

## Testing Different Roles

### As Admin:
- Access all dashboards
- View all users, cameras, bookings
- Manage platform settings

### As Lender:
- Create camera listings
- View rental requests
- Accept/reject bookings
- Track earnings

### As Renter:
- Browse available cameras
- Make bookings
- View booking history
- Manage wallet

---

**Note:** These are test accounts for development only. Do not use these credentials in production!
