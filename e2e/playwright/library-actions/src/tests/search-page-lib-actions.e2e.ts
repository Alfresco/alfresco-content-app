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
import { Utils, ApiClientFactory, test, SitesApi, TrashcanApi, FavoritesPageApi, SearchPage, timeouts } from '@alfresco/aca-playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('Library actions ', () => {
  test.setTimeout(timeouts.globalTest);
  const notMemberString = 'Not a member';
  const consumerRole = 'Consumer';
  const joinButton = 'Join';

  const username1 = `user1-${Utils.random()}`;
  const username2 = `user2-${Utils.random()}`;
  const adminLib5129 = `A-XAT-5129-${Utils.random()}`;
  const adminModLib5131 = `Am-XAT-5131-${Utils.random()}`;
  const user1Lib5134 = `U1-XAT-5134-${Utils.random()}`;
  const adminModLib5139 = `Am-XAT-5139-${Utils.random()}`;
  const adminLib5141 = `A-XAT-5141-${Utils.random()}`;
  const user2Lib5144 = `U2-XAT-5144-${Utils.random()}`;
  const user2Lib5147 = `U2-XAT-5147-Del-${Utils.random()}`;

  let adminLib5129Id: string;
  let adminModLib5131Id: string;
  let user1Lib5134Id: string;
  let adminModLib5139Id: string;
  let adminLib5141Id: string;
  let user2Lib5144Id: string;

  let adminSitesApi: SitesApi;
  let user1SitesApi: SitesApi;
  let user2SitesApi: SitesApi;
  let user2FavoritesApi: FavoritesPageApi;
  let user2TrashcanApi: TrashcanApi;
  let user1TrashcanApi: TrashcanApi;
  let adminTrashcanApi: TrashcanApi;

  function getRoleCellValue(page: SearchPage, libraryName: string, role: string): Locator {
    return page.dataTable.getCellByColumnNameAndRowItem(libraryName, role);
  }

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username: username1 });
      await apiClientFactory.createUser({ username: username2 });

      adminSitesApi = await SitesApi.initialize('admin');
      user1SitesApi = await SitesApi.initialize(username1, username1);
      user2SitesApi = await SitesApi.initialize(username2, username2);
      user2FavoritesApi = await FavoritesPageApi.initialize(username2, username2);
      user2TrashcanApi = await TrashcanApi.initialize(username2, username2);
      user1TrashcanApi = await TrashcanApi.initialize(username1, username1);
      adminTrashcanApi = await TrashcanApi.initialize('admin', 'admin');
    } catch (error) {
      const errorMessage = `Main beforeAll failed : ${JSON.stringify(error)}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  });

  test.beforeEach(async ({ loginPage, myLibrariesPage }) => {
    await Utils.tryLoginUser(loginPage, username2, username2, 'beforeEach failed');
    await myLibrariesPage.navigate();
  });

  test.afterAll(async () => {
    try {
      await adminTrashcanApi.emptyTrashcan();
      await user1TrashcanApi.emptyTrashcan();
      await user2TrashcanApi.emptyTrashcan();
    } catch (error) {
      const errorMessage = `Main afterAll failed : ${JSON.stringify(error)}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  });

  test.describe('[XAT-5129] Join a public library - from Search Results', () => {
    test.beforeAll(async () => {
      adminLib5129Id = (await adminSitesApi.createSite(adminLib5129)).entry.id;
    });

    test.afterAll(async () => {
      await adminSitesApi.deleteSites([adminLib5129Id]);
    });

    test('[XAT-5129] Join a public library - from Search Results', async ({ searchPage }) => {
      await searchPage.searchWithin(adminLib5129, 'libraries');
      await expect(getRoleCellValue(searchPage, adminLib5129, notMemberString)).toBeVisible();
      await searchPage.dataTable.performActionFromExpandableMenu(adminLib5129, joinButton);
      expect.soft(await searchPage.snackBar.getSnackBarMessage()).toContain('Library joined');
      await expect(getRoleCellValue(searchPage, adminLib5129, consumerRole)).toBeVisible();
    });
  });

  test.describe('[XAT-5131] Join a moderated library - from Search Results', () => {
    test.beforeAll(async () => {
      adminModLib5131Id = (await adminSitesApi.createSite(adminModLib5131, Site.VisibilityEnum.MODERATED)).entry.id;
    });

    test.afterAll(async () => {
      await adminSitesApi.deleteSites([adminModLib5131Id]);
    });

    test('[XAT-5131] Join a moderated library - from Search Results', async ({ myLibrariesPage, searchPage }) => {
      await searchPage.searchWithin(adminModLib5131, 'libraries');
      await expect(getRoleCellValue(searchPage, adminModLib5131, notMemberString)).toBeVisible();
      await searchPage.dataTable.performActionFromExpandableMenu(adminModLib5131, joinButton);
      expect.soft(await searchPage.snackBar.getSnackBarMessage()).toContain('Request sent to join this library');
      await expect(getRoleCellValue(searchPage, adminModLib5131, notMemberString)).toBeVisible();
      await adminSitesApi.approveSiteMembershipRequest(adminModLib5131Id, username2);
      await myLibrariesPage.navigate();
      await expect(myLibrariesPage.dataTable.getCellByColumnNameAndRowItem(adminModLib5131, consumerRole)).toBeVisible();
    });
  });

  test.describe('[XAT-5134] Leave a library - from Search Results', () => {
    test.beforeAll(async () => {
      user1Lib5134Id = (await user1SitesApi.createSite(user1Lib5134)).entry.id;
      await user1SitesApi.addSiteMember(user1Lib5134Id, username2, Site.RoleEnum.SiteCollaborator);
    });

    test.afterAll(async () => {
      await user1SitesApi.deleteSites([user1Lib5134Id]);
    });

    test('[XAT-5134] Leave a library - from Search Results', async ({ searchPage }) => {
      await searchPage.searchWithin(user1Lib5134, 'libraries');
      await expect(getRoleCellValue(searchPage, user1Lib5134, 'Collaborator')).toBeVisible();
      await searchPage.dataTable.performActionFromExpandableMenu(user1Lib5134, 'Leave Library');
      await searchPage.confirmDialogComponent.okButton.click();
      expect.soft(await searchPage.snackBar.getSnackBarMessage()).toContain('You have left the library');
      await expect(getRoleCellValue(searchPage, user1Lib5134, notMemberString)).toBeVisible();
    });
  });

  test.describe('[XAT-5139] Cancel join - from Search Results', () => {
    test.beforeAll(async () => {
      adminModLib5139Id = (await adminSitesApi.createSite(adminModLib5139, Site.VisibilityEnum.MODERATED)).entry.id;
      await user2SitesApi.createSiteMembershipRequestForPerson(username2, adminModLib5139Id);
    });

    test.afterAll(async () => {
      await adminSitesApi.deleteSites([adminModLib5139Id]);
    });

    test('[XAT-5139] Cancel join - from Search Results', async ({ searchPage }) => {
      await searchPage.searchWithin(adminModLib5139, 'libraries');
      await expect(getRoleCellValue(searchPage, adminModLib5139, notMemberString)).toBeVisible();
      await searchPage.dataTable.performActionFromExpandableMenu(adminModLib5139, 'Cancel Join Request');
      expect.soft(await searchPage.snackBar.getSnackBarMessage()).toContain('Canceled the request to join the library');
      expect(await user2SitesApi.hasMembershipRequest(username2, adminModLib5139Id)).toBe(false);
    });
  });

  test.describe('[XAT-5141] Mark a library as favorite - from Search Results', () => {
    test.beforeAll(async () => {
      adminLib5141Id = (await adminSitesApi.createSite(adminLib5141)).entry.id;
    });

    test.afterAll(async () => {
      await adminSitesApi.deleteSites([adminLib5141Id]);
    });

    test('[XAT-5141] Mark a library as favorite - from Search Results', async ({ searchPage }) => {
      await searchPage.searchWithin(adminLib5141, 'libraries');
      await expect(searchPage.dataTable.getRowByName(adminLib5141)).toBeVisible();
      await searchPage.dataTable.getRowByName(adminLib5141).click();
      await searchPage.acaHeader.clickMoreActions();
      await searchPage.matMenu.clickMenuItem('Favorite');
      await searchPage.acaHeader.clickMoreActions();
      expect(await searchPage.matMenu.isMenuItemVisible('Remove Favorite')).toBe(true);
    });
  });

  test.describe('[XAT-5144] Remove a library from favorites - from Search Results', () => {
    test.beforeAll(async () => {
      user2Lib5144Id = (await user2SitesApi.createSite(user2Lib5144)).entry.id;
      await user2FavoritesApi.addFavoriteById('site', user2Lib5144Id);
    });

    test.afterAll(async () => {
      await user2SitesApi.deleteSites([user2Lib5144Id]);
    });

    test('[XAT-5144] Remove a library from favorites - from Search Results', async ({ searchPage }) => {
      await searchPage.searchWithin(user2Lib5144, 'libraries');
      await expect(searchPage.dataTable.getRowByName(user2Lib5144)).toBeVisible();
      await searchPage.dataTable.getRowByName(user2Lib5144).click();

      await expect(async () => {
        await searchPage.page.reload();
        await searchPage.dataTable.getRowByName(user2Lib5144).click();
        await searchPage.acaHeader.clickMoreActions();
        await searchPage.matMenu.clickMenuItem('Remove Favorite');
        await searchPage.matMenu.getMenuRootLocator().waitFor({ state: 'detached' });
        await searchPage.acaHeader.clickMoreActions();
        expect(await searchPage.matMenu.isMenuItemVisible('Favorite')).toBe(true);
      }).toPass({
        intervals: [5_000],
        timeout: 50_000
      });
    });
  });

  test.describe('[XAT-5147] Delete a library - from Search Results', () => {
    test.beforeAll(async () => {
      await user2SitesApi.createSite(user2Lib5147);
    });

    test('[XAT-5147] Delete a library - from Search Results', async ({ searchPage, trashPage }) => {
      await searchPage.searchWithin(user2Lib5147, 'libraries');
      await expect(searchPage.dataTable.getRowByName(user2Lib5147)).toBeVisible();
      await searchPage.dataTable.getRowByName(user2Lib5147).click();
      await searchPage.acaHeader.clickMoreActions();
      await searchPage.matMenu.clickMenuItem('Delete');
      expect.soft(await searchPage.snackBar.getSnackBarMessage()).toContain('Library deleted');
      await expect(searchPage.dataTable.getRowByName(user2Lib5147)).toBeHidden();
      await trashPage.navigate({ waitUntil: 'load' });
      await expect(trashPage.dataTable.getRowByName(user2Lib5147)).toBeVisible();
    });
  });
});
