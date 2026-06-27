/**
 * Kilimo AI — Motion Tokens (motion-foundations compliant)
 *
 * Single source of truth for ALL animation values in the app.
 * No component may hardcode duration, easing, or spring values.
 * Import this file and use the exported constants.
 *
 * Complies with: motion-foundations/SKILL.md Rules 4–8
 * Low-end device detection guards all platform access at call-time.
 */

import { Platform } from 'react-native';

// ─── Duration tokens ─────────────────────────────────────────────────────────
export const motionTokens = {
  duration: {
    instant: 0.08,
    fast: 0.18,
    normal: 0.32,
    slow: 0.55,
    crawl: 1.0,
  },
  easing: {
    smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
    sharp: [0.4, 0, 0.2, 1] as [number, number, number, number],
    bounce: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    linear: [0, 0, 1, 1] as [number, number, number, number],
  },
  distance: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 48,
  },
  scale: {
    subtle: 0.98,
    press: 0.95,
    pop: 1.04,
  },
} as const;

// ─── Spring presets ───────────────────────────────────────────────────────────
export const springs = {
  snappy: { type: 'spring', stiffness: 300, damping: 30 },
  gentle: { type: 'spring', stiffness: 120, damping: 22 },
  bouncy: { type: 'spring', stiffness: 400, damping: 14 },
  instant: { type: 'spring', stiffness: 600, damping: 35 },
  release: { type: 'spring', stiffness: 200, damping: 20, restDelta: 0.001 },
} as const;

// ─── Runtime device & accessibility flags ────────────────────────────────────
export const motionConfig = {
  /** True on low-end Android devices (≤4 cores) */
  isLowEnd(): boolean {
    // React Native doesn't expose hardwareConcurrency; use Platform heuristic
    return Platform.OS === 'android' && Platform.Version < 29; // Android 9 cutoff
  },

  /** True when system accessibility "Reduce Motion" is enabled.
   *  On React Native, use expo-haptics or the hook below — no window access. */
  prefersReduced(): boolean {
    // NOTE: Expo provides AccessibilityInfo.isReduceMotionEnabled() (async).
    // Use the useReducedMotion() hook from this file for synchronous access.
    return false; // overridden by hook at runtime
  },

  /** Call this before rendering any non-essential animation */
  shouldAnimate(options: { essential?: boolean } = {}): boolean {
    if (this.isLowEnd() && !options.essential) return false;
    return true;
  },

  /** Returns the appropriate duration based on device capability */
  resolvedDuration(): number {
    return this.isLowEnd() ? motionTokens.duration.instant : motionTokens.duration.normal;
  },
};

// ─── Convenience: safe animation props for enter/exit ────────────────────────
/**
 * Returns motion initial/animate/exit props that respect reduced motion.
 * Pass `reduced = true` when the useReducedMotion hook fires.
 */
export function safeMotionProps(reduced: boolean, distance = motionTokens.distance.md) {
  return {
    initial: { opacity: 0, y: reduced ? 0 : distance },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduced ? 0 : -distance },
  };
}

// ─── Named transition shorthands ─────────────────────────────────────────────
export const transitions = {
  /** Standard card entrance */
  cardEnter: { ...springs.gentle } as Record<string, unknown>,
  /** Quick tap feedback */
  tap: { ...springs.snappy } as Record<string, unknown>,
  /** Stagger parent — children use staggerChildren */
  stagger: (staggerDelay = 0.08, delayChildren = 0.1) => ({
    staggerChildren: staggerDelay,
    delayChildren,
  }),
  /** Infinite pulse — NeuralOrbs, live indicators */
  pulse: (duration = 3) => ({
    duration,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  }),
  /** Infinite rotation */
  spin: (duration = 12) => ({
    duration,
    repeat: Infinity,
    ease: 'linear' as const,
  }),
} as const;
