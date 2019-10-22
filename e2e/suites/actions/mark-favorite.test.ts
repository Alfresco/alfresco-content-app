/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { SITE_VISIBILITY } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

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

  let fileFavUIId, fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id, fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id, folderId, parentId;

  const fileSearchNotFav1 = `search-fileNotFav1-${Utils.random()}.txt`;
  const fileSearchNotFav2 = `search-fileNotFav2-${Utils.random()}.txt`;
  const fileSearchNotFav3 = `search-fileNotFav3-${Utils.random()}.txt`;
  const fileSearchNotFav4 = `search-fileNotFav4-${Utils.random()}.txt`;
  const fileSearchFav1 = `search-fileFav1-${Utils.random()}.txt`;
  const fileSearchFav2 = `search-fileFav2-${Utils.random()}.txt`;
  const fileSearchFav3 = `search-fileFav3-${Utils.random()}.txt`;
  const fileSearchFav4 = `search-fileFav4-${Utils.random()}.txt`;
  const folderSearch = `search-folder-${Utils.random()}`;

  let fileSearchNotFav1Id, fileSearchNotFav2Id, fileSearchNotFav3Id, fileSearchNotFav4Id;
  let fileSearchFav1Id, fileSearchFav2Id, fileSearchFav3Id, fileSearchFav4Id, folderSearchId;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const { searchInput } = page.header;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

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

    fileSearchNotFav1Id = (await apis.user.nodes.createFile(fileSearchNotFav1, parentId)).entry.id;
    fileSearchNotFav2Id = (await apis.user.nodes.createFile(fileSearchNotFav2, parentId)).entry.id;
    fileSearchNotFav3Id = (await apis.user.nodes.createFile(fileSearchNotFav3, parentId)).entry.id;
    fileSearchNotFav4Id = (await apis.user.nodes.createFile(fileSearchNotFav4, parentId)).entry.id;
    fileSearchFav1Id = (await apis.user.nodes.createFile(fileSearchFav1, parentId)).entry.id;
    fileSearchFav2Id = (await apis.user.nodes.createFile(fileSearchFav2, parentId)).entry.id;
    fileSearchFav3Id = (await apis.user.nodes.createFile(fileSearchFav3, parentId)).entry.id;
    fileSearchFav4Id = (await apis.user.nodes.createFile(fileSearchFav4, parentId)).entry.id;
    folderSearchId = (await apis.user.nodes.createFolder(folderSearch, parentId)).entry.id;

    await apis.user.favorites.addFavoritesByIds('file', [ fileFavUIId, fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id ]);
    await apis.user.favorites.addFavoritesByIds('file', [ fileSearchFav1Id, fileSearchFav2Id, fileSearchFav3Id, fileSearchFav4Id ]);
    await apis.user.favorites.waitForApi({ expect: 9 });

    await apis.user.shared.shareFilesByIds([ fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id ]);
    await apis.user.shared.shareFilesByIds([ fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id ]);
    await apis.user.shared.waitForApi({ expect: 8 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    done();
  });

  afterEach(async (done) => {
    await Utils.pressEscape();
    done();
  });

  describe('on Personal Files', () => {
    afterAll(async (done) => {
      try {
        await apis.user.favorites.addFavoritesByIds('file', [ fileFavUIId, fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id ]);
        await apis.user.favorites.addFavoriteById('folder', folderId);
        await apis.user.favorites.removeFavoritesByIds([ fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id ]);
        await apis.user.favorites.waitForApi({ expect: 10 });
      } catch (error) {
      }
      done();
    });

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      done();
    });

    it('Favorite action has empty star icon for an item not marked as favorite - [C217186]', async () => {
      await dataTable.selectItem(fileNotFavUI);
      await toolbar.openMoreMenu();

      expect(await toolbar.menu.getItemIconText('Favorite')).toEqual('star_border');
    });

    it('Favorite action has empty star icon for multiple selection of items when some are not favorite - [C217187]', async () => {
      await dataTable.selectMultipleItems([ fileNotFavUI, fileFavUI ]);
      await toolbar.openMoreMenu();

      expect(await toolbar.menu.getItemIconText('Favorite')).toEqual('star_border');
    });

    it('Favorite action has full star icon for items marked as favorite - [C217188]', async () => {
      await dataTable.selectItem(fileFavUI);
      await toolbar.openMoreMenu();

      expect(await toolbar.menu.getItemIconText('Remove Favorite')).toEqual('star');
    });

    it('favorite a file - [C217189]', async () => {
      await dataTable.selectItem(fileNotFav1);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav1Id, { expect: true })).toBe(true, `${fileNotFav1} not marked as favorite`);
    });

    it('favorite a folder - [C280390]', async () => {
      await dataTable.selectItem(folder);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(folderId, { expect: true })).toBe(true, `${folder} not marked as favorite`);
    });

    it('unfavorite an item - [C217190]', async () => {
      await dataTable.selectItem(fileFav1);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav1Id, { expect: false })).toBe(false, `${fileFav1} is marked as favorite`);
    });

    it('favorite multiple items - all unfavorite - [C217192]', async () => {
      await dataTable.selectMultipleItems([ fileNotFav2, fileNotFav3 ]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav2Id, { expect: true })).toBe(true, `${fileNotFav2} not marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav3Id, { expect: true })).toBe(true, `${fileNotFav3} not marked as favorite`);
    });

    it('favorite multiple items - some favorite and some unfavorite - [C217194]', async () => {
      await dataTable.selectMultipleItems([ fileNotFav4, fileFav2 ]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav4Id, { expect: true })).toBe(true, `${fileNotFav4} not marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav2Id, { expect: true })).toBe(true, `${fileFav2} not marked as favorite`);
    });

    it('unfavorite multiple items - [C217193]', async () => {
      await dataTable.selectMultipleItems([ fileFav3, fileFav4 ])
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav3Id, { expect: false })).toBe(false, `${fileFav3} marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav4Id, { expect: false })).toBe(false, `${fileFav4} marked as favorite`);
    });
  });

  describe('on Recent Files', () => {
    afterAll(async (done) => {
      try {
        await apis.user.favorites.addFavoritesByIds('file', [ fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id ]);
        await apis.user.favorites.removeFavoritesByIds([ fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id ]);
        await apis.user.favorites.waitForApi({ expect: 10 });
      } catch (error) {
      }
      done();
    });

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickRecentFilesAndWait();
      done();
    });

    it('favorite a file - [C280352]', async () => {
      await dataTable.selectItem(fileNotFav1);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav1Id, { expect: true })).toBe(true, `${fileNotFav1} not marked as favorite`);
    });

    it('unfavorite an item - [C280353]', async () => {
      await dataTable.selectItem(fileFav1);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav1Id, { expect: false })).toBe(false, `${fileFav1} is marked as favorite`);
    });

    it('favorite multiple items - all unfavorite - [C280355]', async () => {
      await dataTable.selectMultipleItems([ fileNotFav2, fileNotFav3 ]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav2Id, { expect: true })).toBe(true, `${fileNotFav2} not marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav3Id, { expect: true })).toBe(true, `${fileNotFav3} not marked as favorite`);
    });

    it('favorite multiple items - some favorite and some unfavorite - [C280357]', async () => {
      await dataTable.selectMultipleItems([ fileNotFav4, fileFav2 ]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav4Id, { expect: true })).toBe(true, `${fileNotFav4} not marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav2Id, { expect: true })).toBe(true, `${fileFav2} not marked as favorite`);
    });

    it('unfavorite multiple items - [C280356]', async () => {
      await dataTable.selectMultipleItems([ fileFav3, fileFav4 ]);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav3Id, { expect: false })).toBe(false, `${fileFav3} marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav4Id, { expect: false })).toBe(false, `${fileFav4} marked as favorite`);
    });
  });

  describe('on Shared Files', () => {
    afterAll(async (done) => {
      try {
        await apis.user.favorites.addFavoritesByIds('file', [ fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id ]);
        await apis.user.favorites.removeFavoritesByIds([ fileNotFav1Id, fileNotFav2Id, fileNotFav3Id, fileNotFav4Id ]);
        await apis.user.favorites.waitForApi({ expect: 10 });
      } catch (error) {
      }
      done();
    });

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickSharedFilesAndWait();
      done();
    });

    it('favorite a file - [C280362]', async () => {
      await dataTable.selectItem(fileNotFav1);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav1Id, { expect: true })).toBe(true, `${fileNotFav1} not marked as favorite`);
    });

    it('unfavorite an item - [C280363]', async () => {
      await dataTable.selectItem(fileFav1);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav1Id, { expect: false })).toBe(false, `${fileFav1} is marked as favorite`);
    });

    it('favorite multiple items - all unfavorite - [C280365]', async () => {
      await dataTable.selectMultipleItems([ fileNotFav2, fileNotFav3 ]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav2Id, { expect: true })).toBe(true, `${fileNotFav2} not marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav3Id, { expect: true })).toBe(true, `${fileNotFav3} not marked as favorite`);
    });

    it('favorite multiple items - some favorite and some unfavorite - [C280367]', async () => {
      await dataTable.selectMultipleItems([ fileNotFav4, fileFav2 ]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileNotFav4Id, { expect: true })).toBe(true, `${fileNotFav4} not marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav2Id, { expect: true })).toBe(true, `${fileFav2} not marked as favorite`);
    });

    it('unfavorite multiple items - [C280366]', async () => {
      await dataTable.selectMultipleItems([ fileFav3, fileFav4 ]);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav3Id, { expect: false })).toBe(false, `${fileFav3} marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav4Id, { expect: false })).toBe(false, `${fileFav4} marked as favorite`);
    });
  });

  describe('on Favorites', () => {
    afterAll(async (done) => {
      try {
        await apis.user.favorites.addFavoritesByIds('file', [ fileFav1Id, fileFav2Id, fileFav3Id, fileFav4Id ]);
        await apis.user.favorites.waitForApi({ expect: 10 });
      } catch (error) {
      }
      done();
    });

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.refresh();
      await page.clickFavoritesAndWait();
      done();
    });

    it('unfavorite an item - [C280368]', async () => {
      await dataTable.selectItem(fileFav1);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav1Id, { expect: false })).toBe(false, `${fileFav1} is marked as favorite`);
      expect(await dataTable.isItemPresent(fileFav1)).toBe(false, 'item still displayed');
    });

    it('unfavorite multiple items - [C280374]', async () => {
      await dataTable.selectMultipleItems([ fileFav3, fileFav4 ]);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav3Id, { expect: false })).toBe(false, `${fileFav3} marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileFav4Id, { expect: false })).toBe(false, `${fileFav4} marked as favorite`);
      expect(await dataTable.isItemPresent(fileFav3)).toBe(false, 'file3 still displayed');
      expect(await dataTable.isItemPresent(fileFav4)).toBe(false, 'file4 still displayed');
    });

    it('Favorite action has full star icon for items marked as favorite - [C280371]', async () => {
      await dataTable.selectItem(fileFav2);
      await toolbar.openMoreMenu();

      expect(await toolbar.menu.getItemIconText('Remove Favorite')).toEqual('star');
    });
  });

  describe('on Search Results', () => {
    beforeAll(async done => {
      await apis.user.search.waitForNodes('search-f', { expect: 9 });
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor('search-f');
      await dataTable.waitForBody();
      done();
    });

    beforeEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    afterAll(async done => {
      await page.header.expandSideNav();
      await page.clickPersonalFiles();
      done();
    });

    it('favorite a file - [C306966]', async () => {
      await dataTable.selectItem(fileSearchNotFav1);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchNotFav1Id, { expect: true })).toBe(true, `${fileSearchNotFav1} not marked as favorite`);
    });

    it('favorite a folder - [C306971]', async () => {
      await dataTable.selectItem(folderSearch);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(folderSearchId, { expect: true })).toBe(true, `${folderSearch} not marked as favorite`);
    });

    it('unfavorite an item - [C306967]', async () => {
      await dataTable.selectItem(fileSearchFav1);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchFav1Id, { expect: false })).toBe(false, `${fileSearchFav1} is marked as favorite`);
    });

    it('favorite multiple items - all unfavorite - [C306968]', async () => {
      await dataTable.selectMultipleItems([ fileSearchNotFav2, fileSearchNotFav3 ]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchNotFav2Id, { expect: true })).toBe(true, `${fileSearchNotFav2} not marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchNotFav3Id, { expect: true })).toBe(true, `${fileSearchNotFav3} not marked as favorite`);
    });

    it('favorite multiple items - some favorite and some unfavorite - [C306970]', async () => {
      await dataTable.selectMultipleItems([ fileSearchNotFav4, fileSearchFav2 ]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchNotFav4Id, { expect: true })).toBe(true, `${fileSearchNotFav4} not marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchFav2Id, { expect: true })).toBe(true, `${fileSearchFav2} not marked as favorite`);
    });

    it('unfavorite multiple items - [C306969]', async () => {
      await dataTable.selectMultipleItems([ fileSearchFav3, fileSearchFav4 ])
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchFav3Id, { expect: false })).toBe(false, `${fileSearchFav3} marked as favorite`);
      expect(await apis.user.favorites.isFavoriteWithRetry(fileSearchFav4Id, { expect: false })).toBe(false, `${fileSearchFav4} marked as favorite`);
    });
  });

  describe ('on File Libraries', () => {
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

    let folderSiteId, fileSiteNotFav1Id, fileSiteNotFav2Id, fileSiteNotFav3Id, fileSiteNotFav4Id;
    let fileSiteFav1Id, fileSiteFav2Id, fileSiteFav3Id, fileSiteFav4Id;

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

      await apis.user.favorites.addFavoritesByIds('file', [ fileSiteFav1Id, fileSiteFav2Id, fileSiteFav3Id, fileSiteFav4Id ]);

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

    it('Favorite a folder - [C280391]', async  () => {
      await dataTable.selectItem(folderSite);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(folderSiteId, { expect: true })).toBe(true, `${folderSite} not marked as favorite`);
    });

    it('Favorite a file - [C280342]', async () => {
      await page.dataTable.doubleClickOnRowByName(folderSite);
      await dataTable.selectItem(fileSiteNotFav1);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteNotFav1Id, { expect: true })).toBe(true, `${fileSiteNotFav1} not marked as favorite`);
    });

    it('Unfavorite an item - [C280343]', async () => {
      await page.dataTable.doubleClickOnRowByName(folderSite);
      await dataTable.selectItem(fileSiteFav1);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteFav1Id, { expect: false })).toBe(false, `${fileSiteFav1} is marked as favorite`);
    });

    it('Favorite multiple items - all unfavorite - [C280345]', async () => {
      await page.dataTable.doubleClickOnRowByName(folderSite);
      await dataTable.selectMultipleItems([ fileSiteNotFav2, fileSiteNotFav3 ]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteNotFav2Id, { expect: true })).toBe(true, 'item not marked as favorite');
      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteNotFav3Id, { expect: true })).toBe(true, 'item not marked as favorite');
    });

    it('Unfavorite multiple items - [C280346]', async () => {
      await page.dataTable.doubleClickOnRowByName(folderSite);
      await dataTable.selectMultipleItems([ fileSiteFav2, fileSiteFav3 ]);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteFav2Id, { expect: false })).toBe(false, 'item marked as favorite');
      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteFav3Id, { expect: false })).toBe(false, 'item marked as favorite');
    });

    it('Favorite multiple items - some favorite and some unfavorite - [C280347]', async () => {
      await page.dataTable.doubleClickOnRowByName(folderSite);
      await dataTable.selectMultipleItems([ fileSiteNotFav4, fileSiteFav4 ]);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteNotFav4Id, { expect: true })).toBe(true, 'item not marked as favorite');
      expect(await apis.user.favorites.isFavoriteWithRetry(fileSiteFav4Id, { expect: true })).toBe(true, 'item not marked as favorite');
    });
  });
});
