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

describe('File/folder actions : on Search Results : ', () => {

  const random = Utils.random();

  const username = `user-${random}`;

  const parent = `parent-${random}`; let parentId;

  let fileDocxFavId, fileFavId, fileDocxSharedId, fileDocxSharedFavId, fileSharedId, fileSharedFavId, fileLockedId, fileFavLockedId, fileSharedLockedId, fileSharedFavLockedId;
  let folderFavId;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
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

    await apis.user.nodes.createFolder(data.folder.name, parentId);
    folderFavId = (await apis.user.nodes.createFolder(data.folderFav.name, parentId)).entry.id;
    await apis.user.favorites.addFavoriteById('folder', folderFavId);

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

    await apis.user.favorites.waitForApi({ expect: 7 });
    await apis.user.shared.waitForApi({ expect: 6 });
    await apis.user.search.waitForApi(username, { expect: 12 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    done();
  });

  describe('on a file', () => {

    beforeEach(async (done) => {
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
      await testUtil.checkToolbarPrimary(data.fileDocx.name, data.fileDocx.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileDocx.name, data.fileDocx.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileDocx.name, data.fileDocx.searchContextMenu);
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileDocxFav.name, data.fileDocxFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileDocxFav.name, data.fileDocxFav.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileDocxFav.name, data.fileDocxFav.searchContextMenu);
    });

    it('File simple - []', async () => {
      await testUtil.checkToolbarPrimary(data.file.name, data.file.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.file.name, data.file.searchToolbarMore);
      await testUtil.checkContextMenu(data.file.name, data.file.searchContextMenu);
    });

    it('File favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileFav.name, data.fileFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileFav.name, data.fileFav.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileFav.name, data.fileFav.searchContextMenu);
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileDocxShared.name, data.fileDocxShared.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileDocxShared.name, data.fileDocxShared.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileDocxShared.name, data.fileDocxShared.searchContextMenu);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileDocxSharedFav.name, data.fileDocxSharedFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileDocxSharedFav.name, data.fileDocxSharedFav.searchContextMenu);
    });

    it('File shared - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileShared.name, data.fileShared.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileShared.name, data.fileShared.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileShared.name, data.fileShared.searchContextMenu);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileSharedFav.name, data.fileSharedFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileSharedFav.name, data.fileSharedFav.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFav.name, data.fileSharedFav.searchContextMenu);
    });

    it('File locked - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileLocked.name, data.fileLocked.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileLocked.name, data.fileLocked.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileLocked.name, data.fileLocked.searchContextMenu);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileFavLocked.name, data.fileFavLocked.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileFavLocked.name, data.fileFavLocked.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileFavLocked.name, data.fileFavLocked.searchContextMenu);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileSharedLocked.name, data.fileSharedLocked.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileSharedLocked.name, data.fileSharedLocked.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedLocked.name, data.fileSharedLocked.searchContextMenu);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileSharedFavLocked.name, data.fileSharedFavLocked.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFavLocked.name, data.fileSharedFavLocked.searchContextMenu);
    });
  });

  describe('on a folder', () => {

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFolders();
      await searchInput.searchFor('folder-');
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('Folder not favorite  - []', async () => {
      await testUtil.checkToolbarPrimary(data.folder.name, data.folder.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.folder.name, data.folder.searchToolbarMore);
      await testUtil.checkContextMenu(data.folder.name, data.folder.searchContextMenu);
    });

    it('Folder favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.folderFav.name, data.folderFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.folderFav.name, data.folderFav.searchToolbarMore);
      await testUtil.checkContextMenu(data.folderFav.name, data.folderFav.searchContextMenu);
    });
  });

  describe('on multiple selection', () => {
    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFiles();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('multiple files - [C291820]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchFor('file-');

      await testUtil.checkMultipleSelContextMenu([ data.file.name, data.fileDocxShared.name ], data.multipleSel.searchContextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.file.name, data.fileDocxShared.name ], data.multipleSel.searchToolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.file.name, data.fileDocxShared.name ], data.multipleSel.searchToolbarMore);
    });

    it('multiple files - all favorite - []', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchFor('file-');

      await testUtil.checkMultipleSelContextMenu([ data.fileDocxFav.name, data.fileSharedFav.name ], data.multipleSelAllFav.searchContextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileDocxFav.name, data.fileSharedFav.name ], data.multipleSelAllFav.searchToolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileDocxFav.name, data.fileSharedFav.name ], data.multipleSelAllFav.searchToolbarMore);
    });

    it('multiple locked files - [C297626]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchFor('file-');

      await testUtil.checkMultipleSelContextMenu([ data.fileLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.searchContextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.searchToolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.searchToolbarMore);
    });

    it('multiple folders - [C291821]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFolders();
      await searchInput.searchFor('folder-');

      await testUtil.checkMultipleSelContextMenu([ data.folder.name, data.folderFav.name ], data.multipleSel.searchContextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.folder.name, data.folderFav.name ], data.multipleSel.searchToolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.folder.name, data.folderFav.name ], data.multipleSel.searchToolbarMore);
    });

    it('both files and folders - [C291822]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor(`=${data.file.name} or =${data.folderFav.name}`);

      await testUtil.checkMultipleSelContextMenu([ data.file.name, data.folderFav.name ], data.multipleSel.searchContextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.file.name, data.folderFav.name ], data.multipleSel.searchToolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.file.name, data.folderFav.name ], data.multipleSel.searchToolbarMore);
    });
  });
});
