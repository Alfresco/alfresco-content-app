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
import { EXTENSIBILITY_CONFIGS } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Extensions - Context submenu', () => {
  const username = `user-${Utils.random()}`;
  const file = `file-${Utils.random()}.txt`;
  let fileId;
  const folder = `folder-${Utils.random()}`;
  let folderId;

  const restrictedPermissionsItem = 'Share';

  const menuItem1 = {
    label: 'Test Menu1',
    submenu: [ 'Test submenu1', 'Test submenu2', restrictedPermissionsItem ]
  };
  const menuItem2 = {
    label: 'Test Menu2',
    submenu: [ restrictedPermissionsItem ]
  };

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const {dataTable} = page;
  const contextMenu = dataTable.menu;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({username});
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

  it('Displays the submenu actions set from config - [C286717]', async () => {
    await dataTable.rightClickOnItem(file);
    expect(await contextMenu.isMenuItemPresent(menuItem1.label)).toBe(true, `${menuItem1.label} is not displayed for ${file}`);
    expect(await contextMenu.hasSubMenu(menuItem1.label)).toBe(true, 'Menu does not have submenu');
    await contextMenu.mouseOverMenuItem(menuItem1.label);

    expect(await contextMenu.getSubmenuItemsCount()).toBe(3, 'submenu has wrong number of items');
    expect(await contextMenu.isSubMenuItemPresent(menuItem1.submenu[0])).toBe(true, `${menuItem1.submenu[0]} is not displayed for ${file}`);
    expect(await contextMenu.isSubMenuItemPresent(menuItem1.submenu[1])).toBe(true, `${menuItem1.submenu[1]} is not displayed for ${file}`);
    expect(await contextMenu.isSubMenuItemPresent(menuItem1.submenu[2])).toBe(true, `${restrictedPermissionsItem} is not displayed for ${file}`);
  });

  it('Does not display submenu actions without permissions - [C286718]', async () => {
    await dataTable.rightClickOnItem(folder);
    expect(await contextMenu.isMenuItemPresent(menuItem1.label)).toBe(true, `${menuItem1.label} is not displayed for ${folder}`);
    await contextMenu.mouseOverMenuItem(menuItem1.label);

    expect(await contextMenu.getSubmenuItemsCount()).toBe(2, 'submenu has wrong number of items');
    expect(await contextMenu.isSubMenuItemPresent(menuItem1.submenu[0])).toBe(true, `${menuItem1.submenu[0]} is not displayed for ${file}`);
    expect(await contextMenu.isSubMenuItemPresent(menuItem1.submenu[1])).toBe(true, `${menuItem1.submenu[1]} is not displayed for ${file}`);
    expect(await contextMenu.isSubMenuItemPresent(menuItem1.submenu[2])).toBe(false, `no permission submenu ${restrictedPermissionsItem} is displayed`);
  });

  it('The parent item is not displayed if all its children have no permission to be displayed - [C287784]', async () => {
    await dataTable.rightClickOnItem(folder);
    expect(await contextMenu.isMenuItemPresent(menuItem2.label)).toBe(false, `${menuItem2.label} menu is displayed for ${folder}`);
  });
});
