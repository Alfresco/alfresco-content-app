/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ApiClientFactory, Utils, test, TrashcanApi, NodesApi, FavoritesApi, SharedLinksApi } from '@alfresco/aca-playwright-shared';

test.describe('Mark items as favorites', () => {
  let trashcanApi: TrashcanApi;
  let nodesApi: NodesApi;
  let favoritesApi: FavoritesApi;
  let sharedApi: SharedLinksApi;

  const username = `user-${Utils.random()}`;
  const parent = `parent-fev-${Utils.random()}`;
  let parentId: string;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      trashcanApi = await TrashcanApi.initialize(username, username);
      nodesApi = await NodesApi.initialize(username, username);
      favoritesApi = await FavoritesApi.initialize(username, username);
      sharedApi = await SharedLinksApi.initialize(username, username);

      parentId = (await nodesApi.createFolder(parent)).entry.id;
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage, personalFiles }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await personalFiles.dataTable.performClickFolderOrFileToOpen(parent);
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  const addFileToFavorites = async (fileId: string): Promise<void> => {
    const currentFavoritesTotalItems = await favoritesApi.getFavoritesTotalItems(username);
    await favoritesApi.addFavoritesByIds('file', [fileId]);
    await favoritesApi.waitForApi(username, { expect: currentFavoritesTotalItems + 1 });
  };

  test.describe('[XAT-5042] Favorite action has empty star icon for an item not marked as favorite', () => {
    const fileNotFav = `fileNotFav-${Utils.random()}.txt`;

    test.beforeAll(async () => {
      await nodesApi.createFile(fileNotFav, parentId);
    });

    test('[XAT-5042] Favorite action has empty star icon for an item not marked as favorite', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(fileNotFav);
      await personalFiles.acaHeader.clickMoreActions();
      expect(await personalFiles.matMenu.isMenuItemVisible('Favorite')).toBe(true);
    });
  });

  test.describe('[XAT-5043] Favorite action has empty star icon for multiple selection of items when some are not favorite', () => {
    const fileNotFav = `fileNotFav-${Utils.random()}.txt`;
    const fileFav = `fileFav-${Utils.random()}.txt`;

    test.beforeAll(async () => {
      await nodesApi.createFile(fileNotFav, parentId);
      const fileFavId = (await nodesApi.createFile(fileFav, parentId)).entry.id;
      await addFileToFavorites(fileFavId);
    });

    test('[XAT-5043] Favorite action has empty star icon for multiple selection of items when some are not favorite', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(fileNotFav, fileFav);
      await personalFiles.acaHeader.clickMoreActions();
      expect(await personalFiles.matMenu.isMenuItemVisible('Favorite')).toBe(true);
    });
  });

  test.describe('[XAT-5044] Favorite action has full star icon for items marked as favorite', () => {
    const fileFav = `fileFav-${Utils.random()}.txt`;

    test.beforeAll(async () => {
      const fileFavId = (await nodesApi.createFile(fileFav, parentId)).entry.id;
      await addFileToFavorites(fileFavId);
    });

    test('[XAT-5044] Favorite action has full star icon for items marked as favorite', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(fileFav);
      await personalFiles.acaHeader.clickMoreActions();
      expect(await personalFiles.matMenu.isMenuItemVisible('Remove Favorite')).toBe(true);
    });
  });

  test.describe('[XAT-5045] Favorite a file', () => {
    const fileNotFav = `fileNotFav-${Utils.random()}.txt`;
    let fileNotFavId: string;

    test.beforeAll(async () => {
      fileNotFavId = (await nodesApi.createFile(fileNotFav, parentId)).entry.id;
    });

    test('[XAT-5045] Favorite a file', async ({ personalFiles }) => {
      await personalFiles.selectItemsAndToggleFavorite([fileNotFav], 'Favorite');

      expect(await favoritesApi.isFavoriteWithRetry(username, fileNotFavId, { expect: true })).toBe(true);
    });
  });

  test.describe('[XAT-5046] Favorite a folder', () => {
    const folder = `folder-${Utils.random()}`;
    let folderId: string;

    test.beforeAll(async () => {
      folderId = (await nodesApi.createFolder(folder, parentId)).entry.id;
    });

    test('[XAT-5046] Favorite a folder', async ({ personalFiles }) => {
      await personalFiles.selectItemsAndToggleFavorite([folder], 'Favorite');

      expect(await favoritesApi.isFavoriteWithRetry(username, folderId, { expect: true })).toBe(true);
    });
  });

  test.describe('[XAT-5047] Unfavorite an item', () => {
    const fileFav = `fileFav-${Utils.random()}.txt`;
    let fileFavId: string;

    test.beforeAll(async () => {
      fileFavId = (await nodesApi.createFile(fileFav, parentId)).entry.id;
      await addFileToFavorites(fileFavId);
    });

    test('[XAT-5047] Unfavorite an item', async ({ personalFiles }) => {
      await personalFiles.selectItemsAndToggleFavorite([fileFav], 'Remove Favorite');

      expect(await favoritesApi.isFavoriteWithRetry(username, fileFavId, { expect: false })).toBe(false);
    });
  });

  test.describe('[XAT-5048] Favorite multiple items - all unfavorite', () => {
    const fileNotFav1 = `fileNotFav1-${Utils.random()}.txt`;
    const fileNotFav2 = `fileNotFav2-${Utils.random()}.txt`;
    let fileNotFav1Id: string;
    let fileNotFav2Id: string;

    test.beforeAll(async () => {
      fileNotFav1Id = (await nodesApi.createFile(fileNotFav1, parentId)).entry.id;
      fileNotFav2Id = (await nodesApi.createFile(fileNotFav2, parentId)).entry.id;
    });

    test('[XAT-5048] Favorite multiple items - all unfavorite', async ({ personalFiles }) => {
      await personalFiles.selectItemsAndToggleFavorite([fileNotFav1, fileNotFav2], 'Favorite');

      expect(await favoritesApi.isFavoriteWithRetry(username, fileNotFav1Id, { expect: true })).toBe(true);
      expect(await favoritesApi.isFavoriteWithRetry(username, fileNotFav2Id, { expect: true })).toBe(true);
    });
  });

  test.describe('[XAT-5049] Unfavorite multiple items', () => {
    const fileFav1 = `fileFav1-${Utils.random()}.txt`;
    const fileFav2 = `fileFav2-${Utils.random()}.txt`;
    let fileFav1Id: string;
    let fileFav2Id: string;

    test.beforeAll(async () => {
      fileFav1Id = (await nodesApi.createFile(fileFav1, parentId)).entry.id;
      fileFav2Id = (await nodesApi.createFile(fileFav2, parentId)).entry.id;
      const currentFavoritesTotalItems = await favoritesApi.getFavoritesTotalItems(username);
      await favoritesApi.addFavoritesByIds('file', [fileFav1Id, fileFav2Id]);
      await favoritesApi.waitForApi(username, { expect: currentFavoritesTotalItems + 2 });
    });

    test('[XAT-5049] Unfavorite multiple items', async ({ personalFiles }) => {
      await personalFiles.selectItemsAndToggleFavorite([fileFav1, fileFav2], 'Remove Favorite');

      expect(await favoritesApi.isFavoriteWithRetry(username, fileFav1Id, { expect: false })).toBe(false);
      expect(await favoritesApi.isFavoriteWithRetry(username, fileFav2Id, { expect: false })).toBe(false);
    });
  });

  test.describe('[XAT-5050] Favorite multiple items - some favorite and some unfavorite', () => {
    const fileNotFav = `fileNotFav-${Utils.random()}.txt`;
    const fileFav = `fileFav-${Utils.random()}.txt`;
    let fileNotFavId: string;
    let fileFavId: string;

    test.beforeAll(async () => {
      fileNotFavId = (await nodesApi.createFile(fileNotFav, parentId)).entry.id;
      fileFavId = (await nodesApi.createFile(fileFav, parentId)).entry.id;
      await addFileToFavorites(fileFavId);
    });

    test('[XAT-5050] Favorite multiple items - some favorite and some unfavorite', async ({ personalFiles }) => {
      await personalFiles.selectItemsAndToggleFavorite([fileNotFav, fileFav], 'Favorite');

      expect(await favoritesApi.isFavoriteWithRetry(username, fileNotFavId, { expect: true })).toBe(true);
      expect(await favoritesApi.isFavoriteWithRetry(username, fileFavId, { expect: true })).toBe(true);
    });
  });
});

test.describe('[XAT-20164] Opening a favorited repository folder should navigate to Repository', () => {
  let nodesAdminApi: NodesApi;
  let favoritesAdminApi: FavoritesPageApi;
  let repoFavFolderId: string;
  let repositoryFolderId: string;

  const admin = users.admin;
  const repoFavFolderName = `XAT-20164-e2e-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      nodesAdminApi = await NodesApi.initialize('admin', 'admin');
      favoritesAdminApi = await FavoritesPageApi.initialize('admin', 'admin');

      repositoryFolderId = await nodesAdminApi.getRepositoryFolderId();
      repoFavFolderId = (await nodesAdminApi.createFolder(repoFavFolderName, repositoryFolderId)).entry.id;
      await favoritesAdminApi.addFavoriteById('folder', repoFavFolderId);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    if (!admin.username || !admin.password) {
      throw new Error('Admin username or password is not defined');
    }
    await Utils.tryLoginUser(loginPage, admin.username, admin.password, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await nodesAdminApi.deleteNodes([repoFavFolderId], true);
  });

  test('[XAT-20164] Opening a favorited repository folder should navigate to Repository', async ({ favoritePage, repositoryPage }) => {
    await favoritePage.navigate();
    await favoritePage.dataTable.performClickFolderOrFileToOpen(repoFavFolderName);
    expect(repositoryPage.page.url()).toContain('/repository');
  });
});
