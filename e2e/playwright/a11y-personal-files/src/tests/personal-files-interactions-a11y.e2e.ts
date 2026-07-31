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
import { injectAxe, configureAxe } from 'axe-playwright';
import { ApiClientFactory, NodesApi, test, timeouts, Utils, TrashcanApi } from '@alfresco/aca-playwright-shared';

test.describe('Personal Files - A11y Interactions POC', () => {
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

  test('[A11Y-005] Create button is keyboard accessible', async ({ page, personalFiles }) => {
    await personalFiles.acaHeader.createButton.focus();
    await expect(personalFiles.acaHeader.createButton).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(personalFiles.matMenu.createFolder).toBeVisible({ timeout: timeouts.medium });

    await page.keyboard.press('ArrowDown');
    const focusedItem = page.locator(':focus');
    await expect(focusedItem).toBeVisible();

    const role = await focusedItem.getAttribute('role');
    const ariaLabel = await focusedItem.getAttribute('aria-label');
    expect(role === 'menuitem' || ariaLabel).toBeTruthy();

    await page.keyboard.press('Escape');
  });

  test('[A11Y-006] Create folder dialog has ARIA attributes', async ({ page, personalFiles }) => {
    await personalFiles.acaHeader.createButton.click();
    await personalFiles.matMenu.createFolder.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const dialogRole = await dialog.getAttribute('role');
    expect(dialogRole === 'dialog' || dialogRole === 'alertdialog').toBeTruthy();

    const ariaLabelledBy = await dialog.getAttribute('aria-labelledby');
    const ariaLabel = await dialog.getAttribute('aria-label');
    expect(ariaLabelledBy || ariaLabel).toBeTruthy();

    const input = personalFiles.folderDialog.folderNameInputLocator;
    const inputAriaLabel = await input.getAttribute('aria-label');
    const inputPlaceholder = await input.getAttribute('placeholder');
    expect(inputAriaLabel || inputPlaceholder).toBeTruthy();

    await page.keyboard.press('Escape');
  });

  test('[A11Y-007] Escape key closes popup', async ({ page, personalFiles }) => {
    await personalFiles.acaHeader.createButton.click();
    await expect(personalFiles.matMenu.createFolder).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(personalFiles.matMenu.createFolder).not.toBeVisible({ timeout: timeouts.normal });
  });

  test('[A11Y-008] Data table has proper structure', async ({ page }) => {
    const dataTable = page.getByRole('table');
    const dataTableCount = await dataTable.count();

    if (dataTableCount === 0) {
      const acaDataTable = page.locator('adf-datatable');
      expect(await acaDataTable.isVisible()).toBeTruthy();
    } else {
      await expect(dataTable).toBeVisible({ timeout: timeouts.large });
      const headers = page.getByRole('columnheader');
      const headerCount = await headers.count();
      expect(headerCount).toBeGreaterThan(0);
    }
  });
});
