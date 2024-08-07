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
import { ApiClientFactory, Utils, test, TrashcanApi, NodesApi, FavoritesPageApi, SharedLinksApi } from '@alfresco/playwright-shared';

test.describe('Mark items as favorites', () => {
  let trashcanApi: TrashcanApi;
  let nodesApi: NodesApi;
  let favoritesApi: FavoritesPageApi;
  let sharedApi: SharedLinksApi;

  const username = `user-${Utils.random()}`;
  const parent = `parent-${Utils.random()}`;

  const fileNotFavUI = `fileNotFavUI-${Utils.random()}.txt`;
  const fileFavUI = `fileFavUI-${Utils.random()}.txt`;
  const fileNotFav1 = `fileNotFav1-${Utils.random()}.txt`;
  const fileNotFav2 = `fileNotFav2-${Utils.random()}.txt`;
  const fileNotFav3 = `fileNotFav3-${Utils.random()}.txt`;
  const fileNotFav4 = `fileNotFav4-${Utils.random()}.txt`;
  const fileFav1 = `fileFav1-${Utils.random()}.txt`;
  const fileFav2 = `fileFav2-${Utils.random()}.txt`;
  const fileFav3 = `fileFav3-${Utils.random()}.txt`;
  const fileFav4 = `fileFav4-${Utils.random()}.txt`;
  const folder = `folder-${Utils.random()}`;

  let fileFavUIId: string;
  let fileNotFav1Id: string;
  let fileNotFav2Id: string;
  let fileNotFav3Id: string;
  let fileNotFav4Id: string;
  let fileFav1Id: string;
  let fileFav2Id: string;
  let fileFav3Id: string;
  let fileFav4Id: string;
  let folderId: string;
  let parentId: string;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      trashcanApi = await TrashcanApi.initialize(username, username);
      nodesApi = await NodesApi.initialize(username, username);
      favoritesApi = await FavoritesPageApi.initialize(username, username);
      sharedApi = await SharedLinksApi.initialize(username, username);

      parentId = (await nodesApi.createFolder(parent)).entry.id;
      fileFavUIId = (await nodesApi.createFile(fileFavUI, parentId)).entry.id;
      fileNotFav1Id = (await nodesApi.createFile(fileNotFav1, parentId)).entry.id;
      fileNotFav2Id = (await nodesApi.createFile(fileNotFav2, parentId)).entry.id;
      fileNotFav3Id = (await nodesApi.createFile(fileNotFav3, parentId)).entry.id;
      fileNotFav4Id = (await nodesApi.createFile(fileNotFav4, parentId)).entry.id;
      fileFav1Id = (await nodesApi.createFile(fileFav1, parentId)).entry.id;
      fileFav2Id = (await nodesApi.createFile(fileFav2, parentId)).entry.id;
      fileFav3Id = (await nodesApi.createFile(fileFav3, parentId)).entry.id;
      fileFav4Id = (await nodesApi.createFile(fileFav4, parentId)).entry.id;
      folderId = (await nodesApi.createFolder(folder, parentId)).entry.id;
      await nodesApi.createFile(fileNotFavUI, parentId);

      const currentFavoritesTotalItems = await favoritesApi.getFavoritesTotalItems(username);
      await favoritesApi.addFavoritesByIds('file', [fileFavUIId, fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id]);
      await favoritesApi.waitForApi(username, { expect: currentFavoritesTotalItems + 5 });

      await sharedApi.shareFilesByIds([fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id]);
      await sharedApi.shareFilesByIds([fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id]);
      await sharedApi.waitForFilesToBeShared([
        fileFav1Id,
        fileFav2Id,
        fileFav3Id,
        fileFav4Id,
        fileNotFav1Id,
        fileNotFav2Id,
        fileNotFav3Id,
        fileNotFav4Id
      ]);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.describe('on Personal Files', () => {
    test.afterAll(async () => {
      try {
        await favoritesApi.addFavoritesByIds('file', [fileFavUIId, fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id]);
        await favoritesApi.addFavoriteById('folder', folderId);
        await favoritesApi.removeFavoritesByIds(username, [fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id]);
      } catch (error) {}
    });

    test.beforeEach(async ({ personalFiles }) => {
      await personalFiles.dataTable.performClickFolderOrFileToOpen(parent);
    });

    test('[XAT-5042] Favorite action has empty star icon for an item not marked as favorite', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(fileNotFavUI);
      await personalFiles.acaHeader.clickMoreActions();
      expect(await personalFiles.matMenu.isMenuItemVisible('Favorite')).toBe(true);
    });

    test('[XAT-5043] Favorite action has empty star icon for multiple selection of items when some are not favorite', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(fileNotFavUI, fileFavUI);
      await personalFiles.acaHeader.clickMoreActions();
      expect(await personalFiles.matMenu.isMenuItemVisible('Favorite')).toBe(true);
    });

    test('[XAT-5044] Favorite action has full star icon for items marked as favorite', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(fileFavUI);
      await personalFiles.acaHeader.clickMoreActions();
      expect(await personalFiles.matMenu.isMenuItemVisible('Remove Favorite')).toBe(true);
    });

    test('[XAT-5045] Favorite a file', async ({ personalFiles }) => {
      await personalFiles.selectItemsAndToggleFavorite([fileNotFav1], 'Favorite');

      expect(await favoritesApi.isFavoriteWithRetry(username, fileNotFav1Id, { expect: true })).toBe(true);
    });

    test('[XAT-5046] Favorite a folder', async ({ personalFiles }) => {
      await personalFiles.selectItemsAndToggleFavorite([folder], 'Favorite');

      expect(await favoritesApi.isFavoriteWithRetry(username, folderId, { expect: true })).toBe(true);
    });

    test('[XAT-5047] Unfavorite an item', async ({ personalFiles }) => {
      await personalFiles.selectItemsAndToggleFavorite([fileFav1], 'Remove Favorite');

      expect(await favoritesApi.isFavoriteWithRetry(username, fileFav1Id, { expect: false })).toBe(false);
    });

    test('[XAT-5048] Favorite multiple items - all unfavorite', async ({ personalFiles }) => {
      await personalFiles.selectItemsAndToggleFavorite([fileNotFav2, fileNotFav3], 'Favorite');

      expect(await favoritesApi.isFavoriteWithRetry(username, fileNotFav2Id, { expect: true })).toBe(true);
      expect(await favoritesApi.isFavoriteWithRetry(username, fileNotFav3Id, { expect: true })).toBe(true);
    });

    test('[XAT-5049] Unfavorite multiple items', async ({ personalFiles }) => {
      await personalFiles.selectItemsAndToggleFavorite([fileFav3, fileFav4], 'Remove Favorite');

      expect(await favoritesApi.isFavoriteWithRetry(username, fileFav3Id, { expect: false })).toBe(false);
      expect(await favoritesApi.isFavoriteWithRetry(username, fileFav4Id, { expect: false })).toBe(false);
    });

    test('[XAT-5050] Favorite multiple items - some favorite and some unfavorite', async ({ personalFiles }) => {
      await personalFiles.selectItemsAndToggleFavorite([fileNotFav4, fileFav2], 'Favorite');

      expect(await favoritesApi.isFavoriteWithRetry(username, fileNotFav4Id, { expect: true })).toBe(true);
      expect(await favoritesApi.isFavoriteWithRetry(username, fileFav2Id, { expect: true })).toBe(true);
    });
  });
});
