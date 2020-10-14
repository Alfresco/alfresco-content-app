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

import { LoginPage, BrowsingPage, SearchResultsPage, RepoClient, Utils, AdminActions, UserActions } from '@alfresco/aca-testing-shared';
import * as testData from './test-data-libraries';
import * as testUtil from '../test-util';

describe('Library actions : ', () => {
  const username = `user-${Utils.random()}`;

  /* @deprecated use userActions instead */
  const userApi = new RepoClient(username, username);
  const adminApiActions = new AdminActions();
  const userActions = new UserActions();

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const searchResultsPage = new SearchResultsPage();
  const { searchInput } = searchResultsPage.header;

  beforeAll(async () => {
    await adminApiActions.login();
    await adminApiActions.createUser({ username });
    await userActions.login(username, username);

    const initialAdminSitesTotalItems = await adminApiActions.sites.getSitesTotalItems();
    const initialUserSitesTotalItems = await userApi.sites.getSitesTotalItems();
    const initialDeletedTotalItems = await userActions.getTrashcanSize();
    const initialQuerySitesTotalItems = await userApi.queries.findSitesTotalItems('actionsSite-');

    await userApi.sites.createSite(testData.publicUserMemberFav.name);
    await userApi.sites.createSite(testData.privateUserMemberFav.name, 'PRIVATE');
    await userApi.sites.createSite(testData.moderatedUserMemberFav.name, 'MODERATED');
    const publicUserMemberNotFavId = (await userApi.sites.createSite(testData.publicUserMemberNotFav.name)).entry.guid;
    const privateUserMemberNotFavId = (await userApi.sites.createSite(testData.privateUserMemberNotFav.name, 'PRIVATE')).entry.guid;
    const moderatedUserMemberNotFavId = (await userApi.sites.createSite(testData.moderatedUserMemberNotFav.name, 'MODERATED')).entry.guid;

    await adminApiActions.sites.createSite(testData.publicNotMemberFav.name);
    await adminApiActions.sites.createSite(testData.moderatedNotMemberFav.name, 'MODERATED');
    await adminApiActions.sites.createSite(testData.publicNotMemberNotFav.name);
    await adminApiActions.sites.createSite(testData.moderatedNotMemberNotFav.name, 'MODERATED');
    await adminApiActions.sites.createSite(testData.moderatedRequestedJoinFav.name, 'MODERATED');
    await adminApiActions.sites.createSite(testData.moderatedRequestedJoinNotFav.name, 'MODERATED');

    await userApi.sites.requestToJoin(testData.moderatedRequestedJoinFav.name);
    await userApi.sites.requestToJoin(testData.moderatedRequestedJoinNotFav.name);

    await userActions.deleteFavorites([publicUserMemberNotFavId, privateUserMemberNotFavId, moderatedUserMemberNotFavId]);
    await userActions.createFavorites('site', [
      testData.publicNotMemberFav.name,
      testData.moderatedNotMemberFav.name,
      testData.moderatedRequestedJoinFav.name
    ]);

    await userApi.sites.waitForApi({ expect: initialUserSitesTotalItems + 6 });
    await adminApiActions.sites.waitForApi({ expect: initialAdminSitesTotalItems + 6 });
    await userApi.queries.waitForSites('actionsSite-', { expect: initialQuerySitesTotalItems + 12 });

    await userApi.sites.createSite(testData.siteInTrash.name);
    await userApi.sites.createSite(testData.site2InTrash.name);

    await userActions.deleteSites([testData.siteInTrash.name, testData.site2InTrash.name], false);
    await userActions.waitForTrashcanSize(initialDeletedTotalItems + 2);

    await loginPage.loginWith(username);
  });

  afterAll(async () => {
    await userActions.deleteSites([
      testData.publicUserMemberFav.name,
      testData.privateUserMemberFav.name,
      testData.moderatedUserMemberFav.name,
      testData.publicUserMemberNotFav.name,
      testData.privateUserMemberNotFav.name,
      testData.moderatedUserMemberNotFav.name
    ]);
    await adminApiActions.deleteSites([
      testData.publicNotMemberFav.name,
      testData.moderatedNotMemberFav.name,
      testData.publicNotMemberNotFav.name,
      testData.moderatedNotMemberNotFav.name,
      testData.moderatedRequestedJoinFav.name,
      testData.moderatedRequestedJoinNotFav.name
    ]);
    await userActions.emptyTrashcan();
  });

  describe('on My Libraries', () => {
    beforeAll(async () => {
      await Utils.pressEscape();
      await page.goToMyLibrariesAndWait();
    });

    beforeEach(async () => {
      await Utils.pressEscape();
    });

    it('[C213135] Public library, user is a member, favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.publicUserMemberFav.name,
        testData.publicUserMemberFav.toolbarPrimary,
        testData.publicUserMemberFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.publicUserMemberFav.name, testData.publicUserMemberFav.contextMenu);
    });

    it('[C290080] Private library, user is a member, favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.privateUserMemberFav.name,
        testData.privateUserMemberFav.toolbarPrimary,
        testData.privateUserMemberFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.privateUserMemberFav.name, testData.privateUserMemberFav.contextMenu);
    });

    it('[C326676] Moderated library, user is a member, favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.moderatedUserMemberFav.name,
        testData.moderatedUserMemberFav.toolbarPrimary,
        testData.moderatedUserMemberFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.contextMenu);
    });

    it('[C326677] Public library, user is a member, not favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.publicUserMemberNotFav.name,
        testData.publicUserMemberNotFav.toolbarPrimary,
        testData.publicUserMemberNotFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.contextMenu);
    });

    it('[C326678] Private library, user is a member, not favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.privateUserMemberNotFav.name,
        testData.privateUserMemberNotFav.toolbarPrimary,
        testData.privateUserMemberNotFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.contextMenu);
    });

    it('[C326679] Moderated library, user is a member, not favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.moderatedUserMemberNotFav.name,
        testData.moderatedUserMemberNotFav.toolbarPrimary,
        testData.moderatedUserMemberNotFav.toolbarMore
      );
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

    it('[C289892] Public library, user is a member, favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.publicUserMemberFav.name,
        testData.publicUserMemberFav.toolbarPrimary,
        testData.publicUserMemberFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.publicUserMemberFav.name, testData.publicUserMemberFav.contextMenu);
    });

    it('[C290090] Private library, user is a member, favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.privateUserMemberFav.name,
        testData.privateUserMemberFav.toolbarPrimary,
        testData.privateUserMemberFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.privateUserMemberFav.name, testData.privateUserMemberFav.contextMenu);
    });

    it('[C290091] Moderated library, user is a member, favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.moderatedUserMemberFav.name,
        testData.moderatedUserMemberFav.toolbarPrimary,
        testData.moderatedUserMemberFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.contextMenu);
    });

    it('[C290081] Public library, user not a member, favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.publicNotMemberFav.name,
        testData.publicNotMemberFav.toolbarPrimary,
        testData.publicNotMemberFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.publicNotMemberFav.name, testData.publicNotMemberFav.contextMenu);
    });

    it('[C290082] Moderated library, user not a member, favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.moderatedNotMemberFav.name,
        testData.moderatedNotMemberFav.toolbarPrimary,
        testData.moderatedNotMemberFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.contextMenu);
    });

    it('[C290089] Moderated library, user requested to join, favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.moderatedRequestedJoinFav.name,
        testData.moderatedRequestedJoinFav.toolbarPrimary,
        testData.moderatedRequestedJoinFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.moderatedRequestedJoinFav.name, testData.moderatedRequestedJoinFav.contextMenu);
    });
  });

  describe('on Search Results', () => {
    beforeAll(async () => {
      await Utils.pressEscape();
      await page.clickPersonalFiles();
      await searchInput.clickSearchButton();
      await searchInput.checkLibraries();
      await searchInput.searchFor('actionsSite-');
    });

    beforeEach(async () => {
      await Utils.pressEscape();
    });

    it('[C290084] Public library, user is a member, favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.publicUserMemberFav.name,
        testData.publicUserMemberFav.searchToolbarPrimary,
        testData.publicUserMemberFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.publicUserMemberFav.name, testData.publicUserMemberFav.contextMenu);
    });

    it('[C290085] Private library, user is a member, favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.privateUserMemberFav.name,
        testData.privateUserMemberFav.searchToolbarPrimary,
        testData.privateUserMemberFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.privateUserMemberFav.name, testData.privateUserMemberFav.contextMenu);
    });

    it('[C290086] Moderated library, user is a member, favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.moderatedUserMemberFav.name,
        testData.moderatedUserMemberFav.searchToolbarPrimary,
        testData.moderatedUserMemberFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.moderatedUserMemberFav.name, testData.moderatedUserMemberFav.contextMenu);
    });

    it('[C291812] Public library, user is a member, not favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.publicUserMemberNotFav.name,
        testData.publicUserMemberNotFav.searchToolbarPrimary,
        testData.publicUserMemberNotFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.publicUserMemberNotFav.name, testData.publicUserMemberNotFav.contextMenu);
    });

    it('[C291813] Private library, user is a member, not favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.privateUserMemberNotFav.name,
        testData.privateUserMemberNotFav.searchToolbarPrimary,
        testData.privateUserMemberNotFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.privateUserMemberNotFav.name, testData.privateUserMemberNotFav.contextMenu);
    });

    it('[C291814] Moderated library, user is a member, not favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.moderatedUserMemberNotFav.name,
        testData.moderatedUserMemberNotFav.searchToolbarPrimary,
        testData.moderatedUserMemberNotFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.moderatedUserMemberNotFav.name, testData.moderatedUserMemberNotFav.contextMenu);
    });

    it('[C326680] Public library, user not a member, favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.publicNotMemberFav.name,
        testData.publicNotMemberFav.searchToolbarPrimary,
        testData.publicNotMemberFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.publicNotMemberFav.name, testData.publicNotMemberFav.contextMenu);
    });

    it('[C326681] Moderated library, user not a member, favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.moderatedNotMemberFav.name,
        testData.moderatedNotMemberFav.searchToolbarPrimary,
        testData.moderatedNotMemberFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.moderatedNotMemberFav.name, testData.moderatedNotMemberFav.contextMenu);
    });

    it('[C326682] Public library, user not a member, not favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.publicNotMemberNotFav.name,
        testData.publicNotMemberNotFav.searchToolbarPrimary,
        testData.publicNotMemberNotFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.publicNotMemberNotFav.name, testData.publicNotMemberNotFav.contextMenu);
    });

    it('[C326683] Moderated library, user not a member, not favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.moderatedNotMemberNotFav.name,
        testData.moderatedNotMemberNotFav.searchToolbarPrimary,
        testData.moderatedNotMemberNotFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.moderatedNotMemberNotFav.name, testData.moderatedNotMemberNotFav.contextMenu);
    });

    it('[C326685] Moderated library, user requested to join, favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.moderatedRequestedJoinFav.name,
        testData.moderatedRequestedJoinFav.searchToolbarPrimary,
        testData.moderatedRequestedJoinFav.toolbarMore
      );
      await testUtil.checkContextMenu(testData.moderatedRequestedJoinFav.name, testData.moderatedRequestedJoinFav.contextMenu);
    });

    it('[C326684] Moderated library, user requested to join, not favorite', async () => {
      await testUtil.checkToolbarActions(
        testData.moderatedRequestedJoinNotFav.name,
        testData.moderatedRequestedJoinNotFav.searchToolbarPrimary,
        testData.moderatedRequestedJoinNotFav.toolbarMore
      );
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

    it('[C326686] single library', async () => {
      await testUtil.checkToolbarPrimary(testData.siteInTrash.name, testData.siteInTrash.trashActions);
      await testUtil.checkContextMenu(testData.siteInTrash.name, testData.siteInTrash.trashActions);
    });

    it('[C326687] multiple libraries', async () => {
      await testUtil.checkMultipleSelContextMenu([testData.siteInTrash.name, testData.site2InTrash.name], testData.trashActions);
      await testUtil.checkMultipleSelToolbarPrimary([testData.siteInTrash.name, testData.site2InTrash.name], testData.trashActions);
    });
  });
});
