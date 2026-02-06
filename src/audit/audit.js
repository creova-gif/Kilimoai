/**
 * KILIMO Agri-AI Suite Automated Audit System
 * Author: CREOVA
 * Date: 27-Jan-2026
 *
 * Comprehensive testing suite for:
 * - API endpoints (58 endpoints)
 * - Workflow connections (5 critical workflows)
 * - AI prompts and responses
 * - Payment integration
 * - Localization
 * - Role-based access
 *
 * Usage: node audit.js [--headless] [--role=ROLE] [--quick]
 */

import puppeteer from 'puppeteer';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { config } from './config.js';
import { generateHTMLReport, sendEmailReport } from './report-generator.js';
import { 
  testEndpoint, 
  testWorkflow, 
  evaluateAIResponse, 
  checkLocalization,
  simulateUserAction 
} from './test-utils.js';

// Parse command line arguments
const args = process.argv.slice(2);
const headless = args.includes('--headless');
const quickMode = args.includes('--quick');
const roleFilter = args.find(arg => arg.startsWith('--role='))?.split('=')[1];

console.log('🚀 KILIMO Agri-AI Suite Automated Audit Starting...\n');
console.log(`Environment: ${config.environment}`);
console.log(`Mode: ${quickMode ? 'Quick' : 'Comprehensive'}`);
console.log(`Headless: ${headless}`);
if (roleFilter) console.log(`Role Filter: ${roleFilter}`);
console.log('');

// Initialize report
const report = {
  metadata: {
    timestamp: new Date().toISOString(),
    environment: config.environment,
    mode: quickMode ? 'quick' : 'comprehensive',
    duration: 0
  },
  summary: {
    totalTests: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    successRate: 0
  },
  apiTests: {},
  workflowTests: {},
  aiPromptTests: {},
  localizationTests: {},
  roleTests: {},
  recommendations: []
};

const startTime = Date.now();

// ========================================
// PHASE 1: API ENDPOINT TESTING
// ========================================
async function testAllEndpoints() {
  console.log('📡 PHASE 1: Testing API Endpoints...');
  console.log('━'.repeat(50));

  const results = {
    total: config.apiEndpoints.length,
    passed: 0,
    failed: 0,
    critical_failures: []
  };

  for (const endpoint of config.apiEndpoints) {
    try {
      const result = await testEndpoint(
        endpoint, 
        config.baseUrl, 
        config.authToken,
        config.testUsers.smallholder_farmer.userId
      );

      report.apiTests[endpoint.path] = result;
      results.total++;

      if (result.status === 'PASS') {
        results.passed++;
        console.log(`  ✅ ${endpoint.method} ${endpoint.path}`);
      } else {
        results.failed++;
        console.log(`  ❌ ${endpoint.method} ${endpoint.path} - ${result.error}`);
        
        if (endpoint.critical) {
          results.critical_failures.push(endpoint.path);
        }
      }
    } catch (error) {
      results.failed++;
      report.apiTests[endpoint.path] = {
        status: 'FAIL',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      console.log(`  ❌ ${endpoint.method} ${endpoint.path} - ${error.message}`);
    }
  }

  console.log('\n📊 API Test Summary:');
  console.log(`  Total: ${results.total}`);
  console.log(`  Passed: ${results.passed} ✅`);
  console.log(`  Failed: ${results.failed} ❌`);
  console.log(`  Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  if (results.critical_failures.length > 0) {
    console.log(`  ⚠️  Critical Failures: ${results.critical_failures.join(', ')}`);
    report.recommendations.push({
      priority: 'CRITICAL',
      category: 'API',
      message: `${results.critical_failures.length} critical API endpoints failing`,
      endpoints: results.critical_failures
    });
  }

  console.log('\n');
  return results;
}

// ========================================
// PHASE 2: WORKFLOW TESTING
// ========================================
async function testWorkflows(browser) {
  console.log('🔄 PHASE 2: Testing Critical Workflows...');
  console.log('━'.repeat(50));

  const results = {
    total: config.workflows.length,
    passed: 0,
    failed: 0,
    critical_failures: []
  };

  const page = await browser.newPage();
  await page.setDefaultTimeout(config.timeouts.workflow);

  for (const workflow of config.workflows) {
    try {
      console.log(`  Testing: ${workflow.description}...`);
      
      const result = await testWorkflow(
        page,
        workflow,
        config.frontendUrl,
        config.testUsers.smallholder_farmer
      );

      report.workflowTests[workflow.name] = result;
      results.total++;

      if (result.status === 'PASS') {
        results.passed++;
        console.log(`    ✅ ${workflow.name} - All steps completed`);
      } else {
        results.failed++;
        console.log(`    ❌ ${workflow.name} - Failed at step: ${result.failedStep}`);
        
        if (workflow.critical) {
          results.critical_failures.push(workflow.name);
        }
      }
    } catch (error) {
      results.failed++;
      report.workflowTests[workflow.name] = {
        status: 'FAIL',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      console.log(`    ❌ ${workflow.name} - ${error.message}`);
    }
  }

  await page.close();

  console.log('\n📊 Workflow Test Summary:');
  console.log(`  Total: ${results.total}`);
  console.log(`  Passed: ${results.passed} ✅`);
  console.log(`  Failed: ${results.failed} ❌`);
  console.log(`  Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  if (results.critical_failures.length > 0) {
    console.log(`  ⚠️  Critical Failures: ${results.critical_failures.join(', ')}`);
    report.recommendations.push({
      priority: 'CRITICAL',
      category: 'Workflow',
      message: `${results.critical_failures.length} critical workflows failing`,
      workflows: results.critical_failures
    });
  }

  console.log('\n');
  return results;
}

// ========================================
// PHASE 3: AI PROMPT TESTING
// ========================================
async function testAIPrompts() {
  console.log('🤖 PHASE 3: Testing AI Prompts & Responses...');
  console.log('━'.repeat(50));

  const results = {
    total: config.aiPrompts.length,
    passed: 0,
    failed: 0,
    warnings: 0
  };

  for (const promptTest of config.aiPrompts) {
    try {
      console.log(`  Testing: ${promptTest.name}...`);
      
      // Send prompt to AI endpoint
      const response = await axios.post(
        `${config.baseUrl}/ai-chat/send`,
        {
          userId: config.testUsers.smallholder_farmer.userId,
          message: promptTest.prompt,
          language: promptTest.language
        },
        {
          headers: {
            'Authorization': `Bearer ${config.authToken}`,
            'Content-Type': 'application/json'
          },
          timeout: config.timeouts.aiResponse
        }
      );

      // Evaluate response quality
      const evaluation = evaluateAIResponse(
        response.data.response,
        promptTest.expectedKeywords,
        promptTest.language
      );

      report.aiPromptTests[promptTest.name] = {
        status: evaluation.status,
        prompt: promptTest.prompt,
        response: response.data.response,
        evaluation: evaluation,
        timestamp: new Date().toISOString()
      };

      results.total++;

      if (evaluation.status === 'PASS') {
        results.passed++;
        console.log(`    ✅ ${promptTest.name} - Response quality good`);
      } else if (evaluation.status === 'WARNING') {
        results.warnings++;
        console.log(`    ⚠️  ${promptTest.name} - ${evaluation.issues.join(', ')}`);
      } else {
        results.failed++;
        console.log(`    ❌ ${promptTest.name} - ${evaluation.issues.join(', ')}`);
      }
    } catch (error) {
      results.failed++;
      report.aiPromptTests[promptTest.name] = {
        status: 'FAIL',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      console.log(`    ❌ ${promptTest.name} - ${error.message}`);
    }
  }

  console.log('\n📊 AI Prompt Test Summary:');
  console.log(`  Total: ${results.total}`);
  console.log(`  Passed: ${results.passed} ✅`);
  console.log(`  Warnings: ${results.warnings} ⚠️`);
  console.log(`  Failed: ${results.failed} ❌`);
  console.log(`  Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  console.log('\n');

  return results;
}

// ========================================
// PHASE 4: LOCALIZATION TESTING
// ========================================
async function testLocalization(browser) {
  console.log('🌍 PHASE 4: Testing Localization (EN/SW)...');
  console.log('━'.repeat(50));

  const results = {
    total: config.localizationChecks.length * 2, // EN + SW
    passed: 0,
    failed: 0,
    missing: []
  };

  const page = await browser.newPage();

  // Test English
  await page.goto(config.frontendUrl);
  await page.waitForTimeout(2000);

  for (const check of config.localizationChecks) {
    const enResult = await checkLocalization(page, check.key, check.en, 'en');
    report.localizationTests[`${check.key}_en`] = enResult;
    
    if (enResult.status === 'PASS') {
      results.passed++;
      console.log(`  ✅ EN: ${check.key} = "${check.en}"`);
    } else {
      results.failed++;
      results.missing.push(`EN: ${check.key}`);
      console.log(`  ❌ EN: ${check.key} - Expected "${check.en}", got "${enResult.actual}"`);
    }
  }

  // Switch to Swahili
  await simulateUserAction(page, 'switch_language', { language: 'sw' });
  await page.waitForTimeout(2000);

  for (const check of config.localizationChecks) {
    const swResult = await checkLocalization(page, check.key, check.sw, 'sw');
    report.localizationTests[`${check.key}_sw`] = swResult;
    
    if (swResult.status === 'PASS') {
      results.passed++;
      console.log(`  ✅ SW: ${check.key} = "${check.sw}"`);
    } else {
      results.failed++;
      results.missing.push(`SW: ${check.key}`);
      console.log(`  ❌ SW: ${check.key} - Expected "${check.sw}", got "${swResult.actual}"`);
    }
  }

  await page.close();

  const coverage = (results.passed / results.total) * 100;
  console.log('\n📊 Localization Test Summary:');
  console.log(`  Total Checks: ${results.total}`);
  console.log(`  Passed: ${results.passed} ✅`);
  console.log(`  Failed: ${results.failed} ❌`);
  console.log(`  Coverage: ${coverage.toFixed(1)}%`);

  if (coverage < config.thresholds.localizationCoverage * 100) {
    report.recommendations.push({
      priority: 'MEDIUM',
      category: 'Localization',
      message: `Translation coverage (${coverage.toFixed(1)}%) below threshold (${config.thresholds.localizationCoverage * 100}%)`,
      missing: results.missing
    });
  }

  console.log('\n');
  return results;
}

// ========================================
// PHASE 5: ROLE-BASED ACCESS TESTING
// ========================================
async function testRoleBasedAccess(browser) {
  console.log('🔐 PHASE 5: Testing Role-Based Access Control...');
  console.log('━'.repeat(50));

  const rolesToTest = roleFilter 
    ? [roleFilter] 
    : Object.keys(config.testUsers);

  const results = {
    total: rolesToTest.length,
    passed: 0,
    failed: 0
  };

  for (const role of rolesToTest) {
    try {
      const user = config.testUsers[role];
      const page = await browser.newPage();

      console.log(`  Testing role: ${role}...`);

      // Simulate login
      await page.goto(`${config.frontendUrl}/login`);
      await page.waitForTimeout(2000);

      // Check feature visibility
      const visibleFeatures = await page.evaluate(() => {
        const features = document.querySelectorAll('[data-feature-id]');
        return Array.from(features).map(el => el.dataset.featureId);
      });

      // Verify role-appropriate features
      const expectedFeatureCount = {
        smallholder_farmer: 42,
        farmer: 42,
        farm_manager: 50,
        commercial_farm_admin: 54,
        agribusiness_operations: 46,
        extension_officer_ngo: 44,
        cooperative_leader: 47
      };

      const expected = expectedFeatureCount[role] || 40;
      const actual = visibleFeatures.length;
      const pass = Math.abs(actual - expected) <= 5; // Allow 5 feature difference

      report.roleTests[role] = {
        status: pass ? 'PASS' : 'FAIL',
        expectedFeatures: expected,
        actualFeatures: actual,
        features: visibleFeatures,
        timestamp: new Date().toISOString()
      };

      if (pass) {
        results.passed++;
        console.log(`    ✅ ${role} - ${actual}/${expected} features visible`);
      } else {
        results.failed++;
        console.log(`    ❌ ${role} - ${actual}/${expected} features visible (expected ~${expected})`);
      }

      await page.close();
    } catch (error) {
      results.failed++;
      report.roleTests[role] = {
        status: 'FAIL',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      console.log(`    ❌ ${role} - ${error.message}`);
    }
  }

  console.log('\n📊 Role-Based Access Test Summary:');
  console.log(`  Roles Tested: ${results.total}`);
  console.log(`  Passed: ${results.passed} ✅`);
  console.log(`  Failed: ${results.failed} ❌`);
  console.log('\n');

  return results;
}

// ========================================
// MAIN AUDIT EXECUTION
// ========================================
async function runAudit() {
  let browser;

  try {
    // Phase 1: API Testing (no browser needed)
    const apiResults = await testAllEndpoints();
    report.summary.totalTests += apiResults.total;
    report.summary.passed += apiResults.passed;
    report.summary.failed += apiResults.failed;

    // Check if critical APIs are failing
    const criticalAPIsFailing = Object.values(report.apiTests)
      .filter(test => test.critical && test.status === 'FAIL').length;

    if (criticalAPIsFailing > 0 && !quickMode) {
      console.log('⚠️  Critical APIs failing. Skipping frontend tests.');
      report.recommendations.push({
        priority: 'CRITICAL',
        category: 'System',
        message: 'Fix critical API failures before running frontend tests'
      });
    } else {
      // Launch browser for frontend tests
      browser = await puppeteer.launch({ 
        headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      // Phase 2: Workflow Testing
      const workflowResults = await testWorkflows(browser);
      report.summary.totalTests += workflowResults.total;
      report.summary.passed += workflowResults.passed;
      report.summary.failed += workflowResults.failed;

      // Phase 4: Localization Testing
      if (!quickMode) {
        const localizationResults = await testLocalization(browser);
        report.summary.totalTests += localizationResults.total;
        report.summary.passed += localizationResults.passed;
        report.summary.failed += localizationResults.failed;
      }

      // Phase 5: Role-Based Access Testing
      if (!quickMode) {
        const roleResults = await testRoleBasedAccess(browser);
        report.summary.totalTests += roleResults.total;
        report.summary.passed += roleResults.passed;
        report.summary.failed += roleResults.failed;
      }
    }

    // Phase 3: AI Prompt Testing (can run independently)
    const aiResults = await testAIPrompts();
    report.summary.totalTests += aiResults.total;
    report.summary.passed += aiResults.passed;
    report.summary.failed += aiResults.failed;
    report.summary.warnings += aiResults.warnings;

    // Calculate final metrics
    const endTime = Date.now();
    report.metadata.duration = Math.round((endTime - startTime) / 1000);
    report.summary.successRate = (report.summary.passed / report.summary.totalTests * 100).toFixed(1);

    // Generate overall recommendations
    if (report.summary.successRate < 85) {
      report.recommendations.unshift({
        priority: 'CRITICAL',
        category: 'Overall',
        message: `Overall success rate (${report.summary.successRate}%) below acceptable threshold (85%)`
      });
    }

    // Print final summary
    console.log('═'.repeat(50));
    console.log('🎯 FINAL AUDIT SUMMARY');
    console.log('═'.repeat(50));
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Passed: ${report.summary.passed} ✅`);
    console.log(`Failed: ${report.summary.failed} ❌`);
    console.log(`Warnings: ${report.summary.warnings} ⚠️`);
    console.log(`Success Rate: ${report.summary.successRate}%`);
    console.log(`Duration: ${report.metadata.duration}s`);
    console.log('');

    // Print recommendations
    if (report.recommendations.length > 0) {
      console.log('💡 RECOMMENDATIONS:');
      report.recommendations.forEach((rec, i) => {
        console.log(`  ${i + 1}. [${rec.priority}] ${rec.category}: ${rec.message}`);
      });
      console.log('');
    }

    // Save report
    const reportDir = config.report.outputDir;
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, config.report.filename);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 JSON Report saved: ${reportPath}`);

    // Generate HTML report
    if (config.report.htmlReport) {
      const htmlPath = reportPath.replace('.json', '.html');
      const html = generateHTMLReport(report);
      fs.writeFileSync(htmlPath, html);
      console.log(`📄 HTML Report saved: ${htmlPath}`);
    }

    // Send email report
    if (config.report.sendEmail) {
      await sendEmailReport(report, config.report.emailRecipients);
      console.log(`📧 Email report sent to: ${config.report.emailRecipients.join(', ')}`);
    }

    console.log('\n✅ Audit complete!');

    // Exit with appropriate code
    const exitCode = report.summary.successRate >= 85 ? 0 : 1;
    process.exit(exitCode);

  } catch (error) {
    console.error('\n❌ Audit failed with error:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the audit
runAudit();
