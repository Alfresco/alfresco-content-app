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

describe('File Libraries', () => {
  const username = `user-${CyUtils.random()}`;
  const password = username;

  const userSitePrivate = `user-private-${CyUtils.random()}`;
  const userSiteModerated = `user-moderated-${CyUtils.random()}`;
  const userSitePublic = `user-public-${CyUtils.random()}`;

  const siteName = `siteName-${CyUtils.random()}`;

  const siteId1 = CyUtils.random();
  const siteId2 = CyUtils.random();

  const adminSite1 = `admin1-${CyUtils.random()}`;
  const adminSite2 = `admin2-${CyUtils.random()}`;
  const adminSite3 = `admin3-${CyUtils.random()}`;
  const adminSite4 = `admin4-${CyUtils.random()}`;
  const adminSite5 = `admin5-${CyUtils.random()}`;
  const adminSite6 = `admin6-${CyUtils.random()}`;

  const siteDescription = 'my site description';

  const userApi = new CyRepoClient(username, password);

  const loginPage = new CyLoginPage();
  const page = new CyBrowsingPage();
  const { dataTable } = page;
  const adminApiActions = new CyAdminActions();

  before(() => {
    cy.then({ timeout: 65000 }, async () => {
      await adminApiActions.createUser({ username });

      await userApi.sites.createSite(userSitePublic, SITE_VISIBILITY.PUBLIC);
      await userApi.sites.createSite(userSiteModerated, SITE_VISIBILITY.MODERATED, siteDescription);
      await userApi.sites.createSite(userSitePrivate, SITE_VISIBILITY.PRIVATE, null);

      await adminApiActions.sites.createSite(adminSite1, SITE_VISIBILITY.PUBLIC);
      await adminApiActions.sites.createSite(adminSite2, SITE_VISIBILITY.PUBLIC);
      await adminApiActions.sites.createSite(adminSite3, SITE_VISIBILITY.PUBLIC);
      await adminApiActions.sites.createSite(adminSite4, SITE_VISIBILITY.PUBLIC);
      await adminApiActions.sites.createSite(adminSite5, SITE_VISIBILITY.PUBLIC);
      await adminApiActions.sites.createSite(adminSite6, SITE_VISIBILITY.PUBLIC);
      await adminApiActions.sites.addSiteMember(adminSite1, username, SITE_ROLES.SITE_CONSUMER.ROLE);
      await adminApiActions.sites.addSiteMember(adminSite2, username, SITE_ROLES.SITE_CONTRIBUTOR.ROLE);
      await adminApiActions.sites.addSiteMember(adminSite3, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
      await adminApiActions.sites.addSiteMember(adminSite4, username, SITE_ROLES.SITE_MANAGER.ROLE);
      await adminApiActions.sites.addSiteMember(adminSite6, username, SITE_ROLES.SITE_CONSUMER.ROLE);

      await userApi.favorites.addFavoriteById('site', adminSite1);
      await userApi.favorites.addFavoriteById('site', adminSite2);
      await userApi.favorites.addFavoriteById('site', adminSite3);
      await userApi.favorites.addFavoriteById('site', adminSite4);

      await userApi.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC, null, siteId1);
      await userApi.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC, null, siteId2);
    });
  });

  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    loginPage.loginWith(username);
  });

  after(() => {
    cy.then({ timeout: 25000 }, async () => {
      await userApi.sites.deleteSites([userSitePublic, userSiteModerated, userSitePrivate, siteId1, siteId2]);
      await adminApiActions.login();
      await adminApiActions.sites.deleteSites([adminSite1, adminSite2, adminSite3, adminSite4, adminSite5, adminSite6]);
    });
  });

  describe('My Libraries', () => {
    beforeEach(() => {
      page.goToMyLibraries();
    });

    it('[C217095] has the correct columns', () => {
      const expectedColumns = ['Name', 'Description', 'My Role', 'Visibility'];
      const actualColumns = dataTable.getColumnHeadersText();

      actualColumns.should('deep.equal', expectedColumns);
    });

    it('[C280501] User can see only the sites he is a member of', () => {
      dataTable.getRowsCount().should('eq', 10);

      cy.get(adminSite5).should('not.exist');
    });

    // it('[C289905] Library visibility is correctly displayed', () => {
    //   const expectedSitesVisibility = {
    //     [userSitePrivate]: SITE_VISIBILITY.PRIVATE,
    //     [userSiteModerated]: SITE_VISIBILITY.MODERATED,
    //     [userSitePublic]: SITE_VISIBILITY.PUBLIC
    //   };

    //   const sitesList = dataTable.getSitesNameAndVisibility();

    //   for (const site of Object.keys(expectedSitesVisibility)) {
    //     expect(sitesList[site]).toEqual(expectedSitesVisibility[site]);
    //   }
    // });

    // it('[C289903] User role is correctly displayed', () => {
    //   const expectedSitesRoles = {
    //     [adminSite1]: SITE_ROLES.SITE_CONSUMER.LABEL,
    //     [adminSite2]: SITE_ROLES.SITE_CONTRIBUTOR.LABEL,
    //     [adminSite3]: SITE_ROLES.SITE_COLLABORATOR.LABEL,
    //     [adminSite4]: SITE_ROLES.SITE_MANAGER.LABEL
    //   };

    //   const sitesList = dataTable.getSitesNameAndRole();

    //   for (const site of Object.keys(expectedSitesRoles)) {
    //     expect(sitesList[site]).toEqual(expectedSitesRoles[site]);
    //   }
    // });

    // it('[C217098] Site ID is displayed when two sites have the same name', () => {
    //   const expectedSites = [`${siteName} (${siteId1})`, `${siteName} (${siteId2})`];
    //   const actualSites = dataTable.getCellsContainingName(siteName);
    //   expect(actualSites.sort()).toEqual(expectedSites.sort());
    // });

    // it('[C217096] Tooltip for sites without description', () => {
    //   const tooltip = dataTable.getItemNameTooltip(userSitePrivate);
    //   expect(tooltip).toBe(`${userSitePrivate}`);
    // });

    // it('[C217097] Tooltip for sites with description', () => {
    //   const tooltip = dataTable.getItemNameTooltip(userSiteModerated);
    //   expect(tooltip).toBe(`${siteDescription}`);
    // });
  });

  describe('Favorite Libraries', () => {
    beforeEach(() => {
      page.goToFavoriteLibraries();
    });

    it('[C289893] has the correct columns', () => {
      const expectedColumns = ['Name', 'Description', 'My Role', 'Visibility'];
      const actualColumns = dataTable.getColumnHeadersText();

      actualColumns.should('deep.equal', expectedColumns);
    });

    it('[C289897] User can see only his favorite sites', () => {
      dataTable.getRowsCount().should('eq', 9);
      cy.get(adminSite6).should('not.exist');
    });

    // it('[C289906] Library visibility is correctly displayed', () => {
    //   const expectedSitesVisibility = {
    //     [userSitePrivate]: SITE_VISIBILITY.PRIVATE,
    //     [userSiteModerated]: SITE_VISIBILITY.MODERATED,
    //     [userSitePublic]: SITE_VISIBILITY.PUBLIC
    //   };

    //   const sitesList = dataTable.getSitesNameAndVisibility();

    //   for (const site of Object.keys(expectedSitesVisibility)) {
    //     expect(sitesList[site]).toEqual(expectedSitesVisibility[site]);
    //   }
    // });

    // it('[C289904] User role is correctly displayed', () => {
    //   const expectedSitesRoles = {
    //     [adminSite1]: SITE_ROLES.SITE_CONSUMER.LABEL,
    //     [adminSite2]: SITE_ROLES.SITE_CONTRIBUTOR.LABEL,
    //     [adminSite3]: SITE_ROLES.SITE_COLLABORATOR.LABEL,
    //     [adminSite4]: SITE_ROLES.SITE_MANAGER.LABEL
    //   };

    //   const sitesList = dataTable.getSitesNameAndRole();

    //   for (const site of Object.keys(expectedSitesRoles)) {
    //     expect(sitesList[site]).toEqual(expectedSitesRoles[site]);
    //   }
    // });

    // it('[C289896] Site ID is displayed when two sites have the same name', () => {
    //   const expectedSites = [`${siteName} (${siteId1})`, `${siteName} (${siteId2})`];
    //   const actualSites = dataTable.getCellsContainingName(siteName);
    //   expect(actualSites.sort()).toEqual(expectedSites.sort());
    // });

    // it('[C289894] Tooltip for sites without description', () => {
    //   const tooltip = dataTable.getItemNameTooltip(userSitePrivate);
    //   expect(tooltip).toBe(`${userSitePrivate}`);
    // });

    // it('[C289895] Tooltip for sites with description', () => {
    //   const tooltip = dataTable.getItemNameTooltip(userSiteModerated);
    //   expect(tooltip).toBe(`${siteDescription}`);
    // });
  });
});
