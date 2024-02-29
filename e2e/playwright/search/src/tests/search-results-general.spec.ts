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
import { ApiClientFactory, Utils, test, TrashcanApi, NodesApi, SitesApi } from '@alfresco/playwright-shared';

test.describe('Search Results - General', () => {
  let trashcanApi: TrashcanApi;
  let nodesApi: NodesApi;
  let sitesApi: SitesApi;

  const username = `user1-${Utils.random()}`;
  const random = Utils.random();

  const file = `test-file-${random}.txt`;
  const folder = `test-folder-${random}`;
  const site = `test-site-${random}`;

  test.beforeEach(async ({ loginPage }) => {
    try {
      await loginPage.loginUser({ username, password: username }, { withNavigation: true, waitForLoading: true });
    } catch (error) {
      console.error(`beforeEach failed: ${error}`);
    }
  });

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

  test.afterAll(async () => {
    try {
      await trashcanApi.emptyTrashcan();
      await nodesApi.deleteCurrentUserNodes();
    } catch (error) {
      console.error(`afterAll failed: ${error}`);
    }
  });

  test('[C290005] Only files are returned when Files option is the only one checked', async ({ searchPage }) => {
    await searchPage.acaHeader.searchButton.click();
    await searchPage.searchInput.searchButton.click();
    await searchPage.searchInput.checkOnlyFiles();
    await searchPage.searchInput.searchFor(`*${random}`);
    await searchPage.dataTable.body.waitFor();

    expect(await searchPage.dataTable.isItemPresent(file)).toBeTruthy();
    expect(await searchPage.dataTable.isItemPresent(folder)).toBeFalsy();
    expect(await searchPage.dataTable.isItemPresent(site)).toBeFalsy();
  });

  test('[C290006] Only folders are returned when Folders option is the only one checked', async ({ searchPage }) => {
    await searchPage.acaHeader.searchButton.click();
    await searchPage.searchInput.searchButton.click();
    await searchPage.searchInput.checkOnlyFolders();
    await searchPage.searchInput.searchFor(`*${random}`);
    await searchPage.dataTable.body.waitFor();

    expect(await searchPage.dataTable.isItemPresent(file)).toBeFalsy();
    expect(await searchPage.dataTable.isItemPresent(folder)).toBeTruthy();
    expect(await searchPage.dataTable.isItemPresent(site)).toBeFalsy();
  });

  test('[C290007] Files and folders are returned when both Files and Folders options are checked', async ({ searchPage }) => {
    await searchPage.acaHeader.searchButton.click();
    await searchPage.searchInput.searchButton.click();
    await searchPage.searchInput.checkFilesAndFolders();
    await searchPage.searchInput.searchFor(`*${random}`);
    await searchPage.dataTable.body.waitFor();

    expect(await searchPage.dataTable.isItemPresent(file)).toBeTruthy();
    expect(await searchPage.dataTable.isItemPresent(folder)).toBeTruthy();
    expect(await searchPage.dataTable.isItemPresent(site)).toBeFalsy();
  });

  test('[C290008] Only libraries are returned when Libraries option is checked', async ({ searchPage }) => {
    await searchPage.acaHeader.searchButton.click();
    await searchPage.searchInput.searchButton.click();
    await searchPage.searchInput.checkLibraries();
    await searchPage.searchInput.searchFor(`*${random}`);
    await searchPage.dataTable.body.waitFor();

    expect(await searchPage.dataTable.isItemPresent(file)).toBeFalsy();
    expect(await searchPage.dataTable.isItemPresent(folder)).toBeFalsy();
    expect(await searchPage.dataTable.isItemPresent(site)).toBeTruthy();
  });

  test('[C279162] Results are updated automatically when changing the search term', async ({ searchPage }) => {
    await searchPage.acaHeader.searchButton.click();
    await searchPage.searchInput.searchButton.click();
    await searchPage.searchInput.searchFor(file);
    await searchPage.dataTable.body.waitFor();

    expect(await searchPage.dataTable.isItemPresent(file)).toBeTruthy();
    expect(await searchPage.dataTable.isItemPresent(folder)).toBeFalsy();

    await searchPage.searchInput.searchButton.click();
    await searchPage.searchInput.searchFor(folder);
    await searchPage.dataTable.body.waitFor();

    expect(await searchPage.dataTable.isItemPresent(file)).toBeFalsy();
    expect(await searchPage.dataTable.isItemPresent(folder)).toBeTruthy();
  });

  test('[C279178] Results are returned when accessing an URL containing a search query', async ({ searchPage, personalFiles }) => {
    await searchPage.acaHeader.searchButton.click();
    await searchPage.searchInput.searchButton.click();
    await searchPage.searchInput.checkLibraries();
    await searchPage.searchInput.searchFor(site);
    await searchPage.dataTable.body.waitFor();

    expect(await searchPage.dataTable.isItemPresent(site)).toBeTruthy();

    const url = searchPage.page.url();

    await personalFiles.navigate();
    await personalFiles.page.goto(url);
    await searchPage.dataTable.body.waitFor();

    expect(await searchPage.dataTable.isItemPresent(site)).toBeTruthy();
  });
});