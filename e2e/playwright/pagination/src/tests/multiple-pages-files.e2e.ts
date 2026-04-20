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

import { ApiClientFactory, FavoritesPageApi, NodesApi, SearchApi, test, timeouts, Utils, TrashcanApi } from '@alfresco/aca-playwright-shared';
import { expect } from '@playwright/test';

test.describe('Pagination on multiple pages : ', () => {
  const random = Utils.random();
  const username = `user-${random}`;
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let favoritesApi: FavoritesPageApi;
  let searchApi: SearchApi;

  const parent = `parent-multi-${random}`;
  let parentId: string;
  let filesIds: string[];

  const apiClientFactory = new ApiClientFactory();

  test.beforeAll(async () => {
    test.setTimeout(timeouts.extendedTest);
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    nodesApi = await NodesApi.initialize(username, username);
    trashcanApi = await TrashcanApi.initialize(username, username);
    favoritesApi = await FavoritesPageApi.initialize(username, username);
    searchApi = await SearchApi.initialize(username, username);

    const files = Array(51)
      .fill('my-file')
      .map((name, index): string => `${name}-${index + 1}-${random}.txt`);

    parentId = (await nodesApi.createFolder(parent)).entry.id;
    filesIds = (await nodesApi.createFiles(files, parent)).list?.entries?.map((entries) => entries.entry.id) ?? [];

    expect(filesIds.length).toBe(51);
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.describe('on Personal Files', () => {
    test.beforeAll(async () => {
      await searchApi.waitForFolderPathIndexing(parentId, { nodesExpected: 51 });
    });

    test.describe('Pagination controls : ', () => {
      test.beforeEach(async ({ loginPage, personalFiles, page }) => {
        await loginPage.navigate();
        await loginPage.loginUser({ username: username, password: username });
        await personalFiles.waitForPageLoad();
        await personalFiles.dataTable.getRowByName(parent).dblclick();
        await page.waitForTimeout(timeouts.tiny);
      });

      test('[XAT-4530] Pagination control default items', async ({ personalFiles }) => {
        expect(await personalFiles.pagination.getRange()).toContain('Showing 1-25 of 51');
        expect(await personalFiles.pagination.getMaxItems()).toContain('25');
        expect(await personalFiles.pagination.getCurrentPage()).toContain('Page 1');
        expect(await personalFiles.pagination.getTotalPages()).toContain('of 3');
        expect(await personalFiles.pagination.isPreviousEnabled()).toBe(false);
        expect(await personalFiles.pagination.isNextEnabled()).toBe(true);
      });

      test('[XAT-4531] Items per page values', async ({ personalFiles }) => {
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

      test('[XAT-4533] Change the current page from the page selector', async ({ personalFiles }) => {
        await personalFiles.pagination.clickOnNextPage();
        expect(await personalFiles.pagination.getRange()).toContain('Showing 26-50 of 51');
        expect(await personalFiles.pagination.getCurrentPage()).toContain('Page 2');
        expect(await personalFiles.pagination.isPreviousEnabled()).toBe(true);
        expect(await personalFiles.pagination.isNextEnabled()).toBe(true);
        await personalFiles.pagination.resetToDefaultPageSize();
      });

      test('[XAT-4536] Next and Previous buttons navigation', async ({ personalFiles }) => {
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

      test('[XAT-4534] Previous button is disabled on first page', async ({ personalFiles }) => {
        expect(await personalFiles.pagination.getCurrentPage()).toContain('Page 1');
        expect(await personalFiles.pagination.isPreviousEnabled()).toBe(false);
      });

      test('[XAT-4535] Next button is disabled on last page', async ({ personalFiles }) => {
        await personalFiles.pagination.openMaxItemsMenu();
        await personalFiles.pagination.clickNthItem(3);
        expect(await personalFiles.pagination.getCurrentPage()).toContain('Page 1');
        expect(await personalFiles.pagination.isNextEnabled()).toBe(false);
      });
    });
  });

  test.describe('on Favorites', () => {
    test.beforeAll(async () => {
      const initialFavoritesTotalItems = await favoritesApi.getFavoritesTotalItems(username);
      await favoritesApi.addFavoritesByIds('file', filesIds);
      await favoritesApi.waitForApi(username, { expect: initialFavoritesTotalItems + 51 });
    });

    test.describe('Pagination controls : ', () => {
      test.beforeEach(async ({ loginPage, favoritePage }) => {
        await loginPage.navigate();
        await loginPage.loginUser({ username: username, password: username });

        await favoritePage.navigate();
        await favoritePage.waitForPageLoad();
      });

      test('[XAT-4575] Pagination control default items', async ({ favoritePage }) => {
        expect(await favoritePage.pagination.getRange()).toContain('1-25 of 51');
        expect(await favoritePage.pagination.getMaxItems()).toContain('25');
        expect(await favoritePage.pagination.getCurrentPage()).toContain('Page 1');
        expect(await favoritePage.pagination.getTotalPages()).toContain('of 3');
        expect(await favoritePage.pagination.isPreviousEnabled()).toBe(false);
        expect(await favoritePage.pagination.isNextEnabled()).toBe(true);
      });

      test('[XAT-4576] Items per page values', async ({ favoritePage }) => {
        await favoritePage.pagination.openMaxItemsMenu();
        expect(await favoritePage.pagination.getItemsCount()).toBe(3);
        await favoritePage.pagination.clickMenuItem('25');
        await favoritePage.dataTable.spinnerWaitForReload();
        expect(await favoritePage.pagination.getMaxItems()).toContain('25');
        expect(await favoritePage.pagination.getTotalPages()).toContain('of 3');

        await favoritePage.pagination.openMaxItemsMenu();
        await favoritePage.pagination.clickMenuItem('50');
        await favoritePage.dataTable.spinnerWaitForReload();
        expect(await favoritePage.pagination.getMaxItems()).toContain('50');
        expect(await favoritePage.pagination.getTotalPages()).toContain('of 2');

        await favoritePage.pagination.closeMenu();

        await favoritePage.pagination.openMaxItemsMenu();
        await favoritePage.pagination.clickMenuItem('100');
        await favoritePage.dataTable.spinnerWaitForReload();
        expect(await favoritePage.pagination.getMaxItems()).toContain('100');
        expect(await favoritePage.pagination.getTotalPages()).toContain('of 1');

        await favoritePage.pagination.resetToDefaultPageSize();
      });

      test('[XAT-4578] Change the current page from the page selector', async ({ favoritePage }) => {
        await favoritePage.pagination.clickOnNextPage();
        expect(await favoritePage.pagination.getRange()).toContain('Showing 26-50 of 51');
        expect(await favoritePage.pagination.getCurrentPage()).toContain('Page 2');
        expect(await favoritePage.pagination.isPreviousEnabled()).toBe(true);
        expect(await favoritePage.pagination.isNextEnabled()).toBe(true);
        await favoritePage.pagination.resetToDefaultPageSize();
      });

      test('[XAT-4580] Next and Previous buttons navigation', async ({ favoritePage }) => {
        await favoritePage.pagination.openMaxItemsMenu();
        await favoritePage.pagination.clickMenuItem('25');
        expect(await favoritePage.pagination.getMaxItems()).toContain('25');
        await favoritePage.pagination.clickOnNextPage();
        await favoritePage.dataTable.spinnerWaitForReload();
        expect(await favoritePage.pagination.getRange()).toContain('Showing 26-50 of 51');
        await favoritePage.pagination.clickOnPreviousPage();
        await favoritePage.dataTable.spinnerWaitForReload();
        expect(await favoritePage.pagination.getRange()).toContain('Showing 1-25 of 51');
      });

      test('[XAT-4579] Next button is disabled on last page', async ({ favoritePage }) => {
        await favoritePage.pagination.openMaxItemsMenu();
        await favoritePage.pagination.clickNthItem(3);
        expect(await favoritePage.pagination.getCurrentPage()).toContain('Page 1');
        expect(await favoritePage.pagination.isNextEnabled()).toBe(false);
      });
    });
  });
});
