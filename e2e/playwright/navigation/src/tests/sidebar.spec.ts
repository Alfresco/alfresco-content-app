/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ApiClientFactory, APP_ROUTES, getUserState, SIDEBAR_LABELS, test } from '@alfresco/playwright-shared';

test.use({ storageState: getUserState('hruser') });
test.describe('Sidebar', () => {
  const apiClientFactory = new ApiClientFactory();

  test.beforeAll(async () => {
    await apiClientFactory.setUpAcaBackend('hruser');
  });

  test('[C289902] navigate to Favorite Libraries', async ({ personalFiles, favoritePage }) => {
    await personalFiles.navigate();
    await personalFiles.sidenav.openPanel('Favorite Libraries');
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(favoritePage.page.url()).toContain(APP_ROUTES.FAVORITE_LIBRARIES);
    expect(await favoritePage.sidenav.isActive(SIDEBAR_LABELS.FAVORITE_LIBRARIES), 'Favorite Libraries link not active').toBe(true);
  });

  test('[C289901] navigate to My Libraries', async ({ personalFiles, myLibrariesPage }) => {
    await personalFiles.navigate();
    await personalFiles.sidenav.openPanel('My Libraries');
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(myLibrariesPage.page.url()).toContain(APP_ROUTES.MY_LIBRARIES);
    expect(await myLibrariesPage.sidenav.isActive(SIDEBAR_LABELS.MY_LIBRARIES), 'My Libraries link not active').toBe(true);
  });

  test('[C213110] navigates to "Shared Files"', async ({ personalFiles, sharedPage }) => {
    await personalFiles.navigate();
    await personalFiles.sidenav.openPanel('Shared');
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(sharedPage.page.url()).toContain(APP_ROUTES.SHARED_FILES);
    expect(await sharedPage.sidenav.isActive(SIDEBAR_LABELS.SHARED_FILES), 'Shared Files link not active').toBe(true);
  });

  test('[C213166] navigates to "Recent Files"', async ({ personalFiles, recentFilesPage }) => {
    await personalFiles.navigate();
    await personalFiles.sidenav.openPanel('Recent Files');
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(recentFilesPage.page.url()).toContain(APP_ROUTES.RECENT_FILES);
    expect(await recentFilesPage.sidenav.isActive(SIDEBAR_LABELS.RECENT_FILES), 'Recent Files link not active').toBe(true);
  });

  test('[C213225] navigates to "Favorites"', async ({ personalFiles, favoritePage }) => {
    await personalFiles.navigate();
    await personalFiles.sidenav.openPanel('Favorites');
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(favoritePage.page.url()).toContain(APP_ROUTES.FAVORITES);
    expect(await favoritePage.sidenav.isActive(SIDEBAR_LABELS.FAVORITES), 'Favorites link not active').toBe(true);
  });

  test('[C213216] navigates to "Trash"', async ({ personalFiles, trashPage }) => {
    await personalFiles.navigate();
    await personalFiles.sidenav.openPanel('Trash');
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(trashPage.page.url()).toContain(APP_ROUTES.TRASHCAN);
    expect(await trashPage.sidenav.isActive(SIDEBAR_LABELS.TRASH), 'Trash link not active').toBe(true);
  });

  test('[C280409] navigates to "Personal Files"', async ({ personalFiles, trashPage }) => {
    await trashPage.navigate();
    await personalFiles.sidenav.openPanel('Personal Files');
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(personalFiles.page.url()).toContain(APP_ROUTES.PERSONAL_FILES);
    expect(await personalFiles.sidenav.isActive(SIDEBAR_LABELS.PERSONAL_FILES), 'Personal Files link not active').toBe(true);
  });

  test('[C277230] sidenav can be expanded when search results page is displayed', async ({ personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/search;q=test` });
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar expanded').toBe(false);
    await personalFiles.sidenav.expandSideNav();
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar not expanded').toBe(true);
  });

  test('[C269100] sidebar state is preserved on page refresh', async ({ personalFiles }) => {
    await personalFiles.navigate();
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar expanded').toBe(true);
    await personalFiles.reload();
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar expanded').toBe(true);

    await personalFiles.sidenav.collapseSideNav();

    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar not expanded').toBe(false);
    await personalFiles.reload();
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar not expanded').toBe(false);
  });

  test('[C269096] sidebar toggle', async ({ personalFiles }) => {
    await personalFiles.navigate();
    await personalFiles.sidenav.collapseSideNav();
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar not expanded').toBe(false);
    await personalFiles.sidenav.expandSideNav();
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar not expanded').toBe(true);
  });

  test('[C277224] sidenav returns to the default state when navigating away from the Search Results page', async ({ personalFiles, searchPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/search;q=test` });
    await searchPage.searchInput.getIconByName('close').click();
    await searchPage.sidenav.expandedSidenav.waitFor({ state: 'attached' });
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar not expanded').toBe(true);
  });
});
