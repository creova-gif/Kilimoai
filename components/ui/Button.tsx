import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onPress, 
  title, 
  variant = 'primary', 
  loading = false, 
  style, 
  textStyle,
  disabled = false
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary': return styles.secondary;
      case 'outline': return styles.outline;
      case 'ghost': return styles.ghost;
      default: return styles.primary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline': return styles.outlineText;
      case 'ghost': return styles.ghostText;
      default: return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.base, getButtonStyle(), style, (disabled || loading) && styles.disabled]}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#22c55e' : '#ffffff'} />
      ) : (
        <Text style={[styles.textBase, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
  },
  textBase: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  primary: {
    backgroundColor: '#22c55e',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondary: {
    backgroundColor: '#18181b',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#22c55e',
  },
  outlineText: {
    color: '#22c55e',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: '#71717a',
  },
  disabled: {
    opacity: 0.5,
  },
});
