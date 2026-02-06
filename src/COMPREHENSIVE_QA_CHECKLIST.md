# 📋 KILIMO AGRI-AI SUITE - COMPREHENSIVE QA CHECKLIST

## **🎯 FULL APP FUNCTIONAL QA & WORKFLOW VERIFICATION**

**Date**: 2026-01-24  
**Tester**: [Name]  
**Environment**: [Dev/Staging/Production]  
**Device**: [Mobile/Tablet/Desktop]  
**Browser**: [Chrome/Safari/Firefox]

---

## **PART 1: ONBOARDING FLOW** ✅

### **Test Scenario 1.1: First-Time User Experience**

| Step | Action | Expected Result | Status | Notes |
|------|--------|----------------|--------|-------|
| 1 | Open app for first time | Welcome screen appears | ☐ |  |
| 2 | View KILIMO logo | Logo is circular with white border & shadow | ☐ |  |
| 3 | Select language (SW) | Language changes to Swahili | ☐ |  |
| 4 | Select language (EN) | Language changes to English | ☐ |  |
| 5 | Click Continue | Navigate to onboarding slides | ☐ |  |
| 6 | View Slide 1 | "Grow Smarter" title, circular logo, green glow | ☐ |  |
| 7 | Swipe left | Navigate to Slide 2 | ☐ |  |
| 8 | View Slide 2 | 3 feature cards with green icons | ☐ |  |
| 9 | Click progress dot | Jump to selected slide | ☐ |  |
| 10 | View Slide 3 | 3 trust points with green icons | ☐ |  |
| 11 | Click Skip button | Skip to permissions screen | ☐ |  |
| 12 | Click Next button | Progress through slides sequentially | ☐ |  |
| 13 | Complete all slides | Navigate to permissions screen | ☐ |  |

### **Test Scenario 1.2: Permissions Screen**

| Step | Action | Expected Result | Status | Notes |
|------|--------|----------------|--------|-------|
| 1 | View permissions screen | Camera, Location, Notifications options shown | ☐ |  |
| 2 | Toggle camera ON | Permission granted | ☐ |  |
| 3 | Toggle camera OFF | Permission revoked | ☐ |  |
| 4 | Click Skip All | Proceed to demo mode | ☐ |  |
| 5 | Click Continue | Save permissions and proceed | ☐ |  |

### **Test Scenario 1.3: Demo & Registration**

| Step | Action | Expected Result | Status | Notes |
|------|--------|----------------|--------|-------|
| 1 | View demo mode | Interactive features preview shown | ☐ |  |
| 2 | Click "Continue as Guest" | Enter app as guest | ☐ |  |
| 3 | Click "Create Account" | Navigate to trust screen | ☐ |  |
| 4 | View trust screen | Credibility points displayed | ☐ |  |
| 5 | Click Continue | Navigate to signup CTA | ☐ |  |
| 6 | Click "Sign Up with Phone" | Registration form appears | ☐ |  |
| 7 | Click "Sign in" | Login form appears | ☐ |  |

### **🎨 Visual Checks - Onboarding**

| Element | Requirement | Status | Notes |
|---------|-------------|--------|-------|
| KILIMO Logo | Circular (h-32 w-32 rounded-full) | ☐ |  |
| Logo Border | White, 4px | ☐ |  |
| Logo Shadow | shadow-2xl | ☐ |  |
| Logo Glow | Green gradient (from-green-400 to-emerald-600) | ☐ |  |
| Feature Icons | Green background (bg-green-600) | ☐ |  |
| Progress Dots | Active: green-600, Inactive: gray-300 | ☐ |  |
| Skip Button | Top-right, visible on all slides | ☐ |  |
| Next Button | Green (bg-green-600), full width | ☐ |  |
| Typography | Black headings (gray-900), gray body (gray-600) | ☐ |  |
| Animations | Smooth, no jank | ☐ |  |

### **🌐 Localization - Onboarding**

| English Text | Swahili Text | Location | Status |
|--------------|--------------|----------|--------|
| "Grow Smarter, Harvest More" | "Lima kwa Akili, Vuna Zaidi" | Slide 1 title | ☐ |
| "Everything You Need" | "Kila Kitu Unachohitaji" | Slide 2 title | ☐ |
| "Built for You" | "Imejengwa kwa Ajili Yako" | Slide 3 title | ☐ |
| "Skip" | "Ruka" | Skip button | ☐ |
| "Next" | "Ifuatayo" | Next button | ☐ |
| "Continue" | "Endelea" | Final slide button | ☐ |
| "Crop & planting advice" | "Ushauri wa mazao na upandaji" | Feature card | ☐ |
| "Works offline" | "Inafanya kazi bila mtandao" | Trust point | ☐ |

---

## **PART 2: NAVIGATION MENU** 🚀

### **Test Scenario 2.1: Collapsible Navigation**

| Step | Action | Expected Result | Status | Notes |
|------|--------|----------------|--------|-------|
| 1 | Open navigation menu | Menu appears (mobile: drawer, desktop: sidebar) | ☐ |  |
| 2 | View category list | 12 categories shown with item counts | ☐ |  |
| 3 | Click "Main" category | Category expands, shows items | ☐ |  |
| 4 | Click "Main" again | Category collapses | ☐ |  |
| 5 | Click "Farm Management" | Category expands, shows 10+ items | ☐ |  |
| 6 | Click "Dashboard" item | Navigate to dashboard, menu highlights item | ☐ |  |
| 7 | View active item | Green background, border, pulsing dot | ☐ |  |
| 8 | Click another category | Previous category stays open | ☐ |  |
| 9 | Scroll menu | Smooth scrolling, all items visible | ☐ |  |
| 10 | View footer | Shows total features count | ☐ |  |
| 11 | Click close (X) button | Menu closes (mobile only) | ☐ |  |
| 12 | Switch language to SW | All labels translate | ☐ |  |

### **Test Scenario 2.2: Category Organization**

| Category ID | Expected Items | Count | Status | Notes |
|-------------|----------------|-------|--------|-------|
| main | Dashboard, Weather | 2-3 | ☐ |  |
| ai | Sankofa AI, Workflows, Diagnosis, Training Hub | 6-8 | ☐ |  |
| farm | Crop Planning, Livestock, Tasks, Mapping | 10+ | ☐ |  |
| market | Marketplace, Market Prices, Orders | 3-4 | ☐ |  |
| finance | Farm Finance, Mobile Money, Contracts | 3-4 | ☐ |  |
| services | Expert Consult, Soil Testing, Insurance | 3-4 | ☐ |  |
| insights | Analytics, Reports, Predictions | 4-5 | ☐ |  |
| learning | Videos, Knowledge Base, Crop Tips, Training | 4-5 | ☐ |  |
| community | Discussion Groups, Cooperative | 2 | ☐ |  |
| admin | Role Manager, Diagnostics | 2-3 | ☐ |  |
| help | Support, Contact Us, FAQ | 3 | ☐ |  |
| settings | Privacy, Profile | 1-2 | ☐ |  |

### **🎨 Visual Checks - Navigation**

| Element | Requirement | Status | Notes |
|---------|-------------|--------|-------|
| Menu Header | "Menu" or "Menyu", with close button | ☐ |  |
| Category Headers | Icon + label + item count badge | ☐ |  |
| Expand Icon | ChevronDown when collapsed, ChevronUp when expanded | ☐ |  |
| Active Category | Green background (bg-green-50) | ☐ |  |
| Active Item | Green gradient bg, green border-l-4, pulsing dot | ☐ |  |
| Item Icons | Circular background, appropriate color | ☐ |  |
| NEW Badges | Purple gradient (from-purple-500 to-purple-600) | ☐ |  |
| Spacing | Consistent padding, no overlaps | ☐ |  |
| Scrollbar | Auto-scroll, smooth | ☐ |  |
| Footer | Item count, centered text | ☐ |  |

### **🌐 Localization - Navigation**

| English | Swahili | Status |
|---------|---------|--------|
| "Menu" | "Menyu" | ☐ |
| "Main" | "Kuu" | ☐ |
| "AI Tools" | "Zana za AI" | ☐ |
| "Farm Management" | "Usimamizi wa Shamba" | ☐ |
| "Market & Sales" | "Soko na Mauzo" | ☐ |
| "Finance" | "Fedha" | ☐ |
| "Services" | "Huduma" | ☐ |
| "Dashboard" | "Dashibodi" | ☐ |
| "Market Prices" | "Bei za Soko" | ☐ |
| "Weather" | "Hali ya Hewa" | ☐ |
| "features available" | "vipengele vinavyopatikana" | ☐ |

---

## **PART 3: PAGE-BY-PAGE VERIFICATION** 📄

### **3.1 MAIN PAGES**

#### **Dashboard Home**

| Check | Status | Notes |
|-------|--------|-------|
| Page loads without errors | ☐ |  |
| All widgets display | ☐ |  |
| Role-based content shown | ☐ |  |
| Green branding applied | ☐ |  |
| Bilingual labels | ☐ |  |
| Responsive layout | ☐ |  |
| Quick action cards clickable | ☐ |  |
| Weather widget functional | ☐ |  |
| Farm stats accurate | ☐ |  |

#### **Weather**

| Check | Status | Notes |
|-------|--------|-------|
| Page loads | ☐ |  |
| Current weather displays | ☐ |  |
| 7-day forecast shown | ☐ |  |
| Location accurate | ☐ |  |
| Temperature units correct | ☐ |  |
| Rainfall data shown | ☐ |  |
| Alerts displayed | ☐ |  |
| Bilingual | ☐ |  |

### **3.2 AI TOOLS**

#### **Sankofa AI Chatbot**

| Check | Status | Notes |
|-------|--------|-------|
| Chat interface loads | ☐ |  |
| Input field functional | ☐ |  |
| Send button works | ☐ |  |
| Messages display | ☐ |  |
| Quick action chips clickable | ☐ |  |
| Typing indicator shows | ☐ |  |
| Responses appear | ☐ |  |
| Language toggle works | ☐ |  |
| Copy message button works | ☐ |  |
| Scroll to bottom works | ☐ |  |
| Green branding | ☐ |  |
| Bilingual | ☐ |  |

#### **AI Workflows**

| Check | Status | Notes |
|-------|--------|-------|
| Workflow list displays | ☐ |  |
| Cards clickable | ☐ |  |
| Workflow details show | ☐ |  |
| Execute workflow button works | ☐ |  |
| Progress tracking | ☐ |  |
| Results display | ☐ |  |
| Bilingual | ☐ |  |

#### **Crop Diagnosis**

| Check | Status | Notes |
|-------|--------|-------|
| Camera upload works | ☐ |  |
| Image preview displays | ☐ |  |
| Analysis runs | ☐ |  |
| Results show | ☐ |  |
| Recommendations display | ☐ |  |
| Save diagnosis works | ☐ |  |
| Bilingual | ☐ |  |

### **3.3 LEARNING SECTION**

#### **Video Tutorials**

| Check | Status | Notes |
|-------|--------|-------|
| Header green (from-green-600 to-emerald-600) | ☐ |  |
| Video grid displays | ☐ |  |
| Search works | ☐ |  |
| Category filter works | ☐ |  |
| Level filter works | ☐ |  |
| Low bandwidth toggle works | ☐ |  |
| Video cards clickable | ☐ |  |
| Progress bars show | ☐ |  |
| Completed badge displays | ☐ |  |
| Trending badge shows | ☐ |  |
| NEW badge displays | ☐ |  |
| Download button works | ☐ |  |
| Bilingual | ☐ |  |

#### **Knowledge Base**

| Check | Status | Notes |
|-------|--------|-------|
| Header green (from-green-600 to-emerald-600) | ☐ | FIXED |
| Article grid displays | ☐ |  |
| Search works | ☐ |  |
| Category filters work | ☐ |  |
| Sort options work | ☐ |  |
| Article cards clickable | ☐ |  |
| Expert verified badge shows | ☐ |  |
| Reading time displays | ☐ |  |
| Article reader opens | ☐ |  |
| Glossary tooltips work | ☐ |  |
| Related articles show | ☐ |  |
| Bookmark works | ☐ |  |
| Share works | ☐ |  |
| Bilingual | ☐ |  |

#### **Crop-Specific Tips**

| Check | Status | Notes |
|-------|--------|-------|
| Header green | ☐ |  |
| Crop selector works | ☐ |  |
| Tips display by stage | ☐ |  |
| Calendar view works | ☐ |  |
| Quick links functional | ☐ |  |
| Icons circular | ☐ |  |
| Bilingual | ☐ |  |

#### **Training Courses**

| Check | Status | Notes |
|-------|--------|-------|
| Course grid displays | ☐ |  |
| Enrollment button works | ☐ |  |
| Progress tracking | ☐ |  |
| Lessons open | ☐ |  |
| Quizzes functional | ☐ |  |
| Certificates generate | ☐ |  |
| Bilingual | ☐ |  |

#### **Farmer Lab**

| Check | Status | Notes |
|-------|--------|-------|
| Experiments list | ☐ |  |
| Create experiment works | ☐ |  |
| Record observations | ☐ |  |
| View results | ☐ |  |
| Share findings | ☐ |  |
| Bilingual | ☐ |  |

### **3.4 COMMUNITY**

#### **Discussion Groups**

| Check | Status | Notes |
|-------|--------|-------|
| Groups list displays | ☐ |  |
| Join group works | ☐ |  |
| Create post works | ☐ |  |
| Reply to post works | ☐ |  |
| Like/react works | ☐ |  |
| Notifications work | ☐ |  |
| Bilingual | ☐ |  |

#### **Achievements**

| Check | Status | Notes |
|-------|--------|-------|
| Badge display | ☐ |  |
| Progress tracking | ☐ |  |
| Leaderboard works | ☐ |  |
| Unlock animations | ☐ |  |
| Share badges | ☐ |  |
| Bilingual | ☐ |  |

### **3.5 MARKETPLACE**

#### **Marketplace**

| Check | Status | Notes |
|-------|--------|-------|
| Product grid displays | ☐ |  |
| Search works | ☐ |  |
| Filters work | ☐ |  |
| Product details open | ☐ |  |
| Add to cart works | ☐ |  |
| Cart displays | ☐ |  |
| Checkout works | ☐ |  |
| Payment integration | ☐ |  |
| Order confirmation | ☐ |  |
| Bilingual | ☐ |  |

#### **Market Prices**

| Check | Status | Notes |
|-------|--------|-------|
| Price grid displays | ☐ |  |
| Location filter works | ☐ |  |
| Crop filter works | ☐ |  |
| Historical charts show | ☐ |  |
| Price alerts work | ☐ |  |
| Export data works | ☐ |  |
| Bilingual | ☐ |  |

#### **Orders & Sales**

| Check | Status | Notes |
|-------|--------|-------|
| Orders list displays | ☐ |  |
| Filter by status works | ☐ |  |
| Order details open | ☐ |  |
| Track shipment works | ☐ |  |
| Invoice generation | ☐ |  |
| Bilingual | ☐ |  |

### **3.6 SERVICES**

#### **Contract Farming**

| Check | Status | Notes |
|-------|--------|-------|
| Header green (from-green-600 to-emerald-600) | ☐ | FIXED |
| Tab toggle works (Learn/Contracts) | ☐ |  |
| Learning content displays | ☐ |  |
| Step indicators green | ☐ | FIXED |
| Available contracts list | ☐ |  |
| Contract details open | ☐ |  |
| Apply button works | ☐ |  |
| Milestone tracking | ☐ |  |
| Escrow protection info | ☐ |  |
| Active contracts display | ☐ |  |
| Contact buyer works | ☐ |  |
| Bilingual | ☐ |  |

#### **Expert Consultation**

| Check | Status | Notes |
|-------|--------|-------|
| Expert profiles display | ☐ |  |
| Filter by specialization | ☐ |  |
| Book consultation works | ☐ |  |
| Calendar integration | ☐ |  |
| Payment works | ☐ |  |
| Video call integration | ☐ |  |
| Consultation history | ☐ |  |
| Bilingual | ☐ |  |

#### **Soil Testing**

| Check | Status | Notes |
|-------|--------|-------|
| Request form works | ☐ |  |
| Sample collection info | ☐ |  |
| Lab selection | ☐ |  |
| Payment integration | ☐ |  |
| Results display | ☐ |  |
| Recommendations show | ☐ |  |
| Download report works | ☐ |  |
| Bilingual | ☐ |  |

#### **Insurance Hub**

| Check | Status | Notes |
|-------|--------|-------|
| Plans display | ☐ |  |
| Coverage calculator | ☐ |  |
| Apply for insurance | ☐ |  |
| Claims submission | ☐ |  |
| Policy documents | ☐ |  |
| Premium payment | ☐ |  |
| Bilingual | ☐ |  |

### **3.7 FARM MANAGEMENT**

#### **Crop Planning**

| Check | Status | Notes |
|-------|--------|-------|
| Calendar view | ☐ |  |
| Add crop works | ☐ |  |
| Planting schedule | ☐ |  |
| Task creation | ☐ |  |
| Timeline view | ☐ |  |
| Crop rotation planner | ☐ |  |
| Bilingual | ☐ |  |

#### **Crop Dashboard**

| Check | Status | Notes |
|-------|--------|-------|
| Crop summary cards | ☐ |  |
| Growth tracking | ☐ |  |
| Health indicators | ☐ |  |
| Yield predictions | ☐ |  |
| Input tracking | ☐ |  |
| Cost analysis | ☐ |  |
| Bilingual | ☐ |  |

#### **Task Management**

| Check | Status | Notes |
|-------|--------|-------|
| Task list displays | ☐ |  |
| Create task works | ☐ |  |
| Edit task works | ☐ |  |
| Mark complete works | ☐ |  |
| Due date reminders | ☐ |  |
| Task categories | ☐ |  |
| Bilingual | ☐ |  |

#### **Livestock Management**

| Check | Status | Notes |
|-------|--------|-------|
| Animal registry | ☐ |  |
| Health records | ☐ |  |
| Vaccination tracking | ☐ |  |
| Breeding records | ☐ |  |
| Production tracking | ☐ |  |
| Alerts work | ☐ |  |
| Bilingual | ☐ |  |

#### **Farm Mapping**

| Check | Status | Notes |
|-------|--------|-------|
| Map displays | ☐ |  |
| Draw boundaries works | ☐ |  |
| Mark zones works | ☐ |  |
| Area calculation | ☐ |  |
| Save map works | ☐ |  |
| Export map works | ☐ |  |
| Bilingual | ☐ |  |

#### **Inventory**

| Check | Status | Notes |
|-------|--------|-------|
| Stock list displays | ☐ |  |
| Add item works | ☐ |  |
| Update quantity works | ☐ |  |
| Low stock alerts | ☐ |  |
| Categories work | ☐ |  |
| Reports generate | ☐ |  |
| Bilingual | ☐ |  |

### **3.8 FINANCE**

#### **Farm Finance**

| Check | Status | Notes |
|-------|--------|-------|
| Income/expense tracking | ☐ |  |
| Add transaction works | ☐ |  |
| Categories work | ☐ |  |
| Reports generate | ☐ |  |
| Charts display | ☐ |  |
| Budget tracking | ☐ |  |
| Export works | ☐ |  |
| Bilingual | ☐ |  |

#### **Mobile Money**

| Check | Status | Notes |
|-------|--------|-------|
| Wallet balance displays | ☐ |  |
| Send money works | ☐ |  |
| Receive money works | ☐ |  |
| Transaction history | ☐ |  |
| Top-up works | ☐ |  |
| Withdraw works | ☐ |  |
| Bilingual | ☐ |  |

### **3.9 HELP & SUPPORT**

#### **Support**

| Check | Status | Notes |
|-------|--------|-------|
| Support options display | ☐ |  |
| Create ticket works | ☐ |  |
| Chat support works | ☐ |  |
| Email support works | ☐ |  |
| Phone support info | ☐ |  |
| Bilingual | ☐ |  |

#### **Contact Us**

| Check | Status | Notes |
|-------|--------|-------|
| Contact form works | ☐ |  |
| Email validation | ☐ |  |
| Phone validation | ☐ |  |
| Submit works | ☐ |  |
| Confirmation message | ☐ |  |
| Office location map | ☐ |  |
| Bilingual | ☐ |  |

#### **FAQ**

| Check | Status | Notes |
|-------|--------|-------|
| Categories display | ☐ |  |
| Search works | ☐ |  |
| Expand/collapse works | ☐ |  |
| Related questions show | ☐ |  |
| Helpful feedback works | ☐ |  |
| Bilingual | ☐ |  |

---

## **PART 4: CROSS-FUNCTIONAL CHECKS** 🔄

### **4.1 Responsive Design**

| Device | Resolution | Status | Issues |
|--------|-----------|--------|--------|
| Mobile (Portrait) | 375x667 | ☐ |  |
| Mobile (Landscape) | 667x375 | ☐ |  |
| Tablet (Portrait) | 768x1024 | ☐ |  |
| Tablet (Landscape) | 1024x768 | ☐ |  |
| Desktop (Small) | 1280x720 | ☐ |  |
| Desktop (Medium) | 1920x1080 | ☐ |  |
| Desktop (Large) | 2560x1440 | ☐ |  |

### **4.2 Browser Compatibility**

| Browser | Version | Status | Issues |
|---------|---------|--------|--------|
| Chrome | Latest | ☐ |  |
| Safari | Latest | ☐ |  |
| Firefox | Latest | ☐ |  |
| Edge | Latest | ☐ |  |
| Mobile Safari | iOS 15+ | ☐ |  |
| Chrome Mobile | Android 10+ | ☐ |  |

### **4.3 Performance**

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Page Load Time | < 3s | | ☐ |
| Time to Interactive | < 5s | | ☐ |
| First Contentful Paint | < 2s | | ☐ |
| Largest Contentful Paint | < 4s | | ☐ |
| Animation Frame Rate | 60 FPS | | ☐ |
| Bundle Size | < 500KB | | ☐ |

### **4.4 Accessibility (WCAG 2.1 AA)**

| Check | Standard | Status | Notes |
|-------|----------|--------|-------|
| Color Contrast | 4.5:1 minimum | ☐ |  |
| Keyboard Navigation | All interactive elements | ☐ |  |
| Screen Reader | ARIA labels present | ☐ |  |
| Focus Indicators | Visible on all elements | ☐ |  |
| Alt Text | All images | ☐ |  |
| Form Labels | All inputs | ☐ |  |
| Heading Hierarchy | Proper H1-H6 structure | ☐ |  |

### **4.5 Security**

| Check | Status | Notes |
|-------|--------|-------|
| HTTPS enforced | ☐ |  |
| Authentication works | ☐ |  |
| Session management | ☐ |  |
| CSRF protection | ☐ |  |
| XSS prevention | ☐ |  |
| Input validation | ☐ |  |
| API key security | ☐ |  |

### **4.6 Offline Functionality**

| Feature | Works Offline | Status | Notes |
|---------|---------------|--------|-------|
| Service Worker | Registered | ☐ |  |
| Cached pages | Available | ☐ |  |
| Offline indicator | Shows when offline | ☐ |  |
| Sync on reconnect | Works | ☐ |  |
| Local storage | Data persists | ☐ |  |

---

## **PART 5: USER ROLE TESTING** 👥

### **5.1 Smallholder Farmer**

| Feature | Accessible | Functional | Status |
|---------|------------|------------|--------|
| Dashboard | ☐ | ☐ | ☐ |
| Sankofa AI | ☐ | ☐ | ☐ |
| Market Prices | ☐ | ☐ | ☐ |
| Video Tutorials | ☐ | ☐ | ☐ |
| Crop Planning | ☐ | ☐ | ☐ |
| Task Management | ☐ | ☐ | ☐ |
| Weather | ☐ | ☐ | ☐ |
| Marketplace (Buy) | ☐ | ☐ | ☐ |
| Farm Finance | ☐ | ☐ | ☐ |
| Discussion Groups | ☐ | ☐ | ☐ |

### **5.2 Expert/Agronomist**

| Feature | Accessible | Functional | Status |
|---------|------------|------------|--------|
| Expert Dashboard | ☐ | ☐ | ☐ |
| Consultation Calendar | ☐ | ☐ | ☐ |
| Farmer Requests | ☐ | ☐ | ☐ |
| Knowledge Base (Contribute) | ☐ | ☐ | ☐ |
| Analytics | ☐ | ☐ | ☐ |
| Reports | ☐ | ☐ | ☐ |

### **5.3 Buyer/Trader**

| Feature | Accessible | Functional | Status |
|---------|------------|------------|--------|
| Buyer Dashboard | ☐ | ☐ | ☐ |
| Contract Farming | ☐ | ☐ | ☐ |
| Orders Management | ☐ | ☐ | ☐ |
| Marketplace (Sell) | ☐ | ☐ | ☐ |
| Farmer Network | ☐ | ☐ | ☐ |

### **5.4 Admin**

| Feature | Accessible | Functional | Status |
|---------|------------|------------|--------|
| System Diagnostics | ☐ | ☐ | ☐ |
| Role Manager | ☐ | ☐ | ☐ |
| Analytics Dashboard | ☐ | ☐ | ☐ |
| All Features | ☐ | ☐ | ☐ |

---

## **PART 6: LOCALIZATION TESTING** 🌍

### **6.1 Language Switch**

| Action | Expected | Status | Notes |
|--------|----------|--------|-------|
| Switch EN → SW | All text translates | ☐ |  |
| Switch SW → EN | All text translates | ☐ |  |
| Page reload | Language persists | ☐ |  |
| No text truncation | All labels fit | ☐ |  |
| Form validation (EN) | English messages | ☐ |  |
| Form validation (SW) | Swahili messages | ☐ |  |
| Date format (EN) | MM/DD/YYYY | ☐ |  |
| Date format (SW) | DD/MM/YYYY | ☐ |  |
| Currency | TZS formatted correctly | ☐ |  |

### **6.2 Translation Coverage**

| Section | EN Coverage | SW Coverage | Status |
|---------|-------------|-------------|--------|
| Onboarding | 100% | 100% | ☐ |
| Navigation | 100% | 90% | ☐ |
| Dashboard | 100% | TBD | ☐ |
| Learning | 100% | TBD | ☐ |
| Marketplace | 100% | TBD | ☐ |
| Services | 100% | TBD | ☐ |
| Forms | 100% | TBD | ☐ |
| Errors | 100% | TBD | ☐ |

---

## **PART 7: INTEGRATION TESTING** 🔗

### **7.1 API Integrations**

| API | Endpoint | Status | Notes |
|-----|----------|--------|-------|
| Weather | /weather | ☐ |  |
| Market Prices | /market-prices | ☐ |  |
| AI Chat | /ai/chat | ☐ |  |
| Crop Diagnosis | /ai/diagnosis | ☐ |  |
| Marketplace | /marketplace/* | ☐ |  |
| Payments | /payments/* | ☐ |  |
| Mobile Money | /mobile-money/* | ☐ |  |

### **7.2 External Services**

| Service | Feature | Status | Notes |
|---------|---------|--------|-------|
| Supabase Auth | Login/Signup | ☐ |  |
| Supabase DB | Data storage | ☐ |  |
| OpenRouter | AI responses | ☐ |  |
| Flutterwave | Payments | ☐ |  |
| Selcom | Mobile money | ☐ |  |
| OpenWeather | Weather data | ☐ |  |

---

## **SUMMARY & SIGN-OFF** ✍️

### **Critical Issues Found:**
1. 
2. 
3. 

### **High Priority Issues:**
1. 
2. 
3. 

### **Medium Priority Issues:**
1. 
2. 
3. 

### **Low Priority Issues:**
1. 
2. 
3. 

### **Overall Assessment:**

| Category | Score (1-10) | Comments |
|----------|--------------|----------|
| Functionality | | |
| Visual Design | | |
| Brand Consistency | | |
| Localization | | |
| Performance | | |
| Accessibility | | |
| User Experience | | |
| **OVERALL** | | |

### **Recommendation:**

☐ **APPROVED** - Ready for production  
☐ **APPROVED WITH MINOR FIXES** - Deploy after addressing low/medium issues  
☐ **NEEDS WORK** - Significant issues must be resolved  
☐ **NOT APPROVED** - Major rework required

### **Sign-Off:**

**QA Lead**: _________________ Date: _______  
**Product Manager**: _________________ Date: _______  
**Technical Lead**: _________________ Date: _______

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-24  
**Next Review**: [Date]
