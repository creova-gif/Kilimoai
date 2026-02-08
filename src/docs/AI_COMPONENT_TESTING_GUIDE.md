# 🧪 KILIMO AI - Component Testing Guide

## Purpose

This guide provides step-by-step instructions for testing AI components to ensure they meet production quality standards.

---

## ✅ Pre-Deployment Checklist

Before ANY AI component goes to production, it MUST pass all these tests:

- [ ] **Visual Test**: Renders correctly with full data
- [ ] **Visual Test**: Renders correctly with partial data
- [ ] **Visual Test**: Renders correctly with empty/null data
- [ ] **Network Test**: Handles API failures gracefully
- [ ] **Brand Test**: Zero brand violations
- [ ] **TypeScript Test**: No type errors in strict mode
- [ ] **Performance Test**: Loads within 2 seconds
- [ ] **Accessibility Test**: Keyboard navigation works

---

## 🎯 Test Scenarios

### Scenario A: First-Time User (Empty Data)

**Purpose**: Ensure component doesn't crash when user has no data

**Steps**:
1. Clear all user data from localStorage
2. Navigate to AI feature
3. Verify empty state message appears
4. Verify no console errors
5. Verify action button works

**Expected Outcome**:
```
✅ Shows calm, helpful empty state
✅ Clear message: "No data yet"
✅ Action button to add data
✅ NO crashes
✅ NO console errors
```

**Test Code**:
```tsx
// Test with null/undefined data
<AIRecommendationEngine
  userId="test-user"
  region={null}
  crops={[]}
  farmSize=""
  apiBase="https://fake.api"
  authToken="test"
/>
```

---

### Scenario B: Partial Data

**Purpose**: Ensure component works with incomplete user profiles

**Steps**:
1. Set up user with only 1-2 fields filled
2. Navigate to AI feature
3. Verify component renders safely
4. Verify no missing data causes crashes
5. Verify helpful messages for missing data

**Expected Outcome**:
```
✅ Component renders
✅ Shows available data
✅ Graceful handling of missing fields
✅ NO crashes or blank screens
```

**Test Code**:
```tsx
<AIRecommendationEngine
  userId="test-user"
  region="Arusha"
  crops={["Maize"]}  // Only 1 crop
  farmSize=""  // Missing
  apiBase="https://fake.api"
  authToken="test"
/>
```

---

### Scenario C: Full Data (Happy Path)

**Purpose**: Verify component works perfectly with complete data

**Steps**:
1. Set up user with all fields populated
2. Navigate to AI feature
3. Verify all sections render
4. Verify data displays correctly
5. Verify interactions work

**Expected Outcome**:
```
✅ All sections visible
✅ Data displays correctly
✅ Metrics show proper values
✅ Charts/graphs render
✅ Actions work as expected
```

**Test Code**:
```tsx
<AIRecommendationEngine
  userId="test-user"
  region="Arusha"
  crops={["Maize", "Beans", "Coffee"]}
  farmSize="5 acres"
  apiBase="https://real.api"
  authToken="real-token"
/>
```

---

### Scenario D: API Failure

**Purpose**: Ensure app doesn't break when backend is down

**Steps**:
1. Mock API to return 500 error
2. Navigate to AI feature
3. Verify error handling
4. Verify fallback UI shows
5. Verify retry mechanism works

**Expected Outcome**:
```
✅ No white screen of death
✅ Shows calm error message
✅ Offers retry action
✅ Falls back to mock/cached data
✅ Logs error to console
```

**Mock API Code**:
```tsx
// In test environment
global.fetch = jest.fn(() =>
  Promise.reject(new Error('Network error'))
);

// Component should still render
<AIRecommendationEngine {...props} />
```

---

### Scenario E: Slow Network

**Purpose**: Ensure loading states work properly

**Steps**:
1. Throttle network to 3G speed
2. Navigate to AI feature
3. Verify loading indicator appears
4. Verify no content flash
5. Verify timeout handling

**Expected Outcome**:
```
✅ Shows loading spinner immediately
✅ No blank screen
✅ No content flash
✅ Loads within timeout (10s)
✅ Shows error if timeout exceeded
```

---

## 🎨 Brand Compliance Test

### Automated Check

```bash
# Run brand compliance checker
chmod +x scripts/check-brand-compliance.sh
./scripts/check-brand-compliance.sh
```

### Manual Visual Check

Open each AI component and verify:

- [ ] Only `#2E7D32` green visible
- [ ] No gradients (no `from-`, `to-`, `via-`)
- [ ] No blue, purple, cyan, orange, pink colors
- [ ] No animated glowing orbs
- [ ] No color-coded categories
- [ ] White or gray backgrounds only
- [ ] Professional, calm appearance

**PASS**: Zero non-brand colors  
**FAIL**: Any gradient or non-#2E7D32 color

---

## 🔒 TypeScript Safety Test

### Enable Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Run Type Check

```bash
npx tsc --noEmit
```

**Expected**: Zero errors

### Common Type Issues to Fix

```tsx
// ❌ BAD
const [data, setData] = useState<any>(null);

// ✅ GOOD
interface Data {
  id: string;
  value: number;
}
const [data, setData] = useState<Data | null>(null);
```

```tsx
// ❌ BAD
function Component({ user }) {
  return <div>{user.name}</div>;
}

// ✅ GOOD
interface Props {
  user: { name: string } | null;
}
function Component({ user }: Props) {
  return <div>{user?.name || "Unknown"}</div>;
}
```

---

## ⚡ Performance Test

### Metrics to Measure

- **Initial Load**: < 2 seconds
- **Re-render**: < 100ms
- **API Response**: < 3 seconds

### Tools

```bash
# Lighthouse audit
npm run build
npx serve -s build
# Open Chrome DevTools > Lighthouse > Run audit
```

### Performance Checklist

- [ ] Component uses `React.memo` if needed
- [ ] Large lists use virtualization
- [ ] Images are optimized
- [ ] No unnecessary re-renders
- [ ] API calls are debounced
- [ ] Data is cached where appropriate

---

## ♿ Accessibility Test

### Keyboard Navigation

1. Tab through all interactive elements
2. Verify focus indicators visible
3. Verify all actions work with Enter/Space
4. Verify Escape closes modals

### Screen Reader Test

1. Enable VoiceOver (Mac) or NVDA (Windows)
2. Navigate through component
3. Verify all content is announced
4. Verify labels are clear

### Accessibility Checklist

- [ ] All images have `alt` text
- [ ] All buttons have labels
- [ ] Color is not the only indicator
- [ ] Contrast ratio > 4.5:1
- [ ] Focus visible on all interactive elements
- [ ] Semantic HTML used

---

## 🧰 Testing Tools Setup

### Jest + React Testing Library

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Example Test

```tsx
import { render, screen } from '@testing-library/react';
import { AIRecommendationEngine } from './AIRecommendationEngine';

describe('AIRecommendationEngine', () => {
  it('renders empty state when no data', () => {
    render(
      <AIRecommendationEngine
        userId="test"
        region={null}
        crops={[]}
        farmSize=""
        apiBase="https://fake.api"
        authToken="test"
      />
    );
    
    expect(screen.getByText(/No recommendations available/i)).toBeInTheDocument();
  });

  it('handles API failure gracefully', async () => {
    global.fetch = jest.fn(() => Promise.reject('API Error'));
    
    render(<AIRecommendationEngine {...props} />);
    
    // Should show error state, not crash
    await waitFor(() => {
      expect(screen.getByText(/couldn't load/i)).toBeInTheDocument();
    });
  });
});
```

---

## 📋 Test Report Template

After testing, fill out this report:

```markdown
## AI Component Test Report

**Component**: AIRecommendationEngine
**Date**: YYYY-MM-DD
**Tester**: [Your Name]

### Test Results

| Scenario | Status | Notes |
|----------|--------|-------|
| Empty Data | ✅ / ❌ | |
| Partial Data | ✅ / ❌ | |
| Full Data | ✅ / ❌ | |
| API Failure | ✅ / ❌ | |
| Slow Network | ✅ / ❌ | |
| Brand Compliance | ✅ / ❌ | Violations: X |
| TypeScript | ✅ / ❌ | Errors: X |
| Performance | ✅ / ❌ | Load time: Xs |
| Accessibility | ✅ / ❌ | Issues: X |

### Issues Found

1. [Description of issue]
   - Severity: Critical / High / Medium / Low
   - Steps to reproduce
   - Expected vs Actual behavior

### Recommendations

- [Action items to fix issues]

### Approval

- [ ] All critical issues resolved
- [ ] Ready for production
- [ ] Approved by: [Name]
```

---

## 🚀 Production Readiness Criteria

Component is ready for production when:

1. ✅ All test scenarios pass
2. ✅ Zero brand violations
3. ✅ Zero TypeScript errors
4. ✅ Load time < 2 seconds
5. ✅ Zero accessibility issues
6. ✅ Code reviewed and approved
7. ✅ Documentation updated
8. ✅ Test report completed

---

## 🆘 Common Issues & Fixes

### Issue: Component crashes with empty data

**Cause**: Not checking for null/undefined  
**Fix**: Use optional chaining

```tsx
// ❌ BAD
<div>{data.map(item => ...)}</div>

// ✅ GOOD
<div>{(data || []).map(item => ...)}</div>
```

### Issue: White screen when API fails

**Cause**: No error boundary  
**Fix**: Add try-catch and fallback UI

```tsx
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  console.error('Failed:', error);
  setData(getMockData()); // Fallback
}
```

### Issue: Slow performance

**Cause**: Too many re-renders  
**Fix**: Use React.memo and useMemo

```tsx
const MemoizedComponent = React.memo(Component);
const expensiveValue = useMemo(() => computeExpensiveValue(data), [data]);
```

---

## 📚 Reference

- `/components/ai-ui/` - Reusable components
- `/docs/AI_COMPONENT_STANDARDS.md` - Development standards
- `/scripts/check-brand-compliance.sh` - Brand checker
- `/AI_COMPONENT_AUDIT_REPORT.md` - Audit findings

---

**Remember**: Testing is not optional. Every component MUST pass all tests before deployment. No exceptions.
