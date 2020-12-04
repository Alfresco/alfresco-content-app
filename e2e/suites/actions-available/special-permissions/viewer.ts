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

export function viewerTests(siteName?: string) {
  const page = new BrowsingPage();
  const searchResultsPage = new SearchResultsPage();
  const { dataTable } = page;
  const { searchInput } = page.header;

  describe('available actions : ', () => {
    beforeEach(async () => {
      await Utils.pressEscape();
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
    });

    describe('file opened from File Libraries', () => {
      beforeAll(async () => {
        await page.goToMyLibrariesAndWait();
        await dataTable.doubleClickOnRowByName(siteName);
        await dataTable.waitForHeader();
      });

      it('File Office - [C326622]', async () => {
        await testUtil.checkViewerActions(testData.fileDocx.name, testData.fileDocx.viewerToolbarPrimary, testData.fileDocx.viewerToolbarMore);
      });

      it('File Office, favorite - [C326623]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxFav.name,
          testData.fileDocxFav.viewerToolbarPrimary,
          testData.fileDocxFav.viewerToolbarMore
        );
      });

      it('File simple - [C326624]', async () => {
        await testUtil.checkViewerActions(testData.file.name, testData.file.viewerToolbarPrimary, testData.file.viewerToolbarMore);
      });

      it('File favorite - [C326625]', async () => {
        await testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.viewerToolbarMore);
      });

      it('File Office, shared - [C326637]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxShared.name,
          testData.fileDocxShared.viewerToolbarPrimary,
          testData.fileDocxShared.viewerToolbarMore
        );
      });

      it('File Office, shared, favorite - [C326638]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });

      it('File shared - [C326648]', async () => {
        await testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.viewerToolbarMore);
      });

      it('File shared, favorite - [C326649]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });

      it('File locked - [C326630]', async () => {
        await testUtil.checkViewerActions(testData.fileLocked.name, testData.fileLocked.viewerToolbarPrimary, testData.fileLocked.viewerToolbarMore);
      });

      it('File favorite, locked - [C326633]', async () => {
        await testUtil.checkViewerActions(
          testData.fileFavLocked.name,
          testData.fileFavLocked.viewerToolbarPrimary,
          testData.fileFavLocked.viewerToolbarMore
        );
      });

      it('File shared, locked - [C326650]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.viewerToolbarPrimary,
          testData.fileSharedLocked.viewerToolbarMore
        );
      });

      it('File shared, favorite, locked - [C326651]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.viewerToolbarPrimary,
          testData.fileSharedFavLocked.viewerToolbarMore
        );
      });
    });

    describe('file opened from Favorites', () => {
      beforeAll(async () => {
        await page.clickFavoritesAndWait();
      });

      it('File Office, favorite - [C326652]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxFav.name,
          testData.fileDocxFav.viewerToolbarPrimary,
          testData.fileDocxFav.viewerToolbarMore
        );
      });

      it('File favorite - [C326653]', async () => {
        await testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.viewerToolbarMore);
      });

      it('File Office, shared, favorite - [C326655]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });

      it('File shared, favorite - [C326656]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });

      it('File favorite, locked - [C326654]', async () => {
        await testUtil.checkViewerActions(
          testData.fileFavLocked.name,
          testData.fileFavLocked.viewerToolbarPrimary,
          testData.fileFavLocked.viewerToolbarMore
        );
      });

      it('File shared, favorite, locked - [C326657]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.viewerToolbarPrimary,
          testData.fileSharedFavLocked.viewerToolbarMore
        );
      });
    });

    describe('file opened from Shared Files', () => {
      beforeAll(async () => {
        await page.clickSharedFilesAndWait();
      });

      it('File Office, shared - [C326658]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxShared.name,
          testData.fileDocxShared.viewerToolbarPrimary,
          testData.fileDocxShared.viewerToolbarMore
        );
      });

      it('File Office, shared, favorite - [C326659]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });

      it('File shared - [C326660]', async () => {
        await testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.viewerToolbarMore);
      });

      it('File shared, favorite - [C326661]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });

      it('File shared, locked - [C326662]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.viewerToolbarPrimary,
          testData.fileSharedLocked.viewerToolbarMore
        );
      });

      it('File shared, favorite, locked - [C326663]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.viewerToolbarPrimary,
          testData.fileSharedFavLocked.viewerToolbarMore
        );
      });
    });

    describe('file opened from Search Results', () => {
      beforeAll(async () => {
        await searchInput.clickSearchButton();
        await searchInput.checkOnlyFiles();
        await searchInput.searchFor(testData.random);
        await searchResultsPage.waitForResults();
      });

      it('File Office - [C326664]', async () => {
        await testUtil.checkViewerActions(testData.fileDocx.name, testData.fileDocx.viewerToolbarPrimary, testData.fileDocx.viewerToolbarMore);
      });

      it('File Office, favorite - [C326665]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxFav.name,
          testData.fileDocxFav.viewerToolbarPrimary,
          testData.fileDocxFav.viewerToolbarMore
        );
      });

      it('File simple - [C326666]', async () => {
        await testUtil.checkViewerActions(testData.file.name, testData.file.viewerToolbarPrimary, testData.file.viewerToolbarMore);
      });

      it('File favorite - [C326667]', async () => {
        await testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.viewerToolbarMore);
      });

      it('File Office, shared - [C326670]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxShared.name,
          testData.fileDocxShared.viewerToolbarPrimary,
          testData.fileDocxShared.viewerToolbarMore
        );
      });

      it('File Office, shared, favorite - [C326671]', async () => {
        await testUtil.checkViewerActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.viewerToolbarPrimary,
          testData.fileDocxSharedFav.viewerToolbarMore
        );
      });

      it('File shared - [C326672]', async () => {
        await testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.viewerToolbarMore);
      });

      it('File shared, favorite - [C326673]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFav.name,
          testData.fileSharedFav.viewerToolbarPrimary,
          testData.fileSharedFav.viewerToolbarMore
        );
      });

      it('File locked - [C326668]', async () => {
        await testUtil.checkViewerActions(testData.fileLocked.name, testData.fileLocked.viewerToolbarPrimary, testData.fileLocked.viewerToolbarMore);
      });

      it('File favorite, locked - [C326669]', async () => {
        await testUtil.checkViewerActions(
          testData.fileFavLocked.name,
          testData.fileFavLocked.viewerToolbarPrimary,
          testData.fileFavLocked.viewerToolbarMore
        );
      });

      it('File shared, locked - [C326674]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.viewerToolbarPrimary,
          testData.fileSharedLocked.viewerToolbarMore
        );
      });

      it('File shared, favorite, locked - [C326675]', async () => {
        await testUtil.checkViewerActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.viewerToolbarPrimary,
          testData.fileSharedFavLocked.viewerToolbarMore
        );
      });
    });
  });
}
