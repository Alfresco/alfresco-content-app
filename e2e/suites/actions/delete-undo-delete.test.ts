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
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Delete and undo delete', () => {
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
    done();
  });

  afterAll(async (done) => {
    await apis.user.trashcan.emptyTrash();
    done();
  });

  describe('on Personal Files', () => {
    const file1 = `file1-${Utils.random()}.txt`;
    const file2 = `file2-${Utils.random()}.txt`;
    const file3 = `file3-${Utils.random()}.txt`;
    const file4 = `file4-${Utils.random()}.txt`;
    const file5 = `file5-${Utils.random()}.txt`;
    const file6 = `file6-${Utils.random()}.txt`;
    const file7 = `file7-${Utils.random()}.txt`;

    const folder1 = `folder1-${Utils.random()}`; let folder1Id;
    const folder2 = `folder2-${Utils.random()}`; let folder2Id;
    const folder3 = `folder3-${Utils.random()}`; let folder3Id;
    const folder4 = `folder4-${Utils.random()}`; let folder4Id;
    const folder5 = `folder5-${Utils.random()}`; let folder5Id;
    const folder6 = `folder6-${Utils.random()}`; let folder6Id;

    const file1InFolder = `file1InFolder-${Utils.random()}.txt`;
    const file2InFolder = `file2InFolder-${Utils.random()}.txt`;
    const fileLocked1 = `fileLocked1-${Utils.random()}.txt`; let fileLocked1Id;
    const fileLocked2 = `fileLocked2-${Utils.random()}.txt`; let fileLocked2Id;
    const fileLocked3 = `fileLocked3-${Utils.random()}.txt`; let fileLocked3Id;
    const fileLocked4 = `fileLocked4-${Utils.random()}.txt`; let fileLocked4Id;

    const parent = `parentPF-${Utils.random()}`; let parentId;

    beforeAll(async (done) => {
      parentId = (await apis.user.nodes.createFolder(parent)).entry.id;

      await apis.user.nodes.createFile(file1, parentId);
      await apis.user.nodes.createFile(file2, parentId);
      await apis.user.nodes.createFile(file3, parentId);
      await apis.user.nodes.createFile(file4, parentId);
      await apis.user.nodes.createFile(file5, parentId);
      await apis.user.nodes.createFile(file6, parentId);
      await apis.user.nodes.createFile(file7, parentId);

      folder1Id = (await apis.user.nodes.createFolder(folder1, parentId)).entry.id;
      folder2Id = (await apis.user.nodes.createFolder(folder2, parentId)).entry.id;
      folder3Id = (await apis.user.nodes.createFolder(folder3, parentId)).entry.id;
      folder4Id = (await apis.user.nodes.createFolder(folder4, parentId)).entry.id;
      folder5Id = (await apis.user.nodes.createFolder(folder5, parentId)).entry.id;
      folder6Id = (await apis.user.nodes.createFolder(folder6, parentId)).entry.id;

      await apis.user.nodes.createFile(file1InFolder, folder1Id);
      fileLocked1Id = (await apis.user.nodes.createFile(fileLocked1, folder2Id)).entry.id;
      fileLocked2Id = (await apis.user.nodes.createFile(fileLocked2, folder3Id)).entry.id;
      fileLocked3Id = (await apis.user.nodes.createFile(fileLocked3, folder4Id)).entry.id;
      fileLocked4Id = (await apis.user.nodes.createFile(fileLocked4, folder5Id)).entry.id;
      await apis.user.nodes.createFile(file2InFolder, folder6Id);

      await apis.user.nodes.lockFile(fileLocked1Id, 'FULL');
      await apis.user.nodes.lockFile(fileLocked2Id, 'FULL');
      await apis.user.nodes.lockFile(fileLocked3Id, 'FULL');
      await apis.user.nodes.lockFile(fileLocked4Id, 'FULL');

      await loginPage.loginWith(username);

      done();
    });

    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      await page.dataTable.doubleClickOnRowByName(parent);
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.unlockFile(fileLocked1Id);
      await apis.user.nodes.unlockFile(fileLocked2Id);
      await apis.user.nodes.unlockFile(fileLocked3Id);
      await apis.user.nodes.unlockFile(fileLocked4Id);
      await apis.user.nodes.deleteNodeById(parentId);
      await apis.user.trashcan.emptyTrash();
      done();
    });

    it('delete a file and check notification - [C217125]', async () => {
      let items = await page.dataTable.countRows();
      await dataTable.selectItem(file1);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`${file1} deleted`);
      expect(message).toContain(`Undo`);
      expect(await dataTable.isItemPresent(file1)).toBe(false, 'Item was not removed from list');
      items--;
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
      await page.clickTrash();
      expect(await dataTable.isItemPresent(file1)).toBe(true, 'Item is not in trash');
    });

    it('delete multiple files and check notification - [C280502]', async () => {
      let items = await page.dataTable.countRows();
      await dataTable.selectMultipleItems([file2, file3]);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Deleted 2 items`);
      expect(await dataTable.isItemPresent(file2)).toBe(false, `${file2} was not removed from list`);
      expect(await dataTable.isItemPresent(file3)).toBe(false, `${file3} was not removed from list`);
      items = items - 2;
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
      await page.clickTrash();
      expect(await dataTable.isItemPresent(file2)).toBe(true, `${file2} is not in trash`);
      expect(await dataTable.isItemPresent(file3)).toBe(true, `${file3} is not in trash`);
    });

    it('delete a folder with content - [C217126]', async () => {
      let items = await page.dataTable.countRows();
      await dataTable.selectItem(folder1);
      await toolbar.clickMoreActionsDelete();
      expect(await dataTable.isItemPresent(folder1)).toBe(false, 'Item was not removed from list');
      items--;
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
      await page.clickTrash();
      expect(await dataTable.isItemPresent(folder1)).toBe(true, 'Item is not in trash');
      expect(await dataTable.isItemPresent(file1InFolder)).toBe(false, 'Item is in trash');
    });

    it('delete a folder containing locked files - [C217127]', async () => {
      await dataTable.selectItem(folder2);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`${folder2} couldn't be deleted`);
      expect(message).not.toContain(`Undo`);
      expect(await dataTable.isItemPresent(folder2)).toBe(true, 'Item was removed from list');
      await page.clickTrash();
      expect(await dataTable.isItemPresent(folder2)).toBe(false, 'Item is in trash');
      expect(await dataTable.isItemPresent(fileLocked1)).toBe(false, 'Item is in trash');
    });

    it('notification on multiple items deletion - some items fail to delete - [C217129]', async () => {
      await dataTable.selectMultipleItems([file4, folder3]);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Deleted 1 item, 1 couldn't be deleted`);
      expect(message).toContain(`Undo`);
    });

    it('notification on multiple items deletion - all items fail to delete - [C217130]', async () => {
      await dataTable.selectMultipleItems([folder4, folder5]);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toEqual(`2 items couldn't be deleted`);
      expect(message).not.toContain(`Undo`);
    });

    it('undo delete of file - [C217132]', async () => {
      const items = await page.dataTable.countRows();

      await dataTable.selectItem(file5);
      await toolbar.clickMoreActionsDelete();

      await page.clickSnackBarAction();
      expect(await dataTable.isItemPresent(file5)).toBe(true, 'Item was not restored');
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
    });

    it('undo delete of folder with content - [C280503]', async () => {
      const items = await page.dataTable.countRows();

      await dataTable.selectItem(folder6);
      await toolbar.clickMoreActionsDelete();
      await page.clickSnackBarAction();
      expect(await dataTable.isItemPresent(folder6)).toBe(true, 'Item was not restored');
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
      await dataTable.doubleClickOnRowByName(folder6);
      expect(await dataTable.isItemPresent(file2InFolder)).toBe(true, 'file from folder not restored');
    });

    it('undo delete of multiple files - [C280504]', async () => {
      const items = await page.dataTable.countRows();

      await dataTable.selectMultipleItems([file6, file7]);
      await toolbar.clickMoreActionsDelete();
      await page.clickSnackBarAction();
      expect(await dataTable.isItemPresent(file6)).toBe(true, `${file6} was not removed from list`);
      expect(await dataTable.isItemPresent(file7)).toBe(true, `${file7} was not removed from list`);
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
    });
  });

  describe('on Shared Files', () => {
    const sharedFile1 = `sharedFile1-${Utils.random()}.txt`; let sharedFile1Id;
    const sharedFile2 = `sharedFile2-${Utils.random()}.txt`; let sharedFile2Id;
    const sharedFile3 = `sharedFile3-${Utils.random()}.txt`; let sharedFile3Id;
    const sharedFile4 = `sharedFile4-${Utils.random()}.txt`; let sharedFile4Id;
    const sharedFile5 = `sharedFile5-${Utils.random()}.txt`; let sharedFile5Id;
    const sharedFile6 = `sharedFile6-${Utils.random()}.txt`; let sharedFile6Id;

    const parent = `parentSF-${Utils.random()}`; let parentId;

    beforeAll(async (done) => {
      parentId = (await apis.user.nodes.createFolder(parent)).entry.id;

      sharedFile1Id = (await apis.user.nodes.createFile(sharedFile1, parentId)).entry.id;
      sharedFile2Id = (await apis.user.nodes.createFile(sharedFile2, parentId)).entry.id;
      sharedFile3Id = (await apis.user.nodes.createFile(sharedFile3, parentId)).entry.id;
      sharedFile4Id = (await apis.user.nodes.createFile(sharedFile4, parentId)).entry.id;
      sharedFile5Id = (await apis.user.nodes.createFile(sharedFile5, parentId)).entry.id;
      sharedFile6Id = (await apis.user.nodes.createFile(sharedFile6, parentId)).entry.id;
      await apis.user.shared.shareFilesByIds([
        sharedFile1Id,
        sharedFile2Id,
        sharedFile3Id,
        sharedFile4Id,
        sharedFile5Id,
        sharedFile6Id]);
      await apis.user.shared.waitForApi({ expect: 6 });

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickSharedFilesAndWait();
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodeById(parentId);
      await apis.user.trashcan.emptyTrash();
      done();
    });

    it('delete a file and check notification - [C280316]', async () => {
      await dataTable.selectItem(sharedFile1);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`${sharedFile1} deleted`);
      expect(message).toContain(`Undo`);
      expect(await dataTable.isItemPresent(sharedFile1)).toBe(false, 'Item was not removed from list');
      await page.clickTrash();
      expect(await dataTable.isItemPresent(sharedFile1)).toBe(true, 'Item is not in trash');
    });

    it('delete multiple files and check notification - [C280513]', async () => {
      await dataTable.selectMultipleItems([sharedFile2, sharedFile3]);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Deleted 2 items`);
      expect(message).toContain(`Undo`);
      expect(await dataTable.isItemPresent(sharedFile2)).toBe(false, `${sharedFile2} was not removed from list`);
      expect(await dataTable.isItemPresent(sharedFile3)).toBe(false, `${sharedFile3} was not removed from list`);
      await page.clickTrash();
      expect(await dataTable.isItemPresent(sharedFile2)).toBe(true, `${sharedFile2} is not in trash`);
      expect(await dataTable.isItemPresent(sharedFile3)).toBe(true, `${sharedFile3} is not in trash`);
    });

    it('undo delete of file - [C280324]', async () => {
      await dataTable.selectItem(sharedFile4);
      await toolbar.clickMoreActionsDelete();
      await page.clickSnackBarAction();
      await page.clickTrash();
      expect(await dataTable.isItemPresent(sharedFile4)).toBe(false, 'Item was not restored');
    });

    it('undo delete of multiple files - [C280514]', async () => {
      await dataTable.selectMultipleItems([sharedFile5, sharedFile6]);
      await toolbar.clickMoreActionsDelete();
      await page.clickSnackBarAction();
      await page.clickTrash();
      expect(await dataTable.isItemPresent(sharedFile5)).toBe(false, `${sharedFile5} was not restored`);
      expect(await dataTable.isItemPresent(sharedFile6)).toBe(false, `${sharedFile6} was not restored`);
    });
  });

  describe('on Favorites', () => {
    const parent = `parentF-${Utils.random()}`; let parentId;

    const favFile1 = `favFile1-${Utils.random()}.txt`; let favFile1Id;
    const favFile2 = `favFile2-${Utils.random()}.txt`; let favFile2Id;
    const favFile3 = `favFile3-${Utils.random()}.txt`; let favFile3Id;
    const favFile4 = `favFile4-${Utils.random()}.txt`; let favFile4Id;
    const favFile5 = `favFile5-${Utils.random()}.txt`; let favFile5Id;
    const favFile6 = `favFile6-${Utils.random()}.txt`; let favFile6Id;
    const favFile7 = `favFile7-${Utils.random()}.txt`; let favFile7Id;

    const favFolder1 = `favFolder1-${Utils.random()}`; let favFolder1Id;
    const favFolder2 = `favFolder2-${Utils.random()}`; let favFolder2Id;
    const favFolder3 = `favFolder3-${Utils.random()}`; let favFolder3Id;
    const favFolder4 = `favFolder4-${Utils.random()}`; let favFolder4Id;
    const favFolder5 = `favFolder5-${Utils.random()}`; let favFolder5Id;
    const favFolder6 = `favFolder6-${Utils.random()}`; let favFolder6Id;

    const file1InFolder = `file1InFolder-${Utils.random()}.txt`;
    const file2InFolder = `file2InFolder-${Utils.random()}.txt`;
    const fileLocked1 = `fileLocked1-${Utils.random()}.txt`; let fileLocked1Id;
    const fileLocked2 = `fileLocked2-${Utils.random()}.txt`; let fileLocked2Id;
    const fileLocked3 = `fileLocked3-${Utils.random()}.txt`; let fileLocked3Id;
    const fileLocked4 = `fileLocked4-${Utils.random()}.txt`; let fileLocked4Id;

    beforeAll(async (done) => {
      parentId = (await apis.user.nodes.createFolder(parent)).entry.id;

      favFile1Id = (await apis.user.nodes.createFile(favFile1, parentId)).entry.id;
      favFile2Id = (await apis.user.nodes.createFile(favFile2, parentId)).entry.id;
      favFile3Id = (await apis.user.nodes.createFile(favFile3, parentId)).entry.id;
      favFile4Id = (await apis.user.nodes.createFile(favFile4, parentId)).entry.id;
      favFile5Id = (await apis.user.nodes.createFile(favFile5, parentId)).entry.id;
      favFile6Id = (await apis.user.nodes.createFile(favFile6, parentId)).entry.id;
      favFile7Id = (await apis.user.nodes.createFile(favFile7, parentId)).entry.id;

      favFolder1Id = (await apis.user.nodes.createFolder(favFolder1, parentId)).entry.id;
      favFolder2Id = (await apis.user.nodes.createFolder(favFolder2, parentId)).entry.id;
      favFolder3Id = (await apis.user.nodes.createFolder(favFolder3, parentId)).entry.id;
      favFolder4Id = (await apis.user.nodes.createFolder(favFolder4, parentId)).entry.id;
      favFolder5Id = (await apis.user.nodes.createFolder(favFolder5, parentId)).entry.id;
      favFolder6Id = (await apis.user.nodes.createFolder(favFolder6, parentId)).entry.id;

      await apis.user.nodes.createFile(file1InFolder, favFolder1Id);
      fileLocked1Id = (await apis.user.nodes.createFile(fileLocked1, favFolder2Id)).entry.id;
      fileLocked2Id = (await apis.user.nodes.createFile(fileLocked2, favFolder3Id)).entry.id;
      fileLocked3Id = (await apis.user.nodes.createFile(fileLocked3, favFolder4Id)).entry.id;
      fileLocked4Id = (await apis.user.nodes.createFile(fileLocked4, favFolder5Id)).entry.id;
      await apis.user.nodes.createFile(file2InFolder, favFolder6Id);

      await apis.user.nodes.lockFile(fileLocked1Id, 'FULL');
      await apis.user.nodes.lockFile(fileLocked2Id, 'FULL');
      await apis.user.nodes.lockFile(fileLocked3Id, 'FULL');
      await apis.user.nodes.lockFile(fileLocked4Id, 'FULL');

      await apis.user.favorites.addFavoritesByIds('file', [ favFile1Id, favFile2Id, favFile3Id, favFile4Id, favFile5Id, favFile6Id, favFile7Id ]);
      await apis.user.favorites.addFavoritesByIds('folder', [ favFolder1Id, favFolder2Id, favFolder3Id, favFolder4Id, favFolder5Id, favFolder6Id ]);
      await apis.user.favorites.waitForApi({ expect: 13 });

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickFavoritesAndWait();
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.unlockFile(fileLocked1Id);
      await apis.user.nodes.unlockFile(fileLocked2Id);
      await apis.user.nodes.unlockFile(fileLocked3Id);
      await apis.user.nodes.unlockFile(fileLocked4Id);
      await apis.user.nodes.deleteNodeById(parentId);
      await apis.user.trashcan.emptyTrash();
      done();
    });

    it('delete a file and check notification - [C280516]', async () => {
      let items = await page.dataTable.countRows();

      await dataTable.selectItem(favFile1);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`${favFile1} deleted`);
      expect(message).toContain(`Undo`);
      expect(await dataTable.isItemPresent(favFile1)).toBe(false, 'Item was not removed from list');
      items--;
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
      await page.clickTrash();
      expect(await dataTable.isItemPresent(favFile1)).toBe(true, 'Item is not in trash');
    });

    it('delete multiple files and check notification - [C280517]', async () => {
      let items = await page.dataTable.countRows();

      await dataTable.selectMultipleItems([favFile2, favFile3]);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Deleted 2 items`);
      expect(message).toContain(`Undo`);
      expect(await dataTable.isItemPresent(favFile2)).toBe(false, `${favFile2} was not removed from list`);
      expect(await dataTable.isItemPresent(favFile3)).toBe(false, `${favFile3} was not removed from list`);
      items = items - 2;
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
      await page.clickTrash();
      expect(await dataTable.isItemPresent(favFile2)).toBe(true, `${favFile2} is not in trash`);
      expect(await dataTable.isItemPresent(favFile3)).toBe(true, `${favFile3} is not in trash`);
    });

    it('delete a folder with content - [C280518]', async () => {
      let items = await page.dataTable.countRows();
      await dataTable.selectItem(favFolder1);
      await toolbar.clickMoreActionsDelete();
      expect(await dataTable.isItemPresent(favFolder1)).toBe(false, 'Item was not removed from list');
      items--;
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
      await page.clickTrash();
      expect(await dataTable.isItemPresent(favFolder1)).toBe(true, 'Item is not in trash');
      expect(await dataTable.isItemPresent(file1InFolder)).toBe(false, 'Item is in trash');
    });

    it('delete a folder containing locked files - [C280519]', async () => {
      await dataTable.selectItem(favFolder2);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`${favFolder2} couldn't be deleted`);
      expect(await dataTable.isItemPresent(favFolder2)).toBe(true, 'Item was removed from list');
      await page.clickTrash();
      expect(await dataTable.isItemPresent(favFolder2)).toBe(false, 'Item is in trash');
      expect(await dataTable.isItemPresent(fileLocked1)).toBe(false, 'Item is in trash');
    });

    it('notification on multiple items deletion - some items fail to delete - [C280520]', async () => {
      await dataTable.selectMultipleItems([favFile4, favFolder3]);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Deleted 1 item, 1 couldn't be deleted`);
      expect(message).toContain(`Undo`);
    });

    it('notification on multiple items deletion - all items fail to delete - [C280521]', async () => {
      await dataTable.selectMultipleItems([favFolder4, favFolder5]);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toEqual(`2 items couldn't be deleted`);
      expect(message).not.toContain(`Undo`);
    });

    it('undo delete of file - [C280524]', async () => {
      const items = await page.dataTable.countRows();

      await dataTable.selectItem(favFile5);
      await toolbar.clickMoreActionsDelete();
      await page.clickSnackBarAction();
      expect(await dataTable.isItemPresent(favFile5)).toBe(true, 'Item was not restored');
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
    });

    it('undo delete of folder with content - [C280526]', async () => {
      const items = await page.dataTable.countRows();

      await dataTable.selectItem(favFolder6);
      await toolbar.clickMoreActionsDelete();
      await page.clickSnackBarAction();
      expect(await dataTable.isItemPresent(favFolder6)).toBe(true, 'Item was not restored');
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
      await dataTable.doubleClickOnRowByName(favFolder6);
      expect(await dataTable.isItemPresent(file2InFolder)).toBe(true, 'file from folder not restored');
    });

    it('undo delete of multiple files - [C280525]', async () => {
      const items = await page.dataTable.countRows();

      await dataTable.selectMultipleItems([favFile6, favFile7]);
      await toolbar.clickMoreActionsDelete();
      await page.clickSnackBarAction();
      expect(await dataTable.isItemPresent(favFile6)).toBe(true, `${favFile6} was not removed from list`);
      expect(await dataTable.isItemPresent(favFile7)).toBe(true, `${favFile7} was not removed from list`);
      expect(await page.pagination.getRange()).toContain(`1-${items} of ${items}`);
    });
  });

  describe('on Recent Files', () => {
    const parent = `parentRF-${Utils.random()}`; let parentId;

    const recentFile1 = `recentFile1-${Utils.random()}.txt`;
    const recentFile2 = `recentFile2-${Utils.random()}.txt`;
    const recentFile3 = `recentFile3-${Utils.random()}.txt`;
    const recentFile4 = `recentFile4-${Utils.random()}.txt`;
    const recentFile5 = `recentFile5-${Utils.random()}.txt`;
    const recentFile6 = `recentFile6-${Utils.random()}.txt`;

    beforeAll(async (done) => {
      parentId = (await apis.user.nodes.createFolder(parent)).entry.id;

      await apis.user.nodes.createFile(recentFile1, parentId);
      await apis.user.nodes.createFile(recentFile2, parentId);
      await apis.user.nodes.createFile(recentFile3, parentId);
      await apis.user.nodes.createFile(recentFile4, parentId);
      await apis.user.nodes.createFile(recentFile5, parentId);
      await apis.user.nodes.createFile(recentFile6, parentId);
      await apis.user.search.waitForApi(username, { expect: 6 });

      await loginPage.loginWith(username);

      await page.clickRecentFiles();
      done();
    });

    beforeEach(async (done) => {
      await page.clickRecentFilesAndWait();
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodeById(parentId);
      await apis.user.trashcan.emptyTrash();
      done();
    });

    it('delete a file and check notification - [C280528]', async () => {
      await dataTable.selectItem(recentFile1);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`${recentFile1} deleted`);
      expect(message).toContain(`Undo`);
      expect(await dataTable.isItemPresent(recentFile1)).toBe(false, 'Item was not removed from list');
      await page.clickTrash();
      expect(await dataTable.isItemPresent(recentFile1)).toBe(true, 'Item is not in trash');
    });

    it('delete multiple files and check notification - [C280529]', async () => {
      await dataTable.selectMultipleItems([recentFile2, recentFile3]);
      await toolbar.clickMoreActionsDelete();
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Deleted 2 items`);
      expect(message).toContain(`Undo`);
      expect(await dataTable.isItemPresent(recentFile2)).toBe(false, `${recentFile2} was not removed from list`);
      expect(await dataTable.isItemPresent(recentFile3)).toBe(false, `${recentFile3} was not removed from list`);
      await page.clickTrash();
      expect(await dataTable.isItemPresent(recentFile2)).toBe(true, `${recentFile2} is not in trash`);
      expect(await dataTable.isItemPresent(recentFile3)).toBe(true, `${recentFile3} is not in trash`);
    });

    // due to the fact that the search api is slow to update,
    // we cannot test that the restored file is displayed in the Recent Files list
    // without adding a very big browser.sleep followed by a page.refresh
    // so for the moment we're testing that the restored file is not displayed in the Trash
    it('undo delete of file - [C280536]', async () => {
      await dataTable.selectItem(recentFile4);
      await toolbar.clickMoreActionsDelete();
      await page.clickSnackBarAction();
      await page.clickTrash();
      expect(await dataTable.isItemPresent(recentFile4)).toBe(false, 'Item is in Trash');
    });

    // due to the fact that the search api is slow to update,
    // we cannot test that the restored file is displayed in the Recent Files list
    // without adding a very big browser.sleep followed by a page.refresh
    // so for the moment we're testing that the restored file is not displayed in the Trash
    it('undo delete of multiple files - [C280537]', async () => {
      await dataTable.selectMultipleItems([recentFile5, recentFile6]);
      await toolbar.clickMoreActionsDelete();
      await page.clickSnackBarAction();
      await page.clickTrash();
      expect(await dataTable.isItemPresent(recentFile5)).toBe(false, `${recentFile5} is in Trash`);
      expect(await dataTable.isItemPresent(recentFile6)).toBe(false, `${recentFile6} is in Trash`);
    });
  });
});
