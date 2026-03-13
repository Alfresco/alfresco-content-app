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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { SearchInputComponent } from './search-input.component';
import { Subject } from 'rxjs';
import { ActivatedRoute, Event, NavigationStart, Params, Router } from '@angular/router';
import { SearchConfiguration, SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchNavigationService } from '../search-navigation.service';
import { SearchFilterService } from '../search-filter.service';
import { SearchExecutionService } from '../search-execution.service';
import { AppHookService } from '@alfresco/aca-shared';
import { UnitTestingUtils } from '@alfresco/adf-core';

describe('SearchInputComponent', () => {
  let fixture: ComponentFixture<SearchInputComponent>;
  let component: SearchInputComponent;
  let router: Router;
  let searchExecutionService: jasmine.SpyObj<SearchExecutionService>;
  let searchFilterService: jasmine.SpyObj<SearchFilterService>;
  let searchNavigationService: jasmine.SpyObj<SearchNavigationService>;
  let testingUtils: UnitTestingUtils;

  const routerEventsSubject = new Subject<Event>();
  const configUpdatedSubject = new Subject<SearchConfiguration>();
  const queryParamsSubject = new Subject<Params>();
  const library400ErrorSubject = new Subject<void>();

  beforeEach(async () => {
    const queryBuilderSpy = {
      configUpdated: configUpdatedSubject,
      removeFilterQuery: jasmine.createSpy('removeFilterQuery'),
      addFilterQuery: jasmine.createSpy('addFilterQuery'),
      update: jasmine.createSpy('update')
    } as Partial<SearchQueryBuilderService>;

    searchExecutionService = jasmine.createSpyObj<SearchExecutionService>('SearchExecutionService', ['execute']);
    searchFilterService = jasmine.createSpyObj<SearchFilterService>('SearchFilterService', [
      'validateSearchTerm',
      'removeContentFilters',
      'initForLibrariesRoute',
      'getSearchInLabel'
    ]);
    searchFilterService.getSearchInLabel.and.returnValue('some-label');
    searchNavigationService = jasmine.createSpyObj<SearchNavigationService>('SearchNavigationService', ['navigateBack', 'getUrlSearchTerm'], {
      onLibrariesSearchResults: false
    });

    searchNavigationService.getUrlSearchTerm.and.returnValue(null);
    searchFilterService.validateSearchTerm.and.returnValue(null);

    const appHookServiceMock = {
      library400Error: library400ErrorSubject.asObservable()
    };

    const activatedRouteMock = {
      queryParams: queryParamsSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [AppTestingModule, SearchInputComponent, NoopAnimationsModule],
      providers: [
        { provide: SearchQueryBuilderService, useValue: queryBuilderSpy },
        { provide: SearchExecutionService, useValue: searchExecutionService },
        { provide: SearchFilterService, useValue: searchFilterService },
        { provide: SearchNavigationService, useValue: searchNavigationService },
        { provide: AppHookService, useValue: appHookServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    Object.defineProperty(router, 'events', {
      get: () => routerEventsSubject.asObservable()
    });

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    testingUtils = new UnitTestingUtils(fixture.debugElement);
    fixture.detectChanges();
  });

  it('should render a directly editable search input', () => {
    const input = testingUtils.getInputByCSS('.app-search-input');
    expect(input).toBeTruthy();
    expect(input.readOnly).toBeFalse();
  });

  it('should render the search-in menu component', () => {
    const searchInMenu = testingUtils.getByCSS('aca-search-in-menu');
    expect(searchInMenu).toBeTruthy();
  });

  it('should render the close button', () => {
    const closeButton = testingUtils.getByCSS('.aca-search-input--close-button');
    expect(closeButton).toBeTruthy();
  });

  it('should render the search button', () => {
    const searchButton = testingUtils.getByCSS('.aca-search-input--search-button');
    expect(searchButton).toBeTruthy();
  });

  describe('onSearchSubmit', () => {
    it('should execute search on submit with valid term', () => {
      component.onSearchSubmit('happy faces only');
      expect(searchExecutionService.execute).toHaveBeenCalledWith('happy faces only');
    });

    it('should not execute search when search term is empty', () => {
      searchFilterService.validateSearchTerm.and.returnValue('SEARCH.ERRORS.EMPTY_QUERY');
      component.onSearchSubmit('');
      expect(searchExecutionService.execute).not.toHaveBeenCalled();
    });

    it('should not execute search when search term is whitespace', () => {
      searchFilterService.validateSearchTerm.and.returnValue('SEARCH.ERRORS.EMPTY_QUERY');
      component.onSearchSubmit('   ');
      expect(searchExecutionService.execute).not.toHaveBeenCalled();
    });

    it('should set error when validation fails', () => {
      searchFilterService.validateSearchTerm.and.returnValue('SEARCH.ERRORS.EMPTY_QUERY');
      component.onSearchSubmit('');
      expect(component.error).toBe('SEARCH.ERRORS.EMPTY_QUERY');
    });

    it('should clear error on valid submission', () => {
      component.error = 'some error';
      component.onSearchSubmit('valid term');
      expect(component.error).toBe('');
    });

    it('should trim whitespace from search term', () => {
      component.onSearchSubmit('  hello  ');
      expect(component.searchedWord).toBe('hello');
      expect(searchExecutionService.execute).toHaveBeenCalledWith('hello');
    });
  });

  describe('onFiltersApplied', () => {
    it('should execute search when searchedWord is set and valid', () => {
      component.searchedWord = 'test';
      component.onFiltersApplied();
      expect(searchExecutionService.execute).toHaveBeenCalledWith('test');
    });

    it('should not execute search when searchedWord is empty', () => {
      component.searchedWord = '';
      component.onFiltersApplied();
      expect(searchExecutionService.execute).not.toHaveBeenCalled();
    });

    it('should not execute search when searchedWord is null', () => {
      component.searchedWord = null;
      component.onFiltersApplied();
      expect(searchExecutionService.execute).not.toHaveBeenCalled();
    });

    it('should not execute search when searchedWord is whitespace', () => {
      component.searchedWord = '   ';
      component.onFiltersApplied();
      expect(searchExecutionService.execute).not.toHaveBeenCalled();
    });

    it('should set error when validation fails', () => {
      component.searchedWord = 'test';
      searchFilterService.validateSearchTerm.and.returnValue('SEARCH.ERRORS.SOME_ERROR');
      component.onFiltersApplied();
      expect(component.error).toBe('SEARCH.ERRORS.SOME_ERROR');
      expect(searchExecutionService.execute).not.toHaveBeenCalled();
    });
  });

  describe('executeSearch', () => {
    it('should reset has400LibraryError flag', () => {
      component.has400LibraryError = true;
      component.searchedWord = 'test';
      component.executeSearch();
      expect(component.has400LibraryError).toBeFalse();
    });

    it('should call searchExecutionService.execute with searchedWord', () => {
      component.searchedWord = 'test query';
      component.executeSearch();
      expect(searchExecutionService.execute).toHaveBeenCalledWith('test query');
    });
  });

  describe('exitSearch', () => {
    it('should call searchNavigationService.navigateBack', () => {
      component.exitSearch();
      expect(searchNavigationService.navigateBack).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call removeContentFilters on destroy', () => {
      component.ngOnDestroy();
      expect(searchFilterService.removeContentFilters).toHaveBeenCalled();
    });
  });

  describe('library400Error handling', () => {
    it('should set has400LibraryError when library400Error emits', () => {
      expect(component.has400LibraryError).toBeFalse();
      library400ErrorSubject.next();
      expect(component.has400LibraryError).toBeTrue();
    });
  });

  describe('route params subscription', () => {
    it('should update searchedWord from query params', () => {
      const encodedQuery = btoa(JSON.stringify({ userQuery: '(cm:name:"hello*")' }));
      queryParamsSubject.next({ q: encodedQuery });
      expect(component.searchedWord).toBeTruthy();
    });

    it('should not update searchedWord when q param is missing', () => {
      component.searchedWord = null;
      queryParamsSubject.next({});
      expect(component.searchedWord).toBeNull();
    });
  });

  describe('queryBuilder configUpdated handling', () => {
    it('should execute search when searchedWord is set and navigation has query params', () => {
      component.searchedWord = 'term';
      routerEventsSubject.next(new NavigationStart(1, '/path?q=term'));
      configUpdatedSubject.next({ id: 'config1' } as SearchConfiguration);

      expect(searchExecutionService.execute).toHaveBeenCalledWith('term');
    });

    it('should NOT execute search when navigation has no query params', () => {
      searchExecutionService.execute.calls.reset();
      component.searchedWord = 'term';
      routerEventsSubject.next(new NavigationStart(1, '/path'));
      configUpdatedSubject.next({} as SearchConfiguration);
      expect(searchExecutionService.execute).not.toHaveBeenCalled();
    });

    it('should NOT execute search when searchedWord is not set', () => {
      searchExecutionService.execute.calls.reset();
      component.searchedWord = null;
      routerEventsSubject.next(new NavigationStart(1, '/path?q=term'));
      configUpdatedSubject.next({} as SearchConfiguration);
      expect(searchExecutionService.execute).not.toHaveBeenCalled();
    });
  });

  describe('initSearchState', () => {
    it('should reset has400LibraryError on init', () => {
      component.has400LibraryError = true;
      component['initSearchState']();
      expect(component.has400LibraryError).toBeFalse();
    });

    it('should call initForLibrariesRoute when on libraries search results', () => {
      Object.defineProperty(searchNavigationService, 'onLibrariesSearchResults', { get: () => true });
      component['initSearchState']();
      expect(searchFilterService.initForLibrariesRoute).toHaveBeenCalled();
    });
  });

  describe('error display', () => {
    it('should show error message when error is set', () => {
      component.error = 'SEARCH.ERRORS.EMPTY_QUERY';
      fixture.detectChanges();
      const errorEl = testingUtils.getByCSS('.app-search-error');
      expect(errorEl).toBeTruthy();
    });

    it('should not show error message when error is empty', () => {
      component.error = '';
      fixture.detectChanges();
      const errorEl = testingUtils.getByCSS('.app-search-error');
      expect(errorEl).toBeFalsy();
    });
  });
});
