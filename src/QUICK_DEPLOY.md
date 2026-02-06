# 🚀 CREOVA - Quick Deployment Script

## One-Command Deployment Options

Choose your preferred hosting platform and follow the steps below.

---

## Option 1: Vercel (Recommended - Easiest) ⚡

### Why Vercel?
- ✅ Free tier includes HTTPS
- ✅ Automatic deployments from Git
- ✅ Global CDN for fast loading
- ✅ Zero configuration needed
- ✅ Perfect for React apps

### Deploy in 3 Commands:

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel (creates account if needed)
vercel login

# 3. Deploy!
vercel --prod
```

That's it! Your app is live with HTTPS. 🎉

### Post-Deployment:
1. Vercel gives you a URL like `your-app.vercel.app`
2. Update `/public/manifest.json`:
   ```json
   {
     "start_url": "https://your-app.vercel.app/"
   }
   ```
3. Push changes:
   ```bash
   git add .
   git commit -m "Update manifest with production URL"
   git push
   ```
4. Vercel auto-redeploys!

### Custom Domain (Optional):
```bash
vercel domains add creova.app
# Follow DNS instructions
```

---

## Option 2: Netlify (Great Alternative) 🌐

### Why Netlify?
- ✅ Free tier with HTTPS
- ✅ Continuous deployment
- ✅ Simple drag-and-drop option
- ✅ Great for static sites
- ✅ Built-in form handling

### Method A: Deploy from Git (Recommended)

```bash
# 1. Push your code to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/creova.git
git push -u origin main

# 2. Go to netlify.com
# 3. Click "New site from Git"
# 4. Connect your GitHub repo
# 5. Set build settings:
#    - Build command: npm run build
#    - Publish directory: dist
# 6. Click "Deploy site"
```

### Method B: Manual Deploy

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build your app
npm run build

# 3. Deploy
netlify deploy --prod
```

---

## Option 3: Firebase Hosting 🔥

### Why Firebase?
- ✅ Google infrastructure
- ✅ Free SSL certificate
- ✅ Integrated with Firebase services
- ✅ Great for apps using Firestore/Auth
- ✅ Fast global CDN

### Deploy Commands:

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize Firebase in your project
firebase init hosting

# When prompted:
# - Use existing project or create new
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds: No
# - Overwrite index.html: No

# 4. Build your app
npm run build

# 5. Deploy!
firebase deploy --only hosting
```

Your app is live at `https://your-project.firebaseapp.com`

### Custom Domain:
1. Go to Firebase Console
2. Hosting → Connect custom domain
3. Follow DNS instructions

---

## Option 4: GitHub Pages (Free) 📄

### Why GitHub Pages?
- ✅ Completely free
- ✅ Automatic HTTPS
- ✅ No account needed (uses GitHub)
- ✅ Simple for small projects

### Deploy Commands:

```bash
# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Add deploy script to package.json
# Add this to the "scripts" section:
# "deploy": "npm run build && gh-pages -d dist"

# 3. Deploy
npm run deploy
```

Your app is live at `https://yourusername.github.io/creova`

⚠️ **Note**: Update `manifest.json` and set base path if using subdirectory.

---

## Option 5: Render (Good Free Tier) 🎨

### Why Render?
- ✅ Free tier with HTTPS
- ✅ Auto-deploy from Git
- ✅ Environment variables support
- ✅ Backend services if needed

### Deploy Steps:

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Click "New +" → "Static Site"
4. Connect GitHub repo
5. Settings:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
6. Click "Create Static Site"

Live in minutes! 🚀

---

## Quick Comparison

| Platform | Setup Time | Free Tier | Best For |
|----------|------------|-----------|----------|
| **Vercel** | 2 min | Yes | React apps (BEST) |
| **Netlify** | 3 min | Yes | Static sites |
| **Firebase** | 5 min | Yes | Firebase integration |
| **GitHub Pages** | 3 min | Yes | Open source projects |
| **Render** | 4 min | Yes | Full-stack apps |

**Recommendation:** Start with **Vercel** - it's the easiest and fastest.

---

## After Deployment Checklist

Once deployed, do these immediately:

### 1. Update Manifest
```json
// /public/manifest.json
{
  "start_url": "https://your-actual-url.com/"
}
```

### 2. Test Service Worker
Open browser console and check:
```javascript
navigator.serviceWorker.getRegistrations()
// Should show registered worker
```

### 3. Run Lighthouse Audit
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Check "Progressive Web App"
4. Click "Generate report"
5. Aim for 90+ score

### 4. Test Installation

**iPhone:**
```
1. Open Safari
2. Go to your URL
3. Share → Add to Home Screen
4. Verify icon appears
5. Launch and test
```

**Android:**
```
1. Open Chrome  
2. Go to your URL
3. Tap "Install" prompt
4. Verify icon appears
5. Launch and test
```

### 5. Test Offline Mode
```
1. Install app on phone
2. Open app
3. Turn on Airplane Mode
4. App should still work!
5. Check offline page
```

---

## Environment Variables (If Using Backend)

### Vercel
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

### Netlify
```bash
# In Netlify Dashboard:
# Site settings → Build & deploy → Environment
# Add variables there
```

### Firebase
```bash
firebase functions:config:set \
  supabase.url="your-url" \
  supabase.key="your-key"
```

---

## Custom Domain Setup

### 1. Buy Domain (Recommended Registrars)
- [Namecheap](https://namecheap.com) - ~$10/year
- [Google Domains](https://domains.google) - ~$12/year
- [Cloudflare](https://cloudflare.com) - ~$9/year

### 2. Configure DNS

**For Vercel:**
```bash
vercel domains add creova.app

# Add DNS records (from Vercel):
# A     @    76.76.21.21
# CNAME www  cname.vercel-dns.com
```

**For Netlify:**
```
# In Netlify Dashboard:
# Domain settings → Add custom domain
# Follow DNS instructions
```

**For Firebase:**
```
# Firebase Console → Hosting
# Add custom domain → Follow wizard
```

### 3. Wait for Propagation
- DNS changes take 1-48 hours
- Check status: `nslookup creova.app`

### 4. Update Manifest
```json
{
  "start_url": "https://creova.app/"
}
```

---

## Troubleshooting Deployment

### Build Fails
```bash
# Check Node version
node --version  # Should be 16+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Try local build
npm run build
```

### Service Worker Not Registering
```javascript
// Check in browser console
navigator.serviceWorker.controller
// Should not be null

// Check network tab
// /service-worker.js should load (200 status)
```

### Manifest Not Loading
```bash
# Check it's accessible
curl https://your-url.com/manifest.json

# Verify MIME type
# Should be: application/manifest+json
```

### HTTPS Issues
```bash
# All platforms provide free HTTPS
# If not working:
# 1. Check domain DNS settings
# 2. Wait for SSL certificate provisioning (can take 24h)
# 3. Contact platform support
```

---

## Quick Deploy Checklist

Before deploying:

- [ ] Icons created (at least basic ones)
- [ ] Manifest.json configured
- [ ] Service worker tested locally
- [ ] Build succeeds locally (`npm run build`)
- [ ] No console errors in dev mode
- [ ] Supabase credentials configured
- [ ] Git repository initialized
- [ ] Hosting platform account created

During deploy:

- [ ] Deployment succeeds
- [ ] HTTPS enabled automatically
- [ ] Custom domain configured (optional)
- [ ] Environment variables set
- [ ] Build logs show no errors

After deploy:

- [ ] Manifest accessible at /manifest.json
- [ ] Service worker accessible at /service-worker.js
- [ ] Icons load correctly
- [ ] Test installation on iPhone
- [ ] Test installation on Android
- [ ] Lighthouse PWA score 90+
- [ ] Offline mode works
- [ ] Updates deploy correctly

---

## Continuous Deployment

### Auto-deploy on Git Push

**Vercel:**
```bash
# Automatically enabled!
git push origin main  
# → Auto-deploys to production
```

**Netlify:**
```bash
# Enabled after connecting Git
git push origin main
# → Auto-deploys
```

**Firebase:**
```bash
# Setup GitHub Actions
# Create .github/workflows/deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
```

---

## Rollback Deployment

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Netlify
```bash
# In Dashboard:
# Deploys → Click previous deploy → "Publish deploy"
```

### Firebase
```bash
# List versions
firebase hosting:channel:list

# Rollback
firebase hosting:rollback
```

---

## Monitor Your Deployment

### Analytics (Free)
```javascript
// Add Google Analytics to /index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### Error Tracking (Free)
```bash
# Sentry
npm install @sentry/react
# Add to App.tsx for error monitoring
```

### Performance Monitoring
```bash
# Use Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=https://your-url.com
```

---

## 🎉 You're Live!

Once deployed, your CREOVA app is:
- ✅ Live on the internet with HTTPS
- ✅ Installable as a PWA on any device
- ✅ Accessible to Tanzanian farmers
- ✅ Ready to empower smallholder agriculture!

**Next Steps:**
1. Share the URL with test users
2. Collect feedback
3. Iterate and improve
4. Scale to thousands of farmers!

---

**Need Help?**
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Firebase: [firebase.google.com/docs](https://firebase.google.com/docs/hosting)
- GitHub: [pages.github.com](https://pages.github.com)

**Ready to launch?** Pick a platform above and deploy in minutes! 🚀🌾
