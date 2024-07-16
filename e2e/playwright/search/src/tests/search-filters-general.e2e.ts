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

import { expect, Locator } from '@playwright/test';
import { ApiClientFactory, Utils, test, SearchPage } from '@alfresco/playwright-shared';

test.describe('Search - Filters - General', () => {
  const username = `user-${Utils.random()}`;

  test.beforeEach(async ({ loginPage, searchPage }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await searchPage.acaHeader.searchButton.click();
  });

  test.beforeAll(async () => {
    try {
      const apiClientFactory = new ApiClientFactory();
      await apiClientFactory.setUpAcaBackend('admin');
      await apiClientFactory.createUser({ username });
    } catch (error) {
      console.error(`beforeAll failed: ${error}`);
    }
  });

  test('[C704281] [C704282] Menu cards have proper titles', async ({ searchPage }) => {
    async function checkMenuCardTitle(page: SearchPage, filterLocator: Locator, expectText: string): Promise<void> {
      await filterLocator.click();
      await expect(page.searchFilters.menuCardTitle).toContainText(expectText);
      await page.searchFilters.menuCardClose.click();
      await page.searchFilters.menuCardClose.waitFor({ state: 'hidden' });
      await expect(page.searchFilters.menuCardClose).toBeHidden();
    }

    const testCases = [
      {
        filterLocator: searchPage.searchFilters.logicFilter,
        expectText: 'Logic'
      },
      {
        filterLocator: searchPage.searchFilters.propertiesFilter,
        expectText: 'Properties'
      },
      {
        filterLocator: searchPage.searchFilters.dateFilter,
        expectText: 'Date'
      },
      {
        filterLocator: searchPage.searchFilters.locationFilter,
        expectText: 'Location'
      },
      {
        filterLocator: searchPage.searchFilters.tagsFilter,
        expectText: 'Tags'
      },
      {
        filterLocator: searchPage.searchFilters.categoriesFilter,
        expectText: 'Categories'
      }
    ];

    for (const testCase of testCases) {
      await checkMenuCardTitle(searchPage, testCase.filterLocator, testCase.expectText);
    }
  });

  test('[C704283] Facets filters can be cleared', async ({ searchPage }) => {
    const filterTextBefore = await searchPage.searchFilters.propertiesFilter.textContent();
    await searchPage.searchFilters.propertiesFilter.click();
    await searchPage.searchFiltersProperties.fileSizeInput.fill('1000');
    await searchPage.searchFilters.menuCardApply.click();
    await searchPage.dataTable.progressBarWaitForReload();
    const filterTextAfter = await searchPage.searchFilters.propertiesFilter.textContent();

    await searchPage.searchFilters.propertiesFilter.click();
    await searchPage.searchFilters.menuCardClear.click();
    await searchPage.searchFiltersProperties.fileSizeInput.waitFor({ state: 'hidden' });
    const filterTextCleared = await searchPage.searchFilters.propertiesFilter.textContent();

    expect(filterTextBefore).toEqual(filterTextCleared);
    expect(filterTextAfter).not.toEqual(filterTextCleared);
  });

  test('[C699499] All filters can be reset with reset button', async ({ searchPage }) => {
    const propertiesFilterTextBefore = await searchPage.searchFilters.propertiesFilter.textContent();
    await searchPage.searchFilters.propertiesFilter.click();
    await searchPage.searchFiltersProperties.fileSizeInput.fill('1000');
    await searchPage.searchFilters.menuCardApply.click();
    await searchPage.dataTable.progressBarWaitForReload();
    const propertiesFilterTextAfter = await searchPage.searchFilters.propertiesFilter.textContent();

    const logicFilterTextBefore = await searchPage.searchFilters.logicFilter.textContent();
    await searchPage.searchFilters.logicFilter.click();
    await searchPage.searchFiltersLogic.matchAllInput.fill('test');
    await searchPage.searchFilters.menuCardApply.click();
    await searchPage.dataTable.progressBarWaitForReload();
    const logicFilterTextAfter = await searchPage.searchFilters.logicFilter.textContent();

    await searchPage.searchFilters.resetButton.click();
    const propertiesFilterTextCleared = await searchPage.searchFilters.propertiesFilter.textContent();
    const logicFilterTextCleared = await searchPage.searchFilters.logicFilter.textContent();

    await expect(propertiesFilterTextBefore).toEqual(propertiesFilterTextCleared);
    await expect(logicFilterTextBefore).toEqual(logicFilterTextCleared);
    await expect(propertiesFilterTextCleared).not.toEqual(propertiesFilterTextAfter);
    await expect(logicFilterTextCleared).not.toEqual(logicFilterTextAfter);
  });
});
