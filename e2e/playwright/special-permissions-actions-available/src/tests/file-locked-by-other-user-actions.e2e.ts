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
const lockOtherUserToolbarMore = ['Cancel Editing', 'Favorite', 'Move', 'Copy', 'Permissions'];
const lockOtherUserSearchToolbarMore = ['Cancel Editing', 'Favorite', 'Copy', 'Permissions'];

interface LockedFile {
  name: string;
  random: string;
  id?: string;
}

const buildFile = (): LockedFile => {
  const random = Utils.random();
  return { name: `file-${random}-my-locked`, random };
};

test.describe('Special permissions - File locked by other user, user is manager : ', () => {
  const random = Utils.random();
  const apiClientFactory = new ApiClientFactory();
  const sitePrivate = `site-private-locked-other-${random}`;
  const userManager = `manager-locked-other-${random}`;
  const userDemoted = `demoted-other-${random}`;

  let docLibId: string;
  let managerNodeActions: NodesApi;
  let managerSiteActions: SitesApi;
  let managerSearchActions: SearchApi;
  let managerFavoritesActions: FavoritesApi;
  let demotedUserActions: NodesApi;
  let demotedUserShareActions: SharedLinksApi;

  const provisionFile = async (item: LockedFile): Promise<void> => {
    test.setTimeout(timeouts.extendedTest);
    const managerFavoritesTotalItems = await managerFavoritesActions.getFavoritesTotalItems(userManager);
    const managerSearchTotalItems = await managerSearchActions.getTotalItems(userManager);

    item.id = (await managerNodeActions.createFile(item.name, docLibId, '', '', '', true, ['cm:versionable'])).entry.id;
    await demotedUserActions.checkoutNodes([item.id]);
    await demotedUserShareActions.shareFileById(item.id);
    await managerFavoritesActions.addFavoriteById('file', item.id);

    await managerFavoritesActions.isFavoriteWithRetry(userManager, item.id, { expect: true });
    await Promise.all([
      managerFavoritesActions.waitForApi(userManager, { expect: managerFavoritesTotalItems + 1 }),
      demotedUserShareActions.waitForFilesToBeShared([item.id]),
      managerSearchActions.waitForApi(userManager, { expect: managerSearchTotalItems + 1 })
    ]);
  };

  test.beforeAll(async () => {
    test.setTimeout(timeouts.extendedTest);
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username: userManager });
    await apiClientFactory.createUser({ username: userDemoted });

    managerNodeActions = await NodesApi.initialize(userManager, userManager);
    managerSiteActions = await SitesApi.initialize(userManager, userManager);
    managerSearchActions = await SearchApi.initialize(userManager, userManager);
    managerFavoritesActions = await FavoritesApi.initialize(userManager, userManager);
    demotedUserActions = await NodesApi.initialize(userDemoted, userDemoted);
    demotedUserShareActions = await SharedLinksApi.initialize(userDemoted, userDemoted);

    await managerSiteActions.createSite(sitePrivate, Site.VisibilityEnum.PRIVATE);
    docLibId = await managerSiteActions.getDocLibId(sitePrivate);
    await managerSiteActions.addSiteMember(sitePrivate, userDemoted, Site.RoleEnum.SiteManager);
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, userManager, userManager, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(undefined, undefined, 'afterAll failed', managerSiteActions, [sitePrivate]);
  });

  test.describe('File Libraries - row actions', () => {
    const item = buildFile();

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4860] Toolbar - Correct actions appear for file - on File Libraries - Locked File - Other User', async ({ myLibrariesPage }) => {
      await myLibrariesPage.navigate();
      await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(sitePrivate);
      await checkActionsAvailable(myLibrariesPage, item.name, collaboratorToolbarPrimary, lockOtherUserToolbarMore);
    });
  });

  test.describe('Shared Files - row actions', () => {
    const item = buildFile();

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4861] Toolbar - Correct actions appear for file - on Shared Files - Locked File - Other User', async ({
      sharedPage,
      myLibrariesPage
    }) => {
      await sharedPage.navigate();
      await checkActionsAvailable(myLibrariesPage, item.name, collaboratorToolbarPrimary, lockOtherUserToolbarMore);
    });
  });

  test.describe('Favorites - row actions', () => {
    const item = buildFile();

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4862] Toolbar - Correct actions appear for file - on Favorites - Locked File - Other User', async ({
      favoritePage,
      myLibrariesPage
    }) => {
      await favoritePage.navigate();
      await checkActionsAvailable(myLibrariesPage, item.name, collaboratorToolbarPrimary, lockOtherUserToolbarMore);
    });
  });

  test.describe('Search Results - row actions', () => {
    const item = buildFile();

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4863] Toolbar - Correct actions appear for file - on Search Results - Locked File - Other User', async ({
      searchPage,
      myLibrariesPage
    }) => {
      await searchPage.searchWithin(item.random, 'filesAndFolders', 'formula');
      await checkActionsAvailable(myLibrariesPage, item.name, collaboratorToolbarPrimary, lockOtherUserSearchToolbarMore);
    });
  });

  test.describe('File Libraries - viewer actions', () => {
    const item = buildFile();

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4864] Correct actions appear for file opened from File Libraries - viewer - locked', async ({ myLibrariesPage }) => {
      await myLibrariesPage.navigate();
      await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(sitePrivate);
      await checkActionsViewerAvailable(myLibrariesPage, item.name, collaboratorViewerLockedToolbarPrimary, lockOtherUserToolbarMore);
    });
  });

  test.describe('Shared Files - viewer actions', () => {
    const item = buildFile();

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4865] Correct actions appear for file opened from Shared Files - viewer - locked', async ({ sharedPage, myLibrariesPage }) => {
      await sharedPage.navigate();
      await checkActionsViewerAvailable(myLibrariesPage, item.name, collaboratorViewerLockedToolbarPrimary, lockOtherUserToolbarMore);
    });
  });

  test.describe('Favorites - viewer actions', () => {
    const item = buildFile();

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4866] Correct actions appear for file opened from Favorites - viewer - locked', async ({ favoritePage, myLibrariesPage }) => {
      await favoritePage.navigate();
      await checkActionsViewerAvailable(myLibrariesPage, item.name, collaboratorViewerLockedToolbarPrimary, lockOtherUserToolbarMore);
    });
  });

  test.describe('Search Results - viewer actions', () => {
    const item = buildFile();

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4867] Correct actions appear for file opened from Search Results - viewer - locked', async ({ searchPage, myLibrariesPage }) => {
      await searchPage.searchWithin(item.random, 'filesAndFolders', 'formula');
      await checkActionsViewerAvailable(myLibrariesPage, item.name, collaboratorViewerLockedToolbarPrimary, lockOtherUserSearchToolbarMore);
    });
  });
});
