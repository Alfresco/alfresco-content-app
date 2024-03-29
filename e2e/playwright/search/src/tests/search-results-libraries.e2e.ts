/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { expect } from '@playwright/test';
import {
  ApiClientFactory,
  Utils,
  test,
  TrashcanApi,
  NodesApi,
  SitesApi,
  FileActionsApi,
  SITE_VISIBILITY,
  SITE_ROLES
} from '@alfresco/playwright-shared';

test.describe('Search Results - General', () => {
  let trashcanApi: TrashcanApi;
  let nodesApi: NodesApi;
  let sitesApi: SitesApi;
  let sitesAdminApi: SitesApi;
  let fileActionsApi: FileActionsApi;

  const random = Utils.random();
  const username = `user-${random}`;
  const randomDescription = random + '-' + random;

  const site1 = {
    name: `lib-${random}-1`,
    id: `site-${random}-1`
  };
  const site2 = {
    name: `site-2-${random}`,
    id: `site-${random}-2`
  };
  const site3 = {
    name: `lib-${random}-2`,
    id: `site3-${random}`
  };
  const site4 = {
    name: `my-site-${random}`,
    id: `site4-${random}`,
    description: randomDescription
  };

  const userSitePrivate = `user-site-${random}-private`;
  const userSiteModerated = `user-site-${random}-moderated`;
  const userSitePublic = `user-site-${random}-public`;

  const adminSite1 = `admin-${random}-site1`;
  const adminSite2 = `admin-${random}-site2`;
  const adminSite3 = `admin-${random}-site3`;
  const adminSite4 = `admin-${random}-site4`;
  const adminPrivate = `admin-${random}-sitePrivate`;

  const siteRussian = {
    /* cspell:disable-next-line */
    name: `любимый-сайт-${random}`,
    id: `site-russian-id-${random}`
  };

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed', sitesAdminApi, [
      site1.id,
      site2.id,
      site3.id,
      site4.id,
      userSiteModerated,
      userSitePrivate,
      userSitePublic,
      adminSite1,
      adminSite2,
      adminSite3,
      adminSite4,
      adminPrivate,
      siteRussian.id
    ]);
  });

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      trashcanApi = await TrashcanApi.initialize(username, username);
      sitesApi = await SitesApi.initialize(username, username);
      fileActionsApi = await FileActionsApi.initialize(username, username);
      nodesApi = await NodesApi.initialize(username, username);
      sitesAdminApi = await SitesApi.initialize('admin');

      await sitesApi.createSite(site1.name, null, null, site1.id);
      await sitesApi.createSite(site2.name, null, null, site2.id);
      await sitesApi.createSite(site3.name, null, null, site3.id);
      await sitesApi.createSite(site4.name, null, site4.description, site4.id);

      await sitesApi.createSite(userSitePublic, SITE_VISIBILITY.PUBLIC);
      await sitesApi.createSite(userSiteModerated, SITE_VISIBILITY.MODERATED);
      await sitesApi.createSite(userSitePrivate, SITE_VISIBILITY.PRIVATE);

      await sitesAdminApi.createSite(adminSite1, SITE_VISIBILITY.PUBLIC);
      await sitesAdminApi.createSite(adminSite2, SITE_VISIBILITY.PUBLIC);
      await sitesAdminApi.createSite(adminSite3, SITE_VISIBILITY.PUBLIC);
      await sitesAdminApi.createSite(adminSite4, SITE_VISIBILITY.PUBLIC);
      await sitesAdminApi.addSiteMember(adminSite1, username, SITE_ROLES.SITE_CONSUMER.ROLE);
      await sitesAdminApi.addSiteMember(adminSite2, username, SITE_ROLES.SITE_CONTRIBUTOR.ROLE);
      await sitesAdminApi.addSiteMember(adminSite3, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
      await sitesAdminApi.addSiteMember(adminSite4, username, SITE_ROLES.SITE_MANAGER.ROLE);

      await sitesAdminApi.createSite(adminPrivate, SITE_VISIBILITY.PRIVATE);

      await sitesApi.createSite(siteRussian.name, SITE_VISIBILITY.PUBLIC, '', siteRussian.id);
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test('[C290012] Search library - full name match', async ({ searchPage }) => {
    await searchPage.searchWithin(site1.name, 'libraries');

    expect(await searchPage.dataTable.isItemPresent(site1.name)).toBeTruthy();
    expect(await searchPage.dataTable.isItemPresent(site2.name)).toBeFalsy();
    expect(await searchPage.dataTable.isItemPresent(site3.name)).toBeFalsy();
    expect(await searchPage.dataTable.isItemPresent(site4.name)).toBeFalsy();
  });

  test('[C290013] Search library - partial name match', async ({ searchPage }) => {
    await fileActionsApi.waitForNodes(site3.id, { expect: 1 });
    await searchPage.searchWithin(`lib-${random}`, 'libraries');

    expect(await searchPage.dataTable.isItemPresent(site1.name)).toBeTruthy();
    expect(await searchPage.dataTable.isItemPresent(site2.name)).toBeFalsy();
    expect(await searchPage.dataTable.isItemPresent(site3.name)).toBeTruthy();
    expect(await searchPage.dataTable.isItemPresent(site4.name)).toBeFalsy();
  });

  test('[C290014] Search library - description match', async ({ searchPage }) => {
    await searchPage.searchWithin(site4.description, 'libraries');

    expect(await searchPage.dataTable.isItemPresent(site1.name)).toBeFalsy();
    expect(await searchPage.dataTable.isItemPresent(site2.name)).toBeFalsy();
    expect(await searchPage.dataTable.isItemPresent(site3.name)).toBeFalsy();
    expect(await searchPage.dataTable.isItemPresent(site4.name)).toBeTruthy();
  });

  test('[C290016] Results page columns', async ({ searchPage }) => {
    await searchPage.searchWithin(site1.name, 'libraries');

    const expectedColumns = ['Name', 'Description', 'My Role', 'Visibility'];
    const actualColumns = await searchPage.dataTable.getColumnHeaders();

    expect(actualColumns).toEqual(expectedColumns);
  });

  test('[C290017] Library visibility is correctly displayed', async ({ searchPage }) => {
    await searchPage.searchWithin(`user-site-${random}`, 'libraries');

    const expectedSitesVisibility = {
      [userSitePrivate]: SITE_VISIBILITY.PRIVATE,
      [userSiteModerated]: SITE_VISIBILITY.MODERATED,
      [userSitePublic]: SITE_VISIBILITY.PUBLIC
    };

    const actualSitesVisibility = await searchPage.dataTable.getSitesNameAndVisibility();

    expect(expectedSitesVisibility).toEqual(actualSitesVisibility);
  });

  test('[C290018] User role is correctly displayed', async ({ searchPage }) => {
    await searchPage.searchWithin(`admin-${random}-site`, 'libraries');

    const expectedSitesRoles = {
      [adminSite1]: SITE_ROLES.SITE_CONSUMER.LABEL,
      [adminSite2]: SITE_ROLES.SITE_CONTRIBUTOR.LABEL,
      [adminSite3]: SITE_ROLES.SITE_COLLABORATOR.LABEL,
      [adminSite4]: SITE_ROLES.SITE_MANAGER.LABEL
    };

    const actualSitesRole = await searchPage.dataTable.getSitesNameAndRole();

    expect(expectedSitesRoles).toEqual(actualSitesRole);
  });

  test('[C290019] Private sites are not displayed when user is not a member', async ({ searchPage }) => {
    await searchPage.searchWithin(`admin-${random}-site`, 'libraries');

    expect(await searchPage.dataTable.isItemPresent(adminPrivate)).toBeFalsy();
  });

  test('[C290028] Search libraries with special characters', async ({ searchPage }) => {
    await searchPage.searchWithin(siteRussian.name, 'libraries');

    expect(await searchPage.dataTable.isItemPresent(siteRussian.name)).toBeTruthy();
  });
});
