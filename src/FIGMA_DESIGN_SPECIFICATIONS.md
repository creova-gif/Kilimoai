# Figma Design Specifications: Crop Planning & Management

## 🎨 Complete Screen Flow with AI Integration

**Version:** 1.0.0  
**Date:** January 20, 2026  
**Platform:** Web + Mobile Responsive  
**Design System:** KILIMO Agri-AI Suite  

---

## 📱 Screen Hierarchy

```
Crop Planning & Management
├─ 1. Dashboard (Overview)
├─ 2. Create New Crop Plan (Modal/Stepper)
├─ 3. Crop Plan Details
├─ 4. Yield & Revenue Forecast
├─ 5. Soil & Amendment Tracking
├─ 6. Crop Plan History
└─ 7. Calendar & Schedule
```

---

## 🖥️ Screen 1: Crop Planning Dashboard

### **Purpose**
Command center showing all active crop plans, AI insights, and quick actions.

### **Layout Structure (Web)**
```
┌─────────────────────────────────────────────────────────────┐
│  Header                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Crop Planning & Management                          │   │
│  │ [Season: 2025 Masika ▼] [+ New Crop Plan]          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Tabs: [Overview] [Calendar] [Soil] [Revenue] [History]    │
│                                                              │
│  3-Column Grid                                              │
│  ┌─────────────┬──────────────┬─────────────────┐          │
│  │ Active      │ AI Insights  │ Financial       │          │
│  │ Crop Plans  │ Panel        │ Snapshot        │          │
│  │             │ (Sticky)     │                 │          │
│  │ [Card 1]    │ ┌──────────┐ │ Total Investment│          │
│  │ Maize       │ │ ⚠️ Alert │ │ Expected Revenue│          │
│  │ 25ha        │ │ Nitrogen │ │ Net Margin      │          │
│  │ Masika      │ │ deficit  │ │                 │          │
│  │             │ └──────────┘ │ [Chart]         │          │
│  │ [Card 2]    │              │                 │          │
│  │ Rice        │ ✅ Good soil │                 │          │
│  │ 10ha        │ health       │                 │          │
│  └─────────────┴──────────────┴─────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### **Layout Structure (Mobile)**
```
┌─────────────────────────┐
│  Header (Sticky)        │
│  Crop Planning          │
│  [≡] [+ New]            │
├─────────────────────────┤
│  [Season: 2025 ▼]      │
├─────────────────────────┤
│  Swipeable Tabs         │
│  ← Overview →           │
├─────────────────────────┤
│  AI Insights Card       │
│  ⚠️ Nitrogen deficit   │
│  [View Details]         │
├─────────────────────────┤
│  Active Crop Plan 1     │
│  Maize | 25ha          │
│  Expected: 5000kg/ha    │
│  [Details →]            │
├─────────────────────────┤
│  Active Crop Plan 2     │
│  Rice | 10ha           │
│  [Details →]            │
├─────────────────────────┤
│  Financial Summary      │
│  Revenue: 8.5M TZS     │
│  Profit: 68%           │
└─────────────────────────┘
  [FAB: +]
```

### **Components**

#### **Overview Cards (Active Crop Plans)**
**Auto Layout:** Vertical Stack, 16px gap  
**Card Dimensions (Web):** Flexible width, min-height 200px  
**Card Dimensions (Mobile):** Full width, min-height 160px  

**Card Structure:**
```
┌────────────────────────────────────────┐
│ 🌱 Maize                    [Active]   │
│ ───────────────────────────────────    │
│ 📍 Morogoro | 📏 25ha | 🌱 Masika      │
│                                        │
│ ┌──────────┬─────────┬────────────┐   │
│ │Expected  │ Cost    │ Variety    │   │
│ │5000kg/ha │225k TZS │ UH6303     │   │
│ └──────────┴─────────┴────────────┘   │
│                                        │
│ ⚠️ Risks: Late rainfall, N deficit    │
│                                        │
│ [View Details] [AI Analysis]          │
└────────────────────────────────────────┘
```

**AI Trigger:** On page load
- Endpoint: `/api/ai/crop-plan` (fetch existing plans)
- Auto-populate from database
- Show AI confidence badge

#### **AI Insights Panel (Sticky)**
**Auto Layout:** Vertical Stack, 12px gap  
**Position (Web):** Sticky top-4  
**Position (Mobile):** Top card in stack  

**Panel Structure:**
```
┌─────────────────────────────────┐
│ 🧠 AI Crop Advisor              │
│ Real-time insights              │
│ ─────────────────────────────── │
│                                 │
│ ⚠️ Nitrogen Deficit Warning    │
│ ─ Nitrogen deficit likely to   │
│   reduce yield by 8-12% in     │
│   Field B                       │
│   [View Solution]               │
│                                 │
│ 💧 Climate Opportunity          │
│ ─ Good rainfall expected -     │
│   optimal planting window      │
│   next week                     │
│                                 │
│ ✅ Soil Health Good             │
│ ─ pH and organic matter at     │
│   optimal levels               │
│                                 │
│ Updated: 2:30 PM               │
└─────────────────────────────────┘
```

**AI Trigger:** Auto-refresh every 5 minutes
- Endpoint: Check for new insights
- Show notification dot when new insights available

#### **Financial Snapshot**
**Auto Layout:** Vertical Stack, 8px gap  

```
┌─────────────────────────────────┐
│ 💰 Financial Snapshot           │
│ ─────────────────────────────── │
│                                 │
│ Total Investment: 2.5M TZS     │
│ Expected Revenue: 4.2M TZS     │
│ ──────────────────────────────  │
│ Net Margin: +68%               │
│                                 │
│ [View Detailed Forecast]        │
└─────────────────────────────────┘
```

### **Action Buttons**

**Primary CTA:** "+ New Crop Plan"  
- **Position (Web):** Top right header
- **Position (Mobile):** FAB (Floating Action Button)
- **AI Trigger:** Opens creation modal/stepper

**Secondary Actions:**
- "View History" → Navigate to History tab
- "Forecast & Revenue" → Navigate to Revenue tab

---

## 🆕 Screen 2: Create New Crop Plan

### **Display Mode**
- **Web:** Modal dialog (800px width)
- **Mobile:** Full-screen stepper

### **Step 1: Basic Details**

```
┌────────────────────────────────────────┐
│ Create New Crop Plan (Step 1 of 5)    │
│ ────────────────────────────────────   │
│                                        │
│ Crop Type:                             │
│ [Maize ▼]                              │
│ Options: Maize, Rice, Beans,           │
│         Cassava, Tomatoes              │
│                                        │
│ Field / Block:                         │
│ [Block A ▼]                            │
│                                        │
│ Season:                                │
│ [Masika 2025 ▼]                        │
│                                        │
│ Field Size:                            │
│ [25] hectares                          │
│                                        │
│ Location:                              │
│ [Morogoro]                             │
│                                        │
│            [Cancel] [Next: Soil →]    │
└────────────────────────────────────────┘
```

**AI Trigger:** On "Next" click
- Validate crop-season compatibility
- Show warning if non-optimal pairing

### **Step 2: Soil Data**

```
┌────────────────────────────────────────┐
│ Create New Crop Plan (Step 2 of 5)    │
│ ────────────────────────────────────   │
│                                        │
│ 🧪 Soil Test Data                     │
│                                        │
│ ┌─────────┬──────────┬───────────┐    │
│ │ pH      │ Nitrogen │ Phosphorus│    │
│ │ [5.8]   │ [Low ▼]  │ [Medium ▼]│    │
│ └─────────┴──────────┴───────────┘    │
│ ┌──────────────┬──────────────────┐   │
│ │ Potassium    │ Organic Matter   │   │
│ │ [Low ▼]      │ [3.5] %          │   │
│ └──────────────┴──────────────────┘   │
│                                        │
│ Last Soil Test: Dec 15, 2024          │
│ [Upload New Test]                      │
│                                        │
│ 🧠 AI Recommendation:                 │
│ ┌──────────────────────────────────┐  │
│ │ Based on your soil data:         │  │
│ │ • Apply 50kg/ha DAP              │  │
│ │ • Add 2t/ha compost              │  │
│ │ • Expected yield boost: 15-20%   │  │
│ └──────────────────────────────────┘  │
│                                        │
│       [← Back] [Next: Schedule →]     │
└────────────────────────────────────────┘
```

**AI Trigger:** On soil data entry
- Endpoint: `/api/ai/crop-plan` (partial call)
- Show real-time amendment suggestions
- Update as user modifies values

### **Step 3: Calendar & Tasks**

```
┌────────────────────────────────────────┐
│ Create New Crop Plan (Step 3 of 5)    │
│ ────────────────────────────────────   │
│                                        │
│ 📅 AI-Generated Schedule               │
│                                        │
│ Planting Window:                       │
│ [March 15-30, 2025]                    │
│ (AI recommended based on weather)      │
│                                        │
│ Fertilization Schedule:                │
│ ┌──────────────────────────────────┐  │
│ │ Day 0: Planting + DAP (50kg/ha)  │  │
│ │ Day 30: Top-dress Urea (50kg/ha) │  │
│ │ Day 60: Foliar spray             │  │
│ └──────────────────────────────────┘  │
│                                        │
│ Key Activities:                        │
│ ☐ Land preparation: Mar 1-14          │
│ ☐ Planting: Mar 15-30                 │
│ ☐ Weeding: Apr 15-20                  │
│ ☐ Pest control: May 1-15              │
│ ☐ Harvest: Jul 1-15                   │
│                                        │
│ [Customize Schedule]                   │
│                                        │
│       [← Back] [Next: Forecast →]     │
└────────────────────────────────────────┘
```

**AI Trigger:** Auto-generated from AI response
- Uses planting_window from JSON
- Calculates task dates based on crop growth stages

### **Step 4: Yield & Revenue Forecast**

```
┌────────────────────────────────────────┐
│ Create New Crop Plan (Step 4 of 5)    │
│ ────────────────────────────────────   │
│                                        │
│ 📊 AI Yield Forecast                   │
│                                        │
│ Expected Yield (kg/ha):                │
│ ┌──────────────────────────────────┐  │
│ │    Min    Expected     Max        │  │
│ │   4200      5000      5800        │  │
│ │   ├─────────●──────────┤          │  │
│ └──────────────────────────────────┘  │
│ Confidence: Medium ⚠️                  │
│                                        │
│ 💰 Revenue Projection:                 │
│                                        │
│ Market Price (TZS/kg): [1300]          │
│ Input Costs:                           │
│ • Seeds:      100,000 TZS              │
│ • Fertilizer: 150,000 TZS              │
│ • Labor:      200,000 TZS              │
│ ────────────────────────               │
│ Total Cost:   450,000 TZS              │
│                                        │
│ Expected Revenue: 1,300,000 TZS        │
│ Profit Estimate:    850,000 TZS        │
│ ROI: 189% ✅                           │
│                                        │
│ Scenarios:                             │
│ Best case:    1,508,000 TZS (+16%)     │
│ Worst case:   1,092,000 TZS (-16%)     │
│                                        │
│       [← Back] [Next: Review →]        │
└────────────────────────────────────────┘
```

**AI Trigger:** On market price entry
- Endpoint: `/api/ai/yield-forecast`
- Real-time calculation as user adjusts price

### **Step 5: Review & Save**

```
┌────────────────────────────────────────┐
│ Create New Crop Plan (Step 5 of 5)    │
│ ────────────────────────────────────   │
│                                        │
│ 📋 Review Your Plan                    │
│                                        │
│ Crop: Maize (UH6303 Hybrid)            │
│ Field: Block A (25 hectares)           │
│ Season: Masika 2025                    │
│ Planting: March 15-30                  │
│                                        │
│ Soil Amendments:                       │
│ • DAP: 50 kg/ha                        │
│ • Compost: 2 t/ha                      │
│                                        │
│ Expected Yield: 5000 kg/ha             │
│ Expected Revenue: 1,300,000 TZS        │
│ Profit Estimate: 850,000 TZS           │
│                                        │
│ Risks Identified:                      │
│ ⚠️ Late rainfall onset                 │
│ ⚠️ Nitrogen deficiency                 │
│                                        │
│ 🇹🇿 Muhtasari (Swahili):              │
│ Mpango huu unapendekezwa kwa           │
│ kuongeza rutuba ya udongo na           │
│ kuongeza mavuno kwa 15-20%.            │
│                                        │
│ [← Back] [Save Plan] [Save & Start]   │
└────────────────────────────────────────┘
```

**AI Trigger:** Final save
- Endpoint: `/api/ai/crop-plan` (complete)
- Save to database: `crop_plans`, `ai_insights`, `user_activity`
- Generate calendar entries
- Return to dashboard with success message

---

## 📈 Screen 3: Crop Plan Details

### **Layout**

```
┌──────────────────────────────────────────────────────────┐
│ ← Back to Dashboard                                      │
│                                                           │
│ 🌱 Maize - Block A                          [Active ▼]  │
│ Masika 2025 | 25 hectares | Started: Mar 15             │
│ ──────────────────────────────────────────────────────   │
│                                                           │
│ Tabs: [Overview] [Schedule] [Amendments] [Forecast]     │
│                                                           │
│ ┌─────────────────┬──────────────────────────────────┐  │
│ │ Key Metrics     │ AI Insights                      │  │
│ │                 │                                   │  │
│ │ Seed Variety:   │ 🧠 Current Recommendations:      │  │
│ │ UH6303 Hybrid   │                                   │  │
│ │                 │ ⚠️ Apply top-dressing in 5 days  │  │
│ │ Planting Date:  │                                   │  │
│ │ March 15, 2025  │ 💧 Good soil moisture levels     │  │
│ │                 │                                   │  │
│ │ Growth Stage:   │ 📊 Yield tracking on target      │  │
│ │ Vegetative (30%)│                                   │  │
│ │ [Progress Bar]  │ [Request New Analysis]           │  │
│ │                 │                                   │  │
│ │ Expected Yield: │                                   │  │
│ │ 5000 kg/ha      │                                   │  │
│ │                 │                                   │  │
│ │ Days to Harvest:│                                   │  │
│ │ 90 days         │                                   │  │
│ └─────────────────┴──────────────────────────────────┘  │
│                                                           │
│ Soil Amendments Applied:                                │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Mar 15: DAP (50kg/ha) - Applied ✅                 │  │
│ │ Apr 15: Urea top-dress (50kg/ha) - Scheduled 📅   │  │
│ │ May 1: Foliar spray - Scheduled 📅                 │  │
│ └────────────────────────────────────────────────────┘  │
│                                                           │
│ Upcoming Tasks:                                          │
│ • Apr 15-20: Weeding                                     │
│ • Apr 15: Top-dressing fertilizer                        │
│ • May 1-15: Pest control                                 │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

**AI Triggers:**
- Progress tracking (auto-update growth stage)
- "Request New Analysis" button → `/api/ai/history-analysis`

---

## 💰 Screen 4: Yield & Revenue Forecast

### **Layout**

```
┌────────────────────────────────────────────────┐
│ Yield & Revenue Forecast                      │
│ Maize - Block A | Masika 2025                 │
│ ────────────────────────────────────────────   │
│                                                │
│ 📊 Yield Projection                           │
│                                                │
│ [Interactive Chart]                            │
│ Current estimate: 5000 kg/ha                   │
│ ┌─────────────────────────────────────────┐   │
│ │        Yield Range                      │   │
│ │ Min ├──────────●────────┤ Max           │   │
│ │4200          5000        5800            │   │
│ └─────────────────────────────────────────┘   │
│                                                │
│ 💰 Financial Forecast                         │
│                                                │
│ Market Price: [1300 TZS/kg] [Update]          │
│                                                │
│ Revenue Scenarios:                             │
│ ┌─────────────────────────────────────────┐   │
│ │ Best Case:    1,508,000 TZS  (+16%) ↑  │   │
│ │ Expected:     1,300,000 TZS          ●  │   │
│ │ Worst Case:   1,092,000 TZS  (-16%) ↓  │   │
│ └─────────────────────────────────────────┘   │
│                                                │
│ Cost Breakdown:                                │
│ • Seeds:       100,000 TZS                     │
│ • Fertilizer:  150,000 TZS                     │
│ • Labor:       200,000 TZS                     │
│ ───────────────────────                        │
│ Total Cost:    450,000 TZS                     │
│                                                │
│ Profit Estimate: 850,000 TZS                   │
│ ROI: 189%                                      │
│                                                │
│ [Recalculate] [Save Forecast] [Export]        │
└────────────────────────────────────────────────┘
```

**AI Trigger:** "Recalculate" button
- Endpoint: `/api/ai/yield-forecast`
- Updates scenarios based on current market price
- Saves to `financials` table

**Prompt Engineering:**
```
You are an AI farm financial advisor.
Given:
- Current yield estimate: 5000 kg/ha
- Market price: 1300 TZS/kg
- Input costs: 450,000 TZS
- Field size: 25 ha

Calculate:
1. Expected revenue (yield × price × size)
2. Profit estimate (revenue - costs)
3. Scenarios:
   - Best case (+15% yield, +5% price)
   - Expected (as stated)
   - Worst case (-15% yield, -5% price)

Consider:
- Weather variability (±10-15%)
- Market price fluctuations (±8%)
- Pest/disease risk (0-20% yield loss)

Return JSON:
{
  "expected_revenue": 0,
  "profit_estimate": 0,
  "scenarios": {
    "best_case": 0,
    "expected": 0,
    "worst_case": 0
  }
}
```

---

## 🧪 Screen 5: Soil & Amendment Tracking

### **Layout**

```
┌────────────────────────────────────────────────┐
│ Soil Health & Amendments                      │
│ Block A | Last Test: Dec 15, 2024             │
│ ────────────────────────────────────────────   │
│                                                │
│ Current Soil Status:                           │
│ ┌──────────┬────────────┬──────────┐          │
│ │ pH: 5.8  │ Nitrogen:  │ Phosphorus│          │
│ │ ⚠️ Low   │ Low        │ Medium    │          │
│ └──────────┴────────────┴──────────┘          │
│ ┌──────────────┬──────────────────────┐       │
│ │ Potassium    │ Organic Matter       │       │
│ │ Low          │ 3.5% ✅               │       │
│ └──────────────┴──────────────────────┘       │
│                                                │
│ 🧠 AI Recommendations:                        │
│ ┌──────────────────────────────────────────┐  │
│ │ Priority Amendments:                     │  │
│ │ 1. Apply 50kg/ha DAP (Phosphorus + N)    │  │
│ │ 2. Add 2 t/ha compost (organic matter)   │  │
│ │ 3. Consider lime (pH correction)         │  │
│ │                                           │  │
│ │ Expected Impact:                          │  │
│ │ • Yield increase: 15-20%                 │  │
│ │ • Soil health improvement: 6 months      │  │
│ │ • Cost: ~125,000 TZS                     │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ Amendment History:                             │
│ ┌──────────────────────────────────────────┐  │
│ │ Mar 15, 2025                             │  │
│ │ ✅ DAP: 50kg/ha applied                  │  │
│ │ Cost: 75,000 TZS                         │  │
│ │                                           │  │
│ │ Feb 1, 2025                              │  │
│ │ ✅ Compost: 2t/ha applied                │  │
│ │ Cost: 50,000 TZS                         │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ [+ Add New Amendment] [Upload Soil Test]      │
└────────────────────────────────────────────────┘
```

**AI Trigger:** On soil test upload
- Endpoint: `/api/ai/crop-plan` (soil optimization)
- Analyzes new soil data
- Updates amendment recommendations

---

## 📜 Screen 6: Crop Plan History

### **Layout**

```
┌────────────────────────────────────────────────────────┐
│ Crop Plan History                                      │
│ Comparative Performance Analysis                       │
│ ────────────────────────────────────────────────────   │
│                                                         │
│ Filters: [Crop: All ▼] [Season: All ▼] [Year: 2024 ▼]│
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Maize - Block A | Masika 2024 | Completed ✅   │   │
│ │ ─────────────────────────────────────────────── │   │
│ │ Actual Yield: 4800 kg/ha (vs 5000 expected)    │   │
│ │ Profit: 780,000 TZS | ROI: 173%                │   │
│ │ AI Score: 78/100 ⭐⭐⭐                         │   │
│ │                                                  │   │
│ │ [View Details] [AI Deep Dive]                  │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Maize - Block A | Vuli 2023 | Completed ✅     │   │
│ │ ─────────────────────────────────────────────── │   │
│ │ Actual Yield: 4200 kg/ha                        │   │
│ │ Profit: 650,000 TZS | ROI: 144%                │   │
│ │ AI Score: 65/100 ⭐⭐                           │   │
│ │                                                  │   │
│ │ [View Details] [AI Deep Dive]                  │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ 📊 Trend Analysis:                                     │
│ • Yield improving: +14% year-over-year                 │
│ • Profit increasing: +20% year-over-year               │
│ • Soil health: Stable → Improving                      │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### **AI Deep Dive Modal**

```
┌──────────────────────────────────────────────────┐
│ 🧠 AI Performance Analysis                      │
│ Maize - Block A | Masika 2024                   │
│ ──────────────────────────────────────────────   │
│                                                  │
│ Comparative Analysis:                            │
│                                                  │
│ Yield Change: +12%                               │
│ vs Masika 2023: 4200 → 4800 kg/ha               │
│                                                  │
│ Profit Change: +15%                              │
│ vs Masika 2023: 650k → 780k TZS                 │
│                                                  │
│ Soil Health Trend: Improving ↑                   │
│ Organic matter: 2.8% → 3.5%                     │
│                                                  │
│ ✅ What Worked:                                  │
│ • Earlier planting (by 10 days)                 │
│ • Increased compost application                 │
│ • Better pest control timing                    │
│                                                  │
│ ⚠️ What Needs Improvement:                      │
│ • Nitrogen levels still low                     │
│ • Spacing could be optimized                    │
│ • Harvest timing (3 days late)                  │
│                                                  │
│ 💡 Recommendations for Next Season:             │
│ 1. Increase DAP to 60kg/ha                      │
│ 2. Plant March 10-20 (5 days earlier)           │
│ 3. Add foliar nitrogen spray at week 6          │
│ 4. Target harvest: July 12-15                   │
│                                                  │
│ Expected Impact: +8-12% yield improvement        │
│                                                  │
│ 🇹🇿 Muhtasari wa Kiswahili:                    │
│ Matokeo yameboreshwa kwa 12% kutokana na         │
│ mbinu mpya za mbolea na upandaji mapema.         │
│ Mbolea ya nitrojeni inahitaji kuongezwa kwa     │
│ msimu ujao ili kuongeza mavuno zaidi.           │
│                                                  │
│ [Save as Template] [Apply to New Plan] [Close] │
└──────────────────────────────────────────────────┘
```

**AI Trigger:** "AI Deep Dive" button
- Endpoint: `/api/ai/history-analysis`
- Compares current plan with up to 3 historical plans
- Generates lessons learned and recommendations

**Prompt Engineering:**
```
You are an agricultural performance analyst AI.

Compare this crop plan to historical plans for the same crop and field.

Current Plan: 
{
  "crop": "Maize",
  "field": "Block A",
  "season": "Masika 2024",
  "actual_yield": 4800,
  "profit": 780000,
  "soil_data": {"ph": 5.8, "nitrogen": "low", "organic_matter": 3.5}
}

Historical Plans:
[
  {
    "season": "Masika 2023",
    "actual_yield": 4200,
    "profit": 650000,
    "soil_data": {"ph": 5.9, "nitrogen": "low", "organic_matter": 2.8}
  }
]

Analyze:
1. Yield trends (% change)
2. Profit trends (% change)
3. Soil health evolution
4. What worked (best practices)
5. What needs improvement
6. Specific recommendations for next season

Return JSON:
{
  "comparative_analysis": {
    "yield_change": "+12%",
    "profit_change": "+15%",
    "soil_health_trend": "Improving",
    "recommendations": [
      "Increase DAP to 60kg/ha",
      "Plant 5 days earlier",
      "Add foliar nitrogen spray"
    ]
  },
  "lessons": {
    "worked": ["Earlier planting", "Increased compost"],
    "needs_improvement": ["Nitrogen levels", "Harvest timing"]
  },
  "next_season_impact": "+8-12% yield improvement",
  "sw_summary": "Matokeo yameboreshwa kwa 12%..."
}
```

---

## 📅 Screen 7: Calendar & Schedule

### **Layout (Web)**

```
┌────────────────────────────────────────────────┐
│ Crop Calendar                                  │
│ [Month View ▼] [Week View] [Agenda View]      │
│ ────────────────────────────────────────────   │
│                                                │
│    March 2025                                  │
│ ┌──────┬──────┬──────┬──────┬──────┬──────┐  │
│ │ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │ Sat  │  │
│ ├──────┼──────┼──────┼──────┼──────┼──────┤  │
│ │  10  │  11  │  12  │  13  │  14  │  15  │  │
│ │      │      │      │      │      │ 🌱   │  │
│ │      │      │      │      │      │Plant │  │
│ ├──────┼──────┼──────┼──────┼──────┼──────┤  │
│ │  17  │  18  │  19  │  20  │  21  │  22  │  │
│ │      │      │      │      │      │      │  │
│ ├──────┼──────┼──────┼──────┼──────┼──────┤  │
│ │  24  │  25  │  26  │  27  │  28  │  29  │  │
│ │      │      │      │      │      │      │  │
│ └──────┴──────┴──────┴──────┴──────┴──────┘  │
│                                                │
│ Upcoming Activities:                           │
│ ┌──────────────────────────────────────────┐  │
│ │ Mar 15-30: 🌱 Planting - Maize Block A  │  │
│ │ Apr 15: 🌾 Top-dressing fertilizer        │  │
│ │ Apr 15-20: 🔪 Weeding                    │  │
│ │ May 1-15: 🦗 Pest control                │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ ⚠️ AI Weather Alert:                          │
│ Heavy rain expected Apr 10-12                  │
│ → Delay fertilizer application by 3 days      │
│                                                │
└────────────────────────────────────────────────┘
```

### **Layout (Mobile - Agenda View)**

```
┌─────────────────────────┐
│ Crop Calendar           │
│ [March 2025 ▼]         │
├─────────────────────────┤
│                         │
│ This Week               │
│ ─────────────           │
│ Mon, Mar 15             │
│ 🌱 Start planting       │
│ Maize - Block A         │
│ [Details →]             │
│                         │
│ Tue, Mar 16             │
│ (No activities)         │
│                         │
│ Wed, Mar 17             │
│ 🌱 Continue planting    │
│ [Details →]             │
│ ─────────────           │
│                         │
│ Next Week               │
│ ─────────────           │
│ Mon, Mar 22             │
│ 🔍 Field inspection     │
│ [Details →]             │
│                         │
│ ⚠️ AI Alert             │
│ Heavy rain Apr 10-12    │
│ Adjust schedule         │
│ [View Impact]           │
│                         │
└─────────────────────────┘
```

**AI Triggers:**
- Weather-based schedule adjustments
- Automatic rescheduling suggestions
- Alert badges on conflicting dates

---

## 🎨 Figma Auto Layout Rules

### **Responsive Transformation**

#### **Web (1440px)**
```
Container: Auto Layout Horizontal
├─ Sidebar (240px fixed)
├─ Content Area (Flexible)
│  ├─ Header (Auto Layout Horizontal, padding: 24px)
│  ├─ Tabs (Auto Layout Horizontal, gap: 16px)
│  └─ 3-Column Grid
│     ├─ Column 1 (Flexible, min: 300px)
│     ├─ Column 2 (320px sticky)
│     └─ Column 3 (280px)
```

#### **Mobile (390px)**
```
Container: Auto Layout Vertical
├─ Header (Fixed top, height: 64px)
├─ Swipeable Tabs (Horizontal scroll)
└─ Content Stack (Auto Layout Vertical, gap: 16px)
   ├─ AI Insights Card (Full width)
   ├─ Crop Plan Card 1 (Full width)
   ├─ Crop Plan Card 2 (Full width)
   └─ Financial Card (Full width)
├─ Bottom Navigation (Fixed bottom, height: 64px)
└─ FAB (Fixed: bottom-right, offset: 16px)
```

### **Component Constraints**

| Component | Web Constraints | Mobile Constraints |
|-----------|----------------|-------------------|
| Header | Left + Right | Left + Right |
| Cards | Left + Right | Left + Right, Top + Bottom |
| Buttons | Hug contents | Hug contents / Fill container |
| Input Fields | Fill container | Fill container |
| Images | Fixed ratio | Scale proportionally |
| Tables | Scroll horizontal | Convert to cards |
| AI Panels | Sticky (top: 16px) | Stack normally |

---

## 🧠 AI Trigger Annotations (For Figma Comments)

### **Comment Format:**
```
🤖 AI TRIGGER

Event: [Button click / Page load / Data entry]
Endpoint: /api/ai/[endpoint-name]
Method: POST

Request:
{
  "user_id": "uuid",
  "field": "value"
}

Expected Response:
{
  "key": "value"
}

UI Update:
- Display [specific field] in [component]
- Show success/error toast
- Navigate to [screen] (optional)
```

### **Example: Create Crop Plan Button**

```
Frame: "Create New Crop Plan" Button
Comment:
────────────────────────────────
🤖 AI TRIGGER

Event: Button click
Endpoint: /api/ai/crop-plan
Method: POST

Request:
{
  "user_id": "uuid",
  "crop": "Maize",
  "season": "Masika 2025",
  "location": "Morogoro",
  "field_size_ha": 25,
  "soil_data": {
    "ph": 5.8,
    "nitrogen": "low",
    "phosphorus": "medium",
    "potassium": "low"
  }
}

Expected Response:
{
  "success": true,
  "recommendations": {
    "seed_variety": "UH6303 Hybrid",
    "planting_window": "March 15-30",
    "soil_amendments": [
      {"type": "DAP", "rate": "50kg/ha"},
      {"type": "Compost", "rate": "2t/ha"}
    ]
  },
  "forecast": {
    "yield_kg_per_ha": {"min": 4200, "max": 5200},
    "confidence": "medium"
  },
  "risks": ["Late rainfall onset", "Nitrogen deficiency"]
}

UI Update:
- Display seed_variety in "Seed Variety" field
- Show planting_window in "Planting Window" field
- List soil_amendments in amendments table
- Display forecast in yield chart
- Show risks in alert card
- Save to database
- Show success toast: "Crop plan created successfully!"
────────────────────────────────
```

---

## 🌍 Bilingual UX Pattern

### **Language Toggle**
```
[EN] / [SW]  (Toggle button, top-right)
```

### **Variable Mapping**
```
AI Response Field        English Display         Swahili Display
─────────────────────   ───────────────────    ──────────────────
summary.en              "Optimal plan for..."   [hidden]
summary.sw              [hidden]                "Mpango bora kwa..."
recommendations         Show English labels     Show Swahili labels
```

### **Component Structure**
```tsx
<div>
  {language === 'en' ? (
    <p>{aiResponse.summary.en}</p>
  ) : (
    <p>{aiResponse.summary.sw}</p>
  )}
</div>
```

### **All Text Elements**
- Labels, buttons, headings → Use variables
- AI responses → Store both EN and SW
- Error messages → Bilingual fallbacks
- Toast notifications → Language-aware

---

## 📏 Design Tokens

### **Colors**
```
Primary Green:   #16a34a
Primary Dark:    #15803d
Secondary Blue:  #3b82f6
Warning Yellow:  #eab308
Error Red:       #ef4444
Success:         #22c55e
Gray 50:         #f9fafb
Gray 600:        #4b5563
Gray 900:        #111827
```

### **Typography**
```
H1: 30px / Bold / Gray 900
H2: 24px / Semibold / Gray 900
H3: 18px / Semibold / Gray 900
Body: 14px / Regular / Gray 600
Small: 12px / Regular / Gray 600
Button: 14px / Medium / White
```

### **Spacing**
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

### **Border Radius**
```
sm: 8px
md: 12px
lg: 16px
xl: 24px
full: 9999px (pills/badges)
```

---

## ✅ Implementation Checklist

### **Figma Setup**
- [ ] Create main frames for each screen (Web + Mobile)
- [ ] Apply Auto Layout to all containers
- [ ] Set responsive constraints
- [ ] Add AI trigger comments to interactive elements
- [ ] Create component variants (EN/SW)
- [ ] Define design tokens as styles
- [ ] Test responsive behavior (390px → 1440px)

### **AI Integration**
- [ ] Annotate all API endpoints in comments
- [ ] Document expected JSON structure
- [ ] Map response fields to UI components
- [ ] Define error states and fallbacks
- [ ] Specify loading states for async calls

### **Bilingual Support**
- [ ] Create text variables for all static content
- [ ] Ensure AI prompts request both languages
- [ ] Design language toggle component
- [ ] Test text overflow in both languages

### **Components**
- [ ] Crop Plan Card (active/completed states)
- [ ] AI Insights Panel (sticky web, card mobile)
- [ ] Financial Snapshot Card
- [ ] Step Indicator (1 of 5)
- [ ] Yield Forecast Chart
- [ ] Calendar (month/week/agenda views)
- [ ] History Card with AI score
- [ ] Deep Dive Modal
- [ ] Toast notifications (success/error/warning)
- [ ] Loading spinners
- [ ] Empty states ("No plans yet")

---

**Status:** ✅ **Complete Figma Specifications Ready**  
**Ready for:** Design implementation, Frontend development, AI integration  
**Version:** 1.0.0-figma  

🎨🌾🚀
