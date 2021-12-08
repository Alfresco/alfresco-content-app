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

import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { SearchSortingDefinition } from '@alfresco/adf-content-services/lib/search/models/search-sorting-definition.interface';
import { Component, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';

@Component({
  selector: 'aca-search-action-menu',
  templateUrl: './search-action-menu.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SearchActionMenuComponent implements OnInit {
  @Output()
  sortingSelected: EventEmitter<SearchSortingDefinition> = new EventEmitter();

  options: SearchSortingDefinition[] = [];

  constructor(private queryBuilder: SearchQueryBuilderService) {}

  ngOnInit(): void {
    this.options = this.queryBuilder.getSortingOptions();
  }

  onAscSortingClicked(option: SearchSortingDefinition) {
    option.ascending = true;
    this.sortingSelected.emit(option);
  }

  onDescSortingClicked(option: SearchSortingDefinition) {
    option.ascending = false;
    this.sortingSelected.emit(option);
  }
}
