# 🚀 Dynamic Role-Based Onboarding - Implementation Guide

## Overview

The KILIMO Agri-AI Suite now features a **fully dynamic, database-driven onboarding system** that adapts forms and AI prompts based on user roles. This eliminates hardcoded forms and enables rapid customization without code changes.

---

## 🗄️ Database Schema

### **1. `role_features` Table**

Stores which features each role can access.

```sql
CREATE TABLE role_features (
  id SERIAL PRIMARY KEY,
  role_name TEXT NOT NULL UNIQUE,
  features JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Example Row:**
```json
{
  "role_name": "smallholder_farmer",
  "features": [
    "crop_planning",
    "livestock_monitor",
    "ai_chatbot",
    "sms_alerts",
    "weather_forecasts"
  ]
}
```

### **2. `role_forms` Table**

Stores dynamic onboarding form schemas for each role.

```sql
CREATE TABLE role_forms (
  id SERIAL PRIMARY KEY,
  role_name TEXT NOT NULL UNIQUE,
  form_schema JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Example Row (Smallholder Farmer):**
```json
{
  "role_name": "smallholder_farmer",
  "form_schema": [
    {
      "field": "farm_size",
      "type": "number",
      "label": "Farm size (acres)",
      "label_sw": "Ukubwa wa shamba (ekari)",
      "required": true,
      "min": 0,
      "max": 5,
      "placeholder": "e.g., 2.5"
    },
    {
      "field": "main_crop",
      "type": "select",
      "label": "Main crop",
      "label_sw": "Zao kuu",
      "required": true,
      "options": ["Maize", "Rice", "Beans", "Cassava"]
    },
    {
      "field": "preferred_language",
      "type": "select",
      "label": "Preferred language",
      "required": true,
      "options": ["English", "Swahili"]
    }
  ]
}
```

---

## 📋 Form Field Types

The system supports **6 field types**:

| Type | Description | Props |
|------|-------------|-------|
| **text** | Single-line text input | `placeholder`, `required` |
| **number** | Numeric input with min/max | `min`, `max`, `required`, `placeholder` |
| **checkbox** | Boolean yes/no | `required` |
| **select** | Dropdown (single choice) | `options`, `options_sw`, `required` |
| **multiselect** | Multiple choice (pills) | `options`, `options_sw`, `required` |
| **conditional** | Shows based on another field | `depends_on`, `required` |

### **Field Schema Structure:**

```typescript
{
  field: string;              // Unique field ID
  type: "text" | "number" | "checkbox" | "select" | "multiselect";
  label: string;              // English label
  label_sw?: string;          // Swahili label (optional)
  required?: boolean;         // Is field required?
  min?: number;               // Min value (for number)
  max?: number;               // Max value (for number)
  placeholder?: string;       // Placeholder text
  options?: string[];         // Options for select/multiselect (EN)
  options_sw?: string[];      // Options for select/multiselect (SW)
  depends_on?: string;        // Show only if another field is true
}
```

---

## 🎨 Component: DynamicRoleOnboarding

### **Usage:**

```tsx
import { DynamicRoleOnboarding } from "./components/DynamicRoleOnboarding";

<DynamicRoleOnboarding
  userRole="smallholder_farmer"
  userName="John Doe"
  language="en"
  onComplete={(formData) => {
    console.log("User submitted:", formData);
    // Save to database, redirect to dashboard
  }}
  onSkip={() => {
    console.log("User skipped onboarding");
  }}
/>
```

### **Props:**

```typescript
interface DynamicRoleOnboardingProps {
  userRole: string;                     // e.g., "smallholder_farmer"
  userName: string;                     // Display name
  language?: "en" | "sw";               // Default: "en"
  onComplete: (formData: Record<string, any>) => void;
  onSkip?: () => void;                  // Optional skip handler
}
```

### **Features:**

✅ **Automatic Schema Loading** - Fetches form from Supabase  
✅ **Bilingual Support** - English/Swahili labels & options  
✅ **Real-time Validation** - Inline error messages  
✅ **Conditional Fields** - Show/hide based on dependencies  
✅ **Progress Tracking** - Visual progress bar  
✅ **Mobile Optimized** - Responsive design  
✅ **Graceful Fallback** - Basic form if DB fetch fails  

---

## 🧠 AI Prompt Engine

### **Purpose:**

Generate **role-specific, context-aware AI prompts** for different features.

### **Usage:**

```typescript
import { generateAIPrompt, generateQuickPrompt } from "./utils/aiPromptEngine";

// Full prompt generation
const prompt = generateAIPrompt({
  role: "smallholder_farmer",
  feature: "crop_planning",
  language: "en",
  userName: "John",
  farmSize: 3.5,
  mainCrop: "Maize",
  region: "Arusha"
});

// Quick chatbot prompt
const chatPrompt = generateQuickPrompt(
  "smallholder_farmer",
  "How do I prevent maize weevils?",
  "en"
);

// Send to OpenAI/Claude
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENAI_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gpt-4",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: "What should I plant next?" }
    ]
  })
});
```

### **Supported Features:**

- `crop_planning` - Crop selection and scheduling
- `livestock_monitor` - Animal health and management
- `yield_forecast` - Harvest predictions
- `soil_health_tracking` - Soil management
- `ai_chatbot` - General queries
- `pest_disease_diagnosis` - Pest/disease identification
- `weather_forecasts` - Weather-based advice
- `market_prices` - Market intelligence
- `task_management` - Farm operations
- `analytics_dashboard` - Business insights
- `farm_mapping` - Spatial planning
- `cooperative_dashboard` - Group management
- `marketplace` - Trading advice
- `finance_management` - Financial planning

### **Context Parameters:**

```typescript
interface AIPromptContext {
  role: UserRole | string;          // User role
  feature: FeatureType;             // Feature being used
  language?: "en" | "sw";           // Response language
  
  // User/Farm Context
  userName?: string;
  farmSize?: number;
  mainCrop?: string;
  region?: string;
  crops?: string[];
  livestock?: string[];
  
  // Feature-Specific
  queryText?: string;               // For chatbot
  imageUrl?: string;                // For diagnosis
  fieldName?: string;               // For field-specific
  taskType?: string;                // For tasks
  timeframe?: string;               // For forecasts
}
```

---

## 🔄 Integration Flow

### **1. User Registration**

```typescript
// After user selects role during signup
const role = "smallholder_farmer";
const userName = "John Doe";

// Show dynamic onboarding
setShowDynamicOnboarding(true);
```

### **2. Onboarding Submission**

```typescript
const handleOnboardingComplete = async (formData: Record<string, any>) => {
  // Save to user profile
  await fetch(`${API_BASE}/user/profile`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: currentUser.id,
      onboardingData: formData
    })
  });

  // Store in local state
  setCurrentUser({
    ...currentUser,
    profile: formData
  });

  // Hide onboarding, show dashboard
  setShowDynamicOnboarding(false);
};
```

### **3. AI Query**

```typescript
const handleAIQuery = async (query: string) => {
  // Generate role-specific prompt
  const prompt = generateAIPrompt({
    role: currentUser.role,
    feature: "ai_chatbot",
    language: currentUser.profile?.preferred_language || "en",
    userName: currentUser.name,
    farmSize: currentUser.profile?.farm_size,
    mainCrop: currentUser.profile?.main_crop,
    region: currentUser.profile?.region,
    queryText: query
  });

  // Call AI API
  const response = await fetch(`${API_BASE}/ai/chat`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt, query })
  });

  const data = await response.json();
  return data.response;
};
```

---

## 🗺️ Form Schemas by Role

### **Smallholder Farmer (0-5 acres)**

```json
[
  { "field": "farm_size", "type": "number", "label": "Farm size (acres)", "required": true, "max": 5 },
  { "field": "main_crop", "type": "select", "label": "Main crop", "options": ["Maize", "Rice", "Beans"] },
  { "field": "has_livestock", "type": "checkbox", "label": "Do you raise livestock?" },
  { "field": "livestock_type", "type": "multiselect", "depends_on": "has_livestock", "options": ["Cattle", "Goats", "Chickens"] },
  { "field": "region", "type": "select", "label": "Region", "options": ["Arusha", "Dodoma", "Mwanza"] },
  { "field": "preferred_language", "type": "select", "label": "Language", "options": ["English", "Swahili"] }
]
```

### **Farm Manager (Multi-field)**

```json
[
  { "field": "team_size", "type": "number", "label": "Number of farm workers", "required": true },
  { "field": "num_fields", "type": "number", "label": "Number of fields managed", "required": true },
  { "field": "total_acreage", "type": "number", "label": "Total acreage", "required": true },
  { "field": "multi_crop", "type": "checkbox", "label": "Manage multiple crops?" },
  { "field": "has_machinery", "type": "checkbox", "label": "Manage farm machinery?" },
  { "field": "region", "type": "select", "label": "Region", "options": ["Arusha", "Dodoma"] },
  { "field": "preferred_language", "type": "select", "label": "Language", "options": ["English", "Swahili"] }
]
```

### **Extension Officer**

```json
[
  { "field": "organization_name", "type": "text", "label": "Organization name", "required": true },
  { "field": "organization_type", "type": "select", "label": "Org type", "options": ["Government", "NGO", "Private"] },
  { "field": "farmers_served", "type": "number", "label": "Farmers served", "min": 0 },
  { "field": "specialization", "type": "multiselect", "label": "Specialization", "options": ["Crops", "Livestock", "Irrigation"] },
  { "field": "operates_regions", "type": "multiselect", "label": "Regions", "options": ["Arusha", "Dodoma", "Mwanza"] },
  { "field": "preferred_language", "type": "select", "label": "Language", "options": ["English", "Swahili"] }
]
```

**See `/supabase/migrations/001_role_features_and_forms.sql` for all 7 roles.**

---

## 🧪 Testing

### **Test Scenarios:**

#### **1. Fetch Form Schema**

```typescript
// Test fetching form for smallholder_farmer
const { data, error } = await supabase
  .from("role_forms")
  .select("form_schema")
  .eq("role_name", "smallholder_farmer")
  .single();

console.log("Form schema:", data.form_schema);
// Expected: Array of 6 fields
```

#### **2. Validate Conditional Fields**

```typescript
// User checks "has_livestock" checkbox
// Expect: "livestock_type" multiselect appears
// User unchecks "has_livestock"
// Expect: "livestock_type" disappears and value clears
```

#### **3. Language Switching**

```typescript
// User selects "Swahili" language
// Expect: All labels switch to Swahili
// "Farm size (acres)" → "Ukubwa wa shamba (ekari)"
```

#### **4. Form Validation**

```typescript
// User leaves required field empty
// Expect: Red border + error message
// User fills field
// Expect: Error clears, green border on focus
```

#### **5. AI Prompt Generation**

```typescript
const prompt = generateAIPrompt({
  role: "smallholder_farmer",
  feature: "crop_planning",
  language: "sw",
  userName: "Juma",
  farmSize: 2,
  mainCrop: "Mahindi",
  region: "Arusha"
});

// Expected output (abbreviated):
// "Wewe ni Sankofa AI, mshauri mtaalamu wa kilimo...
//  Toa ushauri wa vitendo wa kupanga mazao...
//  Jina la mkulima: Juma
//  Ukubwa wa shamba: ekari 2
//  Zao kuu: Mahindi
//  Mkoa: Arusha, Tanzania"
```

---

## 📊 Testing Matrix

| User Type | Form Loads | Validation Works | Conditional Fields | Bilingual | AI Prompts |
|-----------|------------|------------------|-------------------|-----------|-----------|
| Smallholder Farmer | ✅ | ✅ | ✅ | ✅ | ✅ |
| Farmer | ✅ | ✅ | ✅ | ✅ | ✅ |
| Farm Manager | ✅ | ✅ | ✅ | ✅ | ✅ |
| Commercial Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Agribusiness Ops | ✅ | ✅ | ✅ | ✅ | ✅ |
| Extension Officer | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cooperative Leader | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🔧 How to Modify Forms

### **Option 1: Direct SQL Update**

```sql
-- Update form schema for smallholder_farmer
UPDATE role_forms
SET form_schema = '[
  {
    "field": "new_field",
    "type": "text",
    "label": "New Field",
    "required": false
  }
]'
WHERE role_name = 'smallholder_farmer';
```

### **Option 2: Supabase UI**

1. Open Supabase Dashboard
2. Go to **Table Editor**
3. Select `role_forms` table
4. Click on the row for your role
5. Edit `form_schema` JSON
6. Save

### **Option 3: Admin Panel (Future)**

Create an admin UI for non-technical users to:
- Add/remove fields
- Change field types
- Update labels
- Reorder fields
- Toggle required status

---

## 🚀 Deployment Checklist

### **1. Run Migration**

```bash
# Connect to Supabase
psql -h db.xxx.supabase.co -U postgres

# Run migration
\i /supabase/migrations/001_role_features_and_forms.sql
```

### **2. Verify Data**

```sql
-- Check role_features
SELECT * FROM role_features;

-- Check role_forms
SELECT role_name, form_schema FROM role_forms;
```

### **3. Test Component**

```tsx
// In App.tsx
{showDynamicOnboarding && (
  <DynamicRoleOnboarding
    userRole={currentUser.role}
    userName={currentUser.name}
    language={language}
    onComplete={handleOnboardingComplete}
  />
)}
```

### **4. Update Registration Flow**

```tsx
// After successful registration
const handleRegistrationSuccess = (user) => {
  setCurrentUser(user);
  setShowDynamicOnboarding(true); // Show onboarding
};
```

---

## 📈 Future Enhancements

### **Planned:**
- [ ] **Admin Panel** - GUI for editing forms
- [ ] **Form Analytics** - Track completion rates
- [ ] **A/B Testing** - Test different form variants
- [ ] **Multi-step Forms** - Break long forms into pages
- [ ] **File Upload Fields** - For profile photos, documents
- [ ] **Date/Time Pickers** - For scheduling
- [ ] **Geolocation Fields** - Auto-detect region
- [ ] **Phone Verification** - SMS OTP integration

### **Advanced:**
- [ ] **Dynamic Feature Unlocking** - Forms enable features
- [ ] **AI Form Generation** - AI suggests fields based on role
- [ ] **Form Versioning** - Track changes over time
- [ ] **Conditional Branching** - Complex logic trees
- [ ] **Integration with Payment** - Premium feature forms

---

## 📞 Support

**Questions?**
- Check `/supabase/migrations/001_role_features_and_forms.sql` for schema
- Check `/components/DynamicRoleOnboarding.tsx` for component
- Check `/utils/aiPromptEngine.ts` for AI prompts

**Want to add a new role?**
1. Insert row in `role_features` table
2. Insert row in `role_forms` table
3. Add role-specific AI prompt in `aiPromptEngine.ts`
4. Test with component

**Want to add a new field type?**
1. Add type to `FormField` interface
2. Add rendering logic in `renderField()` function
3. Add validation logic in `validateField()` function
4. Update documentation

---

## ✅ Status

**Production Ready:** ✅  
**Last Updated:** January 2026  
**Version:** 1.0.0  
**Database Schema:** Deployed  
**Components:** Complete  
**AI Engine:** Functional  
**Documentation:** Complete  

---

**🌾 KILIMO Agri-AI Suite - Dynamic, Data-Driven, Scalable**
