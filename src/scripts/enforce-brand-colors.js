#!/usr/bin/env node

/**
 * KILIMO Brand Color Enforcement Script
 * Automatically replaces all non-compliant green colors with Raspberry Leaf Green (#2E7D32)
 * 
 * Usage: node scripts/enforce-brand-colors.js
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// ============================================================================
// COLOR MAPPING CONFIGURATION
// ============================================================================

const COLOR_MAPPINGS = {
  // Background Colors
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
  
  // Text Colors
  'text-green-50': 'text-[#2E7D32]/30',
  'text-green-100': 'text-[#2E7D32]/40',
  'text-green-200': 'text-[#2E7D32]/50',
  'text-green-300': 'text-[#2E7D32]/60',
  'text-green-400': 'text-[#2E7D32]/80',
  'text-green-500': 'text-[#2E7D32]',
  'text-green-600': 'text-[#2E7D32]',
  'text-green-700': 'text-[#1B5E20]',
  'text-green-800': 'text-[#0D3010]',
  'text-green-900': 'text-[#0D3010]',
  
  // Border Colors
  'border-green-50': 'border-[#2E7D32]/10',
  'border-green-100': 'border-[#2E7D32]/15',
  'border-green-200': 'border-[#2E7D32]/30',
  'border-green-300': 'border-[#2E7D32]/40',
  'border-green-400': 'border-[#2E7D32]/60',
  'border-green-500': 'border-[#2E7D32]',
  'border-green-600': 'border-[#2E7D32]',
  'border-green-700': 'border-[#1B5E20]',
  'border-green-800': 'border-[#0D3010]',
  'border-green-900': 'border-[#0D3010]',
  
  // Hover States - Background
  'hover:bg-green-50': 'hover:bg-[#2E7D32]/5',
  'hover:bg-green-100': 'hover:bg-[#2E7D32]/10',
  'hover:bg-green-200': 'hover:bg-[#2E7D32]/20',
  'hover:bg-green-300': 'hover:bg-[#2E7D32]/30',
  'hover:bg-green-500': 'hover:bg-[#2E7D32]',
  'hover:bg-green-600': 'hover:bg-[#2E7D32]',
  'hover:bg-green-700': 'hover:bg-[#1B5E20]',
  
  // Hover States - Text
  'hover:text-green-600': 'hover:text-[#2E7D32]',
  'hover:text-green-700': 'hover:text-[#1B5E20]',
  
  // Hover States - Border
  'hover:border-green-300': 'hover:border-[#2E7D32]/40',
  'hover:border-green-500': 'hover:border-[#2E7D32]',
  'hover:border-green-600': 'hover:border-[#2E7D32]',
  
  // Group Hover States
  'group-hover:bg-green-50': 'group-hover:bg-[#2E7D32]/5',
  'group-hover:text-green-600': 'group-hover:text-[#2E7D32]',
  
  // From/To/Via (Gradients) - Emerald variants
  'from-emerald-50': 'from-[#2E7D32]/5',
  'from-emerald-400': 'from-[#2E7D32]/60',
  'from-emerald-500': 'from-[#2E7D32]',
  'from-emerald-600': 'from-[#2E7D32]',
  'to-emerald-50': 'to-[#2E7D32]/5',
  'to-emerald-500': 'to-[#2E7D32]',
  'to-emerald-600': 'to-[#2E7D32]',
  'via-emerald-500': 'via-[#2E7D32]',
  'via-emerald-600': 'via-[#2E7D32]',
  
  // From/To/Via (Gradients) - Green variants
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
  
  // Teal variants (often used with green) - Remove or replace
  'to-teal-600': 'to-[#1B5E20]',
  'to-teal-50': 'to-[#2E7D32]/5',
  'from-teal-600': 'from-[#1B5E20]',
  'via-teal-600': 'via-[#1B5E20]',
};

// ============================================================================
// STATS TRACKING
// ============================================================================

const stats = {
  filesScanned: 0,
  filesModified: 0,
  replacementsMade: 0,
  replacementsByType: {},
};

// ============================================================================
// CORE REPLACEMENT FUNCTION
// ============================================================================

function enforceRaspberryLeafGreen(content) {
  let modifiedContent = content;
  let fileReplacements = 0;
  
  // Sort mappings by length (longest first) to avoid partial replacements
  const sortedMappings = Object.entries(COLOR_MAPPINGS).sort((a, b) => b[0].length - a[0].length);
  
  for (const [oldColor, newColor] of sortedMappings) {
    // Create a regex that matches the exact class name (with word boundaries)
    const regex = new RegExp(`\\b${oldColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    
    const matches = (modifiedContent.match(regex) || []).length;
    
    if (matches > 0) {
      modifiedContent = modifiedContent.replace(regex, newColor);
      fileReplacements += matches;
      
      // Track by type
      stats.replacementsByType[oldColor] = (stats.replacementsByType[oldColor] || 0) + matches;
    }
  }
  
  stats.replacementsMade += fileReplacements;
  
  return {
    content: modifiedContent,
    modified: fileReplacements > 0,
    count: fileReplacements,
  };
}

// ============================================================================
// FILE PROCESSING
// ============================================================================

async function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = enforceRaspberryLeafGreen(content);
    
    if (result.modified) {
      fs.writeFileSync(filePath, result.content, 'utf8');
      stats.filesModified++;
      console.log(`✅ ${filePath}: ${result.count} replacements`);
    }
    
    stats.filesScanned++;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🎨 KILIMO Brand Color Enforcement Script');
  console.log('==========================================');
  console.log('Target: Raspberry Leaf Green (#2E7D32)\n');
  
  // Find all .tsx files (excluding node_modules and build directories)
  const files = await glob('**/*.{tsx,ts,jsx,js}', {
    ignore: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/scripts/**', // Don't modify the script itself
    ],
  });
  
  console.log(`Found ${files.length} files to scan...\n`);
  
  // Process each file
  for (const file of files) {
    await processFile(file);
  }
  
  // Print summary
  console.log('\n==========================================');
  console.log('📊 SUMMARY');
  console.log('==========================================');
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Total replacements: ${stats.replacementsMade}`);
  console.log('\n🔍 Top Replacements:');
  
  const topReplacements = Object.entries(stats.replacementsByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  topReplacements.forEach(([color, count]) => {
    console.log(`  ${color}: ${count} times`);
  });
  
  console.log('\n✅ Brand color enforcement complete!');
  console.log('🎯 All green colors now use #2E7D32 (Raspberry Leaf Green)');
}

// Run the script
main().catch(console.error);
