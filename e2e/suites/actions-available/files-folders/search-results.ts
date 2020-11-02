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

import { BrowsingPage, SearchResultsPage, Utils } from '@alfresco-dbp/content-ce/testing';
import * as testData from './test-data';
import * as testUtil from '../test-util';

export function searchResultsTests() {
  const page = new BrowsingPage();
  const { searchInput } = page.header;
  const searchResultsPage = new SearchResultsPage();

  describe('available actions : ', () => {
    beforeAll(async () => {
      await page.clickPersonalFiles();
    });

    beforeEach(async () => {
      await Utils.pressEscape();
    });

    describe('on a file', () => {
      beforeAll(async () => {
        await page.clickPersonalFiles();
        await searchInput.clickSearchButton();
        await searchInput.searchFor('file-');
        await searchResultsPage.waitForResults();
      });

      it('[C297637] File Office', async () => {
        await testUtil.checkToolbarActions(testData.fileDocx.name, testData.fileDocx.searchToolbarPrimary, testData.fileDocx.searchToolbarMore);
        await testUtil.checkContextMenu(testData.fileDocx.name, testData.fileDocx.searchContextMenu);
      });

      it('[C291827] File Office, favorite', async () => {
        await testUtil.checkToolbarActions(
          testData.fileDocxFav.name,
          testData.fileDocxFav.searchToolbarPrimary,
          testData.fileDocxFav.searchToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileDocxFav.name, testData.fileDocxFav.searchContextMenu);
      });

      it('[C297638] File simple', async () => {
        await testUtil.checkToolbarActions(testData.file.name, testData.file.searchToolbarPrimary, testData.file.searchToolbarMore);
        await testUtil.checkContextMenu(testData.file.name, testData.file.searchContextMenu);
      });

      it('[C280661] File favorite', async () => {
        await testUtil.checkToolbarActions(testData.fileFav.name, testData.fileFav.searchToolbarPrimary, testData.fileFav.searchToolbarMore);
        await testUtil.checkContextMenu(testData.fileFav.name, testData.fileFav.searchContextMenu);
      });

      it('[C297627] File Office, shared', async () => {
        await testUtil.checkToolbarActions(
          testData.fileDocxShared.name,
          testData.fileDocxShared.searchToolbarPrimary,
          testData.fileDocxShared.searchToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileDocxShared.name, testData.fileDocxShared.searchContextMenu);
      });

      it('[C280631] File Office, shared, favorite', async () => {
        await testUtil.checkToolbarActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.searchToolbarPrimary,
          testData.fileDocxSharedFav.searchToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.searchContextMenu);
      });

      it('[C280632] File shared', async () => {
        await testUtil.checkToolbarActions(testData.fileShared.name, testData.fileShared.searchToolbarPrimary, testData.fileShared.searchToolbarMore);
        await testUtil.checkContextMenu(testData.fileShared.name, testData.fileShared.searchContextMenu);
      });

      it('[C280641] File shared, favorite', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedFav.name,
          testData.fileSharedFav.searchToolbarPrimary,
          testData.fileSharedFav.searchToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedFav.name, testData.fileSharedFav.searchContextMenu);
      });

      it('[C297628] File locked', async () => {
        await testUtil.checkToolbarActions(testData.fileLocked.name, testData.fileLocked.searchToolbarPrimary, testData.fileLocked.searchToolbarMore);
        await testUtil.checkContextMenu(testData.fileLocked.name, testData.fileLocked.searchContextMenu);
      });

      it('[C280648] File favorite, locked', async () => {
        await testUtil.checkToolbarActions(
          testData.fileFavLocked.name,
          testData.fileFavLocked.searchToolbarPrimary,
          testData.fileFavLocked.searchToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileFavLocked.name, testData.fileFavLocked.searchContextMenu);
      });

      it('[C280574] File shared, locked', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.searchToolbarPrimary,
          testData.fileSharedLocked.searchToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedLocked.name, testData.fileSharedLocked.searchContextMenu);
      });

      it('[C280642] File shared, favorite, locked', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.searchToolbarPrimary,
          testData.fileSharedFavLocked.searchToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.searchContextMenu);
      });
    });

    describe('on a folder', () => {
      beforeAll(async () => {
        await page.clickPersonalFiles();
        await searchInput.clickSearchButton();
        await searchInput.searchFor('folder-');
        await searchResultsPage.waitForResults();
      });

      it('[C280609] Folder not favorite', async () => {
        await testUtil.checkToolbarActions(testData.folder.name, testData.folder.searchToolbarPrimary, testData.folder.searchToolbarMore);
        await testUtil.checkContextMenu(testData.folder.name, testData.folder.searchContextMenu);
      });

      it('[C291828] Folder favorite', async () => {
        await testUtil.checkToolbarActions(testData.folderFav.name, testData.folderFav.searchToolbarPrimary, testData.folderFav.searchToolbarMore);
        await testUtil.checkContextMenu(testData.folderFav.name, testData.folderFav.searchContextMenu);
      });
    });

    describe('on multiple selection', () => {
      beforeAll(async () => {
        await page.clickPersonalFiles();
        await searchInput.clickSearchButton();
        await searchInput.searchFor('file-');
        await searchResultsPage.waitForResults();
      });

      it('[C291820] multiple files', async () => {
        await testUtil.checkMultipleSelContextMenu([testData.file.name, testData.fileDocxShared.name], testData.multipleSel.searchContextMenu);
        await testUtil.checkMultipleSelToolbarActions(
          [testData.file.name, testData.fileDocxShared.name],
          testData.multipleSel.searchToolbarPrimary,
          testData.multipleSel.searchToolbarMore
        );
      });

      it('[C326690] multiple files - all favorite', async () => {
        await testUtil.checkMultipleSelContextMenu(
          [testData.fileDocxFav.name, testData.fileSharedFav.name],
          testData.multipleSelAllFav.searchContextMenu
        );
        await testUtil.checkMultipleSelToolbarActions(
          [testData.fileDocxFav.name, testData.fileSharedFav.name],
          testData.multipleSelAllFav.searchToolbarPrimary,
          testData.multipleSelAllFav.searchToolbarMore
        );
      });

      it('[C297626] multiple locked files', async () => {
        await testUtil.checkMultipleSelContextMenu(
          [testData.fileLocked.name, testData.fileSharedFavLocked.name],
          testData.multipleSel.searchContextMenu
        );
        await testUtil.checkMultipleSelToolbarActions(
          [testData.fileLocked.name, testData.fileSharedFavLocked.name],
          testData.multipleSel.searchToolbarPrimary,
          testData.multipleSel.searchToolbarMore
        );
      });

      it('[C291821] multiple folders', async () => {
        await searchInput.clickSearchButton();
        await searchInput.searchFor('folder-');
        await searchResultsPage.waitForResults();

        await testUtil.checkMultipleSelContextMenu([testData.folder.name, testData.folderFav.name], testData.multipleSel.searchContextMenu);
        await testUtil.checkMultipleSelToolbarActions(
          [testData.folder.name, testData.folderFav.name],
          testData.multipleSel.searchToolbarPrimary,
          testData.multipleSel.searchToolbarMore
        );
      });

      it('[C291822] both files and folders', async () => {
        await searchInput.clickSearchButton();
        await searchInput.searchFor(`=${testData.file.name} or =${testData.folderFav.name}`);
        await searchResultsPage.waitForResults();

        await testUtil.checkMultipleSelContextMenu([testData.file.name, testData.folderFav.name], testData.multipleSel.searchContextMenu);
        await testUtil.checkMultipleSelToolbarActions(
          [testData.file.name, testData.folderFav.name],
          testData.multipleSel.searchToolbarPrimary,
          testData.multipleSel.searchToolbarMore
        );
      });
    });
  });
}
