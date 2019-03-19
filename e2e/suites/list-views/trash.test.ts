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

import { SITE_VISIBILITY, SITE_ROLES } from '../../configs';
import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Trash', () => {
  const username = `user-${Utils.random()}`;

  const siteName = `site-${Utils.random()}`;
  const fileSite = `file-${Utils.random()}.txt`; let fileSiteId;

  const folderAdmin = `folder-${Utils.random()}`; let folderAdminId;
  const fileAdmin = `file-${Utils.random()}.txt`; let fileAdminId;

  const folderUser = `folder-${Utils.random()}`; let folderUserId;
  const fileUser = `file-${Utils.random()}.txt`; let fileUserId;

  const folderDeleted = `folder-${Utils.random()}`; let folderDeletedId;
  const fileDeleted = `file-${Utils.random()}.txt`; let fileDeletedId;

  const folderNotDeleted = `folder-${Utils.random()}`; let folderNotDeletedId;
  const fileInFolder = `file-${Utils.random()}.txt`; let fileInFolderId;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, breadcrumb } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    fileAdminId = (await apis.admin.nodes.createFiles([ fileAdmin ])).entry.id;
    folderAdminId = (await apis.admin.nodes.createFolders([ folderAdmin ])).entry.id;
    await apis.admin.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
    await apis.admin.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_MANAGER.ROLE);
    const docLibId = await apis.admin.sites.getDocLibId(siteName);
    fileSiteId = (await apis.admin.nodes.createFile(fileSite, docLibId)).entry.id;
    fileUserId = (await apis.user.nodes.createFiles([ fileUser ])).entry.id;
    folderUserId = (await apis.user.nodes.createFolders([ folderUser ])).entry.id;
    folderDeletedId = (await apis.user.nodes.createFolder(folderDeleted)).entry.id;
    fileDeletedId = (await apis.user.nodes.createFiles([ fileDeleted ], folderDeleted)).entry.id;
    folderNotDeletedId = (await apis.user.nodes.createFolder(folderNotDeleted)).entry.id;
    fileInFolderId = (await apis.user.nodes.createFiles([ fileInFolder ], folderNotDeleted)).entry.id;

    await apis.admin.nodes.deleteNodesById([ fileAdminId, folderAdminId ], false);
    await apis.user.nodes.deleteNodesById([ fileSiteId, fileUserId, folderUserId, fileInFolderId ], false);
    await apis.user.nodes.deleteNodeById(fileDeletedId, false);
    await apis.user.nodes.deleteNodeById(folderDeletedId, false);

    done();
  });

  afterAll(async (done) => {
    await Promise.all([
      apis.admin.sites.deleteSite(siteName),
      apis.user.nodes.deleteNodeById(folderNotDeletedId),
      apis.admin.trashcan.emptyTrash()
    ]);
    done();
  });

  describe('as admin', () => {
    beforeAll(async (done) => {
      await loginPage.loginWithAdmin();
      done();
    });

    beforeEach(async (done) => {
      await page.clickTrashAndWait();
      done();
    });

    it('has the correct columns - [C213217]', async () => {
      const expectedColumns = [ 'Thumbnail', 'Name', 'Location', 'Size', 'Deleted', 'Deleted by' ];
      const actualColumns = await dataTable.getColumnHeadersText();

      expect(actualColumns).toEqual(expectedColumns);
    });

    it('displays the files and folders deleted by everyone - [C280493]', async () => {
      expect(await dataTable.countRows()).toEqual(8, 'Incorrect number of deleted items displayed');

      expect(await dataTable.isItemPresent(fileAdmin)).toBe(true, `${fileAdmin} not displayed`);
      expect(await dataTable.isItemPresent(folderAdmin)).toBe(true, `${folderAdmin} not displayed`);
      expect(await dataTable.isItemPresent(fileUser)).toBe(true, `${fileUser} not displayed`);
      expect(await dataTable.isItemPresent(folderUser)).toBe(true, `${folderUser} not displayed`);
      expect(await dataTable.isItemPresent(fileSite)).toBe(true, `${fileSite} not displayed`);
    });
  });

  describe('as user', () => {
    beforeAll(async (done) => {
      await loginPage.loginWith(username);
      done();
    });

    beforeEach(async (done) => {
      await page.clickTrashAndWait();
      done();
    });

    it('has the correct columns - [C280494]', async () => {
      const expectedColumns = [ 'Thumbnail', 'Name', 'Location', 'Size', 'Deleted'];
      const actualColumns = await dataTable.getColumnHeadersText();

      expect(actualColumns).toEqual(expectedColumns);
    });

    it('displays the files and folders deleted by the user - [C213218]', async () => {
      expect(await dataTable.countRows()).toEqual(6, 'Incorrect number of deleted items displayed');

      expect(await dataTable.isItemPresent(fileSite)).toBe(true, `${fileSite} not displayed`);
      expect(await dataTable.isItemPresent(fileUser)).toBe(true, `${fileUser} not displayed`);
      expect(await dataTable.isItemPresent(folderUser)).toBe(true, `${folderUser} not displayed`);
      expect(await dataTable.isItemPresent(fileAdmin)).toBe(false, `${fileAdmin} is displayed`);
    });

    it('default sorting column - [C213219]', async () => {
      expect(await dataTable.getSortedColumnHeaderText()).toBe('Deleted');
      expect(await dataTable.getSortingOrder()).toBe('desc');
    });

    it('Location column displays the parent folder of the file - [C280498]', async () => {
      expect(await dataTable.getItemLocation(fileInFolder)).toEqual(folderNotDeleted);
      expect(await dataTable.getItemLocation(fileUser)).toEqual('Personal Files');
      expect(await dataTable.getItemLocation(fileSite)).toEqual(siteName);
    });

    it('Location column displays a tooltip with the entire path of the file - [C280499]', async () => {
      expect(await dataTable.getItemLocationTooltip(fileInFolder)).toEqual(`Personal Files/${folderNotDeleted}`);
      expect(await dataTable.getItemLocationTooltip(fileUser)).toEqual('Personal Files');
      expect(await dataTable.getItemLocationTooltip(fileSite)).toEqual(`File Libraries/${siteName}`);
    });

    it('Location column is empty if parent folder no longer exists - [C280500]', async () => {
      expect(await dataTable.getItemLocation(fileDeleted)).toEqual('');
    });

    it('Location column redirect - file in user Home - [C217144]', async () => {
      await dataTable.clickItemLocation(fileUser);
      expect(await breadcrumb.getAllItems()).toEqual([ 'Personal Files' ]);
    });

    it('Location column redirect - file in folder - [C280496]', async () => {
      await dataTable.clickItemLocation(fileInFolder);
      expect(await breadcrumb.getAllItems()).toEqual([ 'Personal Files', folderNotDeleted ]);
    });

    it('Location column redirect - file in site - [C280497]', async () => {
      await dataTable.clickItemLocation(fileSite);
      expect(await breadcrumb.getAllItems()).toEqual([ 'My Libraries', siteName ]);
    });
  });
});
