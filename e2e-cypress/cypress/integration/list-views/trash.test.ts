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

import { CyUtils } from '../../utils/cy-utils';
import { CyRepoClient } from '../../utils/cy-api/cy-repo-client/cy-repo-client';
import { CyLoginPage, CyBrowsingPage } from '../../pages';
import { CyUserActions } from '../../utils/cy-api/cy-user-actions';
import { CyAdminActions } from '../../utils/cy-api/cy-admin-actions';
import { SITE_VISIBILITY, SITE_ROLES } from '../../utils/cy-configs';

describe('Trash', () => {
  const username = `user-${CyUtils.random()}`;

  const siteName = `site-${CyUtils.random()}`;
  const fileSite = `file-${CyUtils.random()}.txt`;
  let fileSiteId: string;

  const folderAdmin = `folder-${CyUtils.random()}`;
  let folderAdminId: string;
  const fileAdmin = `file-${CyUtils.random()}.txt`;
  let fileAdminId: string;

  const folderUser = `folder-${CyUtils.random()}`;
  let folderUserId: string;
  const fileUser = `file-${CyUtils.random()}.txt`;
  let fileUserId: string;

  const folderDeleted = `folder-${CyUtils.random()}`;
  let folderDeletedId: string;
  const fileDeleted = `file-${CyUtils.random()}.txt`;
  let fileDeletedId: string;

  const folderNotDeleted = `folder-${CyUtils.random()}`;
  let folderNotDeletedId: string;
  const fileInFolder = `file-${CyUtils.random()}.txt`;
  let fileInFolderId: string;

  const userApi = new CyRepoClient(username, username);

  const loginPage = new CyLoginPage();
  const page = new CyBrowsingPage();
  const { dataTable, breadcrumb } = page;

  const adminApiActions = new CyAdminActions();
  const userActions = new CyUserActions();

  before(() => {
    cy.then({ timeout: 35000 }, async () => {
      await adminApiActions.login();
      await adminApiActions.createUser({ username });

      fileAdminId = (await adminApiActions.nodes.createFiles([fileAdmin])).entry.id;
      folderAdminId = (await adminApiActions.nodes.createFolders([folderAdmin])).entry.id;
      await adminApiActions.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
      await adminApiActions.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_MANAGER.ROLE);
      const docLibId = await adminApiActions.sites.getDocLibId(siteName);
      fileSiteId = (await adminApiActions.nodes.createFile(fileSite, docLibId)).entry.id;

      await adminApiActions.nodes.deleteNodesById([fileAdminId, folderAdminId], false);

      fileUserId = (await userApi.nodes.createFiles([fileUser])).entry.id;
      folderUserId = (await userApi.nodes.createFolders([folderUser])).entry.id;
      folderDeletedId = (await userApi.nodes.createFolder(folderDeleted)).entry.id;
      fileDeletedId = (await userApi.nodes.createFiles([fileDeleted], folderDeleted)).entry.id;
      folderNotDeletedId = (await userApi.nodes.createFolder(folderNotDeleted)).entry.id;
      fileInFolderId = (await userApi.nodes.createFiles([fileInFolder], folderNotDeleted)).entry.id;

      await userApi.nodes.deleteNodesById([fileSiteId, fileUserId, folderUserId, fileInFolderId, fileDeletedId, folderDeletedId], false);
    });
  });

  after(() => {
    cy.then(async () => {
      await adminApiActions.sites.deleteSite(siteName);
      await adminApiActions.trashcanApi.deleteDeletedNode(fileAdminId);
      await adminApiActions.trashcanApi.deleteDeletedNode(folderAdminId);
      await userApi.nodes.deleteNodeById(folderNotDeletedId);
      await userActions.login(username, username);
      await userActions.emptyTrashcan();
    });
  });

  describe('as admin', () => {
    before(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      loginPage.loginWithAdmin();
    });

    beforeEach(() => {
      page.clickTrash();
    });

    it('[C213217] has the correct columns', () => {
      const expectedColumns = ['Name', 'Location', 'Size', 'Deleted', 'Deleted by'];
      const actualColumns = dataTable.getColumnHeadersText();

      actualColumns.should('deep.equal', expectedColumns);
    });

    it('[C280493] displays the files and folders deleted by everyone', () => {
      cy.contains(fileAdmin);
      cy.contains(folderAdmin);
      cy.contains(fileUser);
      cy.contains(folderUser);
      cy.contains(fileSite);
    });
  });

  describe('as user', () => {
    before(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      loginPage.loginWith(username);
    });

    beforeEach(() => {
      page.clickTrash();
    });

    it('[C280494] has the correct columns', () => {
      const expectedColumns = ['Name', 'Location', 'Size', 'Deleted'];
      const actualColumns = dataTable.getColumnHeadersText();

      actualColumns.should('deep.equal', expectedColumns);
    });

    it('[C213218] displays the files and folders deleted by the user', () => {
      dataTable.getRowsCount().should('eq', 6);

      cy.contains(fileSite);
      cy.contains(fileUser);
      cy.contains(folderUser);
      cy.get(fileAdmin).should('not.exist');
    });

    // it('[C213219] default sorting column', () => {
    //   dataTable.getSortedColumnHeaderText()).toBe('Deleted');
    //   dataTable.getSortingOrder()).toBe('desc');
    // });

    it('[C280498] Location column displays the parent folder of the file', () => {
      dataTable.getItemLocation(fileInFolder).contains(folderNotDeleted);
      dataTable.getItemLocation(fileUser).contains('Personal Files');
      dataTable.getItemLocation(fileSite).contains(siteName);
    });

    it('[C280499] Location column displays a tooltip with the entire path of the file', () => {
      dataTable.getItemLocationTooltip(fileInFolder).should('contain', `Personal Files/${folderNotDeleted}`);
      dataTable.getItemLocationTooltip(fileUser).should('contain', 'Personal Files');
      dataTable.getItemLocationTooltip(fileSite).should('contain', `File Libraries/${siteName}`);
    });

    it('[C280500] Location column is empty if parent folder no longer exists', () => {
      dataTable.getItemLocation(fileDeleted).should('be.empty');
    });

    it('[C217144] Location column redirect - file in user Home', () => {
      dataTable.clickItemLocation(fileUser);
      breadcrumb.getAllItems().should('deep.equal', ['Personal Files']);
    });

    it('[C280496] Location column redirect - file in folder', () => {
      dataTable.clickItemLocation(fileInFolder);
      cy.contains(breadcrumb.currentItem, folderNotDeleted);
      breadcrumb.getAllItems().should('deep.equal', ['Personal Files', folderNotDeleted]);
    });

    it('[C280497] Location column redirect - file in site', () => {
      dataTable.clickItemLocation(fileSite);
      cy.contains(breadcrumb.currentItem, siteName);
      breadcrumb.getAllItems().should('deep.equal', ['My Libraries', siteName]);
    });
  });
});
