# 🚀 KILIMO QUICK START GUIDE

**Get from zero to deployed in 20 minutes!**

---

## ⚡ FASTEST PATH TO DEPLOYMENT

### 1. Setup (5 min)

```bash
# Clone/navigate to project
cd kilimo-agri-ai-suite

# Configure environment
cp .env.example .env
nano .env  # Add your credentials

# Make script executable
chmod +x deploy-kilimo.sh
```

### 2. Test (5 min)

```bash
# Quick tests
npm run test:ai        # AI safety check
npm run test:payment   # Payment config check
npm run test:ui        # UI completeness check
```

### 3. Deploy! (10 min)

```bash
# Deploy to staging first
./deploy-kilimo.sh staging

# After testing, deploy to production
./deploy-kilimo.sh production
```

**That's it!** Your app is live! 🎉

---

## 📋 REQUIRED CREDENTIALS

Add to `.env`:

```env
# Supabase (Required)
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI (Required)
OPENROUTER_API_KEY=your_openrouter_key

# Payments (Required for production)
MPESA_API_KEY=your_mpesa_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_key

# SMS (Required for production)
AFRICAS_TALKING_API_KEY=your_key
AFRICAS_TALKING_USERNAME=your_username
```

---

## 🎯 AVAILABLE COMMANDS

### Deployment
```bash
./deploy-kilimo.sh staging         # Deploy to staging
./deploy-kilimo.sh production      # Deploy to production
npm run deploy:kilimo              # Same as above
```

### Testing
```bash
npm run test:ai                    # AI audit
npm run test:runtime               # Workflow tests
npm run test:payment               # Payment verification
npm run test:logs                  # Log monitoring
npm run test:ui                    # UI/UX audit
npm run test:smoke                 # Smoke tests
npm run audit                      # Full system audit
```

---

## ✅ SUCCESS CHECKLIST

After deployment:

- [ ] Site loads (https://your-app.vercel.app)
- [ ] Can login/signup
- [ ] Wallet displays balance
- [ ] Deposit tab exists
- [ ] AI chat responds
- [ ] Tasks can be created
- [ ] No console errors

---

## 📊 WHERE ARE THE REPORTS?

```
audit_report.json              # AI audit
runtime_report.json            # Workflow tests
payment_sms_report.json        # Payment config
logs_summary.json              # Log monitoring
branding_audit.json            # UI/UX
audit/audit-reports/*.html     # Full system audit (open in browser!)
```

---

## 🐛 TROUBLESHOOTING

### "Deployment blocked"
→ Check the report files above  
→ Fix critical issues  
→ Re-run deployment

### "Payment config missing"
→ Add credentials to `.env`  
→ Re-run `npm run test:payment`

### "Audit failed"
→ Open `audit/audit-reports/*.html`  
→ Fix issues shown  
→ Re-run `npm run audit`

---

## 💡 PRO TIPS

1. **Always deploy to staging first**
   ```bash
   ./deploy-kilimo.sh staging
   # Test thoroughly
   ./deploy-kilimo.sh production
   ```

2. **Run tests before deploying**
   ```bash
   npm run test:ai
   npm run test:payment
   npm run audit
   # Only deploy if all pass
   ```

3. **Monitor after deployment**
   ```bash
   supabase functions logs --follow
   npm run test:smoke
   ```

---

## 📚 NEED MORE HELP?

- **Full Guide:** `/DEPLOYMENT_GUIDE.md`
- **System Overview:** `/UNIFIED_DEPLOYMENT_COMPLETE.md`
- **Audit System:** `/AUDIT_SYSTEM_GUIDE.md`
- **Scripts Docs:** `/scripts/README.md`

---

## 🎉 YOU'RE READY!

```bash
# One command to rule them all
./deploy-kilimo.sh production
```

**Total time:** ~20 minutes  
**Manual work:** Minimal  
**Confidence:** Maximum 🚀

---

**🌾 LET'S TRANSFORM AGRICULTURE IN TANZANIA! 🇹🇿**
