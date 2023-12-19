/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
  FavoritesPageApi,
  FileActionsApi,
  LoginPage,
  NodesApi,
  SharedLinksApi,
  SitesApi,
  Utils,
  test,
  timeouts
} from '@alfresco/playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('Special permissions', () => {
  const username = `userPermissions-${Utils.random()}`;
  let siteApiAdmin: SitesApi;
  test.beforeAll(async () => {
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
  });

  test.describe('file not displayed if user no longer has permissions on it', () => {
    const sitePrivate = `private-${Utils.random()}`;
    const fileName = `file-${Utils.random()}.txt`;

    test.beforeAll(async () => {
      test.setTimeout(timeouts.webServer);
      const userFavoritesApi = await FavoritesPageApi.initialize(username, username);
      const userFileActionApi = await FileActionsApi.initialize(username, username);
      siteApiAdmin = await SitesApi.initialize('admin');
      const nodeApiAdmin = await NodesApi.initialize('admin');
      const shareApiAdmin = await SharedLinksApi.initialize('admin');
      const shareApiUser = await SharedLinksApi.initialize(username, username);

      await siteApiAdmin.createSite(sitePrivate, Site.VisibilityEnum.PRIVATE);
      await siteApiAdmin.addSiteMember(sitePrivate, username, Site.RoleEnum.SiteCollaborator);
      const docLibId = await siteApiAdmin.getDocLibId(sitePrivate);
      const fileId = (await nodeApiAdmin.createFile(fileName, docLibId)).entry.id;
      await shareApiAdmin.shareFileById(fileId);
      await userFavoritesApi.addFavoriteById('file', fileId);

      await userFileActionApi.updateNodeContent(fileId, 'edited by user');

      await userFileActionApi.waitForNodes(username, { expect: 1 });

      await shareApiAdmin.waitForFilesToBeShared([fileId]);
      await shareApiUser.waitForFilesToBeShared([fileId]);
    });

    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.loginUser(
        { username, password: username },
        {
          withNavigation: true,
          waitForLoading: true
        }
      );
    });

    test.afterEach(async () => {
      await siteApiAdmin.addSiteMember(sitePrivate, username, Site.RoleEnum.SiteCollaborator);
    });

    test.afterAll(async () => {
      await siteApiAdmin.deleteSites([sitePrivate]);
    });

    test('[C213173] on Recent Files', async ({ recentFilesPage }) => {
      await recentFilesPage.navigate();
      expect(await recentFilesPage.dataTable.getRowsCount(), 'Incorrect number of items').toBe(2);
      await siteApiAdmin.deleteSiteMember(sitePrivate, username);
      await recentFilesPage.reload();
      expect(await recentFilesPage.dataTable.isEmpty(), 'Items are still displayed').toBe(true);
    });

    test('[C213227] on Favorites', async ({ favoritePage }) => {
      await favoritePage.navigate();
      expect(await favoritePage.dataTable.getRowsCount(), 'Incorrect number of items').toBe(2);
      await siteApiAdmin.deleteSiteMember(sitePrivate, username);
      await favoritePage.reload();
      expect(await favoritePage.dataTable.isEmpty(), 'Items are still displayed').toBe(true);
    });

    test('[C213116] on Shared Files', async ({ sharedPage }) => {
      await sharedPage.navigate();
      expect(await sharedPage.dataTable.getRowsCount(), 'Incorrect number of items').toBe(2);
      await siteApiAdmin.deleteSiteMember(sitePrivate, username);
      await sharedPage.reload();
      expect(await sharedPage.dataTable.getRowsCount(), 'Incorrect number of items').toBe(0);
    });

    test('[C290122] on Search Results', async ({ personalFiles, searchPage }) => {
      await personalFiles.acaHeader.searchButton.click();
      await searchPage.searchInput.searchButton.click();
      await searchPage.searchOverlay.checkFilesAndFolders();
      await searchPage.searchOverlay.searchFor(fileName);
      await searchPage.dataTable.spinnerWaitForReload();

      expect(await searchPage.dataTable.getRowsCount(), 'Incorrect number of items').toBe(2);

      await siteApiAdmin.deleteSiteMember(sitePrivate, username);

      await searchPage.reload();
      await searchPage.dataTable.spinnerWaitForReload();

      expect(await searchPage.dataTable.getRowsCount(), 'Incorrect number of items').toBe(0);
    });
  });

  test.describe(`Location column is empty if user doesn't have permissions on the file's parent folder`, () => {
    const sitePrivate = `private-${Utils.random()}`;
    const fileName = `file-${Utils.random()}.txt`;
    let adminSiteApiActions: SitesApi;

    test.beforeAll(async () => {
      test.setTimeout(timeouts.webServer);
      const userFavoritesApi = await FavoritesPageApi.initialize(username, username);
      const userShareActionApi = await SharedLinksApi.initialize(username, username);
      const userNodeActionApi = await NodesApi.initialize(username, username);
      adminSiteApiActions = await SitesApi.initialize('admin');

      await adminSiteApiActions.createSite(sitePrivate, Site.VisibilityEnum.PRIVATE);
      await adminSiteApiActions.addSiteMember(sitePrivate, username, Site.RoleEnum.SiteCollaborator);
      const docLibId = await adminSiteApiActions.getDocLibId(sitePrivate);
      const fileId = (await userNodeActionApi.createFile(fileName, docLibId)).entry.id;
      await userFavoritesApi.addFavoriteById('file', fileId);

      await userShareActionApi.shareFileById(fileId);
      await userShareActionApi.waitForFilesToBeShared([fileId]);
      await adminSiteApiActions.deleteSiteMember(sitePrivate, username);
    });

    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.loginUser(
        { username, password: username },
        {
          withNavigation: true,
          waitForLoading: true
        }
      );
    });

    test.afterAll(async () => {
      await adminSiteApiActions.deleteSites([sitePrivate]);
    });

    test('[C213178] on Recent Files', async ({ recentFilesPage }) => {
      await recentFilesPage.navigate();
      expect(await recentFilesPage.dataTable.getRowsCount(), 'Incorrect number of items').toBe(2);
      expect(await recentFilesPage.dataTable.getItemLocationText(fileName)).toEqual('Unknown');
    });

    test('[C213672] on Favorites', async ({ favoritePage }) => {
      await favoritePage.navigate();
      expect(await favoritePage.dataTable.getRowsCount(), 'Incorrect number of items').toBe(2);
      expect(await favoritePage.dataTable.getItemLocationText(fileName)).toEqual('Unknown');
    });

    test(`[C213668] on Shared Files`, async ({ sharedPage }) => {
      await sharedPage.navigate();
      expect(await sharedPage.dataTable.getRowsCount(), 'Incorrect number of items').toBe(2);
      expect(await sharedPage.dataTable.getItemLocationText(fileName)).toEqual('Unknown');
    });

    test('[C306868] on Search results', async ({ personalFiles, searchPage }) => {
      await personalFiles.acaHeader.searchButton.click();
      await searchPage.searchInput.searchButton.click();
      await searchPage.searchOverlay.checkFilesAndFolders();
      await searchPage.searchOverlay.searchFor(fileName);
      await searchPage.dataTable.spinnerWaitForReload();

      expect(await searchPage.dataTable.getRowsCount(), 'Incorrect number of items').toBe(2);
      expect(await searchPage.dataTable.getItemLocationText(fileName)).toEqual('Unknown');
    });
  });
});
