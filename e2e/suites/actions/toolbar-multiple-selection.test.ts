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

import { browser, protractor } from 'protractor';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { SITE_VISIBILITY } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Toolbar actions - multiple selection : ', () => {
  const username = `user-${Utils.random()}`;

  const file1 = `file1-${Utils.random()}.txt`;
  let file1Id;
  const file2 = `file2-${Utils.random()}.txt`;
  let file2Id;

  const folder1 = `folder1-${Utils.random()}`;
  let folder1Id;
  const folder2 = `folder2-${Utils.random()}`;
  let folder2Id;

  const fileForDelete1 = `file-${Utils.random()}.txt`;
  let fileForDelete1Id;
  const fileForDelete2 = `file-${Utils.random()}.txt`;
  let fileForDelete2Id;
  const folderForDelete1 = `folder-${Utils.random()}`;
  let folderForDelete1Id;
  const folderForDelete2 = `folder-${Utils.random()}`;
  let folderForDelete2Id;

  const siteName = `site-${Utils.random()}`;
  const file1InSite = `file1-${Utils.random()}.txt`;
  const file2InSite = `file2-${Utils.random()}.txt`;
  const folder1InSite = `folder1-${Utils.random()}`;
  const folder2InSite = `folder2-${Utils.random()}`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;

  beforeAll(async done => {
    await apis.admin.people.createUser({ username });

    file1Id = (await apis.user.nodes.createFiles([file1])).entry.id;
    file2Id = (await apis.user.nodes.createFiles([file2])).entry.id;
    folder1Id = (await apis.user.nodes.createFolders([folder1])).entry.id;
    folder2Id = (await apis.user.nodes.createFolders([folder2])).entry.id;
    fileForDelete1Id = (await apis.user.nodes.createFiles([fileForDelete1])).entry.id;
    fileForDelete2Id = (await apis.user.nodes.createFiles([fileForDelete2])).entry.id;
    folderForDelete1Id = (await apis.user.nodes.createFolders([folderForDelete1])).entry.id;
    folderForDelete2Id = (await apis.user.nodes.createFolders([folderForDelete2])).entry.id;

    await apis.user.shared.shareFilesByIds([file1Id, file2Id]);
    await apis.user.shared.waitForApi({ expect: 2 });

    await apis.user.favorites.addFavoritesByIds('file', [file1Id, file2Id]);
    await apis.user.favorites.addFavoritesByIds('folder', [folder1Id, folder2Id]);
    await apis.user.favorites.waitForApi({ expect: 4 });

    await apis.user.nodes.deleteNodesById([fileForDelete1Id, fileForDelete2Id, folderForDelete1Id, folderForDelete2Id], false);
    await apis.user.trashcan.waitForApi({ expect: 4 });

    await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PRIVATE);
    const docLibId = await apis.user.sites.getDocLibId(siteName);
    await apis.user.nodes.createFile(file1InSite, docLibId);
    await apis.user.nodes.createFile(file2InSite, docLibId);
    await apis.user.nodes.createFolder(folder1InSite, docLibId);
    await apis.user.nodes.createFolder(folder2InSite, docLibId);
    await apis.user.search.waitForApi(username, { expect: 4 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async done => {
    await Promise.all([
      apis.user.nodes.deleteNodesById([file1Id, file2Id, folder1Id, folder2Id]),
      apis.user.trashcan.emptyTrash(),
      apis.user.sites.deleteSite(siteName)
    ]);
    done();
  });

  xit('');

  describe('Personal Files', () => {
    beforeEach(async done => {
      await Utils.pressEscape();
      await page.clickPersonalFilesAndWait();
      await dataTable.clearSelection();
      done();
    });

    it('Unselect items with single click - [C280458]', async () => {
      await dataTable.selectMultipleItems([file1, file2, folder1, folder2]);
      expect(await dataTable.countSelectedRows()).toEqual(4, 'incorrect selected rows number');
      await dataTable.selectItem(file1);
      expect(await dataTable.countSelectedRows()).toEqual(1, 'incorrect selected rows number');
    });

    it('Select / unselect selected items by CMD+click - [C217110]', async () => {
      await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
      await dataTable.selectItem(file1);
      await dataTable.selectItem(file2);
      await dataTable.selectItem(folder1);
      await dataTable.selectItem(folder2);
      await browser.actions().sendKeys(protractor.Key.NULL).perform();
      expect(await dataTable.countSelectedRows()).toEqual(4, 'incorrect selected rows number');
      await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
      await dataTable.selectItem(file1);
      await dataTable.selectItem(file2);
      await browser.actions().sendKeys(protractor.Key.NULL).perform();

      expect(await dataTable.countSelectedRows()).toEqual(2, 'incorrect selected rows number');
    });

    it('correct actions appear when multiple files are selected - [C217112]', async () => {
      await dataTable.selectMultipleItems([file1, file2]);
      expect(await toolbar.isButtonPresent('View')).toBe(false, 'View is displayed');
      expect(await toolbar.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when multiple folders are selected - [C280459]', async () => {
      await dataTable.selectMultipleItems([folder1, folder2]);
      expect(await toolbar.isButtonPresent('View')).toBe(false, 'View is displayed');
      expect(await toolbar.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
      await toolbar.closeMoreMenu();
    });

    it('correct actions appear when both files and folders are selected - [C280460]', async () => {
      await dataTable.selectMultipleItems([file1, file2, folder1, folder2]);
      expect(await toolbar.isButtonPresent('View')).toBe(false, 'View is displayed');
      expect(await toolbar.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
      await toolbar.closeMoreMenu();
    });
  });

  describe('File Libraries', () => {
    beforeEach(async done => {
      await Utils.pressEscape();
      await page.clickFileLibrariesAndWait();
      await dataTable.doubleClickOnRowByName(siteName);
      await dataTable.waitForHeader();
      await dataTable.clearSelection();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280461]', async () => {
      await dataTable.selectMultipleItems([file1InSite, file2InSite]);
      expect(await toolbar.isButtonPresent('View')).toBe(false, 'View is displayed for selected files');
      expect(await toolbar.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
    });

    it('correct actions appear when multiple folders are selected - [C280462]', async () => {
      await dataTable.selectMultipleItems([folder1InSite, folder2InSite]);
      expect(await toolbar.isButtonPresent('View')).toBe(false, 'View is displayed');
      expect(await toolbar.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
    });

    it('correct actions appear when both files and folders are selected - [C280463]', async () => {
      await dataTable.selectMultipleItems([file1InSite, file2InSite, folder1InSite, folder2InSite]);
      expect(await toolbar.isButtonPresent('View')).toBe(false, 'View is displayed');
      expect(await toolbar.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
    });
  });

  describe('Shared Files', () => {
    beforeEach(async done => {
      // await browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform();
      await Utils.pressEscape();
      await page.clickSharedFilesAndWait();
      await dataTable.clearSelection();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280467]', async () => {
      await dataTable.selectMultipleItems([file1, file2]);
      expect(await toolbar.isButtonPresent('View')).toBe(false, 'View is displayed');
      expect(await toolbar.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, 'Edit is displayed for selected files');
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
    });
  });

  describe('Recent Files', () => {
    beforeEach(async done => {
      await Utils.pressEscape();
      await page.clickRecentFilesAndWait();
      await dataTable.clearSelection();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280468]', async () => {
      await dataTable.selectMultipleItems([file1, file2]);
      expect(await toolbar.isButtonPresent('View')).toBe(false, 'View is displayed');
      expect(await toolbar.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
    });
  });

  describe('Favorites', () => {
    beforeEach(async done => {
      // await browser.actions().mouseMove(browser.$('body'), { x: 0, y: 0 }).click().perform();
      await Utils.pressEscape();
      await page.clickFavoritesAndWait();
      await dataTable.clearSelection();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280469]', async () => {
      await dataTable.selectMultipleItems([file1, file2]);
      expect(await toolbar.isButtonPresent('View')).toBe(false, 'View is displayed');
      expect(await toolbar.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
    });

    it('correct actions appear when multiple folders are selected - [C280470]', async () => {
      await dataTable.selectMultipleItems([folder1, folder2]);
      expect(await toolbar.isButtonPresent('View')).toBe(false, 'View is displayed');
      expect(await toolbar.isButtonPresent('Download')).toBe(true, 'Download is not displayed');
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
    });

    it('correct actions appear when both files and folders are selected - [C280471]', async () => {
      await dataTable.selectMultipleItems([file1, file2, folder1, folder2]);
      expect(await toolbar.isButtonPresent('View')).toBe(false, 'View is displayed');
      expect(await toolbar.isButtonPresent('Download')).toBe(true, 'Download is not displayed for selected files');
      expect(await toolbar.isButtonPresent('Edit')).toBe(false, 'Edit is displayed');
      await toolbar.openMoreMenu();
      expect(await toolbar.menu.isMenuItemPresent('Copy')).toBe(true, `Copy is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Delete')).toBe(true, `Delete is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Move')).toBe(true, `Move is not displayed for selected files`);
      expect(await toolbar.menu.isMenuItemPresent('Favorite')).toBe(true, `Favorite is not displayed for selected files`);
    });
  });

  describe('Trash', () => {
    beforeEach(async done => {
      await Utils.pressEscape();
      await page.clickTrashAndWait();
      await dataTable.clearSelection();
      done();
    });

    it('correct actions appear when multiple files are selected - [C280472]', async () => {
      await dataTable.selectMultipleItems([fileForDelete1, fileForDelete2]);
      expect(await toolbar.isButtonPresent('Permanently delete')).toBe(true, 'Permanently delete is displayed');
      expect(await toolbar.isButtonPresent('Restore')).toBe(true, 'Restore is not displayed');
    });

    it('correct actions appear when multiple folders are selected - [C280473]', async () => {
      await dataTable.selectMultipleItems([folderForDelete1, folderForDelete2]);
      expect(await toolbar.isButtonPresent('Permanently delete')).toBe(true, 'Permanently delete is displayed');
      expect(await toolbar.isButtonPresent('Restore')).toBe(true, 'Restore is not displayed');
    });

    it('correct actions appear when both files and folders are selected - [C280474]', async () => {
      await dataTable.selectMultipleItems([fileForDelete1, fileForDelete2, folderForDelete1, folderForDelete2]);
      expect(await toolbar.isButtonPresent('Permanently delete')).toBe(true, 'Permanently delete is displayed');
      expect(await toolbar.isButtonPresent('Restore')).toBe(true, 'Restore is not displayed');
    });
  });
});
