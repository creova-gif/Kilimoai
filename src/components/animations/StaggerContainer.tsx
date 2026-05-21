/**
 * StaggerContainer & StaggerItem - Staggered list animations
 * Perfect for dashboard cards, task lists, navigation items
 */

import { motion, useReducedMotion } from "motion/react";
import { ReactNode } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.08,
  initialDelay = 0.1,
}: StaggerContainerProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReduced ? 0 : staggerDelay,
            delayChildren: prefersReduced ? 0 : initialDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

const directionOffset = {
  up: { y: 20, x: 0 },
  down: { y: -20, x: 0 },
  left: { x: 20, y: 0 },
  right: { x: -20, y: 0 },
};

export function StaggerItem({
  children,
  className = "",
  direction = "up",
}: StaggerItemProps) {
  const prefersReduced = useReducedMotion();
  const offset = prefersReduced ? { x: 0, y: 0 } : directionOffset[direction];

  return (
    <motion.div
      variants={{
        hidden: { opacity: prefersReduced ? 1 : 0, ...offset },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: prefersReduced ? 0 : 0.4,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedCard - Card with hover lift and tap press effects
 */
interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  tapScale?: number;
  onClick?: () => void;
}

export function AnimatedCard({
  children,
  className = "",
  hoverScale = 1.01,
  tapScale = 0.98,
  onClick,
}: AnimatedCardProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      whileHover={prefersReduced ? undefined : { scale: hoverScale, y: -2 }}
      whileTap={prefersReduced ? undefined : { scale: tapScale }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

/**
 * PulseDot - Animated status/pulse indicator
 */
export function PulseDot({ color = "#2E7D32", size = 8 }: { color?: string; size?: number }) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={prefersReduced ? {} : {
        scale: [1, 1.3, 1],
        opacity: [1, 0.6, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/**
 * LoadingSpinner - Animated loading spinner using Motion
 */
export function LoadingSpinner({
  size = 48,
  color = "#2E7D32",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={`rounded-full border-t-transparent ${className}`}
      style={{
        width: size,
        height: size,
        borderWidth: size / 12,
        borderColor: color,
        borderTopColor: "transparent",
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
