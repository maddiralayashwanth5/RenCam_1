# Database Scripts

## Setup Order

Run these scripts in order to set up the database:

### 1. Create Tables
```bash
psql -U your_username -d rencam_db -f scripts/01-create-tables.sql
```

Creates all database tables and enums:
- Users table
- Cameras table
- Bookings table
- OTP verifications table
- Transactions table

### 2. Create Test Users
```bash
psql -U your_username -d rencam_db -f scripts/create-test-users.sql
```

Creates 3 test users:
- **Admin**: admin@rencam.com / Admin123
- **Lender**: lender@rencam.com / Lender123
- **Renter**: renter@rencam.com / Renter123

### 3. Seed Demo Data (Recommended for Presentation)
```bash
psql -U your_username -d rencam_db -f scripts/03-seed-demo-data.sql
```

Comprehensive demo data including:
- **4 Cameras** with images (₹2,500-₹4,500/day)
- **4 Bookings** in different states (pending, confirmed, active, completed)
- **Test OTPs** for verification demos
- **Wallet balances** for users

**Test OTPs**:
- Booking 2: Pickup=`123456`, Return=`789012`
- Booking 3: Pickup=`345678`, Return=`901234`

## Quick Setup (All at Once)

```bash
# Run all scripts in order for complete demo setup
psql -U your_username -d rencam_db -f scripts/01-create-tables.sql
psql -U your_username -d rencam_db -f scripts/create-test-users.sql
psql -U your_username -d rencam_db -f scripts/03-seed-demo-data.sql
```

## Verify Setup

```sql
-- Check users
SELECT email, name, role FROM users;

-- Check cameras
SELECT name, category, price_per_day FROM cameras;

-- Check booking statuses
SELECT enumlabel FROM pg_enum WHERE enumtypid = 'booking_status'::regtype;
```

## Reset Database (Careful!)

```sql
-- Drop all tables (WARNING: Deletes all data)
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS otp_verifications CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS cameras CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Then re-run setup scripts
```
