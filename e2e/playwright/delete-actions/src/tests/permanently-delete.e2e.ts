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
import { ApiClientFactory, NodesApi, Utils, test, TrashcanApi, SitesApi } from '@alfresco/playwright-shared';

test.describe('Delete and undo delete', () => {
  const apiClientFactory = new ApiClientFactory();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let sitesApi: SitesApi;

  const username = `user-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      trashcanApi = await TrashcanApi.initialize(username, username);
      nodesApi = await NodesApi.initialize(username, username);

      sitesApi = await SitesApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.describe('Permanently delete from Trash', () => {
    const file1 = `file1-${Utils.random()}.txt`;
    const file2 = `file2-${Utils.random()}.txt`;
    const file3 = `file3-${Utils.random()}.txt`;
    let filesIds;

    const folder1 = `folder1-${Utils.random()}`;
    const folder2 = `folder2-${Utils.random()}`;
    let foldersIds;

    const site = `site-${Utils.random()}`;

    test.beforeAll(async () => {
      filesIds = (await nodesApi.createFiles([file1, file2, file3])).list.entries.map((entries) => entries.entry.id);
      foldersIds = (await nodesApi.createFolders([folder1, folder2])).list.entries.map((entries) => entries.entry.id);
      await sitesApi.createSite(site);
      await nodesApi.deleteNodes([...filesIds, ...foldersIds], false);
      await sitesApi.deleteSites([site], false);
    });

    test.beforeEach(async ({ loginPage, trashPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await trashPage.navigate();
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[C217091] delete a file', async ({ trashPage }) => {
      await trashPage.dataTable.selectItems(file1);
      await trashPage.acaHeader.permanentlyDeleteButton.click();
      await trashPage.deleteDialog.deleteButton.click();

      await trashPage.snackBar.verifySnackBarActionText(`${file1} deleted`);
      expect(await trashPage.dataTable.isItemPresent(file1)).toBeFalsy();
    });

    test('[C280416] delete a folder', async ({ trashPage }) => {
      await trashPage.dataTable.selectItems(folder1);
      await trashPage.acaHeader.permanentlyDeleteButton.click();
      await trashPage.deleteDialog.deleteButton.click();

      await trashPage.snackBar.verifySnackBarActionText(`${folder1} deleted`);
      expect(await trashPage.dataTable.isItemPresent(folder1)).toBeFalsy();
    });

    test('[C290103] delete a library', async ({ trashPage }) => {
      await trashPage.dataTable.selectItems(site);
      await trashPage.acaHeader.permanentlyDeleteButton.click();
      await trashPage.deleteDialog.deleteButton.click();

      await trashPage.snackBar.verifySnackBarActionText(`${site} deleted`);
      expect(await trashPage.dataTable.isItemPresent(site)).toBeFalsy();
    });

    test('[C280417] delete multiple items', async ({ trashPage }) => {
      await trashPage.dataTable.selectItems(file2, folder2);
      await trashPage.acaHeader.permanentlyDeleteButton.click();
      await trashPage.deleteDialog.deleteButton.click();

      await trashPage.snackBar.verifySnackBarActionText(`2 items deleted`);
      expect(await trashPage.dataTable.isItemPresent(file2)).toBeFalsy();
      expect(await trashPage.dataTable.isItemPresent(folder2)).toBeFalsy();
    });

    test('[C269113] Confirmation dialog UI', async ({ trashPage }) => {
      await trashPage.dataTable.selectItems(file3);
      await trashPage.acaHeader.permanentlyDeleteButton.click();
      await trashPage.deleteDialog.waitForDialog();

      expect(await trashPage.deleteDialog.isDialogOpen()).toBeTruthy();
      expect(await trashPage.deleteDialog.getDialogTitle()).toContain('Delete from trash');
      expect(await trashPage.deleteDialog.getDialogDescription()).toContain('This will permanently remove the selected item(s)');
      expect(await trashPage.deleteDialog.isDeleteEnabled()).toBeTruthy();
      expect(await trashPage.deleteDialog.isKeepEnabled()).toBeTruthy();
    });

    test('[C269115] Keep action cancels the deletion', async ({ trashPage }) => {
      await trashPage.dataTable.selectItems(file3);
      await trashPage.acaHeader.permanentlyDeleteButton.click();
      await trashPage.deleteDialog.waitForDialog();

      expect(await trashPage.deleteDialog.isKeepEnabled()).toBeTruthy();
      await trashPage.deleteDialog.keepButton.click();
      expect(await trashPage.dataTable.isItemPresent(file3)).toBeTruthy();
    });
  });
});
