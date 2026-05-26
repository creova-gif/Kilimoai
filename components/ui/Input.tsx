import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../constants/Theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { colors, isDark } = useTheme();

  return (
    <View style={styles.root}>
      {label && <Text style={[styles.label, { color: colors.textMute }]}>{label}</Text>}
      <BlurView
        intensity={isDark ? 20 : 60}
        tint={isDark ? "dark" : "light"}
        style={[
          styles.container,
          { borderColor: colors.border, backgroundColor: colors.card },
          isFocused && { borderColor: colors.primary, backgroundColor: colors.primaryLight },
          error ? { borderColor: colors.error } : null,
          style,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholderTextColor={colors.textMute}
          accessibilityLabel={rest.accessibilityLabel || label || rest.placeholder}
          accessibilityHint={error ? `Error: ${error}` : rest.accessibilityHint}
          onFocus={(e) => {
            setIsFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          {...rest}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </BlurView>
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconLeft: {
    paddingLeft: 16,
  },
  iconRight: {
    paddingRight: 16,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: 6,
  },
});
