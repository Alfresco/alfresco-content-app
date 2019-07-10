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
import { ConfirmDialog } from './../../components/components';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Library actions', () => {
  const username = `user-${Utils.random()}`;

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

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;
  const { searchInput } = page.header;

  const confirmDialog = new ConfirmDialog();

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });

    await apis.admin.sites.createSite(siteSearchPublic1Admin);
    await apis.admin.sites.createSite(siteSearchPublic2Admin);
    await apis.admin.sites.createSite(siteSearchPublic3Admin);
    await apis.admin.sites.createSite(siteSearchPublic4Admin);
    await apis.admin.sites.createSite(siteSearchModerated1Admin, SITE_VISIBILITY.MODERATED);
    await apis.admin.sites.createSite(siteSearchModerated2Admin, SITE_VISIBILITY.MODERATED);
    await apis.user.sites.createSite(siteSearchForDelete);

    await apis.user.queries.waitForSites('site-public-search', { expect: 5 });
    await apis.user.queries.waitForSites('site-moderated-search', { expect: 2 });

    await loginPage.loginWith(username);
    done();
  });

  afterEach(async (done) => {
    await Utils.pressEscape();
    await page.header.expandSideNav();
    await page.clickPersonalFiles();
    done();
  });

  afterAll(async (done) => {
    await apis.admin.sites.deleteSite(sitePublic1Admin);
    await apis.admin.sites.deleteSite(siteSearchPublic1Admin);
    await apis.admin.sites.deleteSite(sitePublic2Admin);
    await apis.admin.sites.deleteSite(sitePublic3Admin);
    await apis.admin.sites.deleteSite(sitePublic4Admin);
    await apis.admin.sites.deleteSite(sitePublic5Admin);
    await apis.admin.sites.deleteSite(sitePublic6Admin);
    await apis.admin.sites.deleteSite(sitePublic7Admin);
    await apis.admin.sites.deleteSite(sitePublic8Admin);

    await apis.admin.sites.deleteSite(siteSearchPublic2Admin);
    await apis.admin.sites.deleteSite(siteSearchPublic3Admin);
    await apis.admin.sites.deleteSite(siteSearchPublic4Admin);
    await apis.admin.sites.deleteSite(siteModerated1Admin);
    await apis.admin.sites.deleteSite(siteModerated2Admin);
    await apis.admin.sites.deleteSite(siteSearchModerated1Admin);
    await apis.admin.sites.deleteSite(siteSearchModerated2Admin);
    await apis.user.sites.deleteSite(sitePublicUser);
    await apis.admin.trashcan.emptyTrash();
    done();
  });

  describe('Join a public library', () => {

    beforeAll(async done => {
      await apis.admin.sites.createSite(sitePublic1Admin);
      await apis.user.favorites.addFavoriteById('site', sitePublic1Admin);
      done();
    });

    it('from Favorite Libraries - [C290105]', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.selectItem(sitePublic1Admin);
      await toolbar.clickJoin();

      expect(await dataTable.getLibraryRole(sitePublic1Admin)).toEqual('Consumer');
    });

    it('from Search Results - [C306959]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchFor(siteSearchPublic1Admin);
      await dataTable.waitForBody();

      await dataTable.selectItem(siteSearchPublic1Admin);
      await toolbar.clickJoin();

      expect(await dataTable.getLibraryRole(siteSearchPublic1Admin)).toEqual('Consumer');
    });

  });

  describe('Join a moderated library', () => {

    beforeAll(async done => {
      await apis.admin.sites.createSite(siteModerated1Admin, SITE_VISIBILITY.MODERATED);
      await apis.user.favorites.addFavoriteById('site', siteModerated1Admin);
      await apis.user.queries.waitForSites(siteSearchModerated1Admin, { expect: 1 });
      done();
    });

    it('from Favorite Libraries - [C290109]', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.selectItem(siteModerated1Admin);
      await toolbar.clickJoin();

      expect(await dataTable.getLibraryRole(siteModerated1Admin)).toEqual('');
      const hasJoinRequest = await apis.user.sites.hasMembershipRequest(siteModerated1Admin);
      expect(hasJoinRequest).toBe(true, `Join request does not exist on ${siteModerated1Admin}`);
    });

    it('from Search Results - [C306960]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchFor(siteSearchModerated1Admin);
      await dataTable.waitForBody();

      await dataTable.selectItem(siteSearchModerated1Admin);
      await toolbar.clickJoin();

      expect(await dataTable.getLibraryRole(siteSearchModerated1Admin)).toEqual('');
      const hasJoinRequest = await apis.user.sites.hasMembershipRequest(siteSearchModerated1Admin);
      expect(hasJoinRequest).toBe(true, `Join request does not exist on ${siteSearchModerated1Admin}`);
    });

  });

  describe('Leave a library', () => {

    beforeAll(async done => {
      await apis.admin.sites.createSite(sitePublic2Admin);
      await apis.admin.sites.createSite(sitePublic3Admin);
      await apis.admin.sites.createSite(sitePublic4Admin);
      await apis.admin.sites.createSite(sitePublic5Admin);
      await apis.user.sites.createSite(sitePublicUser);
      await apis.user.favorites.addFavoriteById('site', sitePublic3Admin);
      await apis.admin.sites.addSiteMember(sitePublic2Admin, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
      await apis.admin.sites.addSiteMember(sitePublic3Admin, username, SITE_ROLES.SITE_MANAGER.ROLE);
      await apis.admin.sites.addSiteMember(siteSearchPublic2Admin, username, SITE_ROLES.SITE_CONTRIBUTOR.ROLE);
      await apis.admin.sites.addSiteMember(sitePublic4Admin, username, SITE_ROLES.SITE_MANAGER.ROLE);
      await apis.admin.sites.addSiteMember(sitePublic5Admin, username, SITE_ROLES.SITE_MANAGER.ROLE);
      await apis.user.queries.waitForSites(siteSearchPublic2Admin, { expect: 1 });
      done();
    });

    it('from My Libraries - [C290106]', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(sitePublic2Admin);
      await toolbar.clickLeave();
      await page.waitForDialog();
      await confirmDialog.clickOk();

      expect(await page.getSnackBarMessage()).toEqual(`You have left the library`);
      expect(await dataTable.isItemPresent(sitePublic2Admin)).toBe(false, `${sitePublic2Admin} is displayed`);
    });

    it('from Favorite Libraries - [C290110]', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.selectItem(sitePublic3Admin);
      await toolbar.clickLeave();
      await page.waitForDialog();
      await confirmDialog.clickOk();

      expect(await page.getSnackBarMessage()).toEqual(`You have left the library`);
      expect(await dataTable.isItemPresent(sitePublic3Admin)).toBe(true, `${sitePublic3Admin} is not displayed`);
    });

    it('from Search Results - [C306961]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchFor(siteSearchPublic2Admin);
      await dataTable.waitForBody();

      await dataTable.selectItem(siteSearchPublic2Admin);
      await toolbar.clickLeave();
      await page.waitForDialog();
      await confirmDialog.clickOk();

      expect(await page.getSnackBarMessage()).toEqual(`You have left the library`);
      expect(await dataTable.isItemPresent(siteSearchPublic2Admin)).toBe(true, `${siteSearchPublic2Admin} is not displayed`);
    });

    it('Confirmation dialog UI - [C290136]', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(sitePublic4Admin);
      await toolbar.clickLeave();
      await page.waitForDialog();

      expect(await confirmDialog.isDialogOpen()).toBe(true, 'Confirm delete dialog not open');
      expect(await confirmDialog.getTitle()).toContain('Leave this library?');
      expect(await confirmDialog.getText()).toContain('Leaving will remove your access.');
      expect(await confirmDialog.isOkEnabled()).toBe(true, 'OK button is not enabled');
      expect(await confirmDialog.isCancelEnabled()).toBe(true, 'Cancel button is not enabled');
    });

    it('Cancel Leave Library - [C290111]', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(sitePublic5Admin);
      await toolbar.clickLeave();
      await page.waitForDialog();

      expect(await confirmDialog.isCancelEnabled()).toBe(true, 'Cancel button is not enabled');
      await confirmDialog.clickCancel();
      expect(await dataTable.isItemPresent(sitePublic5Admin)).toBe(true, `${sitePublic5Admin} was deleted`);
    });

    it('Leave a library - failure notification - [C290107]', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(sitePublicUser);
      await toolbar.clickLeave();
      await page.waitForDialog();
      await confirmDialog.clickOk();

      expect(await page.getSnackBarMessage()).toEqual(`Cannot leave this library`);
    });
  });

  describe('Cancel join', () => {

    beforeAll(async done => {
      await apis.admin.sites.createSite(siteModerated2Admin, SITE_VISIBILITY.MODERATED);
      await apis.user.favorites.addFavoriteById('site', siteModerated2Admin);
      await apis.user.sites.requestToJoin(siteModerated2Admin);
      await apis.user.sites.requestToJoin(siteSearchModerated2Admin);
      await apis.user.queries.waitForSites(siteSearchModerated2Admin, { expect: 1 });
      done();
    });

    it('from Favorite Libraries - [C290108]', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.selectItem(siteModerated2Admin);
      await toolbar.clickButton('Cancel Join Request');

      expect(await page.getSnackBarMessage()).toEqual(`Canceled the request to join the library`);

      const hasJoinRequest = await apis.user.sites.hasMembershipRequest(siteModerated2Admin);
      expect(hasJoinRequest).toBe(false, `Join request exists on ${siteModerated2Admin}`);
    });

    it('from Search Results - [C306962]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchFor(siteSearchModerated2Admin);
      await dataTable.waitForBody();

      await dataTable.selectItem(siteSearchModerated2Admin);
      await toolbar.clickButton('Cancel Join Request');

      expect(await page.getSnackBarMessage()).toEqual(`Canceled the request to join the library`);

      const hasJoinRequest = await apis.user.sites.hasMembershipRequest(siteSearchModerated2Admin);
      expect(hasJoinRequest).toBe(false, `Join request exists on ${siteSearchModerated2Admin}`);
    });

  });

  describe('Mark library as favorite', () => {

    beforeAll(async done => {
      await apis.admin.sites.createSite(sitePublic6Admin);
      await apis.admin.sites.addSiteMember(sitePublic6Admin, username, SITE_ROLES.SITE_MANAGER.ROLE);
      await apis.user.queries.waitForSites(siteSearchPublic3Admin, { expect: 1 });
      done();
    });

    it('from My Libraries - [C289974]', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(sitePublic6Admin);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(sitePublic6Admin, { expect: true })).toBe(true, `${sitePublic6Admin} not favorite`);
    });

    it('from on Search Results - [C306963]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchFor(siteSearchPublic3Admin);
      await dataTable.waitForBody();

      await dataTable.selectItem(siteSearchPublic3Admin);
      await toolbar.clickMoreActionsFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(siteSearchPublic3Admin, { expect: true })).toBe(true, `${siteSearchPublic3Admin} not favorite`);
    });

  });

  describe('Remove library from favorites', () => {

    beforeAll(async done => {
      await apis.admin.sites.createSite(sitePublic7Admin);
      await apis.admin.sites.createSite(sitePublic8Admin);
      await apis.user.favorites.addFavoriteById('site', sitePublic7Admin);
      await apis.user.favorites.addFavoriteById('site', sitePublic8Admin);
      await apis.user.favorites.addFavoriteById('site', siteSearchPublic4Admin);
      await apis.admin.sites.addSiteMember(sitePublic7Admin, username, SITE_ROLES.SITE_MANAGER.ROLE);
      await apis.admin.sites.addSiteMember(sitePublic8Admin, username, SITE_ROLES.SITE_MANAGER.ROLE);
      await apis.admin.sites.addSiteMember(siteSearchPublic4Admin, username, SITE_ROLES.SITE_MANAGER.ROLE);
      await apis.user.queries.waitForSites(siteSearchPublic4Admin, { expect: 1 });
      done();
    });

    it('from My Libraries - [C289975]', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(sitePublic7Admin);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(sitePublic7Admin, { expect: false })).toBe(false, `${sitePublic7Admin} still favorite`);
    });

    it('from Favorite Libraries - [C289976]', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.selectItem(sitePublic8Admin);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await dataTable.isItemPresent(sitePublic8Admin)).toBe(false, `${sitePublic8Admin} is displayed`);
      expect(await apis.user.favorites.isFavoriteWithRetry(sitePublic8Admin, { expect: false })).toBe(false, `${sitePublic8Admin} still favorite`);
    });

    it('from Search Results - [C306964]', async () => {
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchFor(siteSearchPublic4Admin);
      await dataTable.waitForBody();

      await dataTable.selectItem(siteSearchPublic4Admin);
      await toolbar.clickMoreActionsRemoveFavorite();

      expect(await apis.user.favorites.isFavoriteWithRetry(siteSearchPublic4Admin, { expect: false })).toBe(false, `${siteSearchPublic4Admin} still favorite`);
    });
  });

  describe('Delete a library', () => {

    beforeAll(async done => {
      await apis.user.sites.createSite(siteForDelete1);
      await apis.user.sites.createSite(siteForDelete2);
      await apis.user.queries.waitForSites(siteSearchForDelete, { expect: 1 });
      done();
    });

    it('from My Libraries - [C289988]', async () => {
      await page.goToMyLibrariesAndWait();
      await dataTable.selectItem(siteForDelete1);
      await toolbar.clickMoreActionsDelete();

      expect(await page.getSnackBarMessage()).toEqual(`Library deleted`);
      expect(await dataTable.isItemPresent(siteForDelete1)).toBe(false, `${siteForDelete1} still displayed`);
    });

    it('from Favorite Libraries - [C289991]', async () => {
      await page.goToFavoriteLibrariesAndWait();
      await dataTable.selectItem(siteForDelete2);
      await toolbar.clickMoreActionsDelete();

      expect(await page.getSnackBarMessage()).toEqual(`Library deleted`);
      expect(await dataTable.isItemPresent(siteForDelete2)).toBe(false, `${siteForDelete2} still displayed`);
    });

    it('from Search Results - [C306965]', async () => {
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
