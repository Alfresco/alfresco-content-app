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
    admin: new RepoClient(),
    user: new RepoClient(username, password)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable } = page;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    await apis.user.sites.createSite(userSitePublic, SITE_VISIBILITY.PUBLIC);
    await apis.user.sites.createSite(userSiteModerated, SITE_VISIBILITY.MODERATED, siteDescription);
    await apis.user.sites.createSite(userSitePrivate, SITE_VISIBILITY.PRIVATE, null);

    await apis.admin.sites.createSite(adminSite1, SITE_VISIBILITY.PUBLIC);
    await apis.admin.sites.createSite(adminSite2, SITE_VISIBILITY.PUBLIC);
    await apis.admin.sites.createSite(adminSite3, SITE_VISIBILITY.PUBLIC);
    await apis.admin.sites.createSite(adminSite4, SITE_VISIBILITY.PUBLIC);
    await apis.admin.sites.createSite(adminSite5, SITE_VISIBILITY.PUBLIC);
    await apis.admin.sites.createSite(adminSite6, SITE_VISIBILITY.PUBLIC);
    await apis.admin.sites.addSiteMember(adminSite1, username, SITE_ROLES.SITE_CONSUMER.ROLE);
    await apis.admin.sites.addSiteMember(adminSite2, username, SITE_ROLES.SITE_CONTRIBUTOR.ROLE);
    await apis.admin.sites.addSiteMember(adminSite3, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
    await apis.admin.sites.addSiteMember(adminSite4, username, SITE_ROLES.SITE_MANAGER.ROLE);
    await apis.admin.sites.addSiteMember(adminSite6, username, SITE_ROLES.SITE_CONSUMER.ROLE);

    await apis.user.favorites.addFavoriteById('site', adminSite1);
    await apis.user.favorites.addFavoriteById('site', adminSite2);
    await apis.user.favorites.addFavoriteById('site', adminSite3);
    await apis.user.favorites.addFavoriteById('site', adminSite4);

    await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC, null, siteId1);
    await apis.user.sites.createSite(siteName, SITE_VISIBILITY.PUBLIC, null, siteId2);

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await apis.user.sites.deleteSites([ userSitePublic, userSiteModerated, userSitePrivate, siteId1, siteId2 ]);
    await apis.admin.sites.deleteSites([ adminSite1, adminSite2, adminSite3, adminSite4, adminSite5, adminSite6 ]);
    done();
  });

  describe('My Libraries', () => {
    beforeEach(async (done) => {
      await page.goToMyLibrariesAndWait();
      done();
    });

    it('has the correct columns - [C217095]', async () => {
      const expectedColumns = [ 'Thumbnail', 'Name', 'My Role', 'Visibility' ];
      const actualColumns = await dataTable.getColumnHeadersText();

      expect(actualColumns).toEqual(expectedColumns);
    });

    it('User can see only the sites he is a member of - [C280501]', async () => {
      const sitesCount = await dataTable.countRows();

      expect(sitesCount).toEqual(10, 'Incorrect number of sites displayed');
      expect(await dataTable.isItemPresent(adminSite5)).toBe(false, `${adminSite5} should not appear in the list`);
    });

    it('Library visibility is correctly displayed - [C289905]', async () => {
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

    it('User role is correctly displayed - [C289903]', async () => {
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

    it('Site ID is displayed when two sites have the same name - [C217098]', async () => {
      const expectedSites = [
        `${siteName} (${siteId1})`,
        `${siteName} (${siteId2})`
      ];
      const cells = await dataTable.getCellsContainingName(siteName);
      const expectedJSON = JSON.stringify(expectedSites.sort());
      const actualJSON = JSON.stringify(cells.sort());
      expect(actualJSON).toEqual(expectedJSON);
    });

    it('Tooltip for sites without description - [C217096]', async () => {
      const tooltip = await dataTable.getItemNameTooltip(userSitePrivate);
      expect(tooltip).toBe(`${userSitePrivate}`);
    });

    it('Tooltip for sites with description - [C217097]', async () => {
      const tooltip = await dataTable.getItemNameTooltip(userSiteModerated);
      expect(tooltip).toBe(`${siteDescription}`);
    });
  });

  describe('Favorite Libraries', () => {
    beforeEach(async (done) => {
      await page.goToFavoriteLibrariesAndWait();
      done();
    });

    it('has the correct columns - [C289893]', async () => {
      const expectedColumns = [ 'Thumbnail', 'Name', 'My Role', 'Visibility' ];
      const actualColumns = await dataTable.getColumnHeadersText();

      expect(actualColumns).toEqual(expectedColumns);
    });

    it('User can see only his favorite sites - [C289897]', async () => {
      const sitesCount = await dataTable.countRows();

      expect(sitesCount).toEqual(9, 'Incorrect number of sites displayed');
      expect(await dataTable.isItemPresent(adminSite6)).toBe(false, `${adminSite6} should not appear`);
    });

    it('Library visibility is correctly displayed - [C289906]', async () => {
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

    it('User role is correctly displayed - [C289904]', async () => {
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

    it('Site ID is displayed when two sites have the same name - [C289896]', async () => {
      const expectedSites = [
        `${siteName} (${siteId1})`,
        `${siteName} (${siteId2})`
      ];
      const cells = await dataTable.getCellsContainingName(siteName);
      const expectedJSON = JSON.stringify(expectedSites.sort());
      const actualJSON = JSON.stringify(cells.sort());
      expect(actualJSON).toEqual(expectedJSON);
    });

    it('Tooltip for sites without description - [C289894]', async () => {
      const tooltip = await dataTable.getItemNameTooltip(userSitePrivate);
      expect(tooltip).toBe(`${userSitePrivate}`);
    });

    it('Tooltip for sites with description - [C289895]', async () => {
      const tooltip = await dataTable.getItemNameTooltip(userSiteModerated);
      expect(tooltip).toBe(`${siteDescription}`);
    });
  });
});
