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

import { MyLibrariesPage, test, Utils } from '@alfresco/playwright-shared';
import * as testData from '@alfresco/playwright-shared';
import { expect } from '@playwright/test';

async function checkActionsAvailable(
  myLibrariesPage: MyLibrariesPage,
  item: string,
  expectedToolbarPrimary: string[],
  expectedToolbarMore: string[]
): Promise<void> {
  await myLibrariesPage.dataTable.selectItems(item);
  await myLibrariesPage.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
  await myLibrariesPage.acaHeader.clickMoreActions();
  await myLibrariesPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
}

async function checkActionsViewerAvailable(
  myLibrariesPage: MyLibrariesPage,
  item: string,
  expectedToolbarPrimary: string[],
  expectedToolbarMore: string[]
): Promise<void> {
  await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(item);
  expect(await myLibrariesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);
  await myLibrariesPage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
  await myLibrariesPage.acaHeader.clickViewerMoreActions();
  await myLibrariesPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
}

export function collaboratorTests(userCollaborator: string, siteName: string) {
  test.describe('available actions : ', () => {
    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, userCollaborator, userCollaborator, 'beforeEach failed');
    });

    test('on File Libraries - [C297647]', async ({ myLibrariesPage }) => {
      await myLibrariesPage.navigate();
      await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
      await checkActionsAvailable(
        myLibrariesPage,
        testData.fileSharedFav.name,
        testData.collaboratorToolbarPrimary,
        testData.collaboratorEditRowToolbarMore
      );
    });

    test('on Shared Files - [C297651]', async ({ sharedPage, myLibrariesPage }) => {
      await sharedPage.navigate();
      await checkActionsAvailable(
        myLibrariesPage,
        testData.fileSharedFav.name,
        testData.collaboratorToolbarPrimary,
        testData.collaboratorEditRowToolbarMore
      );
    });

    test('on Favorites - [C297652]', async ({ favoritePage, myLibrariesPage }) => {
      await favoritePage.navigate();
      await checkActionsAvailable(
        myLibrariesPage,
        testData.fileSharedFav.name,
        testData.collaboratorToolbarPrimary,
        testData.favoritesCollaboratorToolbarMore
      );
    });

    test('on Search Results - [C297653]', async ({ searchPage, myLibrariesPage }) => {
      await searchPage.navigate({ remoteUrl: `#/search;q=${testData.fileSharedFav.name}` });
      await checkActionsAvailable(
        myLibrariesPage,
        testData.fileSharedFav.name,
        testData.collaboratorToolbarPrimary,
        testData.collaboratorEditRowToolbarMore
      );
    });

    test.describe('available actions in the viewer : ', () => {
      test('file opened from File Libraries - [C297654]', async ({ myLibrariesPage }) => {
        await myLibrariesPage.navigate();
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileDocxSharedFav.name,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorDocToolbarMore
        );
      });

      test('file opened from Shared Files - [C297655]', async ({ sharedPage, myLibrariesPage }) => {
        await sharedPage.navigate();
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileDocxSharedFav.name,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorDocToolbarMore
        );
      });

      test('file opened from Favorites - [C297656]', async ({ favoritePage, myLibrariesPage }) => {
        await favoritePage.navigate();
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileDocxSharedFav.name,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorDocToolbarMore
        );
      });

      test('file opened from Search Results - [C306992]', async ({ searchPage, myLibrariesPage }) => {
        await searchPage.navigate({ remoteUrl: `#/search;q=${testData.fileDocxSharedFav.name}` });
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileDocxSharedFav.name,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorDocToolbarMore
        );
      });
    });
  });
}

export function filesLockedByCurrentUser(userDemoted: string, siteName?: string) {
  test.describe('available actions : ', () => {
    test.beforeEach(async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.loginUser({ username: userDemoted, password: userDemoted });
    });

    test.describe('available actions in the file select : ', () => {
      test('on File Libraries - [C297657]', async ({ myLibrariesPage }) => {
        await myLibrariesPage.navigate();
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
        await checkActionsAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorToolbarPrimary,
          testData.collaboratorLockCurrentUserToolbarMore
        );
      });

      test('on Shared Files - [C297658]', async ({ sharedPage, myLibrariesPage }) => {
        await sharedPage.navigate();
        await checkActionsAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorToolbarPrimary,
          testData.collaboratorLockCurrentUserToolbarMore
        );
      });

      test('on Favorites - [C297659]', async ({ favoritePage, myLibrariesPage }) => {
        await favoritePage.navigate();
        await checkActionsAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorToolbarPrimary,
          testData.favoritesCollaboratorToolbarMore
        );
      });

      test('on Search Results - [C297660]', async ({ searchPage, myLibrariesPage }) => {
        await searchPage.navigate({ remoteUrl: `#/search;q=${testData.fileLockedByUser}` });
        await checkActionsAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorToolbarPrimary,
          testData.collaboratorLockCurrentUserToolbarMore
        );
      });
    });

    test.describe('available actions in the viewer : ', () => {
      test('file opened from File Libraries - [C297661]', async ({ myLibrariesPage }) => {
        await myLibrariesPage.navigate();
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorLockCurrentUserToolbarMore
        );
      });

      test('file opened from Shared Files - [C297662]', async ({ sharedPage, myLibrariesPage }) => {
        await sharedPage.navigate();
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorLockCurrentUserToolbarMore
        );
      });

      test('file opened from Favorites - [C297663]', async ({ favoritePage, myLibrariesPage }) => {
        await favoritePage.navigate();
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorLockCurrentUserToolbarMore
        );
      });

      test('file opened from Search Results - [C306993]', async ({ searchPage, myLibrariesPage }) => {
        await searchPage.navigate({ remoteUrl: `#/search;q=${testData.fileLockedByUser}` });
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorLockCurrentUserToolbarMore
        );
      });
    });
  });
}

export function filesLockedByOtherUser(userManager: string, siteName?: string) {
  test.describe('available actions : ', () => {
    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, userManager, userManager, 'beforeEach failed');
    });

    test('on File Libraries - [C297664]', async ({ myLibrariesPage }) => {
      await myLibrariesPage.navigate();
      await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
      await checkActionsAvailable(
        myLibrariesPage,
        testData.fileLockedByUser,
        testData.collaboratorToolbarPrimary,
        testData.collaboratorLockOtherUserToolbarMore
      );
    });

    test('on Shared Files - [C297665]', async ({ sharedPage, myLibrariesPage }) => {
      const expectedToolbarMore = [
        'Cancel Editing',
        'Upload New Version',
        'Remove Favorite',
        'Move',
        'Copy',
        'Delete',
        'Manage Versions',
        'Permissions'
      ];
      await sharedPage.navigate();
      await checkActionsAvailable(myLibrariesPage, testData.fileLockedByUser, testData.collaboratorToolbarPrimary, expectedToolbarMore);
    });

    test('on Favorites - [C297666]', async ({ favoritePage, myLibrariesPage }) => {
      await favoritePage.navigate();
      await checkActionsAvailable(
        myLibrariesPage,
        testData.fileLockedByUser,
        testData.collaboratorToolbarPrimary,
        testData.favoritesCollaboratorToolbarMore
      );
    });

    test('on Search Results - [C297667]', async ({ searchPage, myLibrariesPage }) => {
      await searchPage.navigate({ remoteUrl: `#/search;q=${testData.fileLockedByUser}` });
      await checkActionsAvailable(
        myLibrariesPage,
        testData.fileLockedByUser,
        testData.collaboratorToolbarPrimary,
        testData.collaboratorLockOtherUserSearchToolbarMore
      );
    });

    test.describe('available actions in the viewer : ', () => {
      test('file opened from File Libraries - [C297671]', async ({ myLibrariesPage }) => {
        await myLibrariesPage.navigate();
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorLockOtherUserToolbarMore
        );
      });

      test('file opened from Shared Files - [C297672]', async ({ sharedPage, myLibrariesPage }) => {
        await sharedPage.navigate();
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorLockOtherUserToolbarMore
        );
      });

      test('file opened from Favorites - [C297673]', async ({ favoritePage, myLibrariesPage }) => {
        await favoritePage.navigate();
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorLockOtherUserToolbarMore
        );
      });

      // TODO: add 'Move' and 'Delete' when ACA-2319 is fixed
      test('file opened from Search Results - [C306994]', async ({ searchPage, myLibrariesPage }) => {
        await searchPage.navigate({ remoteUrl: `#/search;q=${testData.fileLockedByUser}` });
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorLockOtherUserSearchToolbarMore
        );
      });
    });
  });
}
