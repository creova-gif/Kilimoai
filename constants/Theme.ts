import { useColorScheme } from 'react-native';

export const COLORS = {
  primary: '#22d15a', // Vivid forest green — matches dark-green UI reference
  primaryDark: '#16a34a',
  primaryLight: '#bbf7d0',
  
  // Neutral scales
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Deep forest green palette
  forest: {
    950: '#050f07',  // near-black green
    900: '#0a1a0e',  // main background
    800: '#0f2412',  // card background
    700: '#163319',  // elevated card
    600: '#1e4723',  // surface
    mute: '#7a9e82', // muted green-gray text
  },
  
  // Functional colors
  success: '#22d15a',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = true;
  
  return {
    isDark,
    colors: {
      primary: COLORS.primary,
      primaryText: COLORS.primary,
      background: COLORS.forest[900],
      card: 'rgba(15, 36, 18, 0.80)',
      cardSolid: COLORS.forest[800],
      text: '#f0fff4',
      textMute: COLORS.forest.mute,
      border: 'rgba(255, 255, 255, 0.08)',
      borderSolid: COLORS.forest[700],
      tabBar: 'rgba(8, 20, 10, 0.95)',
      glass: 'rgba(10, 26, 14, 0.65)',
      glow: 'rgba(34, 209, 90, 0.20)',
      slate: COLORS.slate,
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 40,
    },
    radius: {
      xs: 6,
      sm: 8,
      md: 12,
      lg: 20,
      xl: 28,
      xxl: 36,
      full: 999,
    },
    shadows: {
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 8,
      },
      premium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 0.2,
        shadowRadius: 35,
        elevation: 12,
      }
    }
  };
};

