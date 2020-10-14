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

import { BrowsingPage, FILES, RepoClient, Utils } from '@alfresco/aca-testing-shared';
import { ApiService, LoginPage, UsersActions } from '@alfresco/adf-testing';

describe('Edit offline', () => {
  let username;

  const file1 = `file1-${Utils.random()}.docx`;
  let file1Id: string;
  const fileLocked = `file-locked-${Utils.random()}.docx`;
  let fileLockedId: string;
  const fileLocked2 = `file-locked2-${Utils.random()}.docx`;
  let fileLocked2Id: string;

  const fileSearch1 = `file-search-1-${Utils.random()}.docx`;
  let fileSearch1Id: string;
  const fileSearchLocked = `file-search-locked-${Utils.random()}.docx`;
  let fileSearchLockedId: string;
  const fileSearchLocked2 = `file-search-locked2-${Utils.random()}.docx`;
  let fileSearchLocked2Id: string;

  const parentPF = `parentPersonal-${Utils.random()}`;
  let parentPFId: string;
  const parentSF = `parentShared-${Utils.random()}`;
  let parentSFId: string;
  const parentRF = `parentRecent-${Utils.random()}`;
  let parentRFId: string;
  const parentFav = `parentFav-${Utils.random()}`;
  let parentFavId: string;
  const parentSearch = `parentSearch-${Utils.random()}`;
  let parentSearchId: string;

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const { searchInput } = page.header;

  const apiService = new ApiService();
  const usersActions = new UsersActions(apiService);
  const repo = new RepoClient(apiService);

  beforeAll(async () => {
    username = await usersActions.createUser();
  });

  describe('on Personal Files', () => {
    beforeAll(async () => {
      parentPFId = (await repo.nodes.createFolder(parentPF)).entry.id;

      file1Id = (await repo.upload.uploadFileWithRename(FILES.docxFile, parentPFId, file1)).entry.id;
      fileLockedId = (await repo.upload.uploadFileWithRename(FILES.docxFile, parentPFId, fileLocked)).entry.id;
      fileLocked2Id = (await repo.upload.uploadFileWithRename(FILES.docxFile, parentPFId, fileLocked2)).entry.id;

      await repo.nodes.lockFile(fileLockedId);
      await repo.nodes.lockFile(fileLocked2Id);

      await loginPage.login(username.email, username.password);
    });

    beforeEach(async () => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parentPF);
    });

    afterEach(async () => {
      await Utils.pressEscape();
    });

    afterAll(async () => {
      await repo.nodes.deleteNodeById(parentPFId);
    });

    it('[C297538] File is locked and downloaded when clicking Edit Offline', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(file1)).toBe(true, 'File not found in download location');
      expect(await repo.nodes.isFileLockedWrite(file1Id)).toBe(true, `${file1} is not locked`);
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

      expect(await repo.nodes.isFileLockedWrite(fileLockedId)).toBe(false, `${fileLocked} is still locked`);
      expect(await dataTable.hasLockIcon(fileLocked)).toBe(false, `${fileLocked} has a lock icon`);
    });
  });

  describe('on Shared Files', () => {
    beforeAll(async () => {
      parentSFId = (await repo.nodes.createFolder(parentSF)).entry.id;

      file1Id = (await repo.upload.uploadFileWithRename(FILES.docxFile, parentSFId, file1)).entry.id;
      fileLockedId = (await repo.upload.uploadFileWithRename(FILES.docxFile, parentSFId, fileLocked)).entry.id;
      fileLocked2Id = (await repo.upload.uploadFileWithRename(FILES.docxFile, parentSFId, fileLocked2)).entry.id;

      await repo.nodes.lockFile(fileLockedId);
      await repo.nodes.lockFile(fileLocked2Id);

      const initialSharedTotalItems = await repo.shared.getSharedLinksTotalItems();
      await repo.shared.shareFilesByIds([file1Id, fileLockedId, fileLocked2Id]);
      await repo.shared.waitForApi({ expect: initialSharedTotalItems + 3 });

      await loginPage.login(username.email, username.password);
    });

    afterAll(async () => {
      await repo.nodes.deleteNodeById(parentSFId);
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
      expect(await repo.nodes.isFileLockedWrite(file1Id)).toBe(true, `${file1} is not locked`);
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

      expect(await repo.nodes.isFileLockedWrite(fileLockedId)).toBe(false, `${fileLocked} is still locked`);
      expect(await dataTable.hasLockIcon(fileLocked, parentSF)).toBe(false, `${fileLocked} has a lock icon`);
    });
  });

  describe('on Recent Files', () => {
    beforeAll(async () => {
      parentRFId = (await repo.nodes.createFolder(parentRF)).entry.id;

      await repo.search.waitForApi(username, { expect: 0 });

      file1Id = (await repo.upload.uploadFileWithRename(FILES.docxFile, parentRFId, file1)).entry.id;
      fileLockedId = (await repo.upload.uploadFileWithRename(FILES.docxFile, parentRFId, fileLocked)).entry.id;
      fileLocked2Id = (await repo.upload.uploadFileWithRename(FILES.docxFile, parentRFId, fileLocked2)).entry.id;

      await repo.nodes.lockFile(fileLockedId);
      await repo.nodes.lockFile(fileLocked2Id);

      await repo.search.waitForApi(username, { expect: 3 });

      await loginPage.login(username.email, username.password);
    });

    afterAll(async () => {
      await repo.nodes.deleteNodeById(parentRFId);
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
      expect(await repo.nodes.isFileLockedWrite(file1Id)).toBe(true, `${file1} is not locked`);
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

      expect(await repo.nodes.isFileLockedWrite(fileLockedId)).toBe(false, `${fileLocked} is still locked`);
      expect(await dataTable.hasLockIcon(fileLocked, parentRF)).toBe(false, `${fileLocked} has a lock icon`);
    });
  });

  describe('on Favorite Files', () => {
    beforeAll(async () => {
      parentFavId = (await repo.nodes.createFolder(parentFav)).entry.id;

      file1Id = (await repo.upload.uploadFileWithRename(FILES.docxFile, parentFavId, file1)).entry.id;
      fileLockedId = (await repo.upload.uploadFileWithRename(FILES.docxFile, parentFavId, fileLocked)).entry.id;
      fileLocked2Id = (await repo.upload.uploadFileWithRename(FILES.docxFile, parentFavId, fileLocked2)).entry.id;

      await repo.nodes.lockFile(fileLockedId);
      await repo.nodes.lockFile(fileLocked2Id);

      await repo.favorites.addFavoritesByIds('file', [file1Id, fileLockedId, fileLocked2Id]);
      await repo.favorites.waitForApi({ expect: 3 });

      await loginPage.login(username.email, username.password);
    });

    afterAll(async () => {
      await repo.nodes.deleteNodeById(parentFavId);
    });

    beforeEach(async () => {
      await page.clickFavoritesAndWait();
    });

    afterEach(async () => {
      await Utils.pressEscape();
    });

    // TODO: raise REPO issue: permissions not returned in /people/${personId}/favorites api
    xit('[C306956] File is locked and downloaded when clicking Edit Offline', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(file1)).toBe(true, 'File not found in download location');
      expect(await repo.nodes.isFileLockedWrite(file1Id)).toBe(true, `${file1} is not locked`);
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

      expect(await repo.nodes.isFileLockedWrite(fileLockedId)).toBe(false, `${fileLocked} is still locked`);
      expect(await dataTable.hasLockIcon(fileLocked)).toBe(false, `${fileLocked} has a lock icon`);
    });
  });

  describe('on Search Results', () => {
    beforeAll(async () => {
      parentSearchId = (await repo.nodes.createFolder(parentSearch)).entry.id;

      const initialSearchByTermTotalItems = await repo.search.getSearchByTermTotalItems('file-search');
      fileSearch1Id = (await repo.upload.uploadFileWithRename(FILES.docxFile, parentSearchId, fileSearch1)).entry.id;
      fileSearchLockedId = (await repo.upload.uploadFileWithRename(FILES.docxFile, parentSearchId, fileSearchLocked)).entry.id;
      fileSearchLocked2Id = (await repo.upload.uploadFileWithRename(FILES.docxFile, parentSearchId, fileSearchLocked2)).entry.id;

      await repo.nodes.lockFile(fileSearchLockedId);
      await repo.nodes.lockFile(fileSearchLocked2Id);

      await repo.search.waitForNodes('file-search', { expect: initialSearchByTermTotalItems + 3 });

      await loginPage.login(username.email, username.password);
    });

    afterAll(async () => {
      await repo.nodes.deleteNodeById(parentSearchId);
    });

    beforeEach(async () => {
      await page.clickPersonalFilesAndWait();
      await searchInput.clickSearchButton();
      await searchInput.searchFor('file-search');
      await dataTable.waitForBody();
    });

    afterEach(async () => {
      await Utils.pressEscape();
    });

    it('[C306953] File is locked and downloaded when clicking Edit Offline', async () => {
      await dataTable.selectItem(fileSearch1);
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(fileSearch1)).toBe(true, 'File not found in download location');
      expect(await repo.nodes.isFileLockedWrite(fileSearch1Id)).toBe(true, `${fileSearch1} is not locked`);
    });

    it('[C306954] Lock information is displayed', async () => {
      expect(await dataTable.isItemPresent(fileSearchLocked2, parentSearch)).toBe(true, `${fileSearchLocked2} is not displayed`);
      expect(await dataTable.hasLockIcon(fileSearchLocked2, parentSearch)).toBe(true, `${fileSearchLocked2} does not have a lock icon`);
      // TODO: enable when ACA-2314 is fixed
      // expect(await dataTable.getLockOwner(fileSearchLocked2, parentSearch)).toContain(username, `${fileSearchLocked2} does not have correct lock owner info`);
    });

    it('[C306955] Cancel Editing unlocks the file', async () => {
      await dataTable.selectItem(fileSearchLocked);
      await toolbar.clickMoreActionsCancelEditing();
      await dataTable.unselectItem(fileSearchLocked);

      expect(await repo.nodes.isFileLockedWrite(fileSearchLockedId)).toBe(false, `${fileSearchLocked} is still locked`);
      expect(await dataTable.hasLockIcon(fileSearchLocked, parentSearch)).toBe(false, `${fileSearchLocked} has a lock icon`);
    });
  });
});
