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
import { ApiClientFactory, LoginPage, NodesApi, SitesApi, Utils, test } from '@alfresco/playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('Trash', () => {
  let nodesApi: NodesApi;
  let siteActionsAdmin: SitesApi;

  const username = `user-${Utils.random()}`;
  const siteName = `site-${Utils.random()}`;
  const fileSite = `file1-${Utils.random()}.txt`;
  const fileUser = `file-${Utils.random()}.txt`;
  const fileDeleted = `file-${Utils.random()}.txt`;
  const folderNotDeleted = `folder-${Utils.random()}`;
  const fileInFolder = `file-${Utils.random()}.txt`;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      siteActionsAdmin = await SitesApi.initialize('admin');
      nodesApi = await NodesApi.initialize(username, username);
      const nodesApiAdmin = await NodesApi.initialize('admin');
      const folderDeleted = `folder-${Utils.random()}`;

      await siteActionsAdmin.createSite(siteName, Site.VisibilityEnum.PUBLIC);
      const docLibId = await siteActionsAdmin.getDocLibId(siteName);
      await siteActionsAdmin.addSiteMember(siteName, username, Site.RoleEnum.SiteManager);
      const fileSiteId = (await nodesApiAdmin.createFile(fileSite, docLibId)).entry.id;
      const fileUserId = (await nodesApi.createFile(fileUser)).entry.id;

      const folderDeletedId = (await nodesApi.createFolder(folderDeleted)).entry.id;
      const folderNotDeletedId = (await nodesApi.createFolder(folderNotDeleted)).entry.id;
      const fileDeletedId = (await nodesApi.createFile(fileDeleted, folderDeletedId)).entry.id;
      const fileInFolderId = (await nodesApi.createFile(fileInFolder, folderNotDeletedId)).entry.id;

      await nodesApi.deleteNodes([fileSiteId, fileUserId, fileInFolderId, fileDeletedId, folderDeletedId], false);
    } catch (error) {
      console.error(`----- beforeAll failed : ${error}`);
    }
  });

  test.afterAll(async () => {
    try {
      await nodesApi.deleteCurrentUserNodes();
      await siteActionsAdmin.deleteSites([siteName]);
    } catch (error) {
      console.error(`Main afterAll failed: ${error}`);
    }
  });

  test.describe(`Regular user's personal files`, () => {
    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.loginUser(
        { username, password: username },
        {
          withNavigation: true,
          waitForLoading: true
        }
      );
    });

    test.beforeEach(async ({ trashPage }) => {
      await trashPage.navigate();
    });

    test('[C280494] has the correct columns', async ({ trashPage }) => {
      const expectedColumns = ['Name', 'Location', 'Size', 'Deleted'];
      const actualColumns = await trashPage.dataTable.getColumnHeaders();

      expect(actualColumns).toEqual(expectedColumns);
    });

    test('[C213219] default sorting column', async ({ trashPage }) => {
      expect(await trashPage.dataTable.getSortedColumnHeaderText()).toBe('Deleted');
      expect(await trashPage.dataTable.getSortingOrder()).toBe('desc');
    });

    test('[C280500] Location column is empty if parent folder no longer exists', async ({ trashPage }) => {
      expect(await trashPage.dataTable.getItemLocationText(fileDeleted)).toEqual('');
    });

    test('[C217144] Location column redirect - file in user Home', async ({ trashPage }) => {
      await trashPage.dataTable.clickItemLocation(fileUser);
      await trashPage.dataTable.spinnerWaitForReload();
      expect(await trashPage.breadcrumb.getAllItems()).toEqual(['Personal Files']);
    });

    test('[C280496] Location column redirect - file in folder', async ({ trashPage }) => {
      await trashPage.dataTable.clickItemLocation(fileInFolder);
      await trashPage.dataTable.spinnerWaitForReload();
      expect(await trashPage.breadcrumb.getAllItems()).toEqual(['Personal Files', folderNotDeleted]);
    });

    test('[C280497] Location column redirect - file in site', async ({ trashPage }) => {
      await trashPage.dataTable.clickItemLocation(fileSite);
      await trashPage.dataTable.spinnerWaitForReload();
      expect(await trashPage.breadcrumb.getAllItems()).toEqual(['My Libraries', siteName]);
    });
  });
});
