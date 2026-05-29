import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../constants/Theme';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  disabled,
  style,
  onPress,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();

  const handlePress = (e: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) onPress(e);
  };

  const isPrimary = variant === 'primary';
  const isDestructive = variant === 'destructive';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  const textColor = 
    isPrimary ? '#000' : 
    isDestructive ? '#fff' : 
    (isSecondary || isOutline || isGhost) ? colors.text : 
    colors.text;

  const btnContent = (
    <View style={[styles.inner, size === 'sm' && styles.innerSm, size === 'lg' && styles.innerLg]}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { color: textColor },
              size === 'sm' && styles.textSm,
              size === 'lg' && styles.textLg,
              isPrimary && styles.textPrimary,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={rest.accessibilityLabel || label}
      accessibilityState={{ disabled: Boolean(disabled || loading), busy: Boolean(loading) }}
      style={[
        styles.root,
        isSecondary && { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
        isOutline && { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
        isGhost && { backgroundColor: 'transparent' },
        (disabled || loading) && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {isPrimary ? (
        <LinearGradient colors={[colors.primary, colors.primaryDim]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
          {btnContent}
        </LinearGradient>
      ) : isDestructive ? (
        <LinearGradient colors={['#ef4444', '#dc2626']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
          {btnContent}
        </LinearGradient>
      ) : (
        btnContent
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    minHeight: 48,
  },
  innerSm: { paddingHorizontal: 12, minHeight: 44 },
  innerLg: { paddingHorizontal: 24, minHeight: 56 },
  text: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
  },
  textSm: { fontSize: 13 },
  textLg: { fontSize: 17 },
  textPrimary: { fontFamily: 'Inter_700Bold' },
  disabled: { opacity: 0.5 },
  iconWrap: { marginRight: 8 },
});
