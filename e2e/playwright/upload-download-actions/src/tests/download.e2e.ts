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
import { ApiClientFactory, Utils, test, TrashcanApi, NodesApi } from '@alfresco/playwright-shared';

test.describe('Download from Personal Files', () => {
  let trashcanApi: TrashcanApi;
  let nodesApi: NodesApi;
  let parentId: string;

  const random = Utils.random();
  const username = `user-${random}`;
  const parent = `parent-${random}`;
  const childFile = `childFile-${random}.txt`;
  const childFolder = `childFolder-${random}`;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      trashcanApi = await TrashcanApi.initialize(username, username);
      nodesApi = await NodesApi.initialize(username, username);

      parentId = (await nodesApi.createFolder(parent)).entry.id;
      await nodesApi.createFolder(childFolder, parentId);
      await nodesApi.createFile(childFile, parentId);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('Download a file', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(parent);
    await personalFiles.dataTable.selectItems(childFile);
    const [download] = await Promise.all([personalFiles.page.waitForEvent('download'), personalFiles.acaHeader.downloadButton.click()]);
    expect(download.suggestedFilename()).toBe(childFile);
  });

  test('Download a folder', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(parent);
    await personalFiles.dataTable.selectItems(childFolder);
    const [download] = await Promise.all([personalFiles.page.waitForEvent('download'), personalFiles.acaHeader.downloadButton.click()]);
    const filePath = await download.path();
    expect(await Utils.verifyZipFileContent(filePath, [childFolder])).toBe(true);
  });

  test('Download multiple items', async ({ personalFiles }) => {
    await personalFiles.dataTable.performClickFolderOrFileToOpen(parent);
    await personalFiles.dataTable.selectItems(childFile, childFolder);
    const [download] = await Promise.all([personalFiles.page.waitForEvent('download'), personalFiles.acaHeader.downloadButton.click()]);
    const filePath = await download.path();
    expect(await Utils.verifyZipFileContent(filePath, [childFile, childFolder])).toBe(true);
  });
});
