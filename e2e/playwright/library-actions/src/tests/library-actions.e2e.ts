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
  Utils,
  ApiClientFactory,
  test,
  SitesApi,
  FavoritesPageApi,
  timeouts,
  DataTableComponent,
  SnackBarComponent,
  AdfConfirmDialogComponent,
  AcaHeader,
  MatMenuComponent,
  TrashcanApi
} from '@alfresco/playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('Library actions ', () => {
  const notMemberString = 'Not a member';
  const managerRole = 'Manager';
  const contributorRole = 'Contributor';
  const consumerRole = 'Consumer';
  const joinButton = 'Join';
  const libraryJoinedMessage = 'Library joined';
  const requestToJoinMessage = 'Request sent to join this library';
  const cancelJoinRequestButton = 'Cancel Join Request';
  const cancelJoinRequestMessage = 'Canceled the request to join the library';
  const leaveLibraryButton = 'Leave Library';
  const leftMessage = 'You have left the library';
  const favoriteButton = 'Favorite';
  const removeFavoriteButton = 'Remove Favorite';
  const deleteButton = 'Delete';
  const libraryDeletedMessage = 'Library deleted';
  const siteString = 'site';
  const loadString = 'load';
  const domContentLoadedString = 'domcontentloaded';

  const username2 = `user-${Utils.random()}`;
  const adminLibrary1 = `playwright-A-library-${Utils.random()}`;
  const adminLibrary2 = `playwright-A-library-${Utils.random()}`;
  const adminLibrary3 = `playwright-A-library-${Utils.random()}`;
  const adminLibrary4 = `playwright-A-library-${Utils.random()}`;
  const adminModerateLibrary1 = `playwright-Am-library-${Utils.random()}`;
  const adminModerateLibrary2 = `playwright-Am-library-${Utils.random()}`;
  const adminModerateLibrary3 = `playwright-Am-library-${Utils.random()}`;
  const adminModerateLibrary4 = `playwright-Am-library-${Utils.random()}`;
  const user1Library1 = `playwright-U1-library-${Utils.random()}`;
  const user1Library2 = `playwright-U1-library-${Utils.random()}`;
  const user1Library3 = `playwright-U1-library-${Utils.random()}`;
  const user1Library4 = `playwright-U1-library-${Utils.random()}`;
  const user1Library5 = `playwright-U1-library-${Utils.random()}`;
  const user2Library1 = `playwright-U2-library-${Utils.random()}`;
  const user2Library2 = `playwright-U2-library-${Utils.random()}`;
  const user2Library3 = `playwright-U2-library-${Utils.random()}`;
  const user2Library4 = `playwright-U2-library-${Utils.random()}`;
  const user2Library5Delete = `playwright-T-library-${Utils.random()}`;
  const user2Library6Delete = `playwright-T-library-${Utils.random()}`;
  const user2Library7Delete = `playwright-T-library-${Utils.random()}`;

  const adminLibraryIds = [adminLibrary1, adminLibrary2, adminLibrary3, adminLibrary4];
  const adminModerateLibraryIds = [adminModerateLibrary1, adminModerateLibrary2, adminModerateLibrary3, adminModerateLibrary4];
  const user1LibraryIds = [user1Library1, user1Library2, user1Library3, user1Library4, user1Library5];
  const user2LibraryIds = [user2Library1, user2Library2, user2Library3, user2Library4];

  let adminSitesApi: SitesApi;
  let user2SitesApi: SitesApi;

  test.beforeAll(async () => {
    test.setTimeout(timeouts.globalSpec);
    const apiClientFactory = new ApiClientFactory();
    const username1 = `user-${Utils.random()}`;
    const siteRoles = [
      Site.RoleEnum.SiteManager,
      Site.RoleEnum.SiteContributor,
      Site.RoleEnum.SiteCollaborator,
      Site.RoleEnum.SiteConsumer,
      Site.RoleEnum.SiteManager
    ];
    const user2LibraryIdsDelete = [user2Library5Delete, user2Library6Delete, user2Library7Delete];
    try {
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username: username1 });
      await apiClientFactory.createUser({ username: username2 });

      adminSitesApi = await SitesApi.initialize('admin');
      for (const libraryId of adminLibraryIds) {
        await adminSitesApi.createSite(libraryId);
      }

      for (const libraryId of adminModerateLibraryIds) {
        await adminSitesApi.createSite(libraryId, Site.VisibilityEnum.MODERATED);
      }
      await adminSitesApi.addSiteMember(adminLibrary3, username2, Site.RoleEnum.SiteContributor);

      const user1SitesApi = await SitesApi.initialize(username1, username1);
      for (let i = 0; i < user1LibraryIds.length; i++) {
        await user1SitesApi.createSite(user1LibraryIds[i]);
        await user1SitesApi.addSiteMember(user1LibraryIds[i], username2, siteRoles[i]);
      }

      user2SitesApi = await SitesApi.initialize(username2, username2);
      for (const libraryId of user2LibraryIds) {
        await user2SitesApi.createSite(libraryId);
      }

      for (const libraryId of user2LibraryIdsDelete) {
        await user2SitesApi.createSite(libraryId);
      }

      await new Promise((resolve) => setTimeout(resolve, timeouts.extraLarge));
    } catch (error) {
      console.error(`Main beforeAll failed : ${error}`);
    }
  });

  test.beforeEach(async ({ loginPage, myLibrariesPage }) => {
    await Utils.tryLoginUser(loginPage, username2, username2, 'beforeEach failed');
    await myLibrariesPage.navigate();
  });

  test.afterAll(async () => {
    try {
      await adminSitesApi.deleteSites(adminLibraryIds);
      await adminSitesApi.deleteSites(adminModerateLibraryIds);
      await adminSitesApi.deleteSites(user1LibraryIds);
      await adminSitesApi.deleteSites(user2LibraryIds);
      const trashcanApi = await TrashcanApi.initialize(username2, username2);
      await trashcanApi.emptyTrashcan();
    } catch (error) {
      console.error(`Main afterAll failed : ${error}`);
    }
  });

  test.describe('My Libraries page', () => {
    let libraryTable: DataTableComponent;
    let snackBar: SnackBarComponent;
    let confirmDialog: AdfConfirmDialogComponent;
    let myLibrariesHeader: AcaHeader;
    let libraryMenu: MatMenuComponent;

    test.beforeEach(async ({ myLibrariesPage }) => {
      try {
        libraryTable = myLibrariesPage.dataTable;
        snackBar = myLibrariesPage.snackBar;
        confirmDialog = myLibrariesPage.confirmDialogComponent;
        myLibrariesHeader = myLibrariesPage.acaHeader;
        libraryMenu = myLibrariesPage.matMenu;
      } catch (error) {
        console.error(`My Libraries, beforeEach failed : ${error}`);
      }
    });

    test('[C290106] Leave a library from My Libraries', async () => {
      await expect(libraryTable.getCellByColumnNameAndRowItem(user1Library1, managerRole)).toBeVisible();
      await libraryTable.performActionFromExpandableMenu(user1Library1, leaveLibraryButton);
      await expect.soft(confirmDialog.getDialogTitle('Leave this library?')).toBeVisible();
      await expect.soft(confirmDialog.getDialogContent('Leaving will remove your access.')).toBeVisible();
      await expect.soft(confirmDialog.okButton).toBeVisible();
      await expect.soft(confirmDialog.cancelButton).toBeVisible();
      await confirmDialog.okButton.click();
      await expect.soft(snackBar.getByMessageLocator(leftMessage)).toBeVisible();
      await expect(libraryTable.getRowByName(user1Library1)).toBeHidden();
    });

    test('[C290111] Cancel Leave Library', async () => {
      await expect(libraryTable.getCellByColumnNameAndRowItem(user1Library5, managerRole)).toBeVisible();
      await libraryTable.performActionFromExpandableMenu(user1Library5, leaveLibraryButton);
      await confirmDialog.cancelButton.click();
      await expect(libraryTable.getCellByColumnNameAndRowItem(user1Library5, managerRole)).toBeVisible();
    });

    test('[C290107] Leave a library - failure notification', async () => {
      await expect(libraryTable.getCellByColumnNameAndRowItem(user2Library1, managerRole)).toBeVisible();
      await libraryTable.performActionFromExpandableMenu(user2Library1, leaveLibraryButton);
      await confirmDialog.okButton.click();
      await expect.soft(snackBar.getByMessageLocator('Cannot leave this library')).toBeVisible();
      await expect(libraryTable.getCellByColumnNameAndRowItem(user2Library1, managerRole)).toBeVisible();
    });

    test('[C289974] Mark library as favorite from My Libraries', async () => {
      await expect(libraryTable.getCellByColumnNameAndRowItem(adminLibrary3, contributorRole)).toBeVisible();
      await libraryTable.getCellByColumnNameAndRowItem(adminLibrary3, contributorRole).click();
      await myLibrariesHeader.clickMoreActions();
      await libraryMenu.clickMenuItem(favoriteButton);
      await myLibrariesHeader.clickMoreActions();
      expect(await libraryMenu.isMenuItemVisible(removeFavoriteButton)).toBe(true);
    });

    test('[C289975] Remove library from favorites from My Libraries', async ({ myLibrariesPage }) => {
      await expect(libraryTable.getRowByName(user2Library2)).toBeVisible();
      await libraryTable.getRowByName(user2Library2).click();
      await myLibrariesPage.page.waitForTimeout(1000);
      await myLibrariesHeader.clickMoreActions();
      expect(await libraryMenu.isMenuItemVisible(removeFavoriteButton)).toBe(true);
      await libraryMenu.clickMenuItem(removeFavoriteButton);
      await myLibrariesHeader.clickMoreActions();
      expect(await libraryMenu.isMenuItemVisible(favoriteButton)).toBe(true);
    });

    test('[C289988] Delete a library from My Libraries', async ({ trashPage }) => {
      const trashTable = trashPage.dataTable;
      await expect(libraryTable.getRowByName(user2Library5Delete)).toBeVisible();
      await libraryTable.getRowByName(user2Library5Delete).click();
      await myLibrariesHeader.clickMoreActions();
      await libraryMenu.clickMenuItem(deleteButton);
      await expect.soft(snackBar.getByMessageLocator(libraryDeletedMessage)).toBeVisible();
      await expect(libraryTable.getRowByName(user2Library5Delete)).toBeHidden();
      await trashPage.navigate({ waitUntil: loadString });
      await expect(trashTable.getRowByName(user2Library5Delete)).toBeVisible();
    });
  });

  test.describe('Favorite Libraries page', () => {
    let libraryTable: DataTableComponent;
    let snackBar: SnackBarComponent;
    let favoritesApi: FavoritesPageApi;

    test.beforeEach(async ({ favoriteLibrariesPage }) => {
      try {
        libraryTable = favoriteLibrariesPage.dataTable;
        snackBar = favoriteLibrariesPage.snackBar;
        favoritesApi = await FavoritesPageApi.initialize(username2, username2);
      } catch (error) {
        console.error(`beforeAll failed : ${error}`);
      }
    });

    test('[C290105] Join a public library from Favorite Libraries', async ({ favoriteLibrariesPage }) => {
      await favoritesApi.addFavoriteById(siteString, adminLibrary1);
      await favoriteLibrariesPage.navigate();
      await libraryTable.performActionFromExpandableMenu(adminLibrary1, joinButton);
      await expect.soft(snackBar.getByMessageLocator(libraryJoinedMessage)).toBeVisible();
      await expect(libraryTable.getCellByColumnNameAndRowItem(adminLibrary1, consumerRole)).toBeVisible();
    });

    test('[C290109] Join a moderated library from Favorite Libraries', async ({ favoriteLibrariesPage }) => {
      await favoritesApi.addFavoriteById(siteString, adminModerateLibrary1);
      await favoriteLibrariesPage.navigate();
      await expect(libraryTable.getCellByColumnNameAndRowItem(adminModerateLibrary1, notMemberString)).toBeVisible();
      await libraryTable.performActionFromExpandableMenu(adminModerateLibrary1, joinButton);
      await expect.soft(snackBar.getByMessageLocator(requestToJoinMessage)).toBeVisible();
      await expect(libraryTable.getCellByColumnNameAndRowItem(adminModerateLibrary1, notMemberString)).toBeVisible();
      await adminSitesApi.approveSiteMembershipRequest(adminModerateLibrary1, username2);
      await favoriteLibrariesPage.page.reload({ waitUntil: 'load' });
      await expect(libraryTable.getCellByColumnNameAndRowItem(adminModerateLibrary1, consumerRole)).toBeVisible();
    });

    test('[C290110] Leave a library from Favorite Libraries', async ({ favoriteLibrariesPage }) => {
      const confirmDialog = favoriteLibrariesPage.confirmDialogComponent;
      await favoritesApi.addFavoriteById(siteString, user1Library2);
      await favoriteLibrariesPage.navigate();
      await expect(libraryTable.getCellByColumnNameAndRowItem(user1Library2, contributorRole)).toBeVisible();
      await libraryTable.performActionFromExpandableMenu(user1Library2, leaveLibraryButton);
      await confirmDialog.okButton.click();
      await expect.soft(snackBar.getByMessageLocator(leftMessage)).toBeVisible();
      await expect(libraryTable.getCellByColumnNameAndRowItem(user1Library2, notMemberString)).toBeVisible();
    });

    test('[C290108] Cancel join from Favorite Libraries', async ({ favoriteLibrariesPage }) => {
      await user2SitesApi.createSiteMembershipRequestForPerson(username2, adminModerateLibrary3);
      await favoritesApi.addFavoriteById(siteString, adminModerateLibrary3);
      await favoriteLibrariesPage.navigate();

      await expect(libraryTable.getCellByColumnNameAndRowItem(adminModerateLibrary3, notMemberString)).toBeVisible();
      await libraryTable.performActionFromExpandableMenu(adminModerateLibrary3, cancelJoinRequestButton);
      await expect.soft(snackBar.getByMessageLocator(cancelJoinRequestMessage)).toBeVisible();
      const hasJoinRequest = await user2SitesApi.hasMembershipRequest(username2, adminModerateLibrary3);
      expect(hasJoinRequest).toBe(false);
    });

    test('[C289976] Remove library from favorites from Favorite Libraries', async ({ favoriteLibrariesPage }) => {
      const myLibrariesHeader = favoriteLibrariesPage.acaHeader;
      const libraryMenu = favoriteLibrariesPage.matMenu;

      await favoriteLibrariesPage.navigate({ waitUntil: domContentLoadedString });
      await expect(libraryTable.getRowByName(user2Library3)).toBeVisible();
      await libraryTable.getRowByName(user2Library3).click();
      await myLibrariesHeader.clickMoreActions();
      await libraryMenu.clickMenuItem(removeFavoriteButton);
      await expect(libraryTable.getRowByName(user2Library3)).toBeHidden();
    });

    test('[C289991] Delete a library from Favorite Libraries', async ({ favoriteLibrariesPage, trashPage }) => {
      const myLibrariesHeader = favoriteLibrariesPage.acaHeader;
      const libraryMenu = favoriteLibrariesPage.matMenu;
      const trashTable = trashPage.dataTable;

      await favoriteLibrariesPage.navigate();
      await expect(libraryTable.getRowByName(user2Library6Delete)).toBeVisible();
      await libraryTable.getRowByName(user2Library6Delete).click();
      await myLibrariesHeader.clickMoreActions();
      await libraryMenu.clickMenuItem(deleteButton);
      await expect.soft(snackBar.getByMessageLocator(libraryDeletedMessage)).toBeVisible();
      await expect(libraryTable.getRowByName(user2Library6Delete)).toBeHidden();
      await trashPage.navigate({ waitUntil: loadString });
      await expect(trashTable.getRowByName(user2Library6Delete)).toBeVisible();
    });
  });

  test.describe('Search Page', () => {
    let libraryTable: DataTableComponent;
    let snackBar: SnackBarComponent;

    test.beforeEach(async ({ searchPage }) => {
      try {
        libraryTable = searchPage.dataTable;
        snackBar = searchPage.snackBar;
      } catch (error) {
        console.error(`Search Page, beforeEach failed : ${error}`);
      }
    });

    test('[C306959] Join a public library from Search Results', async ({ searchPage }) => {
      await searchPage.navigate({ remoteUrl: `#/search-libraries;q=${adminLibrary2}` });
      await searchPage.reload({ waitUntil: loadString });
      await expect(libraryTable.getCellByColumnNameAndRowItem(adminLibrary2, notMemberString)).toBeVisible();
      await libraryTable.performActionFromExpandableMenu(adminLibrary2, joinButton);
      await expect.soft(snackBar.getByMessageLocator(libraryJoinedMessage)).toBeVisible();
      await expect(libraryTable.getCellByColumnNameAndRowItem(adminLibrary2, consumerRole)).toBeVisible();
    });

    test('[C306960] Join a moderated library from Search Results', async ({ myLibrariesPage, searchPage }) => {
      await searchPage.navigate({ remoteUrl: `#/search-libraries;q=${adminModerateLibrary2}` });
      await expect(libraryTable.getCellByColumnNameAndRowItem(adminModerateLibrary2, notMemberString)).toBeVisible();
      await libraryTable.performActionFromExpandableMenu(adminModerateLibrary2, joinButton);
      await expect.soft(snackBar.getByMessageLocator(requestToJoinMessage)).toBeVisible();
      await expect(libraryTable.getCellByColumnNameAndRowItem(adminModerateLibrary2, notMemberString)).toBeVisible();
      await adminSitesApi.approveSiteMembershipRequest(adminModerateLibrary2, username2);
      await myLibrariesPage.navigate();
      await expect(libraryTable.getCellByColumnNameAndRowItem(adminModerateLibrary2, consumerRole)).toBeVisible();
    });

    test('[C306961] Leave a library from Search Results', async ({ searchPage }) => {
      const confirmDialog = searchPage.confirmDialogComponent;
      await searchPage.navigate({ remoteUrl: `#/search-libraries;q=${user1Library3}` });

      await expect(libraryTable.getCellByColumnNameAndRowItem(user1Library3, 'Collaborator')).toBeVisible();
      await libraryTable.performActionFromExpandableMenu(user1Library3, leaveLibraryButton);
      await confirmDialog.okButton.click();
      await expect.soft(snackBar.getByMessageLocator(leftMessage)).toBeVisible();
      await expect(libraryTable.getCellByColumnNameAndRowItem(user1Library3, notMemberString)).toBeVisible();
    });

    test('[C306962] Cancel join from Search Results', async ({ searchPage }) => {
      await user2SitesApi.createSiteMembershipRequestForPerson(username2, adminModerateLibrary4);
      await searchPage.navigate({ remoteUrl: `#/search-libraries;q=${adminModerateLibrary4}` });
      await expect(libraryTable.getCellByColumnNameAndRowItem(adminModerateLibrary4, notMemberString)).toBeVisible();
      await libraryTable.performActionFromExpandableMenu(adminModerateLibrary4, cancelJoinRequestButton);
      await expect.soft(snackBar.getByMessageLocator(cancelJoinRequestMessage)).toBeVisible();
      const hasJoinRequest = await user2SitesApi.hasMembershipRequest(username2, adminModerateLibrary4);
      expect(hasJoinRequest).toBe(false);
    });

    test('[C306963] Mark library as favorite from Search Results', async ({ myLibrariesPage, searchPage }) => {
      const myLibrariesHeader = myLibrariesPage.acaHeader;
      const libraryMenu = myLibrariesPage.matMenu;

      await myLibrariesHeader.searchButton.click();
      await searchPage.clickSearchButton();
      await searchPage.searchOverlay.searchLibrariesOption.click();
      await searchPage.searchOverlay.searchFor(adminLibrary4);

      await expect(libraryTable.getRowByName(adminLibrary4)).toBeVisible();
      await libraryTable.getRowByName(adminLibrary4).click();
      await myLibrariesHeader.clickMoreActions();
      await libraryMenu.clickMenuItem(favoriteButton);
      await myLibrariesHeader.clickMoreActions();
      expect(await libraryMenu.isMenuItemVisible(removeFavoriteButton)).toBe(true);
    });

    test('[C306964] Remove library from favorites from Search Results', async ({ searchPage }) => {
      const searchHeader = searchPage.acaHeader;
      const libraryMenu = searchPage.matMenu;

      await searchHeader.searchButton.click();
      await searchPage.clickSearchButton();
      await searchPage.searchOverlay.searchLibrariesOption.click();
      await searchPage.searchOverlay.searchFor(user2Library4);
      await expect(libraryTable.getRowByName(user2Library4)).toBeVisible();
      await searchPage.reload({ waitUntil: domContentLoadedString });
      await libraryTable.getRowByName(user2Library4).click();
      await searchPage.page.waitForTimeout(1000);
      await searchHeader.clickMoreActions();
      await libraryMenu.clickMenuItem(removeFavoriteButton);
      await searchHeader.clickMoreActions();
      expect(await libraryMenu.isMenuItemVisible(favoriteButton)).toBe(true);
    });

    test('[C306965] Delete a library from Search Results', async ({ searchPage, trashPage }) => {
      const searchHeader = searchPage.acaHeader;
      const libraryMenu = searchPage.matMenu;
      const trashTable = trashPage.dataTable;

      await searchPage.navigate({ remoteUrl: `#/search-libraries;q=${user2Library7Delete}` });
      await expect(libraryTable.getRowByName(user2Library7Delete)).toBeVisible();
      await libraryTable.getRowByName(user2Library7Delete).click();
      await searchHeader.clickMoreActions();
      await libraryMenu.clickMenuItem(deleteButton);
      await expect.soft(snackBar.getByMessageLocator(libraryDeletedMessage)).toBeVisible();
      await expect(libraryTable.getRowByName(user2Library7Delete)).toBeHidden();
      await trashPage.navigate({ waitUntil: loadString });
      await expect(trashTable.getRowByName(user2Library7Delete)).toBeVisible();
    });
  });
});
