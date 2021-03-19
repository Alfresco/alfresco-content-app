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

import { CyLoginPage, CyBrowsingPage } from './../../pages';
import { PAGE_TITLES } from './../../utils/cy-configs';
import { CyUtils } from './../../utils/cy-utils';
import { CyRepoClient } from '../../utils/cy-api/cy-repo-client/cy-repo-client';

describe('Cypress Page titles', () => {
  const loginPage = new CyLoginPage();
  const page = new CyBrowsingPage();
  const adminApi = new CyRepoClient();

  const file = `file-${CyUtils.random()}.txt`;
  let fileId: string;
  const { searchInput } = page.header;

  describe('on Login / Logout pages', () => {
    it('[C217155] on Login page', () => {
      loginPage.load();

      cy.title().should('contain', 'Sign in');
    });

    it('[C217156] after logout', () => {
      loginPage.loginWithAdmin();
      page.signOut();

      cy.title().should('contain', 'Sign in');
    });

    it('[C280414] when pressing Back after Logout', () => {
      loginPage.loginWithAdmin();
      page.signOut();
      cy.go('back');

      cy.title().should('contain', 'Sign in');
    });
  });

  describe('on app pages', () => {
    before(() => {
      cy.then(async () => {
        fileId = (await adminApi.nodes.createFile(file)).entry.id;
      });
    });

    before(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      loginPage.loginWithAdmin();
    });

    after(() => {
      cy.then(async () => {
        await adminApi.nodes.deleteNodeById(fileId);
      });
    });

    it('[C217157] Personal Files page', () => {
      page.clickPersonalFiles();
      cy.title().should('contain', PAGE_TITLES.PERSONAL_FILES);
    });

    it('[C217158] My Libraries page', () => {
      page.goToMyLibraries();
      cy.title().should('contain', PAGE_TITLES.MY_LIBRARIES);
    });

    it('[C289907] Favorite Libraries page', () => {
      page.goToFavoriteLibraries();
      cy.title().should('contain', PAGE_TITLES.FAVORITE_LIBRARIES);
    });

    it('[C217159] Shared Files page', () => {
      page.clickSharedFiles();
      cy.title().should('contain', PAGE_TITLES.SHARED_FILES);
    });

    it('[C217160] Recent Files page', () => {
      page.clickRecentFiles();
      cy.title().should('contain', PAGE_TITLES.RECENT_FILES);
    });

    it('[C217161] Favorites page', () => {
      page.clickFavorites();
      cy.title().should('contain', PAGE_TITLES.FAVORITES);
    });

    it('[C217162] Trash page', () => {
      page.clickTrash();
      cy.title().should('contain', PAGE_TITLES.TRASH);
    });

    it('[C280415] File Preview page', () => {
      page.clickPersonalFiles();
      page.dataTable.doubleClickOnRowByName(file);
      cy.title().should('contain', PAGE_TITLES.VIEWER);
      cy.get('.adf-viewer-close-button').click();
    });

    it('[C280413] Search Results page', () => {
      searchInput.clickSearchButton();
      searchInput.searchFor(file);
      cy.title().should('contain', PAGE_TITLES.SEARCH);
    });
  });
});
