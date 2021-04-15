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

import { RepoClient, Utils, AdminActions, UserActions, LoginPage, FILES, BrowsingPage, SearchResultsPage } from '@alfresco/aca-testing-shared';
import * as testData from './test-data';
import * as testUtil from '../test-util';

describe('Office Files - available actions : ', () => {
  const random = testData.random;

  const username = `user-${Utils.random()}`;
  const parentName = `parent-${Utils.random()}`;

  let parentId: string;
  let fileDocxFavId: string;
  let fileDocxSharedId: string;
  let fileDocxSharedFavId: string;

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

    await userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, testData.fileDocx.name);
    fileDocxFavId = (await userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, testData.fileDocxFav.name)).entry.id;
    fileDocxSharedId = (await userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, testData.fileDocxShared.name)).entry.id;
    fileDocxSharedFavId = (await userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, testData.fileDocxSharedFav.name)).entry.id;

    const initialFavoritesTotalItems = (await userApi.favorites.getFavoritesTotalItems()) || 0;
    await userApi.favorites.addFavoritesByIds('file', [fileDocxFavId, fileDocxSharedFavId]);
    await userApi.favorites.waitForApi({ expect: initialFavoritesTotalItems + 2 });

    await userApi.shared.shareFilesByIds([fileDocxSharedId, fileDocxSharedFavId]);
    await userApi.shared.waitForFilesToBeShared([fileDocxSharedId, fileDocxSharedFavId]);

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
    beforeEach(async () => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parentName);
      await dataTable.waitForHeader();
    });

    describe('on a file', () => {
      it('File Office - [C213122]', async () => {
        await testUtil.checkToolbarActions(testData.fileDocx.name, testData.fileDocx.toolbarPrimary, testData.fileDocx.toolbarMore);
        await testUtil.checkContextMenu(testData.fileDocx.name, testData.fileDocx.contextMenu);
      });

      it('File Office, favorite - [C297612]', async () => {
        await testUtil.checkToolbarActions(testData.fileDocxFav.name, testData.fileDocxFav.toolbarPrimary, testData.fileDocxFav.toolbarMore);
        await testUtil.checkContextMenu(testData.fileDocxFav.name, testData.fileDocxFav.contextMenu);
      });

      it('File Office, shared - [C280448]', async () => {
        await testUtil.checkToolbarActions(testData.fileDocxShared.name, testData.fileDocxShared.toolbarPrimary, testData.fileDocxShared.toolbarMore);
        await testUtil.checkContextMenu(testData.fileDocxShared.name, testData.fileDocxShared.contextMenu);
      });

      it('File Office, shared, favorite - [C297616]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.toolbarPrimary,
          testData.fileDocxSharedFav.toolbarMore
        );
        await testUtil.checkContextMenu(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.contextMenu);
      });
    });

    describe('Viewer - file opened from Personal Files : ', () => {
      it('File Office - [C282025]', async () => {
        await testUtil.checkViewerActions(testData.fileDocx.name, testData.fileDocx.viewerToolbarPrimary, testData.fileDocx.viewerToolbarMore);
      });

      it('File Office, favorite - [C297583]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxFav.name,
          testData.fileDocxFav.viewerToolbarPrimary,
          testData.fileDocxFav.viewerToolbarMore
        );
      });

      it('File Office, shared - [C297597]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxShared.name,
          testData.fileDocxShared.viewerToolbarPrimary,
          testData.fileDocxShared.viewerToolbarMore
        );
      });

      it('File Office, shared, favorite - [C297598]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });
    });
  });

  describe('on Favorites : ', () => {
    beforeEach(async () => {
      await page.clickFavoritesAndWait();
    });

    describe('single selection : ', () => {
      it('File Office, favorite - [C297618]', async () => {
        await testUtil.checkToolbarActions(testData.fileDocxFav.name, testData.fileDocxFav.toolbarPrimary, testData.fileDocxFav.favoritesToolbarMore);
        await testUtil.checkContextMenu(testData.fileDocxFav.name, testData.fileDocxFav.favoritesContextMenu);
      });

      it('File Office, shared, favorite - [C297620]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.favoritesToolbarPrimary,
          testData.fileDocxSharedFav.favoritesToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.favoritesContextMenu);
      });
    });

    describe('Viewer - file opened from Favorites : ', () => {
      it('File Office, favorite - [C326702]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxFav.name,
          testData.fileDocxFav.viewerToolbarPrimary,
          testData.fileDocxFav.viewerToolbarMore
        );
      });

      it('File Office, shared, favorite - [C326704]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });
    });
  });

  describe('on Recent Files : ', () => {
    beforeEach(async () => {
      await page.clickRecentFilesAndWait();
    });

    describe('on single selection', () => {
      it('File Office - [C297625]', async () => {
        await testUtil.checkToolbarActions(testData.fileDocx.name, testData.fileDocx.toolbarPrimary, testData.fileDocx.toolbarMore);
        await testUtil.checkContextMenu(testData.fileDocx.name, testData.fileDocx.contextMenu);
      });

      it('File Office, favorite - [C280470]', async () => {
        await testUtil.checkToolbarActions(testData.fileDocxFav.name, testData.fileDocxFav.toolbarPrimary, testData.fileDocxFav.toolbarMore);
        await testUtil.checkContextMenu(testData.fileDocxFav.name, testData.fileDocxFav.contextMenu);
      });

      it('File Office, shared - [C297633]', async () => {
        await testUtil.checkToolbarActions(testData.fileDocxShared.name, testData.fileDocxShared.toolbarPrimary, testData.fileDocxShared.toolbarMore);
        await testUtil.checkContextMenu(testData.fileDocxShared.name, testData.fileDocxShared.contextMenu);
      });

      it('File Office, shared, favorite - [C280616]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.toolbarPrimary,
          testData.fileDocxSharedFav.toolbarMore
        );
        await testUtil.checkContextMenu(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.contextMenu);
      });
    });

    describe('Viewer - file opened from Recent Files : ', () => {
      it('File Office - [C297599]', async () => {
        await testUtil.checkViewerActions(testData.fileDocx.name, testData.fileDocx.viewerToolbarPrimary, testData.fileDocx.viewerToolbarMore);
      });

      it('File Office, favorite - [C297600]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxFav.name,
          testData.fileDocxFav.viewerToolbarPrimary,
          testData.fileDocxFav.viewerToolbarMore
        );
      });

      it('File Office, shared - [C326694]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxShared.name,
          testData.fileDocxShared.viewerToolbarPrimary,
          testData.fileDocxShared.viewerToolbarMore
        );
      });

      it('File Office, shared, favorite - [C326695]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });
    });
  });

  describe('on Search Results : ', () => {
    beforeEach(async () => {
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.searchFor(random);
      await searchResultsPage.waitForResults();
    });

    describe('on a file', () => {
      it('[C297637] File Office', async () => {
        await testUtil.checkToolbarActions(testData.fileDocx.name, testData.fileDocx.searchToolbarPrimary, testData.fileDocx.searchToolbarMore);
        await testUtil.checkContextMenu(testData.fileDocx.name, testData.fileDocx.searchContextMenu);
      });

      it('[C291827] File Office, favorite', async () => {
        await testUtil.checkToolbarActions(
          testData.fileDocxFav.name,
          testData.fileDocxFav.searchToolbarPrimary,
          testData.fileDocxFav.searchToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileDocxFav.name, testData.fileDocxFav.searchContextMenu);
      });

      it('[C297627] File Office, shared', async () => {
        await testUtil.checkToolbarActions(
          testData.fileDocxShared.name,
          testData.fileDocxShared.searchToolbarPrimary,
          testData.fileDocxShared.searchToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileDocxShared.name, testData.fileDocxShared.searchContextMenu);
      });

      it('[C280631] File Office, shared, favorite', async () => {
        await testUtil.checkToolbarActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.searchToolbarPrimary,
          testData.fileDocxSharedFav.searchToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.searchContextMenu);
      });
    });

    describe('Viewer - file opened from Search Results : ', () => {
      it('File Office - [C326714]', async () => {
        await testUtil.checkViewerActions(testData.fileDocx.name, testData.fileDocx.viewerToolbarPrimary, testData.fileDocx.searchViewerToolbarMore);
      });

      it('File Office, favorite - [C326715]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxFav.name,
          testData.fileDocxFav.viewerToolbarPrimary,
          testData.fileDocxFav.searchViewerToolbarMore
        );
      });

      it('File Office, shared - [C326718]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxShared.name,
          testData.fileDocxShared.viewerToolbarPrimary,
          testData.fileDocxShared.searchViewerToolbarMore
        );
      });

      it('File Office, shared, favorite - [C326719]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.searchViewerToolbarMore
        );
      });
    });
  });

  describe('on Shared Files : ', () => {
    beforeEach(async () => {
      await page.clickSharedFilesAndWait();
    });

    describe('single selection', () => {
      it('File Office, shared - [C297629]', async () => {
        await testUtil.checkToolbarActions(testData.fileDocxShared.name, testData.fileDocxShared.toolbarPrimary, testData.fileDocxShared.toolbarMore);
        await testUtil.checkContextMenu(testData.fileDocxShared.name, testData.fileDocxShared.contextMenu);
      });

      it('File Office, shared, favorite - [C280652]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.toolbarPrimary,
          testData.fileDocxSharedFav.toolbarMore
        );
        await testUtil.checkContextMenu(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.contextMenu);
      });
    });

    describe('Viewer - file opened from Shared Files', () => {
      it('File Office, shared - [C326708]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxShared.name,
          testData.fileDocxShared.viewerToolbarPrimary,
          testData.fileDocxShared.viewerToolbarMore
        );
      });

      it('File Office, shared, favorite - [C326709]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });
    });
  });
});
