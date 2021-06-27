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

import { LoginPage, BrowsingPage, RepoClient, NodeContentTree, Utils, AdminActions } from '@alfresco/aca-testing-shared';
import { BrowserActions } from '@alfresco/adf-testing';

describe('Generic tests : ', () => {
  const random = Utils.random();

  const username = `user-${random}`;

  const parent = `parent-${random}`;

  const file1 = `file-${random}-1.txt`;
  const file2 = `file-${random}-2.txt`;

  const folder1 = `my-folder1-${random}`;
  const folder2 = `my-folder2-${random}`;

  const content: NodeContentTree = {
    name: parent,
    files: [file1, file2],
    folders: [folder1, folder2]
  };

  const userApi = new RepoClient(username, username);

  const adminApiActions = new AdminActions();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const { searchInput } = page.header;
  const contextMenu = dataTable.menu;

  beforeAll(async () => {
    await adminApiActions.createUser({ username });
    await userApi.nodes.createContent(content);
    await loginPage.loginWith(username);
  });

  afterAll(async () => {
    await userApi.nodes.deleteNodeByPath(parent);
  });

  beforeEach(async () => {
    await Utils.pressEscape();
  });

  describe('single selection', () => {
    beforeEach(async () => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      await dataTable.waitForHeader();
    });

    it('[C213134] selected row is marked with a check circle icon', async () => {
      await dataTable.selectItem(file1);
      expect(await dataTable.hasCheckMarkIcon(file1)).toBe(true, 'check mark missing');
    });

    it('[C286252] Row is marked with a check circle icon on direct right click', async () => {
      await dataTable.rightClickOnItem(file2);
      expect(await dataTable.hasCheckMarkIcon(file2)).toBe(true, 'check mark missing');
    });

    it('[C286253] Context menu appears on direct right click on an item', async () => {
      await dataTable.rightClickOnItem(file1);
      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
    });

    it('[C286254] Context menu appears when selecting an item and then right clicking on it', async () => {
      await dataTable.selectItem(file2);
      await dataTable.rightClickOnItem(file2);
      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
    });

    it('[C284666] Context menu appears correctly when right clicking on another item', async () => {
      await dataTable.selectItem(file1);
      await dataTable.rightClickOnItem(file2);
      expect(await dataTable.hasContextMenu()).toBe(true, `Context menu is not displayed`);
      expect(await dataTable.hasCheckMarkIcon(file2)).toBe(true, `${file2} is not selected`);
      expect(await dataTable.hasCheckMarkIcon(file1)).toBe(false, `${file1} is not selected`);
    });

    it('[C280619] Context menu closes when clicking away from it', async () => {
      await dataTable.rightClickOnItem(file1);
      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
      await BrowserActions.click(page.breadcrumb.currentItem);
      expect(await dataTable.hasContextMenu()).toBe(false, 'Context menu is displayed');
    });
  });

  describe('Actions are not displayed when no item is selected', () => {
    it('[C213120] on Personal Files', async () => {
      await page.clickPersonalFilesAndWait();
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('[C280452] on Trash', async () => {
      await page.clickTrash();
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('[C280449] on Favorites', async () => {
      await page.clickFavorites();
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('[C280447] on Recent Files', async () => {
      await userApi.search.waitForNodes(`file-${random}`, { expect: 2 });

      await page.clickRecentFilesAndWait();
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('[C280445] on Shared Files', async () => {
      await page.clickSharedFiles();
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('[C280439] on My Libraries', async () => {
      await page.goToMyLibraries();
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('[C280439] on Favorite Libraries', async () => {
      await page.goToFavoriteLibraries();
      expect(await toolbar.isEmpty()).toBe(true, `actions displayed though nothing selected`);
    });

    it('[C291815] on Search Results', async () => {
      await searchInput.clickSearchButton();
      await searchInput.searchFor('*');

      expect(await toolbar.isEmpty()).toEqual(true);
    });
  });

  describe('multiple selection', () => {
    beforeEach(async () => {
      await page.clickPersonalFilesAndWait();
      await dataTable.doubleClickOnRowByName(parent);
      await dataTable.waitForHeader();
    });

    it('[C286268] Context menu appears on right click on a multiple selection of items', async () => {
      await dataTable.selectMultipleItems([file1, file2]);
      await dataTable.rightClickOnMultipleSelection();

      expect(await dataTable.hasContextMenu()).toBe(true, 'Context menu is not displayed');
    });

    it('[C286269] Context menu appears when right clicking on a single item while having multiple items selected', async () => {
      await dataTable.selectMultipleItems([file2, folder1]);
      await dataTable.rightClickOnItem(file1);

      expect(await dataTable.hasContextMenu()).toBe(true, `Context menu is not displayed for ${file1}`);
      expect(await dataTable.getSelectedRowsCount()).toEqual(1, 'incorrect number of selected rows');
      expect(await contextMenu.editFolderAction.isPresent()).toBe(false, `Edit folder is displayed for ${file1}`);
      expect(await dataTable.hasCheckMarkIcon(file1)).toBe(true, `${file1} is not selected`);
      expect(await dataTable.hasCheckMarkIcon(file2)).toBe(false, `${file2} is selected`);
      expect(await dataTable.hasCheckMarkIcon(folder1)).toBe(false, `${folder1} is selected`);
    });

    it('[C280458] Unselect items with single click', async () => {
      await dataTable.selectMultipleItems([file1, file2, folder1, folder2]);
      expect(await dataTable.getSelectedRowsCount()).toEqual(4, 'incorrect selected rows number');

      await dataTable.clickItem(file1);
      expect(await dataTable.getSelectedRowsCount()).toEqual(1, 'incorrect selected rows number');
    });

    it('[C217110] Select / unselect items by CMD+click', async () => {
      await Utils.pressCmd();
      await dataTable.clickItem(file1);
      await dataTable.clickItem(file2);
      await dataTable.clickItem(folder1);
      await dataTable.clickItem(folder2);
      await Utils.releaseKeyPressed();
      expect(await dataTable.getSelectedRowsCount()).toEqual(4, 'incorrect selected rows number');

      await Utils.pressCmd();
      await dataTable.clickItem(file1);
      await dataTable.clickItem(file2);
      await Utils.releaseKeyPressed();
      expect(await dataTable.getSelectedRowsCount()).toEqual(2, 'incorrect selected rows number');
    });
  });
});
