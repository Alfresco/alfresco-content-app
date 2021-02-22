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

import { ApiActions, SITE_VISIBILITY, SITE_ROLES, BrowsingPage, Utils, ConfirmDialog, RepoClient } from '@alfresco/aca-testing-shared';
import { ApiService, BrowserActions, UsersActions, LoginPage } from '@alfresco/adf-testing';

describe('Library actions', () => {
  const sitePublic1Admin = `admin-public1-${Utils.random()}`;
  const sitePublic2Admin = `admin-public2-${Utils.random()}`;
  const sitePublic3Admin = `admin-public3-${Utils.random()}`;
  const sitePublic4Admin = `admin-public4-${Utils.random()}`;
  const sitePublic5Admin = `admin-public5-${Utils.random()}`;
  const sitePublic6Admin = `admin-public6-${Utils.random()}`;
  const sitePublic7Admin = `admin-public7-${Utils.random()}`;
  const sitePublic8Admin = `admin-public8-${Utils.random()}`;

  const sitePublicUser = `user-public1-${Utils.random()}`;
  const siteForDelete1 = `user-public2-${Utils.random()}`;
  const siteForDelete2 = `user-public3-${Utils.random()}`;

  const siteModerated1Admin = `admin-moderated1-${Utils.random()}`;
  const siteModerated2Admin = `admin-moderated2-${Utils.random()}`;

  const siteSearchModerated1Admin = `site-moderated-search-1-${Utils.random()}`;
  const siteSearchModerated2Admin = `site-moderated-search-2-${Utils.random()}`;

  const siteSearchPublic1Admin = `site-public-search-1-${Utils.random()}`;
  const siteSearchPublic2Admin = `site-public-search-2-${Utils.random()}`;
  const siteSearchPublic3Admin = `site-public-search-3-${Utils.random()}`;
  const siteSearchPublic4Admin = `site-public-search-4-${Utils.random()}`;
  const siteSearchForDelete = `site-public-search-5-${Utils.random()}`;

  const apiService = new ApiService();
  const adminApiService = new ApiService();
  const repoClient = new RepoClient(apiService);
  const adminApiActions = new ApiActions(adminApiService);
  const apiActions = new ApiActions(apiService);
  const usersActions = new UsersActions(adminApiService);

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const { searchInput } = page.header;

  const confirmDialog = new ConfirmDialog();

  beforeAll(async (done) => {
    await adminApiService.loginWithProfile('admin');
    const user = await usersActions.createUser();
    await apiService.login(user.username, user.password);

    await adminApiActions.sites.createSite(siteSearchPublic1Admin);
    await adminApiActions.sites.createSite(siteSearchPublic2Admin);
    await adminApiActions.sites.createSite(siteSearchPublic3Admin);
    await adminApiActions.sites.createSite(siteSearchPublic4Admin);
    await adminApiActions.sites.createSite(siteSearchModerated1Admin, SITE_VISIBILITY.MODERATED);
    await adminApiActions.sites.createSite(siteSearchModerated2Admin, SITE_VISIBILITY.MODERATED);
    await repoClient.sites.createSite(siteSearchForDelete);

    await loginPage.login(user.username, user.password);
    done();
  });

  beforeEach(async () => {
    await Utils.pressEscape();
  });

  afterEach(async (done) => {
    await Utils.pressEscape();
    await page.header.expandSideNav();
    await page.clickPersonalFiles();
    done();
  });

  afterAll(async () => {
    await adminApiService.loginWithProfile('admin');
    await adminApiActions.deleteSites([
      sitePublic1Admin,
      siteSearchPublic1Admin,
      sitePublic2Admin,
      sitePublic3Admin,
      sitePublic4Admin,
      sitePublic5Admin,
      sitePublic6Admin,
      sitePublic7Admin,
      sitePublic8Admin,
      siteSearchPublic2Admin,
      siteSearchPublic3Admin,
      siteSearchPublic4Admin,
      siteModerated1Admin,
      siteModerated2Admin,
      siteSearchModerated1Admin,
      siteSearchModerated2Admin
    ]);

    await apiActions.deleteSites([sitePublicUser]);
    await apiActions.emptyTrashcan();
  });

  describe('Join a public library', () => {
    beforeAll(async (done) => {
      await adminApiActions.sites.createSite(sitePublic1Admin);
      await repoClient.favorites.addFavoriteById('site', sitePublic1Admin);
      done();
    });

    it('[C290105] from Favorite Libraries', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.selectItem(sitePublic1Admin);
      await BrowserActions.click(toolbar.joinButton);

      expect(await dataTable.getLibraryRole(sitePublic1Admin)).toEqual(SITE_ROLES.SITE_CONSUMER.LABEL);
    });

    it('[C306959] from Search Results', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchFor(siteSearchPublic1Admin);
      await dataTable.waitForBody();

      await dataTable.selectItem(siteSearchPublic1Admin);
      await BrowserActions.click(toolbar.joinButton);

      expect(await dataTable.getLibraryRole(siteSearchPublic1Admin)).toEqual(SITE_ROLES.SITE_CONSUMER.LABEL);
    });
  });

  describe('Join a moderated library', () => {
    beforeAll(async (done) => {
      await adminApiActions.sites.createSite(siteModerated1Admin, SITE_VISIBILITY.MODERATED);
      await repoClient.favorites.addFavoriteById('site', siteModerated1Admin);
      await repoClient.queries.waitForSites(siteSearchModerated1Admin, { expect: 1 });
      done();
    });

    it('[C290109] from Favorite Libraries', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.selectItem(siteModerated1Admin);
      await BrowserActions.click(toolbar.joinButton);

      expect(await dataTable.getLibraryRole(siteModerated1Admin)).toEqual(SITE_ROLES.NONE.LABEL);
      const hasJoinRequest = await repoClient.sites.hasMembershipRequest(siteModerated1Admin);
      expect(hasJoinRequest).toBe(true, `Join request does not exist on ${siteModerated1Admin}`);
    });

    it('[C306960] from Search Results', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchFor(siteSearchModerated1Admin);
      await dataTable.waitForBody();

      await dataTable.selectItem(siteSearchModerated1Admin);
      await BrowserActions.click(toolbar.joinButton);

      expect(await dataTable.getLibraryRole(siteSearchModerated1Admin)).toEqual(SITE_ROLES.NONE.LABEL);
      const hasJoinRequest = await repoClient.sites.hasMembershipRequest(siteSearchModerated1Admin);
      expect(hasJoinRequest).toBe(true, `Join request does not exist on ${siteSearchModerated1Admin}`);
    });
  });

  describe('Leave a library', () => {
    beforeAll(async (done) => {
      await adminApiActions.sites.createSite(sitePublic2Admin);
      await adminApiActions.sites.createSite(sitePublic3Admin);
      await adminApiActions.sites.createSite(sitePublic4Admin);
      await adminApiActions.sites.createSite(sitePublic5Admin);
      await repoClient.sites.createSite(sitePublicUser);
      await repoClient.favorites.addFavoriteById('site', sitePublic3Admin);
      await adminApiActions.sites.addSiteMember(sitePublic2Admin, user.username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
      await adminApiActions.sites.addSiteMember(sitePublic3Admin, user.username, SITE_ROLES.SITE_MANAGER.ROLE);
      await adminApiActions.sites.addSiteMember(siteSearchPublic2Admin, user.username, SITE_ROLES.SITE_CONTRIBUTOR.ROLE);
      await adminApiActions.sites.addSiteMember(sitePublic4Admin, user.username, SITE_ROLES.SITE_MANAGER.ROLE);
      await adminApiActions.sites.addSiteMember(sitePublic5Admin, user.username, SITE_ROLES.SITE_MANAGER.ROLE);
      await repoClient.queries.waitForSites(siteSearchPublic2Admin, { expect: 1 });
      done();
    });

    it('[C290106] from My Libraries', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(sitePublic2Admin);
      await BrowserActions.click(toolbar.leaveButton);
      await page.waitForDialog();
      await BrowserActions.click(confirmDialog.okButton);

      expect(await page.getSnackBarMessage()).toEqual(`You have left the library`);
      expect(await dataTable.isItemPresent(sitePublic2Admin)).toBe(false, `${sitePublic2Admin} is displayed`);
    });

    it('[C290110] from Favorite Libraries', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.selectItem(sitePublic3Admin);
      await BrowserActions.click(toolbar.leaveButton);
      await page.waitForDialog();
      await BrowserActions.click(confirmDialog.okButton);

      expect(await page.getSnackBarMessage()).toEqual(`You have left the library`);
      expect(await dataTable.isItemPresent(sitePublic3Admin)).toBe(true, `${sitePublic3Admin} is not displayed`);
    });

    it('[C306961] from Search Results', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchFor(siteSearchPublic2Admin);
      await dataTable.waitForBody();

      await dataTable.selectItem(siteSearchPublic2Admin);
      await BrowserActions.click(toolbar.leaveButton);
      await page.waitForDialog();
      await BrowserActions.click(confirmDialog.okButton);

      expect(await page.getSnackBarMessage()).toEqual(`You have left the library`);
      expect(await dataTable.isItemPresent(siteSearchPublic2Admin)).toBe(true, `${siteSearchPublic2Admin} is not displayed`);
    });

    it('[C290136] Confirmation dialog UI', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(sitePublic4Admin);
      await BrowserActions.click(toolbar.leaveButton);
      await page.waitForDialog();

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Confirm delete dialog not open');
      expect(await confirmDialog.getDialogTitle()).toContain('Leave this library?');
      expect(await confirmDialog.getText()).toContain('Leaving will remove your access.');
      expect(await confirmDialog.isOkEnabled()).toBe(true, 'OK button is not enabled');
      expect(await confirmDialog.isCancelEnabled()).toBe(true, 'Cancel button is not enabled');
    });

    it('[C290111] Cancel Leave Library', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(sitePublic5Admin);
      await BrowserActions.click(toolbar.leaveButton);
      await page.waitForDialog();

      expect(await confirmDialog.isCancelEnabled()).toBe(true, 'Cancel button is not enabled');
      await BrowserActions.click(confirmDialog.cancelButton);

      expect(await dataTable.isItemPresent(sitePublic5Admin)).toBe(true, `${sitePublic5Admin} was deleted`);
    });

    it('[C290107] Leave a library - failure notification', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(sitePublicUser);
      await BrowserActions.click(toolbar.leaveButton);
      await page.waitForDialog();
      await BrowserActions.click(confirmDialog.okButton);

      expect(await page.getSnackBarMessage()).toEqual(`Cannot leave this library`);
    });
  });

  describe('Cancel join', () => {
    beforeAll(async (done) => {
      await adminApiActions.sites.createSite(siteModerated2Admin, SITE_VISIBILITY.MODERATED);
      await repoClient.favorites.addFavoriteById('site', siteModerated2Admin);
      await repoClient.sites.requestToJoin(siteModerated2Admin);
      await repoClient.sites.requestToJoin(siteSearchModerated2Admin);
      await repoClient.queries.waitForSites(siteSearchModerated2Admin, { expect: 1 });
      done();
    });

    it('[C290108] from Favorite Libraries', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.selectItem(siteModerated2Admin);
      await toolbar.clickButton('Cancel Join Request');

      expect(await page.getSnackBarMessage()).toEqual(`Canceled the request to join the library`);

      const hasJoinRequest = await repoClient.sites.hasMembershipRequest(siteModerated2Admin);
      expect(hasJoinRequest).toBe(false, `Join request exists on ${siteModerated2Admin}`);
    });

    it('[C306962] from Search Results', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchFor(siteSearchModerated2Admin);
      await dataTable.waitForBody();

      await dataTable.selectItem(siteSearchModerated2Admin);
      await toolbar.clickButton('Cancel Join Request');

      expect(await page.getSnackBarMessage()).toEqual(`Canceled the request to join the library`);

      const hasJoinRequest = await repoClient.sites.hasMembershipRequest(siteSearchModerated2Admin);
      expect(hasJoinRequest).toBe(false, `Join request exists on ${siteSearchModerated2Admin}`);
    });
  });

  describe('Mark library as favorite', () => {
    beforeAll(async (done) => {
      await adminApiActions.sites.createSite(sitePublic6Admin);
      await adminApiActions.sites.addSiteMember(sitePublic6Admin, user.username, SITE_ROLES.SITE_MANAGER.ROLE);
      await repoClient.queries.waitForSites(siteSearchPublic3Admin, { expect: 1 });
      done();
    });

    it('[C289974] from My Libraries', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(sitePublic6Admin);
      await toolbar.clickMoreActionsFavorite();

      expect(await repoClient.favorites.isFavoriteWithRetry(sitePublic6Admin, { expect: true })).toBe(true, `${sitePublic6Admin} not favorite`);
    });

    it('[C306963] from Search Results', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchFor(siteSearchPublic3Admin);
      await dataTable.waitForBody();

      await dataTable.selectItem(siteSearchPublic3Admin);
      await toolbar.clickMoreActionsFavorite();

      expect(await repoClient.favorites.isFavoriteWithRetry(siteSearchPublic3Admin, { expect: true })).toBe(
        true,
        `${siteSearchPublic3Admin} not favorite`
      );
    });
  });

  describe('Remove library from favorites', () => {
    beforeAll(async (done) => {
      await adminApiActions.sites.createSite(sitePublic7Admin);
      await adminApiActions.sites.createSite(sitePublic8Admin);
      await repoClient.favorites.addFavoriteById('site', sitePublic7Admin);
      await repoClient.favorites.addFavoriteById('site', sitePublic8Admin);
      await repoClient.favorites.addFavoriteById('site', siteSearchPublic4Admin);
      await adminApiActions.sites.addSiteMember(sitePublic7Admin, user.username, SITE_ROLES.SITE_MANAGER.ROLE);
      await adminApiActions.sites.addSiteMember(sitePublic8Admin, user.username, SITE_ROLES.SITE_MANAGER.ROLE);
      await adminApiActions.sites.addSiteMember(siteSearchPublic4Admin, user.username, SITE_ROLES.SITE_MANAGER.ROLE);
      await repoClient.queries.waitForSites(siteSearchPublic4Admin, { expect: 1 });
      done();
    });

    it('[C289975] from My Libraries', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(sitePublic7Admin);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await repoClient.favorites.isFavoriteWithRetry(sitePublic7Admin, { expect: false })).toBe(false, `${sitePublic7Admin} still favorite`);
    });

    it('[C289976] from Favorite Libraries', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.selectItem(sitePublic8Admin);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await dataTable.isItemPresent(sitePublic8Admin)).toBe(false, `${sitePublic8Admin} is displayed`);
      expect(await repoClient.favorites.isFavoriteWithRetry(sitePublic8Admin, { expect: false })).toBe(false, `${sitePublic8Admin} still favorite`);
    });

    it('[C306964] from Search Results', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchFor(siteSearchPublic4Admin);
      await dataTable.waitForBody();

      await dataTable.selectItem(siteSearchPublic4Admin);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await repoClient.favorites.isFavoriteWithRetry(siteSearchPublic4Admin, { expect: false })).toBe(
        false,
        `${siteSearchPublic4Admin} still favorite`
      );
    });
  });

  describe('Delete a library', () => {
    beforeAll(async (done) => {
      await repoClient.sites.createSite(siteForDelete1);
      await repoClient.sites.createSite(siteForDelete2);
      await repoClient.queries.waitForSites(siteSearchForDelete, { expect: 1 });
      done();
    });

    it('[C289988] from My Libraries', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(siteForDelete1);
      await toolbar.clickMoreActionsDelete();

      expect(await page.getSnackBarMessage()).toEqual(`Library deleted`);
      expect(await dataTable.isItemPresent(siteForDelete1)).toBe(false, `${siteForDelete1} still displayed`);
    });

    it('[C289991] from Favorite Libraries', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.selectItem(siteForDelete2);
      await toolbar.clickMoreActionsDelete();

      expect(await page.getSnackBarMessage()).toEqual(`Library deleted`);
      expect(await dataTable.isItemPresent(siteForDelete2)).toBe(false, `${siteForDelete2} still displayed`);
    });

    it('[C306965] from Search Results', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchFor(siteSearchForDelete);
      await dataTable.waitForBody();

      await dataTable.selectItem(siteSearchForDelete);
      await toolbar.clickMoreActionsDelete();

      expect(await page.getSnackBarMessage()).toEqual(`Library deleted`);
      expect(await dataTable.isItemPresent(siteSearchForDelete)).toBe(false, `${siteSearchForDelete} still displayed`);
    });
  });
});
