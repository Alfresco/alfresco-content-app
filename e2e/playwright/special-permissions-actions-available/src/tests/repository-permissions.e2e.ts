/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
  PersonalFilesPage,
  RepositoryTestData,
  seedRepositoryTestData,
  SharedLinksApi,
  test,
  timeouts,
  TrashcanApi,
  users,
  Utils
} from '@alfresco/aca-playwright-shared';
import { expect } from '@playwright/test';

test.describe('Repository — Permissions routing', () => {
  const admin = users.admin;

  const openPermissionsFromContextMenu = async (page: PersonalFilesPage, fileName: string) => {
    await expect(page.dataTable.getRowByName(fileName)).toBeVisible({ timeout: timeouts.large });
    await page.dataTable.getRowByName(fileName).click({ button: 'right' });
    await page.pagination.clickMenuItem('Permissions');
  };

  test.describe('signed in as admin', () => {
    let userNodesApi: NodesApi;
    let trashcanApi: TrashcanApi;
    let sharedLinksApi: SharedLinksApi;
    let testData!: RepositoryTestData;

    test.beforeAll(async () => {
      try {
        userNodesApi = await NodesApi.initialize('admin');
        trashcanApi = await TrashcanApi.initialize('admin');
        sharedLinksApi = await SharedLinksApi.initialize('admin');
        testData = await seedRepositoryTestData({ userNodesApi, adminNodesApi: userNodesApi });
        await sharedLinksApi.shareFileById(testData.repoFile.id);
      } catch (error) {
        console.error(`beforeAll (admin) failed: ${error}`);
        throw error;
      }
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, admin.username, admin.password, 'beforeEach (admin) failed');
    });

    test.afterAll(async () => {
      await cleanupRepositoryTestData(testData, { adminNodesApi: userNodesApi });
      await Utils.deleteNodesSitesEmptyTrashcan(userNodesApi, trashcanApi, 'afterAll (admin) failed');
    });

    test('[XAT-19608] Permissions from context menu on Repository preserves the /repository route', async ({ personalFiles }) => {
      await personalFiles.navigate({ remoteUrl: `#/repository/${testData.repoFolder.id}` });
      await personalFiles.dataTable.spinnerWaitForReload();

      await openPermissionsFromContextMenu(personalFiles, testData.repoFile.name);

      await personalFiles.page.waitForURL(`**/repository/details/${testData.repoFile.id}/permissions`);
      expect(personalFiles.page.url()).toContain(`/repository/details/${testData.repoFile.id}/permissions`);
      expect(personalFiles.page.url(), 'URL must not redirect to /personal-files').not.toContain('/personal-files/details/');
      await expect(personalFiles.infoDrawer.expandedDetailsPermissionsTab).toBeVisible();
    });

    test('[XAT-19609] Permissions from toolbar on Repository preserves the /repository route', async ({ personalFiles }) => {
      await personalFiles.navigate({ remoteUrl: `#/repository/${testData.repoFolder.id}` });
      await personalFiles.dataTable.spinnerWaitForReload();

      await expect(personalFiles.dataTable.getRowByName(testData.repoFile.name)).toBeVisible({ timeout: timeouts.large });
      await personalFiles.dataTable.selectItems(testData.repoFile.name);
      await personalFiles.clickMoreActionsButton('Permissions');

      await personalFiles.page.waitForURL(`**/repository/details/${testData.repoFile.id}/permissions`);
      expect(personalFiles.page.url()).toContain(`/repository/details/${testData.repoFile.id}/permissions`);
      expect(personalFiles.page.url(), 'URL must not redirect to /personal-files').not.toContain('/personal-files/details/');
      await expect(personalFiles.infoDrawer.expandedDetailsPermissionsTab).toBeVisible();
    });

    test('[XAT-19610] Permissions from Shared keeps a Repository file on /repository', async ({ sharedPage }) => {
      await sharedPage.navigate();
      await sharedPage.dataTable.spinnerWaitForReload();

      await expect(sharedPage.dataTable.getRowByName(testData.repoFile.name)).toBeVisible({ timeout: timeouts.large });
      await sharedPage.dataTable.getRowByName(testData.repoFile.name).click({ button: 'right' });
      await sharedPage.matMenu.clickMenuItem('Permissions');

      await sharedPage.page.waitForURL(/\/repository\/details\/[^/]+\/permissions/);
      const url = sharedPage.page.url();
      expect(url, 'Repository file opened from Shared must stay on /repository').toMatch(/\/repository\/details\/[^/]+\/permissions/);
      expect(url, 'Repository file must not leak into /personal-files').not.toContain('/personal-files/details/');
      await expect(sharedPage.infoDrawer.expandedDetailsPermissionsTab).toBeVisible();
    });
  });

  test.describe('signed in as a personal user', () => {
    const personalUser = `perm-personal-${Utils.random()}`;

    let personalUserNodesApi: NodesApi;
    let personalUserTrashcanApi: TrashcanApi;
    let personalFile: { id: string; name: string };

    test.beforeAll(async () => {
      try {
        const apiClientFactory = new ApiClientFactory();
        await apiClientFactory.setUpAcaBackend('admin');
        try {
          await apiClientFactory.createUser({ username: personalUser });
        } catch (error) {
          if (!String(error).includes('409')) {
            throw error;
          }
        }

        personalUserNodesApi = await NodesApi.initialize(personalUser, personalUser);
        personalUserTrashcanApi = await TrashcanApi.initialize(personalUser, personalUser);
        const personalFileName = `personal-file-${Utils.random()}.txt`;
        const created = (await personalUserNodesApi.createFile(personalFileName)).entry;
        personalFile = { id: created.id, name: personalFileName };
      } catch (error) {
        console.error(`beforeAll (personal user) failed: ${error}`);
        throw error;
      }
    });

    test.beforeEach(async ({ loginPage }) => {
      await Utils.tryLoginUser(loginPage, personalUser, personalUser, 'beforeEach (personal user) failed');
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(personalUserNodesApi, personalUserTrashcanApi, 'afterAll (personal user) failed');
    });

    test('[XAT-19611] Permissions for a Personal File still routes to /personal-files (regression)', async ({ personalFiles }) => {
      await personalFiles.navigate();
      await personalFiles.dataTable.spinnerWaitForReload();

      await openPermissionsFromContextMenu(personalFiles, personalFile.name);

      await personalFiles.page.waitForURL(`**/personal-files/details/${personalFile.id}/permissions`);
      expect(personalFiles.page.url()).toContain(`/personal-files/details/${personalFile.id}/permissions`);
      expect(personalFiles.page.url(), 'Personal file must not leak into /repository').not.toContain('/repository/details/');
      await expect(personalFiles.infoDrawer.expandedDetailsPermissionsTab).toBeVisible();
    });
  });
});
