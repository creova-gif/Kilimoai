/**
 * KILIMO INLINE COLOR REPLACEMENTS
 * Direct find-and-replace patterns for enforcing Raspberry Leaf Green (#2E7D32)
 */

// ============================================================================
// USAGE: Copy these patterns into your IDE's Find & Replace (with Regex ON)
// ============================================================================

/*
PATTERN 1: Background Colors
-----------------------------
Find:    \bbg-green-50\b
Replace: bg-[#2E7D32]/5

Find:    \bbg-green-100\b
Replace: bg-[#2E7D32]/10

Find:    \bbg-green-200\b
Replace: bg-[#2E7D32]/20

Find:    \bbg-green-300\b
Replace: bg-[#2E7D32]/30

Find:    \bbg-green-400\b
Replace: bg-[#2E7D32]/60

Find:    \bbg-green-500\b
Replace: bg-[#2E7D32]

Find:    \bbg-green-600\b
Replace: bg-[#2E7D32]

Find:    \bbg-green-700\b
Replace: bg-[#1B5E20]

Find:    \bbg-green-900\b
Replace: bg-[#0D3010]


PATTERN 2: Text Colors
-----------------------
Find:    \btext-green-400\b
Replace: text-[#2E7D32]/80

Find:    \btext-green-500\b
Replace: text-[#2E7D32]

Find:    \btext-green-600\b
Replace: text-[#2E7D32]

Find:    \btext-green-700\b
Replace: text-[#1B5E20]

Find:    \btext-green-900\b
Replace: text-[#0D3010]


PATTERN 3: Border Colors
-------------------------
Find:    \bborder-green-200\b
Replace: border-[#2E7D32]/30

Find:    \bborder-green-300\b
Replace: border-[#2E7D32]/40

Find:    \bborder-green-600\b
Replace: border-[#2E7D32]


PATTERN 4: Hover States
------------------------
Find:    \bhover:bg-green-50\b
Replace: hover:bg-[#2E7D32]/5

Find:    \bhover:bg-green-100\b
Replace: hover:bg-[#2E7D32]/10

Find:    \bhover:text-green-600\b
Replace: hover:text-[#2E7D32]

Find:    \bhover:border-green-300\b
Replace: hover:border-[#2E7D32]/40


PATTERN 5: Gradients - Emerald (REMOVE EMERALD)
-------------------------------------------------
Find:    \bfrom-emerald-500\b
Replace: from-[#2E7D32]

Find:    \bfrom-emerald-600\b
Replace: from-[#2E7D32]

Find:    \bto-emerald-500\b
Replace: to-[#2E7D32]

Find:    \bto-emerald-600\b
Replace: to-[#2E7D32]

Find:    \bvia-emerald-500\b
Replace: via-[#2E7D32]

Find:    \bvia-emerald-600\b
Replace: via-[#2E7D32]

Find:    \bfrom-emerald-50\b
Replace: from-[#2E7D32]/5

Find:    \bto-emerald-50\b
Replace: to-[#2E7D32]/5


PATTERN 6: Gradients - Green
-----------------------------
Find:    \bfrom-green-500\b
Replace: from-[#2E7D32]

Find:    \bfrom-green-600\b
Replace: from-[#2E7D32]

Find:    \bto-green-600\b
Replace: to-[#2E7D32]

Find:    \bvia-green-500\b
Replace: via-[#2E7D32]

Find:    \bvia-green-600\b
Replace: via-[#2E7D32]

Find:    \bfrom-green-50\b
Replace: from-[#2E7D32]/5

Find:    \bto-green-50\b
Replace: to-[#2E7D32]/5


PATTERN 7: Gradients - Teal (REMOVE TEAL)
------------------------------------------
Find:    \bto-teal-600\b
Replace: to-[#1B5E20]

Find:    \bfrom-teal-600\b
Replace: from-[#1B5E20]

Find:    \bto-teal-50\b
Replace: to-[#2E7D32]/5


PATTERN 8: Group Hover
-----------------------
Find:    \bgroup-hover:bg-green-50\b
Replace: group-hover:bg-[#2E7D32]/5

Find:    \bgroup-hover:text-green-600\b
Replace: group-hover:text-[#2E7D32]


PATTERN 9: Data States
-----------------------
Find:    \bdata-\[state=active\]:bg-gradient-to-r data-\[state=active\]:from-green-500 data-\[state=active\]:to-emerald-600
Replace: data-[state=active]:bg-[#2E7D32]

*/

// ============================================================================
// AUTOMATED REPLACEMENT MAP (for programmatic use)
// ============================================================================

export const BRAND_COLOR_REPLACEMENTS = {
  // Backgrounds
  'bg-green-50': 'bg-[#2E7D32]/5',
  'bg-green-100': 'bg-[#2E7D32]/10',
  'bg-green-200': 'bg-[#2E7D32]/20',
  'bg-green-300': 'bg-[#2E7D32]/30',
  'bg-green-400': 'bg-[#2E7D32]/60',
  'bg-green-500': 'bg-[#2E7D32]',
  'bg-green-600': 'bg-[#2E7D32]',
  'bg-green-700': 'bg-[#1B5E20]',
  'bg-green-900': 'bg-[#0D3010]',
  
  // Text
  'text-green-400': 'text-[#2E7D32]/80',
  'text-green-500': 'text-[#2E7D32]',
  'text-green-600': 'text-[#2E7D32]',
  'text-green-700': 'text-[#1B5E20]',
  'text-green-900': 'text-[#0D3010]',
  
  // Borders
  'border-green-200': 'border-[#2E7D32]/30',
  'border-green-300': 'border-[#2E7D32]/40',
  'border-green-600': 'border-[#2E7D32]',
  
  // Hovers
  'hover:bg-green-50': 'hover:bg-[#2E7D32]/5',
  'hover:bg-green-100': 'hover:bg-[#2E7D32]/10',
  'hover:bg-green-700': 'hover:bg-[#1B5E20]',
  'hover:text-green-600': 'hover:text-[#2E7D32]',
  'hover:border-green-300': 'hover:border-[#2E7D32]/40',
  
  // Gradients
  'from-emerald-600': 'from-[#2E7D32]',
  'to-emerald-600': 'to-[#2E7D32]',
  'via-emerald-600': 'via-[#2E7D32]',
  'from-green-600': 'from-[#2E7D32]',
  'to-green-600': 'to-[#2E7D32]',
  'to-teal-600': 'to-[#1B5E20]',
};
