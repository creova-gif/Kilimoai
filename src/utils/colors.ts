/**
 * KILIMO BRAND COLORS - LOCKED DESIGN SYSTEM
 * 
 * CRITICAL: This is the ONLY source of truth for colors in KILIMO.
 * DO NOT use any other greens anywhere in the application.
 * 
 * Brand Standard: Raspberry Leaf Green (#2E7D32)
 */

// ============================================
// PRIMARY BRAND COLOR (THE ONLY GREEN)
// ============================================

/**
 * Raspberry Leaf Green - KILIMO's signature brand color
 * This is the ONLY green allowed in the entire application.
 */
export const BRAND_GREEN = "#2E7D32";

// ============================================
// OPACITY VARIANTS (ALLOWED)
// ============================================

/**
 * 5% opacity - Very subtle tints
 * Usage: Hover states, very light backgrounds
 */
export const BRAND_GREEN_5 = "rgba(46, 125, 50, 0.05)";

/**
 * 8% opacity - Active background states
 * Usage: Active navigation items, selected states
 */
export const BRAND_GREEN_8 = "rgba(46, 125, 50, 0.08)";

/**
 * 15% opacity - Medium tints
 * Usage: Hover effects, subtle highlights
 */
export const BRAND_GREEN_15 = "rgba(46, 125, 50, 0.15)";

/**
 * 20% opacity - Border tints
 * Usage: Borders, dividers, subtle accents
 */
export const BRAND_GREEN_20 = "rgba(46, 125, 50, 0.20)";

/**
 * 40% opacity - Indicators
 * Usage: Status dots, loading indicators
 */
export const BRAND_GREEN_40 = "rgba(46, 125, 50, 0.40)";

/**
 * 60% opacity - Icons (inactive)
 * Usage: Inactive icon states
 */
export const BRAND_GREEN_60 = "rgba(46, 125, 50, 0.60)";

/**
 * 100% opacity - Full color
 * Usage: Active elements, primary actions
 */
export const BRAND_GREEN_100 = "rgba(46, 125, 50, 1.0)";

// ============================================
// TAILWIND CLASS HELPERS
// ============================================

/**
 * Tailwind utility classes for KILIMO brand green
 * Use these instead of generic Tailwind green classes
 */
export const TAILWIND_CLASSES = {
  // Backgrounds
  bgSolid: "bg-[#2E7D32]",
  bg5: "bg-[#2E7D32]/5",
  bg8: "bg-[#2E7D32]/8",
  bg15: "bg-[#2E7D32]/15",
  bg20: "bg-[#2E7D32]/20",
  bg40: "bg-[#2E7D32]/40",
  bg60: "bg-[#2E7D32]/60",
  bg100: "bg-[#2E7D32]",
  
  // Text
  text: "text-[#2E7D32]",
  text60: "text-[#2E7D32]/60",
  
  // Borders
  border: "border-[#2E7D32]",
  border20: "border-[#2E7D32]/20",
  
  // Ring (focus states)
  ring: "ring-[#2E7D32]",
  ringOffset: "ring-offset-[#2E7D32]",
  
  // Hover states
  hoverBg: "hover:bg-[#2E7D32]",
  hoverBg8: "hover:bg-[#2E7D32]/8",
  hoverText: "hover:text-[#2E7D32]",
  hoverBorder: "hover:border-[#2E7D32]",
} as const;

// ============================================
// NEUTRAL COLORS (ALLOWED)
// ============================================

/**
 * Neutral colors for text, backgrounds, and UI elements
 * These are safe to use throughout the application
 */
export const NEUTRALS = {
  // Whites & Grays
  white: "#FFFFFF",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",
  black: "#000000",
} as const;

// ============================================
// FUNCTIONAL COLORS (NON-GREEN)
// ============================================

/**
 * Functional colors for specific use cases
 * DO NOT use these for general branding
 */
export const FUNCTIONAL = {
  // Error / Danger
  error: "#EF4444",    // red-500
  errorDark: "#DC2626", // red-600
  
  // Warning
  warning: "#F59E0B",   // amber-500
  warningDark: "#D97706", // amber-600
  
  // Info (non-green)
  info: "#3B82F6",      // blue-500
  infoDark: "#2563EB",  // blue-600
  
  // Success - USE BRAND_GREEN INSTEAD
  // ❌ DO NOT USE emerald/lime for success
  // ✅ USE BRAND_GREEN (#2E7D32)
} as const;

// ============================================
// BANNED COLORS (DO NOT USE)
// ============================================

/**
 * ⛔ STRICTLY FORBIDDEN ⛔
 * 
 * These colors are BANNED from KILIMO codebase:
 * 
 * ALL Tailwind GREEN shades (except via #2E7D32):
 * - green-50, green-100, green-200, green-300, green-400
 * - green-500, green-600, green-700, green-800, green-900
 * 
 * ALL EMERALD shades:
 * - emerald-50 through emerald-900
 * 
 * ALL TEAL shades:
 * - teal-50 through teal-900
 * 
 * ALL CYAN shades:
 * - cyan-50 through cyan-900
 * 
 * ALL LIME shades:
 * - lime-50 through lime-900
 * 
 * ALL MULTI-COLOR GRADIENTS involving greens
 * 
 * IF YOU SEE ANY OF THESE IN THE CODE, REMOVE THEM IMMEDIATELY.
 */

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * ✅ CORRECT USAGE:
 * 
 * import { BRAND_GREEN, TAILWIND_CLASSES } from '@/utils/colors';
 * 
 * // Solid background
 * <div className={TAILWIND_CLASSES.bgSolid}>...</div>
 * 
 * // Active state
 * <div className={`${isActive ? TAILWIND_CLASSES.bg8 : ''} ${TAILWIND_CLASSES.text}`}>...</div>
 * 
 * // Border
 * <div className={`border-2 ${TAILWIND_CLASSES.border20}`}>...</div>
 * 
 * // Focus ring
 * <input className={`focus:ring-2 ${TAILWIND_CLASSES.ring}`} />
 * 
 * // Custom style
 * <div style={{ backgroundColor: BRAND_GREEN }}>...</div>
 */

/**
 * ❌ INCORRECT USAGE:
 * 
 * // Generic Tailwind greens
 * <div className="bg-green-600">...</div>  // BANNED
 * <div className="bg-emerald-500">...</div> // BANNED
 * <div className="text-teal-600">...</div>  // BANNED
 * 
 * // Multi-color gradients
 * <div className="bg-gradient-to-r from-green-500 to-emerald-600">...</div> // BANNED
 * 
 * // Hardcoded hex values (other than #2E7D32)
 * <div style={{ backgroundColor: '#10B981' }}>...</div> // BANNED (emerald-500)
 */

// ============================================
// ENFORCEMENT
// ============================================

/**
 * CI/CD Check:
 * - GitHub Actions workflow checks for banned colors on every PR
 * - Fails build if violations detected
 * 
 * Pre-commit Hook:
 * - Local git hook prevents commits with banned colors
 * 
 * ESLint Rule (TODO):
 * - Add ESLint rule to flag banned color usage
 * 
 * Design System:
 * - This file is the single source of truth
 * - All components must import from here
 */

// ============================================
// EXPORT SUMMARY
// ============================================

export default {
  // Primary brand color
  BRAND_GREEN,
  
  // Opacity variants
  BRAND_GREEN_5,
  BRAND_GREEN_8,
  BRAND_GREEN_15,
  BRAND_GREEN_20,
  BRAND_GREEN_40,
  BRAND_GREEN_60,
  BRAND_GREEN_100,
  
  // Tailwind classes
  TAILWIND_CLASSES,
  
  // Neutrals
  NEUTRALS,
  
  // Functional
  FUNCTIONAL,
};

/**
 * 🌾 KILIMO BRAND PHILOSOPHY:
 * 
 * "One Green. One Trust. One Vision."
 * 
 * - Consistency = Reliability
 * - Single brand color = Memorable identity
 * - Professional appearance = User trust
 * - Agricultural platform = Government-grade standards
 * 
 * Every green in KILIMO reinforces our brand.
 * Every green must be #2E7D32.
 * 
 * No exceptions.
 */
