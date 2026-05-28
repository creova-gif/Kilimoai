---
name: Web hydration gate
description: Why the Zustand persist hydration gate must use a Platform check and timeout on web, or it will cause a permanent blank screen.
---

# Web hydration gate

## The rule
Never gate `return null` in `RootLayout` (or any top-level layout) on `hydrated` unconditionally. Always add a `Platform.OS !== 'web'` guard around the hydration check for the render gate.

## Why
`useKilimoStore.persist.onFinishHydration()` and `hasHydrated()` are unreliable on web — the callback often never fires, so `hydrated` stays `false` forever. On native this is fine because the splash screen covers the wait. On web there is no native splash overlay, so `return null` produces a permanent blank white page.

## How to apply
In `app/_layout.tsx` `RootLayout`:
```tsx
// Only block render on hydration for native (splash screen covers it)
if (!loaded || (Platform.OS !== 'web' && !hydrated)) return null;
```

For `SplashScreen.hideAsync()`, add a 2-second timeout fallback so the DOM overlay always dismisses even if hydration never fires:
```tsx
useEffect(() => {
  if (!loaded) return;
  if (hydrated) { SplashScreen.hideAsync(); return; }
  const t = setTimeout(() => SplashScreen.hideAsync(), 2000);
  return () => clearTimeout(t);
}, [loaded, hydrated]);
```
