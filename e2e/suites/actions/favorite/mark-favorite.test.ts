/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { AdminActions, LoginPage, BrowsingPage, SITE_VISIBILITY, RepoClient, Utils } from '@alfresco/aca-testing-shared';

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

  const searchRandom = Utils.random();
  const fileSearchNotFav1 = `search-${searchRandom}-fileNotFav1.txt`;
  const fileSearchNotFav2 = `search-${searchRandom}-fileNotFav2.txt`;
  const fileSearchNotFav3 = `search-${searchRandom}-fileNotFav3.txt`;
  const fileSearchNotFav4 = `search-${searchRandom}-fileNotFav4.txt`;
  const fileSearchFav1 = `search-${searchRandom}-fileFav1.txt`;
  const fileSearchFav2 = `search-${searchRandom}-fileFav2.txt`;
  const fileSearchFav3 = `search-${searchRandom}-fileFav3.txt`;
  const fileSearchFav4 = `search-${searchRandom}-fileFav4.txt`;
  const folderSearch = `search-${searchRandom}-folder`;

  let fileSearchNotFav1Id: string;
  let fileSearchNotFav2Id: string;
  let fileSearchNotFav3Id: string;
  let fileSearchNotFav4Id: string;
  let fileSearchFav1Id: string;
  let fileSearchFav2Id: string;
  let fileSearchFav3Id: string;
  let fileSearchFav4Id: string;
  let folderSearchId: string;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const { searchInput } = page.header;

  const adminApiActions = new AdminActions();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });

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
    done();
  });

  afterAll(async () => {
    await apis.user.nodes.deleteNodeById(parentId);
  });

  afterEach(async () => {
    await Utils.pressEscape();
  });

  describe('on Personal Files', () => {
    afterAll(async (done) => {
      try {
        await apis.user.favorites.addFavoritesByIds('file', [fileFavUIId, fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id]);
        await apis.user.favorites.addFavoriteById('folder', folderId);
        await apis.user.favorites.removeFavoritesByIds([fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id]);
      } catch (error) {}
      done();
    });

    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      done();
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

  describe('on Recent Files', () => {
    afterAll(async (done) => {
      try {
        await apis.user.favorites.addFavoritesByIds('file', [fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id]);
        await apis.user.favorites.removeFavoritesByIds([fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id]);
      } catch (error) {}
      done();
    });

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickRecentFilesAndWait();
      done();
    });

    it('[C280352] favorite a file', async () => {
      await dataTable.selectItem(fileNotFav1);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav1Id, { expect: true })).toBe(true, `${fileNotFav1} not marked as favorite`);
    });

    it('[C280353] unfavorite an item', async () => {
      await dataTable.selectItem(fileFav1);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav1Id, { expect: false })).toBe(false, `${fileFav1} is marked as favorite`);
    });

    it('[C280355] favorite multiple items - all unfavorite', async () => {
      await dataTable.selectMultipleItems([fileNotFav2, fileNotFav3]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav2Id, { expect: true })).toBe(true, `${fileNotFav2} not marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav3Id, { expect: true })).toBe(true, `${fileNotFav3} not marked as favorite`);
    });

    it('[C280357] favorite multiple items - some favorite and some unfavorite', async () => {
      await dataTable.selectMultipleItems([fileNotFav4, fileFav2]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav4Id, { expect: true })).toBe(true, `${fileNotFav4} not marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav2Id, { expect: true })).toBe(true, `${fileFav2} not marked as favorite`);
    });

    it('[C280356] unfavorite multiple items', async () => {
      await dataTable.selectMultipleItems([fileFav3, fileFav4]);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav3Id, { expect: false })).toBe(false, `${fileFav3} marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav4Id, { expect: false })).toBe(false, `${fileFav4} marked as favorite`);
    });
  });

  describe('on Shared Files', () => {
    afterAll(async (done) => {
      try {
        await apis.user.favorites.addFavoritesByIds('file', [fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id]);
        await apis.user.favorites.removeFavoritesByIds([fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id]);
      } catch (error) {}
      done();
    });

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickSharedFilesAndWait();
      done();
    });

    it('[C280362] favorite a file', async () => {
      await dataTable.selectItem(fileNotFav1);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav1Id, { expect: true })).toBe(true, `${fileNotFav1} not marked as favorite`);
    });

    it('[C280363] unfavorite an item', async () => {
      await dataTable.selectItem(fileFav1);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav1Id, { expect: false })).toBe(false, `${fileFav1} is marked as favorite`);
    });

    it('[C280365] favorite multiple items - all unfavorite', async () => {
      await dataTable.selectMultipleItems([fileNotFav2, fileNotFav3]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav2Id, { expect: true })).toBe(true, `${fileNotFav2} not marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav3Id, { expect: true })).toBe(true, `${fileNotFav3} not marked as favorite`);
    });

    it('[C280367] favorite multiple items - some favorite and some unfavorite', async () => {
      await dataTable.selectMultipleItems([fileNotFav4, fileFav2]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav4Id, { expect: true })).toBe(true, `${fileNotFav4} not marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav2Id, { expect: true })).toBe(true, `${fileFav2} not marked as favorite`);
    });

    it('[C280366] unfavorite multiple items', async () => {
      await dataTable.selectMultipleItems([fileFav3, fileFav4]);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav3Id, { expect: false })).toBe(false, `${fileFav3} marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav4Id, { expect: false })).toBe(false, `${fileFav4} marked as favorite`);
    });
  });

  describe('on Favorites', () => {
    afterAll(async (done) => {
      try {
        await apis.user.favorites.addFavoritesByIds('file', [fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id]);
      } catch (error) {}
      done();
    });

    beforeEach(async () => {
      await Utils.pressEscape();
      await page.refresh();
      await page.clickFavoritesAndWait();
    });

    it('[C280368] unfavorite an item', async () => {
      await dataTable.selectItem(fileFav1);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav1Id, { expect: false })).toBe(false, `${fileFav1} is marked as favorite`);
      expect(await dataTable.isItemPresent(fileFav1)).toBe(false, 'item still displayed');
    });

    it('[C280374] unfavorite multiple items', async () => {
      await dataTable.selectMultipleItems([fileFav3, fileFav4]);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav3Id, { expect: false })).toBe(false, `${fileFav3} marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav4Id, { expect: false })).toBe(false, `${fileFav4} marked as favorite`);
      expect(await dataTable.isItemPresent(fileFav3)).toBe(false, 'file3 still displayed');
      expect(await dataTable.isItemPresent(fileFav4)).toBe(false, 'file4 still displayed');
    });

    it('[C280371] Favorite action has full star icon for items marked as favorite', async () => {
      await dataTable.selectItem(fileFav2);
      await toolbar.openMoreMenu();

      expect(await toolbar.menu.getItemIconText('Remove Favorite')).toEqual('star');
      await toolbar.closeMoreMenu();
    });
  });

  describe('on Search Results', () => {
    beforeAll(async (done) => {
      fileSearchNotFav1Id = (await apis.user.nodes.createFile(fileSearchNotFav1, parentId)).entry.id;
      fileSearchNotFav2Id = (await apis.user.nodes.createFile(fileSearchNotFav2, parentId)).entry.id;
      fileSearchNotFav3Id = (await apis.user.nodes.createFile(fileSearchNotFav3, parentId)).entry.id;
      fileSearchNotFav4Id = (await apis.user.nodes.createFile(fileSearchNotFav4, parentId)).entry.id;
      fileSearchFav1Id = (await apis.user.nodes.createFile(fileSearchFav1, parentId)).entry.id;
      fileSearchFav2Id = (await apis.user.nodes.createFile(fileSearchFav2, parentId)).entry.id;
      fileSearchFav3Id = (await apis.user.nodes.createFile(fileSearchFav3, parentId)).entry.id;
      fileSearchFav4Id = (await apis.user.nodes.createFile(fileSearchFav4, parentId)).entry.id;
      folderSearchId = (await apis.user.nodes.createFolder(folderSearch, parentId)).entry.id;
      await apis.user.search.waitForNodes(searchRandom, { expect: 9 });

      await apis.user.favorites.addFavoritesByIds('file', [fileSearchFav1Id, fileSearchFav2Id, fileSearchFav3Id, fileSearchFav4Id]);

      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(searchRandom);
      await dataTable.waitForBody();
      done();
    });

    afterAll(async () => {
      await page.header.expandSideNav();
      await page.clickPersonalFiles();
    });

    it('[C306966] favorite a file', async () => {
      await dataTable.selectItem(fileSearchNotFav1);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchNotFav1Id, { expect: true })).toBe(
        true,
        `${fileSearchNotFav1} not marked as favorite`
      );
    });

    it('[C306971] favorite a folder', async () => {
      await dataTable.selectItem(folderSearch);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(folderSearchId, { expect: true })).toBe(true, `${folderSearch} not marked as favorite`);
    });

    it('[C306967] unfavorite an item', async () => {
      await dataTable.selectItem(fileSearchFav1);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchFav1Id, { expect: false })).toBe(
        false,
        `${fileSearchFav1} is marked as favorite`
      );
    });

    it('[C306968] favorite multiple items - all unfavorite', async () => {
      await dataTable.selectMultipleItems([fileSearchNotFav2, fileSearchNotFav3]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchNotFav2Id, { expect: true })).toBe(
        true,
        `${fileSearchNotFav2} not marked as favorite`
      );
      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchNotFav3Id, { expect: true })).toBe(
        true,
        `${fileSearchNotFav3} not marked as favorite`
      );
    });

    it('[C306970] favorite multiple items - some favorite and some unfavorite', async () => {
      await dataTable.selectMultipleItems([fileSearchNotFav4, fileSearchFav2]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchNotFav4Id, { expect: true })).toBe(
        true,
        `${fileSearchNotFav4} not marked as favorite`
      );
      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchFav2Id, { expect: true })).toBe(
        true,
        `${fileSearchFav2} not marked as favorite`
      );
    });

    it('[C306969] unfavorite multiple items', async () => {
      await dataTable.selectMultipleItems([fileSearchFav3, fileSearchFav4]);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchFav3Id, { expect: false })).toBe(false, `${fileSearchFav3} marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchFav4Id, { expect: false })).toBe(false, `${fileSearchFav4} marked as favorite`);
    });
  });

  describe('on File Libraries', () => {
    const siteName = `site-public-${Utils.random()}`;

    const folderSite = `folderSite-${Utils.random()}`;

    const fileSiteNotFav1 = `fileSiteNotFav1-${Utils.random()}.txt`;
    const fileSiteNotFav2 = `fileSiteNotFav2-${Utils.random()}.txt`;
    const fileSiteNotFav3 = `fileSiteNotFav3-${Utils.random()}.txt`;
    const fileSiteNotFav4 = `fileSiteNotFav4-${Utils.random()}.txt`;
    const fileSiteFav1 = `fileSiteFav1-${Utils.random()}.txt`;
    const fileSiteFav2 = `fileSiteFav2-${Utils.random()}.txt`;
    const fileSiteFav3 = `fileSiteFav3-${Utils.random()}.txt`;
    const fileSiteFav4 = `fileSiteFav4-${Utils.random()}.txt`;

    let folderSiteId: string;
    let fileSiteNotFav1Id: string;
    let fileSiteNotFav2Id: string;
    let fileSiteNotFav3Id: string;
    let fileSiteNotFav4Id: string;
    let fileSiteFav1Id: string;
    let fileSiteFav2Id: string;
    let fileSiteFav3Id: string;
    let fileSiteFav4Id: string;

    beforeAll(async (done) => {
      await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
      const docLibId = await apis.user.sites.getDocLibId(siteName);

      folderSiteId = (await apis.user.nodes.createFolder(folderSite, docLibId)).entry.id;
      fileSiteNotFav1Id = (await apis.user.nodes.createFile(fileSiteNotFav1, folderSiteId)).entry.id;
      fileSiteNotFav2Id = (await apis.user.nodes.createFile(fileSiteNotFav2, folderSiteId)).entry.id;
      fileSiteNotFav3Id = (await apis.user.nodes.createFile(fileSiteNotFav3, folderSiteId)).entry.id;
      fileSiteNotFav4Id = (await apis.user.nodes.createFile(fileSiteNotFav4, folderSiteId)).entry.id;
      fileSiteFav1Id = (await apis.user.nodes.createFile(fileSiteFav1, folderSiteId)).entry.id;
      fileSiteFav2Id = (await apis.user.nodes.createFile(fileSiteFav2, folderSiteId)).entry.id;
      fileSiteFav3Id = (await apis.user.nodes.createFile(fileSiteFav3, folderSiteId)).entry.id;
      fileSiteFav4Id = (await apis.user.nodes.createFile(fileSiteFav4, folderSiteId)).entry.id;

      await apis.user.favorites.addFavoritesByIds('file', [fileSiteFav1Id, fileSiteFav2Id, fileSiteFav3Id, fileSiteFav4Id]);

      await apis.user.favorites.isFavoriteWithRetry(fileSiteFav1Id, { expect: true });
      await apis.user.favorites.isFavoriteWithRetry(fileSiteFav2Id, { expect: true });
      await apis.user.favorites.isFavoriteWithRetry(fileSiteFav3Id, { expect: true });
      await apis.user.favorites.isFavoriteWithRetry(fileSiteFav4Id, { expect: true });

      done();
    });

    afterAll(async (done) => {
      await apis.user.sites.deleteSite(siteName);
      done();
    });

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.goToMyLibrariesAndWait();
      await page.dataTable.doubleClickOnRowByName(siteName);
      await page.dataTable.waitForHeader();
      done();
    });

    it('[C280391] Favorite a folder', async () => {
      await dataTable.selectItem(folderSite);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(folderSiteId, { expect: true })).toBe(true, `${folderSite} not marked as favorite`);
    });

    it('[C280342] Favorite a file', async () => {
      await page.dataTable.doubleClickOnRowByName(folderSite);
      await dataTable.selectItem(fileSiteNotFav1);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteNotFav1Id, { expect: true })).toBe(
        true,
        `${fileSiteNotFav1} not marked as favorite`
      );
    });

    it('[C280343] Unfavorite an item', async () => {
      await page.dataTable.doubleClickOnRowByName(folderSite);
      await dataTable.selectItem(fileSiteFav1);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteFav1Id, { expect: false })).toBe(false, `${fileSiteFav1} is marked as favorite`);
    });

    it('[C280345] Favorite multiple items - all unfavorite', async () => {
      await page.dataTable.doubleClickOnRowByName(folderSite);
      await dataTable.selectMultipleItems([fileSiteNotFav2, fileSiteNotFav3]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteNotFav2Id, { expect: true })).toBe(true, 'item not marked as favorite');
      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteNotFav3Id, { expect: true })).toBe(true, 'item not marked as favorite');
    });

    it('[C280346] Unfavorite multiple items', async () => {
      await page.dataTable.doubleClickOnRowByName(folderSite);
      await dataTable.selectMultipleItems([fileSiteFav2, fileSiteFav3]);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteFav2Id, { expect: false })).toBe(false, 'item marked as favorite');
      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteFav3Id, { expect: false })).toBe(false, 'item marked as favorite');
    });

    it('[C280347] Favorite multiple items - some favorite and some unfavorite', async () => {
      await page.dataTable.doubleClickOnRowByName(folderSite);
      await dataTable.selectMultipleItems([fileSiteNotFav4, fileSiteFav4]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteNotFav4Id, { expect: true })).toBe(true, 'item not marked as favorite');
      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteFav4Id, { expect: true })).toBe(true, 'item not marked as favorite');
    });
  });
});
