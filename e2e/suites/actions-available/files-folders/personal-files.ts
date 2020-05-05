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

import { Utils } from '../../../utilities/utils';
import * as testData from './test-data';
import * as testUtil from '../test-util';
import { BrowsingPage } from '../../../pages/pages';

export function personalFilesTests(parentName?: string) {
  const page = new BrowsingPage();
  const { dataTable } = page;

  describe('available actions : ', () => {

    beforeAll(async () => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parentName);
      await dataTable.waitForHeader();
    });

    beforeEach(async () => {
      await Utils.pressEscape();
    });

    describe('on a file', () => {

      it('[C213122] - File Office', async () => {
        await testUtil.checkToolbarActions(testData.fileDocx.name, testData.fileDocx.toolbarPrimary, testData.fileDocx.toolbarMore);
        await testUtil.checkContextMenu(testData.fileDocx.name, testData.fileDocx.contextMenu);
      });

      it('[C297612] - File Office, favorite', async () => {
        await testUtil.checkToolbarActions(testData.fileDocxFav.name, testData.fileDocxFav.toolbarPrimary, testData.fileDocxFav.toolbarMore);
        await testUtil.checkContextMenu(testData.fileDocxFav.name, testData.fileDocxFav.contextMenu);
      });

      it('[C286265] - File simple', async () => {
        await testUtil.checkToolbarActions(testData.file.name, testData.file.toolbarPrimary, testData.file.toolbarMore);
        await testUtil.checkContextMenu(testData.file.name, testData.file.contextMenu);
      });

      it('[C297615] - File favorite', async () => {
        await testUtil.checkToolbarActions(testData.fileFav.name, testData.fileFav.toolbarPrimary, testData.fileFav.toolbarMore);
        await testUtil.checkContextMenu(testData.fileFav.name, testData.fileFav.contextMenu);
      });

      it('[C280448] - File Office, shared', async () => {
        await testUtil.checkToolbarActions(testData.fileDocxShared.name, testData.fileDocxShared.toolbarPrimary, testData.fileDocxShared.toolbarMore);
        await testUtil.checkContextMenu(testData.fileDocxShared.name, testData.fileDocxShared.contextMenu);
      });

      it('[C297616] - File Office, shared, favorite', async () => {
        await testUtil.checkToolbarActions(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.toolbarPrimary, testData.fileDocxSharedFav.toolbarMore);
        await testUtil.checkContextMenu(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.contextMenu);
      });

      it('[C286323] - File shared', async () => {
        await testUtil.checkToolbarActions(testData.fileShared.name, testData.fileShared.toolbarPrimary, testData.fileShared.toolbarMore);
        await testUtil.checkContextMenu(testData.fileShared.name, testData.fileShared.contextMenu);
      });

      it('[C280450] - File shared, favorite', async () => {
        await testUtil.checkToolbarActions(testData.fileSharedFav.name, testData.fileSharedFav.toolbarPrimary, testData.fileSharedFav.toolbarMore);
        await testUtil.checkContextMenu(testData.fileSharedFav.name, testData.fileSharedFav.contextMenu);
      });

      it('[C297617] - File locked', async () => {
        await testUtil.checkToolbarActions(testData.fileLocked.name, testData.fileLocked.toolbarPrimary, testData.fileLocked.toolbarMore);
        await testUtil.checkContextMenu(testData.fileLocked.name, testData.fileLocked.contextMenu);
      });

      it('[C291816] - File favorite, locked', async () => {
        await testUtil.checkToolbarActions(testData.fileFavLocked.name, testData.fileFavLocked.toolbarPrimary, testData.fileFavLocked.toolbarMore);
        await testUtil.checkContextMenu(testData.fileFavLocked.name, testData.fileFavLocked.contextMenu);
      });

      it('[C280453] - File shared, locked', async () => {
        await testUtil.checkToolbarActions(testData.fileSharedLocked.name, testData.fileSharedLocked.toolbarPrimary, testData.fileSharedLocked.toolbarMore);
        await testUtil.checkContextMenu(testData.fileSharedLocked.name, testData.fileSharedLocked.contextMenu);
      });

      it('[C280454] - File shared, favorite, locked', async () => {
        await testUtil.checkToolbarActions(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.toolbarPrimary, testData.fileSharedFavLocked.toolbarMore);
        await testUtil.checkContextMenu(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.contextMenu);
      });
    });

    describe('on a folder', () => {

      it('[C213123] - Folder not favorite', async () => {
        await testUtil.checkToolbarActions(testData.folder.name, testData.folder.toolbarPrimary, testData.folder.toolbarMore);
        await testUtil.checkContextMenu(testData.folder.name, testData.folder.contextMenu);
      });

      it('[C280451] - Folder favorite', async () => {
        await testUtil.checkToolbarActions(testData.folderFav.name, testData.folderFav.toolbarPrimary, testData.folderFav.toolbarMore);
        await testUtil.checkContextMenu(testData.folderFav.name, testData.folderFav.contextMenu);
      });
    });

    describe('on multiple selection', () => {
      it('[C217112] - multiple files', async () => {
        await testUtil.checkMultipleSelContextMenu([testData.fileDocx.name, testData.fileDocxSharedFav.name], testData.multipleSel.contextMenu);
        await testUtil.checkMultipleSelToolbarActions([testData.fileDocx.name, testData.fileDocxSharedFav.name], testData.multipleSel.toolbarPrimary, testData.multipleSel.toolbarMore);
      });

      it('[C297619] - multiple files - all favorite', async () => {
        await testUtil.checkMultipleSelContextMenu([testData.fileDocxFav.name, testData.fileDocxSharedFav.name], testData.multipleSelAllFav.contextMenu);
        await testUtil.checkMultipleSelToolbarActions([testData.fileDocxFav.name, testData.fileDocxSharedFav.name], testData.multipleSel.toolbarPrimary, testData.multipleSelAllFav.toolbarMore);
      });

      it('[C326688] - multiple locked files', async () => {
        await testUtil.checkMultipleSelContextMenu([testData.fileLocked.name, testData.fileSharedFavLocked.name], testData.multipleSel.contextMenu);
        await testUtil.checkMultipleSelToolbarActions([testData.fileLocked.name, testData.fileSharedFavLocked.name], testData.multipleSel.toolbarPrimary, testData.multipleSel.toolbarMore);
      });

      it('[C280459] - multiple folders', async () => {
        await testUtil.checkMultipleSelContextMenu([testData.folderFav.name, testData.folder.name], testData.multipleSel.contextMenu);
        await testUtil.checkMultipleSelToolbarActions([testData.folderFav.name, testData.folder.name], testData.multipleSel.toolbarPrimary, testData.multipleSel.toolbarMore);
      });

      it('[C280460] - both files and folders', async () => {
        await testUtil.checkMultipleSelContextMenu([testData.file.name, testData.folder.name], testData.multipleSel.contextMenu);
        await testUtil.checkMultipleSelToolbarActions([testData.file.name, testData.folder.name], testData.multipleSel.toolbarPrimary, testData.multipleSel.toolbarMore);
      });
    });
  });
}
