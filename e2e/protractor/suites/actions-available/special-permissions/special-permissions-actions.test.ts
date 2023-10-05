/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { LoginPage, RepoClient, Utils, AdminActions, FILES, SITE_ROLES, SITE_VISIBILITY, UserActions } from '@alfresco/aca-testing-shared';
import * as testData from './test-data-permissions';
import { librariesTests } from './my-libraries';
import { favoritesTests } from './favorites';
import { searchResultsTests } from './search-results';
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
  const managerActions = new UserActions();
  const demotedUserActions = new UserActions();

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

    await managerActions.login(userManager, userManager);
    await demotedUserActions.login(userDemoted, userDemoted);

    const consumerFavoritesTotalItems = await userConsumerApi.favorites.getFavoritesTotalItems();
    const managerSearchTotalItems = await userManagerApi.search.getTotalItems(userManager);
    const collaboratorFavoritesTotalItems = await userCollaboratorApi.favorites.getFavoritesTotalItems();

    await userManagerApi.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
    const docLibId = await userManagerApi.sites.getDocLibId(sitePrivate);
    await userManagerApi.sites.addSiteConsumer(sitePrivate, userConsumer);
    await userManagerApi.sites.addSiteCollaborator(sitePrivate, userCollaborator);
    await userManagerApi.sites.addSiteManager(sitePrivate, userDemoted);

    await userManagerApi.upload.uploadFileWithRename(FILES.docxFile, docLibId, testData.fileDocx.name);
    fileDocxFavId = (await userManagerApi.upload.uploadFileWithRename(FILES.docxFile, docLibId, testData.fileDocxFav.name)).entry.id;
    await userManagerApi.createFile(testData.file.name, docLibId);
    fileFavId = await userManagerApi.createFile(testData.fileFav.name, docLibId);
    fileDocxSharedId = (await userManagerApi.upload.uploadFileWithRename(FILES.docxFile, docLibId, testData.fileDocxShared.name)).entry.id;
    fileDocxSharedFavId = (await userManagerApi.upload.uploadFileWithRename(FILES.docxFile, docLibId, testData.fileDocxSharedFav.name)).entry.id;
    fileSharedId = await userManagerApi.createFile(testData.fileShared.name, docLibId);
    fileSharedFavId = await userManagerApi.createFile(testData.fileSharedFav.name, docLibId);
    fileLockedId = await userManagerApi.createFile(testData.fileLocked.name, docLibId);
    fileFavLockedId = await userManagerApi.createFile(testData.fileFavLocked.name, docLibId);
    fileSharedLockedId = await userManagerApi.createFile(testData.fileSharedLocked.name, docLibId);
    fileSharedFavLockedId = await userManagerApi.createFile(testData.fileSharedFavLocked.name, docLibId);
    fileGranularPermissionId = await userManagerApi.createFile(testData.fileGranularPermission, docLibId);

    fileLockedByUserId = await userManagerApi.createFile(testData.fileLockedByUser, docLibId);
    await demotedUserActions.lockNodes([fileLockedByUserId]);
    await userDemotedApi.favorites.addFavoriteById('file', fileLockedByUserId);
    await userDemotedApi.shared.shareFilesByIds([fileLockedByUserId]);
    await userManagerApi.sites.updateSiteMember(sitePrivate, userDemoted, SITE_ROLES.SITE_CONSUMER.ROLE);

    await userManagerApi.nodes.createFolder(testData.folder.name, docLibId);
    folderFavId = await userManagerApi.createFolder(testData.folderFav.name, docLibId);
    folderFav2Id = await userManagerApi.createFolder(testData.folderFav2.name, docLibId);
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

    await managerActions.lockNodes([fileLockedId, fileFavLockedId, fileSharedLockedId, fileSharedFavLockedId]);

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
