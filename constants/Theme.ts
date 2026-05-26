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
  
  // Branding overrides for YCombinator audit:
  // Background: #FFFFFF
  // Primary green: #2E7D32
  // Secondary green: #E8F5E9
  // Text: #1E2A3E
  // Spacing: 16px margins, 12px card padding, 8px gaps
  // Cards: border-radius 16px, shadow 0 2px 8px rgba(0,0,0,0.05)
  return {
    isDark: false, // force clean light mode matching screenshots
    colors: {
      primary: '#2E7D32',
      primaryDark: '#1B5E20',
      primaryLight: '#E8F5E9',
      
      background: '#FFFFFF',
      card: '#FFFFFF',
      cardSolid: '#FFFFFF',
      
      text: '#1E2A3E',
      textMute: '#5A6E85', // Slate gray
      
      border: '#E2E8F0',
      borderSolid: '#E2E8F0',
      
      tabBar: '#FFFFFF',
      glass: 'rgba(255, 255, 255, 0.95)',
      glow: 'rgba(46, 125, 50, 0.05)',
      slate: COLORS.slate,
      
      success: '#2E7D32',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    spacing: {
      xs: 4,
      sm: 8,   // 8px gaps
      md: 12,  // 12px card padding
      lg: 16,  // 16px margins
      xl: 24,
      xxl: 32,
      huge: 48,
    },
    radius: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,  // 16px border-radius
      xl: 20,
      xxl: 24,
      full: 999,
    },
    shadows: {
      sm: {
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
      },
      md: {
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 4,
      },
      lg: {
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 8,
      },
      premium: {
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 8,
      }
    }
  };
};
