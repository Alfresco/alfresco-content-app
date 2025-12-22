/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { PlaywrightTestConfig, devices } from '@playwright/test';
import { timeouts } from '../utils';
import { getReporter } from './report-portal.config';

require('@alfresco/adf-cli/tooling').dotenvConfig();
const { env } = process;

export function getBrowserDevice() {
  switch ((env.PLAYWRIGHT_BROWSER || 'chrome').toLowerCase()) {
    case 'firefox':
      return devices['Desktop Firefox'];
    case 'webkit':
      return devices['Desktop Safari'];
    case 'msedge':
      return { ...devices['Desktop Edge'], channel: 'msedge' };
    case 'chrome':
      return { ...devices['Desktop Chrome'], channel: 'chrome' };
    case 'chromium':
      return devices['Desktop Chrome'];
    default:
      return { ...devices['Desktop Chrome'], channel: 'chrome' };
  }
}

export function createSuiteProjects(
  suiteName: string,
  testDir: string,
  useConfig: Record<string, any> = {},
  projectConfig: Record<string, any> = {}
) {
  const browserEnv = (env.PLAYWRIGHT_BROWSER || 'chrome').toLowerCase();
  const allBrowsers = ['chrome', 'firefox', 'webkit', 'msedge'];

  let browsersToUse: string[];
  if (browserEnv === 'all') {
    browsersToUse = allBrowsers;
  } else if (allBrowsers.includes(browserEnv) || browserEnv === 'chromium') {
    browsersToUse = [browserEnv];
  } else {
    browsersToUse = ['chrome'];
  }

  return browsersToUse.map((browser) => {
    let browserDevice;
    const launchOptions: any = {
      devtools: false,
      slowMo: 300
    };

    switch (browser) {
      case 'firefox':
        browserDevice = devices['Desktop Firefox'];
        break;
      case 'webkit':
        browserDevice = devices['Desktop Safari'];
        break;
      case 'msedge':
        browserDevice = { ...devices['Desktop Edge'], channel: 'msedge' };
        launchOptions.args = ['--no-sandbox', '--disable-site-isolation-trials'];
        break;
      case 'chrome':
        browserDevice = { ...devices['Desktop Chrome'], channel: 'chrome' };
        launchOptions.args = ['--no-sandbox', '--disable-site-isolation-trials'];
        break;
      case 'chromium':
        browserDevice = devices['Desktop Chrome'];
        launchOptions.args = ['--no-sandbox', '--disable-site-isolation-trials'];
        break;
      default:
        browserDevice = { ...devices['Desktop Chrome'], channel: 'chrome' };
        launchOptions.args = ['--no-sandbox', '--disable-site-isolation-trials'];
        break;
    }

    return {
      name: browserEnv === 'all' ? `${suiteName} - ${browser}` : suiteName,
      testDir,
      use: {
        ...browserDevice,
        launchOptions,
        ...useConfig
      },
      ...projectConfig
    };
  });
}

export function getBrowserProjects() {
  const browserEnv = (env.PLAYWRIGHT_BROWSER || 'chrome').toLowerCase();
  const allBrowsers = ['chrome', 'firefox', 'webkit', 'msedge'];

  let browsersToUse: string[];
  if (browserEnv === 'all') {
    browsersToUse = allBrowsers;
  } else if (allBrowsers.includes(browserEnv) || browserEnv === 'chromium') {
    browsersToUse = [browserEnv];
  } else {
    // Default to chrome if invalid value
    browsersToUse = ['chrome'];
  }

  return browsersToUse.map((browser) => {
    const launchOptions: any = {
      devtools: false,
      slowMo: 300
    };

    switch (browser) {
      case 'chrome':
        launchOptions.args = ['--no-sandbox', '--disable-site-isolation-trials'];
        return {
          name: 'chrome',
          use: {
            ...devices['Desktop Chrome'],
            channel: 'chrome',
            launchOptions
          }
        };
      case 'chromium':
      default: // Default to chromium for any unexpected browser values
        launchOptions.args = ['--no-sandbox', '--disable-site-isolation-trials'];
        return {
          name: 'chromium',
          use: {
            ...devices['Desktop Chrome'],
            launchOptions
          }
        };
      case 'firefox':
        // Firefox doesn't need Chromium-specific args
        return {
          name: 'firefox',
          use: {
            ...devices['Desktop Firefox'],
            launchOptions
          }
        };
      case 'webkit':
        // WebKit doesn't support --no-sandbox or --disable-site-isolation-trials
        return {
          name: 'webkit',
          use: {
            ...devices['Desktop Safari'],
            launchOptions
          }
        };
      case 'msedge':
        launchOptions.args = ['--no-sandbox', '--disable-site-isolation-trials'];
        return {
          name: 'msedge',
          use: {
            ...devices['Desktop Edge'],
            channel: 'msedge',
            launchOptions
          }
        };
    }
  });
}

export const getGlobalConfig: PlaywrightTestConfig = {
  timeout: timeouts.globalTest,
  globalTimeout: timeouts.globalSpec,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: timeouts.medium
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!env.CI,
  /* Retry on CI only */
  retries: env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['list'], ...getReporter()],
  globalSetup: require.resolve('./global.setup'),
  testMatch: ['**/*.e2e.ts'],
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: env.PLAYWRIGHT_E2E_HOST,
    headless: env.PLAYWRIGHT_HEADLESS === 'true' || !!env.CI,
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
    /* Note: launchOptions are now browser-specific and set in createSuiteProjects/getBrowserProjects */
  },

  /* Configure projects for major browsers */
  projects: getBrowserProjects()
};
