/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ApiClientFactory, Utils, test, NodesApi, TrashcanApi, FileActionsApi } from '@alfresco/playwright-shared';

test.describe('Search - Filters', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;

  const random = Utils.random();
  const username = `user1+${random}`;
  const logicFile1 = `${username}-logic-${random}-file-clouds`;
  const logicFile1Split = logicFile1.split('-');
  const logicFile2 = `${username}-logic-${random}-file-sky`;

  test.beforeEach(async ({ loginPage, searchPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await searchPage.navigate();
  });

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      fileActionsApi = await FileActionsApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.describe('Filter by Logic', () => {
    test('[C699500] Filter with Match All', async ({ searchPage }) => {
      await nodesApi.createFile(logicFile1);

      await searchPage.searchFilters.logicFilter.click();
      await searchPage.searchFiltersLogic.matchAllInput.fill(
        `${logicFile1Split[0]} ${logicFile1Split[1]} ${logicFile1Split[2]} ${logicFile1Split[3]} ${logicFile1Split[4]}`
      );
      await searchPage.searchFiltersLogic.applyButton.click();
      await searchPage.dataTable.progressBarWaitForReload();

      await expect(searchPage.dataTable.getRowByName(logicFile1)).toBeVisible();
    });

    test('[C699500] Filter with Match Any', async ({ searchPage }) => {
      await nodesApi.createFile(logicFile1);
      await nodesApi.createFile(logicFile2);
      await fileActionsApi.waitForNodes(logicFile1, { expect: 1 });
      await fileActionsApi.waitForNodes(logicFile2, { expect: 1 });

      await searchPage.searchFilters.logicFilter.click();
      await searchPage.searchFiltersLogic.matchAnyInput.fill(
        `${logicFile1Split[1]}-${logicFile1Split[2]}-${logicFile1Split[3]} ${logicFile1Split[4]}`
      );
      await searchPage.searchFiltersLogic.applyButton.click();
      await searchPage.dataTable.progressBarWaitForReload();

      // expect(await searchPage.dataTable.getRowsCount()).toBe(3);
      await expect(searchPage.dataTable.getRowByName(logicFile1)).toBeVisible();
      await expect(searchPage.dataTable.getRowByName(logicFile2)).toBeVisible();
    });

    test('[C699500] Filter with Exclude', async ({ searchPage }) => {
      await nodesApi.createFile(logicFile1);
      await nodesApi.createFile(logicFile2);
      await fileActionsApi.waitForNodes(logicFile1, { expect: 1 });
      await fileActionsApi.waitForNodes(logicFile2, { expect: 1 });

      await searchPage.searchFilters.logicFilter.click();
      await searchPage.searchFiltersLogic.matchAnyInput.fill(`${logicFile1Split[1]}-${logicFile1Split[2]}-${logicFile1Split[3]}`);
      await searchPage.searchFiltersLogic.excludeInput.fill(`${logicFile1Split[4]}`);
      await searchPage.searchFiltersLogic.applyButton.click();
      await searchPage.dataTable.progressBarWaitForReload();

      // expect(await searchPage.dataTable.getRowsCount()).toBe(2);
      await expect(searchPage.dataTable.getRowByName(logicFile1)).not.toBeVisible();
      await expect(searchPage.dataTable.getRowByName(logicFile2)).toBeVisible();
    });
  });
});
