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

describe('Special permissions actions : on Shared Files : ', () => {
  const random = Utils.random();

  const site = `site-private-${random}`;

  const userConsumer = `consumer-${random}`;

  const file3 = `file-3-${random}.txt`;
  let file3Id: string;

  let fileDocxSharedId: string;
  let fileDocxSharedFavId: string;
  let fileSharedId: string;
  let fileSharedFavId: string;
  let fileSharedLockedId: string;
  let fileSharedFavLockedId: string;

  const adminApiActions = new AdminActions();

  const userApi = new RepoClient(userConsumer, userConsumer);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();

  beforeAll(async () => {
    await adminApiActions.createUser({ username: userConsumer });

    await adminApiActions.sites.createSitePrivate(site);
    const docLibId = await adminApiActions.sites.getDocLibId(site);
    await adminApiActions.sites.addSiteConsumer(site, userConsumer);

    fileDocxSharedId = (await adminApiActions.upload.uploadFileWithRename(FILES.docxFile, docLibId, data.fileDocxShared.name)).entry.id;
    fileDocxSharedFavId = (await adminApiActions.upload.uploadFileWithRename(FILES.docxFile, docLibId, data.fileDocxSharedFav.name)).entry.id;
    fileSharedId = (await adminApiActions.nodes.createFile(data.fileShared.name, docLibId)).entry.id;
    fileSharedFavId = (await adminApiActions.nodes.createFile(data.fileSharedFav.name, docLibId)).entry.id;
    fileSharedLockedId = (await adminApiActions.nodes.createFile(data.fileSharedLocked.name, docLibId)).entry.id;
    fileSharedFavLockedId = (await adminApiActions.nodes.createFile(data.fileSharedFavLocked.name, docLibId)).entry.id;

    file3Id = (await adminApiActions.nodes.createFile(file3, docLibId)).entry.id;

    await userApi.favorites.addFavoritesByIds('file', [
      fileDocxSharedFavId,
      fileSharedFavId,
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

    await adminApiActions.nodes.lockFile(fileSharedLockedId);
    await adminApiActions.nodes.lockFile(fileSharedFavLockedId);

    await adminApiActions.nodes.setGranularPermission(file3Id, false, userConsumer, SITE_ROLES.SITE_MANAGER.ROLE);

    await Promise.all([
      userApi.favorites.waitForApi({ expect: 4 }),
      userApi.shared.waitForApi({ expect: 7 })
    ]);

    await loginPage.loginWith(userConsumer);

    await page.clickSharedFilesAndWait();
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

  describe('single selection', () => {

    it('File Office, shared - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocxShared.name, data.fileDocxShared.toolbarPrimary, data.fileDocxShared.sharedToolbarMore);
      await testUtil.checkContextMenu(data.fileDocxShared.name, data.fileDocxShared.sharedContextMenu);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.toolbarPrimary, data.fileDocxSharedFav.sharedToolbarMore);
      await testUtil.checkContextMenu(data.fileDocxSharedFav.name, data.fileDocxSharedFav.sharedContextMenu);
    });

    it('File shared - []', async () => {
      await testUtil.checkToolbarActions(data.fileShared.name, data.fileShared.toolbarPrimary, data.fileShared.sharedToolbarMore);
      await testUtil.checkContextMenu(data.fileShared.name, data.fileShared.sharedContextMenu);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkToolbarActions(data.fileSharedFav.name, data.fileSharedFav.toolbarPrimary, data.fileSharedFav.sharedToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFav.name, data.fileSharedFav.sharedContextMenu);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileSharedLocked.name, data.fileSharedLocked.toolbarPrimary, data.fileSharedLocked.sharedToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedLocked.name, data.fileSharedLocked.sharedContextMenu);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkToolbarActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.toolbarPrimary, data.fileSharedFavLocked.sharedToolbarMore);
      await testUtil.checkContextMenu(data.fileSharedFavLocked.name, data.fileSharedFavLocked.sharedContextMenu);
    });
  });

  describe('multiple selection', () => {
    it('multiple files - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileShared.name, data.fileSharedFav.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileShared.name, data.fileSharedFav.name ], data.multipleSel.toolbarPrimary, data.multipleSel.toolbarMore);
    });

    it('multiple files - all favorite - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileSharedFav.name, data.fileSharedFavLocked.name ], data.multipleSelAllFav.contextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileSharedFav.name, data.fileSharedFavLocked.name ], data.multipleSel.toolbarPrimary, data.multipleSelAllFav.toolbarMore);
    });

    it('multiple locked files - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileSharedLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.contextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileSharedLocked.name, data.fileSharedFavLocked.name ], data.multipleSel.toolbarPrimary, data.multipleSel.toolbarMore);
    });

    it('multiple files with different granular permissions - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.fileSharedFav.name, file3 ], data.multipleSelAllFav.contextMenu);
      await testUtil.checkMultipleSelToolbarActions([ data.fileSharedFav.name, file3 ], data.multipleSel.toolbarPrimary, data.multipleSelAllFav.toolbarMore);
    });
  });

});
