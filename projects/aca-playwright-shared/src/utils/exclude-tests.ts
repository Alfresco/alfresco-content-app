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

const getCurrentBrowser = (): string => (process.env.PLAYWRIGHT_BROWSER || 'chrome').toLowerCase();

export const getExcludedTestsRegExpArray = (excludedJson: any, projectName: string) => {
  const prefix = `[ 🎭 Playwright Excludes - ${projectName} ]`;
  const currentBrowser = getCurrentBrowser();
  const browserKeys = ['all', 'firefox', 'chromium', 'webkit', 'msedge'];
  const relevantKeys: string[] = [];
  const testIdsToExclude: string[] = [];

  // Always include 'all' if it exists
  if (excludedJson.all && typeof excludedJson.all === 'object') {
    const allTestIds = Object.keys(excludedJson.all);
    testIdsToExclude.push(...allTestIds);
    relevantKeys.push('all');
  }

  // Include current browser-specific exclusions
  const browserKey = browserKeys.find((key) => key.toLowerCase() === currentBrowser);
  if (browserKey && excludedJson[browserKey] && typeof excludedJson[browserKey] === 'object') {
    const browserTestIds = Object.keys(excludedJson[browserKey]);
    testIdsToExclude.push(...browserTestIds);
    if (!relevantKeys.includes(browserKey)) {
      relevantKeys.push(browserKey);
    }
  }

  if (testIdsToExclude.length > 0) {
    console.warn(
      `${prefix} ❌ Tests excluded for browser '${currentBrowser}' because of 🐛 : ${testIdsToExclude.join(', ')} (from keys: ${relevantKeys.join(', ')})`
    );
  } else {
    console.info(`${prefix} ✅ No excluded tests for browser '${currentBrowser}' 🎉`);
  }

  return testIdsToExclude.map((key) => new RegExp(key));
};
