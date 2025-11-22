import { chromium, FullConfig } from '@playwright/test';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function globalSetup(config: FullConfig) {
  console.log('🔍 Setting up WCAG Accessibility Testing Environment...');

  // Test if the target URL is accessible
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    const baseURL = process.env.BASE_URL || 'https://crypto.com/exchange/trade/BTC_USD';
    console.log(`🌐 Testing connectivity to: ${baseURL}`);

    await page.goto(baseURL, { timeout: 30000 });
    console.log('✅ Target application is accessible');

    // Wait for initial load and check for modals
    await page.waitForLoadState('load');

    // Check for modals that might interfere with accessibility testing
    const modalSelectors = [
      '[role="dialog"]',
      '.modal',
      '[class*="cookie"]',
      'button:has-text("Skip")',
      'button:has-text("Accept")',
    ];

    let modalsFound = 0;
    for (const selector of modalSelectors) {
      const count = await page.locator(selector).count();
      modalsFound += count;
    }

    console.log(`🔍 Modal/popup detection: ${modalsFound} potential modals found`);
    if (modalsFound > 0) {
      console.log('ℹ️  Tests will handle modal dismissal before accessibility scanning');
    }

    // Check if page has basic accessibility features
    const hasLang = (await page.locator('html[lang]').count()) > 0;
    const hasTitle = (await page.locator('title').count()) > 0;
    const hasHeadings = (await page.locator('h1, h2, h3, h4, h5, h6').count()) > 0;

    console.log(`📋 Pre-flight accessibility checks:`);
    console.log(`   - HTML lang attribute: ${hasLang ? '✅' : '❌'}`);
    console.log(`   - Page title: ${hasTitle ? '✅' : '❌'}`);
    console.log(`   - Heading structure: ${hasHeadings ? '✅' : '❌'}`);
    console.log(`   - Modals detected: ${modalsFound} ${modalsFound > 0 ? '⚠️' : '✅'}`);

    if (!hasLang || !hasTitle) {
      console.log('⚠️  Basic accessibility features missing - tests may find violations');
    }
  } catch (error) {
    console.error(`❌ Failed to connect to target URL: ${error}`);
    console.log('ℹ️  Accessibility tests will still run but may fail due to connectivity issues');
  } finally {
    await browser.close();
  }

  console.log('🚀 WCAG Accessibility Testing Setup Complete\n');
}

export default globalSetup;
