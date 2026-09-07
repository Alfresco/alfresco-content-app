/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import * as testData from '@alfresco/aca-playwright-shared';
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
  SearchApi,
  timeouts,
  Utils
} from '@alfresco/aca-playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('Special permissions : ', () => {
  const random = testData.random;

  test.describe('Consumer', () => {
    const apiClientFactory = new ApiClientFactory();
    const sitePrivate = `site-private-consumer-${random}`;
    const userManager = `manager-consumer-${random}`;
    const userConsumer = `consumer-${random}`;

    let docLibId: string;
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

    let managerNodeActions: NodesApi;
    let managerSiteActions: SitesApi;
    let managerFileActions: FileActionsApi;
    let managerSearchActions: SearchApi;
    let consumerFavoritesActions: FavoritesPageApi;
    let consumerShareActions: SharedLinksApi;

    test.beforeAll(async () => {
      test.setTimeout(timeouts.extendedLongTest);
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username: userManager });
      await apiClientFactory.createUser({ username: userConsumer });

      managerNodeActions = await NodesApi.initialize(userManager, userManager);
      managerSiteActions = await SitesApi.initialize(userManager, userManager);
      managerFileActions = await FileActionsApi.initialize(userManager, userManager);
      managerSearchActions = await SearchApi.initialize(userManager, userManager);
      consumerFavoritesActions = await FavoritesPageApi.initialize(userConsumer, userConsumer);
      consumerShareActions = await SharedLinksApi.initialize(userConsumer, userConsumer);

      const consumerFavoritesTotalItems = await consumerFavoritesActions.getFavoritesTotalItems(userConsumer);
      const managerSearchTotalItems = await managerSearchActions.getTotalItems(userManager);

      await managerSiteActions.createSite(sitePrivate, Site.VisibilityEnum.PRIVATE);
      docLibId = await managerSiteActions.getDocLibId(sitePrivate);
      await managerSiteActions.addSiteMember(sitePrivate, userConsumer, Site.RoleEnum.SiteConsumer);

      await managerFileActions.uploadFileWithRename(TEST_FILES.DOCX.path, testData.fileDocx.name, docLibId);
      fileDocxFavId = (await managerFileActions.uploadFileWithRename(TEST_FILES.DOCX.path, testData.fileDocxFav.name, docLibId)).entry.id;
      await managerNodeActions.createFile(testData.file.name, docLibId, '', '', '', true, ['cm:versionable']);
      fileFavId = (await managerNodeActions.createFile(testData.fileFav.name, docLibId, '', '', '', true, ['cm:versionable'])).entry.id;
      await managerNodeActions.createFile(testData.fileNotVersionable.name, docLibId, '', '', '', true, []);
      fileDocxSharedId = (await managerFileActions.uploadFileWithRename(TEST_FILES.DOCX.path, testData.fileDocxShared.name, docLibId)).entry.id;
      fileDocxSharedFavId = (await managerFileActions.uploadFileWithRename(TEST_FILES.DOCX.path, testData.fileDocxSharedFav.name, docLibId)).entry.id;
      fileSharedId = (await managerNodeActions.createFile(testData.fileShared.name, docLibId, '', '', '', true, ['cm:versionable'])).entry.id;
      fileSharedFavId = (await managerNodeActions.createFile(testData.fileSharedFav.name, docLibId, '', '', '', true, ['cm:versionable'])).entry.id;
      fileLockedId = (await managerNodeActions.createFile(testData.fileLocked.name, docLibId, '', '', '', true, ['cm:versionable'])).entry.id;
      fileFavLockedId = (await managerNodeActions.createFile(testData.fileFavLocked.name, docLibId, '', '', '', true, ['cm:versionable'])).entry.id;
      fileSharedLockedId = (await managerNodeActions.createFile(testData.fileSharedLocked.name, docLibId, '', '', '', true, ['cm:versionable'])).entry
        .id;
      fileSharedFavLockedId = (await managerNodeActions.createFile(testData.fileSharedFavLocked.name, docLibId, '', '', '', true, ['cm:versionable']))
        .entry.id;

      await consumerFavoritesActions.addFavoritesByIds('file', [
        fileDocxFavId,
        fileFavId,
        fileDocxSharedFavId,
        fileSharedFavId,
        fileFavLockedId,
        fileSharedFavLockedId
      ]);

      await consumerShareActions.shareFilesByIds([
        fileDocxSharedId,
        fileDocxSharedFavId,
        fileSharedId,
        fileSharedFavId,
        fileSharedLockedId,
        fileSharedFavLockedId
      ]);

      await managerNodeActions.lockNodes([fileLockedId, fileFavLockedId, fileSharedLockedId, fileSharedFavLockedId]);

      await Promise.all([
        consumerFavoritesActions.waitForApi(userConsumer, { expect: consumerFavoritesTotalItems + 6 }),
        consumerShareActions.waitForFilesToBeShared([
          fileDocxSharedId,
          fileDocxSharedFavId,
          fileSharedId,
          fileSharedFavId,
          fileSharedLockedId,
          fileSharedFavLockedId
        ]),
        managerSearchActions.waitForApi(userManager, { expect: managerSearchTotalItems + 13 })
      ]);
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(undefined, undefined, 'afterAll failed', managerSiteActions, [sitePrivate]);
    });

    test.describe('on Viewer', () => {
      viewerTests(userConsumer, sitePrivate);
    });
  });

  test.describe('Collaborator', () => {
    const apiClientFactory = new ApiClientFactory();
    const sitePrivate = `site-private-collaborator-${random}`;
    const userManager = `manager-collaborator-${random}`;
    const userCollaborator = `collaborator-${random}`;

    let docLibId: string;
    let fileDocxSharedFavId: string;
    let fileSharedFavId: string;

    let managerNodeActions: NodesApi;
    let managerSiteActions: SitesApi;
    let managerFileActions: FileActionsApi;
    let managerSearchActions: SearchApi;
    let managerShareActions: SharedLinksApi;
    let collaboratorFavoritesActions: FavoritesPageApi;

    test.beforeAll(async () => {
      test.setTimeout(timeouts.extendedLongTest);
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username: userManager });
      await apiClientFactory.createUser({ username: userCollaborator });

      managerNodeActions = await NodesApi.initialize(userManager, userManager);
      managerSiteActions = await SitesApi.initialize(userManager, userManager);
      managerFileActions = await FileActionsApi.initialize(userManager, userManager);
      managerSearchActions = await SearchApi.initialize(userManager, userManager);
      managerShareActions = await SharedLinksApi.initialize(userManager, userManager);
      collaboratorFavoritesActions = await FavoritesPageApi.initialize(userCollaborator, userCollaborator);

      const collaboratorFavoritesTotalItems = await collaboratorFavoritesActions.getFavoritesTotalItems(userCollaborator);
      const managerSearchTotalItems = await managerSearchActions.getTotalItems(userManager);

      await managerSiteActions.createSite(sitePrivate, Site.VisibilityEnum.PRIVATE);
      docLibId = await managerSiteActions.getDocLibId(sitePrivate);
      await managerSiteActions.addSiteMember(sitePrivate, userCollaborator, Site.RoleEnum.SiteCollaborator);

      fileDocxSharedFavId = (await managerFileActions.uploadFileWithRename(TEST_FILES.DOCX.path, testData.fileDocxSharedFav.name, docLibId)).entry.id;
      fileSharedFavId = (await managerNodeActions.createFile(testData.fileSharedFav.name, docLibId, '', '', '', true, ['cm:versionable'])).entry.id;

      await managerShareActions.shareFilesByIds([fileDocxSharedFavId, fileSharedFavId]);
      await collaboratorFavoritesActions.addFavoritesByIds('file', [fileDocxSharedFavId, fileSharedFavId]);

      await collaboratorFavoritesActions.isFavoriteWithRetry(userCollaborator, fileSharedFavId, { expect: true });
      await Promise.all([
        collaboratorFavoritesActions.waitForApi(userCollaborator, { expect: collaboratorFavoritesTotalItems + 2 }),
        managerShareActions.waitForFilesToBeShared([fileDocxSharedFavId, fileSharedFavId]),
        managerSearchActions.waitForApi(userManager, { expect: managerSearchTotalItems + 2 })
      ]);
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(undefined, undefined, 'afterAll failed', managerSiteActions, [sitePrivate]);
    });

    collaboratorTests(userCollaborator, sitePrivate);
  });

  test.describe('File locked - user is lock owner', () => {
    const apiClientFactory = new ApiClientFactory();
    const sitePrivate = `site-private-locked-owner-${random}`;
    const userManager = `manager-locked-owner-${random}`;
    const userDemoted = `demoted-owner-${random}`;

    let docLibId: string;
    let fileLockedByUserId: string;

    let managerNodeActions: NodesApi;
    let managerSiteActions: SitesApi;
    let managerSearchActions: SearchApi;
    let demotedUserActions: NodesApi;
    let demotedUserFavoritesActions: FavoritesPageApi;
    let demotedUserShareActions: SharedLinksApi;

    test.beforeAll(async () => {
      test.setTimeout(timeouts.extendedLongTest);
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username: userManager });
      await apiClientFactory.createUser({ username: userDemoted });

      managerNodeActions = await NodesApi.initialize(userManager, userManager);
      managerSiteActions = await SitesApi.initialize(userManager, userManager);
      managerSearchActions = await SearchApi.initialize(userManager, userManager);
      demotedUserActions = await NodesApi.initialize(userDemoted, userDemoted);
      demotedUserFavoritesActions = await FavoritesPageApi.initialize(userDemoted, userDemoted);
      demotedUserShareActions = await SharedLinksApi.initialize(userDemoted, userDemoted);

      const demotedUserFavoritesTotalItems = await demotedUserFavoritesActions.getFavoritesTotalItems(userDemoted);
      const managerSearchTotalItems = await managerSearchActions.getTotalItems(userManager);

      await managerSiteActions.createSite(sitePrivate, Site.VisibilityEnum.PRIVATE);
      docLibId = await managerSiteActions.getDocLibId(sitePrivate);
      await managerSiteActions.addSiteMember(sitePrivate, userDemoted, Site.RoleEnum.SiteManager);

      fileLockedByUserId = (await managerNodeActions.createFile(testData.fileLockedByUser.name, docLibId, '', '', '', true, ['cm:versionable'])).entry
        .id;
      await demotedUserActions.lockNodes([fileLockedByUserId]);
      await demotedUserFavoritesActions.addFavoriteById('file', fileLockedByUserId);
      await demotedUserShareActions.shareFileById(fileLockedByUserId);
      await managerSiteActions.updateSiteMember(sitePrivate, userDemoted, Site.RoleEnum.SiteConsumer);

      await demotedUserFavoritesActions.isFavoriteWithRetry(userDemoted, fileLockedByUserId, { expect: true });
      await Promise.all([
        demotedUserFavoritesActions.waitForApi(userDemoted, { expect: demotedUserFavoritesTotalItems + 1 }),
        demotedUserShareActions.waitForFilesToBeShared([fileLockedByUserId]),
        managerSearchActions.waitForApi(userManager, { expect: managerSearchTotalItems + 1 })
      ]);
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(undefined, undefined, 'afterAll failed', managerSiteActions, [sitePrivate]);
    });

    filesLockedByCurrentUser(userDemoted, sitePrivate);
  });

  test.describe('File locked by other user - user is manager', () => {
    const apiClientFactory = new ApiClientFactory();
    const sitePrivate = `site-private-locked-other-${random}`;
    const userManager = `manager-locked-other-${random}`;
    const userDemoted = `demoted-other-${random}`;

    let docLibId: string;
    let fileLockedByUserId: string;

    let managerNodeActions: NodesApi;
    let managerSiteActions: SitesApi;
    let managerSearchActions: SearchApi;
    let managerFavoritesActions: FavoritesPageApi;
    let demotedUserActions: NodesApi;
    let demotedUserShareActions: SharedLinksApi;

    test.beforeAll(async () => {
      test.setTimeout(timeouts.extendedLongTest);
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username: userManager });
      await apiClientFactory.createUser({ username: userDemoted });

      managerNodeActions = await NodesApi.initialize(userManager, userManager);
      managerSiteActions = await SitesApi.initialize(userManager, userManager);
      managerSearchActions = await SearchApi.initialize(userManager, userManager);
      managerFavoritesActions = await FavoritesPageApi.initialize(userManager, userManager);
      demotedUserActions = await NodesApi.initialize(userDemoted, userDemoted);
      demotedUserShareActions = await SharedLinksApi.initialize(userDemoted, userDemoted);

      const managerFavoritesTotalItems = await managerFavoritesActions.getFavoritesTotalItems(userManager);
      const managerSearchTotalItems = await managerSearchActions.getTotalItems(userManager);

      await managerSiteActions.createSite(sitePrivate, Site.VisibilityEnum.PRIVATE);
      docLibId = await managerSiteActions.getDocLibId(sitePrivate);
      await managerSiteActions.addSiteMember(sitePrivate, userDemoted, Site.RoleEnum.SiteManager);

      fileLockedByUserId = (await managerNodeActions.createFile(testData.fileLockedByUser.name, docLibId, '', '', '', true, ['cm:versionable'])).entry
        .id;
      await demotedUserActions.lockNodes([fileLockedByUserId]);
      await demotedUserShareActions.shareFileById(fileLockedByUserId);
      await managerFavoritesActions.addFavoriteById('file', fileLockedByUserId);

      await managerFavoritesActions.isFavoriteWithRetry(userManager, fileLockedByUserId, { expect: true });
      await Promise.all([
        managerFavoritesActions.waitForApi(userManager, { expect: managerFavoritesTotalItems + 1 }),
        demotedUserShareActions.waitForFilesToBeShared([fileLockedByUserId]),
        managerSearchActions.waitForApi(userManager, { expect: managerSearchTotalItems + 1 })
      ]);
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(undefined, undefined, 'afterAll failed', managerSiteActions, [sitePrivate]);
    });

    filesLockedByOtherUser(userManager, sitePrivate);
  });
});
