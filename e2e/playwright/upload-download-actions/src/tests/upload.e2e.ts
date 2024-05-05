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
import { ApiClientFactory, Utils, test, TrashcanApi, NodesApi, FileActionsApi, TEST_FILES } from '@alfresco/playwright-shared';

test.describe.only('Download from Personal Files', () => {
  let fileActionsApi: FileActionsApi;
  let trashcanApi: TrashcanApi;
  let nodesApi: NodesApi;
  // let searchApi: SearchPageApi;
  // let sharedLinksApi: SharedLinksApi;
  // let favoritesApi: FavoritesPageApi;

  const random = Utils.random();
  const username = `user-${random}`;
  const fileName = `file-${random}.docx`;

  const folder1 = `folder1-${Utils.random()}`;
  let folder1Id: string;

  test.beforeAll(async () => {
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    fileActionsApi = await FileActionsApi.initialize(username, username);
    trashcanApi = await TrashcanApi.initialize(username, username);
    nodesApi = await NodesApi.initialize(username, username);
    // searchApi = await SearchPageApi.initialize(username, username);
    // sharedLinksApi = await SharedLinksApi.initialize(username, username);
    // favoritesApi = await FavoritesPageApi.initialize(username, username);

    folder1Id = (await nodesApi.createFolder(folder1)).entry.id;
  });

  test.beforeEach(async ({ loginPage, personalFiles }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');

    // await personalFiles.acaHeader.uploadButton.click();
    // await personalFiles.acaHeader.uploadFileButton.click();
    await fileActionsApi.uploadFile(TEST_FILES.DOCX.path, fileName, folder1Id);
    await personalFiles.dataTable.performClickFolderOrFileToOpen(folder1);

    // Select the file input element
    // const fileInput = await personalFiles.page.$('input[type="file"]');
    // //await personalFiles.page.pause();
    // // Set the file input value to the path of the file you want to upload
    // await fileInput.setInputFiles(`${__dirname}/upload-file.e2e.ts`);
    // //await personalFiles.page.pause();
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('Upload a file', async ({ personalFiles }) => {
    const uploadedFiles = await personalFiles.dataTable.isItemPresent(fileName);
    expect(uploadedFiles).toBe(true);
  });
});
// import { AdminActions, LoginPage, BrowsingPage, RepoClient, Utils, UserActions } from '@alfresco/aca-testing-shared';

// describe('Upload files', () => {
//   const username = `user-${Utils.random()}`;

//   const folder1 = `folder1-${Utils.random()}`;
//   let folder1Id: string;

//   const apis = {
//     user: new RepoClient(username, username)
//   };

//   const loginPage = new LoginPage();
//   const page = new BrowsingPage();
//   const { dataTable } = page;

//   const adminApiActions = new AdminActions();
//   const userActions = new UserActions();

//   beforeAll(async () => {
//     await adminApiActions.createUser({ username });
//     await userActions.login(username, username);

//     folder1Id = await apis.user.createFolder(folder1);

//     await loginPage.loginWith(username);
//   });

//   beforeEach(async () => {
//     await page.clickPersonalFilesAndWait();
//     await dataTable.doubleClickOnRowByName(folder1);
//     await page.toolbar.openUploadMenu();
//     await page.toolbar.menu.uploadFilesInput.sendKeys(`${__dirname}/upload-file.test.ts`);
//     await page.toolbar.closeUploadMenu();
//     await page.uploadFilesDialog.uploadDialog.isVisible();
//   });

//   afterAll(async () => {
//     await apis.user.nodes.deleteNodeById(folder1Id);
//   });

//   it('Upload a file', async () => {
//     const uploadedFiles = await dataTable.isItemPresent('upload-file.test.ts');
//     expect(uploadedFiles).toBe(true, 'file not uploaded');
//   });

//   it('[T14752064] Close the upload dialog ', async () => {
//     await page.uploadFilesDialog.closeUploadButton.click();
//     await page.uploadFilesDialog.uploadDialog.isPresent();
//     expect(await page.uploadFilesDialog.uploadDialog.isVisible()).toBe(false);
//   });

//   it('[T14752051] Minimize / maximize the upload dialog ', async () => {
//     await page.uploadFilesDialog.minimizeButton.click();
//     expect(await page.uploadFilesDialog.uploadedFiles.waitNotVisible()).toBe(true);

//     await page.uploadFilesDialog.maximizeButton.click();
//     expect(await page.uploadFilesDialog.uploadedFiles.waitVisible()).toBe(true);
//   });

//   it('[T14752053] Upload history is expunged on browser login/logout ', async () => {
//     await page.signOut();
//     await loginPage.loginWith(username);
//     const isUploadDialogVisible = await page.uploadFilesDialog.uploadDialog.isVisible();

//     expect(isUploadDialogVisible).toBe(false);
//   });

//   it('[T14752052] Upload dialog remains fixed in the browser when user performs other actions in parallel ', async () => {
//     expect(page.uploadFilesDialog.uploadDialog.isVisible()).toBe(true);
//     await page.clickPersonalFiles();
//     expect(page.uploadFilesDialog.uploadDialog.isVisible()).toBe(true);
//   });
// });
