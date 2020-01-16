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
import * as data from './test-data-permissions';
import { AdminActions } from '../../../utilities/admin-actions';
import * as testUtil from '../test-util';

describe('Special permissions actions : in the Viewer : ', () => {

  const random = Utils.random();

  const site = `site-private-${random}`;

  const userConsumer = `consumer-${random}`;

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

  const adminApiActions = new AdminActions();

  const userApi = new RepoClient(userConsumer, userConsumer);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const searchResultsPage = new SearchResultsPage();
  const { dataTable } = page;
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

    await adminApiActions.nodes.lockFile(fileLockedId);
    await adminApiActions.nodes.lockFile(fileFavLockedId);
    await adminApiActions.nodes.lockFile(fileSharedLockedId);
    await adminApiActions.nodes.lockFile(fileSharedFavLockedId);

    await Promise.all([
      userApi.favorites.waitForApi({ expect: 6 }),
      userApi.shared.waitForApi({ expect: 6 })
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

  describe('file opened from File Libraries', () => {

    beforeAll(async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(site);
      await dataTable.waitForHeader();
    });

    it('File Office - []', async () => {
      await testUtil.checkViewerActions(data.fileDocx.name, data.fileDocx.viewerToolbarPrimary, data.fileDocx.viewerToolbarMore);
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarPrimary, data.fileDocxFav.viewerToolbarMore);
    });

    it('File simple - []', async () => {
      await testUtil.checkViewerActions(data.file.name, data.file.viewerToolbarPrimary, data.file.viewerToolbarMore);
    });

    it('File favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileFav.name, data.fileFav.viewerToolbarPrimary, data.fileFav.viewerToolbarMore);
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarPrimary, data.fileDocxShared.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared - []', async () => {
      await testUtil.checkViewerActions(data.fileShared.name, data.fileShared.viewerToolbarPrimary, data.fileShared.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary, data.fileSharedFav.viewerToolbarMore);
    });

    it('File locked - []', async () => {
      await testUtil.checkViewerActions(data.fileLocked.name, data.fileLocked.viewerToolbarPrimary, data.fileLocked.viewerToolbarMore);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarPrimary, data.fileFavLocked.viewerToolbarMore);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarPrimary, data.fileSharedLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });

  describe('file opened from Favorites', () => {

    beforeAll(async () => {
      await page.clickFavoritesAndWait();
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarPrimary, data.fileDocxFav.viewerToolbarMore);
    });

    it('File favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileFav.name, data.fileFav.viewerToolbarPrimary, data.fileFav.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary, data.fileSharedFav.viewerToolbarMore);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarPrimary, data.fileFavLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });

  describe('file opened from Shared Files', () => {

    beforeAll(async () => {
      await page.clickSharedFilesAndWait();
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarPrimary, data.fileDocxShared.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared - []', async () => {
      await testUtil.checkViewerActions(data.fileShared.name, data.fileShared.viewerToolbarPrimary, data.fileShared.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary, data.fileSharedFav.viewerToolbarMore);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarPrimary, data.fileSharedLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });

  describe('file opened from Search Results', () => {

    beforeAll(async () => {
      await searchInput.clickSearchButton();
      await searchInput.searchFor('file-');
      await searchResultsPage.waitForResults();
    });

    it('File Office - []', async () => {
      await testUtil.checkViewerActions(data.fileDocx.name, data.fileDocx.viewerToolbarPrimary, data.fileDocx.viewerToolbarMore);
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarPrimary, data.fileDocxFav.viewerToolbarMore);
    });

    it('File simple - []', async () => {
      await testUtil.checkViewerActions(data.file.name, data.file.viewerToolbarPrimary, data.file.viewerToolbarMore);
    });

    it('File favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileFav.name, data.fileFav.viewerToolbarPrimary, data.fileFav.viewerToolbarMore);
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarPrimary, data.fileDocxShared.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared - []', async () => {
      await testUtil.checkViewerActions(data.fileShared.name, data.fileShared.viewerToolbarPrimary, data.fileShared.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary, data.fileSharedFav.viewerToolbarMore);
    });

    it('File locked - []', async () => {
      await testUtil.checkViewerActions(data.fileLocked.name, data.fileLocked.viewerToolbarPrimary, data.fileLocked.viewerToolbarMore);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarPrimary, data.fileFavLocked.viewerToolbarMore);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarPrimary, data.fileSharedLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });
});
