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
import { ApiClientFactory, Utils, test, TrashcanApi, NodesApi } from '@alfresco/playwright-shared';

test.describe('Search results - files and folders', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;

  const random = Utils.random();
  const username = `user-${random}`;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    try {
      await loginPage.loginUser({ username, password: username }, { withNavigation: true, waitForLoading: true });
    } catch (error) {
      console.error(`Main beforeEach failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    try {
      await nodesApi.deleteCurrentUserNodes();
      await trashcanApi.emptyTrashcan();
    } catch (error) {
      console.error(`Main afterAll failed: ${error}`);
    }
  });

  test('[C290029] Search file with special characters', async ({ searchPage }) => {
    const fileRussian = `любимый-сайт-${random}`;

    await nodesApi.createFile(fileRussian);

    await searchPage.acaHeader.searchButton.click();
    await searchPage.searchInput.searchButton.click();
    await searchPage.searchInput.checkFilesAndFolders();
    await searchPage.searchInput.searchFor(fileRussian);
    await searchPage.dataTable.progressBarWaitForReload();
    await expect(searchPage.dataTable.getRowByName(fileRussian)).toBeVisible();
  });

  test('[C279177] Location column redirect - file in user Home', async ({ searchPage, personalFiles }) => {
    const file = `test-file-${random}.txt`;
    const fileTitle = 'file title';
    const fileDescription = 'file description';

    await nodesApi.createFile(file, '-my-', fileTitle, fileDescription);
    await searchPage.acaHeader.searchButton.click();
    await searchPage.searchInput.searchButton.click();
    await searchPage.searchInput.checkFilesAndFolders();
    await searchPage.searchInput.searchFor(file);
    await searchPage.dataTable.progressBarWaitForReload();
    await searchPage.dataTable.clickItemLocation(file);
    expect((await personalFiles.breadcrumb.items.textContent()).trim()).toEqual('Personal Files');
  });
});
