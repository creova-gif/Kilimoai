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
Find:    \bbg-[#2E7D32]/5\b
Replace: bg-[#2E7D32]/5

Find:    \bbg-[#2E7D32]/10\b
Replace: bg-[#2E7D32]/10

Find:    \bbg-[#2E7D32]/20\b
Replace: bg-[#2E7D32]/20

Find:    \bbg-[#2E7D32]/30\b
Replace: bg-[#2E7D32]/30

Find:    \bbg-[#2E7D32]/30\b
Replace: bg-[#2E7D32]/60

Find:    \bbg-[#2E7D32]\b
Replace: bg-[#2E7D32]

Find:    \bbg-[#2E7D32]\b
Replace: bg-[#2E7D32]

Find:    \bbg-[#2E7D32]\b
Replace: bg-[#1B5E20]

Find:    \bbg-[#2E7D32]\b
Replace: bg-[#0D3010]


PATTERN 2: Text Colors
-----------------------
Find:    \btext-[#2E7D32]\b
Replace: text-[#2E7D32]/80

Find:    \btext-[#2E7D32]\b
Replace: text-[#2E7D32]

Find:    \btext-[#2E7D32]\b
Replace: text-[#2E7D32]

Find:    \btext-[#2E7D32]\b
Replace: text-[#1B5E20]

Find:    \btext-[#2E7D32]\b
Replace: text-[#0D3010]


PATTERN 3: Border Colors
-------------------------
Find:    \bborder-[#2E7D32]/20\b
Replace: border-[#2E7D32]/30

Find:    \bborder-[#2E7D32]/20\b
Replace: border-[#2E7D32]/40

Find:    \bborder-[#2E7D32]/20\b
Replace: border-[#2E7D32]


PATTERN 4: Hover States
------------------------
Find:    \bhover:bg-[#2E7D32]/5\b
Replace: hover:bg-[#2E7D32]/5

Find:    \bhover:bg-[#2E7D32]/10\b
Replace: hover:bg-[#2E7D32]/10

Find:    \bhover:text-[#2E7D32]\b
Replace: hover:text-[#2E7D32]

Find:    \bhover:border-[#2E7D32]/20\b
Replace: hover:border-[#2E7D32]/40


PATTERN 5: Gradients - Emerald (REMOVE EMERALD)
-------------------------------------------------
Find:    \bfrom-[#2E7D32]\b
Replace: from-[#2E7D32]

Find:    \bfrom-[#2E7D32]\b
Replace: from-[#2E7D32]

Find:    \bto-gray-100\b
Replace: to-gray-100

Find:    \bto-gray-100\b
Replace: to-gray-100

Find:    \bvia-[#2E7D32]\b
Replace: via-[#2E7D32]

Find:    \bvia-[#2E7D32]\b
Replace: via-[#2E7D32]

Find:    \bfrom-[#2E7D32]\b
Replace: from-[#2E7D32]/5

Find:    \bto-gray-100\b
Replace: to-gray-100/5


PATTERN 6: Gradients - Green
-----------------------------
Find:    \bfrom-[#2E7D32]\b
Replace: from-[#2E7D32]

Find:    \bfrom-[#2E7D32]\b
Replace: from-[#2E7D32]

Find:    \bto-gray-100\b
Replace: to-gray-100

Find:    \bvia-[#2E7D32]\b
Replace: via-[#2E7D32]

Find:    \bvia-[#2E7D32]\b
Replace: via-[#2E7D32]

Find:    \bfrom-[#2E7D32]\b
Replace: from-[#2E7D32]/5

Find:    \bto-gray-100\b
Replace: to-gray-100/5


PATTERN 7: Gradients - Teal (REMOVE TEAL)
------------------------------------------
Find:    \bto-gray-100\b
Replace: to-[#1B5E20]

Find:    \bfrom-gray-50\b
Replace: from-gray-50

Find:    \bto-gray-100\b
Replace: to-gray-100/5


PATTERN 8: Group Hover
-----------------------
Find:    \bgroup-hover:bg-[#2E7D32]/5\b
Replace: group-hover:bg-[#2E7D32]/5

Find:    \bgroup-hover:text-[#2E7D32]\b
Replace: group-hover:text-[#2E7D32]


PATTERN 9: Data States
-----------------------
Find:    \bdata-\[state=active\]:bg-gradient-to-r data-\[state=active\]:from-[#2E7D32] data-\[state=active\]:to-gray-100
Replace: data-[state=active]:bg-[#2E7D32]

*/

// ============================================================================
// AUTOMATED REPLACEMENT MAP (for programmatic use)
// ============================================================================

export const BRAND_COLOR_REPLACEMENTS = {
  // Backgrounds
  'bg-[#2E7D32]/5': 'bg-[#2E7D32]/5',
  'bg-[#2E7D32]/10': 'bg-[#2E7D32]/10',
  'bg-[#2E7D32]/20': 'bg-[#2E7D32]/20',
  'bg-[#2E7D32]/30': 'bg-[#2E7D32]/30',
  'bg-[#2E7D32]/30': 'bg-[#2E7D32]/60',
  'bg-[#2E7D32]': 'bg-[#2E7D32]',
  'bg-[#2E7D32]': 'bg-[#2E7D32]',
  'bg-[#2E7D32]': 'bg-[#1B5E20]',
  'bg-[#2E7D32]': 'bg-[#0D3010]',
  
  // Text
  'text-[#2E7D32]': 'text-[#2E7D32]/80',
  'text-[#2E7D32]': 'text-[#2E7D32]',
  'text-[#2E7D32]': 'text-[#2E7D32]',
  'text-[#2E7D32]': 'text-[#1B5E20]',
  'text-[#2E7D32]': 'text-[#0D3010]',
  
  // Borders
  'border-[#2E7D32]/20': 'border-[#2E7D32]/30',
  'border-[#2E7D32]/20': 'border-[#2E7D32]/40',
  'border-[#2E7D32]/20': 'border-[#2E7D32]',
  
  // Hovers
  'hover:bg-[#2E7D32]/5': 'hover:bg-[#2E7D32]/5',
  'hover:bg-[#2E7D32]/10': 'hover:bg-[#2E7D32]/10',
  'hover:bg-[#2E7D32]': 'hover:bg-[#1B5E20]',
  'hover:text-[#2E7D32]': 'hover:text-[#2E7D32]',
  'hover:border-[#2E7D32]/20': 'hover:border-[#2E7D32]/40',
  
  // Gradients
  'from-[#2E7D32]': 'from-[#2E7D32]',
  'to-gray-100': 'to-gray-100',
  'via-[#2E7D32]': 'via-[#2E7D32]',
  'from-[#2E7D32]': 'from-[#2E7D32]',
  'to-gray-100': 'to-gray-100',
  'to-gray-100': 'to-[#1B5E20]',
};
