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
import { APP_ROUTES, ApiClientFactory, NodesApi, SIDEBAR_LABELS, Utils, test, TrashcanApi } from '@alfresco/aca-playwright-shared';

test.describe('Personal Files', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  const username = `user-${Utils.random()}`;
  const userFolder = `user-folder-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
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
      await personalFiles.dataTable.spinnerWaitForReload();
      expect(personalFiles.page.url()).toContain(APP_ROUTES.PERSONAL_FILES);
      expect(await personalFiles.sidenav.isActive(SIDEBAR_LABELS.PERSONAL_FILES), 'My Libraries link not active').toBe(true);
    });

    test('[XAT-4412] Personal Files - List reloads on browser Refresh', async ({ personalFiles }) => {
      await personalFiles.reload();
      expect(personalFiles.page.url()).toContain(APP_ROUTES.PERSONAL_FILES);
    });
  });
});
