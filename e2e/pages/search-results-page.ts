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

import { browser, by } from 'protractor';
import { BrowsingPage } from './browsing-page';

export class SearchResultsPage extends BrowsingPage {

  private static selectors = {
    root: 'aca-search-results',

    filter: 'adf-search-filter',
    expansionPanel: 'mat-expansion-panel',
    size: '#expansion-panel-SEARCH.CATEGORIES.SIZE',
    createdDate: '#expansion-panel-SEARCH.CATEGORIES.CREATED_DATE',
    modifiedDate: '#expansion-panel-SEARCH.CATEGORIES.MODIFIED_DATE',
    fileType: '#expansion-panel-SEARCH.FACET_FIELDS.FILE_TYPE',
    creator: '#expansion-panel-SEARCH.CATEGORIES.CREATOR',
    modifier: '#expansion-panel-SEARCH.CATEGORIES.MODIFIER',
    location: '#expansion-panel-SEARCH.CATEGORIES.LOCATION',

    resultsContent: 'adf-search-results__content',
    resultsContentHeader: '.adf-search-results__content-header',
    resultsInfoText: 'adf-search-results--info-text',
    resultsFacets: 'adf-search-results__facets',

    sortingPicker: 'adf-sorting-picker'
  };

  async waitForResults() {
    await this.dataTable.waitForBody();
  }

  async getResultsHeader() {
    return browser.element(by.css(SearchResultsPage.selectors.resultsContentHeader)).getText();
  }
}
