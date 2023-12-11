/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
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
  const { dataTable } = page;

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
      await adminApiActions.deleteSites([siteName]);
      await adminApiActions.trashcanApi.deleteDeletedNode(fileAdminId);
      await adminApiActions.trashcanApi.deleteDeletedNode(folderAdminId);

      await userActions.login(username, username);
      await userActions.deleteNodes([folderNotDeletedId]);
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
  });
});
