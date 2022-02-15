/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { AdminActions, LoginPage, BrowsingPage, RepoClient, Utils } from '@alfresco/aca-testing-shared';

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

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });
    folder1Id = (await apis.user.nodes.createFolder(folder1)).entry.id;

    await loginPage.loginWith(username);
    done();
  });

  beforeEach(async (done) => {
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(folder1);
    await page.sidenav.openNewMenu();
    await page.sidenav.menu.uploadFilesInput.sendKeys(`${__dirname}/upload-file.test.ts`);
    await page.sidenav.closeNewMenu();
    await page.uploadFilesDialog.uploadDialog.isVisible();
    done();
  });

  afterAll(async () => {
    await apis.user.nodes.deleteNodeById(folder1Id);
  });

  it('Upload a file', async () => {
    const uploadedFiles = await dataTable.isItemPresent('upload-file.test.ts');
    expect(uploadedFiles).toBe(true, 'file not uploaded');
  });

  it('[T14752064] Close the upload dialog ', async () => {
    await page.uploadFilesDialog.closeUploadButton.click();
    await page.uploadFilesDialog.uploadDialog.isPresent();
    await expect(await page.uploadFilesDialog.uploadDialog.isVisible()).toBe(false);
  });

  it('[T14752051] Minimize / maximize the upload dialog ', async () => {
    await page.uploadFilesDialog.minimizeButton.click();
    await expect(await page.uploadFilesDialog.uploadedFiles.waitNotVisible()).toBe(true);

    await page.uploadFilesDialog.maximizeButton.click();
    await expect(await page.uploadFilesDialog.uploadedFiles.waitVisible()).toBe(true);
  });

  it('[T14752053] Upload history is expunged on browser login/logout ', async () => {
    await page.signOut();
    await loginPage.loginWith(username);
    const isUploadDialogVisible = await page.uploadFilesDialog.uploadDialog.isVisible();

    await expect(isUploadDialogVisible).toBe(false);
  });

  it('[T14752052] Upload dialog remains fixed in the browser when user performs other actions in parallel ', async () => {
    await expect(page.uploadFilesDialog.uploadDialog.isVisible()).toBe(true);
    await page.clickPersonalFiles();
    await expect(page.uploadFilesDialog.uploadDialog.isVisible()).toBe(true);
  });
});
