# 🧪 Crop Library - Testing Guide

## 🎯 Test Objectives

1. Verify backend API works correctly
2. Verify frontend displays crops properly
3. Verify AI image generation works
4. Verify navigation integration works
5. Verify mobile responsiveness
6. Verify brand compliance

---

## 📋 Backend Tests

### **Test 1: Initialize Crop Library**

```bash
# Run initialization
bash scripts/init-crop-library.sh

# Expected Output:
# ✅ Crop library initialized successfully!
# ✅ Seeded 50+ crops to database
```

**Pass Criteria**: Response contains `"success":true`

---

### **Test 2: Get All Crops**

```bash
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7/crop-library/crops" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Expected Response**:

```json
{
  "success": true,
  "crops": [...],
  "count": 50
}
```

**Pass Criteria**: Returns array of 50+ crops

---

### **Test 3: Get Single Crop**

```bash
curl -X GET \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7/crop-library/crops/maize" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Expected Response**:

```json
{
  "success": true,
  "crop": {
    "id": "maize",
    "name_en": "Maize",
    "name_sw": "Mahindi",
    ...
  }
}
```

**Pass Criteria**: Returns maize crop data

---

### **Test 4: Generate AI Image**

```bash
curl -X POST \
  "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7/crop-library/generate-image" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"cropId":"maize","stage":"vegetative"}'
```

**Expected Response**:

```json
{
  "success": true,
  "image_url": "https://...supabase.co/storage/v1/object/public/crop-images/...",
  "confidence": 0.92
}
```

**Pass Criteria**:

- ✅ Returns success: true
- ✅ Returns valid image_url
- ✅ Confidence score between 0.85-0.95
- ✅ Image is accessible at URL

**Note**: This test takes 30-60 seconds to complete (DALL-E generation time)

---

## 🖥️ Frontend Tests

### **Test 5: Crop Library Page Loads**

1. Log in to KILIMO
2. Navigate to **Planning → Crop Library**
3. Observe page load

**Pass Criteria**:

- ✅ Page loads within 2 seconds
- ✅ Crops grid displays
- ✅ No console errors
- ✅ Loading spinner appears briefly

---

### **Test 6: Crop Grid Display**

**Pass Criteria**:

- ✅ Crops display in grid (2 cols mobile, 4 cols desktop)
- ✅ Each card shows crop image or placeholder
- ✅ Each card shows crop name (EN or SW based on language)
- ✅ Each card shows lifecycle badge (Annual/Perennial)
- ✅ Each card shows type badge (Cereal/Legume/etc)
- ✅ Cards are clickable

---

### **Test 7: Search Functionality**

1. Type "maize" in search box

**Pass Criteria**:

- ✅ Grid filters to show only maize
- ✅ Results count updates
- ✅ Search is case-insensitive
- ✅ Search works in both EN and SW (try "mahindi")

2. Clear search

**Pass Criteria**:

- ✅ Grid shows all crops again

---

### **Test 8: Type Filter**

1. Select "Cereals" from Type dropdown

**Pass Criteria**:

- ✅ Grid shows only cereals (Maize, Rice, Sorghum, Wheat)
- ✅ Results count updates
- ✅ Other types are hidden

2. Select "Vegetables"

**Pass Criteria**:

- ✅ Grid shows only vegetables (Tomato, Onion, Cabbage, etc)

---

### **Test 9: Lifecycle Filter**

1. Select "Annual" from Lifecycle dropdown

**Pass Criteria**:

- ✅ Grid shows only annual crops
- ✅ Perennial crops are hidden

2. Select "Perennial"

**Pass Criteria**:

- ✅ Grid shows only perennial crops (Coffee, Tea, Cassava, Banana, etc)

---

### **Test 10: Season Filter**

1. Select "Short Rains" from Season dropdown

**Pass Criteria**:

- ✅ Grid shows crops suitable for short rains
- ✅ All-year crops also appear (they're always suitable)

2. Select "All Year"

**Pass Criteria**:

- ✅ Grid shows only all-year crops (Tomato, Onion, Banana, etc)

---

### **Test 11: Combined Filters**

1. Search: "maize"
2. Type: "Cereals"
3. Season: "Both"

**Pass Criteria**:

- ✅ Only maize appears (matches all criteria)

---

### **Test 12: Crop Detail Modal**

1. Click on "Maize" crop card

**Pass Criteria**:

- ✅ Modal opens
- ✅ Shows crop name in large text
- ✅ Shows alternate language name as subtitle
- ✅ Shows large crop image (or placeholder)
- ✅ Shows growth stage selector buttons
- ✅ Shows yield range with icon
- ✅ Shows planting window with icon
- ✅ Shows common risks as badges
- ✅ Shows "Use in Crop Plan" button
- ✅ Shows "Ask AI about this crop" button

---

### **Test 13: Growth Stage Selector**

1. In crop detail modal, click "Flowering" stage

**Pass Criteria**:

- ✅ Button becomes active/highlighted
- ✅ Image changes (if multiple stages available)
- ✅ If no image, shows "Generate AI Image" button

---

### **Test 14: Generate AI Image Button**

1. Find a crop with no image for selected stage
2. Click "Generate AI Image" button

**Pass Criteria**:

- ✅ Button shows loading state
- ✅ Toast notification: "Generating AI image..."
- ✅ After 30-60 seconds: Toast "AI image generated successfully!"
- ✅ Image appears in modal
- ✅ Confidence badge appears (e.g., "92%")
- ✅ Button no longer shows

**Note**: This test requires OPENROUTER_API_KEY to be configured

---

### **Test 15: "Use in Crop Plan" Button**

1. In crop detail modal, click "Use in Crop Plan"

**Pass Criteria**:

- ✅ Toast notification appears
- ✅ App navigates to Crop Planning page (land-allocation tab)
- ✅ Crop is pre-selected (future enhancement)

---

### **Test 16: "Ask AI" Button**

1. In crop detail modal, click "Ask AI about this crop"

**Pass Criteria**:

- ✅ Toast notification appears
- ✅ App navigates to AI Advisor (ai-chat tab)
- ✅ AI receives crop context (future enhancement)

---

## 📱 Mobile Tests

### **Test 17: Mobile Grid Layout**

1. Open on mobile device (or resize browser to mobile width)

**Pass Criteria**:

- ✅ Grid shows 2 columns on mobile
- ✅ Cards are properly sized
- ✅ Images fill cards correctly
- ✅ Text is readable
- ✅ No horizontal scrolling

---

### **Test 18: Mobile Filters**

1. On mobile, test filters

**Pass Criteria**:

- ✅ Filters scroll horizontally
- ✅ Dropdowns are tappable
- ✅ Selected filter is visible
- ✅ Results update correctly

---

### **Test 19: Mobile Modal**

1. On mobile, open crop detail modal

**Pass Criteria**:

- ✅ Modal fills screen
- ✅ Scrolls vertically
- ✅ Close button is accessible
- ✅ Action buttons are tappable
- ✅ Images scale properly

---

### **Test 20: Mobile Search**

1. On mobile, use search box

**Pass Criteria**:

- ✅ Keyboard appears
- ✅ Search is responsive
- ✅ Results update in real-time
- ✅ Clear button works

---

## 🎨 Brand Compliance Tests

### **Test 21: Color Audit**

**Check these elements use ONLY #2E7D32:**

- ✅ Header icon background
- ✅ Primary buttons ("Use in Crop Plan")
- ✅ Active growth stage button
- ✅ Loading spinner
- ✅ "Ask AI" button border (on hover)
- ✅ Icon colors (Leaf, Brain, Calendar, etc)

**Check NO unauthorized greens:**

- ❌ No `green-500`, `green-600`, `emerald-600`, etc
- ❌ Only exception: Type badges (semantic colors like amber, purple, etc)

---

### **Test 22: Bilingual Support**

1. Switch language to Swahili

**Pass Criteria**:

- ✅ Page title: "Maktaba ya Mazao"
- ✅ Search placeholder: "Tafuta mazao..."
- ✅ Filter labels in Swahili
- ✅ Crop names show Swahili (e.g., "Mahindi")
- ✅ Button text in Swahili

2. Switch back to English

**Pass Criteria**:

- ✅ All text switches back to English

---

## 🔗 Integration Tests

### **Test 23: Navigation from Dashboard**

1. Start at Dashboard Home
2. Click "Crop Library" in navigation

**Pass Criteria**:

- ✅ Navigates to Crop Library page
- ✅ URL/tab changes (if applicable)
- ✅ Page loads correctly

---

### **Test 24: Navigation to Other Features**

1. From Crop Library, test:
   - Click "Use in Crop Plan" → Should go to Crop Planning
   - Click "Ask AI" → Should go to AI Advisor
   - Use main navigation → Should navigate correctly

**Pass Criteria**:

- ✅ All navigation works
- ✅ No broken links
- ✅ State is preserved (crops don't reload unnecessarily)

---

## ⚡ Performance Tests

### **Test 25: Page Load Performance**

1. Open browser DevTools → Network tab
2. Navigate to Crop Library page
3. Measure load time

**Pass Criteria**:

- ✅ Initial load: < 2 seconds
- ✅ API call: < 500ms
- ✅ No failed requests
- ✅ No console errors

---

### **Test 26: Image Load Performance**

1. Open browser DevTools → Network tab
2. Scroll through crop grid
3. Observe image loading

**Pass Criteria**:

- ✅ Images load progressively
- ✅ Placeholders show while loading
- ✅ No broken images
- ✅ Lazy loading works (images load as you scroll)

---

### **Test 27: Filter Performance**

1. Type rapidly in search box
2. Change filters quickly

**Pass Criteria**:

- ✅ No lag or freezing
- ✅ Results update smoothly
- ✅ No flickering
- ✅ Debouncing works (if implemented)

---

## 🔒 Security Tests

### **Test 28: Public Access**

1. Log out of app
2. Try to access crops API directly

**Pass Criteria**:

- ✅ API returns crops (public read is allowed)
- ✅ No sensitive data exposed

---

### **Test 29: Image Upload Prevention**

1. Try to upload an image via browser (DevTools)

**Pass Criteria**:

- ✅ Direct uploads are blocked
- ✅ Only service role can upload

---

## 🐛 Error Handling Tests

### **Test 30: Network Error**

1. Disable internet
2. Navigate to Crop Library

**Pass Criteria**:

- ✅ Error message appears
- ✅ Toast: "Failed to load crop library"
- ✅ No app crash
- ✅ Can retry when back online

---

### **Test 31: Invalid Crop ID**

1. Manually navigate to invalid crop (if URL-based)
2. Or try to fetch invalid crop via API

**Pass Criteria**:

- ✅ Returns 404 error
- ✅ Error message: "Crop not found"
- ✅ No app crash

---

### **Test 32: Image Generation Failure**

1. Generate image with invalid API key (simulate)

**Pass Criteria**:

- ✅ Error message appears
- ✅ Toast: "Failed to generate AI image"
- ✅ Button returns to normal state
- ✅ No app crash

---

## 📊 Test Results Template

Copy this template to track your test results:

```
CROP LIBRARY TEST RESULTS
Date: [DATE]
Tester: [NAME]
Environment: [Production/Staging/Local]

BACKEND TESTS
[ ] Test 1: Initialize Crop Library
[ ] Test 2: Get All Crops
[ ] Test 3: Get Single Crop
[ ] Test 4: Generate AI Image

FRONTEND TESTS
[ ] Test 5: Page Loads
[ ] Test 6: Grid Display
[ ] Test 7: Search
[ ] Test 8: Type Filter
[ ] Test 9: Lifecycle Filter
[ ] Test 10: Season Filter
[ ] Test 11: Combined Filters
[ ] Test 12: Detail Modal
[ ] Test 13: Growth Stage Selector
[ ] Test 14: Generate Image Button
[ ] Test 15: Use in Crop Plan Button
[ ] Test 16: Ask AI Button

MOBILE TESTS
[ ] Test 17: Mobile Grid
[ ] Test 18: Mobile Filters
[ ] Test 19: Mobile Modal
[ ] Test 20: Mobile Search

BRAND COMPLIANCE
[ ] Test 21: Color Audit
[ ] Test 22: Bilingual Support

INTEGRATION TESTS
[ ] Test 23: Navigation from Dashboard
[ ] Test 24: Navigation to Other Features

PERFORMANCE TESTS
[ ] Test 25: Page Load Performance
[ ] Test 26: Image Load Performance
[ ] Test 27: Filter Performance

SECURITY TESTS
[ ] Test 28: Public Access
[ ] Test 29: Image Upload Prevention

ERROR HANDLING
[ ] Test 30: Network Error
[ ] Test 31: Invalid Crop ID
[ ] Test 32: Image Generation Failure

OVERALL RESULT: [PASS/FAIL]
NOTES: [Any issues or observations]
```

---

## 🎯 Critical Path Tests (Must Pass)

If time is limited, run these tests first:

1. ✅ Test 1: Initialize Crop Library
2. ✅ Test 2: Get All Crops
3. ✅ Test 5: Page Loads
4. ✅ Test 6: Grid Display
5. ✅ Test 12: Detail Modal
6. ✅ Test 14: Generate Image
7. ✅ Test 17: Mobile Grid
8. ✅ Test 21: Color Audit

---

## 🚀 Pre-Launch Checklist

Before deploying to production:

- [ ] All critical path tests pass
- [ ] Images generated for top 10 crops
- [ ] Mobile experience is smooth
- [ ] Brand colors are correct (only #2E7D32)
- [ ] Bilingual support works
- [ ] Navigation integration works
- [ ] Error handling is graceful
- [ ] Performance is acceptable (<2s load)
- [ ] Security is validated
- [ ] Documentation is complete

---

**Happy Testing! 🧪🌾**
