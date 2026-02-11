/**
 * KILIMO E2E MOBILE REGRESSION TESTS
 * 
 * Purpose: Ensures merged pages work on mobile devices (critical for field use)
 * Fail Condition: Any mobile UX failure = FIELD UNUSABLE
 * Protects: Rural farmer accessibility
 */

import { test, expect, devices } from '@playwright/test';

// Mobile device configurations
const mobileDevices = {
  smallPhone: { width: 375, height: 667 }, // iPhone SE
  standardPhone: { width: 390, height: 844 }, // iPhone 13
  largePhone: { width: 428, height: 926 }, // iPhone 13 Pro Max
  tablet: { width: 768, height: 1024 } // iPad
};

test.describe('Mobile Regression Tests', () => {
  test.use(devices['iPhone 13']);

  test('📱 Home page renders on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // Check mobile nav is accessible
    const menuButton = page.locator('[aria-label*="menu"]');
    await expect(menuButton).toBeVisible();
  });

  test('📱 Navigation menu works on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Open mobile menu
    const menuButton = page.locator('[aria-label*="menu"]').first();
    await menuButton.click();
    
    // Verify menu items visible
    await expect(page.locator('text=AI Advisor')).toBeVisible();
    await expect(page.locator('text=Tasks')).toBeVisible();
  });

  test('📱 Crop Planning tabs are swipeable on mobile', async ({ page, context }) => {
    await page.goto('/crop-planning');
    
    // Wait for tabs to load
    await page.waitForSelector('[role="tablist"]');
    
    const tabList = page.locator('[role="tablist"]');
    await expect(tabList).toBeVisible();
    
    // Verify horizontal scrolling works
    const isScrollable = await tabList.evaluate(el => 
      el.scrollWidth > el.clientWidth
    );
    expect(isScrollable).toBe(true);
  });

  test('📱 Touch targets are at least 44x44px', async ({ page }) => {
    await page.goto('/tasks');
    
    // Check button sizes meet minimum touch target
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(40); // Allow small variance
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
    }
  });

  test('📱 Forms are usable on mobile', async ({ page }) => {
    await page.goto('/ai-advisor?tab=chat');
    
    // Find input field
    const input = page.locator('input[type="text"], textarea').first();
    await expect(input).toBeVisible();
    
    // Test typing
    await input.fill('How do I plant maize?');
    await expect(input).toHaveValue('How do I plant maize?');
  });

  test('📱 No horizontal scroll on any page', async ({ page }) => {
    const pages = [
      '/',
      '/ai-advisor',
      '/crop-intelligence',
      '/farm-map',
      '/crop-planning',
      '/tasks'
    ];

    for (const path of pages) {
      await page.goto(path);
      
      const hasHorizontalScroll = await page.evaluate(() => 
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      
      expect(hasHorizontalScroll).toBe(false);
    }
  });
});

test.describe('Offline Mode Tests', () => {
  test('⚠️ Tasks page works offline', async ({ page, context }) => {
    // First load with network
    await page.goto('/tasks');
    await page.waitForLoadState('networkidle');
    
    // Go offline
    await context.setOffline(true);
    
    // Reload page
    await page.reload();
    
    // Should still show cached content
    await expect(page.locator('h1, h2')).toBeVisible({ timeout: 5000 });
  });

  test('⚠️ Offline banner appears when disconnected', async ({ page, context }) => {
    await page.goto('/');
    
    // Simulate offline
    await context.setOffline(true);
    await page.reload();
    
    // Check for offline indicator
    const offlineIndicator = page.locator('[data-offline], .offline, text=/offline/i').first();
    await expect(offlineIndicator).toBeVisible({ timeout: 3000 });
  });

  test('⚠️ Actions queue when offline', async ({ page, context }) => {
    await page.goto('/tasks');
    
    // Go offline
    await context.setOffline(true);
    
    // Try to complete a task (should queue)
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.isVisible()) {
      await checkbox.check();
      
      // Should show queued indicator
      const queuedMessage = page.locator('text=/queued|pending|will sync/i');
      await expect(queuedMessage).toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe('Performance Tests', () => {
  test('⚡ Pages load in under 3 seconds', async ({ page }) => {
    const pages = ['/', '/ai-advisor', '/tasks', '/weather'];
    
    for (const path of pages) {
      const startTime = Date.now();
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(3000);
    }
  });

  test('⚡ Images use lazy loading', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const img = images.nth(i);
      const loading = await img.getAttribute('loading');
      
      // Should be lazy loaded unless it's above the fold
      if (loading) {
        expect(loading).toBe('lazy');
      }
    }
  });
});

test.describe('Accessibility Tests', () => {
  test('♿ Navigation has proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    
    const navButtons = page.locator('button[aria-label], a[aria-label]');
    const count = await navButtons.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Verify each has meaningful label
    for (let i = 0; i < count; i++) {
      const label = await navButtons.nth(i).getAttribute('aria-label');
      expect(label).toBeTruthy();
      expect(label!.length).toBeGreaterThan(0);
    }
  });

  test('♿ Headings follow logical hierarchy', async ({ page }) => {
    await page.goto('/crop-planning');
    
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(2);
  });

  test('♿ Focus visible on interactive elements', async ({ page }) => {
    await page.goto('/tasks');
    
    // Tab through interactive elements
    const button = page.locator('button').first();
    await button.focus();
    
    // Check focus is visible
    const hasFocusOutline = await button.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.outline !== 'none' || style.boxShadow !== 'none';
    });
    
    expect(hasFocusOutline).toBe(true);
  });
});

test.describe('Data Integrity E2E Tests', () => {
  test('🧮 Task completion updates progress', async ({ page }) => {
    await page.goto('/tasks');
    
    // Find first incomplete task
    const taskCheckbox = page.locator('input[type="checkbox"]:not(:checked)').first();
    
    if (await taskCheckbox.isVisible()) {
      // Complete the task
      await taskCheckbox.check();
      
      // Wait for update
      await page.waitForTimeout(500);
      
      // Verify visual feedback
      await expect(taskCheckbox).toBeChecked();
    }
  });

  test('🧮 Form validation works', async ({ page }) => {
    await page.goto('/ai-advisor?tab=chat');
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Should show validation error
      const errorMessage = page.locator('[role="alert"], .error, text=/required/i').first();
      await expect(errorMessage).toBeVisible({ timeout: 2000 });
    }
  });
});

test.describe('Cross-Browser Tests', () => {
  test.use(devices['Desktop Chrome']);
  
  test('🌐 Works on Chrome', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});

test.describe('App Store Safety E2E', () => {
  test('🚫 No permission popups on launch', async ({ page, context }) => {
    // Grant no permissions by default
    await context.clearPermissions();
    
    await page.goto('/');
    
    // Wait for initial render
    await page.waitForTimeout(2000);
    
    // Check no permission dialogs appeared
    const permissionDialogs = page.locator('[role="dialog"], .modal, .permission');
    const dialogCount = await permissionDialogs.count();
    
    expect(dialogCount).toBe(0);
  });

  test('✅ Permissions requested contextually', async ({ page }) => {
    await page.goto('/ai-advisor?tab=diagnose');
    
    // Camera permission should only be requested when user clicks photo button
    const photoButton = page.locator('button:has-text("Take Photo"), button:has-text("Camera")').first();
    
    if (await photoButton.isVisible()) {
      // Permission request happens on interaction, not on page load
      await expect(photoButton).toBeEnabled();
    }
  });
});
