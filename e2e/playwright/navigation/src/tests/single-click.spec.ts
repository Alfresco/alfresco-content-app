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
import { ApiClientFactory, LoginPage, NodesApi, SitesApi, test, Utils } from '@alfresco/playwright-shared';

test.describe('Single click on item name', () => {
  let nodesApi: NodesApi;
  const username = `user-${Utils.random()}`;
  const folder1 = `folder1-${Utils.random()}`;
  let folder1Id: string;
  const folderSearch = `folder1-${Utils.random()}`;
  let folderSearchId: string;

  const deletedFile1 = `file1-${Utils.random()}.txt`;
  let deletedFile1Id: string;
  const deletedFolder1 = `folder1-${Utils.random()}`;
  let deletedFolder1Id: string;

  const siteName = `site-${Utils.random()}`;
  const fileSite = `fileSite-${Utils.random()}.txt`;

  test.beforeAll(async () => {
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    nodesApi = await NodesApi.initialize(username, username);
    const siteActions = await SitesApi.initialize(username, username);
    const node = await nodesApi.createFolder(folder1);
    folder1Id = node.entry.id;
    folderSearchId = (await nodesApi.createFolder(folderSearch)).entry.id;
    deletedFile1Id = (await nodesApi.createFile(deletedFile1)).entry.id;
    deletedFolder1Id = (await nodesApi.createFolder(deletedFolder1)).entry.id;

    await siteActions.createSite(siteName);
    const docLibId = await siteActions.getDocLibId(siteName);
    await nodesApi.createFile(fileSite, docLibId);
  });

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

  test.afterAll(async () => {
    await nodesApi.deleteNodes([deletedFolder1Id, deletedFile1Id, folder1Id, folderSearchId], true);
  });

  test('[C284899] Hyperlink does not appear for items in the Trash', async ({ trashPage }) => {
    await trashPage.navigate();
    expect(await trashPage.dataTable.getCellLinkByName(deletedFile1).isVisible(), 'Link on name is present').toBe(false);
    expect(await trashPage.dataTable.getCellLinkByName(deletedFolder1).isVisible(), 'Link on name is present').toBe(false);
  });

  test('[C280034] Navigate inside the folder when clicking the hyperlink on Personal Files', async ({ personalFiles }) => {
    await personalFiles.navigate();
    await personalFiles.dataTable.setPaginationTo50();
    await personalFiles.dataTable.getCellLinkByName(folder1).click();
    await personalFiles.dataTable.spinnerWaitForReload();
    while ((await personalFiles.breadcrumb.currentItem.innerText()) === 'Personal Files') {
      await personalFiles.breadcrumb.currentItem.innerText();
    }
    expect(await personalFiles.breadcrumb.currentItem.innerText()).toBe(folder1);
  });

  test('[C284902] Navigate inside the library when clicking the hyperlink on File Libraries', async ({ myLibrariesPage }) => {
    await myLibrariesPage.navigate();
    await myLibrariesPage.dataTable.goThroughPagesLookingForRowWithName(siteName);
    await myLibrariesPage.dataTable.getCellLinkByName(siteName).click();
    await myLibrariesPage.dataTable.spinnerWaitForReload();
    expect(await myLibrariesPage.breadcrumb.currentItem.innerText()).toBe(siteName);
    expect(await myLibrariesPage.dataTable.getCellLinkByName(fileSite).isVisible(), `${fileSite} not displayed`).toBe(true);
  });
});
