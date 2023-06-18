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

import { AdminActions, LoginPage, BrowsingPage, FILES, RepoClient, Utils, UserActions } from '@alfresco/aca-testing-shared';

describe('Edit offline', () => {
  const username = `user-${Utils.random()}`;

  const file1 = `file1-${Utils.random()}.docx`;
  const fileLocked = `file-locked-${Utils.random()}.docx`;
  const fileLocked2 = `file-locked2-${Utils.random()}.docx`;
  const parentPF = `parentPersonal-${Utils.random()}`;

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

  describe('on Personal Files', () => {
    let parentPFId: string;
    let file1Id: string;
    let fileLockedId: string;
    let fileLocked2Id: string;

    beforeAll(async () => {
      parentPFId = await apis.user.createFolder(parentPF);

      file1Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentPFId, file1)).entry.id;
      fileLockedId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentPFId, fileLocked)).entry.id;
      fileLocked2Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentPFId, fileLocked2)).entry.id;

      await userActions.lockNodes([fileLockedId, fileLocked2Id]);

      await loginPage.loginWith(username);
    });

    beforeEach(async () => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parentPF);
    });

    afterEach(async () => {
      await Utils.pressEscape();
    });

    afterAll(async () => {
      await userActions.login(username, username);
      await userActions.deleteNodes([parentPFId]);
    });

    it('[C297538] File is locked and downloaded when clicking Edit Offline', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(file1)).toBe(true, 'File not found in download location');
      expect(await apis.user.nodes.isFileLockedWrite(file1Id)).toBe(true, `${file1} is not locked`);
    });

    it('[C297539] Lock information is displayed', async () => {
      expect(await dataTable.isItemPresent(fileLocked2)).toBe(true, `${fileLocked2} is not displayed`);
      expect(await dataTable.hasLockIcon(fileLocked2)).toBe(true, `${fileLocked2} does not have a lock icon`);
      expect(await dataTable.getLockOwner(fileLocked2)).toContain(username, `${fileLocked2} does not have correct lock owner info`);
    });

    it('[C297540] Cancel Editing unlocks the file', async () => {
      await dataTable.selectItem(fileLocked);
      await toolbar.clickMoreActionsCancelEditing();
      await dataTable.unselectItem(fileLocked);

      expect(await apis.user.nodes.isFileLockedWrite(fileLockedId)).toBe(false, `${fileLocked} is still locked`);
      expect(await dataTable.hasLockIcon(fileLocked)).toBe(false, `${fileLocked} has a lock icon`);
    });
  });
});
