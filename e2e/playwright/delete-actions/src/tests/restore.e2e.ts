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
import { ApiClientFactory, NodesApi, Utils, test, TrashcanApi, SitesApi, APP_ROUTES, TrashPage } from '@alfresco/playwright-shared';

test.describe('Restore from Trash', () => {
  const apiClientFactory = new ApiClientFactory();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let sitesApi: SitesApi;
  const username = `user-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      sitesApi = await SitesApi.initialize(username, username);

      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.describe('successful restore', () => {
    let fileId1: string;
    const file1 = `file1-${Utils.random()}.txt`;
    let folderId1: string;
    const folder1 = `folder1-${Utils.random()}`;
    let fileId2: string;
    const file2 = `file2-${Utils.random()}.txt`;
    let folderId2: string;
    const folder2 = `folder2-${Utils.random()}`;
    let fileId3: string;
    const file3 = `file3-${Utils.random()}.txt`;
    const site1 = `site1-${Utils.random()}`;

    test.beforeAll(async () => {
      fileId1 = (await nodesApi.createFile(file1)).entry.id;
      folderId1 = (await nodesApi.createFolder(folder1)).entry.id;
      fileId2 = (await nodesApi.createFile(file2)).entry.id;
      folderId2 = (await nodesApi.createFolder(folder2)).entry.id;
      fileId3 = (await nodesApi.createFile(file3)).entry.id;
      await sitesApi.createSite(site1);
      await nodesApi.deleteNodes([fileId1, folderId1, fileId2, folderId2, fileId3], false);
      await sitesApi.deleteSites([site1], false);
    });

    test.beforeEach(async ({ trashPage, loginPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await trashPage.navigate();
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    async function restoreNode(trashPage: TrashPage, nodeName: string) {
      await trashPage.dataTable.selectItems(nodeName);
      await trashPage.acaHeader.restoreButton.click();
      await trashPage.snackBar.verifySnackBarActionText(`${nodeName} restored`);
      const action = await trashPage.snackBar.getSnackBarActionText();
      expect(action).toContain('View');
      expect(await trashPage.dataTable.isItemPresent(nodeName)).toBeFalsy();
    }

    test('[C217177] restore file', async ({ trashPage, personalFiles }) => {
      await restoreNode(trashPage, file1);
      await personalFiles.navigate();
      expect(await personalFiles.dataTable.isItemPresent(file1)).toBeTruthy();
    });

    test('[C280438] restore folder', async ({ trashPage, personalFiles }) => {
      await restoreNode(trashPage, folder1);
      await personalFiles.navigate();
      expect(await personalFiles.dataTable.isItemPresent(folder1)).toBeTruthy();
    });

    test('[C290104] restore library', async ({ trashPage, myLibrariesPage }) => {
      await restoreNode(trashPage, site1);
      await myLibrariesPage.navigate();
      expect(await myLibrariesPage.dataTable.isItemPresent(site1)).toBeTruthy();
    });

    test('[C217182] restore multiple items', async ({ trashPage, personalFiles }) => {
      await trashPage.dataTable.selectItems(file2, folder2);
      await trashPage.acaHeader.restoreButton.click();
      await trashPage.snackBar.verifySnackBarActionText(`Restore successful`);
      const action = await trashPage.snackBar.getSnackBarActionText();
      expect(action).not.toContain('View');
      expect(await trashPage.dataTable.isItemPresent(file2)).toBeFalsy();
      expect(await trashPage.dataTable.isItemPresent(folder2)).toBeFalsy();
      await personalFiles.navigate();
      expect(await personalFiles.dataTable.isItemPresent(file2)).toBeTruthy();
      expect(await personalFiles.dataTable.isItemPresent(folder2)).toBeTruthy();
    });

    test('[C217181] View from notification', async ({ trashPage, personalFiles }) => {
      await trashPage.dataTable.selectItems(file3);
      await trashPage.acaHeader.restoreButton.click();
      await trashPage.snackBar.clickSnackBarAction();
      await trashPage.dataTable.spinnerWaitForReload();
      expect(await trashPage.sidenav.isActive('Personal Files')).toBeTruthy();
      expect(personalFiles.page.url()).toContain(APP_ROUTES.PERSONAL_FILES);
    });
  });

  test.describe('failure to restore', () => {
    const randomText = Utils.random();
    let file1Id1: string;
    const file1 = `file1-${randomText}.txt`;
    const file1copy = `file1-${randomText}.txt`;
    let file2Id: string;
    const file2 = `file2-${randomText}.txt`;
    let folder1Id: string;
    const folder1 = `folder1-${randomText}`;
    let folder2Id: string;
    const folder2 = `folder2-${randomText}`;

    test.beforeAll(async () => {
      folder1Id = (await nodesApi.createFolder(folder1)).entry.id;
      folder2Id = (await nodesApi.createFolder(folder2)).entry.id;
      file1Id1 = (await nodesApi.createFile(file1, folder1Id)).entry.id;
      file2Id = (await nodesApi.createFile(file2, folder2Id)).entry.id;
      await nodesApi.deleteNodes([file2Id, folder2Id, file1Id1], false);
      await nodesApi.createFile(file1copy, folder1Id);
    });

    test.beforeEach(async ({ loginPage, trashPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await trashPage.navigate();
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[C217178] Restore a file when another file with same name exists on the restore location', async ({ trashPage }) => {
      await trashPage.dataTable.selectItems(file1);
      await trashPage.acaHeader.restoreButton.click();
      await trashPage.snackBar.verifySnackBarActionText(`Can't restore, ${file1} already exists`);
    });

    test('[C217179] Restore a file when original location no longer exists', async ({ trashPage }) => {
      await trashPage.dataTable.selectItems(file2);
      await trashPage.acaHeader.restoreButton.click();
      await trashPage.snackBar.verifySnackBarActionText(`Can't restore ${file2}, the original location no longer exists`);
    });
  });

  test.describe('Notification on partial success', () => {
    const folder1 = `folder1-${Utils.random()}.txt`;
    let folder1Id: string;
    const folder2 = `folder2-${Utils.random()}.txt`;
    let folder2Id: string;
    const file1 = `file-${Utils.random()}.txt`;
    let file1Id: string;
    const file2 = `file-${Utils.random()}.txt`;
    let file2Id: string;

    const folder3 = `folder3-${Utils.random()}.txt`;
    let folder3Id: string;
    const folder4 = `folder4-${Utils.random()}.txt`;
    let folder4Id: string;
    const file3 = `file3-${Utils.random()}.txt`;
    let file3Id: string;
    const file4 = `file4-${Utils.random()}.txt`;
    let file4Id: string;
    const file5 = `file5-${Utils.random()}.txt`;
    let file5Id: string;

    test.beforeAll(async () => {
      try {
        folder1Id = (await nodesApi.createFolder(folder1)).entry.id;
        file1Id = (await nodesApi.createFile(file1, folder1Id)).entry.id;
        folder2Id = (await nodesApi.createFolder(folder2)).entry.id;
        file2Id = (await nodesApi.createFile(file2, folder2Id)).entry.id;
        await nodesApi.deleteNodes([file1Id, folder1Id, file2Id], false);

        folder3Id = (await nodesApi.createFolder(folder3)).entry.id;
        file3Id = (await nodesApi.createFile(file3, folder3Id)).entry.id;
        file4Id = (await nodesApi.createFile(file4, folder3Id)).entry.id;
        folder4Id = (await nodesApi.createFolder(folder4)).entry.id;
        file5Id = (await nodesApi.createFile(file5, folder4Id)).entry.id;
        await nodesApi.deleteNodes([file3Id, file4Id, folder3Id, file5Id], false);
      } catch {}
    });

    test.beforeEach(async ({ loginPage, trashPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await trashPage.navigate();
    });

    test.afterAll(async () => {
      await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
    });

    test('[C217183] one failure', async ({ trashPage }) => {
      await trashPage.dataTable.selectItems(file1, file2);
      await trashPage.acaHeader.restoreButton.click();
      await trashPage.snackBar.verifySnackBarActionText(`Can't restore ${file1}, the original location no longer exists`);
    });

    test('[C217184] multiple failures', async ({ trashPage }) => {
      await trashPage.dataTable.selectItems(file3, file4, file5);
      await trashPage.acaHeader.restoreButton.click();
      await trashPage.snackBar.verifySnackBarActionText('2 items not restored because of issues with the restore location');
    });
  });
});
