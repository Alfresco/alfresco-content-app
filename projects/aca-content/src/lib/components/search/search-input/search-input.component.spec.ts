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

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { Actions, ofType } from '@ngrx/effects';
import { SearchActionTypes, SearchByTermAction, SearchOptionIds } from '@alfresco/aca-shared/store';
import { AppHookService, AppService } from '@alfresco/aca-shared';
import { map } from 'rxjs/operators';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { SearchNavigationService } from '../search-navigation.service';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { NotificationService } from '@alfresco/adf-core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Buffer } from 'buffer';
import { ActivatedRoute } from '@angular/router';

describe('SearchInputComponent', () => {
  let fixture: ComponentFixture<SearchInputComponent>;
  let component: SearchInputComponent;
  let actions$: Actions;
  let appHookService: AppHookService;
  let route: ActivatedRoute;
  let searchInputService: SearchNavigationService;
  let showErrorSpy: jasmine.Spy;

  const appServiceMock = {
    appNavNarMode$: new BehaviorSubject('collapsed'),
    setAppNavbarMode: jasmine.createSpy('setAppNavbarMode'),
    toggleAppNavBar$: new Subject()
  };

  const encodeQuery = (query: any): string => {
    return Buffer.from(JSON.stringify(query)).toString('base64');
  };

  beforeEach(() => {
    appServiceMock.setAppNavbarMode.calls.reset();
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SearchInputComponent, MatSnackBarModule],
      providers: [
        {
          provide: AppService,
          useValue: appServiceMock
        },
        SearchQueryBuilderService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    actions$ = TestBed.inject(Actions);
    fixture = TestBed.createComponent(SearchInputComponent);
    appHookService = TestBed.inject(AppHookService);
    searchInputService = TestBed.inject(SearchNavigationService);
    route = TestBed.inject(ActivatedRoute);
    component = fixture.componentInstance;

    const notificationService = TestBed.inject(NotificationService);
    showErrorSpy = spyOn(notificationService, 'showError');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should collapsed sidenav by default', () => {
    component.ngOnInit();

    expect(appServiceMock.setAppNavbarMode).toHaveBeenCalledWith('collapsed');
  });

  it('should change flag on library400Error event', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.has400LibraryError).toBe(false);

    appHookService.library400Error.next();

    expect(component.has400LibraryError).toBe(true);
  });

  it('should have no library constraint by default', () => {
    expect(component.evaluateLibrariesConstraint()).toBe(false);
  });

  it('should have library constraint on 400 error received', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const libItem = component.searchOptions.find((item) => item.key.toLowerCase().indexOf('libraries') > 0);
    libItem.value = true;

    appHookService.library400Error.next();

    expect(component.evaluateLibrariesConstraint()).toBe(true);
  });

  describe('onSearchSubmit()', () => {
    it('should call search action with correct search options', (done) => {
      const searchedTerm = 's';
      component.searchedWord = 'te';
      actions$
        .pipe(
          ofType<SearchByTermAction>(SearchActionTypes.SearchByTerm),
          map((action) => {
            expect(action.searchOptions[0].key).toBe('SEARCH.INPUT.FILES');
          })
        )
        .subscribe(() => {
          done();
        });
      component.onSearchSubmit({ target: { value: searchedTerm } });
      fixture.detectChanges();
    });

    it('should call search action with correct searched term', (done) => {
      const searchedTerm = 's';
      actions$
        .pipe(
          ofType<SearchByTermAction>(SearchActionTypes.SearchByTerm),
          map((action) => {
            expect(action.payload).toBe(searchedTerm);
          })
        )
        .subscribe(() => {
          done();
        });
      component.onSearchSubmit({ target: { value: searchedTerm } });
      fixture.detectChanges();
    });
  });

  describe('onSearchChange()', () => {
    it('should call search action with correct searched term', () => {
      const searchedTerm = 's';
      component.onSearchChange(searchedTerm);
      expect(component.searchedWord).toBe(searchedTerm);
    });

    it('should show snack for empty search', () => {
      component.onSearchSubmit('');
      expect(showErrorSpy).toHaveBeenCalled();
    });
  });

  describe('isLibrariesChecked()', () => {
    it('should return false by default', () => {
      expect(component.isLibrariesChecked()).toBe(false);
    });

    it('should return true when libraries checked', () => {
      const libItem = component.searchOptions.find((item) => item.key.toLowerCase().indexOf('libraries') > 0);
      libItem.value = true;
      expect(component.isLibrariesChecked()).toBe(true);
    });
  });

  describe('isContentChecked()', () => {
    it('should return false by default', () => {
      expect(component.isContentChecked()).toBe(false);
    });

    it('should return true when files checked', () => {
      const filesItem = component.searchOptions.find((item) => item.key.toLowerCase().indexOf('files') > 0);
      filesItem.value = true;
      expect(component.isContentChecked()).toBe(true);
    });

    it('should return true when folders checked', () => {
      const foldersItem = component.searchOptions.find((item) => item.key.toLowerCase().indexOf('folders') > 0);
      foldersItem.value = true;
      expect(component.isContentChecked()).toBe(true);
    });

    it('should return true when both files and folders checked', () => {
      const filesItem = component.searchOptions.find((item) => item.key.toLowerCase().indexOf('files') > 0);
      filesItem.value = true;
      const foldersItem = component.searchOptions.find((item) => item.key.toLowerCase().indexOf('folders') > 0);
      foldersItem.value = true;
      expect(component.isContentChecked()).toBe(true);
    });
  });

  describe('exitSearch()', () => {
    it('should exit search on click of close icon', async () => {
      spyOn(component, 'exitSearch').and.callThrough();
      spyOn(searchInputService, 'navigateBack').and.callThrough();

      fixture.detectChanges();
      await fixture.whenStable();

      const closeIcon = fixture.debugElement.nativeElement.querySelector('.aca-search-input--close-button');
      closeIcon.click();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.exitSearch).toHaveBeenCalled();
      expect(searchInputService.navigateBack).toHaveBeenCalledWith();
    });
  });

  it('should sidenav expanded after the component is destroy', () => {
    component.ngOnDestroy();

    expect(appServiceMock.setAppNavbarMode).toHaveBeenCalledWith('expanded');
  });

  it('should extract searched word from query params', (done) => {
    route.queryParams = of({ q: encodeQuery({ userQuery: 'cm:name:"test*"' }) });
    route.queryParams.subscribe(() => {
      fixture.detectChanges();
      expect(component.searchedWord).toBe('test');
      done();
    });
    fixture.detectChanges();
  });

  describe('searchByOption()', () => {
    let isLibrariesCheckedSpy: jasmine.Spy;
    let isFoldersCheckedSpy: jasmine.Spy;
    let isFilesCheckedSpy: jasmine.Spy;
    let evaluateLibrariesConstraintSpy: jasmine.Spy;
    let syncInputValuesSpy: jasmine.Spy;
    let isSameSearchTermSpy: jasmine.Spy;
    let queryBuilderUpdateSpy: jasmine.Spy;
    let queryLibrariesBuilderUpdateSpy: jasmine.Spy;
    let storeDispatchSpy: jasmine.Spy;

    beforeEach(() => {
      isLibrariesCheckedSpy = spyOn(component, 'isLibrariesChecked').and.returnValue(false);
      isFoldersCheckedSpy = spyOn(component, 'isFoldersChecked').and.returnValue(false);
      isFilesCheckedSpy = spyOn(component, 'isFilesChecked').and.returnValue(false);
      evaluateLibrariesConstraintSpy = spyOn(component, 'evaluateLibrariesConstraint').and.returnValue(false);
      syncInputValuesSpy = spyOn(component, 'syncInputValues').and.callThrough();
      isSameSearchTermSpy = spyOn(component, 'isSameSearchTerm').and.returnValue(false);

      queryBuilderUpdateSpy = spyOn(component['queryBuilder'], 'update');
      queryLibrariesBuilderUpdateSpy = spyOn(component['queryLibrariesBuilder'], 'update');
      storeDispatchSpy = spyOn(component['store'], 'dispatch');
    });

    it('should sync input values and reset has400LibraryError', () => {
      component.has400LibraryError = true;

      component.searchByOption();

      expect(syncInputValuesSpy).toHaveBeenCalled();
      expect(component.has400LibraryError).toBeFalse();
    });

    it('should evaluate libraries constraint when libraries are checked', () => {
      isLibrariesCheckedSpy.and.returnValue(true);

      component.searchByOption();

      expect(evaluateLibrariesConstraintSpy).toHaveBeenCalled();
      expect(component.hasLibrariesConstraint).toBeFalse();
    });

    it('should set hasLibrariesConstraint based on evaluateLibrariesConstraint result', () => {
      isLibrariesCheckedSpy.and.returnValue(true);
      evaluateLibrariesConstraintSpy.and.returnValue(true);

      component.searchByOption();

      expect(component.hasLibrariesConstraint).toBeTrue();
    });

    it('should update queryLibrariesBuilder when libraries are checked, onLibrariesSearchResults is true, and search term changed', () => {
      isLibrariesCheckedSpy.and.returnValue(true);
      spyOnProperty(component, 'onLibrariesSearchResults', 'get').and.returnValue(true);
      isSameSearchTermSpy.and.returnValue(false);

      component.searchedWord = 'test';

      component.searchByOption();

      expect(queryLibrariesBuilderUpdateSpy).toHaveBeenCalled();
      expect(storeDispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch SearchByTermAction when libraries are checked, onLibrariesSearchResults is false, and searchedWord is set', () => {
      isLibrariesCheckedSpy.and.returnValue(true);
      spyOnProperty(component, 'onLibrariesSearchResults', 'get').and.returnValue(false);

      component.searchedWord = 'test';

      component.searchByOption();

      expect(storeDispatchSpy).toHaveBeenCalledWith(new SearchByTermAction('test', component.searchOptions));
      expect(queryLibrariesBuilderUpdateSpy).not.toHaveBeenCalled();
    });

    it('should dispatch SearchByTermAction when libraries are checked, onLibrariesSearchResults is true, search term same, and searchedWord is set', () => {
      isLibrariesCheckedSpy.and.returnValue(true);
      spyOnProperty(component, 'onLibrariesSearchResults', 'get').and.returnValue(true);
      isSameSearchTermSpy.and.returnValue(true);

      component.searchedWord = 'test';

      component.searchByOption();

      expect(storeDispatchSpy).toHaveBeenCalledWith(new SearchByTermAction('test', component.searchOptions));
      expect(queryLibrariesBuilderUpdateSpy).not.toHaveBeenCalled();
    });

    it('should add folder filter when only folders are checked', () => {
      isLibrariesCheckedSpy.and.returnValue(false);
      isFoldersCheckedSpy.and.returnValue(true);
      isFilesCheckedSpy.and.returnValue(false);

      spyOn(component['queryBuilder'], 'addFilterQuery').and.callThrough();
      spyOn(component['queryBuilder'], 'removeFilterQuery').and.callThrough();

      component.searchedWord = 'test';

      component.searchByOption();

      expect(component['queryBuilder'].addFilterQuery).toHaveBeenCalledWith(`+TYPE:'cm:${SearchOptionIds.Folders}'`);
      expect(component['queryBuilder'].removeFilterQuery).toHaveBeenCalledWith(`+TYPE:'cm:${SearchOptionIds.Files}'`);
    });

    it('should add file filter when only files are checked', () => {
      isLibrariesCheckedSpy.and.returnValue(false);
      isFoldersCheckedSpy.and.returnValue(false);
      isFilesCheckedSpy.and.returnValue(true);

      spyOn(component['queryBuilder'], 'addFilterQuery').and.callThrough();
      spyOn(component['queryBuilder'], 'removeFilterQuery').and.callThrough();

      component.searchedWord = 'test';

      component.searchByOption();

      expect(component['queryBuilder'].addFilterQuery).toHaveBeenCalledWith(`+TYPE:'cm:${SearchOptionIds.Files}'`);
      expect(component['queryBuilder'].removeFilterQuery).toHaveBeenCalledWith(`+TYPE:'cm:${SearchOptionIds.Folders}'`);
    });

    it('should remove content filters when both files and folders are checked', () => {
      isLibrariesCheckedSpy.and.returnValue(false);
      isFoldersCheckedSpy.and.returnValue(true);
      isFilesCheckedSpy.and.returnValue(true);

      spyOn(component['queryBuilder'], 'removeFilterQuery').and.callThrough();

      component.searchedWord = 'test';

      component.searchByOption();

      expect(component['queryBuilder'].removeFilterQuery).toHaveBeenCalledWith(`+TYPE:'cm:${SearchOptionIds.Files}'`);
      expect(component['queryBuilder'].removeFilterQuery).toHaveBeenCalledWith(`+TYPE:'cm:${SearchOptionIds.Folders}'`);
    });

    it('should remove content filters when neither files nor folders are checked', () => {
      isLibrariesCheckedSpy.and.returnValue(false);
      isFoldersCheckedSpy.and.returnValue(false);
      isFilesCheckedSpy.and.returnValue(false);

      spyOn(component['queryBuilder'], 'removeFilterQuery').and.callThrough();

      component.searchedWord = 'test';

      component.searchByOption();

      expect(component['queryBuilder'].removeFilterQuery).toHaveBeenCalledWith(`+TYPE:'cm:${SearchOptionIds.Files}'`);
      expect(component['queryBuilder'].removeFilterQuery).toHaveBeenCalledWith(`+TYPE:'cm:${SearchOptionIds.Folders}'`);
    });

    it('should update queryBuilder when onSearchResults is true and search term changed', () => {
      isLibrariesCheckedSpy.and.returnValue(false);
      spyOnProperty(component, 'onSearchResults', 'get').and.returnValue(true);
      isSameSearchTermSpy.and.returnValue(false);

      component.searchedWord = 'test';

      component.searchByOption();

      expect(queryBuilderUpdateSpy).toHaveBeenCalled();
      expect(storeDispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch SearchByTermAction when onSearchResults is false and searchedWord is set', () => {
      isLibrariesCheckedSpy.and.returnValue(false);
      spyOnProperty(component, 'onSearchResults', 'get').and.returnValue(false);

      component.searchedWord = 'test';

      component.searchByOption();

      expect(storeDispatchSpy).toHaveBeenCalledWith(new SearchByTermAction('test', component.searchOptions));
      expect(queryBuilderUpdateSpy).not.toHaveBeenCalled();
    });

    it('should dispatch SearchByTermAction when onSearchResults is true, search term same, and searchedWord is set', () => {
      isLibrariesCheckedSpy.and.returnValue(false);
      spyOnProperty(component, 'onSearchResults', 'get').and.returnValue(true);
      isSameSearchTermSpy.and.returnValue(true);

      component.searchedWord = 'test';

      component.searchByOption();

      expect(storeDispatchSpy).toHaveBeenCalledWith(new SearchByTermAction('test', component.searchOptions));
      expect(queryBuilderUpdateSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch or update if searchedWord is not set', () => {
      isLibrariesCheckedSpy.and.returnValue(true);
      component.searchedWord = '';

      component.searchByOption();

      expect(storeDispatchSpy).not.toHaveBeenCalled();
      expect(queryLibrariesBuilderUpdateSpy).not.toHaveBeenCalled();
      expect(queryBuilderUpdateSpy).not.toHaveBeenCalled();
    });
  });
});
