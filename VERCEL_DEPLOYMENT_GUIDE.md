# Vercel Deployment Guide for RenCam

This guide will help you deploy the RenCam Camera Rental Platform to Vercel.

## Prerequisites

- A GitHub account
- A Vercel account (can sign up with GitHub)
- Git installed on your computer

## Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub
2. Initialize Git in your local project (if not already done):
   ```bash
   cd /Users/yashwanthmaddirala/Downloads/rencam-camera-rental-platform\ \(1\)
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Connect your local repository to GitHub:
   ```bash
   git remote add origin https://github.com/your-username/rencam.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option 1: Deploy via Vercel UI (Recommended)

1. Log in to [Vercel](https://vercel.com/)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js (should be auto-detected)
   - Root Directory: `./` (default)
   - Build and Output Settings: Leave as default
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. Deploy your project:
   ```bash
   vercel
   ```
4. Follow the prompts to configure your deployment
5. For production deployment:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables

After deployment, you need to set up environment variables in Vercel:

1. Go to your project dashboard in Vercel
2. Navigate to Settings > Environment Variables
3. Add the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL database URL (you'll need a cloud-hosted PostgreSQL database like Neon)
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `JWT_EXPIRES_IN`: Token expiration time (e.g., `7d`)
   - `NODE_ENV`: Set to `production` (automatically set by Vercel)
   - `NEXT_PUBLIC_APP_URL`: Your Vercel site URL (automatically set by Vercel)

## Step 4: Set Up a Database

For the production deployment, you'll need a cloud-hosted PostgreSQL database:

1. Create an account on [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Railway](https://railway.app/)
2. Create a new PostgreSQL database
3. Run the SQL scripts from your project to set up the schema:
   - `01-create-tables.sql`
   - `03-seed-demo-data.sql`
4. Update the `DATABASE_URL` environment variable in Vercel with your new database connection string

## Step 5: Test Your Deployment

1. Once deployed, Vercel will provide you with a URL (e.g., `https://rencam.vercel.app`)
2. Visit the URL to ensure your application is working correctly
3. Test the authentication, camera browsing, and booking features

## Advantages of Vercel for Next.js Apps

- **Optimized for Next.js**: Vercel is built by the creators of Next.js
- **Automatic Preview Deployments**: Get a preview URL for every pull request
- **Edge Network**: Global CDN for fast content delivery
- **Serverless Functions**: API routes are automatically deployed as serverless functions
- **Analytics**: Built-in analytics for page performance
- **Easy Rollbacks**: Quickly revert to previous deployments if needed

## Troubleshooting

If you encounter issues with your deployment:

1. Check the Vercel deployment logs for errors
2. Verify your environment variables are set correctly
3. Ensure your database is accessible from Vercel (check IP allowlists if needed)
4. Check that your `vercel.json` configuration is correct

## Custom Domain (Optional)

To use a custom domain:

1. Go to your project dashboard in Vercel
2. Navigate to Settings > Domains
3. Add your custom domain
4. Follow the instructions to configure your domain's DNS settings

---

For more information, refer to the [Vercel documentation](https://vercel.com/docs) and [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs) guide.
