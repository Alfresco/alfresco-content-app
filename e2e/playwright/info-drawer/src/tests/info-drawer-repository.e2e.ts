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
  FavoritesPageApi,
  NodesApi,
  RepositoryTestData,
  seedRepositoryTestData,
  test,
  TrashcanApi,
  users,
  Utils
} from '@alfresco/aca-playwright-shared';
import { expect, Locator } from '@playwright/test';

test.describe('Repository — Info drawer expand routing', () => {
  const admin = users.admin;

  interface ListViewLike {
    navigate: (opts?: { remoteUrl?: string }) => Promise<void>;
    dataTable: {
      spinnerWaitForReload: () => Promise<void>;
      getRowByName: (name: string) => Locator;
      selectItems: (...names: string[]) => Promise<void>;
    };
    acaHeader: { viewDetails: Locator };
    infoDrawer: { expandDetailsButton: Locator };
  }

  const openAndExpandInfoDrawer = async (page: ListViewLike, folderUrl: string, fileName: string) => {
    await page.navigate({ remoteUrl: folderUrl });
    await page.dataTable.spinnerWaitForReload();

    await expect(page.dataTable.getRowByName(fileName)).toBeVisible();
    await page.dataTable.selectItems(fileName);
    await page.acaHeader.viewDetails.click();

    await expect(page.infoDrawer.expandDetailsButton).toBeVisible();
    await page.infoDrawer.expandDetailsButton.click();
  };

  test.describe('signed in as admin', () => {
    let userNodesApi: NodesApi;
    let trashcanApi: TrashcanApi;
    let favoritesApi: FavoritesPageApi;
    let testData!: RepositoryTestData;

    test.beforeAll(async () => {
      try {
        userNodesApi = await NodesApi.initialize('admin');
        trashcanApi = await TrashcanApi.initialize('admin');
        favoritesApi = await FavoritesPageApi.initialize('admin');
        testData = await seedRepositoryTestData({ userNodesApi, adminNodesApi: userNodesApi });

        await favoritesApi.addFavoriteById('file', testData.repoFile.id);
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

    test('[XAT-19602] Expand info drawer on a Repository file preserves /repository route', async ({ personalFiles }) => {
      await openAndExpandInfoDrawer(personalFiles, `#/repository/${testData.repoFolder.id}`, testData.repoFile.name);

      await personalFiles.page.waitForURL(`**/repository/details/${testData.repoFile.id}**`);
      const url = personalFiles.page.url();

      expect(url, 'URL must be in the /repository details area').toContain(`/repository/details/${testData.repoFile.id}`);
      expect(url, 'URL must not redirect to /personal-files').not.toContain('/personal-files/details/');
      await expect(personalFiles.infoDrawer.expandedDetailsPermissionsTab).toBeVisible();
    });

    test('[XAT-19603] Expand info drawer from Favorites keeps a Repository file on /repository', async ({ favoritePage }) => {
      await openAndExpandInfoDrawer(favoritePage, '#/favorites', testData.repoFile.name);

      await favoritePage.page.waitForURL(`**/repository/details/${testData.repoFile.id}**`);
      const url = favoritePage.page.url();

      expect(url, 'Repository file opened from Favorites must stay on /repository').toContain(`/repository/details/${testData.repoFile.id}`);
      expect(url, 'Repository file must not leak into /personal-files').not.toContain('/personal-files/details/');
      await expect(favoritePage.infoDrawer.expandedDetailsPermissionsTab).toBeVisible();
    });
  });

  test.describe('signed in as a personal user', () => {
    const personalUser = `info-personal-${Utils.random()}`;

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

    test('[XAT-19604] Expand info drawer on a Personal file still routes to /personal-files (regression)', async ({ personalFiles }) => {
      await openAndExpandInfoDrawer(personalFiles, '#/personal-files', personalFile.name);

      await personalFiles.page.waitForURL(`**/personal-files/details/${personalFile.id}**`);
      const url = personalFiles.page.url();

      expect(url, 'URL must be in the /personal-files details area').toContain(`/personal-files/details/${personalFile.id}`);
      expect(url, 'Personal file must not leak into /repository').not.toContain('/repository/details/');
      await expect(personalFiles.infoDrawer.expandedDetailsPermissionsTab).toBeVisible();
    });
  });
});
