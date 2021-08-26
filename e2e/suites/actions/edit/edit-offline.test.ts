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

import { AdminActions, LoginPage, BrowsingPage, FILES, RepoClient, Utils } from '@alfresco/aca-testing-shared';

describe('Edit offline', () => {
  const username = `user-${Utils.random()}`;

  const file1 = `file1-${Utils.random()}.docx`;
  const fileLocked = `file-locked-${Utils.random()}.docx`;
  const fileLocked2 = `file-locked2-${Utils.random()}.docx`;

  const searchRandom = Utils.random();
  const fileSearch1 = `file-search-1-${searchRandom}.docx`;
  const fileSearchLocked = `file-search-locked-${searchRandom}.docx`;
  const fileSearchLocked2 = `file-search-locked2-${searchRandom}.docx`;

  const parentPF = `parentPersonal-${Utils.random()}`;
  const parentSF = `parentShared-${Utils.random()}`;
  const parentRF = `parentRecent-${Utils.random()}`;
  const parentFav = `parentFav-${Utils.random()}`;
  const parentSearch = `parentSearch-${Utils.random()}`;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const { searchInput } = page.header;

  const adminApiActions = new AdminActions();

  beforeAll(async () => {
    await adminApiActions.createUser({ username });
  });

  describe('on Personal Files', () => {
    let parentPFId: string;
    let file1Id: string;
    let fileLockedId: string;
    let fileLocked2Id: string;

    beforeAll(async () => {
      parentPFId = (await apis.user.nodes.createFolder(parentPF)).entry.id;

      file1Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentPFId, file1)).entry.id;
      fileLockedId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentPFId, fileLocked)).entry.id;
      fileLocked2Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentPFId, fileLocked2)).entry.id;

      await apis.user.nodes.lockFile(fileLockedId);
      await apis.user.nodes.lockFile(fileLocked2Id);

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
      await apis.user.nodes.deleteNodeById(parentPFId);
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

  describe('on Shared Files', () => {
    let parentSFId: string;
    let file1Id: string;
    let fileLockedId: string;
    let fileLocked2Id: string;

    beforeAll(async () => {
      parentSFId = (await apis.user.nodes.createFolder(parentSF)).entry.id;

      file1Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentSFId, file1)).entry.id;
      fileLockedId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentSFId, fileLocked)).entry.id;
      fileLocked2Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentSFId, fileLocked2)).entry.id;

      await apis.user.nodes.lockFile(fileLockedId);
      await apis.user.nodes.lockFile(fileLocked2Id);

      await apis.user.shared.shareFilesByIds([file1Id, fileLockedId, fileLocked2Id]);
      await apis.user.shared.waitForFilesToBeShared([file1Id, fileLockedId, fileLocked2Id]);

      await loginPage.loginWith(username);
    });

    afterAll(async () => {
      await apis.user.nodes.deleteNodeById(parentSFId);
    });

    beforeEach(async () => {
      await page.clickSharedFilesAndWait();
    });

    afterEach(async () => {
      await Utils.pressEscape();
    });

    it('[C306950] File is locked and downloaded when clicking Edit Offline', async () => {
      await dataTable.selectItem(file1, parentSF);
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(file1)).toBe(true, 'File not found in download location');
      expect(await apis.user.nodes.isFileLockedWrite(file1Id)).toBe(true, `${file1} is not locked`);
    });

    it('[C306951] Lock information is displayed', async () => {
      expect(await dataTable.isItemPresent(fileLocked2, parentSF)).toBe(true, `${fileLocked2} is not displayed`);
      expect(await dataTable.hasLockIcon(fileLocked2, parentSF)).toBe(true, `${fileLocked2} does not have a lock icon`);
      expect(await dataTable.getLockOwner(fileLocked2, parentSF)).toContain(username, `${fileLocked2} does not have correct lock owner info`);
    });

    it('[C306952] Cancel Editing unlocks the file', async () => {
      await dataTable.selectItem(fileLocked);
      await toolbar.clickMoreActionsCancelEditing();
      await dataTable.unselectItem(fileLocked);

      expect(await apis.user.nodes.isFileLockedWrite(fileLockedId)).toBe(false, `${fileLocked} is still locked`);
      expect(await dataTable.hasLockIcon(fileLocked, parentSF)).toBe(false, `${fileLocked} has a lock icon`);
    });
  });

  describe('on Recent Files', () => {
    let parentRFId: string;
    let file1Id: string;
    let fileLockedId: string;
    let fileLocked2Id: string;

    beforeAll(async () => {
      parentRFId = (await apis.user.nodes.createFolder(parentRF)).entry.id;

      await apis.user.search.waitForApi(username, { expect: 0 });

      file1Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentRFId, file1)).entry.id;
      fileLockedId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentRFId, fileLocked)).entry.id;
      fileLocked2Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentRFId, fileLocked2)).entry.id;

      await apis.user.nodes.lockFile(fileLockedId);
      await apis.user.nodes.lockFile(fileLocked2Id);

      await apis.user.search.waitForApi(username, { expect: 3 });

      await loginPage.loginWith(username);
    });

    afterAll(async () => {
      await apis.user.nodes.deleteNodeById(parentRFId);
    });

    beforeEach(async () => {
      await page.clickRecentFilesAndWait();
    });

    afterEach(async () => {
      await Utils.pressEscape();
    });

    it('[C297541] File is locked and downloaded when clicking Edit Offline', async () => {
      await dataTable.selectItem(file1, parentRF);
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(file1)).toBe(true, 'File not found in download location');
      expect(await apis.user.nodes.isFileLockedWrite(file1Id)).toBe(true, `${file1} is not locked`);
    });

    it('[C297542] Lock information is displayed', async () => {
      expect(await dataTable.isItemPresent(fileLocked2, parentRF)).toBe(true, `${fileLocked2} is not displayed`);
      expect(await dataTable.hasLockIcon(fileLocked2, parentRF)).toBe(true, `${fileLocked2} does not have a lock icon`);
      expect(await dataTable.getLockOwner(fileLocked2, parentRF)).toContain(username, `${fileLocked2} does not have correct lock owner info`);
    });

    it('[C297543] Cancel Editing unlocks the file', async () => {
      await dataTable.selectItem(fileLocked, parentRF);
      await toolbar.clickMoreActionsCancelEditing();
      await dataTable.unselectItem(fileLocked, parentRF);

      expect(await apis.user.nodes.isFileLockedWrite(fileLockedId)).toBe(false, `${fileLocked} is still locked`);
      expect(await dataTable.hasLockIcon(fileLocked, parentRF)).toBe(false, `${fileLocked} has a lock icon`);
    });
  });

  describe('on Favorite Files', () => {
    let parentFavId: string;
    let fileLockedId: string;
    let fileLocked2Id: string;

    beforeAll(async () => {
      parentFavId = (await apis.user.nodes.createFolder(parentFav)).entry.id;

      fileLockedId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentFavId, fileLocked)).entry.id;
      fileLocked2Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentFavId, fileLocked2)).entry.id;

      await apis.user.nodes.lockFile(fileLockedId);
      await apis.user.nodes.lockFile(fileLocked2Id);

      await apis.user.favorites.addFavoritesByIds('file', [fileLockedId, fileLocked2Id]);
      await apis.user.favorites.waitForApi({ expect: 2 });

      await loginPage.loginWith(username);
    });

    afterAll(async () => {
      await apis.user.nodes.deleteNodeById(parentFavId);
    });

    beforeEach(async () => {
      await page.clickFavoritesAndWait();
    });

    afterEach(async () => {
      await Utils.pressEscape();
    });

    it('[C306957] Lock information is displayed', async () => {
      expect(await dataTable.isItemPresent(fileLocked2)).toBe(true, `${fileLocked2} is not displayed`);
      expect(await dataTable.hasLockIcon(fileLocked2)).toBe(true, `${fileLocked2} does not have a lock icon`);
      expect(await dataTable.getLockOwner(fileLocked2)).toContain(username, `${fileLocked2} does not have correct lock owner info`);
    });

    it('[C306958] Cancel Editing unlocks the file', async () => {
      await dataTable.selectItem(fileLocked);
      await toolbar.clickMoreActionsCancelEditing();
      await dataTable.unselectItem(fileLocked);

      expect(await apis.user.nodes.isFileLockedWrite(fileLockedId)).toBe(false, `${fileLocked} is still locked`);
      expect(await dataTable.hasLockIcon(fileLocked)).toBe(false, `${fileLocked} has a lock icon`);
    });
  });

  describe('on Search Results', () => {
    let parentSearchId: string;
    let fileSearch1Id: string;
    let fileSearchLockedId: string;
    let fileSearchLocked2Id: string;

    beforeAll(async () => {
      parentSearchId = (await apis.user.nodes.createFolder(parentSearch)).entry.id;

      fileSearch1Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentSearchId, fileSearch1)).entry.id;
      fileSearchLockedId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentSearchId, fileSearchLocked)).entry.id;
      fileSearchLocked2Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentSearchId, fileSearchLocked2)).entry.id;

      await apis.user.nodes.lockFile(fileSearchLockedId);
      await apis.user.nodes.lockFile(fileSearchLocked2Id);

      await apis.user.search.waitForNodes(searchRandom, { expect: 3 });

      await loginPage.loginWith(username);
    });

    afterAll(async () => {
      await apis.user.nodes.deleteNodeById(parentSearchId);
    });

    beforeEach(async () => {
      await page.clickPersonalFilesAndWait();
      await searchInput.clickSearchButton();
      await searchInput.searchFor(searchRandom);
      await dataTable.waitForBody();
    });

    afterEach(async () => {
      await Utils.pressEscape();
    });

    it('[C306953] File is locked and downloaded when clicking Edit Offline', async () => {
      await dataTable.selectItem(fileSearch1, parentSearch);
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(fileSearch1)).toBe(true, 'File not found in download location');
      expect(await apis.user.nodes.isFileLockedWrite(fileSearch1Id)).toBe(true, `${fileSearch1} is not locked`);
    });

    it('[C306954] Lock information is displayed', async () => {
      expect(await dataTable.isItemPresent(fileSearchLocked2, parentSearch)).toBe(true, `${fileSearchLocked2} is not displayed`);
      expect(await dataTable.hasLockIcon(fileSearchLocked2, parentSearch)).toBe(true, `${fileSearchLocked2} does not have a lock icon`);
      expect(await dataTable.getLockOwnerToolTip(fileSearchLocked2, parentSearch)).toContain(
        username,
        `${fileSearchLocked2} does not have correct lock owner info`
      );
    });

    it('[C306955] Cancel Editing unlocks the file', async () => {
      await dataTable.selectItem(fileSearchLocked, parentSearch);
      await toolbar.clickMoreActionsCancelEditing();
      await dataTable.unselectItem(fileSearchLocked);

      expect(await apis.user.nodes.isFileLockedWrite(fileSearchLockedId)).toBe(false, `${fileSearchLocked} is still locked`);
      expect(await dataTable.hasLockIcon(fileSearchLocked, parentSearch)).toBe(false, `${fileSearchLocked} has a lock icon`);
    });
  });
});
