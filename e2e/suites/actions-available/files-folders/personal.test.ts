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

import { LoginPage, BrowsingPage } from '../../../pages/pages';
import { FILES } from '../../../configs';
import { RepoClient } from '../../../utilities/repo-client/repo-client';
import { Utils } from '../../../utilities/utils';
import { AdminActions } from '../../../utilities/admin-actions';
import * as data from './test-data-files-folders';
import * as testUtil from '../test-util';

describe('File/folder actions : on Personal Files: ', () => {

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
  const { dataTable } = page;

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
      userApi.shared.waitForApi({ expect: 6 })
    ]);

    await loginPage.loginWith(username);

    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(parent);
    await dataTable.waitForHeader();
  });

  afterAll(async () => {
    await userApi.nodes.deleteNodeById(parentId);
  });

  beforeEach(async () => {
    await Utils.pressEscape();
  });

  describe('on a file', () => {

    it('File Office - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocx.name, data.fileDocx.toolbarPrimary, data.fileDocx.toolbarMore);
      await testUtil.checkContextMenu(data.fileDocx.name, data.fileDocx.contextMenu);
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocxFav.name, data.fileDocxFav.toolbarPrimary, data.fileDocxFav.toolbarMore);
      await testUtil.checkContextMenu(data.fileDocxFav.name, data.fileDocxFav.contextMenu);
    });

    it('File simple - []', async () => {
      await testUtil.checkToolbarActions(data.file.name, data.file.toolbarPrimary, data.file.toolbarMore);
      await testUtil.checkContextMenu(data.file.name, data.file.contextMenu);
    });

    it('File favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileFav.name, data.fileFav.toolbarPrimary, data.fileFav.toolbarMore);
      await testUtil.checkContextMenu(data.fileFav.name, data.fileFav.contextMenu);
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocxShared.name, data.fileDocxShared.toolbarPrimary, data.fileDocxShared.toolbarMore);
      await testUtil.checkContextMenu(data.fileDocxShared.name, data.fileDocxShared.contextMenu);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.toolbarPrimary, data.fileDocxSharedFav.toolbarMore);
      await testUtil.checkContextMenu(data.fileDocxSharedFav.name, data.fileDocxSharedFav.contextMenu);
    });

    it('File shared - []', async () => {
      await testUtil.checkToolbarActions(data.fileShared.name, data.fileShared.toolbarPrimary, data.fileShared.toolbarMore);
      await testUtil.checkContextMenu(data.fileShared.name, data.fileShared.contextMenu);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileSharedFav.name, data.fileSharedFav.toolbarPrimary, data.fileSharedFav.toolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFav.name, data.fileSharedFav.contextMenu);
    });

    it('File locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileLocked.name, data.fileLocked.toolbarPrimary, data.fileLocked.toolbarMore);
      await testUtil.checkContextMenu(data.fileLocked.name, data.fileLocked.contextMenu);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileFavLocked.name, data.fileFavLocked.toolbarPrimary, data.fileFavLocked.toolbarMore);
      await testUtil.checkContextMenu(data.fileFavLocked.name, data.fileFavLocked.contextMenu);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileSharedLocked.name, data.fileSharedLocked.toolbarPrimary, data.fileSharedLocked.toolbarMore);
      await testUtil.checkContextMenu(data.fileSharedLocked.name, data.fileSharedLocked.contextMenu);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.toolbarPrimary, data.fileSharedFavLocked.toolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFavLocked.name, data.fileSharedFavLocked.contextMenu);
    });
  });

  describe('on a folder', () => {

    it('Folder not favorite  - []', async () => {
      await testUtil.checkToolbarActions(data.folder.name, data.folder.toolbarPrimary, data.folder.toolbarMore);
      await testUtil.checkContextMenu(data.folder.name, data.folder.contextMenu);
    });

    it('Folder favorite - []', async () => {
      await testUtil.checkToolbarActions(data.folderFav.name, data.folderFav.toolbarPrimary, data.folderFav.toolbarMore);
      await testUtil.checkContextMenu(data.folderFav.name, data.folderFav.contextMenu);
    });
  });

  describe('on multiple selection', () => {
    it('multiple files - [C217112]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileDocx.name, data.fileDocxSharedFav.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileDocx.name, data.fileDocxSharedFav.name ], data.multipleSel.toolbarPrimary, data.multipleSel.toolbarMore);
    });

    it('multiple files - all favorite - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileDocxFav.name, data.fileDocxSharedFav.name ], data.multipleSelAllFav.contextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileDocxFav.name, data.fileDocxSharedFav.name ], data.multipleSel.toolbarPrimary, data.multipleSelAllFav.toolbarMore);
    });

    it('multiple locked files - [C297619]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.toolbarPrimary, data.multipleSel.toolbarMore);
    });

    it('multiple folders - [C280459]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.folderFav.name, data.folder.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.folderFav.name, data.folder.name ], data.multipleSel.toolbarPrimary, data.multipleSel.toolbarMore);
    });

    it('both files and folders - [C280460]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.file.name, data.folder.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.file.name, data.folder.name ], data.multipleSel.toolbarPrimary, data.multipleSel.toolbarMore);
    });
  });
});
