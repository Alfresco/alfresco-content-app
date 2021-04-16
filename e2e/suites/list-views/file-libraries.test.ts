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

import { AdminActions, SITE_VISIBILITY, SITE_ROLES, LoginPage, BrowsingPage, Utils, RepoClient } from '@alfresco/aca-testing-shared';
import { Logger } from '@alfresco/adf-testing';

describe('File Libraries', () => {
  const username = `user-${Utils.random()}`;
  const password = username;

  const userSitePrivate = `user-private-${Utils.random()}`;
  const userSiteModerated = `user-moderated-${Utils.random()}`;
  const userSitePublic = `user-public-${Utils.random()}`;

  const siteName = `siteName-${Utils.random()}`;

  const siteId1 = Utils.random();
  const siteId2 = Utils.random();

  const adminSite1 = `admin1-${Utils.random()}`;
  const adminSite2 = `admin2-${Utils.random()}`;
  const adminSite3 = `admin3-${Utils.random()}`;
  const adminSite4 = `admin4-${Utils.random()}`;
  const adminSite5 = `admin5-${Utils.random()}`;
  const adminSite6 = `admin6-${Utils.random()}`;

  const siteDescription = 'my site description';

  const apis = {
    user: new RepoClient(username, password)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;
  const adminApiActions = new AdminActions();

  beforeAll(async (done) => {
    try {
      await adminApiActions.createUser({ username });

      await apis.user.sites.createSite(userSitePublic, SITE_VISIBILITY.PUBLIC);
      await apis.user.sites.createSite(userSiteModerated, SITE_VISIBILITY.MODERATED, siteDescription);
      await apis.user.sites.createSite(userSitePrivate, SITE_VISIBILITY.PRIVATE, null);

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

      await apis.user.favorites.addFavoriteById('site', adminSite1);
      await apis.user.favorites.addFavoriteById('site', adminSite2);
      await apis.user.favorites.addFavoriteById('site', adminSite3);
      await apis.user.favorites.addFavoriteById('site', adminSite4);

      await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC, null, siteId1);
      await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC, null, siteId2);

      await loginPage.loginWith(username);
    } catch (error) {
      Logger.error(`----- beforeAll failed : ${error}`);
    }
    done();
  });

  afterAll(async () => {
    await apis.user.sites.deleteSites([userSitePublic, userSiteModerated, userSitePrivate, siteId1, siteId2]);
    await adminApiActions.sites.deleteSites([adminSite1, adminSite2, adminSite3, adminSite4, adminSite5, adminSite6]);
  });

  describe('My Libraries', () => {
    beforeEach(async () => {
      await page.goToMyLibrariesAndWait();
    });

    it('[C217095] has the correct columns', async () => {
      const expectedColumns = ['Name', 'Description', 'My Role', 'Visibility'];
      const actualColumns = await dataTable.getColumnHeadersText();

      await expect(actualColumns).toEqual(expectedColumns);
    });

    it('[C280501] User can see only the sites he is a member of', async () => {
      const sitesCount = await dataTable.getRowsCount();

      expect(sitesCount).toEqual(10, 'Incorrect number of sites displayed');
      expect(await dataTable.isItemPresent(adminSite5)).toBe(false, `${adminSite5} should not appear in the list`);
    });

    it('[C289905] Library visibility is correctly displayed', async () => {
      const expectedSitesVisibility = {
        [userSitePrivate]: SITE_VISIBILITY.PRIVATE,
        [userSiteModerated]: SITE_VISIBILITY.MODERATED,
        [userSitePublic]: SITE_VISIBILITY.PUBLIC
      };

      const sitesList = await dataTable.getSitesNameAndVisibility();

      for (const site of Object.keys(expectedSitesVisibility)) {
        await expect(sitesList[site]).toEqual(expectedSitesVisibility[site]);
      }
    });

    it('[C289903] User role is correctly displayed', async () => {
      const expectedSitesRoles = {
        [adminSite1]: SITE_ROLES.SITE_CONSUMER.LABEL,
        [adminSite2]: SITE_ROLES.SITE_CONTRIBUTOR.LABEL,
        [adminSite3]: SITE_ROLES.SITE_COLLABORATOR.LABEL,
        [adminSite4]: SITE_ROLES.SITE_MANAGER.LABEL
      };

      const sitesList = await dataTable.getSitesNameAndRole();

      for (const site of Object.keys(expectedSitesRoles)) {
        await expect(sitesList[site]).toEqual(expectedSitesRoles[site]);
      }
    });

    it('[C217098] Site ID is displayed when two sites have the same name', async () => {
      const expectedSites = [`${siteName} (${siteId1})`, `${siteName} (${siteId2})`];
      const actualSites = await dataTable.getCellsContainingName(siteName);
      await expect(actualSites.sort()).toEqual(expectedSites.sort());
    });

    it('[C217096] Tooltip for sites without description', async () => {
      const tooltip = await dataTable.getItemNameTooltip(userSitePrivate);
      expect(tooltip).toBe(`${userSitePrivate}`);
    });

    it('[C217097] Tooltip for sites with description', async () => {
      const tooltip = await dataTable.getItemNameTooltip(userSiteModerated);
      expect(tooltip).toBe(`${siteDescription}`);
    });
  });

  describe('Favorite Libraries', () => {
    beforeEach(async () => {
      await page.goToFavoriteLibrariesAndWait();
    });

    it('[C289893] has the correct columns', async () => {
      const expectedColumns = ['Name', 'Description', 'My Role', 'Visibility'];
      const actualColumns = await dataTable.getColumnHeadersText();

      await expect(actualColumns).toEqual(expectedColumns);
    });

    it('[C289897] User can see only his favorite sites', async () => {
      const sitesCount = await dataTable.getRowsCount();

      expect(sitesCount).toEqual(9, 'Incorrect number of sites displayed');
      expect(await dataTable.isItemPresent(adminSite6)).toBe(false, `${adminSite6} should not appear`);
    });

    it('[C289906] Library visibility is correctly displayed', async () => {
      const expectedSitesVisibility = {
        [userSitePrivate]: SITE_VISIBILITY.PRIVATE,
        [userSiteModerated]: SITE_VISIBILITY.MODERATED,
        [userSitePublic]: SITE_VISIBILITY.PUBLIC
      };

      const sitesList = await dataTable.getSitesNameAndVisibility();

      for (const site of Object.keys(expectedSitesVisibility)) {
        expect(sitesList[site]).toEqual(expectedSitesVisibility[site]);
      }
    });

    it('[C289904] User role is correctly displayed', async () => {
      const expectedSitesRoles = {
        [adminSite1]: SITE_ROLES.SITE_CONSUMER.LABEL,
        [adminSite2]: SITE_ROLES.SITE_CONTRIBUTOR.LABEL,
        [adminSite3]: SITE_ROLES.SITE_COLLABORATOR.LABEL,
        [adminSite4]: SITE_ROLES.SITE_MANAGER.LABEL
      };

      const sitesList = await dataTable.getSitesNameAndRole();

      for (const site of Object.keys(expectedSitesRoles)) {
        expect(sitesList[site]).toEqual(expectedSitesRoles[site]);
      }
    });

    it('[C289896] Site ID is displayed when two sites have the same name', async () => {
      const expectedSites = [`${siteName} (${siteId1})`, `${siteName} (${siteId2})`];
      const actualSites = await dataTable.getCellsContainingName(siteName);
      expect(actualSites.sort()).toEqual(expectedSites.sort());
    });

    it('[C289894] Tooltip for sites without description', async () => {
      const tooltip = await dataTable.getItemNameTooltip(userSitePrivate);
      expect(tooltip).toBe(`${userSitePrivate}`);
    });

    it('[C289895] Tooltip for sites with description', async () => {
      const tooltip = await dataTable.getItemNameTooltip(userSiteModerated);
      expect(tooltip).toBe(`${siteDescription}`);
    });
  });
});
