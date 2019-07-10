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

describe('Special permissions actions : on Shared Files : ', () => {

  const site = `site-private-${Utils.random()}`;

  const userConsumer = `consumer-${Utils.random()}`;

  const file3 = `file-3-${Utils.random()}.txt`;
  let file3Id;

  let fileDocxSharedId, fileDocxSharedFavId, fileSharedId, fileSharedFavId, fileSharedLockedId, fileSharedFavLockedId;

  const apis = {
    admin: new RepoClient(),
    userConsumer: new RepoClient(userConsumer, userConsumer)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username: userConsumer });

    await apis.admin.sites.createSite(site, SITE_VISIBILITY.PRIVATE);
    const docLibId = await apis.admin.sites.getDocLibId(site);
    await apis.admin.sites.addSiteMember(site, userConsumer, SITE_ROLES.SITE_CONSUMER.ROLE);

    fileDocxSharedId = (await apis.admin.upload.uploadFileWithRename(FILES.docxFile, docLibId, data.fileDocxShared.name)).entry.id;
    fileDocxSharedFavId = (await apis.admin.upload.uploadFileWithRename(FILES.docxFile, docLibId, data.fileDocxSharedFav.name)).entry.id;
    fileSharedId = (await apis.admin.nodes.createFile(data.fileShared.name, docLibId)).entry.id;
    fileSharedFavId = (await apis.admin.nodes.createFile(data.fileSharedFav.name, docLibId)).entry.id;
    fileSharedLockedId = (await apis.admin.nodes.createFile(data.fileSharedLocked.name, docLibId)).entry.id;
    fileSharedFavLockedId = (await apis.admin.nodes.createFile(data.fileSharedFavLocked.name, docLibId)).entry.id;

    file3Id = (await apis.admin.nodes.createFile(file3, docLibId)).entry.id;

    await apis.userConsumer.favorites.addFavoritesByIds('file', [
      fileDocxSharedFavId,
      fileSharedFavId,
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

    await apis.admin.nodes.lockFile(fileSharedLockedId);
    await apis.admin.nodes.lockFile(fileSharedFavLockedId);

    await apis.admin.nodes.setGranularPermission(file3Id, false, userConsumer, SITE_ROLES.SITE_MANAGER.ROLE);

    await apis.userConsumer.favorites.waitForApi({ expect: 7 });
    await apis.userConsumer.shared.waitForApi({ expect: 4 });

    await loginPage.loginWith(userConsumer);
    done();
  });

  afterAll(async (done) => {
    await apis
    await apis.admin.sites.deleteSite(site);
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
    it('multiple files - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileShared.name, data.fileSharedFav.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileShared.name, data.fileSharedFav.name ], data.multipleSel.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileShared.name, data.fileSharedFav.name ], data.multipleSel.toolbarMore);
    });

    it('multiple files - all favorite - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileSharedFav.name, data.fileSharedFavLocked.name ], data.multipleSelAllFav.contextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileSharedFav.name, data.fileSharedFavLocked.name ], data.multipleSel.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileSharedFav.name, data.fileSharedFavLocked.name ], data.multipleSelAllFav.toolbarMore);
    });

    it('multiple locked files - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileSharedLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileSharedLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileSharedLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.toolbarMore);
    });

    it('multiple files with different granular permissions - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileSharedFav.name, file3 ], data.multipleSelAllFav.contextMenu);
      await testUtil.checkMultipleSelToolbarPrimary([ data.fileSharedFav.name, file3 ], data.multipleSel.toolbarPrimary);
      await testUtil.checkMultipleSelToolbarMoreActions([ data.fileSharedFav.name, file3 ], data.multipleSelAllFav.toolbarMore);
    });
  });

});
