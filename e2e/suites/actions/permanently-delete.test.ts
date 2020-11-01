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

import { BrowsingPage, ConfirmDialog, RepoClient, Utils, CoreActions } from '@alfresco/aca-testing-shared';
import { ApiService, LoginPage, UsersActions, UserModel } from '@alfresco/adf-testing';
import { browser } from 'protractor';

describe('Permanently delete from Trash', () => {
  let user: UserModel;

  const file1 = `file1-${Utils.random()}.txt`;
  const file2 = `file2-${Utils.random()}.txt`;
  const file3 = `file3-${Utils.random()}.txt`;
  let filesIds;

  const folder1 = `folder1-${Utils.random()}`;
  const folder2 = `folder2-${Utils.random()}`;
  let foldersIds;

  const site = `site-${Utils.random()}`;

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;

  const confirmDialog = new ConfirmDialog();
  const apiService = new ApiService();
  const usersActions = new UsersActions(apiService);
  const repo = new RepoClient(apiService);
  const coreActions = new CoreActions(apiService);

  beforeAll(async () => {
    await apiService.getInstance().login(browser.params.testConfig.users.admin.username, browser.params.testConfig.users.admin.password);
    user = await usersActions.createUser();
    await apiService.getInstance().login(user.email, user.password);

    filesIds = (await repo.nodes.createFiles([file1, file2, file3])).list.entries.map((entries: any) => entries.entry.id);
    foldersIds = (await repo.nodes.createFolders([folder1, folder2])).list.entries.map((entries: any) => entries.entry.id);
    await repo.sites.createSite(site);

    await coreActions.deleteNodes([...filesIds, ...foldersIds], false);
    await coreActions.deleteSites([site], false);

    await loginPage.login(user.email, user.password);
  });

  beforeEach(async () => {
    await page.clickTrashAndWait();
  });

  afterAll(async () => {
    await coreActions.emptyTrashcan();
  });

  it('[C217091] delete a file', async () => {
    await dataTable.selectItem(file1);
    await toolbar.permanentlyDeleteButton.click();
    await page.waitForDialog();
    await confirmDialog.deleteButton.click();

    expect(await page.getSnackBarMessage()).toEqual(`${file1} deleted`);
    expect(await dataTable.isItemPresent(file1)).toBe(false, 'Item was not deleted');
  });

  it('[C280416] delete a folder', async () => {
    await dataTable.selectItem(folder1);
    await toolbar.permanentlyDeleteButton.click();
    await page.waitForDialog();
    await confirmDialog.deleteButton.click();

    expect(await page.getSnackBarMessage()).toEqual(`${folder1} deleted`);
    expect(await dataTable.isItemPresent(folder1)).toBe(false, 'Item was not deleted');
  });

  it('[C290103] delete a library', async () => {
    await dataTable.selectItem(site);
    await toolbar.permanentlyDeleteButton.click();
    await page.waitForDialog();
    await confirmDialog.deleteButton.click();

    expect(await page.getSnackBarMessage()).toEqual(`${site} deleted`);
    expect(await dataTable.isItemPresent(site)).toBe(false, `${site} was not deleted`);
  });

  it('[C280417] delete multiple items', async () => {
    await dataTable.selectMultipleItems([file2, folder2]);
    await toolbar.permanentlyDeleteButton.click();
    await page.waitForDialog();
    await confirmDialog.deleteButton.click();

    expect(await page.getSnackBarMessage()).toEqual(`2 items deleted`);
    expect(await dataTable.isItemPresent(file2)).toBe(false, 'Item was not deleted');
    expect(await dataTable.isItemPresent(folder2)).toBe(false, 'Item was not deleted');
  });

  it('[C269113] Confirmation dialog UI', async () => {
    await dataTable.selectItem(file3);
    await toolbar.permanentlyDeleteButton.click();
    await page.waitForDialog();

    expect(await confirmDialog.isDialogOpen()).toBe(true, 'Confirm delete dialog not open');
    expect(await confirmDialog.getTitle()).toContain('Delete from trash');
    expect(await confirmDialog.getText()).toContain('This will permanently remove the selected item(s)');
    expect(await confirmDialog.isDeleteEnabled()).toBe(true, 'DELETE button is not enabled');
    expect(await confirmDialog.isKeepEnabled()).toBe(true, 'KEEP button is not enabled');

    await Utils.pressEscape();
    await dataTable.clearSelection();
  });

  it('[C269115] Keep action cancels the deletion', async () => {
    await dataTable.selectItem(file3);
    await toolbar.permanentlyDeleteButton.click();
    await page.waitForDialog();

    expect(await confirmDialog.isKeepEnabled()).toBe(true, 'KEEP button is not enabled');
    await confirmDialog.keepButton.click();
    expect(await dataTable.isItemPresent(file3)).toBe(true, 'Item was deleted');
  });
});
