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

import { expect } from '@playwright/test';
import {
  ApiClientFactory,
  Utils,
  test,
  TrashcanApi,
  NodesApi,
  FileActionsApi,
  TEST_FILES,
  SearchPage,
  SortByDirection,
  SortByType
} from '@alfresco/aca-playwright-shared';

test.use({ launchOptions: { slowMo: 500 } });

test.describe('Search sorting', () => {
  const random = Utils.random();

  const user1 = `user1-${random}`;
  const user2 = `user2-${random}`;

  const parent = `parent-search-${random}`;
  let parentId: string;

  const fileJpg = {
    name: `search-sort-${random}-file-1.jpg`,
    source: TEST_FILES.JPG_FILE.path
  };

  const filePdf = {
    name: `search-sort-${random}-file-2.pdf`,
    title: 'search sort title',
    description: 'search-sort-${random}-file',
    source: TEST_FILES.PDF.path
  };

  const fileJpgBudget = {
    name: `budget.xls`,
    source: TEST_FILES.XLSX.path
  };

  let nodesApi1: NodesApi;
  let trashcanApi1: TrashcanApi;
  let fileActionsApi1: FileActionsApi;
  let nodesApi2: NodesApi;
  let trashcanApi2: TrashcanApi;
  let fileActionsApi2: FileActionsApi;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username: user1 });
      await apiClientFactory.createUser({ username: user2 });
      nodesApi1 = await NodesApi.initialize(user1, user1);
      trashcanApi1 = await TrashcanApi.initialize(user1, user1);
      fileActionsApi1 = await FileActionsApi.initialize(user1, user1);
      nodesApi2 = await NodesApi.initialize(user2, user2);
      trashcanApi2 = await TrashcanApi.initialize(user2, user2);
      fileActionsApi2 = await FileActionsApi.initialize(user2, user2);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }

    parentId = (await nodesApi1.createFolder(parent)).entry.id;

    await nodesApi1.setGranularPermission(parentId, user2, 'Collaborator', true);

    await fileActionsApi1.uploadFileWithRename(fileJpg.source, fileJpg.name, parentId);
    await fileActionsApi2.uploadFileWithRename(filePdf.source, filePdf.name, parentId, filePdf.title, filePdf.description);
    await fileActionsApi1.uploadFileWithRename(fileJpgBudget.source, fileJpgBudget.name, parentId);

    await fileActionsApi1.waitForNodes(fileJpg.name, { expect: 1 });
    await fileActionsApi2.waitForNodes(filePdf.name, { expect: 1 });
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, user1, user1, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi1, trashcanApi1, 'afterAll failed');
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi2, trashcanApi2, 'afterAll failed');
  });

  async function testSearchSorting(
    searchPage: SearchPage,
    sortBy: SortByType,
    sortOrder: SortByDirection,
    expectedFirstFile: string,
    expectedSecondFile: string,
    searchTerm?: string
  ) {
    if (searchTerm) {
      await searchPage.searchWithin(searchTerm, 'files');
    } else {
      await searchPage.searchWithin(`*${random}*`, 'files');
    }
    await searchPage.searchSortingPicker.sortBy(sortBy, sortOrder);
    await searchPage.dataTable.progressBarWaitForReload();
    expect(await searchPage.dataTable.getNthRow(0).textContent()).toContain(expectedFirstFile);
    expect(await searchPage.dataTable.getNthRow(1).textContent()).toContain(expectedSecondFile);
  }

  test(`[XAT-5568] Sort by Name`, async ({ searchPage }) => {
    await testSearchSorting(searchPage, 'Name' as SortByType, 'asc', fileJpg.name, filePdf.name);
  });

  test(`[XAT-5573] Sort by Type`, async ({ searchPage }) => {
    await testSearchSorting(searchPage, 'Type' as SortByType, 'asc', filePdf.name, fileJpg.name);
  });

  test(`[XAT-5572] Sort by Size`, async ({ searchPage }) => {
    await testSearchSorting(searchPage, 'Size' as SortByType, 'asc', filePdf.name, fileJpg.name);
  });

  test(`[XAT-5570] Sort by Created date`, async ({ searchPage }) => {
    await testSearchSorting(searchPage, 'Created date' as SortByType, 'asc', fileJpg.name, filePdf.name);
  });

  test(`[XAT-5571] Sort by Modified date`, async ({ searchPage }) => {
    const budgetFileOld = 'budget.xls ( Web Site Design - Budget )';
    const budgetFileNew = 'budget.xls';
    await testSearchSorting(searchPage, 'Modified date' as SortByType, 'asc', budgetFileOld, budgetFileNew, budgetFileNew);
  });

  test(`[XAT-5567] Sort by Relevance`, async ({ searchPage }) => {
    await testSearchSorting(searchPage, 'Relevance' as SortByType, 'asc', fileJpg.name, filePdf.name);
  });

  test(`[XAT-5569] Sort by Modifier`, async ({ searchPage }) => {
    await testSearchSorting(searchPage, 'Modifier' as SortByType, 'asc', fileJpg.name, filePdf.name);
  });

  test('[XAT-5566] Sorting options are displayed', async ({ searchPage }) => {
    await searchPage.searchWithin(`search-sort *${random}`, 'files');
    await searchPage.searchSortingPicker.actionMenu.click();

    expect(await searchPage.searchSortingPicker.isSortOrderButtonDisplayed()).toBe(true);

    await searchPage.searchSortingPicker.clickSortByDropdown();

    const expectedOptions = ['Relevance', 'Filename', 'Title', 'Modified date', 'Modifier', 'Created date', 'Size', 'Type'];
    expectedOptions.sort((a, b) => a.localeCompare(b));
    const optionListed = await searchPage.searchSortingPicker.getSortByOptionsList();
    expect(optionListed).toEqual(expectedOptions);
  });
});
