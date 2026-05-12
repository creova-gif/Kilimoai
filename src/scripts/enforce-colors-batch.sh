#!/bin/bash

# KILIMO Brand Color Enforcement - Automated Batch Script
# This script applies all color replacements across the codebase

echo "🎨 KILIMO BRAND COLOR ENFORCEMENT"
echo "=================================="
echo "Target: Raspberry Leaf Green (#2E7D32)"
echo ""

# Counter for tracking
FILES_MODIFIED=0
TOTAL_REPLACEMENTS=0

# Function to replace colors in a file
replace_colors() {
    local file=$1
    local modified=false
    
    echo "Processing: $file"
    
    # Background colors
    if grep -q "bg-green-50" "$file"; then
        sed -i.bak 's/\bbg-green-50\b/bg-[#2E7D32]\/5/g' "$file"
        modified=true
    fi
    
    if grep -q "bg-green-100" "$file"; then
        sed -i.bak 's/\bbg-green-100\b/bg-[#2E7D32]\/10/g' "$file"
        modified=true
    fi
    
    if grep -q "bg-green-200" "$file"; then
        sed -i.bak 's/\bbg-green-200\b/bg-[#2E7D32]\/20/g' "$file"
        modified=true
    fi
    
    if grep -q "bg-green-300" "$file"; then
        sed -i.bak 's/\bbg-green-300\b/bg-[#2E7D32]\/30/g' "$file"
        modified=true
    fi
    
    if grep -q "bg-green-400" "$file"; then
        sed -i.bak 's/\bbg-green-400\b/bg-[#2E7D32]\/60/g' "$file"
        modified=true
    fi
    
    if grep -q "bg-green-500" "$file"; then
        sed -i.bak 's/\bbg-green-500\b/bg-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    if grep -q "bg-green-600" "$file"; then
        sed -i.bak 's/\bbg-green-600\b/bg-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    if grep -q "bg-green-700" "$file"; then
        sed -i.bak 's/\bbg-green-700\b/bg-[#1B5E20]/g' "$file"
        modified=true
    fi
    
    # Text colors
    if grep -q "text-green-400" "$file"; then
        sed -i.bak 's/\btext-green-400\b/text-[#2E7D32]\/80/g' "$file"
        modified=true
    fi
    
    if grep -q "text-green-500" "$file"; then
        sed -i.bak 's/\btext-green-500\b/text-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    if grep -q "text-green-600" "$file"; then
        sed -i.bak 's/\btext-green-600\b/text-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    if grep -q "text-green-700" "$file"; then
        sed -i.bak 's/\btext-green-700\b/text-[#1B5E20]/g' "$file"
        modified=true
    fi
    
    # Border colors
    if grep -q "border-green-200" "$file"; then
        sed -i.bak 's/\bborder-green-200\b/border-[#2E7D32]\/30/g' "$file"
        modified=true
    fi
    
    if grep -q "border-green-300" "$file"; then
        sed -i.bak 's/\bborder-green-300\b/border-[#2E7D32]\/40/g' "$file"
        modified=true
    fi
    
    if grep -q "border-green-600" "$file"; then
        sed -i.bak 's/\bborder-green-600\b/border-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    # Hover states
    if grep -q "hover:bg-green-50" "$file"; then
        sed -i.bak 's/\bhover:bg-green-50\b/hover:bg-[#2E7D32]\/5/g' "$file"
        modified=true
    fi
    
    if grep -q "hover:bg-green-100" "$file"; then
        sed -i.bak 's/\bhover:bg-green-100\b/hover:bg-[#2E7D32]\/10/g' "$file"
        modified=true
    fi
    
    if grep -q "hover:text-green-600" "$file"; then
        sed -i.bak 's/\bhover:text-green-600\b/hover:text-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    # Gradients - Emerald (remove emerald)
    if grep -q "from-emerald-600" "$file"; then
        sed -i.bak 's/\bfrom-emerald-600\b/from-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    if grep -q "to-emerald-600" "$file"; then
        sed -i.bak 's/\bto-emerald-600\b/to-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    if grep -q "via-emerald-600" "$file"; then
        sed -i.bak 's/\bvia-emerald-600\b/via-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    if grep -q "from-emerald-500" "$file"; then
        sed -i.bak 's/\bfrom-emerald-500\b/from-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    if grep -q "to-emerald-500" "$file"; then
        sed -i.bak 's/\bto-emerald-500\b/to-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    if grep -q "from-emerald-50" "$file"; then
        sed -i.bak 's/\bfrom-emerald-50\b/from-[#2E7D32]\/5/g' "$file"
        modified=true
    fi
    
    if grep -q "to-emerald-50" "$file"; then
        sed -i.bak 's/\bto-emerald-50\b/to-[#2E7D32]\/5/g' "$file"
        modified=true
    fi
    
    # Gradients - Green
    if grep -q "from-green-600" "$file"; then
        sed -i.bak 's/\bfrom-green-600\b/from-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    if grep -q "to-green-600" "$file"; then
        sed -i.bak 's/\bto-green-600\b/to-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    if grep -q "via-green-600" "$file"; then
        sed -i.bak 's/\bvia-green-600\b/via-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    if grep -q "from-green-500" "$file"; then
        sed -i.bak 's/\bfrom-green-500\b/from-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    if grep -q "to-green-500" "$file"; then
        sed -i.bak 's/\bto-green-500\b/to-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    if grep -q "via-green-500" "$file"; then
        sed -i.bak 's/\bvia-green-500\b/via-[#2E7D32]/g' "$file"
        modified=true
    fi
    
    if grep -q "from-green-50" "$file"; then
        sed -i.bak 's/\bfrom-green-50\b/from-[#2E7D32]\/5/g' "$file"
        modified=true
    fi
    
    if grep -q "to-green-50" "$file"; then
        sed -i.bak 's/\bto-green-50\b/to-[#2E7D32]\/5/g' "$file"
        modified=true
    fi
    
    # Teal (remove teal)
    if grep -q "to-teal-600" "$file"; then
        sed -i.bak 's/\bto-teal-600\b/to-[#1B5E20]/g' "$file"
        modified=true
    fi
    
    if grep -q "from-teal-600" "$file"; then
        sed -i.bak 's/\bfrom-teal-600\b/from-[#1B5E20]/g' "$file"
        modified=true
    fi
    
    # Clean up backup file
    rm -f "$file.bak"
    
    if [ "$modified" = true ]; then
        ((FILES_MODIFIED++))
        echo "  ✅ Modified"
    else
        echo "  ⏭️  No changes needed"
    fi
}

# Process all TSX files
echo "Scanning for .tsx files..."
find . -name "*.tsx" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/build/*" | while read file; do
    replace_colors "$file"
done

echo ""
echo "=================================="
echo "📊 SUMMARY"
echo "=================================="
echo "Files modified: $FILES_MODIFIED"
echo "✅ Brand color enforcement complete!"
echo "🎯 All green colors now use #2E7D32"

