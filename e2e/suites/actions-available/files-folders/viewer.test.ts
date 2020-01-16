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

import { LoginPage, BrowsingPage, SearchResultsPage } from '../../../pages/pages';
import { FILES } from '../../../configs';
import { RepoClient } from '../../../utilities/repo-client/repo-client';
import { Utils } from '../../../utilities/utils';
import { AdminActions } from '../../../utilities/admin-actions';
import * as data from './test-data-files-folders';
import * as testUtil from '../test-util';

describe('File/folder actions : in the viewer : ', () => {

  const random = Utils.random();

  const username = `user-${random}`;

  const parent = `parent-${random}`;
  let parentId: string;

  let fileDocxFavId: string;
  let fileFavId: string;
  let fileDocxSharedId: string;
  let fileDocxSharedFavId: string;
  let fileSharedId: string;
  let fileSharedFavId: string;
  let fileLockedId: string;
  let fileFavLockedId: string;
  let fileSharedLockedId: string;
  let fileSharedFavLockedId: string;

  const userApi = new RepoClient(username, username);

  const adminApiActions = new AdminActions();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const searchResultsPage = new SearchResultsPage();
  const { dataTable } = page;
  const { searchInput } = page.header;

  beforeAll(async () => {
    await adminApiActions.createUser({ username });

    parentId = (await userApi.nodes.createFolder(parent)).entry.id;

    await userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, data.fileDocx.name );
    fileDocxFavId = (await userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, data.fileDocxFav.name)).entry.id;
    await userApi.nodes.createFile(data.file.name, parentId);
    fileFavId = (await userApi.nodes.createFile(data.fileFav.name, parentId)).entry.id;
    fileDocxSharedId = (await userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, data.fileDocxShared.name)).entry.id;
    fileDocxSharedFavId = (await userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, data.fileDocxSharedFav.name)).entry.id;
    fileSharedId = (await userApi.nodes.createFile(data.fileShared.name, parentId)).entry.id;
    fileSharedFavId = (await userApi.nodes.createFile(data.fileSharedFav.name, parentId)).entry.id;
    fileLockedId = (await userApi.nodes.createFile(data.fileLocked.name, parentId)).entry.id;
    fileFavLockedId = (await userApi.nodes.createFile(data.fileFavLocked.name, parentId)).entry.id;
    fileSharedLockedId = (await userApi.nodes.createFile(data.fileSharedLocked.name, parentId)).entry.id;
    fileSharedFavLockedId = (await userApi.nodes.createFile(data.fileSharedFavLocked.name, parentId)).entry.id;

    await userApi.favorites.addFavoritesByIds('file', [
      fileDocxFavId,
      fileFavId,
      fileDocxSharedFavId,
      fileSharedFavId,
      fileFavLockedId,
      fileSharedFavLockedId
    ]);

    await userApi.shared.shareFilesByIds([
      fileDocxSharedId,
      fileDocxSharedFavId,
      fileSharedId,
      fileSharedFavId,
      fileSharedLockedId,
      fileSharedFavLockedId
    ]);

    await userApi.nodes.lockFile(fileLockedId);
    await userApi.nodes.lockFile(fileFavLockedId);
    await userApi.nodes.lockFile(fileSharedLockedId);
    await userApi.nodes.lockFile(fileSharedFavLockedId);

    await Promise.all([
      userApi.favorites.waitForApi({ expect: 6 }),
      userApi.shared.waitForApi({ expect: 6 })
    ]);

    await loginPage.loginWith(username);
  });

  afterAll(async () => {
    await userApi.nodes.deleteNodeById(parentId);
  });

  beforeEach(async () => {
    await Utils.pressEscape();
  });

  afterEach(async () => {
    await page.closeOpenDialogs();
  });

  describe('file opened from Personal Files', () => {

    beforeAll(async () => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      await dataTable.waitForHeader();
    });

    it('File Office - []', async () => {
      await testUtil.checkViewerActions(data.fileDocx.name, data.fileDocx.viewerToolbarPrimary, data.fileDocx.viewerToolbarMore);
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarPrimary, data.fileDocxFav.viewerToolbarMore);
    });

    it('File simple - []', async () => {
      await testUtil.checkViewerActions(data.file.name, data.file.viewerToolbarPrimary, data.file.viewerToolbarMore);
    });

    it('File favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileFav.name, data.fileFav.viewerToolbarPrimary, data.fileFav.viewerToolbarMore);
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarPrimary, data.fileDocxShared.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared - []', async () => {
      await testUtil.checkViewerActions(data.fileShared.name, data.fileShared.viewerToolbarPrimary, data.fileShared.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary, data.fileSharedFav.viewerToolbarMore);
    });

    it('File locked - []', async () => {
      await testUtil.checkViewerActions(data.fileLocked.name, data.fileLocked.viewerToolbarPrimary, data.fileLocked.viewerToolbarMore);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarPrimary, data.fileFavLocked.viewerToolbarMore);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarPrimary, data.fileSharedLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });

  describe('file opened from Recent Files', () => {

    beforeAll(async () => {
      await page.clickRecentFilesAndWait();
    });

    it('File Office - []', async () => {
      await testUtil.checkViewerActions(data.fileDocx.name, data.fileDocx.viewerToolbarPrimary, data.fileDocx.viewerToolbarMore);
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarPrimary, data.fileDocxFav.viewerToolbarMore);
    });

    it('File simple - []', async () => {
      await testUtil.checkViewerActions(data.file.name, data.file.viewerToolbarPrimary, data.file.viewerToolbarMore);
    });

    it('File favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileFav.name, data.fileFav.viewerToolbarPrimary, data.fileFav.viewerToolbarMore);
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarPrimary, data.fileDocxShared.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared - []', async () => {
      await testUtil.checkViewerActions(data.fileShared.name, data.fileShared.viewerToolbarPrimary, data.fileShared.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary, data.fileSharedFav.viewerToolbarMore);
    });

    it('File locked - []', async () => {
      await testUtil.checkViewerActions(data.fileLocked.name, data.fileLocked.viewerToolbarPrimary, data.fileLocked.viewerToolbarMore);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarPrimary, data.fileFavLocked.viewerToolbarMore);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarPrimary, data.fileSharedLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });

  describe('file opened from Favorites', () => {

    beforeAll(async () => {
      await page.clickFavoritesAndWait();
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarPrimary, data.fileDocxFav.viewerToolbarMore);
    });

    it('File favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileFav.name, data.fileFav.viewerToolbarPrimary, data.fileFav.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary, data.fileSharedFav.viewerToolbarMore);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarPrimary, data.fileFavLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });

  describe('file opened from Shared Files', () => {

    beforeAll(async () => {
      await page.clickSharedFilesAndWait();
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarPrimary, data.fileDocxShared.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared - []', async () => {
      await testUtil.checkViewerActions(data.fileShared.name, data.fileShared.viewerToolbarPrimary, data.fileShared.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary, data.fileSharedFav.viewerToolbarMore);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarPrimary, data.fileSharedLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });

  describe('file opened from Search Results', () => {

    beforeAll(async () => {
      await searchInput.clickSearchButton();
      await searchInput.searchFor('file-');
      await searchResultsPage.waitForResults();
    });

    it('File Office - []', async () => {
      await testUtil.checkViewerActions(data.fileDocx.name, data.fileDocx.viewerToolbarPrimary, data.fileDocx.searchViewerToolbarMore);
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarPrimary, data.fileDocxFav.searchViewerToolbarMore);
    });

    it('File simple - []', async () => {
      await testUtil.checkViewerActions(data.file.name, data.file.viewerToolbarPrimary, data.file.searchViewerToolbarMore);
    });

    it('File favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileFav.name, data.fileFav.viewerToolbarPrimary, data.fileFav.searchViewerToolbarMore);
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarPrimary, data.fileDocxShared.searchViewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary, data.fileDocxSharedFav.searchViewerToolbarMore);
    });

    it('File shared - []', async () => {
      await testUtil.checkViewerActions(data.fileShared.name, data.fileShared.viewerToolbarPrimary, data.fileShared.searchViewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary, data.fileSharedFav.searchViewerToolbarMore);
    });

    it('File locked - []', async () => {
      await testUtil.checkViewerActions(data.fileLocked.name, data.fileLocked.viewerToolbarPrimary, data.fileLocked.searchViewerToolbarMore);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarPrimary, data.fileFavLocked.searchViewerToolbarMore);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarPrimary, data.fileSharedLocked.searchViewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary, data.fileSharedFavLocked.searchViewerToolbarMore);
    });
  });

});
