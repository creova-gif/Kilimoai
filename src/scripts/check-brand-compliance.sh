#!/bin/bash

###############################################################################
# KILIMO AGRI-AI SUITE - BRAND COMPLIANCE CHECKER
# 
# Purpose: Block commits that violate brand color guidelines
# ✅ Enforces ONLY #2E7D32 (Raspberry Leaf Green)
# ❌ Blocks: gradients, non-brand colors, decorative UI
# 
# Usage: ./scripts/check-brand-compliance.sh
# Exit Code: 0 = Pass, 1 = Violations found
###############################################################################

set -e

VIOLATIONS_FOUND=0
TEMP_FILE=$(mktemp)

echo "=================================================="
echo "🔍 KILIMO AI - Brand Compliance Check"
echo "=================================================="
echo ""

# Define forbidden patterns
declare -a FORBIDDEN_PATTERNS=(
  "green-[0-9]"
  "emerald-"
  "teal-"
  "cyan-"
  "lime-"
  "blue-[0-9]"
  "purple-"
  "pink-"
  "red-[0-9]"
  "yellow-[0-9]"
  "orange-"
  "sky-"
  "indigo-"
  "violet-"
  "fuchsia-"
  "rose-"
  "amber-"
  "from-"
  "to-"
  "via-"
  "bg-gradient"
  "text-gradient"
)

# Check all TypeScript/TSX files
echo "📁 Scanning TypeScript files..."
echo ""

for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
  echo "🔎 Checking for pattern: $pattern"
  
  # Search in all .tsx and .ts files, excluding node_modules and build dirs
  if grep -r \
    --include="*.tsx" \
    --include="*.ts" \
    --exclude-dir="node_modules" \
    --exclude-dir="dist" \
    --exclude-dir="build" \
    --exclude-dir=".next" \
    -n "$pattern" . > "$TEMP_FILE" 2>/dev/null; then
    
    VIOLATIONS_FOUND=1
    echo "❌ VIOLATIONS FOUND:"
    cat "$TEMP_FILE"
    echo ""
  fi
done

# Check for gradient keywords
echo "🔎 Checking for gradient usage..."
if grep -r \
  --include="*.tsx" \
  --include="*.ts" \
  --exclude-dir="node_modules" \
  --exclude-dir="dist" \
  --exclude-dir="build" \
  --exclude-dir=".next" \
  -n "gradient" . > "$TEMP_FILE" 2>/dev/null; then
  
  VIOLATIONS_FOUND=1
  echo "❌ GRADIENT VIOLATIONS FOUND:"
  cat "$TEMP_FILE"
  echo ""
fi

# Clean up
rm -f "$TEMP_FILE"

echo "=================================================="
if [ $VIOLATIONS_FOUND -eq 0 ]; then
  echo "✅ PASS: No brand violations detected"
  echo "=================================================="
  exit 0
else
  echo "❌ FAIL: Brand violations detected"
  echo ""
  echo "ALLOWED COLORS:"
  echo "  • #2E7D32 (Raspberry Leaf Green)"
  echo "  • rgba(46,125,50,X)"
  echo "  • White/Gray for backgrounds"
  echo ""
  echo "FORBIDDEN:"
  echo "  • All gradients (from-, to-, via-)"
  echo "  • Color utilities: green-[number], blue-, purple-, etc."
  echo "  • Animated glows and decorative elements"
  echo ""
  echo "FIX: Use components from /components/ai-ui/"
  echo "=================================================="
  exit 1
fi
