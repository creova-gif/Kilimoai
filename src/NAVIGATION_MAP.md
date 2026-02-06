# CREOVA Agri-AI Suite - Navigation Map
## Complete Feature Layout & Access Points

---

## 📱 App Entry Points

```
┌─────────────────────────────────────────┐
│          CREOVA LOGIN/REGISTER          │
│                                         │
│  📧 Phone Number                        │
│  🔒 Password                            │
│                                         │
│  [Login] or [Register]                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│            MAIN APPLICATION             │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🟢 Header (Top Bar)            │   │
│  │  [≡] CREOVA | 🔔 👤 [Logout]   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      CONTENT AREA               │   │
│  │      (Tabs switch here)         │   │
│  │                                 │   │
│  │  See detailed sections below ↓  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Bottom Nav (Mobile Only)       │   │
│  │  [🏠] [💬] [🛒] [👤]           │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 🗺️ Navigation Hierarchy

### **TOP LEVEL: Header Actions**
```
┌──────────────────────────────────────────────────────┐
│  [≡ Menu]  CREOVA Agri-AI       [🔔] [👤] [Logout]  │
│     │                             │    │      │      │
│     ▼                             ▼    ▼      ▼      │
│  Sidebar                     Notifications  Profile  │
│  (21 items)                  Panel          Sheet    │
└──────────────────────────────────────────────────────┘
```

---

## 📂 Sidebar Navigation Structure

### **1️⃣ CORE FEATURES** (All Users)
```
📊 Dashboard
   ├── Welcome Message
   ├── 4 Quick Access Cards
   │   ├── Today's Tip
   │   ├── Weather Alert
   │   ├── Market Trend
   │   └── Crop Health
   ├── Stats Overview (4 cards)
   ├── Market Prices Table
   └── Your Crops List

💬 AI Chat
   ├── Chat Interface
   ├── Language Toggle (EN/SW)
   ├── Chat History
   └── Quick Suggestions

📸 Crop Diagnosis
   ├── Camera/Upload
   ├── Image Preview
   ├── AI Analysis Results
   └── Treatment Recommendations

🏆 Achievements
   ├── Level & Points
   ├── Unlocked Badges
   ├── Progress Tracking
   └── Crop Growth Stage

📈 Market Prices
   ├── Regional Prices
   ├── Price Trends
   ├── Crop Filter
   └── Historical Data

☁️ Weather
   ├── Current Conditions
   ├── 7-Day Forecast
   ├── Weather Alerts
   └── Farming Recommendations
```

### **2️⃣ MOAT-BUILDING FEATURES** 🔥 (All Users)
```
🗄️ Farm Graph
   ├── Data Collection Dashboard
   ├── Yield Tracking
   ├── Input Recording
   ├── Field Mapping
   └── Analytics Charts

🎤 Voice Assistant
   ├── Voice Input Interface
   ├── Swahili Speech Recognition
   ├── Voice Playback
   ├── Conversation History
   └── Text Fallback

✨ AI Recommendations
   ├── Personalized Advice Cards
   ├── Crop-Specific Tips
   ├── Timing Recommendations
   ├── Input Suggestions
   └── Market Opportunities

👥 Farmer Lab
   ├── Pilot Program Enrollment
   ├── Trial Participation
   ├── Feedback Submission
   ├── Experimental Crops
   └── Progress Tracking

👪 Family Planner
   ├── Household Members
   ├── Gender-Inclusive Tools
   ├── Decision Making Framework
   ├── Labor Allocation
   └── Income Tracking
```

### **3️⃣ FARMER-SPECIFIC FEATURES** (Farmers Only)
```
🛒 Marketplace
   ├── List Crops for Sale
   ├── Browse Buyers
   ├── Active Listings
   ├── Sale History
   └── AI Buyer Matching

📦 Input Suppliers
   ├── Fertilizer Dealers
   ├── Seed Suppliers
   ├── Tool Vendors
   ├── Location-Based Search
   └── Price Comparison

📄 Contract Farming
   ├── Contract Opportunities
   ├── Buyer Requirements
   ├── Application Process
   ├── Contract Terms
   └── Agreement Management

🛡️ Insurance
   ├── Insurance Products
   ├── Premium Calculator
   ├── Coverage Details
   ├── Claim Process
   └── Policy Management

💬 Peer Groups
   ├── Discussion Forums
   ├── WhatsApp Integration
   ├── Regional Groups
   ├── Crop-Specific Groups
   └── Expert Q&A

📚 Knowledge Library
   ├── Best Practices
   ├── Video Tutorials
   ├── Seasonal Guides
   ├── Pest Control
   └── Bookmarks

🆘 Support
   ├── FAQs
   ├── Contact Form
   ├── Help Topics
   ├── Ticket Tracking
   └── Live Chat

🔒 Privacy & Data
   ├── Data Consent Forms
   ├── Privacy Settings
   ├── Data Download
   ├── Account Deletion
   └── Usage Analytics
```

### **4️⃣ NGO/COOPERATIVE FEATURES** (NGOs & Cooperatives)
```
📊 Analytics
   ├── Farmer Metrics
   ├── Engagement Stats
   ├── Crop Performance
   ├── Regional Analysis
   └── Export Reports

🚶 Field Visits
   ├── Schedule Visits
   ├── Farmer Directory
   ├── Visit Notes
   ├── GPS Tracking
   └── Photo Documentation
```

---

## 📱 Bottom Navigation (Mobile Only)

```
┌─────────────────────────────────────────────┐
│  [🏠 Home] [💬 Chat] [🛒 Market] [👤 Profile] │
│      ▲          ▲          ▲          ▲      │
│      │          │          │          │      │
│  Dashboard   AI Chat  Marketplace  Profile  │
└─────────────────────────────────────────────┘
```

**Quick Access (Bottom Nav):**
- **🏠 Home** → Dashboard Tab
- **💬 Chat** → AI Chat Tab (shows notification badge)
- **🛒 Market** → Marketplace Tab (farmers only)
- **👤 Profile** → Profile Sheet

---

## 🎯 Quick Access Cards (Dashboard)

Each card opens a detailed sheet:

```
┌─────────────────┐  ┌─────────────────┐
│  💡 Today's Tip │  │ ☁️ Weather Alert│
│                 │  │                 │
│  Tap for full   │  │  Tap for 7-day  │
│  farming guide  │  │  forecast       │
└─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐
│  📈 Market      │  │ 🌱 Crop Health  │
│  Trend          │  │                 │
│  Tap for price  │  │  Tap for health │
│  analysis       │  │  assessment     │
└─────────────────┘  └─────────────────┘
```

---

## 🔄 User Flow Examples

### **Flow 1: Register → Get Advice**
```
Login Screen
    ↓ Tap "Register"
Registration Form
    ↓ Submit
Dashboard (Welcome!)
    ↓ Tap Menu → AI Chat
AI Chatbot
    ↓ Ask question
Get AI Response
    ✓ Success!
```

### **Flow 2: Sell Crops**
```
Dashboard
    ↓ Tap Menu → Marketplace
Marketplace
    ↓ Tap "List Crop"
List Crop Form
    ↓ Fill & Submit
Active Listings
    ↓ View Matched Buyers
Buyer Contact Info
    ✓ Sale Connected!
```

### **Flow 3: Get Voice Advice (Swahili)**
```
Dashboard
    ↓ Tap Menu → Voice Assistant
Voice Assistant
    ↓ Tap Microphone
Record Voice (Swahili)
    ↓ Process
AI Response (Swahili)
    ↓ Play Audio
Hear Advice
    ✓ Success!
```

### **Flow 4: Track Farm Data**
```
Dashboard
    ↓ Tap Menu → Farm Graph
Farm Graph Dashboard
    ↓ Record Data
Input Form (Yield/Inputs)
    ↓ Submit
View Charts & Trends
    ✓ Data Tracked!
```

---

## 📊 Feature Access Matrix

| Feature | Path | User Type | Mobile | Desktop |
|---------|------|-----------|--------|---------|
| Dashboard | Menu → Dashboard | All | ✅ | ✅ |
| AI Chat | Menu → AI Chat | All | ✅ | ✅ |
| Diagnosis | Menu → Crop Diagnosis | All | ✅ | ✅ |
| Farm Graph | Menu → Farm Graph | All | ✅ | ✅ |
| Voice | Menu → Voice Assistant | All | ✅ | ✅ |
| Recommendations | Menu → AI Recommendations | All | ✅ | ✅ |
| Farmer Lab | Menu → Farmer Lab | All | ✅ | ✅ |
| Family Planner | Menu → Family Planner | All | ✅ | ✅ |
| Marketplace | Menu → Marketplace | Farmer | ✅ | ✅ |
| Input Suppliers | Menu → Input Suppliers | Farmer | ✅ | ✅ |
| Analytics | Menu → Analytics | NGO/Coop | ✅ | ✅ |

---

## 🎨 Visual Navigation Patterns

### **Mobile (< 768px)**
```
┌─────────────────┐
│   Header (Top)  │ ← Sticky
├─────────────────┤
│                 │
│   Scrollable    │ ← Main Content
│   Content       │
│                 │
├─────────────────┤
│  Bottom Nav     │ ← Fixed
└─────────────────┘
```

### **Desktop (> 768px)**
```
┌─────────────────────────────┐
│      Header (Top)           │ ← Sticky
├─────────────────────────────┤
│                             │
│    Wide Content Area        │ ← Max-width 7xl
│    (No Bottom Nav)          │
│                             │
└─────────────────────────────┘
```

---

## 🚀 Pro Tips for Navigation

1. **Use Sidebar for Complete Navigation** - All 21 items accessible
2. **Use Bottom Nav for Quick Access** - 4 most-used features
3. **Tap Quick Access Cards** - Detailed views of key info
4. **Swipe Sheets** - Dismiss modals by swiping down
5. **Profile in Header** - Quick access to settings/logout

---

## 📞 Support Navigation

**In-App Support:** Menu → Support → Contact Form  
**FAQs:** Menu → Support → Help Topics  
**Privacy:** Menu → Privacy & Data  
**Logout:** Header → Logout Button (desktop) or Profile → Logout (mobile)

---

**Last Updated**: December 2025  
**Total Features**: 21 (varies by user type)  
**Navigation Depth**: Max 2 levels  
**Mobile Optimized**: Yes ✅
