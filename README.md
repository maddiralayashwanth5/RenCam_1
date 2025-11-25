# RenCam - Camera Rental Platform

RenCam is a modern platform for renting professional cameras with secure OTP-based verification for pickup and return.

## Features

- **Demo Authentication**: One-click login for Admin, Lender, and Renter roles
- **Camera Browsing**: Search and filter cameras by category, price, and features
- **Booking System**: Request cameras with date selection and pricing breakdown
- **OTP Verification**: Secure 6-digit OTP verification for pickup and return
- **Wallet System**: Track transactions and manage funds
- **Role-Based Access**: Different dashboards and features for each user role

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS 4
- **Backend**: Next.js API Routes, PostgreSQL
- **Authentication**: JWT with HTTP-only cookies
- **UI Components**: Radix UI, Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your database credentials and JWT secret
5. Set up the database:
   ```bash
   psql -U your_username -d rencam_db -f scripts/01-create-tables.sql
   psql -U your_username -d rencam_db -f scripts/03-seed-demo-data.sql
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Credentials

- **Admin**: admin@rencam.com
- **Lender**: lender@rencam.com
- **Renter**: renter@rencam.com

No passwords required in demo mode.

## Deployment

For deployment instructions, see [NETLIFY_DEPLOYMENT_GUIDE.md](./NETLIFY_DEPLOYMENT_GUIDE.md).

## License

This project is for demonstration purposes only.

## Acknowledgements

- Camera images from Unsplash
- Icons from Lucide React
- UI components from Radix UI
