/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { expect, Locator } from '@playwright/test';
import {
  Utils,
  ApiClientFactory,
  test,
  SitesApi,
  TrashcanApi,
  FavoritesPageApi,
  FavoritesLibrariesPage,
  timeouts
} from '@alfresco/aca-playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('Library actions ', () => {
  test.setTimeout(timeouts.globalTest);
  const notMemberString = 'Not a member';
  const consumerRole = 'Consumer';
  const joinButton = 'Join';

  const username2 = `user2-${Utils.random()}`;
  const adminLib5128 = `A-XAT-5128-${Utils.random()}`;
  const adminModLib5130 = `Am-XAT-5130-${Utils.random()}`;
  const adminLib5133 = `A-XAT-5133-${Utils.random()}`;
  const adminModLib5138 = `Am-XAT-5138-${Utils.random()}`;
  const user2Lib5143 = `U2-XAT-5143-${Utils.random()}`;
  const user2Lib5146 = `U2-XAT-5146-Del-${Utils.random()}`;

  let adminLib5128Id: string;
  let adminModLib5130Id: string;
  let adminLib5133Id: string;
  let adminModLib5138Id: string;
  let user2Lib5143Id: string;
  let user2Lib5146Id: string;

  let adminSitesApi: SitesApi;
  let user2SitesApi: SitesApi;
  let user2FavoritesApi: FavoritesPageApi;
  let user2TrashcanApi: TrashcanApi;

  function getRoleCellValue(page: FavoritesLibrariesPage, libraryName: string, role: string): Locator {
    return page.dataTable.getCellByColumnNameAndRowItem(libraryName, role);
  }

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username: username2 });

      adminSitesApi = await SitesApi.initialize('admin');
      user2SitesApi = await SitesApi.initialize(username2, username2);
      user2FavoritesApi = await FavoritesPageApi.initialize(username2, username2);
      user2TrashcanApi = await TrashcanApi.initialize(username2, username2);
    } catch (error) {
      const favoriteLibrariesActionsBeforeAllErrorMessage = `Favorite libraries actions beforeAll failed : ${String(error)}`;
      console.error(favoriteLibrariesActionsBeforeAllErrorMessage);
      throw new Error(favoriteLibrariesActionsBeforeAllErrorMessage);
    }
  });

  test.beforeEach(async ({ loginPage, favoriteLibrariesPage }) => {
    await Utils.tryLoginUser(loginPage, username2, username2, 'Favorite libraries actions beforeEach failed');
    await favoriteLibrariesPage.navigate();
  });

  test.afterAll(async () => {
    try {
      await user2TrashcanApi.emptyTrashcan();
    } catch (error) {
      const favoriteLibrariesActionsAfterAllErrorMessage = `Favorite libraries actions afterAll failed : ${String(error)}`;
      console.error(favoriteLibrariesActionsAfterAllErrorMessage);
      throw new Error(favoriteLibrariesActionsAfterAllErrorMessage);
    }
  });

  test.describe('[XAT-5128] Join a public library - from Favorite Libraries', () => {
    test.beforeAll(async () => {
      adminLib5128Id = (await adminSitesApi.createSite(adminLib5128)).entry.id;
      await user2FavoritesApi.addFavoriteById('site', adminLib5128Id);
    });

    test.afterAll(async () => {
      await adminSitesApi.deleteSites([adminLib5128Id]);
    });

    test('[XAT-5128] Join a public library - from Favorite Libraries', async ({ favoriteLibrariesPage }) => {
      await favoriteLibrariesPage.dataTable.performActionFromExpandableMenu(adminLib5128, joinButton);
      expect.soft(await favoriteLibrariesPage.snackBar.getSnackBarMessage()).toContain('Library joined');
      await expect(getRoleCellValue(favoriteLibrariesPage, adminLib5128, consumerRole)).toBeVisible();
    });
  });

  test.describe('[XAT-5130] Join a moderated library - from Favorite Libraries', () => {
    test.beforeAll(async () => {
      adminModLib5130Id = (await adminSitesApi.createSite(adminModLib5130, Site.VisibilityEnum.MODERATED)).entry.id;
      await user2FavoritesApi.addFavoriteById('site', adminModLib5130Id);
    });

    test.afterAll(async () => {
      await adminSitesApi.deleteSites([adminModLib5130Id]);
    });

    test('[XAT-5130] Join a moderated library - from Favorite Libraries', async ({ favoriteLibrariesPage }) => {
      await expect(getRoleCellValue(favoriteLibrariesPage, adminModLib5130, notMemberString)).toBeVisible();
      await favoriteLibrariesPage.dataTable.performActionFromExpandableMenu(adminModLib5130, joinButton);
      expect.soft(await favoriteLibrariesPage.snackBar.getSnackBarMessage()).toContain('Request sent to join this library');
      await expect(getRoleCellValue(favoriteLibrariesPage, adminModLib5130, notMemberString)).toBeVisible();
      await adminSitesApi.approveSiteMembershipRequest(adminModLib5130Id, username2);
      await favoriteLibrariesPage.page.reload({ waitUntil: 'load' });
      await expect(getRoleCellValue(favoriteLibrariesPage, adminModLib5130, consumerRole)).toBeVisible();
    });
  });

  test.describe('[XAT-5133] Leave a library - from Favorite Libraries', () => {
    test.beforeAll(async () => {
      adminLib5133Id = (await adminSitesApi.createSite(adminLib5133)).entry.id;
      await adminSitesApi.addSiteMember(adminLib5133Id, username2, Site.RoleEnum.SiteContributor);
      await user2FavoritesApi.addFavoriteById('site', adminLib5133Id);
    });

    test.afterAll(async () => {
      await adminSitesApi.deleteSites([adminLib5133Id]);
    });

    test('[XAT-5133] Leave a library - from Favorite Libraries', async ({ favoriteLibrariesPage }) => {
      await expect(getRoleCellValue(favoriteLibrariesPage, adminLib5133, 'Contributor')).toBeVisible();
      await favoriteLibrariesPage.dataTable.performActionFromExpandableMenu(adminLib5133, 'Leave Library');
      await favoriteLibrariesPage.confirmDialogComponent.okButton.click();
      expect.soft(await favoriteLibrariesPage.snackBar.getSnackBarMessage()).toContain('You have left the library');
      await expect(getRoleCellValue(favoriteLibrariesPage, adminLib5133, notMemberString)).toBeVisible();
    });
  });

  test.describe('[XAT-5138] Cancel join - from Favorite Libraries', () => {
    test.beforeAll(async () => {
      adminModLib5138Id = (await adminSitesApi.createSite(adminModLib5138, Site.VisibilityEnum.MODERATED)).entry.id;
      await user2SitesApi.createSiteMembershipRequestForPerson(username2, adminModLib5138Id);
      await user2FavoritesApi.addFavoriteById('site', adminModLib5138Id);
    });

    test.afterAll(async () => {
      await adminSitesApi.deleteSites([adminModLib5138Id]);
    });

    test('[XAT-5138] Cancel join - from Favorite Libraries', async ({ favoriteLibrariesPage }) => {
      await expect(getRoleCellValue(favoriteLibrariesPage, adminModLib5138, notMemberString)).toBeVisible();
      await favoriteLibrariesPage.dataTable.performActionFromExpandableMenu(adminModLib5138, 'Cancel Join Request');
      expect.soft(await favoriteLibrariesPage.snackBar.getSnackBarMessage()).toContain('Canceled the request to join the library');
      const hasJoinRequest = await user2SitesApi.hasMembershipRequest(username2, adminModLib5138Id);
      expect(hasJoinRequest).toBe(false);
    });
  });

  test.describe('[XAT-5143] Remove a library from favorites - from Favorite Libraries', () => {
    test.beforeAll(async () => {
      user2Lib5143Id = (await user2SitesApi.createSite(user2Lib5143)).entry.id;
      await user2FavoritesApi.addFavoriteById('site', user2Lib5143Id);
    });

    test.afterAll(async () => {
      await user2SitesApi.deleteSites([user2Lib5143Id]);
    });

    test('[XAT-5143] Remove a library from favorites - from Favorite Libraries', async ({ favoriteLibrariesPage }) => {
      await expect(favoriteLibrariesPage.dataTable.getRowByName(user2Lib5143)).toBeVisible();
      await favoriteLibrariesPage.dataTable.getRowByName(user2Lib5143).click();
      await favoriteLibrariesPage.acaHeader.clickMoreActions();
      await favoriteLibrariesPage.matMenu.clickMenuItem('Remove Favorite');
      await expect(favoriteLibrariesPage.dataTable.getRowByName(user2Lib5143)).toBeHidden();
    });
  });

  test.describe('[XAT-5146] Delete a library - from Favorite Libraries', () => {
    test.beforeAll(async () => {
      user2Lib5146Id = (await user2SitesApi.createSite(user2Lib5146)).entry.id;
      await user2FavoritesApi.addFavoriteById('site', user2Lib5146Id);
    });

    test('[XAT-5146] Delete a library - from Favorite Libraries', async ({ favoriteLibrariesPage, trashPage }) => {
      await expect(favoriteLibrariesPage.dataTable.getRowByName(user2Lib5146)).toBeVisible();
      await favoriteLibrariesPage.dataTable.getRowByName(user2Lib5146).click();
      await favoriteLibrariesPage.acaHeader.clickMoreActions();
      await favoriteLibrariesPage.matMenu.clickMenuItem('Delete');
      expect.soft(await favoriteLibrariesPage.snackBar.getSnackBarMessage()).toContain('Library deleted');
      await expect(favoriteLibrariesPage.dataTable.getRowByName(user2Lib5146)).toBeHidden();
      await trashPage.navigate({ waitUntil: 'load' });
      await expect(trashPage.dataTable.getRowByName(user2Lib5146)).toBeVisible();
    });
  });
});
