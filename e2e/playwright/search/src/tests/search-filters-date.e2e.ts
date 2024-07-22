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

test.describe('Search - Filters - Date', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;

  const randomId = Utils.random();
  const username = `user-${randomId}`;
  const fileNamePdfKb = `${randomId}-fileNamePdf.pdf`;
  const fileNameJpgMb = `${randomId}-fileNameJpg.jpg`;
  const currentAndPreviousDay = Utils.getCurrentAndPreviousDay();

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      trashcanApi = await TrashcanApi.initialize(username, username);
      nodesApi = await NodesApi.initialize(username, username);
      const fileActionsApi = await FileActionsApi.initialize(username, username);
      await fileActionsApi.uploadFileWithRename(TEST_FILES.PDF.path, fileNamePdfKb, '-my-');
      await fileActionsApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, fileNameJpgMb, '-my-');
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[C699048-1] [C699049-1] Filter by date - Changing tabs', async ({ searchPage }) => {
    await searchPage.acaHeader.searchButton.click();
    await searchPage.searchFilters.dateFilter.click();
    await searchPage.searchFiltersDate.betweenButton.click();
    await expect(searchPage.searchFiltersDate.betweenRadioButton).toBeChecked();
    expect(await searchPage.searchFiltersDate.isModifiedTabSelected()).toBe('false');
    await searchPage.searchFiltersDate.openCreatedModifiedTab(searchPage, 'Modified');

    await expect(searchPage.searchFiltersDate.anytimeRadioButton).toBeChecked();
    expect(await searchPage.searchFiltersDate.isModifiedTabSelected()).toBe('true');
    await searchPage.searchFiltersDate.openCreatedModifiedTab(searchPage, 'Created');

    await expect(searchPage.searchFiltersDate.betweenRadioButton).toBeChecked();
    expect(await searchPage.searchFiltersDate.isSearchTabSelected()).toBe('true');
  });

  test('[C699048-2] Filter by date - Created anytime', async ({ searchPage }) => {
    await searchPage.searchFiltersDate.filterFilesByDate({
      searchPage,
      filterType: 'anytime',
      dateFilterTab: 'Created',
      searchPhrase: randomId,
      searchType: 'files',
      expectSearchResults: 2
    });
  });

  test('[C699049-2] Filter by date - Modified anytime', async ({ searchPage }) => {
    await searchPage.searchFiltersDate.filterFilesByDate({
      searchPage,
      filterType: 'anytime',
      dateFilterTab: 'Modified',
      searchPhrase: randomId,
      searchType: 'files',
      expectSearchResults: 2
    });
  });

  test('[C699048-3] Filter by date - Created in the last', async ({ searchPage }) => {
    await searchPage.searchFiltersDate.filterFilesByDate({
      searchPage,
      filterType: 'inTheLast',
      dateFilterTab: 'Created',
      searchPhrase: randomId,
      searchType: 'files',
      expectSearchResults: 2,
      inTheLastInputValue: '1'
    });
  });

  test('[C699049-3] Filter by date - Modified in the last', async ({ searchPage }) => {
    await searchPage.searchFiltersDate.filterFilesByDate({
      searchPage,
      filterType: 'inTheLast',
      dateFilterTab: 'Modified',
      searchPhrase: randomId,
      searchType: 'files',
      expectSearchResults: 2,
      inTheLastInputValue: '1'
    });
  });

  test('[C699048-4] Filter by date - Created between', async ({ searchPage }) => {
    await searchPage.searchFiltersDate.filterFilesByDate({
      searchPage,
      filterType: 'between',
      dateFilterTab: 'Created',
      searchPhrase: randomId,
      searchType: 'files',
      expectSearchResults: 2,
      inTheLastInputValue: '1',
      startDay: currentAndPreviousDay.previousDate,
      endDay: currentAndPreviousDay.currentDate
    });
  });

  test('[C699049-4] Filter by date - Modified between', async ({ searchPage }) => {
    await searchPage.searchFiltersDate.filterFilesByDate({
      searchPage,
      filterType: 'between',
      dateFilterTab: 'Modified',
      searchPhrase: randomId,
      searchType: 'files',
      expectSearchResults: 2,
      inTheLastInputValue: '1',
      startDay: currentAndPreviousDay.previousDate,
      endDay: currentAndPreviousDay.currentDate
    });
  });
});
