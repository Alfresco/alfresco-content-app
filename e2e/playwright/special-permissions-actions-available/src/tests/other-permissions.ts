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

import { MyLibrariesPage, test, Utils } from '@alfresco/aca-playwright-shared';
import * as testData from '@alfresco/aca-playwright-shared';
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

    test('[XAT-4844] Toolbar - Actions appear correctly for a file - Collaborator - My Libraries', async ({ myLibrariesPage }) => {
      await myLibrariesPage.navigate();
      await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
      await checkActionsAvailable(
        myLibrariesPage,
        testData.fileSharedFav.name,
        testData.collaboratorToolbarPrimary,
        testData.collaboratorEditRowToolbarMore
      );
    });

    test('[XAT-4845] Toolbar - Actions appear correctly for a file - Collaborator - Shared', async ({ sharedPage, myLibrariesPage }) => {
      await sharedPage.navigate();
      await checkActionsAvailable(
        myLibrariesPage,
        testData.fileSharedFav.name,
        testData.collaboratorToolbarPrimary,
        testData.collaboratorEditRowToolbarMore
      );
    });

    test('[XAT-4846] Toolbar - Actions appear correctly for a file - Collaborator - Favorites', async ({ favoritePage, myLibrariesPage }) => {
      await favoritePage.navigate();
      await checkActionsAvailable(
        myLibrariesPage,
        testData.fileSharedFav.name,
        testData.collaboratorToolbarPrimary,
        testData.favoritesCollaboratorToolbarMore
      );
    });

    test('[XAT-4847] Toolbar - Actions appear correctly for a file - Collaborator - Search Results', async ({ searchPage, myLibrariesPage }) => {
      await searchPage.searchWithin(testData.fileSharedFav.name, 'filesAndFolders');
      await checkActionsAvailable(
        myLibrariesPage,
        testData.fileSharedFav.name,
        testData.collaboratorToolbarPrimary,
        testData.collaboratorEditRowToolbarMore
      );
    });

    test.describe('available actions in the viewer : ', () => {
      test('[XAT-4848] Correct actions appear for file in viewer - Collaborator - My Libraries', async ({ myLibrariesPage }) => {
        await myLibrariesPage.navigate();
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileDocxSharedFav.name,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorDocToolbarMore
        );
      });

      test('[XAT-4849] Correct actions appear for file in viewer - Collaborator - Shared', async ({ sharedPage, myLibrariesPage }) => {
        await sharedPage.navigate();
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileDocxSharedFav.name,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorDocToolbarMore
        );
      });

      test('[XAT-4850] Correct actions appear for file in viewer - Collaborator - Favorites', async ({ favoritePage, myLibrariesPage }) => {
        await favoritePage.navigate();
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileDocxSharedFav.name,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorDocToolbarMore
        );
      });

      test('[XAT-4851] Correct actions appear for file in viewer - Collaborator - Search', async ({ searchPage, myLibrariesPage }) => {
        await searchPage.searchWithin(testData.fileDocxSharedFav.name, 'filesAndFolders');
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
      test('[XAT-4852] Toolbar - Correct actions appear for file - on File Libraries - Locked File', async ({ myLibrariesPage }) => {
        await myLibrariesPage.navigate();
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
        await checkActionsAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorToolbarPrimary,
          testData.collaboratorLockCurrentUserToolbarMore
        );
      });

      test('[XAT-4853] Toolbar - Correct actions appear for file - on Shared Files - Locked File', async ({ sharedPage, myLibrariesPage }) => {
        await sharedPage.navigate();
        await checkActionsAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorToolbarPrimary,
          testData.collaboratorLockCurrentUserToolbarMore
        );
      });

      test('[XAT-4854] Toolbar - Correct actions appear for file - on Favorites - Locked File', async ({ favoritePage, myLibrariesPage }) => {
        await favoritePage.navigate();
        await checkActionsAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorToolbarPrimary,
          testData.favoritesCollaboratorToolbarMore
        );
      });

      test('[XAT-4855] Toolbar - Correct actions appear for file - on Search Results - Locked File', async ({ searchPage, myLibrariesPage }) => {
        await searchPage.searchWithin(testData.fileLockedByUser, 'filesAndFolders');
        await checkActionsAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorToolbarPrimary,
          testData.collaboratorLockCurrentUserToolbarMore
        );
      });
    });

    test.describe('available actions in the viewer : ', () => {
      test('[XAT-4856] Correct actions appear for file opened from File Libraries - Locked File', async ({ myLibrariesPage }) => {
        await myLibrariesPage.navigate();
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorLockCurrentUserToolbarMore
        );
      });

      test('[XAT-4857] Correct actions appear for file opened from Shared Files - Locked File', async ({ sharedPage, myLibrariesPage }) => {
        await sharedPage.navigate();
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorLockCurrentUserToolbarMore
        );
      });

      test('[XAT-4858] Correct actions appear for file opened from Favorites - Locked File', async ({ favoritePage, myLibrariesPage }) => {
        await favoritePage.navigate();
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorLockCurrentUserToolbarMore
        );
      });

      test('[XAT-4859] Correct actions appear for file opened from Search Results - Locked File', async ({ searchPage, myLibrariesPage }) => {
        await searchPage.searchWithin(testData.fileLockedByUser, 'filesAndFolders');
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

    test('[XAT-4860] Toolbar - Correct actions appear for file - on File Libraries - Locked File - Other User', async ({ myLibrariesPage }) => {
      await myLibrariesPage.navigate();
      await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
      await checkActionsAvailable(
        myLibrariesPage,
        testData.fileLockedByUser,
        testData.collaboratorToolbarPrimary,
        testData.collaboratorLockOtherUserToolbarMore
      );
    });

    test('[XAT-4861] Toolbar - Correct actions appear for file - on Shared Files - Locked File - Other User', async ({
      sharedPage,
      myLibrariesPage
    }) => {
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

    test('[XAT-4862] Toolbar - Correct actions appear for file - on Favorites - Locked File - Other User', async ({
      favoritePage,
      myLibrariesPage
    }) => {
      await favoritePage.navigate();
      await checkActionsAvailable(
        myLibrariesPage,
        testData.fileLockedByUser,
        testData.collaboratorToolbarPrimary,
        testData.favoritesCollaboratorToolbarMore
      );
    });

    test('[XAT-4863] Toolbar - Correct actions appear for file - on Search Results - Locked File - Other User', async ({
      searchPage,
      myLibrariesPage
    }) => {
      await searchPage.searchWithin(testData.fileLockedByUser, 'filesAndFolders');
      await checkActionsAvailable(
        myLibrariesPage,
        testData.fileLockedByUser,
        testData.collaboratorToolbarPrimary,
        testData.collaboratorLockOtherUserSearchToolbarMore
      );
    });

    test.describe('available actions in the viewer : ', () => {
      test('[XAT-4864] Correct actions appear for file opened from File Libraries - viewer - locked', async ({ myLibrariesPage }) => {
        await myLibrariesPage.navigate();
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorLockOtherUserToolbarMore
        );
      });

      test('[XAT-4865] Correct actions appear for file opened from Shared Files - viewer - locked', async ({ sharedPage, myLibrariesPage }) => {
        await sharedPage.navigate();
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorLockOtherUserToolbarMore
        );
      });

      test('[XAT-4866] Correct actions appear for file opened from Favorites - viewer - locked', async ({ favoritePage, myLibrariesPage }) => {
        await favoritePage.navigate();
        await checkActionsViewerAvailable(
          myLibrariesPage,
          testData.fileLockedByUser,
          testData.collaboratorSharedToolbarPrimary,
          testData.collaboratorLockOtherUserToolbarMore
        );
      });

      test('[XAT-4867] Correct actions appear for file opened from Search Results - viewer - locked', async ({ searchPage, myLibrariesPage }) => {
        await searchPage.searchWithin(testData.fileLockedByUser, 'filesAndFolders');
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
