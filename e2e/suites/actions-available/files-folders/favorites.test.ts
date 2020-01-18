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

describe('File/folder actions : on Favorites : ', () => {

  const random = Utils.random();

  const username = `user-${random}`;

  const parent = `parent-${random}`;
  let parentId: string;

  let fileDocxFavId: string;
  let fileFavId: string;
  let fileDocxSharedFavId: string;
  let fileSharedFavId: string;
  let fileFavLockedId: string;
  let fileSharedFavLockedId: string;
  let folderFavId: string;
  let folderFav2Id: string;

  const userApi = new RepoClient(username, username);

  const adminApiActions = new AdminActions();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });

    parentId = (await userApi.nodes.createFolder(parent)).entry.id;

    fileDocxFavId = (await userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, data.fileDocxFav.name)).entry.id;
    fileFavId = (await userApi.nodes.createFile(data.fileFav.name, parentId)).entry.id;
    fileDocxSharedFavId = (await userApi.upload.uploadFileWithRename(FILES.docxFile, parentId, data.fileDocxSharedFav.name)).entry.id;
    fileSharedFavId = (await userApi.nodes.createFile(data.fileSharedFav.name, parentId)).entry.id;
    fileFavLockedId = (await userApi.nodes.createFile(data.fileFavLocked.name, parentId)).entry.id;
    fileSharedFavLockedId = (await userApi.nodes.createFile(data.fileSharedFavLocked.name, parentId)).entry.id;

    folderFavId = (await userApi.nodes.createFolder(data.folderFav.name, parentId)).entry.id;
    folderFav2Id = (await userApi.nodes.createFolder(data.folderFav2.name, parentId)).entry.id;

    await userApi.favorites.addFavoritesByIds('folder', [folderFavId, folderFav2Id]);
    await userApi.shared.shareFilesByIds([
      fileDocxSharedFavId,
      fileSharedFavId,
      fileSharedFavLockedId
    ]);
    await userApi.favorites.addFavoritesByIds('file', [
      fileDocxFavId,
      fileFavId,
      fileDocxSharedFavId,
      fileSharedFavId,
      fileFavLockedId,
      fileSharedFavLockedId
    ]);
    await userApi.nodes.lockFile(fileFavLockedId);
    await userApi.nodes.lockFile(fileSharedFavLockedId);

    await Promise.all([
      userApi.favorites.waitForApi({ expect: 8 }),
      userApi.shared.waitForApi({ expect: 3 })
    ]);

    await loginPage.loginWith(username);

    await page.clickFavoritesAndWait();
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

  describe('on a file', () => {

    it('File Office, favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocxFav.name, data.fileDocxFav.toolbarPrimary, data.fileDocxFav.favoritesToolbarMore);
      await testUtil.checkContextMenu(data.fileDocxFav.name, data.fileDocxFav.favoritesContextMenu);
    });

    it('File favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileFav.name, data.fileFav.toolbarPrimary, data.fileFav.favoritesToolbarMore);
      await testUtil.checkContextMenu(data.fileFav.name, data.fileFav.favoritesContextMenu);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.favoritesToolbarPrimary, data.fileDocxSharedFav.favoritesToolbarMore);
      await testUtil.checkContextMenu(data.fileDocxSharedFav.name, data.fileDocxSharedFav.favoritesContextMenu);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileSharedFav.name, data.fileSharedFav.favoritesToolbarPrimary, data.fileSharedFav.favoritesToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFav.name, data.fileSharedFav.favoritesContextMenu);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileFavLocked.name, data.fileFavLocked.toolbarPrimary, data.fileFavLocked.favoritesToolbarMore);
      await testUtil.checkContextMenu(data.fileFavLocked.name, data.fileFavLocked.favoritesContextMenu);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.favoritesToolbarPrimary, data.fileSharedFavLocked.favoritesToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFavLocked.name, data.fileSharedFavLocked.favoritesContextMenu);
    });
  });

  describe('on a folder', () => {
    it('Folder favorite - []', async () => {
      await testUtil.checkToolbarActions(data.folderFav.name, data.folderFav.toolbarPrimary, data.folderFav.favoritesToolbarMore);
      await testUtil.checkContextMenu(data.folderFav.name, data.folderFav.favoritesContextMenu);
    });
  });

  describe('on multiple selection', () => {
    it('multiple files - [C280656]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileDocxFav.name, data.fileDocxSharedFav.name ], data.multipleSelAllFav.favoritesContextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileDocxFav.name, data.fileDocxSharedFav.name ], data.multipleSelAllFav.toolbarPrimary, data.multipleSelAllFav.favoritesToolbarMore);
    });

    it('multiple locked files - [C297631]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileFavLocked.name, data.fileSharedFavLocked.name ], data.multipleSelAllFav.favoritesContextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileFavLocked.name, data.fileSharedFavLocked.name ], data.multipleSelAllFav.toolbarPrimary, data.multipleSelAllFav.favoritesToolbarMore);
    });

    it('multiple folders - [C280664]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.folderFav.name, data.folderFav2.name ], data.multipleSelAllFav.favoritesContextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.folderFav.name, data.folderFav2.name ], data.multipleSelAllFav.toolbarPrimary, data.multipleSelAllFav.favoritesToolbarMore);
    });

    it('both files and folders - [C280657]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileFav.name, data.folderFav.name ], data.multipleSelAllFav.favoritesContextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileFav.name, data.folderFav.name ], data.multipleSelAllFav.toolbarPrimary, data.multipleSelAllFav.favoritesToolbarMore);
    });
  });
});
