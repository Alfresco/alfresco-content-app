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
import { FILES, SITE_VISIBILITY, SITE_ROLES } from '../../../configs';
import { RepoClient } from '../../../utilities/repo-client/repo-client';
import { Utils } from '../../../utilities/utils';
import * as data from './test-data-permissions';
import * as testUtil from '../test-util';

describe('Special permissions actions : on File Libraries : ', () => {

  const site = `site-private-${Utils.random()}`;

  const userConsumer = `consumer-${Utils.random()}`;

  const file3 = `file-3-${Utils.random()}.txt`;
  let file3Id;

  let fileDocxFavId, fileFavId, fileDocxSharedId, fileDocxSharedFavId, fileSharedId, fileSharedFavId, fileLockedId, fileFavLockedId, fileSharedLockedId, fileSharedFavLockedId;
  let folderFavId;

  const apis = {
    admin: new RepoClient(),
    userConsumer: new RepoClient(userConsumer, userConsumer)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username: userConsumer });

    await apis.admin.sites.createSite(site, SITE_VISIBILITY.PRIVATE);
    const docLibId = await apis.admin.sites.getDocLibId(site);
    await apis.admin.sites.addSiteMember(site, userConsumer, SITE_ROLES.SITE_CONSUMER.ROLE);

    await apis.admin.upload.uploadFileWithRename(FILES.docxFile, docLibId, data.fileDocx.name );
    fileDocxFavId = (await apis.admin.upload.uploadFileWithRename(FILES.docxFile, docLibId, data.fileDocxFav.name)).entry.id;
    await apis.admin.nodes.createFile(data.file.name, docLibId);
    fileFavId = (await apis.admin.nodes.createFile(data.fileFav.name, docLibId)).entry.id;
    fileDocxSharedId = (await apis.admin.upload.uploadFileWithRename(FILES.docxFile, docLibId, data.fileDocxShared.name)).entry.id;
    fileDocxSharedFavId = (await apis.admin.upload.uploadFileWithRename(FILES.docxFile, docLibId, data.fileDocxSharedFav.name)).entry.id;
    fileSharedId = (await apis.admin.nodes.createFile(data.fileShared.name, docLibId)).entry.id;
    fileSharedFavId = (await apis.admin.nodes.createFile(data.fileSharedFav.name, docLibId)).entry.id;
    fileLockedId = (await apis.admin.nodes.createFile(data.fileLocked.name, docLibId)).entry.id;
    fileFavLockedId = (await apis.admin.nodes.createFile(data.fileFavLocked.name, docLibId)).entry.id;
    fileSharedLockedId = (await apis.admin.nodes.createFile(data.fileSharedLocked.name, docLibId)).entry.id;
    fileSharedFavLockedId = (await apis.admin.nodes.createFile(data.fileSharedFavLocked.name, docLibId)).entry.id;

    file3Id = (await apis.admin.nodes.createFile(file3, docLibId)).entry.id;

    await apis.admin.nodes.createFolder(data.folder.name, docLibId);
    folderFavId = (await apis.admin.nodes.createFolder(data.folderFav.name, docLibId)).entry.id;
    done();
  });

  beforeAll(async (done) => {
    await apis.userConsumer.favorites.addFavoriteById('folder', folderFavId);

    await apis.userConsumer.favorites.addFavoritesByIds('file', [
      fileDocxFavId,
      fileFavId,
      fileDocxSharedFavId,
      fileSharedFavId,
      fileFavLockedId,
      fileSharedFavLockedId,
      file3Id
    ]);

    await apis.userConsumer.shared.shareFilesByIds([
      fileDocxSharedId,
      fileDocxSharedFavId,
      fileSharedId,
      fileSharedFavId,
      fileSharedLockedId,
      fileSharedFavLockedId,
      file3Id
    ]);

    await apis.admin.nodes.lockFile(fileLockedId);
    await apis.admin.nodes.lockFile(fileFavLockedId);
    await apis.admin.nodes.lockFile(fileSharedLockedId);
    await apis.admin.nodes.lockFile(fileSharedFavLockedId);

    await apis.admin.nodes.setGranularPermission(file3Id, false, userConsumer, SITE_ROLES.SITE_MANAGER.ROLE);

    await apis.userConsumer.favorites.waitForApi({ expect: 8 });
    await apis.userConsumer.shared.waitForApi({ expect: 7 });
    done();
  });

  beforeAll(async (done) => {
    await loginPage.loginWith(userConsumer);
    done();
  });

  afterAll(async (done) => {
    await apis.admin.sites.deleteSite(site);
    done();
  });

  beforeEach(async (done) => {
    await Utils.pressEscape();
    await page.goToMyLibrariesAndWait();
    await dataTable.doubleClickOnRowByName(site);
    await dataTable.waitForHeader();
    done();
  });

  afterEach(async (done) => {
    await Utils.pressEscape();
    done();
  });

  describe('on a file', () => {

    it('File Office - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileDocx.name, data.fileDocx.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileDocx.name, data.fileDocx.toolbarMore);
      await testUtil.checkContextMenu(data.fileDocx.name, data.fileDocx.contextMenu);
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileDocxFav.name, data.fileDocxFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileDocxFav.name, data.fileDocxFav.toolbarMore);
      await testUtil.checkContextMenu(data.fileDocxFav.name, data.fileDocxFav.contextMenu);
   });

    it('File simple - []', async () => {
      await testUtil.checkToolbarPrimary(data.file.name, data.file.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.file.name, data.file.toolbarMore);
      await testUtil.checkContextMenu(data.file.name, data.file.contextMenu);
   });

    it('File favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileFav.name, data.fileFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileFav.name, data.fileFav.toolbarMore);
      await testUtil.checkContextMenu(data.fileFav.name, data.fileFav.contextMenu);
   });

    it('File Office, shared - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileDocxShared.name, data.fileDocxShared.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileDocxShared.name, data.fileDocxShared.toolbarMore);
      await testUtil.checkContextMenu(data.fileDocxShared.name, data.fileDocxShared.contextMenu);
   });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileDocxSharedFav.name, data.fileDocxSharedFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.toolbarMore);
      await testUtil.checkContextMenu(data.fileDocxSharedFav.name, data.fileDocxSharedFav.contextMenu);
    });

    it('File shared - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileShared.name, data.fileShared.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileShared.name, data.fileShared.toolbarMore);
      await testUtil.checkContextMenu(data.fileShared.name, data.fileShared.contextMenu);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileSharedFav.name, data.fileSharedFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileSharedFav.name, data.fileSharedFav.toolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFav.name, data.fileSharedFav.contextMenu);
   });

    it('File locked - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileLocked.name, data.fileLocked.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileLocked.name, data.fileLocked.toolbarMore);
      await testUtil.checkContextMenu(data.fileLocked.name, data.fileLocked.contextMenu);
   });

    it('File favorite, locked - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileFavLocked.name, data.fileFavLocked.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileFavLocked.name, data.fileFavLocked.toolbarMore);
      await testUtil.checkContextMenu(data.fileFavLocked.name, data.fileFavLocked.contextMenu);
   });

    it('File shared, locked - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileSharedLocked.name, data.fileSharedLocked.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileSharedLocked.name, data.fileSharedLocked.toolbarMore);
      await testUtil.checkContextMenu(data.fileSharedLocked.name, data.fileSharedLocked.contextMenu);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkToolbarPrimary(data.fileSharedFavLocked.name, data.fileSharedFavLocked.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.toolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFavLocked.name, data.fileSharedFavLocked.contextMenu);
    });
  });

  describe('on a folder', () => {

    it('Folder not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.folder.name, data.folder.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.folder.name, data.folder.toolbarMore);
      await testUtil.checkContextMenu(data.folder.name, data.folder.contextMenu);
    });

    it('Folder favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.folderFav.name, data.folderFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.folderFav.name, data.folderFav.toolbarMore);
      await testUtil.checkContextMenu(data.folderFav.name, data.folderFav.contextMenu);
    });
  });

  describe('on multiple selection', () => {
    it('multiple files - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileDocx.name, data.fileDocxSharedFav.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileDocx.name, data.fileDocxSharedFav.name ], data.multipleSel.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileDocx.name, data.fileDocxSharedFav.name ], data.multipleSel.toolbarMore);
    });

    it('multiple files - all favorite - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileDocxFav.name, data.fileDocxSharedFav.name ], data.multipleSelAllFav.contextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileDocxFav.name, data.fileDocxSharedFav.name ], data.multipleSel.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileDocxFav.name, data.fileDocxSharedFav.name ], data.multipleSelAllFav.toolbarMore);
    });

    it('multiple locked files - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.toolbarMore);
    });

    it('multiple folders - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.folderFav.name, data.folder.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.folderFav.name, data.folder.name ], data.multipleSel.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.folderFav.name, data.folder.name ], data.multipleSel.toolbarMore);
    });

    it('both files and folders - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.file.name, data.folder.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.file.name, data.folder.name ], data.multipleSel.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.file.name, data.folder.name ], data.multipleSel.toolbarMore);
    });

    it('multiple files with different granular permissions - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileDocxFav.name, file3 ], data.multipleSelAllFav.contextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileDocxFav.name, file3 ], data.multipleSel.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileDocxFav.name, file3 ], data.multipleSelAllFav.toolbarMore);
    });
  });
});
