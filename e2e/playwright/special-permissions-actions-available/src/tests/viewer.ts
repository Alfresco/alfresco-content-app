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

import { expect } from '@playwright/test';
import { FavoritesPage, LoginPage, MyLibrariesPage, SearchPage, SharedPage, TestFileData, test } from '@alfresco/aca-playwright-shared';
import * as testData from '@alfresco/aca-playwright-shared';

type ViewerCapablePage = MyLibrariesPage | FavoritesPage | SharedPage | SearchPage;

export function viewerTests(userConsumer: string, siteName: string) {
  const login = async (loginPage: LoginPage): Promise<void> => {
    await loginPage.navigate();
    await loginPage.loginUser({ username: userConsumer, password: userConsumer });
  };

  const verifyViewerActions = async (page: ViewerCapablePage, data: TestFileData, expectNoManageVersions = false): Promise<void> => {
    expect(await page.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
    await page.viewer.verifyViewerPrimaryActions(data.viewerToolbarPrimary);
    await page.viewer.toolbar.clickMoreActions();
    await page.matMenu.verifyActualMoreActions(data.viewerToolbarMore);

    if (expectNoManageVersions) {
      const actualMoreActions = await page.matMenu.getActualMoreActions();
      expect(actualMoreActions.includes('Manage Versions'), 'Manage Versions should not be visible for a non-versionable file').toBe(false);
    }
  };

  test.describe('Consumer available actions : ', () => {
    test.describe('file opened from File Libraries', () => {
      const openInViewer = async (myLibrariesPage: MyLibrariesPage, loginPage: LoginPage, item: string): Promise<void> => {
        await login(loginPage);
        await myLibrariesPage.navigate();
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(item);
      };

      test('[XAT-4808] Actions for Consumer on a file Office', async ({ loginPage, myLibrariesPage }) => {
        await openInViewer(myLibrariesPage, loginPage, testData.fileDocx.name);
        await verifyViewerActions(myLibrariesPage, testData.fileDocx);
      });

      test('[XAT-4809] Actions for Consumer on a file Office, favorite', async ({ loginPage, myLibrariesPage }) => {
        await openInViewer(myLibrariesPage, loginPage, testData.fileDocxFav.name);
        await verifyViewerActions(myLibrariesPage, testData.fileDocxFav);
      });

      test('[XAT-4810] Actions for Consumer on a file, not Office', async ({ loginPage, myLibrariesPage }) => {
        await openInViewer(myLibrariesPage, loginPage, testData.file.name);
        await verifyViewerActions(myLibrariesPage, testData.file);
      });

      test('[XAT-4811] Actions for Consumer on a file, not Office, favorite', async ({ loginPage, myLibrariesPage }) => {
        await openInViewer(myLibrariesPage, loginPage, testData.fileFav.name);
        await verifyViewerActions(myLibrariesPage, testData.fileFav);
      });

      test('[XAT-20145] Manage Versions is not shown for a file without cm:versionable aspect', async ({ loginPage, myLibrariesPage }) => {
        await openInViewer(myLibrariesPage, loginPage, testData.fileNotVersionable.name);
        await verifyViewerActions(myLibrariesPage, testData.fileNotVersionable, true);
      });

      test('[XAT-4814] Actions for Consumer on a file Office, shared', async ({ loginPage, myLibrariesPage }) => {
        await openInViewer(myLibrariesPage, loginPage, testData.fileDocxShared.name);
        await verifyViewerActions(myLibrariesPage, testData.fileDocxShared);
      });

      test('[XAT-4815] Actions for Consumer on a file Office, shared, favorite', async ({ loginPage, myLibrariesPage }) => {
        await openInViewer(myLibrariesPage, loginPage, testData.fileDocxSharedFav.name);
        await verifyViewerActions(myLibrariesPage, testData.fileDocxSharedFav);
      });

      test('[XAT-4816] Actions for Consumer on a file, not Office, shared', async ({ loginPage, myLibrariesPage }) => {
        await openInViewer(myLibrariesPage, loginPage, testData.fileShared.name);
        await verifyViewerActions(myLibrariesPage, testData.fileShared);
      });

      test('[XAT-4817] Actions for Consumer on a file, not Office, shared, favorite', async ({ loginPage, myLibrariesPage }) => {
        await openInViewer(myLibrariesPage, loginPage, testData.fileSharedFav.name);
        await verifyViewerActions(myLibrariesPage, testData.fileSharedFav);
      });

      test('[XAT-4812] Actions for Consumer on a file, locked', async ({ loginPage, myLibrariesPage }) => {
        await openInViewer(myLibrariesPage, loginPage, testData.fileLocked.name);
        await verifyViewerActions(myLibrariesPage, testData.fileLocked);
      });

      test('[XAT-4813] Actions for Consumer on a file, locked, favorite', async ({ loginPage, myLibrariesPage }) => {
        await openInViewer(myLibrariesPage, loginPage, testData.fileFavLocked.name);
        await verifyViewerActions(myLibrariesPage, testData.fileFavLocked);
      });

      test('[XAT-4818] Actions for Consumer on a file, locked, shared', async ({ loginPage, myLibrariesPage }) => {
        await openInViewer(myLibrariesPage, loginPage, testData.fileSharedLocked.name);
        await verifyViewerActions(myLibrariesPage, testData.fileSharedLocked);
      });

      test('[XAT-4819] Actions for Consumer on a file, locked, shared, favorite', async ({ loginPage, myLibrariesPage }) => {
        await openInViewer(myLibrariesPage, loginPage, testData.fileSharedFavLocked.name);
        await verifyViewerActions(myLibrariesPage, testData.fileSharedFavLocked);
      });
    });

    test.describe('file opened from Favorites', () => {
      const openInViewer = async (favoritePage: FavoritesPage, loginPage: LoginPage, item: string): Promise<void> => {
        await login(loginPage);
        await favoritePage.navigate();
        await favoritePage.dataTable.performClickFolderOrFileToOpen(item);
      };

      test('[XAT-4820] File Office, favorite - ', async ({ loginPage, favoritePage }) => {
        await openInViewer(favoritePage, loginPage, testData.fileDocxFav.name);
        await verifyViewerActions(favoritePage, testData.fileDocxFav);
      });

      test('[XAT-4821] Actions for Consumer on a file, not Office, favorite', async ({ loginPage, favoritePage }) => {
        await openInViewer(favoritePage, loginPage, testData.fileFav.name);
        await verifyViewerActions(favoritePage, testData.fileFav);
      });

      test('[XAT-4823] Actions for Consumer on a file Office, shared, favorite', async ({ loginPage, favoritePage }) => {
        await openInViewer(favoritePage, loginPage, testData.fileDocxSharedFav.name);
        await verifyViewerActions(favoritePage, testData.fileDocxSharedFav);
      });

      test('[XAT-4824] Actions for Consumer on a file, not Office, shared, favorite', async ({ loginPage, favoritePage }) => {
        await openInViewer(favoritePage, loginPage, testData.fileSharedFav.name);
        await verifyViewerActions(favoritePage, testData.fileSharedFav);
      });

      test('[XAT-4822] Actions for Consumer on a file, locked, favorite', async ({ loginPage, favoritePage }) => {
        await openInViewer(favoritePage, loginPage, testData.fileFavLocked.name);
        await verifyViewerActions(favoritePage, testData.fileFavLocked);
      });

      test('[XAT-4825] Actions for Consumer on a file, locked, shared, favorite', async ({ loginPage, favoritePage }) => {
        await openInViewer(favoritePage, loginPage, testData.fileSharedFavLocked.name);
        await verifyViewerActions(favoritePage, testData.fileSharedFavLocked);
      });
    });

    test.describe('file opened from Shared Files', () => {
      const openInViewer = async (sharedPage: SharedPage, loginPage: LoginPage, item: string): Promise<void> => {
        await login(loginPage);
        await sharedPage.navigate();
        await sharedPage.dataTable.performClickFolderOrFileToOpen(item);
      };

      test('[XAT-4826] Actions for Consumer on a file Office, shared', async ({ loginPage, sharedPage }) => {
        await openInViewer(sharedPage, loginPage, testData.fileDocxShared.name);
        await verifyViewerActions(sharedPage, testData.fileDocxShared);
      });

      test('[XAT-4827] Actions for Consumer on a file Office, shared, favorite', async ({ loginPage, sharedPage }) => {
        await openInViewer(sharedPage, loginPage, testData.fileDocxSharedFav.name);
        await verifyViewerActions(sharedPage, testData.fileDocxSharedFav);
      });

      test('[XAT-4828] Actions for Consumer on a file, not Office, shared', async ({ loginPage, sharedPage }) => {
        await openInViewer(sharedPage, loginPage, testData.fileShared.name);
        await verifyViewerActions(sharedPage, testData.fileShared);
      });

      test('[XAT-4829] Actions for Consumer on a file, not Office, shared, favorite', async ({ loginPage, sharedPage }) => {
        await openInViewer(sharedPage, loginPage, testData.fileSharedFav.name);
        await verifyViewerActions(sharedPage, testData.fileSharedFav);
      });

      test('[XAT-4830] Actions for Consumer on a file, locked, shared', async ({ loginPage, sharedPage }) => {
        await openInViewer(sharedPage, loginPage, testData.fileSharedLocked.name);
        await verifyViewerActions(sharedPage, testData.fileSharedLocked);
      });

      test('[XAT-4831] Actions for Consumer on a file, locked, shared, favorite', async ({ loginPage, sharedPage }) => {
        await openInViewer(sharedPage, loginPage, testData.fileSharedFavLocked.name);
        await verifyViewerActions(sharedPage, testData.fileSharedFavLocked);
      });
    });

    test.describe('file opened from Search Results', () => {
      const openInViewer = async (searchPage: SearchPage, loginPage: LoginPage, data: TestFileData): Promise<void> => {
        await login(loginPage);
        await searchPage.searchWithin(data.random, 'filesAndFolders');
        await searchPage.dataTable.performClickFolderOrFileToOpen(data.name);
      };

      test('[XAT-4832] Actions for Consumer on a file Office', async ({ loginPage, searchPage }) => {
        await openInViewer(searchPage, loginPage, testData.fileDocx);
        await verifyViewerActions(searchPage, testData.fileDocx);
      });

      test('[XAT-4833] Actions for Consumer on a file Office, favorite', async ({ loginPage, searchPage }) => {
        await openInViewer(searchPage, loginPage, testData.fileDocxFav);
        await verifyViewerActions(searchPage, testData.fileDocxFav);
      });

      test('[XAT-4834] Actions for Consumer on a file, not Office', async ({ loginPage, searchPage }) => {
        await openInViewer(searchPage, loginPage, testData.file);
        await verifyViewerActions(searchPage, testData.file);
      });

      test('[XAT-4835] Actions for Consumer on a file, not Office, favorite', async ({ loginPage, searchPage }) => {
        await openInViewer(searchPage, loginPage, testData.fileFav);
        await verifyViewerActions(searchPage, testData.fileFav);
      });

      test('[XAT-20146] Manage Versions is not shown for a file without cm:versionable aspect - Search Results', async ({
        loginPage,
        searchPage
      }) => {
        await openInViewer(searchPage, loginPage, testData.fileNotVersionable);
        await verifyViewerActions(searchPage, testData.fileNotVersionable, true);
      });

      test('[XAT-4838] Actions for Consumer on a file Office, shared', async ({ loginPage, searchPage }) => {
        await openInViewer(searchPage, loginPage, testData.fileDocxShared);
        await verifyViewerActions(searchPage, testData.fileDocxShared);
      });

      test('[XAT-4839] Actions for Consumer on a file Office, shared, favorite', async ({ loginPage, searchPage }) => {
        await openInViewer(searchPage, loginPage, testData.fileDocxSharedFav);
        await verifyViewerActions(searchPage, testData.fileDocxSharedFav);
      });

      test('[XAT-4840] Actions for Consumer on a file, not Office, shared', async ({ loginPage, searchPage }) => {
        await openInViewer(searchPage, loginPage, testData.fileShared);
        await verifyViewerActions(searchPage, testData.fileShared);
      });

      test('[XAT-4841] Actions for Consumer on a file, not Office, shared, favorite', async ({ loginPage, searchPage }) => {
        await openInViewer(searchPage, loginPage, testData.fileSharedFav);
        await verifyViewerActions(searchPage, testData.fileSharedFav);
      });

      test('[XAT-4836] Actions for Consumer on a file, locked', async ({ loginPage, searchPage }) => {
        await openInViewer(searchPage, loginPage, testData.fileLocked);
        await verifyViewerActions(searchPage, testData.fileLocked);
      });

      test('[XAT-4837] Actions for Consumer on a file, locked, favorite', async ({ loginPage, searchPage }) => {
        await openInViewer(searchPage, loginPage, testData.fileFavLocked);
        await verifyViewerActions(searchPage, testData.fileFavLocked);
      });

      test('[XAT-4842] Actions for Consumer on a file, locked, shared', async ({ loginPage, searchPage }) => {
        await openInViewer(searchPage, loginPage, testData.fileSharedLocked);
        await verifyViewerActions(searchPage, testData.fileSharedLocked);
      });

      test('[XAT-4843] Actions for Consumer on a file, locked, shared, favorite', async ({ loginPage, searchPage }) => {
        await openInViewer(searchPage, loginPage, testData.fileSharedFavLocked);
        await verifyViewerActions(searchPage, testData.fileSharedFavLocked);
      });
    });
  });
}
