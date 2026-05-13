# 🧪 KILIMO Testing Guide - RBAC & Dynamic Onboarding

## Testing Matrix Overview

This guide provides **comprehensive E2E testing scenarios** for the KILIMO Agri-AI Suite's role-based access control (RBAC) and dynamic onboarding systems.

---

## 📊 Complete Testing Matrix

| User Type | Onboarding | Dashboard | AI Prompts | Feature Access | Mobile | Web | Backend API |
|-----------|------------|-----------|------------|----------------|--------|-----|-------------|
| **Smallholder Farmer** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Farmer (5+ acres)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Farm Manager** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Commercial Farm Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Agribusiness Ops** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Extension Officer** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Cooperative Leader** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🎯 Test Scenarios

### **1. Dynamic Onboarding Forms**

#### **Test 1.1: Smallholder Farmer Onboarding**

**Steps:**
1. Register new user
2. Select role: "Smallholder Farmer"
3. Complete registration
4. Observe onboarding form

**Expected Results:**
```
✅ Form loads with 6 fields:
   - Farm size (number, max 5)
   - Main crop (select dropdown)
   - Has livestock? (checkbox)
   - Livestock type (multiselect, hidden initially)
   - Region (select dropdown)
   - Preferred language (select dropdown)

✅ When "Has livestock?" is checked:
   - "Livestock type" field appears

✅ When "Has livestock?" is unchecked:
   - "Livestock type" field disappears
```

**Test Data:**
```json
{
  "farm_size": 2.5,
  "main_crop": "Maize",
  "has_livestock": true,
  "livestock_type": ["Chickens", "Goats"],
  "region": "Arusha",
  "preferred_language": "English"
}
```

---

#### **Test 1.2: Farm Manager Onboarding**

**Steps:**
1. Register new user
2. Select role: "Farm Manager"
3. Complete registration
4. Observe onboarding form

**Expected Results:**
```
✅ Form loads with 7 fields:
   - Team size (number)
   - Number of fields (number)
   - Total acreage (number, min 10)
   - Multi-crop? (checkbox)
   - Has machinery? (checkbox)
   - Region (select)
   - Preferred language (select)
```

**Test Data:**
```json
{
  "team_size": 15,
  "num_fields": 5,
  "total_acreage": 100,
  "multi_crop": true,
  "has_machinery": true,
  "region": "Dodoma",
  "preferred_language": "English"
}
```

---

#### **Test 1.3: Extension Officer Onboarding**

**Steps:**
1. Register new user
2. Select role: "Extension Officer"
3. Complete registration
4. Observe onboarding form

**Expected Results:**
```
✅ Form loads with 6 fields:
   - Organization name (text)
   - Organization type (select)
   - Farmers served (number)
   - Specialization (multiselect)
   - Operating regions (multiselect)
   - Preferred language (select)
```

**Test Data:**
```json
{
  "organization_name": "Ministry of Agriculture",
  "organization_type": "Government",
  "farmers_served": 500,
  "specialization": ["Crop Production", "Pest Control"],
  "operates_regions": ["Arusha", "Kilimanjaro", "Mwanza"],
  "preferred_language": "Swahili"
}
```

---

### **2. Form Validation**

#### **Test 2.1: Required Field Validation**

**Steps:**
1. Load onboarding form
2. Leave required field empty
3. Click "Continue"

**Expected Results:**
```
✅ Red border appears on empty field
✅ Error message displays: "[Field name] is required"
✅ Form does not submit
✅ Other fields remain valid
```

---

#### **Test 2.2: Number Range Validation**

**Steps:**
1. Enter value below minimum (e.g., farm_size = -1)
2. Click "Continue"

**Expected Results:**
```
✅ Error message: "Minimum value is 0"
✅ Form does not submit

# Then:
1. Enter value above maximum (e.g., farm_size = 10 for smallholder)
2. Click "Continue"

✅ Error message: "Maximum value is 5"
✅ Form does not submit
```

---

#### **Test 2.3: Error Clearance**

**Steps:**
1. Trigger validation error
2. Correct the field value

**Expected Results:**
```
✅ Error message disappears
✅ Red border changes to green on focus
✅ Form becomes submittable
```

---

### **3. Bilingual Support**

#### **Test 3.1: Language Switching**

**Steps:**
1. Load onboarding form
2. Select "Swahili" from language dropdown

**Expected Results:**
```
✅ All labels switch to Swahili:
   "Farm size (acres)" → "Ukubwa wa shamba (ekari)"
   "Main crop" → "Zao kuu"
   "Do you raise livestock?" → "Je, unafuga mifugo?"

✅ All dropdown options switch to Swahili:
   "Maize" → "Mahindi"
   "Rice" → "Mchele"
   "Beans" → "Maharagwe"

✅ Button text switches:
   "Continue" → "Endelea"
   "Skip for now" → "Ruka"
```

---

#### **Test 3.2: AI Prompts in Swahili**

**Steps:**
1. Complete onboarding in Swahili
2. Navigate to AI Chat
3. Ask question: "Ninawezaje kupunguza wadudu?"

**Expected Results:**
```
✅ AI responds in Swahili
✅ Prompt includes:
   "Wewe ni Sankofa AI, mshauri mtaalamu wa kilimo..."
   "Jibu kwa Kiswahili tu"
```

---

### **4. Role-Based Dashboard Access**

#### **Test 4.1: Smallholder Farmer Dashboard**

**Steps:**
1. Login as Smallholder Farmer
2. Navigate to Dashboard

**Expected Results:**
```
✅ Quick actions show:
   - Plant New Crop
   - Check Weather
   - Ask Sankofa AI
   - View Market Prices

✅ Sidebar shows:
   - Crop Planning ✅
   - Livestock Monitor ✅
   - Yield Forecast ✅
   - AI Chat ✅
   - Market Prices ✅
   - Weather ✅

✅ Sidebar DOES NOT show:
   - Farm Mapping ❌ (locked)
   - Analytics Dashboard ❌ (locked)
   - Team Management ❌ (locked)
```

---

#### **Test 4.2: Farm Manager Dashboard**

**Steps:**
1. Login as Farm Manager
2. Navigate to Dashboard

**Expected Results:**
```
✅ Quick actions show:
   - Assign Task
   - View Analytics
   - Farm Graph
   - Team Overview

✅ Sidebar shows:
   - Crop Planning ✅
   - Farm Mapping ✅
   - Digital Farm Twin ✅
   - Task Management ✅
   - Analytics Dashboard ✅
   - Team Management ✅

✅ Sidebar DOES NOT show:
   - Marketplace ❌ (locked)
   - Contract Farming ❌ (locked)
```

---

#### **Test 4.3: Extension Officer Dashboard**

**Steps:**
1. Login as Extension Officer
2. Navigate to Dashboard

**Expected Results:**
```
✅ Quick actions show:
   - Add Farmer
   - View Farmer Lab
   - Send SMS Alert
   - View Impact Analytics

✅ Sidebar shows:
   - Farmer Lab ✅
   - Cooperative Dashboard ✅
   - Analytics Dashboard ✅
   - AI Recommendations ✅
   - SMS Alerts ✅
   - Field Notes ✅
```

---

### **5. Feature Lock & Upgrade Prompts**

#### **Test 5.1: Locked Feature Click**

**Steps:**
1. Login as Smallholder Farmer
2. Click on "Farm Mapping" (locked feature)

**Expected Results:**
```
✅ Upgrade modal appears:
   Title: "Upgrade to Access Farm Mapping"
   Subtitle: "Available in Farmer (5+ acres) and above"

✅ Modal shows comparison table:
   Current: Smallholder Farmer
   Recommended: Farmer or Farm Manager

✅ "Upgrade" button displays
✅ "Learn More" link displays
```

---

#### **Test 5.2: Upgrade Modal Comparison**

**Steps:**
1. Trigger upgrade modal
2. Review feature comparison

**Expected Results:**
```
✅ Table shows:
   Feature          | Current | Farmer | Farm Manager
   Crop Planning    |    ✅   |   ✅   |      ✅
   Farm Mapping     |    ❌   |   ✅   |      ✅
   Analytics        |    ❌   |   ❌   |      ✅
   Team Management  |    ❌   |   ❌   |      ✅
```

---

### **6. AI Prompt Generation**

#### **Test 6.1: Role-Specific Crop Planning Prompt**

**Steps:**
1. Login as Smallholder Farmer with profile:
   ```json
   {
     "farm_size": 3,
     "main_crop": "Maize",
     "region": "Arusha"
   }
   ```
2. Navigate to Crop Planning
3. Click "Get AI Recommendations"

**Expected System Prompt:**
```
You are Sankofa AI, an expert agricultural advisor for the KILIMO Agri-AI Suite, specifically helping smallholder farmers in Tanzania (typically 0-5 acres).

Your expertise includes:
- Practical, low-cost farming solutions
- Family farm planning and subsistence farming
...

Feature: CROP PLANNING ASSISTANT

Provide practical crop planning advice including:
- Best crops for the user's region and farm size
- Planting calendar and seasonal timing
...

USER CONTEXT:
- Farm size: 3 acres
- Main crop: Maize
- Region: Arusha, Tanzania

LANGUAGE INSTRUCTIONS:
- Respond in English only
- Use simple, clear language
...
```

**Expected AI Response:**
```
Based on your 3-acre farm in Arusha, here are my recommendations:

1. Quick Recommendation:
   Continue with maize as your primary crop, but consider intercropping
   with beans to improve soil fertility and provide additional income.

2. Detailed Plan:
   - Main Season (March-May):
     * Plant hybrid maize variety (DK8031) - 12kg of seed
     * Intercrop with climbing beans (2kg)
     * Apply DAP fertilizer at planting (50kg)
   
   - Short Rains (October-December):
     * Plant quick-maturing maize (SC627) - 8kg
     * Consider vegetables for market (tomatoes, cabbage)

3. Key Considerations:
   - Risk: Late rains in Arusha - wait for soil moisture
   - Alternative: Add sunflower as cash crop
   - Pest watch: Fall armyworm season (spray early)

4. Expected Timeline:
   - Maize: 120-140 days to maturity
   - Beans: 90 days
   - Expected yield: 15-18 bags/acre with good management
```

---

#### **Test 6.2: Farm Manager AI Prompt (Different Tone)**

**Steps:**
1. Login as Farm Manager with profile:
   ```json
   {
     "team_size": 20,
     "num_fields": 8,
     "total_acreage": 200
   }
   ```
2. Navigate to Task Management
3. Ask AI: "How should I allocate my team for planting season?"

**Expected System Prompt:**
```
You are Sankofa AI, an expert agricultural advisor for the KILIMO Agri-AI Suite, helping farm managers overseeing multi-field operations in Tanzania.

Your expertise includes:
- Team management and labor optimization
- Multi-field coordination and scheduling
- Resource allocation across operations
...

Feature: FARM TASK MANAGEMENT

Provide task planning and scheduling advice including:
- Priority task ordering
- Resource allocation
- Team assignments
...

USER CONTEXT:
- Number of farm workers: 20
- Number of fields managed: 8
- Total acreage managed: 200

LANGUAGE INSTRUCTIONS:
- Respond in English only
- Professional and data-driven
...
```

**Expected AI Response:**
```
Here's an optimized team allocation strategy for your 200-acre, 8-field operation:

TEAM STRUCTURE:
- Field Team Leaders: 2 (1:4 field ratio)
- Planting Crews: 12 workers (3 crews of 4)
- Equipment Operators: 3 (tractor, planter, sprayer)
- Support Staff: 3 (logistics, quality control, records)

ALLOCATION BY FIELD:
Field 1-2 (50 acres): Crew A (4 workers) + Tractor operator
Field 3-4 (50 acres): Crew B (4 workers) + Planter operator  
Field 5-6 (50 acres): Crew C (4 workers) + Sprayer operator
Field 7-8 (50 acres): Rotation crews + equipment on standby

DAILY TARGETS:
- Each crew: 6-8 acres/day (depends on crop)
- Total capacity: 18-24 acres/day
- Complete 200 acres: 9-12 working days

SCHEDULING:
Week 1: Fields 1-4 (prioritize best soil moisture)
Week 2: Fields 5-8 (allow Field 1-4 to germinate)
Week 3: Quality checks, replanting, weed control

KPIs TO TRACK:
- Acres planted per day per crew
- Seed/fertilizer usage vs. plan
- Replanting needs (target <5%)
- Worker productivity (compare crews)

RISK MITIGATION:
- Buffer: 2 extra workers for sick leave/delays
- Equipment backup: Have manual tools ready
- Weather contingency: Prioritize fields with best drainage
```

---

### **7. Backend API Protection**

#### **Test 7.1: Unauthorized Feature Access**

**Steps:**
1. Login as Smallholder Farmer (no analytics access)
2. Manually call API:
   ```bash
   curl -X GET https://xxx.supabase.co/functions/v1/make-server-ce1844e7/analytics \
     -H "Authorization: Bearer ${ACCESS_TOKEN}"
   ```

**Expected Results:**
```
✅ HTTP 403 Forbidden
✅ Response body:
   {
     "error": "Unauthorized",
     "message": "Your role (smallholder_farmer) does not have access to this feature. Upgrade to Farm Manager or higher."
   }
```

---

#### **Test 7.2: Authorized Feature Access**

**Steps:**
1. Login as Farm Manager (has analytics access)
2. Call API:
   ```bash
   curl -X GET https://xxx.supabase.co/functions/v1/make-server-ce1844e7/analytics \
     -H "Authorization: Bearer ${ACCESS_TOKEN}"
   ```

**Expected Results:**
```
✅ HTTP 200 OK
✅ Response body:
   {
     "analytics": { ... },
     "message": "Success"
   }
```

---

### **8. Mobile Navigation (Role-Based)**

#### **Test 8.1: Smallholder Mobile Nav**

**Steps:**
1. Login as Smallholder Farmer
2. View on mobile (< 768px width)
3. Check bottom navigation

**Expected Results:**
```
✅ Bottom nav removed (no navigation items)
✅ Navigation via sidebar menu only
✅ Sidebar menu shows role-specific items
```

---

### **9. Admin Panel (Role Management)**

#### **Test 9.1: View All Users**

**Steps:**
1. Login as Admin
2. Navigate to Admin Panel
3. Click "Manage Users"

**Expected Results:**
```
✅ Table displays all users:
   Name | Email | Role | Status | Actions

✅ Each row shows:
   - User avatar
   - Name
   - Email
   - Role badge (color-coded)
   - Active/Inactive status
   - Actions: Edit Role, View Profile, Delete
```

---

#### **Test 9.2: Change User Role**

**Steps:**
1. Admin Panel → Manage Users
2. Click "Edit Role" for a user
3. Select new role from dropdown
4. Click "Save"

**Expected Results:**
```
✅ Modal appears with role selection
✅ Shows current role: "Smallholder Farmer"
✅ Dropdown with all 7 roles
✅ Select "Farmer"
✅ Click "Save"
✅ Success toast: "Role updated successfully"
✅ User row updates with new role badge
✅ User's dashboard updates on next login
```

---

### **10. Performance Testing**

#### **Test 10.1: Form Load Time**

**Steps:**
1. Clear browser cache
2. Register new user
3. Measure time from role selection to form display

**Expected Results:**
```
✅ Form loads in < 500ms
✅ No visible loading flicker
✅ Smooth animation transitions
```

---

#### **Test 10.2: AI Prompt Generation Speed**

**Steps:**
1. Navigate to AI Chat
2. Ask question
3. Measure prompt generation time

**Expected Results:**
```
✅ Prompt generates in < 50ms
✅ No noticeable delay
✅ Immediate API call
```

---

## 🛠️ Testing Tools

### **Recommended Tools:**

1. **E2E Testing:** Playwright or Cypress
2. **API Testing:** Postman or Insomnia
3. **Mobile Testing:** Chrome DevTools (Device Mode)
4. **Performance:** Lighthouse
5. **Database:** Supabase Dashboard

### **Playwright Example:**

```typescript
import { test, expect } from '@playwright/test';

test('Smallholder farmer onboarding', async ({ page }) => {
  // Navigate to registration
  await page.goto('http://localhost:3000');
  await page.click('text=Register');
  
  // Fill registration form
  await page.fill('input[name="name"]', 'Test Farmer');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.selectOption('select[name="role"]', 'smallholder_farmer');
  await page.click('button[type="submit"]');
  
  // Wait for onboarding form
  await expect(page.locator('text=Tell us more about yourself')).toBeVisible();
  
  // Fill onboarding form
  await page.fill('input[name="farm_size"]', '2.5');
  await page.selectOption('select[name="main_crop"]', 'Maize');
  await page.check('input[name="has_livestock"]');
  await page.click('button:has-text("Chickens")');
  await page.selectOption('select[name="region"]', 'Arusha');
  await page.selectOption('select[name="preferred_language"]', 'English');
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Verify dashboard
  await expect(page.locator('text=Welcome to KILIMO')).toBeVisible();
});
```

---

## ✅ Checklist

### **Before Release:**

- [ ] All 7 roles tested on onboarding
- [ ] Form validation works for all field types
- [ ] Bilingual support tested (English & Swahili)
- [ ] Conditional fields show/hide correctly
- [ ] Dashboard quick actions match role
- [ ] Sidebar navigation filters by role
- [ ] Locked features show upgrade modals
- [ ] Backend API enforces role permissions
- [ ] AI prompts generate correctly for all roles
- [ ] Mobile responsive (tested on iOS/Android)
- [ ] Admin panel role management works
- [ ] Performance benchmarks met
- [ ] Error handling graceful
- [ ] Database migration successful
- [ ] Documentation complete

---

## 📞 Support

**Found a bug?**
- Check error logs in browser console
- Check network tab for failed API calls
- Check Supabase logs for database errors

**Need help?**
- See `/DYNAMIC_ONBOARDING_IMPLEMENTATION.md`
- See `/supabase/migrations/001_role_features_and_forms.sql`
- See `/components/DynamicRoleOnboarding.tsx`

---

**🌾 KILIMO Agri-AI Suite - Thoroughly Tested, Production Ready**
