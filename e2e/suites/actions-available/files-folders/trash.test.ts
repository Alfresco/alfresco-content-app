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

import { RepoClient, Utils, ApiActions, BrowsingPage } from '@alfresco/aca-testing-shared';
import * as testData from './test-data';
import * as testUtil from '../test-util';
import { ApiService, UsersActions, LoginPage } from '@alfresco/adf-testing';

const page = new BrowsingPage();

describe('Trash - available actions : ', () => {
  const random = Utils.random();

  let fileInTrashId: string;
  let file2InTrashId: string;
  let folderInTrashId: string;
  let folder2InTrashId: string;

  const apiService = new ApiService();
  const adminApiService = new ApiService();
  const repoClient = new RepoClient(apiService);
  const apiActions = new ApiActions(apiService);
  const usersActions = new UsersActions(adminApiService);

  const loginPage = new LoginPage();

  beforeAll(async () => {
    await adminApiService.loginWithProfile('admin');
    const user = await usersActions.createUser();
    await apiService.login(user.username, user.password);

    fileInTrashId = (await repoClient.nodes.createFile(testData.fileInTrash.name)).entry.id;
    file2InTrashId = (await repoClient.nodes.createFile(testData.file2InTrash.name)).entry.id;
    folderInTrashId = (await repoClient.nodes.createFolder(testData.folderInTrash.name)).entry.id;
    folder2InTrashId = (await repoClient.nodes.createFolder(testData.folder2InTrash.name)).entry.id;

    const initialDeletedTotalItems = await apiActions.getTrashcanSize();
    await apiActions.deleteNodes([fileInTrashId, file2InTrashId, folderInTrashId, folder2InTrashId], false);
    await apiActions.waitForTrashcanSize(initialDeletedTotalItems + 4);

    await loginPage.login(user.username, user.password);
    await page.clickTrashAndWait();
  });

  afterAll(async () => {
    await apiActions.emptyTrashcan();
  });

  beforeEach(async () => {
    await Utils.pressEscape();
  });

  it('on a file - [C286258]', async () => {
    await testUtil.checkToolbarPrimary(testData.fileInTrash.name, testData.fileInTrash.trashActions);
    await testUtil.checkContextMenu(testData.fileInTrash.name, testData.fileInTrash.trashActions);
  });

  it('on a folder - [C286259]', async () => {
    await testUtil.checkToolbarPrimary(testData.folderInTrash.name, testData.folderInTrash.trashActions);
    await testUtil.checkContextMenu(testData.folderInTrash.name, testData.folderInTrash.trashActions);
  });

  it('multiple files - [C280472]', async () => {
    await testUtil.checkMultipleSelContextMenu([testData.fileInTrash.name, testData.file2InTrash.name], testData.trashActions);
    await testUtil.checkMultipleSelToolbarPrimary([testData.fileInTrash.name, testData.file2InTrash.name], testData.trashActions);
  });

  it('multiple folders - [C280473]', async () => {
    await testUtil.checkMultipleSelContextMenu([testData.folderInTrash.name, testData.folder2InTrash.name], testData.trashActions);
    await testUtil.checkMultipleSelToolbarPrimary([testData.folderInTrash.name, testData.folder2InTrash.name], testData.trashActions);
  });

  it('both files and folders - [C280474]', async () => {
    await testUtil.checkMultipleSelContextMenu([testData.fileInTrash.name, testData.folderInTrash.name], testData.trashActions);
    await testUtil.checkMultipleSelToolbarPrimary([testData.fileInTrash.name, testData.folderInTrash.name], testData.trashActions);
  });
});
