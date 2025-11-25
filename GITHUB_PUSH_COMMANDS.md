# GitHub Push Commands

After creating your GitHub repository, run these commands:

```bash
# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/rencam-camera-rental.git

# Verify the remote was added
git remote -v

# Push your code to GitHub
git branch -M main
git push -u origin main
```

## Alternative: Using SSH

If you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/rencam-camera-rental.git
git branch -M main
git push -u origin main
```

## After Pushing to GitHub

Once your code is on GitHub, you can:

1. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Click "Deploy"

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Select your GitHub repository
   - Click "Deploy site"

## Troubleshooting

If you get an error about authentication:
- Make sure you're logged into GitHub
- You may need to set up a Personal Access Token (PAT) for HTTPS
- Or set up SSH keys for SSH authentication

See: https://docs.github.com/en/authentication
