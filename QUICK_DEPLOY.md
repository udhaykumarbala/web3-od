# Quick Deployment Guide 🚀

## Fastest Way to Deploy (GitHub Pages)

1. **Go to your repository on GitHub**: https://github.com/udhaykumarbala/web3-od

2. **Enable GitHub Pages**:
   - Click on "Settings" tab
   - Scroll down to "Pages" in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Choose branch: `terragon/web3-odyssey-onboarding-tool`
   - Choose folder: `/ (root)` or select custom if you want `/web3-odyssey`
   - Click "Save"

3. **Your site will be live at**:
   ```
   https://udhaykumarbala.github.io/web3-od/web3-odyssey/
   ```

## Alternative: One-Click Deploy

### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/udhaykumarbala/web3-od&project-name=web3-odyssey&repository-name=web3-odyssey)

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/udhaykumarbala/web3-od)

## For Advanced Users

See `DEPLOYMENT_WORKFLOWS.md` for GitHub Actions setup (requires manual workflow file creation due to permission restrictions).

## Local Testing

```bash
# Quick start
cd web3-odyssey
python -m http.server 8000

# Or with npm
npm start
```

Then visit: http://localhost:8000

---

**Your Web3 Odyssey is ready to onboard the world! 🌍✨**