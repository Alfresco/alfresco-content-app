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
import { ApiClientFactory, LoginPage, NodesApi, SearchPageApi, SitesApi, TrashcanApi, Utils, test } from '@alfresco/playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('Recent Files', () => {
  const apiClientFactory = new ApiClientFactory();
  let nodeActionsUser: NodesApi;
  let siteActionsUser: SitesApi;
  const username = `user-${Utils.random()}`;

  const folderName = `folder-${Utils.random()}`;
  let folderId: string;
  const fileName1 = `file-${Utils.random()}.txt`;
  const fileName2 = `file-${Utils.random()}.txt`;
  let file2Id: string;
  const fileName3 = `file-${Utils.random()}.txt`;

  const siteName = `site-${Utils.random()}`;
  const folderSite = `folder2-${Utils.random()}`;
  let folderSiteId: string;
  const fileSite = `file-${Utils.random()}.txt`;

  test.beforeAll(async () => {
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    nodeActionsUser = await NodesApi.initialize(username, username);
    siteActionsUser = await SitesApi.initialize(username, username);

    folderId = (await nodeActionsUser.createFolder(folderName)).entry.id;
    await nodeActionsUser.createFiles([fileName1], folderName);
    file2Id = (await nodeActionsUser.createFile(fileName2)).entry.id;
    const id = (await nodeActionsUser.createFile(fileName3)).entry.id;

    await nodeActionsUser.deleteNodes([id], false);

    await siteActionsUser.createSite(siteName, Site.VisibilityEnum.PUBLIC);
    const docLibId = await siteActionsUser.getDocLibId(siteName);
    folderSiteId = (await nodeActionsUser.createFolder(folderSite, docLibId)).entry.id;
    await nodeActionsUser.createFile(fileSite, folderSiteId);

    const searchApi = await SearchPageApi.initialize(username, username);
    await searchApi.waitForApi(username, { expect: 3 });
  });

  test.beforeEach(async ({ page, recentFilesPage }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginUser(
      { username, password: username },
      {
        withNavigation: true,
        waitForLoading: true
      }
    );
    await recentFilesPage.navigate();
  });

  test.afterAll(async () => {
    await nodeActionsUser.deleteNodes([folderId, file2Id]);
    await siteActionsUser.deleteSites([siteName]);
    const trashcanApi = await TrashcanApi.initialize(username, username);
    await trashcanApi.emptyTrashcan();
  });

  test('[C213168] has the correct columns', async ({ recentFilesPage }) => {
    const expectedColumns = ['Name', 'Location', 'Size', 'Modified', 'Tags'];
    const actualColumns = await recentFilesPage.dataTable.getColumnHeaders();

    expect(actualColumns).toEqual(expectedColumns);
  });

  test('[C213171] default sorting column', async ({ recentFilesPage }) => {
    expect(await recentFilesPage.dataTable.getSortedColumnHeaderText()).toBe('Modified');
    expect(await recentFilesPage.dataTable.getSortingOrder()).toBe('desc');
  });

  test(`[C213174] file not displayed if it's been deleted`, async ({ recentFilesPage }) => {
    expect(await recentFilesPage.dataTable.isItemPresent(fileName3), `${fileName3} is displayed`).not.toBe(true);
  });

  test('[C213176] Location column redirect - file in user Home', async ({ recentFilesPage }) => {
    await recentFilesPage.dataTable.clickItemLocation(fileName2);
    await recentFilesPage.dataTable.spinnerWaitForReload();
    expect(await recentFilesPage.breadcrumb.getAllItems()).toEqual(['Personal Files']);
  });

  test('[C280486] Location column redirect - file in folder', async ({ recentFilesPage }) => {
    await recentFilesPage.dataTable.clickItemLocation(fileName1);
    await recentFilesPage.dataTable.spinnerWaitForReload();
    expect(await recentFilesPage.breadcrumb.getAllItems()).toEqual(['Personal Files', folderName]);
  });

  test('[C280487] Location column redirect - file in site', async ({ recentFilesPage }) => {
    await recentFilesPage.dataTable.clickItemLocation(fileSite);
    await recentFilesPage.dataTable.spinnerWaitForReload();
    expect(await recentFilesPage.breadcrumb.getAllItems()).toEqual(['My Libraries', siteName, folderSite]);
  });
});
