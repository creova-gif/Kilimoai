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
  'bg-[#2E7D32]/5': 'bg-[#2E7D32]/5',
  'bg-[#2E7D32]/10': 'bg-[#2E7D32]/10',
  'bg-[#2E7D32]/20': 'bg-[#2E7D32]/20',
  'bg-[#2E7D32]/30': 'bg-[#2E7D32]/30',
  'bg-[#2E7D32]/30': 'bg-[#2E7D32]/60',
  'bg-[#2E7D32]': 'bg-[#2E7D32]',
  'bg-[#2E7D32]': 'bg-[#2E7D32]',
  'bg-[#2E7D32]': 'bg-[#1B5E20]',
  'bg-[#2E7D32]': 'bg-[#0D3010]',
  'bg-[#2E7D32]': 'bg-[#0D3010]',
  
  // Text Colors
  'text-[#2E7D32]': 'text-[#2E7D32]/30',
  'text-[#2E7D32]': 'text-[#2E7D32]/40',
  'text-[#2E7D32]': 'text-[#2E7D32]/50',
  'text-[#2E7D32]': 'text-[#2E7D32]/60',
  'text-[#2E7D32]': 'text-[#2E7D32]/80',
  'text-[#2E7D32]': 'text-[#2E7D32]',
  'text-[#2E7D32]': 'text-[#2E7D32]',
  'text-[#2E7D32]': 'text-[#1B5E20]',
  'text-[#2E7D32]': 'text-[#0D3010]',
  'text-[#2E7D32]': 'text-[#0D3010]',
  
  // Border Colors
  'border-[#2E7D32]/20': 'border-[#2E7D32]/10',
  'border-[#2E7D32]/20': 'border-[#2E7D32]/15',
  'border-[#2E7D32]/20': 'border-[#2E7D32]/30',
  'border-[#2E7D32]/20': 'border-[#2E7D32]/40',
  'border-[#2E7D32]/20': 'border-[#2E7D32]/60',
  'border-[#2E7D32]/20': 'border-[#2E7D32]',
  'border-[#2E7D32]/20': 'border-[#2E7D32]',
  'border-[#2E7D32]/20': 'border-[#1B5E20]',
  'border-[#2E7D32]/20': 'border-[#0D3010]',
  'border-[#2E7D32]/20': 'border-[#0D3010]',
  
  // Hover States - Background
  'hover:bg-[#2E7D32]/5': 'hover:bg-[#2E7D32]/5',
  'hover:bg-[#2E7D32]/10': 'hover:bg-[#2E7D32]/10',
  'hover:bg-[#2E7D32]/20': 'hover:bg-[#2E7D32]/20',
  'hover:bg-[#2E7D32]/30': 'hover:bg-[#2E7D32]/30',
  'hover:bg-[#2E7D32]': 'hover:bg-[#2E7D32]',
  'hover:bg-[#2E7D32]': 'hover:bg-[#2E7D32]',
  'hover:bg-[#2E7D32]': 'hover:bg-[#1B5E20]',
  
  // Hover States - Text
  'hover:text-[#2E7D32]': 'hover:text-[#2E7D32]',
  'hover:text-[#2E7D32]': 'hover:text-[#1B5E20]',
  
  // Hover States - Border
  'hover:border-[#2E7D32]/20': 'hover:border-[#2E7D32]/40',
  'hover:border-[#2E7D32]/20': 'hover:border-[#2E7D32]',
  'hover:border-[#2E7D32]/20': 'hover:border-[#2E7D32]',
  
  // Group Hover States
  'group-hover:bg-[#2E7D32]/5': 'group-hover:bg-[#2E7D32]/5',
  'group-hover:text-[#2E7D32]': 'group-hover:text-[#2E7D32]',
  
  // From/To/Via (Gradients) - Emerald variants
  'from-[#2E7D32]': 'from-[#2E7D32]/5',
  'from-[#2E7D32]': 'from-[#2E7D32]/60',
  'from-[#2E7D32]': 'from-[#2E7D32]',
  'from-[#2E7D32]': 'from-[#2E7D32]',
  'to-gray-100': 'to-gray-100/5',
  'to-gray-100': 'to-gray-100',
  'to-gray-100': 'to-gray-100',
  'via-[#2E7D32]': 'via-[#2E7D32]',
  'via-[#2E7D32]': 'via-[#2E7D32]',
  
  // From/To/Via (Gradients) - Green variants
  'from-[#2E7D32]': 'from-[#2E7D32]/5',
  'from-[#2E7D32]': 'from-[#2E7D32]/60',
  'from-[#2E7D32]': 'from-[#2E7D32]',
  'from-[#2E7D32]': 'from-[#2E7D32]',
  'from-[#2E7D32]': 'from-gray-50',
  'to-gray-100': 'to-gray-100/5',
  'to-gray-100': 'to-gray-100/10',
  'to-gray-100': 'to-gray-100',
  'to-gray-100': 'to-gray-100',
  'to-gray-100': 'to-[#1B5E20]',
  'via-[#2E7D32]': 'via-[#2E7D32]',
  'via-[#2E7D32]': 'via-[#2E7D32]',
  
  // Teal variants (often used with green) - Remove or replace
  'to-gray-100': 'to-[#1B5E20]',
  'to-gray-100': 'to-gray-100/5',
  'from-gray-50': 'from-gray-50',
  'via-gray-50': 'via-gray-50',
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
