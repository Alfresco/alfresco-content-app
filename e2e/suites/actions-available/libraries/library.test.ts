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

    it('Public library, user is a member, favorite - [C213135]', async () => {
      await testUtil.checkToolbarActions(testData.publicUserMemberFav.name, testData.publicUserMemberFav.toolbarPrimary, testData.publicUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicUserMemberFav.name, testData.publicUserMemberFav.contextMenu);
    });

    it('Private library, user is a member, favorite - [C290080]', async () => {
      await testUtil.checkToolbarActions(testData.privateUserMemberFav.name, testData.privateUserMemberFav.toolbarPrimary, testData.privateUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.privateUserMemberFav.name, testData.privateUserMemberFav.contextMenu);
    });

    it('Moderated library, user is a member, favorite - [C326676]', async () => {
      await testUtil.checkToolbarActions(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.toolbarPrimary, testData.moderatedUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.contextMenu);
    });

    it('Public library, user is a member, not favorite - [C326677]', async () => {
      await testUtil.checkToolbarActions(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.toolbarPrimary, testData.publicUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.contextMenu);
    });

    it('Private library, user is a member, not favorite - [C326678]', async () => {
      await testUtil.checkToolbarActions(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.toolbarPrimary, testData.privateUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.contextMenu);
    });

    it('Moderated library, user is a member, not favorite - [C326679]', async () => {
      await testUtil.checkToolbarActions(testData.moderatedUserMemberNotFav.name, testData.moderatedUserMemberNotFav.toolbarPrimary, testData.moderatedUserMemberNotFav.toolbarMore);
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

    it('Public library, user is a member, favorite - [C289892]', async () => {
      await testUtil.checkToolbarActions(testData.publicUserMemberFav.name, testData.publicUserMemberFav.toolbarPrimary, testData.publicUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicUserMemberFav.name, testData.publicUserMemberFav.contextMenu);
    });

    it('Private library, user is a member, favorite - [C290090]', async () => {
      await testUtil.checkToolbarActions(testData.privateUserMemberFav.name, testData.privateUserMemberFav.toolbarPrimary, testData.privateUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.privateUserMemberFav.name, testData.privateUserMemberFav.contextMenu);
    });

    it('Moderated library, user is a member, favorite - [C290091]', async () => {
      await testUtil.checkToolbarActions(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.toolbarPrimary, testData.moderatedUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.contextMenu);
    });

    it('Public library, user not a member, favorite - [C290081]', async () => {
      await testUtil.checkToolbarActions(testData.publicNotMemberFav.name, testData.publicNotMemberFav.toolbarPrimary, testData.publicNotMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicNotMemberFav.name, testData.publicNotMemberFav.contextMenu);
    });

    it('Moderated library, user not a member, favorite - [C290082]', async () => {
      await testUtil.checkToolbarActions(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.toolbarPrimary, testData.moderatedNotMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.contextMenu);
    });

    it('Moderated library, user requested to join, favorite - [C290089]', async () => {
      await testUtil.checkToolbarActions(testData.moderatedRequestedJoinFav.name, testData.moderatedRequestedJoinFav.toolbarPrimary, testData.moderatedRequestedJoinFav.toolbarMore);
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

    it('Public library, user is a member, favorite - [C290084]', async () => {
      await testUtil.checkToolbarActions(testData.publicUserMemberFav.name, testData.publicUserMemberFav.searchToolbarPrimary, testData.publicUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicUserMemberFav.name, testData.publicUserMemberFav.contextMenu);
    });

    it('Private library, user is a member, favorite - [C290085]', async () => {
      await testUtil.checkToolbarActions(testData.privateUserMemberFav.name, testData.privateUserMemberFav.searchToolbarPrimary, testData.privateUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.privateUserMemberFav.name, testData.privateUserMemberFav.contextMenu);
    });

    it('Moderated library, user is a member, favorite - [C290086]', async () => {
      await testUtil.checkToolbarActions(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.searchToolbarPrimary, testData.moderatedUserMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.contextMenu);
    });

    it('Public library, user is a member, not favorite - [C291812]', async () => {
      await testUtil.checkToolbarActions(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.searchToolbarPrimary, testData.publicUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.contextMenu);
    });

    it('Private library, user is a member, not favorite - [C291813]', async () => {
      await testUtil.checkToolbarActions(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.searchToolbarPrimary, testData.privateUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.contextMenu);
    });

    it('Moderated library, user is a member, not favorite - [C291814]', async () => {
      await testUtil.checkToolbarActions(testData.moderatedUserMemberNotFav.name, testData.moderatedUserMemberNotFav.searchToolbarPrimary, testData.moderatedUserMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedUserMemberNotFav.name, testData.moderatedUserMemberNotFav.contextMenu);
    });

    it('Public library, user not a member, favorite - [C326680]', async () => {
      await testUtil.checkToolbarActions(testData.publicNotMemberFav.name, testData.publicNotMemberFav.searchToolbarPrimary, testData.publicNotMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicNotMemberFav.name, testData.publicNotMemberFav.contextMenu);
    });

    it('Moderated library, user not a member, favorite - [C326681]', async () => {
      await testUtil.checkToolbarActions(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.searchToolbarPrimary, testData.moderatedNotMemberFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.contextMenu);
    });

    it('Public library, user not a member, not favorite - [C326682]', async () => {
      await testUtil.checkToolbarActions(testData.publicNotMemberNotFav.name, testData.publicNotMemberNotFav.searchToolbarPrimary, testData.publicNotMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.publicNotMemberNotFav.name, testData.publicNotMemberNotFav.contextMenu);
    });

    it('Moderated library, user not a member, not favorite - [C326683]', async () => {
      await testUtil.checkToolbarActions(testData.moderatedNotMemberNotFav.name, testData.moderatedNotMemberNotFav.searchToolbarPrimary, testData.moderatedNotMemberNotFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedNotMemberNotFav.name, testData.moderatedNotMemberNotFav.contextMenu);
    });

    it('Moderated library, user requested to join, favorite - [C326685]', async () => {
      await testUtil.checkToolbarActions(testData.moderatedRequestedJoinFav.name, testData.moderatedRequestedJoinFav.searchToolbarPrimary, testData.moderatedRequestedJoinFav.toolbarMore);
      await testUtil.checkContextMenu(testData.moderatedRequestedJoinFav.name, testData.moderatedRequestedJoinFav.contextMenu);
    });

    it('Moderated library, user requested to join, not favorite - [C326684]', async () => {
      await testUtil.checkToolbarActions(testData.moderatedRequestedJoinNotFav.name, testData.moderatedRequestedJoinNotFav.searchToolbarPrimary, testData.moderatedRequestedJoinNotFav.toolbarMore);
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

    it('single library - [C326686]', async () => {
      await testUtil.checkToolbarPrimary(testData.siteInTrash.name, testData.siteInTrash.trashActions);
      await testUtil.checkContextMenu(testData.siteInTrash.name, testData.siteInTrash.trashActions);
    });

    it('multiple libraries - [C326687]', async () => {
      await testUtil.checkMultipleSelContextMenu([ testData.siteInTrash.name, testData.site2InTrash.name ], testData.trashActions);
      await testUtil.checkMultipleSelToolbarPrimary([ testData.siteInTrash.name, testData.site2InTrash.name ], testData.trashActions);
    });
  });
});
