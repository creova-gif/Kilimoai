# KILIMO AI

## Overview
KILIMO AI is a Swahili-language agriculture app built with React + TypeScript + Vite. It provides AI-powered farming insights, crop diagnosis, market prices, and more for farmers. The app uses Supabase as its backend.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite 6
- **Styling**: Tailwind CSS v4 (pre-compiled CSS), Radix UI components
- **Backend**: Supabase (external, hosted)
- **State Management**: React hooks
- **UI Libraries**: Radix UI, Lucide icons, Framer Motion, Recharts, Sonner (toasts)

## Project Structure
- `/src` - Main source code
  - `/src/components` - React components (auth, dashboard, AI features, etc.)
  - `/src/utils` - Utility functions (Supabase client, analytics, crash reporting)
  - `/src/hooks` - Custom React hooks
  - `/src/assets` - Image assets
  - `/src/index.css` - Pre-compiled Tailwind CSS
- `/index.html` - Entry HTML file
- `/vite.config.ts` - Vite configuration (port 5000, host 0.0.0.0)
- `/tsconfig.json` - TypeScript configuration
- `/package.json` - Dependencies and scripts

## Development
- **Dev server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build` (outputs to `/build`)

## Deployment
- **Web**: Static deployment with build output in `/build` directory.
- **Mobile (Android/iOS)**: 
  - Preview build (APK): `cd mobile && npm run build:preview`
  - Production build: `cd mobile && npm run build:production`
  - Custom build: `./mobile/scripts/build.sh [platform] [profile]`

## Recent Changes
- 2026-05-22: Digital Farm Twin + Predictive ML Analytics
  - `lib/farmtwin/model.ts` — parametric yield/revenue model; 7 crops (Mahindi, Mpunga, Maharagwe, Kahawa, Nyanya, Mihogo, Alizeti), 4 soil types, 5 input factors (soil health, rainfall, fertilizer, irrigation, planting density); Swahili advisory generator; `compareScenarios()` utility
  - `store/useDigitalFarmTwinStore.ts` — persisted scenario store; create/rename/duplicate/delete; 2 seed scenarios; capped at 6
  - `app/farm-twin/index.tsx` — scenario list with comparative mini-bar charts (yield, profit, risk), create-modal, duplicate/delete actions; RBAC gated (farm_manager/commercial_admin=full, commercial_farmer=basic)
  - `app/farm-twin/[id].tsx` — live what-if simulator; stepper inputs; real-time model output; cost breakdown bars, risk gauge (drought/pest/market), Swahili advisory tips; save back to store
  - `lib/analytics/predictions.ts` — three client-side statistical models: (1) YieldForecast via exponential smoothing + seasonal EAfrica calendar, (2) PestRisk via weighted moisture×temp×crop-sensitivity threshold model, (3) PriceTrend via OLS linear regression on 6-month farmgate price series
  - `app/analytics/index.tsx` — predictive dashboard; yield forecast card (current vs predicted, confidence badge, % change), pest risk gauge with Swahili drivers + recommendations, per-crop price trend bars with sell signal (Uza sasa/Subiri/Hifadhi); RBAC gated (all manager/farmer/agribusiness/extension roles)
  - Profile quick-access wired for both new routes (Shamba Dijiti + Uchanganuzi wa AI)
- 2026-05-22: Wallet Admin module (COMPLETE)
  - `store/useWalletAdminStore.ts`, `app/wallet-admin/{_layout,index,transactions,payouts}.tsx`
  - Role-gated, SMS+notification side-effects on all payout actions, balance integrity check in markSettled
- 2026-05-22: Phase 2 AI integrations (T201–T203, T206)
  - Supabase Edge Function `openai-proxy` (chat/vision/transcribe actions, JWT-verified, server-enforced SANKOFA_SYSTEM)
  - Sankofa chat wired to real LLM with request sequence guarding + 16-msg history
  - Crop diagnosis wired to OpenAI Vision via `expo-image-picker` + base64 upload; severity normalized; critical results auto-create task + notification
  - Voice mode wired to Whisper STT via `expo-audio` recorder; shared concurrency guard with text path; in-flight cancellation on voice-mode exit
  - OpenWeather integration for weather screens
  - Validation errors surface verbatim Swahili messages instead of generic fallback
- 2026-02-18: Initial Replit setup
  - Fixed package.json (removed invalid Node.js built-in packages)
  - Configured Vite for Replit (port 5000, host 0.0.0.0, allowedHosts)
  - Added root-level tsconfig.json with relaxed settings
  - Renamed crash-reporting.ts to .tsx (contained JSX)
  - Set up deployment configuration

## Pending (need user-supplied credentials)
- T204 Africa's Talking SMS — needs `AT_USERNAME`, `AT_API_KEY`, `AT_SENDER_ID`
- T205 Safaricom Daraja M-Pesa — needs `MPESA_CONSUMER_KEY/SECRET/SHORTCODE/PASSKEY/ENV`

## Out of scope (deferred)
- True server-side ML models (current analytics are client-side statistical models)
- Digital Farm Twin multi-season historical replay
