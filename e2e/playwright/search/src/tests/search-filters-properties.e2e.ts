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
import { ApiClientFactory, Utils, test, NodesApi, TrashcanApi, FileActionsApi, TEST_FILES } from '@alfresco/playwright-shared';

test.describe('Search - Filters - Properties', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;

  const randomId = Utils.random();
  const username = `user-${randomId}`;
  const fileNamePdfKb = `${randomId}-fileNameKb.pdf`;
  const fileNameJpgMb = `${randomId}-fileNameMb.jpg`;

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      const fileActionsApi = await FileActionsApi.initialize(username, username);
      await fileActionsApi.uploadFileWithRename(TEST_FILES.PDF.path, fileNamePdfKb, '-my-');
      await fileActionsApi.uploadFileWithRename(TEST_FILES.JPG_FILE_1MB.path, fileNameJpgMb, '-my-');
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[C699046-1] Filter by size - At least 1000KB', async ({ searchPage }) => {
    await searchPage.searchWithin(randomId, 'files');
    await searchPage.searchFiltersProperties.setPropertiesParameters(searchPage, undefined, undefined, '1000');

    await expect(searchPage.searchFilters.propertiesFilter).toContainText('Properties:  At Least 1000 KB');
    await expect(searchPage.dataTable.getRowByName(fileNamePdfKb)).toBeHidden();
    await expect(searchPage.dataTable.getRowByName(fileNameJpgMb)).toBeVisible();
  });

  test('[C699046-2] Filter by size - At most 1MB', async ({ searchPage }) => {
    await searchPage.searchWithin(randomId, 'files');
    await searchPage.searchFiltersProperties.setPropertiesParameters(searchPage, 'At Most', 'MB', '1');

    await expect(searchPage.searchFilters.propertiesFilter).toContainText('Properties:  At Most 1 MB');
    await expect(searchPage.dataTable.getRowByName(fileNamePdfKb)).toBeVisible();
    await expect(searchPage.dataTable.getRowByName(fileNameJpgMb)).toBeHidden();
  });

  test('[C699046-3] Filter by size - Exactly', async ({ searchPage }) => {
    await searchPage.searchWithin(randomId, 'files');
    await searchPage.searchFiltersProperties.setPropertiesParameters(searchPage, 'Exactly', undefined, '2.96');

    await expect(searchPage.searchFilters.propertiesFilter).toContainText('Properties:  Exactly 2.96 KB');
    await expect(searchPage.dataTable.getRowByName(fileNamePdfKb)).toBeVisible();
    await expect(searchPage.dataTable.getRowByName(fileNameJpgMb)).toBeHidden();
  });

  test('[C699047] Filter by type', async ({ searchPage }) => {
    await searchPage.searchWithin(randomId, 'files');
    await searchPage.searchFiltersProperties.setPropertiesParameters(searchPage, undefined, undefined, undefined, 'pdf');

    await expect(searchPage.searchFilters.propertiesFilter).toContainText('Properties:  pdf');
    await expect(searchPage.dataTable.getRowByName(fileNamePdfKb)).toBeVisible();
    await expect(searchPage.dataTable.getRowByName(fileNameJpgMb)).toBeHidden();
  });
});
