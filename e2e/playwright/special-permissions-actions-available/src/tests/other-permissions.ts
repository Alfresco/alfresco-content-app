/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { test } from '@alfresco/playwright-shared';
import * as testData from '@alfresco/playwright-shared';
import { expect } from '@playwright/test';

export function collaboratorTests(userCollaborator: string, siteName: string) {
  test.describe('available actions : ', () => {
    test.beforeEach(async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.loginUser({ username: userCollaborator, password: userCollaborator });
    });
    test('on File Libraries - [C297647]', async ({ myLibrariesPage }) => {
      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Edit Aspects', 'Permissions'];

      await myLibrariesPage.navigate();
      await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
      await myLibrariesPage.dataTable.selectItem(testData.fileSharedFav.name);
      await myLibrariesPage.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
      await myLibrariesPage.acaHeader.clickMoreActions();
      await myLibrariesPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
    });

    test('on Shared Files - [C297651]', async ({ sharedPage }) => {
      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Edit Aspects', 'Permissions'];

      await sharedPage.navigate();
      await sharedPage.dataTable.selectItem(testData.fileSharedFav.name);
      await sharedPage.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
      await sharedPage.acaHeader.clickMoreActions();
      await sharedPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
    });

    test('on Favorites - [C297652]', async ({ favoritePage }) => {
      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];

      await favoritePage.navigate();
      await favoritePage.dataTable.selectItem(testData.fileSharedFav.name);
      await favoritePage.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
      await favoritePage.acaHeader.clickMoreActions();
      await favoritePage.matMenu.verifyActualMoreActions(expectedToolbarMore);
    });

    test('on Search Results - [C297653]', async ({ searchPage }) => {
      await searchPage.navigate({ remoteUrl: `#/search;q=${testData.fileSharedFav.name}` });

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Edit Aspects', 'Permissions'];

      await searchPage.dataTable.selectItem(testData.fileSharedFav.name);
      await searchPage.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
      await searchPage.acaHeader.clickMoreActions();
      await searchPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
    });

    test.describe('available actions in the viewer : ', () => {
      test('file opened from File Libraries - [C297654]', async ({ myLibrariesPage }) => {
        await myLibrariesPage.navigate();
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(testData.fileDocxSharedFav.name);
        expect(await myLibrariesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = [
          'Edit in Microsoft Office™',
          'Edit Offline',
          'Upload New Version',
          'Remove Favorite',
          'Copy',
          'Manage Versions',
          'Edit Aspects',
          'Permissions'
        ];

        await myLibrariesPage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await myLibrariesPage.acaHeader.clickViewerMoreActions();
        await myLibrariesPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      });

      test('file opened from Shared Files - [C297655]', async ({ sharedPage }) => {
        await sharedPage.navigate();
        await sharedPage.dataTable.performClickFolderOrFileToOpen(testData.fileDocxSharedFav.name);

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = [
          'Edit in Microsoft Office™',
          'Edit Offline',
          'Upload New Version',
          'Remove Favorite',
          'Copy',
          'Manage Versions',
          'Edit Aspects',
          'Permissions'
        ];

        await sharedPage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await sharedPage.acaHeader.clickViewerMoreActions();
        await sharedPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      });

      test('file opened from Favorites - [C297656]', async ({ favoritePage }) => {
        await favoritePage.navigate();
        await favoritePage.dataTable.performClickFolderOrFileToOpen(testData.fileDocxSharedFav.name);

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = [
          'Edit in Microsoft Office™',
          'Edit Offline',
          'Upload New Version',
          'Remove Favorite',
          'Copy',
          'Manage Versions',
          'Edit Aspects',
          'Permissions'
        ];

        await favoritePage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await favoritePage.acaHeader.clickViewerMoreActions();
        await favoritePage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      });

      test('file opened from Search Results - [C306992]', async ({ searchPage }) => {
        await searchPage.navigate({ remoteUrl: `#/search;q=${testData.fileDocxSharedFav.name}` });
        await searchPage.searchInput.performDoubleClickFolderOrFileToOpen(testData.fileDocxSharedFav.name);
        expect(await searchPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = [
          'Edit in Microsoft Office™',
          'Edit Offline',
          'Upload New Version',
          'Remove Favorite',
          'Copy',
          'Manage Versions',
          'Edit Aspects',
          'Permissions'
        ];

        await searchPage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await searchPage.acaHeader.clickViewerMoreActions();
        await searchPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
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
        const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
        await myLibrariesPage.navigate();
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
        await myLibrariesPage.dataTable.selectItem(testData.fileLockedByUser);
        await myLibrariesPage.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
        await myLibrariesPage.acaHeader.clickMoreActions();
        await myLibrariesPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      });

      test('on Shared Files - [C297658]', async ({ sharedPage }) => {
        const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
        await sharedPage.navigate();
        await sharedPage.dataTable.selectItem(testData.fileLockedByUser);
        await sharedPage.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
        await sharedPage.acaHeader.clickMoreActions();
        await sharedPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      });

      test('on Favorites - [C297659]', async ({ favoritePage }) => {
        const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
        await favoritePage.navigate();
        await favoritePage.dataTable.selectItem(testData.fileLockedByUser);
        await favoritePage.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
        await favoritePage.acaHeader.clickMoreActions();
        await favoritePage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      });

      test('on Search Results - [C297660]', async ({ searchPage }) => {
        const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
        await searchPage.navigate({ remoteUrl: `#/search;q=${testData.fileLockedByUser}` });
        await searchPage.dataTable.selectItem(testData.fileLockedByUser);
        await searchPage.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
        await searchPage.acaHeader.clickMoreActions();
        await searchPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      });
    });

    test.describe('available actions in the viewer : ', () => {
      test('file opened from File Libraries - [C297661]', async ({ myLibrariesPage }) => {
        await myLibrariesPage.navigate();
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(testData.fileLockedByUser);
        expect(await myLibrariesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

        await myLibrariesPage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await myLibrariesPage.acaHeader.clickViewerMoreActions();
        await myLibrariesPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      });

      test('file opened from Shared Files - [C297662]', async ({ sharedPage }) => {
        await sharedPage.navigate();
        await sharedPage.dataTable.performClickFolderOrFileToOpen(testData.fileLockedByUser);

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

        await sharedPage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await sharedPage.acaHeader.clickViewerMoreActions();
        await sharedPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      });

      test('file opened from Favorites - [C297663]', async ({ favoritePage }) => {
        await favoritePage.navigate();
        await favoritePage.dataTable.performClickFolderOrFileToOpen(testData.fileLockedByUser);

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

        await favoritePage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await favoritePage.acaHeader.clickViewerMoreActions();
        await favoritePage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      });

      test('file opened from Search Results - [C306993]', async ({ searchPage }) => {
        await searchPage.navigate({ remoteUrl: `#/search;q=${testData.fileLockedByUser}` });
        await searchPage.searchInput.performDoubleClickFolderOrFileToOpen(testData.fileLockedByUser);
        expect(await searchPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

        await searchPage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await searchPage.acaHeader.clickViewerMoreActions();
        await searchPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      });
    });
  });
}

export function filesLockedByOtherUser(userManager: string, siteName?: string) {
  test.describe.only('available actions : ', () => {
    test.beforeEach(async ({ loginPage }) => {
      await loginPage.navigate();
      await loginPage.loginUser({ username: userManager, password: userManager });
    });

    test('on File Libraries - [C297664]', async ({ myLibrariesPage }) => {
      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
      await myLibrariesPage.navigate();
      await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
      await myLibrariesPage.dataTable.selectItem(testData.fileLockedByUser);
      await myLibrariesPage.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
      await myLibrariesPage.acaHeader.clickMoreActions();
      await myLibrariesPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
    });

    test('on Shared Files - [C297665]', async ({ sharedPage }) => {
      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
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
      await sharedPage.dataTable.selectItem(testData.fileLockedByUser);
      await sharedPage.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
      await sharedPage.acaHeader.clickMoreActions();
      await sharedPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
    });

    test('on Favorites - [C297666]', async ({ favoritePage }) => {
      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
      await favoritePage.navigate();
      await favoritePage.dataTable.selectItem(testData.fileLockedByUser);
      await favoritePage.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
      await favoritePage.acaHeader.clickMoreActions();
      await favoritePage.matMenu.verifyActualMoreActions(expectedToolbarMore);
    });

    test('on Search Results - [C297667]', async ({ searchPage }) => {
      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
      await searchPage.navigate({ remoteUrl: `#/search;q=${testData.fileLockedByUser}` });
      await searchPage.dataTable.selectItem(testData.fileLockedByUser);
      await searchPage.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
      await searchPage.acaHeader.clickMoreActions();
      await searchPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
    });

    test.describe('available actions in the viewer : ', () => {
      test('file opened from File Libraries - [C297671]', async ({ myLibrariesPage }) => {
        await myLibrariesPage.navigate();
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(siteName);
        await myLibrariesPage.dataTable.performClickFolderOrFileToOpen(testData.fileLockedByUser);
        expect(await myLibrariesPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];

        await myLibrariesPage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await myLibrariesPage.acaHeader.clickViewerMoreActions();
        await myLibrariesPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      });

      test('file opened from Shared Files - [C297672]', async ({ sharedPage }) => {
        await sharedPage.navigate();
        await sharedPage.dataTable.performClickFolderOrFileToOpen(testData.fileLockedByUser);

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];

        await sharedPage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await sharedPage.acaHeader.clickViewerMoreActions();
        await sharedPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      });

      test('file opened from Favorites - [C297673]', async ({ favoritePage }) => {
        await favoritePage.navigate();
        await favoritePage.dataTable.performClickFolderOrFileToOpen(testData.fileLockedByUser);

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];

        await favoritePage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await favoritePage.acaHeader.clickViewerMoreActions();
        await favoritePage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      });

      test('file opened from Search Results - [C306994]', async ({ searchPage }) => {
        await searchPage.navigate({ remoteUrl: `#/search;q=${testData.fileLockedByUser}` });
        await searchPage.searchInput.performDoubleClickFolderOrFileToOpen(testData.fileLockedByUser);
        expect(await searchPage.viewer.isViewerOpened(), 'Viewer is not opened').toBe(true);

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];

        await searchPage.viewer.verifyViewerPrimaryActions(expectedToolbarPrimary);
        await searchPage.acaHeader.clickViewerMoreActions();
        await searchPage.matMenu.verifyActualMoreActions(expectedToolbarMore);
      });
    });
  });
}
