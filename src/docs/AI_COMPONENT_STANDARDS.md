# KILIMO AI - Component Development Standards

## 🎯 Purpose

This document defines the mandatory standards for ALL AI components in the KILIMO Agri-AI Suite.

## ✅ BRAND COMPLIANCE RULES (NON-NEGOTIABLE)

### Colors

**ALLOWED:**
- `#2E7D32` - Raspberry Leaf Green (primary brand color)
- `rgba(46,125,50,X)` - Brand green with opacity
- `text-gray-[X]` - Gray text (100-900)
- `bg-gray-[X]` - Gray backgrounds (50-900)
- `border-gray-[X]` - Gray borders (100-900)
- `bg-white` - White backgrounds
- `text-white` - White text

**FORBIDDEN:**
- ❌ `green-[number]` (e.g., `green-500`, `green-600`)
- ❌ `blue-[number]`, `purple-[number]`, `cyan-[number]`
- ❌ `emerald-`, `teal-`, `lime-`
- ❌ `from-`, `to-`, `via-` (gradients)
- ❌ `bg-gradient-*`
- ❌ ALL color utilities except gray and white

### UI Elements

**ALLOWED:**
- Clean white backgrounds
- Simple borders (`border-gray-200`)
- Subtle shadows (`shadow-sm`, `shadow-md`)
- Brand-colored icons and buttons

**FORBIDDEN:**
- ❌ Gradient backgrounds
- ❌ Animated glowing orbs
- ❌ Color-coded categories (red=bad, green=good)
- ❌ Decorative blur effects
- ❌ Multi-color themes

## 📦 REQUIRED COMPONENT STRUCTURE

### 1. Use Reusable AI UI Components

```tsx
import {
  AIHeader,
  AISection,
  AIEmptyState,
  AIMetricCard,
  AIQuickAction,
  AILoadingState,
  AIStatusBadge
} from "./ai-ui";
```

### 2. Header Pattern

```tsx
<AIHeader
  icon={Brain}
  title="AI Feature Name"
  description="Clear description of what this does"
  onRefresh={handleRefresh}
  language={language}
/>
```

### 3. Loading State

```tsx
if (loading) {
  return <AILoadingState message="Loading insights..." language={language} />;
}
```

### 4. Empty State

```tsx
if (!data || data.length === 0) {
  return (
    <AIEmptyState
      icon={Inbox}
      title="No data yet"
      description="We'll show insights here once you add your farm data."
      actionLabel="Add Farm Data"
      onAction={() => navigate('farm-setup')}
      language={language}
    />
  );
}
```

### 5. Metric Display

```tsx
<AIMetricCard
  icon={TrendingUp}
  label="Accuracy"
  value="94.2%"
  helper="Based on 1,234 predictions"
/>
```

## 🛡️ RUNTIME SAFETY REQUIREMENTS

### 1. Null Safety

```tsx
// ❌ BAD
<div>{user.name}</div>

// ✅ GOOD
<div>{user?.name || "Unknown"}</div>
```

### 2. Empty Data Handling

```tsx
// ❌ BAD - Will crash if crops is undefined
crops.map(crop => <div>{crop}</div>)

// ✅ GOOD
(crops || []).map(crop => <div key={crop}>{crop}</div>)
```

### 3. API Error Handling

```tsx
try {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('API request failed');
  }
  const data = await response.json();
  setData(data);
} catch (error) {
  console.error('Failed to load data:', error);
  // Show fallback UI - NEVER crash
  setData(getMockData());
}
```

## 🧪 TESTING REQUIREMENTS

### Before Every Commit

1. **Visual Test**: Component renders without data
2. **Visual Test**: Component renders with partial data
3. **Visual Test**: Component renders with full data
4. **Network Test**: Component handles API failures gracefully
5. **Brand Test**: Run `./scripts/check-brand-compliance.sh`

### Test Scenarios

```tsx
// Test 1: Empty state
<AIComponent userId="test" data={null} />

// Test 2: Partial data
<AIComponent userId="test" data={[{ id: 1 }]} />

// Test 3: Full data
<AIComponent userId="test" data={fullDataset} />

// Test 4: API failure (mock failed response)
```

## 📋 CHECKLIST FOR NEW AI COMPONENTS

- [ ] Uses `<AIHeader>` for header
- [ ] Uses `<AILoadingState>` for loading
- [ ] Uses `<AIEmptyState>` for no data
- [ ] Uses `<AIMetricCard>` for metrics
- [ ] Uses `<AISection>` for sections
- [ ] Only uses #2E7D32 green
- [ ] No gradients anywhere
- [ ] No color-coded UI elements
- [ ] Handles null/undefined data safely
- [ ] Handles API errors gracefully
- [ ] No `any` types (TypeScript strict mode)
- [ ] All props properly typed
- [ ] Passes `check-brand-compliance.sh`
- [ ] Tested with empty data
- [ ] Tested with API failure

## 🚫 COMMON MISTAKES TO AVOID

### 1. Color-Coded Categories

```tsx
// ❌ BAD - Color coding creates inconsistency
const categoryColors = {
  weather: "text-purple-600 bg-purple-50",
  market: "text-blue-600 bg-blue-50",
  pest: "text-red-600 bg-red-50"
};

// ✅ GOOD - Consistent styling
const categoryStyle = "text-gray-700 border-gray-300 hover:bg-[#2E7D32]/5";
```

### 2. Gradient Backgrounds

```tsx
// ❌ BAD
<div className="bg-gradient-to-r from-green-500 to-blue-600">

// ✅ GOOD
<div className="bg-[#2E7D32]">
```

### 3. Assuming Data Exists

```tsx
// ❌ BAD - Will crash
<h1>{user.farm.crops[0].name}</h1>

// ✅ GOOD
<h1>{user?.farm?.crops?.[0]?.name || "No crop selected"}</h1>
```

### 4. Not Handling Loading States

```tsx
// ❌ BAD - Shows nothing while loading
return <div>{data.map(...)}</div>

// ✅ GOOD
if (loading) return <AILoadingState />;
if (!data) return <AIEmptyState />;
return <div>{data.map(...)}</div>
```

## 🔄 ENFORCEMENT

### Pre-Commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
./scripts/check-brand-compliance.sh || exit 1
```

### CI/CD Pipeline

```yaml
- name: Brand Compliance Check
  run: |
    chmod +x ./scripts/check-brand-compliance.sh
    ./scripts/check-brand-compliance.sh
```

## 📚 Examples

See these reference implementations:
- `/components/ai-ui/AIHeader.tsx` - Header pattern
- `/components/ai-ui/AISection.tsx` - Section pattern
- `/components/ai-ui/AIEmptyState.tsx` - Empty state pattern
- `/components/ai-ui/AIMetricCard.tsx` - Metric display pattern

## 🆘 Need Help?

If you're unsure about a design decision:
1. Check this document first
2. Look at `/components/ai-ui/` for examples
3. When in doubt: **simple white background + #2E7D32 accents**

---

**Remember**: Farmers are task-driven, not feature-driven. AI must feel helpful, not loud. Speed > beauty > completeness. Less UI = more trust.
