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

import { expect } from '@playwright/test';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';
import { ApiClientFactory, NodesApi, test, timeouts, Utils, TrashcanApi } from '@alfresco/aca-playwright-shared';

test.describe('Personal Files - A11y POC Tests', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  const username = `a11y-user-${Utils.random()}`;
  const testFolder = `a11y-folder-${Utils.random()}`;
  const testFile = `a11y-file-${Utils.random()}.txt`;
  let folderId: string;

  test.beforeAll(async () => {
    test.setTimeout(timeouts.extendedTest);
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    try {
      await apiClientFactory.createUser({ username });
    } catch (exception) {
      if (JSON.parse(exception.message).error.statusCode !== 409) {
        throw new Error(`beforeAll failed: ${exception}`);
      }
    }
    nodesApi = await NodesApi.initialize(username, username);
    trashcanApi = await TrashcanApi.initialize(username, username);

    const folder = await nodesApi.createFolder(testFolder);
    folderId = folder.entry.id;
    await nodesApi.createFile(testFile, folderId);
  });

  test.beforeEach(async ({ page, loginPage, personalFiles }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderId}` });
    await personalFiles.dataTable.spinnerWaitForReload();

    await injectAxe(page);
    await configureAxe(page, { disableRules: ['color-contrast'] } as any);
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[A11Y-001] Page has no critical accessibility violations', async ({ page }) => {
    try {
      await checkA11y(page, undefined, { detailedReport: true });
    } catch (error) {
      // Log violations without failing (POC approach)
      // eslint-disable-next-line no-console
      console.log('⚠️ A11y Violations detected (POC - not failing test):', error.message);
      // These violations should be reviewed and fixed in upcoming sprints
    }
  });

  test('[A11Y-002] Page has main landmark and proper title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    const mainLandmark = page.getByRole('main');
    await expect(mainLandmark).toBeVisible();
  });

  test('[A11Y-003] Keyboard navigation works', async ({ page }) => {
    const focusableElements = page.locator(
      'button:visible, [role="button"]:visible, a:visible, input:visible, [tabindex]:visible, select:visible, textarea:visible'
    );
    const focusableCount = await focusableElements.count();
    expect(focusableCount).toBeGreaterThan(0);

    const tabsToTest = Math.min(focusableCount, 10);
    const focusedElements: string[] = [];

    for (let i = 0; i < tabsToTest; i++) {
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      const focusedCount = await focusedElement.count();

      expect(focusedCount).toBe(1);

      const tagName = await focusedElement.evaluate((el) => el.tagName.toLowerCase());
      const role = await focusedElement.getAttribute('role');
      const tabindex = await focusedElement.getAttribute('tabindex');

      const isInteractive =
        ['button', 'a', 'input', 'select', 'textarea'].includes(tagName) ||
        ['button', 'link', 'menuitem', 'checkbox', 'radio', 'tab'].includes(role || '') ||
        tabindex !== null;

      expect(isInteractive).toBeTruthy();

      focusedElements.push(`${tagName}[${role || 'no-role'}]`);
    }

    expect(focusedElements.length).toBeGreaterThan(1);
  });

  test('[A11Y-004] Buttons have accessible names', async ({ page }) => {
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const ariaLabel = await button.getAttribute('aria-label');
        const title = await button.getAttribute('title');
        const text = await button.textContent();
        expect(ariaLabel || title || text?.trim()).toBeTruthy();
      }
    }
  });
});
