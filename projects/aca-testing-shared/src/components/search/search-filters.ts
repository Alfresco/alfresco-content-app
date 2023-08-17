/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { by, browser } from 'protractor';
import { Component } from '../component';
import { CreatedDateFilter } from './filters/created-date-filter';
import { FacetFilter } from './filters/facet-filter';
import { AutocompleteChipsFilter } from './filters/autocomplete-chips-filter';
import { PropertiesFilter } from './filters/properties-filter';
import { FacetTabbedFilter } from './filters/facet-tabbed-filter';

export class SearchFilters extends Component {
  resetAllButton = browser.element(by.css('button[adf-reset-search]'));

  createdDate = new CreatedDateFilter();
  fileType = new PropertiesFilter();
  people = new FacetTabbedFilter('People');
  location = new AutocompleteChipsFilter('Location');
  modifiedDate = new FacetFilter('Modified date');

  constructor(ancestor?: string) {
    super('adf-search-filter', ancestor);
  }
}
