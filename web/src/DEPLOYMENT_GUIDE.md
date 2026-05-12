# 🚀 KILIMO DEPLOYMENT GUIDE

**Complete guide for deploying KILIMO Agri-AI Suite to production**

---

## 📋 PREREQUISITES

### Required Tools
- ✅ Node.js 18+ (`node --version`)
- ✅ npm or yarn (`npm --version`)
- ✅ Supabase CLI (`supabase --version`)
- ✅ Git (`git --version`)
- ✅ Vercel or Netlify CLI (optional)

### Required Accounts & Credentials
- ✅ Supabase account with project created
- ✅ Vercel or Netlify account (for frontend)
- ✅ M-Pesa API credentials (Tanzania)
- ✅ Flutterwave API credentials
- ✅ Africa's Talking API credentials
- ✅ OpenRouter API key (for AI)

---

## 🎯 DEPLOYMENT OPTIONS

### Option 1: Automated Deployment (Recommended)
**Uses:** Bash script + GitHub Actions  
**Time:** 15 minutes  
**Best for:** Production deployments

### Option 2: Manual Deployment
**Uses:** Step-by-step commands  
**Time:** 30 minutes  
**Best for:** First-time setup, learning

### Option 3: CI/CD Only
**Uses:** GitHub Actions only  
**Time:** Automatic on push  
**Best for:** Continuous deployment

---

## 🚀 OPTION 1: AUTOMATED DEPLOYMENT

### Step 1: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env
```

**Required variables:**
```env
# Supabase
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# API Keys
OPENROUTER_API_KEY=your_openrouter_key
MPESA_API_KEY=your_mpesa_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_key
AFRICAS_TALKING_API_KEY=your_africas_talking_key
```

### Step 2: Run Pre-Deployment Audit

```bash
cd audit
npm install
npm run audit
```

**Expected result:**
```
✅ Success Rate: 91%+
✅ Critical APIs: 100%
✅ Critical Workflows: 100%
```

**If audit fails:** Fix issues before proceeding!

### Step 3: Run Deployment Script

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Deploy to staging
./scripts/deploy.sh staging

# Or deploy to production
./scripts/deploy.sh production
```

**What the script does:**
1. ✅ Validates environment
2. ✅ Runs comprehensive audit
3. ✅ Builds frontend
4. ✅ Deploys backend (Supabase)
5. ✅ Deploys frontend (Vercel/Netlify)
6. ✅ Runs smoke tests
7. ✅ Validates translations
8. ✅ Checks role-based access

**Total time:** 10-15 minutes

### Step 4: Verify Deployment

```bash
# Run smoke tests
bash scripts/smoke-test.sh

# Check logs
supabase functions logs

# Test critical endpoints
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7/health
```

---

## 🔧 OPTION 2: MANUAL DEPLOYMENT

### Step 1: Validate Environment

```bash
# Check .env file exists
if [ -f ".env" ]; then
  echo "✅ .env found"
else
  echo "❌ Create .env from .env.example"
  exit 1
fi

# Load environment
export $(grep -v '^#' .env | xargs)

# Verify required variables
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

### Step 2: Run Audit

```bash
cd audit
npm install
npm run audit:headless

# Check results
open audit-reports/audit-report-*.html

# Verify success rate >= 85%
```

### Step 3: Build Frontend

```bash
# Install dependencies
npm install

# Build
npm run build

# Verify build
ls dist/
```

### Step 4: Deploy Backend

```bash
# Install Supabase CLI (if needed)
npm install -g supabase

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy functions
supabase functions deploy

# Set secrets
supabase secrets set OPENROUTER_API_KEY="your_key"
supabase secrets set MPESA_API_KEY="your_key"
supabase secrets set FLUTTERWAVE_SECRET_KEY="your_key"
supabase secrets set AFRICAS_TALKING_API_KEY="your_key"
```

### Step 5: Deploy Frontend

#### Option A: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Or staging
vercel
```

#### Option B: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy to production
netlify deploy --prod --dir=dist

# Or staging
netlify deploy --dir=dist
```

### Step 6: Smoke Tests

```bash
# Run smoke tests
bash scripts/smoke-test.sh

# Manual tests
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7/health
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7/market-prices/Morogoro
```

---

## 🤖 OPTION 3: CI/CD WITH GITHUB ACTIONS

### Step 1: Configure GitHub Secrets

Go to: **GitHub Repo → Settings → Secrets and variables → Actions**

Add these secrets:

```
# Supabase
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_PROJECT_REF
SUPABASE_ACCESS_TOKEN

# API Keys
OPENROUTER_API_KEY
MPESA_API_KEY
FLUTTERWAVE_SECRET_KEY
AFRICAS_TALKING_API_KEY

# Deployment
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

# Optional
SLACK_WEBHOOK_URL  # For notifications
```

### Step 2: Trigger Deployment

```bash
# Push to staging branch
git checkout staging
git push origin staging

# Or push to production
git checkout main
git push origin main

# Or manual trigger
# Go to: Actions → Deploy → Run workflow
```

### Step 3: Monitor Deployment

**GitHub Actions will:**
1. ✅ Run audit
2. ✅ Build frontend
3. ✅ Deploy backend
4. ✅ Deploy frontend
5. ✅ Run smoke tests
6. ✅ Send notifications

**Check status:** GitHub → Actions tab

**View logs:**
- Audit report (Artifacts)
- Deployment logs (Console)
- Smoke test results (Console)

### Step 4: Verify Deployment

After successful deployment:

```bash
# Check your deployed site
open https://your-app.vercel.app

# Test API
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7/health

# Run local smoke tests
bash scripts/smoke-test.sh
```

---

## ✅ POST-DEPLOYMENT CHECKLIST

### Immediate (First 10 minutes)
- [ ] Site loads correctly
- [ ] Can navigate between pages
- [ ] Login/signup works
- [ ] Dashboard displays
- [ ] No console errors

### Short-term (First hour)
- [ ] Test payment deposit (sandbox)
- [ ] Test AI chat (Sankofa AI)
- [ ] Test crop diagnosis
- [ ] Test weather alerts
- [ ] Test wallet transactions
- [ ] Check error logs

### Medium-term (First day)
- [ ] Monitor error rates
- [ ] Check API performance
- [ ] Verify payment webhooks
- [ ] Test all user roles
- [ ] Verify SMS delivery
- [ ] Check translation coverage

### Before Full Launch
- [ ] Beta test with 10 users
- [ ] Monitor for 24 hours
- [ ] Fix any critical issues
- [ ] Run full audit again
- [ ] Scale to 100 users
- [ ] Full production launch

---

## 🔍 MONITORING & LOGS

### Supabase Logs

```bash
# View function logs
supabase functions logs

# View specific function
supabase functions logs make-server-ce1844e7

# Follow logs (real-time)
supabase functions logs --follow
```

### Frontend Logs

**Vercel:**
```bash
vercel logs
vercel logs --follow
```

**Netlify:**
```bash
netlify logs
```

### Database Queries

```bash
# Supabase Studio
# Go to: https://app.supabase.com → Your Project → SQL Editor

# Check recent transactions
SELECT * FROM kv_store_ce1844e7 
WHERE key LIKE 'transaction:%' 
ORDER BY created_at DESC 
LIMIT 10;

# Check wallet balances
SELECT * FROM kv_store_ce1844e7 
WHERE key LIKE 'wallet:%';
```

---

## 🐛 TROUBLESHOOTING

### Issue 1: Audit Fails

**Error:** Success rate below 85%

**Fix:**
```bash
# View detailed report
open audit/audit-reports/audit-report-*.html

# Fix critical issues
# Re-run audit
npm run audit

# Don't deploy until audit passes!
```

### Issue 2: Build Fails

**Error:** `npm run build` fails

**Fix:**
```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### Issue 3: Backend Deployment Fails

**Error:** Supabase functions deployment fails

**Fix:**
```bash
# Verify Supabase CLI
supabase --version

# Re-link project
supabase link --project-ref YOUR_PROJECT_REF

# Try deployment again
supabase functions deploy
```

### Issue 4: Frontend Not Loading

**Error:** White screen or 404

**Fix:**
```bash
# Check deployment status
vercel ls

# Verify environment variables
vercel env ls

# Redeploy
vercel --prod --force
```

### Issue 5: API Calls Failing

**Error:** 401 Unauthorized or CORS errors

**Fix:**
```bash
# Verify environment variables
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# Check Supabase secrets
supabase secrets list

# Test endpoint manually
curl -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  $SUPABASE_URL/functions/v1/make-server-ce1844e7/health
```

---

## 📊 DEPLOYMENT ENVIRONMENTS

### Development
**URL:** http://localhost:5173  
**Purpose:** Local development  
**Data:** Test data  
**Payments:** Mock/sandbox

### Staging
**URL:** https://staging-kilimo.vercel.app  
**Purpose:** Pre-production testing  
**Data:** Test data  
**Payments:** Sandbox APIs

### Production
**URL:** https://kilimo.vercel.app  
**Purpose:** Live users  
**Data:** Real data  
**Payments:** Production APIs

---

## 🔐 SECURITY CHECKLIST

Before production:

- [ ] Environment variables not committed to git
- [ ] `.env` in `.gitignore`
- [ ] Service role key never exposed to frontend
- [ ] API keys stored as secrets (not in code)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] SSL/HTTPS enabled
- [ ] Database RLS policies active
- [ ] Error messages don't expose sensitive info

---

## 📈 SCALING CONSIDERATIONS

### Performance Optimization
- [ ] Enable CDN (Vercel/Netlify automatic)
- [ ] Optimize images (use Unsplash URLs)
- [ ] Enable caching headers
- [ ] Minimize bundle size
- [ ] Use code splitting

### Database Optimization
- [ ] Add indexes for common queries
- [ ] Enable connection pooling
- [ ] Monitor query performance
- [ ] Set up read replicas (if needed)

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Enable performance monitoring
- [ ] Set up uptime monitoring
- [ ] Configure alerts

---

## 🎯 ROLLBACK PROCEDURE

If deployment fails:

### Option 1: Rollback via Vercel/Netlify

```bash
# Vercel
vercel rollback  # Interactive selection

# Netlify
netlify rollback  # Interactive selection
```

### Option 2: Redeploy Previous Version

```bash
# Find previous commit
git log --oneline

# Deploy specific commit
git checkout COMMIT_HASH
./scripts/deploy.sh production

# Or tag releases
git tag v1.0.0
git checkout v1.0.0
./scripts/deploy.sh production
```

### Option 3: Emergency Rollback

```bash
# Stop taking new deployments
# Rollback via dashboard
# Fix issues
# Redeploy when ready
```

---

## 📚 ADDITIONAL RESOURCES

### Documentation
- [QA Test Report](/QA_TEST_REPORT_COMPREHENSIVE.md)
- [Audit System Guide](/AUDIT_SYSTEM_GUIDE.md)
- [Workflow Fixes](/WORKFLOW_FIXES_STATUS.md)
- [Payment Integration](/COMPLETE_IMPLEMENTATION_SUMMARY.md)

### External Docs
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [M-Pesa API](https://developer.mpesa.vm.co.tz/)
- [Flutterwave Docs](https://developer.flutterwave.com/)

### Support
- GitHub Issues: [Create Issue](https://github.com/your-repo/issues)
- Email: support@kilimo.app
- Slack: #kilimo-deployments

---

## ✨ BEST PRACTICES

1. **Always run audit before deploying**
2. **Deploy to staging first**
3. **Monitor for 24 hours before full launch**
4. **Keep production credentials secure**
5. **Tag releases with version numbers**
6. **Document any manual changes**
7. **Test rollback procedures**
8. **Set up automated monitoring**

---

## 🎉 SUCCESS METRICS

After successful deployment:

- ✅ Audit passes (91%+)
- ✅ All smoke tests pass
- ✅ No critical errors in logs
- ✅ Response times < 2s
- ✅ Uptime > 99.9%
- ✅ User can complete critical flows
- ✅ Payments working (sandbox/production)

---

**Ready to deploy?** Choose your option above and follow the steps!

**Questions?** Check the troubleshooting section or create an issue.

**Good luck! 🚀🌾**
