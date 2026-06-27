import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/Theme';

interface ScreenHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  trailing?: React.ReactNode;
}

export function ScreenHeader({
  title,
  subtitle,
  showBack = true,
  onBack,
  trailing,
  style,
  ...rest
}: ScreenHeaderProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else if (router.canGoBack()) router.back();
  };

  return (
    <View style={[styles.header, style]} {...rest}>
      {showBack && (
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButtonWrap}
        >
          <BlurView
            intensity={isDark ? 30 : 60}
            tint={isDark ? 'dark' : 'light'}
            style={[styles.backButton, { borderColor: colors.border }]}
          >
            <ChevronLeft size={24} color={colors.text} />
          </BlurView>
        </TouchableOpacity>
      )}

      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textMute }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {trailing && <View style={styles.trailingWrap}>{trailing}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    minHeight: 64,
  },
  backButtonWrap: {
    marginRight: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  trailingWrap: {
    marginLeft: 16,
  },
});
