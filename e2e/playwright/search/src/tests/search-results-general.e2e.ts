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
import { ApiClientFactory, Utils, test, TrashcanApi, NodesApi, SitesApi } from '@alfresco/aca-playwright-shared';

test.describe('Search Results - General', () => {
  let trashcanApi: TrashcanApi;
  let nodesApi: NodesApi;
  let sitesApi: SitesApi;

  const random = Utils.random();
  const username = `user1-${random}`;
  const file = `test-file-${random}.txt`;
  const folder = `test-folder-${random}`;
  const site = `test-site-${random}`;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      trashcanApi = await TrashcanApi.initialize(username, username);
      nodesApi = await NodesApi.initialize(username, username);
      sitesApi = await SitesApi.initialize(username, username);
      await nodesApi.createFolder(folder);
      await nodesApi.createFile(file, '-my-');
      await sitesApi.createSite(site);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', sitesApi, [site]);
  });

  test('[XAT-5605] Files and folders are returned when both Files and Folders options are checked', async ({ searchPage }) => {
    await searchPage.searchWithin(`*${random}`, 'filesAndFolders');

    expect(await searchPage.dataTable.isItemPresent(file)).toBe(true);
    expect(await searchPage.dataTable.isItemPresent(folder)).toBe(true);
    expect(await searchPage.dataTable.isItemPresent(site)).toBe(false);
  });

  test('[XAT-5593] Only libraries are returned when Libraries option is checked', async ({ searchPage }) => {
    await searchPage.searchWithin(`*${random}`, 'libraries');

    expect(await searchPage.dataTable.isItemPresent(file)).toBe(false);
    expect(await searchPage.dataTable.isItemPresent(folder)).toBe(false);
    expect(await searchPage.dataTable.isItemPresent(site)).toBe(true);
  });

  test('[XAT-5589] Results are updated automatically when changing the search term', async ({ searchPage }) => {
    await searchPage.searchWithin(file, 'filesAndFolders');

    expect(await searchPage.dataTable.isItemPresent(file)).toBe(true);
    expect(await searchPage.dataTable.isItemPresent(folder)).toBe(false);

    await searchPage.clickSearchButton();
    await searchPage.searchOverlay.searchFor(folder);
    await searchPage.dataTable.progressBarWaitForReload();

    expect(await searchPage.dataTable.isItemPresent(file)).toBe(false);
    expect(await searchPage.dataTable.isItemPresent(folder)).toBe(true);
  });

  test('[XAT-5590] Results are returned when accessing an URL containing a search query', async ({ searchPage, personalFiles }) => {
    await searchPage.searchWithin(site, 'libraries');

    expect(await searchPage.dataTable.isItemPresent(site)).toBe(true);

    const url = searchPage.page.url();

    await personalFiles.navigate();
    await personalFiles.page.goto(url);
    await searchPage.dataTable.progressBarWaitForReload();

    expect(await searchPage.dataTable.isItemPresent(site)).toBe(true);
  });
});
