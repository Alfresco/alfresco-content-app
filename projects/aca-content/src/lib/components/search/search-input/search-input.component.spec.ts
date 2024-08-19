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
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { Actions, ofType } from '@ngrx/effects';
import { SearchByTermAction, SearchActionTypes } from '@alfresco/aca-shared/store';
import { AppHookService, AppService } from '@alfresco/aca-shared';
import { map } from 'rxjs/operators';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { SearchNavigationService } from '../search-navigation.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { NotificationService } from '@alfresco/adf-core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('SearchInputComponent', () => {
  let fixture: ComponentFixture<SearchInputComponent>;
  let component: SearchInputComponent;
  let actions$: Actions;
  let appHookService: AppHookService;
  let searchInputService: SearchNavigationService;
  let showErrorSpy: jasmine.Spy;

  const appServiceMock = {
    appNavNarMode$: new BehaviorSubject('collapsed'),
    setAppNavbarMode: jasmine.createSpy('setAppNavbarMode'),
    toggleAppNavBar$: new Subject()
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
    it('should call search action with correct search options', (done) => {
      const searchedTerm = 's';
      const currentSearchOptions = [{ key: 'SEARCH.INPUT.FILES' }];
      actions$
        .pipe(
          ofType<SearchByTermAction>(SearchActionTypes.SearchByTerm),
          map((action) => {
            expect(action.searchOptions[0].key).toBe(currentSearchOptions[0].key);
          })
        )
        .subscribe(() => {
          done();
        });
      component.onSearchChange(searchedTerm);
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
      component.onSearchChange(searchedTerm);
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
});
