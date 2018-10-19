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

import { LoginPage, LogoutPage, BrowsingPage } from '../../pages/pages';
import { EXTENSIBILITY_CONFIGS, SIDEBAR_LABELS } from '../../configs';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';

describe('Extensions - Context submenu', () => {
  const username = `user-${Utils.random()}`;
  const file = `file-${Utils.random()}.txt`;
  let fileId;
  const folder = `folder-${Utils.random()}`;
  let folderId;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const logoutPage = new LogoutPage();
  const personalFilesPage = new BrowsingPage();
  const {dataTable} = personalFilesPage;
  const contextMenu = dataTable.menu;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({username});
    fileId = (await apis.user.nodes.createFile(file)).entry.id;
    folderId = (await apis.user.nodes.createFolder(folder)).entry.id;

    await loginPage.load();
    await Utils.setSessionStorageFromConfig('"aca.extension.config"', EXTENSIBILITY_CONFIGS.CONTEXT_SUBMENUS);
    await loginPage.loginWith(username);

    done();
  });

  beforeEach(async (done) => {
    await Utils.pressEscape();
    await personalFilesPage.sidenav.navigateToLinkByLabel(SIDEBAR_LABELS.PERSONAL_FILES);
    await dataTable.waitForHeader();
    await dataTable.clearSelection();
    done();
  });

  afterAll(async (done) => {
    await apis.user.nodes.deleteNodeById(fileId);
    await apis.user.nodes.deleteNodeById(folderId);
    await apis.user.trashcan.emptyTrash();
    await logoutPage.load();
    done();
  });

  xit('displays the submenu actions set from config - []', async () => {
    await dataTable.rightClickOnItem(file);
    expect(await contextMenu.isMenuItemPresent('More')).toBe(true, `More menu is not displayed for ${file}`);

    await contextMenu.clickSubMenuItem('More');
    expect(await contextMenu.isMenuItemPresent('COPY 1')).toBe(true, `submenu item is not displayed for ${file}`);
    expect(await contextMenu.isMenuItemPresent('COPY 2')).toBe(true, `submenu item is not displayed for ${file}`);
    expect(await contextMenu.isMenuItemPresent('SHARE')).toBe(true, `submenu item is not displayed for ${file}`);
  });

  it('does not display submenu actions without permissions - []', async () => {
    await dataTable.rightClickOnItem(folder);
    expect(await contextMenu.isMenuItemPresent('More')).toBe(true, `More menu is not displayed for ${folder}`);

    await contextMenu.clickSubMenuItem('More');
    expect(await contextMenu.isMenuItemPresent('SHARE')).toBe(false, `no permission submenu item is displayed`);
  });

  it('the parent item is not displayed if all its children have no permission to be displayed - []', async () => {
    await dataTable.rightClickOnItem(folder);
    expect(await contextMenu.isMenuItemPresent('Test More')).toBe(false, `Test More menu is displayed for ${folder}`);
  });
});
