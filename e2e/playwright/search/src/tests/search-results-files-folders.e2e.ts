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
import { ApiClientFactory, Utils, test, TrashcanApi, NodesApi, SearchApi } from '@alfresco/aca-playwright-shared';

test.describe('Search results - files and folders', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let searchApi: SearchApi;

  const random = Utils.random();
  const usernameFilesFolders = `user-${random}`;

  test.beforeAll(async () => {
    try {
      const apiClientFactoryFilesFolders = new ApiClientFactory();
      await apiClientFactoryFilesFolders.setUpAcaBackend('admin');
      await apiClientFactoryFilesFolders.createUser({ username: usernameFilesFolders });
      nodesApi = await NodesApi.initialize(usernameFilesFolders, usernameFilesFolders);
      trashcanApi = await TrashcanApi.initialize(usernameFilesFolders, usernameFilesFolders);
      searchApi = await SearchApi.initialize(usernameFilesFolders, usernameFilesFolders);
    } catch (error) {
      console.error(`search results - files and folders - beforeAll failed: ${Utils.extractErrorMessage(error)}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, usernameFilesFolders, usernameFilesFolders, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[XAT-5610] Search files / folders with special characters', async ({ searchPage }) => {
    const fileRussian = `любимый-сайт-${random}`;

    await nodesApi.createFile(fileRussian);
    await searchPage.searchWithin(fileRussian, 'filesAndFolders');
    await expect(searchPage.dataTable.getRowByName(fileRussian)).toBeVisible();
  });

  test('[XAT-5611] Clicking on the location link redirects to parent folder', async ({ searchPage, personalFiles }) => {
    const file = `test-file-${random}.txt`;
    const fileTitle = 'file title';
    const fileDescription = 'file description';

    await nodesApi.createFile(file, '-my-', fileTitle, fileDescription);
    await searchApi.waitForNodes(file, { expect: 1 });
    await searchPage.searchWithin(file, 'files');
    await searchPage.dataTable.clickItemLocation(file);
    expect((await personalFiles.breadcrumb.items.textContent()).trim()).toEqual('Personal Files');
  });
});
