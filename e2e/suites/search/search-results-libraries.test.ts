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

import { AdminActions, LoginPage, SearchResultsPage, RepoClient, Utils, SITE_VISIBILITY, SITE_ROLES } from '@alfresco/aca-testing-shared';
import { Logger } from '@alfresco/adf-testing';

describe('Search results - libraries', () => {
  const random = Utils.random();
  const username = `user-${random}`;

  const site1 = {
    name: `lib-${random}-1`,
    id: `site-${random}-1`
  };
  const site2 = {
    name: `site-2-${random}`,
    id: `site-${random}-2`
  };
  const site3 = {
    name: `my-lib-${random}`,
    id: `site3-${random}`
  };
  const site4 = {
    name: `my-site-${random}`,
    id: `site4-${random}`,
    description: 'site description'
  };

  const userSitePrivate = `user-site-${random}-private`;
  const userSiteModerated = `user-site-${random}-moderated`;
  const userSitePublic = `user-site-${random}-public`;

  const siteRussian = {
    /* cspell:disable-next-line */
    name: `любимый-сайт-${random}`,
    id: `site-russian-id-${random}`
  };

  const adminSite1 = `admin-${random}-site1`;
  const adminSite2 = `admin-${random}-site2`;
  const adminSite3 = `admin-${random}-site3`;
  const adminSite4 = `admin-${random}-site4`;
  const adminPrivate = `admin-${random}-sitePrivate`;

  const apis = {
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new SearchResultsPage();
  const { searchInput } = page.header;
  const dataTable = page.dataTable;
  const adminApiActions = new AdminActions();

  beforeAll(async (done) => {
    try {
      await adminApiActions.createUser({ username });

      await apis.user.sites.createSite(site1.name, SITE_VISIBILITY.PUBLIC, '', site1.id);
      await apis.user.sites.createSite(site2.name, SITE_VISIBILITY.PUBLIC, '', site2.id);
      await apis.user.sites.createSite(site3.name, SITE_VISIBILITY.PUBLIC, '', site3.id);
      await apis.user.sites.createSite(site4.name, SITE_VISIBILITY.PUBLIC, site4.description, site4.id);

      await apis.user.sites.createSite(userSitePublic, SITE_VISIBILITY.PUBLIC);
      await apis.user.sites.createSite(userSiteModerated, SITE_VISIBILITY.MODERATED);
      await apis.user.sites.createSite(userSitePrivate, SITE_VISIBILITY.PRIVATE);

      await apis.user.sites.createSite(siteRussian.name, SITE_VISIBILITY.PUBLIC, '', siteRussian.id);

      await adminApiActions.sites.createSite(adminSite1, SITE_VISIBILITY.PUBLIC);
      await adminApiActions.sites.createSite(adminSite2, SITE_VISIBILITY.PUBLIC);
      await adminApiActions.sites.createSite(adminSite3, SITE_VISIBILITY.PUBLIC);
      await adminApiActions.sites.createSite(adminSite4, SITE_VISIBILITY.PUBLIC);
      await adminApiActions.sites.addSiteMember(adminSite1, username, SITE_ROLES.SITE_CONSUMER.ROLE);
      await adminApiActions.sites.addSiteMember(adminSite2, username, SITE_ROLES.SITE_CONTRIBUTOR.ROLE);
      await adminApiActions.sites.addSiteMember(adminSite3, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
      await adminApiActions.sites.addSiteMember(adminSite4, username, SITE_ROLES.SITE_MANAGER.ROLE);

      await adminApiActions.sites.createSite(adminPrivate, SITE_VISIBILITY.PRIVATE);

      await adminApiActions.login();
      await adminApiActions.sites.waitForSitesToBeCreated([adminSite1, adminSite2, adminSite3, adminSite4]);

      await apis.user.sites.waitForSitesToBeCreated([
        site1.id,
        site2.id,
        site3.id,
        site4.id,
        userSitePublic,
        userSiteModerated,
        userSitePrivate,
        siteRussian.id
      ]);

      await apis.user.queries.waitForSites(random, { expect: 12 });

      await loginPage.loginWith(username);
    } catch (error) {
      Logger.error(`----- beforeAll failed : ${error}`);
    }
    done();
  });

  afterAll(async () => {
    try {
      await adminApiActions.sites.deleteSites([adminSite1, adminSite2, adminSite3, adminSite4, adminPrivate]);
      await apis.user.sites.deleteSites([site1.id, site2.id, site3.id, site4.id, userSitePublic, userSiteModerated, userSitePrivate, siteRussian.id]);
    } catch (error) {
      Logger.error(`----- afterAll failed : ${error}`);
    }
  });

  beforeEach(async () => {
    await Utils.pressEscape();
    await page.clickPersonalFiles();
  });

  it('[C290012] Search library - full name match', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor(site1.name);
    await dataTable.waitForBody();

    expect(await dataTable.isItemPresent(site1.name)).toBe(true, `${site1.name} not displayed`);
    expect(await dataTable.isItemPresent(site2.name)).toBe(false, `${site2.name} displayed`);
    expect(await dataTable.isItemPresent(site3.name)).toBe(false, `${site3.name} displayed`);
    expect(await dataTable.isItemPresent(site4.name)).toBe(false, `${site4.name} displayed`);
  });

  it('[C290013] Search library - partial name match', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor(`lib-${random}`);
    await dataTable.waitForBody();

    expect(await dataTable.isItemPresent(site1.name)).toBe(true, `${site1.name} not displayed`);
    expect(await dataTable.isItemPresent(site2.name)).toBe(false, `${site2.name} displayed`);
    expect(await dataTable.isItemPresent(site3.name)).toBe(true, `${site3.name} not displayed`);
    expect(await dataTable.isItemPresent(site4.name)).toBe(false, `${site4.name} displayed`);
  });

  it('[C290014] Search library - description match', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor(site4.description);
    await dataTable.waitForBody();

    expect(await dataTable.isItemPresent(site1.name)).toBe(false, `${site1.name} displayed`);
    expect(await dataTable.isItemPresent(site2.name)).toBe(false, `${site2.name} displayed`);
    expect(await dataTable.isItemPresent(site3.name)).toBe(false, `${site3.name} displayed`);
    expect(await dataTable.isItemPresent(site4.name)).toBe(true, `${site4.name} not displayed`);
  });

  it('[C290015] Results page title', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor(random);
    await dataTable.waitForBody();

    expect(await page.breadcrumb.currentItem.getText()).toEqual('Libraries found...');
  });

  it('[C290016] Results page columns', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor(site1.name);
    await dataTable.waitForBody();

    const expectedColumns = ['Name', 'Description', 'My Role', 'Visibility'];
    const actualColumns = await dataTable.getColumnHeadersText();

    await expect(actualColumns).toEqual(expectedColumns);
  });

  it('[C290017] Library visibility is correctly displayed', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor(`user-site-${random}`);
    await dataTable.waitForBody();

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

  it('[C290018] User role is correctly displayed', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor(`admin-${random}-site`);
    await dataTable.waitForBody();

    const expectedSitesRoles = {
      [adminSite1]: SITE_ROLES.SITE_CONSUMER.LABEL,
      [adminSite2]: SITE_ROLES.SITE_CONTRIBUTOR.LABEL,
      [adminSite3]: SITE_ROLES.SITE_COLLABORATOR.LABEL,
      [adminSite4]: SITE_ROLES.SITE_MANAGER.LABEL
    };

    const sitesList: any = await dataTable.getSitesNameAndRole();

    for (const site of Object.keys(expectedSitesRoles)) {
      expect(sitesList[site]).toEqual(expectedSitesRoles[site]);
    }
  });

  it('[C290019] Private sites are not displayed when user is not a member', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor(`admin-${random}-site`);
    await dataTable.waitForBody();

    expect(await dataTable.isItemPresent(adminPrivate)).toBe(false, `${adminPrivate} is displayed`);
  });

  it('[C290028] Search libraries with special characters', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor(siteRussian.name);
    await dataTable.waitForBody();

    expect(await dataTable.isItemPresent(siteRussian.name)).toBe(true, `${siteRussian.name} not displayed`);
  });
});
