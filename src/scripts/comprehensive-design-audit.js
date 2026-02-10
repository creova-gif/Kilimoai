#!/usr/bin/env node

/**
 * COMPREHENSIVE DESIGN AUDIT SCRIPT
 * Audits: Colors, Fonts, Responsive Design, Alignments
 * Mode: Web & Mobile (App Store Ready)
 */

const fs = require('fs');
const path = require('path');

// KILIMO Brand Standards
const BRAND_STANDARDS = {
  colors: {
    primary: '#2E7D32',
    primaryDark: '#1f5a24',
    allowed: [
      '#2E7D32', // Primary green
      '#1f5a24', // Dark hover green
      'rgb(46, 125, 50)', // RGB equivalent
      // Status colors
      'red-', 'orange-', 'yellow-', // Warnings/errors
      'gray-', 'white', 'black', // Neutrals
      'green-50', 'green-100', 'green-200', 'green-600', 'green-700', // Approved greens
    ],
    violations: [
      'emerald-', 'teal-', 'cyan-', 'blue-', 'indigo-', 'purple-', 'violet-',
      'pink-', 'fuchsia-', 'lime-', 'sky-', 'slate-',
      'from-green', 'to-green', 'via-green', // Gradients with green
      'from-emerald', 'to-emerald', 'via-emerald',
      'from-teal', 'to-teal', 'via-teal',
      'from-blue', 'to-blue', 'via-blue',
      'from-purple', 'to-purple', 'via-purple',
      'from-indigo', 'to-indigo', 'via-indigo',
      'from-cyan', 'to-cyan', 'via-cyan',
    ]
  },
  fonts: {
    approved: ['font-sans', 'font-bold', 'font-semibold', 'font-medium', 'font-normal'],
    sizes: {
      mobile: ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'],
      desktop: ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl']
    }
  },
  responsive: {
    breakpoints: ['sm:', 'md:', 'lg:', 'xl:', '2xl:'],
    required: ['flex', 'grid', 'hidden', 'block']
  }
};

// Violation patterns
const VIOLATION_PATTERNS = {
  colorGradients: /className="[^"]*(?:from|to|via)-(?:green|emerald|teal|blue|purple|indigo|cyan|pink|fuchsia)/g,
  emeraldColors: /className="[^"]*(?:bg|text|border)-emerald-/g,
  tealColors: /className="[^"]*(?:bg|text|border)-teal-/g,
  blueColors: /className="[^"]*(?:bg|text|border)-(?:blue|sky|cyan|indigo)-/g,
  purpleColors: /className="[^"]*(?:bg|text|border)-(?:purple|violet|fuchsia|pink)-/g,
  animatedGlow: /className="[^"]*(?:blur-|animate-pulse)[^"]*(?:bg-(?:emerald|teal|blue|purple|cyan))/g,
  missingResponsive: /className="(?![^"]*(?:sm:|md:|lg:))[^"]*(?:grid|flex|hidden|text-)/g,
  hardcodedSizes: /className="[^"]*w-\[(?:\d+)px\]/g,
};

class DesignAuditor {
  constructor() {
    this.results = {
      totalFiles: 0,
      filesScanned: 0,
      violations: [],
      colorIssues: [],
      fontIssues: [],
      responsiveIssues: [],
      alignmentIssues: [],
      summary: {}
    };
  }

  auditFile(filePath, content) {
    const fileName = path.basename(filePath);
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      
      // Color violations
      this.checkColorViolations(fileName, lineNum, line);
      
      // Font issues
      this.checkFontIssues(fileName, lineNum, line);
      
      // Responsive design
      this.checkResponsiveDesign(fileName, lineNum, line);
      
      // Alignment issues
      this.checkAlignment(fileName, lineNum, line);
    });
  }

  checkColorViolations(file, line, content) {
    // Check for gradients
    VIOLATION_PATTERNS.colorGradients.lastIndex = 0;
    let match;
    while ((match = VIOLATION_PATTERNS.colorGradients.exec(content)) !== null) {
      this.results.colorIssues.push({
        file,
        line,
        type: 'GRADIENT',
        severity: 'HIGH',
        violation: match[0],
        suggestion: 'Use solid bg-[#2E7D32] instead'
      });
    }

    // Check for emerald
    VIOLATION_PATTERNS.emeraldColors.lastIndex = 0;
    while ((match = VIOLATION_PATTERNS.emeraldColors.exec(content)) !== null) {
      this.results.colorIssues.push({
        file,
        line,
        type: 'EMERALD',
        severity: 'CRITICAL',
        violation: match[0],
        suggestion: 'Replace with #2E7D32 or gray-*'
      });
    }

    // Check for teal
    VIOLATION_PATTERNS.tealColors.lastIndex = 0;
    while ((match = VIOLATION_PATTERNS.tealColors.exec(content)) !== null) {
      this.results.colorIssues.push({
        file,
        line,
        type: 'TEAL',
        severity: 'CRITICAL',
        violation: match[0],
        suggestion: 'Replace with #2E7D32 or gray-*'
      });
    }

    // Check for blue/purple
    VIOLATION_PATTERNS.blueColors.lastIndex = 0;
    while ((match = VIOLATION_PATTERNS.blueColors.exec(content)) !== null) {
      this.results.colorIssues.push({
        file,
        line,
        type: 'BLUE',
        severity: 'HIGH',
        violation: match[0],
        suggestion: 'Replace with gray-* for neutral elements'
      });
    }

    VIOLATION_PATTERNS.purpleColors.lastIndex = 0;
    while ((match = VIOLATION_PATTERNS.purpleColors.exec(content)) !== null) {
      this.results.colorIssues.push({
        file,
        line,
        type: 'PURPLE',
        severity: 'HIGH',
        violation: match[0],
        suggestion: 'Replace with gray-* for neutral elements'
      });
    }

    // Check for animated glows
    VIOLATION_PATTERNS.animatedGlow.lastIndex = 0;
    while ((match = VIOLATION_PATTERNS.animatedGlow.exec(content)) !== null) {
      this.results.colorIssues.push({
        file,
        line,
        type: 'GLOW_EFFECT',
        severity: 'MEDIUM',
        violation: match[0],
        suggestion: 'Remove animated glow effects'
      });
    }
  }

  checkFontIssues(file, line, content) {
    // Check for font-serif (should use font-sans)
    if (content.includes('font-serif') || content.includes('font-mono')) {
      this.results.fontIssues.push({
        file,
        line,
        type: 'WRONG_FONT_FAMILY',
        severity: 'MEDIUM',
        violation: 'font-serif or font-mono',
        suggestion: 'Use font-sans for consistency'
      });
    }

    // Check for very large text without responsive sizing
    const largeSizePattern = /text-[5-9]xl(?!\s+(?:sm:|md:|lg:))/g;
    let match;
    while ((match = largeSizePattern.exec(content)) !== null) {
      this.results.fontIssues.push({
        file,
        line,
        type: 'LARGE_TEXT_NO_RESPONSIVE',
        severity: 'LOW',
        violation: match[0],
        suggestion: 'Add responsive sizing (e.g., text-2xl md:text-4xl)'
      });
    }
  }

  checkResponsiveDesign(file, line, content) {
    // Check for fixed widths without responsive variants
    VIOLATION_PATTERNS.hardcodedSizes.lastIndex = 0;
    let match;
    while ((match = VIOLATION_PATTERNS.hardcodedSizes.exec(content)) !== null) {
      this.results.responsiveIssues.push({
        file,
        line,
        type: 'HARDCODED_WIDTH',
        severity: 'MEDIUM',
        violation: match[0],
        suggestion: 'Use responsive width classes or max-w-* instead'
      });
    }

    // Check for grids without responsive columns
    if (content.includes('grid-cols-') && !content.includes('md:grid-cols-')) {
      if (content.match(/grid-cols-[3-9]/)) {
        this.results.responsiveIssues.push({
          file,
          line,
          type: 'GRID_NO_RESPONSIVE',
          severity: 'HIGH',
          violation: 'grid with 3+ columns but no md: breakpoint',
          suggestion: 'Add md:grid-cols-* for responsive grid'
        });
      }
    }

    // Check for hidden elements without mobile considerations
    if (content.includes('hidden') && !content.includes('md:') && !content.includes('lg:')) {
      this.results.responsiveIssues.push({
        file,
        line,
        type: 'HIDDEN_NO_RESPONSIVE',
        severity: 'LOW',
        violation: 'hidden without breakpoint',
        suggestion: 'Consider md:hidden or lg:block for responsive visibility'
      });
    }
  }

  checkAlignment(file, line, content) {
    // Check for potential alignment issues
    if (content.includes('items-start') && content.includes('justify-end')) {
      this.results.alignmentIssues.push({
        file,
        line,
        type: 'MIXED_ALIGNMENT',
        severity: 'LOW',
        violation: 'items-start with justify-end',
        suggestion: 'Verify alignment is intentional'
      });
    }

    // Check for centered content without responsive consideration
    if (content.includes('mx-auto') && content.includes('w-full')) {
      this.results.alignmentIssues.push({
        file,
        line,
        type: 'CENTERED_FULL_WIDTH',
        severity: 'LOW',
        violation: 'mx-auto with w-full',
        suggestion: 'Use max-w-* instead of w-full for centered content'
      });
    }
  }

  scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules, .git, etc.
        if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) {
          this.scanDirectory(fullPath);
        }
      } else if (entry.isFile()) {
        // Only scan .tsx and .jsx files
        if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
          this.results.totalFiles++;
          const content = fs.readFileSync(fullPath, 'utf8');
          this.auditFile(fullPath, content);
          this.results.filesScanned++;
        }
      }
    }
  }

  generateReport() {
    const totalViolations = 
      this.results.colorIssues.length +
      this.results.fontIssues.length +
      this.results.responsiveIssues.length +
      this.results.alignmentIssues.length;

    // Group violations by file
    const byFile = {};
    
    [...this.results.colorIssues, ...this.results.fontIssues, 
     ...this.results.responsiveIssues, ...this.results.alignmentIssues].forEach(issue => {
      if (!byFile[issue.file]) {
        byFile[issue.file] = [];
      }
      byFile[issue.file].push(issue);
    });

    // Sort files by violation count
    const sortedFiles = Object.entries(byFile)
      .map(([file, issues]) => ({ file, count: issues.length, issues }))
      .sort((a, b) => b.count - a.count);

    const report = `
# 🎨 COMPREHENSIVE DESIGN AUDIT REPORT
**Generated:** ${new Date().toISOString()}

## 📊 EXECUTIVE SUMMARY

- **Total Files Scanned:** ${this.results.filesScanned}
- **Total Violations Found:** ${totalViolations}
- **Color Violations:** ${this.results.colorIssues.length}
- **Font Issues:** ${this.results.fontIssues.length}
- **Responsive Issues:** ${this.results.responsiveIssues.length}
- **Alignment Issues:** ${this.results.alignmentIssues.length}

---

## 🚨 TOP 10 WORST OFFENDERS

${sortedFiles.slice(0, 10).map((item, idx) => `
### ${idx + 1}. ${item.file} (${item.count} violations)

${item.issues.map(issue => `- **Line ${issue.line}** [${issue.severity}] ${issue.type}: ${issue.violation}
  - Fix: ${issue.suggestion}`).join('\n')}
`).join('\n')}

---

## 🎨 COLOR VIOLATIONS BREAKDOWN

${this.generateColorBreakdown()}

---

## 📱 RESPONSIVE DESIGN ISSUES

${this.generateResponsiveBreakdown()}

---

## 🔤 FONT & TYPOGRAPHY ISSUES

${this.generateFontBreakdown()}

---

## 📐 ALIGNMENT & LAYOUT ISSUES

${this.generateAlignmentBreakdown()}

---

## ✅ RECOMMENDATIONS

### High Priority (Fix Immediately)
${this.getHighPriorityFixes()}

### Medium Priority (Fix Soon)
${this.getMediumPriorityFixes()}

### Low Priority (Nice to Have)
${this.getLowPriorityFixes()}

---

**Audit Complete** ✅
`;

    return report;
  }

  generateColorBreakdown() {
    const byType = {};
    this.results.colorIssues.forEach(issue => {
      if (!byType[issue.type]) byType[issue.type] = 0;
      byType[issue.type]++;
    });

    return Object.entries(byType)
      .map(([type, count]) => `- **${type}:** ${count} violations`)
      .join('\n') || 'No color violations found! ✅';
  }

  generateResponsiveBreakdown() {
    const byType = {};
    this.results.responsiveIssues.forEach(issue => {
      if (!byType[issue.type]) byType[issue.type] = 0;
      byType[issue.type]++;
    });

    return Object.entries(byType)
      .map(([type, count]) => `- **${type}:** ${count} issues`)
      .join('\n') || 'No responsive issues found! ✅';
  }

  generateFontBreakdown() {
    const byType = {};
    this.results.fontIssues.forEach(issue => {
      if (!byType[issue.type]) byType[issue.type] = 0;
      byType[issue.type]++;
    });

    return Object.entries(byType)
      .map(([type, count]) => `- **${type}:** ${count} issues`)
      .join('\n') || 'No font issues found! ✅';
  }

  generateAlignmentBreakdown() {
    const byType = {};
    this.results.alignmentIssues.forEach(issue => {
      if (!byType[issue.type]) byType[issue.type] = 0;
      byType[issue.type]++;
    });

    return Object.entries(byType)
      .map(([type, count]) => `- **${type}:** ${count} issues`)
      .join('\n') || 'No alignment issues found! ✅';
  }

  getHighPriorityFixes() {
    const high = [...this.results.colorIssues, ...this.results.fontIssues,
                  ...this.results.responsiveIssues, ...this.results.alignmentIssues]
      .filter(issue => issue.severity === 'CRITICAL' || issue.severity === 'HIGH')
      .slice(0, 10);

    return high.length 
      ? high.map(issue => `- ${issue.file}:${issue.line} - ${issue.type}: ${issue.suggestion}`).join('\n')
      : 'None! Great job! 🎉';
  }

  getMediumPriorityFixes() {
    const medium = [...this.results.colorIssues, ...this.results.fontIssues,
                    ...this.results.responsiveIssues, ...this.results.alignmentIssues]
      .filter(issue => issue.severity === 'MEDIUM')
      .slice(0, 10);

    return medium.length
      ? medium.map(issue => `- ${issue.file}:${issue.line} - ${issue.type}: ${issue.suggestion}`).join('\n')
      : 'None! ✅';
  }

  getLowPriorityFixes() {
    const low = [...this.results.colorIssues, ...this.results.fontIssues,
                 ...this.results.responsiveIssues, ...this.results.alignmentIssues]
      .filter(issue => issue.severity === 'LOW')
      .slice(0, 10);

    return low.length
      ? low.map(issue => `- ${issue.file}:${issue.line} - ${issue.type}`).join('\n')
      : 'None! ✅';
  }
}

// Run audit
console.log('🔍 Starting Comprehensive Design Audit...\n');

const auditor = new DesignAuditor();
const componentsDir = path.join(process.cwd(), 'components');

auditor.scanDirectory(componentsDir);

const report = auditor.generateReport();

// Write report
const reportPath = path.join(process.cwd(), 'COMPREHENSIVE_DESIGN_AUDIT_REPORT.md');
fs.writeFileSync(reportPath, report);

console.log(`✅ Audit complete!`);
console.log(`📄 Report saved to: ${reportPath}`);
console.log(`\n📊 Summary:`);
console.log(`   Files scanned: ${auditor.results.filesScanned}`);
console.log(`   Color violations: ${auditor.results.colorIssues.length}`);
console.log(`   Font issues: ${auditor.results.fontIssues.length}`);
console.log(`   Responsive issues: ${auditor.results.responsiveIssues.length}`);
console.log(`   Alignment issues: ${auditor.results.alignmentIssues.length}`);
console.log(`   Total violations: ${
  auditor.results.colorIssues.length +
  auditor.results.fontIssues.length +
  auditor.results.responsiveIssues.length +
  auditor.results.alignmentIssues.length
}`);
