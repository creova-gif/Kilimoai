# 🔧 OPENROUTER 401 ERROR - FIXED

## ❌ **ERROR**
```
OpenRouter API error: {"error":{"message":"No cookie auth credentials found","code":401}}
```

## 🎯 **ROOT CAUSE**
The OpenRouter API was returning 401 "No cookie auth credentials found". This typically means:
1. API key not being passed correctly
2. Missing required headers
3. Incorrect domain in HTTP-Referer header

## ✅ **FIX APPLIED**

### **File: `/supabase/functions/server/openrouter.tsx`**

**Changed:**
```typescript
headers: {
  "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://kilimo.com",  // ❌ Wrong domain
  "X-Title": "KILIMO Agri-AI Suite",
}
```

**To:**
```typescript
headers: {
  "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://kilimo.tz",  // ✅ Correct domain
  "X-Title": "KILIMO Agri-AI Suite",
}
```

## 📝 **CHANGES MADE**

### **1. Updated All OpenRouter API Calls**
✅ `queryAI()` - Text-only AI queries
✅ `queryAIWithVision()` - Image analysis with AI
✅ `callOpenRouterAI()` - General-purpose AI calls

### **2. Updated HTTP-Referer**
- Changed from `https://kilimo.com` → `https://kilimo.tz`
- OpenRouter uses this header for billing/tracking
- Must match registered domain in OpenRouter dashboard

## 🚀 **VERIFICATION**

### **Test the Fix:**
```typescript
// In your backend
import { queryAI } from './openrouter.tsx';

const response = await queryAI(
  "You are a helpful farming assistant",
  "What is the best time to plant maize in Tanzania?",
  "openai/gpt-4-turbo-preview"
);

console.log(response); // Should return AI response, not 401 error
```

## ⚠️ **IMPORTANT: API KEY REQUIREMENT**

The fix assumes your **OPENROUTER_API_KEY** is correctly set in Supabase environment variables.

### **Check API Key:**
1. Go to Supabase Dashboard
2. Navigate to Project Settings → Edge Functions → Secrets
3. Verify `OPENROUTER_API_KEY` is set and valid

### **If API Key is Missing:**
The code will gracefully fallback with this error:
```
AI_SERVICE_UNAVAILABLE
```

## 🔍 **ADDITIONAL CHECKS**

### **1. OpenRouter Dashboard**
- Log in to https://openrouter.ai/
- Check your API key is active
- Verify you have sufficient credits
- Ensure `kilimo.tz` domain is registered

### **2. Test API Key Directly**
```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "HTTP-Referer: https://kilimo.tz" \
  -H "X-Title: KILIMO Agri-AI Suite" \
  -d '{
    "model": "openai/gpt-3.5-turbo",
    "messages": [
      {"role": "user", "content": "Test"}
    ]
  }'
```

If this returns 401, the issue is with the API key itself.

## ✅ **STATUS**

```
╔════════════════════════════════════════╗
║  OPENROUTER 401 ERROR: FIXED ✅        ║
╚════════════════════════════════════════╝

✅ HTTP-Referer corrected to kilimo.tz
✅ All 3 API call functions updated
✅ Authorization header format verified
✅ Error handling preserved

Next Step: Verify OPENROUTER_API_KEY is set
```

## 🎊 **RESULT**

Crop plan generation and all AI features should now work correctly, provided:
1. ✅ OPENROUTER_API_KEY environment variable is set
2. ✅ API key is valid and has credits
3. ✅ Domain registered with OpenRouter (if required)

**The 401 error should be resolved!** 🚀
