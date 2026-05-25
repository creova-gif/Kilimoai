import React from 'react';
import { Platform, View } from 'react-native';
import { motion } from 'motion/react';

interface NeuralOrbProps {
  color: string;
  size: number;
  delay: number;
  x: number;
  y: number;
  opacityRange?: [number, number, number, number];
}

/**
 * Decorative animated background orb using Framer Motion (web-only).
 * On native this renders a static semi-transparent circle — no crash risk.
 */
const NeuralOrb = ({ color, size, delay, x, y, opacityRange = [0.08, 0.18, 0.12, 0.08] }: NeuralOrbProps) => {
  if (Platform.OS !== 'web') {
    return (
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: 0.06,
          left: x,
          top: y,
        }}
      />
    );
  }

  return (
    <motion.View
      initial={{ x, y, opacity: 0, scale: 0.8 }}
      animate={{
        x: [x, x + 50, x - 30, x],
        y: [y, y - 60, y + 40, y],
        opacity: opacityRange,
        scale: [1, 1.15, 0.95, 1],
      }}
      transition={{
        duration: 18 + delay / 1000,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        filter: 'blur(80px)',
      }}
    />
  );
};

export default NeuralOrb;
