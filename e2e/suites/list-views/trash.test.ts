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

import { AdminActions, UserActions, SITE_VISIBILITY, SITE_ROLES, LoginPage, BrowsingPage, Utils, RepoClient } from '@alfresco/aca-testing-shared';
import { Logger } from '@alfresco/adf-testing';

describe('Trash', () => {
  const username = `user-${Utils.random()}`;

  const siteName = `site-${Utils.random()}`;
  const fileSite = `file-${Utils.random()}.txt`;
  let fileSiteId: string;

  const folderAdmin = `folder-${Utils.random()}`;
  let folderAdminId: string;
  const fileAdmin = `file-${Utils.random()}.txt`;
  let fileAdminId: string;

  const folderUser = `folder-${Utils.random()}`;
  let folderUserId: string;
  const fileUser = `file-${Utils.random()}.txt`;
  let fileUserId: string;

  const folderDeleted = `folder-${Utils.random()}`;
  let folderDeletedId: string;
  const fileDeleted = `file-${Utils.random()}.txt`;
  let fileDeletedId: string;

  const folderNotDeleted = `folder-${Utils.random()}`;
  let folderNotDeletedId: string;
  const fileInFolder = `file-${Utils.random()}.txt`;
  let fileInFolderId: string;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, breadcrumb } = page;

  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  beforeAll(async () => {
    try {
      await adminApiActions.createUser({ username });

      fileAdminId = (await adminApiActions.nodes.createFiles([fileAdmin])).entry.id;
      folderAdminId = (await adminApiActions.nodes.createFolders([folderAdmin])).entry.id;
      await adminApiActions.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
      await adminApiActions.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_MANAGER.ROLE);
      const docLibId = await adminApiActions.sites.getDocLibId(siteName);
      fileSiteId = (await adminApiActions.nodes.createFile(fileSite, docLibId)).entry.id;

      await adminApiActions.nodes.deleteNodesById([fileAdminId, folderAdminId], false);

      fileUserId = (await apis.user.nodes.createFiles([fileUser])).entry.id;
      folderUserId = (await apis.user.nodes.createFolders([folderUser])).entry.id;
      folderDeletedId = (await apis.user.nodes.createFolder(folderDeleted)).entry.id;
      fileDeletedId = (await apis.user.nodes.createFiles([fileDeleted], folderDeleted)).entry.id;
      folderNotDeletedId = (await apis.user.nodes.createFolder(folderNotDeleted)).entry.id;
      fileInFolderId = (await apis.user.nodes.createFiles([fileInFolder], folderNotDeleted)).entry.id;

      await apis.user.nodes.deleteNodesById([fileSiteId, fileUserId, folderUserId, fileInFolderId, fileDeletedId, folderDeletedId], false);
    } catch (error) {
      Logger.error(`----- beforeAll failed : ${error}`);
    }
  });

  afterAll(async () => {
    try {
      await adminApiActions.login();
      await adminApiActions.sites.deleteSite(siteName);
      await adminApiActions.trashcanApi.deleteDeletedNode(fileAdminId);
      await adminApiActions.trashcanApi.deleteDeletedNode(folderAdminId);

      await apis.user.nodes.deleteNodeById(folderNotDeletedId);

      await userActions.login(username, username);
      await userActions.emptyTrashcan();
    } catch (error) {
      Logger.error(`----- afterAll failed : ${error}`);
    }
  });

  describe('as admin', () => {
    beforeAll(async () => {
      await loginPage.loginWithAdmin();
    });

    beforeEach(async () => {
      await page.clickTrashAndWait();
    });

    it('[C213217] has the correct columns', async () => {
      const expectedColumns = ['Name', 'Location', 'Size', 'Deleted', 'Deleted by'];
      const actualColumns = await dataTable.getColumnHeadersText();

      expect(actualColumns).toEqual(expectedColumns);
    });

    it('[C280493] displays the files and folders deleted by everyone', async () => {
      expect(await dataTable.isItemPresent(fileAdmin)).toBe(true, `${fileAdmin} not displayed`);
      expect(await dataTable.isItemPresent(folderAdmin)).toBe(true, `${folderAdmin} not displayed`);
      expect(await dataTable.isItemPresent(fileUser)).toBe(true, `${fileUser} not displayed`);
      expect(await dataTable.isItemPresent(folderUser)).toBe(true, `${folderUser} not displayed`);
      expect(await dataTable.isItemPresent(fileSite)).toBe(true, `${fileSite} not displayed`);
    });
  });

  describe('as user', () => {
    beforeAll(async () => {
      await loginPage.loginWith(username);
    });

    beforeEach(async () => {
      await page.clickTrashAndWait();
    });

    it('[C280494] has the correct columns', async () => {
      const expectedColumns = ['Name', 'Location', 'Size', 'Deleted'];
      const actualColumns = await dataTable.getColumnHeadersText();

      expect(actualColumns).toEqual(expectedColumns);
    });

    it('[C213218] displays the files and folders deleted by the user', async () => {
      expect(await dataTable.getRowsCount()).toEqual(6, 'Incorrect number of deleted items displayed');

      expect(await dataTable.isItemPresent(fileSite)).toBe(true, `${fileSite} not displayed`);
      expect(await dataTable.isItemPresent(fileUser)).toBe(true, `${fileUser} not displayed`);
      expect(await dataTable.isItemPresent(folderUser)).toBe(true, `${folderUser} not displayed`);
      expect(await dataTable.isItemPresent(fileAdmin)).toBe(false, `${fileAdmin} is displayed`);
    });

    it('[C213219] default sorting column', async () => {
      expect(await dataTable.getSortedColumnHeaderText()).toBe('Deleted');
      expect(await dataTable.getSortingOrder()).toBe('desc');
    });

    it('[C280498] Location column displays the parent folder of the file', async () => {
      expect(await dataTable.getItemLocation(fileInFolder)).toEqual(folderNotDeleted);
      expect(await dataTable.getItemLocation(fileUser)).toEqual('Personal Files');
      expect(await dataTable.getItemLocation(fileSite)).toEqual(siteName);
    });

    it('[C280499] Location column displays a tooltip with the entire path of the file', async () => {
      expect(await dataTable.getItemLocationTooltip(fileInFolder)).toEqual(`Personal Files/${folderNotDeleted}`);
      expect(await dataTable.getItemLocationTooltip(fileUser)).toEqual('Personal Files');
      expect(await dataTable.getItemLocationTooltip(fileSite)).toEqual(`File Libraries/${siteName}`);
    });

    it('[C280500] Location column is empty if parent folder no longer exists', async () => {
      expect(await dataTable.getItemLocation(fileDeleted)).toEqual('');
    });

    it('[C217144] Location column redirect - file in user Home', async () => {
      await dataTable.clickItemLocation(fileUser);
      expect(await breadcrumb.getAllItems()).toEqual(['Personal Files']);
    });

    it('[C280496] Location column redirect - file in folder', async () => {
      await dataTable.clickItemLocation(fileInFolder);
      expect(await breadcrumb.getAllItems()).toEqual(['Personal Files', folderNotDeleted]);
    });

    it('[C280497] Location column redirect - file in site', async () => {
      await dataTable.clickItemLocation(fileSite);
      expect(await breadcrumb.getAllItems()).toEqual(['My Libraries', siteName]);
    });
  });
});
