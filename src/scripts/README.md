# 🚀 KILIMO Deployment Scripts

Automated deployment and testing scripts for KILIMO Agri-AI Suite.

---

## 📁 Files

```
scripts/
├── deploy.sh                    # Main deployment script
├── smoke-test.sh                # Post-deployment validation
├── validate-translations.js     # Translation coverage check
└── README.md                    # This file
```

---

## 🎯 deploy.sh

**Complete automated deployment pipeline**

### Usage

```bash
# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production

# Or use npm scripts
npm run deploy:staging
npm run deploy:production
```

### What It Does

1. ✅ Validates environment variables
2. ✅ Runs comprehensive audit (must pass 85%+)
3. ✅ Builds frontend
4. ✅ Deploys Supabase Edge Functions
5. ✅ Deploys frontend (Vercel/Netlify)
6. ✅ Runs smoke tests
7. ✅ Validates translations
8. ✅ Checks role-based access

### Duration

- **Staging:** ~10 minutes
- **Production:** ~15 minutes

### Requirements

- Node.js 18+
- Supabase CLI (`npm install -g supabase`)
- Vercel or Netlify CLI (optional)
- Valid `.env` file

---

## 🔥 smoke-test.sh

**Quick validation of critical endpoints**

### Usage

```bash
# Run smoke tests
./scripts/smoke-test.sh

# Or use npm script
npm run test:smoke
```

### What It Tests

- ✅ Health endpoint
- ✅ Wallet endpoint
- ✅ Market prices endpoint
- ✅ Weather endpoint

### Duration

~30 seconds

### Exit Codes

- `0` - All tests passed ✅
- `1` - Some tests failed ❌

---

## 🌍 validate-translations.js

**Validates English/Swahili translation coverage**

### Usage

```bash
# Run validation
node scripts/validate-translations.js

# Or use npm script
npm run validate:translations
```

### What It Checks

- ✅ 15+ core translations
- ✅ Coverage percentage
- ✅ Missing translations

### Threshold

- Minimum: 70% coverage
- Current: 70% (based on QA report)

---

## 🔧 Setup

### First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Make scripts executable
chmod +x scripts/*.sh

# 3. Configure environment
cp .env.example .env
nano .env

# 4. Test locally
npm run test:smoke
```

---

## 📊 Integration with CI/CD

These scripts are used by GitHub Actions:

```yaml
# .github/workflows/deploy.yml

- name: Run deployment
  run: bash scripts/deploy.sh production

- name: Run smoke tests
  run: bash scripts/smoke-test.sh

- name: Validate translations
  run: node scripts/validate-translations.js
```

---

## 🐛 Troubleshooting

### Script Permission Denied

```bash
chmod +x scripts/*.sh
```

### Environment Variables Missing

```bash
# Check .env exists
ls -la .env

# Verify variables loaded
export $(grep -v '^#' .env | xargs)
echo $SUPABASE_URL
```

### Deployment Fails at Audit

```bash
# Run audit separately
cd audit
npm run audit

# Check report
open audit-reports/audit-report-*.html

# Fix issues and retry
```

### Smoke Tests Fail

```bash
# Check API is up
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7/health

# Check environment variables
echo $API_BASE_URL

# Verify deployment succeeded
supabase functions logs
```

---

## 📚 Documentation

- **Full Guide:** `/DEPLOYMENT_GUIDE.md`
- **System Overview:** `/DEPLOYMENT_SYSTEM_COMPLETE.md`
- **Audit System:** `/AUDIT_SYSTEM_GUIDE.md`

---

## ✅ Best Practices

1. **Always test staging first**
   ```bash
   ./scripts/deploy.sh staging
   # Test thoroughly
   ./scripts/deploy.sh production
   ```

2. **Run audit before deploying**
   ```bash
   cd audit && npm run audit
   # Only deploy if passes
   ```

3. **Monitor after deployment**
   ```bash
   # Watch logs
   supabase functions logs --follow
   
   # Run smoke tests
   npm run test:smoke
   ```

4. **Use CI/CD for production**
   ```bash
   # Just push to GitHub
   git push origin main
   # GitHub Actions handles everything
   ```

---

## 🎯 Quick Reference

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Run smoke tests
npm run test:smoke

# Validate translations
npm run validate:translations

# Run audit
npm run audit

# Watch logs
supabase functions logs --follow
```

---

## 📞 Support

- **Issues:** Create GitHub issue
- **Docs:** See `/DEPLOYMENT_GUIDE.md`
- **Email:** support@kilimo.app

---

**🌾 Happy Deploying! 🚀**
