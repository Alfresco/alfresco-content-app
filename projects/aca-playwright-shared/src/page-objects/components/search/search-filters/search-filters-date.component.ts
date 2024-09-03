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

import { BaseComponent } from '../../base.component';
import { Page, expect } from '@playwright/test';
import { SearchPage, SearchType } from '@alfresco/playwright-shared';

type FilterTab = 'Created' | 'Modified';

interface FilterFilesByDateParams {
  searchPage: SearchPage;
  filterType: 'anytime' | 'inTheLast' | 'between';
  dateFilterTab: FilterTab;
  searchPhrase: string;
  searchType: SearchType;
  expectSearchResults: number;
  inTheLastInputValue?: string;
  startDay?: string;
  endDay?: string;
}

export class SearchFiltersDate extends BaseComponent {
  private static rootElement = '.adf-search-filter-menu-card';

  constructor(page: Page) {
    super(page, SearchFiltersDate.rootElement);
  }

  public createdTab = this.getChild(`[role='tab']`, { hasText: 'Created' });
  public modifiedTab = this.getChild(`[role='tab']`, { hasText: 'Modified' });
  public createdTabTitle = this.createdTab.locator(`div`);
  public modifiedTabTitle = this.modifiedTab.locator(`div`);
  public anytimeButton = this.getChild(`[data-automation-id$='date-range-anytime']`);
  public anytimeRadioButton = this.anytimeButton.locator(`input`);
  public inTheLastButton = this.getChild(`[data-automation-id$='date-range-in-last']`);
  public inTheLastInput = this.getChild(`[data-automation-id$='date-range-in-last-input']`);
  public inTheLastDropdown = this.getChild(`[data-automation-id$='date-range-in-last-dropdown']`);
  public betweenButton = this.getChild(`[data-automation-id$='date-range-between']`);
  public betweenRadioButton = this.betweenButton.locator(`input`);
  public betweenStartDate = this.getChild(`[data-automation-id$='date-range-between-start-input']`);
  public betweenEndDate = this.getChild(`[data-automation-id$='date-range-between-end-input']`);

  async openCreatedModifiedTab(page: SearchPage, tab: FilterTab): Promise<void> {
    switch (tab) {
      case 'Created':
        await page.searchFiltersDate.createdTab.click();
        break;
      case 'Modified':
        await page.searchFiltersDate.modifiedTab.click();
        break;
      default:
        break;
    }
    await page.page.waitForTimeout(2000);
  }

  /**
   * Method used in cases where we want to filter search results by Date
   *
   * @param searchPage page context for the test
   * @param filterType filter type for the Date filter
   * @param dateFilterTab tab in Date filter. Either Created or Modified
   * @param searchPhrase search phrase for the search
   * @param searchType type of items we want in search results e.g. files or folders
   * @param expectSearchResults expect a number of search results
   * @param inTheLastInputValue a value for 'in the last' input. e.g. in the last X days
   * @param startDay start day for time-frame search. DD-MMMM-YY
   * @param endDay end day for time-frame search. DD-MMMM-YY
   */
  async filterFilesByDate(params: FilterFilesByDateParams) {
    const { searchPage, filterType, dateFilterTab, searchPhrase, searchType, expectSearchResults, inTheLastInputValue, startDay, endDay } = params;

    await searchPage.searchWithin(searchPhrase, searchType);
    await searchPage.searchFilters.dateFilter.click();

    if (dateFilterTab === 'Modified') {
      await searchPage.searchFiltersDate.openCreatedModifiedTab(searchPage, 'Modified');
    }

    switch (filterType) {
      case 'anytime':
        await searchPage.searchFiltersDate.anytimeButton.click();
        break;
      case 'inTheLast':
        await searchPage.searchFiltersDate.inTheLastButton.click();
        await searchPage.searchFiltersDate.inTheLastInput.fill(inTheLastInputValue);
        break;
      case 'between':
        await searchPage.searchFiltersDate.betweenButton.click();
        await searchPage.searchFiltersDate.betweenStartDate.fill(startDay);
        await searchPage.searchFiltersDate.betweenEndDate.fill(endDay);
        break;
      default:
        throw new Error('Invalid filter type');
    }

    await searchPage.searchFilters.menuCardApply.click();
    await searchPage.dataTable.spinnerWaitForReload();
    expect(await searchPage.dataTable.getRowsCount()).toEqual(expectSearchResults);

    let dateText: string;
    if (filterType === 'between') {
      if (dateFilterTab === 'Modified') {
        dateText = `Modified: ${startDay} - ${endDay}`;
      } else {
        dateText = `Created: ${startDay} - ${endDay}`;
      }
      await expect(searchPage.searchFilters.dateFilter).toContainText(dateText, { ignoreCase: true });
    }
  }

  async isModifiedTabSelected(): Promise<string> {
    return this.modifiedTab.getAttribute('aria-selected');
  }

  async isSearchTabSelected(): Promise<string> {
    return this.createdTab.getAttribute('aria-selected');
  }
}
