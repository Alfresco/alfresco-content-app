/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export interface TestExclusion {
  id: string;
  reason: string;
  scope: string;
}

export type ExclusionJson = Record<string, Record<string, string> | undefined>;

const ALL_BROWSERS_SCOPE = 'all';
const BROWSER_SCOPES = ['firefox', 'chromium', 'webkit', 'msedge'];

const getCurrentBrowser = (): string => (process.env.PLAYWRIGHT_BROWSER || 'chrome').toLowerCase();

export const getTestExclusions = (excludedJson: ExclusionJson): TestExclusion[] => {
  const currentBrowser = getCurrentBrowser();
  const scopes = [ALL_BROWSERS_SCOPE, ...BROWSER_SCOPES.filter((scope) => scope === currentBrowser)];
  return scopes.flatMap((scope) => Object.entries(excludedJson[scope] ?? {}).map(([id, reason]) => ({ id, reason, scope })));
};

export const getExcludedTestsRegExpArray = (excludedJson: ExclusionJson, projectName: string): RegExp[] => {
  const prefix = `[ 🎭 Playwright Excludes - ${projectName} ]`;
  if (process.env.E2E_EXCLUDED_TESTS_FILE) {
    console.info(`${prefix} Listing all tests to find the excluded ones, so nothing is excluded`);
    return [];
  }
  const currentBrowser = getCurrentBrowser();
  const exclusions = getTestExclusions(excludedJson);
  const testIdsToExclude = exclusions.map((exclusion) => exclusion.id);
  const relevantKeys = [...new Set(exclusions.map((exclusion) => exclusion.scope))];

  if (testIdsToExclude.length > 0) {
    console.warn(
      `${prefix} ❌ Tests excluded for browser '${currentBrowser}' because of 🐛 : ${testIdsToExclude.join(', ')} (from keys: ${relevantKeys.join(
        ', '
      )})`
    );
  } else {
    console.info(`${prefix} ✅ No excluded tests for browser '${currentBrowser}' 🎉`);
  }

  return testIdsToExclude.map((key) => new RegExp(key));
};
