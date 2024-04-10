/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import * as testData from '@alfresco/playwright-shared';
import { viewerTests } from './viewer';
import { collaboratorTests, filesLockedByCurrentUser, filesLockedByOtherUser } from './other-permissions';
import {
  ApiClientFactory,
  FavoritesPageApi,
  FileActionsApi,
  TEST_FILES,
  NodesApi,
  SitesApi,
  test,
  SharedLinksApi,
  SearchPageApi,
  timeouts,
  Utils
} from '@alfresco/playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('Special permissions : ', () => {
  const apiClientFactory = new ApiClientFactory();
  const random = testData.random;
  let docLibId: string;

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

  let managerNodeActions: NodesApi;
  let demotedUserActions: NodesApi;
  let consumerFavoritesActions: FavoritesPageApi;
  let managerFavoritesActions: FavoritesPageApi;
  let collaboratorFavoritesActions: FavoritesPageApi;
  let demotedUserFavoritesActions: FavoritesPageApi;
  let managerUserShareActions: SharedLinksApi;
  let demotedUserShareActions: SharedLinksApi;
  let consumerShareActions: SharedLinksApi;
  let managerSiteActions: SitesApi;
  let managerFileActions: FileActionsApi;
  let managerSearchActions: SearchPageApi;

  test.beforeAll(async () => {
    test.setTimeout(timeouts.extendedLongTest);
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username: userManager });
    await apiClientFactory.createUser({ username: userConsumer });
    await apiClientFactory.createUser({ username: userCollaborator });
    await apiClientFactory.createUser({ username: userDemoted });

    managerNodeActions = await NodesApi.initialize(userManager, userManager);
    demotedUserActions = await NodesApi.initialize(userDemoted, userDemoted);
    consumerFavoritesActions = await FavoritesPageApi.initialize(userConsumer, userConsumer);
    collaboratorFavoritesActions = await FavoritesPageApi.initialize(userCollaborator, userCollaborator);
    demotedUserFavoritesActions = await FavoritesPageApi.initialize(userDemoted, userDemoted);
    managerFavoritesActions = await FavoritesPageApi.initialize(userManager, userManager);
    managerSearchActions = await SearchPageApi.initialize(userManager, userManager);
    managerSiteActions = await SitesApi.initialize(userManager, userManager);
    managerFileActions = await FileActionsApi.initialize(userManager, userManager);
    managerUserShareActions = await SharedLinksApi.initialize(userManager, userManager);
    demotedUserShareActions = await SharedLinksApi.initialize(userDemoted, userDemoted);
    consumerShareActions = await SharedLinksApi.initialize(userConsumer, userConsumer);

    const consumerFavoritesTotalItems = await consumerFavoritesActions.getFavoritesTotalItems(userConsumer);
    const managerSearchTotalItems = await managerSearchActions.getTotalItems(userManager);
    const collaboratorFavoritesTotalItems = await collaboratorFavoritesActions.getFavoritesTotalItems(userCollaborator);

    await managerSiteActions.createSite(sitePrivate, Site.VisibilityEnum.PRIVATE);
    docLibId = await managerSiteActions.getDocLibId(sitePrivate);
    await managerSiteActions.addSiteMember(sitePrivate, userConsumer, Site.RoleEnum.SiteConsumer);
    await managerSiteActions.addSiteMember(sitePrivate, userCollaborator, Site.RoleEnum.SiteCollaborator);
    await managerSiteActions.addSiteMember(sitePrivate, userDemoted, Site.RoleEnum.SiteManager);

    await managerFileActions.uploadFileWithRename(TEST_FILES.DOCX.path, testData.fileDocx.name, docLibId);
    fileDocxFavId = (await managerFileActions.uploadFileWithRename(TEST_FILES.DOCX.path, testData.fileDocxFav.name, docLibId)).entry.id;
    await managerNodeActions.createFile(testData.file.name, docLibId);
    fileFavId = (await managerNodeActions.createFile(testData.fileFav.name, docLibId)).entry.id;
    fileDocxSharedId = (await managerFileActions.uploadFileWithRename(TEST_FILES.DOCX.path, testData.fileDocxShared.name, docLibId)).entry.id;
    fileDocxSharedFavId = (await managerFileActions.uploadFileWithRename(TEST_FILES.DOCX.path, testData.fileDocxSharedFav.name, docLibId)).entry.id;
    fileSharedId = (await managerNodeActions.createFile(testData.fileShared.name, docLibId)).entry.id;
    fileSharedFavId = (await managerNodeActions.createFile(testData.fileSharedFav.name, docLibId)).entry.id;
    fileLockedId = (await managerNodeActions.createFile(testData.fileLocked.name, docLibId)).entry.id;
    fileFavLockedId = (await managerNodeActions.createFile(testData.fileFavLocked.name, docLibId)).entry.id;
    fileSharedLockedId = (await managerNodeActions.createFile(testData.fileSharedLocked.name, docLibId)).entry.id;
    fileSharedFavLockedId = (await managerNodeActions.createFile(testData.fileSharedFavLocked.name, docLibId)).entry.id;
    fileGranularPermissionId = (await managerNodeActions.createFile(testData.fileGranularPermission, docLibId)).entry.id;

    fileLockedByUserId = (await managerNodeActions.createFile(testData.fileLockedByUser, docLibId)).entry.id;
    await demotedUserActions.lockNodes([fileLockedByUserId]);
    await demotedUserFavoritesActions.addFavoriteById('file', fileLockedByUserId);
    await demotedUserShareActions.shareFileById(fileLockedByUserId);
    await managerSiteActions.updateSiteMember(sitePrivate, userDemoted, Site.RoleEnum.SiteConsumer);

    await managerNodeActions.createFolder(testData.folder.name, docLibId);
    folderFavId = (await managerNodeActions.createFolder(testData.folderFav.name, docLibId)).entry.id;
    folderFav2Id = (await managerNodeActions.createFolder(testData.folderFav2.name, docLibId)).entry.id;

    await consumerFavoritesActions.addFavoritesByIds('folder', [folderFavId, folderFav2Id]);
    await collaboratorFavoritesActions.addFavoritesByIds('file', [fileDocxSharedFavId, fileSharedFavId]);
    await managerFavoritesActions.addFavoriteById('file', fileLockedByUserId);
    await consumerFavoritesActions.addFavoritesByIds('file', [
      fileDocxFavId,
      fileFavId,
      fileDocxSharedFavId,
      fileSharedFavId,
      fileFavLockedId,
      fileSharedFavLockedId,
      fileGranularPermissionId
    ]);

    await consumerShareActions.shareFilesByIds([
      fileDocxSharedId,
      fileDocxSharedFavId,
      fileSharedId,
      fileSharedFavId,
      fileSharedLockedId,
      fileSharedFavLockedId,
      fileGranularPermissionId
    ]);

    await managerNodeActions.lockNodes([fileLockedId, fileFavLockedId, fileSharedLockedId, fileSharedFavLockedId]);

    await managerNodeActions.setGranularPermission(fileGranularPermissionId, false, userConsumer, Site.RoleEnum.SiteManager);

    await collaboratorFavoritesActions.isFavoriteWithRetry(userCollaborator, fileSharedFavId, { expect: true });
    await Promise.all([
      consumerFavoritesActions.waitForApi(userConsumer, { expect: consumerFavoritesTotalItems + 9 }),
      managerUserShareActions.waitForFilesToBeShared([
        fileDocxSharedId,
        fileDocxSharedFavId,
        fileSharedId,
        fileSharedFavId,
        fileSharedLockedId,
        fileSharedFavLockedId,
        fileGranularPermissionId,
        fileLockedByUserId
      ]),
      managerSearchActions.waitForApi(userManager, { expect: managerSearchTotalItems + 14 }),
      collaboratorFavoritesActions.waitForApi(userCollaborator, { expect: collaboratorFavoritesTotalItems + 2 })
    ]);
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(undefined, undefined, 'afterAll failed', managerSiteActions, [sitePrivate]);
  });

  test.describe('Consumer', () => {
    test.describe('on Viewer', () => {
      viewerTests(userConsumer, sitePrivate);
    });
  });

  test.describe('Collaborator', () => {
    collaboratorTests(userCollaborator, sitePrivate);
  });

  test.describe('File locked - user is lock owner', () => {
    filesLockedByCurrentUser(userDemoted, sitePrivate);
  });

  test.describe('File locked by other user - user is manager', () => {
    filesLockedByOtherUser(userManager, sitePrivate);
  });
});
