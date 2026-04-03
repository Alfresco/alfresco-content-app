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

import { expect } from '@playwright/test';
import { APP_ROUTES, ApiClientFactory, NodesApi, SIDEBAR_LABELS, Utils, test, TrashcanApi, SearchApi } from '@alfresco/aca-playwright-shared';

test.describe('Personal Files', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let searchApi: SearchApi;
  const username = `user-${Utils.random()}`;
  const userFolder = `user-folder-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      searchApi = await SearchApi.initialize(username, username);
      await nodesApi.createFolder(userFolder);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.describe(`Regular user's personal files`, () => {
    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test('[XAT-4414] Personal Files list displays correct columns', async ({ personalFiles }) => {
      const expectedColumns = ['Name', 'Size', 'Modified', 'Modified by', 'Tags'];
      const actualColumns = Utils.trimArrayElements(await personalFiles.dataTable.getColumnHeaders());
      expect(actualColumns).toEqual(expectedColumns);
    });

    test('[XAT-4415] Personal Files - Default sort order', async ({ personalFiles }) => {
      await Utils.reloadPageIfDatatableEmpty(personalFiles);
      expect(await personalFiles.dataTable.getSortedColumnHeaderText()).toBe('Name');
    });

    test('[XAT-4411] User is redirected to Home page on selecting <Personal Files> from any folder location', async ({ personalFiles }) => {
      await personalFiles.dataTable.performClickFolderOrFileToOpen(userFolder);
      await personalFiles.sidenav.openPanel(SIDEBAR_LABELS.PERSONAL_FILES);
      await personalFiles.dataTable.spinner.spinnerWaitForReload();
      expect(personalFiles.page.url()).toContain(APP_ROUTES.PERSONAL_FILES);
      expect(await personalFiles.sidenav.isActive(SIDEBAR_LABELS.PERSONAL_FILES), 'My Libraries link not active').toBe(true);
    });

    test('[XAT-4412] Personal Files - List reloads on browser Refresh', async ({ personalFiles }) => {
      await personalFiles.reload();
      expect(personalFiles.page.url()).toContain(APP_ROUTES.PERSONAL_FILES);
    });

    test('[XAT-4518] Invalid URL', async ({ personalFiles }) => {
      await personalFiles.navigate({ remoteUrl: `#/personal-files/nonexistentpage-${Utils.random()}` });
      await expect(personalFiles.dataTable.noPermissionsView).toBeVisible();
    });
  });

  test.describe(`Folder name abbreviation`, () => {
    const abbreviateFolderMain = `XAT-4385-folder-${Utils.random()}`;
    const abbreviateFolder2 = `XAT-4385-folder-${Utils.random()}-2`;
    const abbreviateFolder3 = `XAT-4385-folder-${Utils.random()}-3`;
    const abbreviateFolder4 = `XAT-4385-folder-${Utils.random()}-4`;
    const abbreviateFolder5 = `XAT-4385-folder-${Utils.random()}-5`;

    let abbreviateFolder5Id: string;

    test.beforeAll(async () => {
      const abbreviateFolderMainId = (await nodesApi.createFolder(abbreviateFolderMain)).entry.id;
      const abbreviateFolder2Id = (await nodesApi.createFolder(abbreviateFolder2, abbreviateFolderMainId)).entry.id;
      const abbreviateFolder3Id = (await nodesApi.createFolder(abbreviateFolder3, abbreviateFolder2Id)).entry.id;
      const abbreviateFolder4Id = (await nodesApi.createFolder(abbreviateFolder4, abbreviateFolder3Id)).entry.id;
      abbreviateFolder5Id = (await nodesApi.createFolder(abbreviateFolder5, abbreviateFolder4Id)).entry.id;
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test('[XAT-4385] Folder names abbreviate when path is too long to fit the screen', async ({ personalFiles }) => {
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${abbreviateFolder5Id}` });
      await personalFiles.breadcrumb.currentItem.waitFor();
      const hasOverflow = await personalFiles.breadcrumb.currentItem.evaluate(
        (folderNameElement) => folderNameElement.scrollWidth > folderNameElement.clientWidth
      );
      expect(hasOverflow).toBe(true);
    });
  });

  test.describe(`Navigate to parent folder after pagination`, () => {
    const abbreviateFolderMain = `XAT-4527-folder-${Utils.random()}`;
    const abbreviateFolder2 = `XAT-4527-folder-${Utils.random()}-2`;

    let abbreviateFolder2Id: string;

    test.beforeAll(async () => {
      const abbreviateFolderMainId = (await nodesApi.createFolder(abbreviateFolderMain)).entry.id;
      abbreviateFolder2Id = (await nodesApi.createFolder(abbreviateFolder2, abbreviateFolderMainId)).entry.id;
      await nodesApi.createMultipleFiles(30, abbreviateFolder2Id);
      await searchApi.waitForFolderPathIndexing(abbreviateFolder2Id, { nodesExpected: 30 });
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    });

    test('[XAT-4527] Should be able to navigate to the parent folder when pagination is set to 25', async ({ personalFiles }) => {
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${abbreviateFolder2Id}` });
      await personalFiles.breadcrumb.currentItem.waitFor();
      await personalFiles.pagination.clickOnNextPage();
      expect(await personalFiles.pagination.getCurrentPage()).toBe('Page 2');
      await personalFiles.breadcrumb.clickItem(abbreviateFolderMain);
      await personalFiles.spinner.spinnerWaitForReload();
      expect(await personalFiles.pagination.getRange()).toContain('Showing 1-1');
    });
  });
});
