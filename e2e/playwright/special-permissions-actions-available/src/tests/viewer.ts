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

import { expect } from '@playwright/test';
import { FavoritesPage, LoginPage, MyLibrariesPage, SearchPage, SharedPage, test } from '@alfresco/playwright-shared';
import * as testData from '@alfresco/playwright-shared';

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

      test('File Office - [C326622]', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileDocx.name,
          testData.fileDocx.viewerToolbarPrimary,
          testData.fileDocx.viewerToolbarMore
        );
      });

      test('File Office, favorite - [C326623]', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileDocxFav.name,
          testData.fileDocxFav.viewerToolbarPrimary,
          testData.fileDocxFav.viewerToolbarMore
        );
      });

      test('File simple - [C326624]', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(loginPage, myLibrariesPage, testData.file.name, testData.file.viewerToolbarPrimary, testData.file.viewerToolbarMore);
      });

      test('File favorite - [C326625]', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileFav.name,
          testData.fileFav.viewerToolbarPrimary,
          testData.fileFav.viewerToolbarMore
        );
      });

      test('File Office, shared - [C326637]', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileDocxShared.name,
          testData.fileDocxShared.viewerToolbarPrimary,
          testData.fileDocxShared.viewerToolbarMore
        );
      });

      test('File Office, shared, favorite - [C326638]', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });

      test('File shared - [C326648]', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileShared.name,
          testData.fileShared.viewerToolbarPrimary,
          testData.fileShared.viewerToolbarMore
        );
      });

      test('File shared, favorite - [C326649]', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });

      test('File locked - [C326630]', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileLocked.name,
          testData.fileLocked.viewerToolbarPrimary,
          testData.fileLocked.viewerToolbarMore
        );
      });

      test('File favorite, locked - [C326633]', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileFavLocked.name,
          testData.fileFavLocked.viewerToolbarPrimary,
          testData.fileFavLocked.viewerToolbarMore
        );
      });

      test('File shared, locked - [C326650]', async ({ loginPage, myLibrariesPage }) => {
        await checkViewerActions(
          loginPage,
          myLibrariesPage,
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.viewerToolbarPrimary,
          testData.fileSharedLocked.viewerToolbarMore
        );
      });

      test('File shared, favorite, locked - [C326651]', async ({ loginPage, myLibrariesPage }) => {
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

      test('File Office, favorite - [C326652]', async ({ loginPage, favoritePage }) => {
        await checkViewerActions(
          loginPage,
          favoritePage,
          testData.fileDocxFav.name,
          testData.fileDocxFav.viewerToolbarPrimary,
          testData.fileDocxFav.viewerToolbarMore
        );
      });

      test('File favorite - [C326653]', async ({ loginPage, favoritePage }) => {
        await checkViewerActions(
          loginPage,
          favoritePage,
          testData.fileFav.name,
          testData.fileFav.viewerToolbarPrimary,
          testData.fileFav.viewerToolbarMore
        );
      });

      test('File Office, shared, favorite - [C326655]', async ({ loginPage, favoritePage }) => {
        await checkViewerActions(
          loginPage,
          favoritePage,
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });

      test('File shared, favorite - [C326656]', async ({ loginPage, favoritePage }) => {
        await checkViewerActions(
          loginPage,
          favoritePage,
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });

      test('File favorite, locked - [C326654]', async ({ loginPage, favoritePage }) => {
        await checkViewerActions(
          loginPage,
          favoritePage,
          testData.fileFavLocked.name,
          testData.fileFavLocked.viewerToolbarPrimary,
          testData.fileFavLocked.viewerToolbarMore
        );
      });

      test('File shared, favorite, locked - [C326657]', async ({ loginPage, favoritePage }) => {
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

      test('File Office, shared - [C326658]', async ({ loginPage, sharedPage }) => {
        await checkViewerActions(
          loginPage,
          sharedPage,
          testData.fileDocxShared.name,
          testData.fileDocxShared.viewerToolbarPrimary,
          testData.fileDocxShared.viewerToolbarMore
        );
      });

      test('File Office, shared, favorite - [C326659]', async ({ loginPage, sharedPage }) => {
        await checkViewerActions(
          loginPage,
          sharedPage,
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });

      test('File shared - [C326660]', async ({ loginPage, sharedPage }) => {
        await checkViewerActions(
          loginPage,
          sharedPage,
          testData.fileShared.name,
          testData.fileShared.viewerToolbarPrimary,
          testData.fileShared.viewerToolbarMore
        );
      });

      test('File shared, favorite - [C326661]', async ({ loginPage, sharedPage }) => {
        await checkViewerActions(
          loginPage,
          sharedPage,
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });

      test('File shared, locked - [C326662]', async ({ loginPage, sharedPage }) => {
        await checkViewerActions(
          loginPage,
          sharedPage,
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.viewerToolbarPrimary,
          testData.fileSharedLocked.viewerToolbarMore
        );
      });

      test('File shared, favorite, locked - [C326663]', async ({ loginPage, sharedPage }) => {
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
        await searchPage.navigate({ remoteUrl: `#/search;q=${item}` });
        await searchPage.searchInput.performDoubleClickFolderOrFileToOpen(item);
        expect(await searchPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
        await searchPage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await searchPage.acaHeader.clickViewerMoreActions();
        await searchPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      }

      test('File Office - [C326664]', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileDocx.name,
          testData.fileDocx.viewerToolbarPrimary,
          testData.fileDocx.viewerToolbarMore
        );
      });

      test('File Office, favorite - [C326665]', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileDocxFav.name,
          testData.fileDocxFav.viewerToolbarPrimary,
          testData.fileDocxFav.viewerToolbarMore
        );
      });

      test('File simple - [C326666]', async ({ loginPage, searchPage }) => {
        await checkViewerActions(loginPage, searchPage, testData.file.name, testData.file.viewerToolbarPrimary, testData.file.viewerToolbarMore);
      });

      test('File favorite - [C326667]', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileFav.name,
          testData.fileFav.viewerToolbarPrimary,
          testData.fileFav.viewerToolbarMore
        );
      });

      test('File Office, shared - [C326670]', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileDocxShared.name,
          testData.fileDocxShared.viewerToolbarPrimary,
          testData.fileDocxShared.viewerToolbarMore
        );
      });

      test('File Office, shared, favorite - [C326671]', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });

      test('File shared - [C326672]', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileShared.name,
          testData.fileShared.viewerToolbarPrimary,
          testData.fileShared.viewerToolbarMore
        );
      });

      test('File shared, favorite - [C326673]', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });

      test('File locked - [C326668]', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileLocked.name,
          testData.fileLocked.viewerToolbarPrimary,
          testData.fileLocked.viewerToolbarMore
        );
      });

      test('File favorite, locked - [C326669]', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileFavLocked.name,
          testData.fileFavLocked.viewerToolbarPrimary,
          testData.fileFavLocked.viewerToolbarMore
        );
      });

      test('File shared, locked - [C326674]', async ({ loginPage, searchPage }) => {
        await checkViewerActions(
          loginPage,
          searchPage,
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.viewerToolbarPrimary,
          testData.fileSharedLocked.viewerToolbarMore
        );
      });

      test('File shared, favorite, locked - [C326675]', async ({ loginPage, searchPage }) => {
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
