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

import { CyUtils } from '../../utils/cy-utils';
import { CyLoginPage, CyBrowsingPage, CySearchResultsPage } from '../../pages';
import { APP_ROUTES, SIDEBAR_LABELS } from '../../utils/cy-configs';

describe.only('Sidebar', () => {
//   const username = `user-${CyUtils.random()}`;
  const loginPage = new CyLoginPage();
  const page = new CyBrowsingPage();
//   const searchResultsPage = new CySearchResultsPage();
//   const { dataTable, pagination } = page;
//   const adminApiActions = new CyAdminActions();

  before(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      loginPage.loginWithAdmin();
  });

  beforeEach(() => {
      CyUtils.pressEscape();
      page.header.expandSidenav();
  });

  it('[C217149] has "Personal Files" as default', () => {
    page.checkUrlContains(APP_ROUTES.PERSONAL_FILES);
    page.sidenav.isActive('Personal Files').should('be.true');
  });

  it('[C217150] File Libraries has correct sub-categories', () => {
    page.clickFileLibraries();
    page.isFileLibrariesMenuExpanded().should('be.true');
    page.sidenav.getLink(SIDEBAR_LABELS.MY_LIBRARIES).should('be.visible');
    page.sidenav.getLink(SIDEBAR_LABELS.FAVORITE_LIBRARIES).should('be.visible');
  });

  it('[C289900] Favorite Libraries is automatically selected on expanding File Libraries', () => {
      page.sidenav.expandFileLibraries();
      page.checkUrlContains(APP_ROUTES.FAVORITE_LIBRARIES);
      page.sidenav.isActive(SIDEBAR_LABELS.FILE_LIBRARIES).should('be.true');
      page.sidenav.isActive(SIDEBAR_LABELS.FAVORITE_LIBRARIES).should('be.true');
  });

  it('[C289902] navigate to Favorite Libraries', () => {
      page.goToFavoriteLibraries();
      page.checkUrlContains(APP_ROUTES.FAVORITE_LIBRARIES);
      page.sidenav.isActive(SIDEBAR_LABELS.FILE_LIBRARIES).should('be.true');
      page.sidenav.isActive(SIDEBAR_LABELS.FAVORITE_LIBRARIES).should('be.true');
  });

  it('[C289901] navigate to My Libraries', () => {
      page.goToMyLibraries();
      page.checkUrlContains(APP_ROUTES.MY_LIBRARIES);
      page.sidenav.isActive(SIDEBAR_LABELS.FILE_LIBRARIES).should('be.true');
      page.sidenav.isActive(SIDEBAR_LABELS.MY_LIBRARIES).should('be.true');
  });

  it('[C213110] navigates to "Shared Files"', () => {
      page.clickSharedFiles();
      page.checkUrlContains(APP_ROUTES.SHARED_FILES);
      page.sidenav.isActive(SIDEBAR_LABELS.SHARED_FILES).should('be.true');
  });

  it('[C213166] navigates to "Recent Files"', () => {
      page.clickRecentFiles();
      page.checkUrlContains(APP_ROUTES.RECENT_FILES);
      page.sidenav.isActive(SIDEBAR_LABELS.RECENT_FILES).should('be.true');
  });

  it('[C213225] navigates to "Favorites"', () => {
      page.clickFavorites();
      page.checkUrlContains(APP_ROUTES.FAVORITES);
      page.sidenav.isActive(SIDEBAR_LABELS.FAVORITES).should('be.true');
  });

  it('[C213216] navigates to "Trash"', () => {
      page.clickTrash();
      page.checkUrlContains(APP_ROUTES.TRASHCAN);
      page.sidenav.isActive(SIDEBAR_LABELS.TRASH).should('be.true');
  });

  it('[C280409] navigates to "Personal Files"', () => {
    page.clickPersonalFiles();
    page.checkUrlContains(APP_ROUTES.PERSONAL_FILES);
    page.sidenav.isActive(SIDEBAR_LABELS.PERSONAL_FILES).should('be.true');
  });

//   it('[C217151] Personal Files tooltip', () => {
//     page.clickPersonalFiles();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.PERSONAL_FILES).should('contain', 'View your Personal Files');

//     page.header.collapseSideNav();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.PERSONAL_FILES).should('contain', 'View your Personal Files');
//   });

//   it('[C213111] Shared Files tooltip', () => {
//     page.clickSharedFiles();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.SHARED_FILES).should('contain', 'View files that have been shared');

//     page.header.collapseSideNav();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.SHARED_FILES).should('contain', 'View files that have been shared');
//   });

//   it('[C213167] Recent Files tooltip', () => {
//     page.clickRecentFiles();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.RECENT_FILES).should('contain', 'View files you recently edited');

//     page.header.collapseSideNav();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.RECENT_FILES).should('contain', 'View files you recently edited');
//   });

//   it('[C217153] Favorites tooltip', () => {
//     page.clickFavorites();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.FAVORITES).should('contain', 'View your favorite files and folders');

//     page.header.collapseSideNav();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.FAVORITES).should('contain', 'View your favorite files and folders');
//   });

//   it('[C217154] Trash tooltip', () => {
//     page.clickTrash();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.TRASH).should('contain', 'View deleted files in the trash');

//     page.header.collapseSideNav();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.TRASH).should('contain', 'View deleted files in the trash');
//   });

//   it('[C217152] File Libraries tooltip', async () => {
//     page.clickFileLibraries();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.FILE_LIBRARIES).should('contain', 'File Libraries');

//     page.header.collapseSideNav();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.FILE_LIBRARIES).should('contain', 'File Libraries');
//   });

//   it('[C289916] My Libraries tooltip', () => {
//     page.goToMyLibraries();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.MY_LIBRARIES).should('contain', 'Access my libraries');

//     page.header.collapseSideNav();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.MY_LIBRARIES).should('contain', 'Access my libraries');
//   });

//   it('[C289917] Favorite Libraries tooltip', () => {
//     page.goToFavoriteLibraries();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.FAVORITE_LIBRARIES).should('contain', 'Access my favorite libraries');

//     page.header.collapseSideNav();
//     page.sidenav.getLinkTooltip(SIDEBAR_LABELS.FAVORITE_LIBRARIES).should('contain', 'Access my favorite libraries');
//   });

});
