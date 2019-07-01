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

import { browser, protractor } from 'protractor';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';


describe('Generic tests : ', () => {

  const random = Utils.random();

  const username = `user-${random}`;

  const parent = `parent-${random}`; let parentId;

  const file1 = `file1-${random}.txt`;
  const file2 = `file2-${random}.txt`;

  const folder1 = `my-folder1-${Utils.random()}`;
  const folder2 = `my-folder2-${Utils.random()}`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const { searchInput } = page.header;
  const contextMenu = dataTable.menu;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    parentId = (await apis.user.nodes.createFolder(parent)).entry.id;
    await apis.user.nodes.createFile(file1, parentId);
    await apis.user.nodes.createFile(file2, parentId);

    await apis.user.nodes.createFolder(folder1, parentId);
    await apis.user.nodes.createFolder(folder2, parentId);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(parentId);
    done();
  });

  beforeEach(async (done) => {
    await Utils.pressEscape();
    await page.clickPersonalFilesAndWait();
    await dataTable.doubleClickOnRowByName(parent);
    await dataTable.waitForHeader();
    done();
  });

  afterEach(async (done) => {
    await Utils.pressEscape();
    done();
  });

  it('selected row is marked with a check circle icon - [C213134]', async () => {
    await dataTable.selectItem(file1);
    expect(await dataTable.hasCheckMarkIcon(file1)).toBe(true, 'check mark missing');
  });

  it('Row is marked with a check circle icon on direct right click - [C286252]', async () => {
    await dataTable.rightClickOnItem(file2);
    expect(await dataTable.hasCheckMarkIcon(file2)).toBe(true, 'check mark missing');
  });

  it('Context menu appears on direct right click on an item - [C286253]', async () => {
    await dataTable.rightClickOnItem(file1);
    expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
  });

  it('Context menu appears when selecting an item and then right clicking on it - [C286254]', async () => {
    await dataTable.selectItem(file2);
    await dataTable.rightClickOnItem(file2);
    expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
  });

  it('Context menu appears correctly when right clicking on another item - [C284666]', async () => {
    await dataTable.selectItem(file1);
    await dataTable.rightClickOnItem(file2);
    expect(await dataTable.hasContextMenu()).toBe(true, `Context menu is not displayed`);
    expect(await dataTable.hasCheckMarkIcon(file2)).toBe(true, `${file2} is not selected`);
    expect(await dataTable.hasCheckMarkIcon(file1)).toBe(false, `${file1} is not selected`);
  });

  it('Context menu closes when clicking away from it - [C280619]', async () => {
    await dataTable.rightClickOnItem(file1);
    expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
    await page.breadcrumb.getCurrentItem().click();
    expect(await dataTable.hasContextMenu()).toBe(false, 'Context menu is displayed');
  });

  describe('Actions are not displayed when no item is selected', () => {
    it('on Personal Files - [C213120]', async () => {
      await page.clickPersonalFilesAndWait();
      await dataTable.clearSelection();
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('on Trash - [C280452]', async () => {
      await page.clickTrash();
      await dataTable.clearSelection();
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('on Favorites - [C280449]', async () => {
      await page.clickFavorites();
      await dataTable.clearSelection();
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('on Recent Files - [C280447]', async () => {
      await page.clickRecentFilesAndWait();
      await dataTable.clearSelection();
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('on Shared Files - [C280445]', async () => {
      await page.clickSharedFiles();
      await dataTable.clearSelection();
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('on My Libraries - [C280439]', async () => {
      await page.goToMyLibraries();
      await dataTable.clearSelection();
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('on Favorite Libraries - [C280439]', async () => {
      await page.goToFavoriteLibraries();
      await dataTable.clearSelection();
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('on Search Results - [C291815]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkFilesAndFolders();
      await searchInput.searchFor('*');

      expect(await toolbar.isToggleSearchFiltersPresent()).toBe(true, `Search filter toggle is not displayed`);
      expect(await toolbar.numberOfAvailableActions()).toBe(1, `more than 1 action is present`);
    });
  });

  it('Context menu appears on right click on a multiple selection of items - [C286268]', async () => {
    await dataTable.selectMultipleItems([ file1, file2 ]);
    await dataTable.rightClickOnMultipleSelection();

    expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
  });

  it('Context menu appears when right clicking on a single item while having multiple items selected - [C286269]', async () => {
    await dataTable.selectMultipleItems([ file2, folder1 ]);
    await dataTable.rightClickOnItem(file1);

    expect(await dataTable.hasContextMenu()).toBe(true, `Context menu is not displayed for ${file1}`);
    expect(await dataTable.countSelectedRows()).toEqual(1, 'incorrect number of selected rows');
    expect(await contextMenu.isEditFolderPresent()).toBe(false, `Edit folder is displayed for ${file1}`);
    expect(await dataTable.hasCheckMarkIcon(file1)).toBe(true, `${file1} is not selected`);
    expect(await dataTable.hasCheckMarkIcon(file2)).toBe(false, `${file2} is selected`);
    expect(await dataTable.hasCheckMarkIcon(folder1)).toBe(false, `${folder1} is selected`);
  });

  it('Unselect items with single click - [C280458]', async () => {
    await dataTable.selectMultipleItems([file1, file2, folder1, folder2]);

    expect(await dataTable.countSelectedRows()).toEqual(4, 'incorrect selected rows number');

    await dataTable.clickItem(file1);

    expect(await dataTable.countSelectedRows()).toEqual(1, 'incorrect selected rows number');
  });

  it('Select / unselect items by CMD+click - [C217110]', async () => {
    await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
    await dataTable.clickItem(file1);
    await dataTable.clickItem(file2);
    await dataTable.clickItem(folder1);
    await dataTable.clickItem(folder2);
    await browser.actions().sendKeys(protractor.Key.NULL).perform();

    expect(await dataTable.countSelectedRows()).toEqual(4, 'incorrect selected rows number');

    await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
    await dataTable.clickItem(file1);
    await dataTable.clickItem(file2);
    await browser.actions().sendKeys(protractor.Key.NULL).perform();

    expect(await dataTable.countSelectedRows()).toEqual(2, 'incorrect selected rows number');
  });
});
