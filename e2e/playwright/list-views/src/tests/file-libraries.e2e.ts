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
import { ApiClientFactory, FavoritesPageApi, SitesApi, Utils, test, timeouts } from '@alfresco/playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('File Libraries', () => {
  let siteActionsAdmin: SitesApi;
  let siteActionsUser: SitesApi;

  const username = `user-${Utils.random()}`;
  const userSitePrivate = `user-priv-${Utils.random()}`;
  const userSiteModerated = `user-mode-${Utils.random()}`;
  const userSitePublic = `user-pub-${Utils.random()}`;
  const siteName = `siteName-${Utils.random()}`;

  const siteId1 = Utils.random();
  const siteId2 = Utils.random();

  const adminSite1 = `admin1-${Utils.random()}`;
  const adminSite2 = `admin2-${Utils.random()}`;
  const adminSite3 = `admin3-${Utils.random()}`;
  const adminSite4 = `admin4-${Utils.random()}`;
  const adminSite5 = `admin5-${Utils.random()}`;

  test.beforeAll(async () => {
    try {
      test.setTimeout(timeouts.extendedTest);
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
      siteActionsAdmin = await SitesApi.initialize('admin');
      siteActionsUser = await SitesApi.initialize(username, username);
      const favoritesActions = await FavoritesPageApi.initialize(username, username);
      const siteDescription = 'my site description';
      await siteActionsUser.createSite(userSitePublic, Site.VisibilityEnum.PUBLIC);
      await siteActionsUser.createSite(userSiteModerated, Site.VisibilityEnum.MODERATED, siteDescription);
      await siteActionsUser.createSite(userSitePrivate, Site.VisibilityEnum.PRIVATE, null);

      await siteActionsAdmin.createSite(adminSite1, Site.VisibilityEnum.PUBLIC);
      await siteActionsAdmin.createSite(adminSite2, Site.VisibilityEnum.PUBLIC);
      await siteActionsAdmin.createSite(adminSite3, Site.VisibilityEnum.PUBLIC);
      await siteActionsAdmin.createSite(adminSite4, Site.VisibilityEnum.PUBLIC);
      await siteActionsAdmin.createSite(adminSite5, Site.VisibilityEnum.PUBLIC);
      await siteActionsAdmin.addSiteMember(adminSite1, username, Site.RoleEnum.SiteConsumer);
      await siteActionsAdmin.addSiteMember(adminSite2, username, Site.RoleEnum.SiteContributor);
      await siteActionsAdmin.addSiteMember(adminSite3, username, Site.RoleEnum.SiteCollaborator);
      await siteActionsAdmin.addSiteMember(adminSite4, username, Site.RoleEnum.SiteManager);
      await siteActionsAdmin.addSiteMember(adminSite5, username, Site.RoleEnum.SiteConsumer);

      await favoritesActions.addFavoriteById('site', adminSite1);
      await favoritesActions.addFavoriteById('site', adminSite2);
      await favoritesActions.addFavoriteById('site', adminSite3);
      await favoritesActions.addFavoriteById('site', adminSite4);

      await siteActionsUser.createSite(siteName, Site.VisibilityEnum.PUBLIC, null, siteId1);
      await siteActionsUser.createSite(siteName, Site.VisibilityEnum.PUBLIC, null, siteId2);
    } catch (error) {
      console.error(`----- beforeAll failed : ${error}`);
    }
  });

  test.afterAll(async () => {
    await siteActionsUser.deleteSites([userSitePublic, userSiteModerated, userSitePrivate, siteId1, siteId2]);
    await siteActionsAdmin.deleteSites([adminSite1, adminSite2, adminSite3, adminSite4, adminSite5]);
  });

  test.describe('My Libraries', () => {
    test.beforeEach(async ({ loginPage, myLibrariesPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await myLibrariesPage.navigate();
    });

    test('[C217095] has the correct columns', async ({ myLibrariesPage }) => {
      const expectedColumns = ['Name', 'Description', 'My Role', 'Visibility'];
      const actualColumns = await myLibrariesPage.dataTable.getColumnHeaders();
      expect(actualColumns).toEqual(expectedColumns);
    });

    test('[C289905] Library visibility is correctly displayed', async ({ myLibrariesPage }) => {
      const expectedSitesVisibility = {
        [userSitePrivate]: Site.VisibilityEnum.PRIVATE,
        [userSiteModerated]: Site.VisibilityEnum.MODERATED,
        [userSitePublic]: Site.VisibilityEnum.PUBLIC
      };
      for (const [site, visibility] of Object.entries(expectedSitesVisibility)) {
        const sitesVisibility = await myLibrariesPage.dataTable.getRowAllInnerTexts(site);
        expect(sitesVisibility.toLowerCase()).toContain(visibility.toLowerCase());
      }
    });

    test('[C289903] User role is correctly displayed', async ({ myLibrariesPage }) => {
      const expectedSitesRoles = {
        [adminSite1]: Site.RoleEnum.SiteConsumer,
        [adminSite2]: Site.RoleEnum.SiteContributor,
        [adminSite3]: Site.RoleEnum.SiteCollaborator,
        [adminSite4]: Site.RoleEnum.SiteManager
      };

      for (const [site, role] of Object.entries(expectedSitesRoles)) {
        const sitesRowNames = await myLibrariesPage.dataTable.getRowAllInnerTexts(site);
        expect(sitesRowNames).toContain(role.split('Site')[1]);
      }
    });

    test('[C217098] Site ID is displayed when two sites have the same name', async ({ myLibrariesPage }) => {
      const expectedSites = [`${siteName} (${siteId1})`, `${siteName} (${siteId2})`];
      const actualSite1 = await myLibrariesPage.dataTable.getRowAllInnerTexts(siteId1);
      expect(actualSite1).toContain(expectedSites[0]);
      const actualSite2 = await myLibrariesPage.dataTable.getRowAllInnerTexts(siteId2);
      expect(actualSite2).toContain(expectedSites[1]);
    });
  });

  test.describe('Favorite Libraries', () => {
    test.beforeEach(async ({ loginPage, favoritesLibrariesPage }) => {
      await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
      await favoritesLibrariesPage.navigate();
    });

    test('[C289893] has the correct columns', async ({ favoritesLibrariesPage }) => {
      const expectedColumns = ['Name', 'Description', 'My Role', 'Visibility'];
      const actualColumns = await favoritesLibrariesPage.dataTable.getColumnHeaders();

      expect(actualColumns).toEqual(expectedColumns);
    });

    test('[C289897] User can see only his favorite sites', async ({ favoritesLibrariesPage }) => {
      expect(await favoritesLibrariesPage.dataTable.isItemPresent(adminSite5), `${adminSite5} should not appear`).toBe(false);
    });
  });
});
