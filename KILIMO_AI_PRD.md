# Product Requirements Document
## KILIMO AI — Agricultural Intelligence Platform

**Version:** 1.0  
**Date:** May 2026  
**Status:** Production  

---

## 1. Executive Summary

KILIMO AI is a Swahili-first, AI-powered agricultural platform designed for East African farmers and the broader agri-ecosystem. The product delivers actionable intelligence — crop diagnosis, market prices, financial tools, and expert advisory — through a mobile-first web application. The platform bridges the gap between smallholder subsistence farmers and the modern digital economy by making advanced agricultural technology accessible in local language and on modest hardware.

The name "Kilimo" (Swahili for "agriculture" or "farming") reflects the product's core identity: technology built from the ground up for African farmers, not adapted from elsewhere.

---

## 2. Problem Statement

East African farmers, particularly in Tanzania, face compounding challenges:

- **Information asymmetry** — Market prices, weather forecasts, and agronomic best practices are inaccessible or arrive too late to act on.
- **Limited extension coverage** — Government agricultural officers cannot reach millions of smallholders at the frequency needed.
- **Financial exclusion** — Farmers lack access to credit, insurance, and formal financial services without digital identity or track records.
- **Crop loss from disease** — Without timely diagnosis, plant disease spreads unchecked, destroying entire harvests.
- **Language barriers** — Most digital agricultural tools are English-only, excluding the majority of rural farmers.

KILIMO AI addresses all five problems in a single integrated platform.

---

## 3. Target Users

### 3.1 Primary Personas

| Role | Description | Farm Scale | Key Need |
|---|---|---|---|
| **Smallholder Farmer** | Subsistence/semi-commercial grower | 0–5 acres | AI advice, disease detection, market access |
| **Farmer** | Independent producer | 5+ acres | Planning tools, yield optimization |
| **Commercial Farmer** | Revenue-driven operation | 5+ acres | Analytics, contracts, finance |
| **Farm Manager** | Manages multiple fields/teams | Multi-field | Task coordination, reporting |
| **Commercial Farm Admin** | Enterprise farm operations | Enterprise | Full platform + admin controls |
| **Cooperative Leader** | Leads a farmers' group | Group | Member management, aggregated sales |
| **Agribusiness Operator** | Buyer / input supplier | B2B | Marketplace procurement, contracts |
| **Extension Officer / NGO** | Agricultural advisor | N/A | Farmer monitoring, training delivery |

### 3.2 Language & Literacy

- Default language: **Swahili**
- Secondary language: **English** (toggle available)
- UI designed for limited-literacy users: icons, color-coding, and minimal text

---

## 4. Product Goals

1. **Increase farmer income** by providing real-time market pricing and marketplace access.
2. **Reduce crop loss** through AI-powered disease diagnosis and timely intervention.
3. **Replace the extension officer gap** with always-available AI advisory (Sankofa AI).
4. **Digitize farm financial records** to unlock access to credit and insurance.
5. **Build a verifiable farmer identity** (Creova Agro ID) that functions as a digital passport for services.

---

## 5. Feature Overview

### 5.1 Authentication & Onboarding

- **Dual-method auth**: Phone number + OTP (primary) or email + password
- **Bilingual onboarding**: World-class multi-step flow with role selection, farm profile setup, and language preference
- **Role-based access**: Features unlocked differ by user role and subscription tier
- **Inline personalization**: Post-signup prompt to tailor the experience (crop focus, main activity)
- **Session security**: 15-minute inactivity timeout with 1-minute warning
- **Subscription tiers**: Free, Basic, Premium, Enterprise

---

### 5.2 AI Advisory Suite (Unified AI Advisor)

The centerpiece of the product. Branded "Sankofa AI."

#### 5.2.1 AI Chat
- Conversational farming assistant
- Responds in Swahili or English
- Contextually aware of user's region, crops, and farm size
- Answers questions on planting schedules, pest management, soil health, and more

#### 5.2.2 Photo Crop Diagnosis
- Camera or gallery image upload
- AI identifies disease, pest, or nutrient deficiency
- Returns: diagnosis name, confidence %, severity level, treatment remedy, nearby agro-dealers
- **Severity escalation**: For high/critical severity — auto-prompts task creation and sends SMS alert to farmer
- Supports offline image capture with queued upload

#### 5.2.3 Voice Assistant
- Voice-to-text input for farmers with limited literacy
- Responds in natural speech
- Hands-free operation for use in the field

#### 5.2.4 AI Farm Plan Generator
- Generates a full seasonal farm plan based on crop type, region, and farm size
- Outputs: planting schedule, input requirements, expected costs, projected revenue

#### 5.2.5 AI Recommendation Engine
- Proactive, personalized recommendations pushed to the dashboard
- Based on current weather, market trends, and historical farm data

#### 5.2.6 Predictive Models
- Yield forecasts based on current field conditions and historical data
- Price trend predictions for the farmer's crop portfolio
- Risk alerts: disease outbreak probability, adverse weather

#### 5.2.7 Digital Farm Twin
- A virtual model of the farm that simulates different scenarios
- Allows "what if" planning before committing resources

#### 5.2.8 AI Training Hub
- Interactive AI literacy modules for farmers
- Teaches how to get the best out of Sankofa AI
- Short video + quiz format

---

### 5.3 Farm Management Suite

#### 5.3.1 Crop Planning (Unified)
- **Knowledge Layer**: Crop library, growing guides, historical performance data, crop-specific tips
- **Execution Layer**: Current season plans, field allocation, yield forecasts, task timelines
- AI-assisted crop selection based on region, soil type, and market demand
- Visual crop calendar with drag-and-drop scheduling

#### 5.3.2 Farm Mapping
- Interactive field mapping using GPS
- Plot boundaries, field labels, and land allocation visualization
- Plot-level crop assignment and monitoring

#### 5.3.3 Task Management
- Farm task calendar with priority levels (normal → urgent)
- Task auto-creation from AI diagnosis results
- Team assignment for farm manager roles
- Completion tracking with progress indicators

#### 5.3.4 Livestock Management
- Animal inventory by species and count
- Health monitoring and vaccination records
- Breeding and production tracking
- Health alerts and vet consultation prompts

#### 5.3.5 Resource & Inventory Management
- Track seeds, fertilizers, pesticides, and equipment
- Low-stock alerts and reorder suggestions
- Input cost tracking for profit-loss calculation

#### 5.3.6 Family Farm Planner
- Designed for household-level smallholder farms
- Allocates different plots to different family members
- Tracks contributions and shared resource usage

#### 5.3.7 Farmer Lab
- Experimental space for testing new techniques
- Comparison trials: side-by-side plot performance
- Connects with the AI recommendation engine for experiment design

---

### 5.4 Market & Sales Suite (Unified Market)

#### 5.4.1 Market Prices
- Real-time commodity prices for major crops
- Price comparison across regional markets
- Historical price charts with trend analysis
- Price alerts at user-defined thresholds

#### 5.4.2 Marketplace
- Buy and sell produce directly
- Listing management with photos, quantity, grade, and price
- Next-Gen Marketplace: demand aggregation, bulk order matching

#### 5.4.3 Orders & E-commerce
- Order tracking from listing to delivery
- Invoicing and receipt generation
- Buyer/seller messaging

#### 5.4.4 Input Supply Chain
- Intelligent marketplace for seeds, fertilizer, and agrochemicals
- Vetted suppliers with ratings
- Delivery scheduling and payment integration

#### 5.4.5 Contract Farming
- Digital contract creation between farmers and buyers
- Fair contract templates with transparent terms
- Milestone-based payment schedules

#### 5.4.6 Agribusiness Dashboard
- For buyer/supplier users: procurement management, farmer network, volume planning
- KPIs: volume sourced, active contracts, payment status

---

### 5.5 Finance Suite (Unified Finance)

#### 5.5.1 Farm Finance Tracker
- Income and expense recording
- Season-level profit and loss summaries
- Export to PDF/CSV for loan applications

#### 5.5.2 Mobile Money Hub
- M-Pesa, Airtel Money, and USSD payment integrations
- Send/receive payments within the platform
- Transaction history and reconciliation

#### 5.5.3 Financial Command Center
- Real-time financial dashboard
- Cash flow forecasting
- Debt management and loan tracking

#### 5.5.4 Insurance Hub
- Crop and livestock insurance products
- Claim submission via the app
- Premium payment through mobile money

#### 5.5.5 Wallet & Payments
- In-app wallet for platform transactions
- Wallet admin dashboard for commercial/enterprise users
- Loan repayment tracking

---

### 5.6 Services

#### 5.6.1 Expert Consultations
- Book sessions with certified agronomists, vets, and farm advisors
- Video call or chat-based consultation
- Consultation history and notes

#### 5.6.2 Soil Testing Service
- Request a soil test kit delivery
- Track sample status
- Receive AI-interpreted results with fertilizer recommendations

#### 5.6.3 Weather
- Hyperlocal weather forecasts (3-day, 7-day)
- Real-time conditions: temperature, humidity, rainfall, wind
- Planting-day recommendation based on forecast
- Severe weather alerts via SMS

#### 5.6.4 Creova Agro ID
- Digital farmer identity card with unique ID
- Records farm size, crops, certifications, and transaction history
- Shareable with banks, insurers, and buyers as proof of farming activity

---

### 5.7 Analytics & Reporting

#### 5.7.1 Analytics Dashboard
- Farm performance KPIs: yield, cost per unit, revenue
- Seasonal comparisons
- Role-specific views (farmer vs. cooperative vs. agribusiness)

#### 5.7.2 Comprehensive Reporting
- Automated season-end report generation
- Export-ready for grant applications, bank submissions, or NGO reporting

#### 5.7.3 Farm Graph
- Visual knowledge graph of farm relationships: plots → crops → inputs → outcomes
- For commercial and farm manager roles

---

### 5.8 Learning & Support (Unified Learning)

#### 5.8.1 Video Tutorials
- Short-form how-to videos in Swahili and English
- Topics: platform usage, farming techniques, business basics
- Offline viewing capability

#### 5.8.2 Knowledge Repository
- Searchable library of farming guides, pest databases, and best practices
- Curated by region and crop type

#### 5.8.3 AI Training Hub
- Interactive modules teaching responsible AI use in farming
- Certification on completion

#### 5.8.4 Support & Helpdesk
- In-app support tickets
- FAQ in Swahili and English
- Live chat escalation path
- Contact form with SMS/email confirmation

---

### 5.9 Community (Unified Community)

#### 5.9.1 Peer Discussion Groups
- Region and crop-specific discussion boards
- Share photos, ask questions, and exchange advice
- Expert-moderated threads

#### 5.9.2 Cooperative Management
- For cooperative leaders: member roster, shared resources, group sales coordination
- Meeting scheduling and attendance tracking
- Group income distribution calculator

---

### 5.10 Gamification

- Points and badges for platform engagement (tasks completed, diagnoses run, market listings)
- Leaderboard by region
- Unlocks advisory content at higher engagement levels

---

### 5.11 Offline & Connectivity

- Offline banner alerts user when connectivity is lost
- Offline image capture for crop diagnosis (queued upload)
- SMS/USSD fallback simulation for low-connectivity zones
- Service worker caching for critical screens

---

### 5.12 Notifications

- In-app notification panel with unread count
- Push notifications (browser/PWA)
- SMS alerts for: critical diagnoses, price threshold triggers, severe weather, task due dates
- Africa's Talking SMS gateway integration

---

## 6. Role-Based Feature Matrix (Summary)

| Feature Category | Smallholder | Farmer | Farm Manager | Commercial Admin | Agribusiness | Extension Officer | Cooperative Leader |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| AI Chat / Advisory | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Photo Crop Diagnosis | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| Voice Assistant | ✓ | ✓ | ✓ | ✓ | — | — | ✓ |
| Crop Planning | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| Livestock Management | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| Farm Mapping | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Task Management | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Market & Marketplace | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Finance & Mobile Money | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Wallet Admin | — | — | — | ✓ | ✓ | — | — |
| Insurance | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Contract Farming | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Analytics & Reports | — | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Predictive Models | — | — | ✓ | ✓ | ✓ | — | — |
| Digital Farm Twin | — | — | ✓ | ✓ | — | — | — |
| Agro ID | — | — | — | ✓ | — | — | — |
| Cooperative Tools | ✓ | ✓ | — | — | — | ✓ | ✓ |
| Extension Dashboard | — | — | — | — | — | ✓ | — |
| Institutional Dashboard | — | — | — | ✓ | ✓ | ✓ | — |
| Gamification | ✓ | ✓ | ✓ | ✓ | — | — | — |

---

## 7. Technical Architecture

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite 6 |
| Styling | Tailwind CSS v4 (pre-compiled), Radix UI |
| Backend / Database | Supabase (PostgreSQL + Edge Functions) |
| Auth | Supabase Auth (OTP + email/password) |
| AI Inference | Supabase Edge Functions (proxied to AI APIs) |
| Payments/Mobile Money | Africa's Talking, M-Pesa integration |
| SMS / Notifications | Africa's Talking SMS Gateway |
| Analytics | Custom analytics utility (internal) |
| Crash Reporting | Custom error boundary + crash reporter |
| Hosting | Static deployment (Replit / CDN) |
| PWA | Service worker, install prompt, offline support |

---

## 8. Subscription Tiers

| Tier | Target User | Key Additions |
|---|---|---|
| **Free** | Smallholder farmers | Core AI advisory, diagnosis, market prices, basic finance |
| **Basic** | Farmers (5+ acres) | Expanded crop planning, task management, marketplace |
| **Premium** | Commercial farmers, Farm managers | Analytics, predictive models, digital twin, expert consultations |
| **Enterprise** | Commercial admins, Agribusiness | Wallet admin, institutional dashboard, full reporting, API access |

---

## 9. Non-Functional Requirements

| Requirement | Target |
|---|---|
| **Language** | Swahili (default), English (toggle) |
| **Mobile-first** | Responsive; optimized for Android entry-level devices |
| **Offline capability** | Core screens cached; diagnosis queued |
| **Session security** | 15-minute inactivity timeout |
| **Error resilience** | Global error boundary; component-level error boundaries |
| **Performance** | First Contentful Paint < 3s on 3G |
| **Accessibility** | High-contrast mode; icon + text navigation |
| **Data privacy** | GDPR-aligned; explicit consent flow on signup |

---

## 10. Success Metrics

| Metric | Definition | Target (12 months) |
|---|---|---|
| Monthly Active Users | Unique users logging in per month | 50,000 |
| Diagnosis Accuracy | % of diagnoses confirmed correct by agronomist audit | > 85% |
| Market Transaction Volume | Total value of produce sold via marketplace | $2M USD |
| Farmer Income Uplift | % increase in reported income vs. baseline | +20% |
| App Rating | User-reported satisfaction (in-app survey) | 4.5 / 5.0 |
| Paid Tier Conversion | % of free users upgrading within 90 days | 15% |
| Session Length | Average active session duration | > 8 minutes |
| Return Rate | % of users returning within 7 days | > 55% |

---

## 11. Out of Scope (v1)

- Native iOS / Android app (current product is a PWA)
- Multi-country localization beyond Swahili/English
- Drone / IoT sensor integration
- Blockchain-based produce provenance tracking
- Direct bank lending origination

---

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Low smartphone penetration in target areas | High | High | PWA + SMS/USSD fallback; offline mode |
| AI diagnosis inaccuracy causing farmer harm | Medium | High | Severity warnings; human-in-the-loop escalation |
| Mobile money API downtime | Medium | High | Multi-provider fallback (M-Pesa + Airtel + USSD) |
| Language/dialect gaps in Swahili | Medium | Medium | Community feedback loop; regional dialect testing |
| Farmer trust deficit in AI advice | High | Medium | Gamification; expert endorsement; transparent confidence scores |
| Data privacy concerns | Low | High | Consent-first onboarding; GDPR-aligned data handling |

---

*This document reflects the product as built and deployed in May 2026. Feature scope, roles, and metrics are subject to revision as the product evolves.*

---

## 13. User Stories

User stories are organized by feature area and persona. Format: **As a [role], I want to [action] so that [outcome].**

Priority levels: **P0** (must-have, launch-blocking) · **P1** (high value, launch target) · **P2** (nice to have, post-launch)

---

### 13.1 Authentication & Onboarding

| ID | User Story | Role | Priority | Acceptance Criteria |
|---|---|---|---|---|
| AUTH-01 | As a first-time user, I want to register using my phone number and receive an OTP so that I don't need to remember a password | All | P0 | OTP delivered via SMS within 30s; valid for 5 minutes; incorrect OTP shows clear error |
| AUTH-02 | As a user, I want to register using my email and password as an alternative so that I can access the platform without a mobile number | All | P0 | Email validation enforced; password min 8 chars; confirmation email sent |
| AUTH-03 | As a returning user, I want my session to be remembered so that I don't log in every time I open the app | All | P0 | Session persists for 30 days unless manually logged out or timed out |
| AUTH-04 | As a user, I want to choose my role during signup so that the platform shows only features relevant to my situation | All | P0 | Role selection screen presents all 8 roles with clear descriptions; chosen role controls feature visibility |
| AUTH-05 | As a user, I want the app to default to Swahili so that I can use it comfortably in my language | All | P0 | All UI text renders in Swahili by default; English toggle available in header |
| AUTH-06 | As an inactive user, I want to be warned before my session expires so that I don't lose my work unexpectedly | All | P1 | Warning toast shown 1 minute before 15-minute inactivity timeout; clicking any element resets timer |
| AUTH-07 | As a new user, I want an engaging onboarding flow that explains the app's value so that I start using it with confidence | All | P1 | Multi-step onboarding covers: language choice, role selection, farm profile, key features tour |
| AUTH-08 | As a logged-in user, I want to update my farm profile (crops, region, farm size) so that AI recommendations stay accurate | All | P1 | Profile editable from the Profile drawer; changes reflected in AI context immediately |

---

### 13.2 AI Advisory (Sankofa AI)

| ID | User Story | Role | Priority | Acceptance Criteria |
|---|---|---|---|---|
| AI-01 | As a smallholder farmer, I want to ask the AI a farming question in Swahili and get a clear answer so that I have expert guidance without hiring a consultant | Smallholder Farmer | P0 | Chat responds within 5 seconds; response language matches user's selected language; answers are agronomically accurate |
| AI-02 | As a farmer, I want to photograph a diseased crop and get a diagnosis so that I can treat it before losing my harvest | All Farmers | P0 | Image processed within 10s; returns: disease name, confidence %, severity (low/medium/high/critical), treatment steps, nearest agro-dealer |
| AI-03 | As a farmer who finds a critical disease, I want the app to automatically offer to create a treatment task so that I don't forget to act | All Farmers | P0 | After critical/high-severity diagnosis, a confirm dialog prompts task creation; if accepted, task appears in Task Management with urgency flag |
| AI-04 | As a farmer with a critical diagnosis, I want to receive an SMS alert so that I'm notified even if I close the app | All Farmers | P1 | SMS sent to registered phone number within 60s of a critical-severity diagnosis confirmation |
| AI-05 | As a farmer with limited literacy, I want to speak my questions to the AI so that I can get advice without typing | Smallholder Farmer, Cooperative Leader | P1 | Voice input activates microphone; transcript shown before submission; error if microphone permission denied |
| AI-06 | As a farmer, I want the AI to proactively push relevant recommendations to my dashboard so that I see opportunities I might have missed | All Farmers | P1 | At least 3 personalized recommendations visible on dashboard; refreshed daily; based on user's crops, region, and weather |
| AI-07 | As a commercial farmer, I want the AI to generate a full seasonal farm plan so that I can enter the season with a clear execution roadmap | Commercial Farmer, Farm Manager | P1 | Farm plan includes: crop schedule, input list with costs, weekly task breakdown, projected revenue at current market prices |
| AI-08 | As a farm manager, I want to see yield predictions for each plot so that I can plan logistics and sales in advance | Farm Manager, Commercial Admin | P1 | Yield forecast shown per plot with confidence interval; updates when weather or input data changes |
| AI-09 | As a commercial farm admin, I want to run "what if" simulations on my farm so that I can compare planting strategies before committing | Commercial Farm Admin | P2 | Digital Farm Twin allows changing: crop type, planting date, input levels; shows projected outcome difference vs. baseline |
| AI-10 | As a new user, I want to learn how to get the most out of the AI so that I ask better questions and get better results | All | P2 | AI Training Hub has at least 5 modules; each under 5 minutes; completion earns a badge |

---

### 13.3 Crop Planning & Management

| ID | User Story | Role | Priority | Acceptance Criteria |
|---|---|---|---|---|
| CROP-01 | As a farmer, I want to view a library of crops with growing guides so that I can choose what to plant based on reliable information | All Farmers | P0 | Crop library has at least 30 common East African crops; each entry includes: season, soil type, yield range, common pests |
| CROP-02 | As a farmer, I want to create a seasonal crop plan for my fields so that I know what to plant where and when | All Farmers | P0 | User can assign a crop to a field, set planting date, and view a visual calendar; plan saved to profile |
| CROP-03 | As a farmer, I want to see AI-suggested crop choices based on my region and soil type so that I plant what's most likely to succeed | All Farmers | P1 | AI suggests top 3 crops for the user's region and current season with reasoning |
| CROP-04 | As a farm manager, I want to allocate different plots to different crops with a visual field map so that land use is optimized | Farm Manager, Commercial Admin | P1 | Field map displays plot boundaries with assigned crops and acreage; drag-and-drop allocation |
| CROP-05 | As a farmer, I want to track crop-specific tips for my planted crops so that I have timely guidance throughout the growing season | All Farmers | P1 | Tips are triggered by growth stage; farmer receives in-app notification at each key stage |
| CROP-06 | As a cooperative leader, I want to see the crop plans of all my members so that I can coordinate group inputs and sales | Cooperative Leader | P2 | Cooperative dashboard aggregates member crop plans; shows totals by crop and season |

---

### 13.4 Farm Mapping

| ID | User Story | Role | Priority | Acceptance Criteria |
|---|---|---|---|---|
| MAP-01 | As a farmer, I want to draw my farm boundary on a map so that the platform knows my exact land layout | All Farmers | P1 | Map interface allows polygon drawing on satellite imagery; area auto-calculated in acres/hectares |
| MAP-02 | As a farm manager, I want to divide my farm into named plots and assign crops so that each section is independently tracked | Farm Manager, Commercial Admin | P1 | Plots can be subdivided within the farm boundary; each plot has a name, crop, and assigned team member |
| MAP-03 | As a farmer, I want to view my farm map offline so that I can reference it in the field without internet | All Farmers | P2 | Last-loaded farm map is cached and viewable without connectivity |

---

### 13.5 Task Management

| ID | User Story | Role | Priority | Acceptance Criteria |
|---|---|---|---|---|
| TASK-01 | As a farmer, I want to create farming tasks with due dates and priority levels so that I stay organized throughout the season | All Farmers | P0 | Task creation requires: title, due date; optional: description, priority (low/normal/high/urgent), category |
| TASK-02 | As a farmer, I want to see all my tasks in a calendar view so that I can plan my week at a glance | All Farmers | P0 | Calendar view shows tasks color-coded by priority; tapping a task opens detail view |
| TASK-03 | As a farm manager, I want to assign tasks to team members so that work is clearly delegated | Farm Manager, Commercial Admin | P1 | Task assignee field with team member selector; assigned tasks appear in assignee's task list |
| TASK-04 | As a farmer, I want tasks to be automatically created from AI diagnoses so that critical actions aren't missed | All Farmers | P1 | Diagnosis-created tasks are labeled "AI Generated" and auto-categorized as "crop_health" |
| TASK-05 | As a farmer, I want to mark tasks as complete and see my completion rate so that I can track my productivity | All Farmers | P1 | Completed tasks show timestamp; weekly and seasonal completion rate visible in task summary |

---

### 13.6 Livestock Management

| ID | User Story | Role | Priority | Acceptance Criteria |
|---|---|---|---|---|
| LIVE-01 | As a farmer, I want to record my animals by type and count so that I have a complete livestock inventory | All Farmers | P0 | Supports: cattle, goats, sheep, pigs, poultry, other; count per type; last updated timestamp |
| LIVE-02 | As a farmer, I want to log vaccinations and treatments for each animal so that I maintain accurate health records | All Farmers | P1 | Each animal or batch has a health log; records show: date, treatment, administered by |
| LIVE-03 | As a farmer, I want to receive alerts when animals are due for a scheduled vaccination so that I don't miss critical health interventions | All Farmers | P1 | Alert triggered 3 days before scheduled vaccination date; shown in notification panel |
| LIVE-04 | As a farmer, I want to track milk, egg, or meat production per animal or batch so that I can monitor productivity | All Farmers | P2 | Production log per animal type; weekly and monthly totals; trend chart |

---

### 13.7 Resource & Inventory

| ID | User Story | Role | Priority | Acceptance Criteria |
|---|---|---|---|---|
| INV-01 | As a farmer, I want to track my seeds, fertilizers, and chemicals in stock so that I don't run out at a critical time | All Farmers | P0 | Inventory items have: name, category, quantity, unit, reorder threshold |
| INV-02 | As a farmer, I want to receive a low-stock alert when an input falls below my reorder threshold so that I can restock in time | All Farmers | P1 | Alert appears in notification panel when quantity drops below threshold; links to Input Supply marketplace |
| INV-03 | As a farm manager, I want to log when inputs are used so that inventory counts stay accurate without manual stocktakes | Farm Manager, Commercial Admin | P1 | Usage log tied to a specific plot or task; quantity automatically deducted from inventory |

---

### 13.8 Market & Marketplace

| ID | User Story | Role | Priority | Acceptance Criteria |
|---|---|---|---|---|
| MKT-01 | As a farmer, I want to see today's prices for my crops in my region so that I know when and where to sell | All Farmers | P0 | Prices shown for at least 20 crops; updated daily; displayed in local currency (TZS); region filter |
| MKT-02 | As a farmer, I want to set a price alert for my crop so that I'm notified when the market price reaches my target | All Farmers | P1 | User sets target price; notification (in-app + SMS) sent when market price hits or exceeds target |
| MKT-03 | As a farmer, I want to list my produce for sale on the marketplace so that buyers can find and purchase it | All Farmers | P0 | Listing requires: crop, quantity, grade, asking price, location; optional: photo; listing live within 5 minutes |
| MKT-04 | As a buyer (agribusiness), I want to search and filter produce listings so that I can find the right product efficiently | Agribusiness | P0 | Search by crop, region, quantity range, price range; results sorted by relevance/price/distance |
| MKT-05 | As a farmer, I want to track the status of my orders from listing to payment so that I always know what's happening with my sales | All Farmers | P0 | Order statuses: listed → offer received → accepted → in transit → delivered → paid |
| MKT-06 | As a farmer, I want to order farming inputs from vetted suppliers so that I can get quality inputs delivered | All Farmers | P1 | Input marketplace shows supplier rating, price, delivery time; cart and checkout flow |
| MKT-07 | As a farmer, I want to enter a digital contract with a buyer so that my sale terms are legally clear and enforceable | All Farmers, Agribusiness | P1 | Contract includes: crop, quantity, price, delivery date, payment terms; both parties sign digitally |

---

### 13.9 Finance

| ID | User Story | Role | Priority | Acceptance Criteria |
|---|---|---|---|---|
| FIN-01 | As a farmer, I want to record my farm income and expenses so that I know if I'm making a profit | All Farmers | P0 | Income/expense entries require: date, amount, category, description; season-level P&L auto-calculated |
| FIN-02 | As a farmer, I want to make and receive payments via M-Pesa or Airtel Money so that I don't need to handle cash | All Farmers | P1 | Payment initiation shows confirmation dialog; transaction appears in history within 30s of confirmation |
| FIN-03 | As a farmer, I want to export my financial records as a PDF so that I can use them for a bank loan application | All Farmers | P1 | Export generates a branded PDF with: farm name, season, income/expense breakdown, net profit, signed by user |
| FIN-04 | As a farmer, I want to purchase crop or livestock insurance through the app so that I'm protected against loss | All Farmers | P1 | Insurance product listings show: coverage type, premium, payout conditions; payment via mobile money |
| FIN-05 | As a commercial farm admin, I want to manage a platform wallet for my business so that I can make bulk payments to farmers | Commercial Admin, Agribusiness | P1 | Wallet balance visible on dashboard; top-up and disbursement flows; transaction audit log |
| FIN-06 | As a farmer, I want to see a cash flow forecast for the coming season so that I can plan expenditure before revenue arrives | Farm Manager, Commercial Admin | P2 | Forecast uses: planned crop dates, historical yield, current input costs, current market prices |

---

### 13.10 Services

| ID | User Story | Role | Priority | Acceptance Criteria |
|---|---|---|---|---|
| SVC-01 | As a farmer, I want to book a session with an agronomist so that I can get expert advice on a complex problem | All Farmers | P1 | Booking shows: agronomist name, specialty, availability; confirmation sent via SMS |
| SVC-02 | As a farmer, I want to request a soil test kit and receive interpreted results so that I fertilize based on actual soil data | All Farmers | P1 | Kit request triggers delivery workflow; results returned in app with recommended fertilizer prescription |
| SVC-03 | As a farmer, I want to see a 7-day weather forecast for my farm location so that I can plan field activities accordingly | All Farmers | P0 | Forecast shows: temperature, rainfall probability, humidity, wind; planting suitability score per day |
| SVC-04 | As a farmer, I want to receive a severe weather SMS alert so that I can protect my crops and livestock even without internet | All Farmers | P1 | SMS dispatched when forecast shows rainfall > threshold or temperature extreme; uses registered phone number |
| SVC-05 | As a commercial farm admin, I want to generate a verified Agro ID for my farm so that I can present it to banks and buyers as proof of operation | Commercial Farm Admin | P1 | Agro ID card shows: farmer name, farm size, crop types, unique ID, issue date; downloadable as PDF |

---

### 13.11 Analytics & Reporting

| ID | User Story | Role | Priority | Acceptance Criteria |
|---|---|---|---|---|
| ANA-01 | As a farm manager, I want to see a dashboard of my farm's key performance indicators so that I can monitor the season at a glance | Farm Manager, Commercial Admin | P1 | KPIs shown: yield vs. target, cost vs. budget, revenue to date, task completion rate |
| ANA-02 | As a cooperative leader, I want to see aggregated performance across all my member farms so that I can identify who needs support | Cooperative Leader, Extension Officer | P1 | Cooperative dashboard shows member-level breakdown; sortable by yield, income, and task completion |
| ANA-03 | As a farm manager, I want to generate a season-end report so that I can document my results for funders and planning purposes | Farm Manager, Commercial Admin | P1 | Report auto-generated at season end; covers yield, revenue, expenses, ROI; exportable as PDF |
| ANA-04 | As a commercial farm admin, I want to see predictive price models for my crops so that I time my sales for maximum profit | Commercial Admin, Agribusiness | P2 | Price forecast chart shows projected price curve for 30/60/90 days; based on historical data and market signals |

---

### 13.12 Learning & Community

| ID | User Story | Role | Priority | Acceptance Criteria |
|---|---|---|---|---|
| LRN-01 | As a farmer, I want to watch short how-to videos in Swahili so that I can learn new techniques without reading long guides | All Farmers | P1 | Video library has at least 20 videos at launch; categorized by topic; each under 5 minutes |
| LRN-02 | As a farmer, I want to search a knowledge base for information about crop diseases so that I can self-diagnose common problems | All Farmers | P1 | Search returns results within 2s; articles include photos, symptoms, and treatment |
| LRN-03 | As a farmer, I want to post questions in a discussion group and get answers from peers so that I learn from others in my region | All Farmers | P1 | Posts are visible to all group members; threaded replies; moderation tools for cooperative leaders and extension officers |
| LRN-04 | As a cooperative leader, I want to share resources with my members via the community feature so that everyone benefits from the same information | Cooperative Leader | P2 | Leader can pin posts and share files (PDF, image) within the cooperative group |
| LRN-05 | As a farmer, I want to submit a support ticket and track its status so that my problems get resolved without repeated follow-up | All | P1 | Ticket creation requires: category, description; status updates visible in-app; SMS confirmation on submission |

---

### 13.13 Gamification & Engagement

| ID | User Story | Role | Priority | Acceptance Criteria |
|---|---|---|---|---|
| GAM-01 | As a farmer, I want to earn points for completing tasks and using AI features so that I'm motivated to stay active on the platform | All Farmers | P2 | Points awarded for: task completion, diagnosis run, marketplace listing, daily login; total visible on profile |
| GAM-02 | As a farmer, I want to earn badges for milestones so that I feel recognized for my progress | All Farmers | P2 | Badges for: first diagnosis, 10 tasks completed, first sale, 30-day streak |
| GAM-03 | As a farmer, I want to see a regional leaderboard so that I can compare my engagement with other farmers in my area | All Farmers | P2 | Leaderboard shows top 10 farmers in the user's region by points; privacy option to hide from leaderboard |

---

### 13.14 Offline & Connectivity

| ID | User Story | Role | Priority | Acceptance Criteria |
|---|---|---|---|---|
| OFF-01 | As a farmer in a low-connectivity area, I want to see a clear indicator when I'm offline so that I understand why data isn't loading | All | P0 | Offline banner appears at top of screen within 3s of connectivity loss; disappears automatically on reconnect |
| OFF-02 | As a farmer, I want to capture a crop photo offline and have it automatically submitted when I reconnect so that I don't miss a diagnosis | All Farmers | P1 | Offline captures stored locally; upload queued and auto-submitted on next connection; user notified on success |
| OFF-03 | As a farmer with a basic phone, I want to access critical information via SMS/USSD so that I'm not excluded due to smartphone limitations | All | P2 | USSD interface provides: market prices, weather summary, and task reminders via feature phone codes |

---

## 14. Feature Specification Details

### 14.1 Photo Crop Diagnosis — Detailed Flow

```
1. User taps "Scan Crop" (FAB or nav)
2. Camera opens OR gallery picker shown
3. User captures/selects image
4. Image uploaded to API endpoint: POST /diagnosis/analyze
5. Payload: { userId, imageData (base64), language }
6. API returns:
   {
     success: true,
     disease: "Maize Streak Virus",
     confidence: 0.87,
     severity: "high",          // low | medium | high | critical
     remedy: "Apply imidacloprid...",
     nearbyDealers: [{ name, distance, phone }]
   }
7. Result screen shows diagnosis card
8. If severity = high/critical:
   a. Confirm dialog: "Create treatment task?"
   b. If yes → POST /tasks/create with auto-populated fields
   c. If severity = critical → POST /notifications/send-sms
9. User can share result or navigate to treatment guide
```

**Error states:**
- No image detected → "Tafadhali piga picha ya mmea" (Please take a plant photo)
- Low confidence (< 50%) → Show result with warning: "Confidence low — consult an expert"
- API timeout → Show retry with offline queue option

---

### 14.2 Role-Based Navigation — Feature Unlock Logic

Each navigation item is mapped to a `FeatureId`. On session restore:

1. `userRole` loaded from session/localStorage
2. `ROLE_FEATURES[userRole]` returns the allowed `FeatureId[]`
3. Navigation items filtered to only show allowed features
4. Attempting to access a locked feature redirects to an upgrade prompt

**Tier upgrades** additionally unlock:
- `free → basic`: expanded crop planning, task management, marketplace listings
- `basic → premium`: analytics, predictive models, digital twin, expert consultations
- `premium → enterprise`: wallet admin, institutional dashboard, full reporting suite, API access

---

### 14.3 Market Price Alert — Detailed Flow

```
1. User views Market Prices screen
2. Taps "Set Alert" on a crop
3. Sets target price in TZS
4. Alert stored server-side: { userId, crop, targetPrice, direction: "above" }
5. Background job checks live prices every hour
6. When market price >= targetPrice:
   a. In-app notification dispatched
   b. SMS dispatched: "Bei ya [crop] imefika TZS [price]. Uza sasa! - KILIMO"
7. Alert auto-deactivates after trigger (user can re-enable)
```

---

### 14.4 Contract Farming — Contract Lifecycle

| Stage | Actor | Action |
|---|---|---|
| **Draft** | Farmer or Buyer | Creates contract with terms |
| **Sent** | Farmer or Buyer | Shares contract link with counterparty |
| **Under Review** | Counterparty | Reviews terms, may request amendments |
| **Signed** | Both parties | Digital signature captured (name + timestamp) |
| **Active** | System | Contract milestone dates tracked |
| **Milestone Due** | System | Both parties notified of delivery/payment milestone |
| **Completed** | Both parties | Delivery confirmed, payment released |
| **Disputed** | Either party | Escalated to platform support |

---

### 14.5 Subscription Tier Feature Gates

| Feature | Free | Basic | Premium | Enterprise |
|---|:---:|:---:|:---:|:---:|
| AI Chat (Sankofa) | 5/day | 20/day | Unlimited | Unlimited |
| Photo Diagnosis | 3/month | 10/month | Unlimited | Unlimited |
| Marketplace Listings | 2 active | 10 active | Unlimited | Unlimited |
| Task Management | ✓ | ✓ | ✓ | ✓ |
| Crop Planning | Basic | Full | Full + AI | Full + AI |
| Analytics Dashboard | — | — | ✓ | ✓ |
| Predictive Models | — | — | ✓ | ✓ |
| Digital Farm Twin | — | — | — | ✓ |
| Expert Consultations | — | 1/month | 3/month | Unlimited |
| Wallet Admin | — | — | — | ✓ |
| API Access | — | — | — | ✓ |
| Priority Support | — | — | ✓ | ✓ |

---

### 14.6 Notification Delivery Matrix

| Event | In-App | Push (PWA) | SMS |
|---|:---:|:---:|:---:|
| OTP Verification | — | — | ✓ |
| Critical Crop Diagnosis | ✓ | ✓ | ✓ |
| High-Severity Diagnosis | ✓ | ✓ | — |
| Price Alert Triggered | ✓ | ✓ | ✓ |
| Severe Weather Warning | ✓ | ✓ | ✓ |
| Task Due Tomorrow | ✓ | ✓ | — |
| New Marketplace Offer | ✓ | ✓ | — |
| Livestock Vaccination Due | ✓ | ✓ | — |
| Contract Signed | ✓ | ✓ | ✓ |
| Payment Received | ✓ | ✓ | ✓ |
| Low Stock Alert | ✓ | — | — |
| Support Ticket Update | ✓ | — | ✓ |
| Session Expiry Warning | ✓ | — | — |

---

### 14.7 Creova Agro ID — Data Model

```
AgroID {
  id:           UUID (unique, public-facing)
  farmerName:   string
  phoneNumber:  string (masked for sharing: +255 7XX XXX XXX)
  region:       string
  farmSize:     number (acres)
  crops:        string[]
  livestock:    { type: string; count: number }[]
  memberSince:  date
  verifiedAt:   date | null
  tier:         "free" | "basic" | "premium" | "enterprise"
  transactionCount: number
  totalSalesValue:  number (TZS)
  certifications:   string[]
  qrCode:       string (URL to public profile)
}
```

The Agro ID QR code links to a publicly accessible (no login required) profile page, allowing banks, buyers, and insurers to verify identity without platform access.

---

*End of PRD v1.0 — User Stories & Feature Specifications appended May 2026*
