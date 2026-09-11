/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ApiClientFactory, NodesApi, Utils, test, TrashcanApi, FileActionsApi, TEST_FILES } from '@alfresco/aca-playwright-shared';

test.describe('Edit offline - on Personal Files', () => {
  const username = `user-${Utils.random()}`;
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;

  test.beforeAll(async () => {
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
    nodesApi = await NodesApi.initialize(username, username);
    trashcanApi = await TrashcanApi.initialize(username, username);
    fileActionsApi = await FileActionsApi.initialize(username, username);
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  test.describe('[XAT-5304] File is locked and downloaded when clicking Edit offline', () => {
    const file5304 = `file-5304-${Utils.random()}.docx`;
    let file5304Id: string;

    test.beforeAll(async () => {
      try {
        file5304Id = (await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, file5304)).entry.id;
      } catch (error) {
        console.error(`beforeAll failed : ${error}`);
      }
    });

    test.beforeEach(async ({ loginPage, personalFiles }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await personalFiles.navigate();
    });

    test.afterAll(async () => {
      await nodesApi.cancelCheckout([file5304Id]);
    });

    test('[XAT-5304] File is locked and downloaded when clicking Edit offline', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(file5304);
      await personalFiles.acaHeader.clickMoreActions();
      const [download] = await Promise.all([
        personalFiles.page.waitForEvent('download', { timeout: 5000 }),
        personalFiles.matMenu.clickMenuItem('Edit Offline')
      ]);
      expect(download.suggestedFilename()).toBe(file5304);
    });
  });

  test.describe('[XAT-5305] Lock information is displayed', () => {
    const fileLocked5305 = `file-locked-5305-${Utils.random()}.docx`;
    let fileLocked5305Id: string;

    test.beforeAll(async () => {
      try {
        fileLocked5305Id = (await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, fileLocked5305)).entry.id;
        await nodesApi.checkoutNodes([fileLocked5305Id]);
      } catch (error) {
        console.error(`beforeAll failed : ${error}`);
      }
    });

    test.beforeEach(async ({ loginPage, personalFiles }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await personalFiles.navigate();
    });

    test.afterAll(async () => {
      await nodesApi.cancelCheckout([fileLocked5305Id]);
    });

    test('[XAT-5305] Lock information is displayed', async ({ personalFiles }) => {
      expect(await personalFiles.dataTable.isItemPresent(fileLocked5305)).toBe(true);
      expect(await personalFiles.dataTable.getLockOwner(fileLocked5305)).toContain(username);
    });
  });

  test.describe('[XAT-5306] Cancel Editing unlocks the file', () => {
    const fileLocked5306 = `file-locked-5306-${Utils.random()}.docx`;
    let fileLocked5306Id: string;

    test.beforeAll(async () => {
      try {
        fileLocked5306Id = (await fileActionsApi.uploadFileWithRename(TEST_FILES.DOCX.path, fileLocked5306)).entry.id;
        await nodesApi.checkoutNodes([fileLocked5306Id]);
      } catch (error) {
        console.error(`beforeAll failed : ${error}`);
      }
    });

    test.beforeEach(async ({ loginPage, personalFiles }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await personalFiles.navigate();
    });

    test('[XAT-5306] Cancel Editing unlocks the file', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(fileLocked5306);
      await personalFiles.acaHeader.clickMoreActions();
      await personalFiles.matMenu.clickMenuItemFromHeaderMenu('Cancel Editing');

      expect(await nodesApi.isFileLockedWrite(fileLocked5306Id), `${fileLocked5306} is still locked`).not.toEqual('WRITE_LOCK');
    });
  });

  test.describe('[XAT-20171] Cancel Editing option should not persists after uploading a new file version', () => {
    const file20171 = `file-20171-${Utils.random()}.docx`;

    test.beforeAll(async () => {
      try {
        await fileActionsApi.uploadFileWithRename(TEST_FILES.JPG_FILE.path, file20171);
      } catch (error) {
        console.error(`beforeAll failed : ${error}`);
      }
    });

    test.beforeEach(async ({ loginPage, personalFiles }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await personalFiles.navigate();
    });

    test('[XAT-20171] Cancel Editing option should not persists after uploading a new file version', async ({ personalFiles }) => {
      await personalFiles.dataTable.selectItems(file20171);
      await personalFiles.acaHeader.clickMoreActions();
      const [fileChooser] = await Promise.all([
        personalFiles.page.waitForEvent('filechooser'),
        personalFiles.acaHeader.matMenu.clickMenuItem('Upload New Version')
      ]);
      await fileChooser.setFiles(TEST_FILES.PNG_FILE.path);
      await personalFiles.uploadNewVersionDialog.uploadButton.click();
      expect(await personalFiles.dataTable.isItemPresent(TEST_FILES.PNG_FILE.name)).toBe(true);
      await personalFiles.dataTable.selectItems(TEST_FILES.PNG_FILE.name);
      await personalFiles.acaHeader.clickMoreActions();
      await expect(personalFiles.matMenu.getButtonByText('Upload New Version')).toBeVisible();
    });
  });
});
