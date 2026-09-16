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

import {
  ApiClientFactory,
  FavoritesApi,
  NodesApi,
  SearchApi,
  SharedLinksApi,
  SitesApi,
  test,
  timeouts,
  Utils
} from '@alfresco/aca-playwright-shared';
import { Site } from '@alfresco/js-api';
import { checkActionsAvailable, checkActionsViewerAvailable } from './permissions-actions-helpers';

const collaboratorToolbarPrimary = ['View', 'View Details', 'More Actions'];
const collaboratorViewerLockedToolbarPrimary = ['Activate full-screen mode', 'View Details', 'More Actions'];
const lockOtherUserAdminFavToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Copy'];
const lockOtherUserManagerFavToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Copy', 'Information'];
const lockOtherUserSearchToolbarMore = ['Cancel Editing', 'Favorite', 'Copy', 'Permissions'];
const lockOtherUserViewerToolbarMore = ['Cancel Editing', 'Favorite', 'Copy'];
const lockOtherUserViewerFavToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Copy'];

interface ManagerLockedFile {
  random: string;
  name: string;
  id?: string;
}

const buildFile = (): ManagerLockedFile => {
  const fileToken = Utils.random();
  const name = `file-${fileToken}-my-locked`;
  return { random: fileToken, name };
};

test.describe('Special permissions - File locked by other user, user is manager : ', () => {
  const random = Utils.random();
  const userManager = `manager-locked-other-${random}`;
  const otherManager = `other-manager-locked-other-${random}`;
  const sitePrivate = `site-private-locked-other-${random}`;
  const apiClientFactory = new ApiClientFactory();
  const lockedFileIds: string[] = [];

  let managerSiteActions: SitesApi;
  let managerNodeActions: NodesApi;
  let managerFavoritesActions: FavoritesApi;
  let managerSearchActions: SearchApi;
  let otherManagerShareActions: SharedLinksApi;
  let otherManagerFavoritesActions: FavoritesApi;
  let adminNodeActions: NodesApi;
  let docLibId: string;

  const provisionFile = async (
    managerLockedFile: ManagerLockedFile,
    { favoritedByOtherManager = false }: { favoritedByOtherManager?: boolean } = {}
  ): Promise<void> => {
    test.setTimeout(timeouts.extendedTest);
    const favoritesActions = favoritedByOtherManager ? otherManagerFavoritesActions : managerFavoritesActions;
    const favoritesUser = favoritedByOtherManager ? otherManager : userManager;
    const favoritesTotalItems = await favoritesActions.getFavoritesTotalItems(favoritesUser);
    const managerSearchTotalItems = await managerSearchActions.getTotalItems(userManager);

    managerLockedFile.id = (await managerNodeActions.createFile(managerLockedFile.name, docLibId, '', '', '', true, ['cm:versionable'])).entry.id;
    await managerNodeActions.checkoutNodes([managerLockedFile.id]);
    lockedFileIds.push(managerLockedFile.id);
    await otherManagerShareActions.shareFileById(managerLockedFile.id);
    await favoritesActions.addFavoriteById('file', managerLockedFile.id);

    await favoritesActions.isFavoriteWithRetry(favoritesUser, managerLockedFile.id, { expect: true });
    await Promise.all([
      favoritesActions.waitForApi(favoritesUser, { expect: favoritesTotalItems + 1 }),
      otherManagerShareActions.waitForFilesToBeShared([managerLockedFile.id]),
      managerSearchActions.waitForApi(userManager, { expect: managerSearchTotalItems + 1 })
    ]);
  };

  test.beforeAll(async () => {
    test.setTimeout(timeouts.extendedTest);
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username: otherManager });
    await apiClientFactory.createUser({ username: userManager });

    managerSiteActions = await SitesApi.initialize(userManager, userManager);
    managerNodeActions = await NodesApi.initialize(userManager, userManager);
    managerFavoritesActions = await FavoritesApi.initialize(userManager, userManager);
    managerSearchActions = await SearchApi.initialize(userManager, userManager);
    otherManagerShareActions = await SharedLinksApi.initialize(otherManager, otherManager);
    otherManagerFavoritesActions = await FavoritesApi.initialize(otherManager, otherManager);
    adminNodeActions = await NodesApi.initialize('admin');

    await managerSiteActions.createSite(sitePrivate, Site.VisibilityEnum.PRIVATE);
    await managerSiteActions.addSiteMember(sitePrivate, otherManager, Site.RoleEnum.SiteManager);
    docLibId = await managerSiteActions.getDocLibId(sitePrivate);
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, otherManager, otherManager, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await adminNodeActions.cancelCheckout(lockedFileIds);
    await Utils.deleteNodesSitesEmptyTrashcan(undefined, undefined, 'afterAll failed', managerSiteActions, [sitePrivate]);
  });

  test.describe('File Libraries - row actions', () => {
    const managerLockedFile = buildFile();

    test.beforeAll(() => provisionFile(managerLockedFile));

    test('[XAT-4860] Toolbar - Correct actions appear for file - on File Libraries - Locked File - Other User', async ({ myLibrariesPage }) => {
      await myLibrariesPage.navigate();
      await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(sitePrivate);
      await checkActionsAvailable(myLibrariesPage, managerLockedFile.name, collaboratorToolbarPrimary, lockOtherUserAdminFavToolbarMore);
    });
  });

  test.describe('Shared Files - row actions', () => {
    const managerLockedFile = buildFile();

    test.beforeAll(() => provisionFile(managerLockedFile));

    test('[XAT-4861] Toolbar - Correct actions appear for file - on Shared Files - Locked File - Other User', async ({
      sharedPage,
      myLibrariesPage
    }) => {
      await sharedPage.navigate();
      await checkActionsAvailable(myLibrariesPage, managerLockedFile.name, collaboratorToolbarPrimary, lockOtherUserAdminFavToolbarMore);
    });
  });

  test.describe('Favorites - row actions', () => {
    const managerLockedFile = buildFile();

    test.beforeAll(() => provisionFile(managerLockedFile, { favoritedByOtherManager: true }));

    test('[XAT-4862] Toolbar - Correct actions appear for file - on Favorites - Locked File - Other User', async ({
      favoritePage,
      myLibrariesPage
    }) => {
      await favoritePage.navigate();
      await checkActionsAvailable(myLibrariesPage, managerLockedFile.name, collaboratorToolbarPrimary, lockOtherUserManagerFavToolbarMore);
    });
  });

  test.describe('Search Results - row actions', () => {
    const managerLockedFile = buildFile();

    test.beforeAll(() => provisionFile(managerLockedFile));

    test('[XAT-4863] Toolbar - Correct actions appear for file - on Search Results - Locked File - Other User', async ({
      searchPage,
      myLibrariesPage
    }) => {
      await searchPage.searchWithin(managerLockedFile.random, 'filesAndFolders', 'formula');
      await checkActionsAvailable(myLibrariesPage, managerLockedFile.name, collaboratorToolbarPrimary, lockOtherUserSearchToolbarMore);
    });
  });

  test.describe('File Libraries - viewer actions', () => {
    const managerLockedFile = buildFile();

    test.beforeAll(() => provisionFile(managerLockedFile));

    test('[XAT-4864] Correct actions appear for file opened from File Libraries - viewer - locked', async ({ myLibrariesPage }) => {
      await myLibrariesPage.navigate();
      await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(sitePrivate);
      await checkActionsViewerAvailable(
        myLibrariesPage,
        managerLockedFile.name,
        collaboratorViewerLockedToolbarPrimary,
        lockOtherUserAdminFavToolbarMore
      );
    });
  });

  test.describe('Shared Files - viewer actions', () => {
    const managerLockedFile = buildFile();

    test.beforeAll(() => provisionFile(managerLockedFile));

    test('[XAT-4865] Correct actions appear for file opened from Shared Files - viewer - locked', async ({ sharedPage, myLibrariesPage }) => {
      await sharedPage.navigate();
      await checkActionsViewerAvailable(
        myLibrariesPage,
        managerLockedFile.name,
        collaboratorViewerLockedToolbarPrimary,
        lockOtherUserViewerToolbarMore
      );
    });
  });

  test.describe('Favorites - viewer actions', () => {
    const managerLockedFile = buildFile();

    test.beforeAll(() => provisionFile(managerLockedFile, { favoritedByOtherManager: true }));

    test('[XAT-4866] Correct actions appear for file opened from Favorites - viewer - locked', async ({ favoritePage, myLibrariesPage }) => {
      await favoritePage.navigate();
      await checkActionsViewerAvailable(
        myLibrariesPage,
        managerLockedFile.name,
        collaboratorViewerLockedToolbarPrimary,
        lockOtherUserViewerFavToolbarMore
      );
    });
  });

  test.describe('Search Results - viewer actions', () => {
    const managerLockedFile = buildFile();

    test.beforeAll(() => provisionFile(managerLockedFile));

    test('[XAT-4867] Correct actions appear for file opened from Search Results - viewer - locked', async ({ searchPage, myLibrariesPage }) => {
      await searchPage.searchWithin(managerLockedFile.random, 'filesAndFolders', 'formula');
      await checkActionsViewerAvailable(
        myLibrariesPage,
        managerLockedFile.name,
        collaboratorViewerLockedToolbarPrimary,
        lockOtherUserSearchToolbarMore
      );
    });
  });
});
