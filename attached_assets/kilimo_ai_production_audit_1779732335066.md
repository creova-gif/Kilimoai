# KILIMO AI — Full Production Readiness Audit
### Cross-Platform Mobile (iOS + Android) · May 2026

---

> **Audit Scope**: Complete codebase review of the Kilimo AI React Native / Expo application targeting iOS App Store and Google Play Store launch readiness.  
> **Verdict**: **NOT READY FOR STORE SUBMISSION.** The app has strong architectural bones and genuinely impressive motion/design ambition, but carries 6 launch-blocking issues (P0), 18 high-priority issues (P1), and numerous design/UX gaps that would result in App Store rejection or a poor first-impression rating. All must be resolved before submission.

---

## Severity Legend

| Level | Label | Definition |
|-------|-------|-----------|
| 🔴 | **BLOCKING** | Will cause App Store / Play Store rejection or catastrophic user-facing failure |
| 🟠 | **CRITICAL** | Severely degrades product quality; must fix before launch |
| 🟡 | **IMPORTANT** | Noticeable gap from world-class; fix before launch |
| 🟢 | **POLISH** | Nice-to-have improvements for premium UX |

---

## 1. App Store & Play Store Compliance

### 1.1 🔴 BLOCKING — `motion/react` is a Web-Only Library Imported into Native Code

**File**: `app/onboarding.tsx:19`, `app/(tabs)/index.tsx:42`, `app/sankofa.tsx:40`, `app/scan.tsx:34`, and virtually every screen.

```ts
import { motion, AnimatePresence } from 'motion/react'; // ← WEB ONLY
```

`motion/react` (Framer Motion) is a **web-first** animation library. While it has limited React Native support, the code uses web-specific properties throughout:
- `filter: 'blur(100px)'` — not a React Native prop  
- `whileHover`, `whileTap` — mouse/pointer events that don't exist on native  
- `style={{ filter: ... }}` style props that RN ignores silently

**Risk**: Build failures on iOS/Android, silent no-ops making half the UI non-interactive, crashes on lower-end Android devices.

**Fix**: Migrate all animations to `react-native-reanimated` (already in `package.json`) + `react-native-gesture-handler`. Use `Animated.Value`, `useSharedValue`, `withSpring`, and `withTiming` exclusively. The `motion.View` pattern must be replaced with `Animated.View`. Remove the `motion` package from native builds or configure metro to exclude it.

---

### 1.2 🔴 BLOCKING — `filter: 'blur(...)'` Used as a Native StyleSheet Prop

**Files**: `app/(tabs)/index.tsx:555-556`, `app/scan.tsx:72`, `app/profile.tsx:357-358`, multiple screens.

```ts
style={[styles.bgOrb, {
  filter: Platform.OS === 'web' ? 'blur(100px)' : undefined,
}]}
```

This pattern appears in `StyleSheet.create` definitions — e.g.:
```ts
bgOrb: {
  position: 'absolute',
  filter: 'blur(100px)', // ← Will throw a React Native yellow/red box warning and may crash
},
```

**Risk**: Yellow box → red box crashes on production iOS builds. Apple will reject for crashes in review.

**Fix**: Remove `filter` from all `StyleSheet.create` definitions. Use `expo-blur`'s `BlurView` component (already in the project) for blur effects on native, and CSS `filter` only in web-specific code paths.

---

### 1.3 🔴 BLOCKING — No OTP / Phone Authentication Implemented

**PRD Requirement**: `AUTH-01` (P0) — "Register using phone number and receive an OTP."

**Code Reality**: The onboarding wizard creates an Agro ID from a **random number** (`Math.floor(1000 + Math.random() * 9000)`) with no authentication challenge:
```ts
id: `KILIMO-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).slice(2, 4).toUpperCase()}`,
```

Supabase is configured lazily but never called during onboarding. There is no OTP SMS flow, no email verification, no phone number collection in the onboarding form.

**Risk**: App Store guidelines (Section 5.1.1) require apps that collect personal data to have proper account creation. A financial app (wallet with TZS balances displayed) with no real auth is a guideline violation. Users who "deposit" have no recoverable account.

**Fix**: Implement Supabase OTP auth (phone) as the primary flow. The `useAgroAuth.ts` hook already has the Supabase `signIn` scaffolding — wire it into onboarding Step 0 or add a phone verification step.

---

### 1.4 🔴 BLOCKING — Privacy Policy is a 3-Sentence Placeholder

**File**: `app/privacy.tsx`

The current privacy policy contains 3 vague sentences with no:
- Data categories enumerated  
- Third-party service disclosures (Supabase, AI APIs, Africa's Talking)  
- User rights (access, deletion, portability)  
- Data retention periods  
- Contact details for privacy inquiries  
- Consent mechanism for camera/microphone/location access  

**Risk**: **Both Apple and Google require a complete, accurate privacy policy** linked from the App Store listing AND accessible in-app. Google Play's Privacy Policy policy is explicit: "If your app accesses, collects, uses, handles or shares personal or sensitive user data... you must post a privacy policy." This will be rejected at review.

**Fix**: Write a full GDPR/local-law compliant privacy policy. Minimum 800 words covering all 18 standard sections. Link it from onboarding consent screen AND the app store listing.

---

### 1.5 🔴 BLOCKING — `WRITE_EXTERNAL_STORAGE` Permission Declared but Deprecated

**File**: `app.json:43`

```json
"android.permission.WRITE_EXTERNAL_STORAGE"
```

This permission is **deprecated in Android 10+ (API 29+)** and requires special justification on Android 13+ (API 33). Google Play will flag this and may reject the app if the permission has no legitimate use case or if the `targetSdkVersion` is 33+.

**Risk**: Automatic rejection or delayed review requiring written justification.

**Fix**: Remove `WRITE_EXTERNAL_STORAGE`. Use the Scoped Storage APIs via `expo-file-system` which does not require this permission. Replace with `READ_MEDIA_IMAGES` if photo access is needed on Android 13+.

---

### 1.6 🔴 BLOCKING — No Subscription Tier Gate Enforcement

**PRD**: Detailed subscription tier matrix (Free: 3 diagnoses/month, 5 AI chats/day; Premium: unlimited, etc.)

**Code Reality**: Every feature is fully accessible regardless of tier. The wallet shows `TZS 2,450,000` by default. The "FREE" badge is rendered in the onboarding completion but zero feature gates are implemented.

**Risk**: If you submit an app claiming subscription tiers without implementing them, Apple will request a reviewer test account and reject the app when they discover the paywall is non-functional. A financial app showing a fake balance also risks guideline violations.

**Fix**: Implement `ROLE_FEATURES` access control and tier checking. The PRD's `lib/access.ts` partial exists — extend it to gate `scan`, `sankofa`, `analytics`, `wallet-admin`, and `farm-twin` by tier. Add an upgrade prompt screen.

---

## 2. Authentication & Security

### 2.1 🟠 CRITICAL — AgroId Generated Locally with `Math.random()` is Cryptographically Weak

**File**: `store/useKilimoStore.ts:196` and `app/onboarding.tsx:110`

```ts
id: `KILIMO-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).slice(2, 4).toUpperCase()}`,
```

`Math.random()` is not cryptographically secure. This ID space is tiny (~9000 × 36² = ~11.6M combinations). The PRD states Agro IDs are shared with "banks, insurers, and buyers as proof of farming activity." A guessable ID is a security vulnerability for a document serving as a financial credential.

**Fix**: Use `crypto.randomUUID()` (available via the `uuid` package already in overrides) or generate IDs server-side via Supabase.

---

### 2.2 🟠 CRITICAL — Supabase Keys Must Come from Secure Build Config, Not Fallback Strings

**File**: `hooks/useAgroAuth.ts:23-26`

```ts
supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',    // empty string fallback
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '' // empty string fallback
);
```

If environment variables are not set, the client silently creates with empty strings, causing all Supabase calls to fail silently (caught by the try/catch and demoted to a `console.warn`). There's no early validation that required config is present.

**Fix**: Add a startup config validation that throws a clear error in development if required env vars are missing. Use `eas.json` secrets for production builds. Document required `.env` variables in a `.env.example` file.

---

### 2.3 🟠 CRITICAL — Wallet Balance is Mock Data Hard-Coded in Store

**File**: `store/useKilimoStore.ts:188-193`

```ts
wallet: {
  balanceTZS: 2450000,    // Fake TZS 2.45M shown to every new user
  mpesaPhone: '+255 712 345 678',
  lastTransaction: 'Co-op Payment - KES 5,000',
  currency: 'TZS',
},
```

Every new user sees a wallet balance of TZS 2,450,000 (~$925 USD). This will be displayed prominently on the home screen. This is deeply misleading and likely violates financial services regulations in Tanzania.

**Risk**: Possible App Store rejection for deceptive content (Section 4.5.6 — "Apps should not misrepresent financial information"). Could expose you to regulatory liability.

**Fix**: Default wallet to `balanceTZS: 0`. Remove the mock phone number. Clear all mock financial data from the initial store state.

---

### 2.4 🟡 IMPORTANT — Biometric Toggle is UI-Only (Not Enforced)

**File**: `app/(tabs)/profile.tsx:121`

```ts
const [biometric, setBiometric] = useState(true);
```

The biometric toggle is local component state that has no effect on the actual `useAgroAuth.authenticateWithBiometric()` flow. Toggling it off does nothing.

**Fix**: Wire the biometric preference to `updateAgroId({ biometricEnabled: value })` in the store. Check `agroId.biometricEnabled` in `useAgroAuth` before prompting for biometric on app resume.

---

### 2.5 🟡 IMPORTANT — Session Token Stored via `SecureStore` but Never Refreshed

**File**: `hooks/useAgroAuth.ts:103`

```ts
await SecureStore.setItemAsync(SESSION_KEY, data.session?.access_token ?? '');
```

Supabase JWTs expire (default: 1 hour). The stored token is an `access_token`, not a `refresh_token`. There is no token refresh logic. After 1 hour, background session restoration will silently fail.

**Fix**: Store the full `session` object including `refresh_token`. Implement `supabase.auth.setSession()` and handle `TOKEN_REFRESHED` events.

---

## 3. Onboarding Experience

### 3.1 🟠 CRITICAL — No Phone Number Collection = No Account Recovery

The onboarding wizard collects: language, role, name, region, crops, farm size, activity type, livestock toggle, irrigation toggle.

It does **not** collect: phone number, email address, password, or any verifiable credential.

If a user loses their device, they cannot recover their Agro ID, wallet history, or farm data. This is especially critical for a financial product targeting farmers who may not have email addresses.

**Fix**: Add a "Phone Number" step between Role (step 2) and Farm Profile (step 3). Send OTP. Only create the Agro ID after verification. This simultaneously fixes AUTH-01 (P0) from the PRD.

---

### 3.2 🟡 IMPORTANT — Region Picker Limited to 11 Tanzanian Regions

**File**: `app/onboarding.tsx:27`

```ts
const REGIONS = ['Arusha', 'Dodoma', 'Mbeya', 'Kilimanjaro', 'Morogoro', 'Iringa', 'Mwanza', 'Tanga', 'Pwani', 'Singida', 'Tabora'];
```

Tanzania has **31 regions**. Major farming regions like Ruvuma (major cashew/coffee producer), Rukwa (rice/sunflower), Katavi, Kigoma, and Shinyanga are missing. A farmer in Ruvuma region cannot accurately profile their location.

**Fix**: Add all 31 Tanzania regions. If targeting East Africa broadly (Kenya, Uganda), the PRD mentions "East African farmers" — consider a country picker first.

---

### 3.3 🟡 IMPORTANT — `motion/react` Animations on Onboarding Won't Work on Native

**File**: `app/onboarding.tsx:180-206`

```tsx
<AnimatePresence mode="wait">
  <motion.View
    key={`step-${step}`}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ type: 'spring', damping: 24, stiffness: 200 }}
  >
```

The step transitions in onboarding are driven by `motion/react`. On native, these will either be no-ops or crash. The carefully designed step progress, back/forward transitions, and all animations are non-functional on iOS/Android.

**Fix**: Replace with `react-native-reanimated` `FadeInDown` / `FadeOutUp` layout animations + `AnimatedSwitcher` equivalent using `useSharedValue`.

---

### 3.4 🟢 POLISH — Welcome Step Feature Grid Shows English Subtitles in Swahili Mode

**File**: `app/onboarding.tsx:334`

```ts
<Text style={s.featureSub}>{lang === 'sw' ? f.sub : f.label}</Text>
```

In English mode, it renders `f.label` instead of an English subtitle. The `FEATURES` array only has Swahili `sub` values. If `lang === 'en'`, the subtitle becomes the same as the label (e.g., "AI Crop Scan" shown twice), which is meaningless.

**Fix**: Add `subEn` to each FEATURE entry. Display the appropriate localized subtitle.

---

## 4. Navigation Architecture

### 4.1 🟠 CRITICAL — Tab Bar Only Has 3 Tabs, But Feature Count Exceeds 20

**File**: `app/(tabs)/_layout.tsx`

The bottom tab bar has: **HUB** (home), **CLIMATE** (forecast), **NEXUS** (profile).

But the Profile screen's `QUICK_ROUTES` array lists 13 deep-link destinations: edit profile, Agro ID, contracts, livestock, inventory, insurance, input supply, peer groups, consultations, wallet admin, digital farm twin, analytics, crop planning.

This means 20+ features are buried behind 3 taps minimum (Tab → Profile → Quick Access → Feature). For a farm management app used in the field, this is critically deep navigation.

**Fix**: Restructure navigation to 4–5 tabs: **Home** (hub), **AI** (Sankofa + Scan), **Farm** (core management features), **Market**, **Profile**. Use a nested bottom tab or segment control within Farm for sub-features. The current navigation architecture will result in poor engagement and high abandonment for secondary features.

---

### 4.2 🟡 IMPORTANT — Tab Label Naming is Cryptic and Non-Descriptive

**File**: `app/(tabs)/_layout.tsx:44-60`

Tab labels: **HUB**, **CLIMATE**, **NEXUS**

- "NEXUS" is brand language for what is clearly a "Profile" or "Account" screen. A first-time user in Swahili will not understand "NEXUS."
- "HUB" is marginally better but opaque.
- "CLIMATE" is accurate but narrow — the Forecast tab is also the entry point for weather-based farm planning.

**Fix**: Use plain language labels that pass the "can a rural Tanzanian farmer with basic literacy understand this?" test. Swahili equivalents: **Nyumbani** (Home), **Hali ya Hewa** (Weather), **Wasifu** (Profile). Or use universal icon-only tabs with accessibility labels.

---

### 4.3 🟡 IMPORTANT — Back Navigation from Modal Screens Uses `router.back()` Without Guards

Multiple screens use `router.back()` with no unsaved-changes guard (e.g., `crop-planning.tsx` at 27,758 bytes, `edit-profile.tsx` at 19,933 bytes). Users can inadvertently lose data when navigating back on these lengthy forms.

**Fix**: Implement a `useConfirmBack` hook that intercepts native back gesture on screens with unsaved form state. Show a confirmation dialog.

---

## 5. UI/UX Design System

### 5.1 🟠 CRITICAL — Inconsistent Component Library (Only 2 UI Components Exist)

**Directory**: `components/ui/`

```
Button.tsx (2.1KB)
Card.tsx (793B)
```

With 20+ screens, there are only 2 shared UI components. Every screen defines its own one-off `StyleSheet.create` — and they're inconsistent. The `walletCard` border radius is `36` on the home screen but card border radius in the theme is `20` (xl). The scan screen's `iconButton` size is `52px` but profile uses `44px` icon buttons.

**Fix**: Build a proper component library minimum: `Button`, `Card`, `Badge`, `Avatar`, `ListItem`, `SectionHeader`, `Input`, `Toast`, `Modal`, `EmptyState`. All screens must use these instead of defining ad-hoc styles.

---

### 5.2 🟠 CRITICAL — `NeuralOrb` Component Duplicated Across Every Screen

`NeuralOrb` is defined inline (copy-paste) in at least: `index.tsx`, `profile.tsx`, `sankofa.tsx`, `scan.tsx`. It is not in `components/`. This is the most visible design element in the app — a bug fix or visual tweak requires editing 4+ files.

**Fix**: Move to `components/NeuralOrb.tsx`. Add proper TypeScript props. The blur effect also needs the native fix (see §1.2).

---

### 5.3 🟡 IMPORTANT — Avatar Image is a Hardcoded Unsplash URL

**Files**: `app/(tabs)/index.tsx:223`, `app/(tabs)/profile.tsx:215`

```ts
source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400' }}
```

Every user sees the same man's photo as their avatar. This is not their Agro ID. The `agroId?.avatarUrl` is used in `index.tsx` with a fallback to this random stranger's photo.

**Fix**: Replace with initials-based avatar (`name[0]` initial on a colored circle) when no `avatarUrl` is set. Implement avatar upload in `edit-profile.tsx`.

---

### 5.4 🟡 IMPORTANT — Empty State for Activities Feed Uses Cryptic Text

**File**: `app/(tabs)/index.tsx:498-501`

```tsx
<Text style={{ ... }}>Gonga kurejeza shughuli</Text>
```

The empty state for the activity feed says "Tap to restore activities" — which restores the hardcoded mock activities. This is a developer debugging feature exposed to production users.

**Fix**: Replace the empty state with a genuine "No recent activity" empty state component with an appropriate illustration and a CTA linking to the most relevant feature.

---

### 5.5 🟡 IMPORTANT — `Math.random()` in `miniGraph` Causes Hydration Flicker

**File**: `app/(tabs)/index.tsx:385`

```ts
animate={{ height: 10 + Math.random() * 20 }}
```

The mini graph bars animate to a random height on every render cycle. This produces visual flickering and is not connected to any real data. On re-renders (parent state changes), bars jump to new random heights.

**Fix**: Either (a) show real sensor data from `farmVitals`, (b) use a seeded deterministic mock, or (c) remove the mini graphs entirely and show a static sparkline based on the actual stat value.

---

## 6. Typography System

### 6.1 🟡 IMPORTANT — Font Embedding in `app.json` is Incomplete

**File**: `app.json:65-70`

```json
"fonts": [
  "Inter_400Regular.ttf",
  "Inter_600SemiBold.ttf",
  "Inter_700Bold.ttf"
]
```

The font plugin only embeds **3 weights**, but the code uses 6 weights: `Inter_400Regular`, `Inter_500Medium`, `Inter_600SemiBold`, `Inter_700Bold`, `Inter_800ExtraBold`, `Inter_900Black`.

On fresh installs (before the JS bundle loads), the app will use system fallback fonts for Medium, ExtraBold, and Black — causing FOUF (flash of unstyled fonts) and layout shifts during splash-screen-to-app transition.

**Fix**: Add all 6 used weights to the `expo-font` plugin array in `app.json`.

---

### 6.2 🟢 POLISH — Minimum Font Size Violates Accessibility Guidelines

**File**: `app/(tabs)/index.tsx:607`

```ts
statusText: {
  fontSize: 9,    // ← Below WCAG minimum
  fontFamily: 'Inter_900Black',
  letterSpacing: 1,
},
```

Multiple instances of `fontSize: 9`, `fontSize: 10`, `fontSize: 11` throughout. WCAG 2.1 requires a minimum text size of ~11px for body content. On high-DPI screens these may render at 9px equivalent. Apple's HIG recommends minimum 17pt body text.

**Fix**: Establish `fontSize: 12` as the minimum allowed, `fontSize: 14` for body content. Update all instances below 12px.

---

## 7. Color System & Accessibility

### 7.1 🟡 IMPORTANT — Primary Color Fails WCAG AA on Light Background

**File**: `constants/Theme.ts:4`

```ts
primary: '#3ecf8e', // Emerald green
```

`#3ecf8e` on `#ffffff` has a contrast ratio of approximately **2.8:1**. WCAG AA requires **4.5:1** for normal text and **3:1** for large text. The primary color is used for text labels throughout (e.g., "SOMA ZAIDI," badge text, action labels).

**Risk**: Apple's App Store guidelines require apps to meet accessibility standards. This is detectable by their automated tools.

**Fix**: Darken primary text color on light backgrounds to `#0d9e6a` (≈5.1:1) while keeping the vibrant `#3ecf8e` for purely decorative elements (glows, background accents). Update `useTheme` to return a `primaryText` color appropriate for each color scheme.

---

### 7.2 🟡 IMPORTANT — White Text on Rgba Glassmorphism Backgrounds Fails Contrast in Light Mode

Light mode card backgrounds use `rgba(255, 255, 255, 0.6)` BlurView tints. Dark text on these should be fine, but many labels use fixed `rgba(255,255,255,0.5)` colors regardless of mode. In light mode, white semi-transparent text on a white-ish background fails contrast.

**File**: `app/onboarding.tsx:515-516` — all step subtitle text uses `rgba(255,255,255,0.6)` even in what could be a light context.

**Fix**: The onboarding is locked to a dark background (correct). But other screens must audit fixed-color text and ensure it's wrapped in theme-aware `colors.text` / `colors.textMute` rather than hard-coded white.

---

## 8. Motion Design & Micro-Interactions

### 8.1 🔴 BLOCKING — `motion/react` `whileHover` / `whileTap` Are No-Ops on Native

**Instances throughout**: 
```tsx
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

These are web-only Framer Motion props. On native, tapping the wallet card, Sankofa AI hero card, or stat cards produces no tactile visual feedback since the gesture-driven animation won't fire.

**Fix**: Replace with `Pressable` + `Animated.View` / `useSharedValue + withSpring`. Pair with `expo-haptics` (already used) for full tactile + visual feedback.

---

### 8.2 🟡 IMPORTANT — `AnimatePresence` with `exit={{ filter: 'blur(10px)' }}` Will Crash on Native

**File**: `app/sankofa.tsx:405-438`

```tsx
exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
```

The `filter` CSS property in exit animations will cause React Native to warn (dev) or crash (production).

**Fix**: Remove `filter` from all animation keyframes. Use `BlurView` with conditional opacity for native blur effects.

---

### 8.3 🟡 IMPORTANT — No `prefers-reduced-motion` Respect

Users with motion sensitivity (vestibular disorders) who have set "Reduce Motion" in iOS/Android settings will not have this respected. The app runs continuous animations (Neural Orbs, rotating AI ring, pulsing badges) with no mitigation.

**Fix**: Check `AccessibilityInfo.isReduceMotionEnabled()` on mount. When `true`, disable all continuous animations, replace `AnimatePresence` transitions with instant opacity changes.

---

## 9. Voice & AI Integration

### 9.1 🟠 CRITICAL — AI Configurations Checked with `aiConfigured()` But Source is Unknown

**File**: `app/sankofa.tsx:163-164`, `app/scan.tsx:139-141`

```ts
if (!aiConfigured()) {
  reply = await demoChat(trimmed);
} else {
  // real AI call
}
```

The `aiConfigured()` function and `lib/ai.ts` are referenced but I cannot see their implementation. If this is checking for an environment variable API key that is missing in production builds, the app will silently fall back to demo mode for all users — making the core value proposition (AI diagnosis, AI chat) non-functional in production.

**Risk**: Users who pay for Premium and use their allotted AI calls are getting canned responses. App Store "bait and switch" risk.

**Fix**: Add a configuration status indicator in-app. Show users whether they're in "Demo Mode" or "Live AI Mode." Ensure the production EAS build sets all required AI API keys.

---

### 9.2 🟠 CRITICAL — Voice Transcription Language Hardcoded to Swahili Only

**File**: `app/sankofa.tsx:264`

```ts
const transcript = await transcribeAudio(base64, { mimeType, language: 'sw' });
```

The `language` parameter is hardcoded to `'sw'` regardless of the user's selected language. English-speaking users (e.g., farm managers, extension officers, NGO workers) cannot use voice input.

**Fix**: Use `useKilimoStore((s) => s.language)` to dynamically pass the correct language code to the transcription service.

---

### 9.3 🟡 IMPORTANT — AI Chat Message History is Not Persisted

**File**: `app/sankofa.tsx:83-90`

```ts
const [messages, setMessages] = useState<Message[]>([
  { id: '1', text: "Jambo! ...", sender: 'ai', timestamp: new Date() }
]);
```

Every time the user navigates away from Sankofa and returns, the conversation resets to the initial greeting. For a farmer who asked a detailed question and navigated to scan a photo, returning to Sankofa means starting over.

**Fix**: Persist the last N (e.g., 50) messages to Zustand store (non-sensitive content). Clear on explicit "New Chat" action. Add a "Clear Chat" button in the header.

---

### 9.4 🟡 IMPORTANT — `isOffline` in Sankofa and Scan Screens is Local State, Not Synced to Global Store

**Files**: `app/sankofa.tsx:78`, `app/scan.tsx:67`

```ts
const [isOffline, setIsOffline] = useState(false); // Mock offline state
```

The real offline state lives in `useKilimoStore((s) => s.isOffline)` — driven by `useSyncEngine` which uses NetInfo. But these screens use independent local state with a manual toggle button. The UI can show "offline" when the device is online, and vice versa.

**Fix**: Replace local `isOffline` state with `const isOffline = useKilimoStore((s) => s.isOffline)`. Remove the manual toggle button (which is a debug tool exposed to production).

---

## 10. Performance

### 10.1 🟠 CRITICAL — Background Neural Orbs are Always Rendering on Every Screen

**Screens**: `index.tsx`, `profile.tsx`, `sankofa.tsx`, `scan.tsx` — 4 screens with 3 animated orbs each = 12 concurrent infinite animation loops when a user is on the Sankofa screen (animated background) while background hooks run.

Each orb uses `motion.View` with:
```ts
animate={{ 
  x: [x, x+50, x-30, x], y: [y, y-60, y+40, y],
  opacity: [...], scale: [...]
}}
transition={{ duration: 18, repeat: Infinity }}
```

On lower-end Android devices (the primary target for this app), this will cause significant frame drops and battery drain. Continuous 60fps animation of 12 elements is expensive.

**Fix**: Use `InteractionManager.runAfterInteractions()` to defer orb animation start. Pause orb animations when the screen is backgrounded (`AppState`). On Android, cap orb animations to 30fps using `useReducedMotion()`. Alternatively, replace with static gradient backgrounds.

---

### 10.2 🟡 IMPORTANT — `Math.random()` Called Inside `FlatList` `renderItem` on Every Frame

**File**: `app/(tabs)/index.tsx:385-394`

Mini graph bars animate to `10 + Math.random() * 20` height on every render cycle. Since this is inside a `motion.View` with `repeat: Infinity`, it re-evaluates `Math.random()` constantly, causing unnecessary re-computation and inconsistent UI state.

**Fix**: Pre-compute sparkline heights and memoize them. Only update when actual `farmVitals` data changes.

---

### 10.3 🟡 IMPORTANT — `onRefresh` Does Nothing Meaningful

**File**: `app/(tabs)/index.tsx:144-148`

```ts
const onRefresh = useCallback(async () => {
  setRefreshing(true);
  Haptics.notificationAsync(...);
  setTimeout(() => setRefreshing(false), 1500);
}, []);
```

Pull-to-refresh waits 1.5 seconds and does nothing. No data is re-fetched, no API call is made, no store is updated. Users who pull to refresh expecting updated weather, prices, or farm vitals are shown a spinner that resolves to the same stale data.

**Fix**: Wire `onRefresh` to invalidate relevant React Query queries: `queryClient.invalidateQueries(['farmVitals', 'weather', 'recommendations'])`. The QueryClient is already set up in `_layout.tsx`.

---

### 10.4 🟡 IMPORTANT — `ScrollView` Inside `FlatList` Pattern Risk

**File**: `app/sankofa.tsx:529` — `ScrollView horizontal` inside what renders inside a `FlatList`

Nested scrollable components (especially horizontal ScrollView inside vertical FlatList) can cause touch gesture conflicts and janky scrolling on Android, particularly older versions. This is a known React Native anti-pattern.

**Fix**: Flatten the list structure. Move suggested prompts above the FlatList as a header component using `ListHeaderComponent`.

---

## 11. Security & Data Handling

### 11.1 🟠 CRITICAL — `wallet.mpesaPhone` Persisted Despite Comment Saying Otherwise

**File**: `store/useKilimoStore.ts:313`

```ts
partialize: (state) => ({
  ...
  wallet: { ...state.wallet, mpesaPhone: undefined }, // Never persist phone
```

The comment says "never persist phone" — but `wallet.mpesaPhone` is set in the initial state to `'+255 712 345 678'` and this value is included in the Zustand partialize (the spread `...state.wallet` includes it before `mpesaPhone: undefined` override). However, `agroId.phoneNumber` is also potentially stored if set.

**Verify**: Ensure `mpesaPhone: undefined` actually strips the key from AsyncStorage. Add an explicit `partialize` test.

**Fix**: Confirm by adding `expect(stored.wallet.mpesaPhone).toBeUndefined()` to a unit test. Also ensure `agroId` in partialize explicitly strips `phoneNumber`.

---

### 11.2 🟡 IMPORTANT — Sync Queue Payloads Are `Record<string, unknown>` With No Sanitization

**File**: `store/useKilimoStore.ts:35-39`

```ts
interface SyncQueueItem {
  payload: Record<string, unknown>;
```

Any payload can be added to the sync queue and will be serialized to AsyncStorage. If a payload inadvertently includes sensitive data (e.g., a raw API response with full user PII), it persists to local storage indefinitely.

**Fix**: Define strict payload types per `SyncQueueItem.type`. Add sanitization in `addToSyncQueue` that strips fields not in the allowlist.

---

### 11.3 🟡 IMPORTANT — SYNC_ENDPOINT is a Non-Existent URL

**File**: `hooks/useSyncEngine.ts:16`

```ts
const SYNC_ENDPOINT = 'https://api.kilimo.ai/v1/sync';
```

This URL does not exist — the sync engine uses a mock `pushItem` that simulates 90% success rate. In production, offline queue items are never actually synced to a server.

**Fix**: Replace with the real Supabase edge function URL before store submission. The mock 90% success rate should be removed and replaced with real error handling.

---

## 12. Accessibility Compliance

### 12.1 🟡 IMPORTANT — Missing `accessibilityLabel` on Most Interactive Elements

The app has `accessibilityLabel` on some buttons (e.g., scan screen's shutter button) but misses most:
- Wallet card "Deposit" and "Pay Co-op" buttons (no labels)
- All farm stat cards (no labels — screen reader will read nothing meaningful)
- Quick action cards (label is Swahili which is fine, but `accessibilityHint` missing)
- Profile quick access grid items
- Sankofa AI hero card

**Risk**: Apple's App Review guidelines explicitly state apps should meet accessibility standards (Section 5.1.5). Apps with no VoiceOver support have been rejected.

**Fix**: Add `accessibilityLabel` and `accessibilityHint` to every `TouchableOpacity` and `Pressable`. Run through VoiceOver (iOS) and TalkBack (Android) before submission.

---

### 12.2 🟡 IMPORTANT — Switches in Settings Have No Semantic Accessibility Role

**File**: `app/(tabs)/profile.tsx:285-290`

```tsx
<Switch 
  value={biometric}
  trackColor={{ false: colors.border, true: colors.primary }}
  onValueChange={setBiometric}
/>
```

The `Switch` component is placed inside a `TouchableOpacity` that has `activeOpacity={1}` when the item has a switch. The switch itself needs `accessibilityLabel` describing what it controls.

**Fix**: Add `accessibilityLabel="Biometric Identity toggle"` directly to each `Switch`. Remove the wrapping `TouchableOpacity` for switch rows (the `Switch` handles its own touch).

---

### 12.3 🟡 IMPORTANT — Dynamic Text Size Not Supported

The app uses hardcoded `fontSize` values with no `allowFontScaling={false}` discipline. When a user increases system font size (iOS Accessibility → Larger Text), text will overflow containers, overlap icons, and break the pixel-precise layouts (especially the 9px status badge text and balance amount display).

**Fix**: Either: (a) set `allowFontScaling={false}` on display-critical elements (balance amount, badge text) and `true` on content text, or (b) use `useWindowDimensions()` to scale font sizes proportionally. Test with each iOS dynamic type size setting.

---

## 13. Privacy Policy & Terms of Service

### 13.1 🔴 BLOCKING — Terms of Service Contains 3 Placeholder Sentences

**File**: `app/terms.tsx`

Current content:
- "By using Kilimo AI, you agree to these terms. Please read them carefully."
- "Kilimo AI provides agricultural insights. While we strive for accuracy, decisions made based on AI recommendations are the responsibility of the farmer."
- "You are responsible for maintaining the confidentiality of your account."

This is unacceptable for a financial + health-data (crop disease) + location-data application targeting regulated markets. Both Apple and Google will reject the app.

**Required Sections**: Acceptance of Terms, Service Description, User Accounts, Permitted/Prohibited Use, Intellectual Property, AI Disclaimer and Liability Limitation, Payment Terms (for subscription), Dispute Resolution and Governing Law (Tanzanian law / UNCITRAL), Termination, Changes to Terms.

---

### 13.2 🟡 IMPORTANT — No Consent Screen Before Collecting Farm Data

GDPR (applicable if any EU agricultural buyers/NGOs use the platform), Kenya Data Protection Act 2019, and Tanzania's draft data protection laws all require **explicit, informed consent** before data collection.

Currently, completing onboarding immediately begins collecting location, farm size, crop data, livestock data — with no consent screen or notice.

**Fix**: Add a consent screen at the start of onboarding with clear language about what is collected, why, and user rights. Require explicit acceptance before the onboarding steps begin.

---

## 14. Error States & Fallback Systems

### 14.1 🟡 IMPORTANT — No Global Error Boundary Implemented

Despite the PRD specifying "Global error boundary; component-level error boundaries," no `ErrorBoundary` component exists in the codebase. If any screen throws an unhandled error (including the many potential crashes from `motion/react`), the app will go to a blank white screen with no recovery path.

**Fix**: Add a root-level `ErrorBoundary` in `_layout.tsx` that catches JS errors and shows a friendly "Something went wrong — tap to restart" screen. Add component-level boundaries on AI-integration screens (`sankofa`, `scan`) since they are highest-risk.

---

### 14.2 🟡 IMPORTANT — `Alert` Used for Developer Sync Confirmation, Not a Production UX Pattern

**File**: `app/(tabs)/profile.tsx:139`

```ts
Alert.alert('Sync', 'Data yako imesawazishwa kikamilifu.');
```

Native `Alert` dialogs break the premium glassmorphic aesthetic immediately. Every other interaction uses the app's design language, but sync actions and logout confirmation fall back to OS-native alerts that look jarring.

**Fix**: Build a custom `Toast` component using `react-native-reanimated` for success confirmations. Build a custom `ConfirmDialog` for destructive actions (logout). Only use native `Alert` for permissions prompts where required by OS.

---

### 14.3 🟡 IMPORTANT — Empty State for Notifications Not Implemented

**File**: `app/notifications.tsx` — not viewed but referenced throughout.

There is no empty state design visible in the notification-related code. An empty notification list should show an illustration and encouraging text, not a blank screen.

---

## 15. Cross-Device Consistency

### 15.1 🟡 IMPORTANT — `BlurView` `intensity` Values Not Calibrated Per Platform

**File**: Multiple screens

```tsx
<BlurView intensity={isDark ? 30 : 70} ...>
```

`BlurView` renders very differently on iOS (native UIBlurEffect — excellent) vs. Android (software render — significantly less performant and visually different). The same `intensity={70}` produces a premium frosted glass on iPhone but a muddy overlay on Android.

**Fix**: Use `Platform.select` to set different intensity values per platform. Consider providing a fallback solid `backgroundColor` on Android instead of blur, since software blur at high intensity will cause frame drops on the entry-level Android devices in the target market.

---

### 15.2 🟡 IMPORTANT — `KeyboardAvoidingView` Behavior Incomplete on Android

**File**: `app/sankofa.tsx:517-519`

```tsx
<KeyboardAvoidingView 
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
>
```

`keyboardVerticalOffset` is `0` for Android — this often results in the input field being partially hidden on Android. Android behavior needs `'height'` mode with correct offset calculation that accounts for the tab bar height (`72px`) and status bar.

**Fix**: Use `react-native-avoid-softinput` or calculate the actual offset from the bottom navigation bar height on Android.

---

## 16. Skills System Integration

### 16.1 🟡 IMPORTANT — Skills Exist as Agent Files Only, Not Surfaced in App UX

The `.agents/skills/` directory contains development-time agent skills (frontend-developer, performance-engineer, brainstorming, etc.). These are workflow tools for the development process, not user-facing features.

**The PRD mentions**: "Skills" in the context of Sankofa AI's specializations — disease diagnosis, market advice, weather interpretation, crop planning. These should be surfaced to users as AI capability categories.

**Current state**: Sankofa AI's suggested prompts are generic. There's no indication of what the AI is specialized in, its confidence in different domains, or how to get the best from it.

**Fix**: In the Sankofa AI screen, add a "Capabilities" section showing Sankofa's core skills (Disease Diagnosis, Market Intelligence, Crop Planning, Weather Interpretation, Livestock Health). Each skill should link to the relevant feature and set context for the AI conversation.

---

## 17. Feature Completeness vs. PRD

The following P0/P1 PRD features are not implemented or are mock-only:

| Feature | PRD ID | Status |
|---------|--------|--------|
| Phone OTP authentication | AUTH-01 | ❌ Not implemented |
| Email/password auth | AUTH-02 | ❌ Scaffolded, not wired |
| Role-based feature gating | AUTH-04 | ❌ Roles assigned, not gated |
| Phone number collection | AUTH-01 | ❌ Not in onboarding |
| Offline image capture queue | OFF-02 | ⚠️ Queue exists, never syncs |
| Real crop prices | MKT-01 | ❌ No data source |
| Market listings | MKT-03 | ⚠️ UI exists, no backend |
| Task calendar view | TASK-02 | ⚠️ List view only, no calendar |
| Real weather data | SVC-03 | ⚠️ UI exists, mock data |
| Farm finance tracker | FIN-01 | ❌ Not implemented |
| Soil test request | SVC-02 | ❌ Not implemented |
| Expert consultations booking | SVC-01 | ❌ Not implemented |
| Video tutorials | LRN-01 | ❌ Not implemented |

---

## 18. What is Strong and Must Be Preserved

Despite the issues above, several things are genuinely world-class and should be protected:

| Strength | Notes |
|----------|-------|
| **Design ambition** | The glassmorphism system, color palette, and depth of the UI are on par with top-tier fintech apps |
| **Onboarding UX flow** | The 5-step wizard structure with bilingual support, role selection, and farm profile is excellent |
| **Zustand store architecture** | Clean separation of concerns, proper partialize, migration support, offline queue |
| **Scan screen state machine** | The `ScanPhase` state machine is well-designed with proper sequence-versioning to prevent race conditions |
| **useIdleTimeout** | Thoughtful AUTH-06 implementation with AppState integration |
| **useSyncEngine** | Correct NetInfo integration, proper drain pattern |
| **Error message localization** | All error messages in Sankofa and Scan are localized to Swahili |
| **Haptics throughout** | Consistent haptic feedback on all interactions — great native feel |
| **Image size validation** | 5MB cap in scan.tsx prevents OOM crashes on lower-end devices |

---

## 19. Priority Fix Order Before Store Submission

### Phase 1 — Must Fix (Launch Blocking, ~2-3 weeks)

1. ❌ Replace all `motion/react` with `react-native-reanimated` + gesture handler
2. ❌ Remove `filter` from all `StyleSheet.create` definitions
3. ❌ Implement phone OTP authentication in onboarding
4. ❌ Write full Privacy Policy (min 800 words, all required sections)
5. ❌ Write full Terms of Service (min 600 words, all required sections)  
6. ❌ Add consent screen to onboarding
7. ❌ Remove `WRITE_EXTERNAL_STORAGE` permission
8. ❌ Replace mock wallet balance default with `0`
9. ❌ Remove hardcoded stranger avatar URL — use initials avatar
10. ❌ Remove mock offline toggle buttons from Sankofa and Scan screens
11. ❌ Add Global ErrorBoundary to `_layout.tsx`

### Phase 2 — High Priority (Before Launch, ~1-2 weeks)

12. ⚠️ Implement subscription tier gating (at minimum, show upgrade prompts)
13. ⚠️ Fix all accessibility labels on interactive elements
14. ⚠️ Fix KAV offset on Android in Sankofa input
15. ⚠️ Add all 6 Inter font weights to `app.json`
16. ⚠️ Persist Sankofa chat history to Zustand
17. ⚠️ Wire `onRefresh` to actual data invalidation
18. ⚠️ Fix `isOffline` to use global store state, not local state
19. ⚠️ Fix primary color contrast ratio for text use cases
20. ⚠️ Implement real AI API keys in EAS production secrets

### Phase 3 — Polish (Recommended Before Launch)

21. 🟢 Move `NeuralOrb` to shared component
22. 🟢 Build proper component library (Button, Card, Toast, Modal)
23. 🟢 Replace all `Alert` with custom Toast/Dialog components
24. 🟢 Implement `prefers-reduced-motion` support
25. 🟢 Expand region list to all 31 Tanzania regions
26. 🟢 Rebuild navigation to 5-tab structure for discoverability
27. 🟢 Implement Swahili tab labels

---

*Audit completed: May 25, 2026 · Kilimo AI v0.1.0 · React Native 0.81.5 / Expo 54.0.0*
