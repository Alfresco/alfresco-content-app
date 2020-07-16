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

import { BrowsingPage, Utils } from '@alfresco/aca-testing-shared';
import * as testData from './test-data-permissions';
import * as testUtil from '../test-util';

export function sharedFilesTests() {
  const page = new BrowsingPage();

  describe('available actions : ', () => {
    beforeAll(async () => {
      await page.clickSharedFilesAndWait();
    });

    beforeEach(async () => {
      await Utils.pressEscape();
    });

    afterEach(async () => {
      await page.closeOpenDialogs();
    });

    describe('single selection', () => {
      it('File Office, shared - [C326626]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileDocxShared.name,
          testData.fileDocxShared.toolbarPrimary,
          testData.fileDocxShared.sharedToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileDocxShared.name, testData.fileDocxShared.sharedContextMenu);
      });

      it('File Office, shared, favorite - [C326627]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileDocxSharedFav.name,
          testData.fileDocxSharedFav.toolbarPrimary,
          testData.fileDocxSharedFav.sharedToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileDocxSharedFav.name, testData.fileDocxSharedFav.sharedContextMenu);
      });

      it('File shared - [C326628]', async () => {
        await testUtil.checkToolbarActions(testData.fileShared.name, testData.fileShared.toolbarPrimary, testData.fileShared.sharedToolbarMore);
        await testUtil.checkContextMenu(testData.fileShared.name, testData.fileShared.sharedContextMenu);
      });

      it('File shared, favorite - [C326629]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedFav.name,
          testData.fileSharedFav.toolbarPrimary,
          testData.fileSharedFav.sharedToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedFav.name, testData.fileSharedFav.sharedContextMenu);
      });

      it('File shared, locked - [C326631]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedLocked.name,
          testData.fileSharedLocked.toolbarPrimary,
          testData.fileSharedLocked.sharedToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedLocked.name, testData.fileSharedLocked.sharedContextMenu);
      });

      it('File shared, favorite, locked - [C326632]', async () => {
        await testUtil.checkToolbarActions(
          testData.fileSharedFavLocked.name,
          testData.fileSharedFavLocked.toolbarPrimary,
          testData.fileSharedFavLocked.sharedToolbarMore
        );
        await testUtil.checkContextMenu(testData.fileSharedFavLocked.name, testData.fileSharedFavLocked.sharedContextMenu);
      });
    });

    describe('multiple selection', () => {
      it('multiple files - [C326634]', async () => {
        await testUtil.checkMultipleSelContextMenu([testData.fileShared.name, testData.fileSharedFav.name], testData.multipleSel.contextMenu);
        await testUtil.checkMultipleSelToolbarActions(
          [testData.fileShared.name, testData.fileSharedFav.name],
          testData.multipleSel.toolbarPrimary,
          testData.multipleSel.toolbarMore
        );
      });

      it('multiple files - all favorite - [C326635]', async () => {
        await testUtil.checkMultipleSelContextMenu(
          [testData.fileSharedFav.name, testData.fileSharedFavLocked.name],
          testData.multipleSelAllFav.contextMenu
        );
        await testUtil.checkMultipleSelToolbarActions(
          [testData.fileSharedFav.name, testData.fileSharedFavLocked.name],
          testData.multipleSel.toolbarPrimary,
          testData.multipleSelAllFav.toolbarMore
        );
      });

      it('multiple locked files - [C326636]', async () => {
        await testUtil.checkMultipleSelContextMenu(
          [testData.fileSharedLocked.name, testData.fileSharedFavLocked.name],
          testData.multipleSel.contextMenu
        );
        await testUtil.checkMultipleSelToolbarActions(
          [testData.fileSharedLocked.name, testData.fileSharedFavLocked.name],
          testData.multipleSel.toolbarPrimary,
          testData.multipleSel.toolbarMore
        );
      });

      it('multiple files with different granular permissions - [C326639]', async () => {
        await testUtil.checkMultipleSelContextMenu(
          [testData.fileSharedFav.name, testData.fileGranularPermission],
          testData.multipleSelAllFav.contextMenu
        );
        await testUtil.checkMultipleSelToolbarActions(
          [testData.fileSharedFav.name, testData.fileGranularPermission],
          testData.multipleSel.toolbarPrimary,
          testData.multipleSelAllFav.toolbarMore
        );
      });
    });
  });
}
