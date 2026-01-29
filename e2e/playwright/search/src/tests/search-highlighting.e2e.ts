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
import { ApiClientFactory, Utils, test, NodesApi, TrashcanApi, TEST_FILES, FileActionsApi } from '@alfresco/aca-playwright-shared';

test.use({ launchOptions: { slowMo: 500 } });

test.describe('Search Highlighting', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;
  const randomId = Utils.random();
  const username = `user-${randomId}`;
  const fileNameHighlight = `${randomId}-file-name.jpg`;
  const fileDescriptionHighlight = `${randomId}-file-description.jpg`;
  const fileDescription = `highlight`;
  const fileContentHighlight = `${randomId}-file-content.pdf`;
  const fileContent = 'TEXT:Virtual';

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
      fileActionsApi = await FileActionsApi.initialize(username, username);
      await nodesApi.createFile(fileNameHighlight, '-my-');
      await nodesApi.createFile(fileDescriptionHighlight, '-my-', null, fileDescription);
      await fileActionsApi.uploadFileWithRename(TEST_FILES.PDF.path, fileContentHighlight);

      await fileActionsApi.waitForNodesSearchHighlight(fileContentHighlight, { expect: 1 });
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[XAT-17119] Matching phrases should be highlighted in the file name for search results', async ({ searchPage }) => {
    await searchPage.searchWithin(fileNameHighlight, 'files');
    await searchPage.dataTable.progressBarWaitForReload();
    expect(await searchPage.dataTable.hasHighlightedText('name')).toBe(true);
  });

  test('[XAT-17120] Matching phrases should be highlighted in the file description for search results', async ({ searchPage }) => {
    await searchPage.searchWithin(fileDescription, 'files');
    await searchPage.dataTable.progressBarWaitForReload();
    expect(await searchPage.dataTable.hasHighlightedText('description')).toBe(true);
    expect(await searchPage.dataTable.hasHighlightedText('name')).toBe(false);
  });

  test('[XAT-17121] Matching phrases should be highlighted in the file content for search results', async ({ searchPage, personalFiles }) => {
    await personalFiles.navigate();
    await searchPage.searchWithin(fileContent, 'files');
    await searchPage.dataTable.progressBarWaitForReload();
    expect(await searchPage.dataTable.hasHighlightedText('content')).toBe(true);
    expect(await searchPage.dataTable.hasHighlightedText('name')).toBe(false);
  });
});
