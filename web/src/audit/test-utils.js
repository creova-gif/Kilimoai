/**
 * KILIMO Audit Test Utilities
 * Helper functions for testing endpoints, workflows, AI, etc.
 */

import axios from 'axios';

/**
 * Test a single API endpoint
 */
export async function testEndpoint(endpoint, baseUrl, authToken, userId) {
  try {
    const url = `${baseUrl}${endpoint.path.replace(':userId', userId).replace(':region', 'Morogoro')}`;
    const headers = {
      'Content-Type': 'application/json'
    };

    if (endpoint.requiresAuth) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const config = {
      method: endpoint.method,
      url,
      headers,
      timeout: 10000,
      validateStatus: () => true // Don't throw on any status
    };

    // Add test data for POST requests
    if (endpoint.method === 'POST') {
      config.data = generateTestData(endpoint.path, userId);
    }

    const response = await axios(config);

    // Consider 200, 201, 204 as success
    const isSuccess = [200, 201, 204].includes(response.status);
    
    return {
      status: isSuccess ? 'PASS' : 'FAIL',
      statusCode: response.status,
      responseTime: response.headers['x-response-time'] || 'N/A',
      error: !isSuccess ? response.data.error || `HTTP ${response.status}` : null,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'FAIL',
      statusCode: error.response?.status || 0,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Generate appropriate test data for POST requests
 */
function generateTestData(path, userId) {
  const dataMap = {
    '/auth/send-otp': {
      phoneNumber: '+255712345678'
    },
    '/auth/verify-otp': {
      phoneNumber: '+255712345678',
      otp: '123456'
    },
    '/register': {
      name: 'Test User',
      phone: '+255712345678',
      role: 'smallholder_farmer',
      region: 'Morogoro'
    },
    '/login': {
      phone: '+255712345678',
      password: 'test123'
    },
    '/wallet/add-funds': {
      userId,
      amount: 10000,
      transactionRef: `TEST-${Date.now()}`
    },
    '/wallet/withdraw': {
      userId,
      amount: 5000,
      phoneNumber: '+255712345678',
      provider: 'M-Pesa'
    },
    '/payments/deposit/initiate': {
      userId,
      amount: 10000,
      phoneNumber: '+255712345678',
      paymentMethod: 'M-Pesa'
    },
    '/payments/verify': {
      transactionId: 'TEST-123456'
    },
    '/tasks/create': {
      userId,
      title: 'Test Task',
      description: 'Test description',
      priority: 'normal',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    '/tasks/update': {
      taskId: 'test-task-123',
      status: 'completed'
    },
    '/ai-chat/send': {
      userId,
      message: 'When should I plant maize?',
      language: 'en'
    },
    '/diagnosis/analyze': {
      userId,
      imageData: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
      cropType: 'maize'
    },
    '/alerts/create': {
      userId,
      type: 'weather',
      severity: 'medium',
      message: 'Test alert'
    },
    '/notifications/send-sms': {
      phoneNumber: '+255712345678',
      message: 'Test SMS'
    },
    '/marketplace/order/create': {
      userId,
      productId: 'test-product-123',
      quantity: 10,
      totalAmount: 50000
    },
    '/crop-plan/add-crop': {
      userId,
      cropName: 'Maize',
      plantingDate: new Date().toISOString(),
      expectedHarvestDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
      landSize: 2
    },
    '/livestock/add': {
      userId,
      type: 'cattle',
      breed: 'Holstein',
      age: 24,
      healthStatus: 'good'
    }
  };

  // Find matching key (exact or partial match)
  const key = Object.keys(dataMap).find(k => path.includes(k.replace(/\/:[^/]+/g, '')));
  return dataMap[key] || { userId };
}

/**
 * Test a workflow with multiple steps
 */
export async function testWorkflow(page, workflow, frontendUrl, testUser) {
  const result = {
    status: 'PASS',
    steps: [],
    failedStep: null,
    error: null,
    timestamp: new Date().toISOString()
  };

  try {
    // Navigate to app
    await page.goto(frontendUrl);
    await page.waitForTimeout(2000);

    // Execute each step
    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      const stepResult = await executeWorkflowStep(page, step, testUser);

      result.steps.push({
        step: i + 1,
        action: step.action,
        status: stepResult.status,
        error: stepResult.error
      });

      if (stepResult.status !== 'PASS') {
        result.status = 'FAIL';
        result.failedStep = i + 1;
        result.error = stepResult.error;
        break;
      }
    }
  } catch (error) {
    result.status = 'FAIL';
    result.error = error.message;
  }

  return result;
}

/**
 * Execute a single workflow step
 */
async function executeWorkflowStep(page, step, testUser) {
  try {
    switch (step.action) {
      case 'send_ai_message':
        await page.type('[data-testid="ai-chat-input"]', step.data.message);
        await page.click('[data-testid="ai-chat-send"]');
        await page.waitForTimeout(3000);
        return { status: 'PASS' };

      case 'verify_response':
        const response = await page.$eval('[data-testid="ai-response"]', el => el.textContent);
        const check = eval(step.check.replace('response', `"${response}"`));
        return check ? { status: 'PASS' } : { status: 'FAIL', error: 'Response verification failed' };

      case 'click_add_to_tasks':
        await page.waitForSelector(step.selector, { timeout: 5000 });
        await page.click(step.selector);
        await page.waitForTimeout(1000);
        return { status: 'PASS' };

      case 'verify_task_created':
        await page.waitForTimeout(2000);
        const tasks = await page.evaluate(() => {
          return window.__KILIMO_TEST_DATA__?.tasks || [];
        });
        const check2 = eval(step.check);
        return check2 ? { status: 'PASS' } : { status: 'FAIL', error: 'Task not created' };

      case 'upload_image':
        const fileInput = await page.$('[data-testid="image-upload"]');
        await fileInput.uploadFile('./test-data/crop-disease.jpg');
        await page.waitForTimeout(2000);
        return { status: 'PASS' };

      case 'verify_diagnosis':
        await page.waitForSelector('[data-testid="diagnosis-result"]', { timeout: 30000 });
        const diagnosis = await page.evaluate(() => window.__KILIMO_TEST_DATA__?.diagnosis);
        return diagnosis?.disease ? { status: 'PASS' } : { status: 'FAIL', error: 'No diagnosis found' };

      case 'confirm_task_creation':
        await page.waitForSelector(step.selector, { timeout: 5000 });
        await page.click(step.selector);
        await page.waitForTimeout(1000);
        return { status: 'PASS' };

      case 'get_initial_balance':
        const balance = await page.evaluate(() => {
          return window.__KILIMO_TEST_DATA__?.wallet?.balance || 0;
        });
        page.__TEST_STORAGE__ = { initialBalance: balance };
        return { status: 'PASS' };

      case 'initiate_deposit':
        await page.type('[data-testid="deposit-amount"]', step.data.amount.toString());
        await page.click(`[data-provider="${step.data.provider}"]`);
        await page.click('[data-testid="deposit-button"]');
        await page.waitForTimeout(2000);
        return { status: 'PASS' };

      case 'verify_transaction_created':
        const transaction = await page.evaluate(() => window.__KILIMO_TEST_DATA__?.lastTransaction);
        return transaction?.id ? { status: 'PASS' } : { status: 'FAIL', error: 'Transaction not created' };

      case 'simulate_payment_success':
        // In a real test, this would wait for payment callback
        await page.waitForTimeout(5000);
        return { status: 'PASS' };

      case 'verify_balance_updated':
        const newBalance = await page.evaluate(() => window.__KILIMO_TEST_DATA__?.wallet?.balance || 0);
        const check3 = newBalance > page.__TEST_STORAGE__.initialBalance;
        return check3 ? { status: 'PASS' } : { status: 'FAIL', error: 'Balance not updated' };

      default:
        return { status: 'FAIL', error: `Unknown action: ${step.action}` };
    }
  } catch (error) {
    return { status: 'FAIL', error: error.message };
  }
}

/**
 * Evaluate AI response quality
 */
export function evaluateAIResponse(response, expectedKeywords, language) {
  const issues = [];
  let status = 'PASS';

  // Check if response exists
  if (!response || response.length === 0) {
    return { status: 'FAIL', issues: ['Empty response'] };
  }

  // Check if response is error
  if (response.toLowerCase().includes('error') || response.toLowerCase().includes('failed')) {
    return { status: 'FAIL', issues: ['Response contains error'] };
  }

  // Check for expected keywords
  const lowerResponse = response.toLowerCase();
  const missingKeywords = expectedKeywords.filter(keyword => 
    !lowerResponse.includes(keyword.toLowerCase())
  );

  if (missingKeywords.length > 0) {
    status = 'WARNING';
    issues.push(`Missing keywords: ${missingKeywords.join(', ')}`);
  }

  // Check response length (should be substantial)
  if (response.length < 50) {
    status = 'WARNING';
    issues.push('Response too short (< 50 characters)');
  }

  // Check language consistency
  if (language === 'sw') {
    // Simple check for Swahili characters/words
    const swahiliIndicators = ['na', 'wa', 'ya', 'za', 'kwa', 'mwezi', 'siku'];
    const hasSwahili = swahiliIndicators.some(word => lowerResponse.includes(word));
    if (!hasSwahili) {
      status = 'WARNING';
      issues.push('Response may not be in Swahili');
    }
  }

  // Check for actionable advice
  const actionWords = ['should', 'apply', 'use', 'plant', 'spray', 'treat', 'add'];
  const hasAction = actionWords.some(word => lowerResponse.includes(word));
  if (!hasAction) {
    status = 'WARNING';
    issues.push('Response lacks actionable advice');
  }

  return { status, issues };
}

/**
 * Check localization for a specific key
 */
export async function checkLocalization(page, key, expectedText, language) {
  try {
    // Look for element with data-i18n attribute or specific text
    const actualText = await page.evaluate((k, lang) => {
      // Try data-i18n attribute first
      const element = document.querySelector(`[data-i18n="${k}"]`);
      if (element) {
        return element.textContent.trim();
      }

      // Fall back to searching all text content
      const allText = document.body.innerText;
      return allText;
    }, key, language);

    const matches = actualText.includes(expectedText);

    return {
      status: matches ? 'PASS' : 'FAIL',
      expected: expectedText,
      actual: actualText.substring(0, 100), // First 100 chars
      language,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'FAIL',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Simulate user action (click, type, etc.)
 */
export async function simulateUserAction(page, action, data) {
  try {
    switch (action) {
      case 'switch_language':
        await page.click('[data-testid="language-toggle"]');
        await page.waitForTimeout(500);
        break;

      case 'click':
        await page.click(data.selector);
        break;

      case 'type':
        await page.type(data.selector, data.text);
        break;

      case 'select':
        await page.select(data.selector, data.value);
        break;

      case 'wait':
        await page.waitForTimeout(data.duration || 1000);
        break;

      default:
        console.warn(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error(`Failed to simulate action ${action}:`, error.message);
  }
}

/**
 * Capture screenshot on failure
 */
export async function captureScreenshot(page, testName) {
  try {
    const filename = `./audit-reports/screenshots/${testName}-${Date.now()}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    return filename;
  } catch (error) {
    console.error('Failed to capture screenshot:', error.message);
    return null;
  }
}

/**
 * Wait for API response
 */
export async function waitForAPIResponse(page, urlPattern, timeout = 10000) {
  try {
    const response = await page.waitForResponse(
      response => response.url().includes(urlPattern) && response.status() === 200,
      { timeout }
    );
    return await response.json();
  } catch (error) {
    throw new Error(`Timeout waiting for API response: ${urlPattern}`);
  }
}

export default {
  testEndpoint,
  testWorkflow,
  evaluateAIResponse,
  checkLocalization,
  simulateUserAction,
  captureScreenshot,
  waitForAPIResponse
};
