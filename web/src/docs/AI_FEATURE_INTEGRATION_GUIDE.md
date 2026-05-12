# KILIMO AI FEATURE INTEGRATION GUIDE

## 🎯 Overview

This guide shows you how to integrate AI-powered features into KILIMO using the production-ready AI prompt logic system.

**Philosophy**: "AI must feel helpful, not loud"  
**Principle**: "Farmers are task-driven, not feature-driven"

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Available AI Features](#available-ai-features)
3. [Integration Examples](#integration-examples)
4. [UI Components](#ui-components)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Step 1: Import the AI utilities

```typescript
import {
  getAIAdvice,
  getCropIntelligenceAdvice,
  formatAIResponse,
} from "../utils/aiFeatureIntegration";
```

### Step 2: Import UI components (optional)

```typescript
import {
  AISuggestionChip,
  AIInsightCard,
  AIWhyChip,
} from "../components/ai-features/AIUIComponents";
```

### Step 3: Call AI in your component

```typescript
const handleGetAdvice = async () => {
  const response = await getCropIntelligenceAdvice({
    crop_name: "Maize",
    region: "Arusha",
    language: "EN",
  });

  if (response.success) {
    console.log("AI Response:", response.response);
  }
};
```

---

## 🧠 Available AI Features

### 1. Crop Intelligence

**Purpose**: Help farmers organize and understand crop knowledge  
**Use Case**: Adding new crop, normalizing crop data, detecting duplicates

```typescript
const response = await getCropIntelligenceAdvice({
  crop_name: "Tomato",
  variety: "Roma",
  region: "Kilimanjaro",
  season: "Long rains",
  previous_yields: [2500, 2800, 3000],
  language: "EN",
});
```

**Response Structure**:
```json
{
  "suggested_attributes": {
    "days_to_maturity": 90,
    "spacing_cm": 60,
    "yield_range_kg_per_acre": "2000-3500",
    "water_needs": "high",
    "season_suitability": "Long rains, Short rains"
  },
  "confidence_level": "high",
  "local_notes": "Best grown with staking for support",
  "recommended_templates": ["Irrigated Tomato", "Rainfed Tomato"]
}
```

---

### 2. Farming Templates

**Purpose**: Save time by reusing farming methods  
**Use Case**: Creating planting templates, generating task sequences

```typescript
const response = await getFarmingTemplateAdvice({
  crop: "Maize",
  practice_type: "rainfed",
  soil_type: "Sandy loam",
  inputs_available: ["DAP fertilizer", "Urea", "Manure"],
  labor_level: "medium",
  language: "EN",
});
```

**Response Structure**:
```json
{
  "template_name": "Rainfed Maize - Sandy Loam",
  "defaults": {
    "spacing_cm": 75,
    "planting_window": "March-April (long rains)",
    "expected_yield_kg": "1500-2500",
    "input_needs": ["DAP: 50kg/acre", "Urea: 50kg/acre"]
  },
  "tasks": [
    {
      "task_name": "Land preparation",
      "days_after_planting": -14,
      "description": "Plow and harrow field"
    },
    {
      "task_name": "Planting + Basal fertilizer",
      "days_after_planting": 0,
      "description": "Plant seeds with DAP"
    }
  ],
  "risk_flags": ["Ensure soil moisture before planting"]
}
```

---

### 3. Crop Planning

**Purpose**: Optimize space and time allocation  
**Use Case**: Visual planner, plot allocation, over-planting detection

```typescript
const response = await getCropPlanningAdvice({
  plots: [
    { name: "Plot A", size_acres: 2.5 },
    { name: "Plot B", size_acres: 1.8 },
  ],
  selected_template: "Rainfed Maize",
  season_window: "March-July 2026",
  goal: "yield",
  language: "EN",
});
```

**Response Structure**:
```json
{
  "space_utilization": 85,
  "warnings": ["Plot B might be over-utilized"],
  "suggested_adjustments": [
    {
      "plot": "Plot B",
      "issue": "90% utilization - risky",
      "recommendation": "Reduce planting density by 10%"
    }
  ],
  "auto_tasks": [
    {
      "task_name": "Land preparation",
      "target_date": "2026-02-15",
      "plot": "Plot A"
    }
  ]
}
```

---

### 4. Yield & Revenue Forecasting

**Purpose**: Conservative outcome estimation  
**Use Case**: Planning revenue, comparing scenarios

```typescript
const response = await getYieldRevenueAdvice({
  crop_plan: [
    { crop: "Maize", acres: 2.5 },
    { crop: "Beans", acres: 1.0 },
  ],
  market_prices: {
    Maize: 800,
    Beans: 2500,
  },
  confidence_preference: "balanced",
  language: "EN",
});
```

**Response Structure**:
```json
{
  "yield_range": {
    "low_kg": 4000,
    "high_kg": 7000,
    "most_likely_kg": 5500
  },
  "revenue_range": {
    "low_tzs": 3200000,
    "high_tzs": 5600000,
    "most_likely_tzs": 4400000
  },
  "key_assumptions": [
    "Average rainfall",
    "Standard input application",
    "Current market prices"
  ],
  "confidence_note": "Based on 3-year regional averages"
}
```

---

### 5. Inventory Management

**Purpose**: Synchronize reality with plans  
**Use Case**: Post-harvest reconciliation, shortage detection

```typescript
const response = await getInventoryAdvice({
  harvested_amount: 2200,
  planned_amount: 2500,
  current_stock: {
    "Maize bags": 44,
    "DAP fertilizer": 2,
  },
  language: "EN",
});
```

---

### 6. Marketplace Pricing

**Purpose**: Help farmers sell without confusion  
**Use Case**: Price recommendations, buyer matching

```typescript
const response = await getMarketplaceAdvice({
  inventory: [
    { product: "Maize", quantity: 2200, quality: "Grade A" },
  ],
  price_preferences: "market average",
  sales_channels: ["Local market", "Cooperative"],
  language: "EN",
});
```

---

### 7. Finance Management

**Purpose**: Clear money understanding  
**Use Case**: Cash flow analysis, expense categorization

```typescript
const response = await getFinanceAdvice({
  transactions: [
    { date: "2026-01-15", type: "income", amount: 500000, category: "Maize sale" },
    { date: "2026-01-20", type: "expense", amount: 50000, category: "Fertilizer" },
  ],
  wallet_balance: 450000,
  pending_payments: 100000,
  language: "EN",
});
```

---

### 8. Livestock Management

**Purpose**: Health and planning assistance  
**Use Case**: Symptom assessment, vet escalation

```typescript
const response = await getLivestockAdvice({
  animal_type: "Dairy cow",
  symptoms: ["Reduced milk production", "Loss of appetite"],
  environment: "Zero grazing unit",
  language: "EN",
});
```

---

### 9. Unified AI Advisor

**Purpose**: Cross-feature intelligence  
**Use Case**: Dashboard insights, next action recommendations

```typescript
const response = await getUnifiedAdvice({
  recent_activity: [
    "Planted maize in Plot A",
    "Applied fertilizer",
  ],
  weather: {
    condition: "Sunny",
    temperature: 28,
    rainfall: 0,
  },
  market_trends: ["Maize prices rising"],
  query: "What should I focus on this week?",
  language: "EN",
});
```

---

### 10. Weather-Based Advice

**Purpose**: Weather-informed recommendations  
**Use Case**: Task rescheduling, irrigation planning

```typescript
const response = await getWeatherAdvice({
  weather_forecast: [
    { date: "2026-02-11", condition: "Heavy rain", rainfall: 45 },
    { date: "2026-02-12", condition: "Partly cloudy", rainfall: 5 },
  ],
  current_crops: ["Maize", "Beans"],
  upcoming_tasks: ["Weeding", "Fertilizer application"],
  language: "EN",
});
```

---

## 🎨 UI Components

### 1. AI Suggestion Chip (Inline)

Perfect for inline suggestions that don't interrupt workflow.

```tsx
<AISuggestionChip
  feature="crop_intelligence"
  context={{
    crop_name: "Tomato",
    region: "Arusha",
  }}
  language="EN"
  onApply={(response) => {
    // Handle applying the suggestion
    console.log("Applied:", response);
  }}
  onDismiss={() => {
    // Handle dismissing the suggestion
  }}
/>
```

---

### 2. AI Insight Card (Full Feature)

Full card for displaying comprehensive AI insights.

```tsx
<AIInsightCard
  feature="yield_revenue"
  context={{
    crop_plan: [{ crop: "Maize", acres: 2.5 }],
    market_prices: { Maize: 800 },
  }}
  language="EN"
  autoLoad={true}
  onAction={(action, data) => {
    if (action === "apply") {
      // Apply the AI suggestions
    }
  }}
/>
```

---

### 3. AI "Why?" Chip

Small expandable chip for explaining AI reasoning.

```tsx
<AIWhyChip
  explanation="This recommendation is based on your soil type, rainfall patterns, and historical yield data from similar farms in your region."
  language="EN"
/>
```

---

### 4. AI Status Badge

Shows AI processing status or confidence level.

```tsx
<AIStatusBadge
  status="success"
  confidence="high"
  language="EN"
/>
```

---

## ✅ Best Practices

### 1. **Progressive Disclosure**
Don't show AI everywhere at once. Start with:
- Inline chips for quick suggestions
- Full cards only when user opts in
- "Why?" explanations hidden by default

### 2. **Always Allow Override**
Never auto-apply AI suggestions without user confirmation:

```typescript
<Button onClick={() => applyWithConfirmation(aiResponse)}>
  Apply AI Suggestion
</Button>
```

### 3. **Offline Graceful Degradation**
Always handle offline scenarios:

```typescript
if (!response.success) {
  // Show manual input option
  showManualInputForm();
}
```

### 4. **Brand Compliance**
Only use **#2E7D32 (Raspberry Leaf Green)** for primary AI actions:

```css
/* ✅ Correct */
.ai-button {
  background-color: #2E7D32;
}

/* ❌ Wrong */
.ai-button {
  background-color: #0EA5E9; /* Blue - not allowed */
}
```

### 5. **Respect Language Preference**
Always pass the user's language preference:

```typescript
const language = localStorage.getItem("language") || "EN";

const response = await getAIAdvice(
  "crop_planning",
  context,
  undefined,
  language as "EN" | "SW"
);
```

---

## 🐛 Troubleshooting

### Issue: AI responses are slow

**Solution**: Use loading states and show immediate feedback

```tsx
{loading && <p>AI is analyzing your data...</p>}
```

### Issue: AI returns errors

**Solution**: Always handle errors gracefully

```typescript
if (!response.success) {
  toast.error(createAIErrorMessage(response.error || "", language));
  // Provide manual alternative
}
```

### Issue: Responses are not in JSON format

**Solution**: The backend automatically wraps non-JSON responses

```typescript
// The parseAIResponse function handles this automatically
// You'll receive { explanation: "text response", recommendations: [...] }
```

---

## 📞 Support

For questions or issues with AI integration:
1. Check the console for detailed error messages
2. Verify OPENROUTER_API_KEY is configured
3. Test with demo mode enabled
4. Review the AI telemetry logs

---

## 🎓 Example: Full Integration

Here's a complete example integrating AI into a Crop Planning component:

```tsx
import React, { useState } from "react";
import { getCropPlanningAdvice } from "../utils/aiFeatureIntegration";
import { AIInsightCard, AISuggestionChip } from "../components/ai-features/AIUIComponents";

export function CropPlanningScreen() {
  const [plots, setPlots] = useState([
    { name: "Plot A", size_acres: 2.5 },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Crop Planning</h1>

      {/* Inline AI suggestion */}
      <div className="mb-4">
        <AISuggestionChip
          feature="crop_planning"
          context={{ plots, goal: "yield" }}
          language="EN"
          onApply={(response) => {
            // Auto-fill form with AI suggestions
            applyAISuggestions(response.response);
          }}
        />
      </div>

      {/* Plot configuration UI */}
      <div className="space-y-4">
        {plots.map((plot) => (
          <PlotCard key={plot.name} plot={plot} />
        ))}
      </div>

      {/* Full AI insights card */}
      <div className="mt-6">
        <AIInsightCard
          feature="crop_planning"
          context={{ plots, season_window: "March-July 2026" }}
          language="EN"
          autoLoad={false}
          onAction={(action, data) => {
            if (action === "apply") {
              // Apply all AI recommendations
              applyAllRecommendations(data);
            }
          }}
        />
      </div>
    </div>
  );
}
```

---

## 🚀 Next Steps

1. **Start Small**: Add inline AI chips to one feature first
2. **Gather Feedback**: See how farmers interact with AI
3. **Iterate**: Adjust prompts based on user feedback
4. **Scale**: Add AI to more features progressively

---

**Built with ❤️ for Tanzanian farmers**  
**Philosophy**: Speed > Beauty > Completeness  
**Brand**: Only #2E7D32 (Raspberry Leaf Green)
