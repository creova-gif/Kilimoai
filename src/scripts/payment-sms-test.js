/**
 * KILIMO Payment & SMS Verification
 * Ensures payment providers and SMS delivery are configured
 * 
 * Usage: node scripts/payment-sms-test.js
 */

import fs from 'fs';

console.log('💳 KILIMO Payment & SMS Verification\n');

// Load environment variables
const env = process.env;

// Define required environment variables
const requiredChecks = [
  {
    name: 'MPESA_API_KEY',
    description: 'M-Pesa API credentials',
    critical: true
  },
  {
    name: 'FLUTTERWAVE_SECRET_KEY',
    description: 'Flutterwave for card payments',
    critical: true
  },
  {
    name: 'AFRICAS_TALKING_API_KEY',
    description: 'Africa\'s Talking for SMS',
    critical: true
  },
  {
    name: 'AFRICAS_TALKING_USERNAME',
    description: 'Africa\'s Talking username',
    critical: true
  },
  {
    name: 'OPENROUTER_API_KEY',
    description: 'OpenRouter for AI',
    critical: false
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    description: 'Supabase service role key',
    critical: true
  }
];

// Additional functional checks
const functionalChecks = [
  {
    name: 'WALLET_EDGE_FUNCTION',
    check: () => {
      // Check if wallet endpoints exist in backend
      const serverPath = './supabase/functions/server/index.tsx';
      if (fs.existsSync(serverPath)) {
        const content = fs.readFileSync(serverPath, 'utf8');
        return content.includes('/wallet');
      }
      return false;
    },
    description: 'Wallet edge function implementation',
    critical: true
  },
  {
    name: 'PAYMENT_ENDPOINTS',
    check: () => {
      const serverPath = './supabase/functions/server/index.tsx';
      if (fs.existsSync(serverPath)) {
        const content = fs.readFileSync(serverPath, 'utf8');
        return content.includes('/payments');
      }
      return false;
    },
    description: 'Payment endpoints implementation',
    critical: true
  },
  {
    name: 'SMS_PROVIDER',
    check: () => {
      const serverPath = './supabase/functions/server/index.tsx';
      if (fs.existsSync(serverPath)) {
        const content = fs.readFileSync(serverPath, 'utf8');
        return content.includes('sms') || content.includes('SMS');
      }
      return false;
    },
    description: 'SMS provider integration',
    critical: true
  }
];

// Results tracker
const results = {
  timestamp: new Date().toISOString(),
  environment_checks: {
    passed: [],
    failures: []
  },
  functional_checks: {
    passed: [],
    failures: []
  },
  warnings: []
};

// Check environment variables
console.log('🔍 Checking Environment Variables...\n');

requiredChecks.forEach(check => {
  const value = env[check.name];
  const exists = value && value.length > 0;
  
  if (exists) {
    results.environment_checks.passed.push({
      name: check.name,
      description: check.description
    });
    console.log(`  ✅ ${check.name}: Configured`);
  } else {
    const failure = {
      name: check.name,
      description: check.description,
      critical: check.critical
    };
    
    if (check.critical) {
      results.environment_checks.failures.push(failure);
      console.log(`  ❌ ${check.name}: MISSING (CRITICAL)`);
    } else {
      results.warnings.push(failure);
      console.log(`  ⚠️  ${check.name}: MISSING (optional)`);
    }
  }
});

// Check functional implementations
console.log('\n🔧 Checking Functional Implementation...\n');

functionalChecks.forEach(check => {
  const passed = check.check();
  
  if (passed) {
    results.functional_checks.passed.push({
      name: check.name,
      description: check.description
    });
    console.log(`  ✅ ${check.name}: Implemented`);
  } else {
    const failure = {
      name: check.name,
      description: check.description,
      critical: check.critical
    };
    
    if (check.critical) {
      results.functional_checks.failures.push(failure);
      console.log(`  ❌ ${check.name}: MISSING (CRITICAL)`);
    } else {
      results.warnings.push(failure);
      console.log(`  ⚠️  ${check.name}: MISSING (optional)`);
    }
  }
});

// Generate summary
const totalFailures = results.environment_checks.failures.length + 
                      results.functional_checks.failures.length;

console.log('\n' + '═'.repeat(50));
console.log('📊 PAYMENT & SMS VERIFICATION SUMMARY');
console.log('═'.repeat(50));
console.log(`Environment Checks: ${results.environment_checks.passed.length}/${requiredChecks.length} passed`);
console.log(`Functional Checks: ${results.functional_checks.passed.length}/${functionalChecks.length} passed`);
console.log(`Critical Failures: ${totalFailures} ❌`);
console.log(`Warnings: ${results.warnings.length} ⚠️`);
console.log('');

if (totalFailures > 0) {
  console.log('❌ CRITICAL ISSUES FOUND:');
  
  results.environment_checks.failures.forEach((failure, i) => {
    console.log(`  ${i + 1}. ${failure.name}: ${failure.description}`);
  });
  
  results.functional_checks.failures.forEach((failure, i) => {
    console.log(`  ${i + results.environment_checks.failures.length + 1}. ${failure.name}: ${failure.description}`);
  });
  
  console.log('');
  console.log('💡 FIX REQUIRED:');
  console.log('  1. Set missing environment variables in .env');
  console.log('  2. Ensure backend endpoints are implemented');
  console.log('  3. Configure payment providers (M-Pesa, Flutterwave)');
  console.log('  4. Set up SMS provider (Africa\'s Talking)');
  console.log('');
}

if (results.warnings.length > 0) {
  console.log('⚠️  WARNINGS (Non-critical):');
  results.warnings.forEach((warning, i) => {
    console.log(`  ${i + 1}. ${warning.name}: ${warning.description}`);
  });
  console.log('');
}

// Save report
fs.writeFileSync('payment_sms_report.json', JSON.stringify(results, null, 2));
console.log('📄 Report saved to payment_sms_report.json\n');

// Exit with appropriate code
if (totalFailures > 0) {
  console.log('❌ PAYMENT/SMS CONFIG INVALID - Deployment blocked!');
  process.exit(1);
} else {
  console.log('✅ PAYMENT & SMS VERIFIED - Safe to proceed!');
  process.exit(0);
}
