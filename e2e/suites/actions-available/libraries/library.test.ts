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

import { LoginPage, BrowsingPage, SearchResultsPage } from '../../../pages/pages';
import { RepoClient } from '../../../utilities/repo-client/repo-client';
import { Utils } from '../../../utilities/utils';
import { AdminActions } from '../../../utilities/admin-actions';
import * as data from './test-data-libraries';
import * as testUtil from '../test-util';

describe('Library actions : ', () => {
  const username = `user-${Utils.random()}`;

  const userApi = new RepoClient(username, username);

  const adminApiActions = new AdminActions();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const searchResultsPage = new SearchResultsPage();
  const { searchInput } = searchResultsPage.header;

  beforeAll(async () => {
    await adminApiActions.createUser({ username });

    await userApi.sites.createSite(data.publicUserMemberFav.name);
    await userApi.sites.createSitePrivate(data.privateUserMemberFav.name);
    await userApi.sites.createSiteModerated(data.moderatedUserMemberFav.name);

    const publicUserMemberNotFavId = (await userApi.sites.createSite(data.publicUserMemberNotFav.name)).entry.guid;
    const privateUserMemberNotFavId = (await userApi.sites.createSitePrivate(data.privateUserMemberNotFav.name)).entry.guid;
    const moderatedUserMemberNotFavId = (await userApi.sites.createSiteModerated(data.moderatedUserMemberNotFav.name)).entry.guid;

    await adminApiActions.sites.createSite(data.publicNotMemberFav.name);
    await adminApiActions.sites.createSiteModerated(data.moderatedNotMemberFav.name);

    await adminApiActions.sites.createSite(data.publicNotMemberNotFav.name);
    await adminApiActions.sites.createSiteModerated(data.moderatedNotMemberNotFav.name);

    await adminApiActions.sites.createSiteModerated(data.moderatedRequestedJoinFav.name);
    await adminApiActions.sites.createSiteModerated(data.moderatedRequestedJoinNotFav.name);

    await userApi.sites.createSite(data.siteInTrash.name);
    await userApi.sites.createSite(data.site2InTrash.name);

    await Promise.all([
      userApi.sites.waitForApi({ expect: 8 }),
      adminApiActions.sites.waitForApi({ expect: 6 + 1 })
    ]);

    await userApi.favorites.removeFavoritesByIds([publicUserMemberNotFavId, privateUserMemberNotFavId, moderatedUserMemberNotFavId]);

    await userApi.favorites.addFavoritesByIds('site', [data.publicNotMemberFav.name, data.moderatedNotMemberFav.name, data.moderatedRequestedJoinFav.name]);

    await userApi.sites.requestToJoin(data.moderatedRequestedJoinFav.name);
    await userApi.sites.requestToJoin(data.moderatedRequestedJoinNotFav.name);

    await userApi.queries.waitForSites('site-', { expect: 14 + 1 });

    await userApi.sites.deleteSite(data.siteInTrash.name, false);
    await userApi.sites.deleteSite(data.site2InTrash.name, false);

    await userApi.trashcan.waitForApi({ expect: 2 });

    await loginPage.loginWith(username);
  });

  afterAll(async () => {
    await Promise.all([
      userApi.sites.deleteSites([
        data.publicUserMemberFav.name,
        data.privateUserMemberFav.name,
        data.moderatedUserMemberFav.name,
        data.publicUserMemberNotFav.name,
        data.privateUserMemberNotFav.name,
        data.moderatedUserMemberNotFav.name
      ]),
      adminApiActions.sites.deleteSites([
        data.publicNotMemberFav.name,
        data.moderatedNotMemberFav.name,
        data.publicNotMemberNotFav.name,
        data.moderatedNotMemberNotFav.name,
        data.moderatedRequestedJoinFav.name,
        data.moderatedRequestedJoinNotFav.name
      ]),
      userApi.trashcan.emptyTrash()
    ]);
  });

  describe('on My Libraries', () => {

    beforeAll(async () => {
      await Utils.pressEscape();
      await page.goToMyLibrariesAndWait();
    });

    beforeEach(async () => {
      await Utils.pressEscape();
    });

    it('Public library, user is a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.publicUserMemberFav.name, data.publicUserMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.publicUserMemberFav.name, data.publicUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(data.publicUserMemberFav.name, data.publicUserMemberFav.contextMenu);
    });

    it('Private library, user is a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.privateUserMemberFav.name, data.privateUserMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.privateUserMemberFav.name, data.privateUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(data.privateUserMemberFav.name, data.privateUserMemberFav.contextMenu);
    });

    it('Moderated library, user is a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.moderatedUserMemberFav.name, data.moderatedUserMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.moderatedUserMemberFav.name, data.moderatedUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(data.moderatedUserMemberFav.name, data.moderatedUserMemberFav.contextMenu);
    });

    it('Public library, user is a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.publicUserMemberNotFav.name, data.publicUserMemberNotFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.publicUserMemberNotFav.name, data.publicUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(data.publicUserMemberNotFav.name, data.publicUserMemberNotFav.contextMenu);
    });

    it('Private library, user is a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.privateUserMemberNotFav.name, data.privateUserMemberNotFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.privateUserMemberNotFav.name, data.privateUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(data.privateUserMemberNotFav.name, data.privateUserMemberNotFav.contextMenu);
    });

    it('Moderated library, user is a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.moderatedUserMemberNotFav.name, data.moderatedUserMemberNotFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.moderatedUserMemberNotFav.name, data.moderatedUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(data.moderatedUserMemberNotFav.name, data.moderatedUserMemberNotFav.contextMenu);
    });

  });

  describe('on Favorite Libraries', () => {

    beforeAll(async () => {
      await Utils.pressEscape();
      await page.goToFavoriteLibrariesAndWait();
    });

    beforeEach(async () => {
      await Utils.pressEscape();
    });

    it('Public library, user is a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.publicUserMemberFav.name, data.publicUserMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.publicUserMemberFav.name, data.publicUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(data.publicUserMemberFav.name, data.publicUserMemberFav.contextMenu);
    });

    it('Private library, user is a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.privateUserMemberFav.name, data.privateUserMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.privateUserMemberFav.name, data.privateUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(data.privateUserMemberFav.name, data.privateUserMemberFav.contextMenu);
    });

    it('Moderated library, user is a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.moderatedUserMemberFav.name, data.moderatedUserMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.moderatedUserMemberFav.name, data.moderatedUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(data.moderatedUserMemberFav.name, data.moderatedUserMemberFav.contextMenu);
    });

    it('Public library, user not a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.publicNotMemberFav.name, data.publicNotMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.publicNotMemberFav.name, data.publicNotMemberFav.toolbarMore);
      await testUtil.checkContextMenu(data.publicNotMemberFav.name, data.publicNotMemberFav.contextMenu);
    });

    it('Moderated library, user not a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.moderatedNotMemberFav.name, data.moderatedNotMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.moderatedNotMemberFav.name, data.moderatedNotMemberFav.toolbarMore);
      await testUtil.checkContextMenu(data.moderatedNotMemberFav.name, data.moderatedNotMemberFav.contextMenu);
    });

    it('Moderated library, user requested to join, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.moderatedRequestedJoinFav.name, data.moderatedRequestedJoinFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.moderatedRequestedJoinFav.name, data.moderatedRequestedJoinFav.toolbarMore);
      await testUtil.checkContextMenu(data.moderatedRequestedJoinFav.name, data.moderatedRequestedJoinFav.contextMenu);
    });
  });

  describe('on Search Results', () => {

    beforeAll(async () => {
      await Utils.pressEscape();
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchFor('site-');
    });

    beforeEach(async () => {
      await Utils.pressEscape();
    });

    it('Public library, user is a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.publicUserMemberFav.name, data.publicUserMemberFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.publicUserMemberFav.name, data.publicUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(data.publicUserMemberFav.name, data.publicUserMemberFav.contextMenu);
    });

    it('Private library, user is a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.privateUserMemberFav.name, data.privateUserMemberFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.privateUserMemberFav.name, data.privateUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(data.privateUserMemberFav.name, data.privateUserMemberFav.contextMenu);
    });

    it('Moderated library, user is a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.moderatedUserMemberFav.name, data.moderatedUserMemberFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.moderatedUserMemberFav.name, data.moderatedUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(data.moderatedUserMemberFav.name, data.moderatedUserMemberFav.contextMenu);
    });

    it('Public library, user is a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.publicUserMemberNotFav.name, data.publicUserMemberNotFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.publicUserMemberNotFav.name, data.publicUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(data.publicUserMemberNotFav.name, data.publicUserMemberNotFav.contextMenu);
    });

    it('Private library, user is a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.privateUserMemberNotFav.name, data.privateUserMemberNotFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.privateUserMemberNotFav.name, data.privateUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(data.privateUserMemberNotFav.name, data.privateUserMemberNotFav.contextMenu);
    });

    it('Moderated library, user is a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.moderatedUserMemberNotFav.name, data.moderatedUserMemberNotFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.moderatedUserMemberNotFav.name, data.moderatedUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(data.moderatedUserMemberNotFav.name, data.moderatedUserMemberNotFav.contextMenu);
    });

    it('Public library, user not a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.publicNotMemberFav.name, data.publicNotMemberFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.publicNotMemberFav.name, data.publicNotMemberFav.toolbarMore);
      await testUtil.checkContextMenu(data.publicNotMemberFav.name, data.publicNotMemberFav.contextMenu);
    });

    it('Moderated library, user not a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.moderatedNotMemberFav.name, data.moderatedNotMemberFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.moderatedNotMemberFav.name, data.moderatedNotMemberFav.toolbarMore);
      await testUtil.checkContextMenu(data.moderatedNotMemberFav.name, data.moderatedNotMemberFav.contextMenu);
    });

    it('Public library, user not a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.publicNotMemberNotFav.name, data.publicNotMemberNotFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.publicNotMemberNotFav.name, data.publicNotMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(data.publicNotMemberNotFav.name, data.publicNotMemberNotFav.contextMenu);
    });

    it('Moderated library, user not a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.moderatedNotMemberNotFav.name, data.moderatedNotMemberNotFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.moderatedNotMemberNotFav.name, data.moderatedNotMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(data.moderatedNotMemberNotFav.name, data.moderatedNotMemberNotFav.contextMenu);
    });

    it('Moderated library, user requested to join, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.moderatedRequestedJoinFav.name, data.moderatedRequestedJoinFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.moderatedRequestedJoinFav.name, data.moderatedRequestedJoinFav.toolbarMore);
      await testUtil.checkContextMenu(data.moderatedRequestedJoinFav.name, data.moderatedRequestedJoinFav.contextMenu);
    });

    it('Moderated library, user requested to join, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(data.moderatedRequestedJoinNotFav.name, data.moderatedRequestedJoinNotFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(data.moderatedRequestedJoinNotFav.name, data.moderatedRequestedJoinNotFav.toolbarMore);
      await testUtil.checkContextMenu(data.moderatedRequestedJoinNotFav.name, data.moderatedRequestedJoinNotFav.contextMenu);
    });
  });

  describe('on Trash', () => {
    beforeAll(async () => {
      await Utils.pressEscape();
      await page.clickTrashAndWait();
    });

    beforeEach(async () => {
      await Utils.pressEscape();
    });

    it('single library - []', async () => {
      await testUtil.checkToolbarPrimary(data.siteInTrash.name, data.siteInTrash.trashActions);
      await testUtil.checkContextMenu(data.siteInTrash.name, data.siteInTrash.trashActions);
    });

    it('multiple libraries - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ data.siteInTrash.name, data.site2InTrash.name ], data.trashActions);
      await testUtil.checkMultipleSelToolbarPrimary([ data.siteInTrash.name, data.site2InTrash.name ], data.trashActions);
    });
  });
});
