#!/usr/bin/env node

/**
 * KILIMO STRICT Brand Color Enforcement
 * 
 * ALLOW ONLY:
 * - #2E7D32 (Raspberry Leaf Green)
 * - gray-*
 * - white
 * 
 * BLOCK EVERYTHING ELSE including:
 * - blue-, purple-, indigo-, emerald-, teal-, cyan-, pink-
 * - green-* (use #2E7D32 instead)
 * - orange-*, yellow-*, red-* (use gray or #2E7D32 instead)
 * - ALL gradients
 */

const fs = require('fs');
const path = require('path');

// Block ALL colors except gray and white
const BLOCKED_COLOR_PREFIXES = [
  'blue-',
  'purple-',
  'indigo-',
  'emerald-',
  'teal-',
  'cyan-',
  'pink-',
  'green-',   // BLOCKED: Use #2E7D32 instead
  'orange-',  // BLOCKED: Use gray-* instead
  'yellow-',  // BLOCKED: Use gray-* instead
  'red-',     // BLOCKED: Use gray-* instead
  'lime-',
  'sky-',
  'violet-',
  'fuchsia-',
  'rose-',
  'amber-',
  'slate-',
  'zinc-',
  'neutral-',
  'stone-',
];

// Block all gradient patterns
const GRADIENT_PATTERNS = [
  /\bbg-gradient-/,
  /\bfrom-/,
  /\bto-/,
  /\bvia-/,
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const violations = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Check for blocked color prefixes
    BLOCKED_COLOR_PREFIXES.forEach(colorPrefix => {
      // Match patterns like: text-blue-500, bg-green-600, border-red-400
      const regex = new RegExp(`\\b(text-|bg-|border-|ring-|outline-|divide-|placeholder-|from-|to-|via-)?${colorPrefix}\\d+\\b`, 'g');
      const matches = line.match(regex);
      if (matches) {
        matches.forEach(match => {
          violations.push({
            file: filePath,
            line: index + 1,
            violation: match,
            content: line.trim().substring(0, 100),
            type: 'COLOR'
          });
        });
      }
    });

    // Check for gradient patterns
    GRADIENT_PATTERNS.forEach(pattern => {
      if (pattern.test(line)) {
        const match = line.match(pattern);
        if (match) {
          violations.push({
            file: filePath,
            line: index + 1,
            violation: match[0],
            content: line.trim().substring(0, 100),
            type: 'GRADIENT'
          });
        }
      }
    });
  });

  return violations;
}

function scanDirectory(dir, violations = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'build', '.next', 'supabase'].includes(file)) {
        scanDirectory(filePath, violations);
      }
    } else if (stat.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js'))) {
      const fileViolations = scanFile(filePath);
      violations.push(...fileViolations);
    }
  });

  return violations;
}

function main() {
  console.log('\n🔒 KILIMO STRICT COLOR ENFORCEMENT\n');

  const rootDir = process.cwd();
  const violations = scanDirectory(rootDir);

  if (violations.length === 0) {
    console.log('✅ CI RULE ACTIVE\n');
    console.log('✅ NO REGRESSIONS POSSIBLE\n');
    console.log('Allowed colors:');
    console.log('  • #2E7D32 (Raspberry Leaf Green)');
    console.log('  • gray-*');
    console.log('  • white\n');
    process.exit(0);
  }

  console.error('❌ BUILD BLOCKED: Non-brand color detected.\n');
  console.error(`Found ${violations.length} violation(s):\n`);

  // Group by file
  const byFile = violations.reduce((acc, v) => {
    if (!acc[v.file]) acc[v.file] = [];
    acc[v.file].push(v);
    return acc;
  }, {});

  Object.entries(byFile).forEach(([file, fileViolations]) => {
    console.error(`\n📁 ${file}`);
    fileViolations.slice(0, 5).forEach(v => {
      console.error(`   Line ${v.line}: ${v.violation}`);
    });
    if (fileViolations.length > 5) {
      console.error(`   ... and ${fileViolations.length - 5} more violations`);
    }
  });

  console.error('\n❌ BUILD BLOCKED: Non-brand color detected.\n');
  console.error('ALLOWED ONLY:');
  console.error('  ✅ #2E7D32 (Raspberry Leaf Green)');
  console.error('  ✅ gray-*');
  console.error('  ✅ white\n');
  console.error('BLOCKED:');
  console.error('  ❌ ALL other colors (blue-, purple-, indigo-, emerald-, teal-, cyan-, pink-, green-, red-, orange-, yellow-)');
  console.error('  ❌ ALL gradients\n');
  console.error('Fix violations and rebuild.\n');

  process.exit(1);
}

main();
