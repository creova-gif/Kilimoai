import { useColorScheme } from 'react-native';

export const COLORS = {
  // Brand Forest Greens
  forestDark: '#122617',
  forestMedium: '#1D3B23',
  forestPrimary: '#2E6F40', // Rich agricultural forest green
  forestBright: '#3A8D52', // Neon-tinted forest green for dark mode contrast
  
  // Luxury Neutrals (Warm Cream, Ivory, and Matte Charcoal)
  creamWarm: '#FAF7F0',
  creamDark: '#F2ECE0',
  ivory: '#FCFBF7',
  charcoalDark: '#080A08', // Luxury matte near-black
  charcoalCard: '#131714',
  
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
  success: '#2E6F40',
  warning: '#D97706', // Harvest Amber
  error: '#DC2626',   // Terracotta Red
  info: '#2563EB',
};

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return {
    isDark,
    colors: {
      primary: isDark ? COLORS.forestBright : COLORS.forestPrimary,
      primaryDark: COLORS.forestMedium,
      primaryLight: isDark ? 'rgba(58, 141, 82, 0.2)' : 'rgba(46, 111, 64, 0.1)',
      
      background: isDark ? COLORS.charcoalDark : COLORS.creamWarm,
      card: isDark ? COLORS.charcoalCard : '#FFFFFF',
      cardSolid: isDark ? COLORS.charcoalCard : '#FFFFFF',
      
      text: isDark ? COLORS.ivory : '#1A211C', // Ivory vs Deep Charcoal-Green
      textMute: isDark ? '#92A396' : '#65786C', // Sage-gray muted text
      
      border: isDark ? 'rgba(58, 141, 82, 0.15)' : '#E6DFD5', // Green-tinted border vs Warm desert-sand
      borderSolid: isDark ? '#1C241E' : '#E6DFD5',
      
      tabBar: isDark ? COLORS.charcoalDark : COLORS.creamWarm,
      glass: isDark ? 'rgba(19, 23, 20, 0.75)' : 'rgba(255, 255, 255, 0.85)',
      glow: isDark ? 'rgba(58, 141, 82, 0.12)' : 'rgba(46, 111, 64, 0.08)',
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
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      xxl: 32,
      full: 999,
    },
    shadows: {
      sm: {
        shadowColor: '#122617',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
      md: {
        shadowColor: '#122617',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 8,
        elevation: 4,
      },
      lg: {
        shadowColor: '#122617',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDark ? 0.4 : 0.12,
        shadowRadius: 16,
        elevation: 8,
      },
      premium: {
        shadowColor: '#122617',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: isDark ? 0.5 : 0.15,
        shadowRadius: 24,
        elevation: 12,
      }
    }
  };
};
