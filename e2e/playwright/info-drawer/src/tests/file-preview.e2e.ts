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
import { ApiClientFactory, test, TrashcanApi, NodesApi, FileActionsApi, TEST_FILES, Utils } from '@alfresco/aca-playwright-shared';

test.describe('File preview', () => {
  const timestamp = new Date().getTime();
  const username = `user1-${timestamp}`;
  const fileName = `file1-${timestamp}.pdf`;
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
      await fileActionsApi.uploadFileWithRename(TEST_FILES.PDF.path, fileName, '-my-');
      await fileActionsApi.waitForNodes(fileName, { expect: 1 });
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

  test('[XAT-17780] Can open viewer while the info drawer is opened', async ({ personalFiles }) => {
    await personalFiles.navigate();
    await Utils.reloadPageIfRowNotVisible(personalFiles, fileName);
    await personalFiles.dataTable.getRowByName(fileName).click();
    await personalFiles.acaHeader.viewButton.click();
    await expect(personalFiles.viewer.pdfViewerContentPages.first()).toBeVisible();
    expect(await personalFiles.viewer.viewerDocument.textContent()).toContain('PDF');
  });
});
