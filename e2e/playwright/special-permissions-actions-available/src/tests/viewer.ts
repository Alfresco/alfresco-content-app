/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { FavoritesPage, LoginPage, MyLibrariesPage, SearchPage, SharedPage, test } from '@alfresco/aca-playwright-shared';
import * as testData from '@alfresco/aca-playwright-shared';

export function viewerTests(userConsumer: string, siteName: string) {
  test.describe('Consumer available actions : ', () => {
    test.describe('file opened from File Libraries', () => {
      async function checkViewerActions(
        loginPage: LoginPage,
        myLibrariesPage: MyLibrariesPage,
        item: string,
        expectedToolbarPrimary: string[],
        expectedToolbarMore: string[]
      ): Promise<void> {
        await loginPage.navigate();
        await loginPage.loginUser({ username: userConsumer, password: userConsumer });
        await myLibrariesPage.navigate();
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(item);
        expect(await myLibrariesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
        await myLibrariesPage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await myLibrariesPage.acaHeader.clickViewerMoreActions();
        await myLibrariesPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      }

      test('[XAT-4808] Actions for Consumer on a file Office', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileDocx.name,
          testData.fileDocx.viewerToolbarPrimary,
          testData.fileDocx.viewerToolbarMore
        );
      });

      test('[XAT-4809] Actions for Consumer on a file Office, favorite', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileDocxFav.name,
          testData.fileDocxFav.viewerToolbarPrimary,
          testData.fileDocxFav.viewerToolbarMore
        );
      });

      test('[XAT-4810] Actions for Consumer on a file, not Office', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(loginPage, myLibrariesPage, testData.file.name, testData.file.viewerToolbarPrimary, testData.file.viewerToolbarMore);
      });

      test('[XAT-4811] Actions for Consumer on a file, not Office, favorite', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileFav.name,
          testData.fileFav.viewerToolbarPrimary,
          testData.fileFav.viewerToolbarMore
        );
      });

      test('[XAT-4814] Actions for Consumer on a file Office, shared', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileDocxShared.name,
          testData.fileDocxShared.viewerToolbarPrimary,
          testData.fileDocxShared.viewerToolbarMore
        );
      });

      test('[XAT-4815] Actions for Consumer on a file Office, shared, favorite', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });

      test('[XAT-4816] Actions for Consumer on a file, not Office, shared', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileShared.name,
          testData.fileShared.viewerToolbarPrimary,
          testData.fileShared.viewerToolbarMore
        );
      });

      test('[XAT-4817] Actions for Consumer on a file, not Office, shared, favorite', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });

      test('[XAT-4812] Actions for Consumer on a file, locked', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileLocked.name,
          testData.fileLocked.viewerToolbarPrimary,
          testData.fileLocked.viewerToolbarMore
        );
      });

      test('[XAT-4813] Actions for Consumer on a file, locked, favorite', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileFavLocked.name,
          testData.fileFavLocked.viewerToolbarPrimary,
          testData.fileFavLocked.viewerToolbarMore
        );
      });

      test('[XAT-4818] Actions for Consumer on a file, locked, shared', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.viewerToolbarPrimary,
          testData.fileSharedLocked.viewerToolbarMore
        );
      });

      test('[XAT-4819] Actions for Consumer on a file, locked, shared, favorite', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.viewerToolbarPrimary,
          testData.fileSharedFavLocked.viewerToolbarMore
        );
      });
    });

    test.describe('file opened from Favorites', () => {
      async function checkViewerActions(
        loginPage: LoginPage,
        favoritePage: FavoritesPage,
        item: string,
        expectedToolbarPrimary: string[],
        expectedToolbarMore: string[]
      ): Promise<void> {
        await loginPage.navigate();
        await loginPage.loginUser({ username: userConsumer, password: userConsumer });
        await favoritePage.navigate();
        await favoritePage.dataTable.performClickFolderOrFileToOpen(item);
        expect(await favoritePage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
        await favoritePage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await favoritePage.acaHeader.clickViewerMoreActions();
        await favoritePage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      }

      test('[XAT-4820] File Office, favorite - ', async ({ loginPage, favoritePage }) => {
        await checkViewerActions(
          loginPage,
          favoritePage,
          testData.fileDocxFav.name,
          testData.fileDocxFav.viewerToolbarPrimary,
          testData.fileDocxFav.viewerToolbarMore
        );
      });

      test('[XAT-4821] Actions for Consumer on a file, not Office, favorite', async ({ loginPage, favoritePage }) => {
        await checkViewerActions(
          loginPage,
          favoritePage,
          testData.fileFav.name,
          testData.fileFav.viewerToolbarPrimary,
          testData.fileFav.viewerToolbarMore
        );
      });

      test('[XAT-4823] Actions for Consumer on a file Office, shared, favorite', async ({ loginPage, favoritePage }) => {
        await checkViewerActions(
          loginPage,
          favoritePage,
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });

      test('[XAT-4824] Actions for Consumer on a file, not Office, shared, favorite', async ({ loginPage, favoritePage }) => {
        await checkViewerActions(
          loginPage,
          favoritePage,
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });

      test('[XAT-4822] Actions for Consumer on a file, locked, favorite', async ({ loginPage, favoritePage }) => {
        await checkViewerActions(
          loginPage,
          favoritePage,
          testData.fileFavLocked.name,
          testData.fileFavLocked.viewerToolbarPrimary,
          testData.fileFavLocked.viewerToolbarMore
        );
      });

      test('[XAT-4825] Actions for Consumer on a file, locked, shared, favorite', async ({ loginPage, favoritePage }) => {
        await checkViewerActions(
          loginPage,
          favoritePage,
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.viewerToolbarPrimary,
          testData.fileSharedFavLocked.viewerToolbarMore
        );
      });
    });

    test.describe('file opened from Shared Files', () => {
      async function checkViewerActions(
        loginPage: LoginPage,
        sharedPage: SharedPage,
        item: string,
        expectedToolbarPrimary: string[],
        expectedToolbarMore: string[]
      ): Promise<void> {
        await loginPage.navigate();
        await loginPage.loginUser({ username: userConsumer, password: userConsumer });
        await sharedPage.navigate();
        await sharedPage.dataTable.performClickFolderOrFileToOpen(item);
        expect(await sharedPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
        await sharedPage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await sharedPage.acaHeader.clickViewerMoreActions();
        await sharedPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      }

      test('[XAT-4826] Actions for Consumer on a file Office, shared', async ({ loginPage, sharedPage }) => {
        await checkViewerActions(
          loginPage,
          sharedPage,
          testData.fileDocxShared.name,
          testData.fileDocxShared.viewerToolbarPrimary,
          testData.fileDocxShared.viewerToolbarMore
        );
      });

      test('[XAT-4827] Actions for Consumer on a file Office, shared, favorite', async ({ loginPage, sharedPage }) => {
        await checkViewerActions(
          loginPage,
          sharedPage,
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });

      test('[XAT-4828] Actions for Consumer on a file, not Office, shared', async ({ loginPage, sharedPage }) => {
        await checkViewerActions(
          loginPage,
          sharedPage,
          testData.fileShared.name,
          testData.fileShared.viewerToolbarPrimary,
          testData.fileShared.viewerToolbarMore
        );
      });

      test('[XAT-4829] Actions for Consumer on a file, not Office, shared, favorite', async ({ loginPage, sharedPage }) => {
        await checkViewerActions(
          loginPage,
          sharedPage,
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });

      test('[XAT-4830] Actions for Consumer on a file, locked, shared', async ({ loginPage, sharedPage }) => {
        await checkViewerActions(
          loginPage,
          sharedPage,
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.viewerToolbarPrimary,
          testData.fileSharedLocked.viewerToolbarMore
        );
      });

      test('[XAT-4831] Actions for Consumer on a file, locked, shared, favorite', async ({ loginPage, sharedPage }) => {
        await checkViewerActions(
          loginPage,
          sharedPage,
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.viewerToolbarPrimary,
          testData.fileSharedFavLocked.viewerToolbarMore
        );
      });
    });

    test.describe('file opened from Search Results', () => {
      async function checkViewerActions(
        loginPage: LoginPage,
        searchPage: SearchPage,
        item: string,
        expectedToolbarPrimary: string[],
        expectedToolbarMore: string[]
      ): Promise<void> {
        await loginPage.navigate();
        await loginPage.loginUser({ username: userConsumer, password: userConsumer });
        await searchPage.searchWithin(item, 'filesAndFolders');
        await searchPage.searchInput.performDoubleClickFolderOrFileToOpen(item);
        expect(await searchPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
        await searchPage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await searchPage.acaHeader.clickViewerMoreActions();
        await searchPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      }

      test('[XAT-4832] Actions for Consumer on a file Office', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileDocx.name,
          testData.fileDocx.viewerToolbarPrimary,
          testData.fileDocx.viewerToolbarMore
        );
      });

      test('[XAT-4833] Actions for Consumer on a file Office, favorite', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileDocxFav.name,
          testData.fileDocxFav.viewerToolbarPrimary,
          testData.fileDocxFav.viewerToolbarMore
        );
      });

      test('[XAT-4834] Actions for Consumer on a file, not Office', async ({ loginPage, searchPage }) => {
        await checkViewerActions(loginPage, searchPage, testData.file.name, testData.file.viewerToolbarPrimary, testData.file.viewerToolbarMore);
      });

      test('[XAT-4835] Actions for Consumer on a file, not Office, favorite', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileFav.name,
          testData.fileFav.viewerToolbarPrimary,
          testData.fileFav.viewerToolbarMore
        );
      });

      test('[XAT-4838] Actions for Consumer on a file Office, shared', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileDocxShared.name,
          testData.fileDocxShared.viewerToolbarPrimary,
          testData.fileDocxShared.viewerToolbarMore
        );
      });

      test('[XAT-4839] Actions for Consumer on a file Office, shared, favorite', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });

      test('[XAT-4840] Actions for Consumer on a file, not Office, shared', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileShared.name,
          testData.fileShared.viewerToolbarPrimary,
          testData.fileShared.viewerToolbarMore
        );
      });

      test('[XAT-4841] Actions for Consumer on a file, not Office, shared, favorite', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });

      test('[XAT-4836] Actions for Consumer on a file, locked', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileLocked.name,
          testData.fileLocked.viewerToolbarPrimary,
          testData.fileLocked.viewerToolbarMore
        );
      });

      test('[XAT-4837] Actions for Consumer on a file, locked, favorite', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileFavLocked.name,
          testData.fileFavLocked.viewerToolbarPrimary,
          testData.fileFavLocked.viewerToolbarMore
        );
      });

      test('[XAT-4842] Actions for Consumer on a file, locked, shared', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.viewerToolbarPrimary,
          testData.fileSharedLocked.viewerToolbarMore
        );
      });

      test('[XAT-4843] Actions for Consumer on a file, locked, shared, favorite', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.viewerToolbarPrimary,
          testData.fileSharedFavLocked.viewerToolbarMore
        );
      });
    });
  });
}
