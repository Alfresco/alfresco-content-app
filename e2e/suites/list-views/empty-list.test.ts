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

import { AdminActions, BrowsingPage, LoginPage, Utils } from '@alfresco/aca-testing-shared';

describe('Empty list views', () => {
  const username = `user-${Utils.random()}`;
  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, pagination } = page;
  const { searchInput } = page.header;
  const adminApiActions = new AdminActions();

  beforeAll(async (done) => {
    await adminApiActions.createUser({ username });
    await loginPage.loginWith(username);
    done();
  });

  it('[C217099] empty My Libraries', async () => {
    await page.goToMyLibraries();
    expect(await dataTable.isEmpty()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain(`You aren't a member of any File Libraries yet`);
    expect(await dataTable.getEmptyStateSubtitle()).toContain('Join libraries to upload, view, and share files.');
  });

  it('[C289911] empty Favorite Libraries', async () => {
    await page.goToFavoriteLibraries();
    expect(await dataTable.isEmpty()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain(`No Favorite Libraries`);
    expect(await dataTable.getEmptyStateSubtitle()).toContain('Favorite a library that you want to find easily later.');
  });

  it('[C213169] empty Recent Files', async () => {
    await page.clickRecentFiles();
    expect(await dataTable.isEmpty()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain('No recent files');
    expect(await dataTable.getEmptyStateSubtitle()).toContain('Items you uploaded or edited in the last 30 days are shown here.');
  });

  it('[C280133] empty Favorites', async () => {
    await page.clickFavorites();
    expect(await dataTable.isEmpty()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain('No favorite files or folders');
    expect(await dataTable.getEmptyStateSubtitle()).toContain('Favorite items that you want to easily find later.');
  });

  it('[C280134] empty Trash', async () => {
    await page.clickTrash();
    expect(await dataTable.isEmpty()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain('Trash is empty');
    expect(await dataTable.getEmptyListText()).toContain('Items you delete are moved to the Trash.');
    expect(await dataTable.getEmptyListText()).toContain('Empty Trash to permanently delete items.');
  });

  it('[C280111] Favorites - pagination controls not displayed', async () => {
    await page.clickFavorites();
    expect(await pagination.isRangePresent()).toBe(false, 'Range is present');
    expect(await pagination.isMaxItemsPresent()).toBe(false, 'Max items is present');
    expect(await pagination.isCurrentPagePresent()).toBe(false, 'Current page is present');
    expect(await pagination.isTotalPagesPresent()).toBe(false, 'Total pages is present');
    expect(await pagination.isPreviousButtonPresent()).toBe(false, 'Previous button is present');
    expect(await pagination.isNextButtonPresent()).toBe(false, 'Next button is present');
  });

  it('[C280084] My Libraries - pagination controls not displayed', async () => {
    await page.goToMyLibraries();
    expect(await pagination.isRangePresent()).toBe(false, 'Range is present');
    expect(await pagination.isMaxItemsPresent()).toBe(false, 'Max items is present');
    expect(await pagination.isCurrentPagePresent()).toBe(false, 'Current page is present');
    expect(await pagination.isTotalPagesPresent()).toBe(false, 'Total pages is present');
    expect(await pagination.isPreviousButtonPresent()).toBe(false, 'Previous button is present');
    expect(await pagination.isNextButtonPresent()).toBe(false, 'Next button is present');
  });

  it('[C291873] Favorite Libraries - pagination controls not displayed', async () => {
    await page.goToFavoriteLibraries();
    expect(await pagination.isRangePresent()).toBe(false, 'Range is present');
    expect(await pagination.isMaxItemsPresent()).toBe(false, 'Max items is present');
    expect(await pagination.isCurrentPagePresent()).toBe(false, 'Current page is present');
    expect(await pagination.isTotalPagesPresent()).toBe(false, 'Total pages is present');
    expect(await pagination.isPreviousButtonPresent()).toBe(false, 'Previous button is present');
    expect(await pagination.isNextButtonPresent()).toBe(false, 'Next button is present');
  });

  it('[C280075] Personal Files - pagination controls not displayed', async () => {
    await page.clickPersonalFiles();
    expect(await pagination.isRangePresent()).toBe(false, 'Range is present');
    expect(await pagination.isMaxItemsPresent()).toBe(false, 'Max items is present');
    expect(await pagination.isCurrentPagePresent()).toBe(false, 'Current page is present');
    expect(await pagination.isTotalPagesPresent()).toBe(false, 'Total pages is present');
    expect(await pagination.isPreviousButtonPresent()).toBe(false, 'Previous button is present');
    expect(await pagination.isNextButtonPresent()).toBe(false, 'Next button is present');
  });

  it('[C280102] Recent Files - pagination controls not displayed', async () => {
    await page.clickRecentFiles();
    expect(await pagination.isRangePresent()).toBe(false, 'Range is present');
    expect(await pagination.isMaxItemsPresent()).toBe(false, 'Max items is present');
    expect(await pagination.isCurrentPagePresent()).toBe(false, 'Current page is present');
    expect(await pagination.isTotalPagesPresent()).toBe(false, 'Total pages is present');
    expect(await pagination.isPreviousButtonPresent()).toBe(false, 'Previous button is present');
    expect(await pagination.isNextButtonPresent()).toBe(false, 'Next button is present');
  });

  it('[C280120] Trash - pagination controls not displayed', async () => {
    await page.clickTrash();
    expect(await pagination.isRangePresent()).toBe(false, 'Range is present');
    expect(await pagination.isMaxItemsPresent()).toBe(false, 'Max items is present');
    expect(await pagination.isCurrentPagePresent()).toBe(false, 'Current page is present');
    expect(await pagination.isTotalPagesPresent()).toBe(false, 'Total pages is present');
    expect(await pagination.isPreviousButtonPresent()).toBe(false, 'Previous button is present');
    expect(await pagination.isNextButtonPresent()).toBe(false, 'Next button is present');
  });

  it('[C290123] Search results - pagination controls not displayed', async () => {
    await searchInput.clickSearchButton();
    /* cspell:disable-next-line */
    await searchInput.searchFor('qwertyuiop');
    await dataTable.waitForBody();

    expect(await pagination.isRangePresent()).toBe(false, 'Range is present');
    expect(await pagination.isMaxItemsPresent()).toBe(false, 'Max items is present');
    expect(await pagination.isCurrentPagePresent()).toBe(false, 'Current page is present');
    expect(await pagination.isTotalPagesPresent()).toBe(false, 'Total pages is present');
    expect(await pagination.isPreviousButtonPresent()).toBe(false, 'Previous button is present');
    expect(await pagination.isNextButtonPresent()).toBe(false, 'Next button is present');
  });

  it('[C290020] Empty Search results - Libraries', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    /* cspell:disable-next-line */
    await searchInput.searchFor('qwertyuiop');
    await dataTable.waitForBody();

    expect(await dataTable.isEmpty()).toBe(true, 'list is not empty');
    expect(await dataTable.emptySearchText.getText()).toContain('Your search returned 0 results');
  });

  it('[C290031] Empty Search results - Files / Folders', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    /* cspell:disable-next-line */
    await searchInput.searchFor('qwertyuiop');
    await dataTable.waitForBody();

    expect(await dataTable.isEmpty()).toBe(true, 'list is not empty');
    expect(await dataTable.emptySearchText.getText()).toContain('Your search returned 0 results');
  });
});
