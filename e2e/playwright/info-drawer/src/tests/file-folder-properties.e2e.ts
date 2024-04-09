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

test.describe('Info Drawer - File Folder Properties', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;
  const username = `user-e2e-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      fileActionsApi = await FileActionsApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[C299162] View properties - Default tabs', async ({ personalFiles }) => {
    const defaultTabsFolderName = `defaultTabsFolder-e2e-${Utils.random()}`;
    await nodesApi.createFolder(defaultTabsFolderName);
    await fileActionsApi.waitForNodes(defaultTabsFolderName, { expect: 1 });
    await personalFiles.navigate();
    await Utils.reloadPageIfRowNotVisible(personalFiles, defaultTabsFolderName);
    await expect(personalFiles.dataTable.getRowByName(defaultTabsFolderName)).toBeVisible();
    await personalFiles.dataTable.getRowByName(defaultTabsFolderName).click();
    await personalFiles.acaHeader.viewDetails.click();

    expect(await personalFiles.infoDrawer.getHeaderTitle()).toEqual(defaultTabsFolderName);
    await expect(personalFiles.infoDrawer.propertiesTab).toBeVisible();
    await expect(personalFiles.infoDrawer.commentsTab).toBeVisible();
    expect(await personalFiles.infoDrawer.getTabsCount()).toEqual(2);
  });

  test('[C599174] View properties - Should be able to make the files/folders info drawer expandable as for Sites', async ({ personalFiles }) => {
    const expandDetailsFolderName = `expandDetailsFolder-e2e-${Utils.random()}`;
    await nodesApi.createFolder(expandDetailsFolderName);
    await fileActionsApi.waitForNodes(expandDetailsFolderName, { expect: 1 });
    await personalFiles.navigate();
    await Utils.reloadPageIfRowNotVisible(personalFiles, expandDetailsFolderName);
    await expect(personalFiles.dataTable.getRowByName(expandDetailsFolderName)).toBeVisible();
    await personalFiles.dataTable.getRowByName(expandDetailsFolderName).click();
    await personalFiles.acaHeader.viewDetails.click();

    await personalFiles.infoDrawer.expandDetailsButton.click();
    await expect(personalFiles.infoDrawer.expandedDetailsPermissionsTab).toBeVisible();

    await personalFiles.navigate();
    await expect(personalFiles.dataTable.getRowByName(expandDetailsFolderName)).toBeVisible();
    await personalFiles.dataTable.getRowByName(expandDetailsFolderName).click({ button: 'right' });
    await personalFiles.pagination.clickMenuItem('Permissions');
    await expect(personalFiles.infoDrawer.expandedDetailsPermissionsTab).toBeVisible();
  });
});
