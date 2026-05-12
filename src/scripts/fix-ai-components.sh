#!/bin/bash

###############################################################################
# KILIMO AGRI-AI SUITE - AI COMPONENT FIXER
# 
# Purpose: Automated fixing of brand violations in AI components
# Strategy: Replace color-coded elements with brand-compliant alternatives
# 
# Usage: ./scripts/fix-ai-components.sh
###############################################################################

set -e

echo "=================================================="
echo "🔧 KILIMO AI - Component Auto-Fixer"
echo "=================================================="
echo ""

AI_COMPONENTS=(
  "components/AIRecommendationEngine.tsx"
  "components/AISupport.tsx"
  "components/AITrainingHub.tsx"
  "components/AIChatbot.tsx"
  "components/AICreditsWarning.tsx"
  "components/AIFarmPlanGenerator.tsx"
)

echo "📋 Components to fix:"
for component in "${AI_COMPONENTS[@]}"; do
  if [ -f "$component" ]; then
    echo "  ✅ $component"
  else
    echo "  ⚠️  $component (not found)"
  fi
done
echo ""

echo "🔧 Starting automated fixes..."
echo ""

# Pattern replacements
declare -A REPLACEMENTS=(
  ["text-green-600"]="text-[#2E7D32]"
  ["text-green-700"]="text-[#2E7D32]"
  ["bg-green-50"]="bg-[#2E7D32]/5"
  ["bg-green-100"]="bg-[#2E7D32]/10"
  ["hover:bg-green-50"]="hover:bg-[#2E7D32]/5"
  ["hover:bg-green-100"]="hover:bg-[#2E7D32]/10"
  ["border-green-200"]="border-[#2E7D32]/20"
  ["border-green-300"]="border-[#2E7D32]/30"
  ["from-green-500"]="from-[#2E7D32]"
  ["to-green-600"]="to-[#2E7D32]"
  
  # Replace all other colors with neutral grays
  ["text-blue-600"]="text-gray-700"
  ["text-red-600"]="text-gray-700"
  ["text-purple-600"]="text-gray-700"
  ["text-cyan-600"]="text-gray-700"
  ["text-orange-600"]="text-gray-700"
  
  ["bg-blue-50"]="bg-gray-50"
  ["bg-red-50"]="bg-gray-50"
  ["bg-purple-50"]="bg-gray-50"
  ["bg-cyan-50"]="bg-gray-50"
  ["bg-orange-50"]="bg-gray-50"
  ["bg-yellow-50"]="bg-gray-50"
  
  ["hover:bg-blue-100"]="hover:bg-gray-100"
  ["hover:bg-red-100"]="hover:bg-gray-100"
  ["hover:bg-purple-100"]="hover:bg-gray-100"
  ["hover:bg-cyan-100"]="hover:bg-gray-100"
  ["hover:bg-orange-100"]="hover:bg-gray-100"
)

for component in "${AI_COMPONENTS[@]}"; do
  if [ -f "$component" ]; then
    echo "🔧 Fixing: $component"
    
    for pattern in "${!REPLACEMENTS[@]}"; do
      replacement="${REPLACEMENTS[$pattern]}"
      sed -i.bak "s/$pattern/$replacement/g" "$component"
    done
    
    # Remove backup files
    rm -f "${component}.bak"
    
    echo "  ✅ Fixed"
  fi
done

echo ""
echo "=================================================="
echo "✅ Automated fixes complete"
echo ""
echo "NEXT STEPS:"
echo "  1. Review changes: git diff"
echo "  2. Test components manually"
echo "  3. Run: ./scripts/check-brand-compliance.sh"
echo "  4. Commit: git commit -m 'fix: AI brand violations'"
echo "=================================================="
