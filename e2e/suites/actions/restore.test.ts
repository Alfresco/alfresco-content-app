/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { APP_ROUTES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Restore from Trash', () => {
  const username = `user-${Utils.random()}`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.trashcan.emptyTrash();
    done();
  });

  describe('successful restore', () => {
    const file = `file-${Utils.random()}.txt`; let fileId;
    const folder = `folder-${Utils.random()}`; let folderId;
    const site = `site-${Utils.random()}`;

    beforeAll(async (done) => {
      fileId = (await apis.user.nodes.createFile(file)).entry.id;
      folderId = (await apis.user.nodes.createFolder(folder)).entry.id;
      await apis.user.sites.createSite(site);

      await apis.user.nodes.deleteNodesById([fileId, folderId], false);
      await apis.user.sites.deleteSite(site, false);
      done();
    });

    beforeEach(async (done) => {
      await page.clickTrashAndWait();
      done();
    });

    afterAll(async (done) => {
      await apis.user.trashcan.emptyTrash();
      done();
    });

    it('restore file - [C217177]', async () => {
      await dataTable.selectItem(file);
      await toolbar.clickRestore();
      const text = await page.getSnackBarMessage();
      expect(text).toContain(`${file} restored`);
      expect(text).toContain(`View`);
      expect(await dataTable.isItemPresent(file)).toBe(false, 'Item was not removed from list');
      await page.clickPersonalFilesAndWait();
      expect(await page.dataTable.isItemPresent(file)).toBe(true, 'Item not displayed in list');

      await apis.user.nodes.deleteNodeById(fileId, false);
    });

    it('restore folder - [C280438]', async () => {
      await dataTable.selectItem(folder);
      await toolbar.clickRestore();
      const text = await page.getSnackBarMessage();
      expect(text).toContain(`${folder} restored`);
      expect(text).toContain(`View`);
      expect(await dataTable.isItemPresent(folder)).toBe(false, 'Item was not removed from list');
      await page.clickPersonalFilesAndWait();
      expect(await page.dataTable.isItemPresent(folder)).toBe(true, 'Item not displayed in list');

      await apis.user.nodes.deleteNodeById(folderId, false);
    });

    it('restore library - [C290104]', async () => {
      await dataTable.selectItem(site);
      await toolbar.clickRestore();
      const text = await page.getSnackBarMessage();
      expect(text).toContain(`${site} restored`);
      expect(text).toContain(`View`);
      expect(await dataTable.isItemPresent(site)).toBe(false, `${site} was not removed from list`);
      await page.clickFileLibrariesAndWait();
      expect(await page.dataTable.isItemPresent(site)).toBe(true, `${site} not displayed in list`);
    });

    it('restore multiple items - [C217182]', async () => {
      await dataTable.selectMultipleItems([file, folder]);
      await toolbar.clickRestore();
      const text = await page.getSnackBarMessage();
      expect(text).toContain(`Restore successful`);
      expect(text).not.toContain(`View`);
      expect(await dataTable.isItemPresent(file)).toBe(false, 'Item was not removed from list');
      expect(await dataTable.isItemPresent(folder)).toBe(false, 'Item was not removed from list');
      await page.clickPersonalFilesAndWait();
      expect(await page.dataTable.isItemPresent(file)).toBe(true, 'Item not displayed in list');
      expect(await page.dataTable.isItemPresent(folder)).toBe(true, 'Item not displayed in list');

      await apis.user.nodes.deleteNodesById([fileId, folderId], false);
    });

    it('View from notification - [C217181]', async () => {
      await dataTable.selectItem(file);
      await toolbar.clickRestore();
      await page.clickSnackBarAction();
      await page.dataTable.waitForHeader();
      expect(await page.sidenav.isActive('Personal Files')).toBe(true, 'Personal Files sidebar link not active');
      expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);

      await apis.user.nodes.deleteNodeById(fileId, false);
    });
  });

  describe('failure to restore', () => {
    const file1 = `file-${Utils.random()}.txt`;
    let file1Id1, file1Id2;
    const file2 = `file-${Utils.random()}.txt`;
    let file2Id;

    const folder1 = `folder-${Utils.random()}`;
    let folder1Id;
    const folder2 = `folder-${Utils.random()}`;
    let folder2Id;

    beforeAll(async (done) => {
      folder1Id = (await apis.user.nodes.createFolder(folder1)).entry.id;
      file1Id1 = (await apis.user.nodes.createFile(file1, folder1Id)).entry.id;
      await apis.user.nodes.deleteNodeById(file1Id1, false);
      file1Id2 = (await apis.user.nodes.createFile(file1, folder1Id)).entry.id;

      folder2Id = (await apis.user.nodes.createFolder(folder2)).entry.id;
      file2Id = (await apis.user.nodes.createFile(file2, folder2Id)).entry.id;
      await apis.user.nodes.deleteNodeById(file2Id, false);
      await apis.user.nodes.deleteNodeById(folder2Id, false);

      done();
    });

    beforeEach(async (done) => {
      await page.clickTrashAndWait();
      done();
    });

    afterAll(async (done) => {
      await Promise.all([
        apis.user.nodes.deleteNodeById(file1Id2),
        apis.user.trashcan.emptyTrash()
      ]);
      done();
    });

    it('Restore a file when another file with same name exists on the restore location - [C217178]', async () => {
      await page.clickTrashAndWait();
      await dataTable.selectItem(file1);
      await toolbar.clickRestore();
      expect(await page.getSnackBarMessage()).toEqual(`Can't restore, ${file1} already exists`);
    });

    it('Restore a file when original location no longer exists - [C217179]', async () => {
      await page.clickTrashAndWait();
      await dataTable.selectItem(file2);
      await toolbar.clickRestore();
      expect(await page.getSnackBarMessage()).toEqual(`Can't restore ${file2}, the original location no longer exists`);
    });
  });

  describe('Notification on partial success', () => {
    const folder1 = `folder1-${Utils.random()}.txt`;
    let folder1Id;
    const folder2 = `folder2-${Utils.random()}.txt`;
    let folder2Id;
    const file1 = `file-${Utils.random()}.txt`;
    let file1Id;
    const file2 = `file-${Utils.random()}.txt`;
    let file2Id;

    const folder3 = `folder3-${Utils.random()}.txt`;
    let folder3Id;
    const folder4 = `folder4-${Utils.random()}.txt`;
    let folder4Id;
    const file3 = `file3-${Utils.random()}.txt`;
    let file3Id;
    const file4 = `file4-${Utils.random()}.txt`;
    let file4Id;
    const file5 = `file5-${Utils.random()}.txt`;
    let file5Id;

    beforeAll(async (done) => {
      folder1Id = (await apis.user.nodes.createFolder(folder1)).entry.id;
      file1Id = (await apis.user.nodes.createFile(file1, folder1Id)).entry.id;
      folder2Id = (await apis.user.nodes.createFolder(folder2)).entry.id;
      file2Id = (await apis.user.nodes.createFile(file2, folder2Id)).entry.id;
      await apis.user.nodes.deleteNodeById(file1Id, false);
      await apis.user.nodes.deleteNodeById(folder1Id, false);
      await apis.user.nodes.deleteNodeById(file2Id, false);

      folder3Id = (await apis.user.nodes.createFolder(folder3)).entry.id;
      file3Id = (await apis.user.nodes.createFile(file3, folder3Id)).entry.id;
      file4Id = (await apis.user.nodes.createFile(file4, folder3Id)).entry.id;
      folder4Id = (await apis.user.nodes.createFolder(folder4)).entry.id;
      file5Id = (await apis.user.nodes.createFile(file5, folder4Id)).entry.id;
      await apis.user.nodes.deleteNodeById(file3Id, false);
      await apis.user.nodes.deleteNodeById(file4Id, false);
      await apis.user.nodes.deleteNodeById(folder3Id, false);
      await apis.user.nodes.deleteNodeById(file5Id, false);

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickTrashAndWait();
      done();
    });

    afterAll(async (done) => {
      await apis.user.trashcan.emptyTrash();
      done();
    });

    it('one failure - [C217183]', async () => {
      await dataTable.selectMultipleItems([file1, file2]);
      await toolbar.clickRestore();
      expect(await page.getSnackBarMessage()).toEqual(`Can't restore ${file1}, the original location no longer exists`);
    });

    it('multiple failures - [C217184]', async () => {
      await dataTable.selectMultipleItems([file3, file4, file5]);
      await toolbar.clickRestore();
      expect(await page.getSnackBarMessage()).toEqual('2 items not restored because of issues with the restore location');
    });
  });
});
