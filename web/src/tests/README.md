# 🧪 KILIMO Feature Recovery Regression Tests

## Purpose

Ensures that the consolidation of **58 active features → 12 unified pages** maintains:
- ✅ **Feature Recovery**: All 51 features remain accessible
- ✅ **Security**: Role-based permissions enforced
- ✅ **Brand Compliance**: Raspberry Leaf Green (#2E7D32) only
- ✅ **Mobile UX**: Works on rural phones with limited connectivity
- ✅ **App Store Safety**: No permission violations

## Test Suite Overview

### 1️⃣ Feature Recovery Validation (`feature-recovery.test.ts`)

**Protects:** Feature recovery integrity after BRUTE FEATURE & PAGE AUDIT

**Tests:**
- ✅ All 51 removed features are reachable via unified pages
- ✅ No orphaned features pointing to removed pages
- ✅ Features distributed across 12 pages (no single page overload)
- ✅ Tab uniqueness per page
- ✅ Valid category assignments

**Fail Condition:** Any feature not accessible = **REGRESSION**

```bash
npm run test:regression
```

### 2️⃣ Security & Access Control (`security-regression.test.ts`)

**Protects:** Role-based permissions and App Store compliance

**Tests:**
- 🔐 Smallholders cannot see Insurance/Loans tabs
- 🔐 Team tabs only visible to Commercial users
- 🔐 Revenue/Rotation planning restricted appropriately
- 🔐 Extension Officers have training access
- 🚫 No permission leaks
- 🚫 No startup permission popups (App Store violation)

**Fail Condition:** Permission leak = **SECURITY VIOLATION**

```bash
npm test tests/security-regression.test.ts
```

### 3️⃣ Brand Color Lock (`security-regression.test.ts`)

**Protects:** CREOVA brand identity

**Tests:**
- 🎨 Only Raspberry Leaf Green (#2E7D32) used
- ❌ No blue, purple, emerald, teal, or cyan colors
- ✅ WCAG AA contrast compliance

**Fail Condition:** Banned color found = **BRAND VIOLATION**

### 4️⃣ Mobile Regression Tests (`mobile-e2e.test.ts`)

**Protects:** Field usability for rural farmers

**Tests:**
- 📱 All pages render on 375px mobile screens
- 📱 Touch targets ≥ 44x44px
- 📱 No horizontal scrolling
- 📱 Tabs swipeable on mobile
- 📱 Forms usable on small screens

**Fail Condition:** Mobile UX broken = **FIELD UNUSABLE**

```bash
npm run test:e2e
```

### 5️⃣ Offline Mode Tests (`mobile-e2e.test.ts`)

**Protects:** Rural connectivity constraints

**Tests:**
- ⚠️ Tasks viewable offline
- ⚠️ Critical pages cached
- ⚠️ Actions queue for later sync
- ⚠️ Offline banner appears when disconnected

**Fail Condition:** Offline failure = **APP UNUSABLE IN FIELD**

### 6️⃣ Data Integrity Tests (`security-regression.test.ts`)

**Protects:** Smart automation logic

**Tests:**
- 🧮 Moving planting updates yield & revenue
- 🧮 Task completion updates progress
- 🧮 Yield predictions factor in conditions

**Fail Condition:** Logic broken = **FARMER TRUST LOST**

### 7️⃣ Page Count Lock (`feature-recovery.test.ts`)

**Protects:** Feature sprawl prevention

**Tests:**
- 🔒 Maximum 12 core pages
- ❌ CI fails if 13th page added

**Fail Condition:** New page = **ARCHITECTURE REGRESSION**

### 8️⃣ AI Consolidation Test (`feature-recovery.test.ts`)

**Protects:** AI feature centralization

**Tests:**
- 🧠 All 7 AI features in /ai-advisor only
- ❌ No AI features scattered elsewhere

**Fail Condition:** AI feature elsewhere = **UX CONFUSION**

### 9️⃣ Accessibility Tests (`mobile-e2e.test.ts`)

**Protects:** Inclusive design

**Tests:**
- ♿ ARIA labels on navigation
- ♿ Logical heading hierarchy
- ♿ Focus visible on interactive elements

**Fail Condition:** A11y violation = **EXCLUSION**

## Running Tests

### Unit & Integration Tests (Vitest)
```bash
# Run all tests
npm test

# Run regression tests only
npm run test:regression

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### E2E Tests (Playwright)
```bash
# Run E2E tests
npm run test:e2e

# Specific browser
npx playwright test --project=mobile-chrome

# Debug mode
npx playwright test --debug

# Show report
npx playwright show-report
```

### CI Pipeline

The GitHub Actions workflow (`.github/workflows/regression-guard.yml`) automatically:

1. ✅ Runs feature recovery tests
2. ✅ Validates page count ≤ 12
3. ✅ Checks brand color compliance
4. ✅ Audits security & permissions
5. ✅ Verifies production build
6. ❌ **BLOCKS MERGE** if any test fails

```yaml
# Triggered on:
- push to main/develop
- pull requests to main/develop
```

## Feature Recovery Map

### Complete Feature → Page Mapping

| Feature | Old Page | New Location | Tab ID |
|---------|----------|--------------|--------|
| AI Chat | /ai-chat | /ai-advisor | chat |
| Crop Diagnosis | /crop-diagnosis | /ai-advisor | diagnose |
| Soil Analysis | /soil-analysis | /ai-advisor | soil |
| Growing Methods | /growing-methods | /crop-intelligence | methods |
| Pest Database | /pest-database | /crop-intelligence | pests |
| Farm Mapping | /farm-mapping | /farm-map | map |
| Yield Forecasting | /yield-forecasting | /crop-planning | yield |
| Revenue Estimates | /revenue-estimates | /crop-planning | revenue |
| Wallet | /wallet | /finance | wallet |
| Loans | /loans | /finance | loans |
| Insurance | /insurance | /finance | insurance |
| Price Predictions | /price-predictions | /market | prices |
| ... | ... | ... | ... |

**Total:** 51 features consolidated into 12 pages

## Test Coverage Requirements

- **Minimum:** 80% code coverage
- **Critical paths:** 100% coverage
- **Feature recovery:** 100% coverage

## Debugging Failed Tests

### Feature Not Found
```bash
# Check if feature is mapped
npm test -- --grep "feature-name"

# Verify route exists
npm run dev
# Navigate to: http://localhost:5173/page?tab=tab-id
```

### Permission Leak
```bash
# Run security tests with verbose logging
npm test tests/security-regression.test.ts -- --reporter=verbose
```

### Mobile Failure
```bash
# Debug with Playwright UI
npx playwright test --ui

# Test specific device
npx playwright test --project=mobile-chrome
```

## Adding New Tests

### 1. Feature Recovery Test
```typescript
// tests/feature-recovery.test.ts
it('✅ New Feature → accessible at /page?tab=new-tab', () => {
  expect(featureRoutes).toContainEqual({
    feature: "New Feature",
    page: "/page",
    tab: "new-tab",
    category: "Category"
  });
});
```

### 2. Role Permission Test
```typescript
// tests/security-regression.test.ts
it('🔐 Role X cannot see Tab Y', () => {
  const allowedRoles = tabAccessRules["/page"]["tab"];
  expect(allowedRoles).not.toContain("role_x");
});
```

### 3. Mobile E2E Test
```typescript
// tests/mobile-e2e.test.ts
test('📱 New page works on mobile', async ({ page }) => {
  await page.goto('/new-page');
  await expect(page.locator('h1')).toBeVisible();
});
```

## Success Criteria

✅ **All 51 features accessible**
✅ **Exactly 12 pages (no more, no less)**
✅ **Role-based security enforced**
✅ **Mobile UX verified**
✅ **Offline mode working**
✅ **Brand colors compliant**
✅ **No permission violations**
✅ **CI pipeline green**

## CI/CD Integration

The regression guard runs automatically on every:
- ✅ Push to main/develop
- ✅ Pull request
- ✅ Before merge

**Merge is BLOCKED if:**
- ❌ Any test fails
- ❌ Page count > 12
- ❌ Banned color detected
- ❌ Security audit fails
- ❌ Build fails

## Maintenance

### When Adding a New Feature
1. ✅ Add to existing page via tab
2. ✅ Update `featureRoutes` in tests
3. ✅ Add permission rules if needed
4. ✅ Run `npm run test:regression`

### When Modifying Permissions
1. ✅ Update `tabAccessRules`
2. ✅ Add test cases for new roles
3. ✅ Run security tests
4. ✅ Verify CI passes

### When Changing Brand Colors
1. ❌ **DON'T** - Raspberry Leaf Green is locked
2. ✅ If necessary, update `approvedColors` in tests
3. ✅ Get design approval first

## Contact

For test failures or questions:
- **Architecture:** Check feature recovery map
- **Security:** Review role permissions
- **Mobile:** Test on real devices
- **CI/CD:** Check GitHub Actions logs

---

**Remember:** These tests protect farmer trust. Every failure is a potential field issue. 🌾

**Philosophy:** "Less UI = more trust" → "Less pages = less confusion" → "More tests = more confidence"
