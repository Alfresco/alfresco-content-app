/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { test, timeouts } from '@alfresco/playwright-shared';
import { expect } from '@playwright/test';

export function personalFilesTests(userName: string, parentName: string) {
  test.describe('Pagination controls : ', () => {
    test.beforeEach(async ({ loginPage, personalFiles, page }) => {
      await loginPage.navigate();
      await loginPage.loginUser({ username: userName, password: userName });
      await personalFiles.waitForPageLoad();
      await personalFiles.dataTable.getRowByName(parentName).dblclick();
      await page.waitForTimeout(timeouts.tiny);
    });

    test('[C280077] Pagination control default values', async ({ personalFiles }) => {
      expect(await personalFiles.pagination.getRange()).toContain('Showing 1-25 of 51');
      expect(await personalFiles.pagination.getMaxItems()).toContain('25');
      expect(await personalFiles.pagination.getCurrentPage()).toContain('Page 1');
      expect(await personalFiles.pagination.getTotalPages()).toContain('of 3');
      expect(await personalFiles.pagination.isPreviousEnabled()).toBe(false);
      expect(await personalFiles.pagination.isNextEnabled()).toBe(true);
    });

    test('[C280079] current page menu items', async ({ personalFiles }) => {
      await personalFiles.pagination.openMaxItemsMenu();
      expect(await personalFiles.pagination.getItemsCount()).toBe(3);
      await personalFiles.pagination.clickMenuItem('25');
      await personalFiles.dataTable.spinnerWaitForReload();
      expect(await personalFiles.pagination.getMaxItems()).toContain('25');
      expect(await personalFiles.pagination.getTotalPages()).toContain('of 3');

      await personalFiles.pagination.openMaxItemsMenu();
      await personalFiles.pagination.clickMenuItem('50');
      expect(await personalFiles.pagination.getMaxItems()).toContain('50');
      expect(await personalFiles.pagination.getTotalPages()).toContain('of 2');

      await personalFiles.pagination.openMaxItemsMenu();
      await personalFiles.pagination.clickMenuItem('100');
      expect(await personalFiles.pagination.getMaxItems()).toContain('100');
      expect(await personalFiles.pagination.getTotalPages()).toContain('of 1');

      await personalFiles.pagination.resetToDefaultPageSize();
    });

    test('[C280080] change the current page from menu', async ({ personalFiles }) => {
      await personalFiles.pagination.clickOnNextPage();
      expect(await personalFiles.pagination.getRange()).toContain('Showing 26-50 of 51');
      expect(await personalFiles.pagination.getCurrentPage()).toContain('Page 2');
      expect(await personalFiles.pagination.isPreviousEnabled()).toBe(true);
      expect(await personalFiles.pagination.isNextEnabled()).toBe(true);
      await personalFiles.pagination.resetToDefaultPageSize();
    });

    test('[C280083] navigate to next and previous pages', async ({ personalFiles }) => {
      await personalFiles.pagination.openMaxItemsMenu();
      await personalFiles.pagination.clickMenuItem('25');
      expect(await personalFiles.pagination.getMaxItems()).toContain('25');
      await personalFiles.pagination.clickOnNextPage();
      await personalFiles.dataTable.spinnerWaitForReload();
      expect(await personalFiles.pagination.getRange()).toContain('Showing 26-50 of 51');
      await personalFiles.pagination.clickOnPreviousPage();
      await personalFiles.dataTable.spinnerWaitForReload();
      expect(await personalFiles.pagination.getRange()).toContain('Showing 1-25 of 51');
    });

    test('[C280081] Previous button is disabled on first page', async ({ personalFiles }) => {
      expect(await personalFiles.pagination.getCurrentPage()).toContain('Page 1');
      expect(await personalFiles.pagination.isPreviousEnabled()).toBe(false);
    });

    test('[C280082] Next button is disabled on last page', async ({ personalFiles }) => {
      await personalFiles.pagination.openMaxItemsMenu();
      await personalFiles.pagination.clickNthItem(3);
      expect(await personalFiles.pagination.getCurrentPage()).toContain('Page 1');
      expect(await personalFiles.pagination.isNextEnabled()).toBe(false);
    });
  });
}
