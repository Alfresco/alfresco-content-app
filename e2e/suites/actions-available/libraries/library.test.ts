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
import * as testData from './test-data-libraries';
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

    await userApi.sites.createSite(testData.publicUserMemberFav.name);
    await userApi.sites.createSitePrivate(testData.privateUserMemberFav.name);
    await userApi.sites.createSiteModerated(testData.moderatedUserMemberFav.name);

    const publicUserMemberNotFavId = (await userApi.sites.createSite(testData.publicUserMemberNotFav.name)).entry.guid;
    const privateUserMemberNotFavId = (await userApi.sites.createSitePrivate(testData.privateUserMemberNotFav.name)).entry.guid;
    const moderatedUserMemberNotFavId = (await userApi.sites.createSiteModerated(testData.moderatedUserMemberNotFav.name)).entry.guid;

    await adminApiActions.sites.createSite(testData.publicNotMemberFav.name);
    await adminApiActions.sites.createSiteModerated(testData.moderatedNotMemberFav.name);

    await adminApiActions.sites.createSite(testData.publicNotMemberNotFav.name);
    await adminApiActions.sites.createSiteModerated(testData.moderatedNotMemberNotFav.name);

    await adminApiActions.sites.createSiteModerated(testData.moderatedRequestedJoinFav.name);
    await adminApiActions.sites.createSiteModerated(testData.moderatedRequestedJoinNotFav.name);

    await userApi.sites.createSite(testData.siteInTrash.name);
    await userApi.sites.createSite(testData.site2InTrash.name);

    await Promise.all([
      userApi.sites.waitForApi({ expect: 8 }),
      adminApiActions.sites.waitForApi({ expect: 6 + 1 })
    ]);

    await userApi.favorites.removeFavoritesByIds([publicUserMemberNotFavId, privateUserMemberNotFavId, moderatedUserMemberNotFavId]);

    await userApi.favorites.addFavoritesByIds('site', [testData.publicNotMemberFav.name, testData.moderatedNotMemberFav.name, testData.moderatedRequestedJoinFav.name]);

    await userApi.sites.requestToJoin(testData.moderatedRequestedJoinFav.name);
    await userApi.sites.requestToJoin(testData.moderatedRequestedJoinNotFav.name);

    await userApi.queries.waitForSites('site-', { expect: 14 + 1 });

    await userApi.sites.deleteSite(testData.siteInTrash.name, false);
    await userApi.sites.deleteSite(testData.site2InTrash.name, false);

    await userApi.trashcan.waitForApi({ expect: 2 });

    await loginPage.loginWith(username);
  });

  afterAll(async () => {
    await Promise.all([
      userApi.sites.deleteSites([
        testData.publicUserMemberFav.name,
        testData.privateUserMemberFav.name,
        testData.moderatedUserMemberFav.name,
        testData.publicUserMemberNotFav.name,
        testData.privateUserMemberNotFav.name,
        testData.moderatedUserMemberNotFav.name
      ]),
      adminApiActions.sites.deleteSites([
        testData.publicNotMemberFav.name,
        testData.moderatedNotMemberFav.name,
        testData.publicNotMemberNotFav.name,
        testData.moderatedNotMemberNotFav.name,
        testData.moderatedRequestedJoinFav.name,
        testData.moderatedRequestedJoinNotFav.name
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
      await testUtil.checkToolbarPrimary(testData.publicUserMemberFav.name, testData.publicUserMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.publicUserMemberFav.name, testData.publicUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicUserMemberFav.name, testData.publicUserMemberFav.contextMenu);
    });

    it('Private library, user is a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.privateUserMemberFav.name, testData.privateUserMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.privateUserMemberFav.name, testData.privateUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.privateUserMemberFav.name, testData.privateUserMemberFav.contextMenu);
    });

    it('Moderated library, user is a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.contextMenu);
    });

    it('Public library, user is a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.contextMenu);
    });

    it('Private library, user is a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.contextMenu);
    });

    it('Moderated library, user is a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.moderatedUserMemberNotFav.name, testData.moderatedUserMemberNotFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.moderatedUserMemberNotFav.name, testData.moderatedUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedUserMemberNotFav.name, testData.moderatedUserMemberNotFav.contextMenu);
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
      await testUtil.checkToolbarPrimary(testData.publicUserMemberFav.name, testData.publicUserMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.publicUserMemberFav.name, testData.publicUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicUserMemberFav.name, testData.publicUserMemberFav.contextMenu);
    });

    it('Private library, user is a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.privateUserMemberFav.name, testData.privateUserMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.privateUserMemberFav.name, testData.privateUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.privateUserMemberFav.name, testData.privateUserMemberFav.contextMenu);
    });

    it('Moderated library, user is a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.contextMenu);
    });

    it('Public library, user not a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.publicNotMemberFav.name, testData.publicNotMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.publicNotMemberFav.name, testData.publicNotMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicNotMemberFav.name, testData.publicNotMemberFav.contextMenu);
    });

    it('Moderated library, user not a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.contextMenu);
    });

    it('Moderated library, user requested to join, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.moderatedRequestedJoinFav.name, testData.moderatedRequestedJoinFav.toolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.moderatedRequestedJoinFav.name, testData.moderatedRequestedJoinFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedRequestedJoinFav.name, testData.moderatedRequestedJoinFav.contextMenu);
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
      await testUtil.checkToolbarPrimary(testData.publicUserMemberFav.name, testData.publicUserMemberFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.publicUserMemberFav.name, testData.publicUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicUserMemberFav.name, testData.publicUserMemberFav.contextMenu);
    });

    it('Private library, user is a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.privateUserMemberFav.name, testData.privateUserMemberFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.privateUserMemberFav.name, testData.privateUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.privateUserMemberFav.name, testData.privateUserMemberFav.contextMenu);
    });

    it('Moderated library, user is a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.contextMenu);
    });

    it('Public library, user is a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.contextMenu);
    });

    it('Private library, user is a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.contextMenu);
    });

    it('Moderated library, user is a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.moderatedUserMemberNotFav.name, testData.moderatedUserMemberNotFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.moderatedUserMemberNotFav.name, testData.moderatedUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedUserMemberNotFav.name, testData.moderatedUserMemberNotFav.contextMenu);
    });

    it('Public library, user not a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.publicNotMemberFav.name, testData.publicNotMemberFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.publicNotMemberFav.name, testData.publicNotMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicNotMemberFav.name, testData.publicNotMemberFav.contextMenu);
    });

    it('Moderated library, user not a member, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.contextMenu);
    });

    it('Public library, user not a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.publicNotMemberNotFav.name, testData.publicNotMemberNotFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.publicNotMemberNotFav.name, testData.publicNotMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicNotMemberNotFav.name, testData.publicNotMemberNotFav.contextMenu);
    });

    it('Moderated library, user not a member, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.moderatedNotMemberNotFav.name, testData.moderatedNotMemberNotFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.moderatedNotMemberNotFav.name, testData.moderatedNotMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedNotMemberNotFav.name, testData.moderatedNotMemberNotFav.contextMenu);
    });

    it('Moderated library, user requested to join, favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.moderatedRequestedJoinFav.name, testData.moderatedRequestedJoinFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.moderatedRequestedJoinFav.name, testData.moderatedRequestedJoinFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedRequestedJoinFav.name, testData.moderatedRequestedJoinFav.contextMenu);
    });

    it('Moderated library, user requested to join, not favorite - []', async () => {
      await testUtil.checkToolbarPrimary(testData.moderatedRequestedJoinNotFav.name, testData.moderatedRequestedJoinNotFav.searchToolbarPrimary);
      await testUtil.checkToolbarMoreActions(testData.moderatedRequestedJoinNotFav.name, testData.moderatedRequestedJoinNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedRequestedJoinNotFav.name, testData.moderatedRequestedJoinNotFav.contextMenu);
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
      await testUtil.checkToolbarPrimary(testData.siteInTrash.name, testData.siteInTrash.trashActions);
      await testUtil.checkContextMenu(testData.siteInTrash.name, testData.siteInTrash.trashActions);
    });

    it('multiple libraries - []', async () => {
      await testUtil.checkMultipleSelContextMenu([ testData.siteInTrash.name, testData.site2InTrash.name ], testData.trashActions);
      await testUtil.checkMultipleSelToolbarPrimary([ testData.siteInTrash.name, testData.site2InTrash.name ], testData.trashActions);
    });
  });
});
