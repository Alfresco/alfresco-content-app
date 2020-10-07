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

import { browser } from 'protractor';
import { APP_ROUTES, SIDEBAR_LABELS, LoginPage, BrowsingPage, SearchResultsPage, Utils } from '@alfresco/aca-testing-shared';

describe('Sidebar', () => {
  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { sidenav, header } = page;
  const searchResultsPage = new SearchResultsPage();
  const { searchInput } = searchResultsPage.header;

  beforeAll(async (done) => {
    await loginPage.loginWithAdmin();
    done();
  });

  beforeEach(async (done) => {
    await Utils.pressEscape();
    await header.expandSideNav();
    done();
  });

  it('[C217149] has "Personal Files" as default', async () => {
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    expect(await sidenav.isActive(SIDEBAR_LABELS.PERSONAL_FILES)).toBe(true, 'Default active link');
  });

  it('[C217150] File Libraries has correct sub-categories', async () => {
    await page.clickFileLibraries();
    expect(await sidenav.isFileLibrariesMenuExpanded()).toBe(true, 'File Libraries not expanded');
    expect(await sidenav.getLink(SIDEBAR_LABELS.MY_LIBRARIES).isPresent()).toBe(true, 'My Libraries link not present');
    expect(await sidenav.getLink(SIDEBAR_LABELS.FAVORITE_LIBRARIES).isPresent()).toBe(true, 'Favorite Libraries link not present');
  });

  it('[C289900] Favorite Libraries is automatically selected on expanding File Libraries', async () => {
    await sidenav.expandFileLibraries();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.FAVORITE_LIBRARIES);
    expect(await sidenav.isActive(SIDEBAR_LABELS.FILE_LIBRARIES)).toBe(true, 'File Libraries is not active');
    expect(await sidenav.isActive(SIDEBAR_LABELS.FAVORITE_LIBRARIES)).toBe(true, 'Favorite Libraries link not active');
  });

  it('[C289902] navigate to Favorite Libraries', async () => {
    await page.goToFavoriteLibraries();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.FAVORITE_LIBRARIES);
    expect(await sidenav.isActive(SIDEBAR_LABELS.FILE_LIBRARIES)).toBe(true, 'File Libraries link is not active');
    expect(await sidenav.isActive(SIDEBAR_LABELS.FAVORITE_LIBRARIES)).toBe(true, 'Favorite Libraries link not active');
  });

  it('[C289901] navigate to My Libraries', async () => {
    await page.goToMyLibraries();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.MY_LIBRARIES);
    expect(await sidenav.isActive(SIDEBAR_LABELS.FILE_LIBRARIES)).toBe(true, 'File Libraries link is not active');
    expect(await sidenav.isActive(SIDEBAR_LABELS.MY_LIBRARIES)).toBe(true, 'My Libraries link not active');
  });

  it('[C213110] navigates to "Shared Files"', async () => {
    await page.clickSharedFiles();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.SHARED_FILES);
    expect(await sidenav.isActive(SIDEBAR_LABELS.SHARED_FILES)).toBe(true, 'Shared Files link not active');
  });

  it('[C213166] navigates to "Recent Files"', async () => {
    await page.clickRecentFiles();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.RECENT_FILES);
    expect(await sidenav.isActive(SIDEBAR_LABELS.RECENT_FILES)).toBe(true, 'Recent Files link not active');
  });

  it('[C213225] navigates to "Favorites"', async () => {
    await page.clickFavorites();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.FAVORITES);
    expect(await sidenav.isActive(SIDEBAR_LABELS.FAVORITES)).toBe(true, 'Favorites link not active');
  });

  it('[C213216] navigates to "Trash"', async () => {
    await page.clickTrash();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.TRASHCAN);
    expect(await sidenav.isActive(SIDEBAR_LABELS.TRASH)).toBe(true, 'Trash link not active');
  });

  it('[C280409] navigates to "Personal Files"', async () => {
    await page.clickPersonalFiles();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    expect(await sidenav.isActive(SIDEBAR_LABELS.PERSONAL_FILES)).toBe(true, 'Personal Files link not active');
  });

  it('[C217151] Personal Files tooltip', async () => {
    await page.clickPersonalFiles();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.PERSONAL_FILES)).toContain('View your Personal Files');

    await header.collapseSideNav();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.PERSONAL_FILES)).toContain('View your Personal Files');
  });

  it('[C213111] Shared Files tooltip', async () => {
    await page.clickSharedFiles();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.SHARED_FILES)).toContain('View files that have been shared');

    await header.collapseSideNav();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.SHARED_FILES)).toContain('View files that have been shared');
  });

  it('[C213167] Recent Files tooltip', async () => {
    await page.clickRecentFiles();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.RECENT_FILES)).toContain('View files you recently edited');

    await header.collapseSideNav();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.RECENT_FILES)).toContain('View files you recently edited');
  });

  it('[C217153] Favorites tooltip', async () => {
    await page.clickFavorites();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.FAVORITES)).toContain('View your favorite files and folders');

    await header.collapseSideNav();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.FAVORITES)).toContain('View your favorite files and folders');
  });

  it('[C217154] Trash tooltip', async () => {
    await page.clickTrash();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.TRASH)).toContain('View deleted files in the trash');

    await header.collapseSideNav();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.TRASH)).toContain('View deleted files in the trash');
  });

  it('[C217152] File Libraries tooltip', async () => {
    await page.clickFileLibraries();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.FILE_LIBRARIES)).toContain('File Libraries');

    await header.collapseSideNav();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.FILE_LIBRARIES)).toContain('File Libraries');
  });

  it('[C289916] My Libraries tooltip', async () => {
    await page.goToMyLibraries();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.MY_LIBRARIES)).toContain('Access my libraries');

    await header.collapseSideNav();
    await sidenav.clickLink(SIDEBAR_LABELS.FILE_LIBRARIES);
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.MY_LIBRARIES)).toContain('Access my libraries');
  });

  it('[C289917] Favorite Libraries tooltip', async () => {
    await page.goToFavoriteLibraries();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.FAVORITE_LIBRARIES)).toContain('Access my favorite libraries');

    await header.collapseSideNav();
    await sidenav.clickLink(SIDEBAR_LABELS.FILE_LIBRARIES);
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.FAVORITE_LIBRARIES)).toContain('Access my favorite libraries');
  });

  it('[C269095] default state is expanded', async () => {
    expect(await header.isSidenavExpanded()).toBe(true, 'Sidebar not expanded');
  });

  it('[C269096] sidebar toggle', async () => {
    await header.collapseSideNav();
    expect(await header.isSidenavExpanded()).toBe(false, 'Sidebar not collapsed');

    await header.expandSideNav();
    expect(await header.isSidenavExpanded()).toBe(true, 'Sidebar not expanded');
  });

  it('[C269100] sidebar state is preserved on page refresh', async () => {
    expect(await header.isSidenavExpanded()).toBe(true, 'Sidebar not expanded');
    await page.refresh();
    expect(await header.isSidenavExpanded()).toBe(true, 'Sidebar not expanded');

    await header.collapseSideNav();
    expect(await header.isSidenavExpanded()).toBe(false, 'Sidebar not collapsed');
    await page.refresh();
    expect(await header.isSidenavExpanded()).toBe(false, 'Sidebar not collapsed');
  });

  it('[C269102] sidebar state is preserved after logout / login', async () => {
    await header.collapseSideNav();
    await page.signOut();
    await loginPage.loginWithAdmin();

    expect(await header.isSidenavExpanded()).toBe(false, 'Sidebar not collapsed');
  });

  it('[C277223] sidebar is collapsed automatically when Search Results opens', async () => {
    await searchInput.clickSearchButton();
    /* cspell:disable-next-line */
    await searchInput.searchFor('qwertyuiop');
    await searchResultsPage.waitForResults();

    expect(await header.isSidenavExpanded()).toBe(false, 'Sidebar not collapsed');
  });

  it('[C277224] sidenav returns to the default state when navigating away from the Search Results page', async () => {
    await searchInput.clickSearchButton();
    /* cspell:disable-next-line */
    await searchInput.searchFor('qwertyuiop');
    await searchResultsPage.waitForResults();
    await page.clickFavorites();

    expect(await header.isSidenavExpanded()).toBe(true, 'Sidebar not expanded');
  });

  it('[C277230] sidenav can be expanded when search results page is displayed', async () => {
    await searchInput.clickSearchButton();
    /* cspell:disable-next-line */
    await searchInput.searchFor('qwertyuiop');
    await searchResultsPage.waitForResults();
    await header.expandSideNav();

    expect(await header.isSidenavExpanded()).toBe(true, 'Sidebar not expanded');
  });
});
