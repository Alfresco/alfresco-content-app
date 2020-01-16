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

describe('File/folder actions : on Search Results : ', () => {

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
  let folderFavId: string;

  const userApi = new RepoClient(username, username);

  const adminApiActions = new AdminActions();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { searchInput } = page.header;
  const searchResultsPage = new SearchResultsPage();

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

    await userApi.nodes.createFolder(data.folder.name, parentId);
    folderFavId = (await userApi.nodes.createFolder(data.folderFav.name, parentId)).entry.id;
    await userApi.favorites.addFavoriteById('folder', folderFavId);

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
      userApi.favorites.waitForApi({ expect: 7 }),
      userApi.shared.waitForApi({ expect: 6 }),
      userApi.search.waitForApi(username, { expect: 12 })
    ]);

    await loginPage.loginWith(username);
  });

  afterAll(async () => {
    await userApi.nodes.deleteNodeById(parentId);
  });

  beforeEach(async () => {
    await Utils.pressEscape();
  });

  describe('on a file', () => {

    beforeAll(async () => {
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.searchFor('file-');
      await searchResultsPage.waitForResults();
    });

    it('File Office - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocx.name, data.fileDocx.searchToolbarPrimary, data.fileDocx.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileDocx.name, data.fileDocx.searchContextMenu);
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocxFav.name, data.fileDocxFav.searchToolbarPrimary, data.fileDocxFav.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileDocxFav.name, data.fileDocxFav.searchContextMenu);
    });

    it('File simple - []', async () => {
      await testUtil.checkToolbarActions(data.file.name, data.file.searchToolbarPrimary, data.file.searchToolbarMore);
      await testUtil.checkContextMenu(data.file.name, data.file.searchContextMenu);
    });

    it('File favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileFav.name, data.fileFav.searchToolbarPrimary, data.fileFav.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileFav.name, data.fileFav.searchContextMenu);
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocxShared.name, data.fileDocxShared.searchToolbarPrimary, data.fileDocxShared.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileDocxShared.name, data.fileDocxShared.searchContextMenu);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.searchToolbarPrimary, data.fileDocxSharedFav.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileDocxSharedFav.name, data.fileDocxSharedFav.searchContextMenu);
    });

    it('File shared - []', async () => {
      await testUtil.checkToolbarActions(data.fileShared.name, data.fileShared.searchToolbarPrimary, data.fileShared.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileShared.name, data.fileShared.searchContextMenu);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileSharedFav.name, data.fileSharedFav.searchToolbarPrimary, data.fileSharedFav.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFav.name, data.fileSharedFav.searchContextMenu);
    });

    it('File locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileLocked.name, data.fileLocked.searchToolbarPrimary, data.fileLocked.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileLocked.name, data.fileLocked.searchContextMenu);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileFavLocked.name, data.fileFavLocked.searchToolbarPrimary, data.fileFavLocked.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileFavLocked.name, data.fileFavLocked.searchContextMenu);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileSharedLocked.name, data.fileSharedLocked.searchToolbarPrimary, data.fileSharedLocked.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedLocked.name, data.fileSharedLocked.searchContextMenu);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.searchToolbarPrimary, data.fileSharedFavLocked.searchToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFavLocked.name, data.fileSharedFavLocked.searchContextMenu);
    });
  });

  describe('on a folder', () => {

    beforeAll(async () => {
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.searchFor('folder-');
      await searchResultsPage.waitForResults();
    });

    it('Folder not favorite  - []', async () => {
      await testUtil.checkToolbarActions(data.folder.name, data.folder.searchToolbarPrimary, data.folder.searchToolbarMore);
      await testUtil.checkContextMenu(data.folder.name, data.folder.searchContextMenu);
    });

    it('Folder favorite - []', async () => {
      await testUtil.checkToolbarActions(data.folderFav.name, data.folderFav.searchToolbarPrimary, data.folderFav.searchToolbarMore);
      await testUtil.checkContextMenu(data.folderFav.name, data.folderFav.searchContextMenu);
    });
  });

  describe('on multiple selection', () => {

    beforeAll(async () => {
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.searchFor('file-');
      await searchResultsPage.waitForResults();
    });

    it('multiple files - [C291820]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.file.name, data.fileDocxShared.name ], data.multipleSel.searchContextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.file.name, data.fileDocxShared.name ], data.multipleSel.searchToolbarPrimary, data.multipleSel.searchToolbarMore);
    });

    it('multiple files - all favorite - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileDocxFav.name, data.fileSharedFav.name ], data.multipleSelAllFav.searchContextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileDocxFav.name, data.fileSharedFav.name ], data.multipleSelAllFav.searchToolbarPrimary, data.multipleSelAllFav.searchToolbarMore);
    });

    it('multiple locked files - [C297626]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.searchContextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.searchToolbarPrimary, data.multipleSel.searchToolbarMore);
    });

    it('multiple folders - [C291821]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.searchFor('folder-');
      await searchResultsPage.waitForResults();

      await testUtil.checkMultipleSelContextMenu([ data.folder.name, data.folderFav.name ], data.multipleSel.searchContextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.folder.name, data.folderFav.name ], data.multipleSel.searchToolbarPrimary, data.multipleSel.searchToolbarMore);
    });

    it('both files and folders - [C291822]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.searchFor(`=${data.file.name} or =${data.folderFav.name}`);
      await searchResultsPage.waitForResults();

      await testUtil.checkMultipleSelContextMenu([ data.file.name, data.folderFav.name ], data.multipleSel.searchContextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.file.name, data.folderFav.name ], data.multipleSel.searchToolbarPrimary, data.multipleSel.searchToolbarMore);
    });
  });
});
