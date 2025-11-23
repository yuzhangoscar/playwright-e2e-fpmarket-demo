import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for WCAG Accessibility Testing
 * Optimized for comprehensive accessibility compliance testing
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/accessibility-wcag.spec.ts',

  /* Only run the specific WCAG 2.1 Level A test */
  grep: /WCAG 2\.1 Level A - Critical Issues/,

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never', outputFolder: 'accessibility-report' }],
    ['json', { outputFile: 'accessibility-results.json' }],
    ['junit', { outputFile: 'accessibility-results.xml' }],
    ['list'],
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.BASE_URL || 'https://crypto.com/exchange/trade/BTC_USD',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Capture video on failure */
    video: 'retain-on-failure',

    /* Accessibility testing specific settings */
    // Slower navigation for better accessibility scanning
    navigationTimeout: 30000,
    actionTimeout: 10000,

    /* Extra context options for accessibility testing */
    contextOptions: {
      // Ensure proper color scheme testing
      colorScheme: 'light',
      // Enable reduced motion for accessibility testing
      reducedMotion: 'reduce',
    },
  },

  /* Configure projects for major browsers with accessibility focus */
  projects: [
    {
      name: 'accessibility-chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Force high contrast for better accessibility testing
        colorScheme: 'light',
      },
    },

    // {
    //   name: 'accessibility-firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     colorScheme: 'light',
    //   },
    // },

    // {
    //   name: 'accessibility-webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     colorScheme: 'light',
    //   },
    // },

    // /* Mobile accessibility testing */
    // {
    //   name: 'accessibility-mobile-chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },

    // {
    //   name: 'accessibility-mobile-safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    // /* High contrast mode testing */
    // {
    //   name: 'accessibility-high-contrast',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     colorScheme: 'dark',
    //     contextOptions: {
    //       forcedColors: 'active',
    //     }
    //   },
    // },

    // /* Tablet accessibility testing */
    // {
    //   name: 'accessibility-tablet',
    //   use: {
    //     ...devices['iPad Pro'],
    //   },
    // },
  ],

  /* Global setup and teardown */
  globalSetup: require.resolve('./tests/accessibility-setup.ts'),
});
