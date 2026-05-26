import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../../constants/Theme';

interface BadgeProps extends ViewProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  icon?: React.ReactNode;
}

export function Badge({ label, variant = 'default', icon, style, ...rest }: BadgeProps) {
  const { colors } = useTheme();
  let bgColor: string = colors.info + '15';
  let textColor: string = colors.info;

  switch (variant) {
    case 'success':
      bgColor = colors.success + '15';
      textColor = colors.success;
      break;
    case 'warning':
      bgColor = colors.warning + '15';
      textColor = colors.warning;
      break;
    case 'error':
      bgColor = colors.error + '15';
      textColor = colors.error;
      break;
    case 'info':
      bgColor = colors.info + '15';
      textColor = colors.info;
      break;
    case 'default':
      bgColor = colors.textMute + '15';
      textColor = colors.textMute;
      break;
  }

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Status: ${label}`}
      style={[styles.badge, { backgroundColor: bgColor }, style]}
      {...rest}
    >
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  iconWrap: {
    marginRight: 4,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
