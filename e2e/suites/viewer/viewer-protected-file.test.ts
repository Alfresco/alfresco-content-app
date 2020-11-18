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

import { AdminActions, LoginPage, BrowsingPage, FILES, RepoClient, Utils, Viewer, PasswordDialog } from '@alfresco/aca-testing-shared';
import { BrowserActions } from '@alfresco/adf-testing';

describe('Viewer - password protected file', () => {
  const username = `user-${Utils.random()}`;

  const parent = `parent-${Utils.random()}`;
  let parentId: string;

  const protectedFile = FILES.protectedFile;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const viewer = new Viewer();
  const passwordDialog = new PasswordDialog();
  const adminApiActions = new AdminActions();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });
    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    await apis.user.upload.uploadFile(protectedFile.name, parentId);

    await loginPage.loginWith(username);
  });

  beforeEach(async () => {
    await page.header.expandSideNav();
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(parent);
    await dataTable.waitForHeader();
    await dataTable.doubleClickOnRowByName(protectedFile.name);
    await viewer.waitForViewerToOpen();
    await passwordDialog.waitForDialogToOpen();
  });

  afterEach(async () => {
    await page.closeOpenDialogs();
    await Utils.pressEscape();
  });

  afterAll(async () => {
    await apis.user.nodes.deleteNodeById(parentId);
  });

  it('[C268958] Password dialog appears when opening a protected file', async () => {
    expect(await passwordDialog.isDialogOpen()).toBe(true, 'Password dialog not open');
    expect(await passwordDialog.isPasswordInputDisplayed()).toBe(true, 'Password input not displayed');
    expect(await passwordDialog.isSubmitEnabled()).toBe(false, 'Submit button not disabled');
    expect(await passwordDialog.isCloseEnabled()).toBe(true, 'Close button not enabled');
    expect(await viewer.isPdfViewerContentDisplayed()).toBe(false, 'file content is displayed');
  });

  it('[C268959] File content is displayed when entering the correct password', async () => {
    await passwordDialog.enterPassword(protectedFile.password);
    expect(await passwordDialog.isSubmitEnabled()).toBe(true, 'Submit button not enabled');

    await BrowserActions.click(passwordDialog.submitButton);
    await passwordDialog.waitForDialogToClose();

    expect(await viewer.isPdfViewerContentDisplayed()).toBe(true, 'file content not displayed');
  });

  it('[C268960] Error appears when entering an incorrect password', async () => {
    await passwordDialog.enterPassword('incorrect');
    expect(await passwordDialog.isSubmitEnabled()).toBe(true, 'Submit button not enabled');
    await BrowserActions.click(passwordDialog.submitButton);

    expect(await passwordDialog.getErrorMessage()).toBe('Password is wrong');
    expect(await viewer.isPdfViewerContentDisplayed()).toBe(false, 'file content is displayed');
  });

  it('[C268961] Refresh the page while Password dialog is open', async () => {
    await passwordDialog.enterPassword(protectedFile.password);
    await page.refresh();
    await viewer.waitForViewerToOpen();

    expect(await viewer.isPdfViewerContentDisplayed()).toBe(false, 'file content is displayed');
    expect(await passwordDialog.isDialogOpen()).toBe(true, 'Password dialog not open');
  });
});
