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

import { ApiClientFactory, FavoritesPageApi, PersonalFilesPage, NodesApi, TrashcanApi, Utils, test, timeouts } from '@alfresco/aca-playwright-shared';
import * as testData from '@alfresco/aca-playwright-shared';

test.describe('Folders - available actions : ', () => {
  const username = `user-${Utils.random()}`;
  let parentId: string;
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;

  async function checkActionsAvailable(
    myPersonalFiles: PersonalFilesPage,
    expectedToolbarPrimary: string[],
    expectedToolbarMore: string[]
  ): Promise<void> {
    await myPersonalFiles.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
    await myPersonalFiles.acaHeader.clickMoreActions();
    await myPersonalFiles.matMenu.verifyActualMoreActions(expectedToolbarMore);
  }

  test.beforeAll(async () => {
    test.setTimeout(timeouts.extendedTest);
    const apiClientFactory = new ApiClientFactory();
    const parentName = `parent-folder-${Utils.random()}`;
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    nodesApi = await NodesApi.initialize(username, username);
    const favoritesActions = await FavoritesPageApi.initialize(username, username);
    trashcanApi = await TrashcanApi.initialize(username, username);
    parentId = (await nodesApi.createFolder(parentName)).entry.id;
    await nodesApi.createFile(testData.file.name, parentId);
    await nodesApi.createFolder(testData.folderFile.name, parentId);
    const folderFavId = (await nodesApi.createFolder(testData.folderFavFile.name, parentId)).entry.id;
    const initialFavoritesTotalItems = (await favoritesActions.getFavoritesTotalItems(username)) || 0;
    await favoritesActions.addFavoritesByIds('folder', [folderFavId]);
    await favoritesActions.waitForApi(username, { expect: initialFavoritesTotalItems + 1 });
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.describe('on Personal Files : ', () => {
    test.beforeEach(async ({ personalFiles, loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${parentId}` });
    });

    test('[XAT-4637] Actions for a folder, not favorite', async ({ personalFiles }) => {
      await personalFiles.dataTable.getRowByName(testData.folderFile.name).click({ button: 'right' });
      await personalFiles.matMenu.verifyActualMoreActions(testData.folderFile.contextMenu);
      await checkActionsAvailable(personalFiles, testData.folderFile.toolbarPrimary, testData.folderFile.toolbarMore);
    });

    test('[XAT-4638] Actions for a folder, favorite', async ({ personalFiles }) => {
      await personalFiles.dataTable.getRowByName(testData.folderFavFile.name).click({ button: 'right' });
      await personalFiles.matMenu.verifyActualMoreActions(testData.folderFavFile.contextMenu);
      await checkActionsAvailable(personalFiles, testData.folderFavFile.toolbarPrimary, testData.folderFavFile.toolbarMore);
    });

    test('[XAT-4642] Actions on multiple folders', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(testData.folderFavFile.name, testData.folderFile.name);
      await personalFiles.dataTable.getRowByName(testData.folderFavFile.name).click({ button: 'right' });
      await personalFiles.page.reload({ waitUntil: 'load' });
      await personalFiles.dataTable.selectItems(testData.folderFavFile.name, testData.folderFile.name);
      await checkActionsAvailable(personalFiles, testData.multipleSelFile.toolbarPrimary, testData.multipleSelFile.toolbarMore);
    });

    test('[XAT-4643] Actions on multiple selection - files and folders', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(testData.file.name, testData.folderFile.name);
      await personalFiles.dataTable.getRowByName(testData.folderFile.name).click({ button: 'right' });
      await personalFiles.matMenu.verifyActualMoreActions(testData.multipleSelFile.contextMenu);
      await checkActionsAvailable(personalFiles, testData.multipleSelFile.toolbarPrimary, testData.multipleSelFile.toolbarMore);
    });
  });
});
