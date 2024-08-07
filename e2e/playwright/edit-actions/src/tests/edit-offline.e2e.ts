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
import { ApiClientFactory, NodesApi, Utils, test, TrashcanApi, FileActionsApi, TEST_FILES } from '@alfresco/playwright-shared';

test.describe('Edit offline - on Personal Files', () => {
  const apiClientFactory = new ApiClientFactory();
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;

  let parentPFId: string;
  let fileLockedId: string;
  let fileLocked2Id: string;

  const username = `user-${Utils.random()}`;

  const file1 = `file1-${Utils.random()}.docx`;
  const fileLocked = `file-locked-${Utils.random()}.docx`;
  const fileLocked2 = `file-locked2-${Utils.random()}.docx`;
  const parentPF = `parentPersonal-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      nodesApi = await NodesApi.initialize(username, username);
      trashcanApi = await TrashcanApi.initialize(username, username);
      fileActionsApi = await FileActionsApi.initialize(username, username);

      parentPFId = (await nodesApi.createFolder(parentPF)).entry.id;
      fileLockedId = (await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, fileLocked, parentPFId)).entry.id;
      fileLocked2Id = (await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, fileLocked2, parentPFId)).entry.id;
      await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, file1, parentPFId);

      await nodesApi.lockNodes([fileLockedId, fileLocked2Id]);
    } catch (error) {
      console.error(`beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage, personalFiles }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await personalFiles.dataTable.performClickFolderOrFileToOpen(parentPF);
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test('[XAT-5304] File is locked and downloaded when clicking Edit offline', async ({ personalFiles }) => {
    await personalFiles.dataTable.selectItems(file1);
    await personalFiles.acaHeader.clickMoreActions();
    await personalFiles.matMenu.clickMenuItem('Edit Offline');
    const [download] = await Promise.all([personalFiles.page.waitForEvent('download')]);
    expect(download.suggestedFilename()).toBe(file1);
  });

  test('XAT-5305] Lock information is displayed', async ({ personalFiles }) => {
    expect(await personalFiles.dataTable.isItemPresent(fileLocked2)).toBe(true);
    expect(await personalFiles.dataTable.getLockOwner(fileLocked2)).toContain(username);
  });

  test('[XAT-5306] Cancel Editing unlocks the file', async ({ personalFiles }) => {
    await personalFiles.dataTable.selectItems(fileLocked);
    await personalFiles.acaHeader.clickMoreActions();
    await personalFiles.matMenu.clickMenuItemFromHeaderMenu('Cancel Editing');

    expect(await nodesApi.isFileLockedWrite(fileLockedId), `${fileLocked} is still locked`).not.toEqual('WRITE_LOCK');
  });
});
