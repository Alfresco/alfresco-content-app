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

import { expect } from '@playwright/test';
import { ApiClientFactory, Utils, test, NodesApi, TrashcanApi, FileActionsApi } from '@alfresco/playwright-shared';

test.describe('Search - Filters - Logic', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;

  const randomUsername = Utils.random();
  const randomFilename = Utils.random();
  const randomFileTitle = Utils.random();
  const randomFileDescription = Utils.random();
  const username = `user1${randomUsername}`;
  const logicFile1 = {
    name: `${username}-${randomFilename}logic-${randomFilename}cats-${randomFilename}clouds`,
    title: `${randomFileTitle}logic-${randomFileTitle}clouds`,
    description: `${randomFileDescription}logic-${randomFileDescription}clouds`
  };
  const logicFile1NameSplit = logicFile1.name.split('-');
  const logicFile1TitleSplit = logicFile1.title.split('-');
  const logicFile1DescriptionSplit = logicFile1.description.split('-');
  const logicFile2 = {
    name: `${username}-${randomFilename}logic-${randomFilename}cats-${randomFilename}sky`,
    title: `${randomFileTitle}logic-${randomFileTitle}sky`,
    description: `${randomFileDescription}logic-${randomFileDescription}sky`
  };

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
      await nodesApi.createFile(logicFile1.name, undefined, logicFile1.title, logicFile1.description);
      await nodesApi.createFile(logicFile2.name, undefined, logicFile2.title, logicFile2.description);
      await fileActionsApi.waitForNodes(logicFile1.name, { expect: 1 });
      await fileActionsApi.waitForNodes(logicFile2.name, { expect: 1 });
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[C699500] Filter with Match All', async ({ searchPage }) => {
    await searchPage.searchFilters.logicFilter.click();
    await searchPage.searchFiltersLogic.matchAllInput.fill(
      `${logicFile1NameSplit[0]} ${logicFile1NameSplit[1]} ${logicFile1TitleSplit[1]} ${logicFile1DescriptionSplit[1]}`
    );
    await searchPage.searchFilters.menuCardApply.click();
    await searchPage.dataTable.progressBarWaitForReload();

    await expect(searchPage.dataTable.getRowByName(logicFile1.name)).toBeVisible();
    await expect(searchPage.dataTable.getRowByName(logicFile2.name)).toBeHidden();
  });

  test('[C699501] Filter with Match Any', async ({ searchPage }) => {
    await searchPage.searchFilters.logicFilter.click();
    await searchPage.searchFiltersLogic.matchAnyInput.fill(
      `${logicFile1NameSplit[2]}-${logicFile1NameSplit[3]} ${logicFile1TitleSplit[0]} ${logicFile1DescriptionSplit[0]}`
    );
    await searchPage.searchFilters.menuCardApply.click();
    await searchPage.dataTable.progressBarWaitForReload();

    expect(await searchPage.dataTable.getRowsCount()).toBe(2);
    await expect(searchPage.dataTable.getRowByName(logicFile1.name)).toBeVisible();
    await expect(searchPage.dataTable.getRowByName(logicFile2.name)).toBeVisible();
  });

  test('[C699502] Filter with Exclude', async ({ searchPage }) => {
    await searchPage.searchFilters.logicFilter.click();
    await searchPage.searchFiltersLogic.matchAnyInput.fill(
      `${logicFile1NameSplit[0]}-${logicFile1NameSplit[1]} ${logicFile1TitleSplit[0]} ${logicFile1DescriptionSplit[0]}`
    );
    await searchPage.searchFiltersLogic.excludeInput.fill(`${logicFile1DescriptionSplit[1]}`);
    await searchPage.searchFilters.menuCardApply.click();
    await searchPage.dataTable.progressBarWaitForReload();

    expect(await searchPage.dataTable.getRowsCount()).toBe(1);
    await expect(searchPage.dataTable.getRowByName(logicFile1.name)).toBeHidden();
    await expect(searchPage.dataTable.getRowByName(logicFile2.name)).toBeVisible();
  });

  test('[C699503] Filter with Exact phrase', async ({ searchPage }) => {
    await searchPage.searchFilters.logicFilter.click();
    await searchPage.searchFiltersLogic.matchExactInput.fill(logicFile1.name);
    await searchPage.searchFilters.menuCardApply.click();
    await searchPage.dataTable.progressBarWaitForReload();

    expect(await searchPage.dataTable.getRowsCount()).toBe(1);
    await expect(searchPage.dataTable.getRowByName(logicFile2.name)).toBeHidden();
    await expect(searchPage.dataTable.getRowByName(logicFile1.name)).toBeVisible();

    await searchPage.searchFilters.logicFilter.click();
    await searchPage.searchFiltersLogic.matchExactInput.fill(logicFile1.title);
    await searchPage.searchFilters.menuCardApply.click();
    await searchPage.dataTable.progressBarWaitForReload();

    expect(await searchPage.dataTable.getRowsCount()).toBe(1);
    await expect(searchPage.dataTable.getRowByName(logicFile2.name)).toBeHidden();
    await expect(searchPage.dataTable.getRowByName(logicFile1.name)).toBeVisible();

    await searchPage.searchFilters.logicFilter.click();
    await searchPage.searchFiltersLogic.matchExactInput.fill(logicFile1.description);
    await searchPage.searchFilters.menuCardApply.click();
    await searchPage.dataTable.progressBarWaitForReload();

    expect(await searchPage.dataTable.getRowsCount()).toBe(1);
    await expect(searchPage.dataTable.getRowByName(logicFile2.name)).toBeHidden();
    await expect(searchPage.dataTable.getRowByName(logicFile1.name)).toBeVisible();
  });

  test('[C699504] Filter with all options', async ({ searchPage }) => {
    const logicFile2NameSplit = logicFile2.name.split('-');

    await searchPage.searchFilters.logicFilter.click();
    await searchPage.searchFiltersLogic.matchAllInput.fill(`${logicFile1NameSplit[1]} ${logicFile1TitleSplit[0]}, ${logicFile1DescriptionSplit[0]}`);
    await searchPage.searchFiltersLogic.matchAnyInput.fill(`${logicFile1NameSplit[0]} ${logicFile1TitleSplit[2]}`);
    await searchPage.searchFiltersLogic.excludeInput.fill(`${logicFile1NameSplit[3]}`);
    await searchPage.searchFiltersLogic.matchExactInput.fill(`${logicFile2NameSplit[1]}-${logicFile2NameSplit[2]}-${logicFile2NameSplit[3]}`);
    await searchPage.searchFilters.menuCardApply.click();
    await searchPage.dataTable.progressBarWaitForReload();

    expect(await searchPage.dataTable.getRowsCount()).toBe(1);
    await expect(searchPage.dataTable.getRowByName(logicFile1.name)).toBeHidden();
    await expect(searchPage.dataTable.getRowByName(logicFile2.name)).toBeVisible();
  });
});
