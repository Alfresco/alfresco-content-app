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

import { CyBrowsingPage, CyLoginPage } from '../../pages';
import { CyAdminActions } from '../../utils/cy-api/cy-admin-actions';
import { CyRepoClient } from '../../utils/cy-api/cy-repo-client/cy-repo-client';
import { SITE_VISIBILITY, SITE_ROLES, APP_ROUTES } from '../../utils/cy-configs';
import { CyUtils } from '../../utils/cy-utils';
import { CyUserActions } from '../../utils/cy-api/cy-user-actions';

describe('Personal Files', () => {
  const username = `user-${CyUtils.random()}`;

  const userApi = new CyRepoClient(username, username);

  const loginPage = new CyLoginPage();
  const page = new CyBrowsingPage();
  const { dataTable } = page;

  const adminFolder = `admin-folder-${CyUtils.random()}`;

  const userFolder = `user-folder-${CyUtils.random()}`;
  const userFile = `file-${CyUtils.random()}.txt`;
  const adminApiActions = new CyAdminActions();

  let userFolderId: string;

  before(() => {
    cy.then(async () => {
      await Promise.all([adminApiActions.createUser({ username }), adminApiActions.nodes.createFolders([adminFolder])]);
      userFolderId = (await userApi.nodes.createFolder(userFolder)).entry.id;
      await userApi.nodes.createFiles([userFile], userFolder);
    });
  });

  after(() => {
    cy.then(async () => {
      await Promise.all([adminApiActions.nodes.deleteNodes([adminFolder]), userApi.nodes.deleteNodes([userFolder])]);
    });
  });

  describe(`Admin user's personal files`, () => {
    before(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      loginPage.loginWithAdmin();
    });

    beforeEach(() => {
      page.clickPersonalFiles();
    });

    it('[C213241] has Data Dictionary and created content', () => {
      cy.contains('Data Dictionary');
      cy.contains(adminFolder);
    });
  });

  describe(`Regular user's personal files`, () => {
    before(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      loginPage.loginWith(username);
    });

    beforeEach(() => {
      page.clickPersonalFiles();
    });

    it('[C217142] has the correct columns', () => {
      const expectedColumns = ['Name', 'Size', 'Modified', 'Modified by'];
      const actualColumns = dataTable.getColumnHeadersText();

      actualColumns.should('deep.equal', expectedColumns);
    });

    it('[C217143] has default sorted column', () => {
      dataTable.getSortedColumnHeaderText().should('eq', 'Name');
    });

    it('[C213242] has user created content', () => {
      cy.contains(userFolder);
    });

    it('[C213244] navigates to folder', () => {
      dataTable.doubleClickOnRowByName(userFolder);
      dataTable.waitForHeader();

      cy.url().should('contain', userFolderId);
      cy.contains(userFile);
    });

    it('[C213245] redirects to Personal Files on clicking the link from sidebar', () => {
      page.dataTable.doubleClickOnRowByName(userFolder);
      page.clickPersonalFiles();
      page.dataTable.waitForHeader();

      cy.url().should('contain', APP_ROUTES.PERSONAL_FILES);
    });

    it('[C213246] page loads correctly after browser refresh', () => {
      cy.reload();
      cy.url().should('contain', APP_ROUTES.PERSONAL_FILES);
    });

    it('[C213247] page load by URL', () => {
      page.clickTrash();
      CyUtils.navigate(APP_ROUTES.PERSONAL_FILES);
      cy.url().should('contain', APP_ROUTES.PERSONAL_FILES);
    });
  });
});
