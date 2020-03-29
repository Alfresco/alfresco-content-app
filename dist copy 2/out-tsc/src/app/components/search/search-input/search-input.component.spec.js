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
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { Actions, ofType } from '@ngrx/effects';
import { SearchActionTypes } from '@alfresco/aca-shared/store';
import { map } from 'rxjs/operators';
import { SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { SearchLibrariesQueryBuilderService } from '../search-libraries-results/search-libraries-query-builder.service';
import { ContentManagementService } from '../../../services/content-management.service';
describe('SearchInputComponent', function() {
  var fixture;
  var component;
  var actions$;
  var content;
  beforeEach(async(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [SearchInputComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SearchQueryBuilderService, SearchLibrariesQueryBuilderService]
    })
      .compileComponents()
      .then(function() {
        actions$ = TestBed.get(Actions);
        fixture = TestBed.createComponent(SearchInputComponent);
        content = TestBed.get(ContentManagementService);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));
  it('should change flag on library400Error event', function() {
    expect(component.has400LibraryError).toBe(false);
    content.library400Error.next();
    expect(component.has400LibraryError).toBe(true);
  });
  it('should have no library constraint by default', function() {
    expect(component.hasLibraryConstraint()).toBe(false);
  });
  it('should have library constraint on 400 error received', function() {
    var libItem = component.searchOptions.find(function(item) {
      return item.key.toLowerCase().indexOf('libraries') > 0;
    });
    libItem.value = true;
    content.library400Error.next();
    expect(component.hasLibraryConstraint()).toBe(true);
  });
  describe('onSearchSubmit()', function() {
    it('should call search action with correct search options', fakeAsync(function(
      done
    ) {
      var searchedTerm = 's';
      var currentSearchOptions = [{ key: 'test' }];
      actions$.pipe(
        ofType(SearchActionTypes.SearchByTerm),
        map(function(action) {
          expect(action.searchOptions[0].key).toBe(currentSearchOptions[0].key);
          done();
        })
      );
      component.onSearchSubmit({ target: { value: searchedTerm } });
      tick();
    }));
    it('should call search action with correct searched term', fakeAsync(function(
      done
    ) {
      var searchedTerm = 's';
      actions$.pipe(
        ofType(SearchActionTypes.SearchByTerm),
        map(function(action) {
          expect(action.payload).toBe(searchedTerm);
          done();
        })
      );
      component.onSearchSubmit({ target: { value: searchedTerm } });
      tick();
    }));
  });
  describe('onSearchChange()', function() {
    it('should call search action with correct search options', fakeAsync(function(
      done
    ) {
      var searchedTerm = 's';
      var currentSearchOptions = [{ key: 'test' }];
      actions$.pipe(
        ofType(SearchActionTypes.SearchByTerm),
        map(function(action) {
          expect(action.searchOptions[0].key).toBe(currentSearchOptions[0].key);
          done();
        })
      );
      component.onSearchChange(searchedTerm);
      tick(1000);
    }));
    it('should call search action with correct searched term', fakeAsync(function(
      done
    ) {
      var searchedTerm = 's';
      actions$.pipe(
        ofType(SearchActionTypes.SearchByTerm),
        map(function(action) {
          expect(action.payload).toBe(searchedTerm);
          done();
        })
      );
      component.onSearchChange(searchedTerm);
      tick(1000);
    }));
  });
  describe('isLibrariesChecked()', function() {
    it('should return false by default', function() {
      expect(component.isLibrariesChecked()).toBe(false);
    });
    it('should return true when libraries checked', function() {
      var libItem = component.searchOptions.find(function(item) {
        return item.key.toLowerCase().indexOf('libraries') > 0;
      });
      libItem.value = true;
      expect(component.isLibrariesChecked()).toBe(true);
    });
  });
  describe('isContentChecked()', function() {
    it('should return false by default', function() {
      expect(component.isContentChecked()).toBe(false);
    });
    it('should return true when files checked', function() {
      var filesItem = component.searchOptions.find(function(item) {
        return item.key.toLowerCase().indexOf('files') > 0;
      });
      filesItem.value = true;
      expect(component.isContentChecked()).toBe(true);
    });
    it('should return true when folders checked', function() {
      var foldersItem = component.searchOptions.find(function(item) {
        return item.key.toLowerCase().indexOf('folders') > 0;
      });
      foldersItem.value = true;
      expect(component.isContentChecked()).toBe(true);
    });
    it('should return true when both files and folders checked', function() {
      var filesItem = component.searchOptions.find(function(item) {
        return item.key.toLowerCase().indexOf('files') > 0;
      });
      filesItem.value = true;
      var foldersItem = component.searchOptions.find(function(item) {
        return item.key.toLowerCase().indexOf('folders') > 0;
      });
      foldersItem.value = true;
      expect(component.isContentChecked()).toBe(true);
    });
  });
});
//# sourceMappingURL=search-input.component.spec.js.map
