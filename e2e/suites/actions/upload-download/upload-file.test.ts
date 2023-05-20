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

import { AdminActions, LoginPage, BrowsingPage, RepoClient, Utils, UserActions } from '@alfresco/aca-testing-shared';

describe('Upload files', () => {
  const username = `user-${Utils.random()}`;

  const folder1 = `folder1-${Utils.random()}`;
  let folder1Id: string;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });
    await userActions.login(username, username);

    folder1Id = await apis.user.createFolder(folder1);

    await loginPage.loginWith(username);
  });

  beforeEach(async () => {
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(folder1);
    await page.toolbar.openUploadMenu();
    await page.toolbar.menu.uploadFilesInput.sendKeys(`${__dirname}/upload-file.test.ts`);
    await page.toolbar.closeUploadMenu();
    await page.uploadFilesDialog.uploadDialog.isVisible();
  });

  afterAll(async () => {
    await userActions.deleteNodes([folder1Id]);
  });

  it('Upload a file', async () => {
    const uploadedFiles = await dataTable.isItemPresent('upload-file.test.ts');
    expect(uploadedFiles).toBe(true, 'file not uploaded');
  });

  it('[T14752064] Close the upload dialog ', async () => {
    await page.uploadFilesDialog.closeUploadButton.click();
    await page.uploadFilesDialog.uploadDialog.isPresent();
    expect(await page.uploadFilesDialog.uploadDialog.isVisible()).toBe(false);
  });

  it('[T14752051] Minimize / maximize the upload dialog ', async () => {
    await page.uploadFilesDialog.minimizeButton.click();
    expect(await page.uploadFilesDialog.uploadedFiles.waitNotVisible()).toBe(true);

    await page.uploadFilesDialog.maximizeButton.click();
    expect(await page.uploadFilesDialog.uploadedFiles.waitVisible()).toBe(true);
  });

  it('[T14752053] Upload history is expunged on browser login/logout ', async () => {
    await page.signOut();
    await loginPage.loginWith(username);
    const isUploadDialogVisible = await page.uploadFilesDialog.uploadDialog.isVisible();

    expect(isUploadDialogVisible).toBe(false);
  });

  it('[T14752052] Upload dialog remains fixed in the browser when user performs other actions in parallel ', async () => {
    expect(page.uploadFilesDialog.uploadDialog.isVisible()).toBe(true);
    await page.clickPersonalFiles();
    expect(page.uploadFilesDialog.uploadDialog.isVisible()).toBe(true);
  });
});
