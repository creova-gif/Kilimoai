/**
 * KILIMO Log Monitoring & Alerting
 * Detects errors post-deployment and flags silent failures
 * 
 * Usage: node scripts/log-checker.js
 */

import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('📋 KILIMO Log Monitoring\n');

// Define error patterns to detect
const errorPatterns = [
  {
    type: 'EdgeFunctionError',
    pattern: /error|exception|failed/i,
    severity: 'critical',
    description: 'Edge function errors'
  },
  {
    type: 'PaymentTimeout',
    pattern: /payment.*timeout|timeout.*payment/i,
    severity: 'critical',
    description: 'Payment processing timeouts'
  },
  {
    type: 'AIResponseFailure',
    pattern: /ai.*error|openrouter.*error/i,
    severity: 'high',
    description: 'AI service failures'
  },
  {
    type: 'DatabaseError',
    pattern: /database.*error|postgres.*error/i,
    severity: 'critical',
    description: 'Database connection issues'
  },
  {
    type: 'AuthenticationError',
    pattern: /auth.*error|unauthorized|401/i,
    severity: 'high',
    description: 'Authentication failures'
  },
  {
    type: 'SMSDeliveryFailure',
    pattern: /sms.*failed|africas talking.*error/i,
    severity: 'high',
    description: 'SMS delivery failures'
  },
  {
    type: 'WalletError',
    pattern: /wallet.*error|balance.*error/i,
    severity: 'critical',
    description: 'Wallet operation errors'
  }
];

// Results tracker
const results = {
  timestamp: new Date().toISOString(),
  errors_detected: [],
  warnings: [],
  total_checks: errorPatterns.length,
  log_sources_checked: []
};

// Check Supabase logs
async function checkSupabaseLogs() {
  console.log('🔍 Checking Supabase logs...\n');
  
  try {
    // Try to get recent logs
    const { stdout, stderr } = await execAsync('supabase functions logs --limit 100 2>&1 || echo "LOGS_UNAVAILABLE"');
    
    if (stdout.includes('LOGS_UNAVAILABLE') || stderr) {
      console.log('  ⚠️  Supabase logs unavailable (not logged in or no deployment)');
      results.warnings.push({
        source: 'Supabase',
        issue: 'Logs unavailable - run in deployed environment'
      });
      return;
    }
    
    results.log_sources_checked.push('Supabase Functions');
    
    // Check for error patterns
    errorPatterns.forEach(pattern => {
      const matches = stdout.match(pattern.pattern);
      if (matches) {
        results.errors_detected.push({
          type: pattern.type,
          severity: pattern.severity,
          description: pattern.description,
          sample: matches[0],
          source: 'Supabase Functions'
        });
        console.log(`  ❌ ${pattern.type}: Found in Supabase logs`);
      } else {
        console.log(`  ✅ ${pattern.type}: No errors`);
      }
    });
  } catch (error) {
    console.log(`  ⚠️  Could not check Supabase logs: ${error.message}`);
    results.warnings.push({
      source: 'Supabase',
      issue: error.message
    });
  }
}

// Check local development logs (if available)
function checkLocalLogs() {
  console.log('\n🔍 Checking local logs...\n');
  
  const logFiles = [
    '.vercel/output/logs/build.log',
    'supabase/logs/functions.log',
    'logs/error.log'
  ];
  
  let foundAnyLogs = false;
  
  logFiles.forEach(logFile => {
    if (fs.existsSync(logFile)) {
      foundAnyLogs = true;
      results.log_sources_checked.push(logFile);
      
      const content = fs.readFileSync(logFile, 'utf8');
      
      errorPatterns.forEach(pattern => {
        const matches = content.match(pattern.pattern);
        if (matches) {
          results.errors_detected.push({
            type: pattern.type,
            severity: pattern.severity,
            description: pattern.description,
            sample: matches[0].substring(0, 100),
            source: logFile
          });
          console.log(`  ❌ ${pattern.type}: Found in ${logFile}`);
        }
      });
    }
  });
  
  if (!foundAnyLogs) {
    console.log('  ℹ️  No local log files found (normal in CI/CD)');
  }
}

// Check for common deployment issues
function checkDeploymentHealth() {
  console.log('\n🏥 Checking deployment health...\n');
  
  // Check if backend exists
  if (fs.existsSync('./supabase/functions/server/index.tsx')) {
    console.log('  ✅ Backend files present');
  } else {
    results.errors_detected.push({
      type: 'DeploymentError',
      severity: 'critical',
      description: 'Backend files missing',
      source: 'File System'
    });
    console.log('  ❌ Backend files missing');
  }
  
  // Check if .env exists
  if (fs.existsSync('.env')) {
    console.log('  ✅ Environment configuration present');
  } else {
    results.warnings.push({
      source: 'Environment',
      issue: '.env file not found (may be normal in CI/CD)'
    });
    console.log('  ⚠️  .env file not found');
  }
  
  // Check if node_modules exists
  if (fs.existsSync('node_modules')) {
    console.log('  ✅ Dependencies installed');
  } else {
    results.warnings.push({
      source: 'Dependencies',
      issue: 'node_modules not found - run npm install'
    });
    console.log('  ⚠️  Dependencies not installed');
  }
}

// Main execution
async function runLogCheck() {
  await checkSupabaseLogs();
  checkLocalLogs();
  checkDeploymentHealth();
  
  // Generate summary
  const criticalErrors = results.errors_detected.filter(e => e.severity === 'critical');
  const highErrors = results.errors_detected.filter(e => e.severity === 'high');
  
  console.log('\n' + '═'.repeat(50));
  console.log('📊 LOG MONITORING SUMMARY');
  console.log('═'.repeat(50));
  console.log(`Log Sources Checked: ${results.log_sources_checked.length}`);
  console.log(`Total Errors Found: ${results.errors_detected.length}`);
  console.log(`  Critical: ${criticalErrors.length} ❌`);
  console.log(`  High: ${highErrors.length} ⚠️`);
  console.log(`Warnings: ${results.warnings.length} ℹ️`);
  console.log('');
  
  if (results.errors_detected.length > 0) {
    console.log('❌ ERRORS DETECTED:');
    results.errors_detected.forEach((error, i) => {
      console.log(`  ${i + 1}. [${error.severity.toUpperCase()}] ${error.type}`);
      console.log(`     ${error.description}`);
      console.log(`     Source: ${error.source}`);
      if (error.sample) {
        console.log(`     Sample: ${error.sample.substring(0, 80)}...`);
      }
    });
    console.log('');
  }
  
  if (results.warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    results.warnings.forEach((warning, i) => {
      console.log(`  ${i + 1}. ${warning.source}: ${warning.issue}`);
    });
    console.log('');
  }
  
  // Save report
  fs.writeFileSync('logs_summary.json', JSON.stringify(results, null, 2));
  console.log('📄 Report saved to logs_summary.json\n');
  
  // Exit with appropriate code
  if (criticalErrors.length > 0) {
    console.log('❌ CRITICAL ERRORS DETECTED - Investigate immediately!');
    process.exit(1);
  } else if (highErrors.length > 0) {
    console.log('⚠️  High-priority errors found - Monitor closely');
    process.exit(0); // Don't block deployment, but warn
  } else {
    console.log('✅ NO CRITICAL ERRORS DETECTED');
    process.exit(0);
  }
}

// Execute
runLogCheck().catch(error => {
  console.error('Fatal error during log check:', error);
  process.exit(1);
});
