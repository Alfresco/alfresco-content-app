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

import { AdminActions, LoginPage, BrowsingPage, EXTENSIBILITY_CONFIGS, RepoClient, Utils } from '@alfresco/aca-testing-shared';

describe('Extensions - Context submenu', () => {
  const username = `user-${Utils.random()}`;
  const file = `file-${Utils.random()}.txt`;
  let fileId: string;
  const folder = `folder-${Utils.random()}`;
  let folderId: string;

  const restrictedPermissionsItem = 'Share';

  const menuItem1 = {
    label: 'Test Menu1',
    submenu: ['Test submenu1', 'Test submenu2', restrictedPermissionsItem]
  };
  const menuItem2 = {
    label: 'Test Menu2',
    submenu: [restrictedPermissionsItem]
  };

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const contextMenu = dataTable.menu;
  const adminApiActions = new AdminActions();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });
    fileId = (await apis.user.nodes.createFile(file)).entry.id;
    folderId = (await apis.user.nodes.createFolder(folder)).entry.id;

    await loginPage.load();
    await Utils.setSessionStorageFromConfig(EXTENSIBILITY_CONFIGS.CONTEXT_SUBMENUS);
    await loginPage.loginWith(username);

    done();
  });

  beforeEach(async (done) => {
    await Utils.pressEscape();
    await dataTable.clearSelection();
    await page.clickPersonalFilesAndWait();
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(fileId, true);
    await apis.user.nodes.deleteNodeById(folderId, true);
    done();
  });

  it('[C286717] Displays the submenu actions set from config', async () => {
    await dataTable.rightClickOnItem(file);
    expect(await contextMenu.isMenuItemPresent(menuItem1.label)).toBe(true, `${menuItem1.label} is not displayed for ${file}`);
    expect(await contextMenu.hasSubMenu(menuItem1.label)).toBe(true, 'Menu does not have submenu');
    await contextMenu.mouseOverMenuItem(menuItem1.label);

    expect(await contextMenu.getSubmenuItemsCount()).toBe(3, 'submenu has wrong number of items');
    expect(await contextMenu.isSubMenuItemPresent(menuItem1.submenu[0])).toBe(true, `${menuItem1.submenu[0]} is not displayed for ${file}`);
    expect(await contextMenu.isSubMenuItemPresent(menuItem1.submenu[1])).toBe(true, `${menuItem1.submenu[1]} is not displayed for ${file}`);
    expect(await contextMenu.isSubMenuItemPresent(menuItem1.submenu[2])).toBe(true, `${restrictedPermissionsItem} is not displayed for ${file}`);
  });

  it('[C286718] Does not display submenu actions without permissions', async () => {
    await dataTable.rightClickOnItem(folder);
    expect(await contextMenu.isMenuItemPresent(menuItem1.label)).toBe(true, `${menuItem1.label} is not displayed for ${folder}`);
    await contextMenu.mouseOverMenuItem(menuItem1.label);

    expect(await contextMenu.getSubmenuItemsCount()).toBe(2, 'submenu has wrong number of items');
    expect(await contextMenu.isSubMenuItemPresent(menuItem1.submenu[0])).toBe(true, `${menuItem1.submenu[0]} is not displayed for ${file}`);
    expect(await contextMenu.isSubMenuItemPresent(menuItem1.submenu[1])).toBe(true, `${menuItem1.submenu[1]} is not displayed for ${file}`);
    expect(await contextMenu.isSubMenuItemPresent(menuItem1.submenu[2])).toBe(
      false,
      `no permission submenu ${restrictedPermissionsItem} is displayed`
    );
  });

  it('[C287784] The parent item is not displayed if all its children have no permission to be displayed', async () => {
    await dataTable.rightClickOnItem(folder);
    expect(await contextMenu.isMenuItemPresent(menuItem2.label)).toBe(false, `${menuItem2.label} menu is displayed for ${folder}`);
  });
});
