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
  FileActionsApi,
  NodesApi,
  SearchApi,
  SharedLinksApi,
  SitesApi,
  TEST_FILES,
  test,
  timeouts,
  Utils
} from '@alfresco/aca-playwright-shared';
import { Site } from '@alfresco/js-api';
import { checkActionsAvailable, checkActionsViewerAvailable } from './permissions-actions-helpers';

const collaboratorToolbarPrimary = ['View', 'View Details', 'More Actions'];
const collaboratorEditRowToolbarMore = [
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const favoritesCollaboratorToolbarMore = [
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const collaboratorSharedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Print', 'View Details', 'More Actions'];
const collaboratorDocToolbarMore = [
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];

interface CollaboratorFile {
  name: string;
  random: string;
  office: boolean;
  id?: string;
}

const buildFile = (buildName: (fileRandom: string) => string, office: boolean): CollaboratorFile => {
  const fileRandom = Utils.random();
  return { name: buildName(fileRandom), random: fileRandom, office };
};

test.describe('Special permissions - Collaborator available actions : ', () => {
  const random = Utils.random();
  const apiClientFactory = new ApiClientFactory();
  const sitePrivate = `site-private-collaborator-${random}`;
  const userManager = `manager-collaborator-${random}`;
  const userCollaborator = `collaborator-${random}`;

  let docLibId: string;
  let managerNodeActions: NodesApi;
  let managerSiteActions: SitesApi;
  let managerFileActions: FileActionsApi;
  let managerSearchActions: SearchApi;
  let managerShareActions: SharedLinksApi;
  let collaboratorFavoritesActions: FavoritesApi;

  const provisionFile = async (item: CollaboratorFile): Promise<void> => {
    test.setTimeout(timeouts.extendedTest);
    const collaboratorFavoritesTotalItems = await collaboratorFavoritesActions.getFavoritesTotalItems(userCollaborator);
    const managerSearchTotalItems = await managerSearchActions.getTotalItems(userManager);

    if (item.office) {
      item.id = (await managerFileActions.uploadFileWithRename(TEST_FILES.DOCX.path, item.name, docLibId)).entry.id;
    } else {
      item.id = (await managerNodeActions.createFile(item.name, docLibId, '', '', '', true, ['cm:versionable'])).entry.id;
    }

    await managerShareActions.shareFileById(item.id);
    await collaboratorFavoritesActions.addFavoriteById('file', item.id);

    await collaboratorFavoritesActions.isFavoriteWithRetry(userCollaborator, item.id, { expect: true });
    await Promise.all([
      collaboratorFavoritesActions.waitForApi(userCollaborator, { expect: collaboratorFavoritesTotalItems + 1 }),
      managerShareActions.waitForFilesToBeShared([item.id]),
      managerSearchActions.waitForApi(userManager, { expect: managerSearchTotalItems + 1 })
    ]);
  };

  test.beforeAll(async () => {
    test.setTimeout(timeouts.extendedTest);
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username: userManager });
    await apiClientFactory.createUser({ username: userCollaborator });

    managerNodeActions = await NodesApi.initialize(userManager, userManager);
    managerSiteActions = await SitesApi.initialize(userManager, userManager);
    managerFileActions = await FileActionsApi.initialize(userManager, userManager);
    managerSearchActions = await SearchApi.initialize(userManager, userManager);
    managerShareActions = await SharedLinksApi.initialize(userManager, userManager);
    collaboratorFavoritesActions = await FavoritesApi.initialize(userCollaborator, userCollaborator);

    await managerSiteActions.createSite(sitePrivate, Site.VisibilityEnum.PRIVATE);
    docLibId = await managerSiteActions.getDocLibId(sitePrivate);
    await managerSiteActions.addSiteMember(sitePrivate, userCollaborator, Site.RoleEnum.SiteCollaborator);
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, userCollaborator, userCollaborator, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(undefined, undefined, 'afterAll failed', managerSiteActions, [sitePrivate]);
  });

  test.describe('My Libraries - row actions', () => {
    const item = buildFile((fileRandom) => `file-${fileRandom}-shared-fav.txt`, false);

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4844] Toolbar - Actions appear correctly for a file - Collaborator - My Libraries', async ({ myLibrariesPage }) => {
      await myLibrariesPage.navigate();
      await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(sitePrivate);
      await checkActionsAvailable(myLibrariesPage, item.name, collaboratorToolbarPrimary, collaboratorEditRowToolbarMore);
    });
  });

  test.describe('Shared - row actions', () => {
    const item = buildFile((fileRandom) => `file-${fileRandom}-shared-fav.txt`, false);

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4845] Toolbar - Actions appear correctly for a file - Collaborator - Shared', async ({ sharedPage, myLibrariesPage }) => {
      await sharedPage.navigate();
      await checkActionsAvailable(myLibrariesPage, item.name, collaboratorToolbarPrimary, collaboratorEditRowToolbarMore);
    });
  });

  test.describe('Favorites - row actions', () => {
    const item = buildFile((fileRandom) => `file-${fileRandom}-shared-fav.txt`, false);

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4846] Toolbar - Actions appear correctly for a file - Collaborator - Favorites', async ({ favoritePage, myLibrariesPage }) => {
      await favoritePage.navigate();
      await checkActionsAvailable(myLibrariesPage, item.name, collaboratorToolbarPrimary, favoritesCollaboratorToolbarMore);
    });
  });

  test.describe('Search Results - row actions', () => {
    const item = buildFile((fileRandom) => `file-${fileRandom}-shared-fav.txt`, false);

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4847] Toolbar - Actions appear correctly for a file - Collaborator - Search Results', async ({ searchPage, myLibrariesPage }) => {
      await searchPage.searchWithin(item.random, 'filesAndFolders', 'formula');
      await checkActionsAvailable(myLibrariesPage, item.name, collaboratorToolbarPrimary, collaboratorEditRowToolbarMore);
    });
  });

  test.describe('My Libraries - viewer actions', () => {
    const item = buildFile((fileRandom) => `file-${fileRandom}-docx-shared-fav.docx`, true);

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4848] Correct actions appear for file in viewer - Collaborator - My Libraries', async ({ myLibrariesPage }) => {
      await myLibrariesPage.navigate();
      await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(sitePrivate);
      await checkActionsViewerAvailable(myLibrariesPage, item.name, collaboratorSharedToolbarPrimary, collaboratorDocToolbarMore);
    });
  });

  test.describe('Shared - viewer actions', () => {
    const item = buildFile((fileRandom) => `file-${fileRandom}-docx-shared-fav.docx`, true);

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4849] Correct actions appear for file in viewer - Collaborator - Shared', async ({ sharedPage, myLibrariesPage }) => {
      await sharedPage.navigate();
      await checkActionsViewerAvailable(myLibrariesPage, item.name, collaboratorSharedToolbarPrimary, collaboratorDocToolbarMore);
    });
  });

  test.describe('Favorites - viewer actions', () => {
    const item = buildFile((fileRandom) => `file-${fileRandom}-docx-shared-fav.docx`, true);

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4850] Correct actions appear for file in viewer - Collaborator - Favorites', async ({ favoritePage, myLibrariesPage }) => {
      await favoritePage.navigate();
      await checkActionsViewerAvailable(myLibrariesPage, item.name, collaboratorSharedToolbarPrimary, collaboratorDocToolbarMore);
    });
  });

  test.describe('Search - viewer actions', () => {
    const item = buildFile((fileRandom) => `file-${fileRandom}-docx-shared-fav.docx`, true);

    test.beforeAll(() => provisionFile(item));

    test('[XAT-4851] Correct actions appear for file in viewer - Collaborator - Search', async ({ searchPage, myLibrariesPage }) => {
      await searchPage.searchWithin(item.random, 'filesAndFolders', 'formula');
      await checkActionsViewerAvailable(myLibrariesPage, item.name, collaboratorSharedToolbarPrimary, collaboratorDocToolbarMore);
    });
  });
});
