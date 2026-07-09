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

import {
  ApiClientFactory,
  cleanupRepositoryTestData,
  NodesApi,
  RepositoryTestData,
  seedRepositoryTestData,
  test,
  TrashcanApi,
  users,
  Utils
} from '@alfresco/aca-playwright-shared';
import { expect } from '@playwright/test';

test.describe('Repository — smoke test', () => {
  const admin = users.admin;

  let userNodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let testData: RepositoryTestData;
  let smokeFileName: string;
  let smokeFileId: string;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      userNodesApi = await NodesApi.initialize('admin');
      trashcanApi = await TrashcanApi.initialize('admin');
      testData = await seedRepositoryTestData({ userNodesApi, adminNodesApi: userNodesApi });

      smokeFileName = `smoke-repo-${Utils.random()}.txt`;
      smokeFileId = (await userNodesApi.createFile(smokeFileName, testData.repoFolder.id)).entry.id;
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, admin.username, admin.password, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await cleanupRepositoryTestData(testData, { adminNodesApi: userNodesApi });
    await Utils.deleteNodesSitesEmptyTrashcan(userNodesApi, trashcanApi, 'afterAll failed');
  });

  test('[XAT-19607] Sequential Repository actions never leak to /personal-files', async ({ personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/repository/${testData.repoFolder.id}` });
    await personalFiles.dataTable.spinnerWaitForReload();
    await expect(personalFiles.dataTable.getRowByName(smokeFileName)).toBeVisible();

    await personalFiles.dataTable.selectItems(smokeFileName);
    await personalFiles.acaHeader.viewDetails.click();
    await personalFiles.infoDrawer.expandDetailsButton.click();
    await personalFiles.page.waitForURL(`**/repository/details/${smokeFileId}**`);
    expect(personalFiles.page.url()).toContain(`/repository/details/${smokeFileId}`);

    await personalFiles.navigate({ remoteUrl: `#/repository/${testData.repoFolder.id}` });
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(personalFiles.page.url(), 'Should be back on /repository, not /personal-files').toContain(`/repository/${testData.repoFolder.id}`);

    await personalFiles.dataTable.getRowByName(smokeFileName).click({ button: 'right' });
    await personalFiles.pagination.clickMenuItem('Permissions');
    await personalFiles.page.waitForURL(`**/repository/details/${smokeFileId}/permissions`);
    expect(personalFiles.page.url()).toContain(`/repository/details/${smokeFileId}/permissions`);
    expect(personalFiles.page.url()).not.toContain('/personal-files/details/');
  });
});
