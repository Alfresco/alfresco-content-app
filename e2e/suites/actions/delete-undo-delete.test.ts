/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

  xit('');

  describe('on Personal Files', () => {
    const file1 = `file1-${Utils.random()}.txt`; let file1Id;
    const file2 = `file2-${Utils.random()}.txt`; let file2Id;
    const file3 = `file3-${Utils.random()}.txt`;
    const file4 = `file4-${Utils.random()}.txt`; let file4Id;
    const folder1 = `folder1-${Utils.random()}`; let folder1Id;
    const folder2 = `folder2-${Utils.random()}`; let folder2Id;
    const fileLocked1 = `fileLocked-${Utils.random()}.txt`; let fileLocked1Id;

    beforeAll(async (done) => {
      file1Id = (await apis.user.nodes.createFile(file1)).entry.id;
      file2Id = (await apis.user.nodes.createFile(file2)).entry.id;
      folder1Id = (await apis.user.nodes.createFolder(folder1)).entry.id;
      folder2Id = (await apis.user.nodes.createFolder(folder2)).entry.id;
      await apis.user.nodes.createFile(file3, folder1Id);
      file4Id = (await apis.user.nodes.createFile(file4, folder2Id)).entry.id;
      await apis.user.nodes.lockFile(file4Id);

      fileLocked1Id = (await apis.user.nodes.createFile(fileLocked1)).entry.id;
      await apis.user.nodes.lockFile(fileLocked1Id);

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickPersonalFilesAndWait();
      done();
    });

    afterEach(async (done) => {
      await page.refresh();
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.unlockFile(file4Id);
      await apis.user.nodes.unlockFile(fileLocked1Id);
      await apis.user.nodes.deleteNodesById([file1Id, file2Id, folder1Id, folder2Id, fileLocked1Id]);
      await apis.user.search.waitForApi(username, {expect: 0});
      done();
    });

    xit('delete a file and check notification - [C217125]', async () => {
      let items = await page.dataTable.countRows();

      await dataTable.selectItem(file1);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`${file1} deleted`);
      expect(await dataTable.getRowByName(file1).isPresent()).toBe(false, 'Item was not removed from list');
      items--;
      expect(await page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
      await page.clickTrash();
      expect(await dataTable.getRowByName(file1).isPresent()).toBe(true, 'Item is not in trash');

      await apis.user.trashcan.restore(file1Id);
    });

    xit('delete multiple files and check notification - [C280502]', async () => {
      let items = await page.dataTable.countRows();

      await dataTable.selectMultipleItems([file1, file2]);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Deleted 2 items`);
      expect(await dataTable.getRowByName(file1).isPresent()).toBe(false, `${file1} was not removed from list`);
      expect(await dataTable.getRowByName(file2).isPresent()).toBe(false, `${file2} was not removed from list`);
      items = items - 2;
      expect(await page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
      await page.clickTrash();
      expect(await dataTable.getRowByName(file1).isPresent()).toBe(true, `${file1} is not in trash`);
      expect(await dataTable.getRowByName(file2).isPresent()).toBe(true, `${file2} is not in trash`);

      await apis.user.trashcan.restore(file1Id);
      await apis.user.trashcan.restore(file2Id);
    });

    it('delete a folder with content - [C217126]', async () => {
      let items = await page.dataTable.countRows();

      await dataTable.selectItem(folder1);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      expect(await dataTable.getRowByName(folder1).isPresent()).toBe(false, 'Item was not removed from list');
      items--;
      expect(await page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
      await page.clickTrash();
      expect(await dataTable.getRowByName(folder1).isPresent()).toBe(true, 'Item is not in trash');
      expect(await dataTable.getRowByName(file3).isPresent()).toBe(false, 'Item is in trash');

      await apis.user.trashcan.restore(folder1Id);
    });

    it('delete a folder containing locked files - [C217127]', async () => {
      await dataTable.selectItem(folder2);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`${folder2} couldn't be deleted`);
      expect(await dataTable.getRowByName(folder2).isPresent()).toBe(true, 'Item was removed from list');
      await page.clickTrash();
      expect(await dataTable.getRowByName(folder2).isPresent()).toBe(false, 'Item is in trash');
      expect(await dataTable.getRowByName(file4).isPresent()).toBe(false, 'Item is in trash');
    });

    it('notification on multiple items deletion - some items fail to delete - [C217129]', async () => {
      await dataTable.selectMultipleItems([file1, folder2]);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Deleted 1 item, 1 couldn't be deleted`);

      await apis.user.trashcan.restore(file1Id);
    });

    it('notification on multiple items deletion - all items fail to delete - [C217130]', async () => {
      await dataTable.selectMultipleItems([fileLocked1, folder2]);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toEqual(`2 items couldn't be deleted`);
    });

    it('successful delete notification shows Undo action - [C217131]', async () => {
      await dataTable.selectItem(file1);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Undo`);

      await apis.user.trashcan.restore(file1Id);
    });

    it('unsuccessful delete notification does not show Undo action - [C217134]', async () => {
      await dataTable.selectItem(folder2);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).not.toContain(`Undo`);
    });

    it('undo delete of file - [C217132]', async () => {
      const items = await page.dataTable.countRows();

      await dataTable.selectItem(file1);
      await toolbar.openMoreMenu();

      await toolbar.menu.clickMenuItem('Delete');

      await page.clickSnackBarAction();
      expect(await dataTable.getRowByName(file1).isPresent()).toBe(true, 'Item was not restored');
      expect(await page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
    });

    it('undo delete of folder with content - [C280503]', async () => {
      const items = await page.dataTable.countRows();

      await dataTable.selectItem(folder1);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      await page.clickSnackBarAction();
      expect(await dataTable.getRowByName(folder1).isPresent()).toBe(true, 'Item was not restored');
      expect(await page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
      await dataTable.doubleClickOnRowByName(folder1);
      expect(await dataTable.getRowByName(file3).isPresent()).toBe(true, 'file from folder not restored');
    });

    xit('undo delete of multiple files - [C280504]', async () => {
      const items = await page.dataTable.countRows();

      await dataTable.selectMultipleItems([file1, file2]);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      await page.clickSnackBarAction();
      expect(await dataTable.getRowByName(file1).isPresent()).toBe(true, `${file1} was not removed from list`);
      expect(await dataTable.getRowByName(file2).isPresent()).toBe(true, `${file2} was not removed from list`);
      expect(await page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
    });
  });

  describe('on Shared Files', () => {
    const sharedFile1 = `sharedFile1-${Utils.random()}.txt`; let sharedFile1Id;
    const sharedFile2 = `sharedFile2-${Utils.random()}.txt`; let sharedFile2Id;
    const sharedFile3 = `sharedFile3-${Utils.random()}.txt`; let sharedFile3Id;
    const sharedFile4 = `sharedFile4-${Utils.random()}.txt`; let sharedFile4Id;

    beforeAll(async (done) => {
      sharedFile1Id = (await apis.user.nodes.createFile(sharedFile1)).entry.id;
      sharedFile2Id = (await apis.user.nodes.createFile(sharedFile2)).entry.id;
      sharedFile3Id = (await apis.user.nodes.createFile(sharedFile3)).entry.id;
      sharedFile4Id = (await apis.user.nodes.createFile(sharedFile4)).entry.id;
      await apis.user.shared.shareFilesByIds([sharedFile1Id, sharedFile2Id, sharedFile3Id, sharedFile4Id]);
      await apis.user.shared.waitForApi({ expect: 4 });

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickSharedFilesAndWait();
      done();
    });

    afterEach(async (done) => {
      await page.refresh();
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodesById([sharedFile1Id, sharedFile2Id, sharedFile3Id, sharedFile4Id]);
      await apis.user.search.waitForApi(username, {expect: 0});
      done();
    });

    xit('delete a file and check notification - [C280316]', async () => {
      await dataTable.selectItem(sharedFile1);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`${sharedFile1} deleted`);
      expect(await dataTable.getRowByName(sharedFile1).isPresent()).toBe(false, 'Item was not removed from list');
      await page.clickTrash();
      expect(await dataTable.getRowByName(sharedFile1).isPresent()).toBe(true, 'Item is not in trash');

      await apis.user.trashcan.restore(sharedFile1Id);
      await apis.user.shared.shareFilesByIds([ sharedFile1Id ]);
      await apis.user.shared.waitForApi({ expect: 4 });
    });

    xit('delete multiple files and check notification - [C280513]', async () => {
      await dataTable.selectMultipleItems([sharedFile2, sharedFile3]);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Deleted 2 items`);
      expect(await dataTable.getRowByName(sharedFile2).isPresent()).toBe(false, `${sharedFile2} was not removed from list`);
      expect(await dataTable.getRowByName(sharedFile3).isPresent()).toBe(false, `${sharedFile3} was not removed from list`);
      await page.clickTrash();
      expect(await dataTable.getRowByName(sharedFile2).isPresent()).toBe(true, `${sharedFile2} is not in trash`);
      expect(await dataTable.getRowByName(sharedFile3).isPresent()).toBe(true, `${sharedFile3} is not in trash`);

      await apis.user.trashcan.restore(sharedFile2Id);
      await apis.user.trashcan.restore(sharedFile3Id);
      await apis.user.shared.shareFilesByIds([ sharedFile2Id, sharedFile3Id ]);
      await apis.user.shared.waitForApi({ expect: 4 });
    });

    xit('successful delete notification shows Undo action - [C280323]', async () => {
      await dataTable.selectItem(sharedFile1);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Undo`);

      await apis.user.trashcan.restore(sharedFile1Id);
    });

    xit('undo delete of file - [C280324]', async () => {
      await dataTable.selectItem(sharedFile2);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      await page.clickSnackBarAction();
      await page.clickTrash();
      expect(await dataTable.getRowByName(sharedFile2).isPresent()).toBe(false, 'Item was not restored');
    });

    xit('undo delete of multiple files - [C280514]', async () => {
      await dataTable.selectMultipleItems([sharedFile3, sharedFile4]);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      await page.clickSnackBarAction();
      await page.clickTrash();
      expect(await dataTable.getRowByName(sharedFile3).isPresent()).toBe(false, `${sharedFile3} was not restored`);
      expect(await dataTable.getRowByName(sharedFile4).isPresent()).toBe(false, `${sharedFile4} was not restored`);
    });
  });

  describe('on Favorites', () => {
    const favoriteFile1 = `favFile1-${Utils.random()}.txt`; let favoriteFile1Id;
    const favoriteFile2 = `favFile2-${Utils.random()}.txt`; let favoriteFile2Id;
    const favoriteFile3 = `favFile3-${Utils.random()}.txt`;
    const favoriteFile4 = `favFile4-${Utils.random()}.txt`; let favoriteFile4Id;
    const favoriteFolder1 = `favFolder1-${Utils.random()}`; let favoriteFolder1Id;
    const favoriteFolder2 = `favFolder2-${Utils.random()}`; let favoriteFolder2Id;
    const favoriteFileLocked1 = `favFileLocked-${Utils.random()}.txt`; let favoriteFileLocked1Id;

    beforeAll(async (done) => {
      favoriteFile1Id = (await apis.user.nodes.createFile(favoriteFile1)).entry.id;
      favoriteFile2Id = (await apis.user.nodes.createFile(favoriteFile2)).entry.id;
      favoriteFolder1Id = (await apis.user.nodes.createFolder(favoriteFolder1)).entry.id;
      favoriteFolder2Id = (await apis.user.nodes.createFolder(favoriteFolder2)).entry.id;
      await apis.user.nodes.createFile(favoriteFile3, favoriteFolder1Id);
      favoriteFile4Id = (await apis.user.nodes.createFile(favoriteFile4, favoriteFolder2Id)).entry.id;
      await apis.user.nodes.lockFile(favoriteFile4Id);

      favoriteFileLocked1Id = (await apis.user.nodes.createFile(favoriteFileLocked1)).entry.id;
      await apis.user.nodes.lockFile(favoriteFileLocked1Id);

      await apis.user.favorites.addFavoritesByIds('file', [ favoriteFile1Id, favoriteFile2Id, favoriteFileLocked1Id ]);
      await apis.user.favorites.addFavoritesByIds('folder', [ favoriteFolder1Id, favoriteFolder2Id ]);
      await apis.user.favorites.waitForApi({ expect: 5 });

      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickFavoritesAndWait();
      done();
    });

    afterEach(async (done) => {
      await page.refresh();
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.unlockFile(favoriteFile4Id);
      await apis.user.nodes.unlockFile(favoriteFileLocked1Id);
      await apis.user.nodes.deleteNodesById([
        favoriteFile1Id, favoriteFile2Id, favoriteFolder1Id, favoriteFolder2Id, favoriteFileLocked1Id
      ]);
      await apis.user.search.waitForApi(username, {expect: 0});
      done();
    });

    xit('delete a file and check notification - [C280516]', async () => {
      let items = await page.dataTable.countRows();

      await dataTable.selectItem(favoriteFile1);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`${favoriteFile1} deleted`);
      expect(await dataTable.getRowByName(favoriteFile1).isPresent()).toBe(false, 'Item was not removed from list');
      items--;
      expect(await page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
      await page.clickTrash();
      expect(await dataTable.getRowByName(favoriteFile1).isPresent()).toBe(true, 'Item is not in trash');

      await apis.user.trashcan.restore(favoriteFile1Id);
    });

    xit('delete multiple files and check notification - [C280517]', async () => {
      let items = await page.dataTable.countRows();

      await dataTable.selectMultipleItems([favoriteFile1, favoriteFile2]);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Deleted 2 items`);
      expect(await dataTable.getRowByName(favoriteFile1).isPresent()).toBe(false, `${favoriteFile1} was not removed from list`);
      expect(await dataTable.getRowByName(favoriteFile2).isPresent()).toBe(false, `${favoriteFile2} was not removed from list`);
      items = items - 2;
      expect(await page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
      await page.clickTrash();
      expect(await dataTable.getRowByName(favoriteFile1).isPresent()).toBe(true, `${favoriteFile1} is not in trash`);
      expect(await dataTable.getRowByName(favoriteFile2).isPresent()).toBe(true, `${favoriteFile2} is not in trash`);

      await apis.user.trashcan.restore(favoriteFile1Id);
      await apis.user.trashcan.restore(favoriteFile2Id);
    });

    it('delete a folder with content - [C280518]', async () => {
      let items = await page.dataTable.countRows();
      await dataTable.selectItem(favoriteFolder1);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      expect(await dataTable.getRowByName(favoriteFolder1).isPresent()).toBe(false, 'Item was not removed from list');
      items--;
      expect(await page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
      await page.clickTrash();
      expect(await dataTable.getRowByName(favoriteFolder1).isPresent()).toBe(true, 'Item is not in trash');
      expect(await dataTable.getRowByName(favoriteFile3).isPresent()).toBe(false, 'Item is in trash');

      await apis.user.trashcan.restore(favoriteFolder1Id);
    });

    it('delete a folder containing locked files - [C280519]', async () => {
      await dataTable.selectItem(favoriteFolder2);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`${favoriteFolder2} couldn't be deleted`);
      expect(await dataTable.getRowByName(favoriteFolder2).isPresent()).toBe(true, 'Item was removed from list');
      await page.clickTrash();
      expect(await dataTable.getRowByName(favoriteFolder2).isPresent()).toBe(false, 'Item is in trash');
      expect(await dataTable.getRowByName(favoriteFile4).isPresent()).toBe(false, 'Item is in trash');
    });

    it('notification on multiple items deletion - some items fail to delete - [C280520]', async () => {
      await dataTable.selectMultipleItems([favoriteFile1, favoriteFolder2]);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Deleted 1 item, 1 couldn't be deleted`);

      await apis.user.trashcan.restore(favoriteFile1Id);
    });

    it('notification on multiple items deletion - all items fail to delete - [C280521]', async () => {
      await dataTable.selectMultipleItems([favoriteFileLocked1, favoriteFolder2]);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toEqual(`2 items couldn't be deleted`);
    });

    it('successful delete notification shows Undo action - [C280522]', async () => {
      await dataTable.selectItem(favoriteFile1);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Undo`);

      await apis.user.trashcan.restore(favoriteFile1Id);
    });

    it('unsuccessful delete notification does not show Undo action - [C280523]', async () => {
      await dataTable.selectItem(favoriteFolder2);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).not.toContain(`Undo`);
    });

    it('undo delete of file - [C280524]', async () => {
      const items = await page.dataTable.countRows();

      await dataTable.selectItem(favoriteFile1);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      await page.clickSnackBarAction();
      expect(await dataTable.getRowByName(favoriteFile1).isPresent()).toBe(true, 'Item was not restored');
      expect(await page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
    });

    it('undo delete of folder with content - [C280526]', async () => {
      const items = await page.dataTable.countRows();

      await dataTable.selectItem(favoriteFolder1);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      await page.clickSnackBarAction();
      expect(await dataTable.getRowByName(favoriteFolder1).isPresent()).toBe(true, 'Item was not restored');
      expect(await page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
      await dataTable.doubleClickOnRowByName(favoriteFolder1);
      expect(await dataTable.getRowByName(favoriteFile3).isPresent()).toBe(true, 'file from folder not restored');
    });

    it('undo delete of multiple files - [C280525]', async () => {
      const items = await page.dataTable.countRows();

      await dataTable.selectMultipleItems([favoriteFile1, favoriteFile2]);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      await page.clickSnackBarAction();
      expect(await dataTable.getRowByName(favoriteFile1).isPresent()).toBe(true, `${favoriteFile1} was not removed from list`);
      expect(await dataTable.getRowByName(favoriteFile2).isPresent()).toBe(true, `${favoriteFile2} was not removed from list`);
      expect(await page.pagination.range.getText()).toContain(`1-${items} of ${items}`);
    });
  });

  // TODO: try to change search.waitForApi to wait for exact number of items
  xdescribe('on Recent Files', () => {
    const recentFile1 = `recentFile1-${Utils.random()}.txt`; let recentFile1Id;
    const recentFile2 = `recentFile2-${Utils.random()}.txt`; let recentFile2Id;
    const recentFile3 = `recentFile3-${Utils.random()}.txt`; let recentFile3Id;
    const recentFile4 = `recentFile4-${Utils.random()}.txt`; let recentFile4Id;

    beforeAll(async (done) => {
      recentFile1Id = (await apis.user.nodes.createFile(recentFile1)).entry.id;
      recentFile2Id = (await apis.user.nodes.createFile(recentFile2)).entry.id;
      recentFile3Id = (await apis.user.nodes.createFile(recentFile3)).entry.id;
      recentFile4Id = (await apis.user.nodes.createFile(recentFile4)).entry.id;
      await apis.user.search.waitForApi(username, { expect: 4 });

      await loginPage.loginWith(username);

      await page.clickRecentFiles();
      const empty = await dataTable.isEmptyList();
      if (empty) {
        await browser.sleep(6000);
        await browser.refresh();
        await page.waitForApp();
      }
      done();
    });

    beforeEach(async (done) => {
      await page.clickRecentFilesAndWait();
      done();
    });

    afterEach(async (done) => {
      await page.refresh();
      done();
    });

    afterAll(async (done) => {
      await apis.user.nodes.deleteNodesById([recentFile1Id, recentFile2Id, recentFile3Id, recentFile4Id]);
      done();
    });

    xit('delete a file and check notification - [C280528]', async () => {
      await dataTable.selectItem(recentFile1);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`${recentFile1} deleted`);
      expect(await dataTable.getRowByName(recentFile1).isPresent()).toBe(false, 'Item was not removed from list');
      await page.clickTrash();
      expect(await dataTable.getRowByName(recentFile1).isPresent()).toBe(true, 'Item is not in trash');

      await apis.user.trashcan.restore(recentFile1Id);
      await apis.user.search.waitForApi(username, { expect: 4 });
    });

    xit('delete multiple files and check notification - [C280529]', async () => {
      await dataTable.selectMultipleItems([recentFile2, recentFile3]);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Deleted 2 items`);
      expect(await dataTable.getRowByName(recentFile2).isPresent()).toBe(false, `${recentFile2} was not removed from list`);
      expect(await dataTable.getRowByName(recentFile3).isPresent()).toBe(false, `${recentFile3} was not removed from list`);
      await page.clickTrash();
      expect(await dataTable.getRowByName(recentFile2).isPresent()).toBe(true, `${recentFile2} is not in trash`);
      expect(await dataTable.getRowByName(recentFile3).isPresent()).toBe(true, `${recentFile3} is not in trash`);

      await apis.user.trashcan.restore(recentFile2Id);
      await apis.user.trashcan.restore(recentFile3Id);
      await apis.user.search.waitForApi(username, { expect: 4 });
    });

    xit('successful delete notification shows Undo action - [C280534]', async () => {
      await dataTable.selectItem(recentFile1);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      const message = await page.getSnackBarMessage();
      expect(message).toContain(`Undo`);

      await apis.user.trashcan.restore(recentFile1Id);
      await apis.user.search.waitForApi(username, { expect: 4 });
    });

    // due to the fact that the search api is slow to update,
    // we cannot test that the restored file is displayed in the Recent Files list
    // without adding a very big browser.sleep followed by a page.refresh
    // so for the moment we're testing that the restored file is not displayed in the Trash
    xit('undo delete of file - [C280536]', async () => {
      await dataTable.selectItem(recentFile2);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      await page.clickSnackBarAction();
      await page.clickTrash();
      expect(await dataTable.getRowByName(recentFile2).isPresent()).toBe(false, 'Item is in Trash');
    });

    // due to the fact that the search api is slow to update,
    // we cannot test that the restored file is displayed in the Recent Files list
    // without adding a very big browser.sleep followed by a page.refresh
    // so for the moment we're testing that the restored file is not displayed in the Trash
    xit('undo delete of multiple files - [C280537]', async () => {
      await dataTable.selectMultipleItems([recentFile3, recentFile4]);
      await toolbar.openMoreMenu();
      await toolbar.menu.clickMenuItem('Delete');
      await page.clickSnackBarAction();
      await page.clickTrash();
      expect(await dataTable.getRowByName(recentFile3).isPresent()).toBe(false, `${recentFile3} is in Trash`);
      expect(await dataTable.getRowByName(recentFile4).isPresent()).toBe(false, `${recentFile4} is in Trash`);
    });
  });
});
