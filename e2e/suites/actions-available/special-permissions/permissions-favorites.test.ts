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
import { FILES, SITE_ROLES } from '../../../configs';
import { RepoClient } from '../../../utilities/repo-client/repo-client';
import { Utils } from '../../../utilities/utils';
import { AdminActions } from '../../../utilities/admin-actions';
import * as data from './test-data-permissions';
import * as testUtil from '../test-util';

describe('Special permissions actions : on Favorites : ', () => {
  const random = Utils.random();

  const site = `site-private-${random}`;

  const userConsumer = `consumer-${random}`;

  let fileDocxFavId: string;
  let fileFavId: string;
  let fileDocxSharedFavId: string;
  let fileSharedFavId: string;
  let fileFavLockedId: string;
  let fileSharedFavLockedId: string;
  let folderFavId: string;
  let folderFav2Id: string;

  const file3 = `file-3-${random}.txt`;
  let file3Id: string;

  const adminApiActions = new AdminActions();

  const userApi = new RepoClient(userConsumer, userConsumer);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();

  beforeAll(async () => {
    await adminApiActions.createUser({ username: userConsumer });

    await adminApiActions.sites.createSitePrivate(site);
    const docLibId = await adminApiActions.sites.getDocLibId(site);
    await adminApiActions.sites.addSiteConsumer(site, userConsumer);

    fileDocxFavId = (await adminApiActions.upload.uploadFileWithRename(FILES.docxFile, docLibId, data.fileDocxFav.name)).entry.id;
    fileFavId = (await adminApiActions.nodes.createFile(data.fileFav.name, docLibId)).entry.id;
    fileDocxSharedFavId = (await adminApiActions.upload.uploadFileWithRename(FILES.docxFile, docLibId, data.fileDocxSharedFav.name)).entry.id;
    fileSharedFavId = (await adminApiActions.nodes.createFile(data.fileSharedFav.name, docLibId)).entry.id;
    fileFavLockedId = (await adminApiActions.nodes.createFile(data.fileFavLocked.name, docLibId)).entry.id;
    fileSharedFavLockedId = (await adminApiActions.nodes.createFile(data.fileSharedFavLocked.name, docLibId)).entry.id;

    file3Id = (await adminApiActions.nodes.createFile(file3, docLibId)).entry.id;

    folderFavId = (await adminApiActions.nodes.createFolder(data.folderFav.name, docLibId)).entry.id;
    folderFav2Id = (await adminApiActions.nodes.createFolder(data.folderFav2.name, docLibId)).entry.id;
    await userApi.favorites.addFavoritesByIds('folder', [folderFavId, folderFav2Id]);

    await userApi.favorites.addFavoritesByIds('file', [
      fileDocxFavId,
      fileFavId,
      fileDocxSharedFavId,
      fileSharedFavId,
      fileFavLockedId,
      fileSharedFavLockedId,
      file3Id
    ]);

    await userApi.shared.shareFilesByIds([
      fileDocxSharedFavId,
      fileSharedFavId,
      fileSharedFavLockedId,
      file3Id
    ]);

    await adminApiActions.nodes.lockFile(fileFavLockedId);
    await adminApiActions.nodes.lockFile(fileSharedFavLockedId);

    await adminApiActions.nodes.setGranularPermission(file3Id, false, userConsumer, SITE_ROLES.SITE_MANAGER.ROLE);

    await Promise.all([
      userApi.favorites.waitForApi({ expect: 9 }),
      userApi.shared.waitForApi({ expect: 4 })
    ]);

    await loginPage.loginWith(userConsumer);

    await page.clickFavoritesAndWait();
  });

  afterAll(async () => {
    await adminApiActions.sites.deleteSite(site);
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
    it('multiple files - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileDocxFav.name, data.fileDocxSharedFav.name ], data.multipleSelAllFav.favoritesContextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileDocxFav.name, data.fileDocxSharedFav.name ], data.multipleSelAllFav.toolbarPrimary, data.multipleSelAllFav.favoritesToolbarMore);
    });

    it('multiple locked files - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileFavLocked.name, data.fileSharedFavLocked.name ], data.multipleSelAllFav.favoritesContextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileFavLocked.name, data.fileSharedFavLocked.name ], data.multipleSelAllFav.toolbarPrimary, data.multipleSelAllFav.favoritesToolbarMore);
    });

    it('multiple folders - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.folderFav.name, data.folderFav2.name ], data.multipleSelAllFav.favoritesContextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.folderFav.name, data.folderFav2.name ], data.multipleSelAllFav.toolbarPrimary, data.multipleSelAllFav.favoritesToolbarMore);
    });

    it('both files and folders - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileFav.name, data.folderFav.name ], data.multipleSelAllFav.favoritesContextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileFav.name, data.folderFav.name ], data.multipleSelAllFav.toolbarPrimary, data.multipleSelAllFav.favoritesToolbarMore);
    });

    it('multiple files with different granular permissions - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileFav.name, file3 ], data.multipleSelAllFav.favoritesContextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileFav.name, file3 ], data.multipleSelAllFav.toolbarPrimary, data.multipleSelAllFav.favoritesToolbarMore);
    });
  });

});
