# 👀 What Users See - Role-Based UI Guide

## Visual Guide to KILIMO's Role-Based Access Control

---

## 🎯 **Overview**

Each user type sees a **customized interface** with only the features relevant to their role. This guide shows exactly what appears on screen for each role.

---

## 📱 **1. LOGIN EXPERIENCE**

### **All Users See:**

**Login Screen:**
```
┌─────────────────────────────────────┐
│         KILIMO Logo                 │
│                                     │
│  📧 Email or Phone                  │
│  🔒 Password                        │
│                                     │
│  [LOGIN BUTTON]                     │
│                                     │
│  Don't have account? Register       │
└─────────────────────────────────────┘
```

**Success Toast:**
```
✅ Welcome back, John Doe!
   Smallholder Farmer • 26 features
```

---

## 🏠 **2. HEADER (All Users)**

```
┌──────────────────────────────────────────────────────────────┐
│ ☰  KILIMO Logo    [Search...]   [Mkulima Mdogo] [FREE] EN|SW  🔔² 👤  🚪 │
└──────────────────────────────────────────────────────────────┘
     ↑                               ↑            ↑      ↑    ↑  ↑  ↑
   Menu                           Role        Tier   Lang  Notif Profile Logout
```

**Role Badge Changes Per User:**
- Smallholder: "Smallholder Farmer" / "Mkulima Mdogo"
- Manager: "Farm Manager" / "Meneja wa Shamba"
- Extension: "Extension Officer" / "Afisa wa Ugani"

---

## 📂 **3. SIDEBAR NAVIGATION**

### **🌾 Smallholder Farmer (26 features)**

```
┌────────────────────────────────┐
│ 💼 Smallholder Farmer          │
│    26 features available       │
└────────────────────────────────┘

📌 MAIN
  🏠 Dashboard
  🔄 AI Workflows ⭐NEW

🤖 AI TOOLS
  💬 Sankofa AI
  📸 Crop Diagnosis
  🎙️ Voice Assistant
  💡 AI Recommendations
  🎓 AI Training Hub

🌾 FARM MANAGEMENT
  🌱 Crop Planning
  🧠 AI Crop Planning
  📊 Crop Dashboard
  🐄 Livestock
  🏥 Livestock Health
  👨‍👩‍👧 Family Planner
  🔬 Farmer Lab

💰 MARKET & SALES
  📈 Market Prices
  🛒 Marketplace

💵 FINANCE
  📱 Mobile Money
  🏦 Insurance
  📄 Contract Farming
  🌾 Input Supply

🛠️ SERVICES
  👨‍🏫 Expert Consult
  🧪 Soil Testing
  🌤️ Weather

📚 LEARNING
  📖 Knowledge Base
  🎥 Video Tutorials
  🎓 Training Courses

👥 COMMUNITY
  💬 Discussion Groups

❓ HELP & SUPPORT
  🆘 Support
  📞 Contact Us
  ❓ FAQ
  🔒 Privacy
```

**NOT Visible:**
- ❌ Task Management
- ❌ Farm Mapping
- ❌ Analytics Dashboard
- ❌ Agribusiness Tools

---

### **👨‍💼 Farm Manager (36 features)**

```
┌────────────────────────────────┐
│ 💼 Farm Manager                │
│    36 features available       │
└────────────────────────────────┘

📌 MAIN
  🏠 Dashboard
  🔄 AI Workflows

🤖 AI TOOLS (7)
  [Same as Smallholder +]
  🧠 AI Insights

🌾 FARM MANAGEMENT (13)
  [Same as Smallholder +]
  📋 Task Management ⭐
  🗺️ Farm Mapping ⭐
  📏 Land Allocation ⭐
  📦 Inventory ⭐
  🤖 Digital Twin ⭐
  📊 Farm Graph ⭐

💰 MARKET & SALES (2)
  [Same as Smallholder]

💵 FINANCE (5)
  [Same as Smallholder +]
  💰 Farm Finance ⭐

📈 INSIGHTS & ANALYTICS
  📊 Analytics ⭐
  📈 Reports ⭐
  🎯 Predictive Models ⭐
  🌱 Crop Tips

[Rest same as Smallholder]
```

**Key Additions (⭐):**
- ✅ Task Management (team coordination)
- ✅ Farm Mapping + Land Allocation
- ✅ Analytics + Reporting
- ✅ Digital Farm Twin

---

### **🏢 Commercial Farm Admin (40 features)**

```
┌─────────────────────────────────┐
│ 💼 Commercial Farm Admin        │
│    40 features available        │
└─────────────────────────────────┘

[All Farm Manager features +]

💰 MARKET & SALES (4)
  📈 Market Prices
  🛒 Marketplace
  🏢 Agribusiness Dashboard ⭐
  📦 Orders & E-commerce ⭐

🛠️ SERVICES (4)
  [Same as Manager +]
  🆔 KILIMO Agro ID ⭐

🏛️ ADMIN
  🔬 Farmer Lab
  🏢 Institutional Dashboard ⭐
  🔧 System Diagnostics ⭐

[All other categories]
```

**Enterprise Features:**
- ✅ Agribusiness Dashboard
- ✅ Orders & E-commerce
- ✅ Institutional Dashboard
- ✅ System Diagnostics

---

### **🏭 Agribusiness Operations (24 features)**

```
┌─────────────────────────────────┐
│ 💼 Agribusiness Operations      │
│    24 features available        │
└─────────────────────────────────┘

📌 MAIN
  🏠 Dashboard
  🔄 AI Workflows

🤖 AI TOOLS (3)
  💬 Sankofa AI
  💡 AI Recommendations
  🧠 AI Insights

💰 MARKET & SALES (4) ⭐ PRIMARY
  📈 Market Prices
  🛒 Marketplace
  🏢 Agribusiness Dashboard
  📦 Orders & E-commerce

💵 FINANCE (4)
  💰 Farm Finance
  📱 Mobile Money
  📄 Contract Farming
  🌾 Input Supply

🛠️ SERVICES (1)
  🌤️ Weather

📈 INSIGHTS (4)
  📊 Analytics
  📈 Reports
  🎯 Predictive Models

📚 LEARNING (2)
  📖 Knowledge Base
  🎥 Video Tutorials

🏛️ ADMIN (2)
  🏢 Institutional Dashboard
  🔧 System Diagnostics

❓ HELP & SUPPORT (4)
  [Standard help features]
```

**No Farm Tools:**
- ❌ Crop Planning
- ❌ Livestock
- ❌ Farm Mapping
- ❌ Voice Assistant

---

### **👨‍🏫 Extension Officer (26 features)**

```
┌─────────────────────────────────┐
│ 💼 Extension Officer / NGO      │
│    26 features available        │
└─────────────────────────────────┘

📌 MAIN
  🏠 Dashboard
  🔄 AI Workflows

🤖 AI TOOLS (5)
  💬 Sankofa AI
  📸 Crop Diagnosis
  💡 AI Recommendations
  🎓 AI Training Hub
  🧠 AI Insights

🌾 FARM MANAGEMENT (4) 📖 READ-ONLY
  🌱 Crop Planning (view only)
  📊 Crop Dashboard
  🐄 Livestock (view only)
  🔬 Farmer Lab ⭐

💰 MARKET & SALES (1)
  📈 Market Prices

🛠️ SERVICES (1)
  🌤️ Weather

📈 INSIGHTS (3)
  📊 Analytics ⭐
  📈 Reports
  🌱 Crop Tips

📚 LEARNING (3)
  📖 Knowledge Base
  🎥 Video Tutorials
  🎓 Training Courses

👥 COMMUNITY (2)
  💬 Discussion Groups
  🤝 Cooperative Dashboard

🏛️ ADMIN (2)
  👨‍🏫 Extension Officer Tools ⭐
  🏢 Institutional Dashboard

❓ HELP & SUPPORT (4)
  [Standard help features]
```

**Advisory Focus:**
- ✅ Extension Officer Dashboard
- ✅ Analytics & Impact Assessment
- ✅ Farmer Lab (pilot programs)
- ❌ No marketplace transactions
- ❌ No farm editing

---

### **🤝 Cooperative Leader (28 features)**

```
┌─────────────────────────────────┐
│ 💼 Cooperative Leader           │
│    28 features available        │
└─────────────────────────────────┘

📌 MAIN
  🏠 Dashboard
  🔄 AI Workflows

🤖 AI TOOLS (5)
  💬 Sankofa AI
  📸 Crop Diagnosis
  🎙️ Voice Assistant
  💡 AI Recommendations
  🎓 AI Training Hub

🌾 FARM MANAGEMENT (4)
  🌱 Crop Planning
  📊 Crop Dashboard
  🐄 Livestock
  🔬 Farmer Lab

💰 MARKET & SALES (2)
  📈 Market Prices
  🛒 Marketplace

💵 FINANCE (3)
  💰 Farm Finance
  📱 Mobile Money
  📄 Contract Farming

🛠️ SERVICES (1)
  🌤️ Weather

📈 INSIGHTS (3)
  📊 Analytics ⭐
  📈 Reports
  🌱 Crop Tips

📚 LEARNING (3)
  📖 Knowledge Base
  🎥 Video Tutorials
  🎓 Training Courses

👥 COMMUNITY (2)
  💬 Discussion Groups
  🤝 Cooperative Dashboard ⭐ PRIMARY

❓ HELP & SUPPORT (4)
  [Standard help features]
```

**Cooperative Focus:**
- ✅ Cooperative Dashboard (member management)
- ✅ Group Analytics
- ✅ Revenue Sharing Tools
- ❌ No individual farm micro-management

---

## 📊 **4. DASHBOARD WIDGETS**

### **Smallholder Farmer Dashboard:**

```
┌─────────────────────────────────────────────┐
│ Welcome back, John Doe!                     │
│ Mkulima Mdogo                              │
│                                             │
│ [5 Crops] [12 Tasks] [8.2M TSh] [Good Soil] │
└─────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┐
│ 🌤️ Weather   │ 💬 AI Tips   │ 📊 Markets   │
│ 28°C Partly  │ Apply fert.  │ Maize 850K   │
│ Cloudy       │ to maize     │ ↗ +5.2%      │
└──────────────┴──────────────┴──────────────┘

┌──────────────────────────────────────────────┐
│ 🎯 Quick Actions                             │
│  • Check market prices                       │
│  • Ask Sankofa AI                           │
│  • Upload crop photo                        │
│  • View farming tips                        │
└──────────────────────────────────────────────┘
```

### **Farm Manager Dashboard:**

```
┌─────────────────────────────────────────────┐
│ Welcome back, Sarah!                        │
│ Meneja wa Shamba                           │
│                                             │
│ [5 Crops] [12 Tasks] [8.2M TSh] [Good Soil] │
│ [3 Teams] [85% Progress] [2 Alerts]        │
└─────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┐
│ 📋 Tasks     │ 📊 Analytics │ 🗺️ Map       │
│ 5 pending    │ Field A: 90% │ View plots   │
│ 2 overdue    │ Field B: 75% │ 12.5 acres   │
└──────────────┴──────────────┴──────────────┘

┌──────────────────────────────────────────────┐
│ 🎯 Quick Actions                             │
│  • Assign tasks to team                      │
│  • View farm analytics                       │
│  • Check digital twin                        │
│  • Review predictive models                  │
└──────────────────────────────────────────────┘
```

---

## 📱 **5. MOBILE BOTTOM NAVIGATION**

### **Smallholder Farmer:**

```
┌─────────┬─────────┬─────────┬─────────┐
│   🏠    │   💬    │   📊    │   👤    │
│  Home   │  Chat   │ Market  │ Profile │
└─────────┴─────────┴─────────┴─────────┘
```

### **Farm Manager:**

```
┌─────────┬─────────┬─────────┬─────────┐
│   🏠    │   📋    │   📊    │   👤    │
│  Home   │  Tasks  │Analytics│ Profile │
└─────────┴─────────┴─────────┴─────────┘
```

### **Agribusiness:**

```
┌─────────┬─────────┬─────────┬─────────┐
│   🏠    │   🛒    │   📦    │   👤    │
│  Home   │ Market  │ Orders  │ Profile │
└─────────┴─────────┴─────────┴─────────┘
```

---

## 🎨 **6. VISUAL DIFFERENCES**

### **Color Coding by Role:**

| Role | Badge Color | Accent Color |
|------|------------|--------------|
| Smallholder | Green 100 | Green 600 |
| Farmer | Green 200 | Emerald 600 |
| Manager | Blue 100 | Blue 600 |
| Commercial | Purple 100 | Purple 600 |
| Agribusiness | Orange 100 | Orange 600 |
| Extension | Cyan 100 | Cyan 600 |
| Cooperative | Teal 100 | Teal 600 |

### **Icon Variations:**

| Role | Primary Icon |
|------|-------------|
| Smallholder | 🌾 Wheat |
| Farmer | 🌱 Sprout |
| Manager | 📋 Clipboard |
| Commercial | 🏢 Building |
| Agribusiness | 🏭 Factory |
| Extension | 👨‍🏫 Teacher |
| Cooperative | 🤝 Handshake |

---

## 💬 **7. TOAST NOTIFICATIONS**

### **Login Success:**

**Smallholder:**
```
✅ Welcome back, John!
   Smallholder Farmer • 26 features
```

**Farm Manager:**
```
✅ Welcome back, Sarah!
   Farm Manager • 36 features
```

**Extension Officer:**
```
✅ Welcome back, Dr. Mwangi!
   Extension Officer • 26 features
```

### **Registration Success:**

```
✅ Welcome to KILIMO, John! 🌾
   Smallholder Farmer • 26 features unlocked
```

### **Feature Locked:**
```
🔒 This feature is available for Farm Managers
   Upgrade to unlock Task Management + 10 more features
```

---

## 🔍 **8. SEARCH RESULTS**

### **Smallholder Search "task":**

```
No results for "task"

💡 Did you mean:
  • Crop Planning
  • Today's Farming Tip
  • Expert Consultation

ℹ️  Task Management available for Farm Managers
```

### **Manager Search "task":**

```
📋 Task Management
   Create and assign tasks to your team

📝 Today's Tasks
   View pending farm activities

✅ Complete a Task
   Mark tasks as done
```

---

## 🎯 **9. WHAT'S MISSING (Per Role)**

### **Smallholder CANNOT See:**

- ❌ "Task Management" menu item
- ❌ "Analytics Dashboard" menu item
- ❌ "Farm Mapping" menu item
- ❌ "Agribusiness Dashboard"
- ❌ "System Diagnostics"

**Why:** These features are for multi-field/enterprise operations

---

### **Agribusiness CANNOT See:**

- ❌ "Crop Planning" menu item
- ❌ "Livestock Management"
- ❌ "Farm Mapping"
- ❌ "Voice Assistant"
- ❌ "Family Planner"

**Why:** Agribusiness focuses on marketplace, not farming

---

### **Extension Officer CANNOT See:**

- ❌ "Marketplace" (buy/sell)
- ❌ "Mobile Money" transactions
- ❌ "Insurance" purchasing
- ❌ "Task Management" (editing)

**Why:** Read-only advisory role, not farm operator

---

## 📈 **10. FEATURE COUNT INDICATOR**

### **In Sidebar Header:**

```
┌────────────────────────────────┐
│ 💼 Smallholder Farmer          │
│    26 features available       │
└────────────────────────────────┘
```

```
┌────────────────────────────────┐
│ 💼 Farm Manager                │
│    36 features available       │
└────────────────────────────────┘
```

**Changes dynamically based on logged-in user's role**

---

## 🌍 **11. LANGUAGE TOGGLE**

### **English Header:**
```
💼 Smallholder Farmer
   26 features available
```

### **Swahili Header:**
```
💼 Mkulima Mdogo
   Vipengele 26 vinavyopatikana
```

**All role names, feature counts, and labels translate**

---

## 🎉 **Summary**

### **What Users Experience:**

✅ **Personalized Interface** - Only see relevant features  
✅ **Clear Role Identity** - Badge in header shows role  
✅ **Feature Count** - Know exactly what's available  
✅ **Clean Navigation** - No clutter from irrelevant items  
✅ **Bilingual Support** - Works in English & Swahili  
✅ **Professional UX** - Enterprise-grade access control  

### **What Users Don't See:**

❌ Disabled/grayed-out buttons for locked features  
❌ "Upgrade to unlock" messages everywhere  
❌ Overwhelming menus with 50+ items  
❌ Irrelevant features cluttering the UI  
❌ Confusing access denied errors  

---

## 📞 **User Questions & Answers**

**Q: Why can't I see Task Management?**  
A: Task Management is available for Farm Managers who coordinate teams. You can upgrade your account to unlock this feature.

**Q: How do I know what features I have?**  
A: Check the sidebar header - it shows your role and total feature count.

**Q: Can I change my role?**  
A: Contact support to upgrade/change your role based on your farming operations.

**Q: What features do other roles have?**  
A: View the "Role Comparison" page in settings to see all role features.

---

**Last Updated:** January 2026  
**For:** KILIMO Agri-AI Suite  
**Version:** 1.0.0
