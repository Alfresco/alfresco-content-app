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

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { FILES } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Edit offline', () => {
  const username = `user-${Utils.random()}`;

  const file1 = `file1-${Utils.random()}.docx`; let file1Id;
  const fileLocked = `file-locked-${Utils.random()}.docx`; let fileLockedId;
  const fileLocked2 = `file-locked2-${Utils.random()}.docx`; let fileLocked2Id;

  const parentPF = `parentPersonal-${Utils.random()}`; let parentPFId;
  const parentSF = `parentShared-${Utils.random()}`; let parentSFId;
  const parentRF = `parentRecent-${Utils.random()}`; let parentRFId;
  const parentFav = `parentFav-${Utils.random()}`; let parentFavId;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    parentPFId = (await apis.user.nodes.createFolder(parentPF)).entry.id;
    parentSFId = (await apis.user.nodes.createFolder(parentSF)).entry.id;
    parentRFId = (await apis.user.nodes.createFolder(parentRF)).entry.id;
    parentFavId = (await apis.user.nodes.createFolder(parentFav)).entry.id;

    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentPFId);
    await apis.user.nodes.deleteNodeById(parentSFId);
    await apis.user.nodes.deleteNodeById(parentRFId);
    await apis.user.nodes.deleteNodeById(parentFavId);
    done();
  });

  describe('on Personal Files', () => {
    beforeAll(async (done) => {
      file1Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentPFId, file1)).entry.id;
      fileLockedId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentPFId, fileLocked)).entry.id;
      fileLocked2Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentPFId, fileLocked2)).entry.id;

      await apis.user.nodes.lockFile(fileLockedId);
      await apis.user.nodes.lockFile(fileLocked2Id);

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parentPF);
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('File is locked and downloaded when clicking Edit Offline - [C297538]', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(file1)).toBe(true, 'File not found in download location');
      expect(await apis.user.nodes.isFileLockedWrite(file1Id)).toBe(true, `${file1} is not locked`);
    });

    it('Lock information is displayed - [C297539]', async () => {
      expect(await dataTable.isItemPresent(fileLocked2)).toBe(true, `${fileLocked2} is not displayed`);
      expect(await dataTable.hasLockIcon(fileLocked2)).toBe(true, `${fileLocked2} does not have a lock icon`);
      expect(await dataTable.getLockOwner(fileLocked2)).toContain(username, `${fileLocked2} does not have correct lock owner info`);
    });

    it('Cancel Editing unlocks the file - [C297540]', async () => {
      await dataTable.selectItem(fileLocked);
      await toolbar.clickMoreActionsCancelEditing();
      await dataTable.clearSelection();

      expect(await apis.user.nodes.isFileLockedWrite(fileLockedId)).toBe(false, `${fileLocked} is still locked`);
      expect(await dataTable.hasLockIcon(fileLocked)).toBe(false, `${fileLocked} has a lock icon`);
    });
  });

  // TODO: enable tests when ACA-2173 is done
  xdescribe('on Shared Files', () => {
    beforeAll(async (done) => {
      file1Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentSFId, file1)).entry.id;
      fileLockedId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentSFId, fileLocked)).entry.id;
      fileLocked2Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentSFId, fileLocked2)).entry.id;

      await apis.user.nodes.lockFile(fileLockedId);
      await apis.user.nodes.lockFile(fileLocked2Id);

      await apis.user.shared.shareFilesByIds([file1Id, fileLockedId, fileLocked2Id]);
      await apis.user.shared.waitForApi({ expect: 3 });

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickSharedFilesAndWait();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    xit('File is locked and downloaded when clicking Edit Offline - []', async () => {
      await dataTable.selectItem(file1, parentSF);
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(file1)).toBe(true, 'File not found in download location');
      expect(await apis.user.nodes.isFileLockedWrite(file1Id)).toBe(true, `${file1} is not locked`);
    });

    xit('Lock information is displayed - []', async () => {
      expect(await dataTable.isItemPresent(fileLocked2, parentSF)).toBe(true, `${fileLocked2} is not displayed`);
      expect(await dataTable.hasLockIcon(fileLocked2, parentSF)).toBe(true, `${fileLocked2} does not have a lock icon`);
      expect(await dataTable.getLockOwner(fileLocked2, parentSF)).toContain(username, `${fileLocked2} does not have correct lock owner info`);
    });

    xit('Cancel Editing unlocks the file - []', async () => {
      await dataTable.selectItem(fileLocked);
      await toolbar.clickMoreActionsCancelEditing();
      await dataTable.clearSelection();

      expect(await apis.user.nodes.isFileLockedWrite(fileLockedId)).toBe(false, `${fileLocked} is still locked`);
      expect(await dataTable.hasLockIcon(fileLocked, parentSF)).toBe(false, `${fileLocked} has a lock icon`);
    });
  });

  describe('on Recent Files', () => {
    beforeAll(async (done) => {
      file1Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentRFId, file1)).entry.id;
      fileLockedId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentRFId, fileLocked)).entry.id;
      fileLocked2Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentRFId, fileLocked2)).entry.id;

      await apis.user.nodes.lockFile(fileLockedId);
      await apis.user.nodes.lockFile(fileLocked2Id);

      await apis.user.search.waitForApi(username, { expect: 6 });

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickRecentFilesAndWait();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    it('File is locked and downloaded when clicking Edit Offline - [C297541]', async () => {
      await dataTable.selectItem(file1, parentRF);
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(file1)).toBe(true, 'File not found in download location');
      expect(await apis.user.nodes.isFileLockedWrite(file1Id)).toBe(true, `${file1} is not locked`);
    });

    it('Lock information is displayed - [C297542]', async () => {
      expect(await dataTable.isItemPresent(fileLocked2, parentRF)).toBe(true, `${fileLocked2} is not displayed`);
      expect(await dataTable.hasLockIcon(fileLocked2, parentRF)).toBe(true, `${fileLocked2} does not have a lock icon`);
      expect(await dataTable.getLockOwner(fileLocked2, parentRF)).toContain(username, `${fileLocked2} does not have correct lock owner info`);
    });

    it('Cancel Editing unlocks the file - [C297543]', async () => {
      await dataTable.selectItem(fileLocked, parentRF);
      await toolbar.clickMoreActionsCancelEditing();
      await dataTable.clearSelection();

      expect(await apis.user.nodes.isFileLockedWrite(fileLockedId)).toBe(false, `${fileLocked} is still locked`);
      expect(await dataTable.hasLockIcon(fileLocked, parentRF)).toBe(false, `${fileLocked} has a lock icon`);
    });
  });

  // TODO: enable tests when ACA-2174 is done
  xdescribe('on Favorite Files', () => {
    beforeAll(async (done) => {
      file1Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentFavId, file1)).entry.id;
      fileLockedId = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentFavId, fileLocked)).entry.id;
      fileLocked2Id = (await apis.user.upload.uploadFileWithRename(FILES.docxFile, parentFavId, fileLocked2)).entry.id;

      await apis.user.nodes.lockFile(fileLockedId);
      await apis.user.nodes.lockFile(fileLocked2Id);

      await apis.user.favorites.addFavoritesByIds('file', [file1Id, fileLockedId, fileLocked2Id]);
      await apis.user.favorites.waitForApi({ expect: 3 });

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickFavoritesAndWait();
      done();
    });

    afterEach(async (done) => {
      await Utils.pressEscape();
      done();
    });

    xit('File is locked and downloaded when clicking Edit Offline - []', async () => {
      await dataTable.selectItem(file1);
      await toolbar.clickMoreActionsEditOffline();

      expect(await Utils.fileExistsOnOS(file1)).toBe(true, 'File not found in download location');
      expect(await apis.user.nodes.isFileLockedWrite(file1Id)).toBe(true, `${file1} is not locked`);
    });

    xit('Lock information is displayed - []', async () => {
      expect(await dataTable.isItemPresent(fileLocked2)).toBe(true, `${fileLocked2} is not displayed`);
      expect(await dataTable.hasLockIcon(fileLocked2)).toBe(true, `${fileLocked2} does not have a lock icon`);
      expect(await dataTable.getLockOwner(fileLocked2)).toContain(username, `${fileLocked2} does not have correct lock owner info`);
    });

    xit('Cancel Editing unlocks the file - []', async () => {
      await dataTable.selectItem(fileLocked);
      await toolbar.clickMoreActionsCancelEditing();
      await dataTable.clearSelection();

      expect(await apis.user.nodes.isFileLockedWrite(fileLockedId)).toBe(false, `${fileLocked} is still locked`);
      expect(await dataTable.hasLockIcon(fileLocked)).toBe(false, `${fileLocked} has a lock icon`);
    });
  });

});
