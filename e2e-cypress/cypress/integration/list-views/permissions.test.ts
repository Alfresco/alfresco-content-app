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
import { SITE_VISIBILITY, SITE_ROLES } from '../../utils/cy-configs';
import { CyUtils } from '../../utils/cy-utils';
import { CyUserActions } from '../../utils/cy-api/cy-user-actions';

describe('Special permissions', () => {
  const username = `user-${CyUtils.random()}`;

  const userApi = new CyRepoClient(username, username);

  const loginPage = new CyLoginPage();
  const page = new CyBrowsingPage();
  const { dataTable } = page;
  const { searchInput } = page.header;

  const adminApiActions = new CyAdminActions();
  const userActions = new CyUserActions();

  before(() => {
    cy.then(async () => {
      await adminApiActions.login();
      await adminApiActions.createUser({ username });
    });
  });

  describe('file not displayed if user no longer has permissions on it', () => {
    const sitePrivate = `private-${CyUtils.random()}`;
    const fileName = `file-${CyUtils.random()}.txt`;
    let fileId: string;

    before(() => {
      cy.then({ timeout: 30000 }, async () => {
        await adminApiActions.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
        await adminApiActions.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
        const docLibId = await adminApiActions.sites.getDocLibId(sitePrivate);
        fileId = (await adminApiActions.nodes.createFile(fileName, docLibId)).entry.id;

        await userApi.favorites.addFavoriteById('file', fileId);

        await adminApiActions.shareNodes([fileId]);
        await userApi.nodes.updateNodeContent(fileId, 'edited by user');

        await userApi.search.waitForApi(username, { expect: 1 });
        await adminApiActions.shared.waitForFilesToBeShared([fileId]);
      });
    });

    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      loginPage.loginWith(username);
    });

    afterEach(() => {
      cy.then(async () => {
        await adminApiActions.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
      });
    });

    after(() => {
      cy.then(async () => {
        await adminApiActions.sites.deleteSite(sitePrivate);
      });
    });

    it('[C213173] on Recent Files', () => {
      page.clickRecentFilesAndWait();
      dataTable.getRowsCount().should('eq', 1);

      cy.then(async () => {
        await adminApiActions.sites.deleteSiteMember(sitePrivate, username);
      });

      cy.reload();
      dataTable.isEmpty().should('be.true');
    });

    it('[C213227] on Favorites', () => {
      page.clickFavoritesAndWait();
      cy.contains(fileName);

      cy.then(async () => {
        await adminApiActions.sites.deleteSiteMember(sitePrivate, username);
      });

      cy.reload();
      dataTable.isEmpty().should('be.true');
    });

    it('[C213116] on Shared Files', () => {
      page.clickSharedFilesAndWait();
      cy.contains(fileName);

      cy.then(async () => {
        await adminApiActions.sites.deleteSiteMember(sitePrivate, username);
      });

      cy.reload();
      cy.get(fileName).should('not.exist');
    });

    it('[C290122] on Search Results', () => {
      searchInput.clickSearchButton();
      searchInput.checkFilesAndFolders();
      searchInput.searchFor(fileName);
      cy.contains(fileName);

      cy.then(async () => {
        await adminApiActions.sites.deleteSiteMember(sitePrivate, username);
      });

      page.clickPersonalFiles();
      searchInput.clickSearchButton();
      searchInput.checkFilesAndFolders();
      searchInput.searchFor(fileName);

      cy.get(fileName).should('not.exist');
    });
  });

  describe(`Location column is empty if user doesn't have permissions on the file's parent folder`, () => {
    const sitePrivate = `private-${CyUtils.random()}`;
    const fileName = `file-${CyUtils.random()}.txt`;
    let fileId: string;

    before(() => {
      cy.then({ timeout: 30000 }, async () => {
        await adminApiActions.sites.createSite(sitePrivate, SITE_VISIBILITY.PRIVATE);
        await adminApiActions.sites.addSiteMember(sitePrivate, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
        const docLibId = await adminApiActions.sites.getDocLibId(sitePrivate);
        fileId = (await userApi.nodes.createFile(fileName, docLibId)).entry.id;
        await userApi.favorites.addFavoriteById('file', fileId);

        await userActions.shareNodes([fileId]);
        await userApi.shared.waitForFilesToBeShared([fileId]);

        await userApi.search.waitForApi(username, { expect: 1 });
        await adminApiActions.sites.deleteSiteMember(sitePrivate, username);
      });
    });

    before(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      loginPage.loginWith(username);
    });

    after(() => {
      cy.then(async () => {
        await adminApiActions.sites.deleteSite(sitePrivate);
      });
    });

    it('[C213178] on Recent Files', () => {
      page.clickRecentFilesAndWait();
      cy.contains(fileName);
      dataTable.getRowsCount().should('eq', 1);
      dataTable.getItemLocation(fileName).should('contain', 'Unknown');
    });

    it('[C213672] on Favorites', () => {
      page.clickFavoritesAndWait();
      cy.contains(fileName);
      dataTable.getRowsCount().should('eq', 1);
      dataTable.getItemLocation(fileName).should('contain', 'Unknown');
    });

    it(`[C213668] on Shared Files`, () => {
      page.clickSharedFilesAndWait();
      cy.contains(fileName);
      dataTable.getItemLocation(fileName).should('contain', 'Unknown');
    });

    it('[C306868] on Search results', () => {
      searchInput.clickSearchButton();
      searchInput.checkFilesAndFolders();
      searchInput.searchFor(fileName);
      cy.contains(fileName);

      dataTable.getItemLocation(fileName).should('contain', 'Unknown');
    });
  });
});
