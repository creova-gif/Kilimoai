# 🚀 KILIMO AI QUICK REFERENCE CARD

## 📥 Import What You Need

```typescript
// For AI calls
import {
  getCropPlanningAdvice,
  getYieldRevenueAdvice,
  getMarketplaceAdvice,
  // ... other feature-specific functions
} from "../utils/aiFeatureIntegration";

// For UI components
import {
  AISuggestionChip,
  AIInsightCard,
  AIWhyChip,
  AIStatusBadge,
} from "../components/ai-features/AIUIComponents";
```

---

## 🎯 10 AI Features at a Glance

| Feature | Function | Key Inputs |
|---------|----------|------------|
| **Crop Intelligence** | `getCropIntelligenceAdvice()` | crop_name, variety, region |
| **Farming Templates** | `getFarmingTemplateAdvice()` | crop, practice_type, soil_type |
| **Crop Planning** | `getCropPlanningAdvice()` | plots, template, goal |
| **Yield & Revenue** | `getYieldRevenueAdvice()` | crop_plan, market_prices |
| **Inventory** | `getInventoryAdvice()` | harvested, planned, stock |
| **Marketplace** | `getMarketplaceAdvice()` | inventory, prices, channels |
| **Finance** | `getFinanceAdvice()` | transactions, balance |
| **Livestock** | `getLivestockAdvice()` | animal_type, symptoms |
| **Unified Advisor** | `getUnifiedAdvice()` | activity, weather, query |
| **Weather Advice** | `getWeatherAdvice()` | forecast, crops, tasks |

---

## ⚡ Quick Usage Patterns

### Pattern 1: Simple AI Call

```typescript
const response = await getCropPlanningAdvice({
  plots: [{ name: "Plot A", size_acres: 2.5 }],
  goal: "yield",
  language: "EN",
});

if (response.success) {
  console.log(response.response);
} else {
  console.error(response.error);
}
```

### Pattern 2: Inline Suggestion Chip

```tsx
<AISuggestionChip
  feature="crop_planning"
  context={{ plots: [...] }}
  language="EN"
  onApply={(r) => applyData(r)}
/>
```

### Pattern 3: Full Insights Card

```tsx
<AIInsightCard
  feature="yield_revenue"
  context={{ crop_plan: [...] }}
  language="EN"
  autoLoad={true}
  onAction={(action, data) => {
    if (action === "apply") {
      applyAISuggestions(data);
    }
  }}
/>
```

### Pattern 4: Why Explanation

```tsx
<AIWhyChip
  explanation="Based on rainfall and soil type"
  language="EN"
/>
```

---

## 🎨 Brand Colors (STRICT)

```css
/* ✅ ALLOWED */
--primary: #2E7D32;        /* Raspberry Leaf Green */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-900: #111827;
--semantic-red: #DC2626;   /* Only with label */
--semantic-yellow: #F59E0B; /* Only with label */

/* ❌ FORBIDDEN */
--blue: #0EA5E9;           /* Never use */
--teal: #14B8A6;           /* Never use */
--purple: #9333EA;         /* Never use */
```

---

## 🌍 Bilingual Support

```typescript
// Get language from localStorage
const language = localStorage.getItem("language") || "EN";

// Pass to AI functions
const response = await getCropPlanningAdvice({
  plots: [...],
  language: language as "EN" | "SW",
});

// Pass to UI components
<AIInsightCard
  feature="crop_planning"
  context={{...}}
  language={language as "EN" | "SW"}
/>
```

---

## 🔒 Safety Checklist

Before deploying AI features:

- [ ] Never auto-apply AI suggestions without user confirmation
- [ ] Always show loading states
- [ ] Handle errors gracefully with fallback UI
- [ ] Provide "Why?" explanations for transparency
- [ ] Allow users to dismiss AI suggestions
- [ ] Respect offline scenarios
- [ ] Only use #2E7D32 for primary AI actions
- [ ] Test in both English and Swahili

---

## 📊 Response Structures

### Crop Planning Response

```typescript
{
  space_utilization: number,
  warnings: string[],
  suggested_adjustments: Array<{
    plot: string,
    issue: string,
    recommendation: string
  }>,
  auto_tasks: Array<{
    task_name: string,
    target_date: string,
    plot: string
  }>
}
```

### Yield & Revenue Response

```typescript
{
  yield_range: {
    low_kg: number,
    high_kg: number,
    most_likely_kg: number
  },
  revenue_range: {
    low_tzs: number,
    high_tzs: number,
    most_likely_tzs: number
  },
  key_assumptions: string[],
  confidence_note: string
}
```

### Unified Advisor Response

```typescript
{
  top_insights: Array<{
    title: string,
    description: string,
    urgency: "low" | "medium" | "high"
  }>,
  next_action: {
    action: string,
    reason: string,
    deadline: string
  }
}
```

---

## ⚠️ Common Pitfalls

### ❌ Wrong: Auto-applying AI suggestions

```typescript
const response = await getCropPlanningAdvice({...});
if (response.success) {
  // DON'T DO THIS!
  applyData(response.response);
}
```

### ✅ Correct: User confirmation required

```typescript
const response = await getCropPlanningAdvice({...});
if (response.success) {
  // Show the suggestion
  setAISuggestion(response.response);
  // User must click "Apply" button
}
```

---

### ❌ Wrong: Blocking UI while loading

```typescript
const response = await getCropPlanningAdvice({...});
// User sees nothing while waiting
```

### ✅ Correct: Show loading state

```typescript
setLoading(true);
const response = await getCropPlanningAdvice({...});
setLoading(false);
```

```tsx
{loading && <p>AI is thinking...</p>}
```

---

### ❌ Wrong: No error handling

```typescript
const response = await getCropPlanningAdvice({...});
console.log(response.response); // Crashes if error
```

### ✅ Correct: Handle errors

```typescript
const response = await getCropPlanningAdvice({...});
if (!response.success) {
  toast.error(createAIErrorMessage(response.error || "", language));
  return;
}
console.log(response.response);
```

---

## 🧪 Testing Your Integration

### 1. Test AI Call

```typescript
// In browser console
import { getCropPlanningAdvice } from "./utils/aiFeatureIntegration";

const test = async () => {
  const response = await getCropPlanningAdvice({
    plots: [{ name: "Test", size_acres: 1 }],
    language: "EN",
  });
  console.log(response);
};

test();
```

### 2. Test UI Component

```tsx
// In your page component
<AIInsightCard
  feature="crop_planning"
  context={{ plots: [{ name: "Test", size_acres: 1 }] }}
  language="EN"
  autoLoad={true}
/>
```

### 3. Check Brand Compliance

Open DevTools → Elements → Inspect AI components → Verify:
- Primary buttons use `#2E7D32`
- No blue, teal, purple colors
- Icons are from `lucide-react`

---

## 📞 Troubleshooting

### Issue: "OPENROUTER_API_KEY not configured"

**Solution**: Environment variable missing on backend
```bash
# Add to Supabase Edge Function secrets
OPENROUTER_API_KEY=your_key_here
```

### Issue: AI responses are slow

**Solution**: Add timeout handling
```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 10000);

fetch(url, { signal: controller.signal });
```

### Issue: AI not working offline

**Solution**: Check network first
```typescript
if (!navigator.onLine) {
  showManualInputOption();
  return;
}
```

---

## 🎓 Full Example

```tsx
import React, { useState } from "react";
import { getCropPlanningAdvice } from "../utils/aiFeatureIntegration";
import { AIInsightCard } from "../components/ai-features/AIUIComponents";
import { Button } from "../components/ui/button";

export function MyPage() {
  const [showAI, setShowAI] = useState(false);
  const language = "EN";

  return (
    <div>
      <h1>Crop Planning</h1>
      
      <Button onClick={() => setShowAI(!showAI)}>
        {showAI ? "Hide AI" : "Show AI"}
      </Button>

      {showAI && (
        <AIInsightCard
          feature="crop_planning"
          context={{
            plots: [{ name: "Plot A", size_acres: 2.5 }],
            goal: "yield",
          }}
          language={language}
          autoLoad={true}
          onAction={(action, data) => {
            if (action === "apply") {
              console.log("Applying:", data);
            }
          }}
        />
      )}
    </div>
  );
}
```

---

## 🔗 Key Files

| File | Purpose |
|------|---------|
| `/supabase/functions/server/ai_feature_prompts.tsx` | Backend prompts |
| `/supabase/functions/server/ai_engine.tsx` | AI endpoint |
| `/utils/aiFeatureIntegration.ts` | Frontend utilities |
| `/components/ai-features/AIUIComponents.tsx` | UI components |
| `/docs/AI_FEATURE_INTEGRATION_GUIDE.md` | Full guide |
| `/components/examples/CropPlanningWithAI.tsx` | Live example |

---

## ✅ Pre-Deployment Checklist

- [ ] OPENROUTER_API_KEY configured
- [ ] All AI functions tested
- [ ] UI components render correctly
- [ ] Loading states work
- [ ] Error handling works
- [ ] Brand colors compliant (#2E7D32 only)
- [ ] Bilingual support working
- [ ] No auto-commit behavior
- [ ] User can dismiss suggestions
- [ ] Offline behavior handled

---

**Built with ❤️ for Tanzanian farmers**  
**Philosophy**: AI must feel helpful, not loud  
**Brand**: Only #2E7D32 (Raspberry Leaf Green)
