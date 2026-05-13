# KILIMO Demo Mode - User Guide

## 🎯 Overview

The **KILIMO Demo Mode Control Panel** is a pre-authentication sandbox environment that allows administrators, VC investors, NGO partners, and internal QA teams to explore, test, and validate the entire KILIMO platform without requiring user authentication or affecting production data.

---

## 🚀 Accessing Demo Mode

### Method 1: Query Parameter (Recommended)
Add `?demo=control` to any KILIMO URL:

```
https://your-kilimo-app.com/?demo=control
```

This instantly loads the Demo Mode Control Panel.

### Method 2: Query Parameter (Simple)
Use the shorter version:

```
https://your-kilimo-app.com/?demo=true
```

### Method 3: Direct Navigation
If already in the app, reload with the demo parameter.

---

## 🎮 Demo Mode Features

### 1. **Role Simulation Switcher**
- **Location:** Top toolbar
- **Roles Available:**
  - Smallholder Farmer
  - Farmer Manager
  - Commercial Farm Admin
  - Agribusiness Operations
  - Extension Officer / NGO
  - Cooperative Leader
  - System Admin

**How to Use:**
1. Select role from dropdown
2. Features auto-adjust to role capabilities
3. Dashboard changes dynamically
4. AI behavior adapts to role

### 2. **Language Lock Toggle**
- **Location:** Top toolbar next to role selector
- **Options:** EN (English) | SW (Swahili)
- **Behavior:** Global language switch with zero mixing

**Use Cases:**
- Test bilingual integrity
- Validate Swahili translations
- Ensure language consistency

### 3. **Feature Matrix Toggle**
- **Location:** Features Tab
- **Count:** 60+ platform features
- **Controls:**
  - Individual toggle switches
  - "Load Role Defaults" - auto-load features for selected role
  - "Enable All" - turn on all features
  - "Disable All" - turn off all features

**Features Include:**
- Crop Planning
- Livestock Management
- Farm Finance
- AI Workflows
- Marketplace
- Photo Diagnosis
- Voice Assistant
- Analytics Dashboard
- ... and 50+ more

### 4. **AI Behavior Controls**
- **Location:** AI Profile Tab
- **Settings:**

#### **AI Verbosity**
- Low: Short, concise responses
- Medium: Balanced detail
- High: Comprehensive, detailed responses

#### **AI Tone**
- Advisory: Friendly, suggestive
- Operational: Direct, actionable
- Strategic: High-level, planning-focused

#### **Risk Tolerance Slider**
- Conservative (0.0) → Aggressive (1.0)
- Controls risk framing in recommendations

#### **AI Temperature**
- Deterministic (0.0) → Creative (1.0)
- Controls response variability

#### **Max Tokens**
- Range: 100 - 2000 tokens
- Controls response length

### 5. **Mock Data Generator**
- **Location:** Mock Data Tab
- **Button:** "Generate New Data"

**Generated Data Includes:**
- **User Profile:** Name, phone, region, age group, gender
- **Farm Details:** Location, size, type, crops, livestock
- **Financial Data:** Transactions, income, expenses (in TZS)
- **Weather Data:** Current conditions, 7-day forecast, alerts
- **Market Prices:** Real-time prices for user crops
- **AI Query History:** Sample questions and responses

**Tanzania-Specific Features:**
- Realistic Tanzanian names (Juma, Fatuma, Hassan, etc.)
- Actual regions (Arusha, Mwanza, Dar es Salaam, etc.)
- Climate-aware crop selection
- TZS currency for all financial data
- Authentic Tanzanian phone numbers

### 6. **UI Audit & Validation**
- **Location:** UI Audit Tab
- **Button:** "Run Validation"

**Checks:**
- CREOVA/KILIMO branding compliance
- Typography consistency
- Color palette adherence (Deep Green #0F3D2E, Earth Brown, Soft Sand)
- Component spacing
- Responsive layout integrity

**Results:**
- ✅ Valid: No issues detected
- ⚠️ Warning: Minor issues (< 5)
- ❌ Error: Critical issues (> 5)

### 7. **Configuration Export/Import**
- **Location:** Config JSON Tab & Top Toolbar
- **Export:** Download current demo state as JSON
- **Import:** Upload previously exported JSON

**Use Cases:**
- Save demo configurations for VC presentations
- Share setup with team members
- Reproduce exact demo environments
- Version control demo states

---

## 📋 Common Use Cases

### **Use Case 1: VC Demo Preparation**

**Scenario:** Preparing for investor pitch

**Steps:**
1. Access Demo Mode: `?demo=control`
2. Select Role: `Commercial Farm Admin`
3. Enable Features:
   - Analytics Dashboard
   - Predictive Models
   - Farm Finance
   - AI Recommendations
4. Set Language: `EN`
5. Load Mock Data (generates large commercial farm)
6. Set AI Profile:
   - Verbosity: High
   - Tone: Strategic
   - Risk Tolerance: 0.7
7. Export Config → Save as `vc-demo-v1.json`
8. Click "Launch Demo"
9. Present full platform with mock data

### **Use Case 2: NGO Pilot Testing**

**Scenario:** Testing platform for smallholder farmers

**Steps:**
1. Access Demo Mode
2. Select Role: `Smallholder Farmer`
3. Load Role Defaults (auto-loads appropriate features)
4. Set Language: `SW` (Swahili)
5. Load Mock Data (generates small farm)
6. Set AI Profile:
   - Verbosity: Low
   - Tone: Advisory
   - Risk Tolerance: 0.3
7. Test voice assistant, photo diagnosis, market prices
8. Export results for NGO report

### **Use Case 3: Feature QA Testing**

**Scenario:** Testing new feature across all roles

**Steps:**
1. Access Demo Mode
2. For each role:
   - Select role
   - Enable target feature
   - Load mock data
   - Test feature behavior
   - Run UI validation
   - Export config
3. Compare behavior across roles
4. Document inconsistencies

### **Use Case 4: Bilingual Integrity Check**

**Scenario:** Validate Swahili translation quality

**Steps:**
1. Access Demo Mode
2. Select Role: Any
3. Load Mock Data
4. Set Language: `SW`
5. Enable all features
6. Launch Demo
7. Navigate through all screens
8. Check for:
   - English text mixing
   - Missing translations
   - Formatting issues
9. Run UI Validation
10. Export issues report

---

## 🔧 Technical Details

### **Session Persistence**
- All demo data stored in `sessionStorage`
- Survives page refresh
- Cleared on browser close or demo exit

### **No Backend Writes**
- Zero impact on production database
- All data is virtual and client-side
- Safe for testing at any time

### **Feature Gating Override**
- Virtual layer intercepts `hasFeatureAccess()` calls
- Returns demo-enabled features
- Does not modify production RBAC

### **Mock Data Engine**
- Location-aware (East Africa regions)
- Climate-appropriate crops
- Realistic transaction amounts (TZS)
- Non-identifiable synthetic data

---

## 🚨 Important Notes

### **What Demo Mode DOES:**
- ✅ Simulates full platform functionality
- ✅ Allows safe feature testing
- ✅ Generates realistic mock data
- ✅ Supports all 7 user roles
- ✅ Enables bilingual testing
- ✅ Provides UI validation

### **What Demo Mode DOES NOT:**
- ❌ Write to production database
- ❌ Modify real user data
- ❌ Send actual API calls (uses mocks)
- ❌ Process real payments
- ❌ Send SMS/emails
- ❌ Persist after session ends

### **When to Use Demo Mode:**
- ✅ VC/Investor presentations
- ✅ NGO partner demos
- ✅ Internal QA testing
- ✅ Feature validation
- ✅ UI/UX audits
- ✅ Branding compliance checks
- ✅ Onboarding walkthroughs

### **When NOT to Use Demo Mode:**
- ❌ Production user testing
- ❌ Real farmer onboarding
- ❌ Actual data collection
- ❌ Financial transactions
- ❌ Integration testing with real APIs

---

## 📊 Status Indicators

### **Header Badges**
- **Yellow "PRE-AUTH SANDBOX"**: Demo Mode active
- **Session ID**: Current demo session identifier (last 8 chars)

### **Status Cards**
1. **Active Role**: Currently selected user role
2. **Enabled Features**: Count of active features
3. **Mock Data**: Loaded or Not Loaded
4. **UI Status**: Valid, Warning, or Error

### **Main Dashboard Indicator**
When demo is launched, a **yellow "DEMO MODE ACTIVE"** badge appears in top-right corner.

---

## 🔄 Resetting Demo Mode

### **Soft Reset**
- **Location:** Top toolbar
- **Button:** "Reset"
- **Action:** Clears current config, returns to defaults
- **Preserves:** Session remains active

### **Hard Reset (Exit)**
- **Location:** Top toolbar (logout icon)
- **Button:** Exit icon
- **Action:** Clears all demo data, exits demo mode
- **Effect:** Returns to normal login screen

---

## 📤 Exporting Configurations

### **JSON Export**
1. Configure demo state (role, features, AI profile, data)
2. Click "Export" in top toolbar
3. Downloads: `kilimo-demo-config-[timestamp].json`
4. Share with team or save for future use

### **Import Saved Config**
1. Click "Import" in top toolbar
2. Select previously exported JSON file
3. Demo state restored exactly
4. Click "Launch Demo"

---

## 🎓 Best Practices

### **For VC Presentations**
- Pre-configure and export your ideal demo state
- Use "Commercial Farm Admin" or "Agribusiness" roles
- Enable high-value features (Analytics, Predictive Models, Farm Graph)
- Set AI verbosity to "High" for detailed insights
- Load mock data with substantial farm size

### **For NGO Pilots**
- Use "Smallholder Farmer" or "Extension Officer" roles
- Focus on practical features (Crop Planning, Weather, Market Prices)
- Set language to Swahili for local context
- Use "Advisory" AI tone with "Low" verbosity
- Test voice assistant and photo diagnosis

### **For QA Testing**
- Test each role systematically
- Export config after each test
- Run UI validation frequently
- Check bilingual integrity with language toggle
- Document issues in Config JSON tab

### **For Branding Audits**
- Run UI Validation
- Check color consistency (CREOVA palette)
- Verify typography hierarchy
- Test responsive layouts (desktop/mobile)
- Ensure no UI drift from design system

---

## 🐛 Troubleshooting

### **Issue:** Demo Mode won't load
**Solution:** Clear browser cache, try `?demo=control` again

### **Issue:** Features not appearing
**Solution:** Click "Load Role Defaults" in Features tab

### **Issue:** Mock data shows as "Not Loaded"
**Solution:** Click "Load Mock Data" button in Mock Data tab

### **Issue:** Language still mixing EN/SW
**Solution:** Toggle language switch, refresh demo

### **Issue:** AI not responding
**Solution:** Check AI Profile settings, ensure verbosity is not "None"

### **Issue:** Can't exit demo mode
**Solution:** Click logout icon in top toolbar, or close browser

---

## 📞 Support

For technical issues with Demo Mode:
- **Internal:** Contact Platform Engineering team
- **Partners:** Reach out to KILIMO Support
- **Documentation:** See `/MASTER_PROMPT_IMPLEMENTATION.md`

---

## 🔐 Security Notes

- Demo Mode is **pre-authentication** only
- No real user credentials required
- All data is **session-scoped**
- Zero **production impact**
- Safe for **external demos**

---

## 📝 Version History

### v1.0 (Current)
- Initial release
- 7 role simulations
- 60+ feature toggles
- Tanzania mock data generator
- AI profile controls
- UI validation
- Export/import configs
- Bilingual support (EN/SW)

---

**Demo Mode Access URL:**
```
https://your-kilimo-app.com/?demo=control
```

**Quick Start:**
1. Add `?demo=control` to URL
2. Select role
3. Load mock data
4. Click "Launch Demo"
5. Explore KILIMO platform

🌾 **Happy Demoing!**
