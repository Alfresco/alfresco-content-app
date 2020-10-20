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

import { browser } from 'protractor';
import { BrowsingPage, APP_ROUTES, RepoClient, Utils, CoreActions } from '@alfresco/aca-testing-shared';
import { ApiService, LoginPage, UsersActions, UserModel } from '@alfresco/adf-testing';

describe('Restore from Trash', () => {
  let user: UserModel;

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;

  const apiService = new ApiService();
  const usersActions = new UsersActions(apiService);
  const repo = new RepoClient(apiService);
  const coreActions = new CoreActions(apiService);

  beforeAll(async () => {
    await apiService.getInstance().loginWithProfile('admin')
    user = await usersActions.createUser();
    await apiService.getInstance().login(user.email, user.password);

    await loginPage.login(user.email, user.password);
  });

  afterAll(async () => {
    await coreActions.emptyTrashcan();
  });

  describe('successful restore', () => {
    const file = `file-${Utils.random()}.txt`;
    let fileId: string;
    const folder = `folder-${Utils.random()}`;
    let folderId: string;
    const site = `site-${Utils.random()}`;

    beforeAll(async () => {
      fileId = (await repo.nodes.createFile(file)).entry.id;
      folderId = (await repo.nodes.createFolder(folder)).entry.id;
      await repo.sites.createSite(site);

      await coreActions.deleteNodes([fileId, folderId], false);
      await coreActions.deleteSites([site], false);
    });

    beforeEach(async () => {
      await page.clickTrashAndWait();
    });

    afterAll(async () => {
      await coreActions.emptyTrashcan();
    });

    it('[C217177] restore file', async () => {
      await dataTable.selectItem(file);
      await toolbar.restoreButton.click();
      const text = await page.getSnackBarMessage();
      expect(text).toContain(`${file} restored`);
      expect(text).toContain(`View`);
      expect(await dataTable.isItemPresent(file)).toBe(false, 'Item was not removed from list');
      await page.clickPersonalFilesAndWait();
      expect(await page.dataTable.isItemPresent(file)).toBe(true, 'Item not displayed in list');

      await coreActions.deleteNodes([fileId], false);
    });

    it('[C280438] restore folder', async () => {
      await dataTable.selectItem(folder);
      await toolbar.restoreButton.click();
      const text = await page.getSnackBarMessage();
      expect(text).toContain(`${folder} restored`);
      expect(text).toContain(`View`);
      expect(await dataTable.isItemPresent(folder)).toBe(false, 'Item was not removed from list');
      await page.clickPersonalFilesAndWait();
      expect(await page.dataTable.isItemPresent(folder)).toBe(true, 'Item not displayed in list');

      await coreActions.deleteNodes([folderId], false);
    });

    it('[C290104] restore library', async () => {
      await dataTable.selectItem(site);
      await toolbar.restoreButton.click();
      const text = await page.getSnackBarMessage();
      expect(text).toContain(`${site} restored`);
      expect(text).toContain(`View`);
      expect(await dataTable.isItemPresent(site)).toBe(false, `${site} was not removed from list`);
      await page.clickFileLibrariesAndWait();
      expect(await page.dataTable.isItemPresent(site)).toBe(true, `${site} not displayed in list`);
    });

    it('[C217182] restore multiple items', async () => {
      await dataTable.selectMultipleItems([file, folder]);
      await toolbar.restoreButton.click();
      const text = await page.getSnackBarMessage();
      expect(text).toContain(`Restore successful`);
      expect(text).not.toContain(`View`);
      expect(await dataTable.isItemPresent(file)).toBe(false, 'Item was not removed from list');
      expect(await dataTable.isItemPresent(folder)).toBe(false, 'Item was not removed from list');
      await page.clickPersonalFilesAndWait();
      expect(await page.dataTable.isItemPresent(file)).toBe(true, 'Item not displayed in list');
      expect(await page.dataTable.isItemPresent(folder)).toBe(true, 'Item not displayed in list');

      await coreActions.deleteNodes([fileId, folderId], false);
    });

    it('[C217181] View from notification', async () => {
      await dataTable.selectItem(file);
      await toolbar.restoreButton.click();
      await page.clickSnackBarAction();
      await page.dataTable.waitForHeader();
      expect(await page.sidenav.isActive('Personal Files')).toBe(true, 'Personal Files sidebar link not active');
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);

      await coreActions.deleteNodes([fileId], false);
    });
  });

  describe('failure to restore', () => {
    const file1 = `file-${Utils.random()}.txt`;
    let file1Id1: string;
    let file1Id2: string;
    const file2 = `file-${Utils.random()}.txt`;
    let file2Id: string;

    const folder1 = `folder-${Utils.random()}`;
    let folder1Id: string;
    const folder2 = `folder-${Utils.random()}`;
    let folder2Id: string;

    beforeAll(async () => {
      folder1Id = (await repo.nodes.createFolder(folder1)).entry.id;
      file1Id1 = (await repo.nodes.createFile(file1, folder1Id)).entry.id;
      await coreActions.deleteNodes([file1Id1], false);
      file1Id2 = (await repo.nodes.createFile(file1, folder1Id)).entry.id;

      folder2Id = (await repo.nodes.createFolder(folder2)).entry.id;
      file2Id = (await repo.nodes.createFile(file2, folder2Id)).entry.id;

      await coreActions.deleteNodes([file2Id, folder2Id], false);
    });

    beforeEach(async () => {
      await page.clickTrashAndWait();
    });

    afterAll(async () => {
      await coreActions.deleteNodes([file1Id2]);
      await coreActions.emptyTrashcan();
    });

    it('[C217178] Restore a file when another file with same name exists on the restore location', async () => {
      await page.clickTrashAndWait();
      await dataTable.selectItem(file1);
      await toolbar.restoreButton.click();
      expect(await page.getSnackBarMessage()).toEqual(`Can't restore, ${file1} already exists`);
    });

    it('[C217179] Restore a file when original location no longer exists', async () => {
      await page.clickTrashAndWait();
      await dataTable.selectItem(file2);
      await toolbar.restoreButton.click();
      expect(await page.getSnackBarMessage()).toEqual(`Can't restore ${file2}, the original location no longer exists`);
    });
  });

  describe('Notification on partial success', () => {
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

    beforeAll(async () => {
      folder1Id = (await repo.nodes.createFolder(folder1)).entry.id;
      file1Id = (await repo.nodes.createFile(file1, folder1Id)).entry.id;
      folder2Id = (await repo.nodes.createFolder(folder2)).entry.id;
      file2Id = (await repo.nodes.createFile(file2, folder2Id)).entry.id;

      await coreActions.deleteNodes([file1Id, folder1Id, file2Id], false);

      folder3Id = (await repo.nodes.createFolder(folder3)).entry.id;
      file3Id = (await repo.nodes.createFile(file3, folder3Id)).entry.id;
      file4Id = (await repo.nodes.createFile(file4, folder3Id)).entry.id;
      folder4Id = (await repo.nodes.createFolder(folder4)).entry.id;
      file5Id = (await repo.nodes.createFile(file5, folder4Id)).entry.id;

      await coreActions.deleteNodes([file3Id, file4Id, folder3Id, file5Id], false);
      await loginPage.login(user.email, user.password);
    });

    beforeEach(async () => {
      await page.clickTrashAndWait();
    });

    afterAll(async () => {
      await coreActions.emptyTrashcan();
    });

    it('[C217183] one failure', async () => {
      await dataTable.selectMultipleItems([file1, file2]);
      await toolbar.restoreButton.click();
      expect(await page.getSnackBarMessage()).toEqual(`Can't restore ${file1}, the original location no longer exists`);
    });

    it('[C217184] multiple failures', async () => {
      await dataTable.selectMultipleItems([file3, file4, file5]);
      await toolbar.restoreButton.click();
      expect(await page.getSnackBarMessage()).toEqual('2 items not restored because of issues with the restore location');
    });
  });
});
