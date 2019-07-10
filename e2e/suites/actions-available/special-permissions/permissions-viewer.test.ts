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

describe('Special permissions actions : in the Viewer : ', () => {

  const site = `site-private-${Utils.random()}`;

  const userConsumer = `consumer-${Utils.random()}`;

  let fileDocxFavId, fileFavId, fileDocxSharedId, fileDocxSharedFavId, fileSharedId, fileSharedFavId, fileLockedId, fileFavLockedId, fileSharedLockedId, fileSharedFavLockedId;

  const apis = {
    admin: new RepoClient(),
    userConsumer: new RepoClient(userConsumer, userConsumer)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const { searchInput } = page.header;

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

    done();
  });

  beforeAll(async (done) => {
    await apis.userConsumer.favorites.addFavoritesByIds('file', [
      fileDocxFavId,
      fileFavId,
      fileDocxSharedFavId,
      fileSharedFavId,
      fileFavLockedId,
      fileSharedFavLockedId
    ]);

    await apis.userConsumer.shared.shareFilesByIds([
      fileDocxSharedId,
      fileDocxSharedFavId,
      fileSharedId,
      fileSharedFavId,
      fileSharedLockedId,
      fileSharedFavLockedId
    ]);

    await apis.admin.nodes.lockFile(fileLockedId);
    await apis.admin.nodes.lockFile(fileFavLockedId);
    await apis.admin.nodes.lockFile(fileSharedLockedId);
    await apis.admin.nodes.lockFile(fileSharedFavLockedId);

    await apis.userConsumer.favorites.waitForApi({ expect: 6 });
    await apis.userConsumer.shared.waitForApi({ expect: 6 });
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

  describe('file opened from File Libraries', () => {

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

    it('File Office - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocx.name, data.fileDocx.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocx.name, data.fileDocx.viewerToolbarMore);
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarMore);
    });

    it('File simple - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.file.name, data.file.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.file.name, data.file.viewerToolbarMore);
    });

    it('File favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileFav.name, data.fileFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileFav.name, data.fileFav.viewerToolbarMore);
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileShared.name, data.fileShared.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileShared.name, data.fileShared.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarMore);
    });

    it('File locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileLocked.name, data.fileLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileLocked.name, data.fileLocked.viewerToolbarMore);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarMore);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });

  describe('file opened from Favorites', () => {

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickFavoritesAndWait();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('File Office, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarMore);
    });

    it('File favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileFav.name, data.fileFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileFav.name, data.fileFav.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarMore);
    });

    it('File favorite, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });

  describe('file opened from Shared Files', () => {

    beforeEach(async (done) => {
      await Utils.pressEscape();
      await page.clickSharedFilesAndWait();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('File Office, shared - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileShared.name, data.fileShared.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileShared.name, data.fileShared.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarMore);
    });

    it('File shared, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });

  describe('file opened from Search Results', () => {

    beforeAll(async (done) => {
      await Utils.pressEscape();
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.checkOnlyFiles();
      await searchInput.searchFor('file-');
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('File Office - []', async () => {
      // await searchInput.clickSearchButton();
      // await searchInput.checkOnlyFiles();
      // await searchInput.searchFor('file-');

      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocx.name, data.fileDocx.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocx.name, data.fileDocx.viewerToolbarMore);
    });

    it('File Office, favorite - []', async () => {
      // await searchInput.clickSearchButton();
      // await searchInput.checkOnlyFiles();
      // await searchInput.searchFor('file-');

      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxFav.name, data.fileDocxFav.viewerToolbarMore);
    });

    it('File simple - []', async () => {
      // await searchInput.clickSearchButton();
      // await searchInput.checkOnlyFiles();
      // await searchInput.searchFor('file-');

      await testUtil.checkViewerToolbarPrimaryActions(data.file.name, data.file.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.file.name, data.file.viewerToolbarMore);
    });

    it('File favorite - []', async () => {
      // await searchInput.clickSearchButton();
      // await searchInput.checkOnlyFiles();
      // await searchInput.searchFor('file-');

      await testUtil.checkViewerToolbarPrimaryActions(data.fileFav.name, data.fileFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileFav.name, data.fileFav.viewerToolbarMore);
    });

    it('File Office, shared - []', async () => {
      // await searchInput.clickSearchButton();
      // await searchInput.checkOnlyFiles();
      // await searchInput.searchFor('file-');

      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxShared.name, data.fileDocxShared.viewerToolbarMore);
    });

    it('File Office, shared, favorite - []', async () => {
      // await searchInput.clickSearchButton();
      // await searchInput.checkOnlyFiles();
      // await searchInput.searchFor('file-');

      await testUtil.checkViewerToolbarPrimaryActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileDocxSharedFav.name, data.fileDocxSharedFav.viewerToolbarMore);
    });

    it('File shared - []', async () => {
      // await searchInput.clickSearchButton();
      // await searchInput.checkOnlyFiles();
      // await searchInput.searchFor('file-');

      await testUtil.checkViewerToolbarPrimaryActions(data.fileShared.name, data.fileShared.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileShared.name, data.fileShared.viewerToolbarMore);
    });

    it('File shared, favorite - []', async () => {
      // await searchInput.clickSearchButton();
      // await searchInput.checkOnlyFiles();
      // await searchInput.searchFor('file-');

      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFav.name, data.fileSharedFav.viewerToolbarMore);
    });

    it('File locked - []', async () => {
      // await searchInput.clickSearchButton();
      // await searchInput.checkOnlyFiles();
      // await searchInput.searchFor('file-');

      await testUtil.checkViewerToolbarPrimaryActions(data.fileLocked.name, data.fileLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileLocked.name, data.fileLocked.viewerToolbarMore);
    });

    it('File favorite, locked - []', async () => {
      // await searchInput.clickSearchButton();
      // await searchInput.checkOnlyFiles();
      // await searchInput.searchFor('file-');

      await testUtil.checkViewerToolbarPrimaryActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileFavLocked.name, data.fileFavLocked.viewerToolbarMore);
    });

    it('File shared, locked - []', async () => {
      // await searchInput.clickSearchButton();
      // await searchInput.checkOnlyFiles();
      // await searchInput.searchFor('file-');

      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedLocked.name, data.fileSharedLocked.viewerToolbarMore);
    });

    it('File shared, favorite, locked - []', async () => {
      // await searchInput.clickSearchButton();
      // await searchInput.checkOnlyFiles();
      // await searchInput.searchFor('file-');

      await testUtil.checkViewerToolbarPrimaryActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarPrimary);
      await testUtil.checkViewerToolbarMoreActions(data.fileSharedFavLocked.name, data.fileSharedFavLocked.viewerToolbarMore);
    });
  });
});
