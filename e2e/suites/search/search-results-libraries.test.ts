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

import { LoginPage, SearchResultsPage } from '../../pages/pages';
import { RepoClient } from '../../utilities/repo-client/repo-client';
import { Utils } from '../../utilities/utils';
import { SITE_VISIBILITY, SITE_ROLES } from './../../configs';

describe('Search results - libraries', () => {
  const username = `user-${Utils.random()}`;

  const site1 = {
    name: `lib-1-${Utils.random()}`,
    id: `site1-${Utils.random()}`
  };
  const site2 = {
    name: `site-2-${Utils.random()}`,
    id: `site1-${Utils.random()}`
  };
  const site3 = {
    name: `my-lib-${Utils.random()}`,
    id: `site3-${Utils.random()}`
  };
  const site4 = {
    name: `my-site-${Utils.random()}`,
    id: `site4-${Utils.random()}`,
    description: 'site description'
  };

  const userSitePrivate = `user-site-private-${Utils.random()}`;
  const userSiteModerated = `user-site-moderated-${Utils.random()}`;
  const userSitePublic = `user-site-public-${Utils.random()}`;

  const siteRussian = {
    /* cspell:disable-next-line */
    name: `любимый-сайт-${Utils.random()}`,
    id: `site-russian-id-${Utils.random()}`
  };

  const adminSite1 = `admin-site-${Utils.random()}`;
  const adminSite2 = `admin-site-${Utils.random()}`;
  const adminSite3 = `admin-site-${Utils.random()}`;
  const adminSite4 = `admin-site-${Utils.random()}`;

  const adminPrivate = `admin-site-${Utils.random()}`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new SearchResultsPage();
  const { searchInput } = page.header;
  const dataTable = page.dataTable;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    await apis.user.sites.createSite(site1.name, SITE_VISIBILITY.PUBLIC, '', site1.id);
    await apis.user.sites.createSite(site2.name, SITE_VISIBILITY.PUBLIC, '', site2.id);
    await apis.user.sites.createSite(site3.name, SITE_VISIBILITY.PUBLIC, '', site3.id);
    await apis.user.sites.createSite(site4.name, SITE_VISIBILITY.PUBLIC, site4.description, site4.id);

    await apis.user.sites.createSite(userSitePublic, SITE_VISIBILITY.PUBLIC);
    await apis.user.sites.createSite(userSiteModerated, SITE_VISIBILITY.MODERATED);
    await apis.user.sites.createSite(userSitePrivate, SITE_VISIBILITY.PRIVATE);

    await apis.user.sites.createSite(siteRussian.name, SITE_VISIBILITY.PUBLIC, '', siteRussian.id);

    await apis.admin.sites.createSite(adminSite1, SITE_VISIBILITY.PUBLIC);
    await apis.admin.sites.createSite(adminSite2, SITE_VISIBILITY.PUBLIC);
    await apis.admin.sites.createSite(adminSite3, SITE_VISIBILITY.PUBLIC);
    await apis.admin.sites.createSite(adminSite4, SITE_VISIBILITY.PUBLIC);
    await apis.admin.sites.addSiteMember(adminSite1, username, SITE_ROLES.SITE_CONSUMER.ROLE);
    await apis.admin.sites.addSiteMember(adminSite2, username, SITE_ROLES.SITE_CONTRIBUTOR.ROLE);
    await apis.admin.sites.addSiteMember(adminSite3, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
    await apis.admin.sites.addSiteMember(adminSite4, username, SITE_ROLES.SITE_MANAGER.ROLE);

    await apis.admin.sites.createSite(adminPrivate, SITE_VISIBILITY.PRIVATE);

    await apis.user.sites.waitForApi({ expect: 12 });
    await apis.user.queries.waitForSites('lib', { expect: 2 });
    await apis.user.queries.waitForSites('my-site', { expect: 1 });

    await loginPage.loginWith(username);
    done();
  });

  afterAll(async (done) => {
    await Promise.all(<any>[
      apis.admin.sites.deleteSites([ adminSite1, adminSite2, adminSite3, adminSite4, adminPrivate ]),
      apis.user.sites.deleteSites([ site1.id, site2.id, site3.id, site4.id, userSitePublic, userSiteModerated, userSitePrivate, siteRussian.id ])
    ]);
    done();
  });

  beforeEach(async (done) => {
    await Utils.pressEscape();
    done();
  });

  it('Search library - full name match - [C290012]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor(site1.name);
    await dataTable.waitForBody();

    expect(await dataTable.isItemPresent(site1.name)).toBe(true, `${site1.name} not displayed`);
    expect(await dataTable.isItemPresent(site2.name)).toBe(false, `${site2.name} displayed`);
    expect(await dataTable.isItemPresent(site3.name)).toBe(false, `${site3.name} displayed`);
    expect(await dataTable.isItemPresent(site4.name)).toBe(false, `${site4.name} displayed`);
  });

  it('Search library - partial name match - [C290013]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor('lib');
    await dataTable.waitForBody();

    expect(await dataTable.isItemPresent(site1.name)).toBe(true, `${site1.name} not displayed`);
    expect(await dataTable.isItemPresent(site2.name)).toBe(false, `${site2.name} displayed`);
    expect(await dataTable.isItemPresent(site3.name)).toBe(true, `${site3.name} not displayed`);
    expect(await dataTable.isItemPresent(site4.name)).toBe(false, `${site4.name} displayed`);
  });

  it('Search library - description match - [C290014]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor(site4.description);
    await dataTable.waitForBody();

    expect(await dataTable.isItemPresent(site1.name)).toBe(false, `${site1.name} displayed`);
    expect(await dataTable.isItemPresent(site2.name)).toBe(false, `${site2.name} displayed`);
    expect(await dataTable.isItemPresent(site3.name)).toBe(false, `${site3.name} displayed`);
    expect(await dataTable.isItemPresent(site4.name)).toBe(true, `${site4.name} not displayed`);
  });

  it('Results page title - [C290015]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor('lib');
    await dataTable.waitForBody();

    expect(await page.breadcrumb.getCurrentItemName()).toEqual('Libraries found...');
  });

  it('Results page columns - [C290016]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor(site1.name);
    await dataTable.waitForBody();

    const expectedColumns = [ 'Thumbnail', 'Name', 'My Role', 'Visibility' ];
    const actualColumns = await dataTable.getColumnHeadersText();

    expect(actualColumns).toEqual(expectedColumns);
  });

  it('Library visibility is correctly displayed - [C290017]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor('user-site');
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

  it('User role is correctly displayed - [C290018]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor('admin-site');
    await dataTable.waitForBody();

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

  it('Private sites are not displayed when user is not a member - [C290019]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor('admin-site');
    await dataTable.waitForBody();

    expect(await dataTable.isItemPresent(adminPrivate)).toBe(false, `${adminPrivate} is displayed`);
  });

  it('Search libraries with special characters - [C290028]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    await searchInput.searchFor(siteRussian.name);
    await dataTable.waitForBody();

    expect(await dataTable.isItemPresent(siteRussian.name)).toBe(true, `${siteRussian.name} not displayed`);
  });

});
