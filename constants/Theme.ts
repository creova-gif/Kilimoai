import { useColorScheme } from 'react-native';

export const COLORS = {
  // Brand Deep Forest Greens (Unified Envato JZV4J93 Branding)
  brandPrimary: '#1A3B14',   // Active state green (pill buttons, badges)
  brandDarkGreen: '#1A3B14', // Deep green for chart containers, summary cards
  brandOlive: '#2F5A27',     // Secondary dark green
  
  // Luxury Neutrals
  bgLight: '#F3F5F2',        // Muted gray-green background
  bgDark: '#0E130D',         // Dark mode base
  cardLight: '#FFFFFF',      // Pure white cards
  cardDark: '#171D15',       
  
  // Luxury Neutrals (Ivory and Charcoal)
  ivory: '#FCFBF7',
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
  success: '#1A3B14',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#2563EB',
};

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return {
    isDark,
    colors: {
      primary: COLORS.brandPrimary,
      primaryDark: COLORS.brandDarkGreen,
      primaryLight: isDark ? 'rgba(26, 59, 20, 0.2)' : 'rgba(26, 59, 20, 0.1)',
      
      background: isDark ? COLORS.bgDark : COLORS.bgLight,
      card: isDark ? COLORS.cardDark : COLORS.cardLight,
      cardSolid: isDark ? COLORS.cardDark : COLORS.cardLight,
      
      text: isDark ? COLORS.ivory : '#121A0F', // Ivory vs Deep Charcoal-Green
      textMute: isDark ? '#8A9985' : '#6B7A66', // Sage-gray muted text
      
      border: isDark ? 'rgba(26, 59, 20, 0.15)' : '#E2E8DF', // Green-tinted border vs Muted grey-green border
      borderSolid: isDark ? '#263322' : '#E2E8DF',
      
      tabBar: isDark ? COLORS.bgDark : '#FFFFFF',
      glass: isDark ? 'rgba(23, 29, 21, 0.75)' : 'rgba(255, 255, 255, 0.85)',
      glow: isDark ? 'rgba(26, 59, 20, 0.12)' : 'rgba(26, 59, 20, 0.08)',
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
        shadowColor: '#1A3B14',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
      md: {
        shadowColor: '#1A3B14',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 8,
        elevation: 4,
      },
      lg: {
        shadowColor: '#1A3B14',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDark ? 0.4 : 0.12,
        shadowRadius: 16,
        elevation: 8,
      },
      premium: {
        shadowColor: '#1A3B14',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: isDark ? 0.5 : 0.15,
        shadowRadius: 24,
        elevation: 12,
      }
    }
  };
};
