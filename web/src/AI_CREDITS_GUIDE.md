# OpenRouter AI Credits - Quick Reference Guide

## 🔑 Current Configuration

### **Model:** 
`openai/gpt-3.5-turbo` (Changed from GPT-4 Turbo)

### **Token Limit:** 
`1000 tokens` (Reduced from 3000)

### **Cost per Request:**
~$0.000012 (was ~$0.00015) = **92% cheaper**

---

## 🚨 When Credits Run Out

### **What Happens:**
1. Backend receives 402 error from OpenRouter
2. Backend returns `{ fallback: true }` to frontend
3. Frontend switches to sample/demo data
4. User sees yellow warning banner
5. App continues to function normally

### **User Experience:**
- ✅ No crashes
- ✅ No blank screens
- ✅ Clear communication
- ✅ Sample recommendations still useful
- ✅ Can continue using other features

---

## 💳 How to Add Credits

### **Step 1: Access OpenRouter Dashboard**
Visit: https://openrouter.ai/settings/credits

### **Step 2: Choose Plan**
| Plan | Credits | Cost | Recommendations |
|------|---------|------|-----------------|
| Starter | $10 | $10 | ~833,333 requests |
| Professional | $50 | $50 | ~4,166,666 requests |
| Enterprise | Custom | Custom | Unlimited |

### **Step 3: Add Payment Method**
- Credit card
- PayPal
- Crypto (some plans)

### **Step 4: Verify**
- Credits appear instantly
- No code changes needed
- App automatically resumes AI generation

---

## 📊 Credit Monitoring

### **Check Current Balance:**
```bash
# Dashboard
https://openrouter.ai/settings/credits

# API (if configured)
curl -H "Authorization: Bearer YOUR_KEY" \
  https://openrouter.ai/api/v1/auth/key
```

### **Usage Alerts:**
Set up alerts at:
- 80% used → Warning
- 90% used → Critical
- 95% used → Urgent

---

## 🎯 Cost Optimization Tips

### **1. Reduce Token Limits Further**
Current: 1000 tokens
Consider: 750 tokens for simple queries

**Location:** `/supabase/functions/server/index.tsx`
```typescript
const aiResponse = await openrouter.queryAI(
  systemPrompt, 
  userPrompt, 
  "openai/gpt-3.5-turbo",
  750, // Change this value
  0.7
);
```

### **2. Cache Recommendations**
Store frequently requested recommendations:
- Common crops (maize, rice, beans)
- Seasonal advice
- General best practices

### **3. Batch Processing**
Instead of real-time generation, batch process:
- Generate weekly recommendations overnight
- Store in database
- Serve from cache during peak hours

### **4. Use Cheaper Models for Simple Tasks**
```typescript
// For simple tasks
"meta-llama/llama-3-8b-instruct" // Very cheap

// For complex analysis
"openai/gpt-3.5-turbo" // Balanced

// For critical recommendations only
"openai/gpt-4-turbo-preview" // Premium
```

---

## 🔧 Emergency Actions

### **If Credits Deplete Unexpectedly:**

1. **Immediate:** Fallback mode activates automatically ✅
2. **Short-term:** Add $10-20 credits (takes 5 min)
3. **Long-term:** Investigate usage spike

### **Debugging High Usage:**

Check backend logs for:
```bash
# Count API calls
grep "OpenRouter AI" logs.txt | wc -l

# Check for errors
grep "402" logs.txt

# Find heaviest users
grep "ai-advisory/generate" logs.txt | \
  grep -oP 'userId":\s*"\K[^"]+' | \
  sort | uniq -c | sort -rn
```

---

## 📈 Expected Usage

### **Per User (Typical Farmer):**
- 5 AI recommendations/week
- 260 requests/year
- Cost: ~$0.003/year per user

### **Platform (1000 users):**
- 5,000 requests/week
- 260,000 requests/year
- Cost: ~$3,120/year
- ~$260/month

### **Platform (10,000 users):**
- 50,000 requests/week
- 2,600,000 requests/year
- Cost: ~$31,200/year
- ~$2,600/month

---

## 🎓 Best Practices

### **DO:**
- ✅ Monitor credit balance weekly
- ✅ Set up usage alerts
- ✅ Cache common recommendations
- ✅ Use appropriate model for task complexity
- ✅ Test in fallback mode regularly

### **DON'T:**
- ❌ Use GPT-4 for all requests
- ❌ Set max_tokens higher than needed
- ❌ Generate recommendations on every page load
- ❌ Ignore 402 errors
- ❌ Forget to update payment method

---

## 🔐 Security Notes

### **API Key Management:**
- Stored in Supabase environment variables
- Never commit to git
- Rotate quarterly
- Monitor for unauthorized access

### **Rate Limiting:**
Consider adding user-level limits:
- Free tier: 5 AI queries/week
- Basic tier: 20 AI queries/week
- Premium tier: Unlimited

---

## 📞 Support Contacts

### **OpenRouter Support:**
- Email: support@openrouter.ai
- Discord: https://discord.gg/openrouter
- Docs: https://openrouter.ai/docs

### **Internal Team:**
- Backend issues: Check `/supabase/functions/server/index.tsx`
- Frontend issues: Check `/components/AIRecommendations.tsx`
- Credits/billing: Team lead

---

## 🧪 Testing Fallback Mode

### **Simulate 402 Error:**
```typescript
// Temporarily in /supabase/functions/server/index.tsx
// Comment out the real API call

const aiResponse = await openrouter.queryAI(...);

// Replace with:
throw new Error("AI service error: 402");
```

### **Expected Behavior:**
1. ✅ Yellow warning banner appears
2. ✅ Sample recommendations display
3. ✅ No console errors
4. ✅ All tabs still functional
5. ✅ Language toggle works

---

## 📋 Monthly Maintenance Checklist

- [ ] Check OpenRouter credit balance
- [ ] Review usage patterns
- [ ] Verify fallback mode still works
- [ ] Update cost projections
- [ ] Optimize token usage if needed
- [ ] Test with real AI data
- [ ] Review error logs
- [ ] Update this guide if needed

---

## 💡 Future Enhancements

1. **Admin Dashboard**
   - Real-time credit monitoring
   - Usage analytics per user
   - Cost projections

2. **Smart Caching**
   - Store successful recommendations
   - Reuse for similar farmers
   - 90% cache hit rate target

3. **Hybrid Approach**
   - Local AI for basic tasks
   - Cloud AI for complex analysis
   - Further cost reduction

4. **User Quotas**
   - Tiered access to AI features
   - Monetization opportunity
   - Sustainable growth model

---

**Last Updated:** January 20, 2026
**Version:** 1.0
**Status:** Active
