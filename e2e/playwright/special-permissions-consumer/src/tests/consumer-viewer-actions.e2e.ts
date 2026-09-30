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
  FavoritesPage,
  FileActionsApi,
  LoginPage,
  MyLibrariesPage,
  NodesApi,
  SearchApi,
  SearchPage,
  SharedLinksApi,
  SharedPage,
  SitesApi,
  TEST_FILES,
  test,
  timeouts,
  Utils
} from '@alfresco/aca-playwright-shared';
import { Site } from '@alfresco/js-api';
import { expect } from '@playwright/test';

const viewerPrimary = ['Activate full-screen mode', 'Share', 'Download', 'Print', 'View Details', 'More Actions'];
const viewerSharedPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
const viewerLockedPrimary = ['Activate full-screen mode', 'View Details', 'More Actions'];
const viewerMore = ['Favorite', 'Copy', 'Manage Versions'];
const viewerFavMore = ['Remove Favorite', 'Copy', 'Manage Versions'];
const viewerLockedMore = ['Favorite', 'Copy'];
const viewerLockedFavWorkingCopyMore = ['Favorite', 'Copy'];
const viewerLockedFavOriginalMore = ['Remove Favorite', 'Copy'];
const viewerNotVersionableMore = ['Favorite', 'Copy'];

interface ConsumerFile {
  name: string;
  random: string;
  office: boolean;
  versionable: boolean;
  favorite: boolean;
  shared: boolean;
  locked: boolean;
  viewerToolbarPrimary: string[];
  viewerToolbarMore: string[];
  expectNoManageVersions?: boolean;
  id?: string;
}

type FileSpec = Pick<ConsumerFile, 'viewerToolbarPrimary' | 'viewerToolbarMore'> &
  Partial<Pick<ConsumerFile, 'office' | 'versionable' | 'favorite' | 'shared' | 'locked' | 'expectNoManageVersions'>>;

const buildFile = (buildName: (fileRandom: string) => string, spec: FileSpec): ConsumerFile => {
  const fileRandom = Utils.random();
  return {
    name: buildName(fileRandom),
    random: fileRandom,
    office: false,
    versionable: false,
    favorite: false,
    shared: false,
    locked: false,
    ...spec
  };
};

test.describe('Special permissions - Consumer viewer actions : ', () => {
  const random = Utils.random();
  const apiClientFactory = new ApiClientFactory();
  const sitePrivate = `site-private-consumer-${random}`;
  const userManager = `manager-consumer-${random}`;
  const userConsumer = `consumer-${random}`;

  let docLibId: string;
  let managerNodeActions: NodesApi;
  let managerSiteActions: SitesApi;
  let managerFileActions: FileActionsApi;
  let managerSearchActions: SearchApi;
  let consumerNodeActions: NodesApi;
  let consumerFavoritesActions: FavoritesApi;
  let consumerShareActions: SharedLinksApi;

  const login = async (loginPage: LoginPage): Promise<void> => {
    await loginPage.navigate();
    await loginPage.loginUser({ username: userConsumer, password: userConsumer });
  };

  const provisionFile = async (item: ConsumerFile): Promise<void> => {
    test.setTimeout(timeouts.extendedTest);
    const searchTotalBefore = await managerSearchActions.getTotalItems(userManager);

    if (item.office) {
      item.id = (await managerFileActions.uploadFileWithRename(TEST_FILES.DOCX.path, item.name, docLibId)).entry.id;
    } else {
      item.id = (await managerNodeActions.createFile(item.name, docLibId, '', '', '', true, item.versionable ? ['cm:versionable'] : [])).entry.id;
    }

    if (item.favorite) {
      await consumerFavoritesActions.addFavoriteById('file', item.id);
      await consumerFavoritesActions.isFavoriteWithRetry(userConsumer, item.id, { expect: true });
      const consumerNode = await consumerNodeActions.getNodeById(item.id, { include: ['isFavorite'] });
      expect(consumerNode.entry.isFavorite, `${item.name}: consumer should see isFavorite=true`).toBe(true);
    }
    if (item.shared) {
      await consumerShareActions.shareFileById(item.id);
      await consumerShareActions.waitForFilesToBeShared([item.id]);
    }
    if (item.locked) {
      await managerNodeActions.checkoutNodes([item.id]);
    }

    await managerSearchActions.waitForApi(userManager, { expect: searchTotalBefore + 1 });
  };

  const verifyViewerActions = async (page: MyLibrariesPage | FavoritesPage | SharedPage | SearchPage, data: ConsumerFile): Promise<void> => {
    expect(await page.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await page.viewer.verifyViewerPrimaryActions(data.viewerToolbarPrimary);
    await page.viewer.toolbar.clickMoreActions();
    await page.matMenu.verifyActualMoreActions(data.viewerToolbarMore);

    if (data.expectNoManageVersions) {
      const actualMoreActions = await page.matMenu.getActualMoreActions();
      expect(actualMoreActions.includes('Manage Versions'), 'Manage Versions should not be visible for a non-versionable file').toBe(false);
    }
  };

  const openInLibraries = async (myLibrariesPage: MyLibrariesPage, loginPage: LoginPage, item: string): Promise<void> => {
    await login(loginPage);
    await myLibrariesPage.navigate();
    await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(sitePrivate);
    await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(item);
  };

  const openInFavorites = async (favoritePage: FavoritesPage, loginPage: LoginPage, item: string): Promise<void> => {
    await login(loginPage);
    await favoritePage.navigate();
    await favoritePage.dataTable.performClickFolderOrFileToOpen(item);
  };

  const openInShared = async (sharedPage: SharedPage, loginPage: LoginPage, item: string): Promise<void> => {
    await login(loginPage);
    await sharedPage.navigate();
    await sharedPage.dataTable.performClickFolderOrFileToOpen(item);
  };

  const openInSearch = async (searchPage: SearchPage, loginPage: LoginPage, data: ConsumerFile): Promise<void> => {
    await login(loginPage);
    await searchPage.searchWithin(data.random, 'filesAndFolders', 'formula');
    await searchPage.dataTable.performClickFolderOrFileToOpen(data.name);
  };

  test.beforeAll(async () => {
    test.setTimeout(timeouts.extendedTest);
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username: userManager });
    await apiClientFactory.createUser({ username: userConsumer });

    managerNodeActions = await NodesApi.initialize(userManager, userManager);
    managerSiteActions = await SitesApi.initialize(userManager, userManager);
    managerFileActions = await FileActionsApi.initialize(userManager, userManager);
    managerSearchActions = await SearchApi.initialize(userManager, userManager);
    consumerNodeActions = await NodesApi.initialize(userConsumer, userConsumer);
    consumerFavoritesActions = await FavoritesApi.initialize(userConsumer, userConsumer);
    consumerShareActions = await SharedLinksApi.initialize(userConsumer, userConsumer);

    await managerSiteActions.createSite(sitePrivate, Site.VisibilityEnum.PRIVATE);
    docLibId = await managerSiteActions.getDocLibId(sitePrivate);
    await managerSiteActions.addSiteMember(sitePrivate, userConsumer, Site.RoleEnum.SiteConsumer);
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(undefined, undefined, 'afterAll failed', managerSiteActions, [sitePrivate]);
  });

  test.describe('File Libraries', () => {
    test.describe('File Libraries - Office file', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-docx.docx`, {
        office: true,
        viewerToolbarPrimary: viewerPrimary,
        viewerToolbarMore: viewerMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4808] Actions for Consumer on a file Office', async ({ loginPage, myLibrariesPage }) => {
        await openInLibraries(myLibrariesPage, loginPage, item.name);
        await verifyViewerActions(myLibrariesPage, item);
      });
    });

    test.describe('File Libraries - Office file, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-docx-fav.docx`, {
        office: true,
        favorite: true,
        viewerToolbarPrimary: viewerPrimary,
        viewerToolbarMore: viewerFavMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4809] Actions for Consumer on a file Office, favorite', async ({ loginPage, myLibrariesPage }) => {
        await openInLibraries(myLibrariesPage, loginPage, item.name);
        await verifyViewerActions(myLibrariesPage, item);
      });
    });

    test.describe('File Libraries - non-Office file', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}.txt`, {
        versionable: true,
        viewerToolbarPrimary: viewerPrimary,
        viewerToolbarMore: viewerMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4810] Actions for Consumer on a file, not Office', async ({ loginPage, myLibrariesPage }) => {
        await openInLibraries(myLibrariesPage, loginPage, item.name);
        await verifyViewerActions(myLibrariesPage, item);
      });
    });

    test.describe('File Libraries - non-Office file, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-fav.txt`, {
        versionable: true,
        favorite: true,
        viewerToolbarPrimary: viewerPrimary,
        viewerToolbarMore: viewerFavMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4811] Actions for Consumer on a file, not Office, favorite', async ({ loginPage, myLibrariesPage }) => {
        await openInLibraries(myLibrariesPage, loginPage, item.name);
        await verifyViewerActions(myLibrariesPage, item);
      });
    });

    test.describe('File Libraries - non-versionable file', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-not-versionable.txt`, {
        viewerToolbarPrimary: viewerPrimary,
        viewerToolbarMore: viewerNotVersionableMore,
        expectNoManageVersions: true
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-20145] Manage Versions is not shown for a file without cm:versionable aspect', async ({ loginPage, myLibrariesPage }) => {
        await openInLibraries(myLibrariesPage, loginPage, item.name);
        await verifyViewerActions(myLibrariesPage, item);
      });
    });

    test.describe('File Libraries - Office file, shared', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-docx-shared.docx`, {
        office: true,
        shared: true,
        viewerToolbarPrimary: viewerSharedPrimary,
        viewerToolbarMore: viewerMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4814] Actions for Consumer on a file Office, shared', async ({ loginPage, myLibrariesPage }) => {
        await openInLibraries(myLibrariesPage, loginPage, item.name);
        await verifyViewerActions(myLibrariesPage, item);
      });
    });

    test.describe('File Libraries - Office file, shared, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-docx-shared-fav.docx`, {
        office: true,
        shared: true,
        favorite: true,
        viewerToolbarPrimary: viewerSharedPrimary,
        viewerToolbarMore: viewerFavMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4815] Actions for Consumer on a file Office, shared, favorite', async ({ loginPage, myLibrariesPage }) => {
        await openInLibraries(myLibrariesPage, loginPage, item.name);
        await verifyViewerActions(myLibrariesPage, item);
      });
    });

    test.describe('File Libraries - non-Office file, shared', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-shared.txt`, {
        versionable: true,
        shared: true,
        viewerToolbarPrimary: viewerSharedPrimary,
        viewerToolbarMore: viewerMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4816] Actions for Consumer on a file, not Office, shared', async ({ loginPage, myLibrariesPage }) => {
        await openInLibraries(myLibrariesPage, loginPage, item.name);
        await verifyViewerActions(myLibrariesPage, item);
      });
    });

    test.describe('File Libraries - non-Office file, shared, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-shared-fav.txt`, {
        versionable: true,
        shared: true,
        favorite: true,
        viewerToolbarPrimary: viewerSharedPrimary,
        viewerToolbarMore: viewerFavMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4817] Actions for Consumer on a file, not Office, shared, favorite', async ({ loginPage, myLibrariesPage }) => {
        await openInLibraries(myLibrariesPage, loginPage, item.name);
        await verifyViewerActions(myLibrariesPage, item);
      });
    });

    test.describe('File Libraries - locked file', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-locked`, {
        versionable: true,
        locked: true,
        viewerToolbarPrimary: viewerLockedPrimary,
        viewerToolbarMore: viewerLockedMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4812] Actions for Consumer on a file, locked', async ({ loginPage, myLibrariesPage }) => {
        await openInLibraries(myLibrariesPage, loginPage, item.name);
        await verifyViewerActions(myLibrariesPage, item);
      });
    });

    test.describe('File Libraries - locked file, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-fav-locked`, {
        versionable: true,
        favorite: true,
        locked: true,
        viewerToolbarPrimary: viewerLockedPrimary,
        viewerToolbarMore: viewerLockedFavWorkingCopyMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4813] Actions for Consumer on a file, locked, favorite', async ({ loginPage, myLibrariesPage }) => {
        await openInLibraries(myLibrariesPage, loginPage, item.name);
        await verifyViewerActions(myLibrariesPage, item);
      });
    });

    test.describe('File Libraries - locked file, shared', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-shared-locked`, {
        versionable: true,
        shared: true,
        locked: true,
        viewerToolbarPrimary: viewerLockedPrimary,
        viewerToolbarMore: viewerLockedMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4818] Actions for Consumer on a file, locked, shared', async ({ loginPage, myLibrariesPage }) => {
        await openInLibraries(myLibrariesPage, loginPage, item.name);
        await verifyViewerActions(myLibrariesPage, item);
      });
    });

    test.describe('File Libraries - locked file, shared, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-shared-fav-locked`, {
        versionable: true,
        shared: true,
        favorite: true,
        locked: true,
        viewerToolbarPrimary: viewerLockedPrimary,
        viewerToolbarMore: viewerLockedFavWorkingCopyMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4819] Actions for Consumer on a file, locked, shared, favorite', async ({ loginPage, myLibrariesPage }) => {
        await openInLibraries(myLibrariesPage, loginPage, item.name);
        await verifyViewerActions(myLibrariesPage, item);
      });
    });
  });

  test.describe('Favorites', () => {
    test.describe('Favorites - Office file, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-docx-fav.docx`, {
        office: true,
        favorite: true,
        viewerToolbarPrimary: viewerPrimary,
        viewerToolbarMore: viewerFavMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4820] File Office, favorite - ', async ({ loginPage, favoritePage }) => {
        await openInFavorites(favoritePage, loginPage, item.name);
        await verifyViewerActions(favoritePage, item);
      });
    });

    test.describe('Favorites - non-Office file, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-fav.txt`, {
        versionable: true,
        favorite: true,
        viewerToolbarPrimary: viewerPrimary,
        viewerToolbarMore: viewerFavMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4821] Actions for Consumer on a file, not Office, favorite', async ({ loginPage, favoritePage }) => {
        await openInFavorites(favoritePage, loginPage, item.name);
        await verifyViewerActions(favoritePage, item);
      });
    });

    test.describe('Favorites - Office file, shared, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-docx-shared-fav.docx`, {
        office: true,
        shared: true,
        favorite: true,
        viewerToolbarPrimary: viewerSharedPrimary,
        viewerToolbarMore: viewerFavMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4823] Actions for Consumer on a file Office, shared, favorite', async ({ loginPage, favoritePage }) => {
        await openInFavorites(favoritePage, loginPage, item.name);
        await verifyViewerActions(favoritePage, item);
      });
    });

    test.describe('Favorites - non-Office file, shared, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-shared-fav.txt`, {
        versionable: true,
        shared: true,
        favorite: true,
        viewerToolbarPrimary: viewerSharedPrimary,
        viewerToolbarMore: viewerFavMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4824] Actions for Consumer on a file, not Office, shared, favorite', async ({ loginPage, favoritePage }) => {
        await openInFavorites(favoritePage, loginPage, item.name);
        await verifyViewerActions(favoritePage, item);
      });
    });

    test.describe('Favorites - locked file, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-fav-locked`, {
        versionable: true,
        favorite: true,
        locked: true,
        viewerToolbarPrimary: viewerLockedPrimary,
        viewerToolbarMore: viewerLockedFavOriginalMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4822] Actions for Consumer on a file, locked, favorite', async ({ loginPage, favoritePage }) => {
        await openInFavorites(favoritePage, loginPage, item.name);
        await verifyViewerActions(favoritePage, item);
      });
    });

    test.describe('Favorites - locked file, shared, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-shared-fav-locked`, {
        versionable: true,
        shared: true,
        favorite: true,
        locked: true,
        viewerToolbarPrimary: viewerLockedPrimary,
        viewerToolbarMore: viewerLockedFavOriginalMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4825] Actions for Consumer on a file, locked, shared, favorite', async ({ loginPage, favoritePage }) => {
        await openInFavorites(favoritePage, loginPage, item.name);
        await verifyViewerActions(favoritePage, item);
      });
    });
  });

  test.describe('Shared Files', () => {
    test.describe('Shared Files - Office file, shared', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-docx-shared.docx`, {
        office: true,
        shared: true,
        viewerToolbarPrimary: viewerSharedPrimary,
        viewerToolbarMore: viewerMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4826] Actions for Consumer on a file Office, shared', async ({ loginPage, sharedPage }) => {
        await openInShared(sharedPage, loginPage, item.name);
        await verifyViewerActions(sharedPage, item);
      });
    });

    test.describe('Shared Files - Office file, shared, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-docx-shared-fav.docx`, {
        office: true,
        shared: true,
        favorite: true,
        viewerToolbarPrimary: viewerSharedPrimary,
        viewerToolbarMore: viewerFavMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4827] Actions for Consumer on a file Office, shared, favorite', async ({ loginPage, sharedPage }) => {
        await openInShared(sharedPage, loginPage, item.name);
        await verifyViewerActions(sharedPage, item);
      });
    });

    test.describe('Shared Files - non-Office file, shared', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-shared.txt`, {
        versionable: true,
        shared: true,
        viewerToolbarPrimary: viewerSharedPrimary,
        viewerToolbarMore: viewerMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4828] Actions for Consumer on a file, not Office, shared', async ({ loginPage, sharedPage }) => {
        await openInShared(sharedPage, loginPage, item.name);
        await verifyViewerActions(sharedPage, item);
      });
    });

    test.describe('Shared Files - non-Office file, shared, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-shared-fav.txt`, {
        versionable: true,
        shared: true,
        favorite: true,
        viewerToolbarPrimary: viewerSharedPrimary,
        viewerToolbarMore: viewerFavMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4829] Actions for Consumer on a file, not Office, shared, favorite', async ({ loginPage, sharedPage }) => {
        await openInShared(sharedPage, loginPage, item.name);
        await verifyViewerActions(sharedPage, item);
      });
    });

    test.describe('Shared Files - locked file, shared', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-shared-locked`, {
        versionable: true,
        shared: true,
        locked: true,
        viewerToolbarPrimary: viewerLockedPrimary,
        viewerToolbarMore: viewerLockedMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4830] Actions for Consumer on a file, locked, shared', async ({ loginPage, sharedPage }) => {
        await openInShared(sharedPage, loginPage, item.name);
        await verifyViewerActions(sharedPage, item);
      });
    });

    test.describe('Shared Files - locked file, shared, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-shared-fav-locked`, {
        versionable: true,
        shared: true,
        favorite: true,
        locked: true,
        viewerToolbarPrimary: viewerLockedPrimary,
        viewerToolbarMore: viewerLockedFavOriginalMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4831] Actions for Consumer on a file, locked, shared, favorite', async ({ loginPage, sharedPage }) => {
        await openInShared(sharedPage, loginPage, item.name);
        await verifyViewerActions(sharedPage, item);
      });
    });
  });

  test.describe('Search Results', () => {
    test.describe('Search Results - Office file', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-docx.docx`, {
        office: true,
        viewerToolbarPrimary: viewerPrimary,
        viewerToolbarMore: viewerMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4832] Actions for Consumer on a file Office', async ({ loginPage, searchPage }) => {
        await openInSearch(searchPage, loginPage, item);
        await verifyViewerActions(searchPage, item);
      });
    });

    test.describe('Search Results - Office file, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-docx-fav.docx`, {
        office: true,
        favorite: true,
        viewerToolbarPrimary: viewerPrimary,
        viewerToolbarMore: viewerFavMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4833] Actions for Consumer on a file Office, favorite', async ({ loginPage, searchPage }) => {
        await openInSearch(searchPage, loginPage, item);
        await verifyViewerActions(searchPage, item);
      });
    });

    test.describe('Search Results - non-Office file', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}.txt`, {
        versionable: true,
        viewerToolbarPrimary: viewerPrimary,
        viewerToolbarMore: viewerMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4834] Actions for Consumer on a file, not Office', async ({ loginPage, searchPage }) => {
        await openInSearch(searchPage, loginPage, item);
        await verifyViewerActions(searchPage, item);
      });
    });

    test.describe('Search Results - non-Office file, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-fav.txt`, {
        versionable: true,
        favorite: true,
        viewerToolbarPrimary: viewerPrimary,
        viewerToolbarMore: viewerFavMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4835] Actions for Consumer on a file, not Office, favorite', async ({ loginPage, searchPage }) => {
        await openInSearch(searchPage, loginPage, item);
        await verifyViewerActions(searchPage, item);
      });
    });

    test.describe('Search Results - non-versionable file', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-not-versionable.txt`, {
        viewerToolbarPrimary: viewerPrimary,
        viewerToolbarMore: viewerNotVersionableMore,
        expectNoManageVersions: true
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-20146] Manage Versions is not shown for a file without cm:versionable aspect - Search Results', async ({
        loginPage,
        searchPage
      }) => {
        await openInSearch(searchPage, loginPage, item);
        await verifyViewerActions(searchPage, item);
      });
    });

    test.describe('Search Results - Office file, shared', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-docx-shared.docx`, {
        office: true,
        shared: true,
        viewerToolbarPrimary: viewerSharedPrimary,
        viewerToolbarMore: viewerMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4838] Actions for Consumer on a file Office, shared', async ({ loginPage, searchPage }) => {
        await openInSearch(searchPage, loginPage, item);
        await verifyViewerActions(searchPage, item);
      });
    });

    test.describe('Search Results - Office file, shared, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-docx-shared-fav.docx`, {
        office: true,
        shared: true,
        favorite: true,
        viewerToolbarPrimary: viewerSharedPrimary,
        viewerToolbarMore: viewerFavMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4839] Actions for Consumer on a file Office, shared, favorite', async ({ loginPage, searchPage }) => {
        await openInSearch(searchPage, loginPage, item);
        await verifyViewerActions(searchPage, item);
      });
    });

    test.describe('Search Results - non-Office file, shared', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-shared.txt`, {
        versionable: true,
        shared: true,
        viewerToolbarPrimary: viewerSharedPrimary,
        viewerToolbarMore: viewerMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4840] Actions for Consumer on a file, not Office, shared', async ({ loginPage, searchPage }) => {
        await openInSearch(searchPage, loginPage, item);
        await verifyViewerActions(searchPage, item);
      });
    });

    test.describe('Search Results - non-Office file, shared, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-shared-fav.txt`, {
        versionable: true,
        shared: true,
        favorite: true,
        viewerToolbarPrimary: viewerSharedPrimary,
        viewerToolbarMore: viewerFavMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4841] Actions for Consumer on a file, not Office, shared, favorite', async ({ loginPage, searchPage }) => {
        await openInSearch(searchPage, loginPage, item);
        await verifyViewerActions(searchPage, item);
      });
    });

    test.describe('Search Results - locked file', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-locked`, {
        versionable: true,
        locked: true,
        viewerToolbarPrimary: viewerLockedPrimary,
        viewerToolbarMore: viewerLockedMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4836] Actions for Consumer on a file, locked', async ({ loginPage, searchPage }) => {
        await openInSearch(searchPage, loginPage, item);
        await verifyViewerActions(searchPage, item);
      });
    });

    test.describe('Search Results - locked file, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-fav-locked`, {
        versionable: true,
        favorite: true,
        locked: true,
        viewerToolbarPrimary: viewerLockedPrimary,
        viewerToolbarMore: viewerLockedFavWorkingCopyMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4837] Actions for Consumer on a file, locked, favorite', async ({ loginPage, searchPage }) => {
        await openInSearch(searchPage, loginPage, item);
        await verifyViewerActions(searchPage, item);
      });
    });

    test.describe('Search Results - locked file, shared', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-shared-locked`, {
        versionable: true,
        shared: true,
        locked: true,
        viewerToolbarPrimary: viewerLockedPrimary,
        viewerToolbarMore: viewerLockedMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4842] Actions for Consumer on a file, locked, shared', async ({ loginPage, searchPage }) => {
        await openInSearch(searchPage, loginPage, item);
        await verifyViewerActions(searchPage, item);
      });
    });

    test.describe('Search Results - locked file, shared, favorite', () => {
      const item = buildFile((fileRandom) => `file-${fileRandom}-shared-fav-locked`, {
        versionable: true,
        shared: true,
        favorite: true,
        locked: true,
        viewerToolbarPrimary: viewerLockedPrimary,
        viewerToolbarMore: viewerLockedFavWorkingCopyMore
      });

      test.beforeAll(() => provisionFile(item));

      test('[XAT-4843] Actions for Consumer on a file, locked, shared, favorite', async ({ loginPage, searchPage }) => {
        await openInSearch(searchPage, loginPage, item);
        await verifyViewerActions(searchPage, item);
      });
    });
  });
});
