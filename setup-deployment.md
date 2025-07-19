# Deployment Setup Guide for Web3 Odyssey

This guide will help you set up automated deployments for your Web3 Odyssey project.

## GitHub Pages Setup

1. Go to your repository on GitHub
2. Navigate to Settings → Pages
3. Under "Source", select "GitHub Actions"
4. Push to the main branch to trigger deployment
5. Your site will be available at: `https://[username].github.io/[repository-name]/`

## Vercel Setup

### Option 1: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the configuration
5. Click "Deploy"

### Option 2: Using GitHub Actions

1. Install Vercel CLI locally:
   ```bash
   npm i -g vercel
   ```

2. Link your project:
   ```bash
   vercel link
   ```

3. Get your tokens:
   ```bash
   # Get your token from https://vercel.com/account/tokens
   # The org ID and project ID will be in .vercel/project.json after linking
   ```

4. Add these secrets to your GitHub repository:
   - Go to Settings → Secrets and variables → Actions
   - Add new repository secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Found in `.vercel/project.json`
     - `VERCEL_PROJECT_ID`: Found in `.vercel/project.json`

## Netlify Setup

### Option 1: Drag and Drop

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Drag the `web3-odyssey` folder to the Netlify dashboard
3. Your site will be instantly deployed

### Option 2: Using GitHub Actions

1. Create a new site on Netlify:
   ```bash
   # Install Netlify CLI
   npm i -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Create a new site
   netlify sites:create --name web3-odyssey
   ```

2. Get your API token:
   - Go to User Settings → Applications → Personal access tokens
   - Create a new token

3. Add these secrets to your GitHub repository:
   - Go to Settings → Secrets and variables → Actions
   - Add new repository secrets:
     - `NETLIFY_AUTH_TOKEN`: Your personal access token
     - `NETLIFY_SITE_ID`: The site ID from Netlify dashboard

## Environment Variables

If you need to add environment variables (e.g., for future API integrations):

### Vercel
Add to `vercel.json`:
```json
{
  "env": {
    "API_KEY": "@api_key"
  }
}
```

### Netlify
Add to `netlify.toml`:
```toml
[build.environment]
  API_KEY = "your-api-key"
```

### GitHub Pages
Use GitHub Secrets in your workflow files.

## Custom Domain Setup

### GitHub Pages
1. Go to Settings → Pages
2. Add your custom domain
3. Create a CNAME file in the `web3-odyssey` folder with your domain

### Vercel
1. Go to your project dashboard
2. Navigate to Settings → Domains
3. Add your domain and follow the DNS instructions

### Netlify
1. Go to Site settings → Domain management
2. Add a custom domain
3. Follow the DNS configuration instructions

## Monitoring Deployments

### GitHub Actions
- Check the Actions tab in your repository
- View deployment logs and status

### Vercel
- Check the Vercel dashboard
- Enable notifications for deployment status

### Netlify
- Check the Netlify dashboard
- View deploy logs and preview deployments

## Troubleshooting

### Build Failures
- Check that all file paths are correct
- Ensure no absolute paths are used
- Verify all assets are committed to the repository

### 404 Errors
- For GitHub Pages: Check the base path in your URLs
- For Vercel/Netlify: Verify the publish directory

### Performance Issues
- Enable caching headers (already configured)
- Use a CDN (automatic with Vercel/Netlify)
- Optimize images and assets

## Security Best Practices

1. Never commit sensitive data
2. Use environment variables for API keys
3. Enable HTTPS (automatic on all platforms)
4. Set security headers (already configured)

## Support

If you encounter issues:
1. Check the deployment logs
2. Verify all secrets are correctly set
3. Open an issue on GitHub
4. Contact platform support (Vercel/Netlify)