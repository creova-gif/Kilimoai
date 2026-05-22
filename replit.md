# KILIMO AI

## Overview
KILIMO AI is a Swahili-language agriculture app built with Expo (React Native). It provides AI-powered farming insights, crop diagnosis, market prices, contract farming, and more for Tanzanian farmers. The app uses Zustand + AsyncStorage for state and Supabase as the cloud backend.

## Tech Stack
- **Framework**: Expo SDK 54, expo-router (file-based routing)
- **UI**: React Native, motion/react (animations), expo-blur, expo-linear-gradient
- **Icons**: lucide-react-native
- **State**: Zustand + AsyncStorage (persisted)
- **Backend**: Supabase (Edge Functions for AI proxy; PostgREST for data)
- **Dev server**: `npx expo start --web --port 5000`

## Project Structure
- `app/` — expo-router screens
  - `app/(tabs)/` — bottom tab screens (index/home, forecast, profile)
  - `app/contracts/` — contract farming list + detail
  - `app/farm-twin/` — Digital Farm Twin simulator
  - `app/analytics/` — predictive analytics dashboard
  - `app/wallet-admin/` — wallet & payout admin
- `components/` — shared UI (PageScaffold, GlassCard, etc.)
- `constants/` — Theme (useTheme hook), colors
- `lib/` — business logic
  - `lib/access.tsx` — RBAC (Gate component, useAccess/useCan hooks, full feature matrix)
  - `lib/pdf/pnl.ts` — branded P&L PDF export via expo-print
  - `lib/sms/index.ts` — SMS adapter (stub in Phase 1; wire AT creds for Phase 2)
  - `lib/analytics/predictions.ts` — client-side yield/pest/price models
  - `lib/farmtwin/model.ts` — parametric yield/revenue model
  - `lib/supabase.ts` — Supabase client
- `store/` — Zustand stores
  - `useKilimoStore.ts` — main store (agroId, notifications, wallet, farmVitals, tasks)
  - `useContractsStore.ts` — contract lifecycle state machine
  - `useDigitalFarmTwinStore.ts` — farm twin scenarios
  - `useWalletAdminStore.ts` — wallet admin payouts/transactions
- `hooks/` — custom hooks (useWeather, useTasks, etc.)

## Feature Screens (all routable, all buttons wired)
| Route | Feature |
|---|---|
| `/(tabs)` | Home dashboard — quick actions, activities, AI recommendations |
| `/(tabs)/forecast` | Weather forecast — OpenWeather integration |
| `/(tabs)/profile` | Profile — settings, logout, all section links |
| `/sankofa` | AI Chat (Sankofa) — LLM via Supabase Edge Function |
| `/scan` | Crop diagnosis — OpenAI Vision; critical → auto-task + SMS |
| `/map` | Farm map — GPS, layer cycles, NDVI/moisture/standard |
| `/market` | Market prices — search, category filter, buy/escrow/contract |
| `/tasks` | Task manager — create modal, priority/status filters |
| `/notifications` | Notifications — delete, mark read, clear all |
| `/contracts` | Contract farming list — filter by status |
| `/contracts/[id]` | Contract detail — full lifecycle transitions, milestone payments |
| `/farm-twin` | Digital Farm Twin — scenario list, create/duplicate/delete |
| `/farm-twin/[id]` | What-if simulator — stepper inputs, yield/cost/risk model |
| `/analytics` | Predictive analytics — yield forecast, pest risk, price trends |
| `/wallet-admin` | Wallet admin — balance, quick actions |
| `/wallet-admin/transactions` | Transaction ledger — filter by type |
| `/wallet-admin/payouts` | Payout approvals — approve/reject/settle with receipts |
| `/agro-id` | Agro ID — identity card, P&L PDF export |
| `/edit-profile` | Edit profile — role, region, crops, language |
| `/livestock` | Livestock tracker — RBAC gated |
| `/inventory` | Inventory manager — qty adjust, low-stock alerts |
| `/insurance` | Insurance hub — enroll/claim flows |
| `/input-supply` | Input supply — order flow, delivery tracking |
| `/peer-groups` | Peer groups — join, post, group chat |
| `/consultations` | Expert consultations — chat/video request |

## Role-Based Access Control
`lib/access.tsx` implements the full PRD feature matrix for 8 roles:
`smallholder`, `farmer`, `commercial_farmer`, `farm_manager`, `commercial_admin`, `agribusiness`, `coop_leader`, `extension_officer`

Each feature has `'full' | 'basic' | 'none'` per role. Use:
- `<Gate feature="livestock">` — hides children if role has no access
- `useAccess('feature')` — returns AccessLevel
- `useCan('feature')` — returns boolean (full OR basic)

## Notification Delivery Matrix
All events route through `lib/sms/index.ts`:
- In-app: always fires via `useKilimoStore.addNotification()`
- SMS: stubbed (no-op until Phase 2 secrets provided); mirrors to in-app so visible in dev

## Development
- **Start**: `npx expo start --web --port 5000` (workflow: "Start application")
- **Colors**: always use `colors.background` (NOT `colors.bg`), `colors.card`, `colors.text`, `colors.textMute`, `colors.border`, `colors.primary` from `useTheme()`
- **File system**: `import * as FileSystem from 'expo-file-system/legacy'`

## Pending (need user-supplied credentials)
- T204 Africa's Talking SMS — needs `AT_USERNAME`, `AT_API_KEY`, `AT_SENDER_ID` secrets
- T205 Safaricom Daraja M-Pesa — needs `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE`, `MPESA_PASSKEY`, `MPESA_ENV` secrets

## Out of scope (deferred)
- True server-side ML models (current analytics are client-side statistical models)
- Digital Farm Twin multi-season historical replay
- Supabase real-time sync (currently local Zustand state)
