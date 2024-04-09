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
import { ApiClientFactory, NodesApi, Utils, test, SitesApi, FavoritesPageApi, timeouts, TrashcanApi } from '@alfresco/playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('Favorites Files', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let siteActionsAdmin: SitesApi;
  const username = `user-${Utils.random()}`;
  const siteName = `site-${Utils.random()}`;
  const favFolderName = `favFolder-${Utils.random()}`;
  const parentFolder = `parent-${Utils.random()}`;
  const fileName1 = `file1-${Utils.random()}.txt`;
  const fileName2 = `file2-${Utils.random()}.txt`;
  const fileName3 = `file3-${Utils.random()}.txt`;
  const fileName4 = `file4-${Utils.random()}.txt`;

  test.beforeAll(async () => {
    try {
      test.setTimeout(timeouts.extendedTest);
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      const nodesApiAdmin = await NodesApi.initialize('admin');
      siteActionsAdmin = await SitesApi.initialize('admin');
      const favoritesActions = await FavoritesPageApi.initialize(username, username);
      const consumerFavoritesTotalItems = await favoritesActions.getFavoritesTotalItems(username);
      const folderFavId = (await nodesApi.createFolder(favFolderName)).entry.id;
      const parentId = (await nodesApi.createFolder(parentFolder)).entry.id;
      await siteActionsAdmin.createSite(siteName, Site.VisibilityEnum.PUBLIC);
      const docLibId = await siteActionsAdmin.getDocLibId(siteName);
      await siteActionsAdmin.addSiteMember(siteName, username, Site.RoleEnum.SiteManager);
      await favoritesActions.addFavoritesByIds('folder', [folderFavId]);
      const file1Id = (await nodesApiAdmin.createFile(fileName1, docLibId)).entry.id;
      const file2Id = (await nodesApi.createFile(fileName2, parentId)).entry.id;
      const file3Id = (await nodesApi.createFile(fileName3, parentId)).entry.id;
      const file4Id = (await nodesApi.createFile(fileName4, parentId)).entry.id;

      await favoritesActions.addFavoritesByIds('file', [file1Id]);
      await favoritesActions.addFavoriteById('file', file2Id);
      await favoritesActions.addFavoriteById('file', file3Id);
      await favoritesActions.addFavoriteById('file', file4Id);
      await nodesApi.deleteNodes([file3Id, file4Id], false);
      await apiClientFactory.trashCan.restoreDeletedNode(file4Id);
      await Promise.all([
        favoritesActions.isFavoriteWithRetry(username, folderFavId, { expect: true }),
        favoritesActions.waitForApi(username, { expect: consumerFavoritesTotalItems + 4 })
      ]);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', siteActionsAdmin, [siteName]);
  });

  test.describe(`Regular user's Favorites files`, () => {
    test.beforeEach(async ({ favoritePage }) => {
      await favoritePage.navigate();
    });

    test('[C280482] has the correct columns', async ({ favoritePage }) => {
      const expectedColumns = ['Name', 'Location', 'Size', 'Modified', 'Modified by', 'Tags'];
      const actualColumns = await favoritePage.dataTable.getColumnHeaders();
      expect(actualColumns).toEqual(expectedColumns);
    });

    test(`[C213228] deleted favorite file does not appear`, async ({ favoritePage }) => {
      expect(await favoritePage.dataTable.isItemPresent(fileName3), `${fileName3} is displayed`).not.toBe(true);
    });

    test(`[C213229] file is displayed after it is restored from Trashcan`, async ({ favoritePage }) => {
      expect(await favoritePage.dataTable.isItemPresent(fileName4), `${fileName4} not displayed`).toBe(true);
    });

    test('[C213231] Location column displays the parent folder of the files', async ({ favoritePage }) => {
      expect(await favoritePage.dataTable.getItemLocationText(fileName2)).toEqual(parentFolder);
      expect(await favoritePage.dataTable.getItemLocationText(favFolderName)).toEqual('Personal Files');
      expect(await favoritePage.dataTable.getItemLocationTooltip(fileName2)).toEqual(`Personal Files/${parentFolder}`);
      expect(await favoritePage.dataTable.getItemLocationTooltip(favFolderName)).toEqual('Personal Files');
      await favoritePage.page.waitForTimeout(2500);
      expect(await favoritePage.dataTable.getItemLocationText(fileName1)).toEqual(siteName);
      expect(await favoritePage.dataTable.getItemLocationTooltip(fileName1)).toContain(`${siteName}`);
    });

    test('[C213650] Location column redirect - item in user Home', async ({ favoritePage }) => {
      await favoritePage.dataTable.clickItemLocation(favFolderName);
      await favoritePage.dataTable.spinnerWaitForReload();
      expect(await favoritePage.breadcrumb.getAllItems()).toEqual(['Personal Files']);
    });

    test('[C280484] Location column redirect - file in folder', async ({ favoritePage }) => {
      await favoritePage.dataTable.clickItemLocation(fileName2);
      await favoritePage.dataTable.spinnerWaitForReload();
      expect(await favoritePage.breadcrumb.getAllItems()).toEqual(['Personal Files', parentFolder]);
    });

    test('[C280485] Location column redirect - file in site', async ({ favoritePage }) => {
      await favoritePage.dataTable.clickItemLocation(fileName1);
      await favoritePage.dataTable.spinnerWaitForReload();
      expect(await favoritePage.breadcrumb.getAllItems()).toEqual(['My Libraries', siteName]);
    });

    test('[C213230] Navigate into folder from Favorites', async ({ favoritePage }) => {
      await favoritePage.dataTable.performClickFolderOrFileToOpen(favFolderName);
      await favoritePage.dataTable.spinnerWaitForReload();
      await expect(favoritePage.breadcrumb.currentItem).toHaveText(favFolderName);
    });
  });
});
