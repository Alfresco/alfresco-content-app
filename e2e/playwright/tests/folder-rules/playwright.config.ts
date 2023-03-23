import { PlaywrightTestConfig, devices } from '@playwright/test';

require('dotenv').config();

export const config: PlaywrightTestConfig = {
  testDir: './',
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 10000
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 5,
  timeout: 20000,

  globalSetup: require.resolve('../../shared/base-config/global.setup'),
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    storageState: './storage-state/AdminUserState.json',
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_E2E_HOST,
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    launchOptions: {
      devtools: false,
      args: ['--disable-web-security', '--no-sandbox', '--disable-site-isolation-trials']
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ]
};

export default config;
