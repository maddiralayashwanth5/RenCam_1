# Netlify Deployment Guide for RenCam

This guide will help you deploy the RenCam Camera Rental Platform to Netlify.

## Prerequisites

- A GitHub account
- A Netlify account (can sign up with GitHub)
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

## Step 2: Deploy to Netlify

### Option 1: Deploy via Netlify UI (Recommended)

1. Log in to [Netlify](https://app.netlify.com/)
2. Click "Add new site" > "Import an existing project"
3. Select GitHub as your Git provider
4. Authorize Netlify to access your GitHub repositories
5. Select your RenCam repository
6. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
7. Click "Deploy site"

### Option 2: Deploy via Netlify CLI (If you have admin access)

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```
2. Login to Netlify:
   ```bash
   netlify login
   ```
3. Initialize Netlify in your project:
   ```bash
   netlify init
   ```
4. Follow the prompts to create a new site or link to an existing one
5. Deploy your site:
   ```bash
   netlify deploy --prod
   ```

## Step 3: Configure Environment Variables

After deployment, you need to set up environment variables in Netlify:

1. Go to your site dashboard in Netlify
2. Navigate to Site settings > Environment variables
3. Add the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL database URL (you'll need a cloud-hosted PostgreSQL database like Neon)
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `JWT_EXPIRES_IN`: Token expiration time (e.g., `7d`)
   - `NODE_ENV`: Set to `production`
   - `NEXT_PUBLIC_APP_URL`: Your Netlify site URL

## Step 4: Set Up a Database

For the production deployment, you'll need a cloud-hosted PostgreSQL database:

1. Create an account on [Neon](https://neon.tech/) or any other PostgreSQL provider
2. Create a new PostgreSQL database
3. Run the SQL scripts from your project to set up the schema:
   - `01-create-tables.sql`
   - `03-seed-demo-data.sql`
4. Update the `DATABASE_URL` environment variable in Netlify with your new database connection string

## Step 5: Configure Netlify for NextJS

Ensure your `netlify.toml` file has the correct configuration for Next.js:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NETLIFY_NEXT_PLUGIN_SKIP = "true"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Step 6: Test Your Deployment

1. Once deployed, Netlify will provide you with a URL (e.g., `https://rencam-camera-rental.netlify.app`)
2. Visit the URL to ensure your application is working correctly
3. Test the authentication, camera browsing, and booking features

## Troubleshooting

If you encounter issues with your deployment:

1. Check the Netlify deployment logs for errors
2. Verify your environment variables are set correctly
3. Ensure your database is accessible from Netlify
4. Check that your `netlify.toml` configuration is correct

## Custom Domain (Optional)

To use a custom domain:

1. Go to your site dashboard in Netlify
2. Navigate to Domain settings
3. Click "Add custom domain"
4. Follow the instructions to configure your domain's DNS settings

---

For more information, refer to the [Netlify documentation](https://docs.netlify.com/) and [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/overview/) guide.
