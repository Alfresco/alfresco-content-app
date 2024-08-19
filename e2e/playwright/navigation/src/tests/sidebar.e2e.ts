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
import { ApiClientFactory, APP_ROUTES, SIDEBAR_LABELS, test, Utils } from '@alfresco/playwright-shared';

test.describe('Sidebar', () => {
  const username = `user-${Utils.random()}`;

  test.beforeAll(async () => {
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test('[C289901] navigate to My Libraries', async ({ personalFiles, myLibrariesPage }) => {
    await personalFiles.navigate();
    await personalFiles.sidenav.openPanel(SIDEBAR_LABELS.MY_LIBRARIES);
    await personalFiles.dataTable.spinnerWaitForReload();
    expect(myLibrariesPage.page.url()).toContain(APP_ROUTES.MY_LIBRARIES);
    expect(await myLibrariesPage.sidenav.isActive(SIDEBAR_LABELS.MY_LIBRARIES), 'My Libraries link not active').toBe(true);
  });

  test('[C277230] sidenav can be expanded when search results page is displayed', async ({ personalFiles }) => {
    await personalFiles.navigate({ remoteUrl: `#/search;q=test` });
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar expanded').toBe(false);
    await personalFiles.sidenav.expandSideNav();
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar not expanded').toBe(true);
  });

  test('[C269100] sidebar state is preserved on page refresh', async ({ personalFiles }) => {
    await personalFiles.navigate();
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar not expanded').toBe(true);
    await personalFiles.reload();
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar not expanded').toBe(true);

    await personalFiles.sidenav.collapseSideNav();

    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar expanded').toBe(false);
    await personalFiles.reload();
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar expanded').toBe(false);
  });

  test('[C269096] sidebar toggle', async ({ personalFiles }) => {
    await personalFiles.navigate();
    await personalFiles.sidenav.collapseSideNav();
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar expanded').toBe(false);
    await personalFiles.sidenav.expandSideNav();
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar not expanded').toBe(true);
  });

  test('[C277224] sidenav returns to the default state when navigating away from the Search Results page', async ({ personalFiles, searchPage }) => {
    await personalFiles.navigate({ remoteUrl: `#/search;q=test` });
    await searchPage.searchInput.searchCloseButton.click();
    await searchPage.sidenav.expandedSidenav.waitFor({ state: 'attached' });
    expect(await personalFiles.sidenav.isSidenavExpanded(), 'Sidebar not expanded').toBe(true);
  });
});
