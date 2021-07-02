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

export function searchResultsTests() {
  const page = new BrowsingPage();
  const searchResultsPage = new SearchResultsPage();
  const { searchInput } = page.header;

  describe('available actions : ', () => {
    beforeEach(async () => {
      await Utils.pressEscape();
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
    });

    describe('on a file', () => {
      beforeEach(async () => {
        await page.clickPersonalFiles();
        await searchInput.clickSearchButton();
        await searchInput.checkOnlyFiles();
        await searchInput.searchFor(testData.random);
        await searchResultsPage.waitForResults();
      });

      it('File Office - [C286286]', async () => {
        await testUtil.checkToolbarActions(testData.fileDocx.name, testData.fileDocx.searchToolbarPrimary, testData.fileDocx.toolbarMore);
        await testUtil.checkContextMenu(testData.fileDocx.name, testData.fileDocx.contextMenu);
      });

      it('File Office, favorite - [C286287]', async () => {
        await testUtil.checkToolbarActions(testData.fileDocxFav.name, testData.fileDocxFav.searchToolbarPrimary, testData.fileDocxFav.toolbarMore);
        await testUtil.checkContextMenu(testData.fileDocxFav.name, testData.fileDocxFav.contextMenu);
      });

      it('File simple - [C286262]', async () => {
        await testUtil.checkToolbarActions(testData.file.name, testData.file.searchToolbarPrimary, testData.file.toolbarMore);
        await testUtil.checkContextMenu(testData.file.name, testData.file.contextMenu);
      });

      it('File favorite - [C286263]', async () => {
        await testUtil.checkToolbarActions(testData.fileFav.name, testData.fileFav.searchToolbarPrimary, testData.fileFav.toolbarMore);
        await testUtil.checkContextMenu(testData.fileFav.name, testData.fileFav.contextMenu);
      });

      it('File Office, shared - [C286280]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileDocxShared.name,
          testData.fileDocxShared.searchToolbarPrimary,
          testData.fileDocxShared.toolbarMore
        );
        await testUtil.checkContextMenu(testData.fileDocxShared.name, testData.fileDocxShared.contextMenu);
      });

      it('File Office, shared, favorite - [C286281]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.searchToolbarPrimary,
          testData.fileDocxSharedFav.toolbarMore
        );
        await testUtil.checkContextMenu(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.contextMenu);
      });

      it('File shared - [C286282]', async () => {
        await testUtil.checkToolbarActions(testData.fileShared.name, testData.fileShared.searchToolbarPrimary, testData.fileShared.toolbarMore);
        await testUtil.checkContextMenu(testData.fileShared.name, testData.fileShared.contextMenu);
      });

      it('File shared, favorite - [C291823]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedFav.name,
          testData.fileSharedFav.searchToolbarPrimary,
          testData.fileSharedFav.toolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedFav.name, testData.fileSharedFav.contextMenu);
      });

      it('File locked - [C291818]', async () => {
        await testUtil.checkToolbarActions(testData.fileLocked.name, testData.fileLocked.searchToolbarPrimary, testData.fileLocked.toolbarMore);
        await testUtil.checkContextMenu(testData.fileLocked.name, testData.fileLocked.contextMenu);
      });

      it('File favorite, locked - [C291819]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileFavLocked.name,
          testData.fileFavLocked.searchToolbarPrimary,
          testData.fileFavLocked.toolbarMore
        );
        await testUtil.checkContextMenu(testData.fileFavLocked.name, testData.fileFavLocked.contextMenu);
      });

      it('File shared, locked - [C291824]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.searchToolbarPrimary,
          testData.fileSharedLocked.toolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedLocked.name, testData.fileSharedLocked.contextMenu);
      });

      it('File shared, favorite, locked - [C291825]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.searchToolbarPrimary,
          testData.fileSharedFavLocked.toolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.contextMenu);
      });
    });

    describe('on a folder', () => {
      beforeAll(async () => {
        await page.clickPersonalFiles();
        await searchInput.clickSearchButton();
        await searchInput.checkOnlyFolders();
        await searchInput.searchFor(testData.random);
        await searchResultsPage.waitForResults();
      });

      it('Folder not favorite - [C291826]', async () => {
        await testUtil.checkToolbarActions(testData.folder.name, testData.folder.searchToolbarPrimary, testData.folder.toolbarMore);
        await testUtil.checkContextMenu(testData.folder.name, testData.folder.contextMenu);
      });

      it('Folder favorite - [C291829]', async () => {
        await testUtil.checkToolbarActions(testData.folderFav.name, testData.folderFav.searchToolbarPrimary, testData.folderFav.toolbarMore);
        await testUtil.checkContextMenu(testData.folderFav.name, testData.folderFav.contextMenu);
      });
    });

    describe('on multiple selection', () => {
      describe('of files', () => {
        beforeAll(async () => {
          await page.clickPersonalFiles();
          await searchInput.clickSearchButton();
          await searchInput.checkOnlyFiles();
          await searchInput.searchFor(testData.random);
          await searchResultsPage.waitForResults();
        });

        it('multiple files - [C291830]', async () => {
          await testUtil.checkMultipleSelContextMenu([testData.file.name, testData.fileDocxShared.name], testData.multipleSel.contextMenu);
          await testUtil.checkMultipleSelToolbarActions(
            [testData.file.name, testData.fileDocxShared.name],
            testData.multipleSel.searchToolbarPrimary,
            testData.multipleSel.toolbarMore
          );
        });

        it('multiple files - all favorite - [C291834]', async () => {
          await testUtil.checkMultipleSelContextMenu(
            [testData.fileDocxFav.name, testData.fileSharedFav.name],
            testData.multipleSelAllFav.contextMenu
          );
          await testUtil.checkMultipleSelToolbarActions(
            [testData.fileDocxFav.name, testData.fileSharedFav.name],
            testData.multipleSel.searchToolbarPrimary,
            testData.multipleSelAllFav.toolbarMore
          );
        });

        it('multiple locked files - [C291835]', async () => {
          await testUtil.checkMultipleSelContextMenu([testData.fileLocked.name, testData.fileSharedFavLocked.name], testData.multipleSel.contextMenu);
          await testUtil.checkMultipleSelToolbarActions(
            [testData.fileLocked.name, testData.fileSharedFavLocked.name],
            testData.multipleSel.searchToolbarPrimary,
            testData.multipleSel.toolbarMore
          );
        });

        it('multiple files with different granular permissions - [C286310]', async () => {
          await testUtil.checkMultipleSelContextMenu(
            [testData.fileDocxFav.name, testData.fileGranularPermission],
            testData.multipleSelAllFav.contextMenu
          );
          await testUtil.checkMultipleSelToolbarActions(
            [testData.fileDocxFav.name, testData.fileGranularPermission],
            testData.multipleSel.searchToolbarPrimary,
            testData.multipleSelAllFav.toolbarMore
          );
        });
      });

      it('multiple folders - [C291836]', async () => {
        await page.clickPersonalFiles();
        await searchInput.clickSearchButton();
        await searchInput.checkOnlyFolders();
        await searchInput.searchFor(testData.random);

        await testUtil.checkMultipleSelContextMenu([testData.folder.name, testData.folderFav.name], testData.multipleSel.contextMenu);
        await testUtil.checkMultipleSelToolbarActions(
          [testData.folder.name, testData.folderFav.name],
          testData.multipleSel.searchToolbarPrimary,
          testData.multipleSel.toolbarMore
        );
      });

      it('both files and folders - [C268128]', async () => {
        await page.clickPersonalFiles();
        await searchInput.clickSearchButton();
        await searchInput.searchFor(`${testData.file.name} or ${testData.folderFav.name}`);

        await testUtil.checkMultipleSelContextMenu([testData.file.name, testData.folderFav.name], testData.multipleSel.contextMenu);
        await testUtil.checkMultipleSelToolbarActions(
          [testData.file.name, testData.folderFav.name],
          testData.multipleSel.searchToolbarPrimary,
          testData.multipleSel.toolbarMore
        );
      });
    });
  });
}
