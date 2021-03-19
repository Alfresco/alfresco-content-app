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

describe('Favorites', () => {
  const username = `user-${CyUtils.random()}`;

  const siteName = `site-${CyUtils.random()}`;
  const favFolderName = `favFolder-${CyUtils.random()}`;
  const parentFolder = `parent-${CyUtils.random()}`;
  const fileName1 = `file1-${CyUtils.random()}.txt`;
  const fileName2 = `file2-${CyUtils.random()}.txt`;
  const fileName3 = `file3-${CyUtils.random()}.txt`;
  const fileName4 = `file4-${CyUtils.random()}.txt`;

  const userApi = new CyRepoClient(username, username);

  const loginPage = new CyLoginPage();
  const page = new CyBrowsingPage();
  const { dataTable, breadcrumb } = page;

  const adminApiActions = new CyAdminActions();
  const userActions = new CyUserActions();

  let parentId: string;
  let folderId: string;

  before(() => {
    cy.then({ timeout: 25000 }, async () => {
      await adminApiActions.login();
      await adminApiActions.createUser({ username });
      await userActions.login(username, username);

      await adminApiActions.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
      const docLibId = await adminApiActions.sites.getDocLibId(siteName);
      await adminApiActions.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_MANAGER.ROLE);

      const file1Id = (await adminApiActions.nodes.createFile(fileName1, docLibId)).entry.id;
      folderId = (await userApi.nodes.createFolder(favFolderName)).entry.id;
      parentId = (await userApi.nodes.createFolder(parentFolder)).entry.id;
      const file2Id = (await userApi.nodes.createFile(fileName2, parentId)).entry.id;
      const file3Id = (await userApi.nodes.createFile(fileName3, parentId)).entry.id;
      const file4Id = (await userApi.nodes.createFile(fileName4, parentId)).entry.id;

      await userApi.favorites.addFavoriteById('file', file1Id);
      await userApi.favorites.addFavoriteById('folder', folderId);
      await userApi.favorites.addFavoriteById('file', file2Id);
      await userApi.favorites.addFavoriteById('file', file3Id);
      await userApi.favorites.addFavoriteById('file', file4Id);

      await userActions.deleteNodes([file3Id, file4Id], false);
      await userActions.trashcanApi.restoreDeletedNode(file4Id);
    });
  });

  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.loginWith(username);
  });

  beforeEach(() => {
    page.clickFavoritesAndWait();
  });

  after(() => {
    cy.then(async () => {
      await userActions.deleteNodes([folderId, parentId]);
      await userActions.emptyTrashcan();

      await adminApiActions.login();
      await adminApiActions.deleteSites([siteName]);
    });
  });

  it('[C280482] has the correct columns', () => {
    const expectedColumns = ['Name', 'Location', 'Size', 'Modified', 'Modified by'];
    const actualColumns = dataTable.getColumnHeadersText();

    actualColumns.should('deep.equal', expectedColumns);
  });

  it('[C213226] displays the favorite files and folders', () => {
    dataTable.getRowsCount().should('eq', 4);

    cy.contains(fileName1);
    cy.contains(fileName2);
    cy.contains(favFolderName);
  });

  it(`[C213228] deleted favorite file does not appear`, () => {
    cy.get(fileName3).should('not.exist');
  });

  it(`[C213229] file is displayed after it is restored from Trashcan`, () => {
    cy.contains(fileName4);
  });

  it('[C213231] Location column displays the parent folder of the files', () => {
    dataTable.getItemLocation(fileName1).contains(siteName);
    dataTable.getItemLocation(fileName2).contains(parentFolder);
    dataTable.getItemLocation(favFolderName).contains('Personal Files');
  });

  it('[C213671] Location column displays a tooltip with the entire path of the file', () => {
    dataTable.getItemLocationTooltip(fileName1).should('contain', `File Libraries/${siteName}`);
    dataTable.getItemLocationTooltip(fileName2).should('contain', `Personal Files/${parentFolder}`);
    dataTable.getItemLocationTooltip(favFolderName).should('contain', 'Personal Files');
  });

  it('[C213650] Location column redirect - item in user Home', () => {
    dataTable.clickItemLocation(favFolderName);
    breadcrumb.getAllItems().should('deep.equal', ['Personal Files']);
  });

  it('[C280484] Location column redirect - file in folder', () => {
    dataTable.clickItemLocation(fileName2);
    cy.contains(breadcrumb.currentItem, parentFolder);
    breadcrumb.getAllItems().should('deep.equal', ['Personal Files', parentFolder]);
  });

  it('[C280485] Location column redirect - file in site', () => {
    dataTable.clickItemLocation(fileName1);
    cy.contains(breadcrumb.currentItem, siteName);
    breadcrumb.getAllItems().should('deep.equal', ['My Libraries', siteName]);
  });

  it('[C213230] Navigate into folder from Favorites', () => {
    dataTable.doubleClickOnRowByName(favFolderName);
    cy.get(dataTable.emptyFolderDragAndDrop).should('be.visible');
    cy.contains(breadcrumb.currentItem, favFolderName);
  });
});
