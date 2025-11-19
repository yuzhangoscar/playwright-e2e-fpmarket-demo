import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// WCAG Accessibility Test Suite for Crypto Trading Platform
test.describe('WCAG Accessibility Compliance Tests', () => {
  // Set longer timeout for complex trading pages
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    // Navigate to the main crypto trading page
    await page.goto(process.env.BASE_URL || 'https://crypto.com/exchange/trade/BTC_USD');

    // Wait for initial page load
    await page.waitForLoadState('domcontentloaded');

    // Dismiss modals and popups before accessibility testing
    await dismissAllModals(page);

    // Wait for page to be ready for accessibility testing
    await page.waitForLoadState('domcontentloaded');

    // Give a moment for any remaining dynamic content to load
    await page.waitForTimeout(2000);
  });

  // Helper function to dismiss all modals and popups
  async function dismissAllModals(page: Page) {
    try {
      // Wait for any initial popups to appear
      await page.waitForTimeout(2000);

      // 1. Handle Cookie Banner/Dialog
      const cookieSelectors = [
        '[role="dialog"]:has-text("cookie")',
        '[role="dialog"]:has-text("We use cookies")',
        '.cookie-banner',
        '[data-testid="cookie-banner"]',
        '[class*="cookie"]',
        'div:has-text("Accept non-essential cookies")',
      ];

      for (const selector of cookieSelectors) {
        try {
          const cookieDialog = page.locator(selector).first();
          if (await cookieDialog.isVisible({ timeout: 2000 })) {
            console.log('Found cookie dialog, attempting to dismiss...');

            // Try to click accept button
            const acceptButtons = [
              'button:has-text("Accept")',
              'button:has-text("Accept all")',
              'button:has-text("Accept non-essential cookies")',
              'button:has-text("Got it")',
              'button:has-text("OK")',
              '[data-testid="accept-cookies"]',
            ];

            for (const btnSelector of acceptButtons) {
              const acceptBtn = cookieDialog.locator(btnSelector);
              if (await acceptBtn.isVisible({ timeout: 1000 })) {
                await acceptBtn.click();
                await page.waitForTimeout(1000);
                console.log('Cookie dialog dismissed');
                break;
              }
            }
          }
        } catch {
          // Continue if this selector fails
        }
      }

      // 2. Handle Tutorial/Onboarding Modal (Skip/Next buttons)
      const tutorialSelectors = [
        '[role="dialog"]:has(button:has-text("Skip"))',
        '[role="dialog"]:has(button:has-text("Next"))',
        '.modal:has(button:has-text("Skip"))',
        '.tutorial-modal',
        '[data-testid="tutorial"]',
        '[class*="onboard"]',
        '[class*="tutorial"]',
      ];

      for (const selector of tutorialSelectors) {
        try {
          const tutorialDialog = page.locator(selector).first();
          if (await tutorialDialog.isVisible({ timeout: 2000 })) {
            console.log('Found tutorial/onboarding dialog, attempting to dismiss...');

            // Try to click Skip button first (preferred over Next)
            const skipButton = tutorialDialog.locator('button:has-text("Skip")');
            if (await skipButton.isVisible({ timeout: 1000 })) {
              await skipButton.click();
              await page.waitForTimeout(1000);
              console.log('Tutorial dialog skipped');
              continue;
            }

            // If no Skip button, look for Close button
            const closeButtons = [
              'button:has-text("Close")',
              'button:has-text("×")',
              'button[aria-label="Close"]',
              '.close-button',
              '[data-testid="close"]',
            ];

            for (const closeSelector of closeButtons) {
              const closeBtn = tutorialDialog.locator(closeSelector);
              if (await closeBtn.isVisible({ timeout: 1000 })) {
                await closeBtn.click();
                await page.waitForTimeout(1000);
                console.log('Tutorial dialog closed');
                break;
              }
            }
          }
        } catch {
          // Continue if this selector fails
        }
      }

      // 3. Handle any remaining modals/dialogs
      const genericModalSelectors = [
        '[role="dialog"]',
        '.modal',
        '[class*="modal"]',
        '[class*="popup"]',
        '[data-testid*="modal"]',
        '[data-testid*="dialog"]',
      ];

      for (const selector of genericModalSelectors) {
        try {
          const modals = await page.locator(selector).all();
          for (const modal of modals) {
            if (await modal.isVisible({ timeout: 1000 })) {
              console.log('Found generic modal, attempting to dismiss...');

              // Try various close methods
              const dismissSelectors = [
                'button:has-text("Skip")',
                'button:has-text("Close")',
                'button:has-text("Cancel")',
                'button:has-text("×")',
                'button[aria-label="Close"]',
                '.close',
                '[data-testid="close"]',
              ];

              for (const dismissSelector of dismissSelectors) {
                const dismissBtn = modal.locator(dismissSelector);
                if (await dismissBtn.isVisible({ timeout: 1000 })) {
                  await dismissBtn.click();
                  await page.waitForTimeout(1000);
                  console.log('Generic modal dismissed');
                  break;
                }
              }

              // If no dismiss button found, try pressing Escape
              try {
                await page.keyboard.press('Escape');
                await page.waitForTimeout(500);
                console.log('Modal dismissed with Escape key');
              } catch {
                // Escape didn't work, continue
              }
            }
          }
        } catch {
          // Continue if this selector fails
        }
      }

      // 4. Final check - wait for any animations to complete
      await page.waitForTimeout(1000);

      console.log('Modal dismissal complete');
    } catch (error) {
      console.log('Error during modal dismissal:', error);
      // Don't fail the test if modal dismissal has issues
    }
  }

  test('Modal Dismissal Verification', async ({ page }) => {
    // Verify that all modals/popups have been properly dismissed
    await page.waitForTimeout(2000);

    const remainingModals = await page
      .locator('[role="dialog"], .modal, [class*="modal"], [class*="popup"]')
      .count();
    console.log(`Remaining modals after dismissal: ${remainingModals}`);

    // Take screenshot to verify clean state
    await page.screenshot({
      path: 'test-results/modal-dismissal-verification.png',
      fullPage: true,
    });

    expect(remainingModals).toBe(0);
  });

  test('WCAG 2.1 AA Level - Full Page Scan', async ({ page }) => {
    // Additional wait to ensure page is completely stable
    await page.waitForTimeout(1000);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('WCAG 2.1 Level A - Critical Issues', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag21a'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('WCAG 2.2 AAA Level - Enhanced Compliance', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aaa', 'wcag22aa'])
      .analyze();

    // For AAA level, we might allow some violations but should document them
    if (accessibilityScanResults.violations.length > 0) {
      console.log(
        'WCAG 2.2 AAA Violations found:',
        accessibilityScanResults.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length,
        }))
      );
    }
  });

  test('Navigation and Keyboard Accessibility', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');

    // Check for focus indicators
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Run accessibility scan specifically for keyboard navigation
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['keyboard'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Color Contrast and Visual Accessibility', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Form and Input Accessibility', async ({ page }) => {
    // Look for forms and inputs
    const forms = page.locator('form');
    const inputs = page.locator('input, select, textarea');

    if ((await forms.count()) > 0 || (await inputs.count()) > 0) {
      const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['forms']).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test('Images and Media Accessibility', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['images', 'alt-text'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Semantic HTML and Landmarks', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['semantics', 'landmarks'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Screen Reader Compatibility', async ({ page }) => {
    // Test for proper ARIA labels and roles
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(['aria']).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Dynamic Content Accessibility', async ({ page }) => {
    // Wait for any dynamic content to load
    await page.waitForTimeout(2000);

    // Test accessibility of dynamically loaded content
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Trading Interface Specific Tests', async ({ page }) => {
    // Test trading-specific elements if they exist
    const tradingElements = [
      '[data-testid*="trade"]',
      '[data-testid*="order"]',
      '[data-testid*="price"]',
      '[data-testid*="chart"]',
      '.trading-interface',
      '.order-book',
      '.price-chart',
    ];

    let elementsFound = false;
    for (const selector of tradingElements) {
      try {
        const element = page.locator(selector);
        if ((await element.count()) > 0) {
          elementsFound = true;
          break;
        }
      } catch {
        // Element not found, continue
      }
    }

    if (elementsFound) {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    } else {
      console.log('No trading interface elements found for accessibility testing');
    }
  });

  test('Mobile Accessibility (Responsive)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for responsive adjustments
    await page.waitForTimeout(1000);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('High Contrast Mode Simulation', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark' });

    // Test accessibility in high contrast mode
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Custom WCAG Rules - Crypto Specific', async ({ page }) => {
    // Custom rules for financial/trading applications
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['button-name', 'link-name', 'input-label'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Generate Detailed Accessibility Report', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Log detailed report for manual review
    console.log('\n=== WCAG Accessibility Report ===');
    console.log(`URL: ${page.url()}`);
    console.log(`Violations: ${accessibilityScanResults.violations.length}`);
    console.log(`Passes: ${accessibilityScanResults.passes.length}`);
    console.log(`Incomplete: ${accessibilityScanResults.incomplete.length}`);

    if (accessibilityScanResults.violations.length > 0) {
      console.log('\n--- Violations ---');
      accessibilityScanResults.violations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation.id} (${violation.impact})`);
        console.log(`   Description: ${violation.description}`);
        console.log(`   Help: ${violation.helpUrl}`);
        console.log(`   Elements affected: ${violation.nodes.length}`);
      });
    }

    if (accessibilityScanResults.incomplete.length > 0) {
      console.log('\n--- Needs Manual Review ---');
      accessibilityScanResults.incomplete.forEach((incomplete, index) => {
        console.log(`${index + 1}. ${incomplete.id}`);
        console.log(`   Description: ${incomplete.description}`);
      });
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

// Additional test suite for specific WCAG success criteria
test.describe('Specific WCAG Success Criteria Tests', () => {
  test('1.1.1 Non-text Content', async ({ page }) => {
    await page.goto(process.env.BASE_URL || 'https://crypto.com/exchange/trade/BTC_USD');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['image-alt', 'input-image-alt', 'area-alt'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('1.3.1 Info and Relationships', async ({ page }) => {
    await page.goto(process.env.BASE_URL || 'https://crypto.com/exchange/trade/BTC_USD');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['heading-order', 'list', 'listitem', 'definition-list'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('1.4.3 Contrast (Minimum)', async ({ page }) => {
    await page.goto(process.env.BASE_URL || 'https://crypto.com/exchange/trade/BTC_USD');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('2.1.1 Keyboard Navigation', async ({ page }) => {
    await page.goto(process.env.BASE_URL || 'https://crypto.com/exchange/trade/BTC_USD');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['keyboard', 'focus-order-semantics'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('2.4.1 Bypass Blocks', async ({ page }) => {
    await page.goto(process.env.BASE_URL || 'https://crypto.com/exchange/trade/BTC_USD');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['bypass', 'skip-link'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('3.1.1 Language of Page', async ({ page }) => {
    await page.goto(process.env.BASE_URL || 'https://crypto.com/exchange/trade/BTC_USD');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['html-has-lang', 'html-lang-valid'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('4.1.1 Parsing', async ({ page }) => {
    await page.goto(process.env.BASE_URL || 'https://crypto.com/exchange/trade/BTC_USD');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['duplicate-id', 'duplicate-id-active', 'duplicate-id-aria'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
