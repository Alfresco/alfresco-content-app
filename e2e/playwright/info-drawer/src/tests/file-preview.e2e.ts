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

import { expect, Page } from '@playwright/test';
import { ApiClientFactory, test, TrashcanApi, NodesApi, FileActionsApi, TEST_FILES, Utils } from '@alfresco/playwright-shared';

test.describe('File preview', () => {
  const timestamp = new Date().getTime();
  const username = `user1-${timestamp}`;
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      fileActionsApi = await FileActionsApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  async function checkFileContent(page: Page, pageNumber: number, text: string): Promise<void> {
    const allPages = page.locator('.canvasWrapper > canvas').first();
    const pageLoaded = page.locator(`div[data-page-number="${pageNumber}"][data-loaded="true"]`);
    const textLayerLoaded = page.locator(`div[data-page-number="${pageNumber}"] .textLayer`);
    const specificText = textLayerLoaded.textContent();

    await expect(allPages).toBeVisible();
    await expect(pageLoaded).toBeVisible();
    await expect(textLayerLoaded).toBeVisible();
    expect(await specificText).toContain(text);
  }

  test('[C595967] Should preview document from the info drawer', async ({ personalFiles }) => {
    const fileName = `file1-${timestamp}.pdf`;
    await fileActionsApi.uploadFileWithRename(TEST_FILES.PDF.path, fileName, '-my-');
    await fileActionsApi.waitForNodes(fileName, { expect: 1 });
    await personalFiles.navigate();
    await Utils.reloadPageIfRowNotVisible(personalFiles, fileName);
    await personalFiles.dataTable.getRowByName(fileName).click();
    await personalFiles.acaHeader.viewButton.click();
    await checkFileContent(personalFiles.page, 1, 'This is a small demonstration');
  });
});
