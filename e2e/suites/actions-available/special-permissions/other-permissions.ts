/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { BrowsingPage, SearchResultsPage, Utils } from '@alfresco/aca-testing-shared';
import * as testData from './test-data-permissions';
import * as testUtil from '../test-util';

const page = new BrowsingPage();
const { dataTable } = page;
const searchResultsPage = new SearchResultsPage();
const { searchInput } = searchResultsPage.header;

export function collaboratorTests(siteName?: string) {
  describe('available actions : ', () => {
    beforeEach(async () => {
      await Utils.pressEscape();
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
    });

    it('on File Libraries - [C297647]', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Edit Aspects', 'Permissions'];

      await testUtil.checkToolbarActions(testData.fileSharedFav.name, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Shared Files - [C297651]', async () => {
      await page.clickSharedFilesAndWait();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Edit Aspects', 'Permissions'];

      await testUtil.checkToolbarActions(testData.fileSharedFav.name, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Favorites - [C297652]', async () => {
      await page.clickFavoritesAndWait();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      // TODO: investigate why 'Edit Offline' is not displayed and raise issue
      // TODO: remove 'Move' and 'Delete' when ACA-1737 is done
      const expectedToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];

      await testUtil.checkToolbarActions(testData.fileSharedFav.name, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Search Results - [C297653]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.searchFor(testData.fileSharedFav.name);

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Edit Aspects', 'Permissions'];

      await testUtil.checkToolbarActions(testData.fileSharedFav.name, expectedToolbarPrimary, expectedToolbarMore);
    });

    describe('available actions in the viewer : ', () => {
      it('file opened from File Libraries - [C297654]', async () => {
        await page.goToMyLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();

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

        await testUtil.checkViewerActions(testData.fileDocxSharedFav.name, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Shared Files - [C297655]', async () => {
        await page.clickSharedFilesAndWait();

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

        await testUtil.checkViewerActions(testData.fileDocxSharedFav.name, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Favorites - [C297656]', async () => {
        await page.clickFavoritesAndWait();

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

        await testUtil.checkViewerActions(testData.fileDocxSharedFav.name, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Search Results - [C306992]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.searchFor(testData.fileDocxSharedFav.name);
        await searchResultsPage.waitForResults();

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

        await testUtil.checkViewerActions(testData.fileDocxSharedFav.name, expectedToolbarPrimary, expectedToolbarMore);
      });
    });
  });
}

export function filesLockedByCurrentUser(siteName?: string) {
  describe('available actions : ', () => {
    beforeEach(async () => {
      await Utils.pressEscape();
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
    });

    it('on File Libraries - [C297657]', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

      await testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Shared Files - [C297658]', async () => {
      await page.clickSharedFilesAndWait();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

      await testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Favorites - [C297659]', async () => {
      await page.clickFavoritesAndWait();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      // TODO: remove 'Move' and 'Delete' when ACA-1737 is fixed
      const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];

      await testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Search Results - [C297660]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.searchFor(testData.fileLockedByUser);
      await searchResultsPage.waitForResults();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

      await testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
    });

    describe('available actions in the viewer : ', () => {
      it('file opened from File Libraries - [C297661]', async () => {
        await page.goToMyLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

        await testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Shared Files - [C297662]', async () => {
        await page.clickSharedFilesAndWait();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

        await testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Favorites - [C297663]', async () => {
        await page.clickFavoritesAndWait();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

        await testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Search Results - [C306993]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.searchFor(testData.fileLockedByUser);
        await searchResultsPage.waitForResults();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

        await testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
      });
    });
  });
}

export function filesLockedByOtherUser(siteName?: string) {
  describe('available actions : ', () => {
    beforeEach(async () => {
      await Utils.pressEscape();
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
    });

    it('on File Libraries - [C297664]', async () => {
      await page.clickFileLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];

      await testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Shared Files - [C297665]', async () => {
      await page.clickSharedFilesAndWait();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      // TODO: investigate why 'Upload New Version' appears and raise issue
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

      await testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Favorites - [C297666]', async () => {
      await page.clickFavoritesAndWait();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      // TODO: investigate why 'Cancel Editing' doesn't appear and raise issue
      // TODO: remove 'Upload New Version' when ACA-1737 is done
      const expectedToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];

      await testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
    });

    it('on Search Results - [C297667]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.searchFor(testData.fileLockedByUser);
      await searchResultsPage.waitForResults();

      const expectedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
      const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];

      await testUtil.checkToolbarActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
    });

    describe('available actions in the viewer : ', () => {
      it('file opened from File Libraries - [C297671]', async () => {
        await page.clickFileLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];

        await testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Shared Files - [C297672]', async () => {
        await page.clickSharedFilesAndWait();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];

        await testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Favorites - [C297673]', async () => {
        await page.clickFavoritesAndWait();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];

        await testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
      });

      it('file opened from Search Results - [C306994]', async () => {
        await searchInput.clickSearchButton();
        await searchInput.searchFor(testData.fileLockedByUser);
        await searchResultsPage.waitForResults();

        const expectedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
        // TODO: add 'Move' and 'Delete' when ACA-2319 is fixed
        const expectedToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];

        await testUtil.checkViewerActions(testData.fileLockedByUser, expectedToolbarPrimary, expectedToolbarMore);
      });
    });
  });
}
