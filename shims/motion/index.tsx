/**
 * motion/react compatibility shim → react-native-reanimated
 *
 * Maps the framer/motion API used by KILIMO AI onto Reanimated v4 so the
 * existing JSX (motion.View / motion.Text / AnimatePresence) runs as real
 * native animations on Android + iOS.
 *
 * Supported animate keys: x, y, scale, scaleX, scaleY, rotate, rotateX,
 * rotateY, opacity, width, height, borderRadius, top, left, right, bottom,
 * backgroundColor (string passthrough, no interp). Keyframe arrays loop via
 * withRepeat. Scalar values with repeat:Infinity loop between initial and
 * target. height:'auto' falls back to letting the child measure naturally
 * while opacity animates. % width strings render statically at target.
 *
 * Unsupported (silently ignored, web-only): whileHover, filter, blur,
 * staggerChildren parent-orchestration.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

type AnyObj = Record<string, any>;

// Fixed set of animatable keys — order matters for stable hook calls
const ANIMATABLE_KEYS = [
  'x', 'y', 'scale', 'scaleX', 'scaleY',
  'rotate', 'rotateX', 'rotateY',
  'opacity', 'width', 'height', 'borderRadius',
  'top', 'left', 'right', 'bottom',
] as const;

type AnimKey = typeof ANIMATABLE_KEYS[number];

const DEFAULTS: Record<AnimKey, number> = {
  x: 0, y: 0,
  scale: 1, scaleX: 1, scaleY: 1,
  rotate: 0, rotateX: 0, rotateY: 0,
  opacity: 1,
  width: 0, height: 0, borderRadius: 0,
  top: 0, left: 0, right: 0, bottom: 0,
};

function resolveTarget(target: any, variants?: AnyObj): AnyObj {
  if (!target) return {};
  if (typeof target === 'string') return variants?.[target] ?? {};
  return target;
}

function normalizeNum(key: AnimKey, v: any): number {
  if (v === undefined || v === null) return DEFAULTS[key];
  if (typeof v === 'string') {
    // 'Xdeg' or numeric string
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : DEFAULTS[key];
  }
  if (typeof v === 'number') return v;
  return DEFAULTS[key];
}

function isAnimatableNumber(key: AnimKey, v: any): boolean {
  if (typeof v === 'number') return true;
  if (typeof v === 'string' && key === 'rotate') return true;
  return false;
}

function easingFn(ease: any) {
  if (typeof ease === 'string') {
    if (ease === 'easeIn') return Easing.in(Easing.ease);
    if (ease === 'easeOut') return Easing.out(Easing.ease);
    if (ease === 'easeInOut') return Easing.inOut(Easing.ease);
    if (ease === 'linear') return Easing.linear;
  }
  if (Array.isArray(ease) && ease.length === 4) {
    return Easing.bezier(ease[0], ease[1], ease[2], ease[3]);
  }
  return Easing.inOut(Easing.ease);
}

function buildAnimation(toValue: any, transition: AnyObj, initial: number, key: AnimKey) {
  const isSpring = transition.type === 'spring';
  const duration = (transition.duration ?? 0.32) * 1000;
  const delay = (transition.delay ?? 0) * 1000;
  const repeat = transition.repeat;
  const repeatType = transition.repeatType;

  const runOne = (v: any) => {
    const num = normalizeNum(key, v);
    return isSpring
      ? withSpring(num, {
          damping: transition.damping ?? 20,
          stiffness: transition.stiffness ?? 150,
          mass: transition.mass ?? 1,
        })
      : withTiming(num, { duration, easing: easingFn(transition.ease) });
  };

  let anim: any;
  if (Array.isArray(toValue)) {
    const steps = toValue.map(runOne);
    anim = steps.length === 1 ? steps[0] : withSequence(...steps);
    if (repeat === Infinity || (typeof repeat === 'number' && repeat > 0)) {
      const count = repeat === Infinity ? -1 : repeat;
      anim = withRepeat(anim, count, repeatType === 'reverse');
    }
  } else {
    // Scalar target. If repeat is set, loop between initial and target.
    if (repeat === Infinity || (typeof repeat === 'number' && repeat > 0)) {
      const count = repeat === Infinity ? -1 : repeat;
      anim = withRepeat(runOne(toValue), count, true);
    } else {
      anim = runOne(toValue);
    }
  }
  return delay > 0 ? withDelay(delay, anim) : anim;
}

// ─── Hook: fixed-count shared values, no hook-order violations ──────────────
function useMotionStyle(props: AnyObj, measuredHeight: number, onUseAutoHeight: () => void) {
  const { initial, animate, transition, variants } = props;

  const initialResolved = useMemo(() => resolveTarget(initial, variants), [initial, variants]);
  const animateResolved = useMemo(() => resolveTarget(animate, variants), [animate, variants]);

  // FIXED ORDER: one useSharedValue per known key — never changes between renders
  const svX        = useSharedValue(normalizeNum('x',        initialResolved.x        ?? DEFAULTS.x));
  const svY        = useSharedValue(normalizeNum('y',        initialResolved.y        ?? DEFAULTS.y));
  const svScale    = useSharedValue(normalizeNum('scale',    initialResolved.scale    ?? DEFAULTS.scale));
  const svScaleX   = useSharedValue(normalizeNum('scaleX',   initialResolved.scaleX   ?? DEFAULTS.scaleX));
  const svScaleY   = useSharedValue(normalizeNum('scaleY',   initialResolved.scaleY   ?? DEFAULTS.scaleY));
  const svRotate   = useSharedValue(normalizeNum('rotate',   initialResolved.rotate   ?? DEFAULTS.rotate));
  const svRotateX  = useSharedValue(normalizeNum('rotateX',  initialResolved.rotateX  ?? DEFAULTS.rotateX));
  const svRotateY  = useSharedValue(normalizeNum('rotateY',  initialResolved.rotateY  ?? DEFAULTS.rotateY));
  const svOpacity  = useSharedValue(normalizeNum('opacity',  initialResolved.opacity  ?? DEFAULTS.opacity));
  const svWidth    = useSharedValue(isAnimatableNumber('width', initialResolved.width) ? (initialResolved.width as number) : DEFAULTS.width);
  const svHeight   = useSharedValue(isAnimatableNumber('height', initialResolved.height) ? (initialResolved.height as number) : DEFAULTS.height);
  const svRadius   = useSharedValue(normalizeNum('borderRadius', initialResolved.borderRadius ?? DEFAULTS.borderRadius));
  const svTop      = useSharedValue(normalizeNum('top',      initialResolved.top      ?? DEFAULTS.top));
  const svLeft     = useSharedValue(normalizeNum('left',     initialResolved.left     ?? DEFAULTS.left));
  const svRight    = useSharedValue(normalizeNum('right',    initialResolved.right    ?? DEFAULTS.right));
  const svBottom   = useSharedValue(normalizeNum('bottom',   initialResolved.bottom   ?? DEFAULTS.bottom));

  const svMap: Record<AnimKey, any> = {
    x: svX, y: svY,
    scale: svScale, scaleX: svScaleX, scaleY: svScaleY,
    rotate: svRotate, rotateX: svRotateX, rotateY: svRotateY,
    opacity: svOpacity,
    width: svWidth, height: svHeight, borderRadius: svRadius,
    top: svTop, left: svLeft, right: svRight, bottom: svBottom,
  };

  // Track which keys actually participate (for style emission)
  const touchedKeys = useMemo(() => {
    const s = new Set<string>();
    Object.keys(initialResolved).forEach((k) => s.add(k));
    Object.keys(animateResolved).forEach((k) => s.add(k));
    return s;
  }, [initialResolved, animateResolved]);

  // Static width/height strings (percent) — applied directly, not animated
  const staticWidth = typeof animateResolved.width === 'string' ? animateResolved.width
                    : typeof initialResolved.width === 'string' ? initialResolved.width
                    : undefined;
  const staticHeight = typeof animateResolved.height === 'string' && animateResolved.height !== 'auto' ? animateResolved.height
                     : typeof initialResolved.height === 'string' && initialResolved.height !== 'auto' ? initialResolved.height
                     : undefined;

  // height:'auto' — request measurement, animate to measuredHeight
  const wantsAutoHeight = animateResolved.height === 'auto';
  useEffect(() => {
    if (wantsAutoHeight) onUseAutoHeight();
  }, [wantsAutoHeight, onUseAutoHeight]);

  const animateKey = JSON.stringify(animateResolved) + '|' + measuredHeight;
  useEffect(() => {
    ANIMATABLE_KEYS.forEach((k) => {
      const sv = svMap[k];
      let target = animateResolved[k];
      if (target === undefined) return;

      // height:'auto' → use measured height once available
      if (k === 'height' && target === 'auto') {
        if (measuredHeight > 0) {
          cancelAnimation(sv);
          sv.value = buildAnimation(measuredHeight, transition || {}, sv.value, k);
        }
        return;
      }
      // Percent strings → not animated; static style applied separately
      if ((k === 'width' || k === 'height') && typeof target === 'string') return;

      // Filter out non-numeric arrays
      if (Array.isArray(target)) {
        target = target.filter((v) => isAnimatableNumber(k, v));
        if (target.length === 0) return;
      } else if (!isAnimatableNumber(k, target)) {
        return;
      }

      cancelAnimation(sv);
      sv.value = buildAnimation(target, transition || {}, sv.value, k);
    });
    return () => {
      ANIMATABLE_KEYS.forEach((k) => cancelAnimation(svMap[k]));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animateKey]);

  const animatedStyle = useAnimatedStyle(() => {
    const style: AnyObj = {};
    const transform: AnyObj[] = [];

    if (touchedKeys.has('x'))       transform.push({ translateX: svX.value });
    if (touchedKeys.has('y'))       transform.push({ translateY: svY.value });
    if (touchedKeys.has('scale'))   transform.push({ scale: svScale.value });
    if (touchedKeys.has('scaleX'))  transform.push({ scaleX: svScaleX.value });
    if (touchedKeys.has('scaleY'))  transform.push({ scaleY: svScaleY.value });
    if (touchedKeys.has('rotate'))  transform.push({ rotate: `${svRotate.value}deg` });
    if (touchedKeys.has('rotateX')) transform.push({ rotateX: `${svRotateX.value}deg` });
    if (touchedKeys.has('rotateY')) transform.push({ rotateY: `${svRotateY.value}deg` });

    if (touchedKeys.has('opacity'))      style.opacity = svOpacity.value;
    if (touchedKeys.has('borderRadius')) style.borderRadius = svRadius.value;
    if (touchedKeys.has('top'))    style.top = svTop.value;
    if (touchedKeys.has('left'))   style.left = svLeft.value;
    if (touchedKeys.has('right'))  style.right = svRight.value;
    if (touchedKeys.has('bottom')) style.bottom = svBottom.value;

    // width/height: only emit when animated numerically
    if (touchedKeys.has('width')) {
      const w = animateResolved.width ?? initialResolved.width;
      if (typeof w === 'number' || Array.isArray(w)) style.width = svWidth.value;
    }
    if (touchedKeys.has('height')) {
      const h = animateResolved.height;
      if (typeof h === 'number' || Array.isArray(h) || h === 'auto') {
        // For 'auto', emit measured value once we have it
        if (h !== 'auto' || measuredHeight > 0) style.height = svHeight.value;
      }
    }

    if (transform.length) style.transform = transform;
    return style;
  });

  return { animatedStyle, staticWidth, staticHeight, wantsAutoHeight };
}

// ─── Component factory ──────────────────────────────────────────────────────
function createMotionComponent(Base: any, isText = false) {
  const AnimatedComp: any = isText ? Animated.Text : Animated.createAnimatedComponent(Base);

  return React.forwardRef<any, AnyObj>(function MotionComponent(props, ref) {
    const {
      initial, animate, exit, transition, variants,
      whileTap, whileHover, layout, layoutId,
      onTapStart, onTap, onHoverStart, onHoverEnd,
      style, children, onLayout: userOnLayout, ...rest
    } = props;

    const [pressed, setPressed] = useState(false);
    const [measuredHeight, setMeasuredHeight] = useState(0);
    const [needsAutoHeight, setNeedsAutoHeight] = useState(false);
    const requestAutoHeight = React.useCallback(() => setNeedsAutoHeight(true), []);

    // When pressed, merge whileTap into animate target
    const effectiveAnimate = useMemo(() => {
      const a = resolveTarget(animate, variants);
      if (pressed && whileTap) return { ...a, ...whileTap };
      return animate;
    }, [animate, variants, pressed, whileTap]);

    const { animatedStyle, staticWidth, staticHeight, wantsAutoHeight } = useMotionStyle(
      { initial, animate: effectiveAnimate, transition, variants },
      measuredHeight,
      requestAutoHeight,
    );

    const onLayout = React.useCallback((e: LayoutChangeEvent) => {
      if (wantsAutoHeight || needsAutoHeight) {
        const h = e.nativeEvent.layout.height;
        if (h > 0 && Math.abs(h - measuredHeight) > 0.5) setMeasuredHeight(h);
      }
      if (userOnLayout) userOnLayout(e);
    }, [wantsAutoHeight, needsAutoHeight, measuredHeight, userOnLayout]);

    const extraStyle: AnyObj = {};
    if (staticWidth !== undefined) extraStyle.width = staticWidth;
    if (staticHeight !== undefined) extraStyle.height = staticHeight;

    // For auto-height: render once invisibly to measure, then with animated height
    const overflowStyle = wantsAutoHeight ? { overflow: 'hidden' } : undefined;

    const content = (
      <AnimatedComp
        ref={ref as any}
        style={[style, extraStyle, overflowStyle, animatedStyle]}
        onLayout={onLayout}
        {...rest}
      >
        {children}
      </AnimatedComp>
    );

    if (whileTap && !isText) {
      return (
        <Pressable
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={onTap}
        >
          {content}
        </Pressable>
      );
    }

    return content;
  });
}

// ─── motion proxy ───────────────────────────────────────────────────────────
const cache = new Map<any, any>();
function getMotionFor(Base: any, isText = false) {
  const key = isText ? `__text_${Base?.displayName || 'Text'}` : Base;
  if (!cache.has(key)) cache.set(key, createMotionComponent(Base, isText));
  return cache.get(key);
}

const motionFn: any = (Base: any) => getMotionFor(Base);
export const motion: any = new Proxy(motionFn, {
  get(_target, prop: string) {
    if (prop === 'View' || prop === 'div') return getMotionFor(View);
    if (prop === 'Text' || prop === 'span' || prop === 'p' || prop === 'h1' || prop === 'h2' || prop === 'h3') {
      return getMotionFor(Text, true);
    }
    if (prop === 'button') return getMotionFor(Pressable);
    return getMotionFor(View);
  },
});

// ─── AnimatePresence — mount/unmount only; exit transitions skipped ─────────
export const AnimatePresence: React.FC<{ children?: React.ReactNode; mode?: string; initial?: boolean }> = ({ children }) => {
  return <>{children}</>;
};

// ─── Scroll stubs (market.tsx parallax) ─────────────────────────────────────
export function useScroll() {
  return {
    scrollY: { get: () => 0, onChange: () => () => {} },
    scrollX: { get: () => 0, onChange: () => () => {} },
  };
}
export function useTransform(_value: any, _input: any, output: any) {
  return Array.isArray(output) ? output[0] : output;
}
export function useMotionValue(initial: any) {
  return { get: () => initial, set: () => {}, onChange: () => () => {} };
}
export function useAnimation() {
  return { start: async () => {}, stop: () => {}, set: () => {} };
}

export default { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useAnimation };
