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

describe('Recent Files', () => {
  const username = `user-${CyUtils.random()}`;

  const folderName = `folder-${CyUtils.random()}`;
  let folderId: string;
  const fileName1 = `file-${CyUtils.random()}.txt`;
  const fileName2 = `file-${CyUtils.random()}.txt`;
  let file2Id: string;
  const fileName3 = `file-${CyUtils.random()}.txt`;

  const siteName = `site-${CyUtils.random()}`;
  const folderSite = `folder2-${CyUtils.random()}`;
  let folderSiteId: string;
  const fileSite = `file-${CyUtils.random()}.txt`;

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
      await userActions.login(username, username);

      folderId = (await userApi.nodes.createFolders([folderName])).entry.id;
      await userApi.nodes.createFiles([fileName1], folderName);
      file2Id = (await userApi.nodes.createFiles([fileName2])).entry.id;
      const id = (await userApi.nodes.createFiles([fileName3])).entry.id;
      await userActions.deleteNodes([id], false);

      await userApi.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
      const docLibId = await userApi.sites.getDocLibId(siteName);
      folderSiteId = (await userApi.nodes.createFolder(folderSite, docLibId)).entry.id;
      await userApi.nodes.createFile(fileSite, folderSiteId);

      await userApi.search.waitForApi(username, { expect: 3 });
    });
  });

  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.loginWith(username);
  });

  beforeEach(() => {
    page.clickRecentFiles();
  });

  after(() => {
    cy.then(async () => {
      await userActions.deleteNodes([folderId, file2Id]);
      await userActions.deleteSites([siteName]);
      await userActions.emptyTrashcan();
    });
  });

  it('[C213168] has the correct columns', () => {
    const expectedColumns = ['Name', 'Location', 'Size', 'Modified'];
    const actualColumns = dataTable.getColumnHeadersText();

    actualColumns.should('deep.equal', expectedColumns);
  });

  // it('[C213171] default sorting column', () => {
  //   expect(dataTable.getSortedColumnHeaderText()).toBe('Modified');
  //   expect(dataTable.getSortingOrder()).toBe('desc');
  // });

  it('[C213170] displays the files added by the current user in the last 30 days', () => {
    dataTable.getRowsCount().should('eq', 3);
    cy.contains(fileName1);
    cy.contains(fileName2);
    cy.contains(fileSite);
  });

  it(`[C213174] file not displayed if it's been deleted`, () => {
    cy.get(fileName3).should('not.exist');
  });

  it('[C213175] Location column displays the parent folder of the file', () => {
    dataTable.getItemLocation(fileName1).contains(folderName);
    dataTable.getItemLocation(fileName2).contains('Personal Files');
    dataTable.getItemLocation(fileSite).contains(folderSite);
  });

  it('[C213177] Location column displays a tooltip with the entire path of the file', () => {
    dataTable.getItemLocationTooltip(fileName1).should('contain', `Personal Files/${folderName}`);
    dataTable.getItemLocationTooltip(fileName2).should('contain', 'Personal Files');
    dataTable.getItemLocationTooltip(fileSite).should('contain', `File Libraries/${siteName}/${folderSite}`);
  });

  it('[C213176] Location column redirect - file in user Home', () => {
    dataTable.clickItemLocation(fileName2);
    breadcrumb.getAllItems().should('deep.equal', ['Personal Files']);
  });

  it('[C280486] Location column redirect - file in folder', () => {
    dataTable.clickItemLocation(fileName1);
    cy.contains(breadcrumb.currentItem, folderName);
    breadcrumb.getAllItems().should('deep.equal', ['Personal Files', folderName]);
  });

  it('[C280487] Location column redirect - file in site', () => {
    dataTable.clickItemLocation(fileSite);
    cy.contains(breadcrumb.currentItem, folderSite);
    breadcrumb.getAllItems().should('deep.equal', ['My Libraries', siteName, folderSite]);
  });
});
