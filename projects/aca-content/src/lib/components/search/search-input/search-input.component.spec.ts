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

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { Actions, ofType } from '@ngrx/effects';
import { SearchByTermAction, SearchActionTypes, SnackbarErrorAction, SnackbarActionTypes } from '@alfresco/aca-shared/store';
import { AppHookService } from '@alfresco/aca-shared';
import { map } from 'rxjs/operators';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('SearchInputComponent', () => {
  let fixture: ComponentFixture<SearchInputComponent>;
  let component: SearchInputComponent;
  let actions$: Actions;
  let appHookService: AppHookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [SearchInputComponent],
      providers: [SearchQueryBuilderService],
      schemas: [NO_ERRORS_SCHEMA]
    });

    actions$ = TestBed.inject(Actions);
    fixture = TestBed.createComponent(SearchInputComponent);
    appHookService = TestBed.inject(AppHookService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should change flag on library400Error event', () => {
    spyOn(component, 'isSearchRoute').and.returnValue(true);
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.has400LibraryError).toBe(false);

    appHookService.library400Error.next();

    expect(component.has400LibraryError).toBe(true);
  });

  it('should have no library constraint by default', () => {
    expect(component.hasLibraryConstraint()).toBe(false);
  });

  it('should have library constraint on 400 error received', () => {
    spyOn(component, 'isSearchRoute').and.returnValue(true);
    component.ngOnInit();
    fixture.detectChanges();

    const libItem = component.searchOptions.find((item) => item.key.toLowerCase().indexOf('libraries') > 0);
    libItem.value = true;

    appHookService.library400Error.next();

    expect(component.hasLibraryConstraint()).toBe(true);
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

    it('should show snack for empty search', (done) => {
      const searchedTerm = '';
      actions$
        .pipe(
          ofType<SnackbarErrorAction>(SnackbarActionTypes.Error),
          map((action) => {
            expect(action.payload).toBe('APP.BROWSE.SEARCH.EMPTY_SEARCH');
          })
        )
        .subscribe(() => {
          done();
        });
      component.onSearchSubmit(searchedTerm);
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
});

describe('navigateToSearch()', () => {
  let fixture: ComponentFixture<SearchInputComponent>;
  let component: SearchInputComponent;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, RouterTestingModule],
      declarations: [SearchInputComponent],
      providers: [SearchQueryBuilderService, { provide: Router, useValue: { url: 'test-url', navigate: (_options?: any) => {} } }],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(SearchInputComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to search results component on click of the search icon button', async () => {
    component.ngOnInit();
    const spyNavigate = spyOn(component, 'navigateToSearch').and.callThrough();
    const routerNavigate = spyOn(router, 'navigate');

    fixture.detectChanges();
    await fixture.whenStable();

    const searchIcon = fixture.debugElement.nativeElement.querySelector('.app-search-button');
    searchIcon.click();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(spyNavigate).toHaveBeenCalled();
    expect(routerNavigate).toHaveBeenCalledWith(['/search'], Object({ skipLocationChange: true, replaceUrl: false }));
  });
});
