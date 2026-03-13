/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStore, SearchByTermAction } from '@alfresco/aca-shared/store';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { SearchFilterService } from './search-filter.service';
import { SearchNavigationService } from './search-navigation.service';
import { SearchLibrariesQueryBuilderService } from './search-libraries-results/search-libraries-query-builder.service';

@Injectable({ providedIn: 'root' })
export class SearchExecutionService {
  constructor(
    private readonly store: Store<AppStore>,
    private readonly queryBuilder: SearchQueryBuilderService,
    private readonly queryLibrariesBuilder: SearchLibrariesQueryBuilderService,
    private readonly filterService: SearchFilterService,
    private readonly searchNavigationService: SearchNavigationService
  ) {}

  execute(searchedWord: string) {
    if (!searchedWord?.trim()) {
      return;
    }

    this.filterService.applyContentFilters();

    if (this.filterService.isLibrariesChecked()) {
      this.executeLibrariesSearch(searchedWord);
    } else {
      this.executeContentSearch(searchedWord);
    }
  }

  private executeLibrariesSearch(searchedWord: string) {
    if (this.searchNavigationService.onLibrariesSearchResults && this.searchNavigationService.isSameSearchTerm(searchedWord)) {
      this.queryLibrariesBuilder.update();
    } else {
      this.store.dispatch(new SearchByTermAction(searchedWord, this.filterService.searchOptions));
    }
  }

  private executeContentSearch(searchedWord: string) {
    if (this.searchNavigationService.onSearchResults && this.searchNavigationService.isSameSearchTerm(searchedWord)) {
      this.queryBuilder.update();
    } else {
      this.store.dispatch(new SearchByTermAction(searchedWord, this.filterService.searchOptions));
    }
  }
}
