/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ApiClientFactory, test, TrashcanApi, NodesApi, FileActionsApi, TEST_FILES } from '@alfresco/playwright-shared';

test.describe('File preview', () => {
  const timestamp = new Date().getTime();
  const username = `user1-${timestamp}`;
  const fileName = `file1-${timestamp}.pdf`;
  const apiClientFactory = new ApiClientFactory();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;

  test.beforeAll(async () => {
    try {
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
    try {
      await loginPage.loginUser({ username, password: username }, { withNavigation: true, waitForLoading: true });
    } catch (error) {
      console.error(`Main beforeEach failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    try {
      await nodesApi.deleteCurrentUserNodes();
      await trashcanApi.emptyTrashcan();
    } catch (error) {
      console.error(`Main afterAll failed: ${error}`);
    }
  });

  async function checkFileContent(page: Page, pageNumber: string, text: string): Promise<void> {
    const allPages = page.locator('.canvasWrapper > canvas').first();
    const pageLoaded = page.locator(`div[data-page-number="${pageNumber}"][data-loaded="true"]`);
    const textLayerLoaded = page.locator(`div[data-page-number="${pageNumber}"] .textLayer`);
    const specificText = page.locator(`div[data-page-number="${pageNumber}"] .textLayer`).textContent();

    await expect(allPages).toBeVisible();
    await expect(pageLoaded).toBeVisible();
    await expect(textLayerLoaded).toBeVisible();
    expect(await specificText).toContain(text);
  }

  test('[C595967] Should preview document from the info drawer', async ({ personalFiles }) => {
    await fileActionsApi.uploadFileWithRename(TEST_FILES.PDF.path, fileName, '-my-');
    await fileActionsApi.waitForNodes(fileName, { expect: 1 });
    await personalFiles.navigate();
    const pageNumber = '1';
    const documentText = 'This is a small demonstration';
    await personalFiles.dataTable.getRowByName(fileName).click();
    await personalFiles.acaHeader.viewButton.click();
    await checkFileContent(personalFiles.page, pageNumber, documentText);
  });
});
