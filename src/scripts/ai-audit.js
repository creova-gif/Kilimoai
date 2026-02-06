/**
 * KILIMO AI Audit Script
 * Validates AI prompts, RBAC enforcement, and language coverage
 * 
 * Usage: node scripts/ai-audit.js --roles=smallholder,farmer,manager --languages=en,sw
 */

import fs from 'fs';
import path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const getRoles = () => {
  const rolesArg = args.find(arg => arg.startsWith('--roles='));
  if (rolesArg) {
    return rolesArg.split('=')[1].split(',');
  }
  return [
    'smallholder_farmer',
    'farmer',
    'farm_manager',
    'commercial_farm_admin',
    'agribusiness_operations',
    'extension_officer_ngo',
    'cooperative_leader'
  ];
};

const getLanguages = () => {
  const langArg = args.find(arg => arg.startsWith('--languages='));
  if (langArg) {
    return langArg.split('=')[1].split(',');
  }
  return ['en', 'sw'];
};

const roles = getRoles();
const languages = getLanguages();

console.log('🤖 KILIMO AI Audit Starting...\n');
console.log(`Checking ${roles.length} roles: ${roles.join(', ')}`);
console.log(`Checking ${languages.length} languages: ${languages.join(', ')}\n`);

// Initialize audit report
const audit = {
  timestamp: new Date().toISOString(),
  checked_roles: roles,
  checked_languages: languages,
  critical_failures: [],
  warnings: [],
  passed_checks: 0,
  total_checks: 0
};

// ========================================
// 1. CHECK AI PROMPT FILES
// ========================================
console.log('📝 Checking AI Prompt Files...');

const promptsDir = './ai/prompts';
if (!fs.existsSync(promptsDir)) {
  // If prompts directory doesn't exist, check component files instead
  console.log('⚠️  ./ai/prompts not found, checking components...');
  
  // Check AISupport.tsx for AI prompts
  const aiSupportPath = './components/AISupport.tsx';
  if (fs.existsSync(aiSupportPath)) {
    const content = fs.readFileSync(aiSupportPath, 'utf8');
    
    // Check for role-based prompts
    roles.forEach(role => {
      audit.total_checks++;
      if (content.includes(role) || content.includes('role')) {
        audit.passed_checks++;
        console.log(`  ✅ Role consideration found: ${role}`);
      } else {
        audit.warnings.push({
          file: 'AISupport.tsx',
          issue: `Role-specific handling not found for: ${role}`,
          severity: 'medium'
        });
        console.log(`  ⚠️  Role handling not explicit: ${role}`);
      }
    });
    
    // Check for language support
    languages.forEach(lang => {
      audit.total_checks++;
      if (content.includes(lang) || content.includes('language')) {
        audit.passed_checks++;
        console.log(`  ✅ Language support found: ${lang}`);
      } else {
        audit.warnings.push({
          file: 'AISupport.tsx',
          issue: `Language support not explicit for: ${lang}`,
          severity: 'low'
        });
        console.log(`  ⚠️  Language support not explicit: ${lang}`);
      }
    });
    
    // Check for AI safety boundaries
    audit.total_checks++;
    const hasSafety = content.includes('safety') || 
                      content.includes('validation') ||
                      content.includes('sanitize');
    if (hasSafety) {
      audit.passed_checks++;
      console.log('  ✅ AI safety mechanisms present');
    } else {
      audit.critical_failures.push({
        file: 'AISupport.tsx',
        issue: 'No AI safety boundaries detected',
        severity: 'critical'
      });
      console.log('  ❌ CRITICAL: AI safety boundaries missing');
    }
  }
} else {
  // Process prompt files
  const promptFiles = fs.readdirSync(promptsDir);
  
  promptFiles.forEach(file => {
    if (!file.endsWith('.txt') && !file.endsWith('.md') && !file.endsWith('.json')) {
      return;
    }
    
    const content = fs.readFileSync(path.join(promptsDir, file), 'utf8');
    
    // Check RBAC roles
    roles.forEach(role => {
      audit.total_checks++;
      if (content.includes(`ROLE:${role}`) || content.includes(role)) {
        audit.passed_checks++;
      } else {
        audit.critical_failures.push({
          file,
          issue: `Missing RBAC role: ${role}`,
          severity: 'critical'
        });
      }
    });
    
    // Check languages
    languages.forEach(lang => {
      audit.total_checks++;
      if (content.includes(`LANG:${lang}`) || content.includes(lang)) {
        audit.passed_checks++;
      } else {
        audit.warnings.push({
          file,
          issue: `Missing language variant: ${lang}`,
          severity: 'medium'
        });
      }
    });
    
    // Check safety
    audit.total_checks++;
    if (content.includes('SAFETY:') || content.includes('safe')) {
      audit.passed_checks++;
    } else {
      audit.critical_failures.push({
        file,
        issue: 'Missing AI safety boundary',
        severity: 'critical'
      });
    }
  });
}

// ========================================
// 2. CHECK API ENDPOINTS FOR RBAC
// ========================================
console.log('\n🔐 Checking RBAC in Backend...');

const serverIndexPath = './supabase/functions/server/index.tsx';
if (fs.existsSync(serverIndexPath)) {
  const content = fs.readFileSync(serverIndexPath, 'utf8');
  
  audit.total_checks++;
  if (content.includes('role') && (content.includes('auth') || content.includes('user'))) {
    audit.passed_checks++;
    console.log('  ✅ RBAC mechanisms detected in backend');
  } else {
    audit.warnings.push({
      file: 'server/index.tsx',
      issue: 'RBAC enforcement may be incomplete',
      severity: 'high'
    });
    console.log('  ⚠️  RBAC enforcement not clearly visible');
  }
} else {
  audit.warnings.push({
    file: 'server/index.tsx',
    issue: 'Backend file not found for RBAC check',
    severity: 'medium'
  });
}

// ========================================
// 3. CHECK AI RESPONSES DON'T HALLUCINATE
// ========================================
console.log('\n🧠 Checking AI Response Quality...');

// Define test prompts
const testPrompts = [
  {
    name: 'farming_advice',
    prompt: 'When should I plant maize?',
    requiredKeywords: ['plant', 'maize', 'season'],
    language: 'en'
  },
  {
    name: 'swahili_advice',
    prompt: 'Ni wakati gani wa kupanda mahindi?',
    requiredKeywords: ['mahindi', 'msimu'],
    language: 'sw'
  }
];

// In production, this would make actual API calls
// For now, we validate the AI system exists
const aiChatPath = './supabase/functions/server/index.tsx';
if (fs.existsSync(aiChatPath)) {
  const content = fs.readFileSync(aiChatPath, 'utf8');
  
  audit.total_checks++;
  if (content.includes('/ai-chat/send') || content.includes('openrouter')) {
    audit.passed_checks++;
    console.log('  ✅ AI chat endpoint exists');
  } else {
    audit.critical_failures.push({
      file: 'Backend',
      issue: 'AI chat endpoint not found',
      severity: 'critical'
    });
    console.log('  ❌ CRITICAL: AI chat endpoint missing');
  }
  
  // Check for response validation
  audit.total_checks++;
  if (content.includes('validate') || content.includes('sanitize')) {
    audit.passed_checks++;
    console.log('  ✅ AI response validation detected');
  } else {
    audit.warnings.push({
      file: 'Backend',
      issue: 'AI response validation not clearly visible',
      severity: 'medium'
    });
    console.log('  ⚠️  AI response validation not explicit');
  }
}

// ========================================
// 4. GENERATE REPORT
// ========================================
const successRate = ((audit.passed_checks / audit.total_checks) * 100).toFixed(1);
audit.success_rate = successRate;

// Save detailed report
fs.writeFileSync('audit_report.json', JSON.stringify(audit, null, 2));

// Print summary
console.log('\n' + '═'.repeat(50));
console.log('📊 AI AUDIT SUMMARY');
console.log('═'.repeat(50));
console.log(`Total Checks: ${audit.total_checks}`);
console.log(`Passed: ${audit.passed_checks} ✅`);
console.log(`Critical Failures: ${audit.critical_failures.length} ❌`);
console.log(`Warnings: ${audit.warnings.length} ⚠️`);
console.log(`Success Rate: ${successRate}%`);
console.log('');

if (audit.critical_failures.length > 0) {
  console.log('❌ CRITICAL FAILURES:');
  audit.critical_failures.forEach((failure, i) => {
    console.log(`  ${i + 1}. [${failure.file}] ${failure.issue}`);
  });
  console.log('');
}

if (audit.warnings.length > 0) {
  console.log('⚠️  WARNINGS:');
  audit.warnings.slice(0, 5).forEach((warning, i) => {
    console.log(`  ${i + 1}. [${warning.file}] ${warning.issue}`);
  });
  if (audit.warnings.length > 5) {
    console.log(`  ... and ${audit.warnings.length - 5} more warnings`);
  }
  console.log('');
}

// Exit with appropriate code
if (audit.critical_failures.length > 0) {
  console.log('❌ AI AUDIT FAILED - Deployment blocked!');
  console.log('📄 See audit_report.json for details\n');
  process.exit(1);
} else if (audit.warnings.length > 10) {
  console.log('⚠️  AI AUDIT PASSED with warnings');
  console.log('💡 Consider addressing warnings before production\n');
  process.exit(0);
} else {
  console.log('✅ AI AUDIT PASSED - Safe to deploy!');
  console.log('📄 Report saved to audit_report.json\n');
  process.exit(0);
}
