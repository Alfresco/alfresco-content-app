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

import { AdminActions, LoginPage, BrowsingPage, RepoClient, Utils, UserActions } from '@alfresco/aca-testing-shared';

describe('Mark items as favorites', () => {
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

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });
    await userActions.login(username, username);

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;

    await apis.user.nodes.createFile(fileNotFavUI, parentId);
    fileFavUIId = (await apis.user.nodes.createFile(fileFavUI, parentId)).entry.id;
    fileNotFav1Id = (await apis.user.nodes.createFile(fileNotFav1, parentId)).entry.id;
    fileNotFav2Id = (await apis.user.nodes.createFile(fileNotFav2, parentId)).entry.id;
    fileNotFav3Id = (await apis.user.nodes.createFile(fileNotFav3, parentId)).entry.id;
    fileNotFav4Id = (await apis.user.nodes.createFile(fileNotFav4, parentId)).entry.id;
    fileFav1Id = (await apis.user.nodes.createFile(fileFav1, parentId)).entry.id;
    fileFav2Id = (await apis.user.nodes.createFile(fileFav2, parentId)).entry.id;
    fileFav3Id = (await apis.user.nodes.createFile(fileFav3, parentId)).entry.id;
    fileFav4Id = (await apis.user.nodes.createFile(fileFav4, parentId)).entry.id;
    folderId = (await apis.user.nodes.createFolder(folder, parentId)).entry.id;

    const currentFavoritesTotalItems = await apis.user.favorites.getFavoritesTotalItems();
    await apis.user.favorites.addFavoritesByIds('file', [fileFavUIId, fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id]);
    await apis.user.favorites.waitForApi({ expect: currentFavoritesTotalItems + 5 });

    await apis.user.shared.shareFilesByIds([fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id]);
    await apis.user.shared.shareFilesByIds([fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id]);
    await apis.user.shared.waitForFilesToBeShared([
      fileFav1Id,
      fileFav2Id,
      fileFav3Id,
      fileFav4Id,
      fileNotFav1Id,
      fileNotFav2Id,
      fileNotFav3Id,
      fileNotFav4Id
    ]);

    await loginPage.loginWith(username);
  });

  afterAll(async () => {
    await userActions.deleteNodes([parentId]);
  });

  afterEach(async () => {
    await Utils.pressEscape();
  });

  describe('on Personal Files', () => {
    afterAll(async () => {
      try {
        await apis.user.favorites.addFavoritesByIds('file', [fileFavUIId, fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id]);
        await apis.user.favorites.addFavoriteById('folder', folderId);
        await apis.user.favorites.removeFavoritesByIds([fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id]);
      } catch (error) {}
    });

    beforeEach(async () => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
    });

    it('[C217186] Favorite action has empty star icon for an item not marked as favorite', async () => {
      await dataTable.selectItem(fileNotFavUI);
      await toolbar.openMoreMenu();

      expect(await toolbar.menu.getItemIconText('Favorite')).toEqual('star_border');
      await toolbar.closeMoreMenu();
    });

    it('[C217187] Favorite action has empty star icon for multiple selection of items when some are not favorite', async () => {
      await dataTable.selectMultipleItems([fileNotFavUI, fileFavUI]);
      await toolbar.openMoreMenu();

      expect(await toolbar.menu.getItemIconText('Favorite')).toEqual('star_border');
      await toolbar.closeMoreMenu();
    });

    it('[C217188] Favorite action has full star icon for items marked as favorite', async () => {
      await dataTable.selectItem(fileFavUI);
      await toolbar.openMoreMenu();

      expect(await toolbar.menu.getItemIconText('Remove Favorite')).toEqual('star');
      await toolbar.closeMoreMenu();
    });

    it('[C217189] favorite a file', async () => {
      await dataTable.selectItem(fileNotFav1);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav1Id, { expect: true })).toBe(true, `${fileNotFav1} not marked as favorite`);
    });

    it('[C280390] favorite a folder', async () => {
      await dataTable.selectItem(folder);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(folderId, { expect: true })).toBe(true, `${folder} not marked as favorite`);
    });

    it('[C217190] unfavorite an item', async () => {
      await dataTable.selectItem(fileFav1);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav1Id, { expect: false })).toBe(false, `${fileFav1} is marked as favorite`);
    });

    it('[C217192] favorite multiple items - all unfavorite', async () => {
      await dataTable.selectMultipleItems([fileNotFav2, fileNotFav3]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav2Id, { expect: true })).toBe(true, `${fileNotFav2} not marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav3Id, { expect: true })).toBe(true, `${fileNotFav3} not marked as favorite`);
    });

    it('[C217194] favorite multiple items - some favorite and some unfavorite', async () => {
      await dataTable.selectMultipleItems([fileNotFav4, fileFav2]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav4Id, { expect: true })).toBe(true, `${fileNotFav4} not marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav2Id, { expect: true })).toBe(true, `${fileFav2} not marked as favorite`);
    });

    it('[C217193] unfavorite multiple items', async () => {
      await dataTable.selectMultipleItems([fileFav3, fileFav4]);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav3Id, { expect: false })).toBe(false, `${fileFav3} marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav4Id, { expect: false })).toBe(false, `${fileFav4} marked as favorite`);
    });
  });
});
