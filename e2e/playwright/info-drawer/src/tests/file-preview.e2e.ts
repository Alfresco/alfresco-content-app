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
import { ApiClientFactory, test, TrashcanApi, NodesApi, UploadApi, SearchApi, TEST_FILES, Utils } from '@alfresco/aca-playwright-shared';

test.describe('File preview', () => {
  const timestamp = new Date().getTime();
  const username = `user1-${timestamp}`;
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let uploadApi: UploadApi;
  let searchApi: SearchApi;

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      uploadApi = await UploadApi.initialize(username, username);
      searchApi = await SearchApi.initialize(username, username);
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

  test.describe('File preview - Personal Files', () => {
    const file17780 = `file1-${timestamp}.pdf`;

    test.beforeAll(async () => {
      try {
        await uploadApi.uploadFileWithRename(TEST_FILES.PDF.path, file17780, '-my-');
        await searchApi.waitForNodes(file17780, { expect: 1 });
      } catch (error) {
        console.error(`beforeAll failed : ${error}`);
      }
    });

    test('[XAT-17780] Can open viewer while the info drawer is opened', async ({ personalFiles }) => {
      await personalFiles.navigate();
      await Utils.reloadPageIfRowNotVisible(personalFiles, file17780);
      await personalFiles.dataTable.getRowByName(file17780).click();
      await personalFiles.acaHeader.viewButton.click();
      await personalFiles.viewer.waitForViewerToOpen();
      await personalFiles.viewer.waitForViewerContentToRender('document');
      await expect(personalFiles.viewer.pdfViewerContentPages.first()).toBeVisible();
      expect(await personalFiles.viewer.viewerDocument.textContent()).toContain('PDF');
    });
  });

  test.describe('File preview - Search Page', () => {
    const file20360 = `file1-${timestamp}.jpg`;

    test.beforeAll(async () => {
      try {
        await uploadApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, file20360, '-my-');
        await searchApi.waitForNodes(file20360, { expect: 1 });
      } catch (error) {
        console.error(`beforeAll failed : ${error}`);
      }
    });

    test('[XAT-20360] Search Results - Preview icon opens viewer in the info drawer', async ({ searchPage }) => {
      await searchPage.navigate();
      await searchPage.searchWithin(file20360);
      await searchPage.dataTable.getRowByName(file20360).click();
      await searchPage.acaHeader.viewDetails.click();
      await searchPage.infoDrawer.viewerButton.click();
      await searchPage.viewer.waitForViewerToOpen();
      await expect(searchPage.viewer.viewDetailsButton).toBeVisible();
      await expect(searchPage.dataTable.getRowByName(file20360)).toBeVisible();
    });
  });
});
