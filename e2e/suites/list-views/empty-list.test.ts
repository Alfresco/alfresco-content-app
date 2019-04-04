/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { LoginPage, BrowsingPage } from '../../pages/pages';
import { Utils } from '../../utilities/utils';
import { RepoClient } from '../../utilities/repo-client/repo-client';

describe('Empty list views', () => {
  const username = `user-${Utils.random()}`;
  const password = username;

  const apis = {
    admin: new RepoClient(),
    user: new RepoClient(username, password)
  };

  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { dataTable, pagination } = page;
  const { searchInput } = page.header;

  beforeAll(async (done) => {
    await apis.admin.people.createUser({ username });
    await loginPage.loginWith(username);
    done();
  });

  it('empty Personal Files - [C280131]', async () => {
    await page.clickPersonalFiles();
    expect(await dataTable.isEmptyList()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyDragAndDropText()).toContain('Drag and drop');
  });

  it('empty My Libraries - [C217099]', async () => {
    await page.goToMyLibraries();
    expect(await dataTable.isEmptyList()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain(`You aren't a member of any File Libraries yet`);
    expect(await dataTable.getEmptyStateSubtitle()).toContain('Join libraries to upload, view, and share files.');
  });

  it('empty Favorite Libraries - [C289911]', async () => {
    await page.goToFavoriteLibraries();
    expect(await dataTable.isEmptyList()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain(`No Favorite Libraries`);
    expect(await dataTable.getEmptyStateSubtitle()).toContain('Favorite a library that you want to find easily later.');
  });

  it('empty Shared Files - [C280132]', async () => {
    await page.clickSharedFiles();
    expect(await dataTable.isEmptyList()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain('No shared files or folders');
    expect(await dataTable.getEmptyStateSubtitle()).toContain('Items you share using the Share option are shown here.');
  });

  it('empty Recent Files - [C213169]', async () => {
    await page.clickRecentFiles();
    expect(await dataTable.isEmptyList()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain('No recent files');
    expect(await dataTable.getEmptyStateSubtitle()).toContain('Items you uploaded or edited in the last 30 days are shown here.');
  });

  it('empty Favorites - [C280133]', async () => {
    await page.clickFavorites();
    expect(await dataTable.isEmptyList()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain('No favorite files or folders');
    expect(await dataTable.getEmptyStateSubtitle()).toContain('Favorite items that you want to easily find later.');
  });

  it('empty Trash - [C280134]', async () => {
    await page.clickTrash();
    expect(await dataTable.isEmptyList()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptyStateTitle()).toContain('Trash is empty');
    expect(await dataTable.getEmptyStateText()).toContain('Items you delete are moved to the Trash.');
    expect(await dataTable.getEmptyStateText()).toContain('Empty Trash to permanently delete items.');
  });

  it('Favorites - pagination controls not displayed - [C280111]', async () => {
    await page.clickFavorites();
    expect(await pagination.isRangePresent()).toBe(false, 'Range is present');
    expect(await pagination.isMaxItemsPresent()).toBe(false, 'Max items is present');
    expect(await pagination.isCurrentPagePresent()).toBe(false, 'Current page is present');
    expect(await pagination.isTotalPagesPresent()).toBe(false, 'Total pages is present');
    expect(await pagination.isPreviousButtonPresent()).toBe(false, 'Previous button is present');
    expect(await pagination.isNextButtonPresent()).toBe(false, 'Next button is present');
  });

  it('My Libraries - pagination controls not displayed - [C280084]', async () => {
    await page.goToMyLibraries();
    expect(await pagination.isRangePresent()).toBe(false, 'Range is present');
    expect(await pagination.isMaxItemsPresent()).toBe(false, 'Max items is present');
    expect(await pagination.isCurrentPagePresent()).toBe(false, 'Current page is present');
    expect(await pagination.isTotalPagesPresent()).toBe(false, 'Total pages is present');
    expect(await pagination.isPreviousButtonPresent()).toBe(false, 'Previous button is present');
    expect(await pagination.isNextButtonPresent()).toBe(false, 'Next button is present');
  });

  it('Favorite Libraries - pagination controls not displayed - [C291873]', async () => {
    await page.goToFavoriteLibraries();
    expect(await pagination.isRangePresent()).toBe(false, 'Range is present');
    expect(await pagination.isMaxItemsPresent()).toBe(false, 'Max items is present');
    expect(await pagination.isCurrentPagePresent()).toBe(false, 'Current page is present');
    expect(await pagination.isTotalPagesPresent()).toBe(false, 'Total pages is present');
    expect(await pagination.isPreviousButtonPresent()).toBe(false, 'Previous button is present');
    expect(await pagination.isNextButtonPresent()).toBe(false, 'Next button is present');
  });

  it('Personal Files - pagination controls not displayed - [C280075]', async () => {
    await page.clickPersonalFiles();
    expect(await pagination.isRangePresent()).toBe(false, 'Range is present');
    expect(await pagination.isMaxItemsPresent()).toBe(false, 'Max items is present');
    expect(await pagination.isCurrentPagePresent()).toBe(false, 'Current page is present');
    expect(await pagination.isTotalPagesPresent()).toBe(false, 'Total pages is present');
    expect(await pagination.isPreviousButtonPresent()).toBe(false, 'Previous button is present');
    expect(await pagination.isNextButtonPresent()).toBe(false, 'Next button is present');
  });

  it('Recent Files - pagination controls not displayed - [C280102]', async () => {
    await page.clickRecentFiles();
    expect(await pagination.isRangePresent()).toBe(false, 'Range is present');
    expect(await pagination.isMaxItemsPresent()).toBe(false, 'Max items is present');
    expect(await pagination.isCurrentPagePresent()).toBe(false, 'Current page is present');
    expect(await pagination.isTotalPagesPresent()).toBe(false, 'Total pages is present');
    expect(await pagination.isPreviousButtonPresent()).toBe(false, 'Previous button is present');
    expect(await pagination.isNextButtonPresent()).toBe(false, 'Next button is present');
  });

  it('Shared Files - pagination controls not displayed - [C280094]', async () => {
    await page.clickSharedFiles();
    expect(await pagination.isRangePresent()).toBe(false, 'Range is present');
    expect(await pagination.isMaxItemsPresent()).toBe(false, 'Max items is present');
    expect(await pagination.isCurrentPagePresent()).toBe(false, 'Current page is present');
    expect(await pagination.isTotalPagesPresent()).toBe(false, 'Total pages is present');
    expect(await pagination.isPreviousButtonPresent()).toBe(false, 'Previous button is present');
    expect(await pagination.isNextButtonPresent()).toBe(false, 'Next button is present');
  });

  it('Trash - pagination controls not displayed - [C280120]', async () => {
    await page.clickTrash();
    expect(await pagination.isRangePresent()).toBe(false, 'Range is present');
    expect(await pagination.isMaxItemsPresent()).toBe(false, 'Max items is present');
    expect(await pagination.isCurrentPagePresent()).toBe(false, 'Current page is present');
    expect(await pagination.isTotalPagesPresent()).toBe(false, 'Total pages is present');
    expect(await pagination.isPreviousButtonPresent()).toBe(false, 'Previous button is present');
    expect(await pagination.isNextButtonPresent()).toBe(false, 'Next button is present');
  });

  it('Search results - pagination controls not displayed - [C290123]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkOnlyFiles();
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

  it('Empty Search results - Libraries - [C290020]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkLibraries();
    /* cspell:disable-next-line */
    await searchInput.searchFor('qwertyuiop');
    await dataTable.waitForBody();

    expect(await dataTable.isEmptyList()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptySearchResultsText()).toContain('Your search returned 0 results');
  });

  it('Empty Search results - Files / Folders - [C290031]', async () => {
    await searchInput.clickSearchButton();
    await searchInput.checkFilesAndFolders();
    /* cspell:disable-next-line */
    await searchInput.searchFor('qwertyuiop');
    await dataTable.waitForBody();

    expect(await dataTable.isEmptyList()).toBe(true, 'list is not empty');
    expect(await dataTable.getEmptySearchResultsText()).toContain('Your search returned 0 results');
  });
});
