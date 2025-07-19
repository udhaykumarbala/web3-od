# GitHub Actions Deployment Workflows

Since the GitHub App doesn't have workflow permissions, please manually create these files in your repository.

## Step 1: Create the `.github/workflows` Directory

In your repository, create the following directory structure:
```
.github/
└── workflows/
    ├── deploy.yml
    ├── vercel.yml
    └── netlify.yml
```

## Step 2: Add Workflow Files

### `.github/workflows/deploy.yml` (GitHub Pages)

```yaml
name: Deploy Web3 Odyssey to GitHub Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]
  
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Create deployment directory
        run: |
          mkdir -p _site
          cp -r web3-odyssey/* _site/
          
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '_site'
          
  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### `.github/workflows/vercel.yml` (Vercel Deployment)

```yaml
name: Deploy Web3 Odyssey to Vercel

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]
  
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
        
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### `.github/workflows/netlify.yml` (Netlify Deployment)

```yaml
name: Deploy Web3 Odyssey to Netlify

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]
  
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.1
        with:
          publish-dir: './web3-odyssey'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
          enable-pull-request-comment: false
          enable-commit-comment: true
          overwrites-pull-request-comment: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        timeout-minutes: 1
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to Settings → Pages
3. Under "Source", select "GitHub Actions"
4. The workflow will run automatically on your next push to main

## Step 4: Optional - Set Up Vercel/Netlify Secrets

If you want to use the Vercel or Netlify workflows, add these secrets in your repository settings:

### For Vercel:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### For Netlify:
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

## Alternative: Manual Deployment

If you prefer not to use GitHub Actions, you can deploy manually:

### GitHub Pages
1. Go to Settings → Pages
2. Select "Deploy from a branch"
3. Choose your branch and `/web3-odyssey` folder

### Vercel
```bash
npx vercel --prod
```

### Netlify
```bash
npx netlify deploy --prod --dir=web3-odyssey
```

## Next Steps

1. Create the workflow files manually in your repository
2. Push your changes
3. Enable GitHub Pages in settings
4. Your Web3 Odyssey will be live!

Your site will be available at: `https://[username].github.io/[repository-name]/`