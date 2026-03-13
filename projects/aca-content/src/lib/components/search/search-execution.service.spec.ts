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

import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { SearchExecutionService } from './search-execution.service';
import { SearchFilterService } from './search-filter.service';
import { SearchNavigationService } from './search-navigation.service';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { SearchLibrariesQueryBuilderService } from './search-libraries-results/search-libraries-query-builder.service';
import { AppStore, SearchActionTypes } from '@alfresco/aca-shared/store';

describe('SearchExecutionService', () => {
  let service: SearchExecutionService;
  let store: jasmine.SpyObj<Store<AppStore>>;
  let filterService: jasmine.SpyObj<SearchFilterService>;
  let navigationService: jasmine.SpyObj<SearchNavigationService>;
  let queryBuilder: jasmine.SpyObj<SearchQueryBuilderService>;
  let queryLibrariesBuilder: jasmine.SpyObj<SearchLibrariesQueryBuilderService>;

  beforeEach(() => {
    store = jasmine.createSpyObj('Store', ['dispatch']);
    filterService = jasmine.createSpyObj('SearchFilterService', ['applyContentFilters', 'isLibrariesChecked'], {
      searchOptions: []
    });
    navigationService = jasmine.createSpyObj('SearchNavigationService', ['isSameSearchTerm'], {
      onSearchResults: false,
      onLibrariesSearchResults: false
    });
    queryBuilder = jasmine.createSpyObj('SearchQueryBuilderService', ['update']);
    queryLibrariesBuilder = jasmine.createSpyObj('SearchLibrariesQueryBuilderService', ['update']);

    TestBed.configureTestingModule({
      providers: [
        SearchExecutionService,
        { provide: Store, useValue: store },
        { provide: SearchFilterService, useValue: filterService },
        { provide: SearchNavigationService, useValue: navigationService },
        { provide: SearchQueryBuilderService, useValue: queryBuilder },
        { provide: SearchLibrariesQueryBuilderService, useValue: queryLibrariesBuilder }
      ]
    });

    service = TestBed.inject(SearchExecutionService);
  });

  it('should do nothing for empty/null search term', () => {
    service.execute('');
    service.execute(null);
    service.execute('   ');
    expect(filterService.applyContentFilters).not.toHaveBeenCalled();
  });

  it('should apply content filters before executing', () => {
    filterService.isLibrariesChecked.and.returnValue(false);
    service.execute('test');
    expect(filterService.applyContentFilters).toHaveBeenCalled();
  });

  describe('content search', () => {
    beforeEach(() => {
      filterService.isLibrariesChecked.and.returnValue(false);
    });

    it('should dispatch SearchByTermAction for new content search', () => {
      service.execute('test');
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ type: SearchActionTypes.SearchByTerm, payload: 'test' }));
    });
  });

  describe('libraries search', () => {
    beforeEach(() => {
      filterService.isLibrariesChecked.and.returnValue(true);
    });

    it('should dispatch SearchByTermAction for new libraries search', () => {
      service.execute('test');
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ type: SearchActionTypes.SearchByTerm, payload: 'test' }));
    });
  });
});
