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

import { LoginPage, RepoClient, Utils, AdminActions, FILES, SITE_ROLES } from '@alfresco/aca-testing-shared';
import * as testData from './test-data-permissions';
import { librariesTests } from './my-libraries';
import { favoritesTests } from './favorites';
import { searchResultsTests } from './search-results';
import { viewerTests } from './viewer';
import { sharedFilesTests } from './shared-files';
import { collaboratorTests, filesLockedByCurrentUser, filesLockedByOtherUser } from './other-permissions';

describe('Special permissions : ', () => {
  const random = testData.random;

  const sitePrivate = `site-private-${random}`;

  const userManager = `manager-${random}`;
  const userConsumer = `consumer-${random}`;
  const userCollaborator = `collaborator-${random}`;
  const userDemoted = `demoted-${random}`;

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
  let fileGranularPermissionId: string;
  let fileLockedByUserId: string;
  let folderFavId: string;
  let folderFav2Id: string;

  const adminApiActions = new AdminActions();

  const userManagerApi = new RepoClient(userManager, userManager);
  const userConsumerApi = new RepoClient(userConsumer, userConsumer);
  const userCollaboratorApi = new RepoClient(userCollaborator, userCollaborator);
  const userDemotedApi = new RepoClient(userDemoted, userDemoted);

  const loginPage = new LoginPage();

  beforeAll(async () => {
    await adminApiActions.createUser({ username: userManager });
    await adminApiActions.createUser({ username: userConsumer });
    await adminApiActions.createUser({ username: userCollaborator });
    await adminApiActions.createUser({ username: userDemoted });

    const consumerFavoritesTotalItems = await userConsumerApi.favorites.getFavoritesTotalItems();
    const managerSearchTotalItems = await userManagerApi.search.getTotalItems(userManager);
    const collaboratorFavoritesTotalItems = await userCollaboratorApi.favorites.getFavoritesTotalItems();

    await userManagerApi.sites.createSitePrivate(sitePrivate);
    const docLibId = await userManagerApi.sites.getDocLibId(sitePrivate);
    await userManagerApi.sites.addSiteConsumer(sitePrivate, userConsumer);
    await userManagerApi.sites.addSiteCollaborator(sitePrivate, userCollaborator);
    await userManagerApi.sites.addSiteManager(sitePrivate, userDemoted);

    await userManagerApi.upload.uploadFileWithRename(FILES.docxFile, docLibId, testData.fileDocx.name);
    fileDocxFavId = (await userManagerApi.upload.uploadFileWithRename(FILES.docxFile, docLibId, testData.fileDocxFav.name)).entry.id;
    await userManagerApi.nodes.createFile(testData.file.name, docLibId);
    fileFavId = (await userManagerApi.nodes.createFile(testData.fileFav.name, docLibId)).entry.id;
    fileDocxSharedId = (await userManagerApi.upload.uploadFileWithRename(FILES.docxFile, docLibId, testData.fileDocxShared.name)).entry.id;
    fileDocxSharedFavId = (await userManagerApi.upload.uploadFileWithRename(FILES.docxFile, docLibId, testData.fileDocxSharedFav.name)).entry.id;
    fileSharedId = (await userManagerApi.nodes.createFile(testData.fileShared.name, docLibId)).entry.id;
    fileSharedFavId = (await userManagerApi.nodes.createFile(testData.fileSharedFav.name, docLibId)).entry.id;
    fileLockedId = (await userManagerApi.nodes.createFile(testData.fileLocked.name, docLibId)).entry.id;
    fileFavLockedId = (await userManagerApi.nodes.createFile(testData.fileFavLocked.name, docLibId)).entry.id;
    fileSharedLockedId = (await userManagerApi.nodes.createFile(testData.fileSharedLocked.name, docLibId)).entry.id;
    fileSharedFavLockedId = (await userManagerApi.nodes.createFile(testData.fileSharedFavLocked.name, docLibId)).entry.id;
    fileGranularPermissionId = (await userManagerApi.nodes.createFile(testData.fileGranularPermission, docLibId)).entry.id;

    fileLockedByUserId = (await userManagerApi.nodes.createFile(testData.fileLockedByUser, docLibId)).entry.id;
    await userDemotedApi.nodes.lockFile(fileLockedByUserId);
    await userDemotedApi.favorites.addFavoriteById('file', fileLockedByUserId);
    await userDemotedApi.shared.shareFileById(fileLockedByUserId);
    await userManagerApi.sites.updateSiteMember(sitePrivate, userDemoted, SITE_ROLES.SITE_CONSUMER.ROLE);

    await userManagerApi.nodes.createFolder(testData.folder.name, docLibId);
    folderFavId = (await userManagerApi.nodes.createFolder(testData.folderFav.name, docLibId)).entry.id;
    folderFav2Id = (await userManagerApi.nodes.createFolder(testData.folderFav2.name, docLibId)).entry.id;
    await userConsumerApi.favorites.addFavoritesByIds('folder', [folderFavId, folderFav2Id]);

    await userConsumerApi.favorites.addFavoritesByIds('file', [
      fileDocxFavId,
      fileFavId,
      fileDocxSharedFavId,
      fileSharedFavId,
      fileFavLockedId,
      fileSharedFavLockedId,
      fileGranularPermissionId
    ]);

    await userConsumerApi.shared.shareFilesByIds([
      fileDocxSharedId,
      fileDocxSharedFavId,
      fileSharedId,
      fileSharedFavId,
      fileSharedLockedId,
      fileSharedFavLockedId,
      fileGranularPermissionId
    ]);

    await userCollaboratorApi.favorites.addFavoritesByIds('file', [fileDocxSharedFavId, fileSharedFavId]);

    await userManagerApi.nodes.lockFile(fileLockedId);
    await userManagerApi.nodes.lockFile(fileFavLockedId);
    await userManagerApi.nodes.lockFile(fileSharedLockedId);
    await userManagerApi.nodes.lockFile(fileSharedFavLockedId);

    await userManagerApi.nodes.setGranularPermission(fileGranularPermissionId, false, userConsumer, SITE_ROLES.SITE_MANAGER.ROLE);

    await userManagerApi.favorites.addFavoriteById('file', fileLockedByUserId);

    await Promise.all([
      userConsumerApi.favorites.waitForApi({ expect: consumerFavoritesTotalItems + 9 }),
      userManagerApi.shared.waitForFilesToBeShared([
        fileDocxSharedId,
        fileDocxSharedFavId,
        fileSharedId,
        fileSharedFavId,
        fileSharedLockedId,
        fileSharedFavLockedId,
        fileGranularPermissionId,
        fileLockedByUserId
      ]),
      userManagerApi.search.waitForApi(userManager, { expect: managerSearchTotalItems + 14 }),
      userCollaboratorApi.favorites.waitForApi({ expect: collaboratorFavoritesTotalItems + 2 })
    ]);
  });

  afterAll(async () => {
    await userManagerApi.sites.deleteSite(sitePrivate);
  });

  beforeEach(async () => {
    await Utils.pressEscape();
  });

  describe('Consumer', () => {
    beforeAll(async () => {
      await loginPage.loginWith(userConsumer);
    });

    describe('on File Libraries', () => {
      librariesTests(sitePrivate);
    });

    describe('on Favorites', () => {
      favoritesTests();
    });

    describe('on Search Results', () => {
      searchResultsTests();
    });

    describe('on Viewer', () => {
      viewerTests(sitePrivate);
    });

    describe('on Shared Files', () => {
      sharedFilesTests();
    });
  });

  describe('Collaborator', () => {
    beforeAll(async () => {
      await loginPage.loginWith(userCollaborator);
    });

    collaboratorTests(sitePrivate);
  });

  describe('File locked - user is lock owner', () => {
    beforeAll(async () => {
      await loginPage.loginWith(userDemoted);
    });

    filesLockedByCurrentUser(sitePrivate);
  });

  describe('File locked by other user - user is manager', () => {
    beforeAll(async () => {
      await loginPage.loginWith(userManager);
    });

    filesLockedByOtherUser(sitePrivate);
  });
});
