# KILIMO Demo Mode - Quick Reference Card

## 🚀 Access
```
/?demo=control
```

## 🎯 Quick Setup (30 seconds)

1. **Select Role** → Dropdown (top-left)
2. **Set Language** → EN/SW toggle
3. **Load Data** → "Load Mock Data" button
4. **Launch** → "Launch Demo" button

## 🎮 Controls Overview

### Top Toolbar
| Button | Action |
|--------|--------|
| **Role Dropdown** | Switch between 7 user types |
| **EN/SW Toggle** | Change language |
| **Load Mock Data** | Generate Tanzania farm data |
| **Export** | Download config JSON |
| **Import** | Upload saved config |
| **Reset** | Clear settings, keep session |
| **Launch Demo** | Start demo with current settings |
| **Exit (logout icon)** | Close demo mode |

## 📊 Main Tabs

### 1. Features Tab
- **Grid:** 60+ feature toggles
- **Buttons:** 
  - Load Role Defaults
  - Enable All
  - Disable All

### 2. AI Profile Tab
- **Verbosity:** Low | Medium | High
- **Tone:** Advisory | Operational | Strategic
- **Risk Tolerance:** Slider (0.0 - 1.0)
- **Temperature:** Slider (0.0 - 1.0)
- **Max Tokens:** Slider (100 - 2000)

### 3. Mock Data Tab
- **Generate Button:** Create new farm data
- **Preview:** View generated user/farm details

### 4. UI Audit Tab
- **Run Validation:** Check branding/UI compliance
- **Results:** Valid | Warning | Error

### 5. Config JSON Tab
- **View:** Current state as JSON
- **Copy:** Copy to clipboard

## 🎭 7 Roles

1. **Smallholder Farmer** - Basic features
2. **Farmer Manager** - Mid-tier features
3. **Commercial Farm Admin** - Advanced analytics
4. **Agribusiness Operations** - B2B features
5. **Extension Officer / NGO** - Advisory tools
6. **Cooperative Leader** - Group management
7. **System Admin** - Full access

## 🌍 Mock Data Details

### Generated Content
- ✅ Tanzanian names (Juma, Fatuma, Hassan...)
- ✅ Real regions (Arusha, Mwanza, Dodoma...)
- ✅ Climate-aware crops (Coffee, Maize, Cassava...)
- ✅ TZS currency (Tanzanian Shillings)
- ✅ +255 phone numbers
- ✅ Weather forecasts
- ✅ Market prices
- ✅ Financial transactions

## 🎬 Common Presets

### VC Demo
```
Role: Commercial Farm Admin
Language: EN
Features: Analytics, Predictive Models, Farm Finance
AI: High verbosity, Strategic tone
```

### NGO Demo
```
Role: Smallholder Farmer
Language: SW
Features: Crop Planning, Weather, Market Prices
AI: Low verbosity, Advisory tone
```

### QA Test
```
Role: [Test each]
Language: [Test both EN/SW]
Features: [Toggle systematically]
AI: Default settings
```

## ⚠️ Important Rules

### ✅ Demo Mode DOES:
- Run in isolated session
- Use virtual feature overrides
- Generate synthetic data
- Clear completely on exit
- Safe for external demos

### ❌ Demo Mode DOES NOT:
- Write to production database
- Modify real user data
- Send actual API calls
- Process real payments
- Persist after session ends

## 🔄 Workflows

### Standard Demo
```
Access → Configure → Load Data → Launch → Present → Exit
```

### Quick Launch
```
Access → Load Role Defaults → Load Data → Launch
```

### Export/Import
```
Configure → Export → Share → Import → Launch
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Demo won't load | Clear cache, try `?demo=control` |
| No features showing | Click "Load Role Defaults" |
| Data shows "Not Loaded" | Click "Load Mock Data" |
| Language mixing | Toggle EN/SW switch |
| Can't exit | Click logout icon or close browser |

## 📱 Keyboard Shortcuts

Currently no keyboard shortcuts - roadmap feature.

## 🎨 Status Indicators

### Header Badges
- **Yellow "PRE-AUTH SANDBOX"** - Demo active
- **Session ID** - Last 8 chars of session

### Status Cards
- **Active Role** - Current simulation
- **Enabled Features** - Feature count
- **Mock Data** - Loaded status
- **UI Status** - Validation result

### In-App Badge
- **Yellow "DEMO MODE ACTIVE"** - Top-right when launched

## 📊 Data Limits

- **Features:** 60+ available
- **Roles:** 7 available
- **Languages:** 2 available (EN/SW)
- **Mock Users:** Unlimited generation
- **Session Size:** ~50KB
- **Export File:** ~20-50KB JSON

## 🔒 Security Level

- **Authentication:** None required (pre-auth)
- **Data Storage:** sessionStorage only
- **Backend Access:** Zero writes
- **Privacy:** No real user data
- **Compliance:** GDPR-safe

## 📞 Quick Support

| For | Contact |
|-----|---------|
| Technical Issues | Platform Engineering |
| Feature Requests | Product Team |
| Documentation | See `/DEMO_MODE_USER_GUIDE.md` |
| Training | QA Team |

## 🎯 Success Checklist

Before launching demo:
- [ ] Role selected
- [ ] Language set
- [ ] Mock data loaded (green checkmark)
- [ ] Features configured
- [ ] UI validated (optional)
- [ ] Config exported (optional)

## 💾 Export Format

```json
{
  "active_role": "smallholder_farmer",
  "enabled_features": ["crop_planning", "weather", ...],
  "ai_profile": {
    "verbosity": "medium",
    "tone": "advisory",
    "riskTolerance": 0.5,
    "temperature": 0.7,
    "maxTokens": 500
  },
  "language": "en",
  "mock_data": { ... },
  "ui_status": "valid",
  "issues_detected": [],
  "session_id": "demo-123-abc",
  "timestamp": "2026-01-24T..."
}
```

## 🌟 Pro Tips

1. **Save Templates** - Export configs for common scenarios
2. **Test Bilingual** - Always check both EN and SW
3. **Validate UI** - Run audit before important demos
4. **Share Configs** - Team consistency via import/export
5. **Reset Often** - Start fresh for each demo type
6. **Document Issues** - Export JSON when bugs found

## 📅 Recommended Schedule

### Before Demo
- 5 min: Configure settings
- 2 min: Load and verify data
- 1 min: Run UI validation

### During Demo
- 15-30 min: Navigate features
- Highlight role-specific capabilities

### After Demo
- 1 min: Export config for record
- 2 min: Reset for next demo

## 🎓 Learning Path

1. **Week 1:** Master basic navigation
2. **Week 2:** Configure all 7 roles
3. **Week 3:** Test all 60+ features
4. **Week 4:** Create custom demo scenarios
5. **Week 5:** Train others

## 🏆 Demo Mode Mastery

**Beginner:** Can launch basic demo  
**Intermediate:** Can configure custom demos  
**Advanced:** Can create role-specific scenarios  
**Expert:** Can train others and troubleshoot  

---

## 🚀 Most Common Action

**"Quick VC Demo"**

```
1. /?demo=control
2. Role: Commercial Farm Admin
3. Language: EN
4. Load Mock Data
5. Launch Demo
```

**Done in 30 seconds! 🎉**

---

**Keep this card handy for all demo preparations!**

📄 **Full Documentation:** `/DEMO_MODE_USER_GUIDE.md`  
📊 **Implementation Details:** `/DEMO_MODE_IMPLEMENTATION_SUMMARY.md`
