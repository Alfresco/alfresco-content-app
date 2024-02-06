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

import { ApiClientFactory, Utils, test, TrashcanApi, NodesApi } from '@alfresco/playwright-shared';

test.describe('Info Drawer - General', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;

  const username = `user1-${Utils.random()}`;
  const parentFolder = `parent-${Utils.random()}`;
  const file1 = `file1-${Utils.random()}.txt`;
  const folder1 = `folder1-${Utils.random()}`;
  let parentId: string;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);

      parentId = (await nodesApi.createFolder(parentFolder)).entry.id;
      await nodesApi.createFile(file1, parentId);
      await nodesApi.createFolder(folder1, parentId);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    try {
      await loginPage.loginUser({ username, password: username }, { withNavigation: true, waitForLoading: true });
    } catch (error) {
      console.error(`beforeEach failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    try {
      await nodesApi.deleteCurrentUserNodes();
      await trashcanApi.emptyTrashcan();
    } catch (error) {
      console.error(`afterAll failed: ${error}`);
    }
  });

  test.afterEach(async ({ personalFiles }) => {
    if (await personalFiles.infoDrawer.infoDrawerPanel.isVisible()) {
      await personalFiles.clickInfoDrawerButton();
    }
  });

  test('[C268999] Info drawer closes on page refresh', async ({ personalFiles }) => {
    await personalFiles.dataTable.selectItem(file1);
    await personalFiles.clickInfoDrawerButton();
    expect(await personalFiles.infoDrawer.infoDrawerPanel.isVisible()).toBe(true);

    await personalFiles.reload();
    await personalFiles.waitForPageLoad();

    expect(personalFiles.infoDrawer.infoDrawerPanel.isVisible()).toBe(false);
  });
});
