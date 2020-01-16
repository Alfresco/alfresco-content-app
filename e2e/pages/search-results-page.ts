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

import { browser, by, By, ElementFinder, ElementArrayFinder } from 'protractor';
import { BrowsingPage } from './browsing-page';
import { SearchSortingPicker } from '../components/search/search-sorting-picker';
import { SearchFilters } from '../components/search/search-filters';

export class SearchResultsPage extends BrowsingPage {

  private static selectors = {
    root: 'aca-search-results',

    resultsContentHeader: '.adf-search-results__content-header',
    infoText: '.adf-search-results--info-text',
    chipList: '.adf-search-chip-list',
    chip: '.mat-chip',
    chipCloseIcon: '.mat-chip-remove'
  };

  root: ElementFinder = browser.element(by.css(SearchResultsPage.selectors.root));
  chipList: ElementFinder = this.root.element(by.css(SearchResultsPage.selectors.chipList));
  infoText: ElementFinder = this.root.element(by.css(SearchResultsPage.selectors.infoText));

  sortingPicker = new SearchSortingPicker(SearchResultsPage.selectors.root);
  filters = new SearchFilters(SearchResultsPage.selectors.root);

  async waitForResults(): Promise<void> {
    await this.dataTable.waitForBody();
  }

  async getResultsHeader(): Promise<string> {
    return await browser.element(by.css(SearchResultsPage.selectors.resultsContentHeader)).getText();
  }

  async getResultsFoundText(): Promise<string> {
    return await this.infoText.getText();
  }

  async getResultsChipsValues(): Promise<string[]> {
    const chips: ElementArrayFinder = this.chipList.all(by.css(SearchResultsPage.selectors.chip));
    const chipsValues: string[] = await chips.map(async elem => {
      return (await elem.getText()).replace(`\ncancel`, '');
    });
    return chipsValues;
  }

  async removeChip(chipName: string): Promise<void> {
    const chip: ElementFinder = browser.element(By.cssContainingText(SearchResultsPage.selectors.chip, chipName));
    const closeChip: ElementFinder = chip.element(by.css(SearchResultsPage.selectors.chipCloseIcon));
    await closeChip.click();
  }
}
