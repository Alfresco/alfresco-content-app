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
import { SITE_ROLES, FILES } from '../../../configs';
import { RepoClient } from '../../../utilities/repo-client/repo-client';
import { Utils } from '../../../utilities/utils';
import { AdminActions } from '../../../utilities/admin-actions';
import * as testUtil from '../test-util';

describe('', () => {
  const random = Utils.random();

  const userConsumer = `consumer-${random}`;
  const userCollaborator = `collaborator-${random}`;
  const userDemoted = `demoted-${random}`;

  const siteName = `site-private-${random}`;
  const file1 = `my-file1-${random}.txt`;
  let file1Id: string;
  const file2 = `my-file2-${random}.txt`;
  let file2Id: string;
  const file3 = `my-file3-${random}.txt`;
  let file3Id: string;
  const fileLocked = `my-file-locked-${random}.txt`;
  let fileLockedId: string;

  const folder1 = `my-folder1-${random}`;
  let folder1Id: string;
  const folder2 = `my-folder2-${random}`;
  let folder2Id: string;

  const docxFile = FILES.docxFile;
  let docxFileId: string;

  const adminApiActions = new AdminActions();

  const apis = {
    userConsumer: new RepoClient(userConsumer, userConsumer),
    userCollaborator: new RepoClient(userCollaborator, userCollaborator),
    userDemoted: new RepoClient(userDemoted, userDemoted)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const searchResultsPage = new SearchResultsPage();
  const { searchInput } = searchResultsPage.header;

  beforeAll(async () => {
    await adminApiActions.createUser({ username: userConsumer });
    await adminApiActions.createUser({ username: userCollaborator });
    await adminApiActions.createUser({ username: userDemoted });

    await adminApiActions.sites.createSitePrivate(siteName);
    const docLibId = await adminApiActions.sites.getDocLibId(siteName);

    file1Id = (await adminApiActions.nodes.createFile(file1, docLibId)).entry.id;
    file2Id = (await adminApiActions.nodes.createFile(file2, docLibId)).entry.id;
    file3Id = (await adminApiActions.nodes.createFile(file3, docLibId)).entry.id;
    folder1Id = (await adminApiActions.nodes.createFolder(folder1, docLibId)).entry.id;
    folder2Id = (await adminApiActions.nodes.createFolder(folder2, docLibId)).entry.id;

    docxFileId = (await adminApiActions.upload.uploadFile(docxFile, docLibId)).entry.id;

    await adminApiActions.sites.addSiteConsumer(siteName, userConsumer);
    await adminApiActions.sites.addSiteCollaborator(siteName, userCollaborator);
    await adminApiActions.sites.addSiteManager(siteName, userDemoted);

    fileLockedId = (await adminApiActions.nodes.createFile(fileLocked, docLibId)).entry.id;
    await apis.userDemoted.nodes.lockFile(fileLockedId);
    await apis.userDemoted.favorites.addFavoriteById('file', fileLockedId);
    await apis.userDemoted.shared.shareFileById(fileLockedId);
    await adminApiActions.sites.updateSiteMember(siteName, userDemoted, SITE_ROLES.SITE_CONSUMER.ROLE);

    await adminApiActions.nodes.setGranularPermission(file3Id, false, userConsumer, SITE_ROLES.SITE_MANAGER.ROLE);

    await apis.userConsumer.shared.shareFilesByIds([file1Id, file2Id, docxFileId, file3Id]);

    await apis.userConsumer.favorites.addFavoritesByIds('file', [file1Id, file2Id, file3Id, docxFileId]);
    await apis.userConsumer.favorites.addFavoritesByIds('folder', [folder1Id, folder2Id]);

    await apis.userCollaborator.favorites.addFavoritesByIds('file', [file1Id, docxFileId]);

    await adminApiActions.favorites.addFavoriteById('file', fileLockedId);

    await Promise.all([
      apis.userConsumer.shared.waitForApi({ expect: 5 }),
      apis.userConsumer.favorites.waitForApi({ expect: 6 }),
      apis.userCollaborator.favorites.waitForApi({ expect: 2 })
    ]);
  });

  afterAll(async () => {
    await adminApiActions.sites.deleteSite(siteName);
  });

  beforeEach(async () => {
    await Utils.pressEscape();
  });

  afterEach(async () => {
    await page.closeOpenDialogs();
  });

  describe('Collaborator', () => {
    beforeAll(async () => {
      await loginPage.loginWith(userCollaborator);
    });

    it('on File Libraries - [C297647]', async () => {
      await page.clickFileLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];

      await testUtil.checkToolbarActions(file1, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Shared Files - [C297651]', async () => {
      await page.clickSharedFilesAndWait();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      // TODO: add 'Edit Offline' when ACA-2173 is done
      const expectedToolbarMore = ['Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];

      await testUtil.checkToolbarActions(file1, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Favorites - [C297652]', async () => {
      await page.clickFavoritesAndWait();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      // TODO: add 'Edit Offline' when ACA-2174 is done
      // TODO: remove 'Delete' when ACA-1737 is done
      // TODO: remove 'Move' when ACA-1737 is done
      const expectedToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];

      await testUtil.checkToolbarActions(file1, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Search Results - [C297653]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.searchFor(file1);

      const expectedToolbarPrimary = ['Toggle search filter', 'Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];

      await testUtil.checkToolbarActions(file1, expectedToolbarPrimary, expectedToolbarMore);
    });

    describe('in the viewer', () => {
      it('file opened from File Libraries - [C297654]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];

        await testUtil.checkViewerActions(docxFile, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Shared Files - [C297655]', async () => {
        await page.clickSharedFilesAndWait();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];

        await testUtil.checkViewerActions(docxFile, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Favorites - [C297656]', async () => {
        await page.clickFavoritesAndWait();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];

        await testUtil.checkViewerActions(docxFile, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Search Results - [C306992]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.searchFor(docxFile);
        await searchResultsPage.waitForResults();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];

        await testUtil.checkViewerActions(docxFile, expectedToolbarPrimary, expectedToolbarMore);
      });
    });
  });

  describe('File locked - lock owner : ', () => {
    beforeAll(async () => {
      await loginPage.loginWith(userDemoted);
    });

    it('on File Libraries - [C297657]', async () => {
      await page.clickFileLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

      await testUtil.checkToolbarActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Shared Files - [C297658]', async () => {
      await page.clickSharedFilesAndWait();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      // TODO: add 'Cancel Editing' when ACA-2173 is done
      const expectedToolbarMore = ['Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

      await testUtil.checkToolbarActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Favorites - [C297659]', async () => {
      await page.clickFavoritesAndWait();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      // TODO: add 'Cancel Editing' when ACA-2174 is fixed
      // TODO: remove 'Move' when ACA-1737 is fixed
      // TODO: remove 'Delete' when ACA-1737 is fixed
      const expectedToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];

      await testUtil.checkToolbarActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Search Results - [C297660]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.searchFor(fileLocked);
      await searchResultsPage.waitForResults();

      const expectedToolbarPrimary = ['Toggle search filter', 'Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

      await testUtil.checkToolbarActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
    });

    describe('in the viewer', () => {
      it('file opened from File Libraries - [C297661]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

        await testUtil.checkViewerActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Shared Files - [C297662]', async () => {
        await page.clickSharedFilesAndWait();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

        await testUtil.checkViewerActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Favorites - [C297663]', async () => {
        await page.clickFavoritesAndWait();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

        await testUtil.checkViewerActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Search Results - [C306993]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.searchFor(fileLocked);
        await searchResultsPage.waitForResults();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

        await testUtil.checkViewerActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
      });
    });
  });

  describe('File locked by other user - manager : ', () => {
    beforeAll(async () => {
      await loginPage.loginWithAdmin();
    });

    it('on File Libraries - [C297664]', async () => {
      await page.clickFileLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];

      await testUtil.checkToolbarActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Shared Files - [C297665]', async () => {
      await page.clickSharedFilesAndWait();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      // TODO: add 'Cancel Editing' when ACA-2173 is done
      // TODO: remove 'Upload New Version' when ACA-2173 is done
      const expectedToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];

      await testUtil.checkToolbarActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Favorites - [C297666]', async () => {
      await page.clickFavoritesAndWait();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      // TODO: add 'Cancel Editing' when ACA-2174 is fixed
      // TODO: remove 'Upload New Version' when ACA-1737 is done
      const expectedToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];

      await testUtil.checkToolbarActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Search Results - [C297667]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.searchFor(fileLocked);
      await searchResultsPage.waitForResults();

      const expectedToolbarPrimary = ['Toggle search filter', 'Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];

      await testUtil.checkToolbarActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
    });

    describe('in the viewer', () => {
      it('file opened from File Libraries - [C297671]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];

        await testUtil.checkViewerActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Shared Files - [C297672]', async () => {
        await page.clickSharedFilesAndWait();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];

        await testUtil.checkViewerActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Favorites - [C297673]', async () => {
        await page.clickFavoritesAndWait();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];

        await testUtil.checkViewerActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Search Results - [C306994]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.searchFor(fileLocked);
        await searchResultsPage.waitForResults();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        // TODO: add 'Move' when ACA-2319 is fixed
        // TODO: add 'Delete' when ACA-2319 is fixed
        const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];

        await testUtil.checkViewerActions(fileLocked, expectedToolbarPrimary, expectedToolbarMore);
      });
    });
  });
});
