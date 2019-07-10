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

import { LoginPage, BrowsingPage } from '../../../pages/pages';
import { FILES } from '../../../configs';
import { RepoClient } from '../../../utilities/repo-client/repo-client';
import { Utils } from '../../../utilities/utils';
import * as data from './test-data-files-folders';
import * as testUtil from '../test-util';

describe('File/folder actions : in the viewer : ', () => {

  const random = Utils.random();

  const username = `user-${random}`;

  const parent = `parent-${random}`; let parentId;

  let fileDocxFavId, fileFavId, fileDocxSharedId, fileDocxSharedFavId, fileSharedId, fileSharedFavId, fileLockedId, fileFavLockedId, fileSharedLockedId, fileSharedFavLockedId;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const { searchInput } = page.header;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;

    await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentId, data.fileDocx.name );
    fileDocxFavId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentId, data.fileDocxFav.name)).entry.id;
    await apis.user.nodes.createFile(data.file.name, parentId);
    fileFavId = (await apis.user.nodes.createFile(data.fileFav.name, parentId)).entry.id;
    fileDocxSharedId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentId, data.fileDocxShared.name)).entry.id;
    fileDocxSharedFavId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentId, data.fileDocxSharedFav.name)).entry.id;
    fileSharedId = (await apis.user.nodes.createFile(data.fileShared.name, parentId)).entry.id;
    fileSharedFavId = (await apis.user.nodes.createFile(data.fileSharedFav.name, parentId)).entry.id;
    fileLockedId = (await apis.user.nodes.createFile(data.fileLocked.name, parentId)).entry.id;
    fileFavLockedId = (await apis.user.nodes.createFile(data.fileFavLocked.name, parentId)).entry.id;
    fileSharedLockedId = (await apis.user.nodes.createFile(data.fileSharedLocked.name, parentId)).entry.id;
    fileSharedFavLockedId = (await apis.user.nodes.createFile(data.fileSharedFavLocked.name, parentId)).entry.id;

    await apis.user.favorites.addFavoritesByIds('file', [
      fileDocxFavId,
      fileFavId,
      fileDocxSharedFavId,
      fileSharedFavId,
      fileFavLockedId,
      fileSharedFavLockedId
    ]);

    await apis.user.shared.shareFilesByIds([
      fileDocxSharedId,
      fileDocxSharedFavId,
      fileSharedId,
      fileSharedFavId,
      fileSharedLockedId,
      fileSharedFavLockedId
    ]);

    await apis.user.nodes.lockFile(fileLockedId);
    await apis.user.nodes.lockFile(fileFavLockedId);
    await apis.user.nodes.lockFile(fileSharedLockedId);
    await apis.user.nodes.lockFile(fileSharedFavLockedId);

    await apis.user.favorites.waitForApi({ expect: 6 });
    await apis.user.shared.waitForApi({ expect: 6 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    done();
  });

  describe('file opened from Personal Files', () => {

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      await dataTable.waitForHeader();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('File Office - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocx.name, data.fileDocx.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocx.name, data.fileDocx.viewerToolbarMore);
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarMore);
    });

    it('File simple - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.file.name, data.file.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.file.name, data.file.viewerToolbarMore);
    });

    it('File favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileFav.name, data.fileFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileFav.name, data.fileFav.viewerToolbarMore);
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileShared.name, data.fileShared.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileShared.name, data.fileShared.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarMore);
    });

    it('File locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileLocked.name, data.fileLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileLocked.name, data.fileLocked.viewerToolbarMore);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarMore);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });

  describe('file opened from Recent Files', () => {

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickRecentFilesAndWait();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('File Office - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocx.name, data.fileDocx.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocx.name, data.fileDocx.viewerToolbarMore);
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarMore);
    });

    it('File simple - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.file.name, data.file.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.file.name, data.file.viewerToolbarMore);
    });

    it('File favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileFav.name, data.fileFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileFav.name, data.fileFav.viewerToolbarMore);
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileShared.name, data.fileShared.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileShared.name, data.fileShared.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarMore);
    });

    it('File locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileLocked.name, data.fileLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileLocked.name, data.fileLocked.viewerToolbarMore);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarMore);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });

  describe('file opened from Favorites', () => {

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickFavoritesAndWait();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarMore);
    });

    it('File favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileFav.name, data.fileFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileFav.name, data.fileFav.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarMore);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });

  describe('file opened from Shared Files', () => {

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickSharedFilesAndWait();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileShared.name, data.fileShared.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileShared.name, data.fileShared.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarMore);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });

  describe('file opened from Search Results', () => {

    beforeAll(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchFor('file-');
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('File Office - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocx.name, data.fileDocx.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocx.name, data.fileDocx.searchViewerToolbarMore);
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxFav.name, data.fileDocxFav.searchViewerToolbarMore);
    });

    it('File simple - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.file.name, data.file.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.file.name, data.file.searchViewerToolbarMore);
    });

    it('File favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileFav.name, data.fileFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileFav.name, data.fileFav.searchViewerToolbarMore);
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxShared.name, data.fileDocxShared.searchViewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.searchViewerToolbarMore);
    });

    it('File shared - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileShared.name, data.fileShared.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileShared.name, data.fileShared.searchViewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFav.name, data.fileSharedFav.searchViewerToolbarMore);
    });

    it('File locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileLocked.name, data.fileLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileLocked.name, data.fileLocked.searchViewerToolbarMore);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileFavLocked.name, data.fileFavLocked.searchViewerToolbarMore);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedLocked.name, data.fileSharedLocked.searchViewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.searchViewerToolbarMore);
    });
  });

});
