import { useColorScheme } from 'react-native';
import { useKilimoStore } from '../store/useKilimoStore';

export const COLORS = {
  // Brand Primary — single bright green
  brandPrimary: '#22d15a',
  brandPrimaryDim: '#1ab84d', // slightly darker for hover/pressed states
  brandShadow: '#0a3d18', // deep shadow behind primary elements

  // Luxury Neutrals
  bgLight: '#F8FAF8', // Cleaner white-green
  bgDark: '#080A08', // Pure luxury dark
  cardLight: '#FFFFFF',
  cardDark: '#121812', // Brighter dark card instead of dim gray

  // Ivory / Charcoal
  ivory: '#FCFCFA',
  charcoalDark: '#080A08',

  // Slate Gray ladder
  slate: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },

  // Functional Accent Colors
  success: '#22c55e',
  warning: '#F59E0B',
  error: '#ef4444',
  info: '#3b82f6',
};

export const useTheme = () => {
  const systemScheme = useColorScheme();
  const themePreference = useKilimoStore((s) => s.themePreference);

  let isDark: boolean;
  if (themePreference === 'dark') {
    isDark = true;
  } else if (themePreference === 'light') {
    isDark = false;
  } else {
    isDark = systemScheme === 'dark';
  }

  return {
    isDark,
    colors: {
      primary: COLORS.brandPrimary,
      primaryDim: COLORS.brandPrimaryDim,
      primaryLight: isDark ? 'rgba(34, 209, 90, 0.18)' : 'rgba(34, 209, 90, 0.10)',

      background: isDark ? COLORS.bgDark : COLORS.bgLight,
      card: isDark ? COLORS.cardDark : COLORS.cardLight,
      cardSolid: isDark ? COLORS.cardDark : COLORS.cardLight,

      text: isDark ? COLORS.ivory : '#0F1F0F',
      textMute: isDark ? '#9CA3AF' : '#4B5563', // Slate 400 and Slate 600 for AA contrast

      border: isDark ? 'rgba(34, 209, 90, 0.14)' : '#D8EDD8',
      borderSolid: isDark ? '#1E2E1E' : '#D8EDD8',

      tabBar: isDark ? COLORS.bgDark : '#FFFFFF',
      glass: isDark ? 'rgba(20, 26, 20, 0.80)' : 'rgba(255, 255, 255, 0.88)',
      glow: isDark ? 'rgba(34, 209, 90, 0.14)' : 'rgba(34, 209, 90, 0.09)',
      slate: COLORS.slate,

      success: COLORS.success,
      warning: COLORS.warning,
      error: COLORS.error,
      info: COLORS.info,
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      xxl: 32,
      huge: 48,
    },
    radius: {
      xs: 6,
      sm: 10,
      md: 16,
      lg: 24,
      xl: 28,
      xxl: 32,
      full: 999,
    },
    shadows: {
      sm: {
        shadowColor: COLORS.brandShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.35 : 0.08,
        shadowRadius: 4,
        elevation: 0, // Removed to prevent harsh muddy shadows on Android
      },
      md: {
        shadowColor: COLORS.brandShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.45 : 0.12,
        shadowRadius: 8,
        elevation: 1, // Softened for Android
      },
      lg: {
        shadowColor: COLORS.brandShadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDark ? 0.55 : 0.16,
        shadowRadius: 16,
        elevation: 2, // Softened for Android
      },
      premium: {
        shadowColor: COLORS.brandShadow,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: isDark ? 0.65 : 0.2,
        shadowRadius: 24,
        elevation: 4, // Softened for Android
      },
    },
  };
};
