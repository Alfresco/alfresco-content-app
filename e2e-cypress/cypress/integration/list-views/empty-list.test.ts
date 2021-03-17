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
import { CyAdminActions } from '../../utils/cy-api/cy-admin-actions';

describe('Empty list views', () => {
  const username = `user-${CyUtils.random()}`;
  const loginPage = new CyLoginPage();
  const page = new CyBrowsingPage();
  const searchResultsPage = new CySearchResultsPage();
  const { dataTable, pagination } = page;
  const { searchInput } = page.header;
  const adminApiActions = new CyAdminActions();

  before(() => {
    cy.wrap(adminApiActions.createUser({ username }));
  });

  beforeEach(() => {
    loginPage.loginWith(username);
  });

  it('[C217099] empty My Libraries', () => {
    page.goToMyLibraries();
    dataTable.isEmpty().should('be.true');
    dataTable.getEmptyStateTitle().should('contain', `You aren't a member of any File Libraries yet`);
    dataTable.getEmptyStateSubtitle().should('contain', 'Join libraries to upload, view, and share files.');
  });

  it('[C289911] empty Favorite Libraries', () => {
    page.goToFavoriteLibraries();
    dataTable.isEmpty().should('be.true');
    dataTable.getEmptyStateTitle().should('contain', `No Favorite Libraries`);
    dataTable.getEmptyStateSubtitle().should('contain', 'Favorite a library that you want to find easily later.');
  });

  it('[C213169] empty Recent Files', () => {
    page.clickRecentFiles();
    dataTable.isEmpty().should('be.true');
    dataTable.getEmptyStateTitle().should('contain', 'No recent files');
    dataTable.getEmptyStateSubtitle().should('contain', 'Items you uploaded or edited in the last 30 days are shown here.');
  });

  it('[C280133] empty Favorites', () => {
    page.clickFavorites();
    dataTable.isEmpty().should('be.true');
    dataTable.getEmptyStateTitle().should('contain', 'No favorite files or folders');
    dataTable.getEmptyStateSubtitle().should('contain', 'Favorite items that you want to easily find later.');
  });

  it('[C280134] empty Trash', () => {
    page.clickTrash();
    dataTable.isEmpty().should('be.true');
    dataTable.getEmptyStateTitle().should('contain', 'Trash is empty');
    dataTable.getEmptyListText().should('contain', 'Items you delete are moved to the Trash.');
    dataTable.getEmptyListText().should('contain', 'Empty Trash to permanently delete items.');
  });

  it('[C280111] Favorites - pagination controls not displayed', () => {
    page.clickFavorites();
    pagination.isVisible().should('be.false');
  });

  it('[C280084] My Libraries - pagination controls not displayed', () => {
    page.goToMyLibraries();
    pagination.isVisible().should('be.false');
  });

  it('[C291873] Favorite Libraries - pagination controls not displayed', () => {
    page.goToFavoriteLibraries();
    pagination.isVisible().should('be.false');
  });

  it('[C280075] Personal Files - pagination controls not displayed', () => {
    page.clickPersonalFiles();
    pagination.isVisible().should('be.false');
  });

  it('[C280102] Recent Files - pagination controls not displayed', () => {
    page.clickRecentFiles();
    pagination.isVisible().should('be.false');
  });

  it('[C280120] Trash - pagination controls not displayed', () => {
    page.clickTrash();
    pagination.isVisible().should('be.false');
  });

  it('[C290123] Search results - pagination controls not displayed', () => {
    searchInput.clickSearchButton();
    /* cspell:disable-next-line */
    searchInput.searchFor('qwertyuiop');

    pagination.isVisible().should('be.false');
  });

  it('[C279189] Search filters panel is not displayed on empty Search Results page', () => {
    searchInput.clickSearchButton();
    /* cspell:disable-next-line */
    searchInput.searchFor('qwertyuiop');

    searchResultsPage.filters.isSearchFiltersPanelDisplayed().should('be.false');
  });

  it('[C290020] Empty Search results - Libraries', () => {
    searchInput.clickSearchButton();
    searchInput.checkLibraries();
    /* cspell:disable-next-line */
    searchInput.searchFor('qwertyuiop');

    dataTable.isEmpty().should('be.true');
    dataTable.getEmptySearchResultsText().should('contain', 'Your search returned 0 results');
  });

  it('[C290031] Empty Search results - Files / Folders', () => {
    searchInput.clickSearchButton();
    searchInput.checkFilesAndFolders();
    /* cspell:disable-next-line */
    searchInput.searchFor('qwertyuiop');

    dataTable.isEmpty().should('be.true');
    dataTable.getEmptySearchResultsText().should('contain', 'Your search returned 0 results');
  });
});
