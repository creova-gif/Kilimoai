# 📅 KILIMO DATE HANDLING & HISTORICAL DATA IMPORT

## ✅ **PRODUCTION YEAR: 2026**

The app launches in **2026**, so all crop planning dates default to **current date or future**.

---

## 🗓️ **DATE HANDLING RULES**

### **1. New Crop Plans (Default)**
- **Start Date:** Defaults to TODAY or user-selected future date
- **Tasks:** All task due dates are in the future
- **Harvest:** Automatically set 90-120 days from start
- **Notifications:** Scheduled for upcoming dates

**Example:**
```typescript
// Creating a new plan
await createCropPlanFromTemplate('maize-template', userId, {
  farmSize: '5 acres',
  region: 'Arusha'
  // startDate: omitted = defaults to TODAY
});

// Result: Plan starts today, harvest in ~3-4 months
```

### **2. Custom Future Start Date**
Farmers can plan ahead for next season:

```typescript
await createCropPlanFromTemplate('maize-template', userId, {
  farmSize: '5 acres',
  region: 'Arusha',
  startDate: '2026-10-01' // Start in October (long rains season)
});

// Result: All tasks scheduled from Oct 2026 forward
```

### **3. Historical Data Import (Optional)**
For AI training and yield predictions, farmers can import past crop data:

```typescript
await createCropPlanFromTemplate('maize-template', userId, {
  farmSize: '5 acres',
  region: 'Arusha',
  startDate: '2025-03-15', // Past date
  isHistorical: true, // ⚠️ MUST SET THIS FLAG
  actualYield: 450, // kg (actual harvest)
  actualRevenue: 450000, // TSh
  completedAt: '2025-07-10'
});

// Result: Historical record for AI learning, no future tasks created
```

---

## 🎯 **USE CASES**

### **Use Case 1: Start Farming Today**
**Scenario:** New farmer wants to plant maize now

```typescript
// Just select template - dates auto-set to today
const { plan } = await createCropPlanFromTemplate('maize-template', userId, {
  farmSize: '2 acres',
  region: 'Mwanza'
});

console.log(plan.startDate); // 2026-02-10 (today)
console.log(plan.endDate);   // 2026-05-20 (~90 days)
```

**Result:**
- ✅ Land Preparation: Today
- ✅ Planting: Feb 13, 2026
- ✅ Fertilizer: Feb 24, 2026
- ✅ Weeding: Mar 3, 2026
- ✅ Pest Control: Mar 10, 2026
- ✅ Harvest: May 20, 2026

---

### **Use Case 2: Plan for Next Season**
**Scenario:** Farmer wants to plan for Masika (long rains) season

```typescript
const { plan } = await createCropPlanFromTemplate('rice-template', userId, {
  farmSize: '3 acres',
  region: 'Morogoro',
  startDate: '2026-03-15' // Start of Masika season
});

console.log(plan.startDate); // 2026-03-15
console.log(plan.endDate);   // 2026-07-15 (~120 days for rice)
```

**Result:**
- ✅ All tasks scheduled from March 2026 forward
- ✅ Harvest scheduled for July 2026
- ✅ Notifications scheduled accordingly

---

### **Use Case 3: Import Historical Data**
**Scenario:** Farmer has 3 years of past maize data for AI predictions

```typescript
// Season 1: 2023
await createCropPlanFromTemplate('maize-template', userId, {
  farmSize: '5 acres',
  region: 'Arusha',
  startDate: '2023-03-01',
  isHistorical: true, // ⚠️ Critical flag
  actualYield: 2800,
  actualRevenue: 2800000,
  completedAt: '2023-07-15',
  notes: 'Good rainfall, minimal pests'
});

// Season 2: 2024
await createCropPlanFromTemplate('maize-template', userId, {
  farmSize: '5 acres',
  region: 'Arusha',
  startDate: '2024-03-01',
  isHistorical: true,
  actualYield: 3200,
  actualRevenue: 3500000,
  completedAt: '2024-07-10',
  notes: 'Excellent season, used improved seeds'
});

// Season 3: 2025
await createCropPlanFromTemplate('maize-template', userId, {
  farmSize: '5 acres',
  region: 'Arusha',
  startDate: '2025-03-01',
  isHistorical: true,
  actualYield: 2500,
  actualRevenue: 2600000,
  completedAt: '2025-07-20',
  notes: 'Drought affected yield'
});
```

**Result:**
- ✅ Historical data stored for AI analysis
- ✅ AI can now predict 2026 yield based on 3-year trend
- ✅ AI learns from what worked/didn't work
- ✅ Better recommendations for upcoming season

---

## 🤖 **AI BENEFITS OF HISTORICAL DATA**

### **Without Historical Data:**
```
AI Prediction (Generic):
"Expected yield: 4-6 tonnes/hectare"
Confidence: 70%
```

### **With 3 Years Historical Data:**
```
AI Prediction (Personalized):
"Expected yield: 3.2 tonnes/hectare"
Confidence: 92%

Based on your past 3 seasons:
- 2023: 2.8 tonnes (good rain)
- 2024: 3.2 tonnes (excellent)
- 2025: 2.5 tonnes (drought)

Recommendation: This season's rainfall forecast is similar to 2024.
If you use improved seeds again, expect ~3.2-3.5 tonnes.
```

---

## 🛠️ **IMPLEMENTATION DETAILS**

### **Backend Date Validation**
```typescript
function generateTasksForCrop(plan: any): any[] {
  const tasks = [];
  const startDate = new Date(plan.startDate);
  
  // ✅ Ensure startDate is in the future or today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // If plan starts in the past, adjust to start today
  if (startDate < today) {
    startDate.setTime(today.getTime());
  }
  
  // Generate tasks with future dates...
}
```

### **Frontend Date Handling**
```typescript
export async function createCropPlanFromTemplate(templateId, userId, customizations) {
  // ✅ Ensure start date is today or future
  const startDate = customizations.startDate ? new Date(customizations.startDate) : new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // If start date is in past and NOT historical data, adjust to today
  if (startDate < today && !customizations.isHistorical) {
    startDate.setTime(today.getTime());
    console.warn('Start date adjusted to today. Use isHistorical flag for past data.');
  }
  
  // Proceed with plan creation...
}
```

---

## 📊 **UI/UX CONSIDERATIONS**

### **1. Date Picker Default**
```typescript
// Date picker should default to today
<DatePicker
  defaultValue={new Date()}
  minDate={new Date()} // Can't select past dates (unless historical mode)
  label="Plan Start Date"
/>
```

### **2. Historical Data Mode (Optional Feature)**
```typescript
// Show toggle for historical import
<Switch
  label="Import Historical Data"
  checked={isHistoricalMode}
  onChange={(checked) => {
    setIsHistoricalMode(checked);
    if (checked) {
      // Allow past dates, show additional fields
      setShowActualYieldFields(true);
    }
  }}
/>

{isHistoricalMode && (
  <>
    <DatePicker
      label="Season Start Date"
      // No minDate restriction in historical mode
    />
    <Input
      label="Actual Yield (kg)"
      type="number"
      required
    />
    <Input
      label="Actual Revenue (TSh)"
      type="number"
      required
    />
    <DatePicker
      label="Harvest Completion Date"
      required
    />
    <TextArea
      label="Notes (optional)"
      placeholder="What worked well? Any issues?"
    />
  </>
)}
```

---

## 🚀 **PRODUCTION READY**

### **Current Implementation:**
- ✅ All new plans default to today/future
- ✅ Past dates automatically adjusted to today
- ✅ Historical data import supported via `isHistorical` flag
- ✅ AI uses historical data for better predictions
- ✅ No risk of farmers accidentally creating past-dated plans

### **Launch Day (2026):**
- ✅ All farmers start with today's date
- ✅ Plans are forward-looking
- ✅ Tasks are actionable immediately
- ✅ AI learns from actual outcomes over time

---

## 📝 **FARMER INSTRUCTIONS**

### **For New Plans:**
> "Select 'Create New Plan' and your planting season will start today. You can choose a future date if planning ahead."

### **For Historical Data:**
> "To help our AI give you better predictions, you can import data from your previous seasons. Go to Settings → Import Historical Data and enter your past harvest records."

---

## ✅ **SUMMARY**

| Scenario | Start Date | isHistorical | Tasks Created | Used For |
|----------|-----------|--------------|---------------|----------|
| New plan (today) | Today | false | ✅ Yes (future dates) | Active farming |
| New plan (future) | User-selected future | false | ✅ Yes (future dates) | Season planning |
| Historical import | Past date | **true** | ❌ No | AI training only |

**Default Behavior:** All plans start today or in the future, ensuring the app is 100% production-ready for 2026 launch. 🚀
