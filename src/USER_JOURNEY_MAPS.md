# KILIMO Agri-AI Suite - User Journey Maps
**Comprehensive Navigation Flows for All User Types**

## 📋 Table of Contents
1. [Farmer Journey](#farmer-journey)
2. [Organization Journey](#organization-journey)
3. [Cooperative Journey](#cooperative-journey)
4. [Buyer Journey](#buyer-journey)
5. [Extension Officer Journey](#extension-officer-journey)
6. [Agribusiness Journey](#agribusiness-journey)
7. [Institutional Journey](#institutional-journey)
8. [Guest/Demo Mode Journey](#guest-demo-mode-journey)

---

## 🌾 1. FARMER JOURNEY

### Entry Points
```
┌─────────────────────────────────────────────┐
│         FARMER ENTRY POINTS                 │
├─────────────────────────────────────────────┤
│ • First Time → Welcome Screen               │
│ • Returning → Direct Login                  │
│ • Guest Mode → Demo Dashboard              │
└─────────────────────────────────────────────┘
```

### Complete Farmer Flow
```
START (App Launch)
│
├─→ First Time User
│   │
│   ├─→ WELCOME SCREEN
│   │   ├─ Choose Language (EN/SW)
│   │   └─ View Feature Highlights
│   │
│   ├─→ ONBOARDING SLIDES (3-5 slides)
│   │   ├─ AI Crop Advisory
│   │   ├─ Market Intelligence
│   │   ├─ Weather Alerts
│   │   ├─ Farm Management
│   │   └─ Community Network
│   │
│   ├─→ REGISTRATION FORM
│   │   ├─ Personal Info (Name, Phone, Email)
│   │   ├─ Location (Region, District)
│   │   ├─ Farm Details (Size, Crops)
│   │   ├─ User Type Selection → Farmer
│   │   └─ Submit → Create Account
│   │
│   └─→ DATA PRIVACY CONSENT
│       ├─ Read Terms
│       ├─ Accept Privacy Policy
│       └─ Enable Notifications (Optional)
│
├─→ Returning User
│   │
│   ├─→ LOGIN SCREEN
│   │   ├─ Enter Phone Number
│   │   ├─ Enter Password
│   │   └─ Login Success
│   │
│   └─→ SESSION CHECK
│       └─ Auto-login if session valid
│
└─→ FARMER DASHBOARD HOME (Main Hub)
```

### Farmer Dashboard - Navigation Tree
```
FARMER DASHBOARD (Home)
│
├─── 🏠 HOME TAB
│    ├─ Welcome Message & Stats
│    ├─ Quick Action Cards
│    │  ├─ Chat with Sankofa AI
│    │  ├─ Check Market Prices
│    │  ├─ View Weather
│    │  ├─ Manage Crops
│    │  ├─ View Tasks
│    │  └─ Access Marketplace
│    ├─ Recent Activity Feed
│    ├─ Weather Widget
│    └─ AI Insights Panel
│
├─── 💬 AI CHATBOT (Sankofa AI)
│    ├─ Start New Conversation
│    ├─ Quick Questions
│    │  ├─ Crop Disease Diagnosis
│    │  ├─ Pest Control Advice
│    │  ├─ Fertilizer Recommendations
│    │  ├─ Planting Schedule
│    │  └─ Market Price Query
│    ├─ Voice Input Option
│    ├─ Photo Upload (Crop Diagnosis)
│    ├─ Conversation History
│    └─ AI Credits Balance
│
├─── 📸 PHOTO DIAGNOSIS
│    ├─ Capture Photo
│    ├─ Upload from Gallery
│    ├─ AI Analysis
│    │  ├─ Disease Identification
│    │  ├─ Pest Detection
│    │  ├─ Nutrient Deficiency
│    │  └─ Health Assessment
│    ├─ Treatment Recommendations
│    └─ Save to History
│
├─── 📊 MARKET PRICES
│    ├─ Live Price Dashboard
│    │  ├─ Filter by Crop
│    │  ├─ Filter by Region
│    │  └─ Sort by Price/Trend
│    ├─ Price Trends & Charts
│    ├─ Price Alerts Setup
│    ├─ Historical Data
│    └─ Market News
│
├─── ☁️ WEATHER
│    ├─ Current Weather
│    ├─ 7-Day Forecast
│    ├─ Weather Alerts
│    ├─ Rainfall Predictions
│    ├─ Planting Advisories
│    └─ Regional Weather Map
│
├─── 🛒 MARKETPLACE
│    ├─ Browse Products
│    │  ├─ Seeds
│    │  ├─ Fertilizers
│    │  ├─ Pesticides
│    │  ├─ Farm Equipment
│    │  └─ Livestock
│    ├─ Sell My Produce
│    │  ├─ Create Listing
│    │  ├─ Upload Photos
│    │  ├─ Set Price
│    │  └─ Manage Listings
│    ├─ My Orders
│    ├─ Shopping Cart
│    └─ Transaction History
│
├─── 🌱 FARM MANAGEMENT
│    │
│    ├─→ CROP PLANNING
│    │   ├─ My Crops Dashboard
│    │   │  ├─ Active Crops
│    │   │  ├─ Planting Schedule
│    │   │  └─ Harvest Calendar
│    │   ├─ Add New Crop
│    │   │  ├─ Select Crop Type
│    │   │  ├─ Set Planting Date
│    │   │  ├─ Set Plot Size
│    │   │  └─ Expected Yield
│    │   ├─ Crop Details View
│    │   │  ├─ Growth Stage
│    │   │  ├─ Health Status
│    │   │  ├─ Tasks & Activities
│    │   │  └─ Notes & Photos
│    │   ├─ Crop Rotation Planner
│    │   └─ AI Crop Recommendations
│    │
│    ├─→ LIVESTOCK MANAGEMENT
│    │   ├─ My Livestock
│    │   ├─ Add Animal
│    │   ├─ Health Monitoring
│    │   │  ├─ Vaccination Records
│    │   │  ├─ Health Checkups
│    │   │  └─ Disease Alerts
│    │   ├─ Breeding Records
│    │   └─ Feed Management
│    │
│    ├─→ TASK MANAGEMENT
│    │   ├─ All Tasks
│    │   │  ├─ Pending
│    │   │  ├─ In Progress
│    │   │  ├─ Completed
│    │   │  └─ Overdue
│    │   ├─ Create New Task
│    │   │  ├─ Task Title
│    │   │  ├─ Description
│    │   │  ├─ Due Date
│    │   │  ├─ Priority Level
│    │   │  └─ Assign to Self/Others
│    │   ├─ Task Calendar View
│    │   └─ Recurring Tasks Setup
│    │
│    ├─→ FARM MAPPING
│    │   ├─ Interactive Farm Map
│    │   ├─ Mark Plots/Fields
│    │   ├─ Assign Crops to Plots
│    │   ├─ Measure Land Area
│    │   └─ Save Map Layouts
│    │
│    ├─→ LAND ALLOCATION
│    │   ├─ View All Plots
│    │   ├─ Allocate Crops
│    │   ├─ Track Plot Usage
│    │   └─ Optimization Suggestions
│    │
│    └─→ RESOURCE INVENTORY
│        ├─ Seeds Inventory
│        ├─ Fertilizers Stock
│        ├─ Pesticides Stock
│        ├─ Equipment List
│        ├─ Add/Remove Items
│        └─ Low Stock Alerts
│
├─── 💰 FARM FINANCE
│    ├─ Financial Dashboard
│    │  ├─ Total Revenue
│    │  ├─ Total Expenses
│    │  ├─ Net Profit/Loss
│    │  └─ Monthly Breakdown
│    ├─ Record Income
│    ├─ Record Expense
│    ├─ Transaction History
│    ├─ Financial Reports
│    └─ Budget Planning
│
├─── 📱 MOBILE MONEY
│    ├─ Send Money
│    ├─ Receive Money
│    ├─ Pay Bills
│    ├─ Buy Inputs (Link to Marketplace)
│    ├─ Transaction History
│    └─ M-Pesa/Tigo Pesa Integration
│
├─── 🛡️ INSURANCE HUB
│    ├─ Available Insurance Plans
│    │  ├─ Crop Insurance
│    │  ├─ Livestock Insurance
│    │  └─ Equipment Insurance
│    ├─ Get Quote
│    ├─ Buy Coverage
│    ├─ My Policies
│    ├─ File Claim
│    └─ Claim Status
│
├─── 🎓 LEARNING & SUPPORT
│    │
│    ├─→ VIDEO TUTORIALS
│    │   ├─ Browse by Category
│    │   ├─ Search Videos
│    │   ├─ My Saved Videos
│    │   └─ Watch & Learn
│    │
│    ├─→ KNOWLEDGE BASE
│    │   ├─ Articles Library
│    │   ├─ Farming Guides
│    │   ├─ Best Practices
│    │   ├─ Search Articles
│    │   └─ Bookmark Articles
│    │
│    ├─→ EXPERT CONSULTATION
│    │   ├─ Browse Experts
│    │   │  ├─ Agronomists
│    │   │  ├─ Veterinarians
│    │   │  └─ Soil Scientists
│    │   ├─ Book Consultation
│    │   │  ├─ Select Expert
│    │   │  ├─ Choose Date/Time
│    │   │  ├─ Describe Issue
│    │   │  └─ Confirm Booking
│    │   ├─ My Consultations
│    │   └─ Consultation History
│    │
│    ├─→ SOIL TESTING SERVICE
│    │   ├─ Request Soil Test
│    │   │  ├─ Select Plot
│    │   │  ├─ Schedule Collection
│    │   │  └─ Pay for Service
│    │   ├─ View Results
│    │   │  ├─ Soil pH
│    │   │  ├─ Nutrients Analysis
│    │   │  ├─ Soil Type
│    │   │  └─ Recommendations
│    │   └─ Test History
│    │
│    └─→ COMMUNITY DISCUSSIONS
│        ├─ Discussion Forums
│        ├─ Join Peer Groups
│        ├─ Ask Questions
│        ├─ Share Experiences
│        └─ Connect with Farmers
│
├─── 🆔 KILIMO AGRO-ID
│    ├─ View My Farmer ID
│    ├─ KYC Verification
│    │  ├─ Upload ID Document
│    │  ├─ Take Selfie
│    │  └─ Submit for Verification
│    ├─ Verification Status
│    ├─ ID Benefits
│    └─ QR Code for Verification
│
├─── 📈 ANALYTICS & REPORTS
│    ├─ Farm Performance Dashboard
│    ├─ Crop Yield Reports
│    ├─ Financial Reports
│    ├─ Comparative Analysis
│    ├─ Export Reports (PDF)
│    └─ Data Visualizations
│
├─── 👤 PROFILE & SETTINGS
│    ├─ My Profile
│    │  ├─ View Profile Info
│    │  ├─ Edit Personal Details
│    │  ├─ Update Farm Info
│    │  └─ Profile Photo
│    ├─ Account Settings
│    │  ├─ Change Password
│    │  ├─ Phone Number
│    │  └─ Email Address
│    ├─ Notification Settings
│    │  ├─ Push Notifications
│    │  ├─ SMS Alerts
│    │  ├─ Email Notifications
│    │  └─ Weather Alerts
│    ├─ Language Settings
│    │  └─ Toggle EN/SW
│    ├─ Privacy Settings
│    │  ├─ Data Sharing
│    │  └─ Account Visibility
│    └─ Help & Support
│       ├─ FAQ
│       ├─ Contact Support
│       ├─ Report Issue
│       └─ App Tutorial
│
└─── 🔔 NOTIFICATIONS PANEL
     ├─ All Notifications
     ├─ Weather Alerts
     ├─ Task Reminders
     ├─ Market Updates
     ├─ AI Tips
     └─ System Messages
```

### Farmer Critical User Paths

#### Path 1: First-Time Registration Flow
```
Welcome Screen → Language Selection → Onboarding Slides → 
Registration Form → Privacy Consent → Dashboard Home
```

#### Path 2: Daily AI Consultation
```
Dashboard Home → AI Chatbot → Ask Question → 
Get AI Response → View Recommendations → Save/Act on Advice
```

#### Path 3: Crop Disease Diagnosis
```
Dashboard Home → Photo Diagnosis → Capture Photo → 
AI Analysis → View Disease → Treatment Plan → Save to History
```

#### Path 4: Checking Market Prices
```
Dashboard Home → Market Prices → Select Crop → 
View Current Price → Check Trends → Set Price Alert
```

#### Path 5: Planning Crop Planting
```
Dashboard Home → Farm Management → Crop Planning → 
Add New Crop → Set Details → Create Tasks → Save Plan
```

---

## 🏢 2. ORGANIZATION JOURNEY

### Organization Entry Flow
```
START (App Launch)
│
├─→ ORGANIZATION LOGIN
│   ├─ Organization Name
│   ├─ Admin Email
│   ├─ Password
│   └─ Login Success
│
└─→ ORGANIZATION DASHBOARD
```

### Organization Dashboard Structure
```
ORGANIZATION DASHBOARD
│
├─── 🏠 OVERVIEW
│    ├─ Organization Stats
│    │  ├─ Total Members
│    │  ├─ Active Farms
│    │  ├─ Total Land Area
│    │  └─ Collective Revenue
│    ├─ Recent Activities
│    ├─ Performance Metrics
│    └─ Quick Actions
│
├─── 👥 MEMBER MANAGEMENT
│    ├─ All Members List
│    │  ├─ View Member Details
│    │  ├─ Farmers
│    │  ├─ Field Officers
│    │  └─ Admins
│    ├─ Add New Member
│    ├─ Member Verification
│    ├─ Role Assignment
│    ├─ Member Reports
│    └─ Bulk Actions
│
├─── 🌾 COLLECTIVE FARMING
│    ├─ All Farms Overview
│    ├─ Crop Aggregation Data
│    ├─ Total Yield Tracking
│    ├─ Input Distribution
│    └─ Harvest Planning
│
├─── 📊 ANALYTICS & REPORTS
│    ├─ Organization Performance
│    ├─ Member Activity Reports
│    ├─ Financial Reports
│    ├─ Crop Production Reports
│    └─ Export Data
│
├─── 💰 FINANCIAL MANAGEMENT
│    ├─ Organization Wallet
│    ├─ Member Payments
│    ├─ Input Purchase Orders
│    ├─ Revenue Distribution
│    └─ Financial Reports
│
├─── 📱 COMMUNICATION HUB
│    ├─ Broadcast Messages
│    ├─ SMS Campaigns
│    ├─ Push Notifications
│    ├─ Member Discussions
│    └─ Announcements
│
├─── 🎓 TRAINING & SUPPORT
│    ├─ Training Programs
│    ├─ Schedule Workshops
│    ├─ Share Resources
│    └─ Expert Sessions
│
└─── ⚙️ ORGANIZATION SETTINGS
     ├─ Organization Profile
     ├─ Admin Management
     ├─ Permissions & Roles
     └─ System Configuration
```

---

## 🤝 3. COOPERATIVE JOURNEY

### Cooperative Dashboard Structure
```
COOPERATIVE DASHBOARD
│
├─── 🏠 OVERVIEW
│    ├─ Cooperative Stats
│    ├─ Member Summary
│    ├─ Collective Performance
│    └─ Recent Activities
│
├─── 👥 MEMBER MANAGEMENT
│    ├─ Members Directory
│    ├─ Add New Member
│    ├─ Member Contributions
│    ├─ Share Distribution
│    └─ Member Reports
│
├─── 🌾 COOPERATIVE FARMING
│    ├─ Joint Farms
│    ├─ Input Procurement
│    ├─ Collective Marketing
│    ├─ Shared Resources
│    └─ Yield Aggregation
│
├─── 💰 FINANCIAL MANAGEMENT
│    ├─ Cooperative Funds
│    ├─ Member Shares
│    ├─ Dividend Distribution
│    ├─ Loan Management
│    └─ Financial Reports
│
├─── 🛒 COLLECTIVE MARKETPLACE
│    ├─ Bulk Buying
│    ├─ Bulk Selling
│    ├─ Negotiated Prices
│    └─ Contract Farming
│
├─── 📊 COOPERATIVE ANALYTICS
│    ├─ Performance Dashboards
│    ├─ Member Contributions
│    ├─ Profit Sharing Reports
│    └─ Impact Metrics
│
└─── ⚙️ COOPERATIVE SETTINGS
     ├─ Cooperative Profile
     ├─ Board Management
     ├─ Bylaws & Policies
     └─ Member Permissions
```

---

## 🛍️ 4. BUYER JOURNEY

### Buyer Dashboard Structure
```
BUYER DASHBOARD
│
├─── 🏠 HOME
│    ├─ Available Products
│    ├─ Recent Listings
│    ├─ Saved Searches
│    └─ Quick Filters
│
├─── 🔍 SEARCH & BROWSE
│    ├─ Search by Crop
│    ├─ Filter by Region
│    ├─ Filter by Price
│    ├─ Filter by Quantity
│    └─ Advanced Search
│
├─── 📦 MY ORDERS
│    ├─ Active Orders
│    ├─ Order History
│    ├─ Track Shipments
│    └─ Reorder
│
├─── 💬 NEGOTIATIONS
│    ├─ Price Negotiations
│    ├─ Bulk Discounts
│    ├─ Contract Terms
│    └─ Communication Thread
│
├─── 📊 MARKET INTELLIGENCE
│    ├─ Price Trends
│    ├─ Supply Forecasts
│    ├─ Seasonal Availability
│    └─ Quality Reports
│
├─── 💰 PAYMENTS & INVOICES
│    ├─ Payment Methods
│    ├─ Payment History
│    ├─ Invoices
│    └─ Credit Terms
│
└─── 👤 BUYER PROFILE
     ├─ Company Info
     ├─ Preferences
     ├─ Saved Suppliers
     └─ Verification Status
```

---

## 👨‍🌾 5. EXTENSION OFFICER JOURNEY

### Extension Officer Dashboard
```
EXTENSION OFFICER DASHBOARD
│
├─── 🏠 OVERVIEW
│    ├─ Assigned Farmers
│    ├─ Field Visit Schedule
│    ├─ Pending Tasks
│    └─ Performance Metrics
│
├─── 👥 FARMER MANAGEMENT
│    ├─ My Farmers List
│    ├─ Farmer Profiles
│    ├─ Farm Visits Log
│    ├─ Farmer Assessments
│    └─ Add New Farmer
│
├─── 📅 FIELD VISIT SCHEDULER
│    ├─ Schedule Visits
│    ├─ Visit Calendar
│    ├─ Visit Reports
│    ├─ GPS Tracking
│    └─ Visit History
│
├─── 📊 FARMER MONITORING
│    ├─ Crop Status
│    ├─ Farm Performance
│    ├─ Input Usage
│    ├─ Yield Tracking
│    └─ Issue Reporting
│
├─── 🎓 TRAINING & ADVISORY
│    ├─ Schedule Training
│    ├─ Share Best Practices
│    ├─ Demonstration Farms
│    ├─ Training Materials
│    └─ Farmer Feedback
│
├─── 📱 COMMUNICATION
│    ├─ SMS to Farmers
│    ├─ Group Messages
│    ├─ Voice Calls
│    └─ Advisory Alerts
│
├─── 📈 REPORTING
│    ├─ Field Reports
│    ├─ Impact Reports
│    ├─ Farmer Progress
│    └─ Regional Analytics
│
└─── 🛠️ OFFICER TOOLS
     ├─ Soil Testing Kit
     ├─ Photo Diagnosis
     ├─ Offline Mode
     └─ Resource Library
```

---

## 🏭 6. AGRIBUSINESS JOURNEY

### Agribusiness Dashboard
```
AGRIBUSINESS DASHBOARD
│
├─── 🏠 BUSINESS OVERVIEW
│    ├─ Sales Dashboard
│    ├─ Revenue Metrics
│    ├─ Customer Base
│    └─ Product Performance
│
├─── 📦 PRODUCT CATALOG
│    ├─ All Products
│    ├─ Add New Product
│    ├─ Manage Inventory
│    ├─ Product Categories
│    └─ Pricing Management
│
├─── 🛒 ORDERS & SALES
│    ├─ New Orders
│    ├─ Processing Orders
│    ├─ Completed Orders
│    ├─ Order Fulfillment
│    └─ Sales Reports
│
├─── 👥 CUSTOMER MANAGEMENT
│    ├─ Customer Database
│    ├─ Farmer Customers
│    ├─ Cooperative Customers
│    ├─ Credit Customers
│    └─ Customer Analytics
│
├─── 💰 FINANCIAL MANAGEMENT
│    ├─ Revenue Dashboard
│    ├─ Accounts Receivable
│    ├─ Payment Processing
│    ├─ Credit Management
│    └─ Financial Reports
│
├─── 📊 BUSINESS ANALYTICS
│    ├─ Sales Performance
│    ├─ Market Trends
│    ├─ Customer Insights
│    ├─ Product Analytics
│    └─ ROI Reports
│
├─── 🚚 SUPPLY CHAIN
│    ├─ Inventory Management
│    ├─ Supplier Management
│    ├─ Logistics Tracking
│    └─ Delivery Management
│
└─── ⚙️ BUSINESS SETTINGS
     ├─ Company Profile
     ├─ Branch Management
     ├─ Staff Access
     └─ System Configuration
```

---

## 🏛️ 7. INSTITUTIONAL JOURNEY

### Institutional Dashboard
```
INSTITUTIONAL DASHBOARD
│
├─── 🏠 OVERVIEW
│    ├─ Institution Stats
│    ├─ Program Overview
│    ├─ Impact Metrics
│    └─ Recent Activities
│
├─── 🎓 PROGRAM MANAGEMENT
│    ├─ Active Programs
│    ├─ Create New Program
│    ├─ Program Participants
│    ├─ Program Analytics
│    └─ Program Reports
│
├─── 📊 RESEARCH & DATA
│    ├─ Data Collection
│    ├─ Research Projects
│    ├─ Data Analysis
│    ├─ Research Publications
│    └─ Data Export
│
├─── 👥 STAKEHOLDER MANAGEMENT
│    ├─ Farmers Database
│    ├─ Partner Organizations
│    ├─ Extension Officers
│    ├─ Researchers
│    └─ Government Liaison
│
├─── 💰 GRANTS & FUNDING
│    ├─ Grant Programs
│    ├─ Funding Allocation
│    ├─ Beneficiary Management
│    ├─ Disbursements
│    └─ Impact Tracking
│
├─── 📈 IMPACT MONITORING
│    ├─ Project Monitoring
│    ├─ KPI Dashboards
│    ├─ Impact Assessments
│    ├─ Success Stories
│    └─ Evaluation Reports
│
└─── ⚙️ INSTITUTION SETTINGS
     ├─ Institution Profile
     ├─ Admin Management
     ├─ Partner Integration
     └─ System Configuration
```

---

## 🎭 8. GUEST/DEMO MODE JOURNEY

### Guest User Flow
```
GUEST MODE FLOW
│
├─→ WELCOME SCREEN
│   └─ "Continue as Guest" Button
│
├─→ DEMO DASHBOARD
│   ├─ [DEMO BANNER] "You're in demo mode"
│   ├─ Limited Feature Access
│   ├─ Sample Data Display
│   └─ Frequent "Create Account" CTAs
│
├─→ ACCESSIBLE FEATURES (Read-Only)
│   ├─ Browse Market Prices
│   ├─ View Weather Forecasts
│   ├─ Watch Video Tutorials
│   ├─ Read Knowledge Articles
│   └─ View Sample Farms
│
├─→ RESTRICTED FEATURES (Prompt to Register)
│   ├─ AI Chatbot → "Sign up to use AI"
│   ├─ Create Crop Plan → "Sign up to manage farm"
│   ├─ Marketplace Transactions → "Sign up to buy/sell"
│   └─ Profile & Settings → "Sign up to customize"
│
└─→ CONVERSION POINTS
    ├─ Sticky "Create Account" Button
    ├─ Feature Unlock Prompts
    ├─ Time-Limited Demo (e.g., 30 mins)
    └─ Exit Demo → Registration Flow
```

---

## 🔄 Common User Flows Across All Types

### Universal Navigation Pattern
```
┌──────────────────────────────────────────┐
│   HEADER (All Screens)                   │
│   ├─ Logo (Home Link)                    │
│   ├─ Language Toggle (EN/SW)             │
│   ├─ Notifications Bell (Badge)          │
│   ├─ User Avatar/Menu                    │
│   └─ Settings Icon                       │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│   MAIN CONTENT AREA                      │
│   (Context-Specific Dashboard/Features)  │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│   BOTTOM NAVIGATION (Mobile)             │
│   ├─ Home                                │
│   ├─ AI Chat                             │
│   ├─ Market                              │
│   ├─ Farm                                │
│   └─ More                                │
└──────────────────────────────────────────┘
```

### Search & Filter Pattern (Universal)
```
SEARCH INTERFACE
│
├─→ Search Bar (Top)
│   ├─ Text Input
│   ├─ Voice Search
│   └─ Suggestions Dropdown
│
├─→ Filter Panel
│   ├─ Category Filters
│   ├─ Date Range
│   ├─ Location/Region
│   ├─ Price Range
│   └─ Custom Filters
│
└─→ Sort Options
    ├─ Relevance
    ├─ Date (Newest/Oldest)
    ├─ Price (Low/High)
    └─ Popularity
```

---

## 📱 Mobile-Specific Navigation Patterns

### Bottom Navigation (Primary)
```
┌─────────────────────────────────────────┐
│  [🏠 Home]  [💬 AI]  [📊 Market]  [More]│
└─────────────────────────────────────────┘
```

### Hamburger Menu (Secondary)
```
☰ MENU
├─ Profile
├─ Farm Management
├─ Financial
├─ Learning
├─ Settings
├─ Help & Support
└─ Logout
```

### Floating Action Button (Context-Specific)
- Dashboard → Chat with AI
- Crop Planning → Add Crop
- Tasks → Create Task
- Marketplace → Create Listing

---

## 🎯 Key Decision Points & User Actions

### Decision Tree: New User Onboarding
```
New User Arrives
│
├─→ Has Account? YES → Login
│                 NO  ↓
│
├─→ Want to Create Account?
│   ├─ YES → Registration Flow
│   └─ NO  → Guest Mode
│
└─→ Select User Type
    ├─ Farmer → Farmer Dashboard
    ├─ Organization → Org Dashboard
    ├─ Cooperative → Coop Dashboard
    ├─ Buyer → Buyer Dashboard
    └─ Other → Specialized Dashboard
```

### Critical User Actions by Type

#### Farmer Priority Actions
1. Chat with Sankofa AI for crop advice
2. Check market prices before selling
3. View weather for planting decisions
4. Manage crop planning
5. Record farm activities

#### Organization Priority Actions
1. Monitor member farmers
2. Aggregate crop data
3. Distribute inputs
4. Generate reports
5. Communicate with members

#### Cooperative Priority Actions
1. Manage member shares
2. Coordinate bulk buying/selling
3. Distribute profits
4. Schedule joint activities
5. Track collective performance

#### Buyer Priority Actions
1. Search for products
2. Compare prices
3. Negotiate terms
4. Place bulk orders
5. Track shipments

---

## 🔗 Integration Points

### External Services Integration
```
KILIMO App
│
├─→ Mobile Money APIs
│   ├─ M-Pesa
│   ├─ Tigo Pesa
│   └─ Airtel Money
│
├─→ Weather Services
│   └─ OpenWeather API
│
├─→ Market Price Feeds
│   └─ Regional Market APIs
│
├─→ SMS Gateway
│   └─ Africa's Talking
│
└─→ AI Services
    └─ OpenRouter API (GPT-4)
```

---

## 📊 User Journey Metrics

### Key Performance Indicators (KPIs)

#### Onboarding Success
- % Users completing registration
- Time to first action
- Onboarding completion rate

#### Feature Adoption
- % Users using AI chat
- Daily active features
- Feature engagement rate

#### Retention Metrics
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- Churn rate by user type

#### Conversion Metrics
- Guest → Registered conversion
- Free → Paid tier upgrade
- Feature usage → Transaction

---

## 🚦 Navigation Best Practices

### Design Principles
1. **Mobile-First**: Bottom nav for primary actions
2. **Context-Aware**: Show relevant options per screen
3. **Bilingual**: All labels in EN/SW
4. **Progressive Disclosure**: Advanced features in sub-menus
5. **Quick Access**: FAB for most common action
6. **Breadcrumbs**: Clear path hierarchy on desktop
7. **Back Navigation**: Hardware back button support

### Accessibility
- Clear tap targets (min 44px)
- High contrast colors
- Screen reader support
- Voice navigation option
- Offline mode indicators

---

## 🎨 Visual Journey Representations

### Color-Coded User Types
- 🌾 Farmer: Green (#10b981)
- 🏢 Organization: Blue (#3b82f6)
- 🤝 Cooperative: Purple (#8b5cf6)
- 🛍️ Buyer: Orange (#f59e0b)
- 👨‍🌾 Extension: Teal (#14b8a6)
- 🏭 Agribusiness: Red (#ef4444)
- 🏛️ Institution: Indigo (#6366f1)
- 🎭 Guest: Gray (#6b7280)

---

## 📝 Summary

This comprehensive user journey map covers:
- ✅ 8 distinct user types
- ✅ 50+ feature access points
- ✅ Critical decision paths
- ✅ Mobile & desktop navigation
- ✅ Integration touchpoints
- ✅ Conversion opportunities

All journeys support:
- 🌍 Bilingual interface (EN/SW)
- 📱 Mobile-responsive design
- ♿ Accessibility standards
- 🔒 Data privacy compliance
- 📡 Offline functionality

---

**Last Updated**: January 22, 2026  
**Version**: 1.0  
**Maintained By**: KILIMO Development Team
