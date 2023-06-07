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

import { AdminActions, UserActions, LoginPage, BrowsingPage, RepoClient, Utils } from '@alfresco/aca-testing-shared';
import { Logger } from '@alfresco/adf-testing';

describe('Delete and undo delete', () => {
  const username = `user-${Utils.random()}`;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });
    await userActions.login(username, username);
  });

  afterAll(async () => {
    await userActions.login(username, username);
    await userActions.emptyTrashcan();
  });

  describe('on Personal Files', () => {
    const file1 = `file1-${Utils.random()}.txt`;
    const file2 = `file2-${Utils.random()}.txt`;
    const file3 = `file3-${Utils.random()}.txt`;
    const file4 = `file4-${Utils.random()}.txt`;
    const file5 = `file5-${Utils.random()}.txt`;
    const file6 = `file6-${Utils.random()}.txt`;
    const file7 = `file7-${Utils.random()}.txt`;

    const folder1 = `folder1-${Utils.random()}`;
    const folder2 = `folder2-${Utils.random()}`;
    const folder3 = `folder3-${Utils.random()}`;
    const folder4 = `folder4-${Utils.random()}`;
    const folder5 = `folder5-${Utils.random()}`;
    const folder6 = `folder6-${Utils.random()}`;

    const file1InFolder = `file1InFolder-${Utils.random()}.txt`;
    const file2InFolder = `file2InFolder-${Utils.random()}.txt`;
    const fileLocked1 = `fileLocked1-${Utils.random()}.txt`;
    let fileLocked1Id: string;
    const fileLocked2 = `fileLocked2-${Utils.random()}.txt`;
    let fileLocked2Id: string;
    const fileLocked3 = `fileLocked3-${Utils.random()}.txt`;
    let fileLocked3Id: string;
    const fileLocked4 = `fileLocked4-${Utils.random()}.txt`;
    let fileLocked4Id: string;

    const parent = `parentPF-${Utils.random()}`;
    let parentId: string;

    beforeAll(async () => {
      parentId = await apis.user.createFolder(parent);

      await apis.user.createFile(file1, parentId);
      await apis.user.createFile(file2, parentId);
      await apis.user.createFile(file3, parentId);
      await apis.user.createFile(file4, parentId);
      await apis.user.createFile(file5, parentId);
      await apis.user.createFile(file6, parentId);
      await apis.user.createFile(file7, parentId);

      const folder1Id = await apis.user.createFolder(folder1, parentId);
      const folder2Id = await apis.user.createFolder(folder2, parentId);
      const folder3Id = await apis.user.createFolder(folder3, parentId);
      const folder4Id = await apis.user.createFolder(folder4, parentId);
      const folder5Id = await apis.user.createFolder(folder5, parentId);
      const folder6Id = await apis.user.createFolder(folder6, parentId);

      await apis.user.createFile(file1InFolder, folder1Id);
      fileLocked1Id = await apis.user.createFile(fileLocked1, folder2Id);
      fileLocked2Id = await apis.user.createFile(fileLocked2, folder3Id);
      fileLocked3Id = await apis.user.createFile(fileLocked3, folder4Id);
      fileLocked4Id = await apis.user.createFile(fileLocked4, folder5Id);
      await apis.user.createFile(file2InFolder, folder6Id);

      await userActions.lockNodes([fileLocked1Id, fileLocked2Id, fileLocked3Id, fileLocked4Id], 'FULL');

      await loginPage.loginWith(username);
    });

    beforeEach(async () => {
      await page.clickPersonalFilesAndWait();
      await page.dataTable.doubleClickOnRowByName(parent);
    });

    afterAll(async () => {
      try {
        await userActions.login(username, username);
        await userActions.unlockNodes([fileLocked1Id, fileLocked2Id, fileLocked3Id, fileLocked4Id]);
        await userActions.deleteNodes([parentId]);
        await userActions.emptyTrashcan();
      } catch (error) {
        Logger.error(`----- afterAll failed : ${error}`);
      }
    });

    it('[C217125] delete a file and check notification', async () => {
      let items = await page.dataTable.getRowsCount();
      await dataTable.selectItem(file1);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`${file1} deleted`);
      const action = await page.getSnackBarAction();
      expect(action).toContain('Undo');
      expect(await dataTable.isItemPresent(file1)).toBe(false, `${file1} was not removed from list`);
      items--;
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
      await page.clickTrashAndWait();
      expect(await dataTable.isItemPresent(file1)).toBe(true, `${file1} is not in trash`);
    });

    it('[C280502] delete multiple files and check notification', async () => {
      let items = await page.dataTable.getRowsCount();
      await dataTable.selectMultipleItems([file2, file3]);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Deleted 2 items`);
      expect(await dataTable.isItemPresent(file2)).toBe(false, `${file2} was not removed from list`);
      expect(await dataTable.isItemPresent(file3)).toBe(false, `${file3} was not removed from list`);
      items = items - 2;
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
      await page.clickTrashAndWait();
      expect(await dataTable.isItemPresent(file2)).toBe(true, `${file2} is not in trash`);
      expect(await dataTable.isItemPresent(file3)).toBe(true, `${file3} is not in trash`);
    });

    it('[C217126] delete a folder with content', async () => {
      let items = await page.dataTable.getRowsCount();
      await dataTable.selectItem(folder1);
      await toolbar.clickMoreActionsDelete();
      expect(await dataTable.isItemPresent(folder1)).toBe(false, `${folder1} was not removed from list`);
      items--;
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
      await page.clickTrashAndWait();
      expect(await dataTable.isItemPresent(folder1)).toBe(true, `${folder1} is not in trash`);
      expect(await dataTable.isItemPresent(file1InFolder)).toBe(false, `${file1InFolder} is in trash`);
    });

    it('[C217127] delete a folder containing locked files', async () => {
      await dataTable.selectItem(folder2);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`${folder2} couldn't be deleted`);
      const action = await page.getSnackBarAction();
      expect(action).not.toContain('Undo');
      expect(await dataTable.isItemPresent(folder2)).toBe(true, `${folder2} was removed from list`);
      await page.clickTrash();
      expect(await dataTable.isItemPresent(folder2)).toBe(false, `${folder2} is in trash`);
      expect(await dataTable.isItemPresent(fileLocked1)).toBe(false, `${fileLocked1} is in trash`);
    });

    it('[C217129] notification on multiple items deletion - some items fail to delete', async () => {
      await dataTable.selectMultipleItems([file4, folder3]);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Deleted 1 item, 1 couldn't be deleted`);
      const action = await page.getSnackBarAction();
      expect(action).toContain('Undo');
    });

    it('[C217130] notification on multiple items deletion - all items fail to delete', async () => {
      await dataTable.selectMultipleItems([folder4, folder5]);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toEqual(`2 items couldn't be deleted`);
      const action = await page.getSnackBarAction();
      expect(action).not.toContain('Undo');
    });

    it('[C217132] undo delete of file', async () => {
      const items = await page.dataTable.getRowsCount();

      await dataTable.selectItem(file5);
      await toolbar.clickMoreActionsDelete();

      await page.clickSnackBarAction();
      await dataTable.waitForBody();
      expect(await dataTable.isItemPresent(file5)).toBe(true, `${file5} was not restored`);
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
    });

    it('[C280503] undo delete of folder with content', async () => {
      await dataTable.selectItem(folder6);
      await toolbar.clickMoreActionsDelete();
      await page.clickSnackBarAction();
      await dataTable.waitForBody();
      expect(await dataTable.isItemPresent(folder6)).toBe(true, `${folder6} was not restored`);
      await dataTable.doubleClickOnRowByName(folder6);
      await dataTable.waitForBody();
      expect(await dataTable.isItemPresent(file2InFolder)).toBe(true, `${file2InFolder} from ${folder6} not restored`);
    });

    it('[C280504] undo delete of multiple files', async () => {
      await dataTable.selectMultipleItems([file6, file7]);
      await toolbar.clickMoreActionsDelete();
      await page.clickSnackBarAction();
      await dataTable.waitForBody();
      expect(await dataTable.isItemPresent(file6)).toBe(true, `${file6} was removed from list`);
      expect(await dataTable.isItemPresent(file7)).toBe(true, `${file7} was removed from list`);
    });
  });
});
