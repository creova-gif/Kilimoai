# ✅ CROP LIBRARY - DEPLOYMENT CHECKLIST

Use this checklist to ensure a smooth deployment of the Crop Library feature to production.

---

## 📋 PRE-DEPLOYMENT CHECKS

### **1. Environment Setup**

- [ ] `OPENROUTER_API_KEY` is configured in Supabase secrets
- [ ] `SUPABASE_URL` is correct
- [ ] `SUPABASE_ANON_KEY` is correct
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is correct (server-side only)
- [ ] OpenRouter account has credits ($10+ recommended)

### **2. Code Review**

- [ ] All files are committed to version control
- [ ] No hardcoded credentials or API keys
- [ ] Brand colors are correct (#2E7D32 only)
- [ ] TypeScript types are correct
- [ ] Error handling is in place
- [ ] Loading states are implemented

### **3. Testing**

- [ ] Backend: All 4 API endpoints tested
- [ ] Frontend: Crop Library page loads
- [ ] Frontend: Search works
- [ ] Frontend: Filters work
- [ ] Frontend: Detail modal works
- [ ] Frontend: Image generation works
- [ ] Mobile: Responsive design tested
- [ ] Mobile: Touch interactions work
- [ ] Integration: Navigation works
- [ ] Error: Network errors handled gracefully

---

## 🚀 DEPLOYMENT STEPS

### **Step 1: Deploy Backend**

```bash
# 1. Commit all changes
git add supabase/functions/server/crop_library.tsx
git add supabase/functions/server/index.tsx
git commit -m "feat: Add Crop Library backend with AI image generation"

# 2. Deploy to Supabase (if using Supabase CLI)
supabase functions deploy

# 3. Verify server is running
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7/health
# Expected: {"status":"ok"}
```

**Verification**:
- [ ] Health check returns 200 OK
- [ ] No errors in Supabase logs

---

### **Step 2: Initialize Database**

```bash
# Run initialization script
bash scripts/init-crop-library.sh

# Or manually:
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7/crop-library/init" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Expected Output**:
```json
{
  "success": true,
  "message": "Crop library initialized"
}
```

**Verification**:
- [ ] Response contains `"success":true`
- [ ] Supabase Storage has `crop-images` bucket
- [ ] KV store has crop data (check with GET /crops)

---

### **Step 3: Generate Initial Images**

Generate images for the top 10 most popular crops:

```bash
# Maize
curl -X POST "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7/crop-library/generate-image" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"cropId":"maize","stage":"vegetative"}'

# Rice
curl -X POST "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7/crop-library/generate-image" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"cropId":"rice","stage":"vegetative"}'

# Beans
curl -X POST "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7/crop-library/generate-image" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"cropId":"beans","stage":"vegetative"}'

# Continue for: cassava, sweet_potato, tomato, onion, cabbage, banana, coffee
```

**Note**: Each image takes 30-60 seconds. Run these in parallel or one at a time.

**Verification**:
- [ ] Each request returns `"success":true`
- [ ] Image URLs are returned
- [ ] Images are accessible in browser
- [ ] Images appear in Supabase Storage bucket

---

### **Step 4: Deploy Frontend**

```bash
# 1. Commit all changes
git add components/CropLibrary.tsx
git add App.tsx
git add scripts/init-crop-library.sh
git commit -m "feat: Add Crop Library frontend with mobile-first design"

# 2. Build and deploy
npm run build

# 3. Deploy to your hosting platform
# (Vercel, Netlify, custom server, etc.)
```

**Verification**:
- [ ] Build succeeds with no errors
- [ ] Deployment succeeds
- [ ] App loads in browser

---

### **Step 5: Smoke Test**

**On Desktop**:
1. Open app in browser
2. Navigate to **Planning → Crop Library**
3. Verify crops display in grid
4. Search for "maize"
5. Click on "Maize" card
6. Verify detail modal opens
7. Verify images display (if generated)
8. Click "Use in Crop Plan"
9. Verify navigation works
10. Click "Ask AI"
11. Verify navigation works

**On Mobile** (use browser dev tools or real device):
1. Open app
2. Navigate to Crop Library
3. Verify 2-column grid
4. Swipe through filters
5. Tap crop card
6. Verify modal fills screen
7. Verify touch interactions work

**Verification**:
- [ ] All steps complete without errors
- [ ] No console errors
- [ ] Performance is acceptable (<2s load)

---

## 📊 POST-DEPLOYMENT MONITORING

### **Day 1: Immediate Checks**

- [ ] Monitor Supabase logs for errors
- [ ] Check API response times (<500ms)
- [ ] Verify image generation requests succeed
- [ ] Monitor user engagement (page views)
- [ ] Check for user-reported issues

### **Week 1: Usage Metrics**

- [ ] Track unique visitors to Crop Library
- [ ] Track average time on page
- [ ] Track search queries
- [ ] Track filter usage
- [ ] Track modal opens
- [ ] Track CTA clicks ("Use in Crop Plan", "Ask AI")
- [ ] Track image generation requests

### **Month 1: Performance Review**

- [ ] Review total crops viewed
- [ ] Review most popular crops
- [ ] Review conversion rates
- [ ] Review error rates
- [ ] Review user feedback
- [ ] Identify areas for improvement

---

## 🐛 ROLLBACK PLAN

If critical issues are discovered:

### **Option 1: Disable Feature (Quick)**

1. In App.tsx, comment out navigation item:
```typescript
// { id: "crop-library", label: "Crop Library", icon: BookOpen, category: "planning" },
```

2. Deploy immediately
3. Feature is hidden from users
4. Fix issues
5. Re-enable when ready

### **Option 2: Full Rollback (Nuclear)**

1. Revert commits:
```bash
git revert <commit-hash>
```

2. Redeploy backend and frontend
3. Feature is completely removed

---

## ✅ SUCCESS CRITERIA

The deployment is successful if:

- [ ] Zero critical errors in first 24 hours
- [ ] Page load time < 2 seconds (95th percentile)
- [ ] API error rate < 1%
- [ ] Image generation success rate > 95%
- [ ] User engagement > 5 minutes average session
- [ ] No security vulnerabilities
- [ ] No brand compliance issues
- [ ] Mobile experience is smooth
- [ ] Bilingual support works correctly

---

## 📈 OPTIMIZATION OPPORTUNITIES

After successful deployment, consider:

### **Performance**
- [ ] Add image lazy loading
- [ ] Implement progressive image loading
- [ ] Add service worker for offline caching
- [ ] Optimize API response caching

### **Features**
- [ ] Add crop favorites
- [ ] Add crop comparison
- [ ] Add regional filtering
- [ ] Add seasonal alerts

### **Analytics**
- [ ] Track which crops are most viewed
- [ ] Track which search terms are used
- [ ] Track conversion funnels
- [ ] A/B test different layouts

### **AI Improvements**
- [ ] Fine-tune DALL-E prompts
- [ ] Add more growth stages
- [ ] Generate images at multiple resolutions
- [ ] Implement quality review process

---

## 🎯 KEY MILESTONES

- [ ] **T+0**: Deployment complete
- [ ] **T+1 hour**: Initial smoke tests pass
- [ ] **T+24 hours**: No critical errors
- [ ] **T+1 week**: 80% of farmers discover feature
- [ ] **T+1 month**: 5,000+ crops viewed
- [ ] **T+3 months**: Feature is top 3 most used

---

## 📞 ESCALATION CONTACTS

If issues arise:

**Critical Issues** (app down, security breach):
- Contact: [Your DevOps Team]
- Action: Immediate rollback

**Major Issues** (feature broken, data loss):
- Contact: [Your Engineering Lead]
- Action: Debug and fix within 4 hours

**Minor Issues** (UI glitches, slow performance):
- Contact: [Your Product Manager]
- Action: Log for next sprint

---

## 📝 DEPLOYMENT LOG

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Environment**: Production / Staging / Local  
**Version**: _______________

**Checklist Completed**: ☐ Yes ☐ No  
**Smoke Tests Passed**: ☐ Yes ☐ No  
**Issues Encountered**: _______________  
**Resolution**: _______________  
**Status**: ☐ Success ☐ Partial ☐ Failed  

**Notes**:
```
[Add any deployment notes here]
```

---

## 🎉 POST-DEPLOYMENT CELEBRATION

Once deployment is successful:

1. ✅ Update team on success
2. ✅ Share metrics with stakeholders
3. ✅ Gather user feedback
4. ✅ Plan next iteration
5. ✅ Celebrate the win! 🎊

---

**Remember**: A successful deployment is measured not just by technical success, but by farmer adoption and satisfaction. Monitor, listen, and iterate! 🌾

---

**Deployment Status**: ☐ Pending ☐ In Progress ☐ Complete ☐ Rolled Back

**Last Updated**: _______________
