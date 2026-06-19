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
import { Utils, ApiClientFactory, test, SitesApi, TrashcanApi, MyLibrariesPage, FavoritesPageApi, timeouts } from '@alfresco/aca-playwright-shared';
import { Site } from '@alfresco/js-api';

test.describe('Library actions ', () => {
  test.setTimeout(timeouts.globalTest);
  const managerRole = 'Manager';
  const contributorRole = 'Contributor';
  const leaveLibraryButton = 'Leave Library';
  const favoriteButton = 'Favorite';
  const removeFavoriteButton = 'Remove Favorite';

  const username1 = `user1-${Utils.random()}`;
  const username2 = `user2-${Utils.random()}`;
  const adminLib5140 = `A-XAT-5140-${Utils.random()}`;
  const user1Lib5132 = `U1-XAT-5132-${Utils.random()}`;
  const user1Lib5136 = `U1-XAT-5136-${Utils.random()}`;
  const user2Lib5137 = `U2-XAT-5137-${Utils.random()}`;
  const user2Lib5142 = `U2-XAT-5142-${Utils.random()}`;
  const user2Lib5145 = `U2-XAT-5145-Del-${Utils.random()}`;

  let adminLib5140Id: string;
  let user1Lib5132Id: string;
  let user1Lib5136Id: string;
  let user2Lib5137Id: string;
  let user2Lib5142Id: string;

  let adminSitesApi: SitesApi;
  let user1SitesApi: SitesApi;
  let user2SitesApi: SitesApi;
  let user2FavoritesApi: FavoritesPageApi;
  let user2TrashcanApi: TrashcanApi;
  let user1TrashcanApi: TrashcanApi;
  let adminTrashcanApi: TrashcanApi;

  function getRoleCellValue(page: MyLibrariesPage, libraryName: string, role = managerRole): Locator {
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
      const errorMessage = `Main beforeAll failed : ${String(error)}`;
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

  test.describe('[XAT-5132] Leave a library - from My Libraries', () => {
    const leftMessage = 'You have left the library';

    test.beforeAll(async () => {
      user1Lib5132Id = (await user1SitesApi.createSite(user1Lib5132)).entry.id;
      await user1SitesApi.addSiteMember(user1Lib5132Id, username2, Site.RoleEnum.SiteManager);
    });

    test.afterAll(async () => {
      await user1SitesApi.deleteSites([user1Lib5132Id]);
    });

    test('[XAT-5132] Leave a library - from My Libraries', async ({ myLibrariesPage }) => {
      await expect(getRoleCellValue(myLibrariesPage, user1Lib5132, managerRole)).toBeVisible();
      await myLibrariesPage.dataTable.performActionFromExpandableMenu(user1Lib5132, leaveLibraryButton);
      await expect(myLibrariesPage.confirmDialogComponent.getDialogTitle('Leave this library?')).toBeVisible();
      await expect(myLibrariesPage.confirmDialogComponent.getDialogContent('Leaving will remove your access.')).toBeVisible();
      await expect(myLibrariesPage.confirmDialogComponent.okButton).toBeVisible();
      await expect(myLibrariesPage.confirmDialogComponent.cancelButton).toBeVisible();
      await myLibrariesPage.confirmDialogComponent.okButton.click();
      expect(await myLibrariesPage.snackBar.getSnackBarMessage()).toContain(leftMessage);
      await expect(myLibrariesPage.dataTable.getRowByName(user1Lib5132)).toBeHidden();
    });
  });

  test.describe('[XAT-5136] Cancel Leave Library', () => {
    test.beforeAll(async () => {
      user1Lib5136Id = (await user1SitesApi.createSite(user1Lib5136)).entry.id;
      await user1SitesApi.addSiteMember(user1Lib5136Id, username2, Site.RoleEnum.SiteManager);
    });

    test.afterAll(async () => {
      await user1SitesApi.deleteSites([user1Lib5136Id]);
    });

    test('[XAT-5136] Cancel Leave Library', async ({ myLibrariesPage }) => {
      await expect(getRoleCellValue(myLibrariesPage, user1Lib5136, managerRole)).toBeVisible();
      await myLibrariesPage.dataTable.performActionFromExpandableMenu(user1Lib5136, leaveLibraryButton);
      await myLibrariesPage.confirmDialogComponent.cancelButton.click();
      await expect(getRoleCellValue(myLibrariesPage, user1Lib5136, managerRole)).toBeVisible();
    });
  });

  test.describe('[XAT-5137] Leave a library - failure notification', () => {
    test.beforeAll(async () => {
      user2Lib5137Id = (await user2SitesApi.createSite(user2Lib5137)).entry.id;
    });

    test.afterAll(async () => {
      await user2SitesApi.deleteSites([user2Lib5137Id]);
    });

    test('[XAT-5137] Leave a library - failure notification', async ({ myLibrariesPage }) => {
      await expect(getRoleCellValue(myLibrariesPage, user2Lib5137, managerRole)).toBeVisible();
      await myLibrariesPage.dataTable.performActionFromExpandableMenu(user2Lib5137, leaveLibraryButton);
      await myLibrariesPage.confirmDialogComponent.okButton.click();
      expect(await myLibrariesPage.snackBar.getSnackBarMessage()).toContain('Cannot leave this library');
      await expect(getRoleCellValue(myLibrariesPage, user2Lib5137, managerRole)).toBeVisible();
    });
  });

  test.describe('[XAT-5140] Mark a library as favorite - from My Libraries', () => {
    test.beforeAll(async () => {
      adminLib5140Id = (await adminSitesApi.createSite(adminLib5140)).entry.id;
      await adminSitesApi.addSiteMember(adminLib5140Id, username2, Site.RoleEnum.SiteContributor);
    });

    test.afterAll(async () => {
      await adminSitesApi.deleteSites([adminLib5140Id]);
    });

    test('[XAT-5140] Mark a library as favorite - from My Libraries', async ({ myLibrariesPage }) => {
      await expect(getRoleCellValue(myLibrariesPage, adminLib5140, contributorRole)).toBeVisible();
      await getRoleCellValue(myLibrariesPage, adminLib5140, contributorRole).click();
      await myLibrariesPage.acaHeader.clickMoreActions();
      await myLibrariesPage.matMenu.clickMenuItem(favoriteButton);
      await myLibrariesPage.acaHeader.clickMoreActions();
      expect(await myLibrariesPage.matMenu.isMenuItemVisible(removeFavoriteButton)).toBe(true);
    });
  });

  test.describe('[XAT-5142] Remove a library from favorites - from My Libraries', () => {
    test.beforeAll(async () => {
      user2Lib5142Id = (await user2SitesApi.createSite(user2Lib5142)).entry.id;
      await user2FavoritesApi.addFavoriteById('site', user2Lib5142Id);
    });

    test.afterAll(async () => {
      await user2SitesApi.deleteSites([user2Lib5142Id]);
    });

    test('[XAT-5142] Remove a library from favorites - from My Libraries', async ({ myLibrariesPage }) => {
      await expect(getRoleCellValue(myLibrariesPage, user2Lib5142, managerRole)).toBeVisible();

      await expect(async () => {
        await myLibrariesPage.page.reload();
        await getRoleCellValue(myLibrariesPage, user2Lib5142, managerRole).click();
        await myLibrariesPage.acaHeader.clickMoreActions();
        expect(await myLibrariesPage.matMenu.isMenuItemVisible(removeFavoriteButton)).toBe(true);
      }).toPass({
        intervals: [4_000],
        timeout: 40_000
      });

      await myLibrariesPage.matMenu.clickMenuItem(removeFavoriteButton);
      await myLibrariesPage.acaHeader.clickMoreActions();
      expect(await myLibrariesPage.matMenu.isMenuItemVisible(favoriteButton)).toBe(true);
    });
  });

  test.describe('[XAT-5145] Delete a library - from My Libraries', () => {
    let user2Lib5145Id: string;

    test.beforeAll(async () => {
      user2Lib5145Id = (await user2SitesApi.createSite(user2Lib5145)).entry.id;
    });

    test.afterAll(async () => {
      await user2SitesApi.deleteSites([user2Lib5145Id]);
    });
    test('[XAT-5145] Delete a library - from My Libraries', async ({ myLibrariesPage, trashPage }) => {
      await expect(getRoleCellValue(myLibrariesPage, user2Lib5145, managerRole)).toBeVisible();
      await getRoleCellValue(myLibrariesPage, user2Lib5145, managerRole).click();
      await myLibrariesPage.acaHeader.clickMoreActions();
      await myLibrariesPage.matMenu.clickMenuItem('Delete');
      expect(await myLibrariesPage.snackBar.getSnackBarMessage()).toContain('Library deleted');
      await expect(getRoleCellValue(myLibrariesPage, user2Lib5145, managerRole)).toBeHidden();
      await trashPage.navigate({ waitUntil: 'load' });
      await expect(trashPage.dataTable.getRowByName(user2Lib5145)).toBeVisible();
    });
  });
});
