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

describe('Locked Files - available actions : ', () => {
  const random = testData.random;

  const username = `user-${Utils.random()}`;
  const parentName = `parent-${Utils.random()}`;

  let parentId: string;
  let fileLockedId: string;
  let fileFavLockedId: string;
  let fileSharedLockedId: string;
  let fileSharedFavLockedId: string;

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

    fileLockedId = (await userApi.nodes.createFile(testData.fileLocked.name, parentId)).entry.id;
    fileFavLockedId = (await userApi.nodes.createFile(testData.fileFavLocked.name, parentId)).entry.id;
    fileSharedLockedId = (await userApi.nodes.createFile(testData.fileSharedLocked.name, parentId)).entry.id;
    fileSharedFavLockedId = (await userApi.nodes.createFile(testData.fileSharedFavLocked.name, parentId)).entry.id;

    const initialFavoritesTotalItems = (await userApi.favorites.getFavoritesTotalItems()) || 0;
    await userApi.favorites.addFavoritesByIds('file', [fileFavLockedId, fileSharedFavLockedId]);
    await userApi.favorites.waitForApi({ expect: initialFavoritesTotalItems + 2 });

    await userApi.shared.shareFilesByIds([fileSharedLockedId, fileSharedFavLockedId]);

    await userApi.nodes.lockFile(fileLockedId);
    await userApi.nodes.lockFile(fileFavLockedId);
    await userApi.nodes.lockFile(fileSharedLockedId);
    await userApi.nodes.lockFile(fileSharedFavLockedId);

    await userApi.shared.waitForFilesToBeShared([fileSharedLockedId, fileSharedFavLockedId]);
    await userApi.search.waitForApi(username, { expect: 4 });

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

    describe('single selection : ', () => {
      it('File locked - [C297617]', async () => {
        await testUtil.checkToolbarActions(testData.fileLocked.name, testData.fileLocked.toolbarPrimary, testData.fileLocked.toolbarMore);
        await testUtil.checkContextMenu(testData.fileLocked.name, testData.fileLocked.contextMenu);
      });

      it('File favorite, locked - [C291816]', async () => {
        await testUtil.checkToolbarActions(testData.fileFavLocked.name, testData.fileFavLocked.toolbarPrimary, testData.fileFavLocked.toolbarMore);
        await testUtil.checkContextMenu(testData.fileFavLocked.name, testData.fileFavLocked.contextMenu);
      });

      it('File shared, locked - [C280453]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.toolbarPrimary,
          testData.fileSharedLocked.toolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedLocked.name, testData.fileSharedLocked.contextMenu);
      });

      it('File shared, favorite, locked - [C280454]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.toolbarPrimary,
          testData.fileSharedFavLocked.toolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.contextMenu);
      });
    });

    describe('Viewer - file opened from Personal Files : ', () => {
      it('File locked - [C291832]', async () => {
        await testUtil.checkViewerActions(testData.fileLocked.name, testData.fileLocked.viewerToolbarPrimary, testData.fileLocked.viewerToolbarMore);
      });

      it('File favorite, locked - [C297593]', async () => {
        await testUtil.checkViewerActions(
          testData.fileFavLocked.name,
          testData.fileFavLocked.viewerToolbarPrimary,
          testData.fileFavLocked.viewerToolbarMore
        );
      });

      it('File shared, locked - [C291833]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.viewerToolbarPrimary,
          testData.fileSharedLocked.viewerToolbarMore
        );
      });

      it('File shared, favorite, locked - [C297592]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.viewerToolbarPrimary,
          testData.fileSharedFavLocked.viewerToolbarMore
        );
      });
    });
  });

  describe('on Favorites : ', () => {
    beforeEach(async () => {
      await page.clickFavoritesAndWait();
    });

    describe('single selection : ', () => {
      it('File favorite, locked - [C280463]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileFavLocked.name,
          testData.fileFavLocked.toolbarPrimary,
          testData.fileFavLocked.favoritesToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileFavLocked.name, testData.fileFavLocked.favoritesContextMenu);
      });

      it('File shared, favorite, locked - [C280469]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.favoritesToolbarPrimary,
          testData.fileSharedFavLocked.favoritesToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.favoritesContextMenu);
      });
    });

    describe('Viewer - file opened from Favorites : ', () => {
      it('File favorite, locked - [C326707]', async () => {
        await testUtil.checkViewerActions(
          testData.fileFavLocked.name,
          testData.fileFavLocked.viewerToolbarPrimary,
          testData.fileFavLocked.viewerToolbarMore
        );
      });

      it('File shared, favorite, locked - [C326706]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.viewerToolbarPrimary,
          testData.fileSharedFavLocked.viewerToolbarMore
        );
      });
    });
  });

  describe('on Recent Files : ', () => {
    beforeEach(async () => {
      await page.clickRecentFilesAndWait();
    });

    describe('single selection : ', () => {
      it('File locked - [C280622]', async () => {
        await testUtil.checkToolbarActions(testData.fileLocked.name, testData.fileLocked.toolbarPrimary, testData.fileLocked.toolbarMore);
        await testUtil.checkContextMenu(testData.fileLocked.name, testData.fileLocked.contextMenu);
      });

      it('File favorite, locked - [C280608]', async () => {
        await testUtil.checkToolbarActions(testData.fileFavLocked.name, testData.fileFavLocked.toolbarPrimary, testData.fileFavLocked.toolbarMore);
        await testUtil.checkContextMenu(testData.fileFavLocked.name, testData.fileFavLocked.contextMenu);
      });

      it('File shared, locked - [C297636]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.toolbarPrimary,
          testData.fileSharedLocked.toolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedLocked.name, testData.fileSharedLocked.contextMenu);
      });

      it('File shared, favorite, locked - [C286324]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.toolbarPrimary,
          testData.fileSharedFavLocked.toolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.contextMenu);
      });
    });

    describe('Viewer - file opened from Recent Files : ', () => {
      it('File locked - [C326698]', async () => {
        await testUtil.checkViewerActions(testData.fileLocked.name, testData.fileLocked.viewerToolbarPrimary, testData.fileLocked.viewerToolbarMore);
      });

      it('File favorite, locked - [C326701]', async () => {
        await testUtil.checkViewerActions(
          testData.fileFavLocked.name,
          testData.fileFavLocked.viewerToolbarPrimary,
          testData.fileFavLocked.viewerToolbarMore
        );
      });

      it('File shared, locked - [C326699]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.viewerToolbarPrimary,
          testData.fileSharedLocked.viewerToolbarMore
        );
      });

      it('File shared, favorite, locked - [C326700]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.viewerToolbarPrimary,
          testData.fileSharedFavLocked.viewerToolbarMore
        );
      });
    });
  });

  describe('on Search Results : ', () => {
    beforeEach(async () => {
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchFor(random);
      await searchResultsPage.waitForResults();
    });

    describe('single selection : ', () => {
      it('[C297628] File locked', async () => {
        await testUtil.checkToolbarActions(testData.fileLocked.name, testData.fileLocked.searchToolbarPrimary, testData.fileLocked.searchToolbarMore);
        await testUtil.checkContextMenu(testData.fileLocked.name, testData.fileLocked.searchContextMenu);
      });

      it('[C280648] File favorite, locked', async () => {
        await testUtil.checkToolbarActions(
          testData.fileFavLocked.name,
          testData.fileFavLocked.searchToolbarPrimary,
          testData.fileFavLocked.searchToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileFavLocked.name, testData.fileFavLocked.searchContextMenu);
      });

      it('[C280574] File shared, locked', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.searchToolbarPrimary,
          testData.fileSharedLocked.searchToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedLocked.name, testData.fileSharedLocked.searchContextMenu);
      });

      it('[C280642] File shared, favorite, locked', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.searchToolbarPrimary,
          testData.fileSharedFavLocked.searchToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.searchContextMenu);
      });
    });

    describe('Viewer - file opened from Search Results : ', () => {
      it('File locked - [C326722]', async () => {
        await testUtil.checkViewerActions(
          testData.fileLocked.name,
          testData.fileLocked.viewerToolbarPrimary,
          testData.fileLocked.searchViewerToolbarMore
        );
      });

      it('File favorite, locked - [C326725]', async () => {
        await testUtil.checkViewerActions(
          testData.fileFavLocked.name,
          testData.fileFavLocked.viewerToolbarPrimary,
          testData.fileFavLocked.searchViewerToolbarMore
        );
      });

      it('File shared, locked - [C326723]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.viewerToolbarPrimary,
          testData.fileSharedLocked.searchViewerToolbarMore
        );
      });

      it('File shared, favorite, locked - [C326724]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.viewerToolbarPrimary,
          testData.fileSharedFavLocked.searchViewerToolbarMore
        );
      });
    });
  });

  describe('on Shared Files : ', () => {
    beforeEach(async () => {
      await page.clickSharedFilesAndWait();
    });

    describe('single selection : ', () => {
      it('File shared, locked - [C286274]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.toolbarPrimary,
          testData.fileSharedLocked.toolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedLocked.name, testData.fileSharedLocked.contextMenu);
      });

      it('File shared, favorite, locked - [C286275]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.toolbarPrimary,
          testData.fileSharedFavLocked.toolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.contextMenu);
      });
    });

    describe('Viewer - file opened from Shared Files : ', () => {
      it('File shared, locked - [C326712]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.viewerToolbarPrimary,
          testData.fileSharedLocked.viewerToolbarMore
        );
      });

      it('File shared, favorite, locked - [C326713]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.viewerToolbarPrimary,
          testData.fileSharedFavLocked.viewerToolbarMore
        );
      });
    });
  });
});
