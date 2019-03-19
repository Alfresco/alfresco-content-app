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
  const siteModerated1Admin = `admin-moderated1-${Utils.random()}`;
  const siteModerated2Admin = `admin-moderated2-${Utils.random()}`;

  const sitePublicUser = `user-public-${Utils.random()}`;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, username)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, toolbar } = page;

  const confirmDialog = new ConfirmDialog();

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    await apis.admin.sites.createSite(sitePublic1Admin);
    await apis.admin.sites.createSite(sitePublic2Admin);
    await apis.admin.sites.createSite(sitePublic3Admin);
    await apis.admin.sites.createSite(sitePublic4Admin);
    await apis.admin.sites.createSite(siteModerated1Admin, SITE_VISIBILITY.MODERATED);
    await apis.admin.sites.createSite(siteModerated2Admin, SITE_VISIBILITY.MODERATED);

    await apis.user.sites.createSite(sitePublicUser);

    await apis.admin.sites.addSiteMember(sitePublic2Admin, username, SITE_ROLES.SITE_COLLABORATOR.ROLE);
    await apis.admin.sites.addSiteMember(sitePublic3Admin, username, SITE_ROLES.SITE_MANAGER.ROLE);
    await apis.admin.sites.addSiteMember(sitePublic4Admin, username, SITE_ROLES.SITE_MANAGER.ROLE);

    await apis.user.favorites.addFavoriteById('site', sitePublic1Admin);
    await apis.user.favorites.addFavoriteById('site', sitePublic3Admin);
    await apis.user.favorites.addFavoriteById('site', siteModerated1Admin);
    await apis.user.favorites.addFavoriteById('site', siteModerated2Admin);

    await apis.user.sites.requestToJoin(siteModerated2Admin);

    await loginPage.loginWith(username);
    done();
  });

  afterEach(async (done) => {
    await Utils.pressEscape();
    await dataTable.clearSelection();
    done();
  });

  afterAll(async (done) => {
    await apis.admin.sites.deleteSite(sitePublic1Admin);
    await apis.admin.sites.deleteSite(sitePublic2Admin);
    await apis.admin.sites.deleteSite(sitePublic3Admin);
    await apis.admin.sites.deleteSite(sitePublic4Admin);
    await apis.admin.sites.deleteSite(siteModerated1Admin);
    await apis.admin.sites.deleteSite(siteModerated2Admin);
    await apis.user.sites.deleteSite(sitePublicUser);
    done();
  });

  it('Join a public library - Favorite Libraries - [C290105]', async () => {
    await page.goToFavoriteLibrariesAndWait();
    await dataTable.selectItem(sitePublic1Admin);
    await toolbar.clickJoin();

    expect(await dataTable.getLibraryRole(sitePublic1Admin)).toEqual('Consumer');
  });

  it('Join a moderated library - Favorite Libraries - [C290109]', async () => {
    await page.goToFavoriteLibrariesAndWait();
    await dataTable.selectItem(siteModerated1Admin);
    await toolbar.clickJoin();

    expect(await dataTable.getLibraryRole(siteModerated1Admin)).toEqual('');
    const hasJoinRequest = await apis.user.sites.hasMembershipRequest(siteModerated1Admin);
    expect(hasJoinRequest).toBe(true, `Join request does not exist on ${siteModerated1Admin}`);
  });

  it('Leave a library - My Libraries - [C290106]', async () => {
    await page.goToMyLibrariesAndWait();
    await dataTable.selectItem(sitePublic2Admin);
    await toolbar.clickLeave();
    await page.waitForDialog();
    await confirmDialog.clickOk();

    expect(await page.getSnackBarMessage()).toEqual(`You have left the library`);
    expect(await dataTable.isItemPresent(sitePublic2Admin)).toBe(false, `${sitePublic2Admin} is displayed`);
  });

  it('Leave a library - Favorite Libraries - [C290110]', async () => {
    await page.goToFavoriteLibrariesAndWait();
    await dataTable.selectItem(sitePublic3Admin);
    await toolbar.clickLeave();
    await page.waitForDialog();
    await confirmDialog.clickOk();

    expect(await page.getSnackBarMessage()).toEqual(`You have left the library`);
    expect(await dataTable.isItemPresent(sitePublic3Admin)).toBe(true, `${sitePublic3Admin} is not displayed`);
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

  it('Cancel Leave library - [C290111]', async () => {
    await page.goToMyLibrariesAndWait();
    await dataTable.selectItem(sitePublic4Admin);
    await toolbar.clickLeave();
    await page.waitForDialog();

    expect(await confirmDialog.isCancelEnabled()).toBe(true, 'Cancel button is not enabled');
    await confirmDialog.clickCancel();
    expect(await dataTable.isItemPresent(sitePublic4Admin)).toBe(true, `${sitePublic4Admin} was deleted`);
  });

  it('Leave a library - failure notification - [C290107]', async () => {
    await page.goToMyLibrariesAndWait();
    await dataTable.selectItem(sitePublicUser);
    await toolbar.clickLeave();
    await page.waitForDialog();
    await confirmDialog.clickOk();

    expect(await page.getSnackBarMessage()).toEqual(`Cannot leave this library`);
  });

  it('Cancel join - Favorite Libraries - [C290108]', async () => {
    await page.goToFavoriteLibrariesAndWait();
    await dataTable.selectItem(siteModerated2Admin);
    await toolbar.clickButton('Cancel join request');

    expect(await page.getSnackBarMessage()).toEqual(`Canceled the request to join the library`);

    const hasJoinRequest = await apis.user.sites.hasMembershipRequest(siteModerated2Admin);
    expect(hasJoinRequest).toBe(false, `Join request exists on ${siteModerated2Admin}`);
  });

});
