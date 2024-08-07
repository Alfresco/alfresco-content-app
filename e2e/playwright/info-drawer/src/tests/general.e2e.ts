/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { expect } from '@playwright/test';
import { ApiClientFactory, Utils, test, TrashcanApi, NodesApi, FileActionsApi } from '@alfresco/playwright-shared';

test.describe('Info Drawer - General', () => {
  let fileActionsApi: FileActionsApi;
  let trashcanApi: TrashcanApi;
  let nodesApi: NodesApi;

  const username = `user1-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      fileActionsApi = await FileActionsApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      nodesApi = await NodesApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[C268999] Info drawer closes on page refresh', async ({ personalFiles }) => {
    const parentFolder = `parent-${Utils.random()}`;
    const file1 = `file1-${Utils.random()}.txt`;
    const folder1 = `folder1-${Utils.random()}`;
    const parentId = (await nodesApi.createFolder(parentFolder)).entry.id;

    await nodesApi.createFile(file1, parentId);
    await nodesApi.createFolder(folder1, parentId);
    await fileActionsApi.waitForNodes(file1, { expect: 1 });
    await personalFiles.navigate();
    await Utils.reloadPageIfRowNotVisible(personalFiles, parentFolder);
    await expect(personalFiles.dataTable.getRowByName(parentFolder)).toBeVisible();
    await personalFiles.dataTable.performClickFolderOrFileToOpen(parentFolder);
    await personalFiles.dataTable.selectItems(file1);
    await personalFiles.acaHeader.viewDetails.click();
    await expect(personalFiles.infoDrawer.infoDrawerPanel).toBeVisible();

    await personalFiles.reload({ waitUntil: 'load' });
    await expect(personalFiles.infoDrawer.infoDrawerPanel).toBeHidden();
    await personalFiles.dataTable.selectItems(file1);
    await personalFiles.acaHeader.viewDetails.click();
    await expect(personalFiles.infoDrawer.infoDrawerPanel).toBeVisible();

    await personalFiles.reload({ waitUntil: 'load' });
    await expect(personalFiles.infoDrawer.infoDrawerPanel).toBeHidden();
  });
});
