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

import { LoginPage, BrowsingPage, SearchResultsPage } from '../../../pages/pages';
import { FILES, SITE_ROLES } from '../../../configs';
import { RepoClient } from '../../../utilities/repo-client/repo-client';
import { Utils } from '../../../utilities/utils';
import { AdminActions } from '../../../utilities/admin-actions';
import * as data from './test-data-permissions';
import * as testUtil from '../test-util';

describe('Special permissions actions : on Search Results : ', () => {
  const random = Utils.random();

  const site = `site-private-${random}`;

  const userConsumer = `consumer-${random}`;

  const file3 = `file-3-${random}.txt`;
  let file3Id: string;

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

  const adminApiActions = new AdminActions();

  const userApi = new RepoClient(userConsumer, userConsumer);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const searchResultsPage = new SearchResultsPage();
  const { searchInput } = page.header;

  beforeAll(async () => {
    await adminApiActions.createUser({ username: userConsumer });

    await adminApiActions.sites.createSitePrivate(site);
    const docLibId = await adminApiActions.sites.getDocLibId(site);
    await adminApiActions.sites.addSiteConsumer(site, userConsumer);

    await adminApiActions.upload.uploadFileWithRename(FILES.docxFile, docLibId, data.fileDocx.name );
    fileDocxFavId = (await adminApiActions.upload.uploadFileWithRename(FILES.docxFile, docLibId, data.fileDocxFav.name)).entry.id;
    await adminApiActions.nodes.createFile(data.file.name, docLibId);
    fileFavId = (await adminApiActions.nodes.createFile(data.fileFav.name, docLibId)).entry.id;
    fileDocxSharedId = (await adminApiActions.upload.uploadFileWithRename(FILES.docxFile, docLibId, data.fileDocxShared.name)).entry.id;
    fileDocxSharedFavId = (await adminApiActions.upload.uploadFileWithRename(FILES.docxFile, docLibId, data.fileDocxSharedFav.name)).entry.id;
    fileSharedId = (await adminApiActions.nodes.createFile(data.fileShared.name, docLibId)).entry.id;
    fileSharedFavId = (await adminApiActions.nodes.createFile(data.fileSharedFav.name, docLibId)).entry.id;
    fileLockedId = (await adminApiActions.nodes.createFile(data.fileLocked.name, docLibId)).entry.id;
    fileFavLockedId = (await adminApiActions.nodes.createFile(data.fileFavLocked.name, docLibId)).entry.id;
    fileSharedLockedId = (await adminApiActions.nodes.createFile(data.fileSharedLocked.name, docLibId)).entry.id;
    fileSharedFavLockedId = (await adminApiActions.nodes.createFile(data.fileSharedFavLocked.name, docLibId)).entry.id;

    file3Id = (await adminApiActions.nodes.createFile(file3, docLibId)).entry.id;

    await adminApiActions.nodes.createFolder(data.folder.name, docLibId);
    folderFavId = (await adminApiActions.nodes.createFolder(data.folderFav.name, docLibId)).entry.id;
    await userApi.favorites.addFavoriteById('folder', folderFavId);

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
      fileDocxSharedId,
      fileDocxSharedFavId,
      fileSharedId,
      fileSharedFavId,
      fileSharedLockedId,
      fileSharedFavLockedId,
      file3Id
    ]);

    await adminApiActions.nodes.lockFile(fileLockedId);
    await adminApiActions.nodes.lockFile(fileFavLockedId);
    await adminApiActions.nodes.lockFile(fileSharedLockedId);
    await adminApiActions.nodes.lockFile(fileSharedFavLockedId);

    await adminApiActions.nodes.setGranularPermission(file3Id, false, userConsumer, SITE_ROLES.SITE_MANAGER.ROLE);

    await Promise.all([
      userApi.favorites.waitForApi({ expect: 8 }),
      userApi.shared.waitForApi({ expect: 7 }),
      userApi.search.waitForApi(userConsumer, { expect: 13 })
    ]);

    await loginPage.loginWith(userConsumer);
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

    beforeAll(async () => {
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.searchFor('file-');
      await searchResultsPage.waitForResults();
    });

    it('File Office - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocx.name, data.fileDocx.searchToolbarPrimary, data.fileDocx.toolbarMore);
      await testUtil.checkContextMenu(data.fileDocx.name, data.fileDocx.contextMenu);
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocxFav.name, data.fileDocxFav.searchToolbarPrimary, data.fileDocxFav.toolbarMore);
      await testUtil.checkContextMenu(data.fileDocxFav.name, data.fileDocxFav.contextMenu);
    });

    it('File simple - []', async () => {
      await testUtil.checkToolbarActions(data.file.name, data.file.searchToolbarPrimary, data.file.toolbarMore);
      await testUtil.checkContextMenu(data.file.name, data.file.contextMenu);
    });

    it('File favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileFav.name, data.fileFav.searchToolbarPrimary, data.fileFav.toolbarMore);
      await testUtil.checkContextMenu(data.fileFav.name, data.fileFav.contextMenu);
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocxShared.name, data.fileDocxShared.searchToolbarPrimary, data.fileDocxShared.toolbarMore);
      await testUtil.checkContextMenu(data.fileDocxShared.name, data.fileDocxShared.contextMenu);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.searchToolbarPrimary, data.fileDocxSharedFav.toolbarMore);
      await testUtil.checkContextMenu(data.fileDocxSharedFav.name, data.fileDocxSharedFav.contextMenu);
    });

    it('File shared - []', async () => {
      await testUtil.checkToolbarActions(data.fileShared.name, data.fileShared.searchToolbarPrimary, data.fileShared.toolbarMore);
      await testUtil.checkContextMenu(data.fileShared.name, data.fileShared.contextMenu);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileSharedFav.name, data.fileSharedFav.searchToolbarPrimary, data.fileSharedFav.toolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFav.name, data.fileSharedFav.contextMenu);
    });

    it('File locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileLocked.name, data.fileLocked.searchToolbarPrimary, data.fileLocked.toolbarMore);
      await testUtil.checkContextMenu(data.fileLocked.name, data.fileLocked.contextMenu);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileFavLocked.name, data.fileFavLocked.searchToolbarPrimary, data.fileFavLocked.toolbarMore);
      await testUtil.checkContextMenu(data.fileFavLocked.name, data.fileFavLocked.contextMenu);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileSharedLocked.name, data.fileSharedLocked.searchToolbarPrimary, data.fileSharedLocked.toolbarMore);
      await testUtil.checkContextMenu(data.fileSharedLocked.name, data.fileSharedLocked.contextMenu);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.searchToolbarPrimary, data.fileSharedFavLocked.toolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFavLocked.name, data.fileSharedFavLocked.contextMenu);
    });
  });

  describe('on a folder', () => {

    beforeAll(async () => {
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.searchFor('folder-');
      await searchResultsPage.waitForResults();
    });

    it('Folder not favorite - []', async () => {
      await testUtil.checkToolbarActions(data.folder.name, data.folder.searchToolbarPrimary, data.folder.toolbarMore);
      await testUtil.checkContextMenu(data.folder.name, data.folder.contextMenu);
    });

    it('Folder favorite - []', async () => {
      await testUtil.checkToolbarActions(data.folderFav.name, data.folderFav.searchToolbarPrimary, data.folderFav.toolbarMore);
      await testUtil.checkContextMenu(data.folderFav.name, data.folderFav.contextMenu);
    });
  });

  describe('on multiple selection', () => {

    describe('of files', () => {

      beforeAll(async () => {
        await page.clickPersonalFiles();
        await searchInput.clickSearchButton();
        await searchInput.searchFor('file-');
        await searchResultsPage.waitForResults();
      });

      it('multiple files - []', async () => {
        await testUtil.checkMultipleSelContextMenu([ data.file.name, data.fileDocxShared.name ], data.multipleSel.contextMenu);
        await testUtil.checkMultipleSelToolbarActions([ data.file.name, data.fileDocxShared.name ], data.multipleSel.searchToolbarPrimary, data.multipleSel.toolbarMore);
      });

      it('multiple files - all favorite - []', async () => {
        await testUtil.checkMultipleSelContextMenu([ data.fileDocxFav.name, data.fileSharedFav.name ], data.multipleSelAllFav.contextMenu);
        await testUtil.checkMultipleSelToolbarActions([ data.fileDocxFav.name, data.fileSharedFav.name ], data.multipleSel.searchToolbarPrimary, data.multipleSelAllFav.toolbarMore);
      });

      it('multiple locked files - []', async () => {
        await testUtil.checkMultipleSelContextMenu([ data.fileLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.contextMenu);
        await testUtil.checkMultipleSelToolbarActions([ data.fileLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.searchToolbarPrimary, data.multipleSel.toolbarMore);
      });

      it('multiple files with different granular permissions - []', async () => {
        await testUtil.checkMultipleSelContextMenu([ data.fileDocxFav.name, file3 ], data.multipleSelAllFav.contextMenu);
        await testUtil.checkMultipleSelToolbarActions([ data.fileDocxFav.name, file3 ], data.multipleSel.searchToolbarPrimary, data.multipleSelAllFav.toolbarMore);
      });
    });

    it('multiple folders - []', async () => {
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.searchFor('folder-');

      await testUtil.checkMultipleSelContextMenu([ data.folder.name, data.folderFav.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.folder.name, data.folderFav.name ], data.multipleSel.searchToolbarPrimary, data.multipleSel.toolbarMore);
    });

    it('both files and folders - []', async () => {
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.searchFor(`=${data.file.name} or =${data.folderFav.name}`);

      await testUtil.checkMultipleSelContextMenu([ data.file.name, data.folderFav.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.file.name, data.folderFav.name ], data.multipleSel.searchToolbarPrimary, data.multipleSel.toolbarMore);
    });
  });
});
