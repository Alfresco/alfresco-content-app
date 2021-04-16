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

import { RepoClient, Utils, AdminActions, UserActions, LoginPage, BrowsingPage, SearchResultsPage } from '@alfresco/aca-testing-shared';
import * as testData from './test-data';
import * as testUtil from '../test-util';
import { Logger } from '@alfresco/adf-testing';

describe('Files - available actions : ', () => {
  const random = Utils.random();

  const username = `user-${random}`;
  const parentName = `parent-${random}`;

  let parentId: string;
  let fileFavId: string;
  let fileSharedId: string;
  let fileSharedFavId: string;

  const userApi = new RepoClient(username, username);
  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const { searchInput } = page.header;
  const searchResultsPage = new SearchResultsPage();

  beforeAll(async (done) => {
    try {
      await adminApiActions.createUser({ username });

      parentId = (await userApi.nodes.createFolder(parentName)).entry.id;

      await userApi.nodes.createFile(testData.file.name, parentId);
      fileFavId = (await userApi.nodes.createFile(testData.fileFav.name, parentId)).entry.id;
      fileSharedId = (await userApi.nodes.createFile(testData.fileShared.name, parentId)).entry.id;
      fileSharedFavId = (await userApi.nodes.createFile(testData.fileSharedFav.name, parentId)).entry.id;

      const initialFavoritesTotalItems = (await userApi.favorites.getFavoritesTotalItems()) || 0;
      await userApi.favorites.addFavoritesByIds('file', [fileFavId, fileSharedFavId]);
      await userApi.favorites.waitForApi({ expect: initialFavoritesTotalItems + 2 });

      await userApi.shared.shareFilesByIds([fileSharedId, fileSharedFavId]);
      await userApi.shared.waitForFilesToBeShared([fileSharedId, fileSharedFavId]);

      await loginPage.loginWith(username);
    } catch (error) {
      Logger.error(`----- beforeEach failed : ${error}`);
    }
    done();
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

    it('File simple - [C286265]', async () => {
      await testUtil.checkToolbarActions(testData.file.name, testData.file.toolbarPrimary, testData.file.toolbarMore);
      await testUtil.checkContextMenu(testData.file.name, testData.file.contextMenu);
    });

    it('File favorite - [C297615]', async () => {
      await testUtil.checkToolbarActions(testData.fileFav.name, testData.fileFav.toolbarPrimary, testData.fileFav.toolbarMore);
      await testUtil.checkContextMenu(testData.fileFav.name, testData.fileFav.contextMenu);
    });

    it('File shared - [C286323]', async () => {
      await testUtil.checkToolbarActions(testData.fileShared.name, testData.fileShared.toolbarPrimary, testData.fileShared.toolbarMore);
      await testUtil.checkContextMenu(testData.fileShared.name, testData.fileShared.contextMenu);
    });

    it('File shared, favorite - [C280450]', async () => {
      await testUtil.checkToolbarActions(testData.fileSharedFav.name, testData.fileSharedFav.toolbarPrimary, testData.fileSharedFav.toolbarMore);
      await testUtil.checkContextMenu(testData.fileSharedFav.name, testData.fileSharedFav.contextMenu);
    });

    describe('Viewer - file opened from Personal Files : ', () => {
      beforeAll(async () => {
        await page.clickPersonalFilesAndWait();
        await dataTable.doubleClickOnRowByName(parentName);
        await dataTable.waitForHeader();
      });

      it('File simple - [C297587]', async () => {
        await testUtil.checkViewerActions(testData.file.name, testData.file.viewerToolbarPrimary, testData.file.viewerToolbarMore);
      });

      it('File favorite - [C297588]', async () => {
        await testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.viewerToolbarMore);
      });

      it('File shared - [C291831]', async () => {
        await testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.viewerToolbarMore);
      });

      it('File shared, favorite - [C297632]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });
    });
  });

  describe('on Favorites : ', () => {
    beforeAll(async () => {
      await page.clickFavoritesAndWait();
    });

    it('File favorite - [C280461]', async () => {
      await testUtil.checkToolbarActions(testData.fileFav.name, testData.fileFav.toolbarPrimary, testData.fileFav.favoritesToolbarMore);
      await testUtil.checkContextMenu(testData.fileFav.name, testData.fileFav.favoritesContextMenu);
    });

    it('File shared, favorite - [C280462]', async () => {
      await testUtil.checkToolbarActions(
        testData.fileSharedFav.name,
        testData.fileSharedFav.favoritesToolbarPrimary,
        testData.fileSharedFav.favoritesToolbarMore
      );
      await testUtil.checkContextMenu(testData.fileSharedFav.name, testData.fileSharedFav.favoritesContextMenu);
    });

    describe('Viewer - file opened from Favorites : ', () => {
      beforeAll(async () => {
        await page.clickFavoritesAndWait();
      });

      it('File favorite - [C326703]', async () => {
        await testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.viewerToolbarMore);
      });

      it('File shared, favorite - [C326705]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });
    });
  });

  describe('on Recent Files : ', () => {
    beforeAll(async () => {
      await page.clickRecentFilesAndWait();
    });

    it('File simple - [C280471]', async () => {
      await testUtil.checkToolbarActions(testData.file.name, testData.file.toolbarPrimary, testData.file.toolbarMore);
      await testUtil.checkContextMenu(testData.file.name, testData.file.contextMenu);
    });

    it('File favorite - [C280615]', async () => {
      await testUtil.checkToolbarActions(testData.fileFav.name, testData.fileFav.toolbarPrimary, testData.fileFav.toolbarMore);
      await testUtil.checkContextMenu(testData.fileFav.name, testData.fileFav.contextMenu);
    });

    it('File shared - [C280601]', async () => {
      await testUtil.checkToolbarActions(testData.fileShared.name, testData.fileShared.toolbarPrimary, testData.fileShared.toolbarMore);
      await testUtil.checkContextMenu(testData.fileShared.name, testData.fileShared.contextMenu);
    });

    it('File shared, favorite - [C297635]', async () => {
      await testUtil.checkToolbarActions(testData.fileSharedFav.name, testData.fileSharedFav.toolbarPrimary, testData.fileSharedFav.toolbarMore);
      await testUtil.checkContextMenu(testData.fileSharedFav.name, testData.fileSharedFav.contextMenu);
    });

    describe('Viewer - file opened from Recent Files : ', () => {
      beforeAll(async () => {
        await page.clickRecentFilesAndWait();
      });

      it('File simple - [C326692]', async () => {
        await testUtil.checkViewerActions(testData.file.name, testData.file.viewerToolbarPrimary, testData.file.viewerToolbarMore);
      });

      it('File favorite - [C326693]', async () => {
        await testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.viewerToolbarMore);
      });

      it('File shared - [C326696]', async () => {
        await testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.viewerToolbarMore);
      });

      it('File shared, favorite - [C326697]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });
    });
  });

  describe('on Search Results : ', () => {
    beforeEach(async () => {
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
    });

    it('[C297638] File simple', async () => {
      await searchInput.searchFor(testData.file.name);
      await searchResultsPage.waitForResults();

      await testUtil.checkToolbarActions(testData.file.name, testData.file.searchToolbarPrimary, testData.file.searchToolbarMore);
      await testUtil.checkContextMenu(testData.file.name, testData.file.searchContextMenu);
    });

    it('[C280661] File favorite', async () => {
      await searchInput.searchFor(testData.fileFav.name);
      await searchResultsPage.waitForResults();

      await testUtil.checkToolbarActions(testData.fileFav.name, testData.fileFav.searchToolbarPrimary, testData.fileFav.searchToolbarMore);
      await testUtil.checkContextMenu(testData.fileFav.name, testData.fileFav.searchContextMenu);
    });

    it('[C280632] File shared', async () => {
      await searchInput.searchFor(testData.fileShared.name);
      await searchResultsPage.waitForResults();

      await testUtil.checkToolbarActions(testData.fileShared.name, testData.fileShared.searchToolbarPrimary, testData.fileShared.searchToolbarMore);
      await testUtil.checkContextMenu(testData.fileShared.name, testData.fileShared.searchContextMenu);
    });

    it('[C280641] File shared, favorite', async () => {
      await searchInput.searchFor(testData.fileSharedFav.name);
      await searchResultsPage.waitForResults();

      await testUtil.checkToolbarActions(
        testData.fileSharedFav.name,
        testData.fileSharedFav.searchToolbarPrimary,
        testData.fileSharedFav.searchToolbarMore
      );
      await testUtil.checkContextMenu(testData.fileSharedFav.name, testData.fileSharedFav.searchContextMenu);
    });

    describe('Viewer - file opened from Search Results : ', () => {
      it('File simple - [C326716]', async () => {
        await searchInput.searchFor(testData.file.name);
        await searchResultsPage.waitForResults();
        await testUtil.checkViewerActions(testData.file.name, testData.file.viewerToolbarPrimary, testData.file.searchViewerToolbarMore);
      });

      it('File favorite - [C326717]', async () => {
        await searchInput.searchFor(testData.fileFav.name);
        await searchResultsPage.waitForResults();
        await testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.searchViewerToolbarMore);
      });

      it('File shared - [C326720]', async () => {
        await searchInput.searchFor(testData.fileShared.name);
        await searchResultsPage.waitForResults();

        await testUtil.checkViewerActions(
          testData.fileShared.name,
          testData.fileShared.viewerToolbarPrimary,
          testData.fileShared.searchViewerToolbarMore
        );
      });

      it('File shared, favorite - [C326721]', async () => {
        await searchInput.searchFor(testData.fileSharedFav.name);
        await searchResultsPage.waitForResults();

        await testUtil.checkViewerActions(
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.searchViewerToolbarMore
        );
      });
    });
  });

  describe('on Shared Files : ', () => {
    beforeAll(async () => {
      await page.clickSharedFilesAndWait();
    });

    describe('single selection', () => {
      it('File shared - [C297630]', async () => {
        await testUtil.checkToolbarActions(testData.fileShared.name, testData.fileShared.toolbarPrimary, testData.fileShared.toolbarMore);
        await testUtil.checkContextMenu(testData.fileShared.name, testData.fileShared.contextMenu);
      });

      it('File shared, favorite - [C286273]', async () => {
        await testUtil.checkToolbarActions(testData.fileSharedFav.name, testData.fileSharedFav.toolbarPrimary, testData.fileSharedFav.toolbarMore);
        await testUtil.checkContextMenu(testData.fileSharedFav.name, testData.fileSharedFav.contextMenu);
      });
    });

    describe('Viewer - file opened from Shared Files : ', () => {
      beforeAll(async () => {
        await page.clickSharedFilesAndWait();
      });

      it('File shared - [C326710]', async () => {
        await testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.viewerToolbarMore);
      });

      it('File shared, favorite - [C326711]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });
    });
  });
});
