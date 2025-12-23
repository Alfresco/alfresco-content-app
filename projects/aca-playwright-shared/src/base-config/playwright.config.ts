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

import { PlaywrightTestConfig, devices, chromium } from '@playwright/test';
import { timeouts } from '../utils';
import { getReporter } from './report-portal.config';

type LaunchOptions = Parameters<typeof chromium.launch>[0];

require('@alfresco/adf-cli/tooling').dotenvConfig();
const { env } = process;

interface BrowserConfig {
  device: any;
  launchOptions: LaunchOptions;
  name: string;
}

function getBrowsersToUse(): string[] {
  const browserEnv = (env.PLAYWRIGHT_BROWSER || 'chromium').toLowerCase();
  const allBrowsers = ['chrome', 'firefox', 'webkit', 'msedge'];

  if (browserEnv === 'all') {
    return allBrowsers;
  } else if (allBrowsers.includes(browserEnv) || browserEnv === 'chromium') {
    return [browserEnv];
  } else {
    return ['chromium'];
  }
}

function getBrowserConfig(browser: string): BrowserConfig {
  const launchOptions: LaunchOptions = {
    devtools: false,
    slowMo: 300
  };

  const chromiumArgs = ['--no-sandbox', '--disable-site-isolation-trials'];

  switch (browser) {
    case 'firefox':
      return {
        device: devices['Desktop Firefox'],
        launchOptions,
        name: 'firefox'
      };
    case 'webkit':
      return {
        device: devices['Desktop Safari'],
        launchOptions,
        name: 'webkit'
      };
    case 'msedge':
      launchOptions.args = chromiumArgs;
      return {
        device: { ...devices['Desktop Edge'], channel: 'msedge' },
        launchOptions,
        name: 'msedge'
      };
    case 'chrome':
      launchOptions.args = chromiumArgs;
      return {
        device: { ...devices['Desktop Chrome'], channel: 'chrome' },
        launchOptions,
        name: 'chrome'
      };
    case 'chromium':
    default:
      launchOptions.args = chromiumArgs;
      return {
        device: devices['Desktop Chrome'],
        launchOptions,
        name: 'chromium'
      };
  }
}

export function createSuiteProjects(
  suiteName: string,
  testDir: string,
  useConfig: Record<string, any> = {},
  projectConfig: Record<string, any> = {}
) {
  const browsersToUse = getBrowsersToUse();
  const browserEnv = (env.PLAYWRIGHT_BROWSER || 'chrome').toLowerCase();

  return browsersToUse.map((browser) => {
    const { device, launchOptions } = getBrowserConfig(browser);

    return {
      name: browserEnv === 'all' ? `${suiteName} - ${browser}` : suiteName,
      testDir,
      use: {
        ...device,
        launchOptions,
        ...useConfig
      },
      ...projectConfig
    };
  });
}

export function getBrowserProjects() {
  const browsersToUse = getBrowsersToUse();

  return browsersToUse.map((browser) => {
    const { device, launchOptions, name } = getBrowserConfig(browser);

    return {
      name,
      use: {
        ...device,
        launchOptions
      }
    };
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
  },

  /* Configure projects for major browsers */
  projects: getBrowserProjects()
};
