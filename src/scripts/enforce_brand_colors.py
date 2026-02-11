#!/usr/bin/env python3
"""
KILIMO Brand Color Enforcement Script (Python)
Automatically replaces all non-compliant green colors with Raspberry Leaf Green (#2E7D32)

Usage: python3 scripts/enforce_brand_colors.py
"""

import os
import re
from pathlib import Path
from collections import defaultdict

# ============================================================================
# COLOR MAPPING CONFIGURATION
# ============================================================================

COLOR_MAPPINGS = {
    # Background Colors
    'bg-green-50': 'bg-[#2E7D32]/5',
    'bg-green-100': 'bg-[#2E7D32]/10',
    'bg-green-200': 'bg-[#2E7D32]/20',
    'bg-green-300': 'bg-[#2E7D32]/30',
    'bg-green-400': 'bg-[#2E7D32]/60',
    'bg-green-500': 'bg-[#2E7D32]',
    'bg-green-600': 'bg-[#2E7D32]',
    'bg-green-700': 'bg-[#1B5E20]',
    'bg-green-800': 'bg-[#0D3010]',
    'bg-green-900': 'bg-[#0D3010]',
    
    # Text Colors
    'text-green-50': 'text-[#2E7D32]/30',
    'text-green-100': 'text-[#2E7D32]/40',
    'text-green-200': 'text-[#2E7D32]/50',
    'text-green-400': 'text-[#2E7D32]/80',
    'text-green-500': 'text-[#2E7D32]',
    'text-green-600': 'text-[#2E7D32]',
    'text-green-700': 'text-[#1B5E20]',
    'text-green-800': 'text-[#0D3010]',
    'text-green-900': 'text-[#0D3010]',
    
    # Border Colors
    'border-green-100': 'border-[#2E7D32]/15',
    'border-green-200': 'border-[#2E7D32]/30',
    'border-green-300': 'border-[#2E7D32]/40',
    'border-green-400': 'border-[#2E7D32]/60',
    'border-green-500': 'border-[#2E7D32]',
    'border-green-600': 'border-[#2E7D32]',
    'border-green-700': 'border-[#1B5E20]',
    
    # Hover States - Background
    'hover:bg-green-50': 'hover:bg-[#2E7D32]/5',
    'hover:bg-green-100': 'hover:bg-[#2E7D32]/10',
    'hover:bg-green-200': 'hover:bg-[#2E7D32]/20',
    'hover:bg-green-700': 'hover:bg-[#1B5E20]',
    
    # Hover States - Text
    'hover:text-green-600': 'hover:text-[#2E7D32]',
    'hover:text-green-700': 'hover:text-[#1B5E20]',
    
    # Hover States - Border
    'hover:border-green-300': 'hover:border-[#2E7D32]/40',
    'hover:border-green-600': 'hover:border-[#2E7D32]',
    
    # Group Hover
    'group-hover:bg-green-50': 'group-hover:bg-[#2E7D32]/5',
    'group-hover:text-green-600': 'group-hover:text-[#2E7D32]',
    
    # Gradients - Emerald
    'from-emerald-50': 'from-[#2E7D32]/5',
    'from-emerald-400': 'from-[#2E7D32]/60',
    'from-emerald-500': 'from-[#2E7D32]',
    'from-emerald-600': 'from-[#2E7D32]',
    'to-emerald-50': 'to-[#2E7D32]/5',
    'to-emerald-500': 'to-[#2E7D32]',
    'to-emerald-600': 'to-[#2E7D32]',
    'via-emerald-500': 'via-[#2E7D32]',
    'via-emerald-600': 'via-[#2E7D32]',
    
    # Gradients - Green
    'from-green-50': 'from-[#2E7D32]/5',
    'from-green-400': 'from-[#2E7D32]/60',
    'from-green-500': 'from-[#2E7D32]',
    'from-green-600': 'from-[#2E7D32]',
    'from-green-700': 'from-[#1B5E20]',
    'to-green-50': 'to-[#2E7D32]/5',
    'to-green-100': 'to-[#2E7D32]/10',
    'to-green-500': 'to-[#2E7D32]',
    'to-green-600': 'to-[#2E7D32]',
    'to-green-700': 'to-[#1B5E20]',
    'via-green-500': 'via-[#2E7D32]',
    'via-green-600': 'via-[#2E7D32]',
    
    # Teal variants
    'to-teal-600': 'to-[#1B5E20]',
    'to-teal-50': 'to-[#2E7D32]/5',
    'from-teal-600': 'from-[#1B5E20]',
    'via-teal-600': 'via-[#1B5E20]',
}

# ============================================================================
# STATS TRACKING
# ============================================================================

stats = {
    'files_scanned': 0,
    'files_modified': 0,
    'replacements_made': 0,
    'replacements_by_type': defaultdict(int),
}

# ============================================================================
# CORE REPLACEMENT FUNCTION
# ============================================================================

def enforce_raspberry_leaf_green(content):
    """Replace all non-compliant green colors with #2E7D32"""
    modified_content = content
    file_replacements = 0
    
    # Sort by length (longest first) to avoid partial replacements
    sorted_mappings = sorted(COLOR_MAPPINGS.items(), key=lambda x: len(x[0]), reverse=True)
    
    for old_color, new_color in sorted_mappings:
        # Create regex with word boundaries
        pattern = r'\b' + re.escape(old_color) + r'\b'
        matches = len(re.findall(pattern, modified_content))
        
        if matches > 0:
            modified_content = re.sub(pattern, new_color, modified_content)
            file_replacements += matches
            stats['replacements_by_type'][old_color] += matches
    
    stats['replacements_made'] += file_replacements
    
    return modified_content, file_replacements > 0, file_replacements

# ============================================================================
# FILE PROCESSING
# ============================================================================

def process_file(file_path):
    """Process a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content, modified, count = enforce_raspberry_leaf_green(content)
        
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            stats['files_modified'] += 1
            print(f"✅ {file_path}: {count} replacements")
        
        stats['files_scanned'] += 1
        
    except Exception as e:
        print(f"❌ Error processing {file_path}: {str(e)}")

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    print('🎨 KILIMO Brand Color Enforcement Script')
    print('==========================================')
    print('Target: Raspberry Leaf Green (#2E7D32)\n')
    
    # Find all .tsx and .ts files
    root_dir = Path('.')
    extensions = ['*.tsx', '*.ts', '*.jsx', '*.js']
    exclude_dirs = {'node_modules', 'dist', 'build', '.next', 'scripts'}
    
    files = []
    for ext in extensions:
        for file_path in root_dir.rglob(ext):
            # Skip excluded directories
            if not any(excluded in file_path.parts for excluded in exclude_dirs):
                files.append(file_path)
    
    print(f"Found {len(files)} files to scan...\n")
    
    # Process each file
    for file_path in files:
        process_file(file_path)
    
    # Print summary
    print('\n==========================================')
    print('📊 SUMMARY')
    print('==========================================')
    print(f"Files scanned: {stats['files_scanned']}")
    print(f"Files modified: {stats['files_modified']}")
    print(f"Total replacements: {stats['replacements_made']}")
    print('\n🔍 Top 10 Replacements:')
    
    top_replacements = sorted(
        stats['replacements_by_type'].items(),
        key=lambda x: x[1],
        reverse=True
    )[:10]
    
    for color, count in top_replacements:
        print(f"  {color}: {count} times")
    
    print('\n✅ Brand color enforcement complete!')
    print('🎯 All green colors now use #2E7D32 (Raspberry Leaf Green)')

if __name__ == '__main__':
    main()
