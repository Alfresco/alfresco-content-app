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

describe('Shared Files', () => {
  const username = `user-${CyUtils.random()}`;
  const password = username;

  const siteName = `site-${CyUtils.random()}`;
  const fileAdmin = `fileSite-${CyUtils.random()}.txt`;

  const folderUser = `folder-${CyUtils.random()}`;
  let folderId: string;
  const file1User = `file1-${CyUtils.random()}.txt`;
  let file1Id: string;
  const file2User = `file2-${CyUtils.random()}.txt`;
  let file2Id: string;
  const file3User = `file3-${CyUtils.random()}.txt`;
  let file3Id: string;
  const file4User = `file4-${CyUtils.random()}.txt`;
  let file4Id: string;

  const userApi = new CyRepoClient(username, password);

  const loginPage = new CyLoginPage();
  const page = new CyBrowsingPage();
  const { dataTable, breadcrumb } = page;
  const adminApiActions = new CyAdminActions();

  before(() => {
    cy.then({ timeout: 65000 }, async () => {
      await adminApiActions.createUser({ username });
      await adminApiActions.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC);
      await adminApiActions.sites.addSiteMember(siteName, username, SITE_ROLES.SITE_CONSUMER.ROLE);
      const docLibId = await adminApiActions.sites.getDocLibId(siteName);
      const nodeId = (await adminApiActions.nodes.createFile(fileAdmin, docLibId)).entry.id;

      folderId = (await userApi.nodes.createFolder(folderUser)).entry.id;
      file1Id = (await userApi.nodes.createFile(file1User, folderId)).entry.id;
      file2Id = (await userApi.nodes.createFile(file2User)).entry.id;
      file3Id = (await userApi.nodes.createFile(file3User)).entry.id;
      file4Id = (await userApi.nodes.createFile(file4User)).entry.id;

      await userApi.shared.shareFilesByIds([file1Id, file2Id, file3Id, file4Id]);

      await adminApiActions.login();
      await adminApiActions.shareNodes([nodeId]);

      await userApi.shared.waitForFilesToBeShared([file1Id, file2Id, file3Id, file4Id]);
      await adminApiActions.shared.waitForFilesToBeShared([nodeId]);

      await userApi.nodes.deleteNodeById(file2Id);
      await userApi.shared.unshareFileById(file3Id);

      await userApi.shared.waitForFilesToNotBeShared([file2Id, file3Id]);
    });
  });

  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.loginWith(username);
  });

  beforeEach(() => {
    page.clickSharedFiles();
  });

  after(() => {
    cy.then(async () => {
      await adminApiActions.sites.deleteSite(siteName);
      await userApi.nodes.deleteNodeById(folderId);
      await userApi.nodes.deleteNodeById(file4Id);
    });
  });

  it('[C213113] has the correct columns', () => {
    const expectedColumns = ['Name', 'Location', 'Size', 'Modified', 'Modified by', 'Shared by'];
    const actualColumns = dataTable.getColumnHeadersText();

    actualColumns.should('deep.equal', expectedColumns);
  });

  // it('[C213115] default sorting column', () => {
  //   expect(dataTable.getSortedColumnHeaderText()).toBe('Modified');
  //   expect(dataTable.getSortingOrder()).toBe('desc');
  // });

  it('[C213114] displays the files shared by everyone', () => {
    cy.contains(fileAdmin);
    cy.contains(file1User);
  });

  it(`[C213117] file not displayed if it's been deleted`, () => {
    cy.get(file2User).should('not.exist');
  });

  it('[C213118] unshared file is not displayed', () => {
    cy.get(file3User).should('not.exist');
  });

  it('[C213665] Location column displays the parent folder of the file', () => {
    dataTable.getItemLocationTooltip(file4User).should('contain', 'Personal Files');
    dataTable.getItemLocation(fileAdmin).should('contain', siteName);
    dataTable.getItemLocation(file1User).should('contain', folderUser);
  });

  it('[C213666] Location column redirect - file in user Home', () => {
    dataTable.clickItemLocation(file4User);
    breadcrumb.getAllItems().should('deep.equal', ['Personal Files']);
  });

  it('[C280490] Location column redirect - file in folder', () => {
    dataTable.clickItemLocation(file1User);
    cy.contains(breadcrumb.currentItem, folderUser);
    breadcrumb.getAllItems().should('deep.equal', ['Personal Files', folderUser]);
  });

  it('[C280491] Location column redirect - file in site', () => {
    dataTable.clickItemLocation(fileAdmin);
    cy.contains(breadcrumb.currentItem, siteName);
    breadcrumb.getAllItems().should('deep.equal', ['My Libraries', siteName]);
  });

  it('[C213667] Location column displays a tooltip with the entire path of the file', async () => {
    dataTable.getItemLocationTooltip(fileAdmin).should('contain', `File Libraries/${siteName}`);
    dataTable.getItemLocationTooltip(file1User).should('contain', `Personal Files/${folderUser}`);
  });
});
