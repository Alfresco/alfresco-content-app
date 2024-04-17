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
import { ApiClientFactory, Utils, test, NodesApi, TrashcanApi, FileActionsApi, TEST_FILES, CategoriesApi } from '@alfresco/playwright-shared';
import { CategoryLinkBody, CategoryPaging, CategoryEntry } from '@alfresco/js-api';

test.describe('Search - Filters - Categories', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let categoriesApi: CategoriesApi;
  let categoryData: CategoryPaging | CategoryEntry;
  let categoryId: string;

  const randomId = Utils.random();
  const username = `user-${randomId}`;
  const fileNamePdf = `${randomId}-fileNameKb.pdf`;
  const fileNameJpg = `${randomId}-fileNameMb.jpg`;

  const newSubcategories = [{ name: 'e2e' }];

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
      categoriesApi = await CategoriesApi.initialize('admin');
      const fileActionsApi = await FileActionsApi.initialize(username, username);
      await fileActionsApi.uploadFileWithRename(TEST_FILES.PDF.path, fileNamePdf, '-my-');
      const jpgFileId = (await fileActionsApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, fileNameJpg, '-my-')).entry.id;
      categoryData = await categoriesApi.createCategory('-root-', newSubcategories);
      if (categoryData instanceof CategoryEntry) {
        categoryId = categoryData.entry.id;
        const categoryLinkBodyCreate: CategoryLinkBody[] = [{ categoryId: categoryData.entry.id }];
        await categoriesApi.linkNodeToCategory(jpgFileId, categoryLinkBodyCreate);
      }
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    await categoriesApi.deleteCategory(categoryId);
  });

  test('[C699498] Filter by categories', async ({ searchPage }) => {
    await searchPage.searchWithin(randomId, 'files');
    await searchPage.searchFilters.categoriesFilter.click();
    await searchPage.searchFiltersCategories.addOptionInput.fill(newSubcategories[0].name);
    await searchPage.searchFilters.dropdownOptions.first().click();
    await searchPage.searchFilters.menuCardApply.click();

    await expect(searchPage.dataTable.getRowByName(fileNamePdf)).toBeHidden();
    await expect(searchPage.dataTable.getRowByName(fileNameJpg)).toBeVisible();
  });
});
