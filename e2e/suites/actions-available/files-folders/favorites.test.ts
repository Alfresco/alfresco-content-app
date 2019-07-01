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

describe('File/folder actions : on Favorites : ', () => {

  const random = Utils.random();

  const username = `user-${random}`;

  const parent = `parent-${random}`; let parentId;

  let fileDocxFavId, fileFavId, fileDocxSharedFavId, fileSharedFavId, fileFavLockedId, fileSharedFavLockedId;
  let folderFavId, folderFav2Id;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;

    fileDocxFavId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentId, data.fileDocxFav.name)).entry.id;
    fileFavId = (await apis.user.nodes.createFile(data.fileFav.name, parentId)).entry.id;
    fileDocxSharedFavId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentId, data.fileDocxSharedFav.name)).entry.id;
    fileSharedFavId = (await apis.user.nodes.createFile(data.fileSharedFav.name, parentId)).entry.id;
    fileFavLockedId = (await apis.user.nodes.createFile(data.fileFavLocked.name, parentId)).entry.id;
    fileSharedFavLockedId = (await apis.user.nodes.createFile(data.fileSharedFavLocked.name, parentId)).entry.id;

    folderFavId = (await apis.user.nodes.createFolder(data.folderFav.name, parentId)).entry.id;
    folderFav2Id = (await apis.user.nodes.createFolder(data.folderFav2.name, parentId)).entry.id;
    await apis.user.favorites.addFavoriteById('folder', folderFavId);
    await apis.user.favorites.addFavoriteById('folder', folderFav2Id);

    await apis.user.shared.shareFilesByIds([
      fileDocxSharedFavId,
      fileSharedFavId,
      fileSharedFavLockedId
    ]);

    await apis.user.favorites.addFavoritesByIds('file', [
      fileDocxFavId,
      fileFavId,
      fileDocxSharedFavId,
      fileSharedFavId,
      fileFavLockedId,
      fileSharedFavLockedId
    ]);

    await apis.user.nodes.lockFile(fileFavLockedId);
    await apis.user.nodes.lockFile(fileSharedFavLockedId);

    await apis.user.favorites.waitForApi({ expect: 8 });
    await apis.user.shared.waitForApi({ expect: 3 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    done();
  });

  beforeEach(async (done) => {
    await Utils.pressEscape();
    await page.clickFavoritesAndWait();
    done();
  });

  afterEach(async (done) => {
    await Utils.pressEscape();
    done();
  });

  describe('on a file', () => {

    it('File Office, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileDocxFav.name, data.fileDocxFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileDocxFav.name, data.fileDocxFav.favoritesToolbarMore);
      await testUtil.checkContextMenu(data.fileDocxFav.name, data.fileDocxFav.favoritesContextMenu);
    });

    it('File favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileFav.name, data.fileFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileFav.name, data.fileFav.favoritesToolbarMore);
      await testUtil.checkContextMenu(data.fileFav.name, data.fileFav.favoritesContextMenu);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileDocxSharedFav.name, data.fileDocxSharedFav.favoritesToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.favoritesToolbarMore);
      await testUtil.checkContextMenu(data.fileDocxSharedFav.name, data.fileDocxSharedFav.favoritesContextMenu);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileSharedFav.name, data.fileSharedFav.favoritesToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileSharedFav.name, data.fileSharedFav.favoritesToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFav.name, data.fileSharedFav.favoritesContextMenu);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileFavLocked.name, data.fileFavLocked.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileFavLocked.name, data.fileFavLocked.favoritesToolbarMore);
      await testUtil.checkContextMenu(data.fileFavLocked.name, data.fileFavLocked.favoritesContextMenu);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileSharedFavLocked.name, data.fileSharedFavLocked.favoritesToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.favoritesToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFavLocked.name, data.fileSharedFavLocked.favoritesContextMenu);
    });
  });

  describe('on a folder', () => {
    it('Folder favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.folderFav.name, data.folderFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.folderFav.name, data.folderFav.favoritesToolbarMore);
      await testUtil.checkContextMenu(data.folderFav.name, data.folderFav.favoritesContextMenu);
    });
  });

  describe('on multiple selection', () => {
    it('multiple files - [C280656]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileDocxFav.name, data.fileDocxSharedFav.name ], data.multipleSelAllFav.favoritesContextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileDocxFav.name, data.fileDocxSharedFav.name ], data.multipleSelAllFav.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileDocxFav.name, data.fileDocxSharedFav.name ], data.multipleSelAllFav.favoritesToolbarMore);
    });

    it('multiple locked files - [C297631]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileFavLocked.name, data.fileSharedFavLocked.name ], data.multipleSelAllFav.favoritesContextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileFavLocked.name, data.fileSharedFavLocked.name ], data.multipleSelAllFav.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileFavLocked.name, data.fileSharedFavLocked.name ], data.multipleSelAllFav.favoritesToolbarMore);
    });

    it('multiple folders - [C280664]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.folderFav.name, data.folderFav2.name ], data.multipleSelAllFav.favoritesContextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.folderFav.name, data.folderFav2.name ], data.multipleSelAllFav.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.folderFav.name, data.folderFav2.name ], data.multipleSelAllFav.favoritesToolbarMore);
    });

    it('both files and folders - [C280657]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileFav.name, data.folderFav.name ], data.multipleSelAllFav.favoritesContextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileFav.name, data.folderFav.name ], data.multipleSelAllFav.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileFav.name, data.folderFav.name ], data.multipleSelAllFav.favoritesToolbarMore);
    });
  });
});
