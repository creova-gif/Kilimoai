# Kilimo AI — UI/UX & Code Audit

_Last updated: 2026-06-27 · Multi-disciplinary audit (UI/UX, full-stack, accessibility, gamification, ML/AI)_

## 1. Executive Summary

Kilimo AI is a **single-target Expo / React Native app** (SDK 54, React 19, `expo-router` v6),
not the dual Vite/PWA setup described in the previous version of this document. Animations use
`react-native-reanimated` v4 (with a local `motion/react` shim aliased in `tsconfig.json`).
State is managed with `zustand`; data services target Supabase with graceful offline/seed fallbacks.

The app is **largely feature-complete and compiles cleanly**. This pass fixed all blocking
lint errors, eliminated every "coming soon" stub, and implemented two genuinely missing features.

## 2. Stack (verified)

| Area | Implementation |
| :--- | :--- |
| Framework | Expo SDK 54, React Native 0.81, React 19 |
| Navigation | `expo-router` v6 (file-based, `app/`) |
| Animation | `react-native-reanimated` v4 (`motion` shim in `shims/motion`) |
| State | `zustand` (`store/`) |
| Data | `@supabase/supabase-js` + offline queue / seed fallbacks |
| AI | `@google/generative-ai` (Gemini) via `lib/ai*.ts` |
| Maps | `react-native-maps` (`.native`/`.web` wrappers) |
| i18n | In-app `language` flag (`sw`/`en`) threaded through screens |

## 3. Fixed in this pass

### 3.1 Tooling
- **ESLint was completely broken** — `eslint.config.mjs` used legacy `module.exports` in an
  ESM file under ESLint 10 (flat-config only). Rewritten as a proper flat config. Lint runs again.

### 3.2 Correctness (20 ESLint errors → 0; `tsc --noEmit` clean)
- 10 × ternary-as-statement (`cond ? a() : b()`) converted to `if/else`.
- 4 × dead initializers removed (`no-useless-assignment`).
- 3 × empty `catch {}` blocks documented.
- 3 × rethrows now preserve the original error via `{ cause }`.

### 3.3 Missing features implemented
- **`lib/diseaseDetector.ts`** — *Common Rust* for maize was scored (`rustScore`) but **never
  surfaced** in results. Added the full bilingual disease entry (organic + chemical control,
  region-risk weighting), so the symptom checker now reports it.
- **`app/contracts/[id].tsx`** — replaced 3 "coming soon" `Alert` stubs:
  - **QR verification**: real `react-native-qrcode-svg` modal encoding contract terms
    (`id, crop, qty, price, total, buyer, status, signature flags`) as a `kilimo.ai/verify` link.
  - **Share**: native `Share` sheet with a bilingual contract summary (iOS includes the verify URL).
- **`app/scan.tsx`** — the scanning "laser" was a **static** `Animated.View` (`/* Reanimated Todo */`).
  Implemented a driven sweep (`useSharedValue` + `withRepeat`/`withTiming`) active during `SCANNING`,
  and gave the camera/header entrance animations.

## 4. Recommendations (not yet actioned — backlog)

| Priority | Finding | Notes |
| :--- | :--- | :--- |
| High | **Offline image dependency** | 6 screens load hero images from `images.unsplash.com`. For rural/low-connectivity users these fail silently. Bundle local assets or add cached placeholders. |
| Medium | **Accessibility coverage** | ~27% of `TouchableOpacity` (256/936) carry `accessibilityLabel`. Icon-only buttons are the priority gap; content rows are mostly covered by child `Text`. |
| Medium | **Test harness** | `jest.config.js` references `jest-expo` (not installed) and there are **no test files**. Install `jest-expo` and add smoke tests for stores/`diseaseDetector`. |
| Low | **Lint warnings (8.3k)** | Almost entirely Prettier formatting + stray `console.log`. Run `eslint --fix` in a dedicated formatting-only commit to avoid mixing churn with logic changes. |

## 5. Verification

```
npx tsc --noEmit      # exit 0
npx eslint .          # 0 errors (warnings are formatting/console only)
```
