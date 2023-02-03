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

import { RepoClient, Utils, AdminActions, UserActions, LoginPage, SearchResultsPage, BrowsingPage } from '@alfresco/aca-testing-shared';
import * as testData from './test-data';
import * as testUtil from '../test-util';

describe('Folders - available actions : ', () => {
  const random = testData.random;

  const username = `user-${Utils.random()}`;
  const parentName = `parent-${Utils.random()}`;

  let parentId: string;
  let folderFavId: string;
  let folderFav2Id: string;
  let fileFavId: string;

  const userApi = new RepoClient(username, username);
  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const { searchInput } = page.header;
  const searchResultsPage = new SearchResultsPage();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });

    parentId = (await userApi.nodes.createFolder(parentName)).entry.id;

    await userApi.nodes.createFile(testData.file.name, parentId);
    fileFavId = (await userApi.nodes.createFile(testData.fileFav.name, parentId)).entry.id;

    await userApi.nodes.createFolder(testData.folder.name, parentId);
    folderFavId = (await userApi.nodes.createFolder(testData.folderFav.name, parentId)).entry.id;
    folderFav2Id = (await userApi.nodes.createFolder(testData.folderFav2.name, parentId)).entry.id;

    const initialFavoritesTotalItems = (await userApi.favorites.getFavoritesTotalItems()) || 0;
    await userApi.favorites.addFavoritesByIds('folder', [folderFavId, folderFav2Id]);
    await userApi.favorites.addFavoritesByIds('file', [fileFavId]);
    await userApi.favorites.waitForApi({ expect: initialFavoritesTotalItems + 3 });
    await userApi.search.waitForNodes(random, { expect: 5 });

    await loginPage.loginWith(username);
  });

  afterAll(async () => {
    await userActions.login(username, username);
    await userActions.deleteNodes([parentId]);
    await userActions.emptyTrashcan();
  });

  beforeEach(async () => {
    await Utils.pressEscape();
  });

  describe('on Personal Files : ', () => {
    beforeAll(async () => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parentName);
      await dataTable.waitForHeader();
    });

    it('Folder not favorite  - [C213123]', async () => {
      await testUtil.checkToolbarActions(testData.folder.name, testData.folder.toolbarPrimary, testData.folder.toolbarMore);
      await testUtil.checkContextMenu(testData.folder.name, testData.folder.contextMenu);
    });

    it('Folder favorite - [C280451]', async () => {
      await testUtil.checkToolbarActions(testData.folderFav.name, testData.folderFav.toolbarPrimary, testData.folderFav.toolbarMore);
      await testUtil.checkContextMenu(testData.folderFav.name, testData.folderFav.contextMenu);
    });

    it('multiple folders - [C280459]', async () => {
      await testUtil.checkMultipleSelContextMenu([testData.folderFav.name, testData.folder.name], testData.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarActions(
        [testData.folderFav.name, testData.folder.name],
        testData.multipleSel.toolbarPrimary,
        testData.multipleSel.toolbarMore
      );
    });

    it('both files and folders - [C280460]', async () => {
      await testUtil.checkMultipleSelContextMenu([testData.file.name, testData.folder.name], testData.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarActions(
        [testData.file.name, testData.folder.name],
        testData.multipleSel.toolbarPrimary,
        testData.multipleSel.toolbarMore
      );
    });
  });

  describe('on Favorites Files : ', () => {
    beforeAll(async () => {
      await page.clickFavoritesAndWait();
    });

    it('Folder favorite - [C291817]', async () => {
      await testUtil.checkToolbarActions(testData.folderFav.name, testData.folderFav.toolbarPrimary, testData.folderFav.favoritesToolbarMore);
      await testUtil.checkContextMenu(testData.folderFav.name, testData.folderFav.favoritesContextMenu);
    });

    it('multiple folders - [C280664]', async () => {
      await testUtil.checkMultipleSelContextMenu(
        [testData.folderFav.name, testData.folderFav2.name],
        testData.multipleSelAllFav.favoritesContextMenu
      );
      await testUtil.checkMultipleSelToolbarActions(
        [testData.folderFav.name, testData.folderFav2.name],
        testData.multipleSelAllFav.toolbarPrimary,
        testData.multipleSelAllFav.favoritesToolbarMore
      );
    });

    it('both files and folders - [C280657]', async () => {
      await testUtil.checkMultipleSelContextMenu([testData.fileFav.name, testData.folderFav.name], testData.multipleSelAllFav.favoritesContextMenu);
      await testUtil.checkMultipleSelToolbarActions(
        [testData.fileFav.name, testData.folderFav.name],
        testData.multipleSelAllFav.toolbarPrimary,
        testData.multipleSelAllFav.favoritesToolbarMore
      );
    });
  });

  describe('on Search Results : ', () => {
    describe('on a folder', () => {
      beforeAll(async () => {
        await page.clickPersonalFiles();
        await searchInput.clickSearchButton();
        await searchInput.searchFor(random);
        await searchResultsPage.waitForResults();
      });

      it('[C280609] Folder not favorite', async () => {
        await testUtil.checkToolbarActions(testData.folder.name, testData.folder.searchToolbarPrimary, testData.folder.searchToolbarMore);
        await testUtil.checkContextMenu(testData.folder.name, testData.folder.searchContextMenu);
      });

      it('[C291828] Folder favorite', async () => {
        await testUtil.checkToolbarActions(testData.folderFav.name, testData.folderFav.searchToolbarPrimary, testData.folderFav.searchToolbarMore);
        await testUtil.checkContextMenu(testData.folderFav.name, testData.folderFav.searchContextMenu);
      });
    });

    describe('on multiple selection', () => {
      it('[C291821] multiple folders', async () => {
        await searchInput.clickSearchButton();
        await searchInput.searchFor(random);
        await searchResultsPage.waitForResults();

        await testUtil.checkMultipleSelContextMenu([testData.folder.name, testData.folderFav.name], testData.multipleSel.searchContextMenu);
        await testUtil.checkMultipleSelToolbarActions(
          [testData.folder.name, testData.folderFav.name],
          testData.multipleSel.searchToolbarPrimary,
          testData.multipleSel.searchToolbarMore
        );
      });

      it('[C291822] both files and folders', async () => {
        await searchInput.clickSearchButton();
        await searchInput.searchFor(`${testData.file.name} or ${testData.folderFav.name}`);
        await searchResultsPage.waitForResults();

        await testUtil.checkMultipleSelContextMenu([testData.file.name, testData.folderFav.name], testData.multipleSel.searchContextMenu);
        await testUtil.checkMultipleSelToolbarActions(
          [testData.file.name, testData.folderFav.name],
          testData.multipleSel.searchToolbarPrimary,
          testData.multipleSel.searchToolbarMore
        );
      });
    });
  });
});
