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

import { BrowsingPage, SearchResultsPage } from '../../../pages/pages';
import { Utils } from '../../../utilities/utils';
import * as testData from './test-data';
import * as testUtil from '../test-util';

export function viewerTests(parentName?: string) {
  const page = new BrowsingPage();
  const searchResultsPage = new SearchResultsPage();
  const { dataTable } = page;
  const { searchInput } = page.header;

  describe('available actions : ', () => {

    beforeAll(async () => {
      await page.clickPersonalFiles();
    });

    beforeEach(async () => {
      await Utils.pressEscape();
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
    });

    describe('file opened from Personal Files', () => {

      beforeAll(async () => {
        await page.clickPersonalFilesAndWait();
        await dataTable.doubleClickOnRowByName(parentName);
        await dataTable.waitForHeader();
      });

      it('File Office - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocx.name, testData.fileDocx.viewerToolbarPrimary, testData.fileDocx.viewerToolbarMore);
      });

      it('File Office, favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocxFav.name, testData.fileDocxFav.viewerToolbarPrimary, testData.fileDocxFav.viewerToolbarMore);
      });

      it('File simple - []', async () => {
        await testUtil.checkViewerActions(testData.file.name, testData.file.viewerToolbarPrimary, testData.file.viewerToolbarMore);
      });

      it('File favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.viewerToolbarMore);
      });

      it('File Office, shared - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocxShared.name, testData.fileDocxShared.viewerToolbarPrimary, testData.fileDocxShared.viewerToolbarMore);
      });

      it('File Office, shared, favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.viewerToolbarPrimary, testData.fileDocxSharedFav.viewerToolbarMore);
      });

      it('File shared - []', async () => {
        await testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.viewerToolbarMore);
      });

      it('File shared, favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileSharedFav.name, testData.fileSharedFav.viewerToolbarPrimary, testData.fileSharedFav.viewerToolbarMore);
      });

      it('File locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileLocked.name, testData.fileLocked.viewerToolbarPrimary, testData.fileLocked.viewerToolbarMore);
      });

      it('File favorite, locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileFavLocked.name, testData.fileFavLocked.viewerToolbarPrimary, testData.fileFavLocked.viewerToolbarMore);
      });

      it('File shared, locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileSharedLocked.name, testData.fileSharedLocked.viewerToolbarPrimary, testData.fileSharedLocked.viewerToolbarMore);
      });

      it('File shared, favorite, locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.viewerToolbarPrimary, testData.fileSharedFavLocked.viewerToolbarMore);
      });
    });

    describe('file opened from Recent Files', () => {

      beforeAll(async () => {
        await page.clickRecentFilesAndWait();
      });

      it('File Office - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocx.name, testData.fileDocx.viewerToolbarPrimary, testData.fileDocx.viewerToolbarMore);
      });

      it('File Office, favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocxFav.name, testData.fileDocxFav.viewerToolbarPrimary, testData.fileDocxFav.viewerToolbarMore);
      });

      it('File simple - []', async () => {
        await testUtil.checkViewerActions(testData.file.name, testData.file.viewerToolbarPrimary, testData.file.viewerToolbarMore);
      });

      it('File favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.viewerToolbarMore);
      });

      it('File Office, shared - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocxShared.name, testData.fileDocxShared.viewerToolbarPrimary, testData.fileDocxShared.viewerToolbarMore);
      });

      it('File Office, shared, favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.viewerToolbarPrimary, testData.fileDocxSharedFav.viewerToolbarMore);
      });

      it('File shared - []', async () => {
        await testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.viewerToolbarMore);
      });

      it('File shared, favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileSharedFav.name, testData.fileSharedFav.viewerToolbarPrimary, testData.fileSharedFav.viewerToolbarMore);
      });

      it('File locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileLocked.name, testData.fileLocked.viewerToolbarPrimary, testData.fileLocked.viewerToolbarMore);
      });

      it('File favorite, locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileFavLocked.name, testData.fileFavLocked.viewerToolbarPrimary, testData.fileFavLocked.viewerToolbarMore);
      });

      it('File shared, locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileSharedLocked.name, testData.fileSharedLocked.viewerToolbarPrimary, testData.fileSharedLocked.viewerToolbarMore);
      });

      it('File shared, favorite, locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.viewerToolbarPrimary, testData.fileSharedFavLocked.viewerToolbarMore);
      });
    });

    describe('file opened from Favorites', () => {

      beforeAll(async () => {
        await page.clickFavoritesAndWait();
      });

      it('File Office, favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocxFav.name, testData.fileDocxFav.viewerToolbarPrimary, testData.fileDocxFav.viewerToolbarMore);
      });

      it('File favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.viewerToolbarMore);
      });

      it('File Office, shared, favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.viewerToolbarPrimary, testData.fileDocxSharedFav.viewerToolbarMore);
      });

      it('File shared, favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileSharedFav.name, testData.fileSharedFav.viewerToolbarPrimary, testData.fileSharedFav.viewerToolbarMore);
      });

      it('File favorite, locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileFavLocked.name, testData.fileFavLocked.viewerToolbarPrimary, testData.fileFavLocked.viewerToolbarMore);
      });

      it('File shared, favorite, locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.viewerToolbarPrimary, testData.fileSharedFavLocked.viewerToolbarMore);
      });
    });

    describe('file opened from Shared Files', () => {

      beforeAll(async () => {
        await page.clickSharedFilesAndWait();
      });

      it('File Office, shared - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocxShared.name, testData.fileDocxShared.viewerToolbarPrimary, testData.fileDocxShared.viewerToolbarMore);
      });

      it('File Office, shared, favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.viewerToolbarPrimary, testData.fileDocxSharedFav.viewerToolbarMore);
      });

      it('File shared - []', async () => {
        await testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.viewerToolbarMore);
      });

      it('File shared, favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileSharedFav.name, testData.fileSharedFav.viewerToolbarPrimary, testData.fileSharedFav.viewerToolbarMore);
      });

      it('File shared, locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileSharedLocked.name, testData.fileSharedLocked.viewerToolbarPrimary, testData.fileSharedLocked.viewerToolbarMore);
      });

      it('File shared, favorite, locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.viewerToolbarPrimary, testData.fileSharedFavLocked.viewerToolbarMore);
      });
    });

    describe('file opened from Search Results', () => {

      beforeAll(async () => {
        await searchInput.clickSearchButton();
        await searchInput.searchFor('file-');
        await searchResultsPage.waitForResults();
      });

      it('File Office - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocx.name, testData.fileDocx.viewerToolbarPrimary, testData.fileDocx.searchViewerToolbarMore);
      });

      it('File Office, favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocxFav.name, testData.fileDocxFav.viewerToolbarPrimary, testData.fileDocxFav.searchViewerToolbarMore);
      });

      it('File simple - []', async () => {
        await testUtil.checkViewerActions(testData.file.name, testData.file.viewerToolbarPrimary, testData.file.searchViewerToolbarMore);
      });

      it('File favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileFav.name, testData.fileFav.viewerToolbarPrimary, testData.fileFav.searchViewerToolbarMore);
      });

      it('File Office, shared - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocxShared.name, testData.fileDocxShared.viewerToolbarPrimary, testData.fileDocxShared.searchViewerToolbarMore);
      });

      it('File Office, shared, favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.viewerToolbarPrimary, testData.fileDocxSharedFav.searchViewerToolbarMore);
      });

      it('File shared - []', async () => {
        await testUtil.checkViewerActions(testData.fileShared.name, testData.fileShared.viewerToolbarPrimary, testData.fileShared.searchViewerToolbarMore);
      });

      it('File shared, favorite - []', async () => {
        await testUtil.checkViewerActions(testData.fileSharedFav.name, testData.fileSharedFav.viewerToolbarPrimary, testData.fileSharedFav.searchViewerToolbarMore);
      });

      it('File locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileLocked.name, testData.fileLocked.viewerToolbarPrimary, testData.fileLocked.searchViewerToolbarMore);
      });

      it('File favorite, locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileFavLocked.name, testData.fileFavLocked.viewerToolbarPrimary, testData.fileFavLocked.searchViewerToolbarMore);
      });

      it('File shared, locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileSharedLocked.name, testData.fileSharedLocked.viewerToolbarPrimary, testData.fileSharedLocked.searchViewerToolbarMore);
      });

      it('File shared, favorite, locked - []', async () => {
        await testUtil.checkViewerActions(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.viewerToolbarPrimary, testData.fileSharedFavLocked.searchViewerToolbarMore);
      });
    });

  });
}
