# 🔍 DEMO LANGUAGE FINDER & FIXER

## **SEARCH PATTERNS TO FIND & DESTROY**

Use your IDE's "Find in Files" feature to search for these patterns:

### **1. Demo/Sample Keywords**
```
Search for (case-insensitive):
- "demo"
- "sample"
- "placeholder"
- "mock"
- "test data"
- "example"
- "fake"
- "dummy"
```

### **2. Common Demo Patterns**
```typescript
// ❌ BAD - Remove these:
const sampleData = [...]
const mockResults = [...]
const demoUser = {...}
const placeholderImage = "..."
const testCrops = [...]

// ✅ GOOD - Replace with:
const data = realData || []
const user = currentUser || null
const crops = userCrops?.length > 0 ? userCrops : []
```

### **3. UI Text to Remove**
```typescript
// ❌ BAD:
<p>Sample AI insights based on your farm</p>
<h2>Demo Dashboard</h2>
<span>This is placeholder data</span>
<div>Test metrics will appear here</div>

// ✅ GOOD:
<p>AI insights based on your farm data</p>
<h2>Dashboard</h2>
<span>Complete more tasks to see insights</span>
<div>Your metrics will appear as you use KILIMO</div>
```

---

## **AUTOMATIC FIX SCRIPT**

### **Files Most Likely to Have Demo Content:**

1. `/components/DashboardHome.tsx`
2. `/components/AITelemetry.tsx` (if exists)
3. `/components/AIMetrics.tsx` (if exists)
4. `/components/FinanceDashboard.tsx`
5. `/components/MarketInsights.tsx`
6. `/App.tsx` (demo user at lines 153-166)

---

## **FIX CHECKLIST**

### **Priority 1: Remove Demo User**
**File:** `/App.tsx`

**Current (Line 153-166):**
```typescript
const [currentUser, setCurrentUser] = useState<User | null>({
  id: "demo-user-123",
  name: "Demo Farmer",
  email: "demo@kilimo.tz",
  phoneNumber: "+255712345678",
  role: "farmer",
  region: "Arusha",
  crops: ["Maize", "Beans", "Coffee"],
  farmSize: "5 acres",
  language: "sw",
  verified: true,
  onboardingCompleted: true,
  tier: "premium"
} as User); // ❌ DELETE THIS
```

**Fixed:**
```typescript
const [currentUser, setCurrentUser] = useState<User | null>(null); // ✅
```

---

### **Priority 2: Remove "Demo" from Component Names**

**Search for:**
- `DemoModeControlPanel` - Check if still needed
- `DemoModeState` - Check usage
- `isDemoMode()` - Check if this is production-safe

**Decision:**
- If demo mode is for **development only** → Hide completely in production
- If demo mode is for **user preview** → Rename to "Preview Mode" and ensure no fake data

---

### **Priority 3: Audit AI Components**

**Check these files:**
```
/components/AIWorkflowHub.tsx
/components/AISupport.tsx
/components/PhotoCropDiagnosis.tsx
/components/AIMetrics.tsx (if exists)
```

**Look for:**
- Sample AI responses
- Mock diagnosis results
- Placeholder recommendations
- Test confidence scores

**Fix Strategy:**
```typescript
// ❌ BAD:
const aiResponse = "Sample AI recommendation: Plant maize in March";

// ✅ GOOD:
const aiResponse = await fetchRealAIRecommendation(userId, cropType);
if (!aiResponse) {
  return <EmptyState 
    title="Get AI Recommendations"
    description="Upload crop photos or ask questions to receive personalized advice"
  />;
}
```

---

### **Priority 4: Charts & Metrics**

**Check these files:**
```
/components/FinanceDashboard.tsx
/components/CropAnalytics.tsx
/components/YieldPrediction.tsx
```

**Look for:**
- Hard-coded chart data
- Sample revenue numbers
- Mock yield predictions

**Fix Strategy:**
```typescript
// ❌ BAD:
const chartData = [
  { month: 'Jan', revenue: 50000 },
  { month: 'Feb', revenue: 75000 },
  // ... hard-coded sample data
];

// ✅ GOOD:
const chartData = userTransactions.map(t => ({
  month: t.month,
  revenue: t.revenue
}));

if (chartData.length === 0) {
  return <EmptyState 
    title="No Financial Data Yet"
    description="Start tracking your expenses and sales to see analytics"
    actionLabel="Record Transaction"
    onAction={() => navigate('/finance')}
  />;
}
```

---

## **MANUAL REVIEW REQUIRED**

### **Files to Manually Check:**

1. `/components/DashboardHome.tsx`
   - [ ] No "Welcome Demo User"
   - [ ] No sample farm statistics
   - [ ] All metrics come from real data

2. `/components/AIWorkflowHub.tsx`
   - [ ] No "Sample AI workflows"
   - [ ] All AI features connect to real backend

3. `/components/MarketInsights.tsx`
   - [ ] No fake market prices
   - [ ] All prices from real API

4. `/components/WeatherDashboard.tsx`
   - [ ] No sample weather data
   - [ ] All weather from real API

5. `/components/CropPlanning.tsx`
   - [ ] No pre-filled demo plans
   - [ ] All plans created by user

---

## **TESTING SCRIPT**

After removing demo content, test with a **fresh user account**:

```bash
# 1. Clear all local storage
localStorage.clear();

# 2. Sign up as new user
# 3. Go through each screen
# 4. Verify:
- [ ] No "demo" text anywhere
- [ ] No "sample" text anywhere
- [ ] Empty states show when no data
- [ ] All features either work or show "coming soon"
- [ ] No hard-coded data visible
```

---

## **GREP COMMANDS (Terminal)**

```bash
# Find all "demo" references
grep -ri "demo" src/components/ --include=\*.{ts,tsx}

# Find all "sample" references
grep -ri "sample" src/components/ --include=\*.{ts,tsx}

# Find all "placeholder" references
grep -ri "placeholder" src/components/ --include=\*.{ts,tsx}

# Find all "mock" references
grep -ri "mock" src/components/ --include=\*.{ts,tsx}

# Find all "test data" references
grep -ri "test data" src/components/ --include=\*.{ts,tsx}
```

---

## **APPLE REVIEWER PERSPECTIVE**

Apple reviewer will:

1. ✅ Create a fresh account
2. ✅ See if app shows fake data
3. ✅ Check if features claim to work but don't
4. ✅ Look for "demo" or "sample" language
5. ✅ Verify all displayed data is real

**IF THEY FIND FAKE DATA → INSTANT REJECTION**

---

## **FINAL CHECKLIST**

Before marking as "complete":

- [ ] Search entire codebase for "demo" (0 results in UI)
- [ ] Search entire codebase for "sample" (0 results in UI)
- [ ] Search entire codebase for "placeholder" (only in form inputs OK)
- [ ] Search entire codebase for "mock" (0 results in UI)
- [ ] All components show real data OR empty states
- [ ] No hard-coded user data
- [ ] No pre-filled forms with fake data
- [ ] No sample charts/graphs

---

## **QUICK FIX COMMANDS**

Use VS Code's "Find and Replace" (Cmd+Shift+H):

### **1. Remove "demo" from user-facing text:**
```
Find: "demo"
Replace: ""
Files to include: *.tsx, *.ts
Files to exclude: *test*, *spec*, *.md
```

### **2. Replace "Sample" with "Your":**
```
Find: Sample ([\w\s]+)
Replace: Your $1
```

### **3. Remove "placeholder" from visible text:**
```
Find: \(placeholder\)
Replace: ""
```

---

## **DONE WHEN:**

✅ `grep -ri "demo" src/components/` returns ONLY:
- DemoModeControlPanel (if used for dev only)
- Comments explaining demo mode was removed

✅ `grep -ri "sample" src/components/` returns ONLY:
- Code examples in comments
- Test files

✅ Fresh user sees NO fake data

✅ All screens show:
- Real data from user
- OR empty states with clear CTAs
- OR "Coming Soon" for unfinished features

---

**Remember:** It's better to hide an unfinished feature than show fake data. Apple values honesty over completeness.
