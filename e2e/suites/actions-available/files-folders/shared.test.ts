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

describe('File actions : on Shared Files : ', () => {

  const random = Utils.random();

  const username = `user-${random}`;

  const parent = `parent-${random}`; let parentId;

  let fileDocxSharedId, fileDocxSharedFavId, fileSharedId, fileSharedFavId, fileSharedLockedId, fileSharedFavLockedId;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;

    fileDocxSharedId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentId, data.fileDocxShared.name)).entry.id;
    fileDocxSharedFavId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentId, data.fileDocxSharedFav.name)).entry.id;
    fileSharedId = (await apis.user.nodes.createFile(data.fileShared.name, parentId)).entry.id;
    fileSharedFavId = (await apis.user.nodes.createFile(data.fileSharedFav.name, parentId)).entry.id;
    fileSharedLockedId = (await apis.user.nodes.createFile(data.fileSharedLocked.name, parentId)).entry.id;
    fileSharedFavLockedId = (await apis.user.nodes.createFile(data.fileSharedFavLocked.name, parentId)).entry.id;

    await apis.user.favorites.addFavoritesByIds('file', [
      fileDocxSharedFavId,
      fileSharedFavId,
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

    await apis.user.nodes.lockFile(fileSharedLockedId);
    await apis.user.nodes.lockFile(fileSharedFavLockedId);

    await apis.user.favorites.waitForApi({ expect: 3 });
    await apis.user.shared.waitForApi({ expect: 6 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    done();
  });

  beforeEach(async (done) => {
    await Utils.pressEscape();
    await page.clickSharedFilesAndWait();
    done();
  });

  afterEach(async (done) => {
    await Utils.pressEscape();
    done();
  });

  describe('single selection', () => {
    it('File Office, shared - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileDocxShared.name, data.fileDocxShared.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileDocxShared.name, data.fileDocxShared.sharedToolbarMore);
      await testUtil.checkContextMenu(data.fileDocxShared.name, data.fileDocxShared.sharedContextMenu);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileDocxSharedFav.name, data.fileDocxSharedFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.sharedToolbarMore);
      await testUtil.checkContextMenu(data.fileDocxSharedFav.name, data.fileDocxSharedFav.sharedContextMenu);
    });

    it('File shared - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileShared.name, data.fileShared.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileShared.name, data.fileShared.sharedToolbarMore);
      await testUtil.checkContextMenu(data.fileShared.name, data.fileShared.sharedContextMenu);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileSharedFav.name, data.fileSharedFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileSharedFav.name, data.fileSharedFav.sharedToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFav.name, data.fileSharedFav.sharedContextMenu);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileSharedLocked.name, data.fileSharedLocked.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileSharedLocked.name, data.fileSharedLocked.sharedToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedLocked.name, data.fileSharedLocked.sharedContextMenu);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileSharedFavLocked.name, data.fileSharedFavLocked.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.sharedToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFavLocked.name, data.fileSharedFavLocked.sharedContextMenu);
    });
  });

  describe('multiple selection', () => {
    it('multiple files - [C280467]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileShared.name, data.fileSharedFav.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileShared.name, data.fileSharedFav.name ], data.multipleSel.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileShared.name, data.fileSharedFav.name ], data.multipleSel.toolbarMore);
    });

    it('multiple files - all favorite - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileSharedFav.name, data.fileSharedFavLocked.name ], data.multipleSelAllFav.contextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileSharedFav.name, data.fileSharedFavLocked.name ], data.multipleSelAllFav.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileSharedFav.name, data.fileSharedFavLocked.name ], data.multipleSelAllFav.toolbarMore);
    });

    it('multiple locked files - [C297623]', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileSharedLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileSharedLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileSharedLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.toolbarMore);
    });
  });

});
