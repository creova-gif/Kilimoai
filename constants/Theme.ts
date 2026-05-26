/**
 * Kilimo AI — Design Token System
 *
 * Rules:
 *  - Spacing: strict 8-point grid (4, 8, 16, 24, 32, 40, 48, 64)
 *  - Greens: ink (#1B5E20) for emphasis, action (#2E7D32) for CTAs only,
 *            tint (#F0FFF4) for backgrounds — never use all three on one surface
 *  - Type scale: 6 steps — display, heading, subheading, body, caption, label
 *  - Shadows: 3 tiers — none / sm (card elevation) / md (modal elevation)
 */

import { useColorScheme } from 'react-native';

// ─── Colour Palette ───────────────────────────────────────────────────────────

export const PALETTE = {
  // Greens — used with discipline
  greenInk:    '#1B5E20',  // headings, emphasis text on tint surfaces
  greenAction: '#2E7D32',  // primary buttons, active indicators ONLY
  greenTint:   '#F0FFF4',  // card backgrounds, chip fills — never borders

  // Neutrals
  ink:         '#0F1923',  // primary text (rich near-black, not pure black)
  inkMid:      '#3D4C5E',  // secondary text
  inkMute:     '#7A8A9B',  // tertiary text, placeholders
  line:        '#E8ECF0',  // dividers, input borders
  surface:     '#F7F9FC',  // page background (off-white, not stark white)
  white:       '#FFFFFF',  // card backgrounds, modals

  // Functional
  amber:       '#D97706',
  amberTint:   '#FFFBEB',
  red:         '#DC2626',
  redTint:     '#FEF2F2',
  blue:        '#2563EB',
  blueTint:    '#EFF6FF',
} as const;

// ─── Spacing — 8-point grid ────────────────────────────────────────────────

export const SPACE = {
  '1': 4,
  '2': 8,
  '3': 16,   // standard margin / gap
  '4': 24,   // section gap
  '5': 32,
  '6': 40,
  '7': 48,
  '8': 64,
} as const;

// ─── Typography ────────────────────────────────────────────────────────────

export const TYPE = {
  display:     { fontSize: 36, lineHeight: 44, fontFamily: 'Inter_900Black',     letterSpacing: -1.2 },
  heading:     { fontSize: 22, lineHeight: 28, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.5 },
  subheading:  { fontSize: 17, lineHeight: 24, fontFamily: 'Inter_700Bold',      letterSpacing: -0.2 },
  body:        { fontSize: 15, lineHeight: 22, fontFamily: 'Inter_400Regular',   letterSpacing: 0    },
  bodyMed:     { fontSize: 15, lineHeight: 22, fontFamily: 'Inter_500Medium',    letterSpacing: 0    },
  bodySemi:    { fontSize: 15, lineHeight: 22, fontFamily: 'Inter_600SemiBold',  letterSpacing: 0    },
  caption:     { fontSize: 13, lineHeight: 18, fontFamily: 'Inter_400Regular',   letterSpacing: 0    },
  captionMed:  { fontSize: 13, lineHeight: 18, fontFamily: 'Inter_500Medium',    letterSpacing: 0    },
  captionBold: { fontSize: 13, lineHeight: 18, fontFamily: 'Inter_700Bold',      letterSpacing: 0    },
  label:       { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_700Bold',      letterSpacing: 0.8, textTransform: 'uppercase' as const },
} as const;

// ─── Shadows — 3 tiers ─────────────────────────────────────────────────────

export const SHADOW = {
  none: {},
  sm: {
    shadowColor: '#0F1923',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F1923',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#0F1923',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

// ─── Border Radius ─────────────────────────────────────────────────────────

export const RADIUS = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 999,
} as const;

// ─── useTheme hook (legacy compat + convenience) ───────────────────────────

export const useTheme = () => {
  // Force light mode — Kilimo AI is a light-only app
  return {
    isDark: false,
    colors: {
      primary:       PALETTE.greenAction,
      primaryDark:   PALETTE.greenInk,
      primaryLight:  PALETTE.greenTint,
      background:    PALETTE.surface,
      card:          PALETTE.white,
      cardSolid:     PALETTE.white,
      text:          PALETTE.ink,
      textMute:      PALETTE.inkMute,
      border:        PALETTE.line,
      borderSolid:   PALETTE.line,
      tabBar:        PALETTE.white,
      glass:         'rgba(255,255,255,0.96)',
      success:       PALETTE.greenAction,
      warning:       PALETTE.amber,
      error:         PALETTE.red,
      info:          PALETTE.blue,
      // expose palette tiers for direct use
      slate: {
        50:  '#F9FAFB',
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
    },
    spacing: {
      xs:   SPACE['1'],
      sm:   SPACE['2'],
      md:   SPACE['3'],
      lg:   SPACE['4'],
      xl:   SPACE['5'],
      xxl:  SPACE['6'],
      huge: SPACE['7'],
    },
    radius: {
      xs:   4,
      sm:   RADIUS.sm,
      md:   RADIUS.md,
      lg:   RADIUS.lg,
      xl:   RADIUS.xl,
      xxl:  32,
      full: RADIUS.full,
    },
    shadows: {
      sm:      SHADOW.sm,
      md:      SHADOW.md,
      lg:      SHADOW.lg,
      premium: SHADOW.lg,
    },
    type: TYPE,
    palette: PALETTE,
    space:   SPACE,
    shadow:  SHADOW,
  };
};
