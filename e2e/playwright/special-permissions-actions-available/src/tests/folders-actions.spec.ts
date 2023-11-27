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

import { ApiClientFactory, FavoritesPageApi, PersonalFilesPage, NodesApi, TrashcanApi, Utils, test, timeouts } from '@alfresco/playwright-shared';
import * as testData from '@alfresco/playwright-shared';

test.describe('Folders - available actions : ', () => {
  const username = `user-${Utils.random()}`;
  let parentId: string;
  let nodesApi: NodesApi;
  let trashCanActions: TrashcanApi;

  async function checkActionsAvailable(
    myPersonalFiles: PersonalFilesPage,
    item: string,
    expectedToolbarPrimary: string[],
    expectedToolbarMore: string[]
  ): Promise<void> {
    await myPersonalFiles.dataTable.selectItem(item);
    await myPersonalFiles.acaHeader.verifyToolbarPrimaryActions(expectedToolbarPrimary);
    await myPersonalFiles.acaHeader.clickMoreActions();
    await myPersonalFiles.matMenu.verifyActualMoreActions(expectedToolbarMore);
  }

  async function checkMultipleSelActionsAvailable(
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
    const parentName = `parent-${Utils.random()}`;
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    nodesApi = await NodesApi.initialize(username, username);
    const favoritesActions = await FavoritesPageApi.initialize(username, username);
    trashCanActions = await TrashcanApi.initialize(username, username);
    parentId = (await nodesApi.createFolder(parentName)).entry.id;
    await nodesApi.createFile(testData.file.name, parentId);
    await nodesApi.createFolder(testData.folderFile.name, parentId);
    const folderFavId = (await nodesApi.createFolder(testData.folderFavFile.name, parentId)).entry.id;
    const initialFavoritesTotalItems = (await favoritesActions.getFavoritesTotalItems(username)) || 0;
    await favoritesActions.addFavoritesByIds('folder', [folderFavId]);
    await favoritesActions.waitForApi(username, { expect: initialFavoritesTotalItems + 1 });
  });

  test.afterAll(async () => {
    await nodesApi.deleteNodes([parentId]);
    await trashCanActions.emptyTrashcan();
  });

  test.describe('on Personal Files : ', () => {
    test.beforeEach(async ({ personalFiles, loginPage }) => {
      await personalFiles.navigate({ remoteUrl: `#/personal-files/${parentId}` });
      await loginPage.loginUser({ username, password: username });
    });

    test('Folder not favorite  - [C213123]', async ({ personalFiles }) => {
      await personalFiles.dataTable.getRowByName(testData.folderFile.name).click({ button: 'right' });
      await personalFiles.matMenu.verifyActualMoreActions(testData.folderFile.contextMenu);
      await checkActionsAvailable(personalFiles, testData.folderFile.name, testData.folderFile.toolbarPrimary, testData.folderFile.toolbarMore);
    });

    test('Folder favorite - [C280451]', async ({ personalFiles }) => {
      await personalFiles.dataTable.getRowByName(testData.folderFavFile.name).click({ button: 'right' });
      await personalFiles.matMenu.verifyActualMoreActions(testData.folderFavFile.contextMenu);
      await checkActionsAvailable(
        personalFiles,
        testData.folderFavFile.name,
        testData.folderFavFile.toolbarPrimary,
        testData.folderFavFile.toolbarMore
      );
    });

    test('multiple folders - [C280459]', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectMultiItem(testData.folderFavFile.name, testData.folderFile.name);
      await personalFiles.dataTable.getRowByName(testData.folderFavFile.name).click({ button: 'right' });
      await personalFiles.matMenu.verifyActualMoreActions(testData.multipleSelFile.contextMenu);
      await personalFiles.dataTable.selectMultiItem(testData.folderFavFile.name, testData.folderFile.name);
      await checkMultipleSelActionsAvailable(personalFiles, testData.multipleSelFile.toolbarPrimary, testData.multipleSelFile.toolbarMore);
    });

    test('both files and folders - [C280460]', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectMultiItem(testData.file.name, testData.folderFile.name);
      await personalFiles.dataTable.getRowByName(testData.folderFile.name).click({ button: 'right' });
      await personalFiles.matMenu.verifyActualMoreActions(testData.multipleSelFile.contextMenu);
      await checkMultipleSelActionsAvailable(personalFiles, testData.multipleSelFile.toolbarPrimary, testData.multipleSelFile.toolbarMore);
    });
  });
});
