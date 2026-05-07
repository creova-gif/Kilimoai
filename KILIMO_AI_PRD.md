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
