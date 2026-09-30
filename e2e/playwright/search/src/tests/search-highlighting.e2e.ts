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

import { expect } from '@playwright/test';
import { ApiClientFactory, Utils, test, NodesApi, TrashcanApi, FileActionsApi, SearchApi } from '@alfresco/aca-playwright-shared';

test.use({ launchOptions: { slowMo: 500 } });

test.describe('Search Highlighting', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;
  let searchApi: SearchApi;
  const username = `user-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      fileActionsApi = await FileActionsApi.initialize(username, username);
      searchApi = await SearchApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed: ${JSON.stringify(error)}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.describe('Search Highlighting - XAT-17119', () => {
    const randomId17119 = Utils.random();
    const fileNameHighlight17199 = `${randomId17119}-file-name.jpg`;

    test.beforeAll(async () => {
      try {
        await nodesApi.createFile(fileNameHighlight17199, '-my-');
        await searchApi.waitFileForSearchIndexing(fileNameHighlight17199);
      } catch (error) {
        console.error(`XAT-17119 - beforeAll failed: ${JSON.stringify(error)}`);
      }
    });

    test('[XAT-17119] Matching phrases should be highlighted in the file name for search results', async ({ searchPage }) => {
      await searchPage.searchWithin(randomId17119, 'files');
      expect(await searchPage.dataTable.hasHighlightedText('name')).toBe(true);
    });
  });

  test.describe('Search Highlighting - XAT-17120', () => {
    const randomId17120 = Utils.random();
    const fileDescription17120 = `${Utils.random(10)}`;
    const fileDescriptionHighlight17120 = `${randomId17120}-file-description.jpg`;

    test.beforeAll(async () => {
      try {
        await nodesApi.createFile(fileDescriptionHighlight17120, '-my-', undefined, fileDescription17120);
        await searchApi.waitFileForSearchIndexing(fileDescriptionHighlight17120);
      } catch (error) {
        console.error(`XAT-17120 - beforeAll failed: ${JSON.stringify(error)}`);
      }
    });

    test('[XAT-17120] Matching phrases should be highlighted in the file description for search results', async ({ searchPage }) => {
      await searchPage.searchWithin(fileDescription17120, 'files');
      expect(await searchPage.dataTable.hasHighlightedText('description')).toBe(true);
      expect(await searchPage.dataTable.hasHighlightedText('name')).toBe(false);
    });
  });

  test.describe('Search Highlighting - XAT-17121', () => {
    const randomId17121 = Utils.random();
    const fileContentHighlight17121 = `${randomId17121}-file-content.txt`;
    const fileContent17121 = `${Utils.random(10)}`;

    test.beforeAll(async () => {
      try {
        const contentFileId = (await nodesApi.createFile(fileContentHighlight17121, '-my-')).entry.id;
        await fileActionsApi.updateNodeContent(contentFileId, fileContent17121);
        await searchApi.waitFileForSearchIndexing(fileContentHighlight17121);
        await searchApi.waitForContentIndexing(fileContent17121, fileContentHighlight17121);
      } catch (error) {
        console.error(`XAT-17121 - beforeAll failed: ${JSON.stringify(error)}`);
      }
    });

    test('[XAT-17121] Matching phrases should be highlighted in the file content for search results', async ({ searchPage, personalFiles }) => {
      await personalFiles.navigate();
      await searchPage.searchWithin(`${fileContent17121}`, 'files');
      await searchPage.spinnerWaitForReload();
      expect(await searchPage.dataTable.hasHighlightedText('content')).toBe(true);
      expect(await searchPage.dataTable.hasHighlightedText('name')).toBe(false);
    });
  });
});
