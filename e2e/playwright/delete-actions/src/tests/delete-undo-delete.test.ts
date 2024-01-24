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

import { expect } from '@playwright/test';
import { Utils, ApiClientFactory, test, TrashcanApi, NodesApi, LoginPage } from '@alfresco/playwright-shared';

test.describe('Delete and undo delete', () => {
  const username = `user-${Utils.random()}`;
  const apiClientFactory = new ApiClientFactory();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;

  test.beforeAll(async () => {
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    nodesApi = await NodesApi.initialize(username, username);
    trashcanApi = await TrashcanApi.initialize(username, username);
  });

  test.afterAll(async () => {
    await trashcanApi.emptyTrashcan();
  });

  test.describe('on Personal Files', () => {
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

    test.beforeAll(async () => {
      nodesApi = await NodesApi.initialize(username, username);
      parentId = (await nodesApi.createFolder(parent)).entry.id;

      await nodesApi.createFile(file1, parentId);
      await nodesApi.createFile(file2, parentId);
      await nodesApi.createFile(file3, parentId);
      await nodesApi.createFile(file4, parentId);
      await nodesApi.createFile(file5, parentId);
      await nodesApi.createFile(file6, parentId);
      await nodesApi.createFile(file7, parentId);

      const folder1Id = (await nodesApi.createFolder(folder1, parentId)).entry.id;
      const folder2Id = (await nodesApi.createFolder(folder2, parentId)).entry.id;
      const folder3Id = (await nodesApi.createFolder(folder3, parentId)).entry.id;
      const folder4Id = (await nodesApi.createFolder(folder4, parentId)).entry.id;
      const folder5Id = (await nodesApi.createFolder(folder5, parentId)).entry.id;
      const folder6Id = (await nodesApi.createFolder(folder6, parentId)).entry.id;

      await nodesApi.createFile(file1InFolder, folder1Id);
      fileLocked1Id = (await nodesApi.createFile(fileLocked1, folder2Id)).entry.id;
      fileLocked2Id = (await nodesApi.createFile(fileLocked2, folder3Id)).entry.id;
      fileLocked3Id = (await nodesApi.createFile(fileLocked3, folder4Id)).entry.id;
      fileLocked4Id = (await nodesApi.createFile(fileLocked4, folder5Id)).entry.id;
      await nodesApi.createFile(file2InFolder, folder6Id);

      await nodesApi.lockNodes([fileLocked1Id, fileLocked2Id, fileLocked3Id, fileLocked4Id], 'FULL');
    });

    test.beforeEach(async ({ page, personalFiles }) => {
      const loginPage = new LoginPage(page);
      await loginPage.loginUser(
        { username, password: username },
        {
          withNavigation: true,
          waitForLoading: true
        }
      );
      await personalFiles.dataTable.performClickFolderOrFileToOpen(parent);
    });

    test.afterAll(async () => {
      await nodesApi.deleteCurrentUserNodes();
      await trashcanApi.emptyTrashcan();
    });

    test('[C217125] delete a file and check notification', async ({ personalFiles, trashPage }) => {
      await personalFiles.dataTable.selectItem(file1);
      await personalFiles.clickMoreActionsButton('Delete');
      const message = await personalFiles.snackBar.message.innerText();
      expect(message).toContain(`${file1} deleted`);
      const action = await personalFiles.snackBar.actionButton.innerText();
      expect(action).toContain('Undo');
      expect(await personalFiles.dataTable.isItemPresent(file1), `${file1} was not removed from list`).toBe(false);
      await trashPage.navigate();
      expect(await trashPage.dataTable.isItemPresent(file1), `${file1} is not in trash`).toBe(true);
    });

    test('[C280502] delete multiple files and check notification', async ({ personalFiles, trashPage }) => {
      let items = await personalFiles.dataTable.getRowsCount();
      await personalFiles.dataTable.selectMultiItem(file2, file3);
      await personalFiles.clickMoreActionsButton('Delete');
      const message = await personalFiles.snackBar.message.innerText();
      expect(message).toContain(`Deleted 2 items`);
      expect(await personalFiles.dataTable.isItemPresent(file2), `${file2} was not removed from list`).toBe(false);
      expect(await personalFiles.dataTable.isItemPresent(file3), `${file3} was not removed from list`).toBe(false);
      items = items - 2;
      expect(await personalFiles.pagination.getRange()).toContain(`1-${items} of ${items}`);
      await trashPage.navigate();
      expect(await personalFiles.dataTable.isItemPresent(file2), `${file2} is not in trash`).toBe(true);
      expect(await personalFiles.dataTable.isItemPresent(file3), `${file3} is not in trash`).toBe(true);
    });
  });
});
