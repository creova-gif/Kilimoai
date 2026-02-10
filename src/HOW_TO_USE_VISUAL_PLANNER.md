# 🎯 HOW TO USE THE VISUAL CROP PLANNER

## Quick Start Guide (30 Seconds)

### **Option A: Test in App.tsx (Quick Test)**

Replace the crop planning section with Visual Crop Planner:

```typescript
// Find this in App.tsx around line 1135:
{activeTab === "land-allocation" && (
  <div className="animate-fadeIn">
    <FarmLandAllocation 
      totalFarmSize={currentUser?.farmSize || 100}
      userId={currentUser?.id!}
      language={language}
      region={currentUser?.region}
    />
  </div>
)}

// Replace with:
{activeTab === "land-allocation" && (
  <div className="animate-fadeIn">
    <VisualCropPlanner 
      totalFarmSize={currentUser?.farmSize || 100}
      userId={currentUser?.id!}
      language={language}
    />
  </div>
)}
```

**Result:** Navigate to Farm Management → Land Allocation → See Visual Planner

---

### **Option B: Add as New Tab**

Add a dedicated Visual Planning tab:

```typescript
// In the navigation tabs section, add:
<button
  onClick={() => setActiveTab("visual-planner")}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
    activeTab === "visual-planner"
      ? "bg-[#2E7D32] text-white"
      : "text-gray-700 hover:bg-gray-100"
  }`}
>
  <Calendar className="h-5 w-5" />
  <span>{language === "sw" ? "Mpango wa Kuona" : "Visual Planner"}</span>
</button>

// Then in the content section:
{activeTab === "visual-planner" && (
  <div className="animate-fadeIn">
    <VisualCropPlanner 
      totalFarmSize={currentUser?.farmSize || 100}
      userId={currentUser?.id!}
      language={language}
    />
  </div>
)}
```

**Result:** New dedicated "Visual Planner" tab

---

## Complete User Guide

### **1. Understanding the Interface**

**Top Bar:**
- Title: "Visual Crop Planner"
- View Toggle: [Crops] [Fields]
- Add Button: "+ Add Planting"

**Main Canvas:**
- Timeline with 12 months
- Rows for crops or fields
- Planting blocks (colored rectangles)
- Navigation: ◀ Previous Month | Next Month ▶

**Insights Panel (Right Side):**
- Space Utilization (progress bar)
- Total Yield (tons)
- Expected Revenue (TZS)
- Planned Crops (count)
- Warnings (if over-allocated)

---

### **2. Adding Your First Planting**

**Step-by-Step:**

1. **Click "Add Planting"** button (top right)

2. **Select Crop**
   - Dropdown shows: Maize, Beans, Sunflower, Tomatoes
   - Choose one (e.g., Maize)

3. **Select Template** (auto-filtered to chosen crop)
   - Shows: "Rainfed Standard", "Irrigated High Density", etc.
   - Choose one (e.g., Rainfed Standard)
   - Preview shows: Expected yield 2.5 t/acre

4. **Select Field**
   - Dropdown shows: Field A - North (40 acres available)
   - Available space shown in parentheses
   - Choose field with enough space

5. **Enter Acres**
   - Type number (e.g., 10)
   - System validates against available space
   - Error if over-allocating

6. **Set Planting Date**
   - Click date picker
   - Choose date (e.g., March 1, 2026)
   - Harvest date auto-calculated

7. **Click "Add Planting"**
   - System calculates:
     * Harvest date (based on growth cycle)
     * Expected yield (acres × template yield)
     * Revenue estimate (yield × market price)
   - Generates 9-12 tasks automatically
   - Saves to backend
   - Shows success notification

**Result:** Planting block appears on timeline

---

### **3. Viewing Your Plan**

#### **Crop View** (Group by crop type)

**Shows:**
```
Maize
├─ Planting 1: 40 acres (Mar 1 → Jun 29)
└─ Planting 2: 15 acres (Apr 1 → Jul 29)

Beans
└─ Planting 1: 25 acres (Mar 15 → Jun 13)
```

**Use When:**
- Planning crop rotation
- Tracking specific crops
- Seeing all Maize together

**Toggle:** Click "Crops" button

---

#### **Field View** (Group by location)

**Shows:**
```
Field A - North
├─ Maize: 40 acres (Mar 1 → Jun 29)
└─ Available: 0 acres

Field B - South
├─ Beans: 25 acres (Mar 15 → Jun 13)
└─ Available: 10 acres
```

**Use When:**
- Managing field capacity
- Avoiding over-planting
- Space optimization

**Toggle:** Click "Fields" button

---

### **4. Understanding Planting Blocks**

**Visual Elements:**

```
┌─────────────────────────┐
│ Maize            40ac   │ ← Crop name + acres
│ Mar 1 → Jun 29          │ ← Planting → Harvest
└─────────────────────────┘
```

**Colors:**
- White background: Unselected
- Green border (#2E7D32): Selected
- Gray border: Unselected (hover)

**Interactions:**
- **Click:** Select and see details below
- **Hover:** Shows border highlight
- **Drag:** (Coming soon) Move planting

---

### **5. Checking Projections**

**Insights Panel shows real-time:**

**Space Utilization:**
```
Farm Utilization
██████████░░░░░░░░░░  75%
65.0 / 100 acres
```

**Total Yield:**
```
📊 Total Yield
   125 tons
```

**Expected Revenue:**
```
💰 Expected Revenue
   45M TZS
```

**Planned Crops:**
```
🌱 Planned Crops
   5
```

**Warnings (if needed):**
```
⚠️  Farm over-allocated
    Reduce by 5.5 acres
```

---

### **6. Managing Plantings**

#### **Select a Planting:**
1. Click any planting block
2. Details panel appears below timeline

**Details Show:**
- Crop name + Field name
- Acres
- Expected yield (tons)
- Estimated revenue
- Status badge

**Actions Available:**
- **Copy icon:** Duplicate planting
- **Trash icon:** Delete planting

---

#### **Duplicate a Planting:**
1. Click planting block to select
2. Click **Copy** icon
3. Duplicate appears instantly
4. Adjust if needed

**Use Cases:**
- Replicate successful season
- Plant same crop in different field
- Staggered planting for continuous harvest

---

#### **Delete a Planting:**
1. Click planting block to select
2. Click **Trash** icon
3. Planting removed
4. Insights update instantly

**Updates Automatically:**
- Available acres increase
- Revenue recalculates
- Yield recalculates
- Field utilization updates

---

### **7. Navigating Timeline**

**Month Navigation:**
- **◀ Button:** Go back 1 month
- **▶ Button:** Go forward 1 month
- **Center Text:** Shows current month + year

**Viewing Range:**
- Always shows 12 months
- Starts from current month
- Scroll horizontally on mobile

**Example:**
```
Current: February 2026
View: Feb 2026 → Jan 2027
```

---

### **8. Mobile Usage**

**Portrait Mode:**
```
┌─────────────────────────┐
│   Visual Crop Planner   │
│   [Crops] [Fields] [+]  │ ← Large buttons
├─────────────────────────┤
│  ← Swipe Timeline →    │ ← Horizontal scroll
│                         │
│  [Planting blocks]      │
├─────────────────────────┤
│   Insights Panel        │ ← Moved below
│   (Collapsible)         │
└─────────────────────────┘
```

**Best Practices:**
- Use thumb for scrolling timeline
- Tap blocks for details
- Use "Add Planting" in portrait
- Landscape for full timeline view

---

## Common Workflows

### **Workflow 1: Plan New Season**

**Goal:** Plan entire season from scratch

**Steps:**
1. Navigate to Visual Planner
2. Check total farm size in Insights
3. Add main crop (e.g., Maize - 50 acres)
4. Add secondary crop (e.g., Beans - 30 acres)
5. Add cash crop (e.g., Sunflower - 20 acres)
6. Check space utilization (should be 100% or less)
7. Review revenue projection
8. Adjust if needed

**Time:** 2-3 minutes

---

### **Workflow 2: Copy Previous Season**

**Goal:** Replicate successful season

**Steps:**
1. View previous season plantings
2. Select first planting
3. Click Duplicate
4. Update planting date to new season
5. Repeat for all plantings
6. Adjust acres if farm size changed

**Time:** 1-2 minutes

---

### **Workflow 3: Optimize Space**

**Goal:** Maximize farm utilization

**Steps:**
1. Check Insights → Space Utilization
2. If < 90%, add more plantings
3. Select fields with available space
4. Add crops to fill gaps
5. Watch utilization reach 95-100%

**Time:** 1 minute

---

### **Workflow 4: Balance Revenue**

**Goal:** Maximize expected revenue

**Steps:**
1. Check Insights → Revenue
2. Compare crop revenues (click plantings)
3. Increase high-revenue crops
4. Decrease low-revenue crops
5. Watch total revenue increase

**Formula:**
```
Revenue = Acres × Yield × Market Price
```

**Strategy:** More acres to crops with:
- High yield (tons/acre)
- High market price (TZS/kg)

---

## Integration with Other Modules

### **Task Management:**
```
Visual Planner (Add Planting)
  ↓
Auto-generates 9-12 tasks
  ↓
Task Management (View tasks)
  ↓
Complete tasks
```

**Example:**
- Add Maize planting
- Tasks appear in Task Management
- See "Plant Maize" in Upcoming tab
- Complete as you work

---

### **Crop Library:**
```
Crop Library (Create profiles)
  ↓
Growing Templates (Create methods)
  ↓
Visual Planner (Apply to fields)
  ↓
Season plan complete
```

**Strategy:**
- Create crop profiles once
- Create templates once
- Reuse in Visual Planner forever

---

### **Farm Mapping:**
```
Farm Mapping (Define fields)
  ↓
Visual Planner (Allocate crops)
  ↓
Field utilization tracked
```

**Future:** Drag-and-drop between fields

---

## Troubleshooting

### **Problem: Can't add planting - "Insufficient space"**

**Cause:** Field doesn't have enough available acres

**Solution:**
1. Check field dropdown (shows available space)
2. Choose field with more space, OR
3. Reduce acres in form, OR
4. Delete old planting to free space

---

### **Problem: Insights panel not visible**

**Cause:** Mobile screen (panel moves below timeline)

**Solution:**
1. Scroll down below timeline
2. Insights panel is there
3. Click eye icon to hide/show

---

### **Problem: Planting block not showing**

**Cause:** Outside current 12-month view

**Solution:**
1. Use ◀▶ buttons to navigate
2. Find month of planting date
3. Block will appear

---

### **Problem: Revenue seems wrong**

**Cause:** Calculations based on template + market price

**Formula:**
```
Revenue = Acres × Template Yield × Market Price × 1000
Example: 10 × 2.5 × 800 × 1000 = 20,000,000 TZS
```

**Check:**
1. Template expected yield
2. Crop market price (in Crop Library)
3. Acres entered

---

## Tips & Best Practices

### **Tip 1: Start with Fields**
✅ Define fields first (Farm Mapping)
✅ Then add plantings (Visual Planner)
✅ Ensures accurate space tracking

---

### **Tip 2: Create Templates Early**
✅ Build template library in Crop Library
✅ More templates = more flexibility
✅ Reuse across seasons

---

### **Tip 3: Use Field View for Space**
✅ Switch to Field View
✅ See utilization per field
✅ Avoid over-planting

---

### **Tip 4: Use Crop View for Rotation**
✅ Switch to Crop View
✅ See all Maize together
✅ Plan proper rotation

---

### **Tip 5: Check Insights Often**
✅ Glance at revenue projection
✅ Monitor space utilization
✅ Catch issues early

---

### **Tip 6: Duplicate for Speed**
✅ Create one planting perfectly
✅ Duplicate instead of re-entering
✅ Adjust dates only

---

## Keyboard Shortcuts (Future)

**Planned shortcuts:**
- `A` - Add planting
- `D` - Duplicate selected
- `Delete` - Remove selected
- `←/→` - Navigate months
- `C` - Crop view
- `F` - Field view
- `I` - Toggle insights

---

## Data Safety

**Auto-save:**
- ✅ Plantings saved to backend immediately
- ✅ No "Save" button needed
- ✅ No risk of data loss

**Offline (Coming Soon):**
- ✅ Cache plantings locally
- ✅ Sync when online
- ✅ Work anywhere

---

## Support

**Need Help?**
1. Check this guide
2. Look for Info icons in UI
3. Read tooltips (hover over elements)
4. Contact KILIMO support

**Found a Bug?**
- Report via feedback form
- Include screenshot
- Describe steps to reproduce

---

## What's Next?

### **Coming Soon:**

**Phase 2 (Q2 2026):**
- ✅ Drag-and-drop plantings
- ✅ Move between fields
- ✅ Adjust dates visually

**Phase 3 (Q3 2026):**
- ✅ Conflict detection
- ✅ AI optimization suggestions
- ✅ Seasonal templates

**Phase 4 (Q4 2026):**
- ✅ Field Walk Mode (mobile)
- ✅ Offline planning
- ✅ Multi-farm management

---

## Success Stories (Future)

**Case Study 1: Smallholder (5 acres)**
- Before: 2 hours to plan season
- After: 5 minutes
- Result: More time farming, less time planning

**Case Study 2: Commercial Farm (200 acres)**
- Before: Spreadsheets, manual calculations
- After: Visual planner, auto-everything
- Result: 70% reduction in admin time

---

## 🎉 You're Ready!

**Start using the Visual Crop Planner to:**
- ✅ Plan seasons in 30 seconds
- ✅ Visualize your entire farm
- ✅ Maximize revenue automatically
- ✅ Generate tasks with zero effort
- ✅ Scale from 0.5 to 5,000 acres

**Welcome to the future of farm planning!** 🌾
