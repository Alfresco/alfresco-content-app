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

import { by, browser } from 'protractor';
import { Component } from '../component';
import { SizeFilter } from './filters/size-filter';
import { CreatedDateFilter } from './filters/created-date-filter';
import { FacetFilter } from './filters/facet-filter';
import { isPresentAndDisplayed } from '../../utilities/utils';

export class SearchFilters extends Component {
  mainPanel = browser.element(by.css('adf-search-filter'));
  resetAllButton = browser.element(by.css('button[adf-reset-search]'));

  size = new SizeFilter();
  createdDate = new CreatedDateFilter();
  fileType = new FacetFilter('File type');
  creator = new FacetFilter('Creator');
  modifier = new FacetFilter('Modifier');
  location = new FacetFilter('Location');
  modifiedDate = new FacetFilter('Modified date');

  constructor(ancestor?: string) {
    super('adf-search-filter', ancestor);
  }

  async isSearchFiltersPanelDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.mainPanel);
  }
}
