import { withSpring, withTiming, Easing } from 'react-native-reanimated';

/**
 * Standard Reanimated Springs & Timings for Kilimo AI
 */

// Bouncy but fast spring for buttons, tabs, popovers
export const SPRING_BOUNCY = {
  damping: 14,
  stiffness: 150,
  mass: 0.8,
};

// Smooth, non-bouncy spring for layout transitions and modals
export const SPRING_SMOOTH = {
  damping: 20,
  stiffness: 90,
  mass: 1,
};

// Snappy spring for rapid micro-interactions
export const SPRING_SNAPPY = {
  damping: 12,
  stiffness: 200,
  mass: 0.5,
};

// Standard timing for simple opacity fades
export const TIMING_FADE = {
  duration: 250,
  easing: Easing.inOut(Easing.ease),
};

export const withBouncy = (val: number) => withSpring(val, SPRING_BOUNCY);
export const withSmooth = (val: number) => withSpring(val, SPRING_SMOOTH);
export const withSnappy = (val: number) => withSpring(val, SPRING_SNAPPY);
export const withFade = (val: number) => withTiming(val, TIMING_FADE);
