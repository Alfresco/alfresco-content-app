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
import { ApiClientFactory, Utils, test, TrashcanApi, NodesApi, TEST_FILES } from '@alfresco/playwright-shared';

test.describe('Upload files', () => {
  let trashcanApi: TrashcanApi;
  let nodesApi: NodesApi;

  const random = Utils.random();
  const username = `user-${random}`;
  const folder1 = `folder1-${Utils.random()}`;

  test.beforeAll(async () => {
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    trashcanApi = await TrashcanApi.initialize(username, username);
    nodesApi = await NodesApi.initialize(username, username);
    await nodesApi.createFolder(folder1);
  });

  test.beforeEach(async ({ loginPage, personalFiles }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await personalFiles.dataTable.performClickFolderOrFileToOpen(folder1);
    await personalFiles.acaHeader.uploadButton.click();
    await personalFiles.acaHeader.uploadFileButton.click();
    await personalFiles.acaHeader.uploadInput.setInputFiles(TEST_FILES.JPG_FILE.path);
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('Upload a file', async ({ personalFiles }) => {
    const uploadedFiles = await personalFiles.dataTable.isItemPresent(TEST_FILES.JPG_FILE.name);
    expect(uploadedFiles).toBe(true);
  });

  test('[T14752064] Close the upload dialog', async ({ personalFiles }) => {
    await personalFiles.uploadDialog.closeButton.click();
    await personalFiles.uploadDialog.uploadDialog.isHidden();
  });

  test('[T14752051] Minimize / maximize the upload dialog', async ({ personalFiles }) => {
    await personalFiles.uploadDialog.minimizeButton.click();
    await personalFiles.uploadDialog.uploadDialogMinimized.isVisible();
    await personalFiles.uploadDialog.minimizeButton.click();
    await personalFiles.uploadDialog.uploadDialog.isVisible();
  });

  test('[T14752053] Upload history is expunged on browser login/logout', async ({ personalFiles, loginPage }) => {
    await loginPage.logoutUser();
    await loginPage.loginUser({ username, password: username });
    await personalFiles.uploadDialog.uploadDialog.isHidden();
  });

  test('[T14752052] Upload dialog remains fixed in the browser when user performs other actions in parallel', async ({
    personalFiles,
    myLibrariesPage
  }) => {
    await myLibrariesPage.navigate();
    await personalFiles.uploadDialog.uploadDialog.isVisible();
  });
});
