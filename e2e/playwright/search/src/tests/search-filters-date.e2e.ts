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
  const getCurrentAndPreviousDay = Utils.getCurrentAndPreviousDay();

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
      await fileActionsApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, fileNameJpgMb, '-my-');
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[C699048] [C699049] Filter by date - Changing tabs', async ({ searchPage }) => {
    await searchPage.acaHeader.searchButton.click();
    await searchPage.searchFilters.dateFilter.click();
    await searchPage.searchFiltersDate.betweenButton.click();
    await expect(searchPage.searchFiltersDate.betweenRadioButton).toBeChecked();
    await expect(searchPage.searchFiltersDate.modifiedTabTitle).toHaveCSS('color', 'rgba(0, 0, 0, 0.54)');
    await searchPage.searchFiltersDate.openCreatedModifiedTab(searchPage, 'Modified');

    await expect(searchPage.searchFiltersDate.anytimeRadioButton).toBeChecked();
    await expect(searchPage.searchFiltersDate.modifiedTabTitle).toHaveCSS('color', 'rgb(33, 33, 33)');
    await searchPage.searchFiltersDate.openCreatedModifiedTab(searchPage, 'Created');

    await expect(searchPage.searchFiltersDate.betweenRadioButton).toBeChecked();
    await expect(searchPage.searchFiltersDate.createdTabTitle).toHaveCSS('color', 'rgb(33, 33, 33)');
  });

  test('[C699048] Filter by date - Created anytime', async ({ searchPage }) => {
    await searchPage.searchFiltersDate.filterFilesByDate(searchPage, 'anytime', 'Created', randomId, 'files', 2);
  });

  test('[C699049] Filter by date - Modified anytime', async ({ searchPage }) => {
    await searchPage.searchFiltersDate.filterFilesByDate(searchPage, 'anytime', 'Modified', randomId, 'files', 2);
  });

  test('[C699048] Filter by date - Created in the last', async ({ searchPage }) => {
    await searchPage.searchFiltersDate.filterFilesByDate(searchPage, 'inTheLast', 'Created', randomId, 'files', 2, '1');
  });

  test('[C699049] Filter by date - Modified in the last', async ({ searchPage }) => {
    await searchPage.searchFiltersDate.filterFilesByDate(searchPage, 'inTheLast', 'Modified', randomId, 'files', 2, '1');
  });

  test('[C699048] Filter by date - Created between', async ({ searchPage }) => {
    await searchPage.searchFiltersDate.filterFilesByDate(
      searchPage,
      'between',
      'Created',
      randomId,
      'files',
      2,
      '1',
      getCurrentAndPreviousDay.previousDate,
      getCurrentAndPreviousDay.currentDate
    );
  });

  test('[C699049] Filter by date - Modified between', async ({ searchPage }) => {
    await searchPage.searchFiltersDate.filterFilesByDate(
      searchPage,
      'between',
      'Modified',
      randomId,
      'files',
      2,
      '1',
      getCurrentAndPreviousDay.previousDate,
      getCurrentAndPreviousDay.currentDate
    );
  });
});
