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

import { RepoClient, Utils, FILES, SITE_ROLES } from '@alfresco/aca-testing-shared';
import * as testData from './test-data-permissions';
import { librariesTests } from './my-libraries';
import { favoritesTests } from './favorites';
import { searchResultsTests } from './search-results';
import { viewerTests } from './viewer';
import { sharedFilesTests } from './shared-files';
import { collaboratorTests, filesLockedByCurrentUser, filesLockedByOtherUser } from './other-permissions';
import { ApiService, UsersActions, UserModel, LoginPage } from '@alfresco/adf-testing';

describe('Special permissions : ', () => {
  const random = testData.random;

  const sitePrivate = `site-private-${random}`;

  let userManager: UserModel;
  let userConsumer: UserModel;
  let userCollaborator: UserModel;
  let userDemoted: UserModel;

  const usernameManager = `manager-${random}`;
  const usernameConsumer = `consumer-${random}`;
  const usernameCollaborator = `collaborator-${random}`;
  const usernameDemoted = `demoted-${random}`;

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

  const adminApiService = new ApiService();
  const usersActions = new UsersActions(adminApiService);

  const apiServiceManager = new ApiService();
  const userManagerApi = new RepoClient(apiServiceManager);

  const apiServiceConsumer = new ApiService();
  const userConsumerApi = new RepoClient(apiServiceConsumer);

  const apiServiceCollaborator = new ApiService();
  const userCollaboratorApi = new RepoClient(apiServiceCollaborator);

  const apiServiceDemoted = new ApiService();
  const userDemotedApi = new RepoClient(apiServiceDemoted);

  const usersActions = new UsersActions(adminApiService);

  const loginPage = new LoginPage();

  beforeAll(async () => {
    await adminApiService.loginWithProfile('admin');

    userManager = await usersActions.createUser(new UserModel({ username: usernameManager }));
    await apiServiceManager.login(user.username, user.password);

    userConsumer = await usersActions.createUser(new UserModel({ username: usernameConsumer }));
    await apiServiceConsumer.login(user.username, user.password);

    userCollaborator = await usersActions.createUser(new UserModel({ username: usernameCollaborator }));
    await apiServiceCollaborator.login(user.username, user.password);

    userDemoted = await usersActions.createUser(new UserModel({ username: usernameDemoted }));
    await apiServiceDemoted.login(user.username, user.password);


    const consumerFavoritesTotalItems = await userConsumerApi.favorites.getFavoritesTotalItems();
    const managerSearchTotalItems = await userManagerApi.search.getTotalItems(userManager);
    const collaboratorFavoritesTotalItems = await userCollaboratorApi.favorites.getFavoritesTotalItems();

    await userManagerApi.sites.createSitePrivate(sitePrivate);
    const docLibId = await userManagerApi.sites.getDocLibId(sitePrivate);
    await userManagerApi.sites.addSiteConsumer(sitePrivate, userConsumer.username);
    await userManagerApi.sites.addSiteCollaborator(sitePrivate, userCollaborator.username);
    await userManagerApi.sites.addSiteManager(sitePrivate, userDemoted.username);

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

    await userManagerApi.nodes.setGranularPermission(fileGranularPermissionId, false, userConsumer.username, SITE_ROLES.SITE_MANAGER.ROLE);

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
      userManagerApi.search.waitForApi(userManager.username, { expect: managerSearchTotalItems + 14 }),
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
      await loginPage.login(userConsumer.username, userConsumer.password);
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
      await loginPage.login(userCollaborator.username, userCollaborator.password);
    });

    collaboratorTests(sitePrivate);
  });

  describe('File locked - user is lock owner', () => {
    beforeAll(async () => {
      await loginPage.login(userDemoted.username, userDemoted.password);
    });

    filesLockedByCurrentUser(sitePrivate);
  });

  describe('File locked by other user - user is manager', () => {
    beforeAll(async () => {
      await loginPage.login(userManager.username, userManager.password);
    });

    filesLockedByOtherUser(sitePrivate);
  });
});
