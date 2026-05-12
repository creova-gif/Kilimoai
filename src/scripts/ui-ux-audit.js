/**
 * KILIMO UI/UX & Branding Audit
 * Ensures UI completeness, branding consistency, and language coverage
 * 
 * Usage: node scripts/ui-ux-audit.js --branding=CREOVA-KILIMO --languages=en,sw
 */

import fs from 'fs';
import path from 'path';

console.log('🎨 KILIMO UI/UX & Branding Audit\n');

// Parse arguments
const args = process.argv.slice(2);
const brandingArg = args.find(arg => arg.startsWith('--branding='));
const languagesArg = args.find(arg => arg.startsWith('--languages='));

const branding = brandingArg ? brandingArg.split('=')[1] : 'CREOVA-KILIMO';
const languages = languagesArg ? languagesArg.split('=')[1].split(',') : ['en', 'sw'];

console.log(`Checking branding: ${branding}`);
console.log(`Checking languages: ${languages.join(', ')}\n`);

// Define critical UI elements
const criticalUIElements = [
  {
    name: 'DepositTab',
    description: 'Deposit tab in Mobile Money Hub',
    file: 'components/MobileMoneyHub.tsx',
    requiredPattern: /deposit|Deposit|Weka Fedha/i
  },
  {
    name: 'WalletBalance',
    description: 'Wallet balance display',
    file: 'components/MobileMoneyHub.tsx',
    requiredPattern: /balance|Balance|Salio/i
  },
  {
    name: 'PaymentSuccess',
    description: 'Payment success confirmation',
    file: 'components/MobileMoneyHub.tsx',
    requiredPattern: /success|Success|Imefanikiwa/i
  },
  {
    name: 'AIAdvicePanel',
    description: 'AI chat/advice interface',
    file: 'components/AISupport.tsx',
    requiredPattern: /ai|AI|Sankofa/i
  },
  {
    name: 'TasksList',
    description: 'Tasks/to-do list',
    file: 'App.tsx',
    requiredPattern: /task|Task|Kazi/i
  },
  {
    name: 'WeatherCard',
    description: 'Weather information display',
    file: 'components/WeatherCard.tsx',
    requiredPattern: /weather|Weather|Hewa/i
  }
];

// Define branding checks
const brandingChecks = [
  {
    name: 'PrimaryColor',
    description: 'Raspberry Leaf Green primary color (#7CB342)',
    pattern: /#7CB342|#689F38|#9CCC65|raspberry/i
  },
  {
    name: 'AppName',
    description: 'KILIMO branding present',
    pattern: /KILIMO|Kilimo/
  },
  {
    name: 'CREOVACredit',
    description: 'CREOVA attribution',
    pattern: /CREOVA|Creova/
  }
];

// Results tracker
const results = {
  timestamp: new Date().toISOString(),
  branding_target: branding,
  languages_checked: languages,
  ui_elements: {
    found: [],
    missing: []
  },
  branding_issues: [],
  language_issues: [],
  warnings: []
};

// Check UI elements
console.log('🔍 Checking UI Elements...\n');

criticalUIElements.forEach(element => {
  const filePath = `./${element.file}`;
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.match(element.requiredPattern)) {
      results.ui_elements.found.push({
        name: element.name,
        description: element.description,
        file: element.file
      });
      console.log(`  ✅ ${element.name}: Found in ${element.file}`);
    } else {
      results.ui_elements.missing.push({
        name: element.name,
        description: element.description,
        file: element.file
      });
      console.log(`  ❌ ${element.name}: Missing in ${element.file}`);
    }
  } else {
    results.ui_elements.missing.push({
      name: element.name,
      description: element.description,
      file: element.file,
      issue: 'File not found'
    });
    console.log(`  ❌ ${element.name}: File ${element.file} not found`);
  }
});

// Check branding consistency
console.log('\n🎨 Checking Branding Consistency...\n');

const filesToCheckBranding = [
  'App.tsx',
  'components/MobileMoneyHub.tsx',
  'components/AISupport.tsx',
  'styles/globals.css'
];

filesToCheckBranding.forEach(file => {
  const filePath = `./${file}`;
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    brandingChecks.forEach(check => {
      const matches = content.match(check.pattern);
      
      if (!matches && check.name !== 'CREOVACredit') { // CREOVA credit optional
        results.branding_issues.push({
          file,
          check: check.name,
          description: check.description
        });
        console.log(`  ⚠️  ${check.name}: Not found in ${file}`);
      } else if (matches) {
        console.log(`  ✅ ${check.name}: Found in ${file}`);
      }
    });
  }
});

// Check language completeness
console.log('\n🌍 Checking Language Coverage...\n');

const keyStrings = [
  { en: 'Home', sw: 'Nyumbani' },
  { en: 'Dashboard', sw: 'Dashibodi' },
  { en: 'Wallet', sw: 'Mkoba' },
  { en: 'Deposit', sw: 'Weka Fedha' },
  { en: 'Tasks', sw: 'Kazi' },
  { en: 'Weather', sw: 'Hali ya Hewa' }
];

const componentsToCheck = [
  'App.tsx',
  'components/MobileMoneyHub.tsx',
  'components/AISupport.tsx'
];

let totalStrings = keyStrings.length * languages.length;
let foundStrings = 0;

componentsToCheck.forEach(file => {
  const filePath = `./${file}`;
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    keyStrings.forEach(stringPair => {
      languages.forEach(lang => {
        const term = stringPair[lang];
        if (term && content.includes(term)) {
          foundStrings++;
        } else if (term) {
          results.language_issues.push({
            file,
            language: lang,
            missing_term: term
          });
        }
      });
    });
  }
});

const languageCoverage = ((foundStrings / totalStrings) * 100).toFixed(1);
console.log(`Language Coverage: ${languageCoverage}%`);

if (parseFloat(languageCoverage) < 70) {
  results.warnings.push({
    issue: 'Language coverage below 70%',
    coverage: languageCoverage
  });
  console.log(`  ⚠️  Coverage below 70% threshold`);
} else {
  console.log(`  ✅ Coverage meets 70% threshold`);
}

// Check for English-only screens
console.log('\n📱 Checking for English-Only Screens...\n');

const screenFiles = fs.readdirSync('./components').filter(f => f.endsWith('.tsx'));

screenFiles.forEach(file => {
  const filePath = `./components/${file}`;
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file has hardcoded English text but no Swahili
  const hasEnglish = /Home|Wallet|Deposit|Balance|Tasks|Weather/.test(content);
  const hasSwahili = /Nyumbani|Mkoba|Weka Fedha|Salio|Kazi|Hewa/.test(content);
  
  if (hasEnglish && !hasSwahili && !content.includes('language') && !content.includes('i18n')) {
    results.language_issues.push({
      file,
      issue: 'Appears to be English-only (no Swahili or i18n)'
    });
    console.log(`  ⚠️  ${file}: May be English-only`);
  }
});

// Generate summary
console.log('\n' + '═'.repeat(50));
console.log('📊 UI/UX AUDIT SUMMARY');
console.log('═'.repeat(50));
console.log(`UI Elements Found: ${results.ui_elements.found.length}/${criticalUIElements.length}`);
console.log(`UI Elements Missing: ${results.ui_elements.missing.length}`);
console.log(`Branding Issues: ${results.branding_issues.length}`);
console.log(`Language Issues: ${results.language_issues.length}`);
console.log(`Language Coverage: ${languageCoverage}%`);
console.log('');

if (results.ui_elements.missing.length > 0) {
  console.log('❌ MISSING UI ELEMENTS:');
  results.ui_elements.missing.forEach((element, i) => {
    console.log(`  ${i + 1}. ${element.name}: ${element.description}`);
    console.log(`     Expected in: ${element.file}`);
  });
  console.log('');
}

if (results.branding_issues.length > 0) {
  console.log('⚠️  BRANDING INCONSISTENCIES:');
  results.branding_issues.forEach((issue, i) => {
    console.log(`  ${i + 1}. ${issue.check} missing in ${issue.file}`);
  });
  console.log('');
}

if (results.language_issues.length > 5) {
  console.log(`⚠️  LANGUAGE ISSUES: ${results.language_issues.length} total`);
  console.log(`   (See branding_audit.json for full list)`);
  console.log('');
}

// Save report
fs.writeFileSync('branding_audit.json', JSON.stringify(results, null, 2));
console.log('📄 Report saved to branding_audit.json\n');

// Determine exit code
const hasIssues = results.ui_elements.missing.length > 0 || 
                  results.branding_issues.length > 5 ||
                  results.language_issues.length > 10;

if (hasIssues) {
  console.log('⚠️  UI/UX AUDIT COMPLETED WITH WARNINGS');
  console.log('💡 Consider addressing issues before production launch\n');
  process.exit(0); // Don't block deployment, just warn
} else {
  console.log('✅ UI/UX AUDIT PASSED - Branding and UX consistent!\n');
  process.exit(0);
}