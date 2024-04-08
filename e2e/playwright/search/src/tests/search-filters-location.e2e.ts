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
import { ApiClientFactory, Utils, test, NodesApi, TrashcanApi, SitesApi, SITE_VISIBILITY, SITE_ROLES } from '@alfresco/playwright-shared';

test.describe('Search - Filters - Location', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let siteAdminApi: SitesApi;

  const random = Utils.random();
  const username = `user1-${random}`;
  const site = `site-${random}`;
  const fileJpg = `${random}-file.jpg`;
  const filePdf = `${random}-file.pdf`;
  const userFolder = `${random}-userFolder`;
  const siteFolder = `${random}-folderSite`;

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      siteAdminApi = await SitesApi.initialize('admin');
      await siteAdminApi.createSite(site, SITE_VISIBILITY.PUBLIC);
      await siteAdminApi.addSiteMember(site, username, SITE_ROLES.SITE_MANAGER.ROLE);
      const siteId = await siteAdminApi.getDocLibId(site);
      await nodesApi.createFile(fileJpg, siteId);
      await nodesApi.createFile(filePdf);
      await nodesApi.createFolder(siteFolder, siteId);
      await nodesApi.createFolder(userFolder);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', siteAdminApi);
  });

  test('[C279231] Filter by location - files', async ({ searchPage }) => {
    await searchPage.searchWithin(random, 'files');

    await expect(searchPage.dataTable.getRowByName(fileJpg)).toBeVisible();
    await expect(searchPage.dataTable.getRowByName(filePdf)).toBeVisible();

    await searchPage.searchFiltersLocation.filterByLocation(searchPage, site);

    await expect(searchPage.dataTable.getRowByName(fileJpg)).toBeVisible();
    await expect(searchPage.dataTable.getRowByName(filePdf)).toBeHidden();
  });

  test('[C279231] Filter by location - folders', async ({ searchPage }) => {
    await searchPage.searchWithin(random, 'folders');

    await expect(searchPage.dataTable.getRowByName(userFolder)).toBeVisible();
    await expect(searchPage.dataTable.getRowByName(siteFolder)).toBeVisible();

    await searchPage.searchFiltersLocation.filterByLocation(searchPage, site);

    await expect(searchPage.dataTable.getRowByName(siteFolder)).toBeVisible();
    await expect(searchPage.dataTable.getRowByName(userFolder)).toBeHidden();
  });
});
