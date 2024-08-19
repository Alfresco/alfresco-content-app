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
import { ApiClientFactory, Utils, test, SIDEBAR_LABELS, SearchPage, PersonalFilesPage } from '@alfresco/playwright-shared';

test.describe('Empty list views', () => {
  const username = `user-${Utils.random()}`;

  test.beforeAll(async () => {
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    await apiClientFactory.createUser({ username });
  });

  test.beforeEach(async ({ loginPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
  });

  test('[C217099] empty My Libraries', async ({ myLibrariesPage }) => {
    await myLibrariesPage.navigate();
    expect(await myLibrariesPage.dataTable.isEmpty(), 'list is not empty').toBe(true);
    expect(await myLibrariesPage.dataTable.getEmptyStateTitle()).toContain(`You aren't a member of any File Libraries yet`);
    expect(await myLibrariesPage.dataTable.getEmptyStateSubtitle()).toContain('Join libraries to upload, view, and share files.');
  });

  test('[C280134] [C280120] Empty Trash - pagination controls not displayed', async ({ trashPage }) => {
    await trashPage.navigate();
    expect(await trashPage.dataTable.isEmpty(), 'list is not empty').toBe(true);
    expect(await trashPage.dataTable.getEmptyStateTitle()).toContain('Trash is empty');
    expect(await trashPage.dataTable.getEmptyListText()).toContain('Items you delete are moved to the Trash.');
    expect(await trashPage.dataTable.getEmptyListText()).toContain('Empty Trash to permanently delete items.');
    expect(await trashPage.pagination.isRangePresent(), 'Range is present').toBe(false);
    expect(await trashPage.pagination.isMaxItemsPresent(), 'Max items is present').toBe(false);
  });

  test('[C290123] [C290031] Empty Search results - pagination controls not displayed', async ({ personalFiles, searchPage }) => {
    await personalFiles.acaHeader.searchButton.click();
    await searchPage.clickSearchButton();
    await searchPage.searchOverlay.checkFilesAndFolders();
    await searchPage.searchOverlay.searchFor('InvalidText');
    await searchPage.reload({ waitUntil: 'domcontentloaded' });
    await searchPage.dataTable.spinnerWaitForReload();

    expect(await personalFiles.pagination.isRangePresent(), 'Range is present').toBe(false);
    expect(await personalFiles.pagination.isMaxItemsPresent(), 'Max items is present').toBe(false);
    expect(await personalFiles.dataTable.isEmpty(), 'list is not empty').toBe(true);
    expect(await personalFiles.dataTable.emptySearchText.innerText()).toContain('Your search returned 0 results');
  });

  test('[C290020] Empty Search results - Libraries', async ({ searchPage }) => {
    await searchPage.sidenav.openPanel(SIDEBAR_LABELS.MY_LIBRARIES);
    /* cspell:disable-next-line */
    await searchPage.searchWithin('qwertyuiop', 'files');

    expect(await searchPage.dataTable.isEmpty()).toBeTruthy();
    expect(await searchPage.dataTable.emptySearchText.textContent()).toContain('Your search returned 0 results');
  });

  async function openEmptyTab(searchPage: SearchPage, tab: string, emptyStateTitle: string, emptyStateSubtitle: string) {
    await searchPage.sidenav.openPanel(tab);
    expect(await searchPage.dataTable.isEmpty()).toBeTruthy();
    expect(await searchPage.dataTable.getEmptyStateTitle()).toContain(emptyStateTitle);
    expect(await searchPage.dataTable.getEmptyStateSubtitle()).toContain(emptyStateSubtitle);
  }

  [
    {
      tab: SIDEBAR_LABELS.FAVORITE_LIBRARIES,
      id: 'C289911',
      emptyStateTitle: `No Favorite Libraries`,
      emptyStateSubtitle: 'Favorite a library that you want to find easily later.'
    },
    {
      tab: SIDEBAR_LABELS.RECENT_FILES,
      id: 'C213169',
      emptyStateTitle: 'No recent files',
      emptyStateSubtitle: 'Items you uploaded or edited in the last 30 days are shown here.'
    },
    {
      tab: SIDEBAR_LABELS.FAVORITES,
      id: 'C280133',
      emptyStateTitle: 'No favorite files or folders',
      emptyStateSubtitle: 'Favorite items that you want to easily find later.'
    }
  ].forEach((testCase) => {
    test(`[${testCase.id}] empty ${testCase.tab}`, async ({ searchPage }) => {
      await openEmptyTab(searchPage, testCase.tab, testCase.emptyStateTitle, testCase.emptyStateSubtitle);
    });
  });

  async function checkPaginationForTabs(searchPage: SearchPage, tab: string, personalFiles: PersonalFilesPage) {
    await searchPage.sidenav.openPanel(tab);
    expect(await personalFiles.pagination.isRangePresent()).toBeFalsy();
    expect(await personalFiles.pagination.isMaxItemsPresent()).toBeFalsy();
    expect(await personalFiles.pagination.isCurrentPagePresent()).toBeFalsy();
    expect(await personalFiles.pagination.isTotalPagesPresent()).toBeFalsy();
    expect(await personalFiles.pagination.isPreviousButtonPresent()).toBeFalsy();
    expect(await personalFiles.pagination.isNextButtonPresent()).toBeFalsy();
  }

  [
    {
      tab: SIDEBAR_LABELS.FAVORITES,
      id: 'C280111'
    },
    {
      tab: SIDEBAR_LABELS.MY_LIBRARIES,
      id: 'C280084'
    },
    {
      tab: SIDEBAR_LABELS.FAVORITE_LIBRARIES,
      id: 'C291873'
    },
    {
      tab: SIDEBAR_LABELS.PERSONAL_FILES,
      id: 'C280075'
    },
    {
      tab: SIDEBAR_LABELS.RECENT_FILES,
      id: 'C280102'
    },
    {
      tab: SIDEBAR_LABELS.TRASH,
      id: 'C280120'
    }
  ].forEach((testCase) => {
    test(`[${testCase.id}] ${testCase.tab} - pagination controls not displayed`, async ({ searchPage, personalFiles }) => {
      await checkPaginationForTabs(searchPage, testCase.tab, personalFiles);
    });
  });
});
