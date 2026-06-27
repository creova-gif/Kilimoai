import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../constants/Theme';

interface CardProps extends ViewProps {
  variant?: 'glass' | 'solid';
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  children: React.ReactNode;
}

export function Card({
  variant = 'glass',
  intensity = 20,
  tint,
  style,
  children,
  ...rest
}: CardProps) {
  const { colors, isDark, shadows } = useTheme();

  if (variant === 'solid') {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            ...shadows.sm,
          },
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={isDark ? 20 : 60}
      tint={tint || (isDark ? 'dark' : 'light')}
      style={[
        styles.card,
        {
          borderColor: colors.border,
          backgroundColor: isDark ? 'rgba(19, 23, 20, 0.45)' : 'rgba(255, 255, 255, 0.65)',
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 16,
  },
});
